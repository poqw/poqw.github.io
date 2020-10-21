---
layout: post
title: 병렬 프로그래밍 (feat. KU.컴구2실습)
category: [parallel_programming]
author: hyungsun
image: assets/images/comarch2pratice_3.PNG
---
# OpenMP
OpenMP를 실행할 수 있도록 환경을 구축하는 것은 이 포스팅에서 다루지 않겠다.  
아래는 OpenMP를 배울 때 가장 처음 실행하는 코드이다.
```c
#include <omp.h>
int main() {
    #pragma omp parallel
    {
        printf("Hello World\n");
    }
}
```
`#pragma omp parallel {...}`라는 익숙치 않은 문법이 보이는데, OpenMP에서 사용하는 문법이다. 앞으로 등장하는 `#pragma...`과 비슷한 문법들은 전부 병렬 프로그래밍에서 사용되는 문법으로 보아도 무방하다. `#pragma omp parallel {...}`를 선언하게 되면 `{...}`을 OpenMP을 사용해 병렬로 만들어 주겠다는 의미가 된다. 즉 위의 코드에서 `printf("Hello World\n");` 가 병렬적으로 실행된다는 의미이다. 이 때 `{}`는 `#pragma omp parallel`과 같은 행에 쓰면 안된다는 점에 유의해야 한다.
결과화면에서 출력된 `Hello World`수가 운영체제에서 기본적으로 세팅되어 있는 쓰레드의 숫자다. 

이 숫자는 다음 함수를 써서 프로그래머가 바꿔줄 수 있다.
```cpp
#include <omp.h>
omp_set_num_threads(4);
```

이 때 각 쓰레드들은 고유한 아이디(`tid`)를 가지는데, 다음 함수로 얻을 수 있다.
```cpp
#include <omp.h>
omp_get_thread_num();
```

이 tid는 0 이상의 정수라서 병렬화할 구간을 나누어 할당할 때 많이 사용한다. `max(tid) + 1`은 곧 쓰레드의 총 개수이기 때문이다.
다음과 같이 사용할 수 있다.
```cpp
#pragma omp parallel
{
    for (int i = omp_get_thread_num()*10; i < (omp_get_thread_num()+1)*10; i++) {
        ...        
    }
}
```

하지만 일일이 `omp_get_thread_num()`을 써서 for문을 컨트롤 해주는 작업은 불편하기 짝이 없다. OpenMP에서는 이런 귀찮음을 방지 하기 위해 `#pragma omp for`라는 지시어를 마련해 주었다. 이를 테면 위의 코드는 아래의 코드로 나타낼 수 있다.
```cpp
#pragma omp parallel
{
    #progma omp for
    for (int i = 0; i < n; i++) {
        ...        
    }
}
```

컴파일러가 `#progma omp for`를 만나게 되면 해당 for문의 작업을 쓰레드의 개수로 분할해 작업을 해주기 때문이다. 

하지만 이 경우, 여러 쓰레드가 같은 공간을 침범하는 경우가 생기지 않을까? 라는 질문을 마음 속에 품으신 분 참 예리하신 분들이다.
물론 그 생각처럼 `...` 부분에서 쓰레드의 공간들을 침범하는 경우가 생긴다. 아래에서 좀 더 자세히 다룰 예정이고 이를 잘 컨트롤 해 주는 게 바로 병렬 프로그래밍의 숙명이다.

참고로 여기서 발행하는 침범은 `i`에 대해서는 일어나지 않는다. `i`를 카운트 하는 쓰레드가 늘어나는 것이 아니기 때문이다.

### 버블소트의 병렬화
버블소트의 코드는 다음과 같다.
```cpp
#include "stdafx.h"
#include <omp.h>
void swap(int &A, int &B) {
    int temp = 0;
    if (A > B) {
        temp = A;
        A = B;
        B = temp;
    }
}
int main(int argc, char *argv[])
{
    int number[9] = { 3, 5, 6, 2, 4, 1, 7, 9, 8 };
    int numberCount = 9;

    for (int i = 0; i < numberCount; i++) {
        for (int j = 0; j < numberCount - i - 1;j++) {
            swap(number[j], number[j+1]);
        }
    }
    for (int i = 0; i < numberCount; i++) {
        printf("%d ", number[i]);
    }
    return 0;
}
```
다음은 위 코드를 실행해켰을 때 결과화면이다.  


![]({{ site.url }}/assets/images/comarch2pratice_1.PNG)  

