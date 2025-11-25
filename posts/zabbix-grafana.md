# Zabbix 데이터를 Grafana로 예쁘게 시각화하기 - 설치부터 연동까지

---

**서버 모니터링을 하다 보면 Zabbix의 기본 대시보드가 좀 아쉬울 때가 있어요. 기능은 충분하지만 UI가 정적이고, 한눈에 들어오는 시각화가 부족하다고 느껴지죠? 이런 고민을 해결해주는 게 바로****Grafana**

**이 글에서는 Grafana가 뭔지부터 시작해서, Zabbix와 연동하는 전체 과정까지 단계별로 살펴보겠습니다. 실제 설치 명령어와 설정 방법도 함께 담았으니, 따라하면서 자신의 모니터링 환경에 바로 적용할 수 있을 거예요.**

---

**💡 먼저 알아두면 좋은 것들**

**📌 Grafana란?****Grafana는 Grafana Labs에서 개발한 오픈 소스 모니터링 및 시각화 플랫폼입니다. 다양한 데이터 소스(Zabbix, Prometheus, InfluxDB 등)에서 메트릭을 가져와 한 곳에서 통합적으로 관리하고 시각화할 수 있어요. Zabbix의 정적인 UI를 보완하기에 정말 좋은 도구랍니다.**

**🎯 Grafana의 주요 특징:**

  * **다양한 시각화 옵션****\- Time chart, Table, Gauge Chart, History Table 등 원하는 형태로 데이터를 표현할 수 있습니다.**

  * **동적 대시보드****\- 한번 만든 위젯을 재사용하거나 템플릿으로 저장해 여러 대시보드에서 활용 가능합니다.**

  * **강력한 쿼리 기능****\- ad-hoc 쿼리와 dynamic drilldown으로 수집된 데이터를 깊이 있게 분석할 수 있습니다.**

  * **알림 기능****\- 중요 메트릭에 대해 시각적 알람을 설정하고, Slack, PagerDuty 등으로 자동 알림을 받을 수 있습니다.**

  * **다중 데이터 소스 지원****\- 여러 데이터 소스의 데이터를 합산하거나 비교 분석할 수 있습니다.**

**이제 실제로 Grafana를 설치하고 Zabbix와 연동해보겠습니다.**

---

**⚙️ Grafana 설치하기**

**Grafana 설치는 생각보다 간단해요. 공식 저장소를 추가하고 패키지 매니저로 설치하면 됩니다. 여기서는 Ubuntu 24.04 LTS 환경을 기준으로 설명하겠습니다.**

**1단계: 시스템 패키지 업데이트**

**먼저 시스템 패키지를 최신 상태로 업데이트합니다.**

**2단계: 필수 패키지 설치**

**Grafana 설치를 위해 필요한 도구들을 먼저 설치합니다.**

**각 패키지의 역할을 간단히 설명하자면:**

  * **software-properties-common****\- 소프트웨어 저장소를 쉽게 관리해주는 도구입니다. Grafana의 공식 APT 저장소를 시스템에 추가할 때 필요합니다.**

  * **curl****\- 인터넷에서 파일을 다운로드할 때 사용합니다. Grafana의 GPG 키를 받아올 때 필요하죠.**

  * **gnupg2****\- GPG 키를 관리하고 검증하는 도구예요. 다운로드한 패키지가 정말 Grafana 공식에서 만든 게 맞는지 확인하는 데 사용됩니다.**

**3단계: GPG 키 추가 및 저장소 등록**

**Grafana의 공식 저장소를 신뢰할 수 있는 출처로 등록합니다.**

**이제 Grafana 저장소를 APT 소스 리스트에 추가합니다.**

**4단계: Grafana 설치 및 서비스 시작**

**이제 저장소가 등록되었으니 Grafana를 설치할 수 있습니다.**

**설치가 완료되면 Grafana 서비스를 시작하고 부팅 시 자동으로 시작되도록 설정합니다.**

**정리하자면, GPG 키 검증을 통해 안전하게 공식 저장소에서 Grafana를 설치하고, 서비스로 등록해서 항상 실행되도록 만드는 거예요.**

---

**🌐 Grafana 웹 접속 및 초기 설정**

**Grafana 설치가 완료되면 웹 브라우저에서 접속할 수 있습니다. 웹 브라우저를 열고 다음 주소로 접속하세요.**

**처음 접속하면 로그인 화면이 나타납니다. 기본 계정 정보는 다음과 같습니다.**

  * **ID:****admin**

  * **패스워드:****admin**

**Grafana 로그인 화면**

**처음 로그인하면 비밀번호 변경을 요청받습니다. 보안을 위해 새로운 비밀번호로 변경해주세요. 이후 Grafana 대시보드에 접속하게 됩니다.**

