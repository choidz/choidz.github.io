# Prometheus Targets Down 문제의 원인과 해결 방법

---

## 증상 및 오류 메시지
Prometheus에서 특정 targets가 down 상태로 표시되는 경우가 있습니다. 이는 모니터링하고 있는 서비스나 애플리케이션이 정상적으로 작동하지 않거나, Prometheus가 해당 서비스와의 연결에 실패했음을 나타냅니다. Prometheus의 웹 UI에서 다음과 같은 메시지를 확인할 수 있습니다.

```
Target down: http://localhost:8080/actuator/prometheus
```

이 메시지는 Prometheus가 지정된 URL에서 메트릭을 수집할 수 없다는 것을 의미합니다. 이로 인해 대시보드에서 해당 메트릭을 시각화할 수 없게 됩니다.

## 대표적인 원인
Prometheus의 targets가 down 상태가 되는 원인은 다양합니다. 일반적으로 다음과 같은 이유들이 있습니다.
1. **서비스 비정상 종료**: 모니터링하고 있는 서비스가 비정상적으로 종료되었거나, 네트워크 문제로 인해 접근이 불가능한 경우입니다.
2. **잘못된 엔드포인트 설정**: Prometheus 설정 파일에서 지정한 메트릭 엔드포인트가 잘못되었거나, 서비스가 해당 엔드포인트를 노출하지 않는 경우입니다.
3. **네트워크 문제**: Prometheus 서버와 대상 서비스 간의 네트워크 연결이 불안정하거나 차단된 경우입니다.
4. **방화벽 설정**: 서비스가 실행되는 서버의 방화벽 설정에 의해 Prometheus의 접근이 차단된 경우입니다.

## 확인 명령어
문제를 진단하기 위해 다음의 명령어를 사용하여 서비스의 상태를 확인할 수 있습니다. 예를 들어, Spring Boot 애플리케이션의 메트릭 엔드포인트에 접근해 보겠습니다.

```
curl http://localhost:8080/actuator/prometheus
```

이 명령어를 통해 메트릭 데이터가 정상적으로 반환되는지 확인할 수 있습니다. 만약 오류가 발생한다면, 해당 서비스의 로그를 확인하여 원인을 파악해야 합니다.

## 해결 절차
문제를 해결하기 위해 다음과 같은 절차를 따라야 합니다.
1. **서비스 상태 확인**: 먼저, 모니터링하고 있는 서비스가 정상적으로 실행 중인지 확인합니다. 서비스가 중지된 경우, 재시작합니다.
2. **엔드포인트 확인**: Prometheus 설정 파일(`prometheus.yml`)에서 지정한 엔드포인트가 올바른지 확인합니다. 예를 들어, 설정 파일에서 다음과 같이 작성되어 있어야 합니다.

```yaml
scrape_configs:
  - job_name: 'my_app'
    static_configs:
      - targets: ['localhost:8080']
```

3. **네트워크 상태 점검**: Prometheus 서버와 대상 서비스 간의 네트워크 연결 상태를 점검합니다. `ping` 명령어를 사용하여 연결이 가능한지 테스트할 수 있습니다.

![참고 이미지](/images/posts/prometheus-targets-down-문제의-원인과-해결-방법-00-a17f6213.webp)

<small>이미지 출처: https://devlemon.tistory.com/30</small>

```
ping localhost
```

4. **방화벽 설정 확인**: 서비스가 실행되는 서버의 방화벽 설정을 확인하여 Prometheus의 접근을 허용하도록 설정합니다.

5. **로그 확인**: 서비스의 로그를 확인하여 오류 메시지를 찾아 원인을 분석합니다. 예를 들어, Spring Boot 애플리케이션의 로그를 확인할 수 있습니다.

```
cat /path/to/your/application.log | grep ERROR
```

## 흔한 실수
- **잘못된 엔드포인트 설정**: Prometheus 설정 파일에서 잘못된 URL을 지정하는 경우가 많습니다. 엔드포인트가 정확한지 다시 한 번 확인해야 합니다.
- **서비스가 실행되지 않음**: 서비스가 중지된 상태에서 Prometheus가 해당 서비스를 모니터링하려고 시도하는 경우입니다. 항상 서비스가 실행 중인지 확인해야 합니다.
- **네트워크 방화벽 설정**: 방화벽 설정이 잘못되어 Prometheus가 서비스에 접근할 수 없는 경우가 많습니다. 이를 미리 점검해야 합니다.

## 재발 방지 체크리스트
- [ ] Prometheus 설정 파일의 엔드포인트가 올바른지 확인하기
- [ ] 서비스가 항상 실행 중인지 모니터링하기
- [ ] 네트워크 상태를 정기적으로 점검하기
- [ ] 방화벽 설정을 주기적으로 확인하고 업데이트하기

이러한 절차를 통해 Prometheus의 targets가 down 상태가 되는 문제를 해결하고, 향후 재발을 방지할 수 있습니다. 모니터링 시스템의 안정성을 높이기 위해 정기적인 점검과 유지보수가 필요합니다.

![참고 이미지](/images/posts/prometheus-targets-down-문제의-원인과-해결-방법-01-7f30b2d3.webp)

<small>이미지 출처: https://devlemon.tistory.com/30</small>

---

## 참고한 자료

- [Spring Boot Actuator, Grafana & Prometheus 모니터링 구축 및 연결](https://devlemon.tistory.com/30)
- [Grafana 및 prometheus 활용 #1](https://cdchan.tistory.com/281)
