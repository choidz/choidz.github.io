# CHOI.DEV

Astro 기반 GitHub Pages 기술 블로그입니다.

## Local Commands

```bash
npm install
npm start
npm run build
```

`npm run build` 전에 `public/posts/index.json`과 `public/posts/*.md`를 `src/content/blog`로 동기화합니다.

## Automated Publishing

### Naver Blog Sync

`.github/workflows/auto-post.yml`이 매일 네이버 블로그 RSS를 확인해 새 글을 `public/posts`에 동기화하고, 변경이 있으면 GitHub Pages까지 배포합니다.

필요한 Secrets:

- `NAVER_RSS_URL`
- `GIT_USER_NAME`
- `GIT_USER_EMAIL`

### Daily Agent Post

`.github/workflows/daily-agent-post.yml`이 매일 00:10 KST에 기존 글 카테고리 분포를 기준으로 주제를 고르고, 관련 글과 이미지를 크롤링한 뒤 OpenAI API로 새 기술 글을 생성합니다. 기본값은 하루 5개이며, 안전상 한 번에 최대 5개까지만 생성합니다.

필요한 Secrets:

- `OPENAI_API_KEY`
- `OPENAI_MODEL` 선택 사항, 기본값은 `gpt-4o-mini`

수동 실행할 때는 GitHub Actions의 **Daily Agent Blog Post** 워크플로에서 category/topic/post_count를 직접 넣을 수 있습니다.

로컬 dry-run:

```bash
npm run agent:post -- --dry-run
```
