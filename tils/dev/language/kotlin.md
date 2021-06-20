# Kotlin

## Coroutine

코루틴은 non-blocking 으로 실행된다. 즉 아래와 같은 코드가 있다고 했을 때 `GlobalScope.launch` 이후에 `delay(1000L)` 과 코루틴 블록 밖에 있는 `println("Hello,")`
는 서로 다른 스레드에서 병렬로 실행하게 된다. 따라서 메인 스레드가 먼저 종료되어 버리면 코루틴도 덩달아 종료되므로 아래 2초간의 sleep을 거는 것이다.

```kotlin
fun main(args: Array<String>) {
    GlobalScope.launch { // 코루틴 빌더이다.
        delay(1000L)
        println("World!") // 이상하긴 한데, 직접 해보면 Thread.currentThread().name = main
    }
    println("Hello,") // 여기는 Thread.currentThread().name = DefaultDispatcher-worker-1 으로 나온다. 반대가 되어야 할 것 같은데..
    Thread.sleep(2000L)
}
```

저 슬립을 걸지 않으려면 `runBlocking`을 사용해 볼 수 있다. 이 녀석은 하위 코루틴이 모두 종료될 때까지 스레드를 블락한다.

```kotlin
fun main(args: Array<String>) = runBlocking {
    GlobalScope.launch {
        delay(1000L)
        println("World!")
    }
    println("Hello,")
    delay(2000L)
}
```

`delay`와 같은 모든 중단 함수(현재 스레드를 블록하기 때문에 중단 함수라고 불린다, `suspend` 키워드가 앞에 붙어도 중단함수라고 부른다)들은 코루틴 안에서만 호출될 수 있다.
`coroutineScope{ } `는 자식들의 종료를 기다리는 동안 현재 스레드를 블록하지 않는다. 아래 launch 블록 2개는 동시에 실행되고,
실행이 끝나야 Done이 출력된다.

```kotlin
// Sequentially executes doWorld followed by "Hello"
fun main() = runBlocking {
    doWorld()
    println("Done")
}

// Concurrently executes both sections
suspend fun doWorld() = coroutineScope { // this: CoroutineScope
    launch {
        delay(2000L)
        println("World 2")
    }
    launch {
        delay(1000L)
        println("World 1")
    }
    println("Hello")
}
```

따라서 결과는 다음과 같다.

```
Hello
World 1
World 2
Done
```

### CoroutineContext 와 CoroutineScope

CoroutineContext 는 인터페이스고 구현체는 다음 메소드들을 구현해야 한다.

* `get(key: Key<E>): E?`: Element : 연산자(operator) 함수로써 주어진 key 에 해당하는 컨텍스트 요소를 반환
* `fold(initial: R, operation: (R, Element) -> R): R` : 초기값(`initial`)을 시작으로 제공된 병합 함수를 이용하여 대상 컨텍스트 요소들을 병합한 후 결과를 반환한다. 
  예를들어 초기값을 0을 주고 특정 컨텍스트 요소들만 찾는 병합 함수(filter 역할)를 주면 찾은 개수를 반환할 수 있고,
  초기값을 `EmptyCoroutineContext` 를 주고 특정 컨텍스트 요소들만 찾아 추가하는 함수를 주면 해당 요소들만으로 구성된 코루틴 컨텍스트를 만들 수 있다.
* `plus(context: CoroutineContext): CoroutineContext` : 현재 컨텍스트와 파라미터로 주어진 다른 컨텍스트가 갖는 요소들을 모두 포함하는 컨텍스트를 반환한다.
  현재 컨텍스트 요소 중 파라미터로 주어진 요소에 이미 존재하는 요소(중복)는 버려진다.
* `minusKey(key: Key<*>): CoroutineContext` : 현재 컨텍스트에서 주어진 키를 갖는 요소들을 제외한 새로운 컨텍스트를 반환

이 인터페이스의 주요 구현체로는 3가지가 있다.

* `EmptyCoroutineContext`: 특별히 컨텍스트가 명시되지 않을 경우 이 singleton 객체가 사용된다.
* `CombinedContext`: 두개 이상의 컨텍스트가 명시되면 컨텍스트 간 연결을 위한 컨테이너역할을 하는 컨텍스트다.
* `Element`: 컨텍스트의 각 요소들도 `CoroutineContext` 를 구현한다.

