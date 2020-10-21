---
layout: post
title: "How to Use Docker"
category: [docker]
author: hyungsun
image: assets/images/docker_facebook_share.png
---

{% include image.html url="/images/docker_facebook_share.png" description="귀여운 도커 마스코트" source="https://www.docker.com/" %}

### Docker
도커가 무엇인지에 대한 설명은 [여기](https://subicura.com/2017/01/19/docker-guide-for-beginners-1.html)에 아주 자세하게 나와있습니다. 이 외에도 그냥 구글에 검색하면 원리라던가 쉽게 설명해 놓으신 분들이 많기 때문에, 본문에서 자세한 설명은 하지 않습니다. 하하하 ~~사실 이 글은 제가 그만 까먹고 싶어서 쓰는 거니까요~~

### Docker를 다운받았는데, 그 다음엔 뭘하지?
두 말 할 것없이 컨테이너(`container`)를 생성해야 합니다. 컨테이너는 간단히 이야기 해서 가벼운 가상머신이라고 생각해도 무방합니다. 도커는 그 가상머신을 만들고 활용하기 위한 도구인 거죠. 

여기서는 새로 가장 최신 버젼의 우분투 이미지를 받아와 컨테이너를 생성하는 방법을 소개해 드리겠습니다.

```php
$ docker run ubuntu
```

명령어가 하필이면 `run`이라서 마치 컨테이너를 실행시킬 것처럼 생겼지만 사실 이 명령어는 도커 컨테이너를 생성하는 친구입니다. 주의합시다.

### Docker 컨테이너 목록 확인
다음과 같이 목록을 확인할 수 있습니다.
```php
$ docker ps -a
// CONTAINER ID        IMAGE               COMMAND             CREATED              STATUS                          PORTS               NAMES
// 12ee8b8f7e8f        ubuntu              "/bin/bash"         About a minute ago   Exited (0) About a minute ago                       angry_feynman
```

`angry_feynman`이라고 이름을 자기 멋대로 정해져 있습니다(이름이 안보인다면 마우스로 드래그해서 오른쪽 끝까지 가보세요). `name`옵션을 주지 않았기 때문입니다. 

일단 이름이 마음에 들지 않으니 다음과 같이 바꿔줍니다. 컨테이너 실행할 때마다 `angry_feynman`을 치기는 귀찮잖아요. 무의식적으로 읽어보려 했는데 어떻게 읽는지도 모르겠네요.

```php
// docker rename [container_id] [name]
$ docker rename 12ee8b8f7e8f ubuntu
```

이제 컨테이너 이름이 `ubuntu`로 짠하고 바뀌었을 겁니다.

### Docker 컨테이너 부팅
컨테이너가 실행 중인 상태가 되어야 접속을 할 수 있습니다. 컨테이너를 다음과 같이 실행시켜보도록 합시다.

```php
// docker start [container]
$ docker start ubuntu
```

컨테이너가 켜져있는지 확인해 보려면 다시 `docker ps -a` 를 하면 됩니다.

### Docker 컨테이너 접속
접속할 때는 `attach`보다 `exec`가 훨씬 편해서 저는 `exec`를 애용합니다.

```php
// docker exec -it [container] /bin/bash
$ docker exec -it ubuntu /bin/bash
```

`exec`를 쓰게 되면 `/bin/bash`를 열어달라는 명령을 한꺼번에 할 수 있어서 더 편해요.

