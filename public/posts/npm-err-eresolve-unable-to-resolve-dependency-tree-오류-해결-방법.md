# npm ERR! ERESOLVE unable to resolve dependency tree 오류 해결 방법

## 증상

개발 중 `npm install` 명령어를 실행했을 때 다음과 같은 오류 메시지를 경험할 수 있습니다:

```
npm ERR! ERESOLVE unable to resolve dependency tree
```

이 오류는 주로 패키지 간의 의존성 충돌로 인해 발생합니다. 특히, React, Vue와 같은 프레임워크를 사용하는 프로젝트에서 자주 나타나는 문제입니다. 이 오류가 발생하면 프로젝트의 빌드가 실패하게 되며, 의존성 트리를 확인하고 수정해야 합니다.

## 원인

이 오류의 주요 원인은 다음과 같습니다:

1. **패키지 버전 충돌**: 서로 다른 패키지가 서로 다른 버전의 의존성을 요구할 때 발생합니다.
2. **npm 버전 문제**: npm 7 이상에서는 peer dependencies에 대한 검사가 엄격해져 충돌이 발생하기 쉽습니다.
3. **package-lock.json 충돌**: 여러 개발자가 동시에 작업할 때 발생할 수 있는 문제입니다.
4. **node_modules 손상**: 설치 중 문제가 발생하여 의존성이 손상될 수 있습니다.

![참고 이미지](/images/posts/npm-err-eresolve-unable-to-resolve-dependency-tree-오류-해결-방법-00-416799e3.webp)

<small>이미지 출처: https://wooseohome.tistory.com/entry/npm-ERR-peer-dependency-%ED%95%B4%EA%B2%B0-%EB%B0%A9%EB%B2%95</small>

이러한 원인들은 프로젝트의 구조나 사용 중인 라이브러리에 따라 다양하게 나타날 수 있습니다.

## 확인 명령어

문제를 진단하기 위해 다음의 명령어를 사용할 수 있습니다:

```
npm ls
```

이 명령어는 현재 설치된 패키지와 그 의존성을 확인할 수 있습니다. 또한, 특정 패키지의 의존성을 확인하기 위해 다음과 같은 명령어를 사용할 수 있습니다:

```
npm ls <패키지명>
```

예를 들어, React의 의존성을 확인하려면 다음과 같이 입력합니다:

```
npm ls react
```

## 해결 절차

1. **의존성 확인**: 위에서 언급한 `npm ls` 명령어를 통해 현재 설치된 패키지의 의존성을 확인합니다. 이를 통해 어떤 패키지가 충돌을 일으키는지 파악할 수 있습니다.

![참고 이미지](/images/posts/npm-err-eresolve-unable-to-resolve-dependency-tree-오류-해결-방법-01-58c1d3b1.webp)

<small>이미지 출처: https://wooseohome.tistory.com/entry/npm-ERR-peer-dependency-%ED%95%B4%EA%B2%B0-%EB%B0%A9%EB%B2%95</small>

2. **버전 조정**: 충돌하는 패키지의 버전을 맞추기 위해 다음 명령어를 사용합니다:

```
npm install <패키지명>@<버전>
```

예를 들어, React를 18.x 버전으로 맞추려면 다음과 같이 입력합니다:

```
npm install react@18 react-dom@18
```

3. **npm install 옵션 사용**: 의존성 문제를 무시하고 설치를 진행하려면 다음 명령어를 사용할 수 있습니다:

```
npm install --legacy-peer-deps
```

또는 강제로 설치할 경우:

```
npm install --force
```

이 두 명령어는 임시방편적인 해결책으로, 실제 문제를 숨길 수 있으므로 주의해서 사용해야 합니다.

4. **node_modules 및 package-lock.json 초기화**: 의존성 문제가 계속 발생한다면, 다음 명령어로 초기화할 수 있습니다:

```
rm -rf node_modules
rm package-lock.json
npm install
```

이 과정은 의존성 트리를 새로 생성하여 문제를 해결할 수 있는 방법입니다.

## 흔한 실수

- **강제 설치 남용**: `--force` 옵션을 자주 사용하면 의존성 문제를 잠재우는 대신, 나중에 런타임 오류를 발생시킬 수 있습니다. 따라서, 이 옵션은 최후의 수단으로 사용해야 합니다.
- **버전 관리 소홀**: 의존성 버전 관리를 소홀히 하면, 프로젝트가 커질수록 문제를 해결하기 어려워질 수 있습니다. 정기적으로 의존성을 업데이트하고, 버전 차이를 관리하는 것이 중요합니다.

## 재발 방지 체크리스트

1. **정기적인 의존성 업데이트**: 패키지의 최신 버전을 주기적으로 확인하고 업데이트합니다.
2. **npm 버전 관리**: 프로젝트에서 사용하는 npm 버전을 고정하여 일관성을 유지합니다. `.nvmrc` 파일을 사용하여 Node.js 버전을 관리하는 것도 좋은 방법입니다.
3. **package-lock.json 관리**: `package-lock.json` 파일을 버전 관리 시스템에 포함시켜, 팀원 간의 의존성 일치를 유지합니다.
4. **의존성 트리 점검**: 새로운 패키지를 추가할 때마다 의존성 트리를 점검하여 충돌 가능성을 미리 파악합니다.

이러한 방법들을 통해 npm의 의존성 문제를 효과적으로 관리하고, 안정적인 개발 환경을 유지할 수 있습니다.

## 참고한 자료

- [[Error\] npm install 실패 해결(npm ERR! code ERESOLVE)](https://cocobi.tistory.com/114)
- [npm ERR! peer dependency 해결 방법](https://wooseohome.tistory.com/entry/npm-ERR-peer-dependency-%ED%95%B4%EA%B2%B0-%EB%B0%A9%EB%B2%95)
