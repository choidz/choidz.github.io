# Git 인증 실패 문제 해결하기: Personal Access Token 사용법

---

## 증상 및 오류 메시지

Git을 사용하여 원격 저장소에 push를 시도할 때, 다음과 같은 오류 메시지를 경험할 수 있습니다:

```
fatal: Authentication failed for 'https://github.com/username/repo.git'
```

이 오류는 GitHub에서의 인증 방식이 변경되었기 때문에 발생합니다. 2021년 8월 13일부터 비밀번호 인증이 지원되지 않으며, 대신 Personal Access Token을 사용해야 합니다.

## 원인

문제의 근본 원인은 GitHub의 인증 방식 변경입니다. 이전에는 사용자 이름과 비밀번호를 사용하여 인증할 수 있었으나, 현재는 비밀번호 대신 개인 액세스 토큰(Personal Access Token)을 사용해야 합니다. 이 변경은 보안 강화를 위한 조치로, 모든 사용자에게 적용됩니다.

## 확인 명령어

문제가 발생했을 때, 다음 명령어를 입력하여 현재 Git 설정을 확인할 수 있습니다:

```bash
git config --list
```

이 명령어는 현재 설정된 사용자 이름과 이메일, 원격 저장소 URL 등을 보여줍니다. 인증 문제가 발생하는 경우, 원격 저장소 URL이 올바른지 확인하는 것이 중요합니다.

## 해결 절차

1. **GitHub에 로그인**: GitHub 웹사이트에 접속하여 로그인합니다.
2. **Personal Access Token 발급**: 오른쪽 상단의 프로필 아이콘을 클릭한 후, Settings > Developer settings > Personal access tokens으로 이동합니다. 'Generate new token'을 클릭합니다.
3. **토큰 설정**: 토큰에 대한 설명을 입력하고, 필요한 권한을 설정합니다. 일반적으로 'repo' 권한을 선택합니다.
4. **토큰 복사**: 생성된 토큰은 한 번만 표시되므로, 안전한 곳에 복사해 둡니다.
5. **Git에 토큰 적용**: Git에서 push 명령어를 다시 실행할 때, 사용자 이름에는 GitHub 사용자 이름을 입력하고, 비밀번호에는 방금 복사한 토큰을 입력합니다.

```bash
git push origin master
```

이제 정상적으로 push가 수행되어야 합니다.

## 흔한 실수

- **토큰을 잊어버리는 경우**: 토큰은 한 번만 표시되므로, 반드시 안전한 곳에 저장해야 합니다. 토큰을 잃어버리면 다시 발급받아야 합니다.
- **잘못된 권한 설정**: 토큰을 생성할 때 필요한 권한을 설정하지 않으면, 원하는 작업을 수행할 수 없습니다. 필요한 권한을 반드시 확인해야 합니다.
- **URL 오류**: 원격 저장소 URL이 잘못 설정되어 있는 경우에도 인증 오류가 발생할 수 있습니다. 항상 URL을 확인하는 것이 좋습니다.

## 재발 방지 체크리스트

- [ ] Personal Access Token을 안전한 곳에 저장했는가?
- [ ] GitHub 계정의 권한 설정을 확인했는가?
- [ ] 원격 저장소 URL이 올바른지 확인했는가?
- [ ] Git 설정을 정기적으로 점검했는가?

이와 같은 절차를 통해 Git 인증 실패 문제를 해결하고, 향후 재발을 방지할 수 있습니다. GitHub의 인증 방식 변경에 따라 적절한 조치를 취하는 것이 중요합니다.

![참고 이미지](/images/posts/git-인증-실패-문제-해결하기-personal-access-token-사용법-01-b5bf7705.png)

<small>이미지 출처: https://dambi-ml.tistory.com/19</small>

## 실무 적용 체크리스트

- Git authentication failed 해결을 적용하기 전에 현재 운영 환경의 기준값과 예외 상황을 먼저 정리합니다.
- 변경 전후로 확인할 지표를 정하고, 문제가 생겼을 때 되돌릴 수 있는 절차를 문서화합니다.
- 한 번에 모든 서버나 서비스에 적용하기보다 작은 범위에서 검증한 뒤 점진적으로 확대합니다.
- 담당자, 확인 시간, 장애 판단 기준을 명확히 남겨 같은 문제가 반복될 때 빠르게 대응할 수 있게 합니다.

![참고 이미지](/images/posts/git-인증-실패-문제-해결하기-personal-access-token-사용법-00-6e153aa5.png)

<small>이미지 출처: https://shortcuts.tistory.com/12</small>

---

## 참고한 자료

- [[git\] push하면 Logon failed / Invalid username or password 같은 에러가 뜰 때..](https://ddodledoodle.tistory.com/entry/git-push%ED%95%98%EB%A9%B4-Logon-failed-Invalid-username-or-password-%EA%B0%99%EC%9D%80-%EC%97%90%EB%9F%AC%EA%B0%80-%EB%9C%B0-%EB%95%8C)
- [[Github\] 깃허브 CLI 로그인 이슈, Access Token - 'fatal: Authentication failed for ...'](https://log4day.tistory.com/63)
- [[git\] push 인증 에러 - fatal : Authentication failed for ~](https://dambi-ml.tistory.com/19)
- [Git 에러 해결 - does not have a commit checked out / fatal: adding files failed.](https://shortcuts.tistory.com/13)
- [Git 에러 해결 - remote: Support for password authentication was removed. Please use a personal access token instead. fatal: Authentication failed for ~](https://shortcuts.tistory.com/12)
