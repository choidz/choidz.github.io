# JavaScript async await 오류 처리 방법

## 증상 및 오류 메시지
JavaScript의 `async`와 `await` 구문을 사용할 때, 비동기 작업 중 발생하는 오류는 애플리케이션의 흐름을 중단시킬 수 있습니다. 예를 들어, API 호출 시 오류가 발생하면 다음과 같은 오류 메시지를 볼 수 있습니다:

```
Uncaught (in promise) Error: Request failed with status code 404
```

이러한 오류는 비동기 작업이 실패했을 때 발생하며, 적절한 오류 처리가 이루어지지 않으면 애플리케이션이 예기치 않게 종료될 수 있습니다.

## 오류의 원인
비동기 작업에서 오류가 발생하는 주요 원인은 다음과 같습니다:
1. **네트워크 오류**: 서버와의 연결 문제로 인해 API 요청이 실패할 수 있습니다.
2. **잘못된 요청**: 잘못된 URL이나 요청 파라미터로 인해 서버가 요청을 처리할 수 없을 때 발생합니다.
3. **서버 오류**: 서버 내부에서 발생한 오류로 인해 요청이 실패할 수 있습니다.

이러한 오류는 모두 `async` 함수 내에서 `await` 키워드를 사용하여 비동기 작업을 수행하는 동안 발생할 수 있습니다.

## 확인 명령어
오류를 확인하기 위해 다음과 같은 방법을 사용할 수 있습니다:
- **콘솔 로그 확인**: `console.log`를 사용하여 비동기 작업의 결과를 확인합니다.
- **에러 핸들링 추가**: `try...catch` 구문을 사용하여 오류를 포착하고, 오류 메시지를 출력합니다.

예시 코드:
```javascript
async function fetchData() {
    try {
        const response = await fetch('https://api.example.com/data');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}
```

## 해결 절차
1. **try...catch 구문 사용**: 비동기 작업을 `try` 블록 안에 두고, 오류가 발생할 경우 `catch` 블록에서 처리합니다.
2. **에러 메시지 로그**: `catch` 블록에서 발생한 오류를 로그로 남겨 문제를 파악합니다.
3. **사용자 피드백 제공**: 오류 발생 시 사용자에게 친절한 메시지를 제공하여 문제를 이해할 수 있도록 합니다.

예시 코드:
```javascript
async function getUser() {
    try {
        const response = await fetch('https://api.example.com/user');
        if (!response.ok) {
            throw new Error('User not found');
        }
        const user = await response.json();
        return user;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null; // 기본값 반환
    }
}
```

## 흔한 실수
- **await 사용 누락**: `await` 키워드를 사용하지 않으면 Promise가 해결되기 전에 코드가 실행되어 예기치 않은 결과를 초래할 수 있습니다.
- **catch 블록 누락**: `try...catch` 없이 비동기 작업을 수행하면, 오류가 발생했을 때 애플리케이션이 중단될 수 있습니다.

## 재발 방지 체크리스트
- [ ] 모든 비동기 작업에 `try...catch` 구문을 적용했는가?
- [ ] 오류 발생 시 사용자에게 적절한 피드백을 제공하는가?
- [ ] 네트워크 요청을 수행할 때, 요청 URL과 파라미터가 올바른지 확인했는가?
- [ ] 서버의 응답 상태를 확인하고, 오류를 적절히 처리하고 있는가?

이러한 점들을 체크하여 JavaScript의 `async`와 `await` 구문을 사용할 때 발생할 수 있는 오류를 효과적으로 처리하고, 안정적인 애플리케이션을 구축할 수 있습니다.

![JavaScript async await 에러, 깔끔하게 잡아봅시다](/images/posts/javascript-async-await-오류-처리-방법-01-6c418ac2.png)

<small>이미지 출처: https://hsk0504.tistory.com/37</small>

## 실무 적용 체크리스트

- JavaScript async await 오류 처리 방법을 적용하기 전에 현재 운영 환경의 기준값과 예외 상황을 먼저 정리합니다.
- 변경 전후로 확인할 지표를 정하고, 문제가 생겼을 때 되돌릴 수 있는 절차를 문서화합니다.
- 한 번에 모든 서버나 서비스에 적용하기보다 작은 범위에서 검증한 뒤 점진적으로 확대합니다.
- 담당자, 확인 시간, 장애 판단 기준을 명확히 남겨 같은 문제가 반복될 때 빠르게 대응할 수 있게 합니다.

![JavaScript async function 에러, 더 이상 어렵지 않아요](/images/posts/javascript-async-await-오류-처리-방법-00-df533a35.png)

<small>이미지 출처: https://sentier226-gif.tistory.com/22</small>

## 운영 중 자주 놓치는 부분

#Programming 영역에서는 설정 자체보다 운영 중에 남는 기록과 점검 루틴이 더 중요합니다. 처음에는 정상처럼 보이더라도 트래픽이 늘거나 배포 주기가 빨라지면 작은 누락이 장애로 이어질 수 있습니다. 그래서 로그, 알림, 대시보드, 변경 이력을 함께 확인하고 실제 장애 대응 과정에서 필요한 정보가 빠지지 않았는지 주기적으로 점검해야 합니다.

## 참고한 자료

- [JavaScript async function 에러, 더 이상 어렵지 않아요](https://sentier226-gif.tistory.com/22)
- [JavaScript async await 에러, 깔끔하게 잡아봅시다](https://hsk0504.tistory.com/37)
- [Javascript는 비동기를 어떻게 처리해 - async await](https://donologue.tistory.com/385)
- [[Javascript\] async await 사용방법](https://about-tech.tistory.com/55)
