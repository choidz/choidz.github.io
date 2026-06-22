# Elasticsearch 완벽 정리 (RDBMS 비교 + 핵심 개념 + 모니터링)

---

**Elasticsearch 완벽 정리 (RDBMS 비교 + 핵심 개념 + 모니터링)**

데이터 검색과 로그 분석에서 빠질 수 없는 **Elasticsearch(ES)**!

이 글에서는 Elasticsearch의 **기본 구조** , **RDBMS와의 비교** , **CAT API** ,

그리고 **모니터링 주요 지표** 까지 한눈에 정리했습니다 🚀

---

**📘 Elasticsearch vs RDBMS 비교**

| 개념 | Elasticsearch | MSSQL (RDBMS) |
| --- | --- | --- |
| Cluster | 여러 노드의 집합. 하나의 검색 시스템처럼 동작 | SQL Server 클러스터 (AlwaysOn 등) |
| Node | 클러스터를 구성하는 서버 (마스터, 데이터, 코디네이팅, 인제스트) | DB 인스턴스 |
| Index | 논리적 데이터베이스 공간 | Database (예: IPACK_DB) |
| Document | JSON 형식의 단일 데이터 객체 | 테이블의 Row |
| Field | 문서의 속성 (JSON key) | Column |
| Mapping | 문서 구조 정의 (필드 타입, 분석기 등) | 스키마 정의 |
| Shard | 인덱스를 물리적으로 나눈 단위 | Partition |
| Replica | 샤드 복제본 (Failover + 부하 분산) | AlwaysOn Replica / Mirroring |
| SQL | Elasticsearch DSL (JSON 기반) | SELECT, INSERT, UPDATE, DELETE |
| Transaction | 없음 (검색 중심 구조) | 있음 (ACID 보장) |
| Join | 제한적 (Nested, Parent-Child 관계만) | 자유로운 JOIN 가능 |
| Stored Procedure | 없음 | 지원 |
| Indexing 구조 | Inverted Index (역색인) | B-Tree / Hash 인덱스 |

**🧩 1. 클러스터와 노드 구조**

**📦 클러스터 (Cluster)**

- 여러 대의 **노드(Node)** 가 모여 하나의 검색 시스템처럼 동작합니다.
- 어떤 노드에 요청을 보내도 동일한 결과를 받을 수 있습니다.

**⚙️ 노드(Node) 역할**

| 역할 | 설명 |
| --- | --- |
| 마스터 노드 | 클러스터 관리 (인덱스 생성, 노드 추가/삭제 등) |
| 데이터 노드 | 실제 문서 저장 및 검색 수행 |
| 코디네이팅 노드 | 클라이언트 요청을 각 노드에 분배 |
| 인제스트 노드 | 색인 전 데이터 전처리 및 변환 수행 |

**🗃️ 2. 인덱스 (Index)**

- 문서(Document)를 저장하는 **논리적 공간** 입니다.
- RDBMS의 Database 개념과 유사합니다.

**📁 설계 방식**

- **하나의 인덱스에 통합** → 관리 단순
- **여러 인덱스로 분리** → 로그, 날짜별, 서비스별 관리에 적합

---

**⚙️ 3. 샤드 (Shard)**

인덱스를 실제로 쪼개서 저장하는 **물리적 단위** 입니다.

**종류**

- 🧱 **Primary Shard** : 원본 데이터 저장
- 🔁 **Replica Shard** : 복제본, 장애 복구 및 검색 부하 분산

**라우팅 규칙**

문서ID % 샤드개수

> ⚠️ **Primary Shard 수는 인덱스 생성 후 변경 불가** ,
>
> Replica 수는 언제든 변경 가능!

---

**🧬 4. 매핑 (Mapping)**

- RDBMS의 **Schema** 와 유사
- 필드명, 타입, 분석기(Analyzer) 등을 정의

**종류**

✅ 일반적으로 **정적 매핑 + 필요한 경우 동적 매핑** 조합을 사용합니다.

---

**🧾 5. 색인 (Indexing) 과정**

1️⃣ 인덱스 존재 여부 확인

2️⃣ 매핑 확인 (없으면 동적 생성)

3️⃣ 문서 분석 (Analyzer로 토큰화)

4️⃣ Inverted Index(역색인) 생성

5️⃣ Primary Shard 저장

6️⃣ Replica Shard 복제

---

**🔍 6. 검색 (Search) 과정**

