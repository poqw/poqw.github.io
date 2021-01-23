# Yarn

Yarn은 Javascript Package Manager 이고, Facebook에서 만들었다.

## 왜 Facebook은 Yarn을 만들었나

예전에는 거대한 프로젝트의 패키지들을 관리할 때, npm에서 빌드 성능 이슈가 있었다(지금은 고쳐졌다고 한다: npm@5).
캐싱을 강화하는 등 성능 업을 하여 탄생한 것이 yarn이다. `$HOME/Library/Caches/Yarn` 에 캐싱된 데이터들이 들어 있다.

## package.json

yarn은 package.json 에 정의된 버전의 범위에 따라 패키지를 관리한다.
package.json 과 관련한 내용은 [이 곳](./package-json) 에 적어 두었으니 참고하자.

## yarn.lock

yarn이 package.json 에 정의된 버전에 따라 패키지를 설치한다는 말은, package.json에 버전 라벨링이 어떻게 되어 있는지에 따라
`yarn install` 을 거는 순간마다 의존하는 패키지들의 버전이 달라질 수 있음을(매번 최신으로) 의미한다.
의존성 중에 하나라도 하위 호환성을 보장하지 않는 경우, 이는 배포 환경에서 큰 문제를 야기할 수 있다.

이를 방지하기 위해 존재하는 것이 yarn.lock 으로, 안정적인 배포를 원한다면 yarn.lock 또한 git과 같은 version control system 으로 tracking 해야 한다.

## yarn workspaces

멀티 프로젝트를 구성해서, 프로젝트 간에 의존 참조를 한다면 유용한 기능이다.

workspaces를 구성하여 여러 패키지를 포함하게 되면, root 패키지 디렉토리에 모든 의존성이 집결된다.

예를 들어 디렉토리 구조가 아래와 같다고 한다면:

```
│
├─ project-a
│   ├─ node_modules
│   ├─ yarn.lock
│   └─ package.json
│
├─ shared
│   ├─ node_modules
│   ├─ yarn.lock
│   └─ package.json
│
└─ project-b
    ├─ node_modules
    ├─ yarn.lock
    └─ package.json
```

먼저 root 에 package.json을 만들고 아래와 같이 작성한다.

```json
{
  "private": true,
  "workspaces": [
    "project-a",
    "project-b",
    "shared"
  ]
}
```

이 때, `"private": true` 이건 반드시 해주어야 한다. workspaces는 배포용이 아니기 때문에 해주지 않으면 에러를 뱉는다.

yarn 으로 루트에서 재설치를 하게 되면 다음과 같이 같이 공통 부분을 모아버릴 수 있다.

```
│
├─ project-a
│   └─ package.json
│
├─ shared
│   └─ package.json
│
├─ shared
│   └─ package.json
│
├─ node_modules
├─ yarn.lock
└─ package.json
```

> 단, 일부 devDependencies에서 사용하는 바이너리 때문에 각 프로젝트 별로 모듈이 몇 개 들어간 node_modules 디렉터리가 생길 수 있다.

만약 `project-a` 가 shared를 사용한다면 아래와 같이 간편하게 의존성 추가가 가능하다.

```json
{
  "name": "project-a",
  ...,
  "dependencies": {
    ...,
    "shared": "^x.y.z",
    ...,
  },
  ...
}
```

## Tips

몇 가지 유용한 팁을 적어보자면:

- yarn.lock 을 직접 수정하지 말아야 한다: 되도록이면 yarn cli 에게 맡기자.
- yarn upgrade 는 모든 패키지를 일괄적으로 업데이트하기 때문에 매우 위험하다. 되도록이면 사용하지 않고, 직접 패키지를 지정해서 테스트와 함께 업그레이드 하는 것이 좋다.

## 유용한 명령어들

yarn add, remove, upgrade 같은 기본 명령어는 생략한다. 너무 기본이니까..

### yarn list

의존성들을 나열한다.

```bash
yarn list --depth 0
```

### yarn why

명령어로는 어래와 같다.

```bash
yarn why axios
```

이 패키지가 왜 설치되어 있어야 하는지를 분석한다.

### yarn outdated

업데이트해야할 의존성들을 보여준다.

```bash
yarn outdated
```
