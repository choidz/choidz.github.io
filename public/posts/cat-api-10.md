# CAT API 예제 10선

---

Elasticsearch CAT API 실전 예제 10선 Elasticsearch 운영 중이라면 반드시 알아야 하는 명령어! CAT API는 클러스터의 상태를 CLI에서 빠르고 간단하게 확인할 수 있는 강력한 도구입니다 명령어 형식 GET _cat/<대상>?옵션 예: GET _cat/nodes?v Kibana 콘솔, cURL, 또는 Dev Tools에서 실행 가능합니다. ✅ 1️⃣ 클러스터 상태 확인 GET _cat/health?v 출력 예시 epoch timestamp cluster status node.total node.data shards pri relo init unassign pending_tasks max_task_wait_time active_shards_percent 1728493920 12:12:01 my-cluster green 3 3 45 22 0 0 0 0 - 100.0% 설명 클러스터 전체의 상태를 확인하는 기본.......

[원문 보기](https://blog.naver.com/choidz_/224059748662?fromRss=true&trackingCode=rss)
