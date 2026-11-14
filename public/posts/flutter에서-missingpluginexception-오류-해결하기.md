# Flutter에서 MissingPluginException 오류 해결하기

## 증상 및 오류 메시지
Flutter 애플리케이션을 개발하는 과정에서 'MissingPluginException' 오류를 자주 경험할 수 있습니다. 이 오류는 특정 플러그인이 제대로 연결되지 않았거나, 호출된 메서드가 구현되지 않았음을 나타냅니다. 예를 들어, 다음과 같은 오류 메시지가 나타날 수 있습니다:

```
MissingPluginException(No implementation found for method ... on channel ...)
```

이 오류는 보통 iOS 또는 Android 플랫폼에서 발생하며, 해당 플랫폼에서 특정 기능을 사용하려고 할 때 발생합니다. 특히, Flutter와 네이티브 코드 간의 통신에서 문제가 발생하는 경우가 많습니다.

## 원인 분석
MissingPluginException의 주요 원인은 여러 가지가 있습니다. 가장 흔한 원인으로는 다음과 같은 경우가 있습니다:
1. **플러그인 설치 누락**: pubspec.yaml 파일에 플러그인이 추가되지 않았거나, 잘못된 버전이 지정된 경우입니다.
2. **플러그인 초기화 문제**: Flutter 애플리케이션이 시작될 때, 플러그인이 제대로 초기화되지 않으면 이러한 오류가 발생할 수 있습니다.
3. **iOS/Android 플랫폼 설정 오류**: 네이티브 플랫폼에서의 설정이 잘못되었거나, 권한이 부족한 경우에도 문제가 발생할 수 있습니다.

이러한 원인을 확인하기 위해서는 다음과 같은 명령어를 사용할 수 있습니다:

```bash
flutter clean
flutter pub get
```

이 명령어는 프로젝트의 캐시를 정리하고, 필요한 종속성을 다시 가져옵니다. 이후에도 문제가 지속된다면, 다음 단계로 진행해야 합니다.

## 해결 절차
MissingPluginException을 해결하기 위한 절차는 다음과 같습니다:
1. **플러그인 확인**: pubspec.yaml 파일에서 해당 플러그인이 올바르게 추가되었는지 확인합니다. 예를 들어, 다음과 같이 추가되어 있어야 합니다:
   
   ```yaml
   dependencies:
     flutter:
       sdk: flutter
     your_plugin_name: ^1.0.0
   ```

2. **플러그인 초기화**: main.dart 파일에서 플러그인이 초기화되는지 확인합니다. 예를 들어, 다음과 같이 설정할 수 있습니다:
   
   ```dart
   void main() async {
     WidgetsFlutterBinding.ensureInitialized();
     runApp(MyApp());
   }
   ```

3. **iOS/Android 설정 확인**: iOS의 경우 Xcode에서 설정이 올바른지 확인하고, Android의 경우 AndroidManifest.xml 파일에서 필요한 권한이 설정되어 있는지 점검합니다.

4. **앱 재빌드**: 변경 사항을 적용한 후, 앱을 재빌드합니다. 다음 명령어를 사용합니다:
   
   ```bash
   flutter build ios
   flutter run
   ```

5. **디버깅**: 여전히 문제가 발생한다면, 디버깅을 통해 어떤 부분에서 오류가 발생하는지 확인합니다. 로그를 통해 추가적인 정보를 얻을 수 있습니다.

## 흔한 실수 및 재발 방지 체크리스트
MissingPluginException을 방지하기 위해 다음과 같은 체크리스트를 고려해보세요:
- [ ] pubspec.yaml 파일에 모든 필요한 플러그인이 포함되어 있는가?
- [ ] main.dart 파일에서 WidgetsFlutterBinding.ensureInitialized()가 호출되었는가?
- [ ] 네이티브 플랫폼(iOS/Android)의 설정이 올바르게 되어 있는가?
- [ ] 앱을 실행하기 전에 flutter clean 및 flutter pub get 명령어를 사용하였는가?

이 체크리스트를 통해 MissingPluginException 오류를 예방할 수 있습니다. Flutter 개발 시 주의 깊게 확인하여 문제를 사전에 방지하는 것이 중요합니다.

![참고 이미지](/images/posts/flutter에서-missingpluginexception-오류-해결하기-00-d81cbcaf.png)

<small>이미지 출처: https://etst.tistory.com/381</small>

## 실무 적용 체크리스트

- Flutter MissingPluginException 해결을 적용하기 전에 현재 운영 환경의 기준값과 예외 상황을 먼저 정리합니다.
- 변경 전후로 확인할 지표를 정하고, 문제가 생겼을 때 되돌릴 수 있는 절차를 문서화합니다.
- 한 번에 모든 서버나 서비스에 적용하기보다 작은 범위에서 검증한 뒤 점진적으로 확대합니다.
- 담당자, 확인 시간, 장애 판단 기준을 명확히 남겨 같은 문제가 반복될 때 빠르게 대응할 수 있게 합니다.

![참고 이미지](/images/posts/flutter에서-missingpluginexception-오류-해결하기-01-eb7963ed.png)

<small>이미지 출처: https://etst.tistory.com/381</small>

## 참고한 자료

- [[Flutter\] Apple 로그인 창 Modal 안뜨는 경우 / AuthorizationErrorCode.unknown error 1000.](https://etst.tistory.com/381)
