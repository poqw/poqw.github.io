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