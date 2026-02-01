# Supabase 시작하기: PostgreSQL 기반 BaaS로 백엔드 구축하기

---

Supabase는 Firebase의 오픈소스 대안으로, PostgreSQL 기반의 클라우드 백엔드 서비스입니다. 데이터베이스, 인증, 스토리지, 벡터 DB(pgvector) 등을 한 곳에서 관리할 수 있으며, 특히 RAG 시스템이나 복잡한 관계형 데이터 처리가 필요한 프로젝트에 적합합니다. 무료 플랜으로 시작 가능하지만 1주일 비활성화 시 프로젝트가 일시정지되므로 주의가 필요합니다.

​

**목차**

  1. Supabase란 무엇인가

  2. 회원가입 및 프로젝트 생성

  3. 테이블 생성 및 기본 CRUD

  4. JavaScript 연동

  5. 벡터 DB(pgvector)로 RAG 시스템 구축

  6. 요금제 및 주의사항

---

**Supabase란 무엇인가**

Supabase는 PostgreSQL을 기반으로 한 오픈소스 BaaS(Backend as a Service) 플랫폼입니다. 복잡한 서버 인프라 구축 없이도 데이터베이스, 사용자 인증, 실시간 데이터 동기화, 파일 스토리지, 엣지 함수 등 웹/모바일 애플리케이션에 필요한 모든 백엔드 기능을 제공합니다.

Firebase와 가장 큰 차이점은 NoSQL이 아닌 PostgreSQL을 사용한다는 것입니다. 이는 SQL에 익숙한 개발자들에게 큰 장점이며, 복잡한 쿼리와 관계형 데이터 처리가 가능합니다. 특히 AI 시대에 pgvector를 통한 벡터 DB 기능을 제공하므로 RAG 시스템 구축에 매우 적합합니다.

**Supabase의 주요 기능**

  * **PostgreSQL 데이터베이스** : SQL 쿼리 및 다양한 데이터베이스 작업 수행 가능

  * **Authentication** : 사용자 회원가입, 로그인, OAuth 연동(Google, GitHub 등)

  * **Storage** : 이미지, 파일 등 사용자 업로드 파일 관리

  * **Realtime** : 실시간 데이터 동기화

  * **pgvector** : 벡터 데이터 저장 및 유사도 검색으로 RAG 시스템 구축

  * **Edge Functions** : 서버리스 함수 실행

---

**회원가입 및 프로젝트 생성**

**Step 1: Supabase 회원가입**

  1. **supabase.com 접속** 후 우측 상단의 'Sign In' 또는 'Start your project' 버튼 클릭

  2. **인증 방식 선택** : 이메일/비밀번호 입력 또는 GitHub/Google 소셜 로그인 (GitHub 추천)

  3. **이메일 인증** : 받은 메일에서 "Confirm Your Signup" 링크 클릭 (10분 내 완료)

  4. **조직 및 프로젝트 설정** : 개인 계정이면 자동 생성된 조직 선택, Region은 Seoul 선택

> **💡 팁** : GitHub 계정으로 가입하면 나중에 프로젝트와 연동할 때 편리합니다. 특히 Edge Functions나 GitHub Actions를 활용할 계획이라면 GitHub 연동을 추천합니다.

**Step 2: API 키 확인 및 저장**

프로젝트 생성 완료 후 좌측 사이드바에서 **Project Settings → API** 메뉴로 이동합니다. 여기서 Project URL과 anon public key를 확인하여 저장해야 합니다.

> **⚠️ 보안 주의** : anon key는 클라이언트에서 사용하고, service_role key는 서버사이드에서만 사용해야 합니다. service_role key는 절대 클라이언트에 노출되면 안 됩니다!

---

**테이블 생성 및 기본 CRUD**

**Step 3: 첫 번째 테이블 만들기**

좌측 사이드바에서 **Table Editor** 로 이동하여 'Create a new table' 버튼을 클릭합니다. 테이블 이름을 입력하고 **Enable Row Level Security (RLS)** 체크박스를 반드시 활성화해야 합니다. RLS는 DB의 각 데이터 행에 대한 접근 보안정책으로, 이를 통해 아무나 DB 특정 데이터에 접근하는 것을 방지합니다.

필요에 따라 컬럼을 추가할 때 **Type**(데이터 타입)과 **Default value**(필수 여부)를 설정합니다. id 컬럼은 해당 테이블의 기본 키로 각 데이터의 고유한 식별자 역할을 합니다.

**SQL Editor로 테이블 생성**

Supabase의 SQL Editor는 AI 기능과 접목되어 있어 보다 편리하게 커스터마이징된 테이블 코드 작성이 가능합니다. PostgreSQL 문법에 익숙하지 않더라도 간편하게 테이블 구조를 작성할 수 있습니다.

**데이터 CRUD 작업**

**Create (생성)** : 새로운 할 일 추가

**Read (조회)** : 모든 할 일 또는 특정 조건의 할 일 조회

**Update (수정)** : 특정 할 일의 상태 변경

**Delete (삭제)** : 할 일 목록에서 제거

**RLS 정책 설정**

처음 데이터를 수정하려고 할 때 "permission denied for table" 같은 에러를 만날 수 있습니다. 이는 RLS 때문이며, 적절한 정책(Policy)이 없으면 데이터를 조회하거나 수정할 수 없습니다. 개발 초기에는 RLS를 비활성화하여 편하게 개발하고, 프로덕션 배포 전에 보안 정책을 세밀하게 설정하는 것을 추천합니다.

---

**JavaScript와 Supabase 연동**

**패키지 설치**

공식 문서에 따라 먼저 Supabase JavaScript 클라이언트 패키지를 설치합니다.

**Supabase 클라이언트 초기화**

프로젝트에 Supabase용 파일을 만든 후 공식문서에 따라 초기화 코드를 작성합니다. 환경변수에 앞서 복사한 URL과 API KEY를 할당하여 민감한 정보를 관리합니다.

**CRUD 코드 작성**

만들어 둔 테이블의 **API Docs** 를 참고하여 원하는 CRUD 관련 코드를 확인하고 클라이언트에 API 코드를 작성합니다.

---

**벡터 DB(pgvector)로 RAG 시스템 구축**

**pgvector 확장 활성화**

최근 AI 기술의 발전과 함께 벡터 데이터베이스에 대한 관심이 높아지고 있습니다. Supabase는 PostgreSQL 기반이기 때문에 pgvector 확장을 통해 벡터 데이터를 효율적으로 관리하고 유사성 검색을 수행할 수 있습니다. 이는 RAG(Retrieval Augmented Generation) 시스템이나 추천 시스템 등 다양한 AI 서비스 구축에 필수적입니다.

Supabase 대시보드에서 **Database → Extensions** 로 이동하여 검색창에 "vector"를 입력한 후 **vector** 확장의 'Enable' 버튼을 클릭합니다. 또는 SQL Editor에서 다음 명령어로 활성화할 수 있습니다.

**RAG 시스템용 테이블 및 함수 생성**

벡터 데이터를 저장할 테이블을 생성합니다. embedding 컬럼에 1536차원 벡터를 저장하는데, 이는 OpenAI의 text-embedding-ada-002 모델이 생성하는 임베딩 차원입니다.

​

[원문 보기](https://blog.naver.com/choidz_/224072955787?fromRss=true&trackingCode=rss)
