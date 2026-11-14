# DBeaver에서 발생하는 'Public Key Retrieval is not allowed' 오류 해결하기

## 증상 및 오류 메시지
DBeaver를 사용하여 MySQL 데이터베이스에 접속하려고 할 때, 다음과 같은 오류 메시지가 나타날 수 있습니다.

```
Public Key Retrieval is not allowed
```

이 오류는 MySQL Connector/J가 암호 인증 중 서버의 RSA 공개 키를 가져와야 하는데 공개 키 조회가 허용되지 않은 경우 발생할 수 있습니다. 따라서, DBeaver에서 MySQL에 연결할 때 공개 키 검색을 허용하지 않으면 이 오류가 발생하게 됩니다.

## 원인
이 오류의 주된 원인은 MySQL의 보안 설정에 있습니다. Connector/J의 `allowPublicKeyRetrieval` 기본값은 `false`입니다. 이는 중간자 공격(MITM)을 방지하기 위한 조치입니다. 따라서, DBeaver에서 MySQL에 연결할 때 `allowPublicKeyRetrieval` 설정이 `false`로 되어 있으면 이 오류가 발생합니다.

## 확인 명령어
이 오류를 해결하기 위해서는 DBeaver의 설정을 확인해야 합니다. DBeaver에서 MySQL 연결 설정을 열고, 다음과 같은 단계를 통해 현재 설정을 확인할 수 있습니다.

1. DBeaver에서 연결하고자 하는 데이터베이스를 우클릭합니다.
2. "Edit Connection"을 선택합니다.
3. "Driver Properties" 탭으로 이동합니다.

이곳에서 `allowPublicKeyRetrieval` 속성의 값을 확인할 수 있습니다.

## 해결 절차
우선 TLS 연결과 서버 인증서 검증을 설정하세요. 신뢰할 수 있는 내부 환경에서 공개 키 조회가 필요한 경우에만 `allowPublicKeyRetrieval`을 `true`로 변경하세요. 다음은 구체적인 해결 절차입니다.

1. DBeaver에서 연결하고자 하는 데이터베이스를 우클릭 후 "Edit Connection"을 선택합니다.
2. "Driver Properties" 탭으로 이동합니다.
3. `allowPublicKeyRetrieval` 속성의 값을 `TRUE`로 변경합니다.
4. 변경 사항을 저장한 후 다시 연결을 시도합니다.

아래는 설정 변경 예시입니다:

```plaintext
allowPublicKeyRetrieval = TRUE
```

## 흔한 실수
많은 사용자들이 `allowPublicKeyRetrieval` 설정을 변경한 후에도 여전히 문제가 발생한다고 보고합니다. 이는 다음과 같은 이유로 발생할 수 있습니다:
- 설정을 변경한 후 저장하지 않았거나, 다른 연결 설정에서 이 속성이 `false`로 설정되어 있을 수 있습니다.
- MySQL 서버의 SSL 설정이 잘못되어 있을 수 있습니다. TLS 연결과 인증서 설정이 올바른지 확인해야 합니다.

## 재발 방지 체크리스트
1. DBeaver의 연결 설정에서 항상 `allowPublicKeyRetrieval` 값을 확인합니다.
2. MySQL 서버의 SSL 설정을 점검합니다. 운영 환경에서는 암호화 연결을 유지하고 인증서 검증을 설정합니다.
3. DBeaver를 최신 버전으로 업데이트하여 최신 보안 패치를 적용합니다.
4. MySQL 서버의 설정 파일(my.cnf)에서 SSL 관련 설정을 주의 깊게 검토합니다.

이러한 절차를 통해 DBeaver에서 발생하는 'Public Key Retrieval is not allowed' 오류를 효과적으로 해결하고, 재발을 방지할 수 있습니다.

## 실무 적용 체크리스트

- DBeaver public key retrieval is not allowed 해결을 적용하기 전에 현재 운영 환경의 기준값과 예외 상황을 먼저 정리합니다.
- 변경 전후로 확인할 지표를 정하고, 문제가 생겼을 때 되돌릴 수 있는 절차를 문서화합니다.
- 한 번에 모든 서버나 서비스에 적용하기보다 작은 범위에서 검증한 뒤 점진적으로 확대합니다.
- 담당자, 확인 시간, 장애 판단 기준을 명확히 남겨 같은 문제가 반복될 때 빠르게 대응할 수 있게 합니다.

![DBeaver에서 발생하는 'Public Key Retrieval is not allowed' 오류 해결하기 안내 이미지](/images/posts/dbeaver에서-발생하는-public-key-retrieval-is-not-allowed-오류-해결하기-00-guide.svg)

## 참고한 자료

- [MySQL Connector/J security properties](https://dev.mysql.com/doc/connector-j/en/connector-j-connp-props-security.html)
