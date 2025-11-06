# 자바(Java) 에러 로그 정리

---

**자바(Java) 에러 로그 18종 완전 정리 & 운영자 대응 가이드**
서버 로그를 보면 이런 문구 자주 보이시죠?
NullPointerException, OutOfMemoryError, SQLException …
운영자 입장에서 이런 에러를 보면
“서버 문제인가, 코드 문제인가?” 헷갈릴 때가 많습니다.
이 글에서는 **운영자 기준으로 현장에서 자주 발생하는 자바 오류 18종** 을
“뜻 → 운영자 대응 → 개발자 전달 포인트” 순으로 깔끔하게 정리했습니다.

---

**1\. NullPointerException**
java.lang.NullPointerException: Cannot invoke "String.length()" because "username" is null 
**뜻** : null 객체에 메서드를 호출했을 때 발생
**운영자 대응** : DB 조회 실패 or 입력 누락 의심
**개발자 전달 포인트** : “특정 API에서 NullPointer 발생, 입력값 확인 필요”

---

**2\. OutOfMemoryError**
java.lang.OutOfMemoryError: Java heap space 
**뜻** : JVM 힙 메모리 부족
**운영자 대응** : JVM Xmx 옵션 확인, Heap Dump 전달
**개발자 전달 포인트** : “메모리 누수 or 트래픽 급증 가능성”

---

**3\. StackOverflowError**
java.lang.StackOverflowError 
**뜻** : 재귀 호출 무한 반복
**운영자 대응** : 코드 로직 문제 가능, 발생 시점 로그 확보
**개발자 전달 포인트** : “무한 재귀 발생, 호출 구조 확인 필요”

---

**4\. SQLException**
java.sql.SQLException: Cannot open connection 
**뜻** : DB 연결 실패
**운영자 대응** : DB 서버 상태(ping, telnet, 서비스 상태`) 확인
**개발자 전달 포인트** : “DB 연결 불가, 커넥션 풀 또는 네트워크 점검 필요”

---

**5\. TimeoutException**
java.util.concurrent.TimeoutException: Request timed out 
**뜻** : 응답 지연으로 타임아웃 발생
**운영자 대응** : 외부 API, DB 쿼리, 네트워크 지연 확인
**개발자 전달 포인트** : “응답 시간 초과, 성능 문제 가능성”

---

**6\. ClassNotFoundException**
java.lang.ClassNotFoundException: com.mysql.jdbc.Driver 
**뜻** : 클래스 파일을 찾지 못함 (보통 JAR 누락)
**운영자 대응** : 배포 경로(/lib 폴더) 확인
**개발자 전달 포인트** : “라이브러리 누락 or 빌드 경로 오류”

---

**7\. NoSuchMethodError**
java.lang.NoSuchMethodError: org.springframework.web.context.ContextLoaderListener.<init>(...) 
**뜻** : 라이브러리 버전 차이로 메서드 존재 안 함
**운영자 대응** : 빌드 환경 및 버전 충돌 확인
**개발자 전달 포인트** : “버전 불일치, 의존성 확인 필요”

---

**8\. NoClassDefFoundError**
java.lang.NoClassDefFoundError: com/example/MyService 
**뜻** : 컴파일 시엔 있었지만 실행 중 JVM이 클래스 로딩 실패
**운영자 대응** : 배포된 JAR 무결성(jar tf) 확인
**개발자 전달 포인트** : “JAR 손상 또는 로더 충돌 가능성”

---

**9\. IllegalArgumentException**
java.lang.IllegalArgumentException: Parameter 'id' cannot be null 
**뜻** : 잘못된 인자 전달
**운영자 대응** : API 요청 파라미터 확인
**개발자 전달 포인트** : “잘못된 파라미터 전달, 입력 검증 필요”

---

**10\. NumberFormatException**
java.lang.NumberFormatException: For input string: "abc" 
**뜻** : 문자열 → 숫자 변환 실패
**운영자 대응** : 입력값 숫자 여부 확인
**개발자 전달 포인트** : “입력 포맷 검증 필요”

---

**11\. IOException**
java.io.IOException: Connection reset by peer 
**뜻** : 파일 or 네트워크 입출력 중 예외 발생
**운영자 대응** : 파일 경로, 포트, 네트워크 상태 확인
**개발자 전달 포인트** : “I/O 예외 발생, 네트워크/파일 접근 점검”

---

**12\. FileNotFoundException**
java.io.FileNotFoundException: /data/config/app.properties (No such file or directory) 
**뜻** : 지정한 파일이 존재하지 않음
**운영자 대응** : 파일 존재 여부, 권한(ls -l) 확인
**개발자 전달 포인트** : “설정 파일 누락 또는 경로 오타”

---

**13\. ArithmeticException**
java.lang.ArithmeticException: / by zero 
**뜻** : 수학 연산 오류 (0으로 나눔 등)
**운영자 대응** : 입력값 확인
**개발자 전달 포인트** : “0 나누기 발생, 로직 점검 필요”

---

**14\. ArrayIndexOutOfBoundsException**
java.lang.ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 5 
**뜻** : 배열 인덱스 초과
**운영자 대응** : 단순 로직 오류, 재현 로그 확보
**개발자 전달 포인트** : “배열 크기 초과 접근, 반복문 확인 필요”

---

**15\. ConcurrentModificationException**
java.util.ConcurrentModificationException 
**뜻** : 컬렉션 순회 중 변경 발생
**운영자 대응** : 코드 논리 문제 → 발생 API 기록
**개발자 전달 포인트** : “컬렉션 수정 중 순회, 동기화 필요”

---

**16\. UnsupportedOperationException**
java.lang.UnsupportedOperationException 
**뜻** : 불변 컬렉션에 수정 연산 수행
**운영자 대응** : 코드 수정 필요
**개발자 전달 포인트** : “불변 객체 수정 시도, 로직 검증 필요”

---

**17\. InvocationTargetException**
java.lang.reflect.InvocationTargetException 
**뜻** : 리플렉션으로 호출된 메서드 내부에서 예외 발생
**운영자 대응** : 내부 cause 로그 확인
**개발자 전달 포인트** : “리플렉션 호출 내부 에러, cause 분석 필요”

---

**18\. IllegalStateException**
java.lang.IllegalStateException: Cannot call sendRedirect() after response has been committed 
**뜻** : 잘못된 시점에 메서드 호출
**운영자 대응** : 요청 처리 순서 점검
**개발자 전달 포인트** : “호출 순서 문제, 응답 시점 검증 필요”

---

**🧩 로그 분석 3단계 프로세스**
**1단계: 서버 레벨 점검**
  * CPU / 메모리 → top, free -m
  * 디스크 용량 → df -h
  * 네트워크 → ping, telnet
  * 시스템 로그 → /var/log/messages, /var/log/syslog

**2단계: 애플리케이션 레벨 점검**
  * 프로세스 상태 → ps -ef | grep java
  * 포트 점검 → netstat -tulnp | grep 8080
  * 로그 분석 → grep ERROR app.log | tail -n 50
  * 패턴 탐색 → 특정 시간대 집중 발생 여부

**3단계: 코드 레벨 점검**
  * 스택트레이스 분석 → at com.myapp.service.UserService.java:45
  * Request ID 기반으로 같은 트랜잭션 묶기
  * 오류 유형별로 근거 정리 후 개발자 전달

---

**🧭 요약 표**

| 구분      | 대표 에러                                  | 주요 원인    | 운영자 대응     | 개발자 포인트   |
| ------- | -------------------------------------- | -------- | ---------- | --------- |
| null 관련 | NullPointer                            | null 참조  | 입력/DB 확인   | NPE 위치 전달 |
| 메모리     | OutOfMemory                            | JVM 부족   | Heap Dump  | 누수 점검     |
| DB      | SQLException                           | 연결 실패    | DB 상태 확인   | 커넥션 점검    |
| 파일/입출력  | IOException                            | 파일/네트워크  | 경로/권한 점검   | 접근 로직 확인  |
| 클래스 로딩  | ClassNotFound / NoClassDef             | 라이브러리 충돌 | JAR 무결성 확인 | 빌드 환경 점검  |
| 데이터 형식  | NumberFormat / IllegalArgument         | 잘못된 입력   | 요청값 검증     | 파라미터 검증   |
| 로직      | ArrayIndex / Arithmetic / IllegalState | 코드 오류    | 로그 확보      | 로직 수정     |
| 동시성     | ConcurrentModification                 | 동시 수정    | 재현 로그      | 동기화 필요    |

---

**🚀 예시 시나리오**
> 사용자: “로그인 안 돼요”
  1. 서버 점검 → 정상
  2. 로그 확인 →

ERROR ... SQLException: Cannot open connection 
  1. DB 포트 접근 불가 확인

✅ 결론 → DB 서버 다운으로 로그인 실패
운영자: “DB 3306 포트 응답 없음 확인됨”
개발자: 즉시 원인 파악 가능 👍

---

**✍️ 마무리**
운영자의 역할은 **빠른 진단 + 정확한 근거 전달** 입니다.
에러 로그를 구조적으로 해석하면
개발자와의 커뮤니케이션 속도는 훨씬 빨라집니다 🚀

---

📌 _태그:_
#자바오류 #서버운영 #로그분석 #개발운영협업 #JavaException

[원문 보기](https://blog.naver.com/choidz_/224066033974?fromRss=true&trackingCode=rss)
