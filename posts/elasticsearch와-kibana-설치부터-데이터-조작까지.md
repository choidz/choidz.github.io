# Elasticsearch와 Kibana: 설치부터 데이터 조작까지

---

**📋 목차**

1\. Kibana 설치 및 설정

2\. Elasticsearch와 Kibana 연동

3\. Dev Tools를 이용한 데이터 조작(CRUD)

4\. 검색 기능 활용하기

**Kibana 설치 및 설정**

Kibana는 Elasticsearch의 시각화 도구로, 데이터를 효과적으로 분석하고 관리할 수 있게 해줍니다. 먼저 시스템에 맞는 방식으로 설치합니다.

**Linux(Ubuntu) 설치:**

**Mac 설치:**

설치 후 Kibana 설정 파일을 수정해야 합니다. Linux의 경우 다음 명령어로 설정 파일을 엽니다:

설정 파일에서 다음 항목들을 확인하고 수정합니다:

• server.port: 기본값 5601 확인

• server.host: localhost에서 0.0.0.0으로 변경

• elasticsearch.hosts: ["http://localhost:9200"] 주석 해제

변경 후 저장합니다(ESC → :wq).

**Elasticsearch와 Kibana 연동**

Elasticsearch와 Kibana를 연동하려면 두 서비스가 같은 버전이어야 합니다. 실행 순서도 중요한데, **반드시 Elasticsearch를 먼저 실행한 후 Kibana를 실행** 해야 합니다.

**서비스 실행 및 상태 확인:**

Kibana가 정상 실행되면 http://localhost:5601 에 접속할 수 있습니다. 만약 Elasticsearch가 실행 중이지 않으면 연결 오류 메시지가 표시됩니다.

**Docker를 이용한 설치:**

Docker를 사용하면 더 간단하게 설정할 수 있습니다. docker-compose-kibana.yml 파일을 생성합니다:

그 후 다음 명령어로 실행합니다:

**Dev Tools를 이용한 데이터 조작(CRUD)**

Kibana의 Dev Tools는 강력한 콘솔 인터페이스입니다. 왼쪽 메뉴에서 Management > Dev Tools로 접근할 수 있습니다. 왼쪽 창에 쿼리를 입력하면 오른쪽 창에 JSON 형식의 결과가 표시됩니다.

**Index 관리:**

**Document 생성 및 조회:**

**Document 수정:**

PUT을 사용하면 전체 필드를 덮어쓰게 됩니다. 일부 필드만 수정하려면 POST와 _update를 사용합니다:

**대량 데이터 삽입:**

벌크 API(_bulk)를 사용하면 여러 문서를 한 번에 삽입할 수 있습니다:

**검색 기능 활용하기**

Elasticsearch는 강력한 검색 기능을 제공합니다. 검색은 QueryDSL(Query Domain Specific Language)을 사용하며 JSON 형식으로 작성됩니다.

**URI 검색 방식:**

**JSON Body 검색 방식 (권장):**

JSON 방식이 더 복잡한 쿼리를 작성할 수 있어 실무에서 많이 사용됩니다.

**멀티테넌시 (여러 Index 통합 검색):**

여러 개의 Index를 한 번에 검색할 수 있습니다. 특히 시간별로 생성되는 로그 데이터에 유용합니다:

Elasticsearch는 NoSQL 데이터베이스로서 스키마 자유로운 특징을 가지고 있습니다. 이는 데이터 구조를 동적으로 변경할 수 있게 해주어 유연한 데이터 관리를 가능하게 합니다. Kibana의 Dev Tools를 활용하면 이러한 기능들을 쉽게 테스트하고 실행할 수 있습니다.

#Elasticsearch #Kibana #DevTools #검색엔진 #데이터분석

[원문 보기](https://blog.naver.com/choidz_/224084914774?fromRss=true&trackingCode=rss)
