# Atomic design

재사용성을 높이기 위해 레이아웃을 레고 블럭처럼 쪼갠 후, 다시 조립해서 개발하는 방법론이다. 

## 왜 써야 하나?

Atomic design의 취지는 "처음부터 재사용 가능한 컴포넌트를 만들자"이다.
다 만들어 놓고 중복되는 부분을 뽑아 재사용이 가능하도록 만드는 전통적인 방법보다 시간, 노력면에서 효율적이고 버그도 줄일 수 있다.

## 구성요소

모듈 구조부터 살펴보자.

```
src
├── components
│   ├── atoms
│   │   └── ...
│   ├── molecules
│   │   └── ...
│   ├── organisms
│   │   └── ...
│   └── templates 
│       └── ...
├── pages
│   └── ...
├── hooks
├── ...
```

사실 위 구조는 react hook 을 사용함으로써 중복된 상태관리를 피했기 때문에 베이직한 Atomic design 으로부터 조금 더 진화한 형태이다.
디자인은 공학보단 철학에 가까우므로 무엇이 정답이다라고 이야기하기 애매하지만, React 생태계에 한해서는 가장 관심사의 분리가 잘 되어있는 모델이라는 생각이 든다.

## Components

컴포넌트들은 기본적으로 상태를 가지지 않는다는 점에 유의하자. 이는 재사용성을 높이기 위함이다.

이 때 주의할 점은 컴포넌트 각각을 설계할 때 컴포넌트의 가장 바깥쪽 패딩이나 마진을 꼭 필요한 경우를 제외하고 부모 컴포넌트에게 재량을 맡겨야 한다.
그래야 유연성을 잃어버리지 않기 때문이다.

### Atoms

기본 빌딩 블록으로, 컬러 팔레트, 폰트 그리고 애니메이션과 같은 인터페이스에서 보이지 않는 추상적인 요소가 포함될 수 있다.

e.g. SearchButton, Input, Label

### Molecules

Atoms들을 조합해 **한 가지**의 기능을 잘 할 수 있도록 만든 집합체다. Molecules 는 다른 Molecules에 의존할 수 없다.

e.g. SearchForm

### Organisms

Atoms, Molecules들을 조합해 인터페이스에서 구분된 영역을 표시할 수 있도록 만든 집합체다.
이 때 Organisms는 독립적이고, 기동성있고 재사용이 가능해야 한다. 심지어 다른 Organisms 에 의존할 수도 있다.

e.g. SearchHeaderBar

### Templates

Organisms, Molecules와 Atoms들을 조합해서 만드는 것이 아니라, 실제 컴포넌트를 주입만 하면 바로 만들 수 있게끔 만들어 놓은 레이아웃 툴이다.

e.g. SearchTemplate

## Hooks

Components가 상태를 가지지 않도록 하기 위해 전통적으로는 prop drilling을 이용해 Container라는 HOC(Higher Order Component)를 사용했다.
가령, API에서 어떤 데이터를 받아와 컴포넌트에 뿌려주어야 한다면 Container에서 API콜을 하고 pages에서는 이러한 Container들과 Components들을 사용해서 화면을 구성했다.

그러나 Container의 상태 관리 로직을 빼내어 커스텀 hooks로 만들고, 이 훅을 pages에서 이용한다면 결과적으로 Container는 빈 껍데기만 남아 존재이유가 사라진다. 
이 방법을 썼을 때의 또 다른 장점은 HOC가 사라지면서 component depth가 줄어든다는 것이다. 

## pages

미리 만들어 놓은 Template에 Atoms, Molecules, Organisms 를 주입하여 플레이스 홀더 콘텐츠가 실제 콘텐츠로 대체하도록 만든 형태다.

e.g. SearchPage

## Ref

[분리의 미학](https://vallista.kr/2020/03/29/Component-%EB%B6%84%EB%A6%AC%EC%9D%98-%EB%AF%B8%ED%95%99/)

[Atomic Design](https://brunch.co.kr/@ultra0034/63)

[Atomic Design for React](https://medium.com/@inthewalter/atomic-design-for-react-514660f93ba)