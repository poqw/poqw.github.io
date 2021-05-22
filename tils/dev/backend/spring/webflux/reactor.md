# Reactor 공식 문서 읽어보기

[리엑터 공식 문서](https://projectreactor.io/docs/core/release/reference/index.html) 를 들여다보면 강력한 스압이 느껴진다;
왼쪽 사이드 바 하나하나가 이렇게 많은 내용을 봐야하나 싶지만, 사실 자세히 보면 사이드 바 메뉴는 스크롤 앵커일뿐, 전체적으로는 그냥 원페이지 doc이다.
이걸 알고나니 좀 볼 수 있겠다는 자신감이 생겨서 읽어보려고 한다.

## 순서대로 읽는 건 바보 같아!

나에게 주어진 시간은 한정적이다. 쓸데 없는 건 건너 뛰어야한다! 우선 [Where to go from here](https://projectreactor.io/docs/core/release/reference/index.html#_where_to_go_from_here) 라는 메뉴가 있다.
시간을 아끼고 싶은 나에게 선택지를 주는 모양이다.

1. 너가 코드로 바로 점프하고 싶다면 [Getting started](https://projectreactor.io/docs/core/release/reference/index.html#getting-started) 를 봐
2. reactive programming 처음이라면 [개념부터 익혀봐](https://projectreactor.io/docs/core/release/reference/index.html#intro-reactive)
3. Reactor 컨셉이 친숙하지만 오퍼레이터가 헷갈린다면 [오퍼레이터 문서](https://projectreactor.io/docs/core/release/reference/index.html#which-operator) 를 봐
4. Reactor 의 핵심 기능들이 궁금하다면 [여기를](https://projectreactor.io/docs/core/release/reference/index.html#core-features) 봐
    * Flux, Mono 같은 타입들은 뭘까?
    * 스케줄러로 어떻게 컨텍스트의 스레드를 스위칭할까?
    * 에러 핸들링 어떻게 할지 궁금해?
5. Reactor 로 테스트를 짜고 싶다면 [여길](https://projectreactor.io/docs/core/release/reference/index.html#testing) 봐!
6. 더 [궁금해](https://projectreactor.io/docs/core/release/reference/index.html#advanced) ?

7지 선다라니.. 벌써부터 선택 장애가 오지만, 나는 reactor에 처음 발을 담근 초보자고, 다행히 reactive programming 에 대한 경험은 RxJava를 써본 덕에 있었다.
결론적으로 나의 선택지는 1번이다. 일단 코드부터 짜자! 그다음에 4번 순으로 가보면 될 거 같다. 나중에 TDD할때나 5번 정도 들여다 보고...

## 1. Jump into the code!

여기에 섹션이 4개나 된다. 전부 다 봐야하나? 음 난 초보자니까 차분히 봐보자..

* Reactor 소개
* 필수 요구 사항
* BOM과 versioning scheme에 대한 이해
* Reactor 해보기

### Reactor 소개

Reactor는 Reactive stream의 명세를 열심히 구현해놔서 fully non-blocking 하다는 설명이다. Flux나 Mono를 가지고 데이터 흐름을 만들어 낼 수 있다는 모양인데,
이건 코드 짜봐야 알겠지. CompletableFuture, Stream 그리고 Duration 같은 Java 8 API 들도 인테그레이션 되어 있다고 한다...지만 안써봤다(모르는 게 자랑은 아니지만 시간이 없는데 내가 알바냐구).

IPC(inter-process communication) 를 지원한다는 점이 적혀 있는데 오오 학부때 이후로 처음 보는 것 같군. 실무에서 써본 적은 아직 없다.

### Prerequisites

Reactor core 쓰려면 Java 8 이 필수란다. 당연히 그렇겠지 Java 8 API 를 인테그레이션 해놨다면서.. 뭐 별다른 이야기는 없다.

### BOM과 versioning scheme에 대한 이해

BOM(Bill of Materials, 자재 명세서 - 제품을 구성하는 모든 부품들에 대한 목록)이 뭔지 몰라서 찾아봤다. 아 그냥 버저닝 이야기였구나...
서로 다른 버전의 내부 아티펙트들을 사용하더라도 대략 문제없게 동작하도록 큐레이팅했다는 모양이다. 버전 스킴(메이저는 어떻고 마이너는 어떻고..) 이야기 나오는데 그냥 생까겠다.

### Getting Reactor

드디어 코딩을 한다. gradle로 의존성 설정부터 해야겠다. 요새는 코틀린 프로젝트 만들때 Gradle선택하면 build.gradle.kts 로 파일이 나오던데
doc에는 옛날 그루비 문법으로 작성되어있다. 눈치껏 때려맞춰서 진행해보자.

1. 아래처럼 plugins 설정한다.

```kts
plugins {
    // ...
	id("io.spring.dependency-management") version "1.0.11.RELEASE"
}
```

2. dependencies 설정을 해준다. 코틀린에서는 react-core가 아니라 reactor-kotlin-extensions 를 써야하나보다.

```kts
dependencies {
	implementation("io.projectreactor.kotlin:reactor-kotlin-extensions")
}
```

아.. 속은 느낌이다. 코드로 뭔가를 해볼 수 있는 튜토리얼이 있을 줄 알았는데, 이 섹션에는 없는 모양이다. deprecation policy 같은 필요없는 내용들만 알려주고 있는 것 같으니, 4번(Reactor 의 핵심 기능들이 궁금하다면...)으로 넘어가자!

### 4. Reactor Core Features

Reactor에서는 Publisher를 만드려면 `Flux` 와 `Mono`를 사용하면 된다. 사실 `Flux`는 0~N 개의 데이터를 뿜는 pub이고, `Mono`는 0~1 개의 데이터를 뿜는 pub이라서
`Flux`로 `Mono`를 표현하는 것이 가능하지만 의미상(semantic) 구분을 위해 두 타입을 만든 것이라고 한다. 사실 대부분의 http request는 Mono로 들어올 확률이 높으니
구분해 놓는 것이 나쁜 아이디어 같지는 않다. RxJava도 `Single` 있으니까..

Flux의 마블 다이어그램은 다음과 같다.

![](https://projectreactor.io/docs/core/release/reference/images/flux.svg)

뭐 딱히 중요해 보이는 내용은 없다. onComplete나 onNext등을 구현하거나 하지 않음으로써 무한이나 유한 시퀀스를 만들 수 있다는 것 같은데 실무에서
쓰려면 웬만하면 다 구현하는 게 맞지 않나? 싶다. 무한 시퀀스 했다가 메모리 릭나면 어쩌려구..!

Mnono의 마블 다이어그램은 다음과 같다.

![](https://projectreactor.io/docs/core/release/reference/images/mono.svg)

여기엔 별 내용이 없다기 보다는 설명을 굳이 어렵게 써놨다. 스킵하고 코드를 먼저 봐야겠다. 아이씨 java네.. 대충 코틀린으로 포팅해서 써보자.

```kotlin
val seq1 = Flux.just("foo", "bar", "foobar")
val iterable: List<String> = listOf("foo", "bar", "foobar")
val seq2 = Flux.fromIterable(iterable)
```

음.. seq1 처럼 `just`를 쓰거나 seq2 처럼 `fromIterable`을 쓸 수 있다는 걸 보여주고 싶은 것 같다. 다음!

```kotlin
val noData = Mono.empty<String>()
val data = Mono.just("foo")
val numbersFromFiveToSeven = Flux.range(5, 3)
```

팩토리 패턴으로도 `Mono`나 `Flux`를 생성할 수 있다는 말인 것 같다. 다음!

```kotlin
subscribe(): Disposable
subscribe(Consumer<? super T> consumer): Disposable 
subscribe(Consumer<? super T> consumer, Consumer<? super Throwable> errorConsumer): Disposable 

subscribe(Consumer<? super T> consumer, Consumer<? super Throwable> errorConsumer, Runnable completeConsumer): Disposable 

subscribe(Consumer<? super T> consumer,
          Consumer<? super Throwable> errorConsumer,
          Runnable completeConsumer,
          Consumer<? super Subscription> subscriptionConsumer): Disposable
```

위에서 pub에 대해 알아봤으니, subscribe의 인터페이스에 대한 설명을 하는 모양이다. completeConsumer는 타입이 Consumer가 아니라 Runnable이네?
그냥 .run 하고 마는건가. 음 실제 라이브러리 코드보니 `onComplete` 에서 진짜 `run` 하고 만다. `Disposable` 반환하는 건 cancel-and-clean-up behavior 때문에 그렇다고 한다.
완료나 취소처리를 하는 것이다.

```kotlin
val ints = Flux.range(1, 3)
ints.subscribe { i -> print(i) }
```

드디어 뭔가 보여지는 코드다. 결과는 `123`.

```kotlin
val ints = Flux.range(1, 4)
	.map { i ->
		if (i == 3) {
			throw RuntimeException("i cannot be 3")
		}
		i
	}
ints.subscribe({ i -> println(i) }, { e -> println(e) }, { println("complete") })
```

에러를 내고 처리하는 과정은 위와 같다. 결과는:

```
1
2
java.lang.RuntimeException: i cannot be 3
```

성공적으로 끝나지 못했으니, "complete" 는 결과에 찍히지 않는다.

subscribe 인터페이스 마지막에 소개된 `subscriptionConsumer` 는 어떻게 사용되는걸까?

```kotlin
val ints = Flux.range(1, 4)
ints.subscribe(
	{ i -> println(i) },
	{ e -> println(e) },
	{ println("complete") },
	{ sub -> sub.request(2) }
)
```

위 코드의 결과는 다음과 같다.

```
1
2
```

`sub.request()`를 통해 몇개의 이벤트만 받을 것인지 제한을 걸 수가 있는 모양이다. 언제 저런게 필요할까?
심지어 `sub.cancel()`로 코드를 바꾸면 아무것도 뱉지 않고 끝나버린다. 음 아직은 뭔지 잘 모르겠다. 근데 ㅋㅋ 3.5버전에서 deprecated 된 API 네..?
저렇게 쓰지 말고 `subscribeWith`를 쓰라고 한다.

#### Disposable

Disposable의 `dispose()` 메소드를 이용해 구독을 취소할 수 있다. 하지만 데이터 소스가 너무 빠르게 이벤트를 발행하는 녀석이라면 취소 이벤트를 받기도 전에 끝날 수도 있다고 한다.

또 Disposables라는 유틸 클래스를 소개해주는데, `Disposables.swap()` 과 `Disposables.composite(…)`에 대한 이야기가 나온다. 근데 사실 코드가 없으니 뭔 소린지 잘 모르겠다.
일단 넘어가자 ㅎ

#### An Alternative to Lambdas: BaseSubscriber

람다를 왜 안써..?  여기도 생깐다.

#### On Backpressure and Ways to Reshape Requests

음 여긴 중요해 보이는데 모르겠네. 코드도 없고! 그래서 스킵한다. ㅎㅎ

#### Programmatically creating a sequence

코드를 먼저 보는 게 빠를 것 같다.

```kotlin
val generator = Flux.generate<Int, Int>( // 앞의 Int가 .next() 로 넘겨줄 타입, 뒤의 Int가 state의 타입.
	{0}, // 초기 값 세팅하는 부분.
	{ state, sink -> // state는 현재 값, sink는 스트림 핸들러.
		sink.next(state)
		if (state == 5) {
			sink.complete()
		}
		state + 1
	}
)
generator.subscribe { i -> println(i)}
```

결과는 다음과 같다.

```
0
1
2
3
4
5
```

음 위에는 `generate`에 대한 설명이 나왔다면, 아래는 `create`, `push`, `handle` 에 대한 API 명세가 나온다.

* create: 멀티 스레드로 콜백이 실행되어질 수 있으면서, 한 번 라운드마다 여러 데이터를 한꺼번에 보내는 경우에 사용한다.
* push: 싱글 스레드로만 이벤트를 발송하거나 완료할 수 있으나 대신 비동기식으로 처리된다.
* handle: sink를 직접 조작하면서 스트림을 제어한다. `map` 쓰면 안되나? 애초에 이벤트 발행부터 제어하고 싶을 떄 쓰나보다.

#### Threading and Schedulers

`Flux`나 `Mono`에 대해 스레딩과 관련하여 아무런 오퍼레이팅 연산을 붙이지 않았다면, 기본적으로 .subscribe()가 호출된 스레드에서 실행된다.
Scheduler는 이런 Flux나 Mono가 어떤 스레드에서 실행되어야 할지에 대한 책임을 지는데, Schedulers에는 이를 위해 다음과 같이 execution context에 접근하기 위핸
static method들이 선언되어져 있다.

* `Schedulers.immediate()`: 현재 스레드에서 실행. 아마도 아무것도 설정하지 않을 때에 사용되는 모양인듯?
* `Schedulers.single()`: 재사용가능한 싱글 스레드. caller와 같은 스레드를 사용하는데, 콜마다 다른 스레드를 사용하고 싶다면 `Schedulers.newSingle()`을 사용한다.
* `Schedulers.elastic()`: 이건 쓰지 말고 밑에 `boundedElastic` 쓰라고 한다. 너무 많은 스레드를 사용하고 back pressure 문제가 잘 드러나지 않는다고 한다.
* `Schedulers.boundedElastic()`: 동적인 스레드 수를 가진 새로운 워커 풀을 만든다. 음.. 뭐라 뭐라 설명이 나오는데 I/O blocking 작업에 쓰면 좋다고 한다.
* `Schedulers.parallel()`: CPU 코어 개수 파악해서 그 고정된 수만큼 워커 스레드를 가진 스레드 풀을 만든다.

이제 `publishOn`과 `subscribeOn`에 대한 이야기가 나온다.

`publishOn`부터 살펴보기 위해 예제코드를 보자.

```kotlin
val scheduler = Schedulers.newParallel("new-parallel", 4)
val flux = Flux.range(1, 2)
    .map { i ->
        println("[1] Thread name: ${Thread.currentThread().name}")
        10 + i
    }
    .publishOn(scheduler)
    .map { i ->
        println("[2] Thread name: ${Thread.currentThread().name}")
        "value: $i"
    }

println("[3] Thread name: ${Thread.currentThread().name}")
val thread = Thread {
    println("[4] Thread name: ${Thread.currentThread().name}")
    flux.subscribe { i ->
        println("[5] Thread name: ${Thread.currentThread().name}")
        println(i)
    }
}
thread.start()
thread.join()
```

결과는 다음과 같다.

```
[3] Thread name: main
[4] Thread name: Thread-1
[1] Thread name: Thread-1
[1] Thread name: Thread-1
[2] Thread name: new-parallel-1
[5] Thread name: new-parallel-1
value: 11
[2] Thread name: new-parallel-1
[5] Thread name: new-parallel-1
value: 12
```
    
[1] 부분은 이미 앞선 데이터가 `publishOn`을 통과했더라도 항상 Thread-1 스레드에서 실행되고, `publushOn`이후의 동작들은 `new-parallel-1`에서
실행되고 있는 것을 확인해볼 수 있다.

그러나 위 코드에서 `publishOn`을 `subscribeOn`으로 바꾸면 결과가 다음과 같이 나오는데,

```
[3] Thread name: main
[4] Thread name: Thread-1
[1] Thread name: new-parallel-1
[2] Thread name: new-parallel-1
[5] Thread name: new-parallel-1
value: 11
[1] Thread name: new-parallel-1
[2] Thread name: new-parallel-1
[5] Thread name: new-parallel-1
value: 12
```

첫번째 오퍼레이터부터 곧바로 `new-parallel-1` 스레드로 실행되는 것을 확인해볼 수 있다.

#### Handling Errors

여긴 대략 `.onErrorReturn()`, `.onErrorResume()`, `onErrorMap()` 같은 오퍼레이터로 처리를 하는데, 대충 알 것 같으니 넘어가자.
`retry()`랑 `retryWhen()`도 나오네? 나중에 필요할 때 다시 찾아보면 될 것 같다.

#### Processors and Sinks

여기는 내용이 눈에 안들어온다. 나중에 봐야지!
