# Kafka vs RabbitMQ: 메시지 큐 선택의 모든 것

---

**마이크로서비스 아키텍처가 일반화되면서 시스템 간 통신 방식이 점점 중요해지고 있어요. 특히 대규모 데이터를 처리하거나 서비스 간 의존성을 줄여야 할 때,****메시지 큐****는 거의 필수적인 도구가 되었습니다. 하지만 Kafka와 RabbitMQ 중 어떤 걸 선택해야 할지 고민하는 개발자들이 많아요.**

**둘 다 메시지 기반 통신을 지원하지만, 설계 철학과 사용 목적이 완전히 달라요. 이 글에서는 두 기술의 근본적인 차이부터 실무에서 고려해야 할 세부 사항까지 자세히 살펴보겠습니다. 당신의 프로젝트에 정말 필요한 게 뭔지 명확하게 판단할 수 있을 거예요.**

---

**📌 핵심 요약: 뭐가 다른가?**

**Kafka****는 생산자 중심의 분산 스트리밍 플랫폼이고,****RabbitMQ****는 브로커 중심의 메시지 큐예요. Kafka는 대용량 데이터 처리에, RabbitMQ는 복잡한 라우팅과 안정적인 전달에 강합니다. 간단히 말해, 데이터 스트림 처리가 필요하면 Kafka, 메시지 신뢰성과 유연한 라우팅이 중요하면 RabbitMQ를 선택하세요.**

---

**⚙️ 메시지 큐의 기초: 왜 필요한가?**

**먼저 메시지 큐(Message Queue, MQ)가 뭔지부터 이해해야 해요. MQ는 프로세스나 프로그램 인스턴스 간에 데이터를 교환하는 통신 방법입니다. 더 정확히는****메시지 지향 미들웨어(MOM)****를 구현한 시스템이죠.**

