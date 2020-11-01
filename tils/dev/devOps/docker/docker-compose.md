# Docker Compose

![](https://miro.medium.com/max/1000/1*JK4VDnsrF6YnAb2nyhMsdQ.png)

## Docker compose 왜 사용하는가

프로젝트가 거대해지고, 사용하는 컨테이너 수가 여러 개로 늘어난다면 실행시키는 데만도 `docker run` 명령어를 몇 번 씩 실행해야 할 지도 모른다.
물론 쉘 스크립트로 짜놓고서 자동으로 여러 개의 컨테이너를 띄우는 등 관리를 할 수도 있겠지만, docker 에서 이미 `docker-compose` 라는 유틸을
제공하니 그럴 필요가 없다.

## Docker compose 예시

방문자 수를 보여주는 기능을 만든다고 해보자. 서버가 하나면 방문자 수 띄우는 거야 앱에서 그냥 처리하면 되곘지만,
여러 개의 서버가 동시에 접속을 받는 상황이라면 어느 한 군데에 공유 스토리지를 두어 방문자 수를 계산해야 할 것이다.

### App 작성

공유 스토리지 역할로 [redis](https://redis.io/) 를 사용하고, node 로 앱을 구현한다고 하면 아래와 같은 코드가 나올 것이다.

```javascript
const express = require('express')
const redis = require('redis')

const app = express()
const client = redis.createClient({
  host: 'redis-server', // 나중에 docker-compose 파일에서 이 이름으로 설정해 주어야 한다.
  port: 6379 // redis 기본 port다.
})
client.set('visits', 0)

const port = 3000

app.get('/', (req, res) => {
  client.get('visits', (err, visits) => {
    res.send('Number of visits is ' + visits)
    client.set('visits', parseInt(visits) + 1)
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
```

`package.json` 은 아래와 같다.

```json
{
  "name": "docker_test",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "*",
    "redis": "*"
  }
}
```

아래는 Dockerfile 이다.

```dockerfile
FROM node:alpine

WORKDIR /usr/app

COPY package.json .
RUN yarn
COPY . .

CMD ["yarn", "start"]
```

아래 명령어로 빌드 후 실행해보자.

```bash
docker build -t docker_test . && docker run docker_test
```

당연히 에러가 난다. 도커 컨테이너 안에서 redis 서버를 실행시켜 줘야 하는데 그러지 않았기 때문이다. `Dockerfile` 에서
`RUN docker run redis` 같은 걸 추가해야할까? 아니다. 이미지에 docker 가 설치되지 않아서 분명 에러가 날 것이다.
프로덕션 배포 이미지에 docker를 추가하는 건 우스꽝스러운 일이다.

결국 여러 호스트를 띄워서 위 이미지를 띄우는 방법이 있다. redis 서버를 접속가능한 public 한 곳에 하나 띄우고,
`redis.createClient` 부분의 `host`에 해당 주소를 넣는 것이다. 하지만 같은 호스트에서 띄우고 싶다면? `docker-compose`를 사용하자.

참고로 여러 호스트를 띄워서 컨테이너들을 관리하고 싶다면 [`kubernetes`](../k8s) 를 사용하자.

### docker-compose.yaml 파일 작성

`docker` 가 `Dockerfile` 를 사용하듯, `docker-compose` 를 쓰려면 `docker-compose.yaml` 을 생성해야 한다.

```yaml
version: '3.7' # docker compose 의 버전이다.

services:
  redis-server:
    image: 'redis'
  node-app:
    build: .
    ports:
      - "8081:3000"
```

`docker-compose`는 결국 여러 컨테이너 이미지를 관리하기 위해 쓰는 것인데, 이 여러 이미지들을 `docker-compose.yaml` 파일
안에서는 `services` 로 정의한다. 각 이미지는 `image` 로 base image를 설정해 주거나, `build` 로 직접 이미지를 생성해 주어야 한다.

### docker-compose 명령어 

`up` 과 `down` 이 각각 `run` 과 `stop` 에 해당된다고 보면 된다.

```bash
docker-compoes up
```

`--build` 옵션을 주어 `run` 하기 전에 빌드를 할 수도 있다.

```bash
docker-compoes up --build
```

docker ps 로 확인해보면 두 컨테이너가 동시에 떠 있는 걸 볼 수 있다.

```
❯ docker ps
CONTAINER ID        IMAGE                       STATUS              PORTS                 
fbb3ae512cea        docker_test_node-app        Up 4 seconds        0.0.0.0:8081->3000/tcp
ade7aecebc59        redis                       Up 4 seconds        6379/tcp              
```

localhost:8081로 접속해보면 실행이 잘 되고 있는 것도 확인해 볼 수 있다.

멈추려면 아래 명령어를 사용하자.

```bash
docker-compoes down
```

