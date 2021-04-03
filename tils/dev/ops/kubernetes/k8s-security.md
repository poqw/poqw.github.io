# Kubernetes security

![](https://subicura.com/assets/article_images/2019-05-19-kubernetes-basic-1/kubernetes-logo.png)

## K8s 환경에서의 해킹

해커가 K8s에 운영중인 서비스를 해킹하는 시나리오를 상상해보자. 서비스는 결국 Pod로 띄워져 있을 것이고 애플리케이션을 서빙하는 프로세스가
컨테이너 안에서 돌고 있을 것이다. 해커는 injection을 하든, 악성코드를 심든 쉘을 컨테이너에 띄우려고 노력을 할 것인데,
이 공격에 성공하게 되면 애플리케이션을 서빙중인 프로세스의 자식 프로세스로 `sh`같은 걸 띄우게 될 것이다. 그리고 권한 상승을 위해
`sudo` 같은 명령어를 사용하게 된다면, 해커가 해당 서비스 시스템을 완전히 장악해버리게 된다.

더 심각한 건, K8s에 아무런 설정도 하지 않을 경우 해커가 쉘을 탈취하는 순간 곧바로 root 권한이 떨어진다는 것이다.

개발자가 개발하면서 취약점이 전무한 완벽한 애플리케이션을 만들기는 어렵기 때문에, K8s에서는 위와 같은 침해사고가 일어나더라도
권한을 축소시켜버림으로써 피해를 최소화 하는 해결책을 제시한다.

## SecurityContext

권한을 축소시키기 위한 방법으로, SecurityContext 가 있다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: security-context-demo
spec:
  securityContext:
    runAsUser: 1000
    runAsGroup: 3000
    fsGroup: 2000
  volumes:
  - name: sec-ctx-vol
    emptyDir: {}
  containers:
  - name: sec-ctx-demo
    image: busybox
    command: [ "sh", "-c", "sleep 1h" ]
    volumeMounts:
    - name: sec-ctx-vol
      mountPath: /data/demo
    securityContext:
      allowPrivilegeEscalation: false
```

`runAsUser` 는 UID, `runAsGroup`는 GID 를 의미한다. 0 이 root를 의미하므로, 1000, 2000 인 경우에는 권한이 훨씬 약하다고 볼 수 있다.
가장 아래에 `allowPrivilegeEscalation`같은 경우에는 권한 상승을 막아버리는 옵션이다.

## NetworkPolicy

이 외에도, 서비스 중인 민감한 DB에서 나오는 응답은 특정 IP에게만 전달되도록하거나, 요청 역시 특정 IP에서만 가능하도록 하는 네트워크 정책을 설정하는 걸 생각해볼 수 있다.

Pod 안으로 들어오는 요청들은 Ingress, 밖으로 나가는 요청들은 Egress 라고 하는데, 각각 따로 설정할 수 있다. 

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: test-network-policy
  namespace: default
spec:
  podSelector:
    matchLabels:
      role: db
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - ipBlock:
        cidr: 172.17.0.0/16
        except:
        - 172.17.1.0/24
    - namespaceSelector:
        matchLabels:
          project: myproject
    - podSelector:
        matchLabels:
          role: frontend
    ports:
    - protocol: TCP
      port: 6379
  egress:
  - to:
    - ipBlock:
        cidr: 10.0.0.0/24
    ports:
    - protocol: TCP
      port: 5978
```

`policyTypes` 에 특정 타입을 입력하면, **All deny가 default 로 설정**되고, 아래 `ingress`나 `egress` 에서 화이트 리스트로 풀어주어야 한다.
`from`이나 `to` 밑에 적용되는 옵션들 같은 경우에는 or 조건으로 반영된다. 즉 위 예제의 경우,

* 172.17.0.0/24 를 제외한 172.17.0.0/16 대역에서 들어오는 요청
* myproject로 라벨링된 namespace에 속한 리소스로 들어오는 요청
* frontend로 라벨링된 Pod에 들어오는 요청

중 한 가지라도 해당되면 허용된다.
