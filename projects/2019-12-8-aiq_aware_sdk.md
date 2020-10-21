---

layout: post
title: AIQ.AWARE
category: [kotlin, android, swift, my-project]
author: hyungsun
image: assets/images/aiq_aware_2.png
timelineText: Hyper personalization SDK
startDate: 2018.6.15
endDate: 2019.12.3
asset_media: assets/images/aiq_aware_2.png
asset_caption: 
asset_credit:
---

## Overview

[Hyper personalization](http://skelterlabs.com/hyper-personalization/) 엔진의 SDK를 개발했다. Hyper personaliztion 이란 고객의 real-world 데이터로부터 기계 학습을 통해 유의미한 Context를 추출하여 User modeling을 해주는 기술이다. 이를 통해 기존보다 훨씬 정교하고 효과적인 마이크로 마케팅을 구성할 수 있다.

## Duration

2018.6.15 ~ 2019.12.3 (Ver.02 출시)

## Development environment

- Language
  - Kotlin, Swift, Java, Javascript
- Library
  - Dagger, RxJava, Protobuf, Robolectric, Junit, Element-ui, Etc.
- Framework
  - Vue
- Tools
  - Android studio, VS Code, Xcode, IntelliJ, Mongo DB compass, Gerrit, Zeplin, Jira
  
## Contribution

내가 이 프로젝트에 기여한 부분은 다음과 같다.

- Android
  - Java to Kotlin migration
  - Refactoring the Event bus based data flow using RxJava2
  - Protobuf-lite, Android X Migration
  - Battery consumption evaluation & optimization
  - Implement signal collectors
  - Redesign SDK signal collecting architecture
  - Protobuf-lite, Android X Migration
  - Publish SDK to jcenter and maven
  - Support documentation and development sample apps
  - i8n
- iOS
  - Battery optimization
  - Implement signal collectors
  - Support AIQ.AWARE SDK development
  - Support documentation and development sample apps
- Web
  - SDK demo dashboard
- Backend
  - Development Jetty based RESTful API
  - Signal processing via Kafka stream server

## Contribution details

### Android

#### Java to Kotlin migration

기존에 짜여져 있던 Java코드를 테스트 코드 포함하여 전부 Kotlin으로 Migration했다. 당시 리서치하면서 찾아봤던 문서 중에 코드를 80% 정도로 단축시켜준다는 글을 봤었는데, Extensions 나 scope functions들을 잘 활용하면 더욱 단축시키는 게 가능하다. 가장 좋았던 건 Nullable한 코드를 많이 줄일 수 있었다는 점이다.

#### Refectoring the Event bus based data flow using RxJava2

Reactive하고 가독성있는 구조를 잡기 위해 기존 사용 중이던 [EventBus](https://github.com/greenrobot/EventBus) 의존성을 없애고, [RxJava](https://github.com/ReactiveX/RxJava)로 대체하여 전반적인 리펙토링을 하였다. EventBus는 매우 잘 설계된 라이브러리이지만 Message 타입이 많아질 경우 코드 복잡도가 가파르게 증가한다. 워커 쓰레드를 관리하는 부분도 이미 RxJava2에서는 훌륭하게 지원되고 있었고, 함수형으로 스트림처리까지 가능했기 때문에 RxJava를 선택하지 않을 이유가 없었다.

#### Battery consumption evaluation & optimization

SDK에는 여러 가지 기능들을 껐다 켰다하는 설정 기능이 있었는데, 이 기능들을 자동으로 켜고 끄면서 베터리를 측정해주는 데모 앱을 만들고, 통계를 통해 얻은 insight로 battery optimization을 진행했다. 가장 베터리 소모량이 많았던 건 GPS와 네트워킹으로, 주로 이 2가지 부분에서 최적화를 진행하였다.
- 항상 작동하는 foreground service를 주기적으로 켜고 꺼지도록 변경
- 불필요한 네트워킹 최적화
- Power mode에 따른 GPS accuracy 및 조회 주기 조절

#### Redesign SDK signal collecting architecture

기존에는 여러 collector가 각각의 타이머를 가지고 타이머가 켜질 때마다 signal을 수집하여 저장 후 한꺼번에 서버로 전송하는 구조였으나, Foreground service가 주기적으로 동작하도록 구조가 변경되면서 더 이상 원래 구조를 더 이상 유지하기 힘들었다. 게다가 Foreground service가 항상 동작하는 구조 또한 지원해야 하는 상황이었다. collector 의 종류에는 다음 3가지가 있었다.
- 언제든지 수집이 가능한 collector
- Foreground일 때만 가능하고, register후 Callback으로 결과 값을 전달받는 collector
- Foreground여부와 관계 없이 Broadcast를 수신하는 경우에만 결과값을 전달받는 collector
  
이를 위해 가장 상위에 SignalCollector라는 추상 클래스를 두고 그 아래 각각 PreodicCollector, SubscribingCollector, BoradcastCollector 를 두어 모든 상황을 만족하는 구조를 디자인 및 구현했다.

#### Publish SDK to jcenter and maven

Android library로 jcenter와 maven을 통해 SDK를 배포했다. Proguard rules 설정을 통해 외부에서 접근할 수 있는 클래스와 그렇지 않은 클래스로 나누고, 접근이 불가능한 클래스는 모두 난독화 시키는 등 최적화하였다.

#### Support documentation and development sample apps

SDK를 설치하는 방법, 문제 발생 시 해결책 등 개발과 관련된 부분을 [문서](http://skelterlabs.com/assets/Ver.-02-AIQ.AWARE-Android-SDK-developers-guide.pdf)로 작성했다.
또, SDK를 이용하고 싶은 외부 개발자를 위해 기능 별 예제를 담은 [sample apps](https://github.com/SkelterLabsInc/aware-android-sdk)를 개발했다.

### iOS

#### Battery optimization

iOS의 경우 서버에서 디바이스를 깨우게 하는 notification을 전송하더라도 운영체제 단에서 무시하거나, 그 주기를 조절해버리는 경우가 있기 때문에 동작을 강제할 수 있는 LocationManager가 항상 동작하도록 하는 수밖에 없었다. 그러나 이럴 경우 앱 자체가 suspend가 되지 않아 베터리 소모량이 엄청났기 때문에 LocationManager의 동작 방식을 변경하여 Battery optimization을 진행했다.

- 주기적으로 동작하더라도 확정적으로 앱이 Foreground으로 올라올 수 있도록 변경
- 불필요한 네트워킹 최적화

#### Support AIQ.AWARE SDK development

iOS SDK에 사용되는 여러 collector들과 네트워킹 모듈을 구현하였다.

#### Support documentation and development sample apps

SDK를 설치하는 방법, 문제 발생 시 해결책 등 개발과 관련된 부분을 [문서](http://skelterlabs.com/assets/Ver.-02-AIQ.AWARE-iOS-SDK-developers-guide.pdf)로 작성했다.
또, SDK를 이용하고 싶은 외부 개발자를 위해 기능 별 예제를 담은 [sample apps](https://github.com/SkelterLabsInc/aware-ios-sdk)를 개발했다.

### Web

#### SDK demo dashboard

외부에 SDK를 Demo하기 위한 용도로 엔진을 통해 파악한 User modeling과 Context들을 보여주는 Dashboard를 만들었다. 개발 과정에서는 Vue를 사용하였고 주요 기능은 다음과 같다.

- Vuex를 이용한 데이터 흐름 설계
- 로그인 (Email, Google OAuth)
- 다양하고 복잡한 방식의 filter UI구현

### Backend

#### Development Jetty based RESTful API

Jetty 기반의 API 서블릿들을 구현하였다. 주요 구현 사항은 다음과 같다.

- SDK user auth 관련 서블릿 구현
- Dashboard 관련 서블릿 및 필터 구현

#### Signal processing via Kafka stream server

엔진은 카프카 스트림을 이용해 signal들을 처리했는데, 이 과정에서 새로 추가한 시그널을 처리하기 위한 작업을 진행했다.

<p align="center">
  <img src="{{ site.url }}/assets/images/aiq_aware_1.png">
</p>
