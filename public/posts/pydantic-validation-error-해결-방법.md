# Pydantic Validation Error 해결 방법

## 증상 및 오류 메시지
Pydantic을 사용하여 데이터 모델을 정의하고 이를 검증할 때, 종종 Validation Error가 발생합니다. 이 오류는 주로 API 요청 시 전달된 데이터가 모델의 요구 사항을 충족하지 않을 때 발생합니다. 예를 들어, 다음과 같은 오류 메시지가 나타날 수 있습니다:

```
ValidationError: 1 validation error for UserInfo
username
  field required (type=value_error.missing)
```

이 메시지는 `UserInfo` 모델의 필수 필드인 `username`이 누락되었음을 의미합니다. 이러한 오류는 주로 클라이언트에서 잘못된 형식의 데이터를 전송할 때 발생합니다.

## 원인 분석
Pydantic Validation Error의 주요 원인은 다음과 같습니다:
1. **모델 정의 오류**: 필수 필드가 정의되어 있지만 클라이언트가 해당 필드를 포함하지 않음.
2. **잘못된 데이터 형식**: 데이터 타입이 모델에서 정의한 것과 다를 경우 발생.
3. **중복된 필드**: 여러 필드가 같은 이름을 가질 경우 발생할 수 있는 문제.

이러한 오류들은 API의 응답을 통해 쉽게 확인할 수 있습니다. 예를 들어, FastAPI에서 API 요청을 처리할 때 다음과 같은 로그를 통해 확인할 수 있습니다:

```
INFO:     127.0.0.1:8000 - "POST /user HTTP/1.1" 422 Unprocessable Entity
```

## 확인 명령어
Validation Error를 확인하기 위해서는 API 요청을 보내고 응답을 확인하는 것이 중요합니다. 다음은 `curl` 명령어를 사용하여 API 요청을 보내는 예시입니다:

```bash
curl -X POST "http://localhost:8000/user" \
-H "Content-Type: application/json" \
-d '{"password": "mypassword", "email": "test@example.com"}'
```

위의 요청은 `username` 필드를 포함하지 않으므로, Validation Error가 발생할 것입니다. 응답으로는 다음과 같은 오류 메시지가 반환됩니다:

![참고 이미지](/images/posts/pydantic-validation-error-해결-방법-00-658ba058.webp)

<small>이미지 출처: https://do-hyeon.tistory.com/entry/Fast-API-Endpoint-Validation-422-Error-Unprocessable-Entity</small>

```json
{
  "detail": [
    {
      "loc": ["body", "username"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

## 해결 절차
Validation Error를 해결하기 위해서는 다음과 같은 절차를 따르시면 됩니다:
1. **모델 정의 검토**: Pydantic 모델에서 필수 필드와 타입을 확인합니다.
2. **클라이언트 요청 검토**: 클라이언트에서 보내는 데이터가 모델의 요구 사항을 충족하는지 확인합니다.
3. **API 문서화**: API 문서를 통해 필수 필드와 데이터 형식을 명확히 합니다.
4. **예외 처리 추가**: Validation Error 발생 시 적절한 오류 메시지를 반환하도록 예외 처리를 추가합니다.

예를 들어, Pydantic 모델을 다음과 같이 정의할 수 있습니다:

```python
from pydantic import BaseModel, EmailStr

class UserInfo(BaseModel):
    username: str
    password: str
    email: EmailStr
```

이 모델을 기반으로 클라이언트가 요청을 보낼 때, 모든 필드를 포함하도록 요구해야 합니다.

## 흔한 실수
개발자들이 흔히 저지르는 실수 중 하나는 필수 필드를 누락하거나 잘못된 데이터 타입을 사용하는 것입니다. 예를 들어, `username` 필드를 문자열로 정의했지만 클라이언트가 숫자를 보내는 경우입니다. 이러한 실수를 방지하기 위해서는 다음과 같은 체크리스트를 활용할 수 있습니다:
- [ ] 모든 필수 필드가 클라이언트 요청에 포함되어 있는가?
- [ ] 데이터 타입이 모델에서 정의한 것과 일치하는가?
- [ ] API 문서가 최신 상태로 유지되고 있는가?

## 재발 방지 체크리스트
Pydantic Validation Error를 재발 방지하기 위해서는 다음과 같은 방법을 고려해보세요:
1. **모델 정의 시 주의**: 모델을 정의할 때 필수 필드와 데이터 타입을 명확히 하여 혼동을 줄입니다.
2. **API 테스트 자동화**: Postman이나 Swagger와 같은 도구를 사용하여 API 요청을 자동으로 테스트합니다.
3. **정기적인 코드 리뷰**: 팀 내에서 코드 리뷰를 통해 서로의 코드를 점검하고 오류를 사전에 발견합니다.
4. **에러 로깅**: 발생한 오류를 로그로 남겨서 추후 분석할 수 있도록 합니다.

이러한 절차와 체크리스트를 통해 Pydantic Validation Error를 예방하고, 발생 시 신속하게 해결할 수 있습니다.

## 참고한 자료

- [[Fast API\] Endpoint Validation (422 Error: Unprocessable Entity)](https://do-hyeon.tistory.com/entry/Fast-API-Endpoint-Validation-422-Error-Unprocessable-Entity)
