# Dependency

## 의존성은 왜 생기는가

쉽게 생각해서, A 모듈이 B 모듈을 import만 해도 의존성이 생겼다고 볼 수 있다.
따라서 의존성이 생기는 것은 소프트웨어 개발에 있어서는 필연적이다. 우리는 왜 의존성이 생기는가 보다, 어떻게 의존성을 관리할 것인가에 대해 신경써야 한다.

보통 다음의 상황에서 의존성이 생겼다고 볼 수 있다.
- Association(연관)
- Dependency(의존)
- Inheritance(상속)
- Realization(구현)

### Association

객체의 참조를 가지고 있는 경우가 여기 해당된다.

```java
Class A {
  private B b;
}
```

### Dependency

파라미터나 리턴 타입에 등장하면 여기 해당된다.

```java
Class A {
  public void doSomething(B b) {
  }
}

Class A {
  public void doSomething() {
    B b = new B();
  }
}

Class A {
  public void doSomething(Object object) {
    B b = (B) object;
  }
}

Class A {
  public B doSomething() {
    return new B(); 
  }
}
```

### Inheritance

상속 관계가 여기 해당된다.

```java
Class A extends B {
}
```

### Realization

구현 관계가 여기 해당된다.

```java
Class A implements B {
}
```

## Ref
[링크](https://velog.io/@codemcd/%EC%9A%B0%EC%95%84%ED%95%9C%ED%85%8C%ED%81%AC%EC%84%B8%EB%AF%B8%EB%82%98-%EC%9A%B0%EC%95%84%ED%95%9C%EA%B0%9D%EC%B2%B4%EC%A7%80%ED%96%A5-%EC%9D%98%EC%A1%B4%EC%84%B1%EC%9D%84-%EC%9D%B4%EC%9A%A9%ED%95%B4-%EC%84%A4%EA%B3%84-%EC%A7%84%ED%99%94%EC%8B%9C%ED%82%A4%EA%B8%B0-By-%EC%9A%B0%EC%95%84%ED%95%9C%ED%98%95%EC%A0%9C%EB%93%A4-%EA%B0%9C%EB%B0%9C%EC%8B%A4%EC%9E%A5-%EC%A1%B0%EC%98%81%ED%98%B8%EB%8B%98-vkk5brh7by)