1️⃣ 검색어 분석 (Analyzer 적용 → 토큰 생성)

2️⃣ Inverted Index에서 토큰 검색

3️⃣ 점수(Score) 계산 및 필터 적용 → 결과 반환

**📚 Inverted Index (역색인)**

- **단어 → 문서 목록** 형태로 저장
- 예:
- "서울" → [Doc1, Doc5, Doc9] "삼성" → [Doc2, Doc5] "전자" → [Doc2, Doc7]

> 텍스트 검색에 최적화된 구조입니다.

---

**🧩 7. 문자열 타입 (text / keyword)**

> ✅ text는 검색용, keyword는 정렬/필터용으로 주로 사용됩니다.

---

**📊 CAT API 완벽 정리**

**📗 1. CAT API란?**

**C** ompact **A** ligned **T** ext API

→ Elasticsearch 상태를 **사람이 읽기 쉬운 텍스트 형태로 출력** 하는 API 모음입니다.

CLI 환경에서 클러스터 상태를 빠르게 확인할 때 유용합니다.

---

**📈 2. 주요 CAT API**

**(1) 클러스터 상태 확인**

```http
GET _cat/health?v
```

---

**(2) 노드 상태 확인**

```http
GET _cat/nodes?v
```

- CPU, Heap, Disk, 역할, 마스터 여부 등 확인 가능
- 특정 컬럼만 보기:

```http
GET _cat/nodes?h=ip,heap.percent,disk.avail,role
```

---

**(3) 인덱스 상태 확인**

```http
GET _cat/indices?v
```

- 인덱스별 상태, 문서 수, 용량 등 확인
- 예시:

```http
GET _cat/indices | grep yellow
```

---

**(4) 샤드 상태 확인**

```http
GET _cat/shards?v
```

- 샤드 상태 및 Unassigned shard 확인
- 노드 이탈 시 NODE_LEFT 발생

---

**✅ CAT API 요약**

> 📍 Kibana가 없어도 CLI에서 클러스터 상태를 신속히 파악할 수 있습니다.

---

**🚨 Elasticsearch 모니터링 핵심 지표**

**⚠️ 1. 알람(Threshold) 기반 주요 지표**

| 지표 | 설명 | 임계치 |
| --- | --- | --- |
| CPU Usage | 노드 CPU 사용률 | 50% 이상 지속 시 주의 |
| Disk Usage | 디스크 사용량 | 70% 이상 시 경고 |
| Load Average | 시스템 부하량 | 지속 증가 시 성능 저하 |
| JVM Heap Usage | 힙 메모리 사용률 | 85% 이상 시 GC 과다 발생 |
| Rejected Threads | 요청 처리 거부 수 | 1 이상 시 과부하 가능성 |

**🔍 2. 원인 분석용 지표**

| 지표 | 설명 |
| --- | --- |
| Memory Usage | 전체 시스템 메모리 사용률 |
| GC Rate / Duration | GC 발생 주기 및 시간 |
| Disk I/O | 디스크 읽기/쓰기 지연 |
| Latency | 색인 및 검색 요청 응답 지연 |
| Throughput (Rate) | 색인 및 검색 요청 유입량 |

**🧠 용어 보충: GC (Garbage Collection)**

- **JVM에서 불필요한 객체를 자동 해제하여 메모리 회수**
- Elasticsearch는 Java 기반이므로 GC 효율이 성능에 직접적인 영향
- 힙 메모리 과도 사용 시 → **GC 빈도↑ + 응답 지연 발생**

---

**✅ 마무리 요약**

| 항목 | 핵심 요약 |
| --- | --- |
| Cluster/Node | Elasticsearch 전체 시스템 구성 단위 |
| Index/Shard/Replica | 데이터 저장 및 분산 구조 |
| Mapping | 스키마 정의 (필드 타입, 분석기 등) |
| CAT API | 상태 모니터링용 CLI 명령어 |
| 모니터링 지표 | CPU, Heap, Disk, GC 등 주기적 점검 필수 |

> 💡 **Tip**
>
> Elasticsearch는 단순한 “검색엔진”이 아니라,
>
> **데이터 분석 + 실시간 모니터링** 이 가능한 **분산형 검색 플랫폼** 입니다.
>
> 구조와 동작 원리를 이해하면 장애 대응과 성능 최적화에 큰 도움이 됩니다 ⚙️

**​**

[원문 보기](https://blog.naver.com/choidz_/224059746329?fromRss=true&trackingCode=rss)
