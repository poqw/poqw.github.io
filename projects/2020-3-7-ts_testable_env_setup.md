---

layout: post
title: (Typescript) 테스트가 가능한 기초 환경 셋업하기
category: [typescript]
author: hyungsun
image: assets/images/typescript_1.png
---


## Intro to TypeScript
Javascript 는 개인적으로 별로 좋아하는 언어가 아닌데, 가장 큰 이유는 동적 타이핑(Dynamic typed)을 지원하는 언어의 특성 상 데이터의 흐름을 파악하기가 쉽지 않은 점 때문이다. 
Kotlin, Java 와 같은 정적 타입 언어들에 익숙한 내겐 마치 레고를 가지고 놀던 아이에게 찰흙을 손에 쥐어준 격이나 다름 없었다. 인터페이스를 만들고 모듈을 연결해 로봇을 만들어야 하는데,
얘는 그냥 뭐든지 갖다 붙여도 연결이 되어 버린다. 처음엔 좋은가 싶다가도 로봇이 점점 커지게 되면 그냥 진흙괴물이 되어버리곤 하는 것이다.  

[TypeScript](https://www.typescriptlang.org/index.html)는 나와 같이 불-편해하는 개발자들을 위해 탄생된 것이 아닌가 싶다. 과연 그럴까?
언어의 철학을 이해하기 좋은 방법 중 하나는 인트로 페이지를 둘러보는 것이다. [홈페이지](https://www.typescriptlang.org/index.html)에 방문해보니 "Javascript that scales"라는 슬로건을 내걸은 뒤, "TypeScript is a typed
superset of JavaScript that compiles to plain JavaScript."라고 부연 설명을 달고 있다. 말 그대로 해석하자면 자바스크립트를 컴파일해주는 **상위확장** 정도로 보면 되겠다.

**상위확장**? 이게 무슨 뜻일까. 조금 찾아보니 이 말은 다음의 뜻을 담고 있었다:
 - 기존의 자바스크립트의 문법을 그대로 사용할 수 있다.
 - ES6의 새로운 기능들을 사용하기 위해 [Babel](https://babeljs.io/) 과 같은 별도 트랜스파일러를 쓰지 않아도 된다.
 - Typescript 만의 기능들도 지원한다([types](https://www.typescriptlang.org/docs/handbook/basic-types.html), [annotations](https://www.typescriptlang.org/docs/handbook/decorators.html)).
 - ECMAScript 표준을 준수하면서 업그레이드에 따른 [지속적인 업데이트](https://github.com/Microsoft/TypeScript/wiki/Roadmap)가 있을 것이다.   

이러한 TypeScript 를 쓰게 되면 얻는 여러가지 장점들이 있는데, 가장 중요한 건 코드 가독성이 올라가고 Instant type error detection 이 가능해진다라는 점이다. 
이 말은 곧 IDE 가 우리를 더 잘 도와줄 수 있게 된다는 뜻이기도 하다. 역시 예상대로 나처럼 불편해 하는 개발자들이 많았나보다.

이쯤에서 [구글 트렌드](https://trends.google.com/trends/explore?date=all&q=TypeScript
)를 이용해 타입스크립트가 얼마나 트렌디한지를 살펴보자(로딩이 꽤 느리니 답답하다면 링크를 직접 클릭하셔도 좋다).
<script type="text/javascript" src="https://ssl.gstatic.com/trends_nrtr/2051_RC11/embed_loader.js"></script> <script type="text/javascript"> trends.embed.renderExploreWidget("TIMESERIES", {"comparisonItem":[{"keyword":"TypeScript","geo":"","time":"2004-01-01 2020-03-07"}],"category":0,"property":""}, {"exploreQuery":"date=all&q=TypeScript","guestPath":"https://trends.google.com:443/trends/embed/"}); </script>
당신의 생각은 어떠한가? 이 정도면 한 번쯤 써볼만하다는 생각이 들지 않을 수 없겠다.


## Get started with TypeScript
시작하기 앞서 한 가지 팁이 있다면 TypeScript 에서는 설치하기 전에 미리 언어를 경험해볼 수 있는 [playground](http://www.typescriptlang.org/play/)를 제공한다는 점이다.
근데 뭐 요즘 세상엔 워낙 설치/삭제가 간편하다보니 묻고 따지지 않고 곧바로 시작해보는 것도 나쁘지 않은 선택이다. 

시작하는 건 JS 진영 답게 크게 어려운 점은 없다. 간단한 아래 명령어 한 줄로 설치가 가능하다.
```bash
$ yarn global add typescript
```

혹시나 설치했는데도 불구하고 `tsc: command not found`가 뜬다면 `PATH`설정을 잘 확인해보자. 설정을 하기 위해서는 `~/.bashprofile`에 다음을 추가한다.
```bash
export PATH="$PATH:`yarn global bin`"
```

설치가 완료되었다면 `tsc`(TypeScript Compiler) 명령어로 컴파일이 가능하다.
```bash
$ tsc filename.ts
```

그러나 보통 위와같이 개별 컴파일하는 경우는 거의 없고... 프로젝트 셋업을 하는데, 다음과 같이 진행하면 된다:
```bash
$ tsc --init
```

위 명령어가 실행되고 나면 `tsconfig.json`이라는 파일이 하나 생성된다. 프로젝트를 열었을 때 이 파일이 존재한다면, 그 프로젝트는 TypeScript 를 쓰고 있으며 해당 디렉토리가 그 프로젝트의 root 디렉토리라는 사실을 기억하자.
`tsc`는 이 파일을 보고 ES5를 사용할 건지, ES6를 사용할 건지 등등 컴파일 옵션을 설정한다. 자세한 내용은 [여기서](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) 확인해 볼 수 있다.
나는 다음과 같이 설정했다.
```json
{
  "compilerOptions": {
    "alwaysStrict": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "module": "commonjs",
    "esModuleInterop": true,
    "target": "es6",
    "noImplicitAny": true,
    "moduleResolution": "node",
    "sourceMap": true,
    "declaration": true,
    "include": ["src/**/*"],
    "exclude": ["node_modules", "**/*.test.ts"]
  }
}
```

## Unit testing for TypeScript
TypeScript 를 설치했으니 이제 유닛테스트 환경을 구축해줄 차례다.
project init을 하고 src 디렉토리를 만들자.
```bash
$ yarn init && mkdir src
```

이제 유닛 테스트 환경에 필요한 모듈들을 설치해준다.
```bash
$ yarn add --dev @types/jest @types/node jest ts-jest
```

마지막으로 test를 구동시키기 위해 다음 스크립트를 `package.json`에 추가해준다.
```json
 "scripts": {
    "test": "jest"
  },
```

여기까지 잘 따라왔다면 프로젝트 파일트리는 다음과 같을 것이다.
 ```
.
├── node_modules
├── package.json
├── src
├── tsconfig.json
└── yarn.lock
```

## Write target test codes and unit test
테스트를 실행시키는데 필요한 건 무엇일까? 그렇다. 바로 테스트할 대상이다. 
src 디렉토리에 `main.ts` 파일을 만들고 다음과 같이 우리에게 친숙한 *세계야 안녕* 코드를 작성해보자.
```typescript
const world = 'world'

export function greet(word: string = world): string {
  return `Hello ${word}!`
}
```

이제 같은 위치에 `main.test.ts` 파일을 만들고 이 함수의 테스트 코드를 작성해보자.
```typescript
import { greet } from './main'

describe('greet', () => {
  it('should return greeting string with default word world', () => {
    expect(greet()).toBe('Hello world!')
  })

  it('should return greeting string with given input value', () => {
    expect(greet('코뭉이')).toBe('Hello 코뭉이!')
  })
})
```

`greet`함수가 하는 일은 인자를 받았을 때 인자에게 인사하는 것과, 인자를 받지 않았을 때는 세계에다 인사를 하는 것이기 때문에 각각 테스트 코드를 작성했다.

## Run test
환경 설정과 코드 작성이 끝났으니 이제 직접 테스트를 실행시켜 보는 일만 남았다!
테스트를 실행시키기에 앞서 우리는 `jest`가 어떤 파일이 테스트 파일인지 알 수 있도록 알려줘야 한다. 그렇다 사실 아직 설정이 끝나지 않았다.
루트 디렉토리에 [`jest.config.js`](https://jestjs.io/docs/en/configuration)파일을 만들고 다음과 같이 내용을 작성하자.
```
module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test))\\.tsx?$',
  moduleFileExtensions: ['ts', 'js']
}
```

이제 진짜 테스트를 실행시켜보자.
```bash
$ yarn test
```

결과는 다음과 같다. 성공적이다!
```
❯ yarn test
yarn run v1.22.0
$ jest
 PASS  src/main.test.ts
  greet
    ✓ should return greeting string with default word world (2ms)
    ✓ should return greeting string with given input value

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        0.751s, estimated 2s
Ran all test suites.
Done in 1.10s.
```

TypeScript 로 첫 테스트 작성을 한 것을 축하한다!
혹시 필요한 분들이 있을지 몰라 [소스코드](https://github.com/poqw/public-toys/tree/master/typescript/testable-env)를 올려두었으니 참고 바란다.
