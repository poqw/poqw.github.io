---
layout: post
title: 쿼드 트리 뒤집기 (QUADTREE, 난이도 하)
category: [online-judge]
author: hyungsun
image: assets/images/JM_QUADTREE.png
---

## Prologue

------
종만북에 등장하는 난이도 (하)짜리 문제 중 3번째로 등장하는 QUADTREE 문제를 풀어보았다.

## Monologue

------

### 1. 문제

쿼드트리 뒤집기 문제는 다음과 같다.

> ![]({{ site.url }}/assets/images/JM_QUADTREE.png)
>
> 대량의 좌표 데이터를 메모리 안에 압축해 저장하기 위해 사용하는 여러 기법 중 쿼드 트리(quad tree)란 것이 있습니다. 주어진 공간을 항상 4개로 분할해 재귀적으로 표현하기 때문에 쿼드 트리라는 이름이 붙었는데, 이의 유명한 사용처 중 하나는 검은 색과 흰 색밖에 없는 흑백 그림을 압축해 표현하는 것입니다. 쿼드 트리는 2N × 2N 크기의 흑백 그림을 다음과 같은 과정을 거쳐 문자열로 압축합니다.
>
> - 이 그림의 모든 픽셀이 검은 색일 경우 이 그림의 쿼드 트리 압축 결과는 그림의 크기에 관계없이 `b`가 됩니다.
> - 이 그림의 모든 픽셀이 흰 색일 경우 이 그림의 쿼드 트리 압축 결과는 그림의 크기에 관계없이 `w`가 됩니다.
> - 모든 픽셀이 같은 색이 아니라면, 쿼드 트리는 이 그림을 가로 세로로 각각 2등분해 4개의 조각으로 쪼갠 뒤 각각을 쿼드 트리 압축합니다. 이때 전체 그림의 압축 결과는 `x`(왼쪽 위 부분의 압축 결과)(오른쪽 위 부분의 압축 결과)(왼쪽 아래 부분의 압축 결과)(오른쪽 아래 부분의 압축 결과)가 됩니다. 예를 들어 그림 (a)의 왼쪽 위 4분면은 `xwwwb`로 압축됩니다.
>
> 그림 (a)와 그림 (b)는 16×16 크기의 예제 그림을 쿼드 트리가 어떻게 분할해 압축하는지를 보여줍니다. 이때 전체 그림의 압축 결과는 `xxwww bxwxw bbbww xxxww bbbww wwbb`가 됩니다.
>
> 쿼드 트리로 압축된 흑백 그림이 주어졌을 때, 이 그림을 상하로 뒤집은 그림 을 쿼드 트리 압축해서 출력하는 프로그램을 작성하세요.
>
> #### 입력
>
> 첫 줄에 테스트 케이스의 개수 C (C≤50)가 주어집니다. 그 후 C줄에 하나씩 쿼드 트리로 압축한 그림이 주어집니다. 모든 문자열의 길이는 1,000 이하이며, 원본 그림의 크기는 220 × 220 을 넘지 않습니다.
>
> #### 출력
>
> 각 테스트 케이스당 한 줄에 주어진 그림을 상하로 뒤집은 결과를 쿼드 트리 압축해서 출력합니다.

아 이거 파이썬으로 풀면 진짜 쉬울텐데.... 라는 생각부터 들었다. 하지만 일전에 이야기 했던 것처럼 파이썬 같은 치트키는 쓰지 않기로 한 까닭에, 이번에도 역시 C++로 풀이를 하게 되었다. 나는 IDE로 Jetbrain의 CLion을 쓰고 있는데, 공교롭게도 30일 무료 버전이다. 볼 때마다 마음에 안드니 나중에 라이센스 만료되면 짱짱 코틀린으로 풀어야지. 코틀린도 치트급 언어긴 하지만.... 사실 군대 가기 전에 Jetbrain 에서 제공해주는 대학생 라이센스를 등록해놨는데, 제대하고 보니 만료되어 있었다. 나란 놈 정말 한 치 앞도 볼 줄 모르는 모양이다.

문제가 난이도에 비해 복잡하게 적혀있는 탓에, 내용은 대충 둘러 보고 곧바로 예제를 보다보면 금방 이해가 된다. '입력받은 문자열이 `x`를 만나면 자식이 4개 달린 트리를 만든다'를 빠르게 캐치했다면, 그 뒤는 일사천리다.

가령 아래와 같은 인풋이 들어왔다면,

`xxwww bxwxw bbbww xxxww bbbww wwbb`

이는 다시 아래처럼 표현할 수 있고, 

`x=[x=[w,w,w,b],x=[w,x=[w,b,b,b],w,w],x=[x=[x=[w,w,b,b],b,w,w],w,w,b],b]`

