# PORTILOG

[![GitHub last commit](https://img.shields.io/github/last-commit/google/skia.svg?style=flat)]()
[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)

PORTILOG는 Portfolio + TIL(Today I learned) + Blog 의 합성어입니다.

## TMI

- 반응형을 적당히 고려하였습니다.
- https://happy-nut.github.io

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

https://github.com/happy-nut/happy-nut.github.io/issues 에 제보 부탁드립니다.

## Contibution

`tils` 디렉토리를 건드리지 않는 선에서 Contribution 환영합니다.

