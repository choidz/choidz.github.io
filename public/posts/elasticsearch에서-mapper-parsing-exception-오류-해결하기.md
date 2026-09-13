# Elasticsearch에서 mapper_parsing_exception 오류 해결하기

## 증상 및 오류 메시지
Elasticsearch를 사용하다 보면 `mapper_parsing_exception` 오류를 경험할 수 있습니다. 이 오류는 일반적으로 인덱스에 문서를 추가하거나 업데이트할 때 발생하며, 잘못된 데이터 형식이나 매핑에 맞지 않는 값이 포함되어 있을 때 나타납니다. 예를 들어, 숫자형 필드에 문자열을 삽입하려고 할 때 발생할 수 있습니다. 오류 메시지는 다음과 유사합니다:

```
{
  "error": {
    "root_cause": [
      {
        "type": "mapper_parsing_exception",
        "reason": "failed to parse [field_name]"
      }
    ],
    "type": "mapper_parsing_exception",
    "reason": "failed to parse [field_name]"
  },
  "status": 400
}
```

이 오류는 데이터가 Elasticsearch의 매핑 설정과 일치하지 않을 때 발생합니다. 예를 들어, 매핑에서 `integer`로 설정된 필드에 `string` 값을 입력하면 이 오류가 발생합니다.

## 원인
`mapper_parsing_exception`의 주된 원인은 다음과 같습니다:
1. **잘못된 데이터 유형**: 매핑된 필드에 맞지 않는 데이터 유형이 입력된 경우.
2. **매핑 설정 오류**: 필드의 매핑이 잘못 설정된 경우.
3. **누락된 필드**: 필드가 매핑에 정의되어 있으나, 요청된 데이터에 포함되지 않은 경우.

이러한 원인을 확인하기 위해서는 먼저 매핑 설정을 검토하고, 입력하려는 데이터의 형식을 점검해야 합니다.

## 확인 명령어
문제가 발생한 인덱스의 매핑을 확인하기 위해 다음 명령어를 사용할 수 있습니다:

```bash
GET /your_index/_mapping
```

이 명령어는 해당 인덱스의 필드와 데이터 유형을 보여줍니다. 매핑을 확인한 후, 입력하려는 데이터의 형식이 매핑과 일치하는지 확인해야 합니다.

## 해결 절차
1. **매핑 확인**: 위의 명령어를 사용하여 인덱스의 매핑을 확인합니다.
2. **데이터 형식 검토**: 입력할 데이터의 형식이 매핑과 일치하는지 점검합니다. 예를 들어, 문자열을 숫자로 변환하거나, 필드의 형식을 수정합니다.
3. **필드 추가 또는 수정**: 필요한 경우 매핑을 수정하거나, 새로운 필드를 추가합니다. 매핑을 수정한 후에는 인덱스를 재생성해야 할 수 있습니다.
4. **재시도**: 수정된 매핑과 데이터 형식으로 다시 요청을 시도합니다.

예를 들어, 다음과 같이 매핑을 수정할 수 있습니다:

```bash
PUT /your_index/_mapping
{
  "properties": {
    "field_name": {
      "type": "text"
    }
  }
}
```

## 흔한 실수
- **형식 불일치**: 매핑에서 정의된 데이터 유형과 입력 데이터의 유형이 일치하지 않는 경우가 많습니다. 예를 들어, `date` 타입 필드에 문자열을 입력하는 경우입니다.
- **매핑 변경 후 인덱스 재생성 누락**: 매핑을 변경한 후 인덱스를 재생성하지 않으면 여전히 이전 매핑이 적용됩니다.

## 재발 방지 체크리스트
- 매핑을 변경할 때는 항상 새로운 인덱스를 생성하여 테스트합니다.
- 데이터 입력 시, 매핑에 정의된 데이터 유형을 철저히 검토합니다.
- 인덱스의 매핑과 데이터를 주기적으로 검토하여 일관성을 유지합니다.
- 데이터 삽입 전, JSON 데이터의 형식을 검증하는 스크립트를 작성하여 자동화합니다.

이러한 절차와 체크리스트를 통해 `mapper_parsing_exception` 오류를 예방하고, 발생 시 신속하게 해결할 수 있습니다. Elasticsearch를 효과적으로 활용하기 위해서는 매핑과 데이터 형식에 대한 이해가 필수적입니다.

![참고 이미지](/images/posts/elasticsearch에서-mapper-parsing-exception-오류-해결하기-01-3e350685.png)

<small>이미지 출처: https://elsboo.tistory.com/87</small>

## 실무 적용 체크리스트

- Elasticsearch mapper_parsing_exception 해결을 적용하기 전에 현재 운영 환경의 기준값과 예외 상황을 먼저 정리합니다.
- 변경 전후로 확인할 지표를 정하고, 문제가 생겼을 때 되돌릴 수 있는 절차를 문서화합니다.
- 한 번에 모든 서버나 서비스에 적용하기보다 작은 범위에서 검증한 뒤 점진적으로 확대합니다.
- 담당자, 확인 시간, 장애 판단 기준을 명확히 남겨 같은 문제가 반복될 때 빠르게 대응할 수 있게 합니다.

![참고 이미지](/images/posts/elasticsearch에서-mapper-parsing-exception-오류-해결하기-00-24579ba4.png)

<small>이미지 출처: https://elsboo.tistory.com/87</small>

## 참고한 자료

- [[ElasticSearch\] update_by_query version_conflict_engine_exception & update 쿼리 비교](https://elsboo.tistory.com/87)
