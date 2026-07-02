# cannot allocate memory 오류의 원인과 해결 방법

---

## 증상 및 오류 메시지

'cannot allocate memory' 오류는 시스템에서 메모리를 할당할 수 없을 때 발생하는 메시지입니다. 이는 다양한 상황에서 나타날 수 있으며, 주로 프로그램이 필요한 메모리를 확보하지 못할 때 발생합니다. 예를 들어, Python을 사용하여 멀티프로세싱을 구현할 때 다음과 같은 오류 메시지가 출력될 수 있습니다:

![참고 이미지](/images/posts/cannot-allocate-memory-오류의-원인과-해결-방법-01-482a117d.png)

<small>이미지 출처: https://hsti.tistory.com/94</small>

```
Traceback (most recent call last):
  File "example.py", line 10, in <module>
    process = multiprocessing.Process(target=some_function)
  File ".../multiprocessing/process.py", line 123, in __init__
    self._popen = self._Popen(self)
  File ".../multiprocessing/context.py", line 222, in _Popen
    return _default_context.get_context().Process._Popen(process_obj)
  File ".../multiprocessing/popen_fork.py", line 19, in __init__
    self._execute_child(args, executable, preexec_fn, close_fds, 
OSError: [Errno 12] Cannot allocate memory
```

이와 같은 오류는 시스템의 메모리 사용량이 한계에 도달했거나, 메모리 오버커밋 설정이 잘못되어 있을 때 발생할 수 있습니다.

## 원인 분석

이 오류의 주요 원인은 다음과 같습니다:
1. **물리적 메모리 부족**: 시스템의 RAM이 부족하여 프로세스가 필요한 메모리를 할당할 수 없는 경우입니다.
2. **스왑 공간 부족**: 스왑 공간이 부족하면 메모리 할당에 실패할 수 있습니다.
3. **오버커밋 정책**: Linux의 메모리 오버커밋 설정이 비효율적으로 되어 있을 경우에도 이 오류가 발생할 수 있습니다. 기본적으로 Linux는 메모리를 과도하게 할당할 수 있지만, 특정 설정에 따라 제한될 수 있습니다.

이러한 원인을 확인하기 위해 다음 명령어를 사용할 수 있습니다:

```bash
free -h
```

이 명령어는 현재 시스템의 메모리 사용량을 보여줍니다. 또한, 스왑 공간을 확인하기 위해 다음 명령어를 사용할 수 있습니다:

```bash
swapon --show
```

## 해결 절차

이 오류를 해결하기 위한 절차는 다음과 같습니다:
1. **메모리 및 스왑 공간 확인**: 위에서 설명한 명령어를 사용하여 현재 메모리와 스왑 공간을 확인합니다. 만약 메모리가 부족하다면, 불필요한 프로세스를 종료하거나 스왑 공간을 늘려야 합니다.

2. **스왑 공간 추가**: 스왑 공간을 추가하려면 다음 명령어를 사용합니다:

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

이 명령어는 2GB의 스왑 파일을 생성하고, 이를 활성화합니다. 스왑 파일을 추가한 후에는 다음 명령어로 확인할 수 있습니다:

```bash
swapon --show
```

3. **오버커밋 정책 수정**: 시스템의 오버커밋 정책을 수정하여 메모리 할당 문제를 해결할 수 있습니다. `/etc/sysctl.conf` 파일을 열고 다음 라인을 추가합니다:

```bash
vm.overcommit_memory=1
```

그 후 다음 명령어로 설정을 적용합니다:

```bash
sudo sysctl -p
```

## 흔한 실수 및 재발 방지 체크리스트

이 오류를 방지하기 위해 다음과 같은 체크리스트를 고려해야 합니다:
- [ ] 시스템의 메모리 및 스왑 공간을 정기적으로 모니터링한다.
- [ ] 불필요한 프로세스를 종료하여 메모리 사용량을 줄인다.
- [ ] 오버커밋 정책을 적절히 설정하여 메모리 할당을 효율적으로 관리한다.
- [ ] 메모리 부족 경고를 설정하여 사전에 문제를 인지할 수 있도록 한다.

이러한 절차를 통해 'cannot allocate memory' 오류를 예방하고, 시스템의 안정성을 높일 수 있습니다.

## 실무 적용 체크리스트

- cannot allocate memory 원인과 해결을 적용하기 전에 현재 운영 환경의 기준값과 예외 상황을 먼저 정리합니다.
- 변경 전후로 확인할 지표를 정하고, 문제가 생겼을 때 되돌릴 수 있는 절차를 문서화합니다.
- 한 번에 모든 서버나 서비스에 적용하기보다 작은 범위에서 검증한 뒤 점진적으로 확대합니다.
- 담당자, 확인 시간, 장애 판단 기준을 명확히 남겨 같은 문제가 반복될 때 빠르게 대응할 수 있게 합니다.

![참고 이미지](/images/posts/cannot-allocate-memory-오류의-원인과-해결-방법-00-c8e47e42.png)

<small>이미지 출처: https://namki-learning.tistory.com/46</small>

## 운영 중 자주 놓치는 부분

#Linux 영역에서는 설정 자체보다 운영 중에 남는 기록과 점검 루틴이 더 중요합니다. 처음에는 정상처럼 보이더라도 트래픽이 늘거나 배포 주기가 빨라지면 작은 누락이 장애로 이어질 수 있습니다. 그래서 로그, 알림, 대시보드, 변경 이력을 함께 확인하고 실제 장애 대응 과정에서 필요한 정보가 빠지지 않았는지 주기적으로 점검해야 합니다.

---

## 참고한 자료

- [python can not allocate memory 문제](https://namki-learning.tistory.com/46)
- [JVM Cannot allocate memory 에러 해결](https://hsti.tistory.com/94)
