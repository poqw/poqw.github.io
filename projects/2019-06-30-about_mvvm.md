---
layout: post
featured: true
title: 안드로이드의 MVVM에 대하여
category: [design_pattern, mvvm]
author: hyungsun
image: assets/images/about_mvvm_1.jpg
---

인터넷에 MVVM에 대해 다루는 포스팅은 수없이 넘쳐난다. 그럼에도 내가 MVVM에 대해 다루고자 하는 이유는 1년 동안 MVVM을 안드로이드에 적용하고 다루면서 얻었던 크고 작은 깨달음들이 공유할만한 가치가 있다고 생각되어서다. 부디 이 글을 읽고 난 뒤 MVVM이 여러분의 머릿속에서 뿜어대는 안개가 조금은 걷혔으면 한다.

 MVVM은 2005년에 John Gossman에 의해 소개된 디자인 패턴으로 Model-View-ViewModel의 약자다. MVC, MVA, MVP 등등 유명한 각 패턴들의 단점을 보완하고자 고안되었다. 어떻게 보완했는지에 대해서는 너무 길어지므로 이 글에서 다루지 않겠다. MVVM의 개념을 잡기보다, 직접 MVVM을 안드로이드에 적용해보고자 하는 사람들에게 도움이 되고자 하는 게 이 글의 목표이기 때문이다. 

 만약 디자인 패턴에 익숙하지 않거나, MVVM을 처음 접하게 된다면 구성 요소 중  ViewModel이라는 녀석을 특히 이해하기 힘들어 한다. 이해했다고 하더라도, 실제 상황에 적용하려고 하다보면 패턴의 철학을 거스르고 있다는 듯한 느낌을 지우기 힘들때가 많았을 것이다. 주로 뷰가 복잡해지는 경우 이럴 때가 많은데, 아래에서 예시를 들어 소개하겠다.

### Model, View, ViewModel
우선 MVVM의 각 요소에 대해 언급하기 전에, 이러한 디자인 패턴을 왜 써야 하는지부터 짚고 넘어가야겠다. 개발자들은 왜 굳이 이런 복잡한 패턴을 만들었을까? 그냥 돌아가게만 짜도 아무 문제가 없는데, 도대체 어떤 이점이 있다는 걸까? 

 사실 답은 간단하다. 유지보수를 위해서다. 하지만 유지보수라는 이 4글자안에는 정말 많은 것들이 담겨있다. 가독성, 테스트, 기능 추가, 변경, 삭제, 버그 수정, 새로운 개발자에게의 인수 인계 등등. 디자인 패턴은 프로그램의 내용들을 모듈화하기 쉽게 만들어주고, 상호 직교하는 설계로 이끌어준다. 이 말은 곧 기능의 추가, 변경, 삭제 그리고 테스트까지 쉬워짐을 의미한다. 스파게티를 이미 만들어 놓고 면을 더 쫄깃하게 한다거나 소스를 더 감칠맛나게 만드는 일은 쉽지 않겠지만, 면과 소스 공장을 만들어 놓았다면 더 맛있는 스파게티를 만드는 건 상대적으로 쉬운 일이 되는 것과 같은 이치다. 또, 디자인 패턴은 관용구나 다름없기 때문에 새로운 개발자에게의 인수인계를 더 쉽게 만들어 주고, 아울러 코드의 가독성을 높이기도 한다. 비유를 하자면, "그 사람은 완전히 자기가 잘났다고 생각하고 있어. 사실 그 사람보다 잘하는 사람은 세상에 널렸는 데 말이야! 정말 한심하기 이를 데 없어."를 "그 사람은 우물 안 개구리야!" 라고 하면 훨씬 이해가 쉬운 느낌이다. 좀 더 세련된 사람(개발자)은 "정저지와(井底之蛙)"라는 표현을 쓰겠지. 무슨 느낌인지 알겠는가? 내가 만약 저 사자성어를 알고 있었다면 앞에 긴 서론(코드)을 읽을 필요 없이 대충 무슨 말(동작)을 하는지 훨씬 이해하기 쉬웠을 것이라는 말이다. 우리가 디자인 패턴을 알아두면 좋은 이유이기도 하다.  

