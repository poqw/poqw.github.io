# Kafka

![](https://miro.medium.com/max/975/1*8GbrXbHdH5uPGMb5epWhrg.png)

## Kafka

[Kafka](https://kafka.apache.org/)
는 스트리밍 데이터를 다루기 위한 미들웨어와 그 주변 생태계를 말한다. 특징으로는 다음과 같은 것들이 있다.

* scalability
* availability
* persistency: Kafka 에 한번 입력된 데이터는 그 시점에서 영속성을 가진다
* pub/sub 을 통한 데이터 분포

## 구조

Kafka 는 다음 3가지 컴포넌트로 이루어져 있다.

```
Producer -> Broker -> Consumer
```

* `Producer` 는 Kafka에 데이터를 입력하는 일종의 클라이언트다. `topic` 을 대상으로 데이터를 입력한다.
* `Broker` 는 `topic` 을 임의 개수만큼 호스팅한다. 복수의 `Broker` 가 존재할 수 있다.
* `Consumer` 는 `topic` 을 지정한 후 데이터를 가져온다. 여러 `Consumer`가 하나의 토픽에 대해 구독하는 것도 가능하다.

앞서 Kafka가 scalability, availability 이 두가지 특성을 가지는 이유는 `Broker` 들이 cluster로 구성되어 동작하도록
설계되었기 때문이다. 이에 대한 분산처리는 [Zookeeper](https://zookeeper.apache.org/) 가 담당한다.

kafka 의 성능에 영향을 주는 것은 처리되는 데이터의 양보다는 요청 수인데, 과도한 요청에 대비하기 위해 Kafka 에서는 batch 를 제공한다.
`Producer`가 batch 로 한 번에 여러 데이터를 전송할 수도 있고, `Consumer`가 한 번에 여러 데이터를 `batch` 로 받아올 수도 있다.

기존의 pub/sub 모델에서는 publisher 가 데이터를 publish 하면 곧바로 subscriber 가 그 데이터를 받는 구조였지만,
Kafka는 성능을 위해 `Broker` 를 두어 `Consumer` 가 처리할 수 있는 양 만큼의 데이터를 알아서 가져갈 수 있도록(pull 방식) 했다.

## 파일시스템에 데이터를 저장한다?

Kafka가 가지는 다른 메시징 모델들과의 차이점 중 하나는 메모리에 메시지를 저장하지 않고 파일 시스템에 저장한다는 것이다.
다른 모델들은 데이터의 양이 많아질수록 속도가 느려지는 반면, Kafka는 이에 영향을 받지 않는다. 보통 파일시스템은 메모리보다 10만배
이상 느릴텐데, 이 성능이 어떻게 가능한 걸까?

Kafka는 메모리에 별도의 캐시를 구현하지 않고 OS의 페이지 캐시에 이를 모두 위임한다.
OS가 알아서 서버의 유휴 메모리를 페이지 캐시로 활용하여 앞으로 필요할 것으로 예상되는 메시지들을 미리 읽어들여(readahead) 디스크 읽기 성능을 향상 시킨다.


## 메시징 모델의 일반화

Kafka 에는 `partition` 과 `Consumer group` 이라는 개념이 있다. 이를 통해 queue 모델과 pub/sub 모델을 일반화한다.
queue 모델은 여러 Consumer 가운데 하나가 queue에 도착한 메시지를 가져다가 처리하는 방식이라면,
pub/sub 은 여러 Consumer 들에게 메시지를 브로드캐스팅을 하는 방식이다.

우선 `partition`은 `topic`의 복제본으로, 분산 환경에서 여러 클러스터에 동시에 `topic`을 적재하기 위해 사용된다.
그렇다고 진짜 데이터만 복사된 단순한 복제본은 아니고, 자체적으로 분산이나 복제의 기능도 가진다.

`Consumer group` 안에 속한 `Consumer` 들은 동일한 파티션에 중복하여 접근하지 못한다. 그러므로

사이즈 1인 `Consumer group`이 한 파티션에 접근하면 브로드캐스팅이 되는 pub/sub 모델을 일반화하는 것이 되고,
`Consumer group`에 여러 `Consumer`가 존재하게 되면 `Consumer` 마다 여러 파티션으로부터 메시지를 받아오기 때문에
`Producer`가 각 `partition`에 균등하게 메시지를 분배한다면 Queue 모델로 동작하게 된다.
