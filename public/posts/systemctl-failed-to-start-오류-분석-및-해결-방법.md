# systemctl failed to start 오류 분석 및 해결 방법

---

## 증상 및 오류 메시지

시스템에서 특정 서비스를 시작하려고 할 때, `systemctl failed to start`라는 오류 메시지가 발생할 수 있습니다. 이 오류는 서비스가 정상적으로 시작되지 않았음을 나타내며, 다음과 같은 형태로 로그에 기록됩니다:

```
● your_service_name.service - Description of your service
   Loaded: loaded (/lib/systemd/system/your_service_name.service; enabled; vendor preset: enabled)
   Active: failed (Result: exit-code) since Mon 2021-05-31 11:14:34 KST; 24s ago
     Docs: man:your_service_name(8)
  Process: 1234 ExecStart=/usr/bin/your_service_name (code=exited, status=1/FAILURE)
```

이와 같은 메시지는 서비스가 시작되지 않았고, 그 원인을 파악하기 위해 추가적인 로그를 확인해야 함을 의미합니다.

## 원인 분석

`systemctl failed to start` 오류는 여러 가지 원인으로 발생할 수 있습니다. 일반적인 원인은 다음과 같습니다:

1. **설정 파일 오류**: 서비스의 설정 파일에 문법 오류가 있거나 잘못된 값이 설정되어 있을 수 있습니다.
2. **의존성 문제**: 서비스가 의존하는 다른 서비스가 정상적으로 실행되지 않거나, 필요한 패키지가 설치되지 않았을 수 있습니다.
3. **파일 권한 문제**: 서비스가 접근해야 할 파일이나 디렉토리에 대한 권한이 부족할 수 있습니다.
4. **자원 부족**: 메모리, CPU 등의 자원이 부족하여 서비스가 시작되지 않을 수 있습니다.

이러한 원인을 파악하기 위해서는 다음과 같은 명령어를 사용할 수 있습니다:

```
systemctl status your_service_name
journalctl -xe
```

`systemctl status` 명령어는 서비스의 현재 상태와 마지막 실행 결과를 보여주며, `journalctl -xe`는 시스템 로그를 통해 추가적인 오류 메시지를 확인할 수 있습니다.

## 해결 절차

오류를 해결하기 위한 절차는 다음과 같습니다:

1. **상태 확인**: 위에서 언급한 명령어를 사용하여 서비스의 상태와 로그를 확인합니다.
2. **설정 파일 검토**: 서비스의 설정 파일을 열어 문법 오류나 잘못된 설정이 있는지 검토합니다. 예를 들어:
   
   ```
   vi /etc/systemd/system/your_service_name.service
   ```

3. **의존성 확인**: 서비스가 의존하는 다른 서비스가 정상적으로 실행되고 있는지 확인합니다. 필요한 서비스가 실행 중인지 확인하기 위해 다음 명령어를 사용합니다:
   
   ```
systemctl status dependent_service_name
   ```

4. **파일 권한 수정**: 서비스가 접근해야 할 파일이나 디렉토리의 권한을 확인하고, 필요시 수정합니다. 예를 들어:
   
   ```
   chown -R user:group /path/to/directory
   chmod 755 /path/to/file
   ```

5. **자원 확인**: 시스템의 메모리와 CPU 자원을 확인하고, 부족한 경우 불필요한 프로세스를 종료하거나 시스템을 재부팅합니다. 자원 확인 명령어는 다음과 같습니다:
   
   ```
   free -h
   top
   ```

6. **서비스 재시작**: 문제를 해결한 후, 서비스를 다시 시작합니다:
   
   ```
   systemctl start your_service_name
   ```

## 흔한 실수

- **설정 파일을 수정한 후, daemon-reload를 하지 않음**: 설정 파일을 수정한 후에는 `systemctl daemon-reload` 명령어를 실행하여 변경 사항을 반영해야 합니다.
- **서비스 의존성을 무시함**: 서비스가 의존하는 다른 서비스가 실행되고 있는지 확인하지 않고 시작하려는 경우.
- **잘못된 파일 권한 설정**: 서비스가 필요한 파일에 대한 접근 권한을 잘못 설정하여 발생하는 오류.

## 재발 방지 체크리스트

1. 서비스의 설정 파일을 정기적으로 검토하고, 변경 사항을 문서화합니다.
2. 서비스 의존성을 명확히 이해하고, 서비스 시작 전에 의존 서비스가 실행 중인지 확인합니다.
3. 파일 및 디렉토리의 권한을 적절히 설정하여 서비스가 정상적으로 접근할 수 있도록 합니다.
4. 시스템 자원 사용량을 모니터링하고, 필요 시 리소스를 확장합니다.

위의 절차와 체크리스트를 통해 `systemctl failed to start` 오류를 효과적으로 해결하고, 향후 재발을 방지할 수 있습니다.

---

## 참고한 자료

- [[MySQL/MariaDB\] 서버 시작 에러](https://steady-snail.tistory.com/268)
- [카산드라를 설치해보기](https://tommypagy.tistory.com/278)
- [진짜_잘하고_싶거든요.zip](https://dev-leeyjstar.tistory.com/?page=2)
