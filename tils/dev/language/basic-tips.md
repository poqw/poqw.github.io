# Basic tips

거의 뭐 코드 리뷰 오답노트라고 보면 된다. 내가 했던 실수들, 그리고 그것들을 고침으로써 얻을 수 있는 인사이트를 정리한다.

## Define constants

상수를 보통 파일 위쪽으로 끄집어내어 대문자로 선언할 때가 종종 있는데, 객체를 끄집어 내는 경우에는 대문자로 쓰지 말자.

왜? 객체는 상수가 아니기 때문이다.

```typescript
const GOOGLE_CLIENT = new OAuth2Client() // ✗ avoid

const GOOGLE_CLIENT_ID: string = config.get('auth.google.clientID') // ✓ ok
const googleClient = new OAuth2Client() // ✓ ok
```

## Readable type

정의될 수 있는 값이 제한적이라면 타입을 재정의해서 쓰는 게 훨씬 가독성이 좋다. 당연한 건데 정신없이 코딩하면 은근 자주 빠뜨리게 된다.
셀프 코드 리뷰할 때 유심히 살펴보는 습관을 기르자.

```typescript
// ✗ avoid
function something(a: string) {
  if (a === 'A' || a === 'B') { // Type check 
    // ... 
  }
}

// ✓ ok
type AB = 'A' | 'B'
function something(a: AB) {
  // ...
}
```

## 이름 짓기

함수나 변수 명에 with 같은 건 적지 말자. 파라미터가 많아지면 전부 함수 명에 집어넣을 것인가?
차라리 훨씬 더 의미있어 보이는 이름을 고민하자.

```typescript
// ✗ avoid
async function getPayloadWithIdToken (idToken: string): Promise<TokenPayload> { ... }

// ✓ ok
async function getValidPayload (idToken: string): Promise<TokenPayload> { ... }
```

그러나 만약 다음과 같이 이름이 중복되는 상황이라면 with 를 써도 괜찮다.
```typescript
function login () {}

function loginWithGoogleId () {} // ✓ ok
```

## 테스트 description

properly, should 같은 단어는 테스트를 처음 보는 사람에게 아무것도 전달해주지 않는다. 지양하도록 하자.

```typescript
// ✗ avoid
it('calls status calculator properly', () => {
  // ...
}

// ✓ ok
it('calls status calculator with published, from/to timestamps and sent message count', () => {
  // ...
}
```

## Error & Exception

Error와 Exception의 차이는 예상이 가능한 케이스인가의 여부다.

Exception은 예상이 가능하고 그것은 반드시 코드로 처리하여 핸들링해주어야 한다.
- 어떠한 인풋이 들어왓을 때 그 인풋에 대한 ValidationException을 내려주는 게 이런 경우다.

Error는 예상이 불가능한 케이스로 Exception과 동일하게 핸들링처리를 하려고 하면 안된다.
- 사실 처리하면 좋은거고, 처리하지 않아도 좋다.
- 만약 처리를 한다면 그것은 단지 에러 메시지를 정갈하게 보내고 싶은 경우인 거고,
  이 경우에는 에러 핸들링을 해주는 가장 상위 레이어에서 포괄적으로 처리해 주어야 한다.
- 가령 서버라면 프레젠테이션 레이어에서 InternalServerError를 던지는 식으로 말이다.
