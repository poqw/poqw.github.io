# Webflux

JVM 위에서 돌아가는 서비스를 마치 Node 처럼 이벤트 루프 방식으로 요청들을 비동기 처리할 수 있게 해주는 Spring의 모듈이다.
특히 마이크로 서비스 아키텍쳐 패턴에서는 서비스들 간의 호출이 매우 빈번하기 때문에, 전체적인 서버의 성능 향상을 위해서라도
Webflux를 도입하는 추세인 듯 하다.

Webflux + [Reactor](https://github.com/reactor/reactor) 를 도입해서 reactive programming 을 해볼 수 있지만, Webflux + 코틀린의 coroutine을 사용하면 훨씬 더 imperative한
스타일로 코드를 작성할 수 있다.

## Webflux + Reactor

### Flux & Mono

* Flux : 0 ~ N 개의 데이터 전달
* Mono : 0 ~ 1 개의 데이터 전달

```kotlin
Flux<Integer> ints = Flux.range(1, 3)
ints.subscribe(System.out::println)

Mono<String> mono = Mono.just("hello")
mono.subscribe(System.out::println)
```

### Controller와 연결하기

Controller 와 연결시키면 아주 간단하게는 이런 식이다. Spring에서 자동으로 `.subsribe()`를 해주기 때문에 아래와 같이 곧바로 `Flux`나 `Mono`를 리턴하는 것이 가능하다.

```kotlin
@RestController
class GreetingController() {
    @GetMapping("/hello")
    fun helloFlux(): Flux<Int> {
        return Flux.fromIterable(listOf(1, 2, 3))
    }

    @GetMapping("/hello/{id}")
    fun helloMono(@PathVariable id: Long): Mono<String> {
        return Mono.justOrEmpty("hello $id")
    }
}
```

## Webflux + Coroutine

Controller를 연결시킨 코드는 아래와 같다. `suspend` 함수를 호출하기 때문에 똑같이 `suspend` 키워드를 붙여주어야 한다.

```kotlin
@RestController
class GreetingController(private val greetingService: GreetingService) {
    @GetMapping("/hello/suspend")
    suspend fun helloSuspend(): GreetingDto {
        return greetingService.hello()
    }

    @GetMapping("/hello/webclient")
    suspend fun helloWebClient(): GreetingDto {
        return greetingService.helloWithWebClient()
    }
}
```

위에서 쓰인 `GreetingService`는 다음과 같다. imperative 하게 짜여진 코드라서 익숙하다.

```kotlin
@Service
class GreetingService(val webClient: WebClient) {
    suspend fun hello (): GreetingDto {
        delay(1000L) // 코루틴

        val message = "hello ${ZonedDateTime.now()}"
        return GreetingDto(message = message)
    }

    suspend fun helloWithWebClient (): GreetingDto {
        val body = webClient.get()
            .uri("localhost:8080/hello/suspend")
            .retrieve()
            .awaitBody<Any>()

        return GreetingDto(message = body.toString())
    }
}
```

## Reactor

Reactor는 왜 나왔는가? 수많은 동시 요청을 처리하려면 다음 2가지 중 하나를 해야 한다.

* 더 많은 스레드와 하드웨어 리소스를 사용해 병렬처리 한다.
* 현재 사용 중인 리소스를 더 효율적으로 사용할 방법을 찾는다. 

블로킹 코드에서는 DB요청이나 네트워크 호출 같은 경우 스레드는 데이터를 기다리는 동안 놀아버리므로 이를 해결하고자 했다. 병렬처리는 리소스를 낭비하는 경우가 생각보다 많고
원인을 알아내기 힘드므로 비동기 코드를 작성해서 2번째 방법을 달성하고자 했다.

Jvm 세계에서는 비동기 코드를 작성하기 위해서는 전통적으로 Callbacks와 Futures를 사용하는 방법이 있었으나 콜백 지옥과 같은 문제를 해결하기 힘들었다.
코드가 장황해서 파악하기 힘든 것도 문제 중 하나였고, 이를 해결하기 위해 Reactor가 탄생하게 되었다.

### Reactor context

Reactor는 이벤트를 처리하는 Thread가 `publishOn` 혹은 `subscribeOn` 과 같은 함수로 인해서 계속 바뀔 수 있다. 이로 인해 Transaction, Logback과 같이
ThreadLocal을 이용하여 데이터를 전달하는 기능들에 한계가 발생했다. 이를 해결하기 위해 Reactive Sequence 상에서 공유되는 Context 라는 게 도입되었다.

근데 이 Context라는 놈이 이해하기가 까다롭다. Context 는 key-value 쌍 자료형으로 Map 처럼 생겼다. 다음 몇 가지 특징을 가진다:

* Context는 불변이다. put, delete 등 값을 수정하려고 하면 기존 컨택스트는 두고 새로운 컨텍스트를 반환한다.
* Context.empty()로 비어있는 Context를 만들 수 있다.
* Context.of() 스태틱 메소드로 최대 5개까지 키-값을 저장하고 있는 Context 인스턴스를 만들 수 있다.
* putAll(Context) 를 사용하면 두 컨텍스트를 새로운 컨텍스트로 머지할 수 있다.
* Context는 체인 밑에서부터 위로 전파된다.

Context는 각 Subscriber에 연결되어 최종 subscribe에서부터 시작하여 체인 위로 전달되어 연산자에도 접근할 수 있게 된다. 이 때 Context를 전달하려면
SubscriberContext 연산자를 사용해야 한다. 이 연산자는 제공한 Context와 다운 스트림에서 받은 Context를 머지한다. 
이렇게 Context를 전달하고 나면 데이터를 조회할 수 있는데, Mono.subscriberContext() 라는 스태틱 메소드를 사용한다.

```kotlin
Mono.just("hello")
    .flatMap {
        Mono.subscriberContext()
            .flatMap { context ->
                println("context is $context")
                Mono.just("world")
            }
    }
    .subscriberContext { context ->
        context.put("hello", "world!!")
    }
    .block()
    .let {
        println("result => $it")
    }
```

위 코드에서 Context는 아래에서 위로 전파되기 때문에, context에 키는 hello 이고 값이 world!! 인 데이터가 먼저 쌓인다. 이 context를 조회하기 위해
flatMap안에서 Mono.subscriberContext()라는 스태틱 메소드를 실행했고, 그 결과로 context의 내용이 출력된다. 그 후 "hello"라는 초기 데이터를
"world"로 map 해주었으므로 block이후에는 world라는 데이터가 내려갈 것이다. 주의할 점은 put에 쓰이는 subscriberContext는 스태틱 메소드가 아니라는 것이다.
block 은 내부적으로 blockingGet을 호출하는데, blocking 방식으로 구독한다고 보면 된다.

결과는 다음과 같다.

```
context is Context1{hello=world!!}
result => world
```

그럼 다음 코드는 어떨까?

```kotlin
Mono.just("hello")
    .flatMap {
        Mono.subscriberContext()
            .flatMap { context ->
                println("first context is $context")
                Mono.just("foo")
            }
    }
    .subscriberContext { context ->
        context.put("first", "put")
    }
    .flatMap {
        Mono.subscriberContext()
            .flatMap { context ->
                println("second context is $context")
                Mono.just("bar")
            }
    }
    .subscriberContext { context ->
        context.put("second", "put")
    }
    .block()
    .let {
        println("result => $it")
    }
```

context는 위로 쌓이고, 데이터는 아래로 흐른다. 결과는 다음과 같다.

```
first context is Context2{second=put, first=put}
second context is Context1{second=put}
result => bar
```

내부적으로 이게 어떻게 가능한 것인지는 좀 더 공부해봐야 알것 같다. 지금으로선 어떻게 저렇게 쌓이는지 잘 모르겠다...

### 코루틴과의 결합

kotlinx.coroutines.reactor 라이브러리를 이용하여 코루틴과 reactor를 결합해서 사용해볼 수 있다.
아래 코드에서 쓰이는 `mono {}` 는 코루틴 빌더이면서 Mono<T> 를 반환하기 때문에 `subscriberContext`를 붙이는 것이 가능하다.

```kotlin
runBlocking {
    val p = mono {
        val pp = mono {
            val context = Mono.subscriberContext().awaitSingle()
            println(context)
        }
        delay(100)
        println("haha")
        pp.awaitSingle()
        "world"
    }
    .subscriberContext {
        it.put("hello", "world")
    }
    
    println("foo")
    delay(1000)
    println("bar")
    val r = p.awaitSingle()
    println(r)
}
```

결과는 다음과 같다. `.awaitSingle()` 은 가장 밖의 p 에서만 실행되었기 때문에 내부에서는 Context가 전파되는 모습니다.

```
foo
bar // 1초 뒤
haha // 0.1초 뒤
Context1{hello=world}
world
```