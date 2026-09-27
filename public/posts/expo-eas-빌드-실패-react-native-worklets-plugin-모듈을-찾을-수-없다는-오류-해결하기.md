# Expo EAS 빌드 실패: 'react-native-worklets/plugin' 모듈을 찾을 수 없다는 오류 해결하기

## 문제 증상
Expo EAS 빌드를 진행할 때, 로컬에서는 정상 작동하던 앱이 빌드 과정에서 다음과 같은 오류를 발생시키는 경우가 있습니다:

> **SyntaxError: index.js: [BABEL] ... Cannot find module 'react-native-worklets/plugin'**

이 오류는 주로 Expo SDK와 특정 라이브러리의 버전 불일치로 인해 발생합니다. 특히, NativeWind와 같은 라이브러리를 사용할 때, 최신 버전으로의 자동 업데이트가 문제를 일으킬 수 있습니다.

## 원인 분석
이 오류의 주된 원인은 **패키지 버전 관리**입니다. 특정 라이브러리의 버전이 자동으로 업데이트되면서, Expo SDK와의 호환성 문제가 발생하는 경우가 많습니다. 다음과 같은 요소들이 문제를 일으킬 수 있습니다:

1. **패키지 버전 자동 업데이트**: package.json에서 버전을 지정할 때, 캐럿(^) 기호를 사용하면 해당 버전보다 높은 최신 버전이 설치됩니다. 이로 인해 호환되지 않는 버전이 설치될 수 있습니다.
2. **라이브러리 내부 변경**: NativeWind의 최신 버전이 내부적으로 react-native-worklets/plugin을 호출하도록 변경되면서, Expo SDK에서 요구하는 react-native-worklets-core와 이름이 일치하지 않아 문제가 발생합니다.

![참고 이미지](/images/posts/expo-eas-빌드-실패-react-native-worklets-plugin-모듈을-찾을-수-없다는-오류-해결하기-00-d2cea992.png)

<small>이미지 출처: https://code-hoon.tistory.com/363</small>

## 확인 명령어
이 문제를 확인하기 위해서는 다음 명령어를 사용하여 현재 설치된 패키지의 버전을 확인할 수 있습니다:

```bash
npm list nativewind react-native-worklets-core
```

이 명령어를 통해 설치된 버전이 호환되지 않는 경우, 오류가 발생할 수 있습니다.

## 해결 절차
이 오류를 해결하기 위해서는 다음 단계를 따라야 합니다:

### 1. package.json 수정
패키지의 버전을 강제로 고정합니다. package.json에서 NativeWind의 버전 앞의 캐럿(^) 기호를 제거하여 정확한 버전을 지정합니다:

```json
"dependencies": {
  "nativewind": "4.1.23",  // ^ 제거!
  "react-native-css-interop": "0.2.3",
  "react-native-reanimated": "~3.16.1"
}
```

### 2. 캐시 제거 및 재설치
이전 버전의 캐시가 남지 않도록 다음 명령어를 실행하여 node_modules와 package-lock.json을 삭제한 후 재설치합니다:

```bash
rm -rf node_modules package-lock.json
npm install
```

### 3. babel.config.js 수정
babel.config.js 파일을 열어 불필요한 플러그인 호출을 제거하고 NativeWind v4 전용 설정을 적용합니다:

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: ["react-native-reanimated/plugin"],
  };
};
```

## 흔한 실수
- 패키지 버전을 지정할 때 캐럿(^) 기호를 사용하는 것을 잊는 경우가 많습니다. 이로 인해 의도치 않게 호환되지 않는 최신 버전이 설치될 수 있습니다.
- babel.config.js에서 플러그인 설정을 제대로 하지 않아 빌드 오류가 발생하는 경우도 있습니다.

## 재발 방지 체크리스트
- 패키지 버전을 지정할 때는 항상 안정적인 버전으로 고정하세요.
- 라이브러리의 주요 변경 사항이나 업데이트 내용을 주기적으로 확인하세요.
- 빌드 전에 항상 로컬 환경에서 테스트하여 오류를 사전에 발견하세요.

이번 오류를 통해 라이브러리 간의 의존성 관리의 중요성을 다시 한번 깨달았습니다. 특히, Expo와 같은 프레임워크를 사용할 때는 각 라이브러리의 버전 호환성을 철저히 관리하는 것이 필요합니다. 이 과정을 통해 여러분의 빌드가 성공적으로 완료되기를 바랍니다.

## 실무 적용 체크리스트

- Expo EAS build failed 해결을 적용하기 전에 현재 운영 환경의 기준값과 예외 상황을 먼저 정리합니다.
- 변경 전후로 확인할 지표를 정하고, 문제가 생겼을 때 되돌릴 수 있는 절차를 문서화합니다.
- 한 번에 모든 서버나 서비스에 적용하기보다 작은 범위에서 검증한 뒤 점진적으로 확대합니다.
- 담당자, 확인 시간, 장애 판단 기준을 명확히 남겨 같은 문제가 반복될 때 빠르게 대응할 수 있게 합니다.

## 참고한 자료

- [[해결\] Cannot find module 'react-native-worklets/plugin' ...](https://code-hoon.tistory.com/363)