병렬을 위해 버블소트 하는 부분을 아래와 같이 바꿔보았다.
```cpp
#include "stdafx.h"
#include <omp.h>
void swap(int &A, int &B) {
    int temp = 0;
    if (A > B) {
        temp = A;
        A = B;
        B = temp;
    }
}
int main(int argc, char *argv[])
{
    int number[9] = { 3, 5, 6, 2, 4, 1, 7, 9, 8 };
    int numberCount = 9;
    omp_set_num_threads(8);
    #pragma omp parallel
    {
        #pragma omp for
        for (int i = 0; i < numberCount; i++) {
            for (int j = 0; j < numberCount - i - 1;j++) {
                swap(number[j], number[j+1]);
            }
        }
    }
    for (int i = 0; i < numberCount; i++) {
        printf("%d ", number[i]);
    }
    return 0;
}
```

그랬더니 정렬이 잘되지 않고 결과화면이 이상해진다. (1~2 번 컴파일에서는 잘 될 수 있으나 여러번 돌려보면 아래처럼 나오는 경우가 있다)  

![]({{ site.url }}/assets/images/comarch2pratice_2.PNG)  

Critical Section Control을 해주지 않아서 그렇다. thread1 이 swap하고 있는 동안 그 공간을 thread2가 swap해 버리는 경우가 발생하는 것인데, 이를 `Dependency Collision`이라고 한다.

이를 해결해 주기 위해서는 odd-even 방식을 사용하면 된다. #pragma omp for가 알아서 작업을 분할한다고 했으므로, 이를 홀수 인덱스와 짝수 인덱스로 나누어 그 작업영역을 겹치지 않게 하는 것이다.
```cpp
#pragma omp parallel
{
    for (int i = 0; i < numberCount; i++) {
        if ( i%2 == 0 ) {
            #pragma omp for
            for (int j = 0; j < numberCount - 1;j+=2) {
                swap(number[j], number[j+1]);
            }
        }
        else {
            #pragma omp for
            for (int j = 1; j < numberCount; j += 2) {
                swap(number[j], number[j + 1]);
            }
        }
    }
}
```
이럴 경우 `#pragma omp for` 내부에서 동작하는 쓰레드들은 서로 사유공간을 침범하지 않을 수 있게 된다. 

### OpenMP 메모리 모델
OpenMP에서 병렬적으로 실행되는 모든 쓰레드/프로세스는 각각 독립적인 공간(stack)을 할당받는다. 따라서 코드에서는 parallel영역에서 `tmp`라는 변수가 있다고 할 때 이 변수의 주소를 출력하면 모두 다 다른 값이 나온다.

또, OpenMP영역에서는 기본적으로 루프 인덱스를 제외한 모든 변수는 쓰레드간 공유(shared)된다. 이 부분은 역시 프로그래머가 컨트롤 할 수 있는 부분이고 다음과 같은 지시어를 주면 된다.
```cpp
#pragma omp for shared(변수명)
/* 변수명에 지정된 변수를 병렬 영역내의 thread가 공유하며, shared memory에 선언. 
기본 설정이기도 하다. */
#pragma omp for private(변수명)
/* thread내의 로컬 메모리에 지정된 변수 선언되며 이 영역은 독립적이므로 
Serial 영역의 값이 전달되지 않는다.
private변수는 개별 thread에서 초기화하여 사용해야 하며 초기화 하지 않을 경우 
0 또는 쓰레기 값으로 설정된다. 
private 지시어로 선언된 변수는 thread 종료와 함께 소멸된다.
만약 Serial 영역에 있는 변수와 이름이 같은 private 변수가 있다 하더라도 
서로 완전히 다른 변수처럼 동작한다.*/
#pragma omp for parallel default(none or shared or private ...)
/* 병렬 영역에 있는 글로벌 변수들의 기본 속성을 정한다.
변수의 유효 데이터 범위 속성 설정
자동으로 공유속성이 되는 걸 방지한다. */
```

### Reduction
Reduction이라는 지시어는 취합하기 직전에 어떤 연산을 사용할 것인가에 관한 내용인데, 조금 더 복잡하다. 문법은 아래와 같다.
```cpp
#pragma omp for reduction(오퍼레이터:변수명)
```

각 thread 별로 연산된 결과 값을 다시 취합하여 Serial 영역으로 전달하는데, 지정되는 오퍼레이터를 이용하여 thread 별로 연산한 결과 값을 취합한다.
병렬 영역 내에서 thread 변수 값을 취합할 때 동기화를 지원하고 변수명에 지정된 변수는 각 thread 별로 private 속성을 가진다.
변수명에는 복수의 변수를 지정 가능하다.

오퍼레이터는 다음 표에서 알아볼 수 있다.  

![]({{ site.url }}/assets/images/comarch2pratice_3.PNG)  

