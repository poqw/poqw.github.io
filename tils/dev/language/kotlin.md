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

## Coroutine context and Dispatchers

코루틴은 항상 CoroutineContext 안에서 실행된다. 이 코루틴 컨텍스트는 여러 Element들의 집합이고, 가장 메인이 되는 Element는 코루틴의 Job과 그 Job의 Dispatcher다.

### Dispatchers and Threads

코루틴 디스패처를 포함한 코루틴 컨텍스트는 어떤 스레드(들)에서 코루틴이 실행되어야 하는지를 결정한다. 코루틴 디스패처는 코루틴이 특정 스레드나 스레드 풀에서 실행되게 하거나
혹은 아예 아무런 제한 없이(Unconfined) 실행되도록 할 수 있다.

`async`나 `launch` 같은 코루틴 빌더들은 optional로 CoroutineContext 파라미터를 받음으로써 디스패처를 특정할 수 있다. 컨텍스트는 여러 Element들의 집합인데
Dispatcher 또한 Element이므로 컨텍스트가 될 수 있다.

```kotlin
launch { // context of the parent, main runBlocking coroutine
    println("main runBlocking      : I'm working in thread ${Thread.currentThread().name}")
}
launch(Dispatchers.Unconfined) { // not confined -- will work with main thread
    println("Unconfined            : I'm working in thread ${Thread.currentThread().name}")
}
launch(Dispatchers.Default) { // will get dispatched to DefaultDispatcher 
    println("Default               : I'm working in thread ${Thread.currentThread().name}")
}
launch(newSingleThreadContext("MyOwnThread")) { // will get its own new thread
    println("newSingleThreadContext: I'm working in thread ${Thread.currentThread().name}")
}
```

만약 코루틴 빌더가 컨텍스트를 인자로 받지 않으면, 부모 컨텍스트를 상속받는다. 

### Unconfined vs Confined Dispatcher

Unconfined 디스패처는 맨 처음 중단 함수를 만났을 때 코루틴을 caller thread에서 실행시키고, 그 이후부터는 손을 놓아버린다. 즉, 중단 함수가 일을 끝내고 돌아왔을 때
실행될 스레드는 맨 처음의 caller thread가 아니라 그 코루틴이 실행되었던 스레드가 된다. Unconfined 디스패처는 일반적으로는 사용될 일이 거의 없다고 보면 된다.


Confined 디스패처는 코루틴이 일을 끝내고 돌아와도 caller thread를 유지 시켜준다. 다음 예시를 보자.

```kotlin
launch(Dispatchers.Unconfined) { // not confined -- will work with main thread
    println("Unconfined      : I'm working in thread ${Thread.currentThread().name}")
    delay(500)
    println("Unconfined      : After delay in thread ${Thread.currentThread().name}")
}
launch { // context of the parent, main runBlocking coroutine
    println("main runBlocking: I'm working in thread ${Thread.currentThread().name}")
    delay(1000)
    println("main runBlocking: After delay in thread ${Thread.currentThread().name}")
}
```

### Debugging coroutines and threads

코루틴은 한 스레드에서 suspend되었다가 다른 스레드에서 resume될 수 있어서, 디버깅하기가 까다롭다. 이 문제점을 해결하기 위해 IDEA 에서는 디버거로 브레이크 포인트를 만나면
코루틴인 경우 Coroutines 라는 탭을 하나 더 보여준다.

해당 탭에서는 어떤 코루틴들이 현재 존재하는지, 그리고 각 코루틴의 상태(SUSPENDED, RUNNING, CREATED, ..)를 보여준다.

만약 디버거를 쓰지 않을 작정이라면, `-Dkotlinx.coroutines.debug` 라는 옵션은 JVM에 추가해서 어떤 코루틴에서 해당 코드가 실행되었는지 로깅을 해볼 수 있다.

마지막으로, 디버깅 목적으로 코루틴에 직접 이름을 지정하는 방법도 있다.

```kotlin
log("Started main coroutine")
// run two background value computations
val v1 = async(CoroutineName("v1coroutine")) {
    delay(500)
    log("Computing v1")
    252
}
val v2 = async(CoroutineName("v2coroutine")) {
    delay(1000)
    log("Computing v2")
    6
}
log("The answer for v1 / v2 = ${v1.await() / v2.await()}")
```

### Jumping between threads

`withContext`를 통해 다른 컨텍스트에서 실행되고 있는 코루틴 안에서도 원하는 컨텍스트를 인자로 주어 코루틴을 실행시킬 수 있다.

```kotlin
newSingleThreadContext("Ctx1").use { ctx1 ->
    newSingleThreadContext("Ctx2").use { ctx2 ->
        runBlocking(ctx1) {
            log("Started in ctx1")
            withContext(ctx2) {
                log("Working in ctx2")
            }
            log("Back to ctx1")
        }
    }
}
```

`.use()`를 사용하여 Single thread context를 생성하고 더 이상 쓰이지 않으면 자동으로 release 하도록 할 수 있다.

결과는 다음과 같다. `runBlocking` 을 만나면서 Ctx1의 `@coroutine#1` 가 생성되었고, `withContext` 에서 ctx2 가 인자로 들어가면서 Ctx2의 `@coroutine#1` 가 새로 생성된다.
마지막으로 돌아왔을 때는 다시 Ctx1 의 `@coroutine#1`에서 실행된다.

