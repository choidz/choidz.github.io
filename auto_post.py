import json
import os
import re
import subprocess
from datetime import datetime
from pathlib import Path
import requests
import feedparser
import html2text
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()

NAVER_RSS_URL = os.getenv("NAVER_RSS_URL")
POSTS_DIR = Path("public/posts")
MANIFEST_PATH = POSTS_DIR / "index.json"
GIT_USER_NAME = os.getenv("GIT_USER_NAME")
GIT_USER_EMAIL = os.getenv("GIT_USER_EMAIL")

if not NAVER_RSS_URL:
    print("❌ NAVER_RSS_URL 환경 변수가 없습니다.")
    exit(1)

# ✅ html2text 기본 설정
converter = html2text.HTML2Text()
converter.ignore_links = False
converter.ignore_images = False
converter.body_width = 0
converter.single_line_break = False
converter.protect_links = True
converter.mark_code = False
converter.unicode_snob = True
converter.skip_internal_links = False
converter.escape_snob = False  # 중요: --- 방지

slug_pattern = re.compile(r"[^a-z0-9]+")
whitespace_re = re.compile(r"\s+")

POSTS_DIR.mkdir(parents=True, exist_ok=True)

existing_manifest = []
if MANIFEST_PATH.exists():
    try:
        existing_manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        existing_manifest = []

posts_by_slug = {item["slug"]: item for item in existing_manifest if "slug" in item}
updated = False


def fetch_full_naver_post(link: str):
    # 블로그 ID, 글번호 추출
    m = re.search(r"blog.naver.com/([^/]+)/(\d+)", link)
    if not m:
        print(f"❌ 링크 파싱 실패: {link}")
        return "", []
    blog_id, log_no = m.groups()

    mobile_url = f"https://m.blog.naver.com/{blog_id}/{log_no}"
    headers = {"User-Agent": "Mozilla/5.0"}
    res = requests.get(mobile_url, headers=headers, timeout=10)
    res.raise_for_status()
    soup = BeautifulSoup(res.text, "html.parser")

    # ✅ 본문 추출
    container = soup.select_one("div.se-main-container") or soup.select_one("div.se_component_wrap")

    # ✅ __NEXT_DATA__ 내부 JSON에서 태그 추출
    script_tag = soup.find("script", id="__NEXT_DATA__")
    tags = []
    if script_tag and script_tag.string:
        try:
            data = json.loads(script_tag.string)
            # 구조: props.pageProps.postInfo.tags (2025년 현재)
            tags_data = (
                data.get("props", {})
                    .get("pageProps", {})
                    .get("postInfo", {})
                    .get("tags", [])
            )
            for tag_item in tags_data:
                tag_text = tag_item.get("tagName") or tag_item.get("name") or ""
                if tag_text:
                    if not tag_text.startswith("#"):
                        tag_text = f"#{tag_text}"
                    tags.append(tag_text)
        except Exception as e:
            print(f"⚠️ JSON 파싱 실패: {e}")

    print(f"✅ {mobile_url} → 태그: {tags}")
    return (str(container) if container else ""), tags


# ✅ 표 셀 이스케이프
def escape_md_table_cell(text: str) -> str:
    if not text:
        return ""
    text = text.replace("\\", "\\\\")
    text = text.replace("|", "\\|")
    text = re.sub(r"\s+", " ", text).strip()
    return text


# ✅ 표 정렬 함수
def format_markdown_table(rows: list[list[str]]) -> str:
    col_count = max(len(r) for r in rows)
    col_widths = [0] * col_count
    for r in rows:
        for i, c in enumerate(r):
            col_widths[i] = max(col_widths[i], len(c))

    def fmt_row(cells):
        return "| " + " | ".join(c.ljust(col_widths[i]) for i, c in enumerate(cells)) + " |"

    header = fmt_row(rows[0])
    divider = "| " + " | ".join("-" * col_widths[i] for i in range(col_count)) + " |"
    body = [fmt_row(r) for r in rows[1:]]
    return "\n".join([header, divider] + body)

