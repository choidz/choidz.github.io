# Python에서 ModuleNotFoundError 해결하기: 원인과 해결 방법

## 1. 오류 증상 및 메시지

Python을 실행할 때 `ModuleNotFoundError`라는 오류 메시지를 만날 수 있습니다. 이 오류는 특정 모듈을 찾지 못했음을 나타내며, 보통 다음과 같은 형태로 나타납니다:

```
ModuleNotFoundError: No module named '모듈이름'
```

이 오류는 모듈이 설치되지 않았거나, 잘못된 경로에서 Python을 실행했기 때문에 발생합니다. 이러한 오류는 특히 가상환경을 사용할 때 빈번하게 발생할 수 있습니다.

## 2. 오류의 대표적인 원인

`ModuleNotFoundError`가 발생하는 주요 원인은 다음과 같습니다:
1. **모듈이 설치되지 않음**: 해당 모듈이 현재 Python 환경에 설치되어 있지 않은 경우입니다.
2. **잘못된 Python 실행**: 여러 버전의 Python이 설치되어 있을 때, 잘못된 버전의 Python을 사용하고 있을 수 있습니다.
3. **가상환경 문제**: 가상환경을 사용하고 있다면, 해당 환경이 활성화되지 않았거나, 모듈이 해당 환경에 설치되어 있지 않을 수 있습니다.
4. **작업 디렉토리 문제**: Python을 실행하는 현재 작업 디렉토리가 모듈이 위치한 경로와 다를 경우에도 오류가 발생할 수 있습니다.

![Python ModuleNotFoundError와 PowerShell 작업 위치 문제를 설명하는 일러스트](/images/posts/python에서-modulenotfounderror-해결하기-원인과-해결-방법-00-e72128cb.png)

<small>이미지 출처: https://seokicampoo.tistory.com/140</small>

## 3. 확인 명령어

오류를 확인하기 위해 다음과 같은 명령어를 사용할 수 있습니다:

1. 현재 Python 실행 파일 경로 확인:
   ```bash
   python -c "import sys; print(sys.executable)"
   ```

2. 설치된 패키지 목록 확인:
   ```bash
   pip list
   ```

3. 특정 패키지 정보 확인:
   ```bash
   pip show 모듈이름
   ```

이 명령어들을 통해 현재 어떤 Python을 사용하고 있는지, 어떤 패키지가 설치되어 있는지 확인할 수 있습니다.

## 4. 해결 절차

이제 오류를 해결하기 위한 절차를 살펴보겠습니다:

1. **가상환경 확인 및 활성화**: 가상환경을 사용하고 있다면 해당 환경이 활성화되어 있는지 확인합니다. Windows의 경우 다음과 같이 활성화할 수 있습니다:
   ```bash
   .\.venv\Scripts\activate
   ```

2. **모듈 설치**: 필요한 모듈이 설치되어 있지 않다면, 다음 명령어로 설치합니다:
   ```bash
   pip install 모듈이름
   ```

3. **작업 디렉토리 확인**: 현재 작업 디렉토리를 확인하고, 필요한 경우 프로젝트 루트로 이동합니다:
   ```bash
   cd D:\project
   ```

4. **Python 실행**: 모듈이 설치된 환경에서 Python을 실행합니다:
   ```bash
   python -m 모듈이름
   ```

이 과정을 통해 오류를 해결할 수 있습니다.

## 5. 흔한 실수

`ModuleNotFoundError`를 해결하는 과정에서 흔히 발생하는 실수는 다음과 같습니다:
- **가상환경을 활성화하지 않음**: 가상환경을 활성화하지 않고 모듈을 설치하거나 실행하면, 시스템 Python에서 모듈을 찾지 못할 수 있습니다.
- **잘못된 경로에서 실행**: 프로젝트 루트가 아닌 다른 경로에서 Python을 실행하면 모듈을 찾지 못할 수 있습니다.

## 6. 재발 방지 체크리스트

오류를 예방하기 위해 다음 사항을 체크리스트로 만들어 관리하세요:
- [ ] 가상환경을 항상 활성화한 후 작업하기
- [ ] 모듈 설치 후, 설치된 경로와 버전 확인하기
- [ ] Python 실행 시 항상 현재 작업 디렉토리 확인하기

![PowerShell 작업 위치에 따른 Python 모듈 인식 차이를 비교한 도식](/images/posts/python에서-modulenotfounderror-해결하기-원인과-해결-방법-01-ff420fff.png)

<small>이미지 출처: https://seokicampoo.tistory.com/140</small>

이렇게 점검하면 `ModuleNotFoundError`를 예방할 수 있습니다. Python 개발 시 가상환경과 모듈 관리를 철저히 하는 것이 중요합니다.

## 실무 적용 체크리스트

- Python ModuleNotFoundError 해결을 적용하기 전에 현재 운영 환경의 기준값과 예외 상황을 먼저 정리합니다.
- 변경 전후로 확인할 지표를 정하고, 문제가 생겼을 때 되돌릴 수 있는 절차를 문서화합니다.
- 한 번에 모든 서버나 서비스에 적용하기보다 작은 범위에서 검증한 뒤 점진적으로 확대합니다.
- 담당자, 확인 시간, 장애 판단 기준을 명확히 남겨 같은 문제가 반복될 때 빠르게 대응할 수 있게 합니다.

## 참고한 자료

- [Python ModuleNotFoundError: No module named 해결방법｜PowerShell 실행 위치부터 확인하기](https://seokicampoo.tistory.com/140)
- [Python ModuleNotFoundError 해결 방법 — 설치했는데도 모듈을 못 찾을 때](https://itstory05.tistory.com/322)
