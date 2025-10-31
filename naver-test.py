from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import time

url = "https://blog.naver.com/choidz_/224059741734"

options = Options()
options.add_argument("--headless")
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")
options.add_argument("--window-size=1920,1080")

driver = webdriver.Chrome(options=options)
driver.get(url)

# ✅ iframe 진입
driver.switch_to.frame("mainFrame")

# ✅ 페이지 로드 대기 (태그가 JS로 로드되므로 약간의 대기 필요)
time.sleep(2)

html = driver.page_source
soup = BeautifulSoup(html, "html.parser")

# ✅ wrap_tag 내부의 span.ell 추출
tags = [span.get_text(strip=True) for span in soup.select("div.wrap_tag span.ell")]
print("✅ 추출된 태그:", tags)

driver.quit()