CoroutineScope 는 기본적으로 CoroutineContext 하나만 멤버 속성으로 정의하고 있는 인터페이스다.
코루틴 빌더- `launch`, `async`, ..., 스코프 빌더- `coroutineScope`, `withContext` 들은 이 인터페이스의 확장 함수로 구현되므로 코루틴을 생성할 때
`CoroutineContext`를 기반으로 생성하게 된다.

```kotlin
class MyActivity : AppCompatActivity(), CoroutineScope {
  lateinit var job: Job
  override val coroutineContext: CoroutineContext
  get() = Dispatchers.Main + job

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    job = Job()
  }
  
  override fun onDestroy() {
    super.onDestroy()
    job.cancel() // Activity가 파괴되면 돌고 있던 job도 같이 파괴된다.
  }

  fun loadDataFromUI() = launch { // coroutineContext 기반으로 생성되었기 때문에 main thread 에서 동작한다.
    val ioData = async(Dispatchers.IO) { // <- launch scope에서 확장되었기 때문에, IO dispatcher 에서 동작한다.
      // blocking I/O operation
    }

    val data = ioData.await() // I/O 결과를 기다린다.
    draw(data) // main thread 에서 동작
  }
}
```

GlobalScope 는 Singleton object 로써 EmptyCoroutineContext 를 그 컨텍스트로 가지고 있다.
이 기본 컨텍스트는 어떤 생명주기에 바인딩 된 Job 이 정의되어 있지 않기 때문에 애플리케이션 프로세스와 동일한 생명주기를 갖는다. 즉, 이 스코프로 실행한 코루틴은
애플리케이션이 종료되지 않는 한 필요한 만큼 실행을 계속해 나간다.

### 코루틴 실행 cancel 하기

아래처럼 `launch` 가 반환하는 job을 cancel 시킴으로써 코루틴을 캔슬할 수 있다. 참고로 아래에서 `job.cancel()` 과 `job.join()` 을 합쳐주는 `job.cancelAndJoin()` 함수도 있다.

```kotlin
val job = launch {
    repeat(1000) { i ->
        println("job: I'm sleeping $i ...")
        delay(500L)
    }
}
delay(1300L) // 1.3초 기다림
println("main: I'm tired of waiting!")
job.cancel() // Job을 캔슬한다.
job.join() // job의 완료를 기다린다. 
println("main: Now I can quit.")
```

코루틴 캔슬링은 협조적이어야 한다. 이 말의 의미는, 항상 외부에서 cancel할 수 있게끔 코드를 작성하라는 뜻이다. 예를 들어, 아래 코드는 캔슬링에 비협조적이다.

```kotlin
val startTime = System.currentTimeMillis()
val job = launch(Dispatchers.Default) {
    var nextPrintTime = startTime
    var i = 0
    while (i < 5) { // CPU를 계속 잡아먹기 위한 while loop.
        // 0.5초가 지나면 printing
        if (System.currentTimeMillis() >= nextPrintTime) {
            println("job: I'm sleeping ${i++} ...")
            nextPrintTime += 500L
        }
    }
}
delay(1300L) // 1.3초 기다림
println("main: I'm tired of waiting!")
job.cancelAndJoin() // 캔슬링하고 완료를 기다린다.
println("main: Now I can quit.")
```

cancel 되어도 cancel 되었는지 코루틴 내부에서 알지 못하므로, while loop이 다 끝날때까지 코드가 실행되어 버린다. 협조적으로 바꾸려면,
첫 번째 방법으로 수시로 job의 상태를 검사하는 방법이 있다.

```kotlin
val startTime = System.currentTimeMillis()
val job = launch(Dispatchers.Default) {
    var nextPrintTime = startTime
    var i = 0
    while (isActive) { // isActive 상태일때만 실행된다.
        if (System.currentTimeMillis() >= nextPrintTime) {
            println("job: I'm sleeping ${i++} ...")
            nextPrintTime += 500L
        }
    }
}
delay(1300L)
println("main: I'm tired of waiting!")
job.cancelAndJoin()
println("main: Now I can quit.")
```

두 번째 좀 더 일반적인 방법으로, `CancellationException` 을 캐치해서 처리하는 방법이 있다.

```kotlin
val job = launch {
    try {
        repeat(1000) { i ->
            println("job: I'm sleeping $i ...")
            delay(500L)
        }
    } finally { // 여기서는 캐치 안하고 바로 finally로 넘어갔다.
        println("job: I'm running finally")
    }
}
delay(1300L)
println("main: I'm tired of waiting!")
job.cancelAndJoin()
println("main: Now I can quit.")
```

