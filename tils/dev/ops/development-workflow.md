# Development workflow

![](https://cdn-images-1.medium.com/max/800/0*Ibsu7Nvvd9gyhHxO.png)


## 개발에서 배포까지

전형적인 개발에서 배포까지의 과정을 살펴보자.

### 개발 과정

Github repository 같은 코드 저장소에 `master` 브랜치 이외의 브랜치가 있어야 한다. 절대 배포 전용 브랜치에다가 코드를 push 하는 일은 없어야 한다.
편의상 `development` 브랜치가 있다고 하자. 여러 개발자들과 함께 이 브랜치에 커밋을 쌓는다.


### 테스트

개발이 어느 정도되어 버전을 높여 배포를 하는 상황이라고 해보자.
우선은 `master` 브랜치로 코드 병합을 하기 전에 해당 브랜치에 문제 없는지 확신할 수 있어야 할 것이다.

[Travis](https://travis-ci.org/) 같은 CI(Continuous Integration) 프로바이더가 빌드 - 테스트를 시도하도록 한 후
문제가 없다면 `master` 브랜치로 pull request를 보내 코드 병합을 시도한다.

### 배포

코드가 병합되면 Travis (Continuous Deployment 역할도 한다) 가 [AWS](https://aws.amazon.com/) 같은 호스팅 서버에 배포한다. 

 