# Kubernetes networking

![](https://subicura.com/assets/article_images/2019-05-19-kubernetes-basic-1/kubernetes-logo.png)

## Service

밖에서는 감춰져서 안보이는 `Pod`를 위해 외부 인터페이스를 뚫어주는 녀석이 바로 `Service`다.
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

`ClusterIP` 는 클러스터 내부 에서 Pod 끼리 통신해야 하는 경우에 쓰인다. `spec`의 `type`을 지정하지 않은 경우의 기본 값이다.
`targetPort`는 지정하지 않는 경우 `port`와 같은 값을 쓰는데, 각각 컨테이너의 포트와 서비스의 포트를 의미한다.
즉, 서비스의 `port`(80) 포트로 들어가는 모든 트래픽은 컨테이너의 `targetPort`(80) 포트로 포워딩 된다.  

서비스가 잘 노출되는지 확인해보려면 `busybox` 같은 간단한 컨테이너를 띄워서 Cluster IP에 `curl`이나 `wget` 같은 걸로
포트로 서비스가 되고 있는지 확인해 볼 수 있다.

외부에서 접속도 안되는 거 왜 사용할까? 짐작하는 대로 실서비스에서는 사용되지 않는다. 디버깅용으로 열거나, 내부용 대시보드를 서비스할 때 사용된다.

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

`NodePort`는 말그대로 Node 의 물리적인 포트를 열어버리겠다는 것이다. 이는 서비스에 외부 트래픽을 직접 전달할 수 있는 가장 원시적인 방법이다.
노드를 만약 3개 운영하고 있다고 했을 때, `NodePort` 로 30080 번 포트를 열어버리면 모든 노드 IP의 30080번 포트가 열리게 된다
(`nodePort`는 30000~32767 사이에 있는 숫자여야 하는데, 보통은 비워둠으로써 K8s가 알아서 선택하도록 한다).

노드들의 External IP는 다음과 같이 확인해 볼 수 있다. `curl` 같은 걸 날렸을 때 forbidden이 뜬다면 방화벽 정책을 살펴봐야 한다.

```bash
k get nodes -o wide
```

만약 노드를 3개 운영하고 있어서, 각각 IP주소가 `1.1.1.1`, `1.1.1.2`, `1.1.1.3` 이라면
`1.1.1.1:30080`, `1.1.1.2:30080`, `1.1.1.3:30080` 로 들어오는 트래픽은 모조리 `sample-node-app` 으로 포워딩된다.

다음과 같은 단점이 있다:

- 포트당 한 서비스만 사용할 수 있다
- 포트 제약사항(30000~32767) 
- Node의 IP 주소가 바뀌면 이를 반영해야 한다

이런 이유로, 데모앱을 잠시 띄워놓을 때나 사용한다.

### LoadBalancer

`NodePort`의 확장이다. `NodePort`가 노드의 물리적인 IP 주소와 포트로 직접 접속해야 한다는 한계점이 있다면,
`LoadBalancer`는 새로운 IP를 할당받고, 원하는 Port를 매핑까지 해준다.

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

`LoadBalancer`로 서비스를 노출하는 건 이상한 일이 아니지만,
노출하고자 하는 각 서비스 마다 자체의 IP 주소를 갖게 되고 노출하는 서비스 마다 LoadBalancer 비용을 지불해야 하기 때문에 값이 비싸진다는 단점이 있다.

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

## Ingress

`Ingress`는 `Service`의 한 종류가 아니다. 오히려 `Ingress`를 사용하려면 `Service`인 `NodePort`나 `LoadBalancer`가 미리 열려있어야 하고
`Ingress`는 이러한 `Service`들 앞에서 스마트 라우터(smart router) 역할을 하거나 클러스터의 진입점(entrypoint) 역할을 한다.
GKE의 기본 ingress controller 는 Http(s) Load balancer를 만들어 주는데, 백엔드 서비스 경로 기반이나 서브 도메인 기의 라우팅을 모두 지원한다.


```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: tomcat-http-go-ingress
spec:
  tls:
  - hosts:
    - tomcat.happynut.com
    - http-go.happynut.com
    secretName: tls-secret
  rules:
  - host: tomcat.happynut.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: tomcat-svc
            port:
              number: 80
  - host: http-go.happynut.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: http-go-svc
            port:
              number: 80
```

위 예제에서는 `tomcat.happynut.com` 로 오는 트래픽은 `tomcat-svc` 로, `http-go.happynut.com`로 오는 트래픽은 `http-go.happynut.com`으로 포워딩한다.

요즘에 자주쓰이는 Istio 도 Ingress controller 다.

Google Cloud Load Balancer와 Nginx, Contour, Istio 등과 같은 많은 Ingress 컨트롤러 타입이 있다.
그리고 SSL 인증서를 서비스에 자동으로 프로비저닝해 주는 cert-manager 같은 Ingress 컨트롤러 플러그인도 많다.


## DNS

`Service`를 생성하면, 대응되는 DNS 엔트리가 생성된다. 이 엔트리는 다음과 같은 형식을 가진다.

```
[Service 이름].[Namespace 이름].svc.cluster.local
```

이게 가능한 이유는 `CoreDNS` 가 (`Pod`의 형태로)Cluster 안에 떠 있기 떄문이다. `kubelet`은 `Pod` 를 생성할 때 `/etc/resolv.conf` 같은 곳에
`CoreDNS` 의 주소를 적어서 도메인 요청을 받을 경우 `CoreDNS` 에서 질의하도록 한다.

즉, 아래와 같이 조회하는 경우 볼 수 있는 `10.32.0.10` 라는 Cluster IP는 `Pod` 에서도 확인이 되어야 한다.

```
$ k -n kube-system get svc kube-dns
NAME       TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)         AGE
kube-dns   ClusterIP   10.32.0.10   <none>        53/UDP,53/TCP   3h33m
```

아래와 같이 말이다:

```
$ k run -it --rm --image busybox -- bash
nameserver 10.32.0.10
search default.svc.cluster.local svc.cluster.local cluster.local asia-northeast3-c.c.happynut-gke-test.internal c.happynut-gke-test.internal google.internal
options ndots:5
```

위 설정 파일에 나와 있는 것처럼, `cluster.local`을 붙여보고 못찾으면 `svc.cluster.local`, 그래도 못찾으면 `default.svc.cluster.local` 이런 식으로
이름을 붙여가면서 조회하기 때문에 `.svc.cluster.local` 는 생략이 가능하다.
