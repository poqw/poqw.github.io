# NGINX

![](https://www.nginx.com/wp-content/uploads/2018/08/NGINX-logo-rgb-large.png)

Nginx 는 HTML이나 미디어 파일 같은 정적 컨텐츠처리 전문가다.

## 동작 원리

Nginx 는 마치 프록시처럼 사용자의 요청을 서버 대신 받아서 중계해주는 일종의 경량화된 웹 서버다.
설정에 따라 요청에 대한 설정을 마음대로 컨트롤할 수 있다는 것이 Nginx 의 큰 장점이다.

Apache 는 요청에 따라 스레드를 생성해서 접속자 수가 많아지면 CPU와 메모리를 많이 잡아먹지만 Nginx는 Event-driven 방식이기 때문에
고정된 프로세스만 사용하므로 접속이 증가해도 메모리나 CPU 사용량이 크게 증가하지 않는다.

## Master & Worker Process

Nginx는 Master Process 와 Worker Process 가 존재한다.

Master Process 는 단 하나로, /etc/nginx/nginx.conf 에 위치한 설정 파일의 유효성을 검증하고 Worker Process 들을 관리한다.

Worker Process 는 설정 파일에서 설정이 가능하고, OS의 상황에 맞게 자동 조정된다. 모든 요청은 이 Worker Process가 처리한다. 

## Dive into an example

아래는 내가 작성했던 nginx config 파일이다.

```
user nginx;
worker_processes 1;

error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
  worker_connections 1024;
}

http {
  include /etc/nginx/mime.types;
  default_type application/octet-stream;

  log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                  '$status $body_bytes_sent "$http_referer" '
                  '"$http_user_agent" "$http_x_forwarded_for"';

  access_log /var/log/nginx/access.log main;

  # Some optimization tips.
  # https://thoughts.t37.net/nginx-optimization-understanding-sendfile-tcp-nodelay-and-tcp-nopush-c55cdd276765
  sendfile on;
  tcp_nopush on;
  tcp_nodelay on;

  keepalive_timeout 65;

  gzip on;

  server {
    listen 80;
    root /usr/app;

    location /hls/playlist.m3u8 {
      add_header Cache-Control 'no-store, no-cache, must-revalidate, max-age=0';
      add_header Content-type 'application/vnd.apple.mpegurl';
      add_header Access-Control-Allow-Origin '*';
    }

    location ~ /hls/(chunk[0-9]+\.ts)$ {
      alias /usr/app/hls/chunks/$1;
      add_header Cache-Control 'no-store, no-cache, must-revalidate, max-age=0';
      add_header Content-type 'video/MP2T';
      add_header Access-Control-Allow-Origin '*';
    }

    location / {
      proxy_pass http://localhost:8088;
    }
  }
}
```

나는 당시에 HLS 서버의 스트리밍 파일을 nginx를 통해 서빙하려고 했었다. 차근 차근 살펴보자.

### Directive details 

아래처럼 `;`으로 끝나는 설정 값들을 Nginx 에서는 `Directive` 라고 부른다. 구글링할 때 참고하자.

---

```
user nginx;
worker_processes 1;
```

nginx 서버를 띄우는(Worker Process를 생성하고 실행할) 시스템 사용자의 이름을 nginx 로 설정한다.
시스템에 사용자가 없다면 다음과 같이 생성해 주어야 한다.

```bash
adduser --system --no-create-home --shell /bin/false --group --disabled-login nginx
```

`worker_processes`는 설정 상 1개로 했다. 웬만한 과부화가 예상되지 않는 이상 1로도 사실 충분하다.

---

```
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;
```

오류 로그를 어디다 저장할지는 `error_log`를 통해 설정한다. 초기 설정할때 자주 들여다 보게 된다.
초기 설정할 때, `lsof -n -t /var/log/nginx/error.log` 로 로그파일을 모니터링하고 있는 것도 시간을 절약할 수 있는 방법이다.

`pid`는 Master Process ID 를 저장할 파일 경로 지정한다. 별 생각없이 붙여넣어도 무방하다.

---

```
events {
  worker_connections 1024;
}

```

`events` 블록안에는 접속 처리에 관한 설정이 들어간다.
`events.worker_connections` 에는 Worker Process 한 개당 동시 접속 수를 지정한다. 보통 `512` 나 `1024`를 주로 사용한다.

---

```
http {
  # ...
}
```

`http` 블록 안에는 웹 / 프록시 관련 설정이 들어간다. 아래는 `http` 블록안에서 설장했던 내용들이다.

```
  include /etc/nginx/mime.types;
  default_type application/octet-stream;

  log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                  '$status $body_bytes_sent "$http_referer" '
                  '"$http_user_agent" "$http_x_forwarded_for"';

  access_log /var/log/nginx/access.log main;
```

mime.types 파일을 읽어들이고, MIME 타입을 설정한 뒤 엑세스 로그 형식과 저장 경로를 지정한다.

```
  # Some optimization tips.
  # https://thoughts.t37.net/nginx-optimization-understanding-sendfile-tcp-nodelay-and-tcp-nopush-c55cdd276765
  sendfile on;
  tcp_nopush on;
  tcp_nodelay on;

  keepalive_timeout 65;

  gzip on;
```

`sendfile`과 `tcp_nopush` 옵션은 항상 같이 사용되어야 한다. 정적파일을 서빙해야 한다면, 최적화를 위해 반드시 켜두도록 하자.
파일을 서빙하기 전에 패킷에 데이터가 전부 차있는지 확인하는 절차가 들어가면서 불필요한 요청이 줄어드므로 네트워크 오버헤드가 줄어든다.

`tcp_nodelay` 는 TCP와 관련하여 좀 더 제너럴한 설정이며, 패킷당 최대 0.2초를 절약할 수 있는 최적화 설정이다.
TCP에는 전체 네트워크의 혼잡을 피하기 위해 기본적으로 0.2초를 기다리는 알고리즘이 있다. 그러나 이는 지금보다 인터넷이 훨씬 구릴때 이야기라,
모던한 인터넷과는 맞지 않는다. 이 옵션도 반드시 켜주도록 하자.

`keepalive`는 HTTP 요청/응답을 할 때 매번 3 way handshake를 하지 않기 위해 사용할 수 있는 옵션이다. 여기서는 65초로 타임아웃을 설정한다.

`gzip on`을 통해 컨텐츠의 압축 사용을 지정할 수 있다. 말 그대로 전송되는 데이터를 압축하여 줄이므로 마찬가지로 성능 튜닝하는 데 사용되는 옵션이다.

---

```
  server {
    listen 80;
    root /usr/app;

    location /hls/playlist.m3u8 {
      add_header Cache-Control 'no-store, no-cache, must-revalidate, max-age=0';
      add_header Content-type 'application/vnd.apple.mpegurl';
      add_header Access-Control-Allow-Origin '*';
    }

    location ~ /hls/(chunk[0-9]+\.ts)$ {
      alias /usr/app/hls/chunks/$1;
      add_header Cache-Control 'no-store, no-cache, must-revalidate, max-age=0';
      add_header Content-type 'video/MP2T';
      add_header Access-Control-Allow-Origin '*';
    }

    location / {
      proxy_pass http://localhost:8088;
    }
  }
```

`server`는 하나의 호스트를 선언하는 데 사용되고, 그 안의 `location`은 특정 URL을 통해 호스트로 들어온 요청에 대해 어떻게 처리할지를 정의한다.

`root /usr/app;`을 통해 정적 파일을 로드할 때 어떤 경로로 로드할 지를 결정한다.
예를 들어, `http://localhost/hls/playlist.m3u8` 으로 요청이 들어왔다면 첫번째 `location` 디렉티브에 의해 처리되는데
`/usr/app/hls/playlist.m3u8` 위치의 파일을 찾아 지정해주는 헤더와 함께 응답한다.

`root` 와 헷갈리는 것이 `alias`인데, 두번째 `location` 디렉티브를 살펴보자. 우선 `~` 는 정규표현식을 쓰겠다는 의사표시다.
요청이 `http://localhost/hls/chunk038.ts` 로 오게 된다면 `alias` 때문에 파일을 찾을 때 요청 경로를 무시하고
`/usr/app/hls/chunks/chunk038.ts` 를 찾게 된다. 정규표현식에 의해 `chunk038.ts`가 캡쳐되고 `$1` 에 치환되기 떄문이다.

그리고 이외에 나머지 요청은 `proxy_pass` 를 통해 진짜 웹서버로 프록시를 해준다.

