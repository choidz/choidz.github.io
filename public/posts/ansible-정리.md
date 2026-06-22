# Ansible 정리

---

**Ansible 완벽 정리 (기초부터 핵심 개념까지)**

DevOps 환경에서 빠질 수 없는 자동화 도구, **Ansible**!

이 글에서는 Ansible의 개념부터 주요 구성 요소, 사용 예시까지 한눈에 정리해드립니다.

---

**💡 1. Ansible이란?**

**Ansible** 은 시스템 설정, 애플리케이션 배포, 서버 관리 등을 자동화해주는 **오픈소스 도구** 입니다.

복잡한 서버 환경을 쉽게 관리할 수 있도록 **YAML 기반** 으로 작업을 정의합니다.

**✅ 주요 특징**

- **에이전트리스 (Agentless)** : SSH로 연결, 대상 서버에 프로그램 설치 불필요
- **YAML 기반** : 사람이 읽기 쉬운 형식으로 구성
- **Idempotence (불변성)** : 여러 번 실행해도 결과가 동일
- **Push 방식** : 중앙에서 명령을 각 서버로 푸시
- **확장성** : 수백 대의 서버를 동시에 관리 가능

---

**🧩 2. Ansible 구성요소**

---

**🌐 3. Inventory (인벤토리)**

Ansible이 제어할 서버들의 **목록과 접속 정보** 를 담은 파일입니다.

기본 위치는 /etc/ansible/hosts.

**📂 예시**

[webservers] 192.168.0.10 ansible_user=ubuntu 192.168.0.11 ansible_user=ubuntu

**🔧 주요 옵션**

📘 **기본 테스트 명령어**

ansible -i hosts all -m ping

---

**📜 4. YAML 기본 문법**

**YAML (Yet Another Markup Language)** 은 사람이 읽기 쉬운 데이터 포맷입니다.

Ansible에서는 Playbook 작성에 사용됩니다.

**✏️ 예시**

name: BK favorite_foods: - Pizza - Tacos - Sushi

> 들여쓰기로 계층 구조를 표현하며, 가독성이 뛰어납니다.

---

**⚙️ 5. Playbook**

**Playbook** 은 여러 작업(Task)을 순차적으로 실행하는 **자동화 스크립트** 입니다.

**🔧 기본 구조**

\- name: Apache 설치 hosts: webservers become: yes tasks: - name: 패키지 설치 yum: name: httpd state: present - name: 서비스 시작 service: name: httpd state: started

**🖥️ 실행 명령어**

ansible-playbook site.yml -i inventory.ini

---

**🧱 6. Module (모듈)**

모듈은 Ansible의 “작업 단위”입니다.

서버 설정, 파일 복사, 서비스 제어 등 대부분의 작업은 모듈로 수행됩니다.

---

**🧮 7. Variable (변수)**

반복되는 값이나 조건에 따라 변하는 데이터를 변수로 관리할 수 있습니다.

vars: app_name: nginx tasks: - name: "{{ app_name }} 설치" yum: name: "{{ app_name }}" state: present

📌 **참조 문법:** {{ 변수명 }}

**변수 우선순위**

-e > task vars > play vars > role vars > inventory vars > role default

---

**⚖️ 8. 조건문 (when)**

조건에 따라 Task를 실행할지 결정합니다.

\- name: CentOS인 경우만 실행 yum: name: httpd state: present when: ansible_os_family == "RedHat"

---

**🔁 9. 반복문 (loop)**

같은 작업을 여러 값에 대해 반복 실행할 때 사용합니다.

\- name: 여러 패키지 설치 yum: name: "{{ item }}" state: present loop: - httpd - vim - git

---

**🧩 10. Role**

Playbook을 구조화하고 재사용하기 위한 단위입니다.

**디렉토리 구조**

roles/ setup_nginx/ tasks/main.yml handlers/main.yml templates/ files/ vars/main.yml

**생성 명령어**

ansible-galaxy init setup_nginx

**Playbook 내 호출**

roles: - setup_nginx

---

**📘 11. 인벤토리 패턴 (Pattern)**

---

**⚙️ 12. 실행 전략 (Strategy)**

---

**🏁 마무리 요약**

---

> 💬 **TIP** :
>
> Ansible은 “명령어 자동화”보다 “시스템 관리의 코드화”에 가깝습니다.
>
> 작은 자동화부터 시작해서 점점 Role 기반 구조로 발전시키면
>
> 대규모 인프라도 효율적으로 관리할 수 있습니다. 🚀

**​**

[원문 보기](https://blog.naver.com/choidz_/224059741734?fromRss=true&trackingCode=rss)
