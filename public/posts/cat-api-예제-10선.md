# CAT API 예제 10선

---

**Elasticsearch CAT API 실전 예제 10선**

Elasticsearch 운영 중이라면 반드시 알아야 하는 명령어!

CAT API는 클러스터의 상태를 **CLI에서 빠르고 간단하게 확인** 할 수 있는 강력한 도구입니다 💪

> 💡 명령어 형식
> 
> GET _cat/<대상>?옵션
> 
> 예: GET _cat/nodes?v
> 
> Kibana 콘솔, cURL, 또는 Dev Tools에서 실행 가능합니다.

---

**✅ 1️⃣ 클러스터 상태 확인**

GET _cat/health?v 

**출력 예시**

epoch timestamp cluster status node.total node.data shards pri relo init unassign pending_tasks max_task_wait_time active_shards_percent 1728493920 12:12:01 my-cluster green 3 3 45 22 0 0 0 0 - 100.0% 

**설명**

  * 클러스터 전체의 상태를 확인하는 기본 명령어

  * status 컬럼 중요:

  * 🟢 green / 🟡 yellow / 🔴 red

---

**✅ 2️⃣ 노드별 상태 확인**

GET _cat/nodes?v 

**출력 예시**

ip heap.percent ram.percent cpu load_1m load_5m load_15m node.role master name 192.168.20.5 45 70 8 0.14 0.11 0.12 mdi * es-master01 

**설명**

  * 노드별 **CPU, 메모리, 디스크, 역할** 을 한눈에 파악

  * 자주 쓰는 커스텀 예시 👇

  * GET _cat/nodes?h=ip,name,heap.percent,ram.percent,disk.avail,master

---

**✅ 3️⃣ 인덱스 목록 및 상태 확인**

GET _cat/indices?v 

**출력 예시**

health status index uuid pri rep docs.count store.size pri.store.size green open ipack_db 9xkfJ6s1RfKLDHsgvG32kQ 5 1 250000 1.2gb 600mb yellow open ipack_log_2025 JH8dksKxKf7kLHDjU90pAq 1 1 150000 850.3mb 850mb 

**설명**

  * 인덱스별 문서 수, 용량, 상태, 샤드 개수를 확인

  * 특정 인덱스만 확인할 때:

  * GET _cat/indices/ipack_*

---

**✅ 4️⃣ 샤드 상태 점검**

GET _cat/shards?v 

**출력 예시**

index shard prirep state docs store ip node ipack_db 0 p STARTED 5000 60mb 192.168.20.5 es-node01 ipack_db 0 r STARTED 5000 60mb 192.168.20.6 es-node02 

**설명**

  * 샤드의 상태(STARTED, UNASSIGNED 등) 확인

  * Unassigned shard 발생 시 원인 분석에 필수

---

**✅ 5️⃣ 클러스터 노드 역할 보기**

GET _cat/nodes?h=name,ip,node.role,master 

**출력 예시**

name ip node.role master es-master01 192.168.20.5 m * es-data01 192.168.20.6 di - es-ingest01 192.168.20.7 i - 

**설명**

  * 각 노드의 역할(m: master, d: data, i: ingest, c: coordinating)을 확인

---

**✅ 6️⃣ 인덱스 크기 TOP 5**

GET _cat/indices?v | sort -k8 -hr | head -n 5 

**설명**

  * 쉘에서 실행 시 **가장 큰 인덱스 5개** 를 빠르게 파악

  * 디스크 사용량 급증 시 원인 분석에 유용

---

**✅ 7️⃣ 문서 수가 많은 인덱스 TOP 5**

GET _cat/indices?v | sort -k7 -nr | head -n 5 

**설명**

  * 문서 수 기준으로 정렬

  * 데이터 폭증 인덱스 파악 및 롤오버 정책 점검에 활용

---

**✅ 8️⃣ Unassigned 샤드 확인**

GET _cat/shards | grep UNASSIGNED 

**출력 예시**

ipack_log_2025 0 p UNASSIGNED 

**설명**

  * 노드 장애나 디스크 문제로 샤드 할당이 실패한 경우 표시

  * 즉각적인 복구 조치 필요 ⚠️

---

**✅ 9️⃣ 스냅샷 저장소 목록 확인**

GET _cat/repositories?v 

**출력 예시**

id type settings backup_s3 s3 { "bucket": "es-backup" } fs_backup fs { "location": "/mnt/backup" } 

**설명**

  * 백업(Snapshot) 설정을 빠르게 확인할 때 사용

---

**✅ 🔟 클러스터 마스터 노드 확인**

GET _cat/master?v 

**출력 예시**

id host ip node kD8HdksJ3T6hKD1jS9a es-master01 192.168.20.5 es-master01 

**설명**

  * 현재 클러스터의 마스터 노드 정보를 확인

  * 마스터 선출 관련 문제 분석 시 사용

---

**🧾 보너스 TIP**

**📍 _cat 명령어에서 자주 쓰는 옵션**

---

**✅ 마무리 요약**

---

> 💬 **Tip:**
> 
> CAT API는 Kibana보다 **빠르고 정확하게 장애 원인을 확인할 수 있는 1차 진단 도구** 입니다.
> 
> 운영 환경에서는 주기적인 스크립트 자동 점검과 함께 사용하는 것이 좋습니다. ⚙️

**​**

[원문 보기](https://blog.naver.com/choidz_/224059748662?fromRss=true&trackingCode=rss)