# ✅ HTML 정제 및 요약 추출
def sanitize_html(html: str) -> tuple[str, str, list[str], list[str]]:
    soup = BeautifulSoup(html or "", "html.parser")
    tables = []
    code_blocks = []

    def normalize_img_url(url: str) -> str:
        if not url:
            return url
        url = re.sub(r"([?&])type=w80_blur", r"\1type=w800", url)
        url = re.sub(r"([?&])type=w80(\\b|&)", r"\1type=w800\2", url)
        return url

    def has_class_fragment(tag, keyword):
        classes = tag.get("class") or []
        return any(keyword in cls for cls in classes)

    # ✅ 네이버 se-table 구조를 실제 table 태그로 변환
    for se_table in soup.find_all(
        lambda tag: tag.name == "div" and has_class_fragment(tag, "se-table")
    ):
        rows = []
        row_divs = se_table.select("div.se-table-row")
        for row_div in row_divs:
            cols = []
            for col_div in row_div.select("div.se-table-col"):
                text = col_div.get_text(" ", strip=True)
                text = text.replace("`", "")
                text = escape_md_table_cell(text)
                cols.append(text)
            if cols:
                rows.append(cols)

        if rows:
            table_tag = soup.new_tag("table")
            for row_index, row_cols in enumerate(rows):
                tr_tag = soup.new_tag("tr")
                for col_text in row_cols:
                    cell_tag = "th" if row_index == 0 else "td"
                    cell = soup.new_tag(cell_tag)
                    cell.string = col_text
                    tr_tag.append(cell)
                table_tag.append(tr_tag)
            se_table.replace_with(table_tag)
        else:
            se_table.decompose()

    # ✅ 코드 블록 추출 (네이버 블로그 스타일)
    # se-module-code를 먼저 찾아서 처리 (상위 컨테이너)
    code_modules = soup.find_all("div", class_="se-module-code")
    for code_module in code_modules:
        # 내부의 실제 코드 소스 찾기
        code_source = code_module.find("div", class_="se-code-source")
        if code_source:
            # __se_code_view 내부의 텍스트 추출
            code_view = code_source.find("div", class_=lambda x: x and "__se_code_view" in " ".join(x) if isinstance(x, list) else x and "__se_code_view" in x)
            code_text = code_view.get_text() if code_view else code_source.get_text()
        else:
            code_text = code_module.get_text()

        # 빈 코드 블록은 제거
        if not code_text.strip():
            code_module.decompose()
            continue

        code_blocks.append(code_text.strip())
        # 코드 블록을 플레이스홀더로 교체
        code_module.replace_with(f"\n\n§§CODE{len(code_blocks)-1}§§\n\n")

    # ✅ 일반 pre, code 태그도 처리 (중복 제거)
    for pre_tag in soup.find_all("pre"):
        code_text = pre_tag.get_text()
        if code_text.strip():
            code_blocks.append(code_text.strip())
            pre_tag.replace_with(f"\n\n§§CODE{len(code_blocks)-1}§§\n\n")

    # ✅ 이미지 원본/고해상도 링크 사용 + 불필요한 래퍼 제거
    for img in soup.find_all("img"):
        for attr in ("data-src", "data-lazy-src", "data-original", "data-actualsrc", "data-image-src"):
            candidate = img.get(attr)
            if candidate:
                img["src"] = candidate
                break
        if img.get("src"):
            img["src"] = normalize_img_url(img["src"])
        for attr in ("width", "height", "style"):
            if attr in img.attrs:
                del img[attr]

    for a in soup.find_all("a"):
        href = (a.get("href") or "").strip()
        if href in ("", "#", "<#>"):
            img = a.find("img")
            if img and len(a.contents) == 1:
                a.replace_with(img)

    # ✅ 표 추출 (그대로 유지)
    for idx, table in enumerate(soup.find_all("table")):
        rows = []
        for tr in table.find_all("tr"):
            cols = []
            for td in tr.find_all(["td", "th"]):
                text = td.get_text(" ", strip=True)
                text = text.replace("`", "")
                text = escape_md_table_cell(text)
                cols.append(text)
            if cols:
                rows.append(cols)
        if rows:
            md_table = format_markdown_table(rows)
            tables.append(md_table)
            table.replace_with(f"§§TABLE{idx}§§")
        else:
            table.decompose()

    # ✅ <hr> 태그 → html2text가 건드리지 못하도록 플레이스홀더로 변경
    for idx, hr in enumerate(soup.find_all("hr")):
        hr.replace_with(f"§§HR{idx}§§")

    # ✅ <br> → 줄바꿈
    for br in soup.find_all("br"):
        br.replace_with("\n")

    text_preview = soup.get_text(separator=" ").strip()
    return str(soup), text_preview, tables, code_blocks


