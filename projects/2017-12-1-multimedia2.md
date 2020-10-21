---
layout: post
title: 멀티미디어 공학 개론(2) (feat. KU.멀공개)
category: [multimedia]
author: hyungsun
image: assets/images/multimedia_33.png
---

# 6장. 무손실 압축
Input Data의 크기를 Encoding을 거친 뒤 Storage에 저장되는 데이터의 크기만큼으로 줄였다면 압축했다고 이야기 한다.
![]({{ site.url }}/assets/images/multimedia_33.png)

압축에는 두가지 종류가 있다.
- 무손실 압축: Input Data == Output Data
- 손실 압축: Input Data != Output Data
  
### Shannon의 법칙
정보이론 기초에서 어떤 데이터가 있을 때 그 데이터의 엔트로피를 정의하는 Shannon의 법칙이라는 게 등장한다.
![]({{ site.url }}/assets/images/multimedia_34.png)
\\(p_{i}\\) 는 데이터 소스 \\(S\\)의 일부분인 \\(S_{i}\\)가 데이터 소스에 등장할 확률이다.   
\\(log_{2}{\frac{1}{p_{i}}}\\)은 \\(p_{i}\\)의 self-information이다. 여기에 \\(p_{i}\\)를 곱하면 기댓값이 되는데, 그 기댓값을 모두 더한 것이 바로 데이터의 엔트로피라는 것이다. 
이 때 \\(log\\)의 밑이 2인 이유는 컴퓨터가 비트(bit)단위를 쓰기 때문이다.

self-information이 3이라면 해당 \\(p_{i}\\)를 표현하려면 최소한 3비트가 필요하다는 것을 의미한다.

이해를 돕기 위해 아래 그림을 보자.
![]({{ site.url }}/assets/images/multimedia_35.png)
A같은 경우 \\(p_{i}\\) 가 나타날 확률은 모두 \\(\frac{1}{256}\\)이므로 self-information의 크기는 \\(\log_{2}{{256}}\\) 이다. 따라서 엔트로피의 크기는 \\(256 \* \frac{1}{256} * log_{2}{{256}}\\) 으로 8 이 된다. 
B같은 경우 두 번 \\(p_{i}\\)가 등장하는데, 각각 확률은 \\(\frac{1}{3}\\), \\(\frac{2}{3}\\) 이다. 
따라서 엔트로피의 크기는 \\(\frac{1}{3} * log_{2}{3} + \frac{2}{3} * log_{2}{\frac{3}{2}}\\) 이다. 계산기로 계산해보니 약 0.917 정도의 값이 나온다. 비트의 단위는 정수이므로 엔트로피는 1로 정해진다.

그럼 이 엔트로피를 어디다 쓰느냐?
엔트로피가 8이라는 말은 데이터 소스를 압축했을 때 각 데이터 소스의 \\(S_{i}\\)의 압축된 크기의 평균이 8bit보다는 커야 함을 의미한다. 즉 엔트로피가 작을 수록 압축률이 높아진다.
언뜻 A가 더 압축률이 높을 것 같지만, A는 데이터가 단조롭게 같은 확률로 몽땅 다 출몰하는 경우이므로 압축률이 더 낮을 수 밖에 없다. 반면 B는 데이터가 256개 중 단 2개만 등장하는 경우이다. 

엔트로피 코딩은 평균 압축코드가 엔트로피 크기와 같은(최대로 압축된) 이상적인 코딩이다.

### Run Lenght Coding(RLC)
아래와 같은 데이터가 있다고 하자. 데이터 사이즈는 37이다.  
`AAAAAAAAABBBBBBBBCCCCCCCCCBBBBBBBBBBB`  
A는 10개, B는 18개 C는 9개가 출몰했다. 이걸 RLC압축을 하면   
`A10B8C9B10`  
이렇게 압축이 된다. 37 사이즈가 10 사이즈로 줄어들게 된다.

### Huffman Coding
Huffman 인코딩은 대표적인 VLC(Variable Length Coding) 코딩으로, 데이터의 출현 빈도가 높을 수록 낮은 비트를 할당하여 데이터를 압축하는 방식이다. 아래는 `HELLO`라는 문자열을 Huffman 인코딩한 것이다.
 데이터 구성원 당 정수개의 비트를 할당해야 하는 상황에서 Huffman 코딩보다 압축률이 좋은 코딩방식은 없다.
![]({{ site.url }}/assets/images/multimedia_36.png)

이 때 엔트로피를 구하면 정수로 나누어 떨어지는 경우는 별로 없다. 하지만 호프만 코딩은 정수비트를 할당해야 하기 때문에 average code length의 upper bound는 엔트로피보다 같거나 크고 엔트로피+1 보다 작게 된다.

### Extended Huffman Coding
그래서 이것을 보완하기 나온 녀석이 Extended Huffman Coding이다. 
이 방식은 데이터를 k개 씩 묶어서 Huffman 코딩을 하는 방식이다.
이 방식에서는 데이터 압축코드의 upper bound를 엔트로피 + 1/k로 성능을 향상시킬 수 있다.

하지만 이 방식을 사용하려면 인코더와 디코더가 모두 Huffman Table이라고 불리는 코드 북을 가지고 있어야 한다. 인코딩 과정에서 k개씩 묶었으니 디코딩 과정에 어떻게 묶었는지 알 수 있을 만한 자료가 필요한 것이다.
그래서 일반적으로 file Header에 Huffman Table을 포함시킨다. 이 때 배보다 배꼽이 더 커지게 되는데, 만약 100개의 심볼을 3개씩 묶는다 치면 Huffman Table의 사이즈가 \\(100^3\\)이 되기 때문이다. 그래서 실용적이지 못하다. 실제로도 잘 안쓰인다고 한다.

### Adaptive Huffman Coding
Adaptive Huffman Coding은 인코딩 단계마다 Symbol들의 통계를 구해서 이상적인 Huffman 코딩을 만드는 방법이다. 아래와 같이 빈도수가 새로 업데이트 될 때마다 Huffman 트리를 계속 업데이트 시키는 방식을 사용한다.

![]({{ site.url }}/assets/images/multimedia_43.png)

![]({{ site.url }}/assets/images/multimedia_44.png)

