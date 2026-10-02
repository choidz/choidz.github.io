# Tailwind CSS 스타일 적용이 안 되는 문제 해결하기

## 증상 및 오류 메시지
Tailwind CSS를 사용할 때, 특정 조건에서 스타일이 적용되지 않는 경우가 발생합니다. 예를 들어, 동적으로 생성된 클래스 이름이 적용되지 않거나, 상태(state)나 속성(props)에 따라 클래스가 변경될 때 스타일이 사라지는 현상이 있습니다. 이 문제는 Tailwind CSS가 기본적으로 클래스 이름을 미리 정의된 목록에서 찾아 스타일을 적용하기 때문에 발생합니다. 즉, 동적으로 생성된 클래스는 사전에 정의된 목록에 포함되지 않아 스타일이 적용되지 않는 것입니다.

## 원인 분석
이러한 문제의 주된 원인은 Tailwind CSS의 JIT(Just-In-Time) 모드에서 발생하는데, 이 모드는 사용자가 작성한 클래스 이름을 기반으로 CSS를 생성합니다. 따라서, 동적으로 생성된 클래스 이름이 포함되지 않으면 해당 스타일이 적용되지 않습니다. 예를 들어, 아래와 같은 코드에서 동적으로 생성된 클래스는 적용되지 않습니다.

```javascript
export default function Example() {
  const randomColor = `bg-${Math.floor(Math.random() * 6)}`;
  return <div className={randomColor}>Hello World</div>;
}
```

위 코드에서 `randomColor` 변수는 매번 랜덤하게 생성되므로, Tailwind CSS는 이 클래스를 사전에 인식하지 못하게 됩니다. 이로 인해 스타일이 적용되지 않습니다.

## 확인 명령어
문제가 발생했을 때, 우선 Tailwind CSS의 설정 파일인 `tailwind.config.js`를 확인해보아야 합니다. 이 파일에서 `purge` 옵션이 올바르게 설정되어 있는지 확인해야 합니다. 일반적으로 다음과 같은 형태로 설정되어야 합니다.

```javascript
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
```

이 설정이 올바르지 않으면 Tailwind CSS가 필요한 클래스를 찾지 못할 수 있습니다.

## 해결 절차
1. **정적 클래스 사용**: 동적 클래스를 사용하기보다는 가능한 정적 클래스를 사용하는 것이 좋습니다. 예를 들어, 상태에 따라 다른 클래스를 사용해야 할 경우, 조건부 렌더링을 통해 정적으로 클래스를 설정합니다.

   ```javascript
   export default function Example({ isActive }) {
     return <div className={isActive ? 'bg-blue-500' : 'bg-red-500'}>Hello World</div>;
   }
   ```

2. **JIT 모드 활성화**: Tailwind CSS의 JIT 모드를 사용하면, 동적으로 생성된 클래스도 인식할 수 있습니다. `tailwind.config.js` 파일에서 JIT 모드를 활성화합니다.

   ```javascript
   module.exports = {
     mode: 'jit',
     purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
     // ...
   }
   ```

3. **클래스 이름 사전 등록**: 만약 동적으로 생성해야 하는 클래스가 있다면, Tailwind CSS의 `safelist` 기능을 활용하여 미리 정의해둘 수 있습니다.

   ```javascript
   module.exports = {
     purge: {
       content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
       options: {
         safelist: ['bg-1', 'bg-2', 'bg-3'],
       },
     },
     // ...
   }
   ```

## 흔한 실수
개발자들이 자주 하는 실수 중 하나는 Tailwind CSS의 `purge` 설정을 잘못하는 것입니다. 이 설정이 잘못되면, 필요한 클래스가 제거되어 스타일이 적용되지 않을 수 있습니다. 또한, 동적으로 생성된 클래스 이름을 사용하면서도 Tailwind CSS의 규칙을 따르지 않는 경우도 많습니다. 이러한 실수를 방지하기 위해서는 클래스 이름을 명확히 정의하고, 정적 클래스를 우선적으로 사용하는 것이 좋습니다.

## 재발 방지 체크리스트
- [ ] `tailwind.config.js` 파일의 `purge` 설정이 올바른지 확인한다.
- [ ] 동적 클래스를 사용하지 않고 정적 클래스를 우선적으로 사용한다.
- [ ] JIT 모드를 활성화하여 동적 클래스를 지원하도록 설정한다.
- [ ] 필요한 클래스 이름을 `safelist`에 추가하여 미리 등록한다.

위의 절차와 체크리스트를 통해 Tailwind CSS에서 발생하는 스타일 적용 문제를 예방하고 해결할 수 있습니다. 개발 환경을 점검하고, 동적 스타일링에 대한 이해를 높이는 것이 중요합니다.

![Tailwind CSS 스타일 적용 안됨 해결 기술 다이어그램](/images/posts/tailwind-css-스타일-적용이-안-되는-문제-해결하기-00-generated.svg)

## 참고한 자료

- [태돈](https://taedonn.tistory.com/?page=2)
