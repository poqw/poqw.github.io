# Istio

![](https://daddyprogrammer.org/wp-content/uploads/2020/09/istio-logo-696x409.png)

## Service Mesh 는 왜 등장했나

Service Mesh 가 등장한 배경을 알려면 먼저 수십 개의 Microservice 가 둥둥 떠다니는 클러스터를 먼저 상상해보아야 한다.
각 Microservice 는 개발자들이 열심히 역할 분리를 해놓았겠지만, 그런 노력과는 별개로 운영이나 개발을 하다보면 서비스끼리 통신을
하는 경우가 필연적으로 발생하곤 한다.

구현 관점에서 이를 생각해 보았을 때, Microservice 에 비즈니스 로직과는 별개로 네트워킹 로직을 더해 서비스 사이의 터널을
뚫어 주어야 한다. 이로 인해 비즈니스 로직에 대한 집중도가 하락하고, 네트워킹 로직을 직접 개발자가 구현하다보니 버그 발생의 염려가
있는 데다가, 실제로 장애가 발생했을 때 복잡한 통신들 사이에서 정확한 장애지점을 파악하기 힘들다는 단점이 발생한다.

> 네트워킹에 관한 로직이 각 서비스마다 분산되다 보니, 이러한 로직들을 한데 모아 구현하는 [API Gateway pattern](https://microservices.io/patterns/apigateway.html)
> 이라는 것이 쓰이기 시작했는데, 강력한 패턴임에도 불구하고 코드 레벨에 로직이 섞여 설계를 잘 하지 않으면 순식간에 코드 복잡도가 올라갈 수 있었다.

결국 이러한 모든 단점을 최대한 커버하기 위해 나온 것이 바로 [Istio](https://istio.io/) 같은 Service Mesh 이다.

## Istio는 어떻게 단점을 극복하는가

Istio 는 먼저 네트워크 로직의 분리를 위해 각 Microservice 에 [Envoy](https://www.envoyproxy.io/) 라는 사이드카를 달았다.
Envoy 는 c++로 개발된 성능이 우수한 프록시로 여기선 각 Microservice 의 네트워킹 관련 로직을 위임받는 역할을 한다.
기존에 Microservice 사이 직접 통신을 했던 것이, Istio 를 사용하게 되면 아래 그림처럼 각 Microservice에 붙어 있는 Envoy
끼리 통신을 하는 것으로 구조를 탈바꿈 시키게 되는 것이다.

![](https://istio.io/latest/docs/ops/deployment/architecture/arch.svg)

네트워킹 로직을 분리한다는 것은 예를 들어, A 서비스에서 B 서비스로 가는 통신에 metadata를 심는다거나 B 서비스에서 C 서비스 사이의
트래픽에 강력한 로드벨런싱을 추가하는 것과 같은 복잡한 정책들 까지도 선언적인 설정 파일만으로 구현될 수 있어야 함을 의미한다.
위 그림에 등장하는 Control plane이 각 Proxy 들에게 그러한 정책들을 세워주고 Proxy 자체를 관리하는 제어실과 같은 역할을 하며,
실제로 네트워크 통신을 제어해주는 역할을 하는 것이 위에서 설명한 Envoy Proxy들, 즉 Data plain 인 것이다.

이러한 구조로 인해 얻을 수 있었던 장점들은 다음과 같다:

- 네트워크 통신 로직이 분리되어 개발자들이 좀 더 비즈니스 로직에 집중할 수 있다.
- 성능 메트릭 측정이 훨씬 쉬워져, 최적화를 위한 인사이트를 얻기가 수월해졌다.
- 기존에 서비스가 장애가 나서 뻗게 되면 ReplicaSet 에 의해 되살아나 곧바로 서비스를 운영시킬 수는 있었지만, 실패한 요청을
다시 되돌릴 수는 없었다. 하지만 위와 같은 구조를 통해 실패한 요청을 재수행하는 것이 가능해져 장애 복구 능력이 더욱 향상되었다.
- 코드로 구현하지 않더라도 로드벨런싱, 보안 기능(TLS, 암호화, 인증)과 같은 강력한 API들을 사용할 수 있다.

## 설치

설치 방법은 매우 간단하다. [가이드라인](https://istio.io/latest/docs/setup/getting-started/) 을 따르면 딱히 문제는 없을 것이다.
주의할만한 점이라면, `profile=demo` 옵션을 통해 최대한 많은 옵션을 지원하도록 하는 게 좋다는 것.

`profile` 리스트는 다음 명령어로 조회할 수 있다.

```bash
istioctl profile list
```

## Istio dashboard

[Kiali](https://istio.io/latest/docs/ops/integrations/kiali/#installation) 설치하고 다음 명령어를 통해 바로 접속이 가능하다.
참고로, [prometheus](https://istio.io/latest/docs/ops/integrations/prometheus/) 도 같이 설치해주어야 한다.

```bash
istioctl dashboard kiali
```
