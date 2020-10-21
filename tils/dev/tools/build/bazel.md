# Bazel

## What is Bazel

바젤(Bazel)은 소프트웨어 빌드 및 테스트 자동화를 가능하게하는 오픈 소스 도구다.

## How Bazel works

바젤은 빌드하거나 테스트를 실행하는 경우, 간단하게 디펜던시를 로드하고, 분석하고, 실행하는 3가지 페이즈를 거친다.

- 로딩 페이즈: 내가 빌드/테스트하고자 하는 타깃(target)과 관련된 모든 BUILD 파일들을 찾아 규칙(rules)을 인스턴스화 하여 그래프를 만든다.
- 분석 페이즈: 그래프로부터 규칙(rules)을 실행하고 작업(actions)을 인스턴스화 한다. 작업이란, 입력 집합에서 출력 집합을 생성하는 방법을 제시하는 객체라고 보면 된다.
즉, 이 페이즈에서는 로딩 그래프로부터 액션 그래프를 만든다.
- 실행 페이즈: 액션들을 실행시킨다.

바젤은 매 실행 시 때마다 캐싱을 해두기 때문에 빌드가 엄청 빠르다. 변경 사항이 있을 경우, 해당 변경 사항에 대해서만 국소적으로 Rebuild를 진행한다.

## Bazel core concepts and terminology

