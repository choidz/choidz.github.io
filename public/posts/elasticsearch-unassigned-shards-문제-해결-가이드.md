# Elasticsearch Unassigned Shards 문제 해결 가이드

---

## 증상 및 오류 메시지
Elasticsearch 클러스터에서 Unassigned Shards가 발생하면, 클러스터의 상태가 'red'로 표시됩니다. 이 상태는 일부 primary shard가 할당되지 않았음을 의미하며, 데이터 접근이 불가능한 상황이 발생할 수 있습니다. 클러스터 상태를 확인하기 위해 아래 명령어를 사용할 수 있습니다.

```
$ curl -X GET "localhost:9200/_cluster/health?pretty"
```

이 명령어를 실행했을 때 다음과 같은 결과가 출력될 수 있습니다:

```
{
  "cluster_name" : "my-cluster",
  "status" : "red",
  "active_primary_shards" : 10,
  "active_shards" : 10,
  "unassigned_shards" : 5
}
```

이와 같은 결과는 클러스터의 일부 primary shard가 할당되지 않았음을 나타냅니다.

## 원인 분석
Unassigned Shards가 발생하는 원인은 여러 가지가 있습니다. 대표적인 원인은 다음과 같습니다:
1. **노드 수 부족**: 클러스터에 비해 인덱스의 수가 너무 많거나, 노드 수가 부족한 경우 발생할 수 있습니다.
2. **디스크 공간 부족**: 노드의 디스크 공간이 부족하여 새로운 shard를 할당할 수 없는 경우입니다.
3. **Replica 설정 문제**: replica shard의 수가 너무 많아 할당할 수 있는 노드가 부족한 경우입니다.
4. **네트워크 문제**: 노드 간의 네트워크 연결 문제로 인해 shard가 할당되지 않을 수 있습니다.
5. **클러스터 버전 불일치**: 클러스터 내의 Elasticsearch 버전이 서로 다를 경우 발생할 수 있습니다.

## 확인 명령어
Unassigned Shards의 상태를 확인하기 위해 다음 명령어를 사용할 수 있습니다:

```
$ curl -X GET "localhost:9200/_cat/shards?v=true&s=i&pretty"
```

이 명령어를 통해 각 shard의 상태와 원인을 확인할 수 있습니다. 예를 들어, 다음과 같은 출력이 나타날 수 있습니다:

```
index                      shard prirep state      node       unassigned.reason
my-index                   0     p      UNASSIGNED  -          NO_VALID_SHARD_COPY
my-index                   0     r      UNASSIGNED  -          NO_VALID_SHARD_COPY
```

## 해결 절차
Unassigned Shards 문제를 해결하기 위해 다음과 같은 절차를 따를 수 있습니다:
1. **불필요한 인덱스 삭제**: 사용하지 않는 인덱스를 삭제하여 공간을 확보합니다. 삭제 명령어는 다음과 같습니다:
   
   ```
   $ curl -X DELETE "localhost:9200/my-index"
   ```

2. **Replica 수 조정**: replica shard의 수를 줄이거나, 단일 노드 환경에서는 replica 수를 0으로 설정합니다. 설정 파일에서 다음과 같이 수정할 수 있습니다:
   
   ```json
   {
     "index": {
       "number_of_replicas": 0
     }
   }
   ```

3. **노드 추가**: 클러스터에 노드를 추가하여 shard를 할당할 수 있는 공간을 확보합니다.

4. **디스크 공간 확인**: 각 노드의 디스크 공간을 확인하고 부족한 경우 추가 저장소를 연결합니다. 확인 명령어는 다음과 같습니다:
   
   ```
   $ curl -X GET "localhost:9200/_cat/allocation?v"
   ```

5. **클러스터 상태 확인**: 모든 조치를 취한 후 클러스터 상태를 다시 확인하여 문제가 해결되었는지 확인합니다:
   
   ```
   $ curl -X GET "localhost:9200/_cluster/health?pretty"
   ```

## 흔한 실수
- **Replica 수를 과도하게 설정**: 단일 노드 환경에서 replica 수를 설정하면 shard 할당에 실패할 수 있습니다.
- **디스크 공간 부족을 간과**: 디스크 공간이 부족한 경우, shard 할당이 실패하므로 항상 확인해야 합니다.

## 재발 방지 체크리스트
1. 클러스터의 인덱스 수와 shard 수를 모니터링합니다.
2. 주기적으로 디스크 공간을 확인하고, 필요시 확장합니다.
3. 클러스터의 노드 수를 적절히 조정하여 성능을 최적화합니다.
4. Elasticsearch 버전이 일치하는지 확인하고, 업데이트를 주기적으로 수행합니다.

이와 같은 절차를 통해 Elasticsearch에서 발생하는 Unassigned Shards 문제를 효과적으로 해결할 수 있습니다. 클러스터의 안정성을 높이기 위해 정기적인 점검과 관리를 권장합니다.

---

## 참고한 자료

- [트러블슈팅: APM 서버가 Health Status Red 인 문제 해결](https://dorito-dev.tistory.com/92)
