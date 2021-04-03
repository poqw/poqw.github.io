# GKE(Google Kubernetes Engine)

![](https://miro.medium.com/max/16000/1*5MnF7e5EvAgsJz35QyfNIA.png)

GKE는 GCP(Google Cloud Platform)이 제공하는 managed Kubernetes 서비스다.

## 클러스터 생성하기

기본적으로 클러스터가 존재해야 내가 만든 서비스를 배포할 수 있다. GKE는 메뉴가 너무 많아서 복잡한데, 
**메뉴바 > Kubernetes Engine > 클러스터 만들기** 메뉴를 이용하면 된다.

만들 때 주의사항은 다음과 같다.

* Cluster basics > Location type

    Zonel(영역) / Regional(리전) 을 고르도록 되어 있는데, 기본이 Zonel이다. Zonel은 마스터 노드를 하나만 생성해 고가용성을 보장하지 않는다.
    실제 제품 배포를 위해 고가용성을 생각한다면 Regoinal을 선택하자.

* Cluster basics > Release channel

    Release channel 을 골라주면 K8s 버전 자동 업그레이드가 지원된다. 기본이 정적 타입이라, 자동 업그레이드를 원한다면 바꾸어 주어야 한다.

* Node pools > default-pool > Nodes

    Machine type: 돈 아끼려고 머신을 구린 걸 골랐다가는 클러스터에 Resources quota가 부족하다는 메시지와 함께 클러스터가 생성되지 않는다.

    Boot disk size: default 가 100 GB인데, 32 GB 로도 충분하다.

## 클러스터 연결하기

클러스터 생성에 성공했다면, `gcloud`를 통해 연결할 수 있다.

```bash
gcloud init
gcloud container clusters get-credentials {cluster-name} --zone {zone-name} --project {project-name}
```

## 이미지 배포하기

클러스터 연결이 끝났다면, 내가 제공할 서비스의 컨테이너 이미지를 만들어 쿠버네티스가 참조할 수 있는 레지스트리 서버에 올려야 한다.
이 때 사용가능한 컨테이너 레지스트리 서버에는 [Docker hub](https://hub.docker.com/), [GCR(Google-cloud Container Registry)](https://cloud.google.com/container-registry), [Github Packages](https://github.com/features/packages) 가 있다.

