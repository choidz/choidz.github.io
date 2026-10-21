# logrotate가 동작하지 않을 때의 해결 방법

## 증상 및 오류 메시지
logrotate가 정상적으로 작동하지 않을 경우, 로그 파일이 회전되지 않거나, 회전 후에도 오래된 로그가 삭제되지 않는 현상을 경험할 수 있습니다. 이로 인해 로그 파일이 계속 커져 디스크 용량이 부족해질 수 있습니다. 예를 들어, 로그 파일이 다음과 같은 메시지를 포함할 수 있습니다:

```
logrotate: ERROR: /var/log/myapp/app.log: No such file or directory
```

이와 같은 메시지가 나타나면 logrotate가 해당 로그 파일을 찾지 못하는 상황입니다. 또한, `logrotate` 명령어를 수동으로 실행했을 때, 아무런 변화가 없다면 문제가 발생한 것입니다.

![logrotate 동작 안함 해결 기술 다이어그램](/images/posts/logrotate가-동작하지-않을-때의-해결-방법-00-generated.svg)

## 원인 분석
logrotate가 작동하지 않는 원인은 여러 가지가 있습니다. 가장 흔한 원인은 다음과 같습니다:
1. **설정 파일 오류**: logrotate의 설정 파일에 문법 오류가 있을 수 있습니다.
2. **로그 파일 경로 오류**: 설정 파일에 지정된 로그 파일 경로가 잘못되었거나, 해당 파일이 존재하지 않을 수 있습니다.
3. **권한 문제**: logrotate가 로그 파일을 읽거나 쓸 권한이 없을 수 있습니다.
4. **cron 설정 문제**: logrotate가 cron에 의해 주기적으로 실행되지 않을 수 있습니다.

## 확인 명령어
문제를 확인하기 위해 다음 명령어를 사용할 수 있습니다:

1. logrotate 버전 확인:
   ```bash
   logrotate --version
   ```
2. 설정 파일 문법 확인:
   ```bash
   sudo logrotate -d /etc/logrotate.conf
   ```
   이 명령어는 실제로 파일을 변경하지 않고, 어떻게 동작할지를 시뮬레이션합니다.
3. 로그 파일 존재 여부 확인:
   ```bash
   ls -l /var/log/myapp/app.log
   ```
4. cron 상태 확인:
   ```bash
   systemctl status cron
   ```
   또는
   ```bash
   sudo crontab -l
   ```

## 해결 절차
1. **설정 파일 점검**: `/etc/logrotate.conf` 및 `/etc/logrotate.d/` 디렉토리 내의 설정 파일을 확인하여 문법 오류가 없는지 점검합니다. 설정 파일의 내용이 올바른지 확인합니다.
   예를 들어:
   ```bash
   sudo nano /etc/logrotate.d/myapp
   ```
   내용이 다음과 같아야 합니다:
   ```
   /var/log/myapp/app.log {
       daily
       rotate 7
       compress
       missingok
       notifempty
       create 0640 root root
   }
   ```
2. **로그 파일 경로 확인**: 설정 파일에 지정된 로그 파일 경로가 올바른지 확인하고, 해당 파일이 실제로 존재하는지 확인합니다. 만약 파일이 없다면 애플리케이션이 정상적으로 작동하는지 점검해야 합니다.
3. **권한 문제 해결**: logrotate가 로그 파일을 읽고 쓸 수 있는 권한이 있는지 확인합니다. 필요한 경우 다음 명령어로 권한을 수정합니다:
   ```bash
   sudo chown root:root /var/log/myapp/app.log
   sudo chmod 640 /var/log/myapp/app.log
   ```
4. **cron 설정 확인**: logrotate가 cron에 의해 주기적으로 실행되고 있는지 확인합니다. cron 서비스가 활성화되어 있는지 확인하고, 필요하다면 cron 설정을 수정합니다. 예를 들어, 다음과 같은 cron 작업이 있어야 합니다:
   ```bash
   0 0 * * * /usr/sbin/logrotate /etc/logrotate.conf
   ```

## 흔한 실수
- 설정 파일의 문법 오류를 간과하는 경우가 많습니다. 특히 중괄호와 같은 문법 요소를 놓치는 경우가 있으니 주의해야 합니다.
- 로그 파일이 존재하지 않는데도 logrotate를 실행하려고 하는 경우입니다. 로그 파일이 생성되는지 확인해야 합니다.
- cron이 제대로 설정되어 있지 않거나, cron 서비스가 실행되고 있지 않은 경우도 많습니다.

## 재발 방지 체크리스트
- 설정 파일을 작성할 때 문법을 항상 점검합니다.
- 로그 파일이 생성되는지 주기적으로 확인합니다.
- cron 서비스가 정상적으로 작동하는지 확인합니다.
- 로그 파일의 권한을 정기적으로 점검하여, logrotate가 필요한 권한을 가지고 있는지 확인합니다.

이러한 절차를 통해 logrotate가 정상적으로 작동하도록 유지할 수 있습니다. 문제가 발생했을 때는 위의 과정을 통해 신속하게 해결할 수 있습니다.

## 참고한 자료

- [[리눅스 프로그래밍 시리즈 37편\]logrotate와 로그 보관 정책: 운영 서버 로그를 안전하게 관리하는 방법](https://subling.tistory.com/m/entry/%EB%A6%AC%EB%88%85%EC%8A%A4-%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D-%EC%8B%9C%EB%A6%AC%EC%A6%88-37%ED%8E%B8logrotate%EC%99%80-%EB%A1%9C%EA%B7%B8-%EB%B3%B4%EA%B4%80-%EC%A0%95%EC%B1%85-%EC%9A%B4%EC%98%81-%EC%84%9C%EB%B2%84-%EB%A1%9C%EA%B7%B8%EB%A5%BC-%EC%95%88%EC%A0%84%ED%95%98%EA%B2%8C-%EA%B4%80%EB%A6%AC%ED%95%98%EB%8A%94-%EB%B0%A9%EB%B2%95)
- [NCP 207 문제 풀기](https://dradnats1012.tistory.com/29)
