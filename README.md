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

`.github/workflows/daily-agent-post.yml`이 매일 08:00와 18:00 KST에 카테고리를 순환하며 주제를 고르고, 관련 글과 이미지를 크롤링한 뒤 OpenAI API로 새 기술 글을 생성합니다. 예약 실행은 회차당 1개를 생성하고, 수동 실행은 최대 2개까지 요청할 수 있습니다. 한 글당 최대 10개 주제를 시도하며 출처·본문 구조 품질 조건을 통과하지 못하면 해당 후보는 게시하지 않습니다.

출처의 기술 이미지가 적합하면 본문에 사용하고, 이미지가 없거나 다운로드·배치 검사를 통과하지 못하면 주제와 카테고리로 만든 자체 SVG 기술 이미지를 대신 사용합니다. 자체 이미지는 인물이나 외부 저작물을 포함하지 않습니다. 모든 후보가 실패한 회차는 배포하지 않고 GitHub Actions에 경고를 남깁니다.

자동 생성 주제는 DevOps, Linux, Database, Programming, Frontend, AI, Mobile, Error, ElasticSearch, Grafana, Zabbix 분류를 사용합니다. 사이트 사이드바도 같은 분류 체계로 기존 글을 묶어 표시합니다.

필요한 Secrets:

- `OPENAI_API_KEY`
- `OPENAI_MODEL` 선택 사항, 기본값은 `gpt-4o-mini`

수동 실행할 때는 GitHub Actions의 **Daily Agent Blog Post** 워크플로에서 category/topic/post_count를 직접 넣을 수 있습니다.

로컬 dry-run:

```bash
npm run agent:post -- --dry-run
```
