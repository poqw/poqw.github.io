# Software boundary

## Overview

소프트웨어의 경계는 인터페이스가 구분 짓는다. 다르게 말하면, 인터페이스를 통해 소프트웨어 경계를 설정할 수 있다.
소프트웨어는 외부 소스코드일 수도 있고, 내부 모듈일 수도 있고, 내장 라이브러리 일 수도 있다.

## 경계를 제어하라

인터페이스를 제공해준다는 것은 그 인터페이스가 제공하는 모든 기능들을 실행할 수 있는 권한을 준다는 것이다.
예를 들어 `Map` 이라는 native 유틸을 살펴보면 보통 `.clear()` 라는 인터페이스를 제공하는데, map 안에 있는 모든 내용을
날려버리는 무시무시한 기능이다. 과연 `Map`을 사용하는 모든 사용처가 이 인터페이스의 권한을 갖는 것이 바람직할까?

First class collection 을 이용하면 이런 부분에 대한 해결이 가능하다. 가령 다음과 같이 구현하는 것이다.

```java

class Sensors {
  private Map sensors = new HashMap();
  
  public Sensor getById(String id) {
    return (Sensor) sensors.get(id);
  }

  // ...
}

```

위 코드를 통해 코드에 대한 의도가 명확해지고 인터페이스까지 제한하는 효과가 생겼다. 범위를 확장한다면 collection 뿐만 아니라
모든 소프트웨어 경계를 감싸는 객체를 만들 수도 있게 된다. 그리고 이것은 결국 Adaptor 패턴과도 결부되는 이야기다.

## Learning test

특히 서드파티 모듈의 경우 learning test 가 짜여져있고 잘 관리되고 있다면 소프트웨어 경계의 변화에 민감하게 대응할 수 있다.

자세한 예시는 예전에 내가 작성했던 TIL인 [learning test](/tils/dev/methodology/tdd/learning-test) 에서 확인해 볼 수 있다.

## Conclusion

소프트웨어를 구현하는 데 있어서 내장 라이브러리나 외부 모듈을 가져다 쓰는 것은 짧은 시간안에 많은 기능을 출시할 수 있기 때문에
매우 유용하다. 그러나 이러한 서드파티들을 사용하는 것이 소스 군데 군데 퍼져있는 것은 바람직하지 못하다. 경계가 일그러지면
내가 만든 코드까지 영향을 받기 때문이다.

Adaptor 패턴이나 First class collection을 이용해 이런 사용처를 최대한 줄이고, learning test 로 경계를 관리하면
더 나은 코드를 얻을 수 있다.
