# Prometheus 쿼리 타임아웃 문제 해결하기

---

## 증상
Prometheus에서 쿼리를 실행할 때, 다음과 같은 타임아웃 오류 메시지가 발생할 수 있습니다:

```
Error: context deadline exceeded
```
이 오류는 쿼리 실행이 설정된 시간 내에 완료되지 않아 발생합니다. 일반적으로 쿼리의 복잡성이나 데이터 양이 많을 때 나타나는 현상입니다.

## 원인
쿼리 타임아웃의 원인은 여러 가지가 있을 수 있습니다:
1. **쿼리의 복잡성**: 복잡한 쿼리를 작성하면 실행 시간이 길어질 수 있습니다.
2. **데이터 양**: 대량의 데이터를 처리할 경우 쿼리 시간이 길어질 수 있습니다.
3. **Prometheus 설정**: 기본 타임아웃 설정이 짧게 되어 있을 수 있습니다.
4. **리소스 부족**: Prometheus 서버의 CPU나 메모리가 부족할 경우 쿼리 성능이 저하됩니다.

## 확인 명령어
쿼리 타임아웃 문제를 확인하기 위해 다음과 같은 명령어를 사용할 수 있습니다:

![post-thumbnail](/images/posts/prometheus-쿼리-타임아웃-문제-해결하기-00-1cfe0b91.png)

<small>이미지 출처: https://velog.io/@taekkim/Git-한글-깨짐-해결-원인</small>

1. **Prometheus 서버의 상태 확인**:
   ```bash
   kubectl get pods -n monitoring
   ```
   이 명령어를 통해 Prometheus Pod의 상태를 확인합니다. 만약 Pod가 CrashLoopBackOff 상태라면 리소스 문제일 수 있습니다.

2. **쿼리 실행 시간 확인**:
   Prometheus UI에서 쿼리를 실행하고, 쿼리 실행 시간을 확인합니다.

3. **Prometheus 설정 확인**:
   Prometheus의 설정 파일인 `prometheus.yml`에서 `query_timeout` 설정을 확인합니다.
   ```yaml
   query_timeout: 30s
   ```

## 해결 절차
쿼리 타임아웃 문제를 해결하기 위한 절차는 다음과 같습니다:
1. **쿼리 최적화**: 쿼리를 간소화하거나, 필요한 데이터만 선택하도록 수정합니다. 예를 들어, `rate()` 함수 사용 시 범위를 줄이는 것이 좋습니다.
   ```promql
   rate(http_requests_total[5m])
   ```

![참고 이미지](/images/posts/prometheus-쿼리-타임아웃-문제-해결하기-01-a93e5124.png)

<small>이미지 출처: https://velog.io/@jujini31/사용자-경험을-생각한-지도-개발-NAVER-지도-API-V3-마커폴리라인</small>

2. **Prometheus 설정 변경**: `prometheus.yml` 파일에서 `query_timeout` 값을 늘립니다. 예를 들어, 30초에서 60초로 변경할 수 있습니다.
   ```yaml
   query_timeout: 60s
   ```

3. **리소스 할당 증가**: Prometheus 서버에 더 많은 CPU 및 메모리를 할당합니다. Kubernetes 환경에서는 다음과 같이 설정할 수 있습니다:
   ```yaml
   resources:
     requests:
       memory: "1Gi"
       cpu: "500m"
     limits:
       memory: "2Gi"
       cpu: "1"
   ```

4. **쿼리 캐시 사용**: 쿼리 캐시를 활성화하여 자주 사용하는 쿼리의 성능을 개선할 수 있습니다. Grafana와 함께 사용할 경우, Grafana의 쿼리 캐시 설정을 확인합니다.

5. **모니터링 및 경고 설정**: 쿼리 타임아웃 문제를 예방하기 위해 Prometheus의 Alertmanager를 사용하여 쿼리 실패에 대한 경고를 설정합니다. 예를 들어:
   ```yaml
   groups:
   - name: query-errors
     rules:
     - alert: PrometheusQueryTimeout
       expr: rate(prometheus_engine_query_duration_seconds{status="error"}[5m]) > 0
       for: 5m
       labels:
         severity: critical
       annotations:
         summary: "Prometheus query timeout detected"
   ```

## 재발 방지 체크리스트
1. 쿼리 최적화 및 간소화
2. 적절한 `query_timeout` 설정
3. 충분한 리소스 할당
4. 쿼리 캐시 활성화
5. 모니터링 및 경고 시스템 구축

이러한 절차를 통해 Prometheus의 쿼리 타임아웃 문제를 해결하고, 재발을 방지할 수 있습니다. Prometheus와 Grafana를 효과적으로 활용하여 안정적인 모니터링 환경을 구축해보세요.

## 실무 적용 체크리스트

- Prometheus query timeout 해결을 적용하기 전에 현재 운영 환경의 기준값과 예외 상황을 먼저 정리합니다.
- 변경 전후로 확인할 지표를 정하고, 문제가 생겼을 때 되돌릴 수 있는 절차를 문서화합니다.
- 한 번에 모든 서버나 서비스에 적용하기보다 작은 범위에서 검증한 뒤 점진적으로 확대합니다.
- 담당자, 확인 시간, 장애 판단 기준을 명확히 남겨 같은 문제가 반복될 때 빠르게 대응할 수 있게 합니다.

---

## 참고한 자료

- [[IHOS 1기\] 6주차 - 운영, 튜닝](https://gylee815.tistory.com/35)
- [관측성과 OpenTelemetry, Grafana, Loki, Tempo 알아보기](https://devstudy-record.tistory.com/100)
- [Git 한글 깨짐 해결 + 원인](https://velog.io/@taekkim/Git-한글-깨짐-해결-원인)
- [사용자 경험을 생각한 지도 개발: NAVER 지도 API V3 마커/폴리라인](https://velog.io/@jujini31/사용자-경험을-생각한-지도-개발-NAVER-지도-API-V3-마커폴리라인)
- [[TS\] Cannot find module 오류 해결하기](https://velog.io/@jsi06138/TS-Cannot-find-module-오류-해결하기)
