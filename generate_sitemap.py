#!/usr/bin/env python3
"""
sitemap.xml 생성 스크립트
기존 index.json을 기반으로 sitemap.xml을 생성합니다.
"""

import json
from datetime import datetime
from pathlib import Path
from urllib.parse import quote

POSTS_DIR = Path("public/posts")
MANIFEST_PATH = POSTS_DIR / "index.json"
SITEMAP_PATH = Path("public/sitemap.xml")
SITE_URL = "https://choidz.github.io"


def generate_sitemap(posts: list) -> str:
    """posts 목록을 기반으로 sitemap.xml 생성"""
    today = datetime.now().strftime("%Y-%m-%d")

    urls = []

    # 홈페이지
    urls.append(f"""  <url>
    <loc>{SITE_URL}/</loc>
    <lastmod>{today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>""")

    # 포트폴리오
    urls.append(f"""  <url>
    <loc>{SITE_URL}/portfolio</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>""")

    # 블로그 포스트들
    for post in posts:
        slug = post.get("slug", "")
        date = post.get("date", today)
        if slug:
            # 한글 slug를 URL 인코딩 (safe='-'로 하이픈은 인코딩하지 않음)
            encoded_slug = quote(slug, safe='-')
            urls.append(f"""  <url>
    <loc>{SITE_URL}/blog/{encoded_slug}</loc>
    <lastmod>{date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>""")

    sitemap_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{chr(10).join(urls)}
</urlset>
"""
    return sitemap_content


def main():
    # index.json 읽기
    if not MANIFEST_PATH.exists():
        print(f"[ERROR] {MANIFEST_PATH} file not found.")
        return

    posts = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    print(f"[INFO] Found {len(posts)} posts")

    # sitemap 생성
    sitemap_content = generate_sitemap(posts)
    SITEMAP_PATH.write_text(sitemap_content, encoding="utf-8")

    print(f"[SUCCESS] sitemap.xml generated!")
    print(f"   - Total URLs: {len(posts) + 2} (home, portfolio, {len(posts)} blog posts)")
    print(f"   - File path: {SITEMAP_PATH}")


if __name__ == "__main__":
    main()
