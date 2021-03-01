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
