import json
import os
import re
import subprocess
from datetime import datetime
from pathlib import Path

import feedparser
import html2text
from dotenv import load_dotenv

# --- 환경 변수 로드 (.env or GitHub Secrets) ---
load_dotenv()

NAVER_RSS_URL = os.getenv("NAVER_RSS_URL")
POSTS_DIR = Path("public/posts")
MANIFEST_PATH = POSTS_DIR / "index.json"
GIT_USER_NAME = os.getenv("GIT_USER_NAME")
GIT_USER_EMAIL = os.getenv("GIT_USER_EMAIL")

# --- Markdown 변환 설정 ---
converter = html2text.HTML2Text()
converter.ignore_links = False
converter.ignore_images = False
converter.body_width = 0
converter.single_line_break = True
converter.protect_links = True
converter.mark_code = True
converter.unicode_snob = True

POSTS_DIR.mkdir(parents=True, exist_ok=True)

# --- 기존 index.json 로드 ---
if MANIFEST_PATH.exists():
    try:
        existing_manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        print("⚠️ index.json 손상 감지 → 초기화")
        existing_manifest = []
else:
    existing_manifest = []

posts_by_slug = {item["slug"]: item for item in existing_manifest if "slug" in item}

# --- RSS 파싱 ---
slug_pattern = re.compile(r"[^a-z0-9]+")
feed = feedparser.parse(NAVER_RSS_URL)
updated = False

for entry in feed.entries:
    title = entry.title.strip()
    base_slug = slug_pattern.sub("-", title.lower()).strip("-")
    slug = base_slug or datetime.now().strftime("post-%Y%m%d-%H%M%S")
    content_path = POSTS_DIR / f"{slug}.md"

    # 이미 존재하는 포스트면 skip
    if content_path.exists():
        continue

    html_body = entry.get("description", "")
    markdown = converter.handle(html_body)
    source_link = entry.get("link", "")
    summary = entry.get("summary", "").strip()
    description = summary or markdown.splitlines()[0][:140]

    raw_tags = entry.get("tags", []) or []
    tags = []
    for tag in raw_tags:
        if isinstance(tag, dict):
            value = tag.get("term") or tag.get("label")
            if value:
                tags.append(value)
        else:
            tags.append(str(tag))

    try:
        published = entry.get("published_parsed") or entry.get("updated_parsed")
        date = datetime(*published[:6]).strftime("%Y-%m-%d") if published else datetime.now().strftime("%Y-%m-%d")
    except Exception:
        date = datetime.now().strftime("%Y-%m-%d")

    reading_minutes = max(1, len(markdown.split()) // 200)

    # --- Markdown 파일 작성 ---
    sections = [
        f"# {title}",
        "",
        "---",
        "",
        markdown.strip(),
        "",
        f"[원문 보기]({source_link})" if source_link else "",
    ]
    content_path.write_text("\n".join(sections).strip() + "\n", encoding="utf-8")

    # --- index.json용 데이터 구성 ---
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

    print(f"✅ Added new post: {title}")
    updated = True

# --- index.json 갱신 ---
if updated:
    manifest = sorted(posts_by_slug.values(), key=lambda item: item["date"], reverse=True)
    MANIFEST_PATH.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8"
    )
    print(f"📄 index.json 갱신 완료 ({len(manifest)} posts)")

    # --- Git 자동 커밋/푸시 ---
    if GIT_USER_NAME and GIT_USER_EMAIL:
        subprocess.run(["git", "config", "user.name", GIT_USER_NAME])
        subprocess.run(["git", "config", "user.email", GIT_USER_EMAIL])

    current_branch = subprocess.check_output(
        ["git", "rev-parse", "--abbrev-ref", "HEAD"], text=True
    ).strip()

    if current_branch != "auto-post":
        subprocess.run(["git", "checkout", "-B", "auto-post"])

    subprocess.run(["git", "add", str(POSTS_DIR)])
    subprocess.run(["git", "commit", "-m", f"🤖 Auto post update {datetime.now():%Y-%m-%d %H:%M:%S}"])
    subprocess.run(["git", "push", "-u", "origin", "auto-post", "--force"])
else:
    print("ℹ️ 새로운 포스트 없음 (index.json 변경되지 않음)")
