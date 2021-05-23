# 코틀린 동시성 프로그래밍

## 1. Hello, Concurrent World!

어플리케이션이 시작되면 OS는 프로세스를 생성하고 메인 스레드를 연결한 뒤 해당 스레드를 실행한다.

프로세스는 어플리케이션의 인스턴스이고, 프로세스 내부의 스레드가 프로세스의 상태(Pid, handle, ...)에 접근이 가능하다.
어플리케이션도 여러 프로세스로 구현될 수 있지만 여기서는 단일 프로세스 구현에 한해서만 다룬다.

프로세스는 최소한 하나의 스레드를 포함하며 보통은 이 스레드는 메인 스레드가 되고, 이 스레드는 프로세스의 라이프 사이클과 밀접하게 연관된다.
각 스레드는 프로세스의 리소스에 접근하는 방법 외에도 각각 로컬 스토리지라는 자체 저장소도 가지고 있다.

### 코루틴

코루틴은 스레드 안에서 실행된다. 스레드 하나에 많은 코루틴이 있을 수 있지만 주어진 시간에 하나의 스레드에서 하나의 명령만이 실행될 수 있다.
즉 같은 스레드에 10개의 코루틴이 있다면 어느 한 시점에는 단 하나의 코루틴만 실행된다. 코틀린은 고정된 크기의 스레드 풀을 사용하고
코루틴들을 스레드들에 배포한다. 따라서 수천 개의 코루틴을 추가하는 것은 거의 영향이 없다. 코루틴이 일시 중단되는 동안 실행 중인 스레드는 다른 코루틴을 실행시키는 데 사용되기 때문이다.

### 동시성과 병렬성

* 동시성은 두 개 이상의 알고리즘의 실행 시간이 겹쳐질 때 발생한다. 코어가 하나라면 여러 스레드에 교차해서 번갈아가면서 실행이 되서 동시에 실행되는 것처럼 보이게 된다. 
* 병렬성은 두 개의 알고리즘이 정확히 같은 시점에 실행될 때 발생한다. 실제로 여러 스레드가 동시에 실행된다.

### CPU 바운드와 I/O 바운드

* CPU 바운드는 CPU 가 처리하는 작업을 중심으로 구현되는 알고리즘에 좌우 되는 성질이다.
* I/O 바운드는 네트워크나 파일 등 입출력에 의존하는 알고리즘에 좌우되는 성질이다.

CPU 바운드에서의 동시적 코드는 단일 코어만 제공되는 경우 기존 순차적 코드보다 오래 걸릴 가능성이 있다. 단지 스레드 교차 배치만 해주는데, 이 과정에서 컨텍스트 스위칭이 일어나는 비용이 들기 때문이다.
병렬 실행의 경우 순차적코드보다 n 배 빨라질 수 있다. 따라서 CPU 바운드라면 현재 사용 중인 장치의 코어 수를 기준으로 적절한 스레드 수를 생성하도록 고려해야 한다.
코틀린의 `CommonPool`은 이러한 CPU바운드 작업에 적절하다.

I/O 바운드에서는 끊임없이 무언가를 기다린다. 따라서 병렬성과 동시성이 유사하게 실행된다. 따라서 항상 동시성 구현으로 실행하는 것이 좋다.

### 동시성 주의사항

주로 다음 문제점들을 겪게 된다.

* 레이스 컨디션: 동시 실행되는 코드를 순차적으로 실행될거라 가정하는 경우에 주로 발생
* 원자성 위반: 데이터 접근 시에 다른 스레드의 간섭이 생기는 경우
* 교착 상태: 두 스레드가 서로를 기다리고 있는 경우
* 라이브 락: 교착 상태와 비슷, 다만 차이점은 상태는 계속 변하지만 이 변한 상태가 또 다시 다른 스레드를 막는 경우. 보통 교착 상태를 복구하려고 만든 알고리즘에서 많이 발생한다.

### 코틀린에서의 동시성

#### 넌 블로킹

코틀린은 중단 가능한 연산기능을 제공한다. 스레드를 블로킹 하는 대신 대기해야 하는 코드를 일시 중단하고 그 동안 해당 스레드를 다른 연산 작업에 사용한다. 이를 위해 Channels, Actors, Mutaual exclusions 와 같은 인터페이스 및 자료형을 제공한다.

