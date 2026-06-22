import hashlib
import re
from pathlib import Path
from urllib.parse import urlparse

import html2text
import requests
from bs4 import BeautifulSoup


POSTS_DIR = Path("public/posts")
IMAGES_DIR = Path("public/images/posts")
SOURCE_RE = re.compile(r"\[원문 보기\]\((https?://(?:m\.)?blog\.naver\.com/[^)]+)\)")
NAVER_ID_RE = re.compile(r"blog\.naver\.com/([^/?#]+)/(\d+)")

# Keep this intentionally conservative. Older imports sometimes treated normal
# bold paragraphs as headings, so restoring every "empty-looking" section can
# duplicate prose. These are confirmed sections that were rendered as a heading
# followed only by a horizontal rule or the next heading.
ALLOWED_SECTIONS = {
    "android-studio-설치-후-휴대폰-삼성-인식-안-될-때-해결법.md": {
        "🧩 요약표",
    },
    "ansible-정리.md": {
        "🧩 2. Ansible 구성요소",
        "📘 11. 인벤토리 패턴 (Pattern)",
        "⚙️ 12. 실행 전략 (Strategy)",
        "🏁 마무리 요약",
    },
    "apache-kafka-완벽-가이드-데이터-파이프라인부터-실무-활용까지.md": {
        "💬 실무 핵심 포인트 (면접/프로젝트 대비)",
        "🧠 핵심 정리",
    },
    "cat-api-예제-10선.md": {
        "📍 _cat 명령어에서 자주 쓰는 옵션",
        "✅ 마무리 요약",
    },
    "elasticsearch-완벽-정리-rdbms-비교-핵심-개념-모니터링.md": {
        "📘 Elasticsearch vs RDBMS 비교",
        "⚙️ 노드(Node) 역할",
        "⚠️ 1. 알람(Threshold) 기반 주요 지표",
        "🔍 2. 원인 분석용 지표",
        "✅ 마무리 요약",
    },
    "github-actions로-네이버-블로그-rss-자동-동기화-시스템-만들기.md": {
        "🧰 환경 변수 / 시크릿",
    },
    "rabbitmq-완벽-가이드-메시지-큐부터-실무-구현까지.md": {
        "6단계: Controller 클래스",
    },
    "vim-편집기에서-파일-전체-삭제하는-방법-정리.md": {
        "⭐ 핵심 요약",
    },
    "데몬-daemon-vs-agentless-왜-ansible-은-서버에-데몬이-필요-없을까.md": {
        "📊 Agent 기반 vs Ansible 방식 — 비교 요약",
    },
    "자바-java-에러-로그-정리.md": {
        "🧭 요약 표",
    },
}


converter = html2text.HTML2Text()
converter.ignore_links = False
converter.ignore_images = False
converter.body_width = 0
converter.single_line_break = False
converter.protect_links = True
converter.mark_code = False
converter.unicode_snob = True
converter.skip_internal_links = False
converter.escape_snob = False


def clean_text(value: str) -> str:
    return re.sub(r"[\u200b\ufeff]", "", value or "").strip()


def heading_text(line: str) -> str | None:
    text = clean_text(line)
    if re.match(r"^#\s+", text):
        return None
    match = re.match(r"^#{2,6}\s+(.+)$", text)
    if match:
        return clean_text(match.group(1))
    match = re.match(r"^\*\*(.+?)\*\*$", text)
    if match:
        return clean_text(match.group(1))
    return None


def normalize_heading(value: str) -> str:
    value = re.sub(r"\\([.()[\]{}#+\-_*`>])", r"\1", value or "")
    value = value.replace("*", "")
    value = re.sub(r"\s+", " ", clean_text(value))
    return value.casefold()


def is_blank(line: str) -> bool:
    return clean_text(line) in ("", "**")


def is_rule(line: str) -> bool:
    return bool(re.match(r"^-{3,}$", clean_text(line)))


def is_empty_section(lines: list[str], index: int) -> tuple[int, str] | None:
    heading = heading_text(lines[index])
    if not heading:
        return None

    cursor = index + 1
    while cursor < len(lines) and is_blank(lines[cursor]):
        cursor += 1

    if cursor >= len(lines) or not is_rule(lines[cursor]):
        return None

    cursor += 1
    while cursor < len(lines) and is_blank(lines[cursor]):
        cursor += 1

    if cursor >= len(lines):
        return cursor, ""

    next_line = clean_text(lines[cursor])
    next_heading = heading_text(next_line)
    if next_heading or next_line.startswith(">") or next_line.startswith("[원문 보기]"):
        return cursor, next_line

    return None


def naver_mobile_url(source_url: str) -> str | None:
    match = NAVER_ID_RE.search(source_url)
    if not match:
        return None
    blog_id, log_no = match.groups()
    return f"https://m.blog.naver.com/{blog_id}/{log_no}"


def markdown_table(rows: list[list[str]]) -> str:
    if not rows:
        return ""
    width = max(len(row) for row in rows)
    padded = [row + [""] * (width - len(row)) for row in rows]

    if width == 1:
        only_cell = clean_text(padded[0][0])
        if re.search(r"\b(public|class|return|@PostMapping|@RestController)\b", only_cell):
            return f"```java\n{only_cell}\n```"

    def esc(cell: str) -> str:
        cell = re.sub(r"\s+", " ", clean_text(cell))
        return cell.replace("\\", "\\\\").replace("|", "\\|")

    header = "| " + " | ".join(esc(cell) for cell in padded[0]) + " |"
    divider = "| " + " | ".join("---" for _ in range(width)) + " |"
    body = ["| " + " | ".join(esc(cell) for cell in row) + " |" for row in padded[1:]]
    return "\n".join([header, divider, *body])


