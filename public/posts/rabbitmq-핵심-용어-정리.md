# RabbitMQ 핵심 용어 정리

---

RabbitMQ를 처음 접하면 가장 헷갈리는 게 바로 **용어** 입니다. Queue, Exchange, Consumer, ACK 같은 단어들이 한 번에 쏟아지다 보니 

“대충 알 것 같긴 한데 정확히 설명하라면 막히는” 상황이 자주 생깁니다.

이 글은 **RabbitMQ를 전혀 모르는 상태** 에서 **운영 중 실제 장애를 겪고 나서 정리한 용어 설명** 을 목표로 합니다. 개발 이론보다는 **운영·장애 대응 관점** 에서 이해하는 데 초점을 맞췄습니다.

---

**📦 Producer (프로듀서)**

**한 줄 요약:** 메시지를 RabbitMQ로 보내는 쪽

보통 **API 서버** 가 Producer 역할을 합니다. 사용자가 어떤 요청(API 호출)을 하면, 그 요청을 바로 처리하지 않고 “이 작업 나중에 처리해줘”라는 메시지를 만들어 RabbitMQ로 보냅니다.

중요한 점은, **Producer는 메시지를 보낸 뒤 바로 끝난다** 는 것입니다. 실제 작업이 언제 끝나는지는 신경 쓰지 않습니다.

---

**📥 Queue (큐)**

**한 줄 요약:** 메시지가 줄 서서 대기하는 공간

Queue는 RabbitMQ에서 가장 핵심적인 개념입니다. 메시지를 처리하지 않고 **그냥 쌓아두는 역할** 만 합니다.

Consumer가 없거나 문제가 생기면, 메시지는 계속 Queue에 쌓이게 됩니다. 이 상태가 바로 운영에서 자주 보는 **“큐 적체”** 입니다.

---

**👷 Consumer (컨슈머)**

**한 줄 요약:** Queue에서 메시지를 가져가 실제로 처리하는 프로그램

Consumer는 보통 다음 중 하나입니다:

• Java 기반 백그라운드 서비스

• Spring Boot Worker

• Python 배치 프로그램

운영 장애의 대부분은 **RabbitMQ 자체가 아니라 Consumer 문제** 입니다. Consumer가 죽거나, 오류로 멈추거나, ACK를 보내지 못하면 Queue는 절대 줄어들지 않습니다.

---

**📨 Message (메시지)**

**한 줄 요약:** 처리해야 할 작업 내용

메시지는 보통 JSON 형태입니다. “검색 인덱싱 해라”, “메일 보내라”, “통계 집계해라” 같은 **작업 지시서** 라고 생각하면 됩니다.

---

**🔀 Exchange (익스체인지)**

**한 줄 요약:** 메시지를 어떤 Queue로 보낼지 결정하는 분류기

Producer는 Queue에 직접 메시지를 넣지 않습니다. 항상 **Exchange에 먼저 메시지를 보냅니다**.

Exchange는 규칙에 따라 메시지를 적절한 Queue로 전달합니다. 이 구조 덕분에 RabbitMQ는 **복잡한 라우팅** 이 가능합니다.

---

**🧭 Routing Key**

**한 줄 요약:** 메시지의 목적지 힌트

Routing Key는 메시지에 붙는 문자열입니다. Exchange는 이 값을 보고 “어느 Queue로 보낼지” 판단합니다.

예를 들면:

search.create search.update mail.send

---

**📎 Binding (바인딩)**

**한 줄 요약:** Exchange와 Queue를 연결하는 규칙

“이 Routing Key가 오면 이 Queue로 보내라”라는 설정입니다. Binding이 없으면 메시지는 어디에도 전달되지 않습니다.

---

**✅ ACK (Acknowledgement)**

**한 줄 요약:** “이 메시지 처리 끝났다”는 신호

Consumer가 메시지를 정상 처리하면 RabbitMQ에 ACK를 보냅니다. ACK를 받아야 RabbitMQ는 해당 메시지를 Queue에서 제거합니다.

**ACK가 오지 않으면 메시지는 절대 삭제되지 않습니다.** 이게 RabbitMQ 장애의 핵심 포인트입니다.

---

**⏳ Unacked Message**

**한 줄 요약:** Consumer가 가져갔지만 ACK를 못 보낸 메시지

운영 중 다음 상황이면 반드시 의심해야 합니다:

• Unacked 수가 계속 증가

• Queue는 줄지 않음

• Consumer 로그에 오류 존재

이 경우 대부분 **Consumer 내부 오류 / Deadlock / 외부 API 지연** 입니다.

---

**📤 Ready Message**

**한 줄 요약:** 아직 Consumer가 가져가지 않은 메시지

Ready 메시지만 계속 늘어난다면, **Consumer가 없거나 죽어 있는 상태** 일 가능성이 큽니다.

---

**☠️ Dead Letter Queue (DLQ)**

**한 줄 요약:** 문제 있는 메시지를 따로 보내는 큐

특정 메시지 하나 때문에 전체 처리가 멈추는 것을 방지하기 위해 사용합니다. 처리 실패 메시지를 DLQ로 보내면, 나머지 정상 메시지는 계속 처리할 수 있습니다.

---

**📊 운영 시 꼭 기억해야 할 핵심 5가지**

• Queue는 처리하지 않는다

• Consumer가 실제 일을 한다

• ACK가 와야 메시지가 사라진다

• Unacked 증가는 장애 신호다

• 재시작으로 큐가 소진되면 Consumer 문제다

---

**🔚 마치며**

RabbitMQ 장애를 겪고 나면 깨닫게 됩니다. 문제의 대부분은 RabbitMQ가 아니라 **Consumer 코드와 처리 로직** 에 있다는 것을요.

이 용어들만 정확히 이해해도, RabbitMQ 알람이 떴을 때 당황하지 않고 “지금 어디가 문제인지” 바로 감이 오기 시작합니다.

#RabbitMQ #메시지큐 #MQ #운영 #장애대응 #비동기처리

[원문 보기](https://blog.naver.com/choidz_/224138828121?fromRss=true&trackingCode=rss)
