# Connection Refused 에러: 원인과 해결 방법

---

## 증상 및 오류 메시지

Connection Refused 에러는 클라이언트가 서버에 TCP 연결을 시도했으나, 서버가 해당 요청을 거부했을 때 발생합니다. 이 에러는 주로 웹 애플리케이션이나 API 서버에 접속할 때 나타나며, 다음과 같은 메시지로 확인할 수 있습니다:

![connection refused](/images/posts/connection-refused-에러-원인과-해결-방법-00-d07feb47.png)

<small>이미지 출처: https://coconuts.tistory.com/1150</small>

```
Connection refused
```  
이 에러는 서버가 요청을 수신하지 않거나, 방화벽에 의해 차단된 경우에 발생합니다. 특히 로컬 개발 환경에서 서버가 실행되고 있지 않거나, 잘못된 포트로 접속할 때 자주 발생합니다.

## 주요 원인 분석

Connection Refused 에러의 원인은 여러 가지가 있을 수 있습니다. 대표적인 원인으로는 다음과 같습니다:

1. **서비스가 실행되지 않음**: 대상 포트에서 애플리케이션이 실행되고 있지 않을 경우입니다. 예를 들어, Nginx 또는 Spring Boot 서버가 꺼져 있으면 이 에러가 발생합니다.
2. **잘못된 IP 또는 포트**: 클라이언트가 잘못된 IP 주소나 포트로 접속을 시도한 경우입니다. 예를 들어, 로컬호스트(127.0.0.1) 대신 외부 IP를 사용해야 할 때 혼동할 수 있습니다.
3. **방화벽 차단**: 방화벽이나 클라우드 보안 그룹이 특정 포트를 차단하고 있는 경우입니다. 이 경우, 서버는 요청을 수신할 수 없습니다.
4. **네트워크 문제**: 서버가 다운되었거나, 네트워크 인터페이스 설정에 오류가 있는 경우입니다.
5. **리소스 부족**: 서버의 메모리나 파일 디스크립터가 부족하여 연결을 거부하는 경우도 있습니다.

## 확인 명령어

이 문제를 진단하기 위해 몇 가지 리눅스 명령어를 사용할 수 있습니다. 다음과 같은 단계로 확인해 보세요:

1. **서비스 상태 확인**: 서비스가 실행되고 있는지 확인합니다.
   
   ```bash
   sudo systemctl status nginx
   ```
   
   또는 포트 상태를 확인합니다:
   
   ```bash
   sudo netstat -tuln | grep 80
   ```
2. **방화벽 설정 확인**: iptables나 firewalld 설정을 확인합니다.
   
   ```bash
   sudo iptables -L -n -v
   ```
   
3. **네트워크 연결 테스트**: telnet이나 nc 명령어를 사용하여 연결을 시도합니다.
   
   ```bash
   telnet localhost 80
   nc -zv 127.0.0.1 80
   ```
   
   이 명령어를 실행했을 때 "Connection refused"가 뜬다면 서버 문제일 가능성이 높습니다.
4. **로그 분석**: 애플리케이션 로그나 시스템 로그를 확인하여 추가적인 정보를 얻습니다.
   
   ```bash
   sudo journalctl -u nginx
   tail -f /var/log/syslog
   ```

## 해결 방법

원인을 파악한 후, 아래의 절차를 통해 문제를 해결할 수 있습니다:

1. **서비스 재시작**: 서비스가 꺼져 있다면 다시 시작합니다.
   
   ```bash
   sudo systemctl start nginx
   sudo systemctl enable nginx  # 부팅 시 자동 시작 설정
   ```
2. **포트 허용**: 방화벽에서 포트를 허용합니다.
   
   ```bash
   sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
   sudo firewall-cmd --add-port=80/tcp --permanent
   sudo firewall-cmd --reload
   ```
3. **IP 및 포트 확인**: ifconfig로 서버 IP를 확인하고, 올바른 포트로 접속합니다.
   
   ```bash
   curl http://192.168.1.10:80
   ```
4. **리소스 조정**: 파일 디스크립터를 늘리거나 시스템 리소스를 확인합니다.
   
   ```bash
   sudo ulimit -n 65535
   ```
   
   이를 영구 적용하려면 `/etc/security/limits.conf`에 추가합니다:
   
   ```bash
   * soft nofile 65535
   * hard nofile 65535
   ```
5. **DNS 문제 해결**: DNS 설정을 확인하고 필요시 수정합니다.
   
   ```bash
   echo "nameserver 8.8.8.8" | sudo tee -a /etc/resolv.conf
   ```

## 재발 방지 체크리스트

1. **서비스 모니터링**: 서비스가 항상 실행되고 있는지 모니터링합니다.
2. **정기적인 방화벽 점검**: 방화벽 규칙을 정기적으로 점검하여 필요한 포트가 열려 있는지 확인합니다.
3. **네트워크 안정성 확인**: 네트워크 인터페이스의 상태를 정기적으로 확인합니다.
4. **리소스 사용량 모니터링**: 서버의 메모리 및 파일 디스크립터 사용량을 모니터링하여 리소스 부족 문제를 예방합니다.
5. **문서화**: 발생한 문제와 해결 과정을 문서화하여 유사한 상황에서 빠르게 대응할 수 있도록 합니다.

Connection Refused 에러는 흔히 발생하는 문제이지만, 원인을 정확히 파악하고 적절한 조치를 취하면 빠르게 해결할 수 있습니다. 이러한 점검 및 예방 조치를 통해 서버 운영의 안정성을 높일 수 있습니다.

![참고 이미지](/images/posts/connection-refused-에러-원인과-해결-방법-01-46215e0b.png)

<small>이미지 출처: https://shanael.tistory.com/439</small>

---

## 참고한 자료

- [리눅스에서 "Connection Refused" 에러 원인 진단과 해결 방법](https://jihwan-study.tistory.com/101)
- [ERR_CONNECTION_REFUSED — 연결이 거부됨 에러 원인·해결·예방](https://shanael.tistory.com/439)
- [SSH 연결 오류 Network error: connection refused 해결방법](https://coconuts.tistory.com/1150)
- [Chrome에서 ′ERR_CONNECTION_REFUSED′의 원인과 해결방법 소개!](https://dkel.tistory.com/336)