#### 명시적인 선언

I/O 바운드는 동시성으로 묶는다는 관점에서 아래코드는

```kotlin
fun main () = runBlocking {
	val name = getName()
	val lastName = getLastName()
	println("$name $lastName")
}

suspend fun getName(): String {
  delay(1000)
  return "hyungsun"
}

suspend fun getLastName(): String {
  delay(1000)
	return "song"
}
```

다음과 같이 묶는게 좋다.

```kotlin
fun main () = runBlocking {
	val name = async { getName() }
	val lastName = async { getLastName() }
	println("${name.await()} ${lastName.await()}")
}
```

이런 식으로 동시에 실행되야 하는 시점을 명시적으로 코드에 표현할 수 있다.

이 외에도 여러 장점들이 있는데,

- 가독성: async - await 페어로 쓰일때 관용구로 보통 함수 이름을 async로 시작하거나 끝맺도록 하여 가독성을 높일 수 있다.
- 기본형 활용: 스레드를 관리하는 코드를 기본형을 제공한다.
- 유연성
    - Channels: 코루틴 간에 데이터 전송해주는 파이프
    - Worker pools: 많은 스레드에서 연산 집합의 처리를 나눌 수 있는 코루틴 풀
    - Actors: 채널과 코루틴을 사용하는 상태를 감싼 래퍼
    - Mutex: 동기화 메커니즘 제공
    - Thread confinement: 코루틴의 실행을 제한해서 지정된 스레드에서만 실행되도록 하는 기능
    - 생성자: 필요에 따라 정보를 생성할 수 있고, 새로운 정보가 필요하지 않을 때 일시 중단될 수 있는 데이터 소스

### 용어

- Suspending Computation: 해당 스레드를 차단하지 않고 실행을 일시 중지할 수 있는 연산. 이 연산은 다른 Suspending computation 이나 suspending function 에서만 실행되는 특징을 가진다.
- Suspending Function: Suspending Computation의 함수 형태. 위 `getName()` 이 예시이다.
- 람다 일시 중단: 람다에 suspend 가 붙은 형태
- 코루틴 디스패처: 코루틴을 시작하거나 재개할 스레드를 결정하기 위해 코루틴 디스패처가 사용된다. 모든 코루틴 디스패처는 CoroutineDispatcher 인터페이스를 구현해야 한다.
- 코루틴 빌더: suspend lambda를 받아 실행시키는 코루틴을 생성하는 함수다.
    - async: `Deffered<T>` 를 반환한다.
    - launch: Job 을 반환한다.
    - runBlocking: 내부 코루틴 실행 끝날 때까지 현재 스레드 차단.

## 2. 코루틴 인 액션

### 안드로이드의 UI 스레드

안드로이드는 UI 스레드 만이 뷰 계층을 생성 및 업데이트 할 수 있으며 또 반대로 UI 스레드에서는 네트워크 처리와 같이 블로킹이 되는 경우 예외가 발생한다.
즉, 백그라운드에서 요청하고, UI 스레드에서 업데이트 해야한다.

### 스레드 생성

코틀린은 스레드나 스레드 풀을 생성하는 과정을 단순화했다. 하지만 그것을 우리가 직접 액세스하거나 제어하지는 않는다.

#### CoroutineDispatcher

`CoroutineDispatcher`는 가용성, 부하, 설정을 기반으로 스레드 간에 코루틴을 분산시키는 오케스트레이터다.  즉, 코루틴을 특정 스레드 또는 스레드 그룹에서 실행하도록 할 수 있다. 다음 코드를 통해 스레드를 하나만 갖는 `CoroutineDispatcher` 를 만들 수 있다. 왜 이름이 `Context`로 끝날까? 내부 코드보면 결국에는 `CoroutineDispatcher`를 상속받고 있는 `ExecutorCoroutineDispatcher`를 상속받고 있다.

```kotlin
val dispatcher = newSingleThreadContext(name = "ServiceCall")
```

#### 코루틴을 시작하고 디스패처에 코루틴 붙이기

코루틴을 시작하려면 `async()` 나 `launch()` 를 사용하면 되는데, 이 둘은 항상 어떤 `CoroutineScope`에서 실행될지를 지정해 주어야 한다(여기선 무조건 `GlobalScope` 를 사용하도록 했다). 먼저 `async()`부터 살펴본다.

