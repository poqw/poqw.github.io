# 정규표현식

## Positive lookahead

정규표현식을 완성하고 나서, 패턴이 적용된 문자열의 전체 길이에 대해서 검사하고 싶을 때가 있다.
이 경우 Positive lookahead를 쓰면 되는데, 다음과 같이 적용한다.

```
(?=.{3,16}$) // 정규표현식의 결과가 3~16자인지 검사
```

적용 예시는 다음과 같다. 앞 부분에 붙여야 하는 것에 유의하자.
```
/^(?=.{3,16}$)[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/
```