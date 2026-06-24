# Next.js Hydration Failed: 서버와 클라이언트 렌더링 불일치 해결하기

---

## 문제 증상
Next.js 프로젝트를 개발하다 보면 'Hydration failed because the initial UI does not match what was rendered on the server.'라는 오류 메시지를 자주 만나게 됩니다. 이 오류는 서버에서 렌더링된 HTML과 클라이언트에서 렌더링된 HTML이 일치하지 않을 때 발생합니다. 일반적으로 개발 환경에서는 문제가 없지만, 배포 후에 이 오류가 발생하는 경우가 많습니다. 특히 SSR(Server Side Rendering)을 사용하는 페이지에서 자주 발생합니다. 

이 오류는 다음과 같은 상황에서 발생할 수 있습니다:
- 서버와 클라이언트의 날짜 및 시간 불일치
- 랜덤 값 사용으로 인한 불일치
- 브라우저 전용 API 접근으로 인한 불일치
- 조건부 렌더링의 차이

이러한 문제는 사용자에게 불편을 초래하고, 개발자에게는 디버깅의 어려움을 안겨줍니다. 

## 원인 분석
Hydration 오류의 주요 원인은 서버와 클라이언트에서 동일한 조건으로 렌더링하지 못하는 경우입니다. 예를 들어, 서버는 UTC 기준으로 날짜를 렌더링하고, 클라이언트는 사용자의 로컬 타임존을 기준으로 렌더링할 경우 서로 다른 결과가 나올 수 있습니다. 

다음은 일반적인 원인입니다:
1. **Date 객체 사용**: `new Date()`를 사용하여 서버와 클라이언트에서 다른 결과를 초래할 수 있습니다.
2. **Math.random() 사용**: 랜덤 값을 생성하는 경우 서버와 클라이언트에서 다르게 렌더링됩니다.
3. **window, localStorage 접근**: 서버에서는 이러한 객체가 존재하지 않기 때문에 오류가 발생합니다.
4. **조건부 렌더링**: 서버와 클라이언트에서 서로 다른 조건으로 렌더링될 수 있습니다.

## 확인 명령어
문제가 발생했을 때는 먼저 콘솔에서 오류 메시지를 확인합니다. 다음 명령어를 통해 현재 상태를 확인할 수 있습니다:
```bash
npm run build
npm run start
```
이후 브라우저의 개발자 도구를 열고 콘솔에서 발생하는 오류를 확인합니다. 

## 해결 방법
Hydration 오류를 해결하기 위해서는 서버와 클라이언트에서 동일한 결과를 렌더링하도록 코드를 수정해야 합니다. 다음과 같은 방법으로 해결할 수 있습니다:

### 1. `useEffect` 사용
서버와 클라이언트에서 다르게 렌더링되는 값을 `useEffect`를 통해 클라이언트에서만 처리하도록 합니다. 예를 들어, 날짜를 표시하는 컴포넌트에서 다음과 같이 수정할 수 있습니다:
```javascript
'use client';
import { useEffect, useState } from 'react';

export default function DateDisplay() {
  const [date, setDate] = useState('');

  useEffect(() => {
    setDate(new Date().toLocaleString());
  }, []);

  return <div>{date}</div>;
}
```
이렇게 하면 서버에서는 빈 값이 렌더링되고, 클라이언트에서만 날짜가 설정됩니다.

### 2. 동적 임포트 사용
브라우저 전용 라이브러리나 컴포넌트를 사용할 경우 `dynamic import`를 활용하여 SSR을 비활성화할 수 있습니다. 예를 들어:
```javascript
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('./Chart'), { ssr: false });
```
이렇게 하면 해당 컴포넌트는 클라이언트에서만 렌더링됩니다.

### 3. 서버와 클라이언트의 상태 동기화
서버와 클라이언트의 상태를 동기화하기 위해 쿠키를 사용할 수 있습니다. 클라이언트가 마운트될 때 브라우저의 타임존을 서버에 저장하고, 이후 SSR 요청 시 해당 쿠키를 참조하여 일관된 값을 렌더링하도록 합니다. 
```javascript
'use client';
import { useEffect } from 'react';

export function TimeZoneSync() {
  useEffect(() => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    fetch('/api/timezone', {
      method: 'POST',
      body: JSON.stringify({ timeZone }),
    });
  }, []);
  return null;
}
```
이렇게 하면 서버와 클라이언트 간의 타임존을 일치시킬 수 있습니다.

### 4. 조건부 렌더링 조정
조건부 렌더링을 사용할 때는 서버와 클라이언트 모두에서 동일한 조건을 확인하도록 합니다. 예를 들어, 테마 설정을 클라이언트에서만 확인하도록 변경할 수 있습니다:
```javascript
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) {
  return null;
}

return <div>{resolvedTheme === 'dark' ? '🌙' : '☀️'}</div>;
```
이렇게 하면 서버에서 기본값만 렌더링되고, 클라이언트에서 실제 테마에 따라 아이콘이 변경됩니다.

## 재발 방지 체크리스트
1. 서버와 클라이언트에서 동일한 조건으로 렌더링되도록 코드를 작성합니다.
2. 브라우저 전용 API는 `useEffect`를 통해 처리합니다.
3. 상태 관리 시 서버와 클라이언트 간의 동기화를 고려합니다.
4. 조건부 렌더링 시 서버와 클라이언트에서 동일한 조건을 확인합니다.

이와 같은 방법으로 Hydration 오류를 해결하고, 재발을 방지할 수 있습니다. Next.js의 SSR과 CSR 구조를 이해하고 올바르게 활용하는 것이 중요합니다.

![참고 이미지](/images/posts/next-js-hydration-failed-서버와-클라이언트-렌더링-불일치-해결하기-00-3ca3b715.png)

<small>이미지 출처: https://voidfunction-e.tistory.com/entry/Nextjs-Hydration-failed-because-the-initial-UI-does-not-match-%ED%95%B4%EA%B2%B0-%EB%B0%A9%EB%B2%95</small>

---

## 참고한 자료

- [[Next.js\] timezone 불일치로 인한 Hydration Failed 이슈](https://8156217.tistory.com/91)
- [Next.js Hydration failed because the initial UI does not match 해결 방법](https://voidfunction-e.tistory.com/entry/Nextjs-Hydration-failed-because-the-initial-UI-does-not-match-%ED%95%B4%EA%B2%B0-%EB%B0%A9%EB%B2%95)
- [Next.js에서 SSR/CSR timezone 불일치가 만든 Hydration 예외, Cookie로 timezone 동기화해서 해결하기](https://alstn113.tistory.com/69)
- [Next.js Hydration Error: 서버와 클라이언트 렌더링 불일치 원인과 해결법](https://jobchannel.tistory.com/entry/Nextjs-Hydration-Error-%EC%84%9C%EB%B2%84%EC%99%80-%ED%81%B4%EB%9D%BC%EC%9D%B4%EC%96%B8%ED%8A%B8-%EB%A0%8C%EB%8D%94%EB%A7%81-%EB%B6%88%EC%9D%BC%EC%B9%98-%EC%9B%90%EC%9D%B8%EA%B3%BC-%ED%95%B4%EA%B2%B0%EB%B2%95)