보통 코틀린이 취소됐을 때 개발자들이 하는 일은 파일을 닫거나, 통신 채널을 닫거나 혹은 다른 job을 취소하거나 하는 일들이라, suspend function 으로 뭔가를
할 필요는 없다. 그러나 드물게, 취소됐을 때 suspend function을 써야하는 경우라면 다음과 같이 작성해볼 수 있다.

```kotlin
val job = launch {
    try {
        repeat(1000) { i ->
            println("job: I'm sleeping $i ...")
            delay(500L)
        }
    } finally {
        withContext(NonCancellable) {
            println("job: I'm running finally")
            delay(1000L)
            println("job: And I've just delayed for 1 sec because I'm non-cancellable")
        }
    }
}
delay(1300L)
println("main: I'm tired of waiting!")
job.cancelAndJoin()
println("main: Now I can quit.") // finally 안에 delay(1000L)이 있기 때문에 1초 늦게 실행된다.
```

`NonCancellable` 이라는 코루틴 컨텍스트를 인자로 주면 취소할 수 없는 코루틴이 만들어진다. `Dispatchers.Default` 따위를 넘기게 되면 블록안에 있는 중단 함수 역시
같이 캔슬되어서 `job: And I've just delayed for 1 sec because I'm non-cancellable` 는 출력되지 않는다.

### 언제 코루틴을 cancel할까?

코루틴을 캔슬하는 가장 대표적인 경우는 바로 Timeout이 될 것이다. `withTimeout`을 통해 이 작업을 훨씬 쉽게 처리할 수 있다.

```kotlin
withTimeout(1300L) {
    repeat(1000) { i ->
        println("I'm sleeping $i ...")
        delay(500L)
    }
}
```

그러나 이 함수는 주어진 시간안에 코루틴이 종료되지 않으면 `TimeoutCancellationException`를 뱉는다는 점을 유의해야 한다. exception을 뱉는 게 싫다면,
다음과 같이 `withTimeouOrNill`을 써볼 수도 있다.

```kotlin
val result = withTimeoutOrNull(1300L) {
    repeat(1000) { i ->
        println("I'm sleeping $i ...")
        delay(500L)
    }
    "Done"
}
println("Result is $result") // Result is null
```

withTimeout 안에 있는 코드 블록은 비동기적으로 실행되기 때문에 아래와 같은 코드를 작성할 때 주의해야 한다.

```kotlin
var acquired = 0

class Resource {
    init { acquired++ }
    fun close() { acquired-- }
}

fun main() {
    runBlocking {
        repeat(100_000) { // 10만개의 코루틴을 동시에 돌려버린다.
            launch {
                val resource = withTimeout(100) {
                    delay(99)
                    Resource() // 리소스 할당
                }
                resource.close() // 리소스 해제
            }
        }
    }

    println(acquired) // 결과가 항상 0이 나오진 않는다.
}
```

결과가 0이 나와야할 것 같은데, 돌려보면 그렇지 않다. withTimeout 안에서 exception이 발생하면서 `close()`가 실행되지 않기 때문이다.
이런 leak을 예방하기 위해서는 아래처럼 작성해야 한다.

```kotlin
runBlocking {
    repeat(100_000) {
        launch { 
            var resource: Resource? = null
            try {
                withTimeout(60) {
                    delay(50)
                    resource = Resource()      
                }
            } finally {  
                resource?.close()
            }
        }
    }
}

println(acquired) // 결과는 항상 0이다.
```

### Suspending function composing 하기

아래 두 suspend function을 순차적으로 실행하려고 한다. 보통은 두 함수가 서로 의존적일 때 순차적으로 실행하려고 할 것이다.

```kotlin
suspend fun doSomethingUsefulOne(): Int {
    delay(1000L) // pretend we are doing something useful here
    return 13
}

suspend fun doSomethingUsefulTwo(): Int {
    delay(1000L) // pretend we are doing something useful here, too
    return 29
}
```

코틀린은 기본적으로 순차적으로 실행되기 때문에 아래처럼 하면 된다.

```kotlin
val time = measureTimeMillis {
    val one = doSomethingUsefulOne()
    val two = doSomethingUsefulTwo()
    println("The answer is ${one + two}")
}
```

그러나 만약 서로 독립적이라 비동기로 콜하고 결과를 한꺼번에 받을 수 있다면 성능은 2배 빨라질 것이다.

