---
layout: post
title: 게임판 덮기 문제 2 (BOARDCOVER2, 난이도 하)
category: [online-judge]
author: hyungsun
image:
---

## Prologue

------
종만북에 등장하는 난이도 (하)짜리 문제 중 9번째로 등장하는 BOARDCOVER2 문제를 풀어보았다. 

## Monologue

------

### 1. 문제

문제는 다음과 같다.

> #### 문제
>
> H×W 크기의 게임판과 한 가지 모양의 블록이 여러 개 있습니다. 게임판에 가능한 많은 블록을 올려놓고 싶은데, 게임판은 검은 칸과 흰 칸으로 구성된 격자 모양을 하고 있으며 이 중에서 흰 칸에만 블록을 올려놓을 수 있습니다. 이때 블록들은 자유롭게 회전해서 놓을 수 있지만, 서로 겹치거나, 격자에 어긋나게 덮거나, 검은 칸을 덮거나, 게임판 밖으로 나가서는 안 됩니다.
>
> ![img](http://algospot.com/media/judge-attachments/556e7cbd2262a90832a95e0106df50bd/boardcover2.png)
>
> 위 그림은 예제 게임판과 L 자 모양의 블록으로 이 게임판을 덮는 방법을 보여줍니다. 게임판에는 15개의 흰 칸이 있고, 한 블록은 네 칸을 차지하기 때문에 그림과 같이 최대 세 개의 블록을 올려놓을 수 있지요. 게임판과 블록의 모양이 주어질 때 최대 몇 개의 블록을 올려놓을 수 있는지 판단하는 프로그램을 작성하세요.
>
> #### 입력
>
> 입력의 첫 줄에는 테스트 케이스의 수 T (T≤100)가 주어집니다. 각 테스트 케이스의 첫 줄에는 게임판의 크기 H, W (1≤H, W≤10), 그리고 블록의 모양을 나타내는 격자의 크기 R, C (1≤R, C≤10)가 주어집니다. 다음 H줄에는 각각 W 글자의 문자열로 게임판의 정보가 주어집니다. 문자열의 각 글자는 게임판의 한 칸을 나타내며, #은 검은 칸, 마침표는 흰 칸을 의미합니다. 다음 R줄에는 각 C 글자의 문자열로 블록의 모양이 주어집니다. 이 문자열에서 #은 블록의 일부, 마침표는 빈 칸을 나타냅니다.
>
> 각 게임판에는 최대 50개의 흰 칸이 있으며, 각 블록은 3개 이상 10개 이하의 칸들로 구성됩니다. 변을 맞대고 있는 두 변이 서로 연결되어 있다고 할 때, 블록을 구성하는 모든 칸들은 서로 직접적 혹은 간접적으로 연결되어 있습니다.
>
> #### 출력
>
> 각 테스트 케이스마다 게임판에 놓을 수 있는 최대의 블록 수를 출력합니다.

문제가 난이도 (하)라는 게 절망적으로 느껴질 만큼 시간도 오래 걸리고, 머리도 많이 굴렸다. 그것으로도 모자라서 결국에는 해답까지 봐버렸다. BOARDCOVER2는 나로 하여금 고민해도 답이 안나와서 해답을 보게 만든 첫 번째 문제다. 난이도 (하)중에서는 없길 바랬는데...

우선, BOARDCOVER 때도 그랬지만 블록을 채우기 위해 미리 회전된 블록들을 준비해 놓는 단계가 중요하다.

**중요하다**라고 포인트를 짚는 이유는, 이 부분을 생각하기로는 여러가지 방법이 가능한데, 그 중 한 가지 방법만을 제외하고 는 진짜 코드를 엄청나게 복잡하게 만들기 때문이다.

그 한 가지 방법이란, 블록의 (0, 0)을 항상 지나도록 회전된 블록이 상대좌표를 갖게끔 만드는 것이다. 이렇게 하지 않으면 중복에 대한 예외처리를 하느라 흰머리가 나도록 고민해야 한다. 이는 (0, 0)이 채워진다는 보장이 없기 때문인데, for문을 돌면서 블록을 채우는데 해당 커서가 채워지지 않는다면 그 다음 줄에서 해당 커서를 채울 수 있는지까지 확인을 해야 할 뿐만 아니라, 위에서 채웠던 블록을 밑에 줄에서 같은 블록 모양으로 채울 수도 있기 때문에 예외처리도 복잡해진다. 어찌되었든, 뭔가를 채우는 문제는 이런 식으로 접근하는 게 맞는것 같고 아예 외우는 게 낫겠다 싶었다.

### 2. 아이디어 구현
아래 코드는 핵심적인 부분만 따온 것이고, 전체 소스 코드는 [여기에](https://github.com/poqw/JongmanBookSolutions/blob/master/poqw/BoardCover2.java) 올려 두었다. 
```java
  
  private static void coverBoard(int placedBlockNum) {
    Pair<Integer, Integer> cursor = findFirstEmptySpace();
    if (cursor == null) {
      bestCase = Math.max(placedBlockNum, bestCase);
      return;
    }

    // Pruning.
    int blockSize = block.rotates.get(0).size();
    if (placedBlockNum + (getNumberOfEmptySpaces() / blockSize) <= bestCase) {
      return;
    }

    for (int i = 0; i < block.rotates.size(); i++) {
      if (canPutBlock(cursor.getKey(), cursor.getValue(), i)) {
        handleBlock(cursor.getKey(), cursor.getValue(), i, true);
        coverBoard(placedBlockNum + 1);
        handleBlock(cursor.getKey(), cursor.getValue(), i, false);
      }
    }

    board[cursor.getKey()][cursor.getValue()] = '#';
    coverBoard(placedBlockNum);
    board[cursor.getKey()][cursor.getValue()] = '.';
  }

  private static Pair<Integer, Integer> findFirstEmptySpace() {
    for (int i = 0; i < boardHeight; i++) {
      for (int j = 0; j < boardWidth; j++) {
        if (board[i][j] == '.') {
          return new Pair<>(i, j);
        }
      }
    }

    return null;
  }

  private static int getNumberOfEmptySpaces() {
    int size = 0;
    for (int i = 0; i < boardHeight; i++) {
      for (int j = 0; j < boardWidth; j++) {
        if (board[i][j] == '.') {
          size++;
        }
      }
    }

    return size;
  }

  private static boolean canPutBlock(int y, int x, int rotateMode) {
    for (Pair<Integer, Integer> pair : block.rotates.get(rotateMode)) {
      int cursorY = y + pair.getKey();
      int cursorX = x + pair.getValue();
      if (cursorX < 0 
          || cursorY < 0 
          || cursorX >= boardWidth 
          || cursorY >= boardHeight
          || board[cursorY][cursorX] == '#') {
        return false;
      }
    }

    return true;
  }

  private static void handleBlock(int y, int x, int rotateMode, boolean put) {
    char changeTo = '.';
    if (put) {
      changeTo = '#';
    }

    for (Pair<Integer, Integer> pair : block.rotates.get(rotateMode)) {
      board[y + pair.getKey()][x + pair.getValue()] = changeTo;
    }
  }
```

아래는 따로 만들어둔 `Block` 클래스이다.
```java
private static class Block {

    /**
     * Rotate mode. 0: 0 degree, 1: 90 degree, 2: 180 degree, 3: 240 degree rotate clockwise.
     */
    private static int NUM_ROTATE_MODE = 4;
    private int blockBoardSize;
    ArrayList<ArrayList<Pair<Integer, Integer>>> rotates = new ArrayList<>();

    Block(int height, int width, char[][] block) {
      char[][] blockToRotate = block;
      int offsetX = -1;
      int offsetY = -1;
      blockBoardSize = Math.max(width, height);

      for (int i = 0; i < NUM_ROTATE_MODE; i++) {
        rotates.add(new ArrayList<>());
        for (int j = 0; j < blockBoardSize; j++) {
          for (int k = 0; k < blockBoardSize; k++) {
            if (blockToRotate[j][k] == '#') {
              if (offsetX == -1) {
                offsetX = k;
                offsetY = j;
              }

              rotates.get(i).add(new Pair<>(j - offsetY, k - offsetX));
            }
          }
        }

        blockToRotate = rotateBlock(blockToRotate, blockBoardSize);
        offsetX = -1;
        offsetY = -1;
      }
    }

    /**
     * Rotate input block as clockwise for 90 degree.
     */
    private char[][] rotateBlock(char[][] block, int blockSize) {
      char[][] rotatedBlock = new char[blockSize][blockSize];
      for (int i = 0; i < blockSize; i++) {
        for (int j = 0; j < blockSize; j++) {
          rotatedBlock[i][j] = block[blockSize - j - 1][i];
        }
      }
      return rotatedBlock;
    }
  }
```

### 3. 풀이

우선 `Block` 클래스의 역할은 사전 준비다.

블럭에 대한 입력이 들어오면 해당 블록을 0, 90, 180, 240도로 회전시킨 모양의 상대 좌표를 담고 있는 객체를 만들어 준다. 상대 좌표를 계산하여 회전 후 어떤 모양이 되었든 블록은 (0, 0)을 항상 포함한다.

그리고 `coverBoard()`의 재귀 분귀 흐름이 헷갈릴 수 있으므로 여길 위주로 설명하겠다.

제일 먼저 좌상단에서 비어있는 공간을 찾는데, 이 공간이 없으면 보드에 블록이 모두 채워진 것이므로 리턴한다. 만약 그렇지 않은 경우, 가지치기(Pruning)을 통해 현재 보드 판에서 **아무리 잘해봐야 몇 개를 쌓을 수 있나** 를 계산하여 베스트 케이스보다 같거나 적다면 아예 재귀를 타지 않는다. 이를 계산하는 방법은 간단한데, 남은 빈 공간을 블록이 포함한 `#` 의 개수로 나눈 뒤 현재 놓은 블록 수를 더해주면 된다.

잘 하면 베스트 케이스를 넘을 수도 있겠다는 판단이 선 경우, 본격적으로 재귀를 타는데 블록을 놓을 수 있으면 놓고, 없으면 그냥 한 칸 채워서 더 이상 그 곳에는 블럭을 놓지 않도록 마킹한다.

블록을 놓을 수 있을 때 여러 회전 모양 형태로 놓을 수 있는 경우 전부 다 재귀를 타도록 한다. 

## Epilogue

------

코딩 잘하고 싶다. 그 뿐이다.