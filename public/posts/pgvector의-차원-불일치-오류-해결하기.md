# pgvector의 차원 불일치 오류 해결하기

## 증상 및 오류 메시지
pgvector를 사용하여 임베딩 데이터를 추가하는 과정에서 자주 발생하는 오류는 `expected 1536 dimensions, not 768`입니다. 이 오류는 데이터베이스에 저장하려는 벡터의 차원이 설정된 차원과 일치하지 않을 때 발생합니다. 예를 들어, OpenAI의 임베딩 모델을 사용하여 생성한 벡터가 768차원인 경우, 데이터베이스에 1536차원으로 설정된 테이블에 추가하려고 하면 이와 같은 오류가 발생하게 됩니다. 이와 함께 `Unknown type vector`라는 오류도 발생할 수 있으며, 이는 pgvector 확장이 제대로 설치되지 않았거나 초기화되지 않았을 때 나타납니다.

## 원인 분석
이 오류의 주된 원인은 다음과 같습니다. 첫째, pgvector 확장이 데이터베이스에 설치되지 않았거나, 스키마 초기화가 이루어지지 않은 경우입니다. 둘째, 임베딩 모델이 반환하는 벡터의 차원이 데이터베이스에 설정된 차원과 일치하지 않을 경우입니다. 예를 들어, `nomic-embed-text` 모델은 768차원 벡터를 반환하는데, 데이터베이스에서 1536차원으로 설정되어 있으면 충돌이 발생합니다.

## 확인 명령어
오류를 확인하기 위해 다음 명령어를 사용하여 pgvector 확장이 설치되어 있는지 확인할 수 있습니다.
```sql
SELECT extname FROM pg_extension;
```
또한, 테이블이 존재하는지 확인하기 위해 다음 명령어를 사용할 수 있습니다.
```sql
SELECT to_regclass('public.vector_store');
```
이 명령어를 실행했을 때 `NULL`이 반환되면 테이블이 존재하지 않는 것입니다.

## 해결 절차
1. **pgvector 확장 설치**: 데이터베이스에 pgvector 확장이 설치되어 있는지 확인합니다. 설치되어 있지 않다면 다음 명령어로 설치합니다.
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
2. **스키마 초기화 설정**: Spring Boot의 설정 파일에서 `initialize-schema`를 `true`로 설정하여 스키마를 초기화합니다. 이 설정이 없으면 테이블이 생성되지 않습니다.
   ```yaml
   spring:
     ai:
       vectorstore:
         pgvector:
           initialize-schema: true
   ```
3. **차원 설정 확인**: 사용하려는 임베딩 모델의 차원과 데이터베이스의 차원이 일치하는지 확인합니다. 예를 들어, `nomic-embed-text` 모델을 사용할 경우 데이터베이스의 차원도 768로 설정해야 합니다. 설정 파일에서 다음과 같이 수정합니다.
   ```yaml
   spring:
     ai:
       vectorstore:
         pgvector:
           dimensions: 768
   ```
4. **테이블 생성 후 재시도**: 설정을 수정한 후 애플리케이션을 재시작하여 테이블이 생성되고 벡터가 올바르게 추가되는지 확인합니다.

## 흔한 실수
- **차원 불일치**: 임베딩 모델의 차원과 데이터베이스의 차원을 일치시키지 않으면 오류가 발생합니다. 항상 사용하려는 모델의 차원을 확인하고 설정해야 합니다.
- **스키마 초기화 누락**: `initialize-schema` 설정을 누락하면 테이블이 생성되지 않아 `Unknown type vector` 오류가 발생할 수 있습니다.

## 재발 방지 체크리스트
- [ ] pgvector 확장이 설치되어 있는지 확인하였는가?
- [ ] 데이터베이스의 차원이 임베딩 모델의 차원과 일치하는가?
- [ ] 스키마 초기화 설정이 제대로 되어 있는가?
- [ ] 애플리케이션을 재시작하여 변경 사항이 반영되었는가?

이와 같은 절차를 통해 pgvector의 차원 불일치 오류를 해결하고, 향후 발생할 수 있는 문제를 예방할 수 있습니다. 개발 환경에서 이러한 오류를 미리 방지하는 것이 중요하므로, 설정을 꼼꼼히 확인하는 습관을 가지는 것이 좋습니다.

## 실무 적용 체크리스트

- pgvector different vector dimensions 오류 해결을 적용하기 전에 현재 운영 환경의 기준값과 예외 상황을 먼저 정리합니다.
- 변경 전후로 확인할 지표를 정하고, 문제가 생겼을 때 되돌릴 수 있는 절차를 문서화합니다.
- 한 번에 모든 서버나 서비스에 적용하기보다 작은 범위에서 검증한 뒤 점진적으로 확대합니다.
- 담당자, 확인 시간, 장애 판단 기준을 명확히 남겨 같은 문제가 반복될 때 빠르게 대응할 수 있게 합니다.

![initialize-schema가 켜져야 테이블을 만들고, 테이블이 이미 있으면 기존 컬럼 크기를 유지해 새 dimensions를 무시한다](/images/posts/pgvector의-차원-불일치-오류-해결하기-00-96d978f0.png)

<small>이미지 출처: https://ttukttak-it.tistory.com/entry/Spring-AI-20-pgvector-Ollama-%EC%9E%84%EB%B2%A0%EB%94%A9-%EC%A1%B0%ED%95%A9-dimensions-%EB%B6%88%EC%9D%BC%EC%B9%98-%EC%98%A4%EB%A5%98%EC%99%80-%EC%B2%AB-%EC%84%A4%EC%A0%95-%ED%95%A8%EC%A0%95</small>

## 참고한 자료

- [Spring AI 2.0 pgvector + Ollama 임베딩 조합: dimensions 불일치 오류와 첫 설정 함정](https://ttukttak-it.tistory.com/entry/Spring-AI-20-pgvector-Ollama-%EC%9E%84%EB%B2%A0%EB%94%A9-%EC%A1%B0%ED%95%A9-dimensions-%EB%B6%88%EC%9D%BC%EC%B9%98-%EC%98%A4%EB%A5%98%EC%99%80-%EC%B2%AB-%EC%84%A4%EC%A0%95-%ED%95%A8%EC%A0%95)
