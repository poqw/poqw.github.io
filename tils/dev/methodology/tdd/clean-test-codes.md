# Clean test codes

## Low level design doc

테스트 코드를 작성하는 것에 있어서 가장 중요한 것은 **가독성**이다. 어쩌면 프로덕션 코드보다도 더 가독성에 신경써야 할 지도 모른다.
Test 코드는 읽는 사람으로 하여금 Low level design doc 처럼 느껴질 수 있도록 작성해야 한다.
테스트 코드조차 읽기 힘들다면 prod code도 마찬가지일 확률이 높다.

## AAA 패턴을 사용하자

AAA는 Arrange, Act, and Assert의 줄임말이다(3A 패턴이라고도 한다). 대개의 테스트코드들이 보여주는 자연스러운 흐름이다.

### 각 파트를 떨어뜨려놓기

아래처럼 공백으로 구분짓는 게 테스트코드를 읽는 사람을 위한 최소한의 배려다.

```js
it('calls loginWithGoogleId of handler once', async () => {
  const loginWithGoogleIdTokenSpy = sandbox.spy(authHandler, 'loginWithGoogleIdToken') // Arrange

  await request(app)
    .post('/v1/auth/google/login/id-token')
    .send({ idToken: 'google-id-token' }) // Act

  sinon.assert.calledOnce(loginWithGoogleIdTokenSpy) // Assert
})
```

### 여러 AAA섹션이 공존하는 것을 막기

아래처럼 여러 AAA섹션이 한 테스트에 공존하는 건 좋지 않다. 이는 해당 테스트가 너무 많은 커버리지를 품으려 한다는 징조이기 때문이다.

```js
  Arrange
  Act
  Assert
  Act some more    // ✗ avoid
  Assert again ... // ✗ avoid
```

### Arrange 섹션이 가장 커야 하며, Act 섹션은 단 한줄이어야 한다.

Assert가 반드시 한 줄일 필요는 없다. 그러나 Act 섹션이 한 줄 이상이라면 여러 unit을 테스트하고 있는 것은 아닌지 의심해보아라.

### `sut`/`uut` 를 다른 변수들과 구분하자

테스트 대상을 다른 변수들과 이름을 구분하여 `sut`(System Under Test), `uut`(Unit Under Test)로 이름
지어주면 보는 사람으로 하여금 무엇이 테스트 대상인지 바로 알 수 있다. `cut`(Code Under Test) 라는 약어를 쓰기도 한다.

### 테스트간의 커플링을 막아라.

prod code를 바꾸지도 않았는데, A 테스트를 수정했더니 B 테스트가 깨지는 건 좋지 않은 현상이다.
text fixture(테스트 코드 상에서, 중복되며 재사용이 가능한 부분)가 잘못 쓰였기 때문일 공산이 크다.
이런 코드들은 private factory method에 집어넣자. 

## Test framework 를 여러개 쓰고 있다면 서로 곂쳐서 검증하지 않도록 하자  

당연한 거지만 내가 직접 했던 실수라서 적는다. 말인즉슨, 테스트가 제대로 검증하고 있더라도

```js
// spy from sinon.
const loginWithGoogleIdTokenSpy = sandbox.spy(authHandler, 'loginWithGoogleIdToken') 

// test with jest ?
expect(loginWithGoogleIdTokenSpy.calledOnce).toBeTruthy()

```

보다는 아래가 낫다는 것이다.

```js
// only sinon is used.
const loginWithGoogleIdTokenSpy = sandbox.spy(authHandler, 'loginWithGoogleIdToken')

sinon.assert.calledOnce(spy)
```

## Simple 보다는 완전한 테스트를 먼저

예를 들어 어떤 함수가 User를 save하고, response도 리턴해야 한다면, user를 save하는 부분과 response를 리턴하는 부분을
나눠서 테스트할 필요는 없다. 오히려 그렇게 되면 테스트 읽는 사람으로 하여금 더 헷갈리게 만들 수도 있기 때문이다.
spec이란 어떤 조건이 주어졌을 때 어떠한 행동이 기대되는 지를 의미하는데, 그 행동이 동시에 일어난다면 그 spec은 더 이상 쪼개질 수 없다.

한 가지 시나리오를 테스트가 관통하지 못한다면, 그 테스트는 simple한 것이 아니라 불완전한 테스트인 것이다. 명심하자.

most simple, but interesting 에서 떠올릴 next simple은 테스트가 아니라 시나리오다.

## Fake it till you make it