참고로 처음 나오는 심볼은 New를 사용하고, Code = 0 이다. New의 Count = 0으로 고정된다. 항상 빈도수가 가장 높은 노드는 오른쪽으로, 작은 노드는 왼쪽 방향을 향한다고 생각하면 이해하기 쉽다.

트리가 계속 동적으로 바뀌므로, 이 데이터를 같이 전송해 주어야 한다. New다음에 나오는 노드는 처음 등장한 노드로, Initial Code Book에 나오는 코드워드가 할당되어 있다.

![]({{ site.url }}/assets/images/multimedia_82.png)



### Dictionary-based Coding
Huffman 코딩은 심볼들 별로 인코딩한 크기(코드 워드)가 다 다르다. 하지만 Dictionary-based Coding은 그 길이가 고정된다. 대신 압축의 대상이 되는 심볼의 크기가 다르다.

`ABABBABCABABBA`라는 데이터를 Dictionary-based Coding한다고 하자. 그럼 다음과 같을 것이다.
![]({{ site.url }}/assets/images/multimedia_42.png)
사실 위 사진 한 장으로 Dictionary-based Coding는 정리가 된다. 차근 차근 정리해보자.  
우선 인코딩을 시작하기 전에 최소 단위 심볼마다 기본적으로 할당된 Dictionary를 만들어 놓는다. 위 사진에서 A=1, B=2, C=3 까지가 여기에 해당된다.  
s 에는 `ABABBABCABABBA`의 맨 처음 데이터인 `A`가 먼저 들어간다. 일단 s에 값이 오면 인코더는 Dictionary를 조회하는데, 값이 있다면 output에 해당하는 값과 매칭되는 코드를 적고 c 에다가는 그 다음 값인 `B`를 넣는다. 그리고 나서 s+c 를 Dictionary에서 조회를 해보고 만약 없다면 Dictionary에 추가한다. 여기서 if문이 2번 나왔다는 것을 알았을 것이다. 말로하는 것보단 코드로 표현하는 게 더 깔끔할 것 같으므로 코드로 나타내 보겠다.

```python
Begin
    data = "ABABBABCABABBA"
    output = ""
    D = {'A':1,'B':2,'C':3}
    code = len(D) + 1 # 4
    while data.isEmpty() == false :
        if not s :  # 맨 처음일 경우
            s = data.pop()
        if s in D.keys() :
            ouput += D(s)   # 코드를 output에 추가
            c = data.pop() 
            s = s+c
        else :
            D(s) = code
            code += 1
End
```


Dictionary-based Coding을 해본 바로 Dictionary가 계속 자라나는 걸 알았을 것이다. 하지만 실제에서 Dictionary를 무한하게 할당할 수는 없다. 그래서 maximum bit를 할당해 두는데, 그렇게 maximum bit를 전부 채우고도 Dictionary가 모자라는 경우가 있다. 이 경우에 적용되는 법칙이 LRU(Least Recently Used)인데, 오래된 데이터를 삭제하고 그 자리에 새로운 데이터를 집어넣는 방식이 바로 LRU이다. 

새로운 데이터를 받아들일 때 오래된 데이터를 삭제한다면 디코딩은 어떻게 하는 걸까? 그 비결은 디코더도 딕셔너리 코드북을 만드는 것에 있다. 위 그림에서 기본 코드북은 디코더도 가지고 있는데, `output`들을 받아 들이면서 디코더도 코드북을 작성하게 된다. 디코더 역시 LRU원칙을 적용하기 때문에 코드북 동기화가 되는 것이다.

### Arithmetic Coding
코딩해야 할 시퀀스를 통째로 메시지로 취급한다. 이 메시지에 대해서 코드를 발생시킨다. HELLO에서 H, E, L, O에 대해 각각 코드를 할당하는 것이 아니라 HELLO를 자체로 코드를 할당한다는 의미이다. 이 할당된 코드는 0부터 1까지의 값을 가지는데 이 코드를 표현 한 비트가 바로 코드워드가 된다.
0부터 1까지의 값을 가지는 이유는 빈도수로 그 구간을 나누었기 때문이다. 아래와 같이 말이다.
![]({{ site.url }}/assets/images/multimedia_37.png)
이 때 $는 terminator인데, terminator는 데이터의 끝을 알린다.
아래는 심볼을 0, 1 의 범위로 구하는 과정이다.
```c
Begin
    low = 0.0; 
    high = 1.0;
    range = 1.0;

    while(symbol != terminator ) {
        get(symbol);
        low = low + range * Range_low(symbol);
        high = low + range * Range_high(symbol);
        range = high - low;
    }
    ouput a code so that low <= code < high;
End
```

결국 이 과정을 거치게 되면 A, B, C, D, E, F가 등장하는 데이터가 있다고 했을 때 그 안에 있는 데이터를 압축코드로 표현할 수 있게 된다.
예를 들어, CAEE라는 심볼에 대한 코드는 다음과 같은 low, high, range를 가진다.
![]({{ site.url }}/assets/images/multimedia_38.png)

이 때 0.0부터 시작하여 0.01, 0.010, ... , 0.01010101(=0.33203125) 처럼 점점 소수점에 0 혹은 1을 더해가면서 값을 표현하는데, 그 값이 $의 범위에 있다면 그 만큼이 CAEE를 표현하는 코드가 된다. 

이를 슈도코드로 바꾸면 아래와 같다.
```c
Begin
    code = 0;
    k = 1;
    while (value(code) < low) {
        assign 1 to the kth binary fraction bit 
        if (value(code) > high) {
            replace the kth bit by 0
        }
        k = k+1;
    }
End
```

말이 조금 어려운데, 아래 그림을 보면 이해가 될 것이다.
![]({{ site.url }}/assets/images/multimedia_39.png)

디코더는 0.33203125라는 코드를 받게 되면 위 테이블에서 그 범위를 찾아서 원본 심볼을 복구할 수 있게 된다.
디코딩 과정의 슈도코딩은 다음과 같다.
```c
Begin
    get binary code and  convert to decimal value = value(code);
    Do {
        find a symbol s so that Range_low(s) <= value < Range_high(s);
        ouput s;
        low = Range_low(s);
        high = Range_high(s);
        range = high - low;
        value = [value - low] / range;
    }
    Until symbol s is a terminator
End
```

