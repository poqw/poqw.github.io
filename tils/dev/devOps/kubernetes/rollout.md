# rollout

![](https://subicura.com/assets/article_images/2019-05-19-kubernetes-basic-1/kubernetes-logo.png)

## Strategy

RollingUpdate 를 하게 되면 업데이트된 버전의 `ReplcaSet`을 새로 생성하여 무중단 업데이트를 할 수 있다. 이건 설정해주지 않으면 default 값이고,
다른 값으로는 `Recreate`가 있는데 별로 잘 쓰이진 않는다. 이 옵션은 그냥 서비스를 죽이고 새로 띄워버려서 다운 타임이 발생하기 때문이다.

줄 수 있는 옵션은 다음과 같다:

`maxSurge`: 기본값은 25%, rollout 될 때 얼마까지 늘어날 수 있는가.
`maxUnavailable`: 기본값은 25%, rollout 될 때 최소 얼마까지는 남겨야 하는가.

예를 들어 `replicas` 가 4로 유지되어 있다면, 기본 값이 25% 는 1개 이므로
기존에 유지하던 `ReplicaSet` 과 새로 만들어지는 `ReplicaSet`의 `pod` 총 갯수가
최대 5개까지만 유지가 되면서도 기존에 유지하던 `ReplicaSet`의 `pod` 중 최소 1개 이상은 서비스 되고 있어야 한다.

yaml 파일 예시:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: alpine
  labels:
    app: alpine
spec:
  replicas: 10
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 50%
      maxUnavailable: 50%
  selector:
    matchLabels:
      app: alpine
  template:
    metadata:
      labels:
        app: alpine
    spec:
      containers:
        - name: alpine
          image: alpine:3.4
```

## Rollout and Undo

`--record=true` 명령어를 통해 `revision`을 기록할 수 있다. `revision`은 롤백할 수 있는 버전 스냅샷들의 리스트다.

다음 명령어로 container image 버전을 업데이트 했다고 하자. `Deployment` 의 이름은 `alpine`이다.

```bash
k edit deploy alpine --record=true
```

`revision` 리스트를 확인하려면:

```bash
k rollout history deploy alpine
```

다음과 같은 내역이 출력된다.

```bash
deployment.apps/alpine
REVISION  CHANGE-CAUSE
1         <none>
2         kubectl edit deploy alpine --record=true
```

`revision` 1번으로 돌아가고 싶다면:

```bash
k rollout undo deploy alpine --to-revision=1
```
