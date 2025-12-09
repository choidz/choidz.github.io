# MySQL 에러 완벽 정리 가이드: 자주 만나는 에러부터 해결법까지

---

​

MySQL을 다루다 보면 정말 많은 에러를 만나게 돼요. 그런데 에러 메시지만 봐서는 뭐가 문제인지 알 수 없을 때가 많죠. 특히 중급 개발자라면 기본적인 에러는 빠르게 해결하고 싶을 텐데, 매번 구글링을 하는 건 시간 낭비예요.

​

이 글에서는 MySQL을 사용하면서 정말 자주 마주치는 에러들을 체계적으로 정리했어요. 시스템 에러부터 SQL 문법 에러까지, 각 에러의 원인이 뭔지, 어떻게 해결하는지를 실제 상황에 맞춰 설명할 거예요. 이 글을 읽고 나면 에러가 떴을 때 당황하지 않고 빠르게 대응할 수 있을 거랍니다.

​

📌 이 글의 핵심 내용

​

분류주요 에러해결 난이도시스템 에러ERROR 2002, 1044, 1045중상권한 에러Access denied, 1006중SQL 문법 에러1064, 1054, 1136하데이터 무결성 에러1062, 1093, 1222중 

​

🚨 가장 자주 만나는 시스템 에러들

​

ERROR 2002: MySQL 서버에 연결할 수 없음

​

이 에러는 정말 많이 봐요. 근데 같은 에러 메시지인데도 뒤에 붙는 숫자 (2), (13), (111)에 따라 원인이 완전히 달라져요.

​

ERROR 2002 (2) - MySQL 데몬이 실행되지 않은 경우

​

가장 흔한 원인이에요. MySQL 서버 자체가 켜져 있지 않은 거죠.

​

# mysql.sock 위치 찾기 find / -name mysql.sock # 찾은 경로로 연결 시도 /usr/local/mysql/bin/mysql -u root -p mysql -S /var/lib/mysql/mysql.sock 

​

만약 여전히 안 된다면, MySQL 사용자 권한 문제일 수 있어요.

​

# MySQL 서비스 중지 service mysqld stop # 디렉토리 권한 설정 chmod 755 -R /var/lib/mysql/ chown mysql:mysql -R /var/lib/mysql/ # 다시 시작 service mysqld start 

​

ERROR 2002 (13) - 디렉토리 권한 문제

​

/usr/local/mysql 디렉토리에 접근할 수 없을 때 나와요. 해결책은 간단해요.

​

chmod 777 /usr/local/mysql 

​

ERROR 2002 (111) - 심볼릭 링크 오류

​

mysql.sock 파일의 심볼릭 링크가 깨졌을 때 발생해요.

​

ln -s /tmp/mysql.sock /var/lib/mysql/mysql.sock 

​

정리하자면, 2002 에러가 나면 먼저 MySQL이 실행 중인지 확인하고, 파일 권한과 경로를 체크하는 순서로 진행하면 돼요.

​

ERROR 1044 & 1045: 접근 권한 문제

​

ERROR 1044: 특정 데이터베이스에 접근할 수 없음

​

사용자가 특정 데이터베이스에 접근할 권한이 없을 때 나와요.

​

\-- 예: 'abc' 사용자가 'abcdb' 데이터베이스에 접근하려고 할 때 use abcdb; -- ERROR 1044 발생! -- 해결: 권한 부여 GRANT ALL PRIVILEGES ON abcdb.* TO 'abc'@'localhost' IDENTIFIED BY '패스워드' WITH GRANT OPTION; FLUSH PRIVILEGES; 

​

ERROR 1045: 비밀번호가 틀렸거나 없음

​

# 잘못된 방법 mysql -u root # 올바른 방법 mysql -u root -p # 비밀번호 입력 

​

이 두 에러는 권한 관리 문제인데, 보안상 중요하니까 꼭 정확하게 처리해야 해요.

​