![]({{ site.url }}/assets/images/multimedia_40.png)


### 무손실 이미지 압축
5장 Audio Coding에서 인접한 오디오 데이터 간 차이를 구해서 손실, 무손실 코딩을 했던 것을 기억할 것이다. 이 때 사용했던 원리는 이미지에도 똑같이 적용할 수 있다. 인접한 픽셀의 차를 구해서 그 차이만을 이용해 압축하는 방식으로 압축률을 높이는 것이다.

![]({{ site.url }}/assets/images/multimedia_80.png)

위 그림에서 오른쪽 위 이미지는 왼쪽 위 이미지에서 근접 픽셀간 차이를 구한 뒤 다시 이미지로 표현한 것이다. 픽셀데이터는 2차원이기 때문에 차이를 구하는 방식에는 오디오데이터와 조금 차이가 있지만, 원리는 같으므로 설명은 하지 않겠다. 아무튼 그래프 상에서 오디오데이터 때와 마찬가지로 훨씬 심플해지는 것을 볼 수 있고, 이를 이용해 Predictor라는 것을 사용하게 된다. 즉, 다음에 나올 픽셀값을 이 전에 받은 픽셀들로 예측해서 예측값을 구하고, 그 차이를 인코딩 하는 것이다. 

아래 내용은 Predictor의 표준이다.

![]({{ site.url }}/assets/images/multimedia_41.png)

복잡할 것 없이, 어떻게 예측을 할까에 관한 것이다. 한 번 압축할 때 이 Predictor들을 모두 사용하는 것이 아니라, 압축 방식에 따라 Predictor 중 한 가지만을 사용한다. 

# 7장. 손실압축
6장에서 무손실 압축에 대해서 다뤘으니, 이제 손실압축에 대해 다뤄야 할 때다.

### Distortion Measures
손실이 발생하는 압축방식이므로, 데이터가 얼마나 성능 좋게 압축되었는지를 떠나 손실이 얼마나 발생했는지 궁금할 것이다. 이를 측정하는 방식에는 3가지가 있다.

![]({{ site.url }}/assets/images/multimedia_46.PNG)

![]({{ site.url }}/assets/images/multimedia_47.PNG)

![]({{ site.url }}/assets/images/multimedia_48.PNG)

SNR 계열에서 시그마_x ^2은 제곱한 픽셀값의 평균이고, 시그마_d ^2은 제곱한 픽셀간 차이의 평균이다.

PSNR에서 픽셀 값 중에 가장 큰 값의 제곱이 분자로 들어간다.

### Quantization
Loss, noise의 주범이 바로 양자화다. 양자화는 여러 값들을 훨씬 적은 수의 세트로 매칭시켜주는 과정이다.
3가지 종류가 있다.
- Uniform
- Nonuniform
- Vector Quantization  

#### Uniform
Linear Quantization이라고도 한다. input values의 범위를 가장 자리에 2 부분을 제외한 나머지 인풋을 등간격으로 쪼개고, 
ouput values는 이 등간격의 중앙값의 집합으로 만들어 낸다. 이런 방식을 통해서 훨씬 적은 수의 세트로 매칭시켜주는 것이다.
등간격의 크기는 보통 델타(step size)라고 불린다.
여기에는 midrise방식과 midtread방식이 있다.  

![]({{ site.url }}/assets/images/multimedia_50.png)

x의 범위가 0.6이라고 할 때, Qmidrise 0.5는 Qmidtread는 1이라는 결과가 나온다. 그래프로 보면 차이를 더욱 알기 쉽다.

![]({{ site.url }}/assets/images/multimedia_51.png)

Granular distortion  
구간을 설정함으로 인해 발생하는 에러를 구하는 방법을 설명한 것이고, 사실 공식만 어렵지 그리 어려운 내용은 아니다.

![]({{ site.url }}/assets/images/multimedia_52.png)

input을 그대로 전부 그래프로 찍었을 때와 ouput을 전부 그래프로 찍었을 때 면적 차이정도로 이해해도 무방하다. 즉 input을 그대로 찍은 그래프를 midrise나 midtread를 하게 되면 계단 모양으로 input 그래프를 본 뜬 것처럼 그래프가 바뀔 텐데, 그 때 두 그래프간 면적차이라고 생각하라는 것이다.

#### Nonuniform
Companded Quantization이라고도 한다. 비선형함수를 쓰기 때문에 다시 역함수로 역변환하는 과정이 필요하다. 이를 그림으로 나타내면 다음과 같다.

![]({{ site.url }}/assets/images/multimedia_53.png)

#### Vector Quantization(VQ)
어떤 구간을 표현할 수 있는 code word가 한정되어 있기 때문에 벡터에다가 코드를 할당하는 방식이라고 보아도 좋다. 
여기서 벡터는 데이터들을 N개로 구간을 나누었을 때, 평균적인 해쉬거리를 나타낸다.
그림을 보자.

![]({{ site.url }}/assets/images/multimedia_54.png)

사실 bmp 헤더 공부 할 때 했었던 color map과 개념이 아주 유사하다. 인코딩 시에 X의 경우의 수가 훨씬 많지만 그보단 적은 N개의 vector로 매칭시키고, 디코딩 시에 index로 vector table을 조회하여 시퀀스를 복원한다. 이 과정 때문에 필연적으로 손실이 발생한다.