# ✅ HTML → Markdown 변환
def html_to_markdown(html: str, tables: list[str], code_blocks: list[str]) -> str:
    md_text = converter.handle(html)

    # ✅ hr 복원 (무조건 줄바꿈 포함)
    md_text = re.sub(r"\s*§§HR(\d+)§§\s*", r"\n\n---\n\n", md_text)

    # ✅ 표 복원
    for idx, table_md in enumerate(tables):
        md_text = md_text.replace(f"§§TABLE{idx}§§", f"\n\n{table_md}\n\n")

    # ✅ 코드 블록 복원 (마크다운 코드 블록 형식으로)
    for idx, code_text in enumerate(code_blocks):
        # 코드 블록을 ```로 감싸기
        code_md = f"```\n{code_text.strip()}\n```"
        md_text = md_text.replace(f"§§CODE{idx}§§", code_md)

    # ✅ 여분의 개행 정리 (4줄 이상만 압축)
    md_text = re.sub(r"\n{4,}", "\n\n", md_text).strip()
    return md_text


# ✅ RSS 순회
for entry in feedparser.parse(NAVER_RSS_URL).entries:
    title = (entry.title or "").strip()
    slug = (
        slug_pattern.sub("-", title.lower()).strip("-")
        or datetime.now().strftime("post-%Y%m%d-%H%M%S")
    )
    content_path = POSTS_DIR / f"{slug}.md"
    if content_path.exists():
        continue

    link = entry.get("link", "") or ""
    full_html, html_tags = fetch_full_naver_post(link)
    sanitized_html, text_preview, tables, code_blocks = sanitize_html(full_html or entry.get("description", ""))
    markdown = html_to_markdown(sanitized_html, tables, code_blocks)

    # ✅ 첫 문장 요약
    summary = entry.get("summary", "") or text_preview
    clean_summary = whitespace_re.sub(" ", summary).strip()
    sentence_end = re.search(r"[.!?]", clean_summary)
    if sentence_end:
        description = clean_summary[: sentence_end.end()].strip()
    else:
        description = clean_summary[:120]

    # ✅ 태그 (RSS + 본문 통합)
    tags = html_tags or []
    raw_tags = entry.get("tags", []) or []
    for tag in raw_tags:
        if isinstance(tag, dict):
            value = tag.get("term") or tag.get("label")
            if value:
                tags.append(f"#{value.strip()}")
        elif tag:
            tags.append(f"#{str(tag).strip()}")

    for t in html_tags:
        if t not in tags:
            tags.append(t)

    # ✅ 날짜 처리
    parsed_date = entry.get("published_parsed") or entry.get("updated_parsed")
    if parsed_date:
        try:
            date = datetime(*parsed_date[:6]).strftime("%Y-%m-%d")
        except:
            date = datetime.now().strftime("%Y-%m-%d")
    else:
        date = datetime.now().strftime("%Y-%m-%d")

    reading_minutes = max(1, len(markdown.split()) // 200)

    # ✅ 파일 작성
    sections = [f"# {title}", "", "---", "", markdown]
    if link:
        sections.append(f"\n[원문 보기]({link})")
    content_path.write_text("\n".join(sections).rstrip() + "\n", encoding="utf-8")

    posts_by_slug[slug] = {
        "slug": slug,
        "title": title,
        "description": description,
        "date": date,
        "tags": tags,
        "coverGradient": "from-emerald-500 via-teal-500 to-blue-500",
        "readingMinutes": reading_minutes,
        "contentPath": f"/posts/{slug}.md",
    }
    updated = True


# ✅ manifest & Git 반영
if updated:
    manifest = sorted(
        posts_by_slug.values(), key=lambda x: x["date"], reverse=True
    )
    MANIFEST_PATH.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    if GIT_USER_NAME and GIT_USER_EMAIL:
        subprocess.run(["git", "config", "user.name", GIT_USER_NAME], check=True)
        subprocess.run(["git", "config", "user.email", GIT_USER_EMAIL], check=True)

    current_branch = subprocess.check_output(
        ["git", "rev-parse", "--abbrev-ref", "HEAD"], text=True
    ).strip()
    if current_branch != "auto-post":
        subprocess.run(["git", "checkout", "-B", "auto-post"], check=True)

    subprocess.run(["git", "add", str(POSTS_DIR)], check=True)
    commit_msg = f"Auto post update {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
    subprocess.run(["git", "commit", "-m", commit_msg], check=True)

    # 원격 브랜치 존재 확인 및 삭제
    result = subprocess.run(
        ["git", "ls-remote", "--heads", "origin", "auto-post"],
        capture_output=True, text=True
    )
    if result.stdout.strip():
        subprocess.run(["git", "push", "origin", "--delete", "auto-post"], check=False)

    subprocess.run(["git", "push", "-u", "origin", "auto-post"], check=True)
    print("🚀 Push 완료")
else:
    print("ℹ️ 새로운 포스트 없음")
