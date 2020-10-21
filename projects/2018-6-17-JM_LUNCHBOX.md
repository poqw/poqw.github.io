---
layout: post
title: 도시락 데우기 문제 (LUNCHBOX, 난이도 하)
category: [online-judge]
author: hyungsun
image:
---

## Prologue

------
종만북에 등장하는 난이도 (하)짜리 문제 중 8번째로 등장하는 LUNCHBOX 문제를 풀어보았다. 

## Monologue

------

### 1. 문제

문제는 다음과 같다.

> #### 문제
>
> After suffering from the deficit in summer camp, Ainu7 decided to supply lunch boxes instead of eating outside for Algospot.com winter camp.
>
> He contacted the famous packed lunch company "Doosot" to prepare N lunch boxes for N participants. Due to the massive amount of order, Doosot was not able to prepare the same menu. Instead, they provided different N lunch boxes. Ainu7 put all the lunch boxes to a refrigerator.
>
> The lunch time has come, and suddenly Ainu7 noticed that there is only one microwave available. As all lunch boxes are not the same, they need a different amount of time to microwave and eat. Specifically, i-th lunch box needs Mi seconds to microwave and Ei seconds to eat.
>
> Ainu7 needs to schedule microwave usage order to minimize lunch time. Lunch time is defined as the duration from the beginning of microwaving of any lunch box to the end of eating for all participants. Write a computer program that finds minimum lunch time to help Ainu7. Note that substituting lunch while microwave is turned on is totally unnecessary, because the lunch will be cooled down.
>
> #### 입력
>
> The first line of the input contains one integer T, the number of test cases.
>
> Each test case consists of three lines. The first line of each test case contains N(1≤N≤10000), the number of the participants.
>
> N integers will follow on the second line. They represent M1, M2, ⋯, MN.
> Similarly, N integers will follow on the third line, representing E1, E2, ⋯, EN.
>
> #### 출력
>
> For each test case, print the minimized lunch time in one line. It is guaranteed that the answer is always strictly less than 2^31.

본인은 책을 사서 문제를 풀고 있다고 저번에 이야기 한 적이 있는데, 그렇다고 문제를 소개할 때 죄다 책에서 일일이 배껴 타이핑하진 않는다. Algospot에서 문제를 검색한 뒤 복사 + 붙여넣기를 자주 애용하는데, 하려고 보니 영어로 적혀있었다. 절대 잘난 척하려고 영어로 적은 게 아니다. 

문제를 요약하자면 도시락의 수를 처음에 입력받은 뒤 그 각각의 데우는 시간을 알고 있고, 각 도시락을 먹는 시간을 알 수 있다고 할 때 전자레인지 하나로 가장 점심시간을 최소화할 수 있는 방법을 찾으라는 것이다.

가령 도시락 3개를 을 데우는 시간이 각 1, 2, 3 분이고 먹는 시간이 1, 2, 1 분이라면, 

2분(데우기) -> 3분(데우기, 2분 동안 먹기) -> 1분(데우기, 1분 동안 먹기) -> 1분(먹기) 

해서 7분 안에 점심시간을 끝낼 수 있다.

이 문제는 책에서 탐욕법이라는 알고리즘에 카테고라이즈되어 있는데, 문제를 풀기 전에 탐욕법이 무엇인지 몰라 잠깐 책을 읽어봤다. 읽어보고 나니 별 거 아니었는데, 요컨대 휴리스틱 알고리즘이라는 것이다.

그 동안 우리는 각 순간에 최선의 선택을 하면 망하는 경우를 많이 봐왔다. 앞서 풀었던 NUMBERGAME만 해도, 상대의 경우를 모두 생각하지 않고 내 상황에서만 최선을 택하면 지는 경우가 생긴다. 그래서 이를 막기 위해 DP를 사용했다. 그러나 DP는 탐욕법보다 현저하게 느린 경우가 많다. 그도 그럴 것이, 탐욕법이라는 것은 뒤도 안 돌아보고 **현재 상태에서 최선의 선택**만 하기 때문이다.

