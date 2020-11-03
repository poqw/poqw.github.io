# Kubernetes (a.k.a k8s)

![](https://subicura.com/assets/article_images/2019-05-19-kubernetes-basic-1/kubernetes-logo.png)

쿠버네티스에 대해 알아보자.

## 개념

쿠버네티스는 컨테이너화된 애플리케이션을 배포하기 위한 오픈 소스 오케스트레이터다.

- 간단한 선언 구문을 사용하여 애플리케이션을 정의하고 배포할 수 있게 해주는 오케스트레이션 API를 제공한다.
- 쿠버네티스 클러스터는 오류가 있는 경우 애플리케이션을 복구하는 수많은 온라인 자가 재해 복구 알고리즘을 자체적으로 제공한다.
- 쿠버네티스 API는 소프트웨어 무중단 업데이트를 더욱더 쉽게 수행할 수 있게 배포하며,
  서비스의 여러 레플리카 간에 트래픽을 쉽게 분산할 수 있는 로드 벨런서 개념을 제공한다.
- 쿠버네티스는 서비스의 네이밍과 검색을 위한 툴을 제공하므로 느슨하게 결함한 마이크로 서비스 아키텍쳐를 구축할 수 있다.

### Cluster

쿠버네티스에서 관리하는 가장 큰 단위다. 즉, 여러 서버를 하나로 묶어놓은 것.
정확한 정의는 쿠버네티스가 최종 사용자에게 줄 수 있는 전체 컴퓨팅 리소스를 제공하기 위해 함께 작동하는 여러 시스템 묶음을 말한다.

#### 작동 방식

클러스터 내부에는 실제로 서비스를 담당하는 worker node와 이 worker node들을 관리하는 master node가 있다.

### Node

1개의 노드는 곧 한 개의 물리(혹은 가상) 서버를 의미한다.

### Pod

Docker로 우리가 만든 어플리케이션의 이미지를 만들어 Docker 허브에 올려놓았다면 쿠버네티스로 앱 배포할 준비는 끝난 것이다.
간단하게 앱 이미지가 있는 도커 허브 주소를 설정한 후에 이 이미지를 이용해 컨테이너를 가지고 있는 Pod를 생성할 수 있다.

Pod는 이렇게 하나 이상의 컨테이너를 묶어 놓은 녀석이다. 쿠버네티스에서는 Pod를 언제든지 버리고 새로 만들 수 있는 녀석으로 보고 있다.
그렇기 때문에 아래 사항을 주의해야 한다.

- Pod는 자신만의 가상 IP를 부여 받는다. (새로 생성되면 이 IP는 바뀐다 -> 관리가 까다롭다)
- 가상 IP기 때문에 외부에서 Pod로 직접 접근할 수는 없다. 접근할 수 있게 하려면 인터페이스 설정을 해주어야 한다.
- Pod은 언제든지 장애가 발생하면 죽을 수 있다.
- Pod에 적용된 이미지를 업데이트 하려면 Pod을 지우고 새로 만들어야 한다. Pod은 이미 만들어진 컨테이로만 동작하기 때문이다.

위 문제점(?)들을 해결하기 위해 바로 밑에 소개되는 녀석들이 등장한다.

#### Service

Pod의 가상 IP는 언제라도 바뀔 수 있기 떄문에, 외부로의 접근 인터페이스 역할을 해주는 녀석이 바로 Service다.

Service는 고정적인 가상 IP를 받고, 이 Service를 참조하면 자신이 관리하는 Pod에 연결해준다.

#### ReplicaSet

Pod은 언제라도 죽을 수 있다. 이 녀석을 다시 살리기 위해 직접 관리자가 접속해서 부팅해줘야 할까? 그 역할을 해주는 게 바로 ReplicaSet이다.

ReplicaSet은 직접적으로 Pod들을 관리하고, 언제든지 문제가 생긴 Pod를 버리고 새로운 Pod를 (여러개도 가능) 만들어 내는 Pod 공장이다.

ReplicaSet이 Pod를 만들어내기 위해서는 Pod를 생성하기 위해 필요한 정보를 자신이 가지고 있어야 하는데, 이 정보를 Template이라고 한다.
즉, ReplicaSet은 Pod를 Template으로 가지고 있다.

#### Deployment

만약 새로운 버전의 앱을 배포해야 한다면? 지금 떠있는 Pod들을 다 죽이고 새로 생성한다? 이렇게 되면 서비스 다운 타임이 생기게 된다.
이를 다운 타임이 없도록 해주는 게 Deployment다. ReplicaSet이 Pod을 템플릿으로 가지고 있다면, Deployment는 ReplicaSet을 템플릿으로 가지고 있다.

만약 새로운 버전을 배포해야 한다면, Deployment는 자신이 가진 템플릿으로 새로운 버전의 ReplicaSet을 만들어내고,
순차적으로 이전의 Pod들을 죽이고 새로운 Pod들을 띄우기 때문에 서비스 다운 타임을 막을 수 있다.

물론 이 외에도 여러가지 배포 방식을 지원한다.
- 한 번에 모든 Pod들을 죽이고 새로운 Pod를 생성하는 방식
- Pod를 시험적으로 생성해 본 후 문제가 없다면 새로운 Pod로 이전을 시작하는 방식

#### Ingress

위에서 다운 타임을 막으려면 반드시 복수의 Pod가 필요했음을 눈치챘을 것이다. 이 Pod 들이 전부 서비스 중이라면,
Service는 어떤 Pod로 요청을 가져다 주어야 하는 지 어떻게 알 수 있을까? 이 역할을 해주는 것이 Ingress(즉, 로드 벨런서)다.


## kubectl

쿠버네티스 CLI다. 명령어가 무진장 많다. [여기서](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands)
명령어들을 검색해 볼 수 있다.

### Tips

`kubectl`라는 명령어가 꽤 길다보니, 불편해 하는 사람들이 생겼다. 그래서
[여기서는](https://github.com/ahmetb/kubectl-aliases) 아예 그런 사람들을 위한 shell aliases 를 수백가지나 제공한다.

위 README의 Installation 참고해서 아래 스크립트를 만들었으니 그냥 실행해주자.

```bash
cd ~ && \
  wget https://raw.githubusercontent.com/ahmetb/kubectl-alias/master/.kubectl_aliases && \
  echo '[ -f ~/.kubectl_aliases ] && . ~/.kubectl_aliases' >> ~/.zshrc && \
  echo 'function kubectl() { echo "+ kubectl $@">&2; command kubectl $@; }' >> ~/.zshrc && \
  . ~/.zshrc
```

### 자주 쓰이는 명령어들
여긴 차차 써내려 가야겠다.


#### Context
```bash
k config get-contexts // 컨택스트 리스트 확인
k config current-context // 현재 컨텍스트 확인
k config use-context CONTEXT_NAME // CONTEXT_NAME 컨텍스트 사용
```

#### Secret
secret 목록 확인
```bash
k get secret  
```
`credentials-2265h296mg` 이건 secret 이름, output형식은 json 등도 가능
```bash
k get secret credentials-2265h296mg -o yaml
```

#### Pod
```bash
k get pods // Pod 확인
```

#### Kustomize

kustomization.yaml이 있는 폴더에서 아래 명령어를 실행시키면 config map을 볼 수 있다.
```bash
k kustomize .
```