오퍼레이터가 `-`라면 쓰레드마다 도출한 결과를 각각 마이너스하여 취합하는 식이다.

reduction은 아래와 같이 사용한다.
```cpp
for( i=0; i<1000; i++ ){
    Data[i] = i+1;
}
#pragma omp parallel for reduction(+:sum)
for( i=0; i<1000; i++ ){
    sum += Data[i];
}
```

결과값은 1~1000의 합인 500500이 나온다.

## Synchronization
각 thread의 실행속도는 물리적인 환경에 따라 실행될 때마다 다르게 나타나기 때문에 비동기적으로 동작하는 thread 들은 이상 작동을 일으킬 수 있다. (`cache miss`, `page fault` 등)
이런 이상 작동을 방지하기 위해 동기화과정이 필요하다.

여기에는 3가지 방식이 있다.
- One Thread Execution: 구현이 편리하고, 명확하다. 대신 성능이 떨어지므로, 결과를 출력하는 데 주로 사용된다.
- Synchronization task
- Synchronization data

이 외로, Ordered Directive 라는 방식도 존재한다.


### One Thread execution
One Thread execution에는 2가지 방식이 있다.
- Single Directive
- Master Directive

#### Single Directive
One Thread execution방식 중 하나인 Single Directive는 아래와 같은 방식으로 사용해 볼 수 있다.
```cpp
#include "stdafx.h"
#include <stdio.h>
#include <omp.h>

using namespace std;

int main()
{
    #pragma omp parallel num_threads(4)
    {
        printf("병렬 영역 single 미사용 : %d 번 Thread 동작\n", omp_get_thread_num());
        #pragma omp single
        {
            printf("병렬 영역 single 사용 : %d 번 Thread 동작\n", omp_get_thread_num());
        }
        printf("병렬 영역 single 미사용 : %d 번 Thread 동작\n", omp_get_thread_num());
    }
    return 0;
}
```
`pragma omp single`라는 지시어를 사용하여 적용할 수 있다. 이름 그대로 `One Thread execution`는 Thread 중 하나의 Thread 만 실행하겠다는 이야기다. 여기서 실행되는 Thread는 single 영역에 가장 먼저 도착한 Thread 이지만 보통 master thread인 0번 thread가 당첨된다.
다른 Thread는 single로 지정된 Thread 완료 까지 대기하게 되어 결과화면이 아래와 같이 나온다.  

![]({{ site.url }}/assets/images/comarch2pratice_4.PNG)  

#### Master Directive
One Thread execution방식 중 하나인 Master Directive는 아래와 같은 방식으로 사용해 볼 수 있다.
```cpp
#include "stdafx.h"
#include <stdio.h>
#include <omp.h>
#include <math.h>

using namespace std;
#define MAX 100

int main()
{
    float *data;
    data = new float[MAX];
    for (int i = 0; i < MAX; i++) {
        data[i] = i; // 데이터 초기화
    }
    #pragma omp parallel 
    {
        #pragma omp for
        for (int i = 0; i < MAX; i++) {
            data[i] = sqrt(data[i]);
        }
        #pragma omp master
        {
            for (int i = 0; i < 5; i++) {
                //working
                printf("master data[%d] = %.4f\n", i, data[i]);
            }
        }
        #pragma omp for
        for (int i = 0; i < 5; i++) {
            printf("after data[%d] = %.4f\n", i, data[i]);
        }
        
    }
    delete data;
    return 0;
}
```
`master thread`가 다른 `thread`를 기다리게 만들지 않고, 동시에 같이 실행된다. 기능만 보면 왜 이게 필요한 지 헷갈릴 수가 있다. `master thread`에서만 특별한 작업을 실행시키도록 지정하는 것 외에는 아무런 기능이 없는 것처럼 보이기 때문이다. 더군다나 `Synchronization` 도 없이 실행이 되기 때문에 `get_num_thread()`를 이용해서 그 값이 0일 경우에만 따로 지정하는 것과 별 차이가 없어보이기 떄문이다. 사실 여기엔 미묘한 트릭이 하나 숨어 있다. 만약 위 코드를 `get_num_thread()`를 사용해서 바꾼다면 `if`문이 반드시 필요하게 될 것이다. `omp parallel`영역에서 `if`문을 쓰게 되면 모든 쓰레드는 잠깐이긴 하지만 동작을 정지하고, 브랜치의 결과를 기다리게 된다. 하지만 `master directive` 방식은 이러한 `if`문을 사용할 필요가 없으므로 아주 사소한 성능 향상을 기대할 수 있는 것이다. 작은 프로그램일 경우에는 그 간극이 미묘하지만 규모가 커지게 되면 충분히 critical 해질 수 있는 부분이므로 알아두는 것이 좋다.

