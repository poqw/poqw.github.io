# 반응형 웹 만들기

## Grid

그리드는 반응형 웹에 대응하기 위해 스크린을 세로 방향으로 여러 격자로 쪼개어 디자인을 하는 방법이다.
보통 12단으로 쪼개고 사이 간격(Gutter)를 30px 정도로 둔다.
12단으로 하는 이유는 12가 2, 3, 4 로 깔끔하게 나누어 떨어져서 여러 디바이스 스크린에 자연스럽게 대응하기가 가장 편하기 때문이다.

여러 디바이스 스크린에 관한 이야기가 나왔는데, 개발자들은 이 다양한 디바이스들을 획일적으로 스크린 처리를 하기 위해 breakpoint라는 개념을 만들었다.

[Material UI 의 breakpoint](https://material-ui.com/customization/breakpoints/)에는 xs, sm, md, lg, xl 가 있는데,
각각 모바일, 테블릿, 스몰 데스크탑, 데스크탑, 라지 데스크탑 정도의 스크린 사이즈를 표상한다.

- xs, extra-small: 0px
- sm, small: 600px
- md, medium: 960px
- lg, large: 1280px
- xl, extra-large: 1920px

이 breakpoint를 이용해 다음 코드와 같이 반응형 웹을 구현할 수 있다.

```tsx
const MyResponsiveSection: React.FC = () => (
  <Grid
    justify="center"
    container
    spacing={3}
  >
    <Grid component={Box} item md={1} display={{ sm: 'none', md: 'block' }} />  // ...(1)
    <Grid item md={5} sm={12}>                                                  // ...(2)
      <img src="my.image.url" />
    </Grid>
    <Grid component={Box} item md={1} display={{ sm: 'none', md: 'block' }} />  // ...(3)
    <Grid item md={4} sm={12}>                                                  // ...(4)
      <Typography variant="h2">"This is title"</Typography>
      <Typography variant="subtitle2">"This is content"</Typography>
    </Grid>
    <Grid component={Box} item md={1} display={{ sm: 'none', md: 'block' }} />  // ...(5)
  </Grid>
)
```

먼저 스크린 사이즈가 sm, 즉 600px 미만인 경우를 보자.
이미지를 포함한 (2)번 그리드와 텍스트를 포함한 (4)번 그리드가 12씩 차지하고 나머지 그리드들은 `display: none` 이므로 크기 0을 차지하게 된다.
즉, 화면에서는 이미지가 너비가 꽉차도록 먼저 배치되고 그 아래 타이틀과 content가 다음과 같이 보여질 것이다.
```
(2)
(4)
```

그럼 스크린 사이즈가 md, 즉 600px 이상인 경우를 보자.
왼쪽부터 그리드 한 칸 여백, 그리드 5개짜리 이미지, 그리드 한 칸 여백,
그리드 4칸 짜리 텍스트 그리고 그리드 한 칸 여백해서 다음과 같이 한 줄로 쭉 보이는 화면이 나타날 것이다.
```
(1)(2)(3)(4)(5)
```

이 때, md보다 큰 사이즈에 대한 정의가 되어 있지 않다면 가장 큰 사이즈에 대한 정의를 따른다.
즉 스크린 사이즈가 xl이라고 하더라도, md까지만 정의가 되어 있다면 정의된 md에 따라 화면이 보여지게 되는 것이다.
