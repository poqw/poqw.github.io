# Github Pages

## Multiple repos to one github page

다음과 같은 방법으로 2개의 레포지토리로 하여금 하나의 Github 웹페이지로 접속이 가능하다.

1. Github pages용 레포지토리를 만든다.
2. `{username}.github.io` 레포지토리를 만들어 Github pages에 연결한다.
3. 새로운 레포지토리를 만든다.
4. 설정에 들어가 Github pages의 master브랜치에 연결한다.

## Gatsby

[Gatsby](https://www.gatsbyjs.org/)를 이용해 위의 3과정에서 만든 새로운 레포지토리를 React 기반으로 호스팅할 수 있다.

[gatsby-cli](https://www.gatsbyjs.org/docs/gatsby-cli/)를 설치하면 아래와 같이 간단하게 프로젝트 생성해 볼 수 있다.
```bash
gatsby new [project-name] [starter-pack]
```
- project-name: 생성할 프로젝트 이름(디렉토리 이름).
- starter-pack: [Starter library](https://www.gatsbyjs.org/starters/)들 중 기본 템플릿을 지정할 수 있다.
    - 만약 starter-pack을 지정하지 않으면 [기본 starer-pack](https://github.com/gatsbyjs/gatsby-starter-default.git)이 지정된다.

아래 명령어로 로컬에 띄워볼 수 있다.
```bash
gatsby develop
```
