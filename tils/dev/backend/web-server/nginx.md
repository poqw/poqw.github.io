# NGINX

![](https://www.nginx.com/wp-content/uploads/2018/08/NGINX-logo-rgb-large.png)

Nginx 는 HTML이나 미디어 파일 같은 정적 컨텐츠처리 전문가다.

## 모양새

```
user  nginx;
worker_processes  1;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;

events {
  # ...
}

http {
  # ...
}
```