위 코드의 결과화면은 다음과 같다.  

![]({{ site.url }}/assets/images/comarch2pratice_4.PNG)  

single과의 차이를 알고 싶다면, `ctrl+f`로 `master`를 찾은 뒤 전부 `single`로 replace 해보면 된다.

### Ordered Directive
Ordered는 parallel영역에서 순차적으로 실행시키고 싶을 때 쓰며, 아래와 같이 코드로 표현할 수 있다.
```cpp
#include "stdafx.h"
#include <stdio.h>
#include <omp.h>

using namespace std;

int main()
{
    int data[12];
    for (int i = 0; i < 12; i++) {
        data[i] = i;
    }
    #pragma omp parallel for num_threads(4) ordered
    for (int i = 0; i < 11; i++) {
        #pragma omp ordered
        {
            data[i] += data[i + 1];
            printf("%d\n", data[i]);
        }
    }
    return 0;
}
```

결과화면은 다음과 같다.  

![]({{ site.url }}/assets/images/comarch2pratice_5.PNG)  

설명할 것도 없이, ordered라는 이름 그대로 순서대로 실행된 것을 확인 할 수 있다.

### Barrier Directives
`#parallel omp barrier`라는 지시어를 통해 베리어를 사용할 수 있다. 베리어라 함은 쓰레드들 간에 동기화를 위해 사용하는 일종의 출발선이라고 생각하면 편하다. 출발선에 모든 선수들이 준비할 때까지 다른 선수들을 대기 시켜 놓듯이 쓰레드를 다 출발선에 서도록 하게 하는 것이다. 

베리어에 도착하기 전까지의 작업을 먼저 끝낸 쓰레드는 베리어에 도착하는 순서대로 마스터 쓰레드(보통 0번 쓰레드)에 완료되었다는 시그널(complete flags)을 보낸다. 
모든 쓰레드가 베리어에 도달하면 각 쓰레드에 시작하라는 시그널(signal flags)를 보내 작업을 동시에 실행시킨다. 이를 확인하기 위해 다음 코드를 보자.
```cpp
#include "stdafx.h"
#include <stdio.h>
#include <omp.h>

using namespace std;

int main()
{
    omp_set_num_threads(4);
    #pragma omp parallel 
    {
        printf("A tid = %d\n", omp_get_thread_num());
        #pragma omp barrier //베리어
        printf("B tid = %d\n", omp_get_thread_num());
    }
    
    return 0;
}
```

베리어를 선언하지 않은 경우, 출력은 다음과 같다.  

![]({{ site.url }}/assets/images/comarch2pratice_7.PNG)  

베리어를 선언한 경우 출력은 다음과 같다.  

![]({{ site.url }}/assets/images/comarch2pratice_8.PNG)  

사실 베리어는 `#pragama omp for`를 썼을 때부터 사용하고 있었다. 그 지시어를 사용하게 되면 암묵적으로 베리어를 생성하기 때문이다. 이 암묵적으로 생성된 베리어를 없애기 위해서는 `#pragama omp for nowait`을 하면 된다.


### Atomic Directives
Atomic Directives는 다음 3가지 특징을 가진다.
- Shared memory 영역의 데이터에 대한 다수의 thread 의 동시 접근 방지을 방지한다.
- Critical section 내의 데이터에 대한 일관성 보장
- Race condition 오류 방지 목적  

Critical Section과 Race Condition은 그 개념이 조금 다르다. 다음과 같이 이해 하면 되겠다.
- Critical section : 둘 이상의 thread 가 동시에 접근 해서는 안 되는 공유 자원을 접근하는 ‘코드의 일부’
- Race condition : 공유 자원에 대해 여러 개의 프로세스가 동시에 접근 을 시도하는 ‘상황’

Atomic Directives는 여러 instruction을 하나로 처리하기 위해 기능적으로 분할이 될 수 없도록 보장하여 위와 같은 일들을 할 수 있는 것이다. 
보장하는 방식은 컴퓨터 아키텍처에 따라 다르다. 

