# no space left on device 오류 해결 방법

---

## 증상

리눅스 환경에서 작업을 진행하다 보면, 종종 'no space left on device'라는 오류 메시지를 접할 수 있습니다. 이 오류는 시스템의 디스크 공간이 부족할 때 발생하며, 파일을 생성하거나 수정할 수 없게 됩니다. 예를 들어, 도커 컨테이너를 실행하거나 이미지 빌드를 시도할 때 해당 오류가 발생할 수 있습니다. 다음과 같은 메시지를 확인할 수 있습니다:

![프로필사진](/images/posts/no-space-left-on-device-오류-해결-방법-00-ce9ccaf9.jpg)

<small>이미지 출처: https://happindex.tistory.com/45</small>

```
Error response from daemon: no space left on device
```

이 오류가 발생하면, 시스템의 정상적인 운영에 큰 지장을 초래할 수 있습니다. 따라서 이 문제를 빠르게 해결하는 것이 중요합니다.

## 원인

'no space left on device' 오류가 발생하는 주된 원인은 다음과 같습니다:
1. **디스크 용량 부족**: 사용 중인 파일 시스템의 디스크 용량이 가득 차서 새로운 파일을 생성할 수 없는 경우입니다.
2. **inode 부족**: 파일 시스템에서 사용 가능한 inode가 부족하여 새로운 파일을 생성할 수 없는 경우도 있습니다. inode는 파일의 메타데이터를 저장하는 데이터 구조로, 파일 수가 많을 경우 inode가 부족할 수 있습니다.

![참고 이미지](/images/posts/no-space-left-on-device-오류-해결-방법-01-12df94cb.png)

<small>이미지 출처: https://kairos-chan.tistory.com/entry/AWS-EC2-No-space-left-on-device-%EC%A6%9D%EC%83%81-%ED%95%B4%EA%B2%B0</small>

디스크 용량 부족은 주로 오래된 로그 파일, 캐시 파일, 사용하지 않는 도커 이미지 등이 쌓여서 발생합니다.

## 확인 명령어

문제를 진단하기 위해 다음 명령어를 사용하여 디스크 사용량과 inode 상태를 확인할 수 있습니다:

1. **디스크 용량 확인**:
   ```bash
   df -h
   ```
   이 명령어는 각 파일 시스템의 사용량과 남은 공간을 보여줍니다.

2. **inode 사용량 확인**:
   ```bash
   df -i
   ```
   이 명령어는 inode의 사용량과 남은 수치를 확인할 수 있습니다.

## 해결 절차

### 1. 디스크 용량 정리하기

디스크 용량이 부족한 경우, 불필요한 파일을 삭제하여 공간을 확보해야 합니다. 다음과 같은 방법으로 정리할 수 있습니다:

- **도커 이미지 정리**:
   사용하지 않는 도커 이미지를 정리하여 공간을 확보할 수 있습니다. 다음 명령어를 사용하세요:
   ```bash
   docker image prune -a
   ```
   이 명령어는 사용되지 않는 모든 도커 이미지를 삭제합니다.

- **로그 파일 삭제**:
   오래된 로그 파일을 삭제하여 공간을 확보할 수 있습니다. 예를 들어, 다음 명령어로 특정 로그 파일을 삭제할 수 있습니다:
   ```bash
   sudo rm /var/log/old-log-file.log
   ```

### 2. inode 정리하기

inode가 부족한 경우, 사용하지 않는 파일을 삭제하여 inode를 확보해야 합니다. 예를 들어, 다음 명령어로 불필요한 파일을 삭제할 수 있습니다:
```bash
find /path/to/directory -type f -name '*.tmp' -delete
```
이 명령어는 특정 디렉토리 내의 모든 .tmp 파일을 삭제합니다.

### 3. 디스크 용량 증설

디스크 용량이 부족하여 정리가 불가능한 경우, 디스크 용량을 증설할 수 있습니다. AWS EC2 인스턴스의 경우, 다음과 같은 절차로 디스크를 증설할 수 있습니다:
1. AWS 관리 콘솔에서 EC2 대시보드로 이동합니다.
2. 인스턴스를 선택하고, '볼륨' 탭에서 해당 볼륨을 선택합니다.
3. 'Modify Volume'을 클릭하여 볼륨 크기를 늘립니다.
4. 인스턴스에 접속하여 다음 명령어로 파티션을 확장합니다:
   ```bash
   sudo growpart /dev/xvda 1
   sudo xfs_growfs /
   ```

## 재발 방지 체크리스트

- **정기적인 디스크 사용량 모니터링**: 주기적으로 `df -h`와 `df -i` 명령어를 통해 디스크 사용량과 inode 상태를 확인합니다.
- **불필요한 파일 정리**: 주기적으로 로그 파일, 캐시 파일 등을 정리하여 디스크 공간을 확보합니다.
- **도커 이미지 관리**: 도커 이미지를 주기적으로 정리하여 불필요한 이미지를 삭제합니다.
- **자동화 스크립트 작성**: 정기적으로 디스크 정리를 수행하는 스크립트를 작성하여 자동화합니다.

이와 같은 방법으로 'no space left on device' 오류를 예방하고, 시스템의 안정성을 유지할 수 있습니다.

---

## 참고한 자료

- [no space left on device 해결](https://yunju0u0.tistory.com/45)
- ['No such file or directory' 또는 'No space left on device' 에러](https://ebt-forti.tistory.com/466)
- [[EC2\] no space left on device](https://jangcenter.tistory.com/142)
- [[Docker\] Error response from daemon : no space left on device 에러 해결하기](https://happindex.tistory.com/45)
- [[AWS EC2\] No space left on device 증상 해결](https://kairos-chan.tistory.com/entry/AWS-EC2-No-space-left-on-device-%EC%A6%9D%EC%83%81-%ED%95%B4%EA%B2%B0)
