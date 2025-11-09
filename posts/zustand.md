# Zustand로 데이터 상태 관리하기 | 코드 분석기 사례

---

**🧠 Zustand로 분석 데이터 오케스트레이션하기**

**my-code-docs 프로젝트 설계 기록**

---

my-code-docs는 수백 개의 파일이 담긴 ZIP을 분석해

**의존성 그래프, 리포트, 진행률 등을 한 화면에서 보여주는 도구** 입니다.

초기에는 각 React 컴포넌트에서 useState로 결과를 전달했지만,

분석 타입이 늘어나면서 상태 흐름이 꼬이고 중복 로직이 많아졌습니다.

이 문제를 해결하기 위해 선택한 솔루션이 바로 **Zustand** 입니다.

---

**🚀 왜 Zustand였을까?**

  1. **보일러플레이트 최소화**

  2. Redux도 고려했지만, 비동기 미들웨어와 타입 선언을 붙이면 코드량이 급격히 늘어났습니다.

  3. 분석 결과를 일회성으로 받아 UI에 뿌리는 구조에서는 **가벼운 스토어** 가 더 유리했습니다.

  4. **부분 구독(selector) 지원**

  5. 결과 데이터가 많아도 필요한 조각만 구독하도록 만들기 쉬웠습니다.

  6. **TypeScript 친화적**

  7. 프로젝트 전반이 TypeScript로 작성되어 있어, 스토어 타입 추론이 자연스럽게 이어져야 했습니다.

---

**🧩 스토어 구조 설계**

스토어 초기화는 src/store/analysisStore.ts에서 이루어집니다.

핵심 구조는 다음과 같습니다.

```
interface AnalysisState {

isLoading: boolean;

error: string | null;

currentProjectId: string | null;

progress: AnalysisProgress | null;

  

extractedFiles: ExtractedFile[] | null;

projectSummary: string | null;

moduleReport: string | null;

reactReport: string | null;

functionReport: string | null;

aiReportsResult: string | null;

  

graphData: { nodes: Node[]; edges: Edge[] } | null;

moduleGraphData: { nodes: Node[]; edges: Edge[] } | null;

heatmapData: any | null;

mermaidDiagram: string | null;

  

startAnalysis(): void;

setError(message: string | null): void;

handleAnalysisResult(results: AnyAnalysisPayload[], target?: string): void;

loadProjectResult(result: StoredAnalysisResult): void;

clearAllResults(): void;

setCurrentProjectId(id: string | null): void;

setProgress(progress: AnalysisProgress): void;

setExtractedFiles(files: ExtractedFile[]): void;

}
```

---

**🔹 도메인별 상태 분리**

  * **텍스트 리포트 계층**

  * projectSummary, moduleReport, reactReport, functionReport, aiReportsResult

  * → UI가 필요한 섹션만 구독하도록 분리했습니다.

  * **시각화 계층**

  * ReactFlow 그래프(graphData, moduleGraphData), 히트맵, Mermaid 다이어그램 등

  * 시각화 전용 필드를 따로 관리합니다.

  * **메타 상태**

  * 로딩, 오류, 진행률 등 공통 UI 상태를 별도로 두어 액션 간 재사용합니다.

---

**⚙️ 핵심 액션 패턴**

**1️⃣ startAnalysis**

분석 시작 전, 전체 상태를 초기화합니다.

이전 결과가 남지 않도록 모든 리포트/그래프 상태를 초기값으로 되돌립니다.

progress도 null로 리셋하여 새 작업이 시작됐음을 표시합니다.

---

**2️⃣ handleAnalysisResult**

워커나 메인 스레드에서 전달된 AnyAnalysisPayload[]를 분석 유형별로 분기 처리합니다.

  * **dependency-graph**

  * ReactFlow 노드/엣지로 변환하며 함수 복잡도, LOC 등 메타데이터를 포함합니다.

  * **module-graph**

  * 순환 의존성·허브·고아 모듈 분석 후 Markdown으로 moduleReport에 저장합니다.

  * **markdown-report**

  * 파일별 리포트를 문자열 배열에 누적 → --- 구분자로 합쳐 aiReportsResult에 저장합니다.

  * **project-summary**

  * package.json 기반 프로젝트 요약을 별도 필드로 관리해 UI에서 바로 표시합니다.

---

**3️⃣ setError**

오류 발생 시 Markdown으로 감싸 UI에서 바로 렌더링합니다.