[ ![](https://mblogthumb-phinf.pstatic.net/MjAyNTExMjVfMjg5/MDAxNzYzOTk4MDUzOTE5.YkI9yfVW2dcO4YZmzlbkjBXwTIKHNiaUBXSnS7z0ZDcg.-QyZ6E-l5pIDDBDE1ueF3KVA1xMg5z5bM_sOOuoZLH0g.PNG/img_000_b968a32d.png?type=w80_blur) ](<#>)

---

**🔗 Zabbix 플러그인 설치 및 활성화**

**Grafana에서 Zabbix 데이터를 사용하려면 Zabbix 플러그인을 설치해야 합니다. Grafana 서버에 SSH로 접속해서 다음 명령어를 실행하세요.**

**플러그인 설치가 완료되면 Grafana를 재시작합니다. 재시작 후 웹 인터페이스에서 플러그인을 활성화해야 합니다.**

**플러그인 활성화 단계:**

  1. **Grafana 웹 인터페이스에서 좌측 메뉴의****Administration**

  2. **Plugins and data****→****Plugins**

  3. **검색창에 "zabbix"를 입력해서 Zabbix 플러그인을 찾습니다.**

  4. **플러그인을 클릭하고****Enable****버튼을 눌러 활성화합니다.**

[ ![](https://mblogthumb-phinf.pstatic.net/MjAyNTExMjVfMjY4/MDAxNzYzOTk4MDU5NTk5.G-9csWJ1FZPrNx-wYGshYyRrfNYpBgAqO4T3_CkmEfYg.ivrdS2TL3orLQXjhBC3zt5p-v2qCRsy_qNDp8UqlOXcg.PNG/img_001_7c7e813d.png?type=w80_blur) ](<#>)

**Zabbix 플러그인 활성화 화면**

**Enable 버튼이 Disable로 변경되면 플러그인이 정상적으로 활성화된 것입니다.**

---

**🔐 Zabbix 데이터 소스 추가하기**

**이제 Grafana가 Zabbix 서버에서 데이터를 가져올 수 있도록 데이터 소스를 설정해야 합니다. 이 과정이 Zabbix와 Grafana를 연결하는 핵심이에요.**

**데이터 소스 추가 절차:**

  1. **Grafana 웹 인터페이스 좌측 메뉴에서****Connections**

  2. **Data sources**

  3. **Add data source****버튼을 클릭합니다.**

  4. **데이터 소스 목록에서 "zabbix"를 검색해서 선택합니다.**

[ ![](https://mblogthumb-phinf.pstatic.net/MjAyNTExMjVfMjA1/MDAxNzYzOTk4MDY0MTU4.8QilyvyHMHRIk86m1a8FXlHLFa4PoUYqSuFJZ25ip_4g.vHbzdnJ-id4Ja5bPRyVzRGkqq7-hXBlDKEOidBkkDOMg.PNG/img_002_f3e00d4c.png?type=w80_blur) ](<#>)

**데이터 소스 추가 화면**

**Zabbix 데이터 소스를 선택하면 설정 화면이 나타납니다. 여기서 Zabbix 서버의 정보를 입력해야 합니다.**

[ ![](https://mblogthumb-phinf.pstatic.net/MjAyNTExMjVfMjA1/MDAxNzYzOTk4MDY3NTY5.t29VYvGjd05vculrp0RfMF4pYxzCNrslCxnlv784W-cg.7UUODEmeRoI4tEUWGXP87Zl5S_wdO4sILWLo5oSxy6kg.PNG/img_003_0a473620.png?type=w80_blur) ](<#>)

**Zabbix 데이터 소스 설정 화면**

**필수 입력 항목:**

  * **URL****\- Zabbix 서버의 웹 인터페이스 주소 (예: http://zabbix-server-ip/zabbix)**

  * **Username****\- Zabbix 관리자 계정 (기본값: Admin)**

  * **Password****\- Zabbix 관리자 비밀번호**

**모든 정보를 입력한 후****Save & test****버튼을 클릭합니다. 연결이 성공하면 "Data source is working" 메시지가 표시됩니다.**

[ ![](https://mblogthumb-phinf.pstatic.net/MjAyNTExMjVfOTMg/MDAxNzYzOTk4MDczMzE1.a0LT3EZzSYbTlRhTbLIS3otXVtqKTRE_tRL8RW3l9p8g.S5nmVpkPu4aTlM6Z5Avz0foX2phabsg7lBQiEP89SvAg.PNG/img_004_19aef74d.png?type=w80_blur) ](<#>)

**Zabbix 데이터 소스 연결 확인**

**정리하자면, Zabbix 서버의 URL과 계정 정보를 입력해서 Grafana가 Zabbix에 접근할 수 있도록 허가하는 거예요. 이렇게 하면 Zabbix에서 수집한 모든 데이터를 Grafana에서 활용할 수 있게 됩니다.**

---

**📈 대시보드 구성하기**

**데이터 소스 연결이 완료되면 이제 대시보드를 만들 차례입니다. Grafana는 처음부터 만들 수도 있지만, 커뮤니티에서 공유하는 템플릿을 사용하면 훨씬 빠르고 쉬워요.**

**템플릿 대시보드 사용하기:**

**Grafana 커뮤니티에서는 다양한 대시보드 템플릿을 무료로 제공합니다. 이를 활용하면 시간을 절약할 수 있어요.**

  1. **Grafana Dashboards**

  2. **검색창에 "zabbix"를 입력해서 원하는 대시보드를 찾습니다.**

  3. **마음에 드는 대시보드를 선택하고****Dashboard ID****를 복사합니다.**

  4. **Grafana 웹 인터페이스에서****Dashboards****→****New****→****Import**

  5. **복사한 Dashboard ID를 입력하고****Load**

  6. **데이터 소스를 선택하고****Import**

[ ![](https://mblogthumb-phinf.pstatic.net/MjAyNTExMjVfNTcg/MDAxNzYzOTk4MDc3MTg4.ZwR2mmAGUHLG6XaD7RSP94zqknDTxx6XhTY6PPuAtWcg.c9pbenVuWcaBkz4n2rIcYHurDqpmKZI-zYj4lcN6s5wg.PNG/img_005_14fc00bd.png?type=w80_blur) ](<#>)

**Grafana 커뮤니티 대시보드 템플릿**

**템플릿을 import하면 Zabbix에서 수집한 데이터가 자동으로 시각화됩니다. CPU, 메모리, 디스크 사용률 등이 한눈에 보이는 대시보드가 완성되는 거죠!**

---

**💼 실무 팁 & 노하우**

**✨ 여러 서버를 모니터링할 때의 팁**

**Grafana의 강력한 기능 중 하나는****템플릿 변수(Template Variables)****를 사용할 수 있다는 점입니다. 같은 대시보드에서 드롭다운 메뉴로 서버를 선택해서 각 서버의 데이터를 볼 수 있어요. 이렇게 하면 여러 서버를 모니터링할 때 대시보드를 일일이 만들 필요가 없습니다.**

**🎨 시각화 선택의 중요성**

**같은 데이터라도 시각화 방식에 따라 정보 전달 효과가 달라집니다. CPU 사용률처럼 변화 추이가 중요한 데이터는 Time Series 차트를, 현재 상태만 중요한 데이터는 Gauge 차트를 사용하는 식으로 선택하면 대시보드가 훨씬 직관적이 됩니다.**

**🔔 알림 설정의 활용**

**Grafana의 알림 기능을 제대로 활용하면, 문제가 생겼을 때 즉시 알 수 있습니다. Slack이나 이메일로 자동 알림을 받도록 설정하면, 모니터링 대시보드를 항상 보고 있지 않아도 중요한 상황을 놓치지 않을 수 있어요.**

**📊 Zabbix vs Grafana 대시보드 비교**

**Zabbix의 기본 대시보드도 충분히 기능하지만, Grafana와 비교하면 몇 가지 차이가 있습니다. Zabbix는 설정이 복잡하고 UI가 다소 딱딱한 반면, Grafana는 설정이 직관적이고 UI가 현대적입니다. 또한 Grafana는 여러 데이터 소스를 한 대시보드에서 통합 관리할 수 있다는 장점이 있어요. 다만 Zabbix는 알림 설정이 더 세밀하고, 기본적으로 더 강력한 모니터링 기능을 제공합니다.**

---

**🚀 마무리하며**

**Zabbix와 Grafana를 연동하는 과정을 살펴봤습니다. 처음에는 설정이 좀 복잡해 보일 수 있지만, 한 번 완성되면 정말 강력한 모니터링 시스템이 만들어져요.**

**Zabbix가 "데이터 수집의 왕"이라면, Grafana는 "데이터 시각화의 왕"이라고 할 수 있습니다. 둘을 함께 사용하면 서버 상태를 한눈에 파악하고, 문제를 빠르게 대응할 수 있는 환경을 만들 수 있죠. 특히 여러 서버를 관리하는 환경에서는 거의 필수적인 조합이라고 봅니다.**

**혹시 설정 중에 문제가 생기면, Zabbix 서버와 Grafana 서버의 네트워크 연결을 먼저 확인해보세요. 방화벽이 포트를 막고 있지 않은지, Zabbix 계정의 권한이 충분한지 확인하면 대부분의 문제는 해결됩니다. 이 글이 여러분의 모니터링 환경을 한 단계 업그레이드하는 데 도움이 되길 바랍니다!**

**​**

**​**

**#Grafana #Zabbix #모니터링 #데이터시각화 #DevOps #서버모니터링 #오픈소스 #대시보드**

[원문 보기](https://blog.naver.com/choidz_/224086949892?fromRss=true&trackingCode=rss)
