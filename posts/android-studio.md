# Android Studio 설치 후 휴대폰(삼성) 인식 안 될 때 해결법

---

**✅ 1️⃣ 증상 요약**

  * Android Studio에서 내 폰이 안 보임

  * adb devices 실행해도 아무 기기도 표시되지 않음

  * “이 컴퓨터의 RSA 키 지문을 허용하시겠습니까?” 창이 안 뜸

  * 장치 관리자(Device Manager)에서는 **⚠️ “SAMSUNG_Android – 드라이버 없음”**

**​**

**✅ 2️⃣ 원인 요약**

> PC가 내 폰을 **Android 디버깅용 장치(ADB)** 로 인식하지 못하고 있음.
> 
> 즉, **삼성 USB 드라이버 미설치** 또는 **USB 모드 / 디버깅 설정 미비** 상태입니다.

---

**✅ 3️⃣ 해결 단계 (차근차근)**

**🔹 ① USB 모드 변경**

  1. **폰을 PC에 연결**

  2. **상단 알림창에서 “USB 사용” 항목 선택**

  3. **반드시 “****파일 전송 (MTP)****” 또는 “****Transferring files****” 로 변경**

> “충전만(Charging only)” 상태면 ADB가 절대 인식 안 함 ❌

---

**🔹 ② 개발자 옵션 켜기 + USB 디버깅 활성화**

  1. **설정 → 휴대폰 정보 →****소프트웨어 정보 → “빌드번호” 7번 탭**

  2. **“개발자 옵션이 활성화되었습니다.” 문구 확인**

  3. **설정 → 개발자 옵션 → 아래 항목 켜기**

  * **✅****개발자 옵션**

  * **✅****USB 디버깅**

---

**🔹 ③ ADB 드라이버(삼성 USB 드라이버) 설치**

**👉 공식 다운로드**

**🔗 Samsung Android USB Driver for Windows**

  1. **파일(SAMSUNG_USB_Driver_for_Mobile_Phones.exe) 다운로드**

  2. **설치 진행 (Next → Install → Finish)**

  3. **완료 후, USB 케이블****뽑았다가 다시 연결**

---

**🔹 ④ 장치 관리자에서 확인**

  1. **Windows 검색창 → “장치 관리자” 실행 혹은 (WIN + X )**

  2. **“****기타 장치 > SAMSUNG_Android****” 가 있으면 정상적으로 드라이버를 인식해야 함**

  3. **설치 후엔 아래처럼 바뀌면 성공 ✅**

  4. **Android Device ↳ Samsung Android ADB Interface**

[ ![](https://mblogthumb-phinf.pstatic.net/MjAyNTExMDhfMjc4/MDAxNzYyNjAzNjE3MDA0.baqrzBl21j6OLrPcCVy-WSIGDntZJOD2KjhCvhD148cg.xsRvITanNPi2A0A39falrN6piqB_sf51Ooi67ElSYggg.PNG/image.png?type=w80_blur) ](<#>)

---

**🔹 ⑤ ADB 인식 확인**

**PowerShell(또는 CMD)에서:**

**adb kill-server adb start-server adb devices**

**정상이라면 👇**

**List of devices attached R3CN203A9ZL device**

> 💡 폰 화면에 “이 컴퓨터의 RSA 키 지문을 허용하시겠습니까?” 팝업이 뜨면
> 
> “항상 허용” 체크하고 “확인” 클릭하세요.

---

**🔹 ⑥ 그래도 안 뜬다면?**

  * **케이블이****충전 전용****일 수 있습니다 →****데이터 전송용 케이블****로 교체**

  * **포트 변경 (USB 3.0 → USB 2.0 포트로 시도)**

  * **adb usb 명령으로 연결 트리거 시도:**

  * **adb usb adb devices**

---

**✅ 4️⃣ 최종 점검**

**정상 연결 시, Android Studio 상단 기기 목록에 아래처럼 표시됩니다 👇**

**SM-T9EST (Android 14)**

> 이제 flutter run / Run ▶ 눌러서 바로 내 폰에서 앱 실행 가능 🎉

---

**🧩 요약표**

---

**✅ 마무리 체크리스트**

**✅ USB 모드: 파일 전송**

**✅ 개발자 옵션 + USB 디버깅 ON**

**✅ Samsung USB Driver 설치**

**✅ adb devices에서 기기 표시됨**

**✅ Android Studio에서 기기 선택 가능**

---

> 💡 한 줄 요약
> 
> **“Samsung USB Driver 설치 → 개발자 옵션 USB 디버깅 ON → 폰 재연결 → RSA 허용”**
> 
> 이 네 가지만 제대로 하면 무조건 연결됩니다 🔥

**​**

**#AndroidStudio #안드로이드스튜디오 #Flutter #플러터 #모바일개발 #앱개발 #개발환경설정 #개발팁**

[원문 보기](https://blog.naver.com/choidz_/224069321023?fromRss=true&trackingCode=rss)
