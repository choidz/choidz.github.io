import os
from dotenv import load_dotenv
import feedparser
import html2text
from datetime import datetime
import subprocess

# ==============================
load_dotenv()

NAVER_RSS_URL = os.getenv("NAVER_RSS_URL")
POSTS_DIR = "./src/posts"
GIT_USER_NAME = os.getenv("GIT_USER_NAME")
GIT_USER_EMAIL = os.getenv("GIT_USER_EMAIL")
# ==============================

def html_to_markdown(html_content: str) -> str:
    h = html2text.HTML2Text()
    h.ignore_links = False
    h.ignore_images = False
    h.body_width = 0
    h.single_line_break = True
    h.protect_links = True
    h.mark_code = True
    h.unicode_snob = True
    return h.handle(html_content)

os.makedirs(POSTS_DIR, exist_ok=True)
feed = feedparser.parse(NAVER_RSS_URL)

for entry in feed.entries:
    title = entry.title
    link = entry.link
    html_body = entry.description
    md_body = html_to_markdown(html_body)
    date = datetime.now().strftime("%Y-%m-%d")
    safe_title = "".join(c if c.isalnum() else "-" for c in title).strip("-")
    filename = f"{POSTS_DIR}/{date}-{safe_title}.md"

    if os.path.exists(filename):
        print(f"⏩ 이미 존재: {title}")
        continue

    with open(filename, "w", encoding="utf-8") as f:
        f.write(f"# {title}\n\n---\n\n{md_body}\n\n[원문 보기]({link})\n")
    print(f"✅ 새 글 생성 완료: {filename}")

# 🔀 Git auto-post 브랜치로 커밋 & 푸시
subprocess.run(["git", "config", "user.name", GIT_USER_NAME])
subprocess.run(["git", "config", "user.email", GIT_USER_EMAIL])

# 현재 브랜치 확인
result = subprocess.run(["git", "rev-parse", "--abbrev-ref", "HEAD"], capture_output=True, text=True)
current_branch = result.stdout.strip()

# auto-post 브랜치 생성/이동
if current_branch != "auto-post":
    subprocess.run(["git", "checkout", "-B", "auto-post"])

# 커밋 및 푸시
subprocess.run(["git", "add", "."])
subprocess.run(["git", "commit", "-m", f"Auto post update {datetime.now()}"])
subprocess.run(["git", "push", "-u", "origin", "auto-post"])
