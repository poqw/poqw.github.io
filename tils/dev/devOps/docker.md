# Docker

![Docker](../../../assets/images/docker_1.png)

## 왜 사용하는가?

'왜' 라는 단어는 학습하는 데 있어서 이 질문이 간결한 만큼이나 중요하다. 우리는 항상 이 의문을 던질 준비가 되어 있어야 한다.
우리는 왜 도커를 사용해야 할까. 도커는 소프트웨어의 설치나 실행을 매우 간결하게 만들어 주기 때문이다. 해당 소프트웨어가
의존하고 있는 디펜던시 라이브러리나, 셋업하는 과정에 대해 걱정할 필요가 없어진다.

## 이미지와 컨테이너

도커는 컨테이너를 실행하기 위한 플랫폼이다.
어떤 프로그램을 실행하는 데 있어서 필요한 의존성이나, 설정과 같은 부분들을 이미지화(dockerizing)하여
허브에다가 올려놓으면 우리는 그 이미지의 인스턴스를 쉽게 따온 뒤에 의존성이나 설정에 대한 염려 없이 곧바로 프로그램을 실행할 수 있다.
이 이미지 인스턴스를 우리는 컨테이너라고 부른다.

## 컨테이너: 이미지 인스턴스

컨테이너는 이미지로부터 어떻게 인스턴스화 되는 걸까. 이미지화 되는 경우를 차근차근 살펴보면, 크게 다음 2가지 일이 일어난다.

1. 어떠한 프로그램을 위한 deps 들이 Snapshot(File system snapshot)이 떠진다.
2. 해당 프로그램을 실행시키기 위한 startup command가 세팅된다.

`docker run` 같은 명령어로 이미지를 로컬에 가져오게 되면, 이미지에 떠져있는 snapshot이 내 머신에 풀어지고,
startup command가 실행되면서 프로세스를 생성한다. 이 프로세스는 namespace가 같은 자원, 즉 아까 풀어졌던 snapshot만
바라보기 때문에, 머신에 이미 설치되어 있던 다른 deps들과 충돌할 일이 없어진다. 이는 프로세스 네임스페이싱이라고 한다.

## docker 명령어

사실 명령어는 [여기서](https://docs.docker.com/engine/reference/commandline/docker/) 다 볼 수 있다.
근데 너무 많으니 내가 자주쓰는 것만 아래 정리해두었다.

### 컨테이너 목록 보기

아래 명령어로 컨테이너 목록에서 컨테이너의 ID, 이름, 상태 등을 조회할 수 있다.
```bash
docker ps -a
```

### 컨테이너 만들기

`docker run` 명령어를 쓰면 되는데, 옵션이 좀 많다.
```bash
docker run -e MY_ENV="a=b" -v ~/my/dir/:/container/dir [IMAGE]:[TAG]
```

- v (volume): 호스트의 볼륨과 컨테이너 내의 이미지를 매핑시킨다.
- d (deamon): 데몬으로 실행시킨다.
- e (environment): 환경변수를 지정한다.

### 컨테이너 실행하기

컨테이너를 실행하려면 컨테이너가 이미 만들어져 있어야 한다. 아래 명령어로 다운되어 있는 컨테이너를 UP 상태로 변경할 수 있다.

```bash
docker start
```

켜진 컨테이너에 접속하거나 명령을 내리고 싶으면 [`exec`](https://docs.docker.com/engine/reference/commandline/exec/) 를 사용한다.
```bash
docker exec -it b80353d7e482 /bin/bash
```

여기에 쓰인 옵션은 다음과 같다.
- i (interactive): 인터렉티브 모드로 도커를 실행시킨다.
- t (tts): pseudo-TTY 를 할당한다.
- d (detach): 명령어를 Background 에서 실행시킨다.
