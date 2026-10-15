# Kibana에서 'No data views found' 오류 해결하기

## 증상 및 오류 메시지
Kibana를 사용하면서 'No data views found'라는 오류 메시지를 보게 되는 경우가 있습니다. 이 오류는 Kibana에서 데이터 뷰를 찾지 못할 때 발생하며, 일반적으로 인덱스 패턴이 설정되지 않았거나, Elasticsearch에 데이터가 없는 경우에 나타납니다. 이 문제는 Kibana를 통해 데이터를 시각화하려는 사용자가 자주 겪는 어려움 중 하나입니다.

## 원인
이 오류의 주된 원인은 다음과 같습니다:
1. **인덱스 패턴 미설정**: Kibana에서 데이터를 시각화하기 위해서는 먼저 인덱스 패턴을 설정해야 합니다. 이 설정이 이루어지지 않으면 Kibana는 어떤 데이터를 표시해야 할지 알 수 없습니다.
2. **Elasticsearch에 데이터 없음**: Elasticsearch에 데이터가 없거나, 데이터가 잘못된 형식으로 저장되어 있을 경우에도 이 오류가 발생할 수 있습니다.
3. **Kibana와 Elasticsearch 버전 불일치**: Kibana와 Elasticsearch의 버전이 맞지 않으면 데이터 뷰가 정상적으로 작동하지 않을 수 있습니다.

## 확인 명령어
이 문제를 해결하기 위해서는 몇 가지 명령어를 통해 상태를 점검할 수 있습니다. 다음의 명령어를 통해 Elasticsearch에 데이터가 있는지 확인해보세요:
```bash
curl -X GET "http://localhost:9200/_cat/indices?v"
```
이 명령어는 현재 인덱스의 상태를 보여줍니다. 만약 인덱스가 보이지 않는다면, 데이터가 없거나 인덱스가 생성되지 않은 것입니다.

## 해결 절차
1. **인덱스 패턴 설정**: Kibana의 설정에서 인덱스 패턴을 추가합니다. 이를 위해 Kibana 대시보드에 접속한 후, 'Management' > 'Index Patterns'로 이동하여 새로운 인덱스 패턴을 생성합니다. 예를 들어, `logstash-*`와 같은 패턴을 사용할 수 있습니다.
2. **데이터 확인**: Elasticsearch에 데이터가 있는지 확인합니다. 위에서 언급한 명령어를 사용하여 인덱스가 존재하는지 점검하고, 데이터가 존재하는지 확인합니다. 데이터가 없다면, 데이터를 Elasticsearch에 적재해야 합니다.
3. **버전 확인**: Kibana와 Elasticsearch의 버전이 호환되는지 확인합니다. 서로 다른 버전을 사용하고 있다면, 동일한 버전으로 맞추는 것이 좋습니다.

## 흔한 실수
- 인덱스 패턴을 설정할 때 와일드카드(*)를 잘못 사용하여 데이터가 검색되지 않는 경우가 많습니다. 예를 들어, `logstash-*` 대신 `logstash`와 같이 설정하면 데이터가 조회되지 않습니다.
- Elasticsearch에 데이터를 적재하는 과정에서 형식이 잘못되어 오류가 발생하는 경우도 있습니다. 데이터 형식이 Elasticsearch의 매핑과 일치하는지 확인해야 합니다.

## 재발 방지 체크리스트
- Kibana에 접근할 때마다 인덱스 패턴이 올바르게 설정되어 있는지 확인합니다.
- 정기적으로 Elasticsearch에 데이터가 적재되고 있는지 점검합니다.
- Kibana와 Elasticsearch의 버전이 호환되는지 주기적으로 확인합니다.
- 데이터가 올바른 형식으로 저장되고 있는지 검토합니다.

이와 같은 절차를 통해 'No data views found' 오류를 해결하고, Kibana를 통해 원활하게 데이터를 시각화할 수 있습니다.

## 실무 적용 체크리스트

- Kibana no data views found 해결을 적용하기 전에 현재 운영 환경의 기준값과 예외 상황을 먼저 정리합니다.
- 변경 전후로 확인할 지표를 정하고, 문제가 생겼을 때 되돌릴 수 있는 절차를 문서화합니다.
- 한 번에 모든 서버나 서비스에 적용하기보다 작은 범위에서 검증한 뒤 점진적으로 확대합니다.
- 담당자, 확인 시간, 장애 판단 기준을 명확히 남겨 같은 문제가 반복될 때 빠르게 대응할 수 있게 합니다.

![참고 이미지](/images/posts/kibana에서-no-data-views-found-오류-해결하기-00-a88a40c9.png)

<small>이미지 출처: https://sup-report.tistory.com/103</small>

## 참고한 자료

- [[Oracle\] ORA-01403: 데이터를 찾을 수 없습니다. NO DATA FOUND 에러 해결 방법 3가지](https://dev-handbook.tistory.com/17)
- [kohya_ss No data found. Please verify arguments 에러 해결방법](https://flatsun.tistory.com/3586)
- [[Oracle\] No Data Found 이슈 해결하기](https://sup-report.tistory.com/103)