[ ![](https://mblogthumb-phinf.pstatic.net/MjAyNTExMjRfMTI2/MDAxNzYzOTI1Mzg3NDc5.2CUuP5GpMuo6ceTXx8SQQbosp4_k5JTVxBYyFpC_yi0g.-BRvetD6-hrEBOu8i75E9QnIt3IzxnFRbx-b1mBVW58g.PNG/img_001_2343aa20.png) ](<#>)

_**메시지 큐의 기본 구조: Producer가 메시지를 Queue에 넣고, Consumer가 꺼내 처리합니다.**_

**핵심은 Producer(정보 제공자)와 Consumer(정보 사용자)가****직접 통신하지 않는다****는 거예요. 중간에 Queue라는 버퍼가 있어서 메시지를 임시 저장했다가 전달합니다. 이렇게 하면 뭐가 좋을까요?**

**첫째,****비동기 처리****가 가능해요. Producer는 Consumer가 처리할 때까지 기다릴 필요가 없어요. 둘째,****낮은 결합도****를 유지할 수 있어요. 서비스들이 서로를 직접 알 필요가 없죠. 셋째,****확장성****이 뛰어나요. Producer나 Consumer를 자유롭게 추가할 수 있어요. 마지막으로****탄력성****과****보장성****이 있어요. Consumer가 다운되어도 메시지는 Queue에 남아있고, 결국 모든 메시지가 전달된다는 보장을 받을 수 있습니다.**

---

**🔥 Kafka: 분산 스트리밍 플랫폼**

**Kafka는 LinkedIn에서 개발한****분산 메시징 시스템****입니다. 기존 메시지 큐와는 다르게, 대규모 데이터 스트림을 실시간으로 처리하도록 설계되었어요.**

[ ![](https://mblogthumb-phinf.pstatic.net/MjAyNTExMjRfMTI0/MDAxNzYzOTI1MzkzMjAy.Qeg-2zHvVEIFRkdALT7K8lmqHCJ-GTBsFkpArnWkleMg.2uyZ7_pF2BhKX6z_PHAqQwW534n1OYVpLqnh7QMoBNgg.PNG/img_002_5f3bd566.png) ](<#>)

_**Kafka의 Pub/Sub 모델: Publisher가 Topic으로 메시지를 분류하고, Subscriber가 구독합니다.**_

**Kafka는****Pub/Sub 방식****을 기본으로 합니다. Publisher(Producer)가 메시지를****Topic****이라는 카테고리로 분류해서 보내고, Subscriber(Consumer)가 원하는 Topic을 구독해서 메시지를 읽어요. Publisher와 Subscriber는 서로를 알지 못하고, Topic 정보만 알면 돼요.**

**Topic과 Partition의 개념**

**Kafka의 가장 중요한 개념이****Topic****과****Partition****이에요. 하나의 Topic은 여러 개의 Partition으로 나뉘는데, 이게 병렬 처리의 핵심이거든요.**

[ ![](https://mblogthumb-phinf.pstatic.net/MjAyNTExMjRfMTY4/MDAxNzYzOTI1Mzk2Nzky.AhuN9m2p6i1w8WttZxb82NPqiCDlqoiVIeBLYM9KTMcg.M_JClna9Cj-WL1nNSuAT6k6TvJi7CcDTi35HcX2PaYUg.PNG/img_002_d09c9225.png) ](<#>)

_**Topic의 구조: 하나의 Topic이 여러 Partition으로 분산되어 병렬 처리를 가능하게 합니다.**_

**각 Partition은 메시지를 저장하는****물리적 파일****이에요. 중요한 특징이 있는데, Partition은****Append-Only****방식이라는 거죠. 즉, 메시지는 맨 뒤에만 추가되고, 수정이나 삭제는 불가능해요. 마치 로그 파일처럼요.**

[ ![](https://mblogthumb-phinf.pstatic.net/MjAyNTExMjRfMTgw/MDAxNzYzOTI1NDAyNzYw.0nwN94pN9ThJSQYPjLBVEcPmBSkTA3uNMA1VVRbGvnsg.JFJOp_O2DdQc1RVYA43bNzQ1_Zlg9s-XZ0LKpDerWXcg.PNG/img_003_9d63052a.png) ](<#>)

_**Partition의 Append-Only 구조: 메시지는 순서대로 저장되고, Offset으로 위치를 추적합니다.**_

**각 메시지는****Offset****이라는 고유한 위치 정보를 가져요. Consumer는 이 Offset을 기준으로 메시지를 순서대로 읽어요. 그리고 여기가 중요한데,****Consumer가 메시지를 가져가도 Partition에는 메시지가 남아있어요****. 설정된 보관 기간 동안 계속 저장되죠.**

[ ![](https://mblogthumb-phinf.pstatic.net/MjAyNTExMjRfMjk1/MDAxNzYzOTI1NDA4NTk0.DV3Q31e9ApikL2zTWBNE27KY1s-GAvXioA7uKf5sPbkg.Kmy3dRR1s9imEyk6VRYCUl0sLYs_5LI7Dsz6RDYOVm0g.PNG/img_004_246c77ce.png) ](<#>)

_**1개 Topic과 4개 Partition: 각 Partition이 독립적으로 메시지를 저장하고 처리합니다.**_

**Consumer Group과 Pull 방식**

**Kafka의 또 다른 특징은****Consumer Group****이라는 개념이에요. 같은 Topic을 소비하는 Consumer들을 그룹으로 묶을 수 있어요. 중요한 규칙이 있는데,****1개의 Partition은 같은 Consumer Group 내에서 최대 1개의 Consumer만 연결 가능****해요.**

[ ![](https://mblogthumb-phinf.pstatic.net/MjAyNTExMjRfNzcg/MDAxNzYzOTI1NDEyNTg4.7x-NJRzCJbpueUadNFwlBgHyTeZADkvyCtu2EFB4FHEg.S3vNwmStZqj0ZvIE9Jrz_ZDI5YxoemvdBVf2SCp6AWIg.PNG/img_005_903b8a9b.png) ](<#>)

_**Kafka Consumer 구조: 각 Partition이 Consumer Group 내의 하나의 Consumer와만 연결됩니다.**_

**또한 Kafka는****Pull 방식****을 사용해요. Consumer가 Broker에게 "메시지 줘"라고 요청하는 방식이죠. 반대로 RabbitMQ는 Broker가 Consumer에게 메시지를 밀어넣는 Push 방식을 사용합니다. Pull 방식의 장점은 Consumer가 자신의 처리 속도에 맞춰 메시지를 가져갈 수 있다는 거예요.**

**정리하자면, Kafka의 핵심은****대용량 데이터를 병렬로 처리****하고,****메시지를 오래 보관****하면서****언제든 재생****할 수 있다는 거예요.**

---

**📮 RabbitMQ: 메시지 브로커**

**RabbitMQ는****AMQP(Advanced Message Queuing Protocol)****프로토콜을 구현한 메시지 브로커예요. Kafka와는 다르게, 전통적인 메시지 큐 방식을 기본으로 하면서 필요에 따라 Pub/Sub도 지원합니다.**

[ ![](https://mblogthumb-phinf.pstatic.net/MjAyNTExMjRfMjk1/MDAxNzYzOTI1NDE4NDA5.066LW2xFqXGAyanxZzmPcuuKzZNo9ym0KqVHrxJeM2Ag.FQNFB_JG7g6ApdT0bwqkjW26WdFoH3nPNzZmCsJwWisg.PNG/img_003_6b5f60d8.png) ](<#>)

_**RabbitMQ의 구조: Producer → Exchange → Queue → Consumer의 흐름으로 메시지가 라우팅됩니다.**_

**RabbitMQ의 특징은****Exchange****라는 개념이에요. Producer가 메시지를 보내면 먼저 Exchange에 도착해요. Exchange는 정해진 규칙(Binding Rules)에 따라 메시지를 적절한 Queue로 라우팅해요. 그 다음에 Consumer가 Queue에서 메시지를 꺼내 처리합니다.**

[ ![](https://mblogthumb-phinf.pstatic.net/MjAyNTExMjRfMTM0/MDAxNzYzOTI1NDIzNzYx.Y7hc8qbe8GjVc2YU60g9n6t-oO1gYAHCCiWOHExATiIg.i3rZSrvixxvmMTUgqQ3Vh99151CjiiyDgVPCTRCm7JMg.PNG/img_000_a67a0573.png) ](<#>)

_**RabbitMQ의 Message Exchange: 여러 Producer의 메시지를 Exchange가 라우팅 규칙에 따라 분배합니다.**_

**Exchange의 종류와 라우팅**

**RabbitMQ의 강점은****유연한 라우팅****이에요. Exchange 타입에 따라 다양한 라우팅 방식을 사용할 수 있어요.**

**Direct Exchange****는 Routing Key가 정확히 일치하는 Queue로만 메시지를 보내요. 예를 들어, "user.created"라는 Routing Key를 가진 메시지는 "user.created" Binding Key를 가진 Queue로만 전달되죠.****Topic Exchange****는 와일드카드를 사용해서 더 유연한 매칭이 가능해요. "user.*"라고 설정하면 "user.created", "user.updated" 같은 모든 메시지를 받을 수 있어요.**

**Header Exchange****는 메시지 헤더의 속성을 기반으로 라우팅해요. 이렇게 유연한 라우팅이 가능하기 때문에, Consumer는 정말 필요한 메시지만 선택적으로 받을 수 있어요. Kafka는 이런 세밀한 필터링이 어렵거든요.**

**메시지 처리와 ACK**

**RabbitMQ의 또 다른 특징은****메시지 확인(ACK) 메커니즘****이에요. Consumer가 메시지를 처리하고 ACK를 보내면, RabbitMQ는 그 메시지를 Queue에서 삭제해요. 만약 Consumer가 처리 중에 실패하면 NACK를 보낼 수 있고, 메시지는 다시 Queue로 돌아가서 다른 Consumer가 처리할 수 있어요.**

**이 방식은****메시지 손실을 방지****하고****신뢰성 있는 전달****을 보장해요. 하지만 대신 Queue에 메시지가 쌓일 수 있고, 성능이 영향을 받을 수 있어요. 특히 Queue가 비어있지 않을 때 성능이 떨어져요.**

**정리하자면, RabbitMQ의 핵심은****신뢰할 수 있는 메시지 전달****과****유연한 라우팅****이에요.**

---

**⚡ 성능 비교: 누가 더 빠를까?**

**성능 측면에서 보면, Kafka가 일반적으로 더 빨라요. 왜냐하면 Kafka는****순차적인 디스크 I/O****방식을 사용하기 때문이에요. 메시지를 파일 시스템에 순서대로 저장하기 때문에, 디스크 접근이 매우 효율적이에요.**

**Kafka는****1초에 수백만 개의 메시지****를 처리할 수 있어요. 그리고 저장소 크기가 성능에 거의 영향을 주지 않아요. 이론상으로는 무한정 메시지를 저장해도 성능이 일정하게 유지돼요.**

**RabbitMQ도 1초에 수백만 개의 메시지를 처리할 수 있지만,****Queue가 비어있을 때만 성능이 빨라요****. Queue에 메시지가 쌓이면 성능이 떨어져요. 또한 메시지를 메모리에 유지하는 경향이 있어서, 대용량 데이터를 처리할 때는 더 많은 자원이 필요해요.**

---

**🔄 메시지 순서 보장: 누가 더 안전할까?**

**메시지 순서 보장은 매우 중요한 요소예요. 금융 거래나 주문 처리 같은 경우, 순서가 뒤바뀌면 큰 문제가 될 수 있거든요.**

**Kafka의 경우****, 같은 Partition으로 보내진 메시지는****순서가 보장돼요****. 하지만 하나의 Topic이 여러 Partition을 가지고 있으면, Partition 사이의 순서는 보장되지 않아요. 왜냐하면 Producer가 메시지를 Round-Robin 방식으로 각 Partition에 분배하기 때문이에요.**

**만약 여러 Partition 사이에서도 순서를 보장하고 싶다면,****Key를 사용****해야 해요. 같은 Key를 가진 메시지는 항상 같은 Partition으로 가기 때문에, 순서가 보장돼요. 예를 들어, 사용자 ID를 Key로 사용하면, 같은 사용자의 메시지는 순서대로 처리될 거예요.**

**RabbitMQ의 경우****, Consumer가 하나라면 메시지 순서가 보장돼요. 하지만 여러 Consumer가 같은 Queue에서 메시지를 가져가면, 처리 순서는 보장되지 않아요. 각 Consumer의 처리 속도가 다를 수 있기 때문이죠.**

---

**💾 메시지 보관 방식: 얼마나 오래 보관할까?**

**메시지를 얼마나 오래 보관하는지도 중요한 차이점이에요.**

**Kafka는 설정된 타임아웃 시간까지 모든 메시지를 저장해요****. 기본값은 7일이지만, 필요에 따라 조정할 수 있어요. 심지어 무한정 저장할 수도 있어요. 이렇게 오래 보관할 수 있는 이유는 성능이 저장소 크기와 무관하기 때문이에요. 이게 Kafka의 가장 큰 장점 중 하나예요.****과거 메시지를 언제든 다시 읽을 수 있어요****. 이를 이벤트 소싱(Event Sourcing)이나 감사 로그(Audit Log) 구현에 활용할 수 있어요.**

**RabbitMQ는 Consumer가 메시지를 처리하자마자 삭제해요****. Consumer가 ACK를 보내면 즉시 Queue에서 메시지가 제거돼요. 이건 메모리 효율성은 좋지만, 과거 메시지를 다시 읽을 수 없다는 뜻이에요. 만약 Consumer가 실패하면 NACK를 보내서 메시지를 다시 Queue에 돌려놓을 수 있지만, 이건 일시적인 거고 결국 처리되면 삭제돼요.**

---

**🛡️ 장애 처리: 실패한 메시지는 어떻게?**

**메시지 처리가 실패했을 때 어떻게 대응하는지도 중요해요.**

**Kafka는 기본적인 장애 처리 메커니즘을 제공하지 않아요****. 실패 처리는****애플리케이션 수준****에서 구현해야 해요. 만약 Consumer가 특정 메시지 처리에 실패하면, 그 메시지를 다시 처리하려고 할 때 같은 Partition의 다른 메시지들은 처리될 수 없어요. Partition은 Append-Only이고 순서를 유지해야 하기 때문이죠. 이게 Kafka의 약점이에요.**

**RabbitMQ는 고급 오류 처리 기능을 제공해요****. Consumer가 특정 메시지 처리에 실패해서 NACK를 보내면, 다른 Consumer들이 그 메시지를 처리할 수 있어요. 특정 Consumer가 메시지를 재시도하는 동안 전체 시스템이 중단되지 않아요. 이렇게 유연한 처리가 가능하기 때문에, 안정성이 중요한 시스템에 더 적합해요.**

---

**⏰ 지연 메시지: 나중에 처리하고 싶어요**

**때로는 메시지를 지금 당장 처리하지 않고, 나중에 처리하고 싶을 수 있어요. 예를 들어, 주문 후 5분 뒤에 확인 이메일을 보내고 싶다면?**

**RabbitMQ는 이를 기본으로 지원해요****. Producer가 메시지를 보낼 때****지연 시간을 설정****할 수 있어요. Exchange에서 설정된 시간이 지난 후에 Queue로 메시지를 전달해요. 매우 편리하죠.**

**Kafka는 이 기능을 기본으로 제공하지 않아요****. Partition은 Append-Only이기 때문에 메시지 시간을 조작할 수 없어요. 지연 처리가 필요하면****애플리케이션 수준에서 구현****해야 해요. 별도의 스케줄러를 만들거나, 지연 처리를 위한 별도 Topic을 만들어야 해요.**

---

**🎯 실무 선택 가이드**

**지금까지 배운 내용을 정리해서, 어떤 상황에 어떤 기술을 선택해야 하는지 정리해봤어요.**

---

**✅ Kafka를 선택해야 할 때**

**다음과 같은 경우에는****Kafka를 선택****하세요:**

**1\. 대규모 데이터 처리가 필요할 때****\- 로그 수집, 실시간 분석, 이벤트 스트리밍 같은 대용량 데이터를 처리해야 한다면 Kafka가 최고예요. 1초에 수백만 개의 메시지를 처리할 수 있거든요.**

**2\. 메시지를 오래 보관하고 재생해야 할 때****\- 감사 로그, 이벤트 소싱, 데이터 복구 같은 경우 과거 메시지를 다시 읽어야 해요. Kafka는 이를 완벽하게 지원해요.**

**3\. 엄격한 메시지 순서 관리가 필요할 때****\- 같은 사용자의 주문들이 순서대로 처리되어야 한다면, Kafka의 Key 기반 Partition 할당이 완벽해요.**

**4\. 마이크로서비스 간 느슨한 결합이 필요할 때****\- 서비스들이 서로를 직접 알지 못하고, 이벤트로만 통신해야 한다면 Kafka의 Pub/Sub 모델이 이상적이에요.**

**✅ RabbitMQ를 선택해야 할 때**

**다음과 같은 경우에는****RabbitMQ를 선택****하세요:**

**1\. 복잡한 라우팅이 필요할 때****\- 메시지를 다양한 조건에 따라 다른 곳으로 보내야 한다면 RabbitMQ의 Exchange와 Binding이 최고예요. Topic Exchange, Header Exchange 등으로 세밀한 제어가 가능해요.**

**2\. 신뢰할 수 있는 메시지 전달이 중요할 때****\- 금융 거래, 주문 처리 같은 경우 메시지 손실이 절대 안 돼요. RabbitMQ의 ACK 메커니즘이 이를 보장해요.**

**3\. 지연 메시지나 스케줄링이 필요할 때****\- 이메일 발송 스케줄, 알림 지연 같은 경우 RabbitMQ의 지연 메시지 기능이 편해요.**

**4\. 관리와 모니터링이 중요할 때****\- RabbitMQ는 웹 기반 관리 UI를 제공해요. 메시지 큐 상태를 시각적으로 모니터링하고 관리하기 쉬워요.**

**5\. 오류 처리가 복잡할 때****\- Consumer가 실패했을 때 자동으로 다른 Consumer가 처리하도록 하고 싶다면, RabbitMQ의 자동 재시도 메커니즘이 유용해요.**

---

**💡 실무 팁: 함께 사용할 수도 있어요**

**꼭 하나만 선택해야 하는 건 아니에요. 많은 기업들이****Kafka와 RabbitMQ를 함께 사용****해요.**

**예를 들어, 대규모 로그 수집은 Kafka로 하고, 복잡한 비즈니스 로직 기반 메시지 라우팅은 RabbitMQ로 처리하는 식이에요. 또는 Kafka에서 이벤트를 수집한 후, 특정 이벤트를 RabbitMQ로 보내서 추가 처리하는 방식도 있어요.**

**시스템의 규모와 복잡도가 커질수록, 여러 메시징 솔루션을 조합해서 사용하는 게 일반적이에요. 각 도구의 장점을 최대한 활용하는 거죠.**

---

**🎓 마무리: 당신의 프로젝트에 맞는 선택**

**Kafka와 RabbitMQ는 같은 메시징 시스템이지만, 설계 철학과 목적이 완전히 달라요. Kafka는****"대규모 데이터 스트림을 빠르게 처리하자"****는 철학으로 만들어졌고, RabbitMQ는****"메시지를 안전하고 유연하게 전달하자"****는 철학으로 만들어졌어요.**

**당신의 프로젝트가 처리해야 할 데이터 규모, 처리 속도, 안정성 요구 사항, 라우팅 복잡도를 종합적으로 고려해서 선택하세요. 그리고 기억하세요 - 완벽한 솔루션은 없어요. 각 도구는 자신의 목적에 최적화되어 있을 뿐이에요. 당신의 프로젝트 요구사항에 가장 잘 맞는 도구를 선택하는 게 최고의 선택이에요.**

**혹시 나중에 다른 선택이 필요해지면? 그때는 마이그레이션하면 돼요. 처음부터 완벽한 선택을 하려고 고민하기보다, 지금 당신의 상황에 가장 적합한 선택을 하고, 필요에 따라 진화시키는 게 현명한 개발자의 방식이에요.**

---

**#Kafka #RabbitMQ #메시지큐 #MQ #분산시스템 #마이크로서비스 #이벤트스트리밍 #메시지브로커**

[원문 보기](https://blog.naver.com/choidz_/224085826833?fromRss=true&trackingCode=rss)
