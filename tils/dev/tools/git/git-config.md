# Git config

# 여러 계정 관리

git에 여러 계정(개인 계정, 회사 계정 등)을 각각 따로 관리하고 싶은 경우가 많다.

우선 global하게 먹여진 설정을 지우려면: 

```bash
git config --global --unset user.name
git config --global --unset user.email
```

그러나 위와 같이 unset을 하더라도 커밋은 가능하다. 사용자 이름이나 이메일이 없을 때 커밋을 할 수 없도록 설정하려면:

```bash
git config --global user.useConfigOnly true
```

또, 디렉토리 마다 git 계정을 등록하고 싶은 경우가 있는데, 해당 디렉토리가 `<<DIR>>`라고 한다면 아래와 같이 디렉토리에 종속적인 config를 설정할 수 있다.
이 설정파일의 위치는 `~/.gitconfig` 이다.

```
[includeIf "gitdir:<<DIR>>/"]
    path = <<DIR>>/.gitconfig
```

위의 경로에 해당하는 `.gitconfig` 파일에 계정 정보를 설정한다.

```
[user]
    name = happy-nut
    email = happy-nut.dev@gmail.com
```
