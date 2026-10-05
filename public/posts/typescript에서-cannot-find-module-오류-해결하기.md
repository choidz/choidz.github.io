# TypeScript에서 Cannot find module 오류 해결하기

## 증상: Cannot find module 오류

TypeScript를 사용하다 보면 종종 'Cannot find module'이라는 오류 메시지를 마주칠 수 있습니다. 이 오류는 주로 모듈을 찾지 못할 때 발생합니다. 예를 들어, 다음과 같은 오류 메시지를 볼 수 있습니다:

```
error TS2307: Cannot find module 'your-module-name' or its corresponding type declarations.
```

이 오류는 코드 작성 시 해당 모듈이 설치되어 있지 않거나, TypeScript 설정이 올바르지 않기 때문에 발생합니다. 특히, npm이나 yarn을 통해 설치한 외부 라이브러리의 타입 정의 파일이 없을 경우에도 이 오류가 발생할 수 있습니다.

## 원인: 모듈 설치 누락 및 설정 오류

이 오류는 여러 가지 원인으로 발생할 수 있습니다. 가장 흔한 원인은 다음과 같습니다:
1. **모듈이 설치되지 않음**: 필요한 모듈이 node_modules에 설치되어 있지 않거나, 잘못된 경로로 설치된 경우입니다.
2. **타입 정의 파일 누락**: TypeScript는 JavaScript와 달리 타입을 엄격하게 검사하기 때문에, 외부 라이브러리의 타입 정의 파일이 없으면 오류가 발생합니다.
3. **tsconfig.json 설정 오류**: tsconfig.json 파일에서 paths 설정이 잘못되었거나, baseUrl이 잘못 설정된 경우입니다.

이러한 원인들을 확인하기 위해 다음 명령어를 사용해 보세요:

```bash
npm list your-module-name
```

이 명령어는 해당 모듈이 설치되어 있는지 확인할 수 있습니다.

## 해결 절차: 모듈 설치 및 tsconfig 설정 확인

1. **모듈 설치 확인**: 먼저, 필요한 모듈이 설치되어 있는지 확인합니다. 설치가 되어 있지 않다면, 다음 명령어로 설치합니다.

```bash
npm install your-module-name
```

2. **타입 정의 파일 설치**: 외부 라이브러리의 타입 정의 파일이 필요한 경우, 다음과 같은 명령어로 설치합니다.

```bash
npm install --save-dev @types/your-module-name
```

3. **tsconfig.json 확인**: tsconfig.json 파일을 열어 `compilerOptions`의 `baseUrl`과 `paths` 설정을 확인합니다. 예를 들어:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

이 설정이 올바르게 되어 있는지 확인하고, 필요 시 수정합니다.

4. **타입스크립트 서버 재시작**: VSCode를 사용하고 있다면, TypeScript 서버를 재시작하여 변경 사항을 반영합니다. VSCode 명령 팔레트에서 `TypeScript: Restart TS Server`를 선택합니다.

![참고 이미지](/images/posts/typescript에서-cannot-find-module-오류-해결하기-00-e3e6909c.webp)

<small>이미지 출처: https://neos35.tistory.com/entry/%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%95%94%EC%8B%9C%EC%A0%81-any-%EC%98%A4%EB%A5%98-%ED%95%B4%EA%B2%B0%EF%BD%9CTS7006-%EC%9B%90%EC%9D%B8%EA%B3%BC-%EC%A1%B0%EC%B9%98-%EC%88%9C%EC%84%9C</small>

## 흔한 실수: 경로 및 대소문자 확인

TypeScript는 경로에 대해 대소문자를 구분합니다. 따라서, import할 때 경로가 정확한지 확인해야 합니다. 예를 들어, 다음과 같은 코드는 오류를 발생시킬 수 있습니다:

```typescript
import { MyComponent } from './myComponent'; // 잘못된 대소문자
```

올바른 경로는 다음과 같습니다:

```typescript
import { MyComponent } from './MyComponent'; // 올바른 대소문자
```

## 재발 방지: CI/CD 파이프라인에서 검사

이러한 오류를 방지하기 위해 CI/CD 파이프라인에 TypeScript 검사 단계를 추가하는 것이 좋습니다. 이를 통해 코드가 배포되기 전에 오류를 미리 잡아낼 수 있습니다. 다음과 같이 package.json에 스크립트를 추가할 수 있습니다:

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit"
  }
}
```

이 스크립트를 CI/CD 파이프라인에 포함시키면, 코드가 배포되기 전에 타입 검사를 수행할 수 있습니다. 이를 통해 'Cannot find module' 오류를 사전에 방지할 수 있습니다.

이와 같은 방법으로 TypeScript에서 발생하는 'Cannot find module' 오류를 해결하고, 재발을 방지할 수 있습니다. 실무에서 이러한 오류를 자주 경험하게 되므로, 위의 절차를 숙지해 두면 많은 도움이 될 것입니다.

## 참고한 자료

- [Cumora TypeScript 실행 오류｜로컬 개발 환경 단계별 설정](https://neos35.tistory.com/295)
- [타입스크립트 암시적 any 오류 해결｜TS7006 원인과 조치 순서](https://neos35.tistory.com/entry/%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%95%94%EC%8B%9C%EC%A0%81-any-%EC%98%A4%EB%A5%98-%ED%95%B4%EA%B2%B0%EF%BD%9CTS7006-%EC%9B%90%EC%9D%B8%EA%B3%BC-%EC%A1%B0%EC%B9%98-%EC%88%9C%EC%84%9C)
- [TypeScript path alias 인식 안 될 때｜실행만 실패하는 이유와 해결법](https://neos35.tistory.com/entry/TypeScript-path-alias-%EC%9D%B8%EC%8B%9D-%EC%95%88-%EB%90%A0-%EB%95%8C%EF%BD%9C%EC%8B%A4%ED%96%89%EB%A7%8C-%EC%8B%A4%ED%8C%A8%ED%95%98%EB%8A%94-%EC%9D%B4%EC%9C%A0%EC%99%80-%ED%95%B4%EA%B2%B0%EB%B2%95)
- [[오류해결\] VSCode - Cannot find name 'test'. Do you need to install type definitions for a test runner?](https://iksflow.tistory.com/175)
- [ThreeUI HTML 빌드 안 될 때: npm run build 실패 원인별 해결 순서](https://neos35.tistory.com/entry/ThreeUI-HTML-%EB%B9%8C%EB%93%9C-%EC%95%88-%EB%90%A0-%EB%95%8C-npm-run-build-%EC%8B%A4%ED%8C%A8-%EC%9B%90%EC%9D%B8%EB%B3%84-%ED%95%B4%EA%B2%B0-%EC%88%9C%EC%84%9C)
