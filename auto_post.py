import os
import feedparser
import html2text
from datetime import datetime
import subprocess

# ==============================
# 설정
NAVER_RSS_URL = "https://blog.rss.naver.com/chltjdkkk.xml"
POSTS_DIR = "./src/posts"
GIT_USER_NAME = "choidz"
GIT_USER_EMAIL = "choidzxx@gmail.com"
# ==============================

os.makedirs(POSTS_DIR, exist_ok=True)

# RSS 피드 읽기
feed = feedparser.parse(NAVER_RSS_URL)

for entry in feed.entries:
    title = entry.title
    link = entry.link
    html_body = entry.description
    md_body = html2text.html2text(html_body)
    date = datetime.now().strftime("%Y-%m-%d")
    safe_title = "".join(c if c.isalnum() else "-" for c in title).strip("-")
    filename = f"{POSTS_DIR}/{date}-{safe_title}.md"

    # 이미 있으면 skip
    if os.path.exists(filename):
        print(f"⏩ 이미 존재: {title}")
        continue

    # Markdown 파일 생성
    with open(filename, "w", encoding="utf-8") as f:
        f.write(f"---\ntitle: \"{title}\"\ndate: {date}\nlink: {link}\n---\n\n{md_body}")
    print(f"✅ 새 글 생성 완료: {filename}")

# Git 커밋 & 푸시
subprocess.run(["git", "config", "user.name", GIT_USER_NAME])
subprocess.run(["git", "config", "user.email", GIT_USER_EMAIL])
subprocess.run(["git", "add", "."])
subprocess.run(["git", "commit", "-m", f"Auto post update {datetime.now()}"])
subprocess.run(["git", "push"])
