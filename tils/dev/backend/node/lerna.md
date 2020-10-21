# Lerna

## Multi repo vs Mono repo

Multi repo는 다음과 같은 특징을 가진다.

- 여러 레포지토리를 사용하여 프로젝트나 패키지를 분산해 놓는 방식이다.
- 유연성 확장성이 확보되나, 새로운 프로젝트를 시작하는 경우 중복된 설정들을 똑같이 해주어야 한다.
- 중복된 부분에 대한 업데이트가 있는 경우, 레포지토리 개수만큼 횟수의 배포가 필요하다.
- 프로젝트가 커질수록 이슈가 분산되어 관리/유지보수가 힘들다.

Mono repo는 다음과 같은 특징을 가진다.

- 한 개의 레포지토리 안에 여러 배포 가능한 프로젝트를 두는 방식이다.
- ESLint, Babel, Common dependencies 등의 공통 설정 부분을 하나로 공유할 수 있다.
- 프로젝트 사이를 넘나들며 코드 재사용이 가능하다.

## Mono repo 를 만들기 위해 사용되는 lerna

[Lerna](https://lerna.js.org/) 는 보통 '러나'라고 읽는 모양이다.

Lerna는 Mono repo 로 여러 패키지들을 관리할 수 있게 도와주는데, `bootstrap`이 lerna의 주요 기능이다. 

lerna는 bootstrap을 통해 각 패키지들의 의존을 설치하고 cross-dependencies를 연결, 재정비 한다.
이 때, 의존이 있는 패키지는 설치 대신 Symlink를 연결한다. 명령어는 다음과 같다.
```bash
lerna bootstrap
```

lerna는 당연히 관리의 편리함을 위해 만들어졌기 때문에, 아래 명령어로 간단하게 배포가 가능하다.
```bash
lerna publish
```

`run` 이라는 명령어도 제공한다. 이 명령어는 각 패키지의 run 뒤에 나올 인자를 찾아 스크립트를 실행시킨다.
이를테면 아래 명령어는 각 패키지들의 `yarn test`를 트리거 한다.
```bash
lerna run test
```

아래 명령어는 각 패키지 하위의 `node_modules`를 삭제한다.
```bash
lerna clean
```

## Lerna vs Yarn workspace

Lerna가 하는 일은 Yarn의 workspace와 매우 비슷하다. 둘 다 패키지들간의 공통 의존성을 한데 모아주는 역할의 관점에서 말이다.
그러나 의외로 Lerna는 yarn과 같이 쓰일 수 있도록 만들어 놨다. yarn과 같이 쓰게 되면 lerna는 의존성 관리를 포기하고 yarn에게 위임해 버린다.
사람들은 대부분 yarn과 Lerna를 같이 쓰는 분위기인데, 이는 배포를 잘하는 Lerna 의 장점과 의존성 관리를 잘하는 yarn 의 장점을 한데 모아 활용하기 위함이다. 