실제로 사용할 때는 `#pragma omp atomic`이라는 지시어를 사용한다. 
테스트를 하기 위해 1부터 100까지의 합을 구하는 다음 코드를 병렬로 바꾸어 보자.
```cpp
#include "stdafx.h"
#include <stdio.h>
#include <omp.h>

#define N 100

int main()
{
    int i, sum = 0, local_sum;    
    local_sum = 0;
    for (i = 1; i <= N; i++) {
        local_sum = local_sum + i;
    }
    sum = sum + local_sum;
    printf("sum = %d\n", sum);
    return 0;
}
```
위 코드를 atomic을 이용해 병렬화 시키면 아래와 같을 것이다.
```cpp
#include "stdafx.h"
#include <stdio.h>
#include <omp.h>

#define N 100

int main()
{
    int i, sum = 0, local_sum;
    #pragma omp parallel num_threads(4) private(local_sum, i)
    {
        local_sum = 0;
        #pragma omp for
        for (i = 1; i <= N; i++) {    
            local_sum = local_sum + i;            
        }
        #pragma omp atomic
        sum = sum + local_sum;

    }
    printf("sum = %d\n", sum);
    
    return 0;
}
```

혼자서 이걸 해볼 때 실수를 했었는데, `#pragma omp for`를 삽입하는 걸 잊어버렸다. `#pragma omp parallel`과 `#pragma omp for`의 차이점을 잠시 잊었던 까닭인 듯하다. 만약 `#pragma omp for`를 삽입하지 않는다면 값은 20200이 나오는데, 4개 쓰레드가 전부 병렬적으로 1~100까지 합을 구해 더해버리기 때문이다. 

코드에 대한 설명을 마저 하자면, `local_sum`은 `private`하게 더해져야 하므로 `private(local_sum)`을 넣었다. 만약 저게 싫다면 `int local_sum = 0`을 `parallel`영역안에 선언해도 좋다. `local_sum`은 쓰레드마다 공간을 할당받은 채로 더해질 것이므로 그에 대해서는 더 신경 쓸 필요가 없고, `sum`을 합치는 과정에서 `race condition`이 발생하므로 `#pragma omp atomic`을 이용해 이를 막아주었다. 결과는 5050이 나온다.

### Critical Directives 
Atomic 과 상당히 유사한데, Atomic이 "이 연산은 무조건 한 쓰레드만 실행하도록 하겠다" 라는 느낌이라면, Critical은 "이 공간은 무조건 한 쓰레드만 접근하도록 하겠다"라는 느낌이다.

```cpp
#include "stdafx.h"
#include <stdio.h>
#include <omp.h>

#define MAX 1000
using namespace std;

int main()
{
    float* data;
    data = new float(MAX);
    int i = 0;
    for (i = 0; i < MAX;i++) {
        data[i] = i;
    }
    float max = 0;
    #pragma omp parallel for
    for (i = 0; i < MAX;i++) {
        #pragma omp critical(MAXVALUE) 
        { 
            if (max < data[i]) {
                max = data[i];
            }
        }
    }
    printf("최대값 : %.3f\n", max);
    delete data;
    return 0;
}
```

Critical을 쓰지 않은 경우 결과가 998이 나오게 될 수도 있다. 하지만 요즘 나오는 CPU는 워낙 좋아서 999가 나오는 경우도 많다고 한다.
그리고 예제에서 알 수 있다시피 `critical(name)`에서 `name`은 그냥 `ciritical parallel`영역에 대한 네이밍이므로 마음대로 지어주어도 좋다.

### Section Directives
기존 병렬 프로그래밍은 데이터만 분할해 주고 작업하는 내용은 똑같았다. 1~100 까지 병렬로 더한다고 한다면 1~20, 21~40, ... 81~100 이렇게 데이터를 각자 할당 받았을 뿐 더하는 작업은 결국 같다는 것이다.  
Task Parallelization은 작업 역시 분할하는 병렬 프로그래밍이다. 문법은 다음과 같다.
```cpp
#pragma omp [parallel] sections [clauses]
{
    #pragma omp section
    {
        code block
    }
}
```
사실 위의 어법만 보면 잘 와닿지 않는다. 아래 예제를 보자.
더하기, 곱하기, 루트, 로그하는 연산작업들을 병렬화 시켰다.
```cpp
#include "stdafx.h"
#include <stdio.h>
#include <omp.h>
#include <math.h>

#define MAX 50000000

using namespace std;

int main()
{
    int i = 0;
    float * Data = new float[MAX];
    float * sqrt_Data = new float[MAX];
    float * log_Data = new float[MAX];
    float * add_Data = new float[MAX];
    float * mul_Data = new float[MAX];

    for (i = 0; i < MAX; i++) {
        Data[i] = i;
    }

    #pragma omp parallel num_threads(8)    
    {
        #pragma omp sections
        {
            #pragma omp section
            {
                for (int i = 0; i < MAX;i++) {
                    add_Data[i] = Data[i] + Data[i];
                }
            }
            #pragma omp section
            {
                for (int i = 0; i < MAX; i++) {
                    mul_Data[i] = Data[i] * Data[i];
                }
            }
            #pragma omp section
            {
                for (int i = 0; i < MAX; i++) {
                    sqrt_Data[i] = sqrt(Data[i]);
                }
            }
            #pragma omp section
            {
                for (int i = 0; i < MAX; i++) {
                    log_Data[i] = log(Data[i]);
                }
            }
        }
    }

    printf("DATA : %f, %f, %f \n", add_Data[0], add_Data[1], add_Data[2]);
    printf("DATA : %f, %f, %f \n", mul_Data[0], mul_Data[1], mul_Data[2]);
    printf("DATA : %f, %f, %f \n", sqrt_Data[0], sqrt_Data[1], sqrt_Data[2]);
    printf("DATA : %f, %f, %f \n", log_Data[0], log_Data[1], log_Data[2]);
    return 0;
}
```
아래는 결과 화면이다.  