서론이 길었다. 앞서 어렵다고 언급한 ViewModel과 함께, Model, View를 설명하겠다.

#### Model
Model은 View에 표시할 데이터를 의미한다. 가령 TODO List를 보여주는 화면을 만든다고 가정할 때 Model은 다음과 같을 것이다: (이 때까지만 해도 이 TODO예시를 끝까지 끌고 갈 줄 몰랐다)
```kotlin
data class TodoItem(
  val title: String,
  val isChecked: Boolean = false
)
```
MVVM의 Model을 설계할 때는 한 가지 중요한 철학을 기억해야 한다. View에 표시할 데이터라 함은, 어찌되었든  View에서 이 Model을 가져다가 뿌려준다는 의미다. 앞서 이야기한 모듈간 직교성 관점에서 직교성있게 서로 곂치는 일을 하지 않으려면 View는 보여주는 일만, Model은 데이터만 담당하는 게 좋다. 쉬운 이해를 위해 예시를 들어보자. 가령 `TodoItem`에 마지막으로 수정된 시간을 표기하는 기능을 넣어야 한다고 했을 때,

```kotlin
data class TodoItem(
  val title: String,
  val isChecked: Boolean = false,
  val updatedTime: DateTime
)
```
보다는 아래가 낫다.
```kotlin
data class TodoItem(
  val title: String,
  val isChecked: Boolean = false,
  val updatedTimeText: String
)
```
그 이유는 Model이 안고 있는 DateTime이라는 데이터를 View에서 처리할 이유가 전혀 없기  때문이다. 윗 방식 대로라면, View에서 DateTime을 `toString()`따위의 함수를 통해 타입 캐스팅을 해주어야 할 것이다. View에서 String으로 바꾸고 표시하는 것은 언뜻 간단해보여서 허용하고 싶은 마음이 들지 모른다. 하지만 localized하게 표시(한국에선 오후 3시 30분, 미국에선 3:30 pm)해야 한다면 상황은 더욱 악화된다. 이를 처리하는 로직이 View에 추가되어 View를 복잡하게 만들기 때문이다. 게다가 비록 성능차이는 미묘하겠지만, 랜더링하는 곳에서 저런 연산이 추가되면 성능저하를 유발한다. 그럼 아래처럼 설계했을 때 DateTime을 String으로 바꾸는 일은 누가 한다는 것일까? 이런 로직은 전부 아래에서 설명할 ViewModel이 담당하게 된다.

#### View
View는 UI(User Interface)를 의미한다. 안드로이드에서는 `Activity`, `Fragment` 따위가 뷰를 담당한다. View는 위에서 설명했듯이 단지 받은 데이터를 뿌리기만 해야한다. 즉, 다른 비즈니스 로직이나 데이터 모델이 여기 들어가서는 안된다. 특히 안드로이드에서는 더욱 그렇다. 안드로이드는 다른 플랫폼과는 다르게 라이프사이클이라는 특수한 시스템을 떠안고 있는데, 이를 처리하는 것만으로도 View는 상당히 복잡해지기 때문이다.  

 보통 어지간한 글들은 여기서 View에 대한 설명을 끝내지만, 나는 좀 더 깊게 들어갈 생각이다. 사람들은 MVVM 패턴에서 View가 어디까지 담당해야 하는지 매번 헷갈려하는데, 그 이유는 유저의 인터렉션과 바로 이 라이프사이클 때문이다. 위에서 설명한 TODO앱을 예시로 계속 들어, 만약 앱이 사용자의 눈앞에 켜졌을 때(`onResume`) 서버에서 다시 TODO list들을 받아와야 한다고 가정하자. 보통은 아래와 같이 구현을 할 것이다.