```
[Ctx1 @coroutine#1] Started in ctx1
[Ctx2 @coroutine#1] Working in ctx2
[Ctx1 @coroutine#1] Back to ctx1
```

### Job in the context

Job도 Context라는 집합에 속한 Element 중 하나라고 했었다. 다음과 같은 코드로 확인이 가능하다. CoroutineContext는 operator get을 오버라이딩 하고 있어서
`[]` 로 접근이 가능하다. 코루틴 안에서 사용되던 `isActive` 는 `coroutineContext[Job]?.isActive == true`의 숏컷이다.

```kotlin
fun main() = runBlocking<Unit> {
    println("My job is ${coroutineContext[Job]}")    
}
```

### Children of a coroutine

Structured concurrency에서 게속 나왔던 이야기다. 아래 예시로 설명은 충분할 듯 하다.

```kotlin
val request = launch {
    launch(Job()) { // 새로운 Job 객체를 받았다. 부모 코루틴 컨텍스트를 상속받지 않음.
        println("job1: I run in my own Job and execute independently!")
        delay(1000)
        println("job1: I am not affected by cancellation of the request") // 따라서 요건 print된다.
    }

    launch { // 부모 코루틴 컨텍스트를 상속받는다.
        delay(100)
        println("job2: I am a child of the request coroutine")
        delay(1000)
        println("job2: I will not execute this line if my parent request is cancelled") // 따라서 요건 찍히지 않는다.
    }
}
delay(500)
request.cancel() // 0.5초가 지나면 request를 캔슬한다.
delay(1000)
println("main: Who has survived request cancellation?")
```

### Parental responsibilities

가장 최상단 코루틴에서 `join`을 해주기만 하면 그 자식들을 자동으로 기다린다.

```kotlin
val request = launch {
    repeat(3) { i -> // launch a few children jobs
        launch  {
            delay((i + 1) * 200L) // variable delay 200ms, 400ms, 600ms
            println("Coroutine $i is done")
        }
    }
    println("request: I'm done and I don't explicitly join my children that are still active")
}
request.join() // wait for completion of the request, including all its children
println("Now processing of the request is complete")
```

### Combining context elements

`+` 연산자로 여러 element들을 합쳐서 하나의 컨텍스트로 만들 수 있다.

```kotlin
launch(Dispatchers.Default + CoroutineName("test")) {
    println("I'm working in thread ${Thread.currentThread().name}")
}
```

### Coroutine Scope

코루틴 스코프를 지정하여 라이프 사이클을 가지는 오브젝트 안에서 일어나는 코루틴들의 라이프 사이클을 제한할 수 있다.

코루틴 스코프를 만드는 2가지 팩토리 함수는 다음과 같다.

* CoroutineScope(): 일반적인 용도의 스코프를 생성한다.
* MainScope(): 기본 디스패처를 `Dispatchers.Main` 으로 지정하여 스코프를 만든다.

```kotlinclass Activity {
    private val mainScope = MainScope()

    fun destroy() {
        mainScope.cancel()
    }
    
    // class Activity continues
    fun doSomething() {
        // launch ten coroutines for a demo, each working for a different time
        repeat(10) { i ->
            mainScope.launch {
                delay((i + 1) * 200L) // variable delay 200ms, 400ms, ... etc
                println("Coroutine $i is done")
            }
        }
    }
}
```

`activity.destroy()`가 호출되면 더 이상의 코루틴은 생성되거나 실행되지 않는다. 실행 중이던 코루틴은 cancel 된다.

```kotlin
val activity = Activity()
activity.doSomething() // run test function
println("Launched coroutines")
delay(500L) // delay for half a second
println("Destroying activity!")
activity.destroy() // cancels all coroutines
delay(1000) // visually confirm that they don't work
```

### Thread-local data

코루틴은 단 하나의 스레드에 국한되지 않기 떄문에, Thread-local 변수를 사용하는 것이 까다롭다. `ThreadLocal` 에다가 `asContextElement()` 확장 함수를 달아 이 문제를 해결했다.

```kotlin
val threadLocal = ThreadLocal<String?>() // declare thread-local variable

fun main() = runBlocking<Unit> {
    threadLocal.set("main")
    println("Pre-main, current thread: ${Thread.currentThread()}, thread local value: '${threadLocal.get()}'")
    val job = launch(Dispatchers.Default + threadLocal.asContextElement(value = "launch")) {
        println("Launch start, current thread: ${Thread.currentThread()}, thread local value: '${threadLocal.get()}'")
        yield()
        println("After yield, current thread: ${Thread.currentThread()}, thread local value: '${threadLocal.get()}'")
    }
    job.join()
    println("Post-main, current thread: ${Thread.currentThread()}, thread local value: '${threadLocal.get()}'")    
}
```

컨텍스트 전달하는 것을 빼먹기가 쉬우므로, `ensurePresent`함수를 써서 safely 하게 값을 가져오는 것이 좋다(Fail-fast 전략)

logging MDC나 Thread-locals 를 쓰는 다른 라이브러리와 코루틴을 합칠 때도 ThreadContextElement 인터페이스에 맞추어 구현을 하면 어떻게 잘 될지도 모르겠다.