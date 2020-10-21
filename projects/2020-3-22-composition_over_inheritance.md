---
layout: post
title: Composition over inheritance  
category: [clean code, pattern, software, composition, inheritance]
author: hyungsun
image: assets/images/composition_over_inheritance_1.jpg
---

[Composition over inheritance](https://en.wikipedia.org/wiki/Composition_over_inheritance)는 composite reuse principle 라고도 불리는데 소프트웨어 구현에 있어 상속과 컴포지션 중에서 어느 것을 택할 것인가에 관한 이야기다.

## 상속
학교에서 시험에 자주 등장하는 바람에 우리에게 친숙한 상속에는 안타깝게도 교묘한 함정이 존재한다. 우리는 보통 "is a" 관계일 때 상속을 사용해야 한다고 배우며 다음 예시를 마주친다.
```sh
동물
  |- 포유류
      |- 개
         |- 골든 리트리버
``` 
상속 관계의 부모를 타고 위로 올라갈수록 개념은 점점 일반화된다. 얼핏 보면 맞는 말 같다.

'골든 리트리버는 개고, 개는 포유류고, 포유류는 동물이지 ...' 

그러나 소프트웨어 세계에서 이 **일반화**는 앞으로 반례가 존재하지 않을 것이라는 일종의 미래예측이다. 즉,

'**모든** 골든 리트리버는 개다. **모든** 개는 포유류다. **모든** 포유류는 동물이다 ...'
 
 라고 선언하는 것과 마찬가지라는 의미다.
불행히도 예상했던 미래가 깨지는 순간(반례가 등장하는 순간), 개발자는 상속 계층을 전부 뜯어고칠지, 반례를 두어 코드 중복을 내버려둘지 선택의 갈림길에 놓이게 된다.
모두가 예상하다시피 후자를 선택한다는 건 유지보수 지옥으로 가는 지름길이다. [깨진 유리창 이론](https://en.wikipedia.org/wiki/Broken_windows_theory)이라고 들어는 보았나.

인간이 미래를 예측한다는 건 불가능하다.
따라서 개발자들은 상속이 **아주 강력한 의존 관계**임을 상기하고 설계나 구현할 때 항상 경계해야 한다. 
쉽게 생각해 상속을 받는다는 건 라이브러리를 쓰는 것과 같다고 생각해도 좋다.
부모 클래스가 변경되면 하위 클래스들과 그들의 사용처에 수많은 변경이 생길 수 있는 것이 꼭 닮았기 때문이다.

## 컴포지션
컴포지션은 상속보다 훨씬 유연한 설계 패턴이다. 핵심은 한 클래스가 다른 객체의 인트선스를 보유하고 있고, 그로 하여금 일을 시키도록 해야 한다는 것이다.
이는 수정에 닫혀있고 확장에는 열려있다는 점에서 [OCP 원칙](https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle)과도 궤를 같이 한다.
구현에는 다양한 방법이 있으나 여기서는 [Strategy 패턴](https://en.wikipedia.org/wiki/Strategy_pattern)을 사용한다.

다음과 같이 덧셈이 가능한 계산기가 있다고 하자.
```kotlin
interface PlusStrategy {
  fun plus(a: Int, b: Int): Int
}

class NormalPlusStrategy: PlusStrategy {
  override fun plus(a: Int, b: Int): Int {
    return a + b
  }
}

class PlusCalculator(private val strategy: PlusStrategy) {
  fun plus(a: Int, b: Int): Int {
    return strategy.plus(a, b)
  }
}
```
여기에 분이나 시각 처럼 cyclic한 값을 계산하기 위해 모듈로 덧셈 기능을 추가해야 한다면, PlusCalculator에 변경을 주는 대신 새로운 기능의 Strategy를 추가하는 방법으로 확장이 가능하다. 
```kotlin
class ModularPlusStrategy(private val base: Int): PlusStrategy {
  override fun plus(a: Int, b: Int): Int {
    return (a + b) % base
  }
}

// No changes!
class PlusCalculator(private val strategy: PlusStrategy) {
  fun plus(a: Int, b: Int): Int {
    return strategy.plus(a, b)
  }
}
```

테스트또한 간단하게 다음과 같이 작성해 볼 수 있겠다.
```kotlin
class StrategyCalculatorTest {
  @Test
  fun plus_returnsNormalSum_whenNormalStrategyIsUsed() {
    val strategy = NormalPlusStrategy()
    val uut = StrategyCalculator(strategy)
    assertEquals(30, uut.plus(10, 20))
  }

  @Test
  fun plus_returnsModularSum_whenModularStrategyIsUsed() {
    val minStrategy = ModularPlusStrategy(60)
    val minUut = StrategyCalculator(minStrategy)
    assertEquals(5, minUut.plus(30, 35))

    val hourStrategy = ModularPlusStrategy(24)
    val hourUut = StrategyCalculator(hourStrategy)
    assertEquals(3, hourUut.plus(12, 15))
  }
}
```

## 끝으로
무조건적으로 컴포지션을 쓰는 것이 만능은 아니다. Base class를 작성하는 것처럼 상속이 도움이 되는 경우도 있다.
그러나 대부분의 경우 우리에게 친숙하고 쉬운 상속보다는 컴포지션을 활용하는 게 좋은 설계일 확률이 높다는 걸 인지하는 게 좋겠다.
