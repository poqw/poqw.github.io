# Dockerfile

![](https://blog.kakaocdn.net/dn/cpHQsb/btqD2FXLMtq/kB8gkF36DSJAgC4RIX4GaK/img.png)

## Dockerfile 에 대한 이해

다음은 간단한 `Dockerfile` 예시다.

```dockerfile
FROM alpine

RUN apk and --update redis

CMD ["redis-server"]
```

Dockerfile은 `docker build .` 명령어로 Docker image를 만들어 낼 수 있다. 참고로, 맨 뒤의 `.`은 build context라고 부른다.
`Dockerfile` 이 저장되어 있는 디렉토리의 위치다.

이 `build` 커맨드는 매 명령어 라인 마다 임시 컨테이너(intermediate container) 이미지를 만든다. 아주 자세하게 그 과정을 들여다 보면 다음과 같다.

1. alpine 이라는 이미지를 도커 허브에서 다운받은 뒤 메모리에 떠 있는 컨테이너에 올린다.
    
    참고로 alpine 은 거추장스러운 모듈들을 다 떼어낸 최소 버전이라고 보면 된다. 대부분의 공식 이미지들은 alpine 버전을 제공한다.

2. 파일 시스템을 스냅샷을 찍어 로컬에 새로운 임시 컨테이너 이미지를 만든다.
3. 2 에서 만들었던 임시 컨테이너 이미지를 메모리에 올린 뒤, `apk and --update redis` 명령어를 실행한다.
4. 2 에서 만들었던 임시 컨테이너 이미지를 삭제하고 새로운 임시 컨테이너를 만들어 파일 시스템 스냅샷을 뜨고 저장한다.
5. 4 에서 만들었던 임시 컨테이너 이미지를 불러와 메모리에 올린 뒤 `redis-server`를 primary process command(startup command)로 지정한다.
6. 4 에서 만들었던 임시 컨테이너 이미지를 삭제하고 새로운 임시 컨테이너를 만들어 파일 시스템 스냅샷을 뜨고 저장한다.

만약 우리가 `Dockerfile` 을 수정하게 된다면, 도커는 캐싱을 한다. 예를 들어, `RUN` 커맨드를 `CMD` 앞에 하나 더 추가한다고 하더라도
`docker build .`를 하게 되면 1~4 까지의 스탭은 스킵된다. 즉, 사실은 삭제하면서 캐시에 저장해둔다는 것이다.   

### Image Tagging

Dockerfile을 자유자재로 다룰 수 있게 되었다면, image에 버전 태깅을 해볼 수도 있다. `-t` 옵션을 주면 된다.

```bash
docker build -t [docker ID]/[repo/project name]:[version | latest] .
```

## Dockerfile 로 간단한 nodejs 앱 빌드하기

### 앱 생성

먼저 빌드할 `nodejs` 앱부터 만들어야겠다. yarn init 으로 적당히 `package.json` 을 만들고,
`index.js` 빈 파일을 생성한다. 프로젝트 이름은 `docker_test`로 했다.

```
❯ tree .
.
├── index.js
└── package.json
```

`index.js` 파일을 열어 아주 간단한 express hello world 앱을 작성했다.

```javascript
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
```

의존성이 추가되었으니, `package.json` 도 아래와 같이 수정했다.

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
    "express": "*"
  }
}
```

실행해보면 `localhost:3000` 에서 hello world 가 보인다.

```bash
yarn && yarn start
```

### Dockerfile 작성

이제 `Dockerfile` 을 생성한다. 내용을 채울 것이다.

우선은 [도커 허브](https://hub.docker.com/) 에서 쓸만한 이미지를 찾는다. 여기서는 공식 `node` 이미지를 사용했다.
(혹은, `docker search node` 를 사용해서 찾아도 된다. 근데 아마 어떤 버전들이 있는지 안보일 것이다)
`pull` 받아서 실행한 번 해본다.

```bash
docker pull node:alpine
docker run -it node:alpine sh
```

`yarn --version` 해보니 잘 나온다. `yarn` 이 깔려 있으니 문제 없다.

`Dockerfile`을 아래와 같이 작성한다.

```dockerfile
FROM node:alpine

WORKDIR /usr/app
COPY ./ ./

RUN yarn install

CMD ["yarn", "start"]
```

### Docker 로 앱 빌드하여 실행하기

찾기 쉽게 `-t` 옵션으로 태깅하여 빌드한 뒤, 실행한다. 

```bash
docker build -t docker_test .
docker run -p 3000:3000 docker_test
```

굳. `localhost:3000` 에서 hello world 가 잘 보인다.