fake it은 null, 0, 1, true, false, empty list 등을 반환하는 방법으로 테스트를 성공시키는 기법
반드시 구현을 해야만 하는 상황이 발생할 때까지는 최대한 fake함으로써 테스트를 성공시키라는 의미다.

### 왜 해야 하나?

- 돌아가는 것처럼 보이지만 시간을 오히려 절약한다.
- Getting stuck을 피해갈 수 있다.

우리가 작성하는 모든 테스트는 더 이상 fake할 수 없을때까지 fake될 수 있는 여유를 남겨야 한다.
이렇게 하기 위해 어떤 함수를 테스트할 때 outside에서 inside로 접근해야 한다. (Simpler but Proper)

## Stair-step Tests

테스트의 유일한 존재 목적이 다음 테스트를 순차적으로 구현하기 위함인 경우 stair-step test는 임시적인 중간 단계 코드로 의미를 갖는다.

테스트를 작성했는데, 막상 TDD를 더 진행하다보니 이미 작성했던 테스트가 더 이상 불필요해지는 경우 이 테스트들이 바로 Stair-step tests이다.

## Assert First

테스트 작성시 assert부터 작성을 시작하라.
assert가 compile error를 유발하고, 또 execution error를 유발함으로써 코딩이 일어나도록 하라.
이렇게 함으로써 test가 나를 운전하도록 만들어라.

> assert를 먼저 작성하는 것은 테스트의 결과로 시작하는 것을 의미한다. 그러면 읽기 쉽게 테스트를 작성하기 위한 모든 자유를 갖는 것을 의미한다.

### Test first

Test First는 단지 테스트를 먼저 작성하는 것을 의미하는 것만은 아니다. Test Come First를 의미한다.

- 코드를 작성할 때 제일 먼저 오고
- 리팩토링할 때 제일 먼저 오고
- 코드를 깨끗하게 할 때 제일 먼저 오고
- 유지보수할 때 제일 먼저 오고
- 테스트는 모든 경우에 제일 먼저 온다.

이게 "Test First"의 의미이다. 모든 경우에 테스트가 가장 먼저 온다.

## Triangulation

하나의 테스트만 존재할 때는 fake할 수 있으니, fake할 수 없게 하는(일반화를 시키는) test case를 추가한다.

## One To Many

리스트에 있는 많은 아이템을 다뤄야 하는 것을 알고 있더라도 하나의 아이템을 가지고 시작하는 것이 최상이라는 것이다.

> 어떻게 객체의 컬렉션에 동작하는 오퍼레이션을 구현하겠는가? 컬렉션 없이 먼저 구현하고, 컬렉션에 대해서도 동작하도록 만들어라.

## Refactoring Tests 

> production 코드만 리팩토링하고 test 코드는 리팩토링하지 않으면 재앙에 빠진다. 그러니 "Refactor your tests"

처음엔 문제가 없지만 테스트 코드를 리팩토링하지 않고 방치하면 테스트 코드는 fragile, brittle해진다.
production 코드에 간단한 변경만 가해도 많은 테스트가 깨지게되고, 테스트 코드는 점점 더 유지보수하기 어려워진다. 이렇게 유지보수가 어려워지면 테스트 코드를 다 버리게된다. 실제로 이런 경우를 겪었다고 한다. 테스트 코드를 버리게되면, 테스트 케이스들을 신뢰할 수 없게되고, 그럼 Production 코드를 리팩토링할 수 없게 된다. 그럼 코드가 섞어들어간다.

테스트도 시스템의 일부다. 처분하거나, 버리거나 할 수 있는 것이 아니다. Production 코드와 동일한 수준으로 다뤄져야 한다. 심지어 테스트 코드가 리팩토링이 가능케하는 시발점이므로 Production 코드보다 더 소중하게 다뤄야한다.

## Transform Tests

Refectoring이 green test(이미 성공한 test)들의 행위 변경을 하지 않고 구조를 개선하는 작업이라면,
Transformation은 red test(실패한 test)의 구조는 그대로 둔 채 행위를 변경하여 테스트를 통과시키도록 하는 작업이다.

Transformation을 어떻게 진행하는지는 완전히 개발자의 손에 달렸으나, 위대하신 엉클 밥은 이마저도 가이드를 제시해주었다.
아직 직접 느껴본 바는 없지만 아래 규칙을 따르면 더 깔끔한 코드, 더 좋은 알고리즘이 나오게 된다고 한다.

  1. Null
  2. Null to Constant
  3. Constant to Variable
  4. Add Computation
  5. Split Flow
  6. Variable to Array
  7. Array to Container
  8. If to While
  9. Recurse
  10. Iterate
  11. Assign
  12. Add Case
