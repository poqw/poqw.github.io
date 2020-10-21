# React hooks

React hook 은 react 16.8.0 부터 지원된다. 복잡한 컴포넌트의 라이프 사이클을 신경쓰지 않게 해주는 고마운 유틸이다.

## useState

가장 기본적인 Hook. 함수형 컴포넌트에서도 가변적인 상태를 가질 수 있게 해준다.
```tsx
const Info: React.FC = () => {
  const [name, setName] = useState('')
  const onChangeName = (event) => {
    setName(event.target.value)
  }

  return (
    <div>
      <div>
        <input value={name} onChange={onChangeName} />
      </div>
      <div>
        <div>
          <b>이름:</b> {name}
        </div>
      </div>
    </div>
  )
}
```

## useEffect

리액트 컴포넌트가 렌더링 될 때마다 특정 작업을 수행하도록 설정한다.

```tsx
const Info: React.FC = () => {
  const [name, setName] = useState('')
  useEffect(() => { // 랜더링 될 때마다 호출
    console.log(name)
  })

  // ...

  return (...)
}
```

두 번째 인자로 값을 넣지 않으면 매 컴포넌트 랜더링 마다 수행되지만, 두번째 인자에 특정 값을 watch하여 바뀔 때마다 수행하고 싶다면
다음과 같이 넣는다.
```tsx
useEffect(() => {
  console.log(name)
}, [name])
```

같은 원리로 마운트 할 때 딱 한 번만 특정 작업을 수행하고 싶은 경우, 두 번째 인자에 `[]`를 넣으면 된다.(watch하려는 게 없다는 뜻이므로)
```tsx
useEffect(() => {
  console.log('마운트 될 때만 실행됨 ㅎ')
}, [])
```

useEffect가 가지는 또 하나의 특징은, 함수를 리턴할 경우 useEffect가 끝나고 나서 콜백으로 실행해준다는 것이다.
```tsx
useEffect(() => {
  console.log('effect')
  console.log(name)
  return () => {
    console.log('cleanup')
    console.log(name)
  }
})
```

> 주의: 이 함수는 async 함수여선 안된다. 프로미스를 반환하면서 에러가 발생한다.

이 원리를 이용해서 언마운트 할 때 딱 한 번만 특정 작업을 수행하고 싶은 경우, 두 번째 인자에 '[]'를 넣고 함수를 리턴하도록 하면 된다.
```tsx
useEffect(() => {
  return () => {
    console.log('언마운트 될 때만 실행된 ㅎ')
    console.log(name)
  }
}, [])
```

## useContext

부모의 자식의 자식의 자식의... 증손자의 props까지 props drilling을 해주기가 너무나도 귀찮고 관리가 어려울 때 사용한다.
보통 다음 패턴으로 많이 쓴다.
```tsx
type AuthStatus = {
  loggedIn: boolean
}
type AuthAction =
  { type: 'LOGIN_SUCCEED' } |
  { type: 'LOGIN_FAILED' }

// 여기서 Context를 만들어 준다.
export const AuthContext = createContext<AuthStatus | undefined>(undefined)
// 여기서 상태를 업데이트 시켜줄 함수를 담고있는 Context를 만들어 준다.
export const AuthDispatchContext = createContext<Dispatch<AuthAction> | undefined>(undefined)

// customHook인데, useContext와 다를 바가 없다. 그냥 AuthContext 인자로 넣어주고, state nil check 정도만 추가로 해줬다.
export const useAuthStatus = (): AuthStatus => {
  const state = useContext(AuthContext)
  if (!state) {
    throw new Error('AuthContext not provided')
  }

  return state
}

// 위 함수의 dispatch 버전.
export const useAuthDispatch = (): Dispatch<AuthAction> => {
  const dispatch = useContext(AuthDispatchContext)
  if (!dispatch) {
    throw new Error('AuthDispatchContext not provided')
  }

  return dispatch
}

// Dispatcher가 새로운 action을 보내왔을 때, 그 액션을 처리할 reducer이다.
const authReducer = (state: AuthStatus, action: AuthAction): AuthStatus => {
  switch (action.type) {
    case 'LOGIN_SUCCEED':
      return { ...state, loggedIn: true }
    case 'LOGIN_FAILED':
      return { ...state, loggedIn: false }
    default:
      throw new Error(`Unhandled action: ${action}`)
  }
}

// Context를 제공해줄 Provider이다.
// 이제 이 Provider로 감싸진 모든 컴포넌트에서는 useAuthStatus와 useAuthDispatch를 쓸 수 있으며 상태가 공유된다.
export const AuthContextProvider: React.FC = ({ children }) => {
  const loggedIn = !_.isEmpty(container.getSessionToken())
  const [authStatus, dispatch] = useReducer(authReducer, { loggedIn })

  return (
    <AuthDispatchContext.Provider value={dispatch}>
      <AuthContext.Provider value={authStatus}>
        {children}
      </AuthContext.Provider>
    </AuthDispatchContext.Provider>
  )
}
```

## useReducer

사실 이미 위에서 쓰였다. status와 dispatch함수를 반환한다.
useReducer 의 첫 번째 파라미터는 리듀서 함수, 그리고 두 번째 파라미터는 해당 리듀서의 기본 값을 넣어준다.
리듀서는 액션에 따라 어떻게 dispatch를 할지 결정해주는 놈이다.

