# 데몬(daemon) vs Agentless: 왜 Ansible 은 서버에 데몬이 필요 없을까?

---

> 서버 운영자나 DevOps 입문자라면 한 번쯤 궁금해질 수 있는 질문입니다.
> 
> “대부분 자동화 도구는 서버에 데몬(Agent)을 띄우고 관리하는데… 왜 Ansible은 그렇지 않은 걸까?”
> 
> 이번 글에서는 그 이유를 실제 예시와 함께 쉽게 정리해봅니다.

---

**🔹 왜 일반 자동화 도구는 데몬(Agent)을 사용하는가?**

많은 자동화 도구들(예: Puppet, Chef, SaltStack 등)은 다음과 같은 구조를 씁니다:

  * 각 관리 대상 서버에 **Agent(데몬)** 를 설치

  * Agent가 **항상 실행 중** , 주기적으로 중앙 서버(Master)와 통신

  * 요청이 있을 때만이 아니라, 주기적으로 설정을 점검하거나 명령을 Pull

이 구조의 장점은 “서버 스스로 주기 점검 + 자동 동기화”가 가능하다는 것이지만, 단점도 명확합니다.

Agent를 설치·유지해야 하고, Agent의 장애가 곧 관리 실패로 이어질 수 있다는 점입니다.

```
[Master] ← (주기적으로 요청) ← [Web01(Agent)]
← (Pull 방식)     ← [Web02(Agent)]
← (Pull 방식)     ← [DB01(Agent)]
```

---

**✅ 하지만 Ansible은 달랐다 — Agentless, “데몬 불필요” 구조**

Ansible은 아래와 같은 방식을 사용합니다:

  * 복잡한 에이전트 설치 없이, 서버에 기본적으로 있는 **SSH (리눅스)** / **WinRM (윈도우)** 만 사용

  * Master(제어 서버) → 각 서버로 **직접 접속 (Push 방식)**

  * 작업이 끝나면 **접속 종료** , 별도의 데몬은 서버에 남지 않음

예를 들어, Master 서버가 있고 Web01, Web02, DB01 이렇게 3대의 서버가 있다고 가정해보면:

```
[Master(Ansible)] → Apache 설치 → [Web01]
                   → Apache 설치 → [Web02]
                   → Apache 설치 → [DB01]
``` 

[Master (Ansible)] → SSH 접속 → Web01: Apache 설치 → SSH 접속 → Web02: Apache 설치 → SSH 접속 → DB01: Apache 설치

✔️ 서버에 Agent/데몬 설치 불필요

✔️ 필요한 순간에만 접속 → 설치 부담, 장애 위험 모두 적음

✔️ 서버 추가 시 설정 간단 → IP + SSH 키만 등록하면 끝

---

**📊 Agent 기반 vs Ansible 방식 — 비교 요약**

---

**🧑‍💻 실제 운영 예시 (Master 1대 + Agent 서버 3대)**

> 목표: Web01, Web02, DB01 서버 모두에 Apache 설치

  * **Agent 기반 도구 사용 시**

  1. 각 서버에 Agent 설치

  2. Agent가 주기적으로 Master에 접속 → “Apache 설치/동기화 명령 다운로드 및 실행”

  3. Agent 데몬이 항상 실행 중 → 부하, 보안, 업데이트 관리 부담

  * **Ansible 사용 시**

  1. Master에서 Web01, Web02, DB01 서버에 SSH 접속

  2. Apache 설치 명령을 직접 Push하고 실행

  3. 작업 완료 후 SSH 연결 종료 → 서버에 남는 것은 없음

결과는 같지만, **준비 · 운영 · 유지** 의 복잡도와 부담은 Ansible 쪽이 훨씬 낮습니다.

---

**📌 정리: 왜 Ansible은 데몬이 필요 없는가?**

  * Ansible은 서버에 **항상 떠 있는 Agent 대신, 필요할 때만 접속하는 방식(Push 전략)** 을 사용

  * 때문에 서버에 **Agent 설치/운영 부담이 전혀 없다**

  * 서버가 많아질수록 이 “Agentless + SSH 기반”의 구조가 돋보이며,

  * **“설치 부담 낮고, 장애위험 적고, 확장성 좋은 자동화”** 가 가능

즉, Ansible은 **“설치도, 띄워두는 것(데몬)도 없는, 필요한 순간에만 동작하는 간단한 자동화 도구”** 라는 것이 핵심입니다.

[원문 보기](https://blog.naver.com/choidz_/224093483560?fromRss=true&trackingCode=rss)
