# Kibana 서버가 준비되지 않았습니다 오류 해결하기

---

## 증상
Kibana를 실행할 때 다음과 같은 오류 메시지를 확인할 수 있습니다.

```
Kibana server is not ready yet
```

이 메시지는 Kibana가 Elasticsearch 서버와 연결하지 못했을 때 발생합니다. 일반적으로 Kibana 대시보드에 접근하려고 할 때 이 오류가 발생하며, 이는 사용자에게 Kibana가 정상적으로 작동하지 않음을 알리는 신호입니다.

![참고 이미지](/images/posts/kibana-서버가-준비되지-않았습니다-오류-해결하기-00-ef524d62.png)

<small>이미지 출처: https://lima1016.tistory.com/187</small>

## 원인
이 오류의 주된 원인은 Kibana가 Elasticsearch에 연결할 수 없기 때문입니다. 다음과 같은 여러 가지 이유가 있을 수 있습니다:
1. Elasticsearch가 실행되고 있지 않거나, 잘못된 포트에서 실행되고 있는 경우
2. Kibana 설정 파일에서 Elasticsearch 호스트 주소가 잘못된 경우
3. 네트워크 방화벽이나 보안 그룹이 Elasticsearch에 대한 접근을 차단하는 경우
4. Elasticsearch의 클러스터 상태가 'red' 상태일 경우

이러한 원인을 확인하기 위해서는 Kibana와 Elasticsearch의 로그를 살펴보는 것이 중요합니다.

## 확인 명령어
Kibana와 Elasticsearch의 상태를 확인하기 위해 다음 명령어를 사용할 수 있습니다.

1. Elasticsearch 상태 확인:
   ```bash
   curl -X GET "http://localhost:9200/_cluster/health?pretty"
   ```
   이 명령어는 클러스터의 상태를 출력합니다. 정상적으로 실행되고 있다면 `"status" : "green"` 또는 `"status" : "yellow"`가 보여야 합니다.

2. Kibana 로그 확인:
   Kibana의 로그 파일을 확인하여 오류 메시지를 찾습니다. 로그 파일은 일반적으로 다음 경로에 위치합니다:
   ```bash
   /var/log/kibana/kibana.log
   ```

## 해결 절차
이제 문제를 해결하기 위한 절차를 설명하겠습니다.
1. **Elasticsearch 실행 확인**: Elasticsearch가 정상적으로 실행되고 있는지 확인합니다. 아래 명령어로 Elasticsearch의 상태를 체크합니다.
   ```bash
   curl -X GET "http://localhost:9200"
   ```
   정상적으로 실행되고 있다면 Elasticsearch의 버전 정보가 출력됩니다.

2. **Kibana 설정 파일 수정**: Kibana의 설정 파일인 `kibana.yml`을 열어 Elasticsearch 호스트 주소를 확인합니다. 다음과 같이 설정되어 있어야 합니다:
   ```yaml
   elasticsearch.hosts: ["http://localhost:9200"]
   ```
   만약 클러스터 환경에서 여러 노드를 사용하고 있다면, 해당 노드 주소를 모두 입력해야 합니다.

3. **방화벽 설정 확인**: 방화벽이나 보안 그룹 설정을 확인하여 Kibana가 Elasticsearch에 접근할 수 있도록 허용해야 합니다. 특히 AWS와 같은 클라우드 환경에서는 보안 그룹 설정을 확인하는 것이 중요합니다.

4. **Kibana 재시작**: 설정을 변경한 후에는 Kibana를 재시작하여 변경 사항을 적용해야 합니다.
   ```bash
   sudo systemctl restart kibana
   ```

5. **상태 재확인**: Kibana가 정상적으로 실행되는지 확인하기 위해 다시 웹 브라우저에서 Kibana 대시보드에 접속해 봅니다.

## 흔한 실수
Kibana 설정 시 흔히 발생하는 실수는 다음과 같습니다:
- Elasticsearch와 Kibana의 버전이 호환되지 않는 경우
- Kibana 설정 파일에서 오타가 있는 경우
- Elasticsearch가 실행되지 않은 상태에서 Kibana를 실행하려는 경우

## 재발 방지 체크리스트
1. Elasticsearch와 Kibana의 버전 호환성을 항상 확인합니다.
2. 설정 파일을 수정한 후에는 반드시 재시작합니다.
3. Kibana와 Elasticsearch의 로그를 주기적으로 확인하여 문제를 사전에 방지합니다.
4. 네트워크 방화벽 및 보안 그룹 설정을 정기적으로 점검합니다.

이러한 절차를 통해 Kibana 서버가 준비되지 않았다는 오류를 해결할 수 있습니다. 문제가 지속된다면, 추가적인 로그 분석이 필요할 수 있습니다.

---

## 참고한 자료

- [[Troubleshooting\] #1 Docker로 Elasticsearch node 2개 띄우기](https://lima1016.tistory.com/187)
- [Git 한글 깨짐 해결 + 원인](https://velog.io/@taekkim/Git-한글-깨짐-해결-원인)
