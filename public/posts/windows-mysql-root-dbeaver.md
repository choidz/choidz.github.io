# Windows에서 MySQL root 비밀번호 초기화 + DBeaver 드라이버 오류 해결 총정리

---

MySQL을 사용하다 보면 가장 흔하게 발생하는 두 가지 문제가 있습니다.

✔ **root 비밀번호를 잊어버린 경우**

✔ **DBeaver에서 MySQL 드라이버(Connector/J) 다운로드 오류**

이 글에서는 **Windows 기준으로 이 두 가지 문제를 100% 해결하는 방법** 을 완전 정리했습니다.

초보자도 따라만 하면 해결됩니다!

---

**📌 1. Windows에서 MySQL root 비밀번호 초기화 방법**

※ 예시는 **MySQL 5.7 기준** 이지만, 다른 버전도 거의 동일합니다.

---

**✅ 1) MySQL 서비스 중지**

관리자 권한 CMD(중요!) 실행 후 아래 명령 입력:

```
net stop MySQL57
``` 

※ 서비스 이름이 다른 경우

**services.msc** 에서 실제 이름 확인 → 그 이름으로 입력하세요.

---

**✅ 2) 백그라운드 mysqld 프로세스 완전 종료**

```
taskkill /F /IM mysqld.exe
``` 

mysqld가 살아 있으면 my.ini 로딩 오류가 발생할 수 있습니다.

---

**✅ 3) MySQL bin 폴더 이동**

```
cd "C:\Program Files\MySQL\MySQL Server 5.7\bin"
```

---

**✅ 4) skip-grant-tables 모드로 실행**

이 모드에서는 비밀번호 없이 접속할 수 있습니다.

```
mysqld --defaults-file="C:\Program Files\MySQL\MySQL Server 5.7\my.ini" --skip-grant-tables --console
``` 

정상 로그 예:

[Warning] option --skip-grant-tables used [Note] mysqld: ready for connections 

👉 **이 CMD 창은 닫지 말고 그대로 두세요!**

---

**✅ 5) 새 CMD를 열어 root로 접속**

다시 관리자 CMD 실행:

```
cd "C:\Program Files\MySQL\MySQL Server 5.7\bin"
mysql -u root
``` 

skip-grant 모드라 비밀번호 없이 바로 접속됩니다.

---

**✅ 6) root 비밀번호 재설정**

MySQL 프롬프트에서 아래 명령 입력:

```
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY '새로운비번123!';
FLUSH PRIVILEGES;
```

---

**✅ 7) skip-grant 실행 창 종료 후 서비스 재시작**

skip-grant 창에서 Ctrl + C 또는 그냥 CMD 닫기 → 종료

서비스 다시 시작:

```
net start MySQL57
```

---

**✅ 8) 새 비밀번호로 접속 확인**

```
mysql -u root -p
``` 

비밀번호 입력 후 정상 접속되면 **성공! 🎉**

---

**📌 2. DBeaver에서 MySQL 드라이버 다운로드 오류 해결 (Connector/J)**

DBeaver에서 MySQL 연결 시 다음 메시지가 뜨는 경우가 많습니다.

❗ _“MySQL 드라이버 다운로드 실패”_

이때는 **Connector/J 드라이버 파일을 직접 추가** 하면 100% 해결됩니다.

---

**✅ 1) MySQL Connector/J 다운로드**

✔ 공식 다운로드 페이지

👉 <https://dev.mysql.com/downloads/connector/j/>

운영체제 선택에서 반드시:

👉 **Platform Independent** 선택

→ ZIP 파일 다운로드

→ 압축 풀기

압축을 풀면 다음 파일이 있습니다:

mysql-connector-j-XXX.jar 

(여기서 XXX는 버전 번호)

---

**✅ 2) DBeaver에 드라이버 수동 등록**

  1. DBeaver 실행

  2. MySQL 연결 화면에서 **Edit Driver Settings** 클릭

  3. **Libraries 탭** 선택

  4. **Add File** 클릭

  5. 아까 다운로드한 mysql-connector-j-XXX.jar 추가

  6. 저장 후 다시 접속 시도

👉 자동 다운로드 실패 문제 100% 해결!

---

​

[원문 보기](https://blog.naver.com/choidz_/224077769220?fromRss=true&trackingCode=rss)
