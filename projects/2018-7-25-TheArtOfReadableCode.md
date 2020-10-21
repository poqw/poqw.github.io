---
layout: post
title: 깔끔한 코드 짜기 (읽기 좋은 코드가 좋은 코드다)
category: [clean-code]
author: hyungsun
image:
---

## Prologue

------
나는 예전에 프로젝트를 몇 개 말아먹고 난 뒤 보다 깔끔한 코드를 짜기 위해 나름대로 고민을 하곤 했다. 하지만 실제로 본격적인 협업을 하면서부터 그 때 했던 고민은 마치 아기 걸음마 같은 수준이라, 현업에선 의미도 소용도 없다는 걸 깨달았다.

이런 부족함을 인지하고서부터 수도 없이 고민했던 내용이자, 이 글의 주제가 될 아이디어는 바로 **'어떻게 하면 깔끔한 코드를 짤 수 있는가?'**이다. 과연 어떻게 해야 깔끔한 코드를 짤 수 있을까. 

'깔끔한 코드'에서 '깔끔'의 기준은 사람마다 다르다. 단적인 예로 누구에게는 짧고 간결한 코드가 깔끔한 코드일 수 있고, 또 다른 이에게는 조금 길더라도 마치 문장처럼 읽혀지는 코드가 깔끔한 코드일 수도 있다. 나는 이런 저마다의 기준 사이에서 우열을 가리는 아슬아슬한 줄타기를 하다가, 결국 이들 사이에 무언가 공통점이 있다는 것을 깨달았다. 

