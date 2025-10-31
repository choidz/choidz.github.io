# 운영자가 꼭 알아야 할 Zabbix 핵심

---

**Zabbix 정리 (개념 → 설치 → 템플릿/알림 실무)**
> 오픈소스 통합 모니터링 솔루션 **Zabbix**.
> 이 글에서는 **모니터링 목적 → Zabbix 구성/설치 → 템플릿/알림 실무** 까지 핵심만 담았습니다.
\--- 
**1\. 서버 모니터링의 목적**
  * **장애 예방** : 지속 관찰로 잠재 이슈 조기 발견 → 가용성 향상
  * **성능 최적화** : 추적/분석으로 병목 식별 및 개선
  * **자원 관리** : CPU/메모리/디스크 사용량 관제
  * **보안 감시** : 비정상 행위·침입 시도 탐지
  * **용량 계획** : 추세 기반 증설/정리로 장애 예방

\--- 
**2\. Zabbix란?**
  * **정의** : IT 인프라 전반을 실시간 모니터링/알림/시각화하는 **오픈소스** 솔루션
  * **구성 요소**

  1. **Zabbix 서버** : 수집·판단의 핵심
  2. **Zabbix 에이전트** : 대상 서버에서 메트릭 전송
  3. **DB** : 메트릭·설정 저장 (MySQL/MariaDB 등)
  4. **프론트엔드** : 웹 UI(KPI/대시보드/알림 확인)

  * **장점** : 오픈소스, 통합 모니터링, 확장성, 세밀한 임계치/알림, 강력한 시각화
  * **Tip** : 리눅스 접속은 ssh(예: MobaXterm, 터미널) 사용

\--- 
**3\. 기본 포트 & 네트워크**
> ✅ 정답 요약
> **Zabbix Server** : 10051/tcp (수신)
> **Zabbix Agent** : 10050/tcp (서버가 에이전트에 질의)
> **Frontend(Web)** : 일반적으로 80/443 (또는 8080 환경)
> 방화벽/보안그룹에 위 포트를 **열어야 통신/알림 정상 동작** 합니다.
\--- 
**4\. Zabbix 서버 설치(개념) + 설정 포인트**
  * **DB** : MySQL/MariaDB 권장
  * **서버 설정 파일** : /etc/zabbix/zabbix_server.conf

**주요 항목**
  * DBHost / DBName / DBUser / DBPassword / DBPort(3306)
  * ListenPort=10051
  * LogFile / PidFile
  * Timeout
  * Poller/Trapper/캐시: StartPollers, StartTrappers, CacheSize, HistoryCacheSize, TrendCacheSize, ValueCacheSize

> **튜닝 힌트**
> **수집량↑** → StartPollers 증가
> **이력 많음** → HistoryCacheSize/TrendCacheSize 확대
> **비교 연산 많음** → ValueCacheSize 확대
\--- 
**5\. 모니터링 대상 서버(호스트) & 에이전트**
  * **에이전트 설정** : /etc/zabbix/zabbix_agentd.conf

**핵심 키**
  * Server=<Zabbix_Server_IP> (Passive 허용 목록)
  * ServerActive=<Zabbix_Server_IP> (Active 모드)
  * Hostname=<호스트이름>
  * ListenPort=10050
  * LogFile
  * EnableRemoteCommands (필요 시)
  * UnsafeUserParameters (사용자 파라미터 허용)
  * Include (추가 conf)

> 서버 측 방화벽에서 **10050(Agent), 10051(Server)** 체크!
\--- 
**6\. 프론트엔드 초기 설정 & 템플릿 구조**
  * 접속: http://<Zabbix_Server_IP>:80 (또는 8080 환경)
  * **DB Connection** : Type=MySQL, Host=localhost, Port=3306, Name/User/Password 일치

**핵심 개념**
  * **호스트 그룹** : 서버 묶음
  * **템플릿** : **아이템(Item)+트리거(Trigger)+매크로** 묶음
  * **아이템** : 수집 대상(예: CPU Load)
  * **트리거** : 임계치 논리식(경고/심각 등 심각도)
  * **액션** : 트리거 발생 시 알림/스크립트 실행

> 템플릿 사용: **기본 템플릿 사용 / 직접 제작 / 외부 Import** 후 **호스트에 링크**
\--- 
**7\. 메신저 연동(알림 채널)**
**흐름** : 토큰 발급 → Zabbix 서버/미디어타입 등록 → 사용자에 미디어 연결
  * 프론트엔드: Administration → Media types
  * 사용자별: Users → Media
  * 예) LINE/Slack/Email 등