```tsx
function reducer(state, action) {
  // action.type 에 따라 다른 작업 수행
  switch (action.type) {
    case 'INCREMENT':
      return { value: state.value + 1 }
    case 'DECREMENT':
      return { value: state.value - 1 }
    default:
      // 아무것도 해당되지 않을 때 기존 상태 반환
      return state
  }
}

const Counter = () => {
  const [state, dispatch] = useReducer(reducer, { value: 0 })

  return (
    <div>
      <p>
        현재 카운터 값은 <b>{state.value}</b> 입니다.
      </p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+1</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-1</button>
    </div>
  )
}
```

리듀서를 사용하면 컴포넌트 업데이트 로직을 컴포넌트 외부로 뺄 수가 있다. 그걸 좀 더 사용하기 쉽게 해준 것.

## useMemo

불필요한 연산을 방지하여 함수형 컴포넌트 내 연산을 최적화 하기 위해 만들어졌다.
렌더링 하는 과정에서 특정 값이 바뀌었을 때만 연산을 실행하고 원하는 값이 바뀐 것이 아니라면 이전에 연산했던 결과를 다시 사용하는 방식이다.

```tsx
const getAverage = numbers => {
  if (numbers.length === 0) return 0
  const sum = numbers.reduce((a, b) => a + b)
  return sum / numbers.length
}

const Average = () => {
  const [list, setList] = useState([])
  const [number, setNumber] = useState('') // number는 등록할 때 뿐만 아니라 그냥 수정할 때도 바뀐다.

  const onChange = e => {
    setNumber(e.target.value)
  }
  const onInsert = e => {
    const nextList = list.concat(parseInt(number))
    setList(nextList)
    setNumber('')
  }

  const avg = useMemo(() => getAverage(list), [list]) // list가 진짜로 업데이트 될 때만 값을 업데이트

  return (
    <div>
      <input value={number} onChange={onChange} />
      <button onClick={onInsert}>등록</button>
      <ul>
        {list.map((value, index) => (
          <li key={index}>{value}</li>
        ))}
      </ul>
      <div>
        <b>평균 값:</b> {avg}
      </div>
    </div>
  )
}
```

## useCallback

useMemo와 비슷하다. 주로 렌더링 성능을 최적화해야 하는 상황에서 사용한다. 이벤트 핸들러 함수를 필요할 때만 생성 할 수 있다.

첫 번째 인자에는 우리가 만든 핸들러 함수를 넣고, 두 번째 인자는 useEffect 처럼 관찰할 대상 list를 넣는다.
 
```tsx
const getAverage = numbers => {
  if (numbers.length === 0) return 0
  const sum = numbers.reduce((a, b) => a + b)
  return sum / numbers.length
}

const Average = () => {
  const [list, setList] = useState([])
  const [number, setNumber] = useState('')

  const onChange = useCallback(e => {
    setNumber(e.target.value)
  }, []) // 컴포넌트가 처음 렌더링 될 때만 함수 생성
  const onInsert = useCallback(
    e => {
      const nextList = list.concat(parseInt(number))
      setList(nextList)
      setNumber('')
    },
    [number, list]
  ) // number 혹은 list 가 바뀌었을 때만 함수 생성. 근데 별로 좋은 예제는 아닌 듯 하다.

  const avg = useMemo(() => getAverage(list), [list])

  return (
    <div>
      <input value={number} onChange={onChange}  />
      <button onClick={onInsert}>등록</button>
      <ul>
        {list.map((value, index) => (
          <li key={index}>{value}</li>
        ))}
      </ul>
      <div>
        <b>평균값:</b> {avg}
      </div>
    </div>
  )
}
```

`useCallback`은 결국 useMemo 에서 함수를 반환하는 상황에서 더 편하게 사용 할 수 있는 Hook이다.

숫자, 문자열, 객체 처럼 일반 값을 재사용하기 위해서는 `useMemo` 를, 그리고 함수를 재사용 하기 위해서는 `useCallback` 을 사용하면 되겠다.


## useRef

특정 컴포넌트의 레퍼런스를 가지고 있어야 할 때 쓰인다. 그냥 곧바로 저장하면 랜더링 될 때마다 지웠다가 다시 만들어지므로 reference가 사라지는데, 이를 그대로 유지하기 위함이다.
나는 컴포넌트의 높이를 동적으로 계산하기 위해 써봤다.

```tsx
const ConsoleTemplate: React.FC = ({ children }) => {
  const topContainerRef = useRef<HTMLDivElement>(null)
  const [contentPadding, setContentPadding] = useState(0)

  useEffect(() => {
    const padding = topContainerRef?.current?.clientHeight
    if (padding) {
      setContentPadding(padding)
    }
  }, [topContainerRef])

  return (
    <Box bgcolor="_light.200">
      <Box
        position="fixed"
        top={0}
        width="100%"
      >
        <div ref={topContainerRef}>
          <ConsoleHeader />
        </div>
      </Box>
      <Box
        minHeight={`calc(100vh - ${contentPadding * 2}px)`}
        pb={contentPadding / 8}
        pt={contentPadding / 8}
      >
        {children}
      </Box>
    </Box>
  )
}

export default ConsoleTemplate
```