```kotlin
runBlocking {
    val task = GlobalScope.async {
        doSomething()
    }

    task.join()
    println("Completed")
}

fun doSomething() {
    // throw error!
}
```

위 코드는 아무런 예외에 대한 스택 출력없이 정상적으로 `"Completed"` 라는 결과가 출력된다.

```kotlin
@OptIn(InternalCoroutinesApi::class)
fun main(args: Array<String>) {
    runBlocking {
        val task = GlobalScope.async {
            doSomething()
        }

        task.join()
        if (task.isCancelled) {
            println("Cancelled: ${task.getCancellationException()}")
        } else {
            println("Completed")
        }
    }
}
```

위와 같이 `task.isCancelled` 로 검사해주어야지만 아래와 같은 결과를 받아볼 수 있다.

```kotlin
Cancelled: kotlinx.coroutines.JobCancellationException: DeferredCoroutine was cancelled; job=DeferredCoroutine{Cancelled}@79698539
```

이 방식은 불편하고 장황하다. 예외를 전파하려면 단순히 `.join()` 이 아니라 `.await()`를 사용하면 된다.

```kotlin
fun main(args: Array<String>) {
    val dispatcher = newSingleThreadContext(name = "ServiceCall")
    runBlocking {
        val task = GlobalScope.async {
            doSomething()
        }

        task.await() // 앱 비정상 종료되고 스택 트레이스가 찍힌다.
    }
}
```

`launch()` 도 별반 다르지 않은데, 차이점이라면 fire-and-forget 방식으로 연산이 실패한 경우에만 통보받기 원하는 경우에 사용한다는 점이다.

```kotlin
runBlocking {
    val task = GlobalScope.launch {
        doSomething()
    }

    task.join()
    println("Completed")
}
```

마찬가지로 앱은 비정상 종료되지 않는다.

위와같이 `GlobalScope.launch`에 아무런 인자 없이 사용하게 되면 `DefaultDispatcher`를 사용한다. 일례로, `Thread.currentThread().name` 를 통해 `launch`나 `async`블록안에서 Thread 이름을 출력하면 `DefaultDispatcher-worker-1` 라고 출력된다.

dispatcher를 지정해서 블록을 실행하려면 아래와 같이 `GlobalScope.launch` 에 인자로 전달하면 된다.

```kotlin
fun main(args: Array<String>) {
    val dispatcher = newSingleThreadContext(name = "ServiceCall")
    runBlocking {
        val task = GlobalScope.launch(dispatcher) {
            printThreadName() // 
        }

        task.join()
        println("Completed")
    }
}

fun printThreadName() {
    println("Thread: ${Thread.currentThread().name}")
}
```

### 요청 보류 여부를 위한 비동기 함수 생성

비동기 호출자로 감싼 동기 함수

```kotlin
fun doSomething() {
    // Network 처리
    GlobalScope.launch(Dispatchers.UI) {
        // UI 업데이트
    }
}

// 사용처
GlobalScope.launch(Dispatchers.Default) {
    doSomething()
}
```

위 방식은 블록들이 흩어져서 장황해진다는 단점이 있다. 하지만 표현은 명확해진다.

미리 정의된 디스패처를 갖는 비동기 함수

```kotlin
fun doSomethingAsync() = GlobalScope.launch(Dispatchers.Default) {
    // Network 처리
    GlobalScope.launch(Dispatchers.UI) {
        // UI 업데이트
    }
}

// 사용처
doSomethingAsync()
```

위 방식은 백그라운드에서 강제로 함수가 실행된다는 것을 다른 사람들에게 알리기 위해 함수의 이름을 올바르게 지정해야 한다는 제약이 생긴다. 또, 어떤 디스패처를 사용할지 호출자가 결정할 수 없다.

유연한 디스패처를 갖는 비동기 함수

```kotlin
fun doSomethingAsync(
    dispatcher: CoroutineDispatcher = Dispatchers.Default
) = GlobalScope.launch(dispatcher) {
    // Network 처리
    GlobalScope.launch(Dispatchers.UI) {
        // UI 업데이트
    }
}
```