💾 데이터베이스 생성/삭제 에러

​

ERROR 1007: 데이터베이스가 이미 존재함

​

\-- 이미 'web_project' 데이터베이스가 있을 때 CREATE DATABASE web_project; -- ERROR 1007! -- 해결 방법 1: 이름 변경 CREATE DATABASE web_project_v2; -- 해결 방법 2: 기존 데이터베이스 삭제 후 생성 DROP DATABASE web_project; CREATE DATABASE web_project; -- 해결 방법 3: IF NOT EXISTS 사용 (권장) CREATE DATABASE IF NOT EXISTS web_project; 

​

ERROR 1006: 디스크 용량 부족

​

이 에러는 하드디스크 공간이 없을 때 나와요. 데이터베이스를 만들 수 없는 거죠.

​

# 임시 파일 정리 (가장 먼저 해야 할 일) cd /tmp rm -rf * # MySQL 재시작 service mysqld restart # 디스크 용량 확인 df -h 

​

🔐 Safe Update 모드 에러

​

ERROR 1175: WHERE 절 없이 UPDATE 시도

​

\-- Safe Update 모드가 활성화되어 있을 때 UPDATE users SET age = 25; -- ERROR 1175! -- 해결: Safe Update 모드 비활성화 SET SQL_SAFE_UPDATES = 0; UPDATE users SET age = 25; -- 또는 KEY 칼럼을 WHERE 절에 사용 UPDATE users SET age = 25 WHERE id = 1; 

​

정리하자면, Safe Update 모드는 실수로 전체 데이터를 수정하는 걸 방지하는 안전장치예요. 꼭 필요할 때만 비활성화하세요.

​

🔴 SQL 문법 에러들

​

ERROR 1064: SQL 문법 오류

​

이건 정말 자주 봐요. 에러 메시지 끝에 "line n번째"라고 적혀 있으니까 그 부분을 꼼꼼히 봐야 해요.

​

\-- 잘못된 예 SELECT * FROM users WHERE name = John; -- ERROR 1064! -- John이 문자열인데 따옴표가 없음 -- 올바른 예 SELECT * FROM users WHERE name = 'John'; 

​

ERROR 1054: 존재하지 않는 칼럼

​

\-- 잘못된 예 SELECT * FROM users WHERE sss = 'value'; -- ERROR 1054! -- 'sss' 칼럼이 없음 -- 올바른 예 SELECT * FROM users WHERE name = 'value'; 

​

ERROR 1136: 칼럼 개수와 값의 개수 불일치

​

\-- 잘못된 예 INSERT INTO people (id, name, age) VALUES(1, 'java119'); -- ERROR 1136! -- 3개 칼럼인데 2개 값만 제공 -- 올바른 예 INSERT INTO people (id, name, age) VALUES(1, 'java119', 24); 

​

🔑 데이터 무결성 에러

​

ERROR 1062: Primary Key 중복

​

\-- 'id'가 PRIMARY KEY일 때 INSERT INTO users (id, name) VALUES(1, 'Alice'); INSERT INTO users (id, name) VALUES(1, 'Bob'); -- ERROR 1062! -- 해결: 다른 id 사용 INSERT INTO users (id, name) VALUES(2, 'Bob'); 

​

ERROR 1061: 인덱스 이름 중복

​

\-- 잘못된 예 CREATE INDEX idx_name ON users(name); CREATE INDEX idx_name ON users(email); -- ERROR 1061! -- 올바른 예 CREATE INDEX idx_name ON users(name); CREATE INDEX idx_email ON users(email); 

​

ERROR 1072: 존재하지 않는 칼럼에 인덱스 생성

​

\-- 잘못된 예 CREATE INDEX idx_abc ON users(abc); -- ERROR 1072! -- 'abc' 칼럼이 없음 -- 올바른 예 CREATE INDEX idx_name ON users(name); 

​

🔄 복잡한 쿼리 에러

​

