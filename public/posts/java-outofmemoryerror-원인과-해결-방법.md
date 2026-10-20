# Java OutOfMemoryError: 원인과 해결 방법

## 증상 및 오류 메시지
Java 애플리케이션을 실행하는 동안 `java.lang.OutOfMemoryError`가 발생하는 경우, 이는 메모리 부족을 의미합니다. 이 오류는 일반적으로 애플리케이션이 사용 가능한 메모리를 초과하여 객체를 할당하려고 할 때 발생합니다. 예를 들어, 다음과 같은 에러 메시지를 볼 수 있습니다:

```
Exception in thread "main" java.lang.OutOfMemoryError: Java heap space
```

이 오류가 발생하면 애플리케이션이 비정상적으로 종료되거나, 성능 저하가 발생할 수 있습니다. 따라서 이 문제를 해결하는 것이 중요합니다.

## OutOfMemoryError의 주요 원인
OutOfMemoryError가 발생하는 이유는 여러 가지가 있습니다. 가장 일반적인 원인은 다음과 같습니다:

### 1. 대량의 객체 생성
애플리케이션에서 대량의 객체를 한 번에 생성하면, 가비지 컬렉터(GC)가 이를 처리하지 못하고 힙 메모리가 가득 차게 됩니다. 예를 들어:

```java
List<String> list = new ArrayList<>();
while (true) {
    list.add("메모리 사용 증가!");
}
```

### 2. 객체 참조 유지
불필요한 객체를 계속 참조하면 GC가 이를 제거하지 못해 메모리가 누적됩니다. 예를 들어:

```java
static List<String> cache = new ArrayList<>();
public static void addData() {
    cache.add("데이터 저장");
}
```

### 3. 대형 파일 처리
한 번에 큰 파일을 메모리에 로드하면 힙이 부족해질 수 있습니다. 예를 들어:

```java
byte[] fileData = Files.readAllBytes(Paths.get("large_file.txt"));
```

### 4. 메모리 릭 (Memory Leak)
Listener, Thread, Static 객체를 해제하지 않으면 메모리 누수가 발생할 수 있습니다. 이러한 문제들은 메모리 부족을 초래할 수 있습니다.

## 문제 확인 명령어
OutOfMemoryError의 원인을 파악하기 위해 다음과 같은 명령어를 사용할 수 있습니다. JVM의 힙 메모리 사용량을 확인하려면 `jmap` 명령어를 사용할 수 있습니다:

```bash
jmap -histo <PID>
```

이 명령어는 특정 프로세스의 힙 메모리 내 객체의 히스토그램을 보여줍니다. 이를 통해 어떤 객체가 메모리를 많이 차지하고 있는지 확인할 수 있습니다.

![Java OutOfMemoryError 원인과 해결 기술 다이어그램](/images/posts/java-outofmemoryerror-원인과-해결-방법-00-generated.svg)

## 해결 절차
OutOfMemoryError를 해결하기 위해 다음과 같은 방법을 적용할 수 있습니다:

### 1. JVM Heap 크기 조정
Heap 크기를 늘려 메모리 부족을 방지할 수 있습니다. 다음과 같이 JVM 옵션을 설정하여 초기 및 최대 Heap 크기를 조정할 수 있습니다:

```bash
java -Xms512m -Xmx2048m -jar myapp.jar
```

### 2. 메모리 프로파일링 도구 사용
메모리 사용량을 분석하고 비효율적인 객체 할당을 식별하기 위해 메모리 프로파일링 도구를 사용할 수 있습니다. 예를 들어, **Eclipse MAT**나 **VisualVM**을 활용할 수 있습니다.

### 3. 객체 수명 주기 최적화
불필요한 객체 참조를 제거하고, `WeakReference`나 `SoftReference`를 사용하여 메모리 관리를 최적화할 수 있습니다:

```java
WeakReference<MyObject> weakRef = new WeakReference<>(new MyObject());
```

### 4. 대량 데이터 스트리밍 처리
큰 파일을 한 번에 로드하지 않고, 스트리밍 방식으로 처리해야 합니다:

```java
try (BufferedReader br = new BufferedReader(new FileReader("large_file.txt"))) {
    String line;
    while ((line = br.readLine()) != null) {
        System.out.println(line);
    }
}
```

### 5. GC 튜닝
Garbage Collector를 튜닝하여 성능을 최적화할 수 있습니다:

```bash
java -XX:+UseG1GC -Xms1g -Xmx4g -jar myapp.jar
```

## 재발 방지 체크리스트
OutOfMemoryError를 방지하기 위해 다음과 같은 체크리스트를 활용할 수 있습니다:
- [ ] 애플리케이션에서 생성하는 객체 수를 모니터링합니다.
- [ ] 불필요한 객체 참조를 제거합니다.
- [ ] 힙 메모리 사용량을 정기적으로 확인합니다.
- [ ] 메모리 프로파일링 도구를 사용하여 메모리 사용 패턴을 분석합니다.
- [ ] GC 튜닝을 통해 성능을 최적화합니다.

이러한 절차를 통해 Java 애플리케이션에서 발생할 수 있는 OutOfMemoryError를 예방하고, 안정적인 서비스를 제공할 수 있습니다.

## 참고한 자료

- [Java OOM 원인과 해결｜Heap Dump 생성·분석 방법과 OutOfMemoryError](https://slimdog.tistory.com/35)
- [Java Heap Space란? 개념부터 해결 방법까지 가이드](https://aboutevery.tistory.com/540)