def normalize_naver_image_url(url: str) -> str:
    if not url:
        return url
    url = re.sub(r"\?type=w\d+(_blur)?", "", url)
    url = re.sub(r"&type=w\d+(_blur)?", "", url)
    return url


def download_image(url: str, slug: str, index: int) -> str:
    url = normalize_naver_image_url(url)
    suffix = Path(urlparse(url).path).suffix.lower()
    if suffix not in (".png", ".jpg", ".jpeg", ".gif", ".webp"):
        suffix = ".png"
    digest = hashlib.md5(url.encode("utf-8")).hexdigest()[:8]
    filename = f"{slug}-restore-{index:02d}-{digest}{suffix}"
    target = IMAGES_DIR / filename
    if not target.exists():
        response = requests.get(
            url,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Referer": "https://m.blog.naver.com/",
            },
            timeout=20,
        )
        response.raise_for_status()
        target.write_bytes(response.content)
    return f"/images/posts/{filename}"


def fetch_original_markdown(source_url: str, slug: str) -> str:
    mobile_url = naver_mobile_url(source_url)
    if not mobile_url:
        raise ValueError(f"Unsupported Naver URL: {source_url}")

    response = requests.get(
        mobile_url,
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"},
        timeout=30,
    )
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")
    container = soup.select_one("div.se-main-container") or soup.select_one("div.se_component_wrap")
    if not container:
        raise ValueError(f"본문 컨테이너를 찾지 못했습니다: {mobile_url}")

    placeholders: dict[str, str] = {}

    for index, table in enumerate(container.find_all("table")):
        rows = []
        for tr in table.find_all("tr"):
            row = [cell.get_text(" ", strip=True) for cell in tr.find_all(["td", "th"])]
            if row:
                rows.append(row)
        key = f"RESTORE_TABLE_{index}"
        placeholders[key] = f"\n\n{markdown_table(rows)}\n\n"
        table.replace_with(key)

    for index, code in enumerate(container.select("div.se-module-code, pre")):
        text = code.get_text("\n", strip=True)
        if not text:
            continue
        key = f"RESTORE_CODE_{index}"
        placeholders[key] = f"\n\n```\n{text}\n```\n\n"
        code.replace_with(key)

    image_index = 0
    for img in container.find_all("img"):
        src = img.get("data-src") or img.get("src") or ""
        if not src or ("pstatic.net" not in src and "blogfiles.naver" not in src):
            continue
        try:
            img["src"] = download_image(src, slug, image_index)
            image_index += 1
        except Exception as exc:
            print(f"[WARN] image skipped: {src[:80]} ({exc})")

    for br in container.find_all("br"):
        br.replace_with("\n")

    markdown = converter.handle(str(container))
    for key, value in placeholders.items():
        markdown = markdown.replace(key, value)
    markdown = re.sub(r"\n{4,}", "\n\n", markdown)
    return markdown.strip()


def extract_section(markdown: str, heading: str) -> str:
    lines = markdown.splitlines()
    target = normalize_heading(heading)

    start = None
    for index, line in enumerate(lines):
        current = heading_text(line)
        if current and normalize_heading(current) == target:
            start = index
            break

    if start is None:
        return ""

    cursor = start + 1
    while cursor < len(lines) and is_blank(lines[cursor]):
        cursor += 1

    end = cursor
    while end < len(lines):
        current_line = clean_text(lines[end])
        current = heading_text(lines[end])
        if current and end > cursor:
            break
        if current_line.startswith("[원문 보기]") or current_line.startswith(">"):
            break
        if end > cursor and current_line in ("---", "* * *"):
            break
        end += 1

    fragment = "\n".join(lines[cursor:end]).strip()
    fragment = re.sub(r"\n{3,}", "\n\n", fragment)
    if not fragment or is_rule(fragment):
        return ""
    return fragment


def restore_file(path: Path) -> bool:
    allowed = {normalize_heading(item) for item in ALLOWED_SECTIONS.get(path.name, set())}
    if not allowed:
        return False

    text = path.read_text(encoding="utf-8")
    match = SOURCE_RE.search(text)
    if not match:
        return False

    lines = text.splitlines()
    candidates = []
    for index in range(len(lines)):
        result = is_empty_section(lines, index)
        heading = heading_text(lines[index]) or ""
        if result and normalize_heading(heading) in allowed:
            candidates.append((index, result[0], heading))

    if not candidates:
        return False

    original_markdown = fetch_original_markdown(match.group(1), path.stem)
    replacements: dict[str, str] = {}
    for _, _, heading in candidates:
        fragment = extract_section(original_markdown, heading)
        if fragment:
            replacements[heading] = fragment

    if not replacements:
        return False

    output: list[str] = []
    index = 0
    changed = False
    while index < len(lines):
        result = is_empty_section(lines, index)
        heading = heading_text(lines[index]) if result else None
        if result and heading in replacements:
            end_index, _ = result
            output.append(lines[index])
            output.append("")
            output.extend(replacements[heading].splitlines())
            output.append("")
            index = end_index
            changed = True
            continue
        output.append(lines[index])
        index += 1

    if changed:
        next_text = "\n".join(output).rstrip() + "\n"
        path.write_text(next_text, encoding="utf-8")
        print(f"[OK] restored {path.name}: {', '.join(replacements)}")
    return changed


def main() -> None:
    changed = 0
    for path in sorted(POSTS_DIR.glob("*.md")):
        if restore_file(path):
            changed += 1
    print(f"[DONE] changed_files={changed}")


if __name__ == "__main__":
    main()