```kotlin
val time = measureTimeMillis {
    val one = async { doSomethingUsefulOne() }
    val two = async { doSomethingUsefulTwo() }
    println("The answer is ${one.await() + two.await()}")
}
```

`async`는 `launch` 와 개념적으로 같지만, `Deffered`라는 미래에 값을 주겠다라는 약속을 나타내는 `Job`을 반환한다. 물론 `Job`이기 때문에 필요하다면 `cancel`도 가능하다.

Lazy하게 실행하는 것도 가능하다.

```kotlin
val time = measureTimeMillis {
    val one = async(start = CoroutineStart.LAZY) { doSomethingUsefulOne() }
    val two = async(start = CoroutineStart.LAZY) { doSomethingUsefulTwo() }
    // some computation
    one.start() // start the first one
    two.start() // start the second one
    println("The answer is ${one.await() + two.await()}")
}
```

반드시 `start()`를 해주어야함을 신경써야 한다. `start()`를 해주지 않으면 순차적으로 동작해서 2초가 걸린다. 여기서 재밌는 건 `one.start()` 만 해주면
2초가 걸리고, `two.start()` 를 해주면 1초가 걸리긴 한다. 후자의 경우, `two.start()` 를 통해 제어가 넘어가고 `one.start()`를 만나 2, 1 순서로 동시에 실행되기 때문이다.

Async style로 작성된 함수들은 어떨까. 얘네들은 suspending function도 아니라서 아무데서나 쓰일 수 있다.


```kotlin
// The result type of somethingUsefulOneAsync is Deferred<Int>
@OptIn(DelicateCoroutinesApi::class)
fun somethingUsefulOneAsync() = GlobalScope.async {
    doSomethingUsefulOne()
}

// The result type of somethingUsefulTwoAsync is Deferred<Int>
@OptIn(DelicateCoroutinesApi::class)
fun somethingUsefulTwoAsync() = GlobalScope.async {
    doSomethingUsefulTwo()
}
```

이 경우, 함수들이 동시에 동작하긴 하나, 결과값을 받기 위해서는 suspending block 안으로 들어가야 한다.

```kotlin
fun main() {
    val time = measureTimeMillis {
        // 코루틴 밖에서 함수를 호출할 수 있다.
        val one = somethingUsefulOneAsync()
        val two = somethingUsefulTwoAsync()
        // but waiting for a result must involve either suspending or blocking.
        // here we use `runBlocking { ... }` to block the main thread while waiting for the result
        runBlocking {
            println("The answer is ${one.await() + two.await()}")
        }
    }
}
```

이 방식은 절대 좋은 방식이 아니다. `one.await()` 하기 전에 에러가 발생해서 caller 스레드가 종료되는 경우에도 백그라운드로 계속 잡이 실행되고 있기 때문이다.
이 문제를 해결하기 위해 나온 것이 Structured concurrency다.

### Structured Concurrency

Structured Concurrency는 에러 발생이나 캔슬을 계층적으로 처리하기 위한 개념이다. 즉 부모가 취소되면 자식도 다 취소된다.
위에서 쓰이던 두 suspend 함수를 묶어 다음과 같이 작성했다고 해보자.

```kotlin
suspend fun concurrentSum(): Int = coroutineScope {
    val one = async { doSomethingUsefulOne() }
    val two = async { doSomethingUsefulTwo() }
    one.await() + two.await()
}
```

위 함수는 각 함수안의 delay가 동시 실행되기 때문에 1초 만에 실행이 된다.

```kotlin
suspend fun concurrentSum(): Int = coroutineScope {
    val one = async { doSomethingUsefulOne() }
    throw Exception()
    val two = async { doSomethingUsefulTwo() }
    one.await() + two.await()
}
```

위와 같이 중간에 throw를 하더라도, 백그라운드에 도는 잡이 남아있거나 하지 않게 된다.

취소의 경우도 마찬가지다.

```kotlin
suspend fun failedConcurrentSum(): Int = coroutineScope {
    val one = async<Int> { 
        try {
            delay(Long.MAX_VALUE) // Emulates very long computation
            42
        } finally {
            println("First child was cancelled")
        }
    }
    val two = async<Int> { 
        println("Second child throws an exception")
        throw ArithmeticException()
    }
    one.await() + two.await()
}
```

`one`은 무한히 기다리는데, 같은 레벨의 `two`에서 exception이 발생하면 `one`도 같이 취소된다.
