import json
import os
import re
import subprocess
import hashlib
import base64
import time
from datetime import datetime
from pathlib import Path
import requests
import feedparser
import html2text
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

load_dotenv()

NAVER_RSS_URL = os.getenv("NAVER_RSS_URL")
POSTS_DIR = Path("public/posts")
IMAGES_DIR = Path("public/images/posts")
MANIFEST_PATH = POSTS_DIR / "index.json"
SITEMAP_PATH = Path("public/sitemap.xml")
SITE_URL = "https://choidz.github.io"
GIT_USER_NAME = os.getenv("GIT_USER_NAME")
GIT_USER_EMAIL = os.getenv("GIT_USER_EMAIL")

if not NAVER_RSS_URL:
    print("[ERROR] NAVER_RSS_URL 환경 변수가 없습니다.")
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

slug_pattern = re.compile(r"[^a-z0-9가-힣]+")
whitespace_re = re.compile(r"\s+")

# ✅ Selenium WebDriver 초기화
_driver = None

def get_driver():
    global _driver
    if _driver is None:
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")
        chrome_options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
        _driver = webdriver.Chrome(options=chrome_options)
    return _driver

def close_driver():
    global _driver
    if _driver:
        _driver.quit()
        _driver = None


# ✅ sitemap.xml 생성 함수
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
            urls.append(f"""  <url>
    <loc>{SITE_URL}/blog/{slug}</loc>
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

POSTS_DIR.mkdir(parents=True, exist_ok=True)
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

existing_manifest = []
if MANIFEST_PATH.exists():
    try:
        existing_manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        existing_manifest = []

posts_by_slug = {item["slug"]: item for item in existing_manifest if "slug" in item}
updated = False


def fetch_full_naver_post(link: str, slug: str = ""):
    """Selenium으로 네이버 블로그 페이지를 로드하고 본문과 이미지를 추출"""
    # 블로그 ID, 글번호 추출
    m = re.search(r"blog.naver.com/([^/]+)/(\d+)", link)
    if not m:
        print(f"[ERROR] link parse failed: {link}")
        return "", [], {}
    blog_id, log_no = m.groups()

    mobile_url = f"https://m.blog.naver.com/{blog_id}/{log_no}"
    driver = get_driver()

    try:
        driver.get(mobile_url)
        # 페이지 로드 대기
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "div.se-main-container, div.se_component_wrap"))
        )
        time.sleep(2)  # 이미지 로드 대기

        # HTML 가져오기
        page_source = driver.page_source
        soup = BeautifulSoup(page_source, "html.parser")

        # 본문 추출
        container = soup.select_one("div.se-main-container") or soup.select_one("div.se_component_wrap")

        # 태그 추출
        script_tag = soup.find("script", id="__NEXT_DATA__")
        tags = []
        if script_tag and script_tag.string:
            try:
                data = json.loads(script_tag.string)
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
                print(f"[WARN] JSON parse failed: {e}")

        # 이미지 다운로드 (Selenium 쿠키 + requests)
        image_map = {}  # original_url -> local_path
        if slug:
            # 본문 컨테이너 내의 이미지만 찾기
            content_imgs = driver.find_elements(By.CSS_SELECTOR, ".se-main-container img, .se_component_wrap img")

            # Selenium 쿠키를 requests 세션에 복사
            session = requests.Session()
            for cookie in driver.get_cookies():
                session.cookies.set(cookie['name'], cookie['value'])

            img_index = 0
            for img in content_imgs:
                try:
                    src = img.get_attribute("src") or ""
                    # 네이버 블로그 이미지만 처리 (blogthumb 포함된 것)
                    if not src or "pstatic.net" not in src:
                        continue
                    if "blogthumb" not in src and "blogfiles" not in src:
                        continue

                    # 이미 처리한 URL은 스킵
                    if src in image_map:
                        continue

                    # 파일 확장자 추출
                    ext_match = re.search(r'\.(png|jpg|jpeg|gif|webp)', src.lower())
                    ext = ext_match.group(1) if ext_match else 'png'

                    # 파일명 생성
                    url_hash = hashlib.md5(src.encode()).hexdigest()[:8]
                    filename = f"{slug}-{img_index:02d}-{url_hash}.{ext}"
                    local_path = IMAGES_DIR / filename

                    if not local_path.exists():
                        # 쿠키와 Referer로 이미지 다운로드
                        headers = {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                            "Referer": mobile_url,
                        }
                        resp = session.get(src, headers=headers, timeout=10)
                        resp.raise_for_status()
                        local_path.write_bytes(resp.content)
                        print(f"  [IMG] saved: {filename}")

                    image_map[src] = f"/images/posts/{filename}"
                    img_index += 1
                except Exception as e:
                    pass  # 이미지 다운로드 실패는 무시

        print(f"[OK] {mobile_url} -> tags: {tags}, images: {len(image_map)}")
        return (str(container) if container else ""), tags, image_map

    except Exception as e:
        print(f"[ERROR] Selenium failed: {e}")
        return "", [], {}


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

# ✅ 네이버 이미지 URL 정규화 (썸네일 → 원본 크기)
def normalize_naver_image_url(url: str) -> str:
    """네이버 이미지 URL에서 type 파라미터를 제거하여 원본 크기로 변경"""
    if not url:
        return url
    # type=w80_blur, type=w420 등의 파라미터를 제거
    # 또는 더 큰 크기로 변경 (type=w966 정도가 적당)
    url = re.sub(r'\?type=w\d+(_blur)?', '', url)
    url = re.sub(r'&type=w\d+(_blur)?', '', url)
    return url


# ✅ 이미지 다운로드 및 로컬 저장
def download_image(url: str, slug: str, index: int) -> str | None:
    """네이버 이미지를 다운로드하고 로컬 경로를 반환"""
    if not url:
        return None

    try:
        # URL 정규화
        url = normalize_naver_image_url(url)

        # 파일 확장자 추출
        ext_match = re.search(r'\.(png|jpg|jpeg|gif|webp)', url.lower())
        ext = ext_match.group(1) if ext_match else 'png'

        # 파일명 생성 (slug + index + 해시)
        url_hash = hashlib.md5(url.encode()).hexdigest()[:8]
        filename = f"{slug}-{index:02d}-{url_hash}.{ext}"
        local_path = IMAGES_DIR / filename

        # 이미 존재하면 스킵
        if local_path.exists():
            return f"/images/posts/{filename}"

        # 이미지 다운로드 (네이버 referer 설정)
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Referer": "https://m.blog.naver.com/",
        }
        res = requests.get(url, headers=headers, timeout=10)
        res.raise_for_status()

        # 파일 저장
        local_path.write_bytes(res.content)
        print(f"  [IMG] saved: {filename}")

        return f"/images/posts/{filename}"
    except Exception as e:
        print(f"  [WARN] image download failed: {url[:50]}... ({e})")
        return None


# ✅ HTML 정제 및 요약 추출
def sanitize_html(html: str, image_map: dict = None) -> tuple[str, str, list[str], list[str]]:
    soup = BeautifulSoup(html or "", "html.parser")
    tables = []
    code_blocks = []
    image_map = image_map or {}

    # ✅ 이미지 URL을 로컬 경로로 변경
    for img in soup.find_all("img"):
        src = img.get("src") or img.get("data-src") or ""
        if src in image_map:
            img["src"] = image_map[src]
        elif "pstatic.net" in src or "blogfiles.naver" in src:
            img["src"] = normalize_naver_image_url(src)
        # data-src 제거
        if img.get("data-src"):
            del img["data-src"]

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
    full_html, html_tags, image_map = fetch_full_naver_post(link, slug)
    sanitized_html, text_preview, tables, code_blocks = sanitize_html(full_html or entry.get("description", ""), image_map)
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

    # ✅ sitemap.xml 생성
    sitemap_content = generate_sitemap(manifest)
    SITEMAP_PATH.write_text(sitemap_content, encoding="utf-8")
    print(f"[OK] sitemap.xml generated ({len(manifest)} posts)")

    if GIT_USER_NAME and GIT_USER_EMAIL:
        subprocess.run(["git", "config", "user.name", GIT_USER_NAME], check=True)
        subprocess.run(["git", "config", "user.email", GIT_USER_EMAIL], check=True)

    current_branch = subprocess.check_output(
        ["git", "rev-parse", "--abbrev-ref", "HEAD"], text=True
    ).strip()
    if current_branch != "auto-post":
        subprocess.run(["git", "checkout", "-B", "auto-post"], check=True)

    subprocess.run(["git", "add", str(POSTS_DIR), str(IMAGES_DIR), str(SITEMAP_PATH)], check=True)
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
    print("[OK] Push completed")
else:
    print("[INFO] No new posts")

# ✅ WebDriver 종료
close_driver()
