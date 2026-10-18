# LangChain Output Parser 오류 해결 방법

## 오류 증상 및 에러 메시지

LangChain을 사용하면서 Output Parser 관련 오류는 자주 발생하는 문제 중 하나입니다. 가장 일반적인 증상은 `INVALID_PROMPT_INPUT`와 같은 에러 메시지로 나타나며, 이는 프롬프트 템플릿이 요구하는 입력과 실제 전달된 값이 일치하지 않을 때 발생합니다. 예를 들어, 프롬프트에서 `{tone}` 변수를 요구하는데, 실제로는 이 변수가 누락된 경우에 해당합니다. 이 오류는 모델 호출 전에 프롬프트의 유효성을 검사하지 않을 때 더 자주 발생합니다.

![LangChain output parser 오류 해결 기술 다이어그램](/images/posts/langchain-output-parser-오류-해결-방법-00-generated.svg)

또한, 출력 포맷이 예상과 달라서 발생하는 오류도 있습니다. 예를 들어, 모델이 JSON 형식의 응답을 반환해야 하는데, 문자열이나 다른 형식으로 응답을 반환하는 경우입니다. 이러한 문제는 모델과 Output Parser 간의 계약이 깨졌음을 의미합니다.

## 오류의 원인

Output Parser 오류의 주요 원인은 입력 계약 위반입니다. 입력 계약은 프롬프트 템플릿이 요구하는 입력 변수와 실제 전달된 변수 간의 일치를 의미합니다. 만약 프롬프트에서 특정 변수를 요구하는데, 코드에서 이를 누락하거나 잘못된 이름으로 전달하면 오류가 발생합니다. 

또한, 타입 계약 위반도 원인이 될 수 있습니다. 예를 들어, Output Parser가 문자열을 기대하는데, 이전 단계에서 전달된 값이 리스트나 딕셔너리인 경우입니다. 이럴 경우, Output Parser는 이를 처리할 수 없어 오류를 발생시킵니다. 이러한 문제는 코드의 각 단계에서 어떤 입력과 출력을 기대하는지를 명확히 이해하지 못할 때 발생합니다.

## 오류 확인 명령어

문제가 발생한 경우, 다음과 같은 명령어를 사용하여 현재 환경과 패키지 상태를 점검할 수 있습니다. 이는 의존성 문제나 패키지 설치 상태를 확인하는 데 유용합니다.

```bash
python -m pip check
python -m pip freeze > requirements.lock.txt
python -m pip show langchain langchain-core langchain-openai langsmith
```

이 명령어를 통해 현재 설치된 패키지와 그 버전을 확인할 수 있으며, 의존성 충돌 여부를 점검할 수 있습니다. 특히, `pip check` 명령어는 빠르게 문제를 진단하는 데 도움이 됩니다.

## 해결 절차

1. **프롬프트 템플릿 점검**: 프롬프트 템플릿이 요구하는 입력 변수가 무엇인지 확인하고, 이를 코드에서 정확히 전달하고 있는지 점검합니다. 변수명이 일치하는지 확인하는 것이 중요합니다.

2. **입력 유효성 검사 추가**: 모델 호출 전에 입력 변수를 검증하는 코드를 추가합니다. 아래는 입력 변수를 검증하는 간단한 예시입니다.

   ```python
   def validate_prompt_payload(prompt, payload: dict) -> None:
       required = set(prompt.input_variables)
       received = set(payload.keys())
       missing = required - received
       extra = received - required

       if missing:
           raise ValueError(f'Missing prompt variables: {sorted(missing)}')
       if extra:
           print(f'[debug] Extra payload keys ignored by prompt: {sorted(extra)}')
   ```

3. **출력 포맷 점검**: Output Parser가 기대하는 출력 포맷과 모델의 응답 포맷이 일치하는지 확인합니다. 만약 일치하지 않는다면, Output Parser의 설정을 조정하거나 모델의 응답을 수정해야 합니다.

4. **디버깅 도구 활용**: LangChain의 디버깅 도구를 활용하여 각 단계에서 실제 값이 무엇인지 확인합니다. 각 단계의 출력을 분리하여 확인하는 것이 좋습니다.

## 흔한 실수

- **프롬프트 변수 누락**: 가장 흔한 실수는 프롬프트에서 요구하는 변수를 코드에서 누락하는 것입니다. 이를 방지하기 위해 프롬프트 템플릿의 요구 사항을 항상 확인해야 합니다.
- **타입 불일치**: 입력 단계에서 전달하는 값의 타입이 Output Parser가 기대하는 타입과 다를 경우 오류가 발생합니다. 따라서 각 단계에서 어떤 타입의 데이터를 전달하는지 명확히 해야 합니다.

## 재발 방지 체크리스트

- [ ] 프롬프트 템플릿의 입력 변수를 항상 확인하기
- [ ] 입력 유효성 검사를 코드에 추가하기
- [ ] Output Parser의 설정을 주기적으로 점검하기
- [ ] 각 단계의 출력을 디버깅 도구로 확인하기

이와 같은 절차를 통해 LangChain의 Output Parser에서 발생하는 오류를 효과적으로 진단하고 해결할 수 있습니다. 문제를 조기에 발견하고 적절한 조치를 취하는 것이 중요합니다.

## 참고한 자료

- [[AI\] LangChain 오류 디버깅 전략과 실전 트러블슈팅](https://pswq.tistory.com/929)
- [n8n 이메일 AI Agent 장애 진단: 50k 프롬프트보다 메일 원문·메모리 창·도구 출력을 먼저 잘라야 한다](https://ai-imojumo.tistory.com/entry/n8n-%EC%9D%B4%EB%A9%94%EC%9D%BC-AI-Agent-%EC%9E%A5%EC%95%A0-%EC%A7%84%EB%8B%A8-50k-%ED%94%84%EB%A1%AC%ED%94%84%ED%8A%B8%EB%B3%B4%EB%8B%A4-%EB%A9%94%EC%9D%BC-%EC%9B%90%EB%AC%B8%C2%B7%EB%A9%94%EB%AA%A8%EB%A6%AC-%EC%B0%BD%C2%B7%EB%8F%84%EA%B5%AC-%EC%B6%9C%EB%A0%A5%EC%9D%84-%EB%A8%BC%EC%A0%80-%EC%9E%98%EB%9D%BC%EC%95%BC-%ED%95%9C%EB%8B%A4)
