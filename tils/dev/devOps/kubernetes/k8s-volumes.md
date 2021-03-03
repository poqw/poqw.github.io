# Kubernetes volumes

![](https://subicura.com/assets/article_images/2019-05-19-kubernetes-basic-1/kubernetes-logo.png)

## 볼륨의 종류

`K8s`에서는 컨테이너끼리, 노드끼리, 혹은 `Pod` 끼리 데이터를 공유하기 위해 볼륨을 사용한다.  

## emptyDir

`emptyDir`은 컨테이너들 사이에서 데이터를 공유하기 위해 사용한다. 아래 설정 파일은 `html-generator`와 `web-server`가
`html`이라는 볼륨을 공유한다. 즉, `html-generator`의 `/var/htdocs` 경로 `web-server`의 `/usr/local/apache2/htdocs`
경로는 같은 디렉토리를 가리킨다. 다만 `web-server`의 `readOnly: true` 옵션 때문에 보기만 가능하다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: count
spec:
  containers:
  - image: happynut/count
    name: html-generator
    volumeMounts:
    - mountPath: /var/htdocs
      name: html
  - image: httpd
    name: web-server
    volumeMounts:
    - name: html
      mountPath: /usr/local/apache2/htdocs
      readOnly: true
    ports:
    - containerPort: 80
  volumes:
  - name: html
    emptyDir: {}
```

## hostPath

`hostPath`는 노드의 데이터를 공유하기 위해 사용한다. `html`의 `/var/htdocs`는 실제 노드의 경로를 가리킨다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: hostpath-httpd
spec:
  containers:
  - image: httpd
    name: web-server
    volumeMounts:
    - name: html
      mountPath: /usr/local/apache2/htdocs
      readOnly: true
    ports:
    - containerPort: 80
  volumes:
  - name: html
    hostPath:
      path: /var/htdocs
      type: Directory
```

## NFS(Network File System)

NFS는 준비물로 실제 물리 장비가 필요하다. 물리 장비를 제공할 서버에 `nfs-server`, `portmap` 와 같은 패키지들을 설치해주어
외부에서 `nfs` 프로토콜로 접속할 수 있도록 만든 뒤, yaml 파일로 마운트 설정을 해주어야 한다. 당연히 `emptyDir` 이나 `hostPath` 보다는
실용적이겠지만, 개발자가 어떤 파일 시스템을 사용할 건지 등 하드웨어 레벨들을 속속들이 다 알아야 한다는 점에서 쿠버네티스의 철학과 위배된다.
그래서 프로덕션에서는 잘 쓰이지는 않는 모양이다. 설정파일은 아래와 같다.

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: nfs
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteMany
  nfs:
    server: nfs-server.default.svc.cluster.local
    path: "/"
```

여기서부터는 컨테이너나 노드 같은 데서 물리적인 저장공간을 빌려오지 않고 직접 볼륨을 때리기 때문에 `capacity`가 새로 등장한다.
즉 얼마만큼의 디스크를 할당할 것이냐에 관한 것이다.

`accessModes` 에는 `ReadWriteMany`, `ReadWriteOnce`, `ReadOnlyMany` 이렇게 3가지 정도가 있는데, 읽는 그대로의 뜻으로 직관적으로 이해하면 된다.
다만 그 중 `ReadWriteMany` 는 동시성 이슈 때문에 신중히 사용하거나 아예 사용하지 않도록 해야 한다는 것만 알고 넘어가면 되겠다.

`nfs` 설정 부분에 `server`에는 nfs 서버의 도달가능한 실제 주소(혹은 위와 같이 도메인이름)를, `path`에는 nfs path를 적는다.

## Persistent Volume & Persistent Volume Claim

PV(Persistent Volume)와 PVC(Persistent Volume Claim)는 함께 묶이는 개념이다. PV가 제공되고 있으면 PVC로 맞는 PV를 가져와 바인딩하는 식이다.  
보통은 동적 프로비저닝을 사용하기 때문에 PV를 직접 설정할 일은 잘 없겠지만, 그래도 알아두면 좋을 것이다.
동적 프로비저닝은 PV를 PVC의 요청값에 따라 직접 만들 필요 없이 자동으로 만들어주는 걸 말한다. 

우선 PVC다.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: foo-pvc
  namespace: foo
spec:
  storageClassName: "" # Empty string must be explicitly set otherwise default StorageClass will be set
  volumeName: foo-pv
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

아래는 PV다.
```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: foo-pv
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: ""
  claimRef:
    name: foo-pvc
    namespace: foo
  ...
```

`foo-pvc`가 같아야 하고, 특히 `storageClassName`에 `""`를 넣어주어야 함에 주목해야 한다. 지금과 같이 PV를 직접 설정하려면
동적 프로비저닝에 사용되는 `storageClassName`을 비워두어야 하기 때문이다.

설정 상에서 이름을 매칭시키는 것 외에도, PV, PVC 에서는 신경써주어야 할 것이 하나 더 있다. 바로 `accessModes`와 `capacity`다.
PV는 PVC가 요청하는 `accessModes`와 `capacity`의 범위를 포함하고 있어야 하며, 그렇지 않다면 바운드 되지 못한다.

바운드 상태는 다음과 같이 `STATUS`로 확인한다.

```
$ kubectl get pvc
NAME          STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS    AGE
mongodb-pvc   Bound    pvc-c3574b7d-134d-4f65-bd13-f09c88fdc595   10Gi       RWO            mongo-storage   45s
```

## Storage Class

PV 를 직접 설정하는 것 또한 쿠버네티스의 철학에 위배되기 때문에, 한 단계 더 추상화를 시킨 것이 바로 Storage class다.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mongodb
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mongodb
  template:
    metadata:
      labels:
        app: mongodb
    spec:
      containers:
      - name: mongodb
        image: mongo
        volumeMounts:
        - mountPath: /data/db
          name: mongodb-v
      volumes:
      - name: mongodb-v
        persistentVolumeClaim:
          claimName: mongodb-pvc
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mongodb-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
  storageClassName: mongo-storage
---
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: mongo-storage
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-ssd
  fstype: ext4
  replication-type: none
```

`persistentVolumeClaim`으로 필요한 요청(Claim)을 걸면, 그 요청의 spec에 따라 자동으로 Storage class가 PV를 만들어 준다.
