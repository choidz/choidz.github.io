const posts = [
  {
    slug: "welcome-to-the-new-blog",
    title: "블로그를 새로 시작합니다",
    description:
      "포트폴리오 홈페이지를 블로그 중심으로 개편하면서 앞으로 다룰 주제와 방향을 정리했습니다.",
    date: "2024-04-30",
    tags: ["#커뮤니티", "#기획", "#회고"],
    coverGradient: "from-indigo-500 via-purple-500 to-pink-500",
    readingMinutes: 1,
    contentPath: "/posts/welcome-to-the-new-blog.md",
  },
  {
    slug: "building-a-personal-dev-blog",
    title: "개발 블로그를 직접 만들며 배운 점",
    description:
      "정적 페이지 기반의 개인 홈페이지에 블로그 기능을 얹기까지의 시행착오와 배운 점을 정리했습니다.",
    date: "2024-03-27",
    tags: ["#React", "#Frontend", "#개발환경"],
    coverGradient: "from-slate-900 via-slate-700 to-slate-500",
    readingMinutes: 1,
    contentPath: "/posts/building-a-personal-dev-blog.md",
  },
  {
    slug: "stack-decisions-for-2024",
    title: "2024년 개발 스택 선택 기준",
    description:
      "업무와 사이드 프로젝트에서 사용 중인 기술 스택을 정리하고, 선택 기준을 공유합니다.",
    date: "2024-02-18",
    tags: ["#기술스택", "#생산성", "#개발문화"],
    coverGradient: "from-amber-400 via-orange-500 to-rose-500",
    readingMinutes: 1,
    contentPath: "/posts/stack-decisions-for-2024.md",
  },
  {
    slug: "shipping-side-project-fast",
    title: "사이드 프로젝트를 빠르게 출시하는 5단계",
    description:
      "아이디어를 검증하고 MVP를 완성해 실제 사용자 앞에 내놓기까지의 워크플로우를 정리했습니다.",
    date: "2024-01-22",
    tags: ["#Product", "#스타트업", "#MVP"],
    coverGradient: "from-sky-400 via-cyan-500 to-emerald-500",
    readingMinutes: 1,
    contentPath: "/posts/shipping-side-project-fast.md",
  },
  {
    slug: "devto-style-ui-breakdown",
    title: "dev.to 스타일 UI를 Tailwind로 구현하며 배운 것",
    description:
      "커뮤니티형 블로그 레이아웃을 재구성하면서 고려한 컴포넌트 구조와 반응형 전략을 공유합니다.",
    date: "2023-12-08",
    tags: ["#Tailwind", "#UI/UX", "#리팩터링"],
    coverGradient: "from-violet-500 via-indigo-500 to-blue-500",
    readingMinutes: 1,
    contentPath: "/posts/devto-style-ui-breakdown.md",
  },
  {
    slug: "elasticsearch-core-guide",
    title: "Elasticsearch 핵심 개념 정리",
    description:
      "클러스터, 샤드, 매핑부터 모니터링 지표까지 Elasticsearch 구조와 운영 개념을 정리했습니다.",
    date: "2024-05-02",
    tags: ["#Elasticsearch", "#검색", "#운영"],
    coverGradient: "from-emerald-500 via-teal-500 to-blue-500",
    readingMinutes: 3,
    contentPath: "/posts/elasticsearch-core-guide.md",
  },
];

export default posts;