![]({{ site.url }}/assets/images/comarch2pratice_9.PNG)  
    
즉 섹션을 나누어 주기만 한다면, 그리고 서로 의존성을 가지지 않는다면 이렇게 작업을 분할하여 병렬화 하는 것이 가능하다.

만약 작업이 서로 의존성을 지녀서 크리티컬 섹션에 서로 접근한다고 한다면 Critical Directives를 이용해 의존성 해결이 가능하다.
가령 위의 예제에서 전부 같은 공간에 값들을 더해준다고 한다면 모든 `section`에 대해서 `#pragma critical(SECION) {...}`로 모두 씌워버리면 된다.

이 때 주의할 점은 이 의존성 문제는 `atomic`으로는 해결하지 못한다는 것이다. `section`을 나누게 되면 쓰레드는 각 구역을 독립적인 공간으로 바라보기 때문에 다른 `section`에 `atomic`이 걸려있는지 알지 못하기 때문이다.


### Task Directives

OpenMP 3.0 부터 추가된 `#pragma omp task`를 이용해 Task Directives를 할 수 있고, 다음과 같은 특징을 가진다.
- 수행해야 할 코드를 작업 큐에 넣어 동작
- 작업 큐에 코드들은 Thread들 중 유휴 상태가 된 순서대로 작업 실행
- 통상적으로 task를 작업 큐에 넣는 동작은 single 지시어 사용
- 병렬영역에서 다수의 Thread가 동작하여 동기화 문제가 발생 가능
- task 지시어는 암묵적 동기화 지원 안됨
- Task 지시어의 처리 종료를 대기하려면 taskwait 지시어 사용
- while 루프문, C++ 반복자(iterator), 재귀 함수 등을 병렬화

예제코드는 다음과 같다.
```cpp
#include "stdafx.h"
#include <stdio.h>
#include <omp.h>
#include <math.h>

#define MAX 20

using namespace std;

int Fibonacci(int n) {

    int x, y;
    if (n < 2) {
        return n;
    }
    else {
        #pragma omp task
        x = Fibonacci(n - 1);
        #pragma omp task
        y = Fibonacci(n - 2);
        #pragma omp taskwait
        return (x + y);
    }
}

int main()
{
    int FibNumber[MAX] = {0};
    int i = 0;
    #pragma omp parallel
    {
        #pragma omp single
        {
            for (i = 0; i < MAX; i++) {
                FibNumber[i] = Fibonacci(i);
            }
        }
    }
    printf("피보나치 수 : ");
    for (i = 1; i < MAX; i++) {
        printf("%d ", FibNumber[i]);

    }
    return 0;
}
```
마스터 쓰레드는 `omp task`를 만나면 그 작업을 처리하지 않고 작업 큐에 해당 작업을 `push`한다. 그리고 기다리던 다른 쓰레드 들이 그 작업을 받아와 실행하게 된다.
`taskwait`를 만나면 마스터 쓰레드(single로 들어온 쓰레드)는 테스크 큐가 전부 빌 때까지 `wait`상태가 된다.

하지만 위의 코드에서는 마스터 쓰레드를 제외한 다른 쓰레드들 조차 작업 큐에 작업을 `push`하게 되어서 결과적으로는 이상한 값이 나온다.

`task`를 `push`하고 난 뒤 `wait` 상태가 된 마스터 쓰레드 역시 작업 큐에서 작업을 할당받아 처리할 수 있다. 작업 큐에 접근하는 쓰레드는 `wait`상태가 된 쓰레드이기 때문이다.


