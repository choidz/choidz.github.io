# Java NullPointerException 디버깅과 해결 방법

## NullPointerException의 증상

Java 개발을 하다 보면 자주 마주치는 오류 중 하나가 **NullPointerException**입니다. 이 오류는 객체가 `null`인 상태에서 해당 객체의 메서드나 필드에 접근하려고 할 때 발생합니다. 예를 들어, 다음과 같은 코드에서 오류가 발생할 수 있습니다:

![Java NullPointerException Stack Trace에서 UserService 오류 위치와 null 원인을 찾는 방법](/images/posts/java-nullpointerexception-디버깅과-해결-방법-00-c3a7d4ed.png)

<small>이미지 출처: https://yamoojin83.tistory.com/143</small>

```java
String name = null;
System.out.println(name.length()); // NullPointerException 발생
```

이와 같은 상황에서 NullPointerException이 발생하면, 어떤 값이 `null`인지 찾는 것이 매우 중요합니다. Stack Trace를 통해 오류가 발생한 위치를 찾고, 그 원인을 파악하는 과정이 필요합니다.

## NullPointerException의 대표적인 원인

NullPointerException이 발생하는 원인은 다양하지만, 가장 흔한 경우는 다음과 같습니다:

1. **초기화되지 않은 객체**: 객체를 생성하기 전에 메서드를 호출하거나 필드에 접근하는 경우입니다.
2. **API 응답 처리**: 외부 API에서 받은 데이터가 `null`일 가능성을 간과했을 때 발생합니다.
3. **컬렉션에서 null 요소 처리**: 리스트나 맵에서 `null` 값을 포함하고 있을 때입니다.
4. **의존성 주입 실패**: Spring 프레임워크에서 @Autowired가 누락되었을 때 발생할 수 있습니다.

이러한 원인들을 파악하고, 코드에서 `null` 체크를 통해 방어적인 프로그래밍을 적용하는 것이 중요합니다.

## NullPointerException 확인을 위한 명령어

NullPointerException의 원인을 찾기 위해서는 Stack Trace를 확인하는 것이 필수적입니다. 예를 들어, 다음과 같은 Stack Trace가 발생했다고 가정해보겠습니다:

```
java.lang.NullPointerException
    at com.example.service.UserService.findUser(UserService.java:82)
    at com.example.controller.UserController.getUser(UserController.java:41)
```

여기서 `UserService.java:82`는 오류가 발생한 위치를 나타냅니다. 이 정보를 바탕으로 해당 라인에서 어떤 값이 `null`인지 분석해야 합니다.

![Java NullPointerException Stack Trace 파일 라인 null 후보 로그 디버거 테스트 점검 순서](/images/posts/java-nullpointerexception-디버깅과-해결-방법-01-8709c96b.png)

<small>이미지 출처: https://yamoojin83.tistory.com/143</small>

## NullPointerException 해결 절차

1. **Stack Trace 확인**: 오류가 발생한 위치를 확인합니다.
2. **null 후보 좁히기**: 해당 라인에서 어떤 값이 `null`인지 확인하기 위해 표현식을 나눠서 디버깅합니다. 예를 들어:
   ```java
   User user = userRepository.findById(userId).orElse(null);
   if (user != null) {
       Address address = user.getAddress();
       if (address != null) {
           String city = address.getCity();
       }
   }
   ```
3. **로그 추가**: 각 변수의 상태를 로그로 남겨서 문제를 추적합니다. 예를 들어:
   ```java
   log.info("User ID: {}, User: {}", userId, user);
   ```
4. **방어 코드 작성**: null이 발생할 가능성이 있는 부분에 대해 방어 코드를 작성합니다. 예를 들어:
   ```java
   if (user == null) {
       throw new UserNotFoundException(userId);
   }
   ```
5. **Optional 사용 고려**: Java 8 이상에서는 `Optional`을 사용하여 null을 안전하게 처리할 수 있습니다. 예를 들어:
   ```java
   Optional.ofNullable(user)
           .map(User::getAddress)
           .map(Address::getCity)
           .ifPresent(System.out::println);
   ```

## NullPointerException 재발 방지 체크리스트

1. **초기화 철저히 하기**: 객체를 생성할 때 반드시 초기화를 확인합니다.
2. **입력 값 검증**: 외부에서 입력되는 값은 반드시 null 체크를 수행합니다.
3. **IDE의 경고 기능 활용**: IntelliJ IDEA 등에서 제공하는 null 가능성 경고 기능을 적극 활용합니다.
4. **테스트 케이스 작성**: 예상 가능한 null 상황을 모두 테스트 케이스로 작성하여 사전에 방지합니다.
5. **팀 코드 리뷰**: 팀 내에서 null-safe 패턴을 공유하여 코드 품질을 높입니다.

이와 같은 방법들을 통해 NullPointerException을 효과적으로 디버깅하고, 재발을 방지할 수 있습니다. 개발 과정에서 이러한 오류를 마주하더라도, 침착하게 원인을 분석하고 적절한 해결책을 적용하는 것이 중요합니다.

## 참고한 자료

- [Java NullPointerException 원인 찾는 방법: Stack Trace부터 로그·Optional까지 실전 디버깅](https://yamoojin83.tistory.com/143)
- [자바 NullPointerException 오류 해결법 정리](https://alabogo.tistory.com/entry/%EC%9E%90%EB%B0%94-NullPointerException-%EC%98%A4%EB%A5%98-%ED%95%B4%EA%B2%B0%EB%B2%95-%EC%A0%95%EB%A6%AC)
- [가장 흔한 자바 에러 10가지, 초보자도 쉽게 해결하는 디버깅 가이드](https://yamoojin83.tistory.com/101)
