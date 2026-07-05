# CORS 정책에 의한 차단 오류 해결하기

---

## 증상 및 오류 메시지

CORS(Cross-Origin Resource Sharing) 오류는 웹 애플리케이션이 다른 출처의 리소스를 요청할 때 발생하는 차단 현상입니다. 이 오류는 주로 다음과 같은 메시지로 나타납니다:

```
Access to XMLHttpRequest at 'URL' from origin 'ORIGIN' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

이 메시지는 요청한 리소스의 서버가 CORS 정책을 준수하지 않거나, 요청한 출처를 허용하지 않기 때문에 발생합니다. 이러한 오류는 프론트엔드 개발자들이 자주 마주치는 문제 중 하나로, 특히 API 서버와 클라이언트가 서로 다른 출처에 있을 때 자주 발생합니다.

## CORS 오류의 원인

CORS 오류의 가장 큰 원인은 **동일 출처 정책(Same-Origin Policy)**입니다. 이 정책은 보안상의 이유로, 웹 브라우저가 다른 출처의 리소스에 대한 요청을 기본적으로 차단합니다. 다음은 CORS 오류를 유발할 수 있는 몇 가지 일반적인 원인입니다:

1. **서버의 CORS 설정 미비**: 서버가 `Access-Control-Allow-Origin` 헤더를 설정하지 않았거나, 잘못 설정한 경우입니다.
2. **프리플라이트 요청 실패**: 브라우저가 CORS 요청을 보내기 전에 OPTIONS 메서드로 사전 요청을 보내는데, 이 요청에 대한 응답이 없거나 실패하는 경우입니다.
3. **허용되지 않은 메서드 또는 헤더**: 요청에 사용된 HTTP 메서드나 헤더가 서버에서 허용되지 않는 경우 발생합니다.
4. **자격 증명 사용 시 설정 오류**: 쿠키나 인증 정보를 포함한 요청에 대해 `Access-Control-Allow-Origin` 헤더가 `*`로 설정된 경우입니다.

![참고 이미지](/images/posts/cors-정책에-의한-차단-오류-해결하기-00-411cb220.png)

<small>이미지 출처: https://coding-groot.tistory.com/91</small>

## CORS 오류 확인 명령어 및 절차

CORS 오류를 확인하기 위해서는 브라우저의 개발자 도구를 활용할 수 있습니다. 다음은 확인 절차입니다:

1. **브라우저 개발자 도구 열기**: F12 키를 눌러 개발자 도구를 열고, **Network** 탭으로 이동합니다.
2. **요청 확인**: CORS 오류가 발생한 요청을 찾아 클릭합니다. 요청의 **Headers** 섹션에서 `Origin`과 `Access-Control-Allow-Origin` 값을 확인합니다.
3. **콘솔 확인**: **Console** 탭에서 CORS 관련 오류 메시지를 확인합니다.

## CORS 오류 해결 방법

CORS 오류를 해결하기 위한 방법은 다음과 같습니다:

### 1. 서버 측 CORS 설정

서버에서 CORS 정책을 설정하는 것이 가장 권장되는 방법입니다. 다음은 몇 가지 설정 예시입니다.

- **Node.js (Express)**
```javascript
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: 'https://example.com',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

- **Spring**
```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**").allowedOrigins("https://example.com").allowedMethods("GET", "POST");
    }
}
```

- **Nginx**
```nginx
server {
    location /api {
        add_header 'Access-Control-Allow-Origin' 'https://example.com';
        add_header 'Access-Control-Allow-Methods' 'GET, POST';
        add_header 'Access-Control-Allow-Headers' 'Content-Type';
    }
}
```

### 2. 프록시 서버 사용

개발 환경에서는 프록시 서버를 설정하여 CORS 오류를 우회할 수 있습니다. 예를 들어, React의 `package.json` 파일에 다음과 같이 설정할 수 있습니다:
```json
"proxy": "http://localhost:5000"
```

### 3. 클라이언트 요청 수정

클라이언트에서 요청을 보낼 때, `withCredentials` 옵션을 추가하여 쿠키나 인증 정보를 포함할 수 있습니다. 이 경우 서버 측에서도 해당 옵션을 허용해야 합니다.

### 4. 프리플라이트 요청 처리

서버에서 OPTIONS 메서드에 대한 응답을 200으로 설정하고, 필요한 CORS 헤더를 추가해야 합니다. 예를 들어:
```javascript
app.options('/api', cors()); // Preflight response
```

## 재발 방지 체크리스트

CORS 오류를 방지하기 위해 다음 사항을 체크리스트로 활용할 수 있습니다:
1. 요청 출처(Origin)를 정확히 확인하고, 허용할 출처만 설정합니다.
2. 쿠키나 인증 정보를 사용하는 경우, 서버에서 `Access-Control-Allow-Credentials`를 설정합니다.
3. 프리플라이트 요청이 정상적으로 처리되는지 확인합니다.
4. 허용할 HTTP 메서드와 헤더를 명확히 설정합니다.
5. 리다이렉트가 발생하지 않도록 주의합니다.

![참고 이미지](/images/posts/cors-정책에-의한-차단-오류-해결하기-01-2580a57c.png)

<small>이미지 출처: https://i5i5.tistory.com/935</small>

CORS 정책은 웹 애플리케이션의 보안을 강화하는 중요한 요소입니다. 따라서 이를 정확히 이해하고 적절히 설정하는 것이 중요합니다.

---

## 참고한 자료

- [cors 에러는 무엇인가.](https://codingworld2002.tistory.com/277)
- [내가 찾은 CORS Error의 올바른 해결법](https://coding-groot.tistory.com/91)
- [CORS 오류(“Blocked by CORS policy”) 해결 가이드: 원인 → 체크리스트 → 실전 설정 예시](https://zumsim.tistory.com/176)
- [CORS 에러 해결방법. Access to XMLHttpRequest at  from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: http, data, chrome, chrome-extension, chrome-untrusted, https.](https://i5i5.tistory.com/935)
- [[Nginx\] 웹소켓, 스톰프, nginx, Cors 에러](https://mo-greene.tistory.com/54)