\--- 
**8\. 알림 설정 실무 (디스크/CPU/메모리/포트)**
> 절차: **애플리케이션 → 아이템 → 트리거 → 액션 → 오퍼레이션**
**(1) 애플리케이션**
  * Template OS Linux 기준 새 **애플리케이션** 생성
  * 이름 예: Filesystem, CPU, Memory, PORT

**(2) 아이템(Item)**
  * **예시**
  * Disk usage / : vfs.fs.size[/.pused]
  * CPU usage : system.cpu.util[.user]
  * Memory usage : memory.usage.percentage _(사용자 파라미터 필요)_
  * Port 80 : net.tcp.port[IP,80]
  * **공통 권장 설정**
  * 데이터형: Numeric(float) / 단위: % / 갱신: 1m / 히스토리: 90d / 트렌드: 365d

**메모리 사용자 파라미터**
UserParameter=memory.usage.percentage, free -m | awk 'NR==2{printf "%.2f", $3*100/$2}'
> zabbix_agentd.conf에 추가 → 에이전트 재시작
**(3) 트리거(Trigger)**
  * **Disk** : {Template OS Linux:vfs.fs.size[/.pused].last()} > 30
  * **CPU** : {Template OS Linux:system.cpu.util[.user].avg(1m)} > 20
  * **Memory** : {Template OS Linux:memory.usage.percentage.last()} > 20
  * **Port** : {Template OS Linux:net.tcp.port[IP,80].last()} = 0
  * 심각도: 경고/심각 적절히 지정

**(4) 액션(Action)**
  * **조건** : 트리거=선택, 심각도≥경고, 계산=AND
  * **오퍼레이션** :
  * 간격: 1m / 종류: 메시지 송신 / 스텝: 무한
  * 사용자 그룹/미디어: (예: 운영팀, LINE·Email)
  * **Custom message** 사용

**장애 알림 예시**
장애발생 - {HOST.NAME} {TRIGGER.STATUS} {TRIGGER.NAME} 시간: {EVENT.TIME} / 호스트: {HOST.NAME} / IP: {HOST.IP} 값: {ITEM.LASTVALUE} / 상태: {TRIGGER.STATUS} 
**복구 알림 예시**
해결됨 - {HOST.NAME} {TRIGGER.STATUS} {TRIGGER.NAME} 해결시간: {EVENT.RECOVERY.TIME} / 호스트: {HOST.NAME} / IP: {HOST.IP} 최종값: {ITEM.LASTVALUE} / 상태: {TRIGGER.STATUS} 
\--- 
**9\. (부록) AWS EC2로 실습 환경 만들기**
**1) EC2 생성**
  * AMI: **Amazon Linux 2023 (amzn2023-x86_64)**
  * 타입: t2.micro
  * 키페어 생성(예: mykey.pem)
  * 보안그룹: **22(SSH)** , **80/443(Web)** , **10050/10051(Zabbix)** 열기

**2) SSH 접속 & 기본 준비**
chmod 400 mykey.pem ssh -i mykey.pem ec2-user@<EC2_PUBLIC_IP> sudo dnf update -y sudo dnf install -y vim git wget curl net-tools lsof 
**기본 경로**
  * 홈: /home/ec2-user
  * 설정: /etc/
  * 로그: /var/log/

\--- 
**10\. 체크리스트 & 트러블슈팅**
  * 방화벽/보안그룹에 **10050/10051/80(또는 8080)/443** 열림
  * zabbix_server.conf DB 정보 정확
  * 에이전트 Server/ServerActive/Hostname 일치
  * 사용자 파라미터 추가 후 **에이전트 재시작**
  * 트리거 임계치·알림 경로(미디어) 테스트 발송 확인

**자주 겪는 이슈**
  * **UNSUPPORTED item** : 키/권한/사용자 파라미터 경로 확인
  * **알림 미수신** : 액션 조건/미디어/사용자 그룹 매핑 확인
  * **성능 저하** : Poller/캐시 사이즈·DB 인덱스 점검

\--- 
**✅ 한눈 요약**
``` | | 영역 | | | 핵심 포인트 | | | 목적 | | | 장애 예방·성능 최적화·보안·용량계획 | | | 구조 | | | 서버·에이전트·DB·프론트엔드 | | | 포트 | | | Server=10051 | , | Agent=10050 | , | Web=80/443(또는 8080) | | | 설치 | | | DB·서버 conf 튜닝(캐시/폴러) | | | 실무 | | | 템플릿→아이템→트리거→액션→오퍼레이션 | | | 알림 | | | 미디어 타입·사용자별 매핑, 커스텀 메시지 | | | 팁 | | | 사용자 파라미터로 커버리지 확장(메모리 등) | | ``` 
**​**

[원문 보기](https://blog.naver.com/choidz_/224059752172?fromRss=true&trackingCode=rss)
