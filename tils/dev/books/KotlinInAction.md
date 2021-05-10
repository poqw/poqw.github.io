# Kotlin in Action

## 부록 E: 코루틴과 Async / Await

우리가 흔히 아는 절차지향적인 루틴은 함수 콜때마다 스택에 함수 레코드가 생기면서 기존에 있던 흐름 제어가 넘어가 버리지만,
코루틴의 경우 루틴 콜때 서로 다른 스레드에게 흐름을 넘기고 호출자는 자신이 하던 일을 그대로 이어갈 수가 있다.
각 루틴을 운영체제가 강제로 실행하거나 중단시킬 수 없는 비선점 멀티테스킹 방식이라 각 루틴들이 서로 잘 협력해야 한다.

아래는 그 대표격이라 할 수 있는 generator 예시이다.
```
generator countdown (n) {
  while(n > 0) {
    yeild n // yeild 시점에 suspend 되면서 흐름이 호출자로 넘어간다. 따라서 곧바로 print(i)가 호출됨.
    n -= 1 // 하지만 동시에 이 연산도 수행하고 있음.
  }
}

for i in countdown(10) { // for 문이 돌아야 할 때마다 countdown 루틴이 resume 된다.
  print(i)
}
```

### launch

`launch`는 코루틴을 `Job`으로 반환한다. 이 레퍼런스를 통해 코루틴을 중단시킬 수 있다.
`lauanch`가 작동하려면 `CoroutineScope` 객체가 블록의 `this`로 지정돼야 한다(블록의 타입이 `suspend CoroutineScope.() -> Unit` 이기 때문).
`suspend` 함수가 내부가 아니라면 `GlobalScope`를 사용하면 된다.

```kotlin
GlobalScope.launch {
  // 호출자와 다른 스레드에서 실행된다. 따라서 GlobalScope 를 사용할 때는 메인 스레드가 먼저 종료될 수 있지는 않은지 주의해야 한다. 
}
```

위 코드의 주석에서 써놓은 문제를 예방하려면 비동기적으로 `launch`를 실행하거나, `launch`가 모두 다 실행될 때까지 기다려야 한다.
코루틴 스코프 객체가 필요없는 `runBlocking`이 기다려주는 역할을 도와주는데, 내부에 있는 코루틴들이 끝난 다음에야 반환되기 때문이다.

### async

`async`는 `launch`와 같은 일을 하는데 유일한 차이점은 `Job`을 상속한 `Deffered`를 반환한다는 것이다. 따라서 `async`를 `launch` 대신 사용해도 아무 문제가 없다.
`Deffered` 는 제네릭 타입이고 안에 `await` 함수가 정의돼있는데, 사실 `Job` 은 `Deffered<Unit>`라고 보아도 무방하다. `async`는 코드 블록을 비동기로 실행할 수 있고
`await` 로 코드 블록의 반환값을 꺼내오는 식이다.

```kotlin
runBlocking {
  val asyncBlock = async {
    delay(1000L)
    1
  }
  
  val result = asyncBlock.await() // 1 이 들어간다.
}
```

### CoroutineContext & Dispatcher

`CoroutineContext`는 실제로 코루틴이 실행중인 여러 작업과 `Dispatcher`를 저장하는 일종의 맵이다.
같은 `launch` 를 사용하더라도 전달하는 컨택스트에 따라 서로 다른 스레드 상에서 코루틴이 실행될 수 있다.
```kotlin
launch {
  // 부모 컨택스트를 사용 (이 경우 main)
}

launch(Dispatchers.Unconfined) {
  // 특정 스레드에 종속되지 않음 (이 경우 main)
}

launch(Dispatchers.Default) {
  // 기본 디스패처를 사용
}

launch(newSingleThreadContext("MyOwnThread")) {
  // 새 스레드를 사용
}
```

### 코루틴 빌더와 일시 중단 함수

`launch`, `async`, `runBlocking` 은 코루틴 빌더다. 코루틴을 만들어주는 함수들이기 때문이다. 이 외에도 2가지가 더 있다.

* `produce`: 정해진 채널로 데이터를 스트림으로 보내는 코루틴을 만든다. ReceiveChannel을 반환한다.
* `actor`: 정해진 채널로 메시지를 받아 처리하는 액터를 코루틴으로 만든다. SendChannel 채널의 send 메소드를 통해 엑터에게 메시지를 전달한다.

일시 중단 함수들은 다음과 같다.

* `withContext`: 다른 컨텍스트로 코루틴을 전환한다.
* `withTimeout`: 정해진 시간안에 루틴이 완료되지 않으면 예외를 발생한다.
* `withTimeoutOrNull`: 정해진 시간안에 루틴이 완료되지 않으면 `null`을 반환한다.
* `awaitAll`: 모든 작업의 성공을 기다린다. 작업 중 어느 하나가 예외로 실패하면 `awaitAll`도 그 예외로 실패한다.
* `joinAll`: 모든 작업이 끝날 때까지 현재 작업을 일지 중단 시킨다.

### suspend 키워드

코루틴이 아닌 일반 함수 안에서 delay 나 yield 를 쓰면 컴파일 에러가 난다. yield 를 해야 하는 경우 코루틴에 진입할 때와 코루틴에서 나갈 때 코루틴이 실행 중이던 상태를 저장하고 복구하는 등의 작업을 할 수 있어야 한다. 현재 실행중이던 위치를 저장하고 다시 코루틴이 재개될 때 해당 위치부터 실행을 재개할 수 있어야 한다. 다음에 어떤 코루틴을 실행할 지 결정한다. 