ERROR 1093: 같은 테이블을 INSERT와 SELECT에서 동시 사용

​

이 에러는 좀 까다로워요. INSERT 문에서 같은 테이블을 SELECT하려고 할 때 발생해요.

​

\-- 잘못된 예 INSERT INTO TESTNAME (ID, NAME, ORDER_NO) VALUES (1, 'Java119', ( SELECT IFNULL(MAX(ORDER_NO), 0) + 1 FROM TESTNAME WHERE ID = 1 )); -- ERROR 1093! -- 올바른 예: 서브쿼리에 별칭(alias) 사용 INSERT INTO TESTNAME (ID, NAME, ORDER_NO) VALUES (1, 'Java119', ( SELECT IFNULL(MAX(ORDER_NO), 0) + 1 FROM TESTNAME AS tableAlias WHERE ID = 1 )); 

​

ERROR 1222: UNION 사용 시 칼럼 개수 불일치

​

\-- 잘못된 예 SELECT id, name FROM people UNION SELECT id FROM people2; -- ERROR 1222! -- 첫 번째는 2개, 두 번째는 1개 칼럼 -- 올바른 예 SELECT id FROM people UNION SELECT id FROM people2; 

​

ERROR 1242: 서브쿼리가 여러 행 반환

​

\-- 잘못된 예 SELECT * FROM users WHERE id = (SELECT id FROM orders); -- ERROR 1242! -- 서브쿼리가 여러 개의 id를 반환 -- 올바른 예: IN 연산자 사용 SELECT * FROM users WHERE id IN (SELECT id FROM orders); -- 또는 ANY 사용 SELECT * FROM users WHERE id = ANY(SELECT id FROM orders); 

​

💡 실무 팁: 에러 해결 전략

​

1단계: 에러 코드 확인 에러 메시지에서 번호를 찾아요. 1000번대면 MySQL 에러, 2000번대면 연결 에러예요.

​

2단계: 에러 로그 확인

​

# MySQL 에러 로그 보기 tail -f /var/log/mysqld.log # 또는 more /etc/log/mysqld.log 

​

3단계: 단계별 테스트

​

먼저 MySQL이 실행 중인지 확인

​

권한이 있는지 확인

​

SQL 문법이 맞는지 확인

​

4단계: 구글링 전에 공식 문서 확인 MariaDB 공식 에러 코드 페이지: https://mariadb.com/kb/en/mariadb-error-codes/

​

🎯 에러별 빠른 체크리스트

​

에러원인해결책2002MySQL 미실행service mysqld start1044/1045권한 부족GRANT 명령 실행1007DB 중복DROP 후 재생성 또는 이름 변경1064문법 오류SQL 문법 재확인1054칼럼 없음칼럼명 확인1062PK 중복다른 값 사용1093같은 테이블 사용별칭(alias) 추가 

​

🔍 마치며

​

MySQL 에러는 처음엔 무섭지만, 패턴을 알면 정말 간단해요. 가장 중요한 건 에러 메시지를 정확히 읽는 것이에요. 대부분의 에러 메시지는 문제가 뭔지 명확하게 알려주거든요.

​

이 글을 북마크해두고, 에러가 나면 먼저 여기서 찾아보세요. 90% 이상의 경우는 여기 나온 해결책으로 해결될 거예요. 그리고 새로운 에러를 만나면 로그를 확인하고, 공식 문서를 참고하는 습관을 들이면 MySQL과 훨씬 친해질 수 있을 거랍니다.

​

개발하다가 에러 때문에 막힐 때가 있겠지만, 그건 누구나 겪는 거예요. 중요한 건 빠르게 해결하고 다음으로 나아가는 거니까요. 화이팅! 💪

​

#MySQL #에러해결 #데이터베이스 #개발팁 #SQL #MariaDB #백엔드개발 #서버관리 #디버깅

​

​

[원문 보기](https://blog.naver.com/choidz_/224102250843?fromRss=true&trackingCode=rss)
