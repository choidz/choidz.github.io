export const HERO_CONTENT = {
  badge: "🧑‍💻 최성현 · Product/Data Engineer",
  title: "데이터 설계부터 UI까지 잇는 풀스택 메이커",
  description:
    "ExtJS·Java·MSSQL로 전통적인 웹 시스템을 구축하며 DB 모델링과 프로시저를 직접 설계했고, WAS 배포까지 책임졌습니다. 필요한 경우 React/Flutter로 사용자 경험을 구현하며 제품 가치를 빠르게 검증합니다.",
  highlights: [
    "비즈니스 도메인에 맞춘 스키마 설계·프로시저 최적화",
    "ExtJS/React 기반 업무용 UI, Flutter 실험 앱까지 제작",
    "WAS 구성과 서버 배포를 포함한 엔드투엔드 오너십",
  ],
  ctas: [
    {
      label: "Notion 이력서",
      href: "https://choidz.notion.site/80ed5c2ce57e4124880ef02a3f5bf5e3",
      variant: "primary",
    },
    { label: "GitHub", href: "https://github.com/choidz", variant: "ghost" },
  ],
  stats: [
    { label: "Commercial Projects", value: "25+" },
    { label: "UI Systems", value: "6" },
    { label: "Satisfied Clients", value: "12" },
  ],
  location: "경기 화성 · Remote Friendly",
  profileImage: "/images/profile.jpeg",
};

export const SKILL_STACKS = [
  {
    title: "프로그래밍 언어",
    skills: [
      { name: "Java" },
      { name: "JavaScript", icon: "/images/skills/js.png" },
      { name: "TypeScript", icon: "/images/skills/js.png" },
      { name: "SQL (MSSQL)" },
    ],
  },
  {
    title: "프레임워크 / 라이브러리",
    skills: [
      { name: "Spring" },
      { name: "ExtJS" },
      { name: "MyBatis" },
      { name: "React.js" },
      { name: "Flutter" },
      { name: "Tailwind CSS", icon: "/images/skills/tailwind.png" },
    ],
  },
  {
    title: "데이터베이스",
    skills: [
      { name: "MSSQL" },
      { name: "MySQL" },
      { name: "Oracle" },
      { name: "Firebase" },
    ],
  },
  {
    title: "개발 도구 & 환경",
    skills: [
      { name: "SVN" },
      { name: "Git / GitHub / GitHub Desktop" },
      { name: "Eclipse" },
      { name: "VS Code" },
    ],
  },
  {
    title: "협업 & 기타",
    skills: [
      { name: "Slack" },
      { name: "Notion" },
      { name: "Flow" },
      { name: "Confluence" },
      { name: "Photoshop" },
      { name: "Illustrator" },
    ],
  },
];

export const EXPERIENCE = [
  {
    period: "2023 — 현재",
    role: "Product / Data Engineer",
    company: "Freelance & Personal Projects",
    summary:
      "DB 설계와 API 백엔드를 중심으로, React/Flutter UI까지 직접 구현하며 전체 제품 흐름을 실험했습니다.",
    highlights: [
      "MSSQL·MySQL 기반 스키마 및 Stored Procedure 설계",
      "ExtJS·React·Flutter로 요구사항 맞춤형 UI 제공",
      "WAS 구성·배포 자동화를 통해 릴리즈 리드타임 단축",
    ],
  },
  {
    period: "2020 — 2022",
    role: "Fullstack Engineer",
    company: "1인 웹에이전시",
    summary:
      "고객 요구 분석부터 DB 설계, ExtJS 프런트, Java 백엔드, 배포까지 전 과정을 담당했습니다.",
    highlights: [
      "복잡한 업무 로직을 Stored Procedure와 배치 작업으로 구현",
      "ExtJS UI와 JSP 기반 화면을 동시에 유지하며 운영 자동화",
      "서버 컴퓨터/네트워크 환경에 직접 배포하고 성능 모니터링",
    ],
  },
];

export const PROJECTS = [
  {
    slug: "spler",
    title: "SPLER",
    context: "대학교 개인 프로젝트",
    color: "sky", // 하늘색
    description:
      "스터디·사이드 프로젝트 팀원을 빠르게 매칭하는 커뮤니티 웹 서비스. 모집글 템플릿과 지원 현황을 한 화면에서 관리합니다.",
    impact:
      "카테고리 필터링과 알림 시스템을 React 컴포넌트로 분리해 유지보수 부담을 40% 줄였습니다.",
    image: "images/projects/SPLER.png",
    period: "2022.11 — 2022.12",
    tags: ["Java", "JSP", "Spring", "JavaScript", "MySQL"],
    links: [
      {
        label: "Notion",
        href: "https://choidz.notion.site/Study-Project-Player-SPLER-a6a7ca0ed5af41c3a9f4ad7e25a01d07?pvs=74",
        icon: "/images/notion.svg",
      },
      {
        label: "GitHub",
        href: "https://github.com/choidz/SPLER",
        icon: "/images/github.svg",
      },
    ],
  },
  {
    slug: "dob",
    title: "Do Our Best (DOB)",
    context: "대학교 팀 프로젝트",
    color: "amber", // 노란색
    description:
      "조별 과제 진행 상황과 구성원 기여도를 투명하게 관리하는 모바일 앱. 일정·기여도·피드백을 하나의 보드에서 확인합니다.",
    impact:
      "SQLite 기반 캐싱과 알림 스케줄러로 네트워크 오프라인 환경에서도 데이터를 안전하게 유지했습니다.",
    image: "images/projects/DOB2.png",
    period: "2022.11 — 2022.12",
    tags: ["Android", "Java", "SQLite"],
    links: [
      {
        label: "Notion",
        href: "https://choidz.notion.site/Do-Our-Best-DOB-fc34f19ca18240edb2301f9f081159ce?pvs=74",
        icon: "/images/notion.svg",
      },
      {
        label: "GitHub",
        href: "https://github.com/choidz/DOB",
        icon: "/images/github.svg",
      },
    ],
  },
  {
    slug: "fleaculture",
    title: "FleaCulture",
    context: "국비지원 과정 팀 프로젝트",
    color: "emerald", // 초록색
    description:
      "플리마켓·버스킹·푸드트럭 등 지역 문화 이벤트를 한눈에 찾고 예약할 수 있는 서비스.",
    impact:
      "검색·카테고리·지도 모듈을 분리해 콘텐츠 추가 시 재배포 없이 운영팀이 관리하도록 설계했습니다.",
    image: "images/projects/FLEA-CULTURE.png",
    period: "2016.12",
    tags: ["Java", "JSP", "Spring", "HTML", "CSS", "Mybatis"],
    links: [
      {
        label: "Notion",
        href: "https://choidz.notion.site/FLEA-CULTURE-1e029e3f3b0d43b9985ff93a98ec087b?pvs=74",
        icon: "/images/notion.svg",
      },
    ],
  },
];

export const CONTACT_INFO = {
  email: "choidev98@gmail.com",
  message:
    "프로덕트 중심의 협업, 대시보드/플랫폼 구축 프로젝트에 합류할 준비가 되어 있습니다. 자유롭게 연락 주세요!",
  location: "경기 화성시 동탄",
  socials: [
    { label: "GitHub", href: "https://github.com/choidz" },
    { label: "Notion", href: "https://choidz.notion.site" },
    { label: "Blog", href: "/" },
  ],
};
