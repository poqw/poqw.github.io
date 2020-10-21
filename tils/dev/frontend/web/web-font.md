# Font

프론트에서 많이 쓰이는 폰트는 한 번 해놓으면 그 뒤로 볼 일이 없어서, 매번 새 프로젝트 시작할때마다 다 까먹어버린 나를 발견한다.

[여기에서](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/webfont-optimization?hl=ko)
굉장히 좋은 정보들을 얻을 수 있었다.

## 폰트 확장자들

- EOT(Embedded Open Type): 가장 옛날에 만들어진 폰트, IE 전용이다.
- TTF(TrueType Font): 요새도 쓰이고는 있는 폰트, OTF의 구린 버전이라고 생각하면 되는데 연산량이 적어 로딩이 더 빠르다.
- OTF(OpenType Font): TTF의 진화된 버전. TTF를 쓸 바엔 OTF를 쓰자.
- WOFF(Web Open Font Format): 아예 웹에서 사용할 목적으로 만들어진 폰트.
    - 지원 범위가 가장 넓다.
    - TTF/OTF의 진화된 버전이어서 로딩이 더욱 빨라졌다. 왠만해선 요놈을 쓰자.
- WOFF2: WOF에 비해 30% 저장공간을 절감했다. 그러나 너무 최신이라 지원이 안되는 브라우져들이 있다.   
- SVG/SVGZ(Scalable Vector Graphics (Zipped)): 벡터로 폰트를 만든 모양인데, firefox, IE 에서 지원 안한다.

## 브라우저가 폰트를 적용하는 원리

다음은 브라우져의 기본 동작이다.

1. 브라우저가 html 파일을 요청
2. 받아온 html을 파싱하여 DOM 구성을 시작
3. css, js 등 기타 리소스가 필요한 걸 발견하고 요청
4. 리소스가 수신되면 CSSDOM을 생성하고 이를 DOM 트리와 결합하여 렌더링 트리 생성
5. 랜더링 트리가 폰트가 필요한 걸 발견하면 그제서야 폰트 요청
6. 랜더링을 수행하면서 폰트가 존재하면 랜더링하고 존재하지 않으면 텍스트를 생략

## preload
 
폰트가 생략당하는 경우를 방지하기 위해 우리는 preload를 써주어야 한다(폰트가 정말 그만큼 중요하다면).
```html
<head>
  <!-- Other tags... -->
  <link rel="preload" href="/fonts/my-font.woff" as="font">
</head>
```

이 테그는 미리 로딩만 해놓고 어떻게 적용해야 하는지 브라우져에 알려주지 않는다. 그냥 저렇게만 해놓으면 아무런 변화가 없다는 뜻이다.
CSS의 `@font-face`테그를 사용하여 폰트를 지정해 주어야 한다.
