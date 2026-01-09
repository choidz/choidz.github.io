# RabbitMQ Consumer 장애 패턴 Top 5

---

RabbitMQ 장애를 여러 번 겪다 보면 공통점이 보입니다. 대부분의 문제는 RabbitMQ 자체가 아니라, **메시지를 처리하는 Consumer 쪽에서 반복적으로 발생** 합니다.

이 글에서는 **운영 환경에서 실제로 가장 많이 발생하는 Consumer 장애 패턴 5가지** 를 증상 → 원인 → 확인 방법 → 대응 방법 순서로 정리했습니다.

---

**🔥 장애 패턴 1. Consumer 프로세스가 죽어 있음**

**가장 흔한 패턴** 이자, 가장 먼저 의심해야 할 상황입니다.

**증상**

• Queue 메시지가 계속 증가

• Ready 메시지만 증가

• RabbitMQ 화면에서 Consumers = 0

**원인**

• OOM (메모리 부족)

• 예외 발생 후 프로세스 종료

• 배포 중 서비스 미기동

**확인 방법**

ps -ef | grep java systemctl status consumer-service 

**대응 방법**

• Consumer 재기동

• 메모리 옵션(-Xmx) 확인

• 배포 후 기동 여부 체크

---

**🔥 장애 패턴 2. 특정 메시지에서 처리 로직이 멈춤 (Poison Message)**

메시지 하나가 문제를 일으켜 전체 처리를 막아버리는 케이스입니다.

**증상**

• Unacked 메시지가 계속 유지

• Queue가 줄지 않음

• 같은 로그가 반복 출력

**원인**

• 특정 데이터 형식 오류

• NullPointerException

• 예외 발생 후 ACK 미전송

**확인 방법**

• Consumer 로그에서 동일 메시지 반복 여부 확인

**대응 방법**

• try-catch 보강

• 실패 메시지 skip 처리

• Dead Letter Queue(DLQ) 도입

---

**🔥 장애 패턴 3. DB Deadlock 또는 외부 API 지연**

Consumer는 살아 있지만, 내부에서 오래 붙잡혀 있는 상태입니다.

**증상**

• Unacked 메시지 증가

• Consumer는 실행 중

• 처리 속도 급격히 저하

**원인**

• DB Deadlock

• 외부 API timeout

• 네트워크 지연

**확인 방법**

• Consumer 로그에서 DB / timeout 에러 확인

• APM(Pinpoint 등)에서 응답 시간 확인

**대응 방법**

• DB 트랜잭션 범위 축소

• timeout 설정 명시

• 재시도 로직에 제한 추가

---

**🔥 장애 패턴 4. 처리량 부족 (Consumer 수가 적음)**

장애처럼 보이지만 사실은 **구조적인 병목** 입니다.

**증상**

• Ready와 Unacked가 모두 증가

• 처리 중이긴 하나 속도가 따라가지 못함

**원인**

• Consumer 인스턴스 수 부족

• Prefetch 설정이 너무 큼

**확인 방법**

• RabbitMQ 메시지 유입량 vs 처리량 비교

**대응 방법**

• Consumer 스케일 아웃

• Prefetch Count 조정

• 처리 로직 성능 개선

---

**🔥 장애 패턴 5. ACK 로직 누락 또는 잘못된 위치**

개발 단계에서 가장 많이 실수하는 부분입니다.

**증상**

• Consumer는 정상 실행

• 메시지는 처리된 것 같지만 Queue 유지

• Unacked 메시지 지속

**원인**

• 예외 발생 시 ACK 미전송

• ACK를 너무 늦게 호출

• Auto ACK 설정 오해

**확인 방법**

• Consumer 코드에서 ACK 위치 확인

**대응 방법**

• finally 블록에서 ACK 처리 검토

• Auto ACK 사용 시 위험성 인지

• 명시적 ACK 권장

---

**📊 장애 유형별 빠른 판별표**

**Ready만 증가** → Consumer 없음 또는 죽음

**Unacked만 증가** → 처리 중 멈춤 / ACK 문제

**둘 다 증가** → 처리량 부족

---

**🔚 마치며**

RabbitMQ 장애는 대부분 **패턴이 반복** 됩니다. 이 5가지만 익숙해져도, 알람이 떴을 때 “아, 이건 그 케이스네” 하고 바로 대응할 수 있습니다.

운영에서 중요한 건 완벽한 설계보다 **빠르게 원인을 좁히고, 안전하게 복구하는 능력** 입니다.

#RabbitMQ #Consumer #장애패턴 #운영 #MQ #비동기처리

[원문 보기](https://blog.naver.com/choidz_/224139622629?fromRss=true&trackingCode=rss)