### Data Access Pattern
캐시 이용률을 높이기 위한 프로그래밍 기법
2차원 행렬의 각 원소를 2배로 만드는 아래 프로그램을 살펴보자.
```cpp
#include "stdafx.h"
#include <omp.h>

#define SIZE 4000

double Matrix_double(int(*matrix)[SIZE], long int size) {
    double total_begin = omp_get_wtime();

    #pragma omp parallel for
    for (int x = 0; x < size; x++) {
        for (int y = 0; y < size; y++) {
            //matrix[y][x] = matrix[y][x] * 2; // output: 0.121341 sec
            matrix[x][y] = matrix[x][y] * 2;  // output: 0.016295 sec

        }
    }
    double total_end = omp_get_wtime();
    return double(total_end - total_begin);
}

int main()
{
    int matrix[SIZE][SIZE] = {0};
    double time_result = 0;

    for (int i = 0; i < SIZE; i++) {
        for (int j = 0; j < SIZE; j++) {
            matrix[i][j] = i*SIZE + j;
        }
    }
    time_result = Matrix_double(matrix, SIZE);
    printf("time: %f Sec \n", time_result);
    return 0;
}

```

만약 프로그램이 중지되었습니다 에러가 뜨는 등 컴파일이 되지 않는다면, 가상 메모리 스택 사이즈를 늘려주어야 한다.
위 예제 주석친 부분에서 `matrix[y][x] = matrix[y][x] * 2;`와 `matrix[x][y] = matrix[x][y] * 2;`의 시간차이는 10배 가까이 나는 것에 주목하자. 차이점은 단지 `x`와 `y`의 위치를 바꾸어 주었을 뿐이다. 

CPU는 캐시에서 데이터를 가져올 때 블록 단위로 가져온다는 점을 기억해야 한다. `#pragma omp parallel for`는 `x`를 기준으로 병렬화 하기 때문에 
`x` 주변 데이터를 긁어올 때 캐시 hit가 발생해 성능이 향상된다.

접근하는 방식이 Pattern1이 훨씬 빠르다는 이야기다.

![]({{ site.url }}/assets/images/comarch2pratice_10.PNG)  

### False Sharing

하지만 무작정 위와 같이 Pattern1 을 사용한다고 성능 향상을 기대할 수 있는 것은 아니다. 데이터를 읽어오기만 하는 경우라면 위와 같이 최적화가 가능하겠지만, 데이터를 읽는 것뿐만 아니라 데이터를 쓰는 경우라면 캐시 동기화를 위해서 쓰레드간 오버헤드가 엄청나게 발생할 것이기 때문이다. 

예제가 복잡하기 때문에 여기에 싣지는 않겠다. 다만 프로그래밍을 할 때 이러한 일이 발생할 수 있다는 것을 잘 생각하고 해야함에 유의해야 한다.


### Load Balancing
1000개의 작업을 5개의 쓰레드에 나눠서 시킨다고 하더라도 어떤 쓰레드가 다른 쓰레드보다 먼저 작업을 끝내는 경우가 있다. 작업을 먼저 끝낸 쓰레드는 놀게 되고 이는 곧 비효율로 이어지므로 이에 관한 로드 벨런싱을 해야 한다.

첫번째 방법은 Loop Scheduling이다.

### Loop Scheduling
아래와 같이 두 가지 방식이 있다.

- Task Migration

200개씩 작업을 분할 했다면, 먼저 끝낸 쓰레드에게 일을 다 못끝난 쓰레드가 작업을 나눠준다. 이 때 먼저 끝난 경우 자신이 끝났음을 알려야 하기 때문에 Thread간에 통신이 필요하다. 가장 작업이 많이 남은 쓰레드의 작업을 나눠 갖기 때문이다. openMP에서 구현이 어렵다는 단점도 있다.

- Task Scheduling

일을 초기에 할당할 때부터 200개씩이 아니라 적절한 크기 만큼 쓰레드 들에게 조금씩 던져준다. Thread간에 통신이 불필요하다. 다만 적절한 분배 크기 설정이 어렵다. openMP에서는 `#pragma omp for schedule`이라는 지시어를 이용해 구현해 볼 수 있다.

Task Scheduling에서는 Directive가 3가지가 있는데, static, dynamic, guided 이 바로 그것이다.

static은 작업이 chuck_size별로 정적 분배된다.

dynamic은 고정된 chuck_size가 작업을 완료한 쓰레드에게 할당된다.

guided는 작업을 먼저 완료한 쓰레드가 대기 상태로 진입하여 작업을 요청하는데, 분배 작업이 지속될 수록 남아 있는 작업의 양이 줄어드므로 chunk_size가 일정 비율로 할당 크기가 감소한다.

이 3 가지 방식은 코드로 나타내면 아래와 같다.

