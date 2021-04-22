# NODE 환경에서 memory leak 디버깅

![](https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Node.js_logo_2015.svg/1280px-Node.js_logo_2015.svg.png)

## Overview

Node 앱을 띄운 pod에서 OOM Killed가 났었다. 메모리 릭을 의심하며 디버깅 방법을 조사했고, 프로파일링을 위해 `--inspect` 옵션을 통해
힙 덤프를 뜰 수 있다는 것을 알게 됐다. 단순 덤프 스냅샷 뿐만 아니라, 어떤 변수가 얼만큼의 사이즈로 할당되어 있고, 덤프끼리 메모리
비교도 해주는 강력한 기능도 탑재하고 있어서 엄청 편하다는 생각을 했다.

## Typescript 환경에서 디버깅

`--inspect` 옵션은 `node` 에서만 쓸 수 있는 옵션이다. Typescript 프로젝트여서 `ts-node` 를 쓰고 있었는데, 여기엔
`--inspect` 옵션을 먹일 수 있는 방법이 없었다. 방법은 간단했는데, `-r` 옵션으로 tsconfig-path 를 넣어줄 수 있었다.

```json
// package.json
"scripts": {
  // ...
  "debug": "node --inspect -r ts-node/register -r tsconfig-paths/register ./src/main.ts",
}
```

## Chrome inspect

크롬을 열어서 `Chrome://inspect` 를 접속하면 디버깅할 수 있는 창이 열리는데, `Discover network targets` 옵션이
열려 있는게 보인다. `Configure...`를 눌러보면 default로 `9229` 포트가 열려있는 것을 확인해 볼 수 있는데,
이는 `--inspect`가 프로파일링한 매트릭들을 `9229` 포트를 통해 디버깅 서버에 주기적으로 전송하기 때문이다. 즉, **건드리면 안된다**.
여기다 내가 동작시킬 앱의 포트넘버를 적는 줄 알고 넣었다가, 이상한 요청이 계속 들어오는 바람에 조사하다가 알게 되었다.

그냥 간단히 `Open dedicated DevTools for Node` 링크를 통해 열리는 크롬 Dev tools 창에서 디버깅하면 된다.
참고로 버그 인지는 몰라도 이 창이 매우매우 작게 열리는 경우가 있으니 화면을 잘 찾아봐야 한다.

## Memory tab & Debug

디버깅하는 데 가장 도움을 받았던 탭은 Memory 탭이었다. 여기서는 Heap snapshot를 찍을 수 있는데,
Overview 에서 언급한 대로 snapshot 끼리 Comparison 해주는 게 너무 좋았다. 예를 들어, snapshot1 과 snapshot2 사이에
새로 할당된 메모리나 GC 된 메모리까지 같이 볼 수 있다. 차근차근 보다보면 어떤 곳에서 memory leak이 발생하는지 확인해 볼 수 있는데,
나의 경우 `Rxjs`의 `ReplaySubject` 초기화 시 인자를 주지 않으면 버퍼 사이즈가 `Number.POSITIVE_INFINITY` 로 default 설정되어
제대로 `.unsubscribe()` 를 하지 않거나 소프트웨어가 매우 오래 동작하는 경우 OOM이 발생했다.
