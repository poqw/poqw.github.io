# Recoil

![](https://miro.medium.com/max/4400/1*LEROK_E7fJWr4chqlN93Dg.jpeg)

Recoil 을 직접 써보니 코드가 훨씬 간결해지는 느낌을 받았다. 원리는 아직 깊게 파보지 않았지만 대충 사용법이라도 적으려 한다.

## Atom & Selector

`Atom` 과 `Selector`는 둘 다 상태를 저장한다는 공통점을 가지고 있다.

우선 `Atom`은 다음과 같이 선언한다.

```typescript
export const sttStatusState = atom<ProductStatus>({
  key: 'sttStatusState',
  default: {
    level: 'Green'
  }
})
```

`Selector`는 다음과 같이 선언한다.

```typescript
export const sttProductStatusSelector = selector<ProductStatus>({
  key: 'sttProductStatusSelector',
  get: async () => {
    return await productStatusMonitorContainer.productStatusMonitorClient.getSttStatus()
  }
})

```

`Atom`은 간편하게 상태를 조회할 때, `Selector`는 가져오려는 값에 양념을 좀 더 치고 싶을 때 사용하는 것 같다.
예제를 좀 구리게 쓰긴 했지만, 사용 기준이 비동기냐 동기냐의 차이점은 아니다.
다만 개인적으론 `Selector` 가 비동기를 처리하는 게 더 수월한 듯 하다.

## 상태 조회

상태 조회시에는 동기적인 값을 가져오는 경우와, 비동기적인 값을 가져오는 경우가 조금 다루는 데 있어 차이가 있다.

우선 비동기적인 값을 가져오려는 경우 아래처럼 `useRecoilValue`를 사용하면 된다.

```typescript
const [sttStatus, setSttStatus] = useRecoilValue(sttStatusState)
```

비동기적인 값을 가져오려는 경우 역시 위와 똑같은 코드로 값을 가져올 수 있으나, `Suspense`로 감싸는 처리를 해주어야 한다.
비동기적인 값을 가져오기 전 로딩 상태일 때 어떻게 보여져야 하는 지 `fallback`에 인자를 주어 표현할 수 있다.

```tsx
// 컴포넌트 내부.
const sttStatus = useRecoilValue(sttStatusState)

return (
  <Suspense fallback={<Spinner />}>
    {sttStatus}
  </Suspense>
)
```

`Suspense` 처리가 귀찮다면, `Loadable`을 사용하는 방법이 있다.

```tsx
// 컴포넌트 내부.
const productStatusLoadable = useRecoilValueLoadable(sttStatusState)

switch (productStatusLoadable.state) {
  case 'hasValue': {
    const status = productStatusLoadable.contents
    return (
      <div>{status.level}</div>
    )
  }
  case 'hasError': {
    const error = productStatusLoadable.contents
    return (<>{error.message}</>)
  }
  case 'loading':
    return (<></>)
}
```

이렇게 하면 코드가 좀 더 늘어나긴 해도, 값을 가져온 상태, 에러가 난 상태, 로딩 상태 모두 표현이 가능하다.
