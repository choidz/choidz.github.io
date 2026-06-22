# [리눅스] Jenkins 서버 OS 업그레이드 대비 이관 작업 완벽 정리

---

기업 환경에서 리눅스 서버 OS 업그레이드를 진행할 때,

기존에 운영 중인 Jenkins 서비스를 새로운 서버로 안전하게 이전하는 절차를 정리했습니다.

---

**📍 Jenkins 서버 이관이 왜 중요할까?**

- OS 업그레이드 과정에서 기존 프로그램이나 서비스가 제대로 작동하지 않거나, 경우에 따라 삭제/손상될 수 있습니다.
- 특히 Jenkins는 개발 자동화의 중심 서비스이기 때문에, **완벽한 사전 준비와 데이터 보존** 이 필수입니다. 💡
- 사전 이관 + 테스트 → 실제 업그레이드 당일 최소 다운타임으로 이전 완료 → 안정적인 재가동을 보장할 수 있습니다.

---

**🔎 Jenkins 서버 구성 이해하기**

Jenkins를 구성하는 핵심 요소는 아래와 같습니다:

> 🔑 요약: 이 두 경로만 제대로 복제/복사해주면, Jenkins를 “그대로” 새 서버에서 복제할 수 있습니다.

---

**🚦 이관 시나리오: 운영 서버 → 신규 서버 (경로 동일)**

- 경로 구조를 동일하게 맞춘 후 rsync를 이용해 복제
- SSH 접속이 가능해야 함

이전 절차는 다음과 같이 크게 두 단계로 나뉩니다.

---

**🛠️ 1차 사전 이관 (서비스 중지 없이 가능)**

✅ 신규 서버에서 실행:

```
rsync -avz devuser@운영서버:/var/lib/jenkins /var/lib/jenkins
rsync -avz devuser@운영서버:/usr/lib/jenkins/ /usr/lib/jenkins/
```

- 목적: 기본 데이터와 파일 구조를 미리 복사
- 서비스 중단 없이 진행 가능 → 신규 서버에서 사전 점검 가능

---

**🔥 최종 이관 (다운타임) — OS 업그레이드 당일**

1. 운영 서버에서 Jenkins / Tomcat 종료
2. /usr/lib/jenkins/bin/shutdown.sh
3. 최신 데이터 다시 동기화 (1차와 동일한 rsync 명령)

```
rsync -avz devuser@운영서버:/var/lib/jenkins /var/lib/jenkins
rsync -avz devuser@운영서버:/usr/lib/jenkins/ /usr/lib/jenkins/
```

4\. 신규 서버에서 Jenkins 기동

5\. /usr/lib/jenkins/startup.sh

→ 이렇게 하면 서비스 중단 최소화 한 채로 이관 완료

---

**👀 서비스 기동 후 점검 항목**

- 새 서버에 접속: http://신규서버:포트/jenkins
- 아래 항목 확인:
- Jenkins Job 목록 정상 표시 여부
- Plug-in 정상 로드 여부
- 사용자 계정 / 권한 설정 유지 여부
- 빌드 이력(History) 유지 여부
- 실제 빌드 수행 테스트 (실제 Job 실행)

---

**🧨 실수 방지 팁 & 주의사항**

- **\--dry-run** 옵션으로 먼저 테스트 가능

```
rsync -avz --dry-run devuser@운영서버:/var/lib/jenkins /var/lib/jenkins
```

- **rsync 경로 끝에 / 붙이는 것 주의**
- /var/lib/jenkins : 폴더 안의 내용만 복사 ⇒ 추천
- /var/lib/jenkins (끝 / 없음) : jenkins 폴더가 한 번 더 생성될 수 있어 주의
- 가능하다면, 소유권(uid/gid) 및 권한(permission) 유지하며 복사 (rsync 기본 -a 옵션은 이를 보장) [docs.cloudbees.com+1](<https://docs.cloudbees.com/docs/cloudbees-ci-kb/latest/client-and-managed-controllers/how-to-correctly-copy-jenkins-directories-from-the-command-line?utm_source=chatgpt.com>)
- 만약 credential, 사용자 정보, 플러그인 설정 등이 있다면 $JENKINS_HOME 전체를 복사해야 함. 이 안에 users, secrets, plugins 등이 포함됨 [Stack Overflow+2Jenkins+2](<https://stackoverflow.com/questions/56075915/how-to-copy-jenkins-users-to-another-server?utm_source=chatgpt.com>)

---

**🧩 추가 구성(DB, Cassandra, 외부 연동 등)이 있을 경우**

- Jenkins 기본 기능만 사용하는 경우는 $JENKINS_HOME + 실행환경만으로 충분
- 그러나 DB, Cassandra, 외부 데이터 연동 구성 등이 있다면
- 해당 데이터베이스나 외부 저장소 구성도 함께 이관 또는 재구성이 필요
- 단순 파일 복사만으로는 되지 않으므로 주의를 기울일 것

---

**🔔 체크리스트 (예: 표로 저장 후 내부 공유용으로 사용)**

> ✅ 이 표를 문서화해 두면, OS 업그레이드 일정 협업 및 팀 간 커뮤니케이션에 유용합니다.

---

**​**

[원문 보기](https://blog.naver.com/choidz_/224101741575?fromRss=true&trackingCode=rss)