```kotlin
override fun onResume() {
  super.onResume()
  val call = myApp.getApi().getTodoList(currentDate)
  call.enqueue(object : Callback<TodoResponse>) {
    override fun onResponse(call: Call<TodoResponse>, response: Response<TodoResponse>) {
      updateView(response.body())
    }
    override fun onFailure(call: Call<TodoResponse>, t: Throwable) {
        // TODO: Handle error.
    }
  }
}
```
만약 [RxJava2](https://github.com/ReactiveX/RxJava) 를 쓴다면 조금 더 깔끔해지긴 하겠지만 어쨌든 간단하게 될 모양은 아니다.
 앞서 비즈니스 로직은 모두 ViewModel에 몰아넣으라고 했으므로 위와같은 서버와의 통신은 모두 ViewModel이 담당해야 할 텐데, ViewModel에서는 View가 사용자의 눈앞에서 켜졌는지 꺼졌는지 알 방법이 없다. 그래서 아래와 같이 ViewModel에 View가 알려주는 방법을 쓴다.

```kotlin
override fun onResume() {
  super.onResume()
  viewModel.onResume()
}
```
이렇게 ViewModel이 대신 처리할 수 있도록 위임하고, View는 받아온 데이터를 뿌리는 일에 집중하는 것이다.

#### ViewModel
위에서 Model과 View를 설명하면서 ViewModel을 꽤 언급했기 때문에, 대강 어떤 일을 도맡아서 해야하는 녀석인지 감이 온 사람도 있을 것이다. 모든 View와 관련된 비즈니스 로직은 이 곳에 들어가며, 데이터를 잘 가공해서 View에서 뿌리기 쉬운 Model로 바꾸는 역할을 한다. 


 여기서 또 헷갈릴만한 부분이 있는데, ViewModel은 View에게 명령을 하는 형태여선 안된다. 데이터를 받아와서 내가 만든 Model로 탈바꿈을 시켰더라도 "자 이제 다 됐어, 가져가서 뿌려!" 하고 View에게 명령해선 안된다는 말이다.  

 이게 무슨 말일까? 차근 차근 살펴보자. 우선 이를 가능케 하기 위해서 보통 Date Binding을 사용한다. 여기서 말하는 Data Binding은 안드로이드에서 제공하는 라이브러리인 [Data-Binding](https://developer.android.com/topic/libraries/data-binding)하고는 다르다. 물론 원리는 같지만, 패턴과 라이브러리라는 차이점이 있다. 어쨌든 Data Binding은 어떠한 Subject를 두고 다른 객체들이 이를 구독하게끔 한다. Subject가 업데이트 되면 다른 객체들이 자동으로 바뀌게 되는 형식이다.  


 이걸 안드로이드에서 구현하기 위해 직접 Observer패턴을 이용한 Data binding을 구현하거나, 안드로이드에서 제공하는 [ViewModel](https://developer.android.com/topic/libraries/architecture/viewmodel)을 사용하거나, RxJava2를 사용하는 방법이 있다. 요즘 트렌드는 아래처럼 핫한 RxJava2를 쓰는 추세다. 

```kotlin
class TodoViewModel {
  fun getTodoList(): Single<List<TodoItem>> {
    return myApp.getApi().getTodoList()
      .subsribeOn(Schedulers.io())
  }
}
```
이렇게 만들어진 ViewModel은 View가 가져다쓰면서 사용자와의 인터렉션과 라이프사이클 관련처리를 위임한다.

### Dive into MVVM
사실 여기서 코드는 완성된 것이 아니다. ViewModel에 아까 View에 있었던 `updateView` 함수가 보이지 않는다는 점을 눈치 챘는가? 이 함수는 View에서 호출해야 하는 함수이기 때문에 ViewModel에서는 하지 않는 것이다. 그렇다면 아까 이야기했던 "View가 onResume 일 때 서버에서 데이터를 받아와 뿌려준다"는 시나리오는 어떻게 진행되는 걸까? 

 우선 View가 `onResume`됨을 ViewModel에 알리기 위해 인터페이스를 만들어준다.

```kotlin
class TodoViewModel {
  /** Events from view. */
  sealed class Event {
    obejct OnResume() : Event
  }
  
  fun sendEvent(event: Event): Completable {
    return when (when) {
      isEvent.onResume -> handleOnResume()
    }
  }
  
  private fun handleOnResume(): Completable {
    // TODO: Implement.
  }

  fun getTodoList(): Single<List<TodoItem>> {
    return myApp.getApi().getTodoList()
      .subsribeOn(Schedulers.io())
  }
}
```

위에서 만든 `Event`를 View에서 불러준다.
```kotlin
override fun onResume() {
  super.onResume()
  viewModel.sendEvent(Event.OnResume)
}
```
이에 따라 `handleOnResume` 은 아래와 같이 구현한다.
```kotlin
private fun handleOnResume(): Completable {
  return myApp.getApi().getTodoList()
    .subsribeOn(Schedulers.io())
    .observeOn(AndroidSchedulers.mainThread())
    .doOnSuccess { todoItems ->
      // TODO: Handle todoItems.
    }
    .ignoreElement()
}
```
보통은 ViewModel 이 View의 어떠한 행동을 트리거하는 일 없이 끝나는 경우가 많다. 예를 들어 유저 프로필에서 내 정보를 수정했거나 하는 경우, 서버에 수정했다는 데이터만 보내기 때문에 뷰를 업데이트 할 필요가 없다. 그러나 지금처럼 데이터를 받아와서 뿌려줘야 하는 경우나, 인증을 거쳐서 새로운 홈 화면으로 보내줘야 할 경우에는 어쩔 수 없이 ViewModel이 View의 특정 액션을 트리거 해주어야 한다. 이를 위해 `todoItemsSubject`라는 걸 만든다.
```kotlin
class TodoViewModel {

  /** Events from view. */
  sealed class Event {
    obejct OnResume() : Event
  }
  
  private val todoItemsSubject = PublishSubject.create<List<TodoItem>>()
  
  fun bindTodoItems(): Observable<List<TodoItem>> = todoItemsSubject.hide()
  
  fun sendEvent(event: Event): Completable {
    return when (when) {
      isEvent.onResume -> handleOnResume()
    }
  }
  
  private fun handleOnResume(): Completable {
    return myApp.getApi().getTodoList()
    .subsribeOn(Schedulers.io())
    .observeOn(AndroidSchedulers.mainThread())
    .doOnSuccess { items ->
      val todoItems = items.map { item ->
        TodoItem(
          title = item.title,
          isChecked = item.isDone,
          updatedTimeText = item.updatedTime.toLocalizedString()
        )
      }
      todoItemsSubject.onNext(todoItems)
    }
    .ignoreElement()
  }
}
```
이제 View에 `todoItemsSubject` 를 바인드 해준다.
```kotlin
class TodoActivity : Activity {

  private val viewModel: TodoViewModel
  override fun onCreate(savedInstanceState) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_todo)
    // ...
    viewModel = TodoViewModel()
    viewModel.bindTodoItems()
      .observeOn(AndroidSchedulers.mainThread())
      .subsribe(::updateView, ::handleError)
      .disposeOnDestroy()
  }
  
  private fun updateView(items: List<TodoItem>) {
    myAdapter.updateItems(items)
  }
  
  private fun handleError(error: Throwable) {
    // TODO: Handle error.
  }
}
```
위에서 `myAdapter`를 초기화하는 부분은 생략되었다. 또, `disposeOnDestroy`는 `onDestroy`에서 해당 observable을 dispose시키겠다는 의미로 만든 간단한 유틸함수이긴 하나, 이 글과는 별 상관없으므로 더 설명하진 않겠다.  

 이로써, ViewModel은 View에 전혀 개입하지 않으면서 View를 업데이트 시킬 수 있는 구조를 갖추게 되었다. 

### 1:N 구조
 많은 블로그에서 MVVM의 장점은 ViewModel이 View와 1:N으로 대응될 수 있다는 점을 장점으로 이야기한다. 하지만 나는 **ViewModel과 View는 1:N구조다라는 점에 동의할 수는 있어도, 장점이라는 것에 동의하지 않는다**. 아직까지도 실전에서 장점이라고 판단될만큼 이를 효과적으로 써먹을 방법을 찾지 못했기 때문이다. 물론 위의 방법처럼 `todoItemSubject`를 구독하는 다른 뷰가 있다면 1:N구조를 쓸 수 있겠지만 사실 그런 경우는 정말 흔치 않다.  

 나는 ViewModel: View = 1:N 이라는 관계를 증명하기 위해서 Activity의 컴포넌트 하나(ex. `RecyclerView`, `WebView`, `CardView`...)를 View로 취급하는 ViewModel을 작성하기 위해 Activity안에 존재하는 모든 컴포넌트들이 한 개의 ViewModel에 바인딩되게끔 했다. 그러나 컴포넌트끼리 의존하게 되는 경우 코드가 매우 복잡해져서 패턴을 쓰는 의미가 없어졌다. 그 때문에 서로 의존하는 컴포넌트끼를 묶은 덩어리를 View로 보는 ViewModel을 작성해본 적도 있다. 그러나 역시 이 방법도 나중에 가선 결국 복잡해졌다. 그래서 내렸던 결론은, **MVVM에서 ViewModel과 View는 1:N관계가 성립할 수는 있으나 이를 굳이 그렇게 구현할 필요는 없다**는 것이다. 두 화면의 UI가 정말정말 비슷하다면 하나의 ViewModel에 바인딩해서 써볼 수는 있겠다.

### Deep dive
어쨌든 위처럼 ViewModel을 구상했다면 기본적이긴 하지만 나름 철학적으로 훌륭한 ViewModel을 완성시켰다고 볼 수 있다. 그러나 내가 글을 쓰게 된 이유에 부합하고자 여기서 한 발자국 더 내딛어 보고자 한다.  

 MVVM을 맨땅에서 적용해보려고 한 사람은 알 것이다. ViewModel과 View는 시스템 구조상 어쩔 수 없이 상호작용을 해야 하는데 데이터 바인딩이라는 개념은 아이러니하게도 **오히려 이를 방해하는 것처럼 보인다**. View가 "나는 이제 완전히 수동형이야. 무조건 구독만 할거라고!"라고 외친다 한 들, 사용자가 버튼을 누른다면 그 트리거는 View에서 당겨진다. 이 처리를 View가 손 놓고만 있다면 도대체 누가 하겠는가?  

 이 때문에 고민을 정말 많이 했었다. Android에 정말 MVVM을 적용할 수 있기는 한건가?
나는 정말 완전하게 수동적인 View를 만들기 위해서, 모든 뷰의 상태변화를 커버하는 Model을 정의해놓고 ViewModel을 구현해본 적이 있다. 맨 처음 상태의 View, 버튼이 눌린 상태의 뷰, 로딩 중인 뷰, 서버에서 데이터를 받아와 업데이트를 하고 난 이후의 뷰 등등 모든 변수를 Model에 쑤셔 박았었다.  

 언뜻 이 방법은 성공적인 듯 보였으나, 요구사항이 바뀌었을 때 들였던 노력은 거의 처참한 수준이었다. Model이 View에 대해서 너무나도 많은 부분을 알고 있어야 했기 때문이다. 결국 이 방법도 아니라는 생각이 들었다.  

 요새 짜는 코드에는 어찌되었든 내가 했던 시행착오들이 깃들어, 적어도 코드를 짜면서 '아 이건 좀 아닌 것 같은데...'하는 일은 없어졌다. 그 코드는 위에서 소개한 방법에서 조금만 더 수정하면 되므로, 간단히 추가하여 설명하겠다.  

 그 전에 정리부터 하자면, 위에서 말했던 상호작용은 크게 3가지로 나누어진다.
 1. View가 ViewModel을 구독: 서버에서 받아온 데이터로 뷰를 업데이트 하는 경우
 2. View가 ViewModel을 트리거: 사용자의 입력 이벤트를 ViewModel에 전달하는 경우 
 3. ViewModel이 View를 트리거: ViewModel이 처리한 결과로 View가 업데이트 되어야 하는 경우

3번은 특히, 로그인 버튼을 눌러 인증 성공했을 때 화면이 이동해야 하는 경우를 상상하면 쉽다.   

 위에서 짠 코드에서 변경할 점은 많지 않다. 이미 View가 ViewModel을 구독하는 경우와, View 가 ViewModel을 트리거하는 경우는 이미 구현했기 때문이다. ViewModel이 View를 트리거하는 경우만 추가하면 된다. 이를 위해 `todoItemsSubject`를 없애고 `requestSubject`라는 걸 선언한다.

```kotlin
class TodoViewModel {
  /** Requests to view. */
  sealed class Request {
    class ShowTodoItems(val todoItems: List<TodoItem>) : Request()
  }

  /** Events from view. */
  sealed class Event {
    obejct OnResume() : Event
  }

  private val requestSubject = PublishSubject.crate<Request>()
  
  fun bindRequest(): Observable<Request> = requestSubject.hide()
  
  fun sendEvent(event: Event): Completable {
    return when (when) {
      isEvent.onResume -> handleOnResume()
    }
  }
  
  private fun handleOnResume(): Completable {
    return myApp.getApi().getTodoList()
    .subsribeOn(Schedulers.io())
    .observeOn(AndroidSchedulers.mainThread())
    .doOnSuccess { items ->
      val todoItems = items.map { item ->
        TodoItem(
          title = item.title,
          isChecked = item.isDone,
          updatedTimeText = item.updatedTime.toLocalizedString()
        )
      }
      // todoItems를 Request로 한 번 감싼 것에 주의하자.
      requestSubject.onNext(Request(todoItems))
    }
    .ignoreElement()
  }
}
```
View에서는 이를 binding해준다.
```kotlin
class TodoActivity : Activity {

  private val viewModel: TodoViewModel
  override fun onCreate(savedInstanceState) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_todo)
    // ...
    viewModel = TodoViewModel()
    viewModel.bindRequest()
      .observeOn(AndroidSchedulers.mainThread())
      .subscribe(::handleRequest, ::handleError)
      .disposeOnDestroy()
  }
  
  private fun handleError(error: Throwable) {
    // TODO: Handle error.
  }
  
  private fun handleRequest(request: Request) {
    when (request) {
        is Request.ShowTodoItems -> handleShowTodoItems(request.todoItems)
    }
  }
  
  private fun handleShowTodoItems(items: TodoItems) {
    myadapter.updateItems(items)
  }
}
```
이렇게 하면  View는 ViewModel의 Subject를 여러개 구독할 필요가 없고 단 하나만 구독하면 된다. 심지어 ViewModel과 처리하는 구조도 비슷해져서 코드가 깔끔해지고 대칭을 이룬다는 느낌을 받는다. 차이점은, ViewModel은 비즈니스 로직을 처리하고 View는 UI로직만을 처리한다는 점이다.  여러 개의 Subject를 ViewModel에 만들어서 구독하는 것보다 훨씬 코드가 간결하기 때문에 요새는 이런식으로 코드를 많이 작성하는 편이다. 또, 개인적으로 안드로이드 진영에서 MVVM에 이만큼 가까운 구조는 없다고 생각한다. 

### Conclusion
사람들은 MVVM의 단점으로 ViewModel을 잘 설계하기가 어렵다는 점을 많이 지적한다. 그러나 위와 같은 구조를 가져가면, 설계하는 것이 어렵지 않다. 이 글을 안드로이드 개발자들이 나와 같은 생각을 하고 있길 바라며 글을 마치도록 하겠다.
