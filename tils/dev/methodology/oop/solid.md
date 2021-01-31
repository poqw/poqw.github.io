# SOLID

## Overview

Inheritance, Polymorphism, Encapsulation 은 객체지향의 핵심이 아니라 그저 매커니즘일 뿐이다.

정말 중요한 객체지향의 핵심은, Dependency Inversion을 통해 세부 구현사항으로부터 고수준 정책을 보호하는 것이다.

다음 5가지 원칙을 통해 객체지향의 핵심을 지킬 수 있다.

- SRP: Single Responsibility Principle
- OCP: Open Closed Principle
- LSP: Liskov Substitution Principle
- ISP: Interface Segregation Principle
- DIP: Dependency Inversion Principle

## SRP

객체는 한 가지 책임만을 지녀야 한다. 즉, 객체가 변경되는 사유가 단 하나여야 한다.

### How?

다음과 같은 방법을 통해 SRP원칙을 적용해 볼 수 있다.

1. Inverted Dependency  
   클래스를 클래스와 인터페이스로 분리하고 이를 통해 디커플링 한다.
   장점: 쉽다.  
   단점: 모든 메소드가 똑같은 인터페이스에 의존하고, 구현체 또한 하나의 클래스가 전부 가지고 있으므로 커플링되어 있다.
2. Extracted Classes  
   책임의 개수만큼 클래스를 분리한다.  
   장점: 쉽다.  
   단점: 개념이 분리된다. Transitive Dependency 문제가 생긴다.
3. Facade  
   구현부를 찾기 쉽게 책임을 Facade패턴으로 묶는다.  
   장점: 구현부를 찾기 쉽다.  
   단점: Actor들은 여전히 Facade 클래스 안에 Coupled되기 때문에 SRP가 위배된다.
4. Interface Segregation  
   1번 패턴에서 인터페이스를 책임의 개수대로 분리한다.  
   장점: Actor들이 완전히 Decoupled된다.  
   단점: 하나의 클래스에 인터페이스 3개가 모두 구현되어 구현부에선 Coupled된다.
5. 1+2  
   1번과 2번 방법을 합쳐볼 수 있겠다.  
   장점: SRP를 지킬 수 있다.  
   단점: 구현을 어디서 하는 지 찾기 어렵다.

## OCP

객체는 확장에 대해서는 열려있되, 변경에 대해서는 닫혀있어야 한다. OCP는 시스템 아키텍쳐의 핵심이다.

### How?

Abstraction과 Inversion을 통해 OCP 원칙을 지킬 수 있다.

### 오해와 진실

OCP를 한다는 것은 변경을 대비한다는 것인데, 변경을 대비하면 불필요한 복잡도가 생기게 되므로 좋은 소프트웨어를 만들려는 의도와 달리
안좋은 소프트웨어를 만드는 모순이 생긴다.
결국 OCP는 미래를 완벽하게 예측하지 않고는 달성할 수 없고, 이것이 OCP 옹호자들이 숨기는 더러운 진실이다.

그러나 OCP가 마냥 터무니없는 이야기는 아니다. 애자일 개발 방법론을 통해 우리는 OCP를 소프트웨어에 적용할 수 있다.
변경을 예측하는 것이 아니라 짧은 주기로 경험함으로써 주기가 지날때마다 OCP가 지켜지는 소프트웨어를 만들어 낼 수 있도록 하는 것이다.

## LSP

LSP는 서브타입이 사용되는 어떤 경우에서도 상위 타입으로 교체가 가능해야 한다는 법칙이다.
즉, **오직 상속하고만 관련된 원칙**이다.
대부분의 경우에서 상속보다는 인터페이스를 사용하는 게 소프트웨어 설계 구조상 더 좋은데(특히 자칫하면 OCP가 깨지게 된다),
만약 꼭 상속을 사용해야 한다면 LSP를 준수하기 위해 노력해야 하겠다(LSP는 OCP를 지키면서 상속을 쓸 수 있게 해주는 도구라고 보면 된다).

이 때문에 Downcasting이 사용되거나 instanceof가 사용된다면 LSP를 어기고 있다는 징조로 여겨진다.
Subclass를 구별하고 있으니 말이다. 타입에 걸려있는 의존성은 가장 강하고 지독한 의존성이라고 한다.

### IS-A의 함정

현실세계에서 is-a 관계가 성립된다고 해서 SW세계에서도 is-a가 성립되는 것은 아니다. 대표적인 예가 바로 직사각형과 그 서브타입인 정사각형의 넒이를 구하는 문제.

### 왜 LSP를 어기게되는 경우 OCP가 깨지는가?

LSP를 어기게 되면 subtype이 supertype을 대체하지 못하므로 그 두 타입을 사용하는 곳에선 필수적으로 instanceof가 등장하게 된다.
이 경우 새로운 subtype이 등장했을 때 사용처의 코드가 수정되어야 하므로 확장이 닫힌 구조가 된다. 즉 OCP가 깨지게 되는 것이다.

## ISP

여러 모듈에게서 불려지는 Fat class의 경우 인터페이스를 사용해서 각 기능을 분리하라는 원칙이다. 이를 지키지 않으면 SRP가 깨질 염려가 있다.

## DIP

상위 레벨은 하위 레벨의 구현 상세에 의존해선 안된다. 이를 위해 Abstract Interface를 사용하고,
소스코드 의존성과 런타임 의존성의 방향을 반대로 바꿀 수 있다.

이러한 패턴을 Plugins 패턴이라고 하며, 인터페이스를 구현하는 곳이 Plugin point가 된다.
Plugin을 호출하는 곳은 구현 상세에 대해 모른다는 것이 특징이다.

### App partition & Main partition

계층이 나뉘는 부분을 Boundary라고 하는데, App partition은 Boundary를 교차하는 부분에 Interface를 제공하고,
Main parition은 해당 interface에 대한 구현 상세와 이 구현체의 의존성 주입을 담당한다.

