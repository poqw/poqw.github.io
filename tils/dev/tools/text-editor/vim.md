# Vim tips

![Vim](https://www.lifewire.com/thmb/h5UtiGx55BQd5CV0DlAs3PDt98g=/839x499/filters:fill(auto,1)/YXRHQMN8q9-2065126366d243adb89b73a732920087.png)


이 문서에서는 vim 을 사용하면서 유용하지만 자주 까먹게 되는 팁들을 적는다.

## Undo & Redo

- u: undo
- Ctrl + r: redo

## 열려있는 모든 텝 한 번에 닫기

```vim
:qa
```

## 문자열 치환

문서 전체에서 pick을 edit으로 바꾸고 싶다면:

```vim
:%s/pick/edit/gi
```

범위를 주어 그 안에서 치환(1번 라인부터 5번 라인까지 치환):
```vim
:1,5s/pick/edit/
```

맨 뒤에 붙는 옵션은 다음과 같은 의미를 가진다.
- g: 전역
- i: Ignore case
- c: confirm

또, 바꿀 부분(pick)엔 정규표현식이 들어갈 수 있다.
