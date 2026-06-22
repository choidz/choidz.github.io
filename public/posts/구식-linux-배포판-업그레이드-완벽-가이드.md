# 구식 Linux 배포판 업그레이드 완벽 가이드

---

리눅스 서버나 개발 환경을 장기간 운영하다 보면, 어느 순간 OS 버전이 너무 오래되어 더 이상 보안 업데이트나 패키지 지원이 이루어지지 않는 순간이 옵니다.

이럴 때는 **운영체제를 업그레이드하거나 재설치하여 최신 버전으로 이동하는 과정** 이 꼭 필요합니다.

아래에서는 Ubuntu, Debian, Fedora, CentOS 계열에서 **안전하게 업그레이드하는 방법** 을 종합적으로 정리했습니다.

(※ 2025년 기준 최신 정보 및 보완사항 포함)

---

**✅ 업그레이드 전 필수 체크리스트**

업그레이드는 시스템에 큰 변화를 주므로 아래 기본 체크리스트를 꼭 수행하세요.

**✔ 1) 전체 데이터 백업**

백업 대상은 다음을 포함해야 합니다:

- /home : 사용자 파일 및 개인 설정
- /etc : 서비스·네트워크·시스템 설정
- /var/www : 웹 서비스 파일
- DB 데이터
- MySQL/MariaDB → mysqldump
- PostgreSQL → pg_dumpall
- /usr/local, /opt : 수동 설치 프로그램 및 커스텀 스크립트
- 설치된 패키지 목록

**✔ 2) 디스크 용량 확보**

업그레이드 중 패키지가 대량으로 다운로드되므로 최소 **5~10GB** 여유 권장.

**✔ 3) 안정적인 인터넷 연결**

특히 클라우드 환경에서는 패키지 다운로드 중 끊기면 업그레이드가 실패할 수 있습니다.

---

**🔒 백업 방법 (모든 배포판 공통)**

외장 드라이브 또는 마운트된 백업 경로(/mnt/backup)가 있다고 가정합니다.

**📌 rsync 백업 (권장)**

```
sudo rsync -aAXv --delete \
  --exclude={"/proc/*","/sys/*","/dev/*","tmp/*"} \
  /home/ /mnt/backup/home/

sudo rsync -aAXv /etc/ /mnt/backup/etc/
```

**📌 MySQL/MariaDB 전체 백업**

```
mysqldump -u root -p --all-databases > /mnt/backup/all-databases.sql
```

**📌 설치된 패키지 목록 저장**

Ubuntu/Debian:

```
dpkg --get-selections > package-list.txt
```

RHEL/Fedora 계열:

```
rpm -qa > installed-packages.txt
```

---

**🟦 Ubuntu 업그레이드 방법**

Ubuntu는 **버전을 건너뛰는 업그레이드를 지원하지 않습니다.**

예)

16.04 → 18.04 → 20.04 → 22.04 → 24.04 (순차 업그레이드)

**✔ 업그레이드 전 업데이트**

```
sudo apt update
sudo apt upgrade
sudo apt full-upgrade
sudo apt autoremove
```

**✔ 업그레이드 실행**

```
sudo do-release-upgrade
```

중간에 패키지를 유지할지/교체할지 물어보는 단계가 있으며, 완료 후 재부팅하면 종료됩니다.

---

**🟧 Debian 업그레이드 방법**

Debian은 Ubuntu보다 조금 더 수동적인 업그레이드를 요구합니다.

**✔ 1단계: 기존 버전을 최신화**

```
sudo apt update
sudo apt upgrade
sudo apt --without-new-packages upgrade
sudo apt full-upgrade
```

**✔ 2단계: APT 소스 수정**

아래 파일들을 **각각 개별로** 열어 수정합니다.

```
sudo nano /etc/apt/sources.list
sudo nano /etc/apt/sources.list.d/*.list
```

예: buster → bullseye, bullseye → bookworm

Bookworm 이후는 non-free-firmware 추가 필요:

```
deb https://deb.debian.org/debian/ bookworm main contrib non-free non-free-firmware
```

**✔ 3단계: 패키지 새 버전 업데이트**

```
sudo apt clean
sudo apt update
sudo apt upgrade
sudo apt full-upgrade
```

**✔ 4단계: 정리 & 재부팅**

```
sudo apt autoremove
sudo reboot
```

---

**🟥 Fedora 업그레이드 방법**

Fedora는 DNF 기반의 매우 깔끔한 업그레이드 시스템을 갖추고 있습니다.

**✔ 1) 최신 상태로 업데이트**

```
sudo dnf upgrade --refresh
sudo reboot
```

**✔ 2) 새 릴리스 패키지 다운로드**

(예: 40 버전으로 업그레이드)

```
sudo dnf system-upgrade download --releasever=40
```

**✔ 3) 업그레이드 시작**

```
sudo dnf system-upgrade reboot
```

**✔ SELinux 레이블 재적용 필요할 수 있음**

업그레이드 후 아래 명령을 추가하면 시스템 안정성 증가:

```
sudo touch /.autorelabel
sudo reboot
```

---

**🟫 CentOS / Rocky / AlmaLinux 업그레이드 방법**

이 계열은 “메이저 버전 간 직접 업그레이드(in-place upgrade)”가 공식적으로 안정적이지 않습니다.

예:

8.x → 9.x (직업 업그레이드 불가, 재설치 권장)

ELevate(Leapp 기반)라는 업그레이드 도구는 존재하나

**100% 호환 보장 X** ,

특히 프로덕션 서버에서는 추천되지 않습니다.

**🔥 결론: 백업 → 새 설치 → 데이터 복원이 가장 안전**

**절차 요약:**

1. 전체 데이터 백업
2. 새 버전 OS 클린 설치
3. 사용자 계정/서비스 재생성
4. 웹 데이터·DB 복원
5. DNS/서비스 설정 다시 반영

---

**📌 정리: 어떤 배포판을 사용하든 백업이 가장 중요!**

💡 업그레이드는 절대 부담 가질 필요 없습니다.

**충분한 사전 백업과 계획만 있으면 안전하게 진행** 할 수 있습니다.

- Ubuntu → do-release-upgrade
- Debian → sources.list 변경 후 full-upgrade
- Fedora → system-upgrade
- RHEL 계열 → 재설치가 가장 확실

[원문 보기](https://blog.naver.com/choidz_/224077763587?fromRss=true&trackingCode=rss)
