# Kubernetes practices

![](https://subicura.com/assets/article_images/2019-05-19-kubernetes-basic-1/kubernetes-logo.png)

보통은 서비스 운용할 때 yaml 파일들 가지고 선언적으로 `kubectl apply` 해서 많이 사용하지만,
설정 파일 없이도 간단한 앱은 배포할 줄 알면 좋을 것 같아서 적는다.

## 준비물

소풍가려면 도시락을 싸야 하듯, 앱을 배포하려면 준비물을 미리 미리 챙겨야 한다.

* 앱
* K8s 클러스터
* 클러스터에 연결되어 있는 kubectl 인터페이스
* 레지스트리

물리적인 서버든 클라우드 서버든 K8s 클러스터가 구축되어 있어야 K8s의 혜택을 누릴수 있는 서비스 환경을 구축할 수 있다.
물리적인 서버를 이용해 K8s 환경을 구축하려면 `kubeadm` 을 설치하여 Master-Worker 지정과 네트워크 정책설정을 해주어야 하는 등
여러가지 추가적인 작업을 해주어야 하겠지만, [GCP](https://cloud.google.com/) 같은 클라우드 플랫폼을 이용하면 클릭 몇 번에
K8s 클러스터를 구축할 수 있다. 차이점이 있다면 돈이다. 전자는 서버를 직접 구매해고 정기점검을 해야 하고 매달 전기세를 지불해야 하는 반면
후자는 플랫폼 사용료를 내야 한다. 만약 집에 남아도는 컴퓨터가 있다면 전자의 방식도 훌륭하다고 생각한다.

여기서는 준비물에 있는 K8s 클러스터를 챙기기 위해 GCP를 썼다고 가정한다. 이미지 첨부는 귀찮으니까 글귀로 과정을 서술해보자면:

1. GCP 계정만들어서 접속하기
2. GCP Project 만들기. 이 때 '조직 없음' 에 만들어야 프로젝트 삭제했을 때 리소스를 한꺼번에 삭제시킬 수 있음. 조직을 지정하면 권한이 조직으로 넘어가버림.
3. Kubernetes Engine API 사용한다고 설정
4. Kubernetes 클러스터 - 클러스터 만들기
5. 설정은 My First Cluster 라고 오른쪽에 뜨는 초보자용 설정을 선택한다(테스트 용이라 한 번 해보고 지울 것이니).
   * 조금 더 커스터마이징하고 싶은 사람을 위해:
     * 우리는 한국인이니까 위치 유형을 (영역, asia-northeast3-a)로 설정한다. 레이턴시가 줄어들 것이다(아마)
     * 노드 풀에서 머신 구성의 시리즈를 N1, 머신 유형을 g1-small 으로 바꾼다. 실수로 클러스터를 계속 운영해놨을 때 조금이나마 비용을 덜 들어가게 하기 위함이다.
6. Cloud Shell 을 사용하던가, 로컬 머신에서 접속하고 싶다면 팝업창이 안내해주는대로 gcloud를 연결한다. 

레지스트리는 [gcr](https://cloud.google.com/container-registry) 같은 플랫폼에 통합된 레지스트리를 써도 되지만,
무료인 [Docker hub](https://hub.docker.com/) 를 써도 된다. 준비물을 챙길 때는 계정만 있으면 된다.

## 순서

K8s를 이용해 앱을 배포하기 위해 필요한 준비물이 몇 가지 있다.

우선 앱을 배포하기 전에 물리적인 서버든, 클라우드든 K8s 로 

 위해선 크게 다음과 같은 순서를 따른다.

1. 앱을 빌드한다.
2. 빌드된 앱을 태깅하여 이미지화하고 registry 에 올린다.
3. registry에 등록된 이미지로 deployment 를 만들고 외부로 expose 한다.
4. 필요한 경우, 스케일링한다.

아래 나올 예시 설명을 위해 내가 [Jenkins](https://www.jenkins.io/) 개발자라고 가정하자. 지난 수 개월간 열심히 코딩해서
버전 1.0 을 최초로 릴리즈하였고, 이제 막 빌드하여 Jenkins 바이너리를 얻은 상황(1번 과정)이다.

### 빌드된 앱을 태깅하여 이미지화하고 registry 에 업로드

도커파일을 만들어야 한다. 이건 알아서 잘 만들었다고 치면, dockerfile이 저장된 곳에서 태깅하여 빌드한다.

```bash
docker build -t happynut/jenkins .
```

여기서는 `happynut/jenkins`라고 태깅했다. 접속해서 잘 되는지 먼저 확인해보자. jenkins 가 8080포트로 서비스 열 것이라고 한다면:

```bash
docker run -d -p 8080:8080 --rm happynut/jenkins
```

잘 되는 걸 확인했다면 이제 레지스트리에 업로드한다.

```bash
docker login

docker push happynut/jenkins
```
 
### 레지스트리에 등록된 이미지로 deployment 를 만든다.

`happynut/jenkins`를 레지스트리에 등록해두었기 때문에, `kubectl`을 이용해서 다음과 같이 이름이 `jenkins`인 deployment를 생성할 수 있다.

```bash
k create deploy jenkins --image=happynut/jenkins
```

잘 만들어졌나 확인하려면:

```bash
k get deploy
```


외부로 노출하려면 service 를 만들어야 하는데, `jenkins-svc` 라는 이름으로 만들기 위해 다음 명령어를 사용한다.

```bash
k expose deployment jenkins --name jenkins-svc --type LoadBalancer --port 8080
```

잘 만들어졌나 확인하려면:

```bash
k get svc -w
```

`-w`는 watch 옵션이다. pending 이 끝날때까지 매번 명령어를 치지 않고 running 이 뜰때까지 모니터링할 수 있다.

### 스케일링하기

```bash
k scale deploy jenkins --replicas=3
```

3개의 pod이 추가로 뜨면서 스케일링이 되는 모습을 확인할 수 있다:

```bash
k get pod
```

## Conclusion

쿠버네티스 없이 이걸 일일이 다 세팅했을 걸 생각하니 손이 부들부들 떨린다.
