# MySQL 접속 오류: 'Access denied for user' 문제 해결하기

## 증상 및 오류 메시지

MySQL 데이터베이스에 접속을 시도할 때, 다음과 같은 오류 메시지를 자주 접하게 됩니다:

```
ERROR 1045 (28000): Access denied for user 'username'@'hostname' (using password: YES)
```

이 오류는 주로 사용자 인증 문제로 인해 발생하며, 데이터베이스에 접근할 수 없다는 것을 의미합니다. 특히, AWS RDS와 같은 클라우드 서비스에서 MySQL에 연결할 때 이 문제가 빈번하게 발생합니다.

## 대표적인 원인

이 오류의 원인은 여러 가지가 있을 수 있습니다. 일반적으로 다음과 같은 이유로 발생합니다:

1. **잘못된 사용자명 또는 비밀번호**: 입력한 사용자명이나 비밀번호가 올바르지 않을 경우 발생합니다.
2. **사용자 권한 부족**: 해당 사용자가 지정된 호스트에서 데이터베이스에 접근할 권한이 없을 수 있습니다.
3. **호스트 주소 오류**: MySQL 서버의 호스트 주소를 잘못 입력했거나, 해당 주소가 올바른지 확인해야 합니다.
4. **MySQL 설정 문제**: MySQL의 설정 파일(my.cnf)에서 접근 제어가 잘못 설정된 경우입니다.

## 확인 명령어

문제를 진단하기 위해 다음과 같은 명령어를 사용할 수 있습니다. 먼저 MySQL에 접속을 시도해 보세요:

```bash
mysql -u username -p -h hostname
```

이때, `username`과 `hostname`은 실제 사용하는 값으로 변경해야 합니다. 이 명령어를 실행했을 때, 오류 메시지가 발생하면 위의 원인을 하나씩 점검해야 합니다.

## 해결 절차

1. **사용자명 및 비밀번호 확인**: MySQL에 접속하기 위해 사용하는 사용자명과 비밀번호가 올바른지 다시 한 번 확인합니다.

2. **사용자 권한 확인**: 다음 명령어를 사용하여 사용자 권한을 확인합니다.

```sql
SELECT user, host FROM mysql.user;
```

이 명령어를 통해 해당 사용자가 어떤 호스트에서 접근할 수 있도록 설정되어 있는지 확인할 수 있습니다. 필요한 경우, 다음과 같이 권한을 추가할 수 있습니다:

```sql
GRANT ALL PRIVILEGES ON *.* TO 'username'@'hostname' IDENTIFIED BY 'password';
FLUSH PRIVILEGES;
```

3. **호스트 주소 확인**: 접속하려는 MySQL 서버의 호스트 주소가 정확한지 확인합니다. AWS RDS를 사용하는 경우, RDS 인스턴스의 엔드포인트를 확인해야 합니다.

4. **MySQL 설정 파일 점검**: MySQL의 설정 파일(my.cnf)에서 `skip-name-resolve` 옵션이 활성화되어 있는지 확인합니다. 이 옵션이 활성화되어 있다면, 사용자 호스트를 IP 주소로 지정해야 합니다.

## 흔한 실수

- 사용자명과 비밀번호를 입력할 때, 공백이나 오타가 없는지 확인해야 합니다.
- AWS RDS와 같은 클라우드 환경에서는 보안 그룹 설정이 올바르게 되어 있는지 점검해야 합니다. 포트 3306이 열려 있어야 MySQL에 접근할 수 있습니다.
- 데이터베이스에 접근할 때, `localhost` 대신 올바른 호스트를 사용하는지 확인합니다.

## 재발 방지 체크리스트

- 사용자명과 비밀번호를 안전하게 관리하고 주기적으로 변경합니다.
- 데이터베이스 사용자에게 최소한의 권한만 부여하여 보안을 강화합니다.
- MySQL의 로그 파일을 정기적으로 확인하여, 비정상적인 접근 시도를 모니터링합니다.
- AWS RDS의 보안 그룹 설정을 주기적으로 점검하여, 필요한 IP만 허용되도록 설정합니다.

위의 절차를 통해 MySQL의 'Access denied for user' 오류를 해결하고, 재발 방지 대책을 마련하여 안정적인 데이터베이스 운영을 할 수 있습니다.

![참고 이미지](/images/posts/mysql-접속-오류-access-denied-for-user-문제-해결하기-01-d02395ea.png)

<small>이미지 출처: https://twojun-space.tistory.com/208</small>

## 실무 적용 체크리스트

- MySQL access denied for user 해결을 적용하기 전에 현재 운영 환경의 기준값과 예외 상황을 먼저 정리합니다.
- 변경 전후로 확인할 지표를 정하고, 문제가 생겼을 때 되돌릴 수 있는 절차를 문서화합니다.
- 한 번에 모든 서버나 서비스에 적용하기보다 작은 범위에서 검증한 뒤 점진적으로 확대합니다.
- 담당자, 확인 시간, 장애 판단 기준을 명확히 남겨 같은 문제가 반복될 때 빠르게 대응할 수 있게 합니다.

![참고 이미지](/images/posts/mysql-접속-오류-access-denied-for-user-문제-해결하기-00-aaf081b2.png)

<small>이미지 출처: https://twojun-space.tistory.com/208</small>

## 참고한 자료

- [[MySQL\] - ERROR 1045 (28000): Access denied for user 'root'@'localhost' (using password: YES) / --host](https://twojun-space.tistory.com/208)