여전히 함수에 적절한 이름을 부여해야 하고 함수가 인자로 디스패처를 받아야 한다.

## 3장 라이프 사이클과 에러 핸들링

### 잡과 디퍼드

비동기 함수는 다음 두 가지 그룹으로 나눌 수 있다.

- 결과가 없는 비동기 함수: 잡을 사용하자! e.g. 로그 쌓기
- 결과를 반환하는 비동기 함수: 디퍼드를 사용하자! e.g. API 호출

#### 잡

잡은 5가지 상태를 가질 수 있다.

![https://thdev.tech/images/posts/2019/04/Init-Coroutines-Job/coroutine-job.png](https://thdev.tech/images/posts/2019/04/Init-Coroutines-Job/coroutine-job.png)

- New: 존재하지만 아직 실행되지 않은 잡
- Active: 실행 중인 잡, 일시 중단된 잡도 여기에 포함
- Completed: 잡이 더 이상 실행되지 않는 경우
- Canceling: 실행 중인 Job에서 .cancel()이 호출되었지만 완전히 완료되지는 않은 경우
- Cancelled: 취소로 인해 완료된 잡. 이렇게 취소되는 경우도 완료로 간주될 수 있다.

**잡 생성하기 (isActive = false, isCompleted = false, inCancelled = false)**

```kotlin
fun main() {
    runBlocking {
        val job1 = Job() // 방법 1.
    }

    val job2 = GlobalScope.launch {
        // 잡은 기본적으로 생성되는 즉시 시작(Active로 바뀜)된다.
    }

    val job3 = GlobalScope.launch(start = CoroutineStart.LAZY) {
        // 하지만 LAZY 옵션을 주어 즉시 시작하지 않도록 할 수 있다.
    }
}
```

**잡 활성화하기 (isActive = true, isCompleted = false, inCancelled = false)**

활성화되었다는 것은 코루틴이 실행되고 있음을 의미한다. `start()` 나 `join()` 을 통해 실행시킬 수 있다.

```kotlin
fun main() {
    val job3 = GlobalScope.launch(start = CoroutineStart.LAZY) {
        delay(5000L)
        println("Done")
    }
    job3.start()
}
```

위 코드는 메인 스레드에서 잡을 기다려주지 않기 때문에 job이 완료되기 전에 프로그램이 종료된다. 대신 `join()` 을 쓰면 메인 스레드에서 기다리도록 할 수 있다.

```kotlin
fun main() {
    val job3 = GlobalScope.launch(start = CoroutineStart.LAZY) {
        delay(5000L)
        println("Done")
    }
    job3.join() // 컴파일 에러!! runBlocking {...}으로 감싸야 한다.
}
```

그러나 위 코드는 컴파일 에러가 난다. join이 suspend function이기 때문에 코루틴 스코프 안에서 실행되어야 하기 때문이다.

**잡 취소하기 (isActive = false, isCompleted = false, inCancelled = true)**

아래는 잡을 2초 뒤에 취소시킨다.

```kotlin
fun main() {
    runBlocking {
        val job3 = GlobalScope.launch(start = CoroutineStart.LAZY) {
            delay(5000L)
            println("Done")
        }
        delay(2000L)
				println("isActive ${job3.isActive}, isCancelled ${job3.isCancelled}, isCompleted ${job3.isCompleted}")
				// isActive true, isCancelled false, isCompleted false
        job3.cancel() // .cancel(CancellationException("Timeout")) 처럼 예외 전달 가능.
        // 또, cancelAndJoin() 함수도 제공한다.
				println("isActive ${job3.isActive}, isCancelled ${job3.isCancelled}, isCompleted ${job3.isCompleted}")
        // isActive false, isCancelled true, isCompleted false
    }
}
```

**잡 취소 완료하기 (isActive = false, isCompleted = true, inCancelled = true)**

취소 또는 처리되지 않은 예외로 인해 실행이 종료된 잡은 취소됨으로 간주한다.

```kotlin
@OptIn(InternalCoroutinesApi::class)
fun main() {
    runBlocking {
        val job3 = GlobalScope.launch(start = CoroutineStart.LAZY) {
            delay(5000L)
            println("Done")
        }
        delay(2000L)
        job3.cancel(CancellationException("Timeout"))

        println("Cancelled: ${job3.getCancellationException().message}")
        // isCompleted 는 false로 찍힌다?
    }
}
```

취소된 잡과 예외로 인해 실패한 잡을 구별해야 한다. `CoroutineExceptionHandler` 를 이용하면 취소가 아니라 예외로 인해 실패한 잡에 대한 처리를 할 수 있다.

```kotlin
fun main() {
    runBlocking {
        val exceptionHandler = CoroutineExceptionHandler { context, throwable ->
            println("Job cancelled dut to ${throwable.message}")
        }
        val job3 = GlobalScope.launch(exceptionHandler) {
            TODO("Not implemented") // 주석치면 핸들러 콜백을 실행되지 않는다.
            delay(5000L)
            println("Done")
        }
        delay(2000L)
        job3.cancel(CancellationException("Timeout"))
    }
}
```

`invokeOnCompletion` 을 통해 취소인 경우와 예외발생인 경우를 구별하여 완료시 처리를 할 수도 있다.

```kotlin
fun main() {
    runBlocking {
        val job3 = GlobalScope.launch {
//            TODO("Not implemented")
            delay(1000L)
            println("Done")
        }

        val cancellationException = CancellationException("Timeout")
        job3.invokeOnCompletion { cause ->
            when (cause) {
                null -> {
                    println("Job Completed!")
                }
                cancellationException -> {
                    println("Job Cancelled! due to timeout: ${cause.message}")
                }
                else -> {
                    println("Job Cancelled dut to unknown reason: ${cause.message}")
                }
            }

        }

//        job3.cancel(cancellationException)
        job3.join()
    }
}
```

#### 디퍼드

`Deferred`는 java의 `Future`와 같지만 혼동을 피하기 위해 선택된 단어다. 라이프사이클은 잡과 비슷하나 에러핸들링하는 부분에서 차이가 있다. 아래와 같이 좀 더 imperative하게 작성이 가능하다.

```kotlin
fun main() {
    runBlocking {
        val deferred = GlobalScope.async<Unit> { 
            TODO("Not implemented")
        }
        try {
            deferred.await()
        } catch (throwable: Throwable) {
            println("Deferred cancelled due to ${throwable.message}")
        }
    }
}
```

### 상태는 한 방향으로만 이동

잡이 특정 상태에 도달하면 이전 상태로 돌아가지 않는다. 예를 들어 `job.join()` 이후에 `job.start()` 를 한다고 해서 job이 두 번 실행되진 않는다.

### RSS - 여러 피드에서 동시에 읽기

```kotlin
fun main() {
    runBlocking {
        val news = loadNewsAsync().await()
        println(news)
    }
}

fun loadNewsAsync() = GlobalScope.async {
    val feeds = listOf("feed-url-1", "feed-url-2", "feed-url-3")
    val requests = feeds.map { fetchFeedAsync(it) }
    requests.forEach { it.await() }
		// getCompleted는 중단함수가 아니다. await로 모두 값을 받아와야지만 쓸 수 있다.
    requests.flatMap { it.getCompleted() }
    // 위 두줄은 아래처럼 해도 될텐데?
    // requests.flatMap { it.await() }
}

fun fetchFeedAsync(feedUrl: String): Deferred<List<String>> = GlobalScope.async {
    delay(1000L)
    listOf(feedUrl)
}
```

feed 가져올 때 예외가 발생한다면?

```kotlin
fun main() {
    runBlocking {
        val news = loadNewsAsync().await()
        println(news)
    }
}

fun loadNewsAsync() = GlobalScope.async {
    val feeds = listOf("feed-url-1", "feed-url-2", "feed-url-3")
    val requests = feeds.map { fetchFeedAsync(it) }
    requests.forEach { it.join() } // join을 통해 앱이 죽는 걸 막는다.
    requests
        .filter { !it.isCancelled } // 실무에선 실패한 요청에 대한 처리도 잊지 말아야 한다. 여기선 따로 처리는 안했지만...
        .flatMap { it.getCompleted() }
}

fun fetchFeedAsync(feedUrl: String): Deferred<List<String>> = GlobalScope.async {
    if (feedUrl == "feed-url-1") {
        throw Exception("Wrong feed!")
    }
    delay(1000L)
    listOf(feedUrl)
}
```