따라서 탐욕법으로는 최적해를 구하지 못하는 경우가 많으며 그럼에도 사용하는 이유는 오직 **속도** 하나다(책에서는 적당히 그럴듯한 답변과 타협하기 위해서도 사용된다고 한다). 즉, 문제의 경우의 수가 너무 많아 DP로는 느려서 안될 경우 탐욕법으로 공략해야 한다는 것이다. 

하지만 무턱대고 탐욕법을 들이대선 안된다. 한 가지 준비가 필요한데, 내가 탐욕법으로 구해낸 답들이 **최적해를 반드시 포함한다**는 증명을 해야 한다. 이 증명이 성립되지 않고서야 탐욕법이라고 할 수가 없고, 그저 틀린 풀이일 뿐이다.

LUNCHBOX 문제로 돌아와서 다시 생각해보자. 

간단히 생각해보면 일단 전자레인지에 도시락을 죄다 돌려야 하기 때문에 최적해는 도시락을 전부 데우는 데 걸리는 시간의 총합(M)을 반드시 포함한다. 그러고 나서 맨 마지막으로 데운 도시락을 먹어야 하기 때문에 총 걸리는 시간은 M + p 로 표현할 수 있다. 이 때 전자레인지에 돌리는 순서만큼은 내가 마음대로 할 수 있기 때문에, 먹는 데 오래 걸리는 녀석을 앞에, 먹는 데 걸리는 시간이 가장 적은 녀석을 맨 뒤에 배치한다고 치면 M + p가 최소가 되어 최적해를 구한 것으로 볼 수 있을 것이다.

즉, 문제를 풀기 위해 **주어진 도시락에서 먹는 데 가장 오래 걸리는 녀석을 제일 먼저 전자레인지에 돌린다**는 탐욕법을 생각해 볼 수 있다. 이를 증명하기 위해 귀류법을 사용해 보자. 그러기 위해서는 **가장 오래 걸리는 놈을 가장 먼저 전자레인지에 돌리지 않아도 최적해를 구할 수 있다**는 가설을 때려부수면 된다. 이는 간단하게 반례로 풀어낼 수 있는데, 도시락 2개가 주어질 때 데우는 시간이 1, 1 분, 먹는 시간이  1, 100 분인 경우를 생각해 보자. 맨 앞이 100분짜리 도시락이 아닌 경우에는 반드시 시간 손해가 발생해 최적해가 아니다.

구현보다는 아이디어가 더 어려운 문제인 것 같으니, 이제 빠르게 구현을 해보자.

### 2. 아이디어 구현
아래 코드는 핵심적인 부분만 따온 것이고, 전체 소스 코드는 [여기에](https://github.com/poqw/JongmanBookSolutions/blob/master/poqw/LunchBox.java) 올려 두었다. 
```java

  static class Box {
    int waveTime;
    int eatingTime;

    Box(int waveTime, int eatingTime) {
      this.waveTime = waveTime;
      this.eatingTime = eatingTime;
    }

    int getEatingTime() {
      return eatingTime;
    }
  }

  private static int eatLunchBoxes() {
    lunchBoxes.sort(Comparator.comparingInt(Box::getEatingTime).reversed());
    int waveTime = 0;
    int lunchTime = 0;
    for (Box box : lunchBoxes) {
      waveTime += box.waveTime;
      lunchTime = Math.max(lunchTime, waveTime + box.eatingTime);
    }

    return lunchTime;
  }
```

### 3. 풀이

java에도 `Pair` 가 있지 않았었나...? 이상하게도 java.util에 있을 것만 같았는데 없길래 그냥 `Pair` 와 비슷한 `Box` 클래스를 직접 만들었다.

`lunchTime = Math.max(lunchTime, waveTime + box.eatingTime);`

이 부분은 마지막보다 바로 전 도시락을 까먹는 시간이 현재 도시락을 데우고 먹는 시간보다 큰 경우를 대비하기 위함이다.

이외의 부분은 코드가 워낙 간단해서 설명은 생략하겠다. 


## Epilogue

------

쉬워보이는 문제였지만 의외로 오래 걸렸다. `eatLunchBoxes` 로직이 생각보다 헷갈렸기 때문이다.