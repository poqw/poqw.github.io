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

## CoroutineContext 와 CoroutineScope 

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
