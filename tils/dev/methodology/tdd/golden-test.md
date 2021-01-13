# Golden test

![](https://responsive.fxempire.com/v7/_fxempire_/2020/12/Gold-11-2.jpg?func=cover&q70&width=400)


## Overview

Golden test는 Unit test의 일종으로, 분리된 정답 파일(`golden file` 이라고 부른다.)으로 실제 값과 비교해보는 테스트를 의미한다.
정답 파일이 여러개라면 디렉토리로 묶고, 이름은 보통 `golden-set` 으로 짓는 경우가 많다.
굳이 Unit test와 비교하는 이유는 unit test에 비해 때떄로 장점을 가지는 경우가 있기 때문이다.

1. 테스트하는 단위의 출력이 매우 큰 경우 기대 출력을 소스코드에 전부 써넣는 것은 비효율적이다.
2. Quotes 나 Binary data를 escape 하는 수고를 덜어준다.
3. golden testing library의 힘을 빌리면, 새로운 테스트가 추가될 때마다 `golden-file`을 regenerate 하는 비효율을 막을 수도 있다.
