# 쿠버네티스 오브젝트들

![](https://subicura.com/assets/article_images/2019-05-19-kubernetes-basic-1/kubernetes-logo.png)

## Pod

`Pod`는 이렇게 **하나 이상의 컨테이너를 감싸고 있는 래퍼**(wrapper)다.

다시 말해 [Docker](../docker/docker) 로 우리가 만든 어플리케이션의 이미지를 만들어 Docker 허브에 올려놓았다면
그 이미지를 이용해 `Pod`를 생성할 수 있다.

쿠버네티스에서는 `Pod`를 언제든지 버리고 새로 만들 수 있는 녀석으로 본다.

> `Pod` 는 보통 direct 하게 Pod 으로만 쓰이는 일은 거의 없다. Deployment 에 포함된 ReplicaSet 의 템플릿에 선언되는 형식이 가장 많이 쓰인다.

참고로, 한 개의 `Pod`에 두 개 이상의 컨테이너를 포함하는 일은 드물다. 스케일링하게 되면 불필요한 리소스까지 확장되어 지기 때문이다.
따라서 두 개 이상의 컨테이너를 하나의 `Pod`에 배치하려면 같이 스케일링 되어야 하는가? 하는 질문을 항상 염두에 두어야 한다.
여기에 해당되는 예시로, 로그 백업서버, 사이드카 등등이 있다.

### Config Pod

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

### Run Pod

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

### Liveness, Readiness, Startup probe

Pod 는 그 자체로 무언가 대단한 하나의 오브젝트라기 보단, 아주 작은 부속품 정도로 생각하는 게 편하다. 당장에 어떤 서비스가 뻗었을 때 새로운 서비스를
곧바로 띄우는 코드를 상상해보자. 서비스를 실행하는 단위가 필요하다고 느껴질 것이다. 그 단위가 바로 `Pod`이 된다. 뿐만 아니라,
스케일링을 하기 위한 최소 단위가 되기도 한다.

그렇다면 '어떤 서비스가 뻗는다'는 건 어떻게 확인할 수 있을까? 사람이 온종일 들여다보고 있을 순 없으니, `Probe` 라는 걸 사용한다.
즉, 주기적으로 컨테이너나 앱의 상태를 체크해보는 것이다. `Probe` 의 종류와 용도는 다음과 같다.

* `livenessProbe`: 컨테이너의 상태를 확인한다. 교착상태에 있는 컨테이너를 발견하고 재시작한다.
* `readinessProbe`: 앱 서비스의 상태를 확인한다. 앱 서비스가 활성화 되기 전까지 로드밸런싱을 비활성화 한다.
* `startupProbe`: 앱 서비스가 시작되었는지를 확인한다. 서비스 시작을 감지하기 전까지 `livenessProbe` 와 `readinessProbe`를 비활성화한다.

아래 예시에서는 `livenessProbe` 가 정의되었는데, `Probe` 를 보내기 전 3초간 기다린 후 3초마다 `/healthz`에 요청을 보내
200 OK 응답이 떨어지는지 확인한다. 만약 500 응답코드 같이 에러를 받게 되면 `kubelet` 은 이 컨테이너를 부수고 새로 만든다. 

```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    test: liveness
  name: liveness-http
spec:
  containers:
  - name: liveness
    image: k8s.gcr.io/liveness
    args:
    - /server
    livenessProbe:
      httpGet:
        path: /healthz
        port: 8080
        httpHeaders:
        - name: Custom-Header
          value: Awesome
      initialDelaySeconds: 3
      periodSeconds: 3
```

## Service

위의 `Pod`에서 설명했듯, 밖에서는 감춰져서 안보이는 `Pod`를 위해 외부 인터페이스를 뚫어주는 녀석이 바로 `Service`다.
그러기 위해 `Service`는 고정적인 가상 IP를 받고, 이 `Service`를 참조하면 자신이 관리하는 `Pod`에 연결해준다.
이 때, `Pod` 은 `selector` 를 통해 찾고, `Pod`은 `selector`에 잡히기 위해 `label`을 사용한다.

### Config Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: sample-node-app
spec:
  type: ClusterIP # ...
  sessionAffinity: ClientIP
  selector:
    app: sample-node-app
  ports:
    - name: http
      port: 80 
```

- `selector`: `app` 에 지정한 이름으로 Cluster 안에서 어떤 `Pod` 에게 인터페이스를 뚫어줘야 하는지를 찾는다.
- `ports`: 포트에 관한 설정 정보를 적는다. 이 때, `nodePort`는 30000~32767 사이에 있는 숫자여야 한다.
- `type`: `ClusterIP`, `NodePort`, `LoadBalancer`, `ExternalName` 같은 값이 들어갈 수 있는데, 아래에서 자세히 설명한다.

`Service`가 담당하고 있는 `Pod`이 여러개 라면 기본적으로 트래픽을 라운드 로빈 방식을 통해 분산한다. 그러나 Http 웹 페이지같은
정적 사이트는 cookie나 sessions을 이용하는데, 이러한 인증데이터를 발급하지 않았던 새로운 `Pod`으로 트래픽이 분산되면
클라이언트 인증에 혼란이 생긴다. 따라서 `sessionAffinity` 를 `ClientIP`로 설정(기본값은 `None`이다)하여 클라이언트의 IP를 구분, 항상 같은 `Pod`에 붙도록 설정할 수 있다.
  
#### ClusterIP

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
      targetPort: 80
```

`ClusterIP` 는 클러스터 내부 에서 Pod 끼리 통신해야 하는 경우에 쓰인다. `type`을 지정하지 않은 경우의 기본 값이다.
`targetPort`는 지정하지 않는 경우 `port`와 같은 값을 쓰는데, 각각 컨테이너의 포트와 서비스의 포트를 의미한다.

서비스가 잘 노출되는지 확인해보려면 `busybox` 같은 간단한 컨테이너를 띄워서 Cluster IP에 `curl`이나 `wget` 같은 걸로
포트로 서비스가 되고 있는지 확인해 볼 수 있다.

### NodePort

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

`NodePort`는 말그대로 Node 의 물리적인 포트를 열어버리겠다는 것이다. `ClusterIP`의 확장이라고 보면 된다.
노드를 만약 3개 운영하고 있다고 했을 때, `NodePort` 로 30080 번 포트를 열어버리면 모든 노드 IP의 30080번 포트가 열리게 된다.

노드들의 External IP는 다음과 같이 확인해 볼 수 있다. `curl` 같은 걸 날렸을 때 forbidden이 뜬다면 방화벽 정책을 살펴봐야 한다.

```bash
k get nodes -o wide
```

### LoadBalancer

`NodePort`의 확장이다. `NodePort`가 노드의 물리적인 IP 주소와 포트로 직접 접속해야 한다는 한계점이 있다면,
`LocasBalancer`는 새로운 IP를 할당받고, 원하는 Port를 매핑까지 해준다.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: sample-node-app
spec:
  selector:
    app: sample-node-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  clusterIP: 10.0.171.239
  type: LoadBalancer
```

### Run Service

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

## ReplicaSet

`Pod`는 언제라도 죽을 수 있다. 이 녀석을 다시 살리기 위해 직접 관리자가 접속해서 부팅해줘야 할까? 아니다. 우리에겐 `ReplicaSet` 이 있기 때문이다.

`ReplicaSet`은 직접적으로 Pod들을 관리하고, 언제든지 문제가 생긴 `Pod`를 버리고 새로운 `Pod`를 (여러개도 가능) 만들어 내는 일명 `Pod` 공장이다.
`ReplicaSet`이 `Pod`를 만들어내기 위해서는 `Pod`를 생성하기 위해 필요한 정보를 자신이 가지고 있어야 하는데, 이 정보를 spec의 `template`에 담는다.

## Config ReplicaSet

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

## Run ReplicaSet

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

## Deployment

만약 새로운 버전의 앱을 배포해야 한다면? 지금 떠있는 Pod들을 다 죽이고 새로 생성한다? 이렇게 되면 서비스 다운 타임이 생기게 된다.
이를 다운 타임이 없도록 해주는 게 Deployment다. ReplicaSet이 Pod을 템플릿으로 가지고 있다면, Deployment는 ReplicaSet을 템플릿으로 가지고 있다.

만약 새로운 버전을 배포해야 한다면, Deployment는 자신이 가진 템플릿으로 새로운 버전의 ReplicaSet을 만들어내고,
순차적으로 이전의 Pod들을 죽이고 새로운 Pod들을 띄우기 때문에 서비스 다운 타임을 막을 수 있다.

이를 롤링 업데이트라 한다.

물론 이 외에도 여러가지 배포 방식을 지원한다.

- 한 번에 모든 Pod들을 죽이고 새로운 Pod를 생성하는 방식
- Pod를 시험적으로 생성해 본 후 문제가 없다면 새로운 Pod로 이전을 시작하는 방식

### Config Deployment

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

참고로, 컨테이너에 환경변수를 심는 것도 Deployment 에서는 매우 간단하다. 다음과 같이 `env` 값을 주면 된다.

```yaml
apiVersion: apps/v1
kind: Deployment
# ...
spec:
  # ...
  template:
    # ...
    spec:
      containers:
      - name: sample-node-app
        image: happynut/sample-node-app:0.0.1
        env:
        - name: SOME_ENV_KEY
          value: SOME_ENV_VALUE
```

### Run Deployment

먼저 `k delete rs sample-node-app` 명령어로 원래 만들어 두었던 ReplicaSet 을 없애자.
그 다음 `k apply -f .` 로 현재 상태를 적용한뒤 `k get all` 로 상태를 확인해보면 다음과 같다.

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

### Deployment 는 왜 쓰는가

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
        # 버전을 올렸다!
        image: happynut/sample-node-app:0.0.2
``` 

이후, `k apply -f .` 로 적용해준 뒤, `k rollout status deploy sample-node-app` 를 통해 배포할 수 있다.

### Private registry 에서 이미지를 받아오는 경우

지금까지 만들었던 파일에서 container image(`happynut/sample-node-app:0.0.1`)는 public 하게 등록되어 있었다.
그러나 실제 제품에선 private 하게 등록된 이미지를 사용할 가능성이 높다.

private 하게 등록한 이미지를 사용하기 위해선 당연히 획득권한을 얻어올 수 있는 인증과정이 필요하고, 그 인증 과정은 다음과 같이 이루어진다.

1. K8s 에 secret을 생성한다.
2. deployments yaml 파일에 `imagePullSecrets` 필드를 통해 해당 secret 이름을 지정한다.
3. 매번 이미지 풀링이 필요할 떄마다 해당 필드를 참고하여 인증한뒤, 이미지를 획득한다.

우선 k8s 에 secret을 생성하려면 다음 명령어를 사용한다. 참고: [링크](https://kubernetes.io/ko/docs/concepts/configuration/secret/#%EB%8F%84%EC%BB%A4-%EC%BB%A8%ED%94%BC%EA%B7%B8-%EC%8B%9C%ED%81%AC%EB%A6%BF)

```bash
kubectl create secret docker-registry <your-secret-name> \
  --docker-server=<your-registry-server>\
  --docker-username=<your-name>\
  --docker-password=<your-pword>\
  --docker-email=<your-email>
```

위 명령어를 통해 `kubernetes.io/dockerconfigjson` 타입으로 시크릿이 k8s에 저장된다.
이제 아래 파일처럼 `imagePullSecrets` 필드를 포함하여 `Deployment` 를 구성한다.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sample-node-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: sample-node-app
  template:
    metadata:
      labels:
        app: sample-node-app
    spec:
      containers:
        - name: sample-node-app
          image: "happynut/sample-node-app:0.0.2"
      imagePullSecrets:
        - name: container-reg-cred # 내가 위에서 설정했던 <your-secret-name>
```

## Ingress

위에서 다운 타임을 막으려면 반드시 복수의 Pod가 필요했음을 눈치챘을 것이다. 이 Pod 들이 전부 서비스 중이라면,
Service는 어떤 Pod로 요청을 가져다 주어야 하는 지 어떻게 알 수 있을까? 이 역할을 해주는 것이 Ingress(즉, 로드 벨런서)다.
