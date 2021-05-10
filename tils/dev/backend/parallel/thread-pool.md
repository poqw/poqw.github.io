# ThreadPool

## Overview

아래 이미지에서 동작 원리를 파악해볼 수 있다.

[![](https://img1.daumcdn.net/thumb/R720x0.q80/?scode=mtistory2&fname=http%3A%2F%2Fcfile5.uf.tistory.com%2Fimage%2F231B374B595F67F43A2190)](https://limkydev.tistory.com/55)

Thread는 생성과 수거에 비용이 많이 드니 미리 Thread들을 만들어서 처리할 수 있도록 ThreadPool을 사용한다.
Application은 구현에 따라 결과값을 전달 받을 수도, 혹은 단순히 병렬로 실행만 시킬 수도 있다.
