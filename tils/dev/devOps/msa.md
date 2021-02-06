# Micro Service Architecture

[![](https://www.redhat.com/cms/managed-files/monolithic-vs-microservices.png)](https://www.redhat.com/ko/topics/microservices/what-are-microservices)

## 왜 MSA 인가

MSA 이전에는 Monolithic Architecture 가 쓰였었다. 그러나 이 아키텍쳐는 모든 어플리케이션이 통으로 한 서버에 구성되어 있었기 때문에
다음과 같은 문제점들이 생겼다.

* 스케일링이 힘들고 비효율적이다.

  덩치가 큰 서버는 빌드도 오래걸리고, 로드벨런싱이 필요없는 트래픽이 몰리지 않는 어플리케이션도 같이 스케일링이 되는 비효율

* 종속적인 라이브러리 충돌.

  한 서버안에 여러 어플리케이션이 존재하다보니, 각 어플리케이션에 종속하는 디펜던시들이 충돌이 나기도 함.

* 조금 수정해도 전체 빌드, 배포

  버그가 연속해서 발견되면 난감한 상황이 벌어져서, 결국 업데이트가 기민하지 못하게 된다.

마이크로 서비스는 위 단점들을 상당 부분 커버하지만, 단점이 없는 것은 아니다.

* Transaction 관리가 어려움
