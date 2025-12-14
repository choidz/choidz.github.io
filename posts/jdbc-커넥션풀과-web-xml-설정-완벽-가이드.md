# JDBC 커넥션풀과 web.xml 설정 완벽 가이드

---

​

**JSP/톰캣에서 JDBC 커넥션풀 설정하기: server.xml과 web.xml 완벽 가이드**

**​**

JDBC 커넥션풀은 톰캣의 Context.xml에서 Resource 태그로 정의하고, 웹 애플리케이션의 web.xml에서 resource-ref로 참조합니다. 데이터베이스 연결 정보(드라이버, URL, 계정)와 풀 크기(maxActive, maxIdle) 설정이 핵심이며, MySQL과 Oracle 설정 방식이 다릅니다. web.xml은 서블릿 초기화, 세션 관리, 필터/리스너 설정 등 웹 애플리케이션 전체 동작을 제어하는 배포 기술자 역할을 합니다.

**목차**

  1. 커넥션풀이란 무엇인가

  2. server.xml에서 Resource 정의하기

  3. web.xml에서 resource-ref 설정하기

  4. Resource 태그 주요 속성 설명

  5. web.xml의 역할과 주요 기능

---

**커넥션풀이란 무엇인가**

데이터베이스 연결은 비용이 많이 드는 작업입니다. 요청이 올 때마다 새로운 연결을 만들고 닫으면 성능이 급격히 떨어집니다. 커넥션풀은 미리 정해진 개수의 데이터베이스 연결을 생성하고 유지하다가, 필요할 때 재사용하는 기법입니다.

톰캣은 JNDI(Java Naming and Directory Interface)를 통해 커넥션풀을 관리합니다. 개발자는 직접 연결을 생성하지 않고, 풀에서 연결을 빌려 쓰고 반환하면 됩니다.

---

**server.xml에서 Resource 정의하기**

**MySQL 설정 예시**

```
<Resource 
  name="jdbc/jsptesto" 
  auth="Container" 
  type="javax.sql.DataSource" 
  driverClassName="com.mysql.cj.jdbc.Driver" 
  username="ora_user" 
  password="1234" 
  url="jdbc:mysql://localhost:3306/jsptest?serverTimezone=UTC" 
  maxWait="5000" />
``` 

**Oracle 설정 예시**

```
<Resource 
  name="jdbc/jsptesto" 
  url="jdbc:oracle:thin:@localhost:1521:orcl" 
  username="scott" 
  password="tiger" 
  auth="Container" 
  type="javax.sql.DataSource" 
  driverClassName="oracle.jdbc.driver.OracleDriver" 
  maxWait="5000" />
``` 

Resource 태그는 톰캣 설치 경로의 conf/Catalina/localhost/ 디렉터리 내 Context.xml 파일에 작성합니다. 데이터베이스 종류에 따라 드라이버 클래스명과 URL 형식이 달라집니다.

---

**web.xml에서 resource-ref 설정하기**

**MySQL 참조 설정**

```
<resource-ref>
<description>jsptest db</description>
<res-ref-name>jdbc/jsptest</res-ref-name>
<res-type>javax.sql.DataSource</res-type>
<res-auth>Container</res-auth>
</resource-ref>
``` 

​

**Oracle 참조 설정**

```
<resource-ref>
<description>jsptest oracledb</description>
<res-type>javax.sql.DataSource</res-type>
<res-ref-name>jdbc/jsptesto</res-ref-name>
<res-auth>Container</res-auth>
</resource-ref>
``` 

web.xml의 resource-ref는 server.xml에서 정의한 Resource를 웹 애플리케이션이 사용하겠다고 선언하는 부분입니다. res-ref-name은 server.xml의 name 속성과 반드시 일치해야 합니다.

---

**Resource 태그 주요 속성 설명**

maxActive는 동시에 사용할 수 있는 연결 수이고, maxIdle은 사용하지 않아도 유지할 연결 수입니다. 트래픽이 많은 서비스는 이 값들을 적절히 증가시켜야 합니다.

---

**web.xml의 역할과 주요 기능**

web.xml은 웹 애플리케이션의 배포 기술자(deployment descriptor)로, 톰캣이 애플리케이션을 시작할 때 가장 먼저 읽는 설정 파일입니다. 성(城)의 문지기가 방문객을 관리하듯, web.xml은 모든 요청을 제어합니다.

**주요 기능**

  * **서블릿 컨텍스트 초기 파라미터:** 애플리케이션 전체에서 공유하는 암호 같은 설정값을 정의합니다. 한 번 설정하면 어디서든 접근 가능합니다.

  * **세션 유효시간 설정:** 사용자가 로그인 후 활동 없이 유지될 수 있는 시간을 지정합니다. 시간 초과 시 세션이 자동 종료됩니다.

  * **서블릿/JSP 정의 및 매핑:** 서블릿이 어디에 있는지(정의)와 어떤 URL로 접근할지(매핑)를 설정합니다. 예를 들어 "/user"라는 요청이 UserServlet으로 가도록 연결합니다.

  * **MIME 타입 매핑:** 파일 확장자에 따른 콘텐츠 타입을 정의합니다. .pdf는 application/pdf, .jpg는 image/jpeg 등으로 처리하도록 지정합니다.

  * **Welcome File List:** 사용자가 디렉터리만 요청했을 때 보여줄 기본 파일을 지정합니다. 보통 index.html이나 index.jsp입니다.

  * **에러 페이지 처리:** 404, 500 등 에러 발생 시 보여줄 페이지를 정의합니다.

  * **필터(Filter) 설정:** 모든 요청에 전처리를 적용합니다. 예를 들어 문자 인코딩 변환, 권한 검사 등을 요청 전에 수행합니다.

  * **리스너(Listener) 설정:** 애플리케이션 시작/종료, 세션 생성/소멸 등 특정 이벤트를 감지하고 처리합니다.

필터는 총을 빼앗는 보안 검사처럼 모든 요청에 적용되고, 리스너는 술 잘 먹는 사람만 찾는 전문 검사원처럼 특정 조건을 확인하는 역할을 합니다.

---

**커넥션풀 사용 예시 (JSP)**

```
Context ctx = new InitialContext();
DataSource ds = (DataSource) ctx.lookup("java:comp/env/jdbc/jsptesto");
Connection conn = ds.getConnection();
// 쿼리 실행
conn.close(); // 연결을 풀에 반환
``` 

JNDI lookup을 통해 server.xml에서 정의한 커넥션풀을 얻고, 필요한 연결을 가져옵니다. close() 호출 시 연결이 실제로 종료되지 않고 풀에 반환되어 재사용됩니다.

---

**#JDBC #커넥션풀 #톰캣 #JSP #server.xml #web.xml #JNDI #DataSource #MySQL #Oracle**

​

[원문 보기](https://blog.naver.com/choidz_/224072945124?fromRss=true&trackingCode=rss)
