# Java GC overhead limit exceeded 오류 해결 방법

## 증상 및 오류 메시지

Java 애플리케이션을 실행할 때 `java.lang.OutOfMemoryError: GC overhead limit exceeded`라는 오류 메시지를 자주 접할 수 있습니다. 이 오류는 JVM이 가비지 컬렉션(GC)에 지나치게 많은 시간을 소비하면서도 실제로 회수되는 메모리가 거의 없을 때 발생합니다. 일반적으로 JVM은 최근 5번의 GC 중 98% 이상의 시간이 GC에 사용되었고, 그 결과 전체 힙 메모리의 2% 이하만 회수된 경우 이 오류를 발생시킵니다. 이는 마치 청소를 하고 있지만 공간이 전혀 확보되지 않는 상황과 유사합니다.

![Java GC overhead limit exceeded 해결 기술 다이어그램](/images/posts/java-gc-overhead-limit-exceeded-오류-해결-방법-00-generated.svg)

## 주요 원인

이 오류가 발생하는 주요 원인은 다음과 같습니다.

1. **힙 메모리 부족**: 가장 흔한 원인으로, 대용량 데이터 처리를 시도할 때 메모리가 부족해지는 경우입니다. 예를 들어, 수십만 건의 데이터를 한 번에 메모리에 올리려고 하면 이 문제가 발생할 수 있습니다.

2. **메모리 누수**: 전역 컬렉션에 데이터를 무한히 저장하거나, static 객체가 많은 데이터를 참조할 때 발생합니다. 또한, Stream이나 Lambda 표현식 내부에서 불필요한 참조가 유지되는 경우에도 문제가 됩니다.

3. **부적절한 GC 옵션**: 힙 설정이 너무 작거나, GC 알고리즘이 맞지 않을 때도 이 오류가 발생할 수 있습니다.

## 확인 명령어

이 문제를 진단하기 위해 `jstat` 명령어를 사용할 수 있습니다. 이 명령어는 JVM의 가비지 컬렉션 활동을 모니터링하는 데 유용합니다. 다음과 같은 형식으로 사용할 수 있습니다:

```bash
jstat -gc <PID>
```

여기서 `<PID>`는 해당 Java 프로세스의 ID입니다. 이 명령어를 통해 각 메모리 영역의 할당량과 사용량을 확인할 수 있습니다.

## 해결 절차

이 오류를 해결하기 위한 절차는 다음과 같습니다:

1. **힙 메모리 증가**: 가장 간단한 해결책은 JVM의 힙 메모리 크기를 늘리는 것입니다. 아래와 같이 JVM 옵션을 설정하여 힙 메모리를 증가시킬 수 있습니다.

```bash
java -Xms512m -Xmx4g -jar your-application.jar
```

2. **메모리 누수 점검**: 전역 컬렉션, static 변수, Stream 및 Lambda 표현식에서의 참조를 점검합니다. 특히, 반복문 내부에서 객체가 계속 생성되고 있는지 확인해야 합니다.

3. **GC 옵션 조정**: G1GC와 같은 적절한 GC 알고리즘을 사용하는 것이 좋습니다. 다음과 같이 설정할 수 있습니다:

```bash
java -XX:+UseG1GC -jar your-application.jar
```

4. **모니터링 도구 사용**: VisualVM 또는 JConsole과 같은 도구를 사용하여 메모리 사용량을 모니터링하고, 문제가 발생하는 시점을 분석합니다.

## 흔한 실수

개발자들이 흔히 저지르는 실수 중 하나는 힙 메모리를 늘리는 것만으로 문제를 해결하려고 하는 것입니다. 하지만, 근본적인 원인을 파악하지 않으면 같은 문제가 반복될 수 있습니다. 또한, GC overhead limit exceeded 오류를 해결하기 위해 `-XX:-UseGCOverheadLimit` 옵션을 사용하는 것은 권장되지 않습니다. 이 방법은 문제를 숨길 뿐, 실제 문제를 해결하지는 못합니다.

## 재발 방지 체크리스트

1. **정기적인 메모리 사용량 모니터링**: 애플리케이션의 메모리 사용량을 정기적으로 모니터링하여 이상 징후를 조기에 발견합니다.
2. **코드 리뷰 및 최적화**: 메모리 누수를 유발할 수 있는 코드를 주기적으로 리뷰하고 최적화합니다.
3. **적절한 GC 설정**: 애플리케이션의 특성에 맞는 GC 알고리즘을 설정합니다.
4. **테스트 환경에서의 부하 테스트**: 실제 운영 환경과 유사한 조건에서 부하 테스트를 수행하여 문제를 사전에 발견합니다.

이와 같은 절차를 통해 `GC overhead limit exceeded` 오류를 효과적으로 해결하고, 재발을 방지할 수 있습니다. 이 오류는 단순히 메모리 부족을 의미하는 것이 아니라, 메모리 관리에 대한 깊은 이해가 필요함을 보여줍니다.

## 참고한 자료

- [[Spring\] OutOfMemoryError - GC overhead limit exceeded 원인 분석 및 해결](https://sanghoo.tistory.com/162)
- [[JAVA\] GC overhead limit exceeded 오류 완벽 정리](https://godsu94.tistory.com/entry/JAVA-GC-overhead-limit-exceeded-%EC%98%A4%EB%A5%98-%EC%99%84%EB%B2%BD-%EC%A0%95%EB%A6%AC)
- [GC Overhead limit exceeded 로 시작하여 JVM ... (생략)](https://mjoo1106.tistory.com/55)
- [[WAS 이슈 해결 #1\] java.lang.OutOfMemoryError: GC overhead limit exceeded 로 인한 Tomcat 서버 다운 / CPU 사용량 폭증](https://extsdd.tistory.com/257)
- [[ERROR\] org.eclipse.swt.SWTException: Failed to execute runnable (java.lang.OutOfMemoryError: GC overhead limit exceeded)](https://name5.tistory.com/337)
