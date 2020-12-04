# Git rebase

![](https://media.vlpt.us/images/st2702/post/2140bd4b-9487-4c5c-843c-a057b692a08d/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202020-08-09%20%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB%201.16.56.png)

## Interactive rebase

나는 커밋 히스토리를 깔끔하게 유지하기 위해 Rebase 를 정말 자주 쓰는 편이다.

```bash
git rebase -i
```

위 명령어로 rebase 를 걸면 아래처럼 상호작용을 할 수 있는 모드가 열린다.

```
  1 pick 4422dd4b7b (AS-1) Introduce SystemStatusCalculator
  2 pick 811bc6778b (AS-1) Introduce GetSystemStatusUseCase
  3 pick 904f7a8f01 (AS-1) Introduce K8sGetSystemStatusService
  4 pick ed48878f00 (AS-1) Introduce GetSystemStatusController
  5 pick 343645c184 (AS-1) Wire dependencies for get-system-status
  6
  7 # Rebase a5eade3cc1..343645c184 onto ed48878f00 (5 commands)
  8 #
  9 # Commands:
 10 # p, pick <commit> = use commit
 11 # r, reword <commit> = use commit, but edit the commit message
 12 # e, edit <commit> = use commit, but stop for amending
 13 # s, squash <commit> = use commit, but meld into previous commit
 14 # f, fixup <commit> = like "squash", but discard this commit's log message
 15 # x, exec <command> = run command (the rest of the line) using shell
 16 # b, break = stop here (continue rebase later with 'git rebase --continue')
 17 # d, drop <commit> = remove commit
 18 # l, label <label> = label current HEAD with a name
 19 # t, reset <label> = reset HEAD to a label
 20 # m, merge [-C <commit> | -c <commit>] <label> [# <oneline>]
 21 # .       create a merge commit using the original merge commit's
 22 # .       message (or the oneline, if no original merge commit was
 23 # .       specified). Use -c <commit> to reword the commit message.
```

자주 쓰는 Command 는 `e`, `r`, `f`, `s`, `p`, `d` 정도고, 나머진 거의 써본 적이 없는 것 같다.
아래에서 위 커밋 로그들을 예로 들어 내가 어떤 식으로 이 기능들을 사용하는지 기록해 두려 한다.

### Fixup

작업을 하다가 '아 지금 수정하는 내용은 이 커밋이 아니라 이 전 커밋에 들어가야할 내용인데...' 하는 생각이 들 때가 있다.
다른 사람들은 어떻게 할 지 모르겠지만 나는 그 생각이 들면 이 전 커밋에 들어가야할 내용은 남겨두고,
현재 커밋과 관련된 내용만으로 우선 로컬 커밋을 만든다. 가령 아래와 같은 식이다.

```
  1 pick 4422dd4b7b (AS-1) Introduce SystemStatusCalculator
  2 pick 811bc6778b (AS-1) Introduce GetSystemStatusUseCase
  3 pick 904f7a8f01 (AS-1) Introduce K8sGetSystemStatusService
  # 아래 커밋을 작업 중이었다고 하자. 여기 아래에 로컬 커밋을 추가!
  4 pick ed48878f00 (AS-1) Introduce GetSystemStatusController
```

그 다음 이 전 커밋에 들어가야 하는 내용을 정리하여 새로운 로컬 커밋을 만든다.
커밋 메시지는 대충 적는데, 앞에 `fixup`이라는 단어를 붙여서 알기 쉽게 해놓는다.

```
  1 pick 4422dd4b7b (AS-1) Introduce SystemStatusCalculator
  2 pick 811bc6778b (AS-1) Introduce GetSystemStatusUseCase
  3 pick 904f7a8f01 (AS-1) Introduce K8sGetSystemStatusService
  4 pick ed48878f00 (AS-1) Introduce GetSystemStatusController
  # 나중에 히스토리를 정리할 때 알기 쉽게 fixup이라는 단어를 붙여놓는다.
  5 pick 23447baf05 fixup - GetSystemStatusUseCase
```

그리고 다시 원래 커밋에 들어가야 할 내용들을 마저 작업하고, 커밋한다.

```
  1 pick 4422dd4b7b (AS-1) Introduce SystemStatusCalculator
  2 pick 811bc6778b (AS-1) Introduce GetSystemStatusUseCase
  3 pick 904f7a8f01 (AS-1) Introduce K8sGetSystemStatusService
  4 pick ed48878f00 (AS-1) Introduce GetSystemStatusController
  5 pick 23447baf05 fixup - GetSystemStatusUseCase
  # 원래 작업을 마무리지어 마저 커밋한다. 마찬가지로 fixup을 붙인다.
  6 pick f321711a23 fixup - GetSystemStatusController
```

그 다음, `git rebase -i` 를 통해 다음과 같이 수정한다.

```
  1 pick 4422dd4b7b (AS-1) Introduce SystemStatusCalculator
  2 pick 811bc6778b (AS-1) Introduce GetSystemStatusUseCase
  5 f 23447baf05 fixup - GetSystemStatusUseCase
  3 pick 904f7a8f01 (AS-1) Introduce K8sGetSystemStatusService
  4 pick ed48878f00 (AS-1) Introduce GetSystemStatusController
  6 f f321711a23 fixup - GetSystemStatusController
```

conflict resolve 등 rebase 가 모두 끝나고 나면, 히스토리가 다음과 같이 깔끔하게 정리된다.

```
  1 pick 4422dd4b7b (AS-1) Introduce SystemStatusCalculator
  2 pick 811bc6778b (AS-1) Introduce GetSystemStatusUseCase
  3 pick 904f7a8f01 (AS-1) Introduce K8sGetSystemStatusService
  4 pick ed48878f00 (AS-1) Introduce GetSystemStatusController
```

### 이전 커밋 쪼개기

작업을 하다가 '예전 커밋이 너무 컸던 것 같아서 쪼개고 싶다...' 하는 생각이 들 때도 있다.

```
  1 pick 4422dd4b7b (AS-1) Introduce SystemStatusCalculator
  2 pick 811bc6778b (AS-1) Introduce GetSystemStatusUseCase
  3 pick 904f7a8f01 (AS-1) Introduce K8sGetSystemStatusService
```

위와 같은 상황에서 2번 커밋을 쪼개고 싶다고 하자. 일단 다음과 같이 수정한다.

```
  1 pick 4422dd4b7b (AS-1) Introduce SystemStatusCalculator
  2 e 811bc6778b (AS-1) Introduce GetSystemStatusUseCase
  3 pick 904f7a8f01 (AS-1) Introduce K8sGetSystemStatusService
```

그 다음 `git reset HEAD~` 를 하면 해당 커밋이 풀리고, 새로운 커밋을 할 수 있게 된다. 이 때 커밋 메시지는 날아가니 미리
복사해놓거나 나중에 `git reflog` 로 찾아야 한다.
2번 커밋을 쪼개서 새로운 커밋을 2개 했다고 하자. rebase 를 마치고 나면 결과가 다음과 같다.

```
  1 pick 4422dd4b7b (AS-1) Introduce SystemStatusCalculator
  2 pick ed48878f00 New commit 1
  4 pick f321711a23 New commit 2
  3 pick 904f7a8f01 (AS-1) Introduce K8sGetSystemStatusService
```
