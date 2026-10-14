# Kafka Consumer Lag 급증 원인과 해결 방법

## 증상: Kafka Consumer Lag 급증

최근 운영 중인 Kafka 시스템에서 Consumer Lag이 급증하는 문제가 발생했습니다. 이로 인해 데이터 처리 지연이 발생하고, 최종 사용자에게 서비스 품질 저하로 이어질 수 있습니다. 예를 들어, 특정 토픽의 Lag 수치가 50만 건을 초과하면서 실시간 데이터 처리에 심각한 영향을 미쳤습니다. 이와 같은 상황에서는 즉각적인 원인 분석과 해결이 필요합니다.

![카프카 컨슈머 지연(Lag) 해결 가이드: 데이터 적체 현상 분석부터 실무 근본 대책까지](/images/posts/kafka-consumer-lag-급증-원인과-해결-방법-00-bfdd7bb7.jpg)

<small>이미지 출처: https://rodangdong.tistory.com/505</small>

## 원인 분석: 왜 데이터는 쌓이기만 하는가?

Kafka Consumer Lag의 급증 원인은 여러 가지가 있습니다. 첫 번째로, **컨슈머 로직의 병목**이 있습니다. 메시지를 처리하는 과정에서 외부 API 호출이나 무거운 DB 트랜잭션이 포함되면, 처리 시간이 길어져 Lag이 발생할 수 있습니다. 둘째, **리밸런싱** 문제가 있습니다. 컨슈머가 메시지를 처리하는 시간이 설정된 최대 시간(`max.poll.interval.ms`)을 초과하면, Kafka는 해당 컨슈머를 죽은 것으로 판단하고 리밸런싱을 수행하게 됩니다. 이 과정에서 데이터 처리가 중단됩니다. 마지막으로, **포이즌 필 메시지**가 문제를 일으킬 수 있습니다. 잘못된 형식의 메시지가 유입되어 컨슈머가 에러를 발생시키며, 이로 인해 정상 메시지 처리도 지연됩니다.

![왜 데이터는 쌓이기만 하는가?](/images/posts/kafka-consumer-lag-급증-원인과-해결-방법-01-df027e61.jpg)

<small>이미지 출처: https://rodangdong.tistory.com/505</small>

## 확인 명령어: Lag 상태 점검

Kafka Consumer Lag을 확인하기 위해 다음 명령어를 사용할 수 있습니다. 이 명령어는 현재 Consumer Group의 Lag 상태를 보여줍니다.

```bash
kafka-consumer-groups.sh --bootstrap-server localhost:9092 --describe --group your-consumer-group
```

이 명령어를 통해 각 파티션의 Lag 상태를 확인하고, 문제가 발생한 파티션을 파악할 수 있습니다.

## 해결 절차: Lag 문제 해결하기

1. **컨슈머 수평 확장**: 가장 즉각적인 해결책은 컨슈머 인스턴스를 늘려 병렬 처리 능력을 향상시키는 것입니다. 파티션 수에 맞춰 컨슈머를 조정하여 처리 속도를 높일 수 있습니다.

2. **로직 비동기화 및 벌크 처리**: 동기적으로 처리하던 로직을 비동기로 전환하여 메시지 처리 속도를 높입니다. 예를 들어, Java의 `CompletableFuture`를 사용해 비동기 처리를 구현할 수 있습니다.

   ```java
   public void consume(ConsumerRecord<String, String> record) {
       CompletableFuture.runAsync(() -> {
           processOrder(record.value());
       }, customExecutor);
   }
   ```

3. **오프셋 강제 이동**: 데이터 정합성이 덜 중요한 경우, 쌓인 데이터를 무시하고 오프셋을 최신으로 밀어내는 방법도 있습니다. 다음 명령어를 사용하여 특정 그룹의 오프셋을 최신으로 조정할 수 있습니다.

   ```bash
   kafka-consumer-groups.sh --bootstrap-server localhost:9092 --group your-consumer-group --topic your-topic --reset-offsets --to-latest --execute
   ```

## 재발 방지: 모니터링 및 예방 전략

Lag 문제가 재발하지 않도록 하기 위해서는 다음과 같은 예방 조치를 고려해야 합니다. 첫째, **임계치 기반 알람**을 설정하여 Lag의 증가 속도를 모니터링합니다. 둘째, **데드 레터 큐(DLQ)**를 도입하여 처리 실패 메시지를 별도로 관리합니다. 마지막으로, **서버 자동 점검 시스템**을 구축하여 인프라의 건강 상태를 수시로 체크하는 것도 중요합니다. 이러한 전략을 통해 시스템의 안정성을 높이고, 유사한 문제가 발생하는 것을 방지할 수 있습니다.

## 흔한 실수: 주의할 점

운영 중 흔히 발생하는 실수 중 하나는 컨슈머를 파티션 수보다 많이 늘리는 것입니다. 남는 컨슈머는 유휴 상태로 대기하게 되어 자원 낭비가 발생합니다. 또한, 리밸런싱을 줄이기 위해 설정값을 조정하는 것도 중요합니다. `max.poll.interval.ms`를 적절히 설정하고, `max.poll.records`의 양을 줄여 빠른 처리를 유도해야 합니다. 마지막으로, TCP 수준에서의 지연도 Lag의 원인이 될 수 있으므로, 네트워크 상태를 주기적으로 점검하는 것이 필요합니다.

이상으로 Kafka Consumer Lag의 급증 원인과 해결 방법에 대해 알아보았습니다. 이러한 내용을 바탕으로 시스템을 점검하고, 안정적인 서비스 운영을 이어나가시기 바랍니다.

## 참고한 자료

- [카프카 컨슈머 지연(Lag) 해결 가이드: 데이터 적체 현상 분석부터 실무 근본 대책까지](https://rodangdong.tistory.com/505)