### Transform Coding
앞서 3가지 방식으로 양자화 시킨 데이터를 Transform Coding하여 데이터 간 상호 연관성을 줄여서 압축 효율을 높이는 것이다. 
만약 6차원 데이터가 있어서 (a, b, c, d, e, f)라고 표현된다고 해보자. 6개의 축을 잘 회전시켜서 (a',b',c',0,0,0)으로 만들 수 있을 것이다. 뒷 부분을 0으로 만들게 되면 Run Length Coding을 할 때 이점이 있으므로 후자처럼 바꾸는 것이 더 좋은데, Transform Coding은 그런 상태로 만들어 주기 위해 사용하는 부호화 방식이다. 

이 방식에는 `DCT`, `KLT`가 있다. `DCT`보다는 `KLT`가 더 효율적이긴 하지만 `DCT`에 대해서만 공부할 것이다.

#### Discrete Cosine Transform(DCT)
여태까지 6장에서 했던 내용은 모두 DCT를 위한 것이라고 해도 과언이 아니다.
공간주파수라는 개념이 나온다. 공간주파수는 어떤 이미지 블락에서 픽셀값들의 변화가 얼마나 많이 일어나는가를 나타낸다. 즉, 주파수가 높을 수록 픽셀 데이터 간 변화가 크다.
2차원 DCT를 살펴보자.

f(i, j)는 가로축으로 i, 세로축으로 j 좌표의 픽셀값을 의미한다.
u는 가로축으로 몇 번 변환되었는지, v는 세로 축으로 몇 번 변환되었는지를 의미한다.
N과 M은 각각 가로, 세로 축 상의 픽셀 수를 의미한다.

![]({{ site.url }}/assets/images/multimedia_55.png)

C는 다음과 같이 정의 된다.

![]({{ site.url }}/assets/images/multimedia_56.png)

u, v는 각각 1~N-1, 1~M-1의 범위를 가진다.

이것의 역변환 과정은 `Inverse DCT(IDCT)`라고 한다.

![]({{ site.url }}/assets/images/multimedia_57.png)
![]({{ site.url }}/assets/images/multimedia_58.png)

위처럼 8개의 F가 만들어 진다(F(0), F(1), F(2), ... , F(7)). 사실 이 부분은 그냥 F라는 함수가 이렇다라는 것 정도만 보여주려는 것이므로, 크게 중요한 내용은 아니다.

중요한 부분은 아래 그림이다.

![]({{ site.url }}/assets/images/multimedia_59.png)

첫 번째 그림에서 일정한 공간신호를 가지는 데이터를 DCT해보니, 오른쪽과 같이 나왔다. Transform Coding이 중요한 데이터를 앞쪽으로 끌어모으는 부호화 방식임을 기억하자. 데이터를 앞으로 잘 모은 결과가 그래프에 표현되어 있다.
두 번째 그림에서 AC데이터만을 가지는 인풋을 받아들일 때, 오른쪽과 같이 결과가 나왔다. 일정하지 않은 데이터 일수록 앞쪽으로 모으기가 힘든데, 그 결과가 오른쪽 그래프로 나타난 것이다.

![]({{ site.url }}/assets/images/multimedia_60.png)
DCT는 선형적인데, 앞서 나왔던 두개의 그래프를 합쳐놓은 양상이 위 그림의 첫번째 줄에 있는 그림들이다. input을 합쳐서 보내주자 결과도 합친 모양으로 나타난 것이다. 
두 번째 그림은 일반적으로 데이터를 집어넣었을 때 DCT를 거치면 어떤 양상을 띄는지를 보여준 것이다.


DCT 공식은 실제로는 아래와 같이 연산한다. 2D DCT공식은 1D DCT공식 2개를 합성하여 만들 수 있으므로, 더 효율적인 방식을 따르는 것이다.
![]({{ site.url }}/assets/images/multimedia_62.png)
8x8 이미지라고 했을 때 공식대로 한다면 64번해야 하는 연산이 위와 같이 하면 16번으로 줄어버리기 때문이다.

### DCT와 DFT 비교
DCT는 이산적인 인풋에 대해 의미를 가지고, DFT는 연속적인 인풋에 대해 의미를 가진다. 사실 DCT는 DFT로부터 추출된 함수이다. DFT는 연속 퓨리에 변환 공식에 오일러 방정식을 집어넣어서 아래와 같은 식으로 얻어냈다.

![]({{ site.url }}/assets/images/multimedia_83.png)

오른쪽 sin함수에 i라는 허수가 붙은 것에 유의하자. DCT는 DFT로부터 허수부분을 때어내고 실수부분만을 취한 공식이다. sin함수는 \\({pi}\\)간격마다 적분한 면적이 0이 되므로 그렇게 되도록 샘플 수를 조정하면 허수부분은 사라지게 된다.

즉 인풋 샘플 8개를 받는 DCT는 8개를 2개씩 세부적으로 쪼개 인풋 샘플 16개로 만든 뒤, 그 샘플을 받는 DFT로부터 구해낼 수 있는 것이다.

# 8장. JPEG

### JPEG 부호화 과정

![]({{ site.url }}/assets/images/multimedia_63.png)
FDCT는 Forward DCT로 앞 장에서 설명했던 DCT와 동일한 개념이다.
DC는 F(0,0), AC는 F(0,0)외의 모든 F를 의미한다.

사람들은 높은 공간주파수 성분의 손실(변화의 폭이 큰 상황에서의 변화)에 둔감하기 때문에 JPEG는 이를 적용시켜서 해당 정보량을 줄이도록 인코딩한다. 또, 인간의 시력은 회색조일 경우 훨씬 우수하기 때문에 4:2:0 크로마 서브 샘플링을 사용한다. 

#### 1. 전처리 과정
RGB영상을 YIQ나 YUV영상으로 변환하고 색상정보를 부표본화한다.
각 영상을 8x8사이즈(JPEG 기준값)로 전부 쪼갠다. 

![]({{ site.url }}/assets/images/multimedia_84.png)

![]({{ site.url }}/assets/images/multimedia_85.png)

#### 2. 부호화 (FDCT)
FDCT와 DCT는 똑같은 말이다. 이 앞 장에서 배웠던 내용으로 Transform Coding을 해준다.

#### 3. 부호화 (양자화)
아래 그림은 루미넌스 블락 테이블(왼쪽)과 크로미넌스 블락 테이블(오른쪽)이다.

![]({{ site.url }}/assets/images/multimedia_101.png)

크로미넌스 블락 테이블이 99로 대부분 통일되어 있는 이유는 사람이 덜 민감하기 때문이다.
루미넌스 블락 테이블은 휴리스틱하게 정해진 것이므로 상대적으로 더 복잡한 값들을 가지고 있는 이유에 대해 의문을 품지 않아도 좋다.

사진 예시에서 f(i,j)를 DCT하면 F(i,j), 여기서 양자화를 하면 F'(u,v)
이 값을 역양자화를 거친 뒤 다시 BDCT를 하면 F'(i,j) > f'(i,j)가 되는데, 원본이미지와의 손실을 비교한 e(i,j) = f(i,j) - f'(i,j)를 보면 알 수 있듯이 인간의 눈으로는 구별을 하지 못할 정도의 손실이다.
픽셀 데이터들이 단조로우면 DC가 높다.(사진에선 515)

결국 저주파 영역(좌 상단)보다 고주파 영역(우 하단)에는 0이 들어가는 경우가 많기 때문에 zig-zag로 줄을 세운다.

DC는 픽셀값들의 평균을 의미한다.

![]({{ site.url }}/assets/images/multimedia_86.png)
그림에서 f는 픽셀데이터, F는 DCT변환 후의 데이터, F햇은 양자화를 거친 데이터, F물결은 복원한 값이고, e는 복원한 값과 원본 값과의 차이이다.
![]({{ site.url }}/assets/images/multimedia_87.png)

#### 4. 지그재그 스캔
![]({{ site.url }}/assets/images/multimedia_88.png)
DC가 가장 오른쪽에 위치한 것에 주의한다. 가장 오른쪽부터 입력으로 들어간다고 생각하면 편하다.
지그재그 스캔은 결국 고주파 영역에서 등장할 확률이 높은 0을 더 많이 생략하기 위함인데, 0이 연속으로 나오는 게 늘어날수록 Run-Length Coding시에  압축률이 높아지기 때문이다. 

#### 5. 엔트로피 부호화
엔트로피 부호화는 DC를 차분 부호화(및 호프만 부호화)하고 AC를 Run-Length Coding을 하는 과정을 말한다. 이 부호화한 데이터는 전송을 위해 준비하는 데이터이다.

DC의 차분신호는 (SSS, Value)형태로 나타내어 지는데, SSS는 인코딩하는 데 몇 비트를 쓰는지에 관한 사이즈를 의미한다.
Value는 첫번째 블록인 경우 첫번째 블록의 DC값이 들어가고, 두번째 부터는 이전 블록과의 DC의 차이가 Value가 된다.

DC값의 차가 작은 경우가 빈도수가 훨씬 높기 때문에 더 작은 비트를 할당해 준다. (호프만 코딩 방식)

AC의 계수들은 위에서 Run-Length 부호화를 한다고 했다. 지그재그 스캔을 한 것도 이렇게 Run-Length 부호화를 하기 위함이다. 

![]({{ site.url }}/assets/images/multimedia_89.png)
Value가 SSS, Value 정보를 같이 포함하는 것에 유의하자.

![]({{ site.url }}/assets/images/multimedia_90.png)
Skip/SSS에 대한 허프만 코드는 이미 정해져 있는 것이다. 0/3은 100이고, 3/2 는 111110111로 미리 정해져 있는 것이다.
Skip/SSS와 Value를 같이 붙여 최종 비트열을 만들어 전송한다.

#### 예제
다음과 같은 밝기값(Y) 신호 8x8 영상블록에 대하여 JPEG압축 부호화한 압축 비트열을 구해보자. 그리고 한 화소가 8 비트로 표현된다고 가정하면 압축율은 얼마인지 계산해보자. 각 화소에 대한 전처리로 레벨-쉬프트(Level Shift)즉 평균 밝기값 128을 뺀 경우와 그렇지 않은 경우에 대하여 압축율을 비교해보자.(참고로 이전 8x8 영상블록의 DC계수값을 양자화 한 후의 값은 평균 밝기값 128을 뺀 경우는 4이고 그렇지 않은 경우는 52라고 가정하자)
![]({{ site.url }}/assets/images/multimedia_92.png)

#### 풀이
레벨 쉬프트를 한 경우와 하지 않은 경우 이렇게 2가지 경우로 나누어서 풀어야 한다.

먼저 레벨 쉬프트를 한 경우 압축 비트열을 구해보자. 레벨 쉬프트는 픽셀 평균 밝기값인 128을 모든 픽셀에 대해 빼주는 작업이다. 결과는 아래와 같다.

![]({{ site.url }}/assets/images/multimedia_93.png)

위의 결과를 DCT변환하면 아래와 같이 변환된다. 

![]({{ site.url }}/assets/images/multimedia_94.png)

![]({{ site.url }}/assets/images/multimedia_95.png)

위 변화한 DCT를 양자화를 거치면 왼쪽그림과 같이 변하고, 이를 지그재그 스캔하면 오른쪽 그림과 같이 된다. 양자화는 루미넌스 테이블로 각 픽셀 데이터를 나눈 후 반올림 하여 값을 얻는다. 참고로 루미넌스 테이블은 휴리스틱하게 정해진 일련의 데이터다.

DC계수 차분 부호화는 현재 블록 DC에서 이전 블록의 DC의 차이를 이용해 구한다. 현재 DC계수는 6이고 이전 블록 DC계수는 문제에서 4로 주어졌으므로 차분 부호화는 6-4 = 2이다.
DC계수는 (SSS, Value)형태로 나타내야 하는데, SSS는 부호화값을 표현하기 위한 비트수 이고 Value는 부호화 값이므로 허프만 값은 (2, 2) 이고, 이는 (100, 10)이 된다. SSS가 100이 되는 이유는 2가 default 호프만 테이블에서 100으로 나타내어 지기 때문이다. default 허프만 테이블은 다음과 같다.

![]({{ site.url }}/assets/images/multimedia_96.png)

이제 AC비트열를 구해야 한다. AC 계수를 구하기 위해선 지그재그된 코딩을 일렬로 나열해 보아야 한다.
위 지그재그 코딩에서 DC 계수를 제외하고 `[-1, 0, 0, -2, -1, 0, 2, 1, 0, 0, 0, 0, -1, 0, ...]`으로 되어 있다.

차례로 다음과 같이 나타내질 것이다.  

`(0, -1)` // 앞에 0이 1개도 없었으니 Skip = 0, value = -1  
`(2, -2)` // 앞에 0이 2개 있었으니 Skip = 2, value = -2  
`...`  
`(0, 0)` // 이후에 나오는 값은 전부 0 이므로 EOF  

따라서 결과적으로는  
`(0, -1), (2, -2), (0, -1), (1, 2), (0, 1), (4, -1), (0, 0)` 를 얻게 된다.

AC에서 Skip은 사실 Skip/SSS와 같다. 즉 (0, -1)의 0은 -1을 표현하는 데 1비트 필요하므로 0/1로 나타내어 진다. 마찬가지로 (2, -2)의 2 역시 2/2로 나타내어 질 것이다. 0/1 이나 2/2 로 바꿔주는 이유는 허프만 테이블을 참고하기 위해서이다. 결과적으로 우리는 다음과 같은 표를 만들 수 있다.

![]({{ site.url }}/assets/images/multimedia_97.png)

따라서 AC계수의 압축 비트열을 모두 모으면 `000 1111100001 000 11100110 001 1110110 1010` 가 된다. 원래 8x64 로 512 비트였던 압축 전 이미지가 DC계수 비트수 + AC 계수 비트수인 43으로 압축되었으므로 11.91 배의 압축효과가 있었다고 말할 수 있다.

128만큼 레벨 쉬프트를 한 경우를 생각해 보자. DCT를 거치면 아래와 같이 변환될 것이다.

![]({{ site.url }}/assets/images/multimedia_98.png)

위 결과를 양자화 시킨 후, 지그재그 스캔을 하면 다음과 같을 것이다.

![]({{ site.url }}/assets/images/multimedia_99.png)

문제에서 레벨 쉬프트를 하지 않은 경우 이전 블록의 DC 계수가 52라고 했으므로 차분 부호화된 DC 값은 60 - 52 = 8 이 될 것이다.
즉 `(SSS, Value) = (3, 8) = (101, 1000) = 10110000` 이 된다.

AC 역시 `(0, -2), (2, -2), (0, -1), (1, 2), (0, 1), (4, -1), (0, 0)` 이므로 아래 허프만 테이블을 참조하여 

![]({{ site.url }}/assets/images/multimedia_100.png)

`0101 1111100001 000 11100110 001 1110110 1010`의 비트열을 얻게 된다. 압축률을 계산하면 512/46 이 되므로 11.13배의 압축효과를 얻었다고 말할 수 있다.


### JPEG의 모드
4가지 모드가 있다.
- Sequential mode : Default이고, 왼쪽에서 오른쪽으로, 위부터 아래로 진행되는 한번의 스캔으로 정보를 제공
- Progressive mode : 저화질 버전으로부터 순차적으로 고화질로 진행하기 위한 정보를 제공
- Hierarchical mode : 저해상도 버전을 압축하고 순차적으로 고해상도버전을 위한 정보를 제공
- Lossless mode : JPEG-LS가 이 방식을 쓴다.

##### JPEG Progressive mode
아래 이미지로 정리가 된다.
![]({{ site.url }}/assets/images/multimedia_64.png)
DC ~ AC63까지가 데이터 블록 하나이다. 각 칸은 비트열로 이루어져 있다. 빨간 선은 비트열을 자르는 것이다.

2가지 모드가 있다. 빨간선으로 자르는 모드와, 파란선으로 자르는 모드다.

파란선으로 자르는 모드는 `Spectral Seclection`이라 한다.

빨간선으로 자르는 모드는 `Successive Approximation`이라 한다.

Progressive mode는 몇 번의 패스를 통해 점진적으로 질적 향상된 영상을 가져온다.


##### JPEG Hierarchical mode
progressive와 유사하게 점진적으로 질적 향상을 가져온다. Low-pass 필터를 적용한 이미지들과 같은 저해상도 토대 이미지를 먼저 받아온 뒤 상세 정보를 나중에 받아서 질적 향상을 꾀하는 것이다.

![]({{ site.url }}/assets/images/multimedia_91.png)

3단계 계층모드를 살펴보면

맨 처음 이미지를 가로, 세로 1/4로 줄인 이미지와, 1/2로 줄인 이미지와 원본 이미지를 준비한다. 
1/4로 샘플링 한 이미지를 디코딩하여 값을 구한다. 
1/2이미지와 1/4이미지를 가로, 세로 2배로 늘린 이미지의 차이를 디코딩하고
원본 이미지와 1/2이미지를 가로, 세로 2배로 늘린 이미지의 차이를 디코딩한다.

맨 처음 구했던 1/4 샘플링 이미지와 그 다음 계층에서 구했던 차이를 전부 합해 원본 이미지를 다시 복원한다.

단점은 연산량이 너무 많다는 것이다.

#### 6. 프레임 빌딩

![]({{ site.url }}/assets/images/multimedia_65.png)

Frame안에서는... 

Tables에는 양자화 테이블(Y, CbCr), 호프만 테이블 등이 들어간다.
Header에는 Color정보, 크로마 서브 샘플링 방법에 대한 정보가 들어간다.
Scan은 이미지 스캔이 들어간다. 시퀀셜일 경우 Scan은 1번

Scan안에서는...

Tables는 각자 스캔별로 Table을 포함한다. 프레임에서 쓰이는 Table과 스캔본에서 쓰이는 Table이 다른 경우가 있다.
Segment, Restart형식으로 반복된다.

Segment는 블록들로 구성되어 있다.
Restart Flag는 오류 검출 용으로 사용된다.

여기까지 진행되면 JPEG 부호화가 완료된 것이다. 부호화가 완료되었으니 이제 복호화를 해야 한다.

#### JPEG 복호화
부호화 과정의 역순이다. 다만 압축 비트스트림을 복호화하는 과정에서 전치정리(Prefix Property)가 만족되어야 복호가 가능하다.
전치 정리란 짧은 비트의 코드는 길이가 더 긴 코드의 앞부분과 일치해서는 안 된다는 성질을 말한다. 예를 들어, 심볼 A가 01로 코드화 되었다면 다른 어떤 심볼도 01로 시작되는 코드로 부호화되어서는 안된다.


# 9장. 동영상 압축
영상 프레임마다의 차이를 가지고 부호화를 한다면 압축률이 높아지지 않을까 하는 아이디어에서 비롯됐다.
한 장 한 장 프레임마다 중복되는 비트가 많기 때문이다.

`Temporal reducdancy`는 위와 같이 공통된 비트를 가지는 성질을 이야기 한다.

비디오 압축은 `Motion Compensation(MC)`에 기반하여 진행되는데, 다음 3가지 방식을 따른다.
1. Motion Estimation
2. MC-based Prediction
3. Derivation of the prediction error(차이)

### Motion Compensation
이미지를 매크로 블락(NxN, default N=16px)으로 쪼개서 Motion Estimation을 한다. 움직임을 나타내는 정보를 Motion Vector 라고 한다. 이 Motion Vector는 매크로 블락 단위로 하나씩 나온다. Target 매크로 블락과 Reference 매크로 블락의 위치 차이가 바로 MV가 된다. Motion Vector로 움직인 매크로 블락의 차이를 구하는 것이 바로 Motion Compensation이다. 
Reference가 미래의 매크로 블락인지, 과거의 매크로 블락인지에 따라 다음 두 가지 방식이 있다.
- forward prediction: 순방향, 과거의 프레임으로 현재 프레임 예측
- backword prediction: 역방향, 미래에 나올 프레임으로 현재 프레임 예측

![]({{ site.url }}/assets/images/multimedia_66.png)

Search Window 사이즈는 2p+1 x 2p+1인데 그 이유는 어떤 (i,j)를 기준으로 양쪽에 p만큼을 찾기 때문이다.
MV를 구하기 위해 MAD(Mean Absolute Difference)방식을 사용한다. 

![]({{ site.url }}/assets/images/multimedia_67.png)

MAD 값이 가장 작아지는 i, j를 찾으면 그것이 바로 MV가 된다.

Motion Vector은 매크로 블락단위로 하나씩 나온다고 했는데, 이 블락단위를 주먹 구구식으로 모든 픽셀에 대해 비교해서 구하는 방식을 Full Search혹은 Sequential Search라고 한다. 하지만 이 방법은 연산량이 매우 많다. 

그래서 나온 방식이 Logarithmic Search이다. 몽땅 다 연산해 MAD를 가장 작게 만드는 값보단 적당히 MAD를 작게 만드는 값을 찾는 방식이다. 자료구조로 따지면 바이너리 서치트리와 비슷하다 하겠다. 아래 이미지를 보자.

![]({{ site.url }}/assets/images/multimedia_68.png)

색이 칠해진 부분이 각 단계에서 MAD가 최소인 부분이다. 1, 2, 3 순서대로 국소점을 찾는다.  찾는 범위를 반절씩 줄여가면서 그야말로 대강 찾는 것이다.

Hierarchical Search는 아래 사진으로 보면 된다.

![]({{ site.url }}/assets/images/multimedia_69.png)

해상도를 일부러 낮춰서 Modtion Estimation을 한 뒤 해상도를 복원시켜 그 위치 주변에서 Motion Vector를 찾는다.

### 동영상 압축 전처리 과정
- 컬러 모델 변환
- 필터링, 스무딩 스무딩은 이미지 상에 얇은 선이 샘플링을 거치면 없어지는 경우가 있는데, 이를 막아주기 위해 해준다. 연필로 그어진 선을 손으로 비벼서 더 넓은 선으로 만들어 준 뒤 샘플링을 한다고 이해해도 좋다.
- 컬러 부표본화(Color Subsampling)

### 화면내 부호화와 화면간 부호화 (Intra, Inter mode Coding)
- Intra mode 부호화
화면내 라는 건 다른 화면과의 비교를 안한다는 것이다. 즉 정지 영상과 다를 바가 없으므로 JPEG와 압축방법이 거의 같다. 거의 같다는 건 부분적으로 달라질 수 있음을 의미하는데, 양자화나 칼라 테이블등이 변경 될 수는 있다.
이렇게 화면 내 부호화 방식으로 압축되는 화면을 I-프레임 이라고 한다.

- Inter mode 부호화
과거 혹은 미래의 프레임을 참조하여 예측 압축방식으로 부호화하는 것을 의미한다. 이렇게 화면 간 부호화 방식으로 압축되는 화면을 P-프레임(Predictive)과 B-프레임(Bidirectional)이라 한다.

### 부호화 프레임의 종류
- GOP : Group Of Picture
I-프레임으로 시작하는 연속적인 화상들의 집합이고, I, B, P 프레임을 모두 포함한다. 

I-프레임은 독립된 영상으로 압축/ 복호된다. 또, 임의 접근(Random Access)를 위해서는 I-프레임이 필요하다. 상대적으로 압축률이 낮은 특징이 있다.

P-프레임같은 경우에는 독립적이지 않아서 디코딩하기 위해서 앞에 미리 배치되어 있는 I-프레임 혹은 P-프레임이 미리 디코딩이 되어 있어야 한다. 

B-프레임같은 경우에는 이 전의 프레임 뿐만 아니라 이 후의 I또는 P프레임을 참조해서 부호화하는 프레임으로, 압축 성능이 가장 뛰어나다. 그 대신 계산 시간과 복잡도가 가장 높다. 한 메크로 블락에 Motion Vector가 2개 들어간다.

### 부호화, 복호화 재생 시 화면 처리 순서

![]({{ site.url }}/assets/images/multimedia_102.png)

B-프레임은 전, 후 프레임을 모두 참조하기 때문에 이렇게 화면이 처리된다. 즉, I, P, B프레임 순으로 처리된다고 보면 된다.

### H.261
오류 정정 부호를 추가하여 전송오류를 정정하는 전송 부호기 및 전송 복호기가 표준으로 정해져 있다. 오류 정정 부호는 헤밍코드의 even 체크섬을 떠올리면 된다. H.261에서 매크로 블락 단위는 가로 세로 16 픽셀이다. 크로마 샘플링이 적용되었으므로 8x8 Y블락 4개, Cb블락 1개, Cr블락 1개로 구성된다. 가로 매크로 블락 11개, 세로 3개를 모아 매크로 블락 33개로 구성하는데 이를 GOB라고 부른다. CIF영상 형식에서는 GOB 1~12가 들어가지만 QCIF에서는 GOB 1, 3, 5가 들어간다. QCIF는 1/4로 쪼갠 것이기 때문이다. 이것을 그림으로 표현한 것이 바로 아래 그림이다.

![]({{ site.url }}/assets/images/multimedia_71.png)

Intra 모드에서는 아래와 같이 부호화가 진행된다.

![]({{ site.url }}/assets/images/multimedia_72.png)

Inter 모드에서는 아래와 같이 부호화가 진행된다. H.261에서는 B프레임은 쓰지 않는다. H.261은 영상통화를 위해 나온 표준이기 때문이다. B프레임은 연산량이 많아서 속도가 느려지기 때문에 쓰지 않는다.

![]({{ site.url }}/assets/images/multimedia_73.png)

이 방식은 압축률이 높다. 즉 bit rate가 낮다. bit rate는 이미지 한 장당 몇 비트를 잡아먹느냐에 관한 수치다.

jpeg에서는 양자화테이블을 이용하여 양자화를 하지만, H.261에서는 양자화테이블을 사용하지 않는다. jpeg에서는 저주파와 고주파영역을 다르게 양자화를 적용하기 위해서 양자화 테이블을 필요했던 것인데, H.261에서는 이에 차별을 두지 않기 때문이다. 

![]({{ site.url }}/assets/images/multimedia_74.png)

여기서 step_size는 2부터 62까지의 31개 짝수 중 한 값을 가지고 있을 수 있지만, DC계수에서는 예외적으로 8로 고정된다.
step_size가 작아지면 양자화 노이즈는 작아지지만 bit rate는 올라간다.
scale은 이 bit rate를 조정하기 위해 사용된다.
아래 인코더 그림에서 부호화제어기는 출력버퍼를 모니터링 하고 있다가, 만약 bit rate가 안좋다 싶으면 scale을 조정한다. 즉, 이 bit rate를 맞춰줄 수 있는 상한에서는 가능한 scale값을 크게 잡는 것이다. 

![]({{ site.url }}/assets/images/multimedia_75.png)

부호화 제어기는 Inter, Intra모드를 결정하는 역할도 한다. 중간 중간 I 프레임을 삽입해야 하기 때문이다. 하지만 위 그림에서는 이상한 점이 있다. 프레임 메모리가 왜 필요할까? 그냥 입력영상을 움직임 예측 모듈에 바로 넣을 수도 있을 텐데, 그림에서는 DCT, 양자화, 역 양자화, Inverse DCT를 거친 후에 움직임 예측 모듈에 집어 넣는다. 왜 굳이 이렇게 비효율 적인 작업을 하는 걸까? 사실 이는 당연한 것인데, 움직임 예측 모델을 보면 Input이 두 개이다. 입력 영상과 플레시 메모리에 있는 I frame이다. 그래야 움직임을 예측할 수 있기 때문이다. 그말인 즉슨, 바로 직전 I frame을 넣어야 모션 벡터를 구할 수 있기 때문에 굳이 저 과정을 거치는 것이다. 또, 복호화를 할 때는 입력 영상이 없고 결과적으로 받는 영상은 양자화를 거쳐 손실된 영상이므로 프레임 메모리에서 레퍼런스 프레임을 사용하는데, 인코더와 디코더가 이를 맞춰주어야 하기 때문인 것도 이유이다. 

아래는 디코더 그림이다.

![]({{ site.url }}/assets/images/multimedia_76.png)

디코더에서는 엔트로피 복호화를 거쳐서 프레임 메모리에다 프레임을 저장하지만, 인코더에서는 프레임을 저장할 때 엔트로피 부호화를 거치지 않는다. 이는 엔트로피 부호화는 무손실이기 때문에 굳이 안해도 상관없기 때문이다. 
H.261에서는 bit rate는 CIF의 경우 256 kbps, QCIF의 경우 64kbps이하로 정해져 있다.

H.261 비트 스트림 구조는 아래와 같다.

![]({{ site.url }}/assets/images/multimedia_77.png)

### H.263
64kbps이하의 저 전송률 영상 통신을 위한 영상 부호화 표준으로 제시되었다. 기본적으로 H.261기법을 기반으로 하고 있고, 여러 개선 방법을 사용하여 성능을 향상시켰다. 그 차이점을 여기서 알아볼 것이다.

우선 H.261에서는 화소단위(pixel)의 정밀도에 비해 H.263은 반화소(sub-pixel)단위의 정밀도를 갖는 움직임 예측 및 보상을 수행한다. 또, H.261의 비트열 구조의 일부분이 선택사항이 됨으로써 저전송률 또는 향상된 오류 복원이 가능해졌다. 마지막으로, 선택적으로 비제한적 움직임 벡터, 조건부 산술 부호화, 고급 예측 그리고 PB-Frame을 사용하였다.

GOB도 H.261에 비해 바뀌었는데, 고정된 사이즈였던 GOB가 고정되지 않도록 바뀌었다. 이는 Sub-QCIF, QCIF, CIF 의 GOB사이즈가 모두 다르다는 뜻이다.

### MPEG (Motion Picture Expert Group)
MPEG라는 표준이 나오게 된 이유는 H.261이 응용되는 분야(통신분야)와 MPEG가 응용되는 분야(저장 미디어용)가 다르기 때문이다.

MPEG-1 부호화 기법의 기본 요건
- 임의 접근성
- 편집 가능성
- 고속 순방향 탐색, 역방향 탐색 및 역방향 재생
- 영상 - 음성 동기화
- 부호화, 복호화 지연
- 형태의 유연성

### MPEG-2
4Mbps이상의 high data rate에서 고화질의 영상을 제공하는 걸 목표로 하고 있다. profiles와 level의 개념이 도입됐다. 7개의 profiles와 4개의 level이  정의되어 있는데, Profiles는 Simple, Main, SNR scalable, Spatially scalable, High, 4:2:2, Multiview 이고, Level은 High, High1440, Main, Low이다.

![]({{ site.url }}/assets/images/multimedia_81.png)

MPEG-2는 디지털 영상이 나오기 전 TV방송을 타깃으로 만들어 졌기 때문에 Interlaced 방식을 지원한다. 

예측에는 5가지 방식을 사용한다. 
1. Frame Prediction for Frame-pictures
2. Field Prediction for Field-pictures
3. Field Prediction for Frame-pictures
4. 16×8 MC for Field-pictures
5. Dual-Prime for P-pictures













본문은 건국대학교 멀티미디어 공학개론 수업의 내용을 필기한 것입니다.

읽느라 고생하셨습니다.