불행히도 경험 부족인 탓에 그 공통점을 구체적으로 묘사를 할 순 없지만, [읽기 좋은 코드가 좋은 코드다](http://www.yes24.com/24/goods/6692314)라는 책을 읽고서 이 책에서 제시하는 '좋은 코드'가 내가 생각하는 공통점과 상당히 궤를 같이한다는 걸 직감했다. 이런 희미한 감각이 있을 때 힘차게 꿰차지 않으면 좋은 코드는 영영 못짜게 될 것만 같아서, 이 글에서는 해당 책의 마지막 챕터에서 제시하는 문제를 직접 풀어보고 책에서 정의하는 '좋은 코드'로 바꿔보는 연습을 할 것이다.

## Monologue

------

### 1. 문제

책에서 제시하는 문제는 다음과 같다(실제로 저런 식으로 쓰여있지는 않지만, 문제스럽게(?) 조금 말을 바꿨다).

> #### 분/시간 카운터
>
> 우리는 종종 웹 서버가 1분 동안, 그리고 지난 1시간 동안 얼마나 많은 바이트를 전송했는지 추적할 필요가 있다. 이를 효율적으로 해결하는 프로그램을 작성하라.

문제가 워낙 간단하게 쓰여있어서 적당한 해결책을 제시하기 위해서는 어느 정도 조건을 구체화시킬 필요가 있다. 조금 생각해본 뒤, 구체화 시켜야 할 부분을 다음과 같이 정했다.

- 이미 웹서버는 구현되어 있고, 그 웹서버에서 쓰게 될 모듈을 구현해야 하는 상황이다.
- 어떤 이벤트가 발생하는 것을 웹서버에서 감지할 수 있고, 해당 이벤트는 얼만큼의 트래픽을 사용하는지 알 수 있다.

지난 1분 동안, 그리고 지난 1시간 동안 얼마나 많은 바이트를 전송했는지 추적하려면, 어떤 자료구조에 시간당 트래픽이 얼마만큼인지에 대한 데이터를 담아야 할 것이다. 시간은 순차적인 데이터라서 ArrayList가 적절해 보였다.

### 2. 아이디어 구현(TrafficCounter Ver.1)

문제가 간단하기 때문에 코드도 짧다. 
우선 `Event`라는 클래스를 만들어 ArrayList에 저장했다. 여기서 Pair 를 쓰지 않은 이유는 `Event`에 `timestamp`, `traffic` 외에 다른 필드가 들어설 것을 염두에 두었기 때문이다. 지난 1분, 혹은 지난 1시간 동안의 바이트 전송량의 총합은 단순 비교 for loop를 통해 구했다.

```java
import java.util.ArrayList;
import java.util.concurrent.TimeUnit;

public class TrafficCounter {

  private class Event {
    long timestamp;
    int traffic;
    Event(long timestamp, int traffic) {
      this.timestamp = timestamp;
      this.traffic = traffic;
    }
  }

  private ArrayList<Event> events = new ArrayList<>();

  public void addEvent(int traffic) {
    events.add(new Event(System.currentTimeMillis(), traffic));
  }

  public int countTrafficInMinuteSince(int minute) {
    long timestamp = System.currentTimeMillis() - TimeUnit.MINUTES.toMillis(minute);
    return countTrafficSince(timestamp);
  }

  public int countTrafficInHourSince(int hour) {
    long timestamp = System.currentTimeMillis() - TimeUnit.HOURS.toMillis(hour);
    return countTrafficSince(timestamp);
  }

  private int countTrafficSince(long timestamp) {
    int result = 0;
    for (Event event: events) {
      if (timestamp <= event.timestamp) {
        result += event.traffic;
      }
    }

    return result;
  }
}
```
이제 웹서버에서는 이벤트 발생을 감지할 때마다 `addEvent`를 통해 이벤트 발생 시각과 해당 이벤트의 바이트 전송량을 기록할 것이고, 트래픽이 궁금할 때는 `countTrafficInMinuteSince`나 `countTrafficInHourSince` 를 통해 값을 얻어낼 것이다. 1분, 1시간이 아니더라도, 3분, 5시간 처럼 다른 시간 간격당 트래픽이 궁금해질 수도 있다는 생각이 들어서 인자를 받게 만들었다.

### 3. TrafficCounter Ver. 1의 문제점

놀랍게도 내가 짰던 저 코드는 책에서 해당 문제를 해결하기 위해 '아무 생각없이 짠 코드'와 거의 일치했다. 말하자면 **형편없는 수준**이라는 거다. 나름 고민해서 작성한 코드임에도 불구하고 말이다. 

TrafficCounter Ver.1은 겉보기에는 문제없이 잘 동작할 것 같지만, 큰 문제점이 있다.

- `events` 가 무한정 늘어난다.
- `countTrafficInMinuteSince`와 `countTrafficInHourSince`가 너무 느리다.

웹 서비스가 공교롭게도 1초에 10,000번 이상 이벤트가 발생할 수도 있다는 가정을 해보자.
`events`는 아무리 좋은 서버라도 순식간에 넘쳐 흐를 것이고, `countTrafficInHourSince`는 몇천만개나 되는 데이터셋을 일일이 꺼내어 검토해봐야 할 것이다. 코드를 짤 때 나는 왜 이런 가정을 해보지 못한 걸까?

그나마 봐줄만한 것은, '좋은' 코드의 다음 면모들을 어느 정도 만족시켰다는 것이다.

- for 루프가 **읽기 쉽다**(대부분의 프로그래머는 루프를 읽을 때 속도가 둔화된다).
- `countTrafficSince`로 **코드 중복을 막았다**(수학 방정식을 풀려면 미지수끼리 같이 묶듯, 어려운 코드는 한 장소에 몰아두는 것이 더 좋다).
- **네이밍이 보편적**이다(함수는 프로그래머가 이름을 보고 기대한 바에 어긋나지 않을 일을 수행해야 한다).

하지만 이러한 점들을 잘 지켰다고 앞선 문제점이 해결되는 것은 아니니, 고치기 위해 고민할 시간이다.

### 4. 아이디어 개선
가장 먼저 떠오른 생각은 lazy한 infinite stream이었다. 그러나 아무리 lazy하다고 한들, 무한히 들어오는 데이터를 받아들이려면 역시 **오래된 데이터를 삭제**하는 수 밖에 없다. 여기서 말하는 infinite stream은 무한한 상태를 정의하는 것이지, 실제로 무한한 용량으로 데이터를 저장하는 것이 아니기 때문이다. 즉, 무한한 수열을 정의하고 n번째 값을 가져오거나 n번째 이후의 짝수 번째 값들을 100개 더할 수는 있어도, 수열의 모든 값을 저장할 수는 없다. 이 infinite stream에 대해선 나중에 포스팅을 하도록 하겠다(혹 궁금하신 분들은 java infinite stream을 검색해보자). 

`countTrafficSince`가 너무 느린 문제는 어떻게 해결해야 할까? 단순히 `addEvent()`를 할 때 조금만 더 고생해주면, 취합할 때 더 편하지 않을까 하는 생각이 들었다. 가령, 엄청 큰 Queue의 사이즈를 구할 때 O(1)의 시간으로 구하고 싶으면 `push()` 나 `pop()` 할 때마다 마지막 인덱스를 따로 저장해 업데이트 시키는 것처럼 말이다. 이렇게 되면 Queue의 사이즈는 해당 인덱스 + 1 로 상수 시간안에 구해진다.

위 예시와 비슷한 맥락으로, 버퍼를 만들어서 `addEvent()` 로 들어오는 데이터를 1분 단위로 묶은 뒤 최대 24시간만 저장한다면 어떨까? 배열의 사이즈가 무한하지 않고 충분히 작은 숫자로 결정될 것이고, 이 숫자는 최대 1,440으로 for 루프가 충분히 감당해낼 만한 값이다.

결국 개선점을 정리하면 다음과 같다.

- `events` 가 무한정 늘어난다: 오래된 데이터를 삭제하여 용량 확보.
- `countTrafficInMinuteSince`와 `countTrafficInHourSince`가 너무 느리다: 버퍼를 두어 1분 단위로 이벤트 저장.

### 5. 개선점 적용(TrafficCounter Ver. 2)
위에서 이야기한 2가지 개선점을 모두 담았다. 오래된 데이터를 삭제하여 용량을 확보하기 위해 `addEvent`가 실행될 때마다 큐에 오래된 데이터를 담고 있는지 검사하여 제거하고, `countTrafficInHourSince`가 너무 느리기 때문에 1분 단위로 이벤트를 저장하여 for loop의 부담을 줄였다.

```java
import java.security.InvalidParameterException;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.TimeUnit;

public class TrafficCounter {

  private class Event {
    long timestamp;
    int traffic;
    Event(long timestamp, int traffic) {
      this.timestamp = timestamp;
      this.traffic = traffic;
    }

    int getTraffic() {
      return traffic;
    }
  }

  private static long MAX_DURATION_IN_HOUR = 24L;
  private static long MAX_DURATION_IN_MINUTE = TimeUnit.HOURS.toMinutes(MAX_DURATION_IN_HOUR);

  private Queue<Integer> mergedEventTraffics = new LinkedList<>();
  private ArrayList<Event> eventsBuffer = new ArrayList<>();
  private long lastMergedTimestamp = 0L;

  public void addEvent(int traffic) {
    long currentTimestamp = System.currentTimeMillis();
    if (lastMergedTimestamp < currentTimestamp - TimeUnit.MINUTES.toMillis(1)) {
      lastMergedTimestamp = currentTimestamp;
      int sum = eventsBuffer.stream().mapToInt(Event::getTraffic).sum();
      eventsBuffer.clear();

      if (mergedEventTraffics.size() > MAX_DURATION_IN_MINUTE) {
        mergedEventTraffics.remove();
      }
      mergedEventTraffics.add(sum);
    }

    eventsBuffer.add(new Event(currentTimestamp, traffic));
  }

  public int countTrafficSinceInHour(long duration) {
    if (duration < 0L || duration > MAX_DURATION_IN_HOUR) {
      throw new InvalidParameterException("Invalid duration.");
    }

    return countTrafficSinceInMinute(TimeUnit.HOURS.toMinutes(duration));
  }

  public int countTrafficSinceInMinute(long duration) {
    if (duration < 0L || duration > MAX_DURATION_IN_MINUTE) {
      throw new InvalidParameterException("Invalid duration.");
    }

    return mergedEventTraffics.stream().limit(duration).mapToInt(Integer::intValue).sum();
  }
}
```

아이디어를 풀어내고 있는 코드는 짜여졌지만, 좋은 코드라고 말하긴 상당히 어렵다. 단적으로, `addEvent` 라는 함수명을 본 대다수의 개발자는 `events.add(item)` 정도의 간결한 코드를 예상할 텐데 위 코드는 그러한 기대를 처참히 배신한다. timestamp를 검사하는 로직이 들어갔기 때문이다. 

이는 대다수 개발자들이 하게 되는 나쁜 습관을 단적으로 보여준다. 코드를 짜다보면 어느샌가 어떤 함수가 지나치게 많은 일들을 도맡아 하고 있는 경우가 생기는데, 이를 눈치채지 못하거나 알고도 고치지 않고 내버려 둔다. 일단 동작하는 것에 마음이 쏠려 다른 것을 변경하는 것이 두려운 까닭이다. 하지만 이렇게 내버려두면 유지보수가 어렵기 때문에 결국 나중에 리펙토링하면서 몽땅 지워질 확률이 매우 높다.

따라서 처음부터 의도된 방식으로 동작하는 나만의 새로운 자료구조 클래스를 만든 뒤, 복잡해 보이는 코드는 그 안에 숨기는 편이 훨씬 낫다. 결과적으로 `TrafficCounter` 에서는 정말 트래픽을 계산하는 일만, 자료구조 클래스에서는 자료를 다루는 일만 하도록 만드는 것이다. 

끝으로 이 코드는, 책 마지막 부분에서 이야기하는 문제점을 떠안고 있다. 
시작한 뒤 1초 간격 미만의 시간 동안 들어온 트래픽은 집계되지 않는다는 것이다. 그러나 책에서 소개하기를, 이는 웬만한 어플리케이션에서 무시할 수 있을 만한 정확도라고 한다. 

나는 더 좋은 코드와 마지막에 제기된 문제점까지 해결하는 멋진 코드를 짜보려고 했으나, 이번 포스팅에 지나치게 많은 시간을 허비했으므로 다음 기회로 미루기로 했다. 그러나 내가 전달하고자하는 바는 충분히 잘 전달되었으리라 생각한다.

## Epilogue

------

개인적으로 "읽기 좋은 코드가 좋은 코드다"라는 말은 저자가 그저 책 제목을 간결하게 짓기 위해 내용을 꾸깃꾸깃 압축시키며 쥐어짜낸 말 같다. 이 제목은 마치 문장처럼 읽혀지도록 짜는 코드가 무조건 좋은 코드다라는 오해를 불러 일으키기 쉬우며, 나 또한 책 제목만 듣고는 그런 오해를 했다. 

하지만 이 책에서 말하는 좋은 코드이자 내가 생각하기에도 좋은 코드란, 

**그 코드를 '처음' 읽는 사람으로 하여금 이해하는 데 걸리는 시간이 가장 짧은 코드**이다. 

나는(어쩌면 운이 좋게도) 단 1개의 커밋을 쌓기 위해 코드를 짜놓고 그 코드를 한 시간 뒤, 세 시간 뒤, 하루 뒤, 3일 뒤에 걸쳐서 15번 넘게 수정해본 경험이 있다. 한 시간 뒤라면 코드가 어느 정도 이해가 가서 마치 물레바퀴가 돌아가듯 잘 짜여진 것처럼 보인다. 하지만 3일 뒤라면 이야기가 전혀 다르다. 내가 짰지만 내가 짠 코드처럼 보이지 않고, 어떻게 이렇게 발로 짰나 싶을 정도로 아찔하다. 결국 처음에 코드가 잘 짜여진 것처럼 보였던 이유는 그저 코드를 작성한 뒤 1시간 만에 읽은 내가 **처음 읽는 사람이 아니었기 때문에** 이해하는 시간이 빨라서 그래보였던 것 뿐이다. 다시 말해, 내가 어떻게 짰는지 까먹은 뒤에야 비로소 깔끔하게 짜는 방법이 눈에 들어온다. 

나는 이 사실을 알아챈 뒤로는 커밋이 조금이라도 복잡하다고 생각되면 적어도 3시간 뒤에 다시 한 번 리뷰하는 습관을 가지게 됐다. 이 습관의 좋은 점은, 해당 커밋에 빠뜨린 점이나 어울리지 않는 수정사항을 솎아내기 용이하다는 것이다.

결론적으로 이야기해서, **좋은 코드를 짜는 방법은 의외로 간단하다. 그러나 놓치기 쉽다. 그러니 어렵다고 말하겠다.**

조금 더 이해를 돕기 위해 내가 깨끗한 코드를 만들어내기 위해 노력하는 간략한 로테이션을 더듬어보자면 다음과 같다.

1. 코드를 일단 돌아가게 짠다. 이 때 자신의 코드를 절대 믿지 않는다. 테스트는 수없이 해도 모자르다.

2. 클래스가 자신이 해야할 일만을 제대로 수행하는지 꼼꼼하게 검사한다. 들고 있지 말아야 하는 걸 들고 있는 건 아닌지, 너무 여러가지 일을 한다고 생각된다면 일단 로컬 커밋을 하고 추상화나 분리를 해본다. 이 부분이 나처럼 초보 개발자에게는 정말 놓치기 쉬운데, 코드를 짜는 당시만 해도 이 클래스는 한가지 일만 하는 군! 이라고 생각했던 게, 나중에 보면 여러가지 일을 도맡아 하는 경우가 많다.

3. 완전히 같은 일을 수행하면서, 더 간결해지는 코드로 수정한다. 이 때 성능 향상같은 건 염두에 두지 않는다(이건 이미 1단계에서 했어야 한다). 쉽게 예를 들면 다음과 같은 경우다.

```java
// Bad.
if (conditionA) {
    if (conditionB) {
        doSomething()
        return VALUE_2
    } else {
        return VALUE_3
    }
} else {
    return VALUE_1
}

// Good.
if (!conditionA) {
    return VALUE_1
}

if (conditionB) {
    doSomething()
    return VALUE_2
}

return VALUE_3
```

사실 3번 같은 경우는 1, 2 를 오가면서 틈틈이 하는 식인 것 같다. 그리고 경험상 1, 2 를 정말 제대로 했다면 남에게 보여줘도 부끄럽지 않고 오히려 뿌듯한 느낌이 든다. 이는 반대로 생각하면 push를 하기 전 뿌듯한 느낌이 없다면 다시 차분하게 1, 2 로 돌아가는 편이 훨씬 더 나을지도 모른다는 것이다.

물론 이 습관도 오래 내공을 쌓으면 3시간 씩이나 기다리면서 스스로 리뷰하지 않아도 1단계 에서부터 아름다운 코드를 작성하게 될 날이 올지도 모른다. 실제로 나와 협업을 하고 계신 다른 실력자 분들은 모두 그런 경지에 이른 듯하다. 하지만 스포츠를 잘하려면 초심과 자세가 중요하듯이, 고집스러워 보일지라도 처음부터 단계를 하나하나 지켜나가야 나중이 편하다. 어느 달인이 처음부터 그렇게 잘하게 되었겠는가. 이는 개발이 빠르게 진행되어야 하는 스타트업에서 내가 이 습관을 버리지 않기로 결심한 이유다. 나에게도 얼른 내공이 쌓여서 하루 빨리 코드를 잘 짤 수 있게 되었으면 하는 바람이다.