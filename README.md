# PORTILOG

[![GitHub last commit](https://img.shields.io/github/last-commit/google/skia.svg?style=flat)]()
[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)

PORTILOG는 Portfolio + TIL(Today I learned) + Blog 의 합성어입니다.

## TMI

이 섹션은 프로젝트 이름이 왜 저 모양인지 궁금한 사람들을 위한 TMI니 건너뛰어도 좋습니다.

처음에는 jekyll을 사용해서 종종 포스팅을 하는 개인 블로그로 시작했습니다.
그러나 Blog 포스팅은 시간을 너무 많이 뺏겨 어느샌가 글쓰는 걸 부담으로 느끼고 있는 제 모습을 발견했습니다.
그러다 문득 한 번에 완벽한 글을 완성짓는 것보다 불완전하더라도 꾸준하게 그리고 점진적으로 개선하는 글이
나한테도, 내 글을 읽어주는 사람들한테도 더 좋겠다 싶은 생각이 들었습니다.

결국 짬짬이 시간을 내어 디자인 없이 밋밋하게 TIL 만 모아서 볼 수 있는 Gatsby 웹사이트를 새로 하나 만들게 되었습니다. 
원래 유지하던 블로그에 갑자기 TIL을 작성하자니 통일성이 깨지는 것 같아 싫었고, Gatsby 가 좋다길래 한 번 써보고 싶은 욕심도 들었거든요.
아니나 다를까 기술스택이 너무 다른 두 사이트를 결국 합치지 못하고 따로따로 운영하는 상황이 되었습니다.

결국 관리가 너무 귀찮아진 나머지 고민 끝에 아예 며칠 휴가를 내고 두 사이트를 통합시키고 말았습니다.
통합시키면서 페이지 구상을 하다가 나중에 어차피 포트폴리오도 웹사이트에 올리겠지 싶어 TIL + Blog 에
Portfolio까지 하나로 합친 PORTILOG를 탄생시켰습니다.

아무튼 그렇게 탄생한 이 프로젝트는 지하철 출퇴근길에 할 거 없으면 TIL 이라도 복습할 요량으로 반응형을 적당히 고려하였으며,
이를 위해 [Gatsby](https://www.gatsbyjs.com/), [React](https://reactjs.org/), [Typescript](https://www.typescriptlang.org/)
등을 이용하여 작성되었습니다. 

https://poqw.github.io 에서 확인해 보실 수 있습니다.

## TIL

TIL 을 추가하고 싶다면 `tils` 안에 `md` 혹은 `mdx` 파일을 작성합니다. `tils` 안에는 `md` 혹은 `mdx` 파일을 포함한 디렉토리를
두어도 괜찮습니다. 파일 이름이 곧 사이드바에 보여질 이름이 됩니다.

> Tip: 디렉토리 depth가 너무 깊어지면 디자인이 깨질 염려가 있으므로 depth 4 이하로 유지하는 것을 추천합니다.

`frontmatter` 는 의도적으로 쓰지 않으려 했습니다. 매 파일마다 선언해주는 게 귀찮았기 때문입니다.

## Setup

의존성을 설치하여 프로젝트를 셋업합니다.

```bash
yarn
```

## Development

로컬 환경에서 아래 명령어로 실행시켜 볼 수 있습니다.

```bash
yarn start
```

## Deployment via gh-pages

### Prerequisite

[gh-pages](https://www.npmjs.com/package/gh-pages) 를 사용하고 있기 때문에 레포지토리 설정에서
배포할 브랜치를 배포 전에 `gh-pages` 로 변경해주어야 합니다.

### Deployment

아래 명령어로 배포가 가능합니다.

```bash
yarn deploy
```

## Issue reporting

https://github.com/poqw/poqw.github.io/issues 에 제보 부탁드립니다.

## Contibution

`tils` 디렉토리를 건드리지 않는 선에서 Contribution 환영합니다.

