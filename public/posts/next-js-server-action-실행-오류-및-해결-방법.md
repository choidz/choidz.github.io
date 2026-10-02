# Next.js Server Action 실행 오류 및 해결 방법

## 증상: Server Action 실행 시 오류 발생
Next.js에서 Server Action을 실행하려고 할 때, 예상치 못한 오류가 발생하는 경우가 많습니다. 예를 들어, "Could not find Convex client! `useQuery` must be used in the React component tree under `ConvexProvider`"와 같은 메시지가 나타날 수 있습니다. 이 오류는 Convex 클라이언트가 제대로 설정되지 않았거나, 쿼리와 뮤테이션 안에서 외부 API를 호출하려고 할 때 발생합니다. 또한, 여러 요청이 동시에 처리될 때 "Documents read from or written to the table changed while this mutation was being run"와 같은 오류 메시지가 나타날 수 있습니다.

## 원인: Server Action의 제약 사항
이러한 오류의 주요 원인은 Next.js의 Server Action이 외부 API 호출을 지원하지 않기 때문입니다. Convex의 query와 mutation은 결정적으로 실행되어야 하며, 외부 네트워크 호출이 허용되지 않습니다. 이러한 제약으로 인해, 사용자가 작성한 코드가 1초의 실행 시간 제한을 초과하면 오류가 발생합니다. 또한, 동시성 문제로 인해 같은 문서에 대한 읽기 및 쓰기 작업이 충돌할 경우에도 오류가 발생할 수 있습니다.

## 확인 명령어: 오류 메시지 및 로그 확인
오류를 확인하기 위해 브라우저의 개발자 도구를 열고 콘솔 탭에서 오류 메시지를 확인합니다. 다음과 같은 명령어를 통해 현재 실행 중인 프로세스와 에러 로그를 확인할 수 있습니다:

```bash
npm run dev
```

이 명령어를 통해 서버에서 발생하는 오류 메시지를 실시간으로 확인할 수 있습니다. 또한, Next.js의 로그를 통해 요청 및 응답의 흐름을 추적할 수 있습니다.

![참고 이미지](/images/posts/next-js-server-action-실행-오류-및-해결-방법-01-e122958b.png)

<small>이미지 출처: https://neos35.tistory.com/entry/Nextjs-Convex-AI-%EC%BD%94%EB%93%9C-%EA%B0%90%EC%82%AC%EA%B8%B0-%EB%A7%8C%EB%93%A4%EA%B8%B0%EF%BD%9Cfetch-%EC%A0%9C%ED%95%9C%C2%B7%ED%83%80%EC%9E%84%EC%95%84%EC%9B%83</small>

## 해결 절차: Server Action 분리 및 리팩토링
1. **Action 분리**: 외부 API 호출을 수행하는 코드를 별도의 action으로 분리합니다. 이를 통해 query와 mutation의 제약을 피할 수 있습니다.

```javascript
// convex/audits.ts
import { v } from "convex/values";
import { mutation, internalAction } from "./_generated/server";

export const start = mutation({
  args: { source: v.string() },
  handler: async (ctx, args) => {
    const jobId = await ctx.db.insert("audits", { status: "running", source: args.source });
    await ctx.scheduler.runAfter(0, internal.audits.run, { jobId });
    return jobId;
  },
});

export const run = internalAction({
  args: { jobId: v.id("audits") },
  handler: async (ctx, args) => {
    const job = await ctx.runQuery(internal.audits.get, { jobId: args.jobId });
    const res = await fetch("https://api.example.com/data", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        data: job.source,
      }),
    });
    await ctx.runMutation(internal.audits.save, { jobId: args.jobId, report: await res.text() });
  },
});
```

2. **상태 관리**: job 상태를 관리하기 위해 상태를 업데이트하는 mutation을 작성합니다. 이를 통해 동시성 문제를 줄일 수 있습니다.

3. **API 키 관리**: 외부 API 호출 시 필요한 API 키는 환경변수로 관리합니다. 다음 명령어로 환경변수를 설정할 수 있습니다:

```bash
npx convex env set API_KEY 'your_api_key'
npx convex env list
```

## 흔한 실수: State 관리 소홀
개발자들이 자주 저지르는 실수 중 하나는 상태 관리에 소홀해지는 것입니다. 특히, 여러 요청이 동시에 처리될 때 상태가 일관되지 않으면 오류가 발생할 수 있습니다. 따라서, 각 요청에 대해 고유한 job ID를 부여하고, 이 ID를 통해 상태를 관리하는 것이 중요합니다.

## 재발 방지: 코드 리뷰 및 테스트
재발 방지를 위해 다음과 같은 체크리스트를 활용해 보세요:
- [ ] 모든 API 호출은 action으로 분리했는가?
- [ ] 상태 관리를 위한 mutation이 적절히 작성되었는가?
- [ ] 환경변수 설정이 올바른가?
- [ ] 동시성 문제를 피하기 위한 로직이 포함되었는가?

이러한 점들을 체크리스트로 관리하면 비슷한 오류를 예방할 수 있습니다. Next.js의 Server Action을 효과적으로 활용하기 위해서는 이러한 제약 사항을 이해하고, 올바른 패턴으로 코드를 작성하는 것이 중요합니다.

![참고 이미지](/images/posts/next-js-server-action-실행-오류-및-해결-방법-00-801a81f7.png)

<small>이미지 출처: https://neos35.tistory.com/entry/Nextjs-Convex-AI-%EC%BD%94%EB%93%9C-%EA%B0%90%EC%82%AC%EA%B8%B0-%EB%A7%8C%EB%93%A4%EA%B8%B0%EF%BD%9Cfetch-%EC%A0%9C%ED%95%9C%C2%B7%ED%83%80%EC%9E%84%EC%95%84%EC%9B%83</small>

## 참고한 자료

- [Next.js Convex AI 코드 감사기 만들기｜fetch 제한·타임아웃](https://neos35.tistory.com/entry/Nextjs-Convex-AI-%EC%BD%94%EB%93%9C-%EA%B0%90%EC%82%AC%EA%B8%B0-%EB%A7%8C%EB%93%A4%EA%B8%B0%EF%BD%9Cfetch-%EC%A0%9C%ED%95%9C%C2%B7%ED%83%80%EC%9E%84%EC%95%84%EC%9B%83)
