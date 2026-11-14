# ES Module에서 'require is not defined' 오류 해결하기

## 증상 및 오류 메시지

ES Module을 사용하는 Node.js 환경에서 `require is not defined`라는 오류 메시지를 자주 접할 수 있습니다. 이 오류는 주로 ES Module 방식으로 작성된 코드에서 CommonJS 방식의 `require`를 사용하려 할 때 발생합니다. 예를 들어, 아래와 같은 코드에서 오류가 발생할 수 있습니다.

```javascript
const myModule = require('./myModule.js');
```

이 코드에서 `require`를 사용하려고 하였지만, ES Module 환경에서는 `require`가 정의되어 있지 않기 때문에 오류가 발생합니다. 파일의 모듈 형식과 코드의 로딩 방식이 서로 다를 때 발생합니다.

## 원인

이 오류의 주된 원인은 ES Module과 CommonJS 모듈의 차이에서 비롯됩니다. ES Module은 `import`와 `export` 구문을 사용하여 모듈을 관리하는 반면, CommonJS는 `require`와 `module.exports`를 사용합니다. Node.js가 ES Module을 지원하기 시작하면서, 두 방식이 혼용되는 경우가 많아졌고, 이로 인해 `require`가 정의되지 않아 오류가 발생하게 됩니다.

이 오류는 다음과 같은 경우에 발생할 수 있습니다:
1. ES Module을 사용하고 있는 파일에서 `require`를 호출할 때
2. `type`을 `module`로 설정한 `package.json` 파일이 있을 때

## 확인 명령어

문제가 발생한 파일이 ES Module인지 확인하기 위해 다음과 같이 `package.json` 파일의 설정을 확인해보세요.

```json
{
  "type": "module"
}
```

위와 같이 `type`이 `module`로 설정되어 있다면, 해당 파일은 ES Module로 인식됩니다. 또한, 파일 확장자가 `.mjs`인 경우에도 ES Module로 처리됩니다. 반대로, `.js` 파일이라도 `type`이 `commonjs`로 설정되어 있다면 CommonJS로 인식됩니다.

## 해결 절차

이 오류를 해결하기 위해서는 다음과 같은 방법을 사용할 수 있습니다:

1. **`require` 대신 `import` 사용하기**
   ES Module에서는 `import` 구문을 사용하여 모듈을 가져와야 합니다. 예를 들어, 다음과 같이 코드를 수정합니다.
   ```javascript
   import myModule from './myModule.js';
   ```

2. **CommonJS로 변경하기**
   ES Module을 사용하지 않으려면 `package.json`의 `type`을 `commonjs`로 변경하거나, 파일 확장자를 `.cjs`로 변경할 수 있습니다. 예를 들어:
   ```json
   {
     "type": "commonjs"
   }
   ```

3. **CommonJS API가 꼭 필요할 때**
   Node.js에서는 `node:module`의 `createRequire(import.meta.url)`로 해당 API를 사용할 수 있습니다. 일반적인 의존성은 `import`를 우선 사용하세요.

## 흔한 실수

개발자들이 자주 저지르는 실수 중 하나는 ES Module과 CommonJS를 혼용하여 사용하는 것입니다. 예를 들어, ES Module 파일에서 CommonJS 방식의 `require`를 사용하거나, CommonJS 파일에서 ES Module의 `import`를 사용하는 경우입니다. 이러한 혼용은 오류를 발생시키므로, 항상 일관된 방식으로 모듈을 관리해야 합니다.

## 재발 방지 체크리스트

1. **모듈 방식을 명확히 이해하기**
   ES Module과 CommonJS의 차이를 명확히 이해하고, 각 방식에 맞는 구문을 사용하도록 합니다.
2. **`package.json` 설정 확인하기**
   프로젝트의 `package.json` 파일에서 `type` 설정을 확인하고, 필요한 경우 수정합니다.
3. **코드 리뷰 및 테스트**
   코드를 작성한 후 반드시 코드 리뷰를 진행하고, 모듈이 제대로 작동하는지 테스트합니다.

이와 같은 절차를 통해 `require is not defined` 오류를 효과적으로 해결할 수 있습니다. ES Module과 CommonJS의 차이를 이해하고, 올바른 방법으로 모듈을 관리하는 것이 중요합니다.

![ES Module에서 'require is not defined' 오류 해결하기 안내 이미지](/images/posts/es-module에서-require-is-not-defined-오류-해결하기-00-guide.svg)

## 참고한 자료

- [Node.js ECMAScript modules](https://nodejs.org/api/esm.html#no-require-exports-or-moduleexports)
