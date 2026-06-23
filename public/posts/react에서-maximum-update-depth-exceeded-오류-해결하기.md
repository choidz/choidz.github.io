# React에서 Maximum Update Depth Exceeded 오류 해결하기

---

## 증상
React 애플리케이션을 실행할 때 다음과 같은 오류 메시지가 나타날 수 있습니다:

```
Maximum update depth exceeded.
This can happen when a component repeatedly calls setState inside componentWillUpdate or useEffect.
```

이 오류는 주로 컴포넌트가 무한히 렌더링되는 상황에서 발생합니다. 이로 인해 CPU 사용량이 급증하거나, 브라우저가 멈추는 등의 현상이 발생할 수 있습니다. 특히 React 18 이후 Strict Mode에서 자주 발생하는 문제입니다.

## 원인
이 오류의 대표적인 원인은 다음과 같습니다:
1. **useEffect 내부에서 상태를 반복적으로 변경하는 경우**: 의존성 배열에 상태를 포함시키면 상태 변경이 다시 렌더링을 유발하여 무한 루프에 빠질 수 있습니다.
2. **렌더링 중 setState를 호출하는 경우**: 렌더링 과정 중에 상태를 변경하면 다시 렌더링이 발생하게 됩니다.
3. **부모-자식 컴포넌트 간 상태 변경 루프**: 부모 컴포넌트에서 자식 컴포넌트의 상태를 변경하고, 자식 컴포넌트가 다시 부모 컴포넌트를 렌더링하게 만드는 경우입니다.

## 확인 명령어
문제가 발생하는 컴포넌트를 확인하기 위해 React DevTools를 사용하여 렌더링 횟수를 모니터링할 수 있습니다. 또한, 콘솔에서 다음과 같은 로그를 추가하여 어떤 상태가 변경되는지 확인할 수 있습니다:

```javascript
console.log('Current state:', this.state);
```

## 해결 절차
1. **useEffect의 의존성 배열 수정**: 상태를 의존성 배열에서 제거하거나, 필요한 값만 포함시킵니다.
   ```javascript
   useEffect(() => {
       // 상태 변경 로직
   }, []); // 빈 배열로 설정하여 무한 루프 방지
   ```

2. **setState 호출 위치 점검**: 렌더링 중에 setState를 호출하지 않도록 합니다. 이벤트 핸들러에서만 호출하도록 수정합니다.
   ```javascript
   const handleClick = () => {
       setState(prevState => prevState + 1);
   };
   ```

3. **useCallback 및 useMemo 사용**: 함수와 객체를 메모이제이션하여 불필요한 렌더링을 방지합니다.
   ```javascript
   const memoizedCallback = useCallback(() => {
       // 함수 내용
   }, [dependencies]);
   ```

4. **상태 흐름 재설계**: 상태 관리 로직을 재구성하여 부모-자식 간의 상태 변경 루프를 방지합니다.

## 흔한 실수
- `onPress={this.onBtn()}`와 같이 함수를 직접 호출하는 경우: 이 경우 렌더링할 때마다 함수가 호출되어 무한 렌더링이 발생합니다. 대신 `onPress={() => this.onBtn()}`와 같이 화살표 함수를 사용해야 합니다.

## 재발 방지 체크리스트
- [ ] useEffect의 의존성 배열을 올바르게 설정했는가?
- [ ] 렌더링 중 setState를 호출하지 않았는가?
- [ ] 상태 흐름이 명확한가?
- [ ] useCallback과 useMemo를 적절히 사용하고 있는가?

이와 같은 방법으로 'Maximum update depth exceeded' 오류를 해결할 수 있습니다. 상태 관리와 렌더링 흐름을 면밀히 점검하여 이러한 오류가 발생하지 않도록 주의하시기 바랍니다.

## 실무 적용 체크리스트

- React maximum update depth exceeded 해결을 적용하기 전에 현재 운영 환경의 기준값과 예외 상황을 먼저 정리합니다.
- 변경 전후로 확인할 지표를 정하고, 문제가 생겼을 때 되돌릴 수 있는 절차를 문서화합니다.
- 한 번에 모든 서버나 서비스에 적용하기보다 작은 범위에서 검증한 뒤 점진적으로 확대합니다.
- 담당자, 확인 시간, 장애 판단 기준을 명확히 남겨 같은 문제가 반복될 때 빠르게 대응할 수 있게 합니다.

## 운영 중 자주 놓치는 부분

#Frontend 영역에서는 설정 자체보다 운영 중에 남는 기록과 점검 루틴이 더 중요합니다. 처음에는 정상처럼 보이더라도 트래픽이 늘거나 배포 주기가 빨라지면 작은 누락이 장애로 이어질 수 있습니다. 그래서 로그, 알림, 대시보드, 변경 이력을 함께 확인하고 실제 장애 대응 과정에서 필요한 정보가 빠지지 않았는지 주기적으로 점검해야 합니다.

---

## 참고한 자료

- [오류 정리](https://psj8532.tistory.com/16)
- [React Maximum Update Depth Exceeded 해결 방법 총정리 (무한 렌더링 원인 분석)](https://voidfunction-e.tistory.com/entry/React-Maximum-Update-Depth-Exceeded-%ED%95%B4%EA%B2%B0-%EB%B0%A9%EB%B2%95-%EC%B4%9D%EC%A0%95%EB%A6%AC-%EB%AC%B4%ED%95%9C-%EB%A0%8C%EB%8D%94%EB%A7%81-%EC%9B%90%EC%9D%B8-%EB%B6%84%EC%84%9D)
