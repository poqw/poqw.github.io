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
다행히 [Docker](../docker/docker)의 등장 덕분에 Container 단위의 배포는 할 수 있었지만
Container 사이의 네트워킹이나 로드벨런싱 같은 문제점들을 일일이 해결해 주기가 여간 까다로운 게 아니었다.
개발자들은 이런 어렵고 귀찮은 일들을 싫어하기 때문에, 이들을 지속적이고 탄력적으로 배포 및 관리하기 위한 오케스트레이션 툴을 원했고,
구글이 이미 1990년대부터 개발해서 쓰고 있던 오케스트레이션 툴을 Kubernetes 라는 이름으로 오픈소스로 공개하면서 패러다임의 변화를 가져왔다.

K8s 는 인프라를 추상화한다. 하드웨어 스펙이나 대용량 트래픽에 대한 가용성 같은 디테일을 연구하지 않아도 인프라를 구축할 수 있다는 말이다.
DevOps가 아니더라도 인프라를 구축할 수 있다는 것은 큰 매력이라, 널리 쓰이게 되고 이제는 거의 표준으로 자리매김한 것으로 보인다. 

## 아키택쳐

![](https://d33wubrfki0l68.cloudfront.net/2475489eaf20163ec0f54ddc1d92aa8d4c87c96b/e7c81/images/docs/components-of-kubernetes.svg)

Master Node(Control Plane 이라고 둘러쳐진 박스)가 여러 Worker Node들을 거느리는 형태다. Master Node 안에서는
그 안에 kube-api-server, etcd, kube-scheduler, kube-controller-manager 로 나뉘어진다.

* kube-api-server: Control Plane 의 API 서버다.
* etcd: 키-값 저장소다. 여기엔 클러스터의 데이터(클러스터의 현재 구성정보)를 저장한다.
* kube-scheduler: 스케줄링을 하는 놈이다. 여기서 스케줄링은 특정 pod가 어떤 노드에 적합한지 확인하는 작업이다.
* kube-controller-manager: 실내 온도 조절기 같이 매번 클러스터 상태를 확인하면서 사용자가 의도한 상태에 가깝게 조절하는 녀석이다.

Worker Node 안에는 kubelet, kube-proxy가 있다.

* kubelet: pod 에서 컨테이너가 동작하도록 관리한다. 컨테이너는 여러 개 뜰 수 있다.
* kube-proxy: 사용자가 만든 앱을 외부로 노출시키는 역할을 한다.

사실 Master node 안에 있는 컴포넌트들도 pod의 형태로 띄워지기 때문에 kube-proxy를 하나씩 주렁주렁 달고 있다.

### K8s 설치

k8s 환경을 물리적인 서버들을 이용해 직접 구성하고 싶다면 kubeadm, kubelet, kubectl을 각 노드의 역할에 맞게 설치해주어야 한다. 

* kubeadm: 클러스터 초기화나 리셋을 해주는 부트스트랩 기능이나 인증서 관리 등을 해준다. 부트스트랩 하게 되면 k8s 도 같이 설치된다.
* kubelet: 위에서 나온 것처럼 컨테이너 관리 서비스다.
* kubectl: 클러스터 설정용 인터페이스. Worker 노드에는 설치할 필요 없고, Master 노드를 네트워크 외부로 노출할거면 접속할 곳에서 `kubectl`을 설치해주면 된다. 

각 노드들에 위 프로그램들이 설치되고 나면 [Weave Net](https://github.com/weaveworks/weave) 같은 네트워크 정책 에드온(서드파티)를 설치해주어야 한다.
이 서드파티들은 여러 호스트안에 떠 있는 컨테이너들이 동일한 네트워크의 스위치에 연결된 것처럼 보이게 하는 뒤처리(포트 매핑, 중개서버 등)를 담당한다.
`kube-proxy`는 좀 더 로우레벨을, 네트워크 정책은 좀 더 하이레벨을 처리한다고 보면 된다.

Master Node와 Worker node는 kubeadm을 통해 각각 `kubeadm init`, `kubeadm join` 을 한다는 점만 설치과정에서 다르다.
이 명령어들을 사용하기전에 꼭 `ping` 때려보면서 각각이 전부 서로 연결되어 있는지 확인해야 한다.