```cpp
#include "stdafx.h"
#include <omp.h>
#include <math.h>

#define MAX 5555
    
int main(int argc, char *argv[])
{
    int i = 0;
    float temp = 0;
    double Data[4][MAX] = { 0 };
    for (i = 0; i < MAX;i++) {
        for (int j = 0; j < 4;j++) {
            Data[j][i] = 0;
        }
    }
#pragma omp parallel private(i) num_threads(4)
    {
// #pragma omp for schedule(static, 100)    // 무조건 100개씩 할당
// #pragma omp for schedule(dynamic, 100)   // 일 끝난 쓰레드한테 100개씩 할당
#pragma omp for schedule(guided, 100)   // 일 끝난 쓰레드한테 100개씩 주면서 점점 그 양을 줄인다.
        for (i = 0; i < MAX;i++) {    
            Data[omp_get_thread_num()][i] = i;
            temp = sqrt(Data[omp_get_thread_num()][i]);

        }
    }
    for (i = 0; i < MAX;i++) {
        printf("Data[0][%2d] = %2.0f, Data[1][%2d] = %2.0f, Data[2][%2d] = %2.0f, Data[3][%2d] = %2.0f, \n", i, Data[0][i], i, Data[1][i], i, Data[2][i], i, Data[3][i]);
    }
}
```

guided는 dynamic에서 쓰레드 간 작업 속도를 비슷하게 맞춰주기 위해서 나왔다. 

이 외에도 auto와 runtime이 있다.

`#pragma omp for schedule(auto)` : 컴파일러 또는 runtime 시스템이 가장 적합하다고 판단하는 스케쥴로 설정

`#pragma omp for schedule(runtime)` : 스케줄에 대한 결정을 프로그램이 실행될 때까지 연기


### Collapse

for문을 접할 때마다 for문 밖으로 빠져나와도 되는 지에 관한 Branch를 만나게 되는데, 이는 컴퓨터 성능에 매우 안좋은 영향을 끼친다. 400개 짜리 단일 for문보다 100, 4 짜리 이중 for문이 더 좋은 성능을 내는 것이다. 이를 성능향상에 이용하기 위해 나온 것이 바로 `#pragma omp for collapse(루프 수)`이다. 즉, collapse는 2개 이상의 중첩된 루프 문을 1개의 커다란 루프처럼 구성하여 병렬화를 진행한다.
단, Collapse 보조 지시어는 #pragma omp for 지시어에 한 번만 사용이 가능하다. 아래와 같이 사용이 가능하다.

```cpp
#define MAX 10

int main() {
    int i = 0, j = 0;
    int count = 0;

    omp_set_num_threads(4);

    #pragma omp parallel shared(count) private(i, j)
    {
        #pragma omp for ordered collapse(2)
        for (i = 0; i < MAX; i++) {
            for (j = 0; j < MAX; j++) {
                #pragma omp atomic
                count++;
                #pragma omp ordered
                printf("i+MAX+j : %2d, thread num : %d\n", i+MAX+j, omp_get_thread_num());
            }
        }
    }
    printf("count = %d\n", count);
    return 0;
}
```

### Nested Library
쓰레드마다 분할 시켰던 작업을 또 다시 쓰레드로 분할하여 작업하고 싶을 때 사용한다. 즉 `#pragma omp parallel` 안에 `#pragma omp parallel`를 또 사용할 수 있다. 그림으로 나타내면 아래와 같다.

![]({{ site.url }}/assets/images/comarch2pratice_11.PNG)  

위 그림에서 Master Thread의 `omp_get_thread_num()`의 결과는 항상 0 임에 주의하자. 따라서 Master Thread 간에 구별을 원한다면 `omp_get_ancester_thread_num()`, `omp_get_level()`, `omp_getnested()` 등을 대신 사용해야 한다. level 같은 경우 위 그림 기준으로 0:1:2:1:0 이다.

Nested를 사용한다고 해도 무조건적으로 성능향상을 기대하기는 어렵다. 

원래 코어는 무조건 한 번에 한 개의 일 밖에 수행하지 못한다. 100개로 쓰레드 개수로 지정을 했다고 하더라도 사실은 (쿼드 코어인 경우) 4개의 코어가 일을하면서 100개의 쓰레드가 동작하는 것처럼 보이게 하는 것이다. 하이퍼 쓰레딩을 지원해서 8개 쓰레딩이 가능하다고 하더라도 실제로 코어는 4개일 뿐이다(실제로 하이퍼 쓰레딩은 한 코어가 병렬처럼 일하는 것처럼 보이게 만든 것이다). 따라서 실무에서도 Nested는 잘 쓰이진 않는다. 


