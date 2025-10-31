import json
import os
import re
import subprocess
from datetime import datetime
from pathlib import Path

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

# html -> markdown 변환기 설정
converter = html2text.HTML2Text()
converter.ignore_links = False
converter.ignore_images = False
converter.body_width = 0
converter.single_line_break = True
converter.protect_links = True
converter.mark_code = True
converter.unicode_snob = True
converter.skip_internal_links = False

slug_pattern = re.compile(r"[^a-z0-9]+")
whitespace_re = re.compile(r"\s+")

POSTS_DIR.mkdir(parents=True, exist_ok=True)
feed = feedparser.parse(NAVER_RSS_URL)

# 기존 index.json 로드
existing_manifest = []
if MANIFEST_PATH.exists():
    try:
        existing_manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        existing_manifest = []

posts_by_slug = {item["slug"]: item for item in existing_manifest if "slug" in item}
updated = False


def sanitize_html(html: str) -> tuple[str, str]:
    """네이버 본문 HTML을 약간 정리해 마크다운 품질을 높이고 프리뷰 텍스트도 뽑는다."""
    soup = BeautifulSoup(html or "", "html.parser")

    # <hr> -> 줄바꿈 + 마크다운 구분선
    for hr in soup.find_all("hr"):
        hr.replace_with("\n\n---\n")

    # <br> -> 줄바꿈
    for br in soup.find_all("br"):
        br.replace_with("\n")

    # 블록 요소 끝에 줄바꿈 보정
    for block in soup.find_all(["p", "h1", "h2", "h3", "h4", "li", "blockquote"]):
        # block.get_text()가 비어있지 않고 마지막이 개행이 아니면 개행 추가
        txt = block.get_text()
        if txt and not txt.endswith("\n"):
            block.append("\n")

    text_preview = soup.get_text(separator=" ").strip()
    return str(soup), text_preview


for entry in feed.entries:
    title = (entry.title or "").strip()
    slug = slug_pattern.sub("-", title.lower()).strip("-") or datetime.now().strftime("post-%Y%m%d-%H%M%S")
    content_path = POSTS_DIR / f"{slug}.md"

    # 이미 생성된 포스트는 스킵
    if content_path.exists():
        continue

    html_body = entry.get("description", "") or ""
    sanitized_html, text_preview = sanitize_html(html_body)

    # HTML -> Markdown
    markdown = converter.handle(sanitized_html).strip()
    # 과도한 연속 개행 정리
    markdown = re.sub(r"\n{3,}", "\n\n", markdown)

    source_link = entry.get("link", "") or ""
    summary = entry.get("summary", "") or text_preview
    description = whitespace_re.sub(" ", summary).strip()[:180]

    # 태그 추출
    raw_tags = entry.get("tags", []) or []
    tags: list[str] = []
    for tag in raw_tags:
        if isinstance(tag, dict):
            value = tag.get("term") or tag.get("label")
            if value:
                tags.append(f"#{value.strip()}")
        elif tag:
            tags.append(f"#{str(tag).strip()}")

    # 날짜
    parsed_date = entry.get("published_parsed") or entry.get("updated_parsed")
    if parsed_date:
        try:
            date = datetime(*parsed_date[:6]).strftime("%Y-%m-%d")
        except Exception:
            date = datetime.now().strftime("%Y-%m-%d")
    else:
        date = datetime.now().strftime("%Y-%m-%d")

    # 예상 읽기 시간 (200 wpm 가정)
    reading_minutes = max(1, len(markdown.split()) // 200)

    # Markdown 파일 작성
    sections = [f"# {title}", "", "---", "", markdown]
    if source_link:
        sections.extend(["", f"[원문 보기]({source_link})"])
    content_path.write_text("\n".join([s for s in sections if s is not None]).rstrip() + "\n", encoding="utf-8")

    # index.json 반영용 레코드
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

# index.json 갱신 & git 반영
if updated:
    manifest = sorted(posts_by_slug.values(), key=lambda item: item["date"], reverse=True)
    MANIFEST_PATH.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    # git 설정(있을 때만)
    if GIT_USER_NAME and GIT_USER_EMAIL:
        subprocess.run(["git", "config", "user.name", GIT_USER_NAME], check=True)
        subprocess.run(["git", "config", "user.email", GIT_USER_EMAIL], check=True)

    # auto-post 브랜치 전환/생성
    current_branch = subprocess.check_output(["git", "rev-parse", "--abbrev-ref", "HEAD"], text=True).strip()
    if current_branch != "auto-post":
        subprocess.run(["git", "checkout", "-B", "auto-post"], check=True)

    subprocess.run(["git", "add", str(POSTS_DIR)], check=True)
    subprocess.run(["git", "commit", "-m", f"Auto post update {datetime.now():%Y-%m-%d %H:%M:%S}"], check=True)

    # 충돌 빈다면 아래 줄을 --force로 바꿔주세요.
    subprocess.run(["git", "push", "-u", "origin", "auto-post"], check=True)
    # 예: subprocess.run(["git", "push", "-u", "origin", "auto-post", "--force"], check=True)
else:
    print("No new posts to add.")
