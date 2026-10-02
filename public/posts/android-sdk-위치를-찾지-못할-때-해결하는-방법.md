# Android SDK 위치를 찾지 못할 때 해결하는 방법

## 증상 및 오류 메시지

안드로이드 스튜디오를 사용하다 보면 'SDK location not found'라는 오류 메시지를 접할 수 있습니다. 이 오류는 안드로이드 스튜디오가 Android SDK의 위치를 찾지 못할 때 발생합니다. 특히 프로젝트를 클론하거나 새로운 환경에서 작업할 때 자주 나타납니다. 이 오류는 다음과 같은 메시지로 나타납니다:

![참고 이미지](/images/posts/android-sdk-위치를-찾지-못할-때-해결하는-방법-00-649f0f5d.png)

<small>이미지 출처: https://daljyeong.tistory.com/entry/Android-SDK-location-not-found-%EB%AC%B8%EC%A0%9C-%ED%95%B4%EA%B2%B0%ED%95%98%EB%8A%94-%EB%B0%A9</small>

```
SDK location not found. Define a valid SDK location with an ANDROID_HOME environment variable or by setting the sdk.dir path in your project's local properties file.
```

이 메시지는 SDK 경로가 설정되지 않았거나 잘못 설정되었음을 의미합니다. 따라서 이 문제를 해결하기 위해 SDK의 위치를 확인하고 적절한 설정을 해주어야 합니다.

## 원인 분석

이 오류의 주된 원인은 두 가지입니다. 첫째, Android SDK가 설치되어 있지 않거나 잘못된 경로에 설치된 경우입니다. 둘째, `local.properties` 파일이 존재하지 않거나 잘못된 경로가 설정된 경우입니다. `local.properties` 파일은 각 프로젝트의 루트 디렉토리에 위치해야 하며, 이 파일에서 SDK 경로를 지정해야 합니다. 이 파일이 없거나 잘못된 경로가 설정되어 있으면 안드로이드 스튜디오는 SDK를 찾을 수 없습니다.

확인 명령어로는 다음과 같은 방법이 있습니다. 안드로이드 스튜디오에서 `File > Project Structure > SDK Location`으로 이동하여 현재 설정된 SDK 경로를 확인할 수 있습니다. 해당 경로에 `platform-tools`, `build-tools`와 같은 디렉토리가 존재하는지 확인해야 합니다.

## 해결 절차

이제 문제를 해결하기 위한 절차를 살펴보겠습니다.

1. **SDK 설치 확인**: 먼저 Android SDK가 설치되어 있는지 확인합니다. 아래 경로에서 SDK가 존재하는지 확인합니다.
   - Windows: `C:\Users\사용자명\AppData\Local\Android\Sdk`
   - macOS: `/Users/사용자명/Library/Android/sdk`
   - Linux: `/home/사용자명/Android/Sdk`

   만약 SDK가 없다면, Android Studio의 SDK Manager를 통해 설치할 수 있습니다.

2. **local.properties 파일 생성 및 설정**: SDK가 설치되어 있다면, 프로젝트 루트 디렉토리에 `local.properties` 파일을 생성합니다. 이 파일에 다음 내용을 추가합니다.
   ```
   sdk.dir=C:\Users\사용자명\AppData\Local\Android\Sdk
   ```
   이때 경로는 실제 SDK가 설치된 경로로 수정해야 합니다. Windows에서는 역슬래시를 이스케이프 처리하여 두 번 입력해야 합니다.

3. **ANDROID_HOME 환경 변수 설정**: 추가로, 시스템 환경 변수에 `ANDROID_HOME`을 설정해 주는 것도 좋은 방법입니다. Windows에서는 '내 PC'에서 오른쪽 클릭 후 '속성' > '고급 시스템 설정' > '환경 변수'에서 사용자 변수로 `ANDROID_HOME`을 추가하고 SDK 경로를 입력합니다. macOS나 Linux에서는 셸 초기화 파일에 다음을 추가합니다.
   ```
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

4. **안드로이드 스튜디오 재시작**: 모든 설정을 완료한 후 안드로이드 스튜디오를 재시작하여 오류가 해결되었는지 확인합니다.

## 흔한 실수 및 재발 방지

- **SDK 경로 확인**: SDK 경로가 정확한지 항상 확인해야 합니다. 다른 PC에서 작업할 경우, `local.properties` 파일이 다를 수 있으므로 주의해야 합니다.
- **환경 변수 설정**: 환경 변수를 설정할 때, 경로에 공백이나 한글이 포함되지 않도록 주의해야 합니다. 이러한 경우에도 오류가 발생할 수 있습니다.
- **local.properties 파일 관리**: 이 파일은 각 개발자의 환경에 맞게 설정되어야 하므로, 버전 관리 시스템(Git 등)에 포함시키지 않는 것이 좋습니다. 각 개발자가 자신의 환경에 맞게 생성해야 합니다.

이러한 절차와 주의사항을 따르면 'SDK location not found' 오류를 효과적으로 해결할 수 있습니다. 문제가 지속된다면, SDK 설치 경로와 환경 변수를 다시 한 번 점검해 보시기 바랍니다.

![참고 이미지](/images/posts/android-sdk-위치를-찾지-못할-때-해결하는-방법-01-1d120f3d.png)

<small>이미지 출처: https://daljyeong.tistory.com/entry/Android-SDK-location-not-found-%EB%AC%B8%EC%A0%9C-%ED%95%B4%EA%B2%B0%ED%95%98%EB%8A%94-%EB%B0%A9</small>

## 참고한 자료

- [[Android\] SDK location not found 문제 해결하는 방법](https://daljyeong.tistory.com/entry/Android-SDK-location-not-found-%EB%AC%B8%EC%A0%9C-%ED%95%B4%EA%B2%B0%ED%95%98%EB%8A%94-%EB%B0%A9)
- [안드로이드 SDK 경로를 찾지 못할 때 설정하는 방법](https://neos35.tistory.com/entry/%EC%95%88%EB%93%9C%EB%A1%9C%EC%9D%B4%EB%93%9C-SDK-%EA%B2%BD%EB%A1%9C%EB%A5%BC-%EC%B0%BE%EC%A7%80-%EB%AA%BB%ED%95%A0-%EB%95%8C-%EC%84%A4%EC%A0%95%ED%95%98%EB%8A%94-%EB%B0%A9%EB%B2%95)
- [Flutter SDK 경로 인식 안 될 때｜flutter 명령어 못 찾는 오류 환경 변수로 해결하기](https://neos35.tistory.com/entry/Flutter-SDK-%EA%B2%BD%EB%A1%9C-%EC%9D%B8%EC%8B%9D-%EC%95%88-%EB%90%A0-%EB%95%8C%EF%BD%9Cflutter-%EB%AA%85%EB%A0%B9%EC%96%B4-%EB%AA%BB-%EC%B0%BE%EB%8A%94-%EC%98%A4%EB%A5%98-%ED%99%98%EA%B2%BD-%EB%B3%80%EC%88%98%EB%A1%9C-%ED%95%B4%EA%B2%B0%ED%95%98%EA%B8%B0)
- [[Flutter\] 플러터 설치 및 환경설정 에러 해결](https://calvinjmkim.tistory.com/60)
