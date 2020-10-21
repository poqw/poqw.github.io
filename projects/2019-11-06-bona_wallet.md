---

layout: post
title: Bona Wallet
category: [kotlin, ios, android, swift, mvvm,  my-project]
author: hyungsun
image: assets/images/bona_wallet_3.png
timelineText: Virtualized money reserve service for iOS and Android
startDate: 2018.11.1
endDate: 2019.3.20
asset_media: assets/images/bona_wallet_3.png
asset_caption: 
asset_credit:
---

> 완전히 똑같은 UI로 iOS, Android 이렇게 두 개 앱을 만들어 주세요.

### Preview
메인 화면은 다음과 같이 생겼다. QR코드를 찍으면 나의 testnet 계정에 코인이 적립되는 서비스다.
<p align="center">
  <img src="{{ site.url }}/assets/images/bona_wallet_3.png">
</p>


### Overview
이 프로젝트를 진행하려던 당시만 해도 [Flutter](https://flutter.dev/)는 수면 아래에 있었다. 지금이야 위와 같은 요청을 받는다면 네이티브 디펜던시가 막장이 아닌 이상 무조건 Flutter를 선택하겠다. 어쨌든 나는 프로젝트 기한이 정해져있었던 까닭에 일주일 정도의 리서치 기간을 가지고 다음 2가지 옵션 중에서 한 가지를 선택해야했다. 한 번도 써본 적 없던 [React-native](https://facebook.github.io/react-native/)를 공부해서 하이브리드 앱을 만들던가, 자신 있어하는 Kotlin과 그저 그런 정도인 Swift를 이용해 앱을 2개 따로 만들 것인가.

### React-native vs Swift + Kotlin

내게 주어진 퓨어한 개발 기한은 약 한 달 정도였기 때문에, 코딩 한 번에 iOS, Android 두 플랫폼의 앱을 뽑아낼 수 있는 React-native는 상당히 매력적으로 느껴졌다. 그러나 React-native 리서치를 일주일 정도 하고서 나는 등을 돌릴 수 밖에 없었다. 이유는 다음과 같았다.

- 당시엔 [React](https://reactjs.org/)에 익숙하지 않아, 단기간에 러닝 커브를 극복해야 하는 부담이 있었다.
  - React를 써보지 않았던 것은 아니었다. 다만 깊게 써보지 않았었고 자주 쓰던 프레임워크가 아니었기 때문에 러닝 커브 극복에 도움을 받을 수는 없었다.
- 문제가 생기면 원인을 찾기가 힘들었다.
  - 앞선 이유 때문일지도 모르겠으나, React-native가 던져주던 에러메시지는 참 불친절하다고 느껴졌었다.
- React-native용 외부 라이브러리가 풍요롭지 않았다.
  - 대표적으로 써봐야 할 라이브러리가 문자 인증 서비스, QRCode 인식과 web3 라이브러리였는데, 자료가 부족하고 신뢰하기 힘든 경우가 많았다. 특히 문자 인증 서비스는 한국을 대표하는 레거시 소프트웨어 수장 중 하나였기 때문에 더욱 불안했다.

결국 나는 Android로 재빠르게 개발을 완수하고, iOS를 뒤이어 개발하기로 마음먹게 되었다.

### 심각한 병에 걸려있던 개발자

당시는 한창 소프트웨어 아키텍쳐에 관심이 많아져 있을 때라, MVVM, MVP, MVC 등 여러가지 아키텍쳐를 직접 구현해보며 신나하던 때였다. 일명 '아키텍쳐 병'에 걸린 것이다. 이 병에 걸리게 되면 디자인 패턴을 적용하기 위해 무수히 많은 코드가 추가로 필요해진다고 하더라도 그 코드들이 예뻐보이게 되고 기능 구현을 하다가도 어느 순간 리펙토링에 흠뻑 취해있는 나를 발견하게 된다. 이 프로젝트를 하면서 내가 내렸던 가장 바보같은 결정은, iOS와 Android에 둘 다 똑같이 내가 선호하던 MVVM 패턴을 적용해 보겠다는 결정이었다. Android로는 MVVM을 적용해 보았지만 iOS로는 해본 적이 없어서 무언가 개발자 특유의 도전 정신이 피어올랐음은 부정할 수 없거니와 iOS진영에서 MVVM을 옹호하는 [그럴듯한 글](https://medium.com/@azamsharp/mvvm-in-ios-from-net-perspective-580eb7f4f129)들이 내게 악마의 속삭임을 한 것도 크게 한 몫했다.

<p align="center">
  <img src="{{ site.url }}/assets/images/bona_wallet_2.jpg">
</p>

### Android는 후다닥 만들었는데...

다행히 프로젝트 규모가 큰 편은 아니었다. Client side는 Splash를 포함해서 10개가 채 안되는 화면들을 구현해야 했고 굵직해보이는 일이라고는 간단한 네트워크 통신, 코인 지갑 생성 및 송금, SMS인증 방식의 로그인, QR코드 관련 작업이 전부 였다. Server 쪽은 더 할 일이 적었다. 원래 서비스 중이던 node 서버에 붙이는 거라 기존에 제공해주지 않던 API를 뚫는 작업만 추가로 하면 됐었다.

Android는 예상대로 2주 정도 되는 시간 만에 금방 만들었다. 그러나 문제는 iOS였다. MVVM을 쓰기 위해 Dependency Injection 라이브러리를 붙이고 ViewModel을 만들었는데 View이름이 ViewController고... 수도 없이 난관에 부딪혔다. MVVM을 강하게 밀어붙일수록 개발이 어려워지고 변경사항에 대응하기 힘들어졌다. iOS개발이 자꾸 늦어지게 되고 끝내 막바지에 다다라서는 그냥 apple의 디자인 원칙에 순응하고 말았다. 이 친구들은 개발자들이 iOS앱을 MVC로 만들길 바랐던 거구나. 지금에 와서 하는 말이지만, 이 난관이 '아키텍쳐 병'을 고치는 데 큰 도움을 주었다. 그래도 배운 점이 있다면 iOS앱을 MVVM으로 만들지 못하는 건 아니라는 것이다.

### 아쉬웠던 점

'아키텍처 병'에 걸려있었다고 해서 '아키텍쳐 마스터'였던 건 아니었다. 나름 잘 짜기 위해서 분투했던 흔적들도 보이지만 그래봤자 구린 코드들이다. 가령 다음은 당시 내가 구현했던 화면이다.
<p align="center">
  <img src="{{ site.url }}/assets/images/bona_wallet_5.png">
</p>

이 화면은 보통 처음 회원가입 시점에서 자주 마주치는 화면으로, 마케팅 수신 동의, 개인정보 수집 동의 따위의 체크 리스트와 확인 버튼을 보여준다.

다음은 이를 구현하기 위한 model 클래스다.

```kotlin
sealed class AgreementItem {

  sealed class Option(val iconResId: Int): AgreementItem() {
    class AllCheck(icon: Int) : Option(icon)

    class Marketing(icon: Int) : Option(icon)

    class Policy(icon: Int) : Option(icon)

    class Privacy(icon: Int) : Option(icon)
  }

  class Confirm(val enabled: Boolean): AgreementItem()
}
```

그리고 이 모델과 뷰를 컨트롤해주던 ViewModel은 다음과 같이 구현했다.

```kotlin
class AgreementViewModel : BaseViewModel<AgreementNavigator>() {
  enum class AgreementStatus(var checked: Boolean) {
    ALL_CHECK(false),
    MARKETING(false),
    POLICY(false),
    PRIVACY(false);

    fun toggle() {
      this.checked = !this.checked
    }

    fun getIconResId(): Int {
      return if (this.checked) {
        R.drawable.ic_check_checked
      } else {
        R.drawable.ic_check_unchecked
      }
    }
  }

  private val agreementItemsSubject =
      BehaviorSubject.createDefault<List<AgreementItem>>(getAgreementItems())

  fun agreementItemsUpdatedEvent(): Observable<List<AgreementItem>> = agreementItemsSubject.hide()

  fun onAgreementRowClicked(item: AgreementItem.Option) {
    when(item) {
      is AgreementItem.Option.AllCheck -> {
        val shouldCheck = !isConfirmed() || !AgreementStatus.MARKETING.checked
        AgreementStatus.values().forEach { status ->
          status.checked = shouldCheck
        }
      }
      is AgreementItem.Option.Marketing -> {
        AgreementStatus.MARKETING.toggle()
      }
      is AgreementItem.Option.Policy -> {
        AgreementStatus.POLICY.toggle()
      }
      is AgreementItem.Option.Privacy -> {
        AgreementStatus.PRIVACY.toggle()
      }
    }

    applyStatus()
  }

  fun onAgreementRowDetailClicked(item: AgreementItem.Option) {
    when (item) {
      is AgreementItem.Option.Privacy -> {
        navigator.openPrivacyDetail()
      }
      is AgreementItem.Option.Policy -> {
        navigator.openPolicyDetail()
      }
      is AgreementItem.Option.Marketing -> {
        navigator.openMarketingDetail()
      }
      is AgreementItem.Option.AllCheck -> {
        throw RuntimeException("Invalid item button clicked. $item")
      }
    }
  }

  fun onConfirmButtonClicked() {
    navigator.goNext()
  }

  private fun getAgreementItems(): List<AgreementItem> {
    return listOf(
        AgreementItem.Option.AllCheck(AgreementStatus.ALL_CHECK.getIconResId()),
        AgreementItem.Option.Policy(AgreementStatus.POLICY.getIconResId()),
        AgreementItem.Option.Privacy(AgreementStatus.PRIVACY.getIconResId()),
        AgreementItem.Option.Marketing(AgreementStatus.MARKETING.getIconResId()),
        AgreementItem.Confirm(isConfirmed())
    )
  }

  private fun isConfirmed(): Boolean {
    return AgreementStatus.PRIVACY.checked && AgreementStatus.POLICY.checked
  }

  private fun applyStatus() {
    AgreementStatus.ALL_CHECK.checked = isConfirmed() && AgreementStatus.MARKETING.checked
    agreementItemsSubject.onNext(getAgreementItems())
  }
}
```

뷰에서 `agreementItemsUpdatedEvent` 를 구독해 data-binding을 하고 있었고, ViewModel에서 뷰에 내려줄 모델의 상태 관리를 위해 `AgreementStatus` 를 들고 있는 형태다. 우선 모델이 안드로이드 API와 독립적일 수 있도록 Primitive 타입들만을 가지고 있는 것은 좋다. 그 이유는 모델과 뷰가 독립적일수록 각각을 테스트하기가 쉽기 때문이다. 그러나 isChecked와 같은 Boolean 타입이 아니라 icon을 가지고 있음으로서 쓸데 없이 `AgreementStatus` 와 같은 redundant한 inner class까지 등장하기 때문에 오히려 강박적으로 clean architecture를 따르려고 했던 점이 나쁜 코드를 탄생시키게 됐다. 즉, 나는 뷰에서 다음과 같은 로직이 들어가는 것조차 꺼려했던 것이다.

```kotlin
val iconResourceId = if (item.isChecked) {
  R.drawable.ic_check_checked
} else {
  R.drawable.ic_check_unchecked
} 
icon.setImageDrawable(ContextCompat.getDrawable(this, iconResourceId))

// Current code
icon.setImageDrawable(ContextCompat.getDrawable(this, item.icon))
```

View에 가벼운 로직이 들어가더라도, ViewModel에 Android dependency가 걸리는 것 보다는 낫다. 한 가지 더 아쉬운 점은, Confirm 버튼은 Agreement와는 무관하기 때문에 모델에서 이미 분리했었어야 했다는 것이다.

똑같은 코드를 Swift로는 어떻게 짰을까?

다음은 UI가 Android와 완전히 똑같은 iOS UI를 구현하는 코드다.

```swift
struct AgreementItemBox {
  var allCheckItem: AgreementItem
  var policyItem: AgreementItem
  var privacyItem: AgreementItem
  var marketingItem: AgreementItem
  var confirmItem: ConfirmItem

  init() {
    self.allCheckItem = AgreementItem()
    self.policyItem = AgreementItem()
    self.privacyItem = AgreementItem()
    self.marketingItem = AgreementItem()
    self.confirmItem = ConfirmItem()
  }

  mutating func policyClicked() {
    policyItem.toggle()
    update()
  }

  mutating func privacyClicked() {
    privacyItem.toggle()
    update()
  }

  mutating func marketingClicked() {
    marketingItem.toggle()
    update()
  }

  mutating func allCheckClicked() {
    allCheckItem.toggle()
    policyItem.check(allCheckItem.checked)
    privacyItem.check(allCheckItem.checked)
    marketingItem.check(allCheckItem.checked)
    update()
  }

  private mutating func update() {
    allCheckItem.check(policyItem.checked && privacyItem.checked && marketingItem.checked)
    confirmItem.enable(policyItem.checked && privacyItem.checked)
  }
}

struct AgreementItem {
  var checked: Bool

  init(checked: Bool = false) {
    self.checked = checked
  }

  mutating func toggle() {
    self.checked = !self.checked
  }

  mutating func check(_ checked: Bool) {
    self.checked = checked
  }
}

struct ConfirmItem {
  var background: UIColor
  var enabled: Bool

  init(enabled: Bool = false, background: UIColor = BonaColor.black12.uiColor) {
    self.enabled = enabled
    self.background = background
  }

  mutating func enable(_ enabled: Bool) {
    self.enabled = enabled
    if (enabled) {
      self.background = BonaColor.violet.uiColor
    } else {
      self.background = BonaColor.black12.uiColor
    }
  }
}
```

Android와는 다르게 Model에 로직이 들어가 있다. 이 때 당시에 나는 MVVM이란 개념이 머릿속에 완벽히 정리되었던 것은 아니었기 때문에, 같은 시기 작성한 코드라도 이렇게 많이 달라져있었다는 게 스스로도 놀랍다. 우선 모델에서는 저런 로직들이 들어가지 않는 게 좋다고 생각한다. 지금 상황이야 뷰 컴토넌트끼리 상호작용하는 로직이 간단해서 저런 코드로 해결이 가능하지만, 나중에 뷰가 복잡해지면 모델도 덩달아 복잡해 지게 되는데 이는 곧 모델과 뷰에 간접적으로 디펜던시가 걸린다는 뜻이다. 

다음은 ViewModel이다.

```swift
public final class AgreementViewModel {

  var agreementRouter: AgreementRouter!
  private var agreementItemBox: AgreementItemBox
  private let agreementItemBoxSubject: BehaviorSubject<AgreementItemBox>

  init() {
    agreementItemBox = AgreementItemBox()
    agreementItemBoxSubject = BehaviorSubject<AgreementItemBox>(value: agreementItemBox)
  }

  func agreementItemBoxUpdatedEvent() -> BehaviorSubject<AgreementItemBox> {
    return agreementItemBoxSubject.asObserver()
  }

  func onAllCheckButtonClicked() {
    agreementItemBox.allCheckClicked()
    agreementItemBoxSubject.onNext(agreementItemBox)
  }

  func onPolicyButtonClicked() {
    agreementItemBox.policyClicked()
    agreementItemBoxSubject.onNext(agreementItemBox)
  }

  func onPrivacyButtonClicked() {
    agreementItemBox.privacyClicked()
    agreementItemBoxSubject.onNext(agreementItemBox)
  }

  func onMarketingButtonClicked() {
    agreementItemBox.marketingClicked()
    agreementItemBoxSubject.onNext(agreementItemBox)
  }

  func onConfirmButtonClicked() {
    if (!agreementItemBox.confirmItem.enabled) {
      return
    }

    agreementRouter.route(to: AgreementRoute.KCP)
  }
}
```

모델이 뷰모델에 있을 로직을 빼앗아 갔기 때문에, 뷰모델은 보기에는 깔끔해보인다. 분명 Android 에서 코드를 작성할때 깔끔하지 못했던 ViewModel 때문에 수치심을 느꼈던 거겠지. 

### 좋았던 점

완전히 똑같은 앱을 서로 다른 플랫폼으로 구현해보는 건 상당히 좋은 경험이었다. 로직이나 구현방식이 완전히 비슷한 부분도 있었고, 비슷할 것 같았지만 완전히 다르게 구현해야 하는 부분도 보았다.

예를 들어 이 화면은 Android, iOS 비슷하게 구현이 되지만,
<p align="center">
  <img src="{{ site.url }}/assets/images/bona_wallet_6.png">
</p>

이 화면은 상당히 다르게 구현이 되어야 한다. 안드로이드에서는 AppBarLayout이 opacity나 scroll animation을 알아서 처리해주지만 iOS는 그게 안되서 통째로 tableView로 만든 뒤 메인 셀만 따로 처리해 주어야 하기 때문이다. 
<p align="center">
  <img src="{{ site.url }}/assets/images/bona_wallet_7.png">
</p>

어쨌든 여러모로 실력을 쌓은 데 도움이 되었다고 생각한다. 무엇보다도 아키텍쳐에 관해서 좀 더 명확하게 정리할 수 있는 계기가 되었다.

