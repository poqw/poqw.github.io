# BDD(Behavior Driven Development)

## Background

BDD는 '개발할 시간도 부족한데, 테스트를 짜라고?' 진영의 개발자들을 설득하고, 생산성과 관련된 오해를 불식시키기 위한 목적으로 만들어졌다.
테스트 주도적으로 개발하는 것이 여러 이득을 가져다 준다는 것은 충분히 입증되었으나 이게 처음부터 와닿지도 않고 초심자에게 다소 어려우니 
언어를 먼저 친숙하게 바꾸어보자는 이야기다.

초심자에게 가장 어려운 부분은 단연 '존재하지 않는 코드'에 대한 테스트를 작성하는 일이다. 이 보다는, 행위에 대한 명세를 해보자는게 BDD가 지향하는 바다. 

### xUnit vs BDD

- xUnit 스타일
```java
assert (expected_value, actual_value)
```

- BDD 스타일 (부끄럽게도, 나는 여태 ts/js로 이런 코드를 작성하면서도 이게 BDD인지 몰랐다)
```java
actual_value.should_be (expected_value)
```

이런 스타일이 발전을 거듭해 요새는 아래와 같이 작성된다. 어휘로 시스템의 행동을 묘사하는 것이 인상적이다.
```js
describe('GET /v1/auth/google/callback', () => {
  it('creates new user when the user does not exist', async () => {
    //...
  })
})
```

#### pros and cons

얼핏 잘 읽히는 BDD style이 친숙하고 또 좋아보이지만, BDD style이 무조건적으로 좋은 것은 또 아니다.
결정적으로 xUnit 프레임워크에서는 강력한 기능인 상속을 활용할 수 있다는 장점이 있다.

## BDD vs TDD

BDD는 기본적으로 TDD로부터 파생되어서 그런지 다루고자 하는 주제도 그렇고 지향하는 바도 비슷한 부분이 많다.
그러나 내가 느끼기엔 뉘앙스에서 미묘한 차이가 있다.

BDD는 말한다.
> 개발자가 아닌 사람이 보더라도 이해할 수 있어야해. 시나리오 기반으로 테스트를 작성하자! 훌륭한 document가 나올거야. 

TDD도 말한다.
> TDD 싸이클을 돌면서 prod 코드가 점점 generic해지는 걸 경험해봐! 코드간 결합이 느슨해지고 구조가 우아해질걸?

어찌보면 말장난인가 싶기도 하다.
TDD를 한다고 해서 BDD를 아예 못하는 건 또 아니라서, 코드를 개발하는 입장에서 그 둘의 장점을 잘 섞어내면 되겠다. 
