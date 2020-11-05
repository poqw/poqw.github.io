# Kubernetes (a.k.a k8s)

![](https://subicura.com/assets/article_images/2019-05-19-kubernetes-basic-1/kubernetes-logo.png)

[쿠버네티스](https://kubernetes.io/) 에 대해 알아보자.

## 얘는 뭘까

쿠버네티스는 컨테이너화된 애플리케이션을 배포하기 위한 오픈 소스 오케스트레이터다. 다음과 같은 특징을 가지고 있다.

- 간단한 선언 구문을 사용하여 애플리케이션을 정의하고 배포할 수 있게 해주는 오케스트레이션 API를 제공한다.
- 쿠버네티스 클러스터는 오류가 있는 경우 애플리케이션을 복구하는 수많은 온라인 자가 재해 복구 알고리즘을 자체적으로 제공한다.
- 쿠버네티스 API는 소프트웨어 무중단 업데이트를 더욱더 쉽게 수행할 수 있게 배포하며,
  서비스의 여러 레플리카 간에 트래픽을 쉽게 분산할 수 있는 로드 벨런싱 기능을 제공한다.
- 쿠버네티스는 서비스의 네이밍과 검색을 위한 툴을 제공하므로 느슨하게 결합한 마이크로 서비스 아키텍쳐를 구축할 수 있다.

## 얘는 왜 쓸까

MSA(Micro Service Architecture)가 유행하기 시작하면서, 많게는 수백 수천개에 해당하는 프로젝트들을 운영하기란 쉽지 않은 일이 되고 말았다.
다행이 [Docker](../docker/docker)의 등장 덕분에 Container 단위의 배포는 할 수 있었지만 Container 사이의 네트워킹이나 로드벨런싱 같은 문제점들을 일일이 해결해 주기가 여간 까다로운 게 아니었다.
개발자들은 이런 어렵고 귀찮은 일들을 싫어하기 때문에, 이들을 지속적이고 탄력적으로 배포 및 관리하기 위한 오케스트레이션 툴을 원했고,
그 중에서도 믿을만한 구글이 열심히 개발해준 결과 k8s 라는 멋진 툴이 탄생했고 devOps의 전유물이었던 시스템 운영이 개발자도 손쉽게 할 수 있는 세상으로 변하게 되었다.

## 구성 요소들

### Cluster

쿠버네티스에서 관리하는 가장 큰 단위다. 즉, 여러 서버를 하나로 묶어놓은 것.
정확한 정의는 쿠버네티스가 최종 사용자에게 줄 수 있는 전체 컴퓨팅 리소스를 제공하기 위해 함께 작동하는 여러 시스템 묶음을 말한다.

#### 작동 방식

클러스터 내부에는 실제로 서비스를 담당하는 worker node와 이 worker node들을 관리하는 master node가 있다.

### Node

1개의 노드는 곧 한 개의 물리(혹은 가상) 서버를 의미한다.

## 쿠버네티스 오브젝트들

### Pod

`Pod`는 이렇게 **하나 이상의 컨테이너를 감싸고 있는 래퍼**(wrapper)다.

다시 말해 [Docker](../docker/docker) 로 우리가 만든 어플리케이션의 이미지를 만들어 Docker 허브에 올려놓았다면
그 이미지를 이용해 `Pod`를 생성할 수 있다.

쿠버네티스에서는 `Pod`를 언제든지 버리고 새로 만들 수 있는 녀석으로 본다.

> `Pod` 는 보통 direct 하게 Pod 으로만 쓰이는 일은 거의 없다. Deployment 에 포함된 ReplicaSet 의 템플릿에 선언되는 형식이 가장 많이 쓰인다.

#### Config Pod

예를 들어 컨테이너 image 를 미리 [docker hub 에 올려두었다](https://hub.docker.com/repository/docker/happynut/sample-node-app) 고 해보자.
`Pod`는 아래와 같이 만들 수 있다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: sample-node-app
spec:
  containers:
  - name: sample-node-app
    image: happynut/sample-node-app:0.0.1
```

헷갈리니 미리미리 각 항목별로 짚고 넘어가면 좋을 것 같다.

- `apiVersion`: `v1` 혹은 `apps/v1` 따위의 값을 넣어준다. 이는 `kind` 에 선언할 객체에 대한 API를 제공하는 API group 이름과 version 을 합친 문자열이다.
그룹을 지정하지 않으면 `core`그룹을 사용한다.
- `kind`: 어떤 종류의 쿠버네티스 오브젝트인지 적는다. `Pod`, 'ReplicaSet', 'Deployment' 등등의 값이 들어갈 수 있다. 대소문자를 구별해야 한다.
- `metadata`: 해당 오브젝트에 대한 정보이다. 나중에 이 `Pod` 를 실행했을 때, `name`에 넣어준 값이 `Pod`의 이름이 된다.
- `spec.containers`: `Pod` 는 여러 컨테이너를 포함할 수 있으므로, 그에 관한 스펙들을 적는다.  

#### Run Pod

작성한 파일이 `pod.yaml` 이라면, 이 파일을 인자로 주어 `Pod`를 생성한다.

```bash
k apply -f pod.yaml
```

다음 명령어로 생성된 `Pod`을 확인해볼 수 있다.

```bash
k get all
```

결과는 다음과 같다.

```
NAME                  READY   STATUS    RESTARTS   AGE
pod/sample-node-app   1/1     Running   7          7m43s

NAME                 TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
service/kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   65m
```

`Pod` 은 어차피 외부에서 접속이 안되므로 외부 인터페이스를 뚫어주기 위해서는 `Service`를 같이 동반해주어야 한다. 그러나
때때로 디버깅을 위해 `Pod` 에 직접 접속해서 로그를 살펴보고 싶을 수도 있다. 이때는 다음과 같은 명령어를 사용한다.

```bash
k exec -it sample-node-app sh
```

#### Pod 는 왜 만들었나

Pod 는 그 자체로 무언가 대단한 하나의 오브젝트라기 보단, 아주 작은 부속품 정도로 생각하는 게 편하다. 당장에 어떤 서비스가 뻗었을 때 새로운 서비스를
곧바로 띄우는 코드를 상상해보자. 서비스를 실행하는 단위가 필요하다고 느껴질 것이다. 그 단위가 바로 `Pod` 가 된다.

### Service

위의 `Pod`에서 설명했듯, 밖에서는 감춰져서 안보이는 `Pod`를 위해 외부 인터페이스를 뚫어주는 녀석이 바로 `Service`다.
그러기 위해 `Service`는 고정적인 가상 IP를 받고, 이 `Service`를 참조하면 자신이 관리하는 `Pod`에 연결해준다.
이 때, `Pod` 은 `selector` 를 통해 찾고, `Pod`은 `selector`에 잡히기 위해 `label`을 사용한다.

#### Config Service

위 `Pod` 섹션에 만들어 놓은 `Pod`가 여전히 떠 있는 상황이라고 했을 때, 아래와 같이 설정해볼 수 있다.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: sample-node-app
spec:
  selector:
    app: sample-node-app
  ports:
    - name: http
      port: 80
      nodePort: 30080
  type: NodePort
```

`Pod`에서는 보지 못했던 항목들이 몇 개 추가되었다. 짚고 넘어가보자.

- `selector`: `app` 에 지정한 이름으로 Cluster 안에서 어떤 Pod 에게 인터페이스를 뚫어줘야 하는지를 찾는다.
- `ports`: 포트에 관한 설정 정보를 적는다. 이 때, `nodePort`는 30000 보다 큰 숫자여야 한다.
- `type`: `ClusterIP`, `NodePort`, `LoadBalancer`, `ExternalName` 같은 값이 들어갈 수 있는데,
`ClusterIP` 는 클러스터 내부 접근용이고, 외부용이 바로 `NodePort` 이다.

#### Run Service

작성한 파일이 `service.yaml` 이라면, 이 파일을 인자로 주어 `Service`를 생성한다.

```bash
k apply -f service.yaml
```

`k get all` 로 확인한 결과는 다음과 같다.

```
NAME                  READY   STATUS    RESTARTS   AGE
pod/sample-node-app   1/1     Running   7          46m

NAME                      TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
service/kubernetes        ClusterIP   10.96.0.1        <none>        443/TCP        104m
service/sample-node-app   NodePort    10.108.189.209   <none>        80:30080/TCP   3s
```

이 상태로 실행하면 안되고, `Pod` 을 아래처럼 `labels`를 추가해 주어야 한다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: sample-node-app
  # 추가된 부분. Service의 selector 에서 이 녀석을 찾는다. 키 값은 꼭 app 이 아니어도 상관 없다.
  # 다만 여길 변경하면 Service 의 selector 쪽도 변경해주어야 한다.
  labels:
    app: sample-node-app
spec:
  containers:
  - name: sample-node-app
    image: happynut/sample-node-app:0.0.1
```

> 나는 `minikube` 로 해보고 있었기 때문에 `minikube service sample-node-app` 로 터널링해서 접속해 볼 수 있었다.

### ReplicaSet

`Pod`는 언제라도 죽을 수 있다. 이 녀석을 다시 살리기 위해 직접 관리자가 접속해서 부팅해줘야 할까? 아니다. 우리에겐 `ReplicaSet` 이 있기 때문이다.

`ReplicaSet`은 직접적으로 Pod들을 관리하고, 언제든지 문제가 생긴 `Pod`를 버리고 새로운 `Pod`를 (여러개도 가능) 만들어 내는 일명 `Pod` 공장이다.
`ReplicaSet`이 `Pod`를 만들어내기 위해서는 `Pod`를 생성하기 위해 필요한 정보를 자신이 가지고 있어야 하는데, 이 정보를 spec의 `template`에 담는다.

### Config ReplicaSet

`pod.yaml`은 더 이상 필요 없어졌다. `ReplicaSet` 이 이미 그에 대한 명세를 가지기 때문이다. 그것도 `Pod` 을 언데드 버전으로 업그레이드 시켜서 말이다.
이름을 `pods.yaml`로 바꿔주고, 다음과 같이 수정하자.

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: sample-node-app
spec:
  selector:
    matchLabels:
      app: sample-node-app
  replicas: 3
  template:
    metadata:
      labels:
        app: sample-node-app
    spec:
      containers:
      - name: sample-node-app
        image: happynut/sample-node-app:0.0.1
```

짚고 넘어가야 할 점은 아래와 같다:

- `metadata`: `name` 은 지금 `ReplicaSet`이 `Pod`을 관리하는 것처럼 상위에서 알아낼 수 있는 것이 아니라면 명시해주어야 한다.
- `selector`: `selector` 가 여기서도 등장한다. `Service`의 `selector` 와 동작방식은 같으나 이름만 `matchLabels`로 바뀌었다.
- `replicas`: 일하고 있는 `Pod` 이 뻗으면 달려나가 그 일을 대신해줄 친구들을 몇 명 준비할까에 관한 것이다.
- `template`: `Pod` 공장에 쓰일 `Pod`의 설계도면이다. `pod.yaml`에 작성했던 내용과 매우 비슷하다. 단지 `name`이 제거되었을 뿐이다.
이 스펙에서 `labels`는 `Service`와 `ReplicaSet` 둘 다에게 필요하므로 명시한다.   

### Run ReplicaSet

`k apply -f .` 로 해당 폴더에 있는 모든 yaml 파일들을 적용할 수 있다. `k get all` 로 결과를 확인해보면:

```
NAME                        READY   STATUS    RESTARTS   AGE
pod/sample-node-app         1/1     Running   8          5h32m
pod/sample-node-app-bwx6h   1/1     Running   0          13s
pod/sample-node-app-t4826   1/1     Running   0          13s

NAME                          TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
service/kubernetes            ClusterIP   10.96.0.1       <none>        443/TCP          6h30m
service/sample-node-service   NodePort    10.100.78.169   <none>        3000:30080/TCP   4h9m

NAME                              DESIRED   CURRENT   READY   AGE
replicaset.apps/sample-node-app   3         3         3       13s
```

`k delete po sample-node-app-bwx6h` 이 명령어로 가운데 녀석을 없애버리면, 금방 새로운 녀석이 생성되어 다운타임이 생기지 않는 걸 확인해 볼 수 있다.

```
NAME                        READY   STATUS    RESTARTS   AGE
pod/sample-node-app         1/1     Running   8          5h46m
pod/sample-node-app-2w9vv   1/1     Running   0          23s
pod/sample-node-app-t4826   1/1     Running   0          13m

NAME                          TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
service/kubernetes            ClusterIP   10.96.0.1       <none>        443/TCP          6h43m
service/sample-node-service   NodePort    10.100.78.169   <none>        3000:30080/TCP   4h22m

NAME                              DESIRED   CURRENT   READY   AGE
replicaset.apps/sample-node-app   3         3         3       13m
```

### Deployment

만약 새로운 버전의 앱을 배포해야 한다면? 지금 떠있는 Pod들을 다 죽이고 새로 생성한다? 이렇게 되면 서비스 다운 타임이 생기게 된다.
이를 다운 타임이 없도록 해주는 게 Deployment다. ReplicaSet이 Pod을 템플릿으로 가지고 있다면, Deployment는 ReplicaSet을 템플릿으로 가지고 있다.

만약 새로운 버전을 배포해야 한다면, Deployment는 자신이 가진 템플릿으로 새로운 버전의 ReplicaSet을 만들어내고,
순차적으로 이전의 Pod들을 죽이고 새로운 Pod들을 띄우기 때문에 서비스 다운 타임을 막을 수 있다.

이를 롤링 업데이트라 한다.

물론 이 외에도 여러가지 배포 방식을 지원한다.

- 한 번에 모든 Pod들을 죽이고 새로운 Pod를 생성하는 방식
- Pod를 시험적으로 생성해 본 후 문제가 없다면 새로운 Pod로 이전을 시작하는 방식

#### Config Deployment

`Deployment` 는 `ReplicaSet`과 구조가 거의 동일하다. 실제로 아래에서 바뀐 것은 `kind` 밖에 없다. 

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sample-node-app
spec:
  selector:
    matchLabels:
      app: sample-node-app
  replicas: 3
  template:
    metadata:
      labels:
        app: sample-node-app
    spec:
      containers:
      - name: sample-node-app
        image: happynut/sample-node-app:0.0.1
```

먼저 `k delete rs sample-node-app` 명령어로 원래 만들어 두었던 ReplicaSet 을 없애자.
그 다음 `k apply -f .` 로 현재 상태를 적용한뒤 `k get all` 로 상태를 확인해보면 다음과 같다.

#### Run Deployment

```
NAME                                   READY   STATUS    RESTARTS   AGE
pod/sample-node-app-8555cb8b6b-7cdgg   1/1     Running   0          3m5s
pod/sample-node-app-8555cb8b6b-t9zxm   1/1     Running   0          3m5s
pod/sample-node-app-8555cb8b6b-z6n4j   1/1     Running   0          3m5s

NAME                          TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
service/kubernetes            ClusterIP   10.96.0.1       <none>        443/TCP          20h
service/sample-node-service   NodePort    10.100.78.169   <none>        3000:30080/TCP   17h

NAME                              READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/sample-node-app   3/3     3            3           3m5s

NAME                                         DESIRED   CURRENT   READY   AGE
replicaset.apps/sample-node-app-8555cb8b6b   3         3         3       3m5s
```

선언해 준 적도 없는 `Replicaset`이 생겨버렸다. 이로써 `Deployment` 는 `ReplicaSet` 을 템프릿으로 가지고 있다는 것을 알 수 있다.

#### Deployment 는 왜 쓰는가

당연히 무중단 업데이트를 위해서 쓰인다. 아래처럼 `containers` 의 이미지 버전을 올려보자. 이미지는 미리 올려두었다.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sample-node-app
spec:
  selector:
    matchLabels:
      app: sample-node-app
  replicas: 3
  template:
    metadata:
      labels:
        app: sample-node-app
    spec:
      containers:
      - name: sample-node-app
        image: happynut/sample-node-app:0.0.2
``` 

`k apply -f .` 로 적용해준 뒤, `k rollout status deploy sample-node-app` 를 통해 배포할 수 있다.

### Ingress

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