`x=`을 모두 없애면

`[[w,w,w,b],[w,[w,b,b,b],w,w],[[[w,w,b,b],b,w,w],w,w,b],b]`

이렇게 된다. 여기서 왜 파이썬으로 풀면 쉬운지 알아챘을 것이다. 배열안에 배열을 집어넣는 게 파이썬에서는 매우 간단히 구현되기 때문이다.

이걸 이제 상하로 뒤집으면 되는데, 그 말은 1사분면을 3사분면과 바꾸고, 2사분면을 4사분면과 바꾸면 된다는 뜻이므로 재귀적으로 풀어낼 수 있겠다는 생각을 하고 들어갔다.

### 2. 문제 풀이
아래 코드는 핵심적인 부분만 따온 것이고, 주석을 포함한 전체 소스 코드는 [여기에](https://github.com/poqw/JongmanBookSolutions/blob/master/poqw/quadTree.cpp) 올려 두었다.
```cpp
unsigned long getQuadTreeSizeFrom(string quadTree) {
  int goal = 0;
  unsigned long size = 0;
  for (char c : quadTree) {
    size++;
    if (c == 'x') {
      goal += 4;
    }

    if (goal == 0) {
      return size;
    }

    goal--;
  }

  throw invalid_argument("Invalid tree: " + quadTree);
}

string reverseQuadTree(string quadTree) {
  if (quadTree == "w" || quadTree == "b") {
    return quadTree;
  }

  string nodesString;
  unsigned long index = 0, size = 0;
  if (quadTree[0] == 'x') {
    nodesString = quadTree.substr(1);
  } else {
    nodesString = quadTree;
  }

  size = getQuadTreeSizeFrom(nodesString);
  string quadrant1 = reverseQuadTree(nodesString.substr(index, size));

  index += size;
  size = getQuadTreeSizeFrom(nodesString.substr(index));
  string quadrant2 = reverseQuadTree(nodesString.substr(index, size));

  index += size;
  size = getQuadTreeSizeFrom(nodesString.substr(index));
  string quadrant3 = reverseQuadTree(nodesString.substr(index, size));

  index += size;
  size = getQuadTreeSizeFrom(nodesString.substr(index));
  string quadrant4 = reverseQuadTree(nodesString.substr(index, size));

  string result = quadrant3 + quadrant4 + quadrant1 + quadrant2;
  if (quadTree[0] == 'x') {
    result = quadTree[0] + result;
  }

  return result;
}
```

### 풀이

파이썬처럼 배열을 능수능란하게 다루는 게 C++에서는 상당히 까다롭기 때문에, 그냥 문자열을 통째로 옮기면 되지 않나 하는 생각에서 `getQuadTreeSizeFrom`를 만들었다. 이 함수는 인풋으로 받은 문자열의 가장 최상위 노드를 찾아, 그 하위 노드들의 사이즈를 전부 합한 값을 구하는 함수인데, 옮겨야 할 문자열의 길이가 트리가 어떻게 생겼는지에 따라 다르기 때문에 필요성을 느껴 만들었다.

이 함수를 적절히 사용해 가며 트리를 뒤집어 주는 함수가 바로 `reverseQuadTree`이다. 코드가 직관적으로 작성되어 있기 때문에 예시만 들어 설명을 하겠다. 가령 `xbwxwbbwb` 와 같은 인풋이 있다고 했을 때, 다음과 같이 동작한다.

```cpp
// Step 1. 맨 앞의 x 를 제거한다.
bwxwbbwb

// Step 2. 각 노드 사이즈 별로 얼마나 옮겨야 할 지를 정한다
b + w + xwbbw + b

// Step 3. 각 문자열에 재귀적으로 다시 reverseQuadTree를 호출하고, 상하로 뒤집기 위해 옮겨준다.
reverse(xwbbw) + reverse(b) + reverse(b) + reverse(w)
    
// Step 4. 제거했던 x 를 다시 붙여준다.
x + reverse(xwbbw) + b + b + w
```

### 개선점

로직과 코드가 워낙 간단해서 개선점을 찾지 못했다. 다른 할 일이 많아 신경을 다소 못 쓴 것도 사실이지만....

문자열을 받자마자 바로 쿼드트리를 뒤집어 주는 방식이 가능하려나? 잘 모르겠다.

## Epilogue

------

문제만 보고는 어려울 것이라 생각했는데 풀고보니 그리 어렵지 않았다. 이번 주에는 할 일이 많아 매주 하는 알고리즘 문제 풀이가 살짝 부담스러웠는데, 다행히 쉬운 문제라 금방 풀려 운이 좋았다고 생각한다. 얼른 다른 거 하러 가야지.