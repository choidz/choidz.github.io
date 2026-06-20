# GitHub Actions를 활용한 CI/CD 배포 자동화 가이드

---

CI/CD(지속적 통합 및 지속적 배포)는 현대 소프트웨어 개발에서 필수적인 요소로 자리 잡고 있습니다. 특히 GitHub Actions는 이러한 CI/CD를 구현하는 데 있어 매우 유용한 도구입니다. 이번 글에서는 GitHub Actions를 사용하여 배포 자동화를 설정하는 방법과 실무에서 유용한 체크리스트를 제공하겠습니다.

## CI/CD란 무엇인가?
CI/CD는 코드 변경이 있을 때마다 자동으로 빌드, 테스트 및 배포를 수행하는 프로세스를 의미합니다. CI(지속적 통합)는 개발자가 자주 코드를 병합할 때 자동으로 빌드하고 테스트를 수행하여 버그를 조기에 발견하는 데 도움을 줍니다. 반면 CD(지속적 배포)는 테스트를 통과한 코드를 자동으로 배포하여 운영 부담을 최소화합니다.

## GitHub Actions란?
GitHub Actions는 GitHub에서 제공하는 CI/CD 도구로, 이벤트(예: 커밋, 푸시)가 발생할 때 미리 정의한 작업(워크플로)을 자동으로 실행할 수 있습니다. YAML 파일을 사용하여 설정할 수 있으며, GitHub와의 완벽한 통합 덕분에 다양한 환경에서 쉽게 사용할 수 있습니다.

## GitHub Actions를 이용한 배포 자동화 기본 구조
배포 자동화의 기본 흐름은 다음과 같습니다:
1. 코드 푸시
2. GitHub Actions 실행
3. 테스트
4. 빌드
5. 배포

이 과정을 자동화하기 위해서는 GitHub 저장소 내 `.github/workflows` 디렉토리에 YAML 파일을 생성해야 합니다. 예를 들어, `deploy.yml` 파일을 생성하고 다음과 같은 기본 구조를 설정할 수 있습니다:

```yaml
name: CI/CD

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: 코드 체크아웃
        uses: actions/checkout@v2
      - name: Python 설치
        uses: actions/setup-python@v2
        with:
          python-version: '3.10'
      - name: 의존성 설치
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
      - name: 테스트 실행
        run: |
          pytest
```

위의 예제는 `main` 브랜치에 푸시될 때마다 자동으로 실행되며, Python 환경을 설정하고 의존성을 설치한 후 테스트를 실행합니다. 

## Docker와의 통합
실무에서는 Docker를 사용하여 애플리케이션을 컨테이너화하고 배포하는 경우가 많습니다. Docker를 사용한 배포 자동화는 다음과 같이 추가할 수 있습니다:

```yaml
      - name: Docker 이미지 빌드
        run: docker build -t my-python-app .
      - name: Docker 컨테이너 실행
        run: docker run -d -p 5000:5000 my-python-app
```

이렇게 하면 Docker 이미지를 빌드하고 실행할 수 있습니다. 이 과정은 Flask, FastAPI와 같은 웹 애플리케이션을 배포하는 데 유용합니다.

## GitHub Secrets 설정
배포 과정에서 민감한 정보(예: 서버 IP, API 키 등)를 코드에 직접 작성하는 것은 위험합니다. 따라서 GitHub Secrets를 사용하여 이러한 정보를 안전하게 관리할 수 있습니다. GitHub 저장소의 Settings > Secrets > Actions에서 비밀 정보를 등록할 수 있습니다. 예를 들어, 다음과 같이 사용할 수 있습니다:

```yaml
env:
  SERVER_IP: ${{ secrets.SERVER_IP }}
```

## 실무 체크리스트
1. **워크플로우 테스트**: 설정한 워크플로우가 제대로 작동하는지 테스트합니다.
2. **로그 관리**: 배포 로그를 관리하여 문제가 발생했을 때 쉽게 추적할 수 있도록 합니다.
3. **보안 점검**: GitHub Secrets를 통해 민감한 정보를 안전하게 관리합니다.
4. **버전 관리**: 배포된 버전을 기록하여 롤백이 가능하도록 합니다.

## 흔한 실수
- **YAML 파일의 문법 오류**: YAML은 공백과 들여쓰기에 민감하므로 주의해야 합니다.
- **비밀 정보 노출**: GitHub Secrets를 사용하지 않고 민감한 정보를 코드에 작성하는 실수를 피해야 합니다.

## 마무리
GitHub Actions를 활용한 CI/CD 배포 자동화는 개발자의 생산성을 크게 향상시킬 수 있습니다. 자동화된 테스트와 배포를 통해 코드의 안정성을 높이고, 배포 실수를 최소화할 수 있습니다. 이번 글에서 소개한 방법을 통해 여러분의 프로젝트에도 CI/CD를 도입해 보시기 바랍니다. ![참고 이미지](/images/posts/github-actions를-활용한-ci-cd-배포-자동화-가이드-00-29b2d91a.png)

<small>이미지 출처: https://blog.naver.com/brotechtalks/224147088780</small>

---

## 참고한 자료

- [🚀 [Python 실무\] CI/CD 자동 배포란? GitHub Actions로 배포 자동화하기](https://blog.naver.com/brotechtalks/224147088780)
- [[공통정보\] Devops의 이해 및 역할에 대한 개인 상세 정리글](https://blog.naver.com/sung_mk1919/224057367107)
- [📘 12강: GitHub Actions로 쿠버네티스 CI/CD 자동화 구성하기](https://blog.naver.com/qkdtp12/223938257425)
- [CI/CD와 DevOps 같은 말일까?](https://blog.naver.com/skdaksdptn/224252064271)
