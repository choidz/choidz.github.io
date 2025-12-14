# GitHub Actions로 네이버 블로그 RSS 자동 동기화 시스템 만들기

---

**GitHub Actions로 네이버 블로그 자동 동기화 블로그 구축하기**

네이버 블로그에 글을 올리면 자동으로 **choidz.github.io** (GitHub Pages)에 포스팅되는 자동화 구조를 만들 수 있습니다.

---

**💡 개요**

이 프로젝트의 핵심은 **네이버 블로그와 GitHub Pages를 동시에 운영** 할 수 있다는 점이에요.

즉,

> “글은 네이버에 쓰고, 관리와 배포는 GitHub이 자동으로 한다.”

이렇게 하면

  * 네이버 블로그의 **유입(SEO, 구독자)** 도 유지하면서

  * GitHub 블로그의 **깔끔한 디자인 + 버전 관리 + 정적 배포** 기능을 같이 쓸 수 있습니다.

---

**⚙️ 전체 파이프라인 구조**

1️⃣ **자동 실행 (트리거)**

매일 오전 9시 (KST, cron: 0 0 * * *) 또는 수동 실행 시

GitHub Actions 워크플로(.github/workflows/auto-post.yml)이 실행됩니다.

​

2️⃣ **네이버 RSS 읽기 및 변환**

auto_post.py가 네이버 블로그의 RSS 주소(NAVER_RSS_URL)를 읽고

새 글이 있으면 Markdown(.md) 파일로 변환해 저장합니다.

​

3️⃣ **auto-post 브랜치 업데이트**

새 글이 있으면 auto-post 브랜치에서 public/posts 폴더를 커밋하고 푸시합니다.

​

4️⃣ **master와 동기화**

Actions 단계에서 auto-post → master 로 public/posts 디렉터리만 동기화합니다.

변경이 없으면 조용히 종료됩니다.

​

5️⃣ **정적 사이트 자동 배포**

Node.js 환경에서 npm run deploy 실행

→ gh-pages 브랜치로 배포 → GitHub Pages(choidz.github.io) 자동 업데이트!

---

**🧠 흐름 요약**

```
네이버 블로그 RSS
   ↓
auto_post.py (RSS → Markdown)
   ↓
public/posts/*.md 생성
   ↓
auto-post 브랜치 커밋
   ↓
master 브랜치에 posts 반영
   ↓
npm run deploy
   ↓
choidz.github.io 자동 배포 🎉
```

---

**🧰 환경 변수 / 시크릿**

---

**✅ 장점 요약**

  * **하나의 글로 두 블로그를 동시에 운영** → 네이버에 글만 올려도 GitHub 블로그 자동 반영

  * **버전 관리 및 백업 자동화** → 모든 글이 Markdown 파일로 저장되고 Git 기록에 남음

  * **자동 배포로 관리 부담 덜기** → 별도의 명령 없이 GitHub Actions가 자동으로 사이트 업데이트

  * **두 플랫폼의 장점 모두 활용** → 네이버 유입 + 깔끔한 GitHub 블로그 UI

---

**🧭 수동 실행 방법**

  1. GitHub 저장소 → **Actions** → “Auto Post from Naver Blog” 선택

  2. **Run workflow** 클릭

  3. 성공 시 master와 gh-pages가 최신 글로 동기화

  4. 실패 시 Python 단계(Run auto_post.py)나 Git Sync 단계 로그 확인

---

**📘 실제 동작 예시**

  1. 네이버 블로그에 새 글을 작성하면 RSS에 반영됨

  2. GitHub Actions가 새 글 감지 → Markdown 파일 생성

  3. auto-post 브랜치에 커밋 후 master로 posts 폴더만 동기화

  4. npm run deploy 실행 → 정적 사이트 자동 업데이트

  5. **choidz.github.io** 에 자동 반영 🎉

---

**🧩 결론**

이 시스템을 쓰면

> **“하나의 콘텐츠 = 두 개의 플랫폼”**
> 
> 을 완성할 수 있습니다.

👉 네이버에서는 독자와 소통하고,

👉 GitHub Pages에서는 깔끔하게 백업 & 포트폴리오처럼 관리하세요.

​

​

#GitHubActions #GitHubPages #블로그자동화 #RSS #Python

#네이버블로그 #깃허브블로그 #개발자동화 #CI/CD #글자동업로드

#개인블로그운영 #기술블로그 #포트폴리오블로그 #사이드프로젝트

[원문 보기](https://blog.naver.com/choidz_/224070197745?fromRss=true&trackingCode=rss)