null이면 로딩 상태를 해제하고 에러 메시지를 숨깁니다.

---

**4️⃣ setExtractedFiles**

ZIP 업로드 시 필터링된 파일 목록을 보관합니다.

나중에 재분석이나 복원 시 이 목록을 함께 활용합니다.

---

**🔄 훅과의 연동 (useAnalysis)**

src/hooks/useAnalysis.ts는 분석 실행을 담당하는 커스텀 훅입니다.

  * 전처리 단계: startAnalysis, setExtractedFiles 호출

  * 웹 환경: runWebAnalysis 결과를 handleAnalysisResult로 전달

  * Electron 환경: IPC 결과 수신 후 동일한 액션 호출

  * 진행률은 워커가 주기적으로 보내며 setProgress로 반영

UI는 useAnalysisStore(selector)로 필요한 조각만 구독합니다.

예:

  * 진행률 컴포넌트 → progress만 구독

  * 그래프 패널 → graphData만 구독

불필요한 렌더링이 없으므로 성능이 안정적입니다.

---

**💾 영속화와 복원 전략**

분석 결과 저장을 위해 스토어는 StoredAnalysisResult 타입과 호환되게 설계했습니다.

  * **저장 시점** : 분석 완료 후 저장 시 스토어 상태를 직렬화해 로컬 스토리지에 저장

  * **복원 시점** : 다른 프로젝트 전환 시 loadProjectResult로 복원

추후에는 **IndexedDB나 백엔드 API** 를 통해

여러 사용자가 분석 결과를 공유할 수 있도록 확장할 계획입니다.

---

**🧪 테스트 전략**

Zustand는 얇은 추상화 구조라, 스토어 자체보다는 **시나리오 테스트** 를 중심으로 합니다.

  1. 더미 AnyAnalysisPayload[]로 handleAnalysisResult 실행

  2. 결과 그래프·리포트가 기대 형식으로 변환되었는지 확인

  3. setError(null) 호출 후 에러 초기화 확인

이로써 내부 구현 변경에도 외부 동작 일관성을 검증할 수 있습니다.

---

**💡 운영하며 얻은 인사이트**

  1. **상태를 도메인별로 나누면 새 기능 추가 시 영향이 최소화된다.**

  2. **실패/성공/복원 시나리오를 모두 고려한 액션 설계가 훅과 컴포넌트를 단순화한다.**

  3. **Zustand의 selector + shallow 비교를 활용하면 대용량 데이터에서도 리렌더링이 안정적이다.**

---

Zustand는 “필요한 만큼만 제공하는 도구”입니다.

my-code-docs는 이를 통해 복잡한 분석 결과를 깔끔히 오케스트레이션하면서,

새로운 분석 타입을 쉽게 추가할 수 있는 기반을 마련했습니다.

​

프로젝트는 현재 진행중입니다

​

my-code-docs는 개발자의 **코드 리포지토리(zip, 폴더 단위)** 를 분석해

**의존성 그래프, 파일 구조, 코드 리포트, 요약 결과** 를 자동으로 생성하는 **분석 시각화 도구** 입니다.

이 도구는 여러 소스코드 파일을 업로드하면, 내부 분석 엔진이 다음을 수행합니다.

  1. 📂 **파일 구조 분석** — 프로젝트의 계층 구조를 트리 형태로 시각화

  2. 🔍 **의존성 그래프 생성** — 모듈 간 연결 관계를 ReactFlow 기반 그래프로 표현

  3. 🧠 **코드 리포트 생성** — 주요 함수, 모듈별 분석 결과를 **Markdown 형식 리포트** 로 자동 변환

  4. 💬 **AI 요약** — 코드의 특징, 설계 의도, 복잡도 등을 자연어로 정리

  5. 📈 **진행률 및 분석 상태 표시** — 분석 과정의 진행률을 실시간 표시

Zustand를 중심으로 상태를 관리하며,

분석 데이터의 흐름을 컴포넌트 간에 **유연하게 오케스트레이션** 하도록 설계되었습니다.

---

🔗 **프로젝트 데모 보기** 

👉 [[https://code-docs-nu.vercel.app/](https://code-docs-nu.vercel.app/)](<https://code-docs-nu.vercel.app/%5D%28https://code-docs-nu.vercel.app/%29>)

​

📌 **#Zustand #React #TypeScript #StateManagement #mycodedocs #FrontendArchitecture**

[원문 보기](https://blog.naver.com/choidz_/224066241807?fromRss=true&trackingCode=rss)
