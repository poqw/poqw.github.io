# Typescript

타입스크립트와 관련한 꿀팁들을 적는다~ 이말이야.

## Optional Except for

다음과 같은 타입이 있다고 하자.
```typescript
interface SomeType {
    prop1;
    prop2?;
    prop3?;
    prop4;
}
```

여기서 다음과 같이 `prop3`, `prop4` 를 `Pick` 하면 optional이 유지가 되지 않는 문제가 있다.

```typescript
type AnotherType = Pick<SomeType, 'prop3' | 'prop4'> // prop3 is required.
```

다음과 같이 optional을 유지할 수 있는 workaround가 있다.

```typescript
type OptionalExceptFor<T, TRequired extends keyof T> = Partial<T> & Pick<T, TRequired>

type AnotherType = OptionalExceptFor<SomeType, 'prop4'> 
```

물론 `prop3`, `prop4` 말고 다른 prop들도 전부 optional로 받을 수 있기 때문에 완벽한 대안은 아니지만, 실용적인 패턴이긴 하다.

## Optional parameter undefined

optional param의 경우 기본 값이 `null`이 아니라 `undefined`다.
```typescript
// Optional Parameters
sayHello(hello?: string) { 
  console.log(hello); 
}
sayHello(); // Prints 'undefined'
sayHello('world'); // Prints 'world'
```

## instanceOf

`instanceOf`는 어떠한 변수가 해당 자료형인지 타입 체킹을 할 때 쓰인다.

```typescript
if (err instanceof HttpError) { ... }
```

그러나 `instanceOf`는 패키지 버전이 서로 다를 경우 타입 체킹이 똑바로 되지 않을 수 있다.
실제로 겪었던 일인데, `http-erros`의 버전이 업데이트 되면서 1.7.2 버전의 `HttpError` 타입과
1.8.0 버전의 `HttpError`의 타입의 인터페이스가 달라져서 instanceOf가 제대로 검사를 하지 못하는 버그가 생겼었다.

이를 해결하기 위해서는 버전을 통일하여 dependency deduplication을 해주어야 한다.


## unknown vs never vs any

`unknown` 은 다른 모든 타입들의 슈퍼셋이다. 즉, 모든 타입들은 `unknown` 타입이다.
- `any`를 써야 하는 상황인 경우 가급적이면 `unknown` 을 쓰도록 해야 더 안전하게 코딩할 수 있다. `unknown` 은 `typeof` 같은 연산으로 타입을 좁혀서 사용하도록 강제하기 때문이다.

`never` 는 다른 모든 타입들의 서브셋이다. 즉, 그 어떤 다른 타입들도 `never`일 수 없다.

- 컴파일 타임에 `never` 타입을 맞닥뜨리게 되면 에러가 발생한다. 가령 아래와 같은 경우,
    ```typescript
    type NonNullable<T> = T extends null | undefined ? never : T;
    ```
  타입에 `null` 혹은 `undefined`가 포함되어 있지 않으면 컴파일 에러를 발생시켜 좀 더 safe 하게 코드를 작성할 수 있도록 한다.
- `never` 는 그 어떤 타입도 될 수 없기 떄문에 유니온 연산을 거치면 사라진다.
    ```typescript
    T | never ⇒ T
    T & unknown ⇒ T
    ```