Bazel에서는 불행히도 수많은 단어가 새로이 등장한다. 여러 빌드 케이스들을 전부 포괄하려다 보니 이런 용어들이 나온 듯 하다. 빡시게 정리하고 들어가야 헷갈리지 않는다.
자세한 내용은 [공식 문서](https://docs.bazel.build/versions/master/build-ref.html) 에서 확인해 볼 수 있으나, 정리하는 겸 여기다 요약한다.

### Workspace

Workspace 는 디렉토리이며, `WORKSPACE` 파일을 포함하는 디렉토리가 바로 Workspace 디렉토리가 되며, 프로젝트의 루트 디렉토리다.
이 루트 디렉토리는 라벨링에서 `@` 로 표현된다.
만약 하위 디렉토리에 또 다른 `WORKSPACE` 가 포함되어 있다면, 바젤은 이를 무시한다. 

### Repositories

`WORKSPACE` 파일이 존재한다면, 그 디렉토리는 하나의 레포지토리를 표현하는 것이다.
이 때 외부 라이브러리 코드, 즉 외부 레포지토리는 `WORKSPACE` 안에서
[workspace rules](https://docs.bazel.build/versions/master/be/workspace.html) 를 이용해 표현한다.

### Packages

한 레포지토리는 여러 패키지로 나뉠 수 있다. 패키지를 선언하는 기준이 되는 것은 `BUILD` (혹은 `BUILD.bazel`) 파일로, 이 파일에 존재한다면 그 디렉토리는
하나의 패키지를 담고 있는 것이다.

만약 트리가 아래 구조와 같다면, app 패키지와 app/tests (서브)패키지가 포함되어 있는 것이다.

```
src/my/app/BUILD // 여기
src/my/app/app.cc
src/my/app/data/input.txt
src/my/app/tests/BUILD // 여기
src/my/app/tests/test.cc
```

### Targets

패키지를 구성하는 요소들의 단위는 바로 Target이다. 즉, 레포지토리 안에는 여러 패키지가 있고, 패키지 안에는 여러 타깃이 있다.
타깃은 일반적으로 files 를 나타내거나 rules를 나타낸다(이 외에 보기 드문 package groups 라는 게 있다).

files는 우선 Source files와 Generated files 이렇게 2가지 종류로 더 나뉜다.

rules는 어떤식으로 입력 집합으로부터 출력 파일 집합을 탄생시킬지와 같은 둘 사이의 관계를 정의한다. rules의 output은 항상 generated files 이지만,
rules의 input은 source files 일 수도, generated files 일 수도 있다. 즉, 이는 rules 끼리의 체인을 만들 수가 있다는 뜻이 된다.
rules가 만드는 generated files는 항상 그 rule 과 같은 패키지에 포함되어지며, 절대 다른 패키지에 파일을 생성할 수는 없다.

그러나 input으로 받을 파일이 외부 패키지의 generated files가 되는 경우는 드문 일이 아니다. 이 때 사용되는 것이 package groups다.
이 타깃을 쓰기 위해서 `package_group` 이라는 함수를 사용하게 되는데, '이름'과 '의존하는 패키지 리스트'를 속성으로 가진다.
이 타깃에 접근하기 위해서는 `visibility` 나 `default_visibility` 속성으로부터 가시성이 허용되어 있어야 한다.

간단한 예시를 먼저 살펴보자. BUILD 파일에는 여러가지 Build Rule을 선언하여 어떻게 빌드할지를 지정할 수 있는데,
아래에서 `cc_binary`가 바로 Build Rule에 해당한다.

### Label

Target의 이름이 바로 Label이다. 다음과 같이 생겼다:

```
@myrepo//my/app/main:app_binary
```
같은 repository 안이라면, `@myrepo`는 생략이 가능하다.

```
//my/app/main:app_binary
```

모든 Label은 다음 두 가지 파트 나뉘는데, 위 예시에서 my/app/main 은 package name에 해당되고, app_binary는 target name에 해당된다.
만약 package name의 마지막 부분이 target name과 같다면, 다음과 같이 target name의 생략이 가능하다.

```
//my/app
//my/app:app
```

만약 my/app 패키지 경로에 있는 `BUILD` 파일이라면, package name까지 생략이 가능하다. 아래 라벨들이 지칭하는 타깃은 모두 같다.

```
//my/app:app
//my/app
:app
app
```

같은 패키지라면 `:`은 파일에 대해서는 생략될 수 있고, `rules`에 대해서는 유지되어야 한다. 그러나 파일에 대해 썼다고 문제가 생기거나 하는 건 아니다.
즉, 아래와 같이 써도 문제가 없지만,

```
generate.cc
testdata/input.txt
```

다른 패키지라면 아래와 같이 완전하게 라벨링을 해주어야 한다. 서브패키지라 하더라도 말이다.

```
//my/app:generate.cc
```

아직 마지막 규칙이 하나 더 남았다.

만약 외부 repository에서 내가 작성하는 repository의 rules를 참조하는 경우가 있다고 하자. 내가 작성한 rules가 
`@//a/b/c` 와 같은 라벨이 있다면, 이 라벨은 내가 작성하는 repository의 //a/b/c 를 참조하게 되고,
`//a/b/c` 와 같은 라벨이 있다면, 이 라벨은 외부 repository의 //a/b/c를 참조하게 된다. `@//`는 메인 repository를 지칭하기 때문이다. 

### Rules

rules는 다음과 같이 생겨먹었다: 이 때, name은 target name이 되므로 필수 항목이다. genrules 가 아니라면, 실행이 가능한 파일이 해당 name으로 생성될 것이므로
이에 유의하면서 네이밍을 해야 한다.

```
cc_binary(
    name = "my_app",
    srcs = ["my_app.cc"],
    deps = [
        "//absl/base",
        "//absl/strings",
    ],
)
```

모든 rules는 뉘와 같이 attributes 를 갖는다. rules는 워낙 방대하기 떄문에 [링크](https://docs.bazel.build/versions/master/be/overview.html) 로 설명을 대체한다.

### BUILD files

`BUILD` 파일이 정의되는 곳은 한 패키지가 형성된다고 했다. 이 BUILD 파일은 [starlark](https://github.com/bazelbuild/starlark/) 언어로 작성된다.
`BUILD` 파일 작성자는 공용 사용 여부에 관계없이 각 빌드 대상의 역할을 문서화하고 패키지 자체의 역할을 문서화하기 위해 자유롭게 주석을 사용하는 것이 좋다.

`BUILD` 파일은 빌드 재현 가능성을 명령형태의 구문 해석만으로 판단하기 위해 파일 안에서 함수 선언을 막아버렸다. 함수는 반드시 `.bzl` 파일 안에서만 선언되어야 한다. 
이 `.bzl` 은 Bazel extension 이다. 다음과 같이 `load` 를 사용하여 이 익스텐션을 불러올 수 있다. 이 `load`가 불러오는 건 rules 일 수도, functions 일 수도 constants 일 수도 있다. 

```
load("//foo/bar:file.bzl", "some_library")
```

참고로, `.bzl` 파일안에서 `_` 로 시작하는 문자열로 이름지어진 target 은 외부로 export 되지 않는다.

`BUILD` 파일 안에서는 주로 다음 3가지 타입의 rules 가 등장한다.

- `*_binary` : 실행 가능한 프로그램(name으로 이름지어진)을 만든다. `data` attr에 선언된 파일들은 runfiles 디렉토리에 모이게 된다. runfiles는 런타임에 프로그램이 합법적으로 열 수 있는 유일한 공간이다.
- `*_test` : test를 위한 `*_binary` 이라고 보면 된다. 동작방식이나 속성이 거의 흡사하다.
- `*_library` : 프로그램에 필요한 모듈을 정의한다. `*_binary` 나 `*_test` 는 `*_library` 에 의존할 수 있으며, 심지어 `*_library`까지도 다른 `*_library`에 의존할 수 있다.

### Types of dependencies

- srcs: 출력 파일들을 만들어 내는 rules에 의해 직접적으로 연관되는 파일들이다.
- deps: srcs 처럼 출력 파일들을 만들어 내기에 필요하지만, 독립적으로 컴파일이 가능한 경우 deps에 선언한다. 라이브러리나 데이터 같은 게 여기 해당된다.
- data: 프로그램의 런타임에 필요한 파일들이 여기 선언된다. config 파일들이나 test_data 같은 게 여기 해당된다.
