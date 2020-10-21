---
layout: post
title: Rxjava multi threading
category: [rxjava, kotlin, multi-threading, parallel]
author: hyungsun
image: assets/images/routing-and-deadlock-in-networks.png
---

### RxJava multi threading
[RxJava](https://github.com/ReactiveX/RxJava)는 근 몇 년 간 개발자들의 프로그래밍 트랜드에 우뚝 서있는 [리액티브 프로그래밍](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754)을 도와주는 라이브러리다. 아래에서 설명하기 쉽게 아주 좁은 의미로 RxJava를 정의하자면 비동기 프로그래밍을 도와주는 유틸이라고 하겠다. 물론 RxJava는 단순한 비동기 유틸 따위보다 훨씬 강력하고 매력적이다.

최근에 작업하던 코드에서 parallel 로 비동기 작업을 진행할 일이 생겼다. 비동기 작업은 RxJava에서 보통 `Observable` 혹은 `Single` 혹은 `Completable`로 표현이 되는데,  성격은 조금씩 다르지만 구독하고 있는 녀석에게 비동기 작업이 끝나면 값을 전달해준다는 의미에서 각각은 크게 다르지 않다. 가령 다음의 예시를 보자:

```kotlin
Single.fromCallable<String> {
  someAsyncTask()
}
.subscribeOn(Schedulers.io())
.subscribe { item ->
  Log.d("Single", "item: $item")
}
```

위 코드는 아주 간단한 Single의 예시로, `someAsyncTask`를 통해 뿜어져 나온 String 결과를 `item`에 담아 전달한다. 이 때 `someAsyncTask` 를 책임지고 실행하는 쓰레드는 `Schedulers.io()`라는 쓰레드다. 이렇듯 비동기 작업의 값을 전달받아 구독하는 흐름은 Single뿐만 아니라 위에서 소개한 다른 녀석들도 마찬가지다.

### ExecutorService

Java에서는 (좁은 의미의)RxJava와 비슷한 녀석으로 [ExecutorService](https://docs.oracle.com/javase/7/docs/api/java/util/concurrent/ExecutorService.html)라는 비동기 작업 유틸을 제공해 준다. 그렇다면 RxJava와는 어떤 게 다를까? 위에서 예시로 든 Single을 `ExecutorService`를 이용하면 다음과 같이 표현할 수 있다:
```kotlin
val executor = Executors.newFixedThreadPool(1)
val future = executor.submit(someAsyncTask)
try {
  val item = future.get()
  Log.d("ExecutorService", "item: $item")
} catch (exception: Exception) {
  when (exception) {
    InterruptedException,
    ExecutionException -> e.printStackTrace()
    else -> throw exception
  }
} finally {
	executor.shutDownNow()  
}
```

위 코드에서는 ThreadPool이라는 개념이 등장한다. 쉽게 말해 `ExecutorService`가 보유한 일꾼 숫자다. 위 코드에서는 단 한 명의 일꾼만을 고용하고 있다. 이 일꾼이 작업한 내용은 지금 당장은 받지 못하고 미래에 받게 될 것이므로 [Future](https://docs.oracle.com/javase/8/docs/api/index.html?java/util/concurrent/Future.html)에 저장한다. 만약 `future.get()`을 하기 전까지 일꾼 녀석이 일을 끝내지 못했다면, `executor` 는 대단히 사려깊게도 이 일꾼을 기다려주게 될 것이다. 만약 이 일꾼이 기대를 져버리지 않았다면 item에 제대로 값이 들어오게 된다.

이처럼 구현해도 기대한 대로 동작은 하나, 한가지 치명적인 단점이 위 코드에 존재한다면 ThreadPool의 장점을 전혀 살리지 못한다는 데 있다. 일꾼 숫자가 단 한 명이기 때문이다. `newFixedThreadPool`의 인자로 3을 넘겨서 일꾼의 숫자를 3명으로 늘린다면 여러 비동기 작업이 들어왔을 때 잡히는 대로 쉬는 일꾼이 작업을 시작하게 된다. 가령 다음과 같다:

```kotlin
val executor = Executors.newFixedThreadPool(3)
val tasks = listOf(
  someAsyncTask1(),
  someAsyncTask2(),
  someAsyncTask3()
)
val futures = executor.invokeAll(tasks)
try {
  for(future in futures) {
    val item = future.get()
    Log.d("ExecutorService", "item: $item")  
  }
} catch (exception: Exception) {
  when (exception) {
    InterruptedException,
    ExecutionException -> e.printStackTrace()
    else -> throw exception
  }
} finally {
	executor.shutDownNow()  
}
```

각 일꾼들이 someAsyncTask 들을 실행시키고, futures에 future를 담는다. futures중에 특히 오래 걸리는게 있다면, 더 빨리 끝난 future가 있더라도 결과를 받지 못하고 있다가 작업이 끝나서야 줄줄이 결과를 받게 될 것이다. 

RxJava에서도 이런 식으로 구현할 수 있을까?

## Zip

쉽게 떠올릴만한 Operator로 [zip](http://reactivex.io/documentation/operators/zip.html)이 있다. 과연 zip은 우리의 고민을 해결해 줄 수 있을지 의문이다. 아래의 예시를 보자:

```kotlin
Single.zip(
  Single.fromCallable(someAsyncTask1()),
  Single.fromCallable(someAsyncTask2()),
  Single.fromCallable(someAsyncTask3()),
  Function3 { item1, item2, item3 ->
    Log.d("Zip", "item: $item1")
    Log.d("Zip", "item: $item2")
    Log.d("Zip", "item: $item3")
  }
)
.subscribeOn(Schedulers.io())
.subscribe()
```

총 3개의 비동기 작업을 zip으로 묶었다. 각 비동기 작업은 순차적으로 실행이 되지만 비동기 작업이기 때문에 시작하는 시점은 서로 간 거의 차이가 없다. 그리고 3개의 작업 중 가장 오래 걸리는 작업이 끝나면 각 작업들의 결과물들을 들고 `Function3` 로 진입할 것이다. 결국 3개의 작업은 결과적으로 거의 동시에 실행되게 된다. 언뜻 우리의 고민을 해결한 듯 보이나 사실 이 코드는 근본적인 문제점을 직시하지 못한다. 바로 일꾼의 숫자이다. 3개의 작업은 결국 한 명의 일꾼인 `Schedulers.io()` 만 작업을 진행하게 된다. 일꾼이 한 명이기 때문에 만약 비동기 작업이 아니라 동기적인 작업이 섞여 있었다면 나머지 비동기 작업은 실행되지 못하고 손가락을 빨고 있어야할 노릇이다. 이는 확실히 우리가 원하던 바가 아니다.

### FlatMap
[FlatMap](http://reactivex.io/documentation/operators/flatmap.html) 을 이용하면 약간은 신비로운 방식으로 접근 할 수 있다. 다음을 보자:
```kotlin
val tasks = listOf(
  Single.fromCallable(someAsyncTask1()),
  Single.fromCallable(someAsyncTask2()),
  Single.fromCallable(someAsyncTask3())
)
Observable.fromIterable(tasks)
          .flatMap { task ->
            task.subscribeOn(Schedulers.io()))
                .toObservable()
          }
          .toList()
          .subscribe({ items ->
            for(item: items) {
              Log.d("FlatMap" "item: $item")  
            }
          }, {})
```
flatMap은 각 Single 들을 새로운 스레드에서 병렬적으로 실행되게 하며, 이렇게 병렬적으로 서로 다른 스레드에서 실행되던 task들을 `toList()`가 기다려주는 역할을 한다. 가장 오래 걸리는 작업이 완료되고 나면 구독하는 녀석에게 결과를 전달해주게 되는데, 오래 걸리는 동기적인 작업이 섞여 있더라도 새로운 스레드가 처리되지 않은 비동기 작업들을 실행시켜 줄 것이다. 결국 우리가 원하던대로 고민을 해결한 것이다!

이 방식을 더욱 매력적으로 보이게 하는 점은 `executor`를 사용해 강력한 장점을 그대로 활용할 수 있다는 점이다. 아래와 같이 말이다:
```kotlin
val executor = Executors.newFixedThreadPool(3)
val tasks = listOf(
  Single.fromCallable(someAsyncTask1()),
  Single.fromCallable(someAsyncTask2()),
  Single.fromCallable(someAsyncTask3())
)
Observable.fromIterable(tasks)
          .flatMap { task ->
            task.subscribeOn(Schedulers.from(executor))
                .toObservable()
          }
          .toList()
          .subscribe({ items ->
            for(item: items) {
              Log.d("FlatMap" "item: $item")  
            }

            executor.shutdownNow()
          }, {})
```
달라진 점을 알겠는가? 이 코드는 사실 앞에 소개했던 예시와 매우 비슷하게 동작한다. 그러나 task가 굉장히 많은 경우 전자는 무한히 스레드를 만들어 내겠지만, 이 방식은 일정한 스레드 풀 안에서 작업이 끝난 스레드에게 재할당을 해줄 수 있게 된다는 점에서 더 깔끔하다.


사실 RxJava를 써본 사람 입장으로써 솔직히 쉽게 떠올려지지 않는 방식이긴 하다. 그러나 이런 발상을 통해 리엑티브 프로그래밍 가운데 스레드가 어떤 식으로 동작하는지 좀 더 깊게 이해할 수 있을 것이다.

### Conclusion
이상으로 RxJava를 멀티 스레딩하는 방식을 살펴보았다. RxJava 2.0.5에서는 [Parallel flows](https://github.com/ReactiveX/RxJava/wiki/Parallel-flows) 라는 새로운 개념을 소개한다. 아마 코드 안정화가 끝나고 나면 위에서 해주었던 방식을 좀 더 깔끔하게 나타내는 방법을 기대해볼 수 있을 것 같다.
간략하게 맛보기만 보여드리자면, 아래와 같이 쓰인다:

```java
ParallelFlowable<Integer> source = Flowable.range(1, 1000).parallel();
```

위에 내가 소개했던 방식도 마찬가지지만 순서를 보장해주지 않는다는 점을 명심하자. 이상으로 글을 마치도록 하겠다.