# Elasticsearch에서 Heap Memory 부족 문제 해결하기

## 증상 및 오류 메시지
Elasticsearch를 운영하다 보면 Heap Memory 부족으로 인한 다양한 문제가 발생할 수 있습니다. 가장 일반적인 증상은 `java.lang.OutOfMemoryError: Java heap space` 오류입니다. 이 오류는 JVM이 더 이상 메모리를 할당할 수 없을 때 발생하며, Elasticsearch의 성능 저하와 서비스 중단을 초래할 수 있습니다. 또한, GC(Garbage Collection) 시간이 비정상적으로 증가하거나, 노드가 응답하지 않는 현상도 나타날 수 있습니다.

## 원인 분석
Heap Memory 부족의 주요 원인은 다음과 같습니다. 첫째, Elasticsearch에서 처리하는 데이터의 양이 증가하면서 Heap Memory가 고갈될 수 있습니다. 둘째, 잘못된 쿼리나 비효율적인 데이터 처리로 인해 메모리 사용량이 급증할 수 있습니다. 셋째, JVM의 메모리 설정이 부족할 경우에도 이러한 문제가 발생할 수 있습니다. 마지막으로, 메모리 누수나 GC 설정의 비효율성도 Heap Memory 부족의 원인이 될 수 있습니다.

## 확인 명령어
Heap Memory 사용량을 확인하기 위해 다음 명령어를 사용할 수 있습니다. 이 명령어는 현재 JVM의 메모리 사용량을 확인하는 데 유용합니다.

```bash
curl -X GET "http://localhost:9200/_cat/nodes?v&h=name,heap.percent,heap.max"
```

이 명령어를 통해 각 노드의 Heap Memory 사용 비율과 최대 Heap Memory를 확인할 수 있습니다. 만약 Heap Memory 사용 비율이 80%를 초과한다면, 메모리 부족 문제를 의심해볼 필요가 있습니다.

![Elasticsearch heap memory 부족 해결 기술 다이어그램](/images/posts/elasticsearch에서-heap-memory-부족-문제-해결하기-00-generated.svg)

## 해결 절차
Heap Memory 부족 문제를 해결하기 위한 절차는 다음과 같습니다. 첫 번째로, JVM의 Heap Memory 크기를 조정합니다. Elasticsearch의 `jvm.options` 파일에서 다음과 같이 설정할 수 있습니다.

```bash
-Xms2g
-Xmx2g
```

여기서 `-Xms`는 초기 Heap 크기, `-Xmx`는 최대 Heap 크기를 의미합니다. 필요에 따라 이 값을 조정하여 메모리를 늘릴 수 있습니다. 두 번째로, Elasticsearch의 데이터 처리 방식을 최적화합니다. 예를 들어, 대량의 데이터를 한 번에 처리하기보다는 배치로 나누어 처리하도록 합니다. 세 번째로, 메모리 누수를 방지하기 위해 주기적으로 애플리케이션을 점검하고, 불필요한 객체를 제거합니다.

## 흔한 실수
Heap Memory 부족 문제를 해결하는 과정에서 흔히 발생하는 실수는 JVM의 Heap Memory 크기를 과도하게 늘리는 것입니다. 이는 일시적인 해결책일 뿐, 근본적인 문제를 해결하지 못할 수 있습니다. 또한, Elasticsearch의 설정을 변경한 후에는 반드시 클러스터를 재시작해야 한다는 점을 간과하기 쉽습니다.

## 재발 방지 체크리스트
1. **Heap Memory 설정 점검**: JVM의 Heap Memory 설정을 주기적으로 점검하고 적절한 크기로 조정합니다.
2. **쿼리 최적화**: 비효율적인 쿼리를 점검하고, 필요한 경우 최적화합니다.
3. **모니터링 도구 활용**: `Prometheus`, `Grafana`와 같은 모니터링 도구를 사용하여 메모리 사용량을 지속적으로 모니터링합니다.
4. **정기적인 점검**: 메모리 누수나 비효율적인 데이터 처리 패턴을 정기적으로 점검하여 문제를 사전에 예방합니다.

이와 같은 절차를 통해 Elasticsearch의 Heap Memory 부족 문제를 효과적으로 해결하고, 재발 방지에 기여할 수 있습니다.

## 참고한 자료

- [Out-of-Memory(OOM)는 왜 발생하고, 어떻게 예방할까?](https://javacatcher.tistory.com/161)
- [JAVA metaspace OOM(Out Of Memory) 현상 원인 및 해결방법](https://betwe.tistory.com/entry/JAVA-metaspace-OOMOut-Of-Memory-%ED%98%84%EC%83%81-%EC%9B%90%EC%9D%B8-%EB%B0%8F-%ED%95%B4%EA%B2%B0%EB%B0%A9%EB%B2%95)
- [[7\] 운영 도중 발생하는 장애 대응](https://elsboo.tistory.com/80)
