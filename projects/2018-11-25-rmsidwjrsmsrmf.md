---
layout: post
title: 글을 쓰기 위해서라면
category: [life]
author: hyungsun
image:
---

### 문제 인식
이 블로그에 포스팅을 안하게 된 지 벌써 몇 개월이 지났다. 이렇게 미루고 또 미루다간 영원히 글을 안쓸 것만 같은 기분이 들었다.




###  원인을 파악하기
포스팅을 하고픈 마음은 굴뚝같은데, 자꾸 미루게 되는 이유를 곰곰이 생각해 보고 결론을 냈다.
> (...) 성격이 게을러서

그렇다. 더 깊게 생각해 볼 필요도 없이 이유는 그냥 게을러서다. 

이런 나에게 포스팅을 위한 아래 작업들은 코스트가 너무나 크다.

> 오늘 날짜로 `yyyy-mm-dd-some_title`서식을 맞추어 `.md` 파일 생성   
> 글을 나름 정성들여 작성한다.  
> git commit & push  
> deploy check  



### 해결책을 고민해보기

그러니 이 과정들을 좀 단순화 시키기  위해 고민을 해보았다.

> 오늘 날짜로 `yyyy-mm-dd-some_title`서식을 맞추어 `.md` 파일 생성 
>  - python 스크립트로 짜버리자.
>
> 글을 나름 정성들여 작성한다.
>  - 이 부분은 어떻게 할 수가 없다. 
>  - 그러나 내가 평소 Notion에 메모하고 있는 내용을 곧바로 deploy 하는 방안을 후일 모색해볼 것이다.
>
> git commit & push
>   - 4번이랑 합쳐볼까?
>
> deploy check
>
>   - 커밋 메시지는 "`New post: yyyy-mm-dd-some_title`"로 하고 로컬에 띄웠다가 맘에 들면 push 하도록 스크립트를 작성해봐야겠다.

### 행동으로 옮기기
우선 나는 간단하게 `yyyy-mm-dd-some_title` 서식으로 파일을 생성하는 녀석을 만들었다.
```python
import argparse
import datetime

POSTING_DIR = '_posts'

parser = argparse.ArgumentParser(description='Create new post.')
parser.add_argument('title',
                    help='title for new posting.')
def to_filename(title):
    ymd = '{0:%Y-%m-%d}'.format(datetime.datetime.now())
    return f'{POSTING_DIR}/{ymd}-{title}.md'

args = parser.parse_args()
with open(to_filename(args.title), 'w'):
    pass
```

파일을 만들고 나서 생각해보니까, Editor로 바로 열어버리고 싶은 마음이 생겼다.

나는 글을 쓸 때 [친구](https://enhanced.kr/)의 추천으로 [Typora](https://typora.io/) 라는 녀석을 쓴다. 찾아보니 녀석은 Command line 을 support하기 위해 [애쓰는 것 같았다](https://support.typora.io/Use-Typora-From-Shell-or-cmd/). 

애써주는데 써먹어야지, 라는 생각에 코드를 몇 줄 더 추가했다.

```python
import platform

SYSTEM = platform.system()

with open(to_filename(args.title), 'a') as f:
    f.close()
    if SYSTEM == 'Windows':    
        subprocess.call(f'start {f.name}', shell=True)
    else:
        subprocess.call(f'open -a {f.name}')
```

좋다. 잘 열린다.  

이미 쓰던 글을 열고 싶을 수도 있으니 open mode를 `'w'`에서 `'a'`로 바꾸었다. 

쓰고있는 글이 deploy되면 어떤 모습일지 실시간으로 파악하기 위해 내가 지금 작업하고 있는 글을 브라우져로 열어주는 아래 코드도 추가했다.

```python
    if SYSTEM == 'Windows':    
        subprocess.call(f'start chrome 127.0.0.1:4000/{post_title}', shell=True)
    else:
        subprocess.call(f'open "127.0.0.1:4000/{post_title}"', shell=True)
```



### 더 나은 구조로 스크립트 바꾸기
이 시점에서 코드가 더러워지고 있다고 직감적으로 느꼈다.

원인은 간단하다. 운영체제 별로 써야하는 명령어가 다르다는 점 때문이다.

가만히 냅두다간 스크립트를 돌리고 있는 운영체제가 윈도우인지 맥인지 판별하는 온갖 중복으로 내 코드가 더렵혀질 것 같다는 생각에 바퀴벌레가 몸에 닿기라도 한 마냥 소름이 끼쳤다.

이걸 타파하기 위해 아래처럼 `CommandManager`를 만들어 추상화시켰다.

```python
class CommandManager:
    def __init__(self, system):
        self.system = system

    def getCommander(self):
        if self.system == 'Windows':
            return self.WindowsCommander()
        else:
            return self.LinuxCommander()
    class BaseCommander:
        def open_with_typora(self, filename):
            raise NotImplementedError
        def serve_jekyll(self):
            return subprocess.Popen('jekyll serve', shell=True)
        def open_in_browser(self, post_title):
            raise NotImplementedError

    class WindowsCommander(BaseCommander):
        def open_with_typora(self, filename):
            return subprocess.call(f'start {filename}', shell=True)
        def open_in_browser(self, post_title):
            return subprocess.call(f'start chrome 127.0.0.1:4000/{post_title}', shell=True)

    class LinuxCommander(BaseCommander):
        # TODO(poqw): Should test on OSX.
        def open_with_typora(self, filename):
            return subprocess.call(f'open -a {filename}', shell=True)
        def open_in_browser(self, post_title):
            return subprocess.call(f'open "127.0.0.1:4000/{post_title}"', shell=True)
```

명령어가 공통인 경우에는 `BaseCommander`에 묶어버리고,  그 외에는 `raise NotImplementedError` 하여 interface화 시켰다. 내부 class를 이런 식으로 사용하는 게 좋은 방법이란 확신은 없었지만, 내 의도를 반영하기에 큰 무리는 없기 때문에 의구심따위는 살포시 무시했다.	

어느 정도 class가 생겨날 즈음, 나머지 부분도 class화 되어있지 않으면 몹시 찝찝하기 때문에 마저 작업했다.

```python
import platform
import argparse
import datetime
import subprocess
import psutil


class PostManager:
    POSTING_DIR = '_posts'

    def __init__(self, title):
        self.title = title
        self.filename = self.to_filename(title)
        self.commander = CommandManager(platform.system()).getCommander()
        self.processes_to_kill = []
        
    def to_filename(self, title):
        ymd = '{0:%Y-%m-%d}'.format(datetime.datetime.now())
        return f'{self.POSTING_DIR}/{ymd}-{title}.md'

    def prepare(self):
        with open(self.filename, 'a') as f:
            f.close()
        self.processes_to_kill.extend([
            self.commander.serve_jekyll(),
            self.commander.open_in_browser(self.title),
            self.commander.open_with_typora(self.filename)
        ])

    def cleanup(self):
        print("Clean up.")
        for process in self.processes_to_kill:
            try:
                process = psutil.Process(process.pid)
                for proc in process.children(recursive=True):
                    proc.kill()
                process.kill()
            except:
                pass
```

아래는 Main 함수다.

```python
def main():
    parser = argparse.ArgumentParser(description='Create new post.')
    parser.add_argument('title', help='title for new posting.')
    args = parser.parse_args()

    postManager = PostManager(args.title)
    postManager.prepare()


if __name__ == '__main__':
    main()
```

### 행동으로 옮기기 2

이제 남은 작업은 내 글이 마음에 들면 Deploy를 자동으로 해주는 기능이다. 

우선 `BaseCommander`에 아래 함수를 추가했다.

```python
    class BaseCommander:
        ...
        def deploy(self, filename, commit_message):
            subprocess.call(f'git add {filename}', shell=True)
            subprocess.call(f'git commit -m "{commit_message}"', shell=True)
            subprocess.call(f'git push', shell=True)
```

그리고나서 PostManager의  prepare함수를 수정하고, deploy함수를 추가했다.

```python
    def prepare(self):
        ...

        # Wait for deploy.
        option = input()
        if option == 'c':
            self.cleanup()
            return
        if option == 'd':
            self.deploy()
            return

    def deploy(self):
        print("Are you sure to deploy?(y)")
        option = input()
        if option != 'y':
            return
        commit_message = f'New post: {self.filename}.'
        self.commander.deploy(self.filename, commit_message)
        self.cleanup()
```

구조를 추상화해뒀더니, 나머지 작업은 매우 간단하게 끝이 났다.

### 귀찮음의 산물

결과적으로, 아래의 간단한 스크립트가 만들어졌다.

```python
import platform
import argparse
import datetime
import subprocess
import psutil

class CommandManager:
    def __init__(self, system):
        self.system = system

    def getCommander(self):
        if self.system == 'Windows':
            return self.WindowsCommander()
        else:
            return self.LinuxCommander()

    class BaseCommander:
        def open_with_typora(self, filename):
            raise NotImplementedError
        def serve_jekyll(self):
            return subprocess.Popen('jekyll serve', shell=True)
        def open_in_browser(self, post_title):
            raise NotImplementedError
        def deploy(self, filename, commit_message):
            subprocess.call(f'git add {filename}', shell=True)
            subprocess.call(f'git commit -m "{commit_message}"', shell=True)
            subprocess.call(f'git push', shell=True)

    class WindowsCommander(BaseCommander):
        def open_with_typora(self, filename):
            return subprocess.call(f'start {filename}', shell=True)
        def open_in_browser(self, post_title):
            return subprocess.call(f'start chrome 127.0.0.1:4000/{post_title}', shell=True)

    class LinuxCommander(BaseCommander):
        # TODO(poqw): Should test on OSX.
        def open_with_typora(self, filename):
            return subprocess.call(f'open -a {filename}', shell=True)
        def open_in_browser(self, post_title):
            return subprocess.call(f'open "127.0.0.1:4000/{post_title}"', shell=True)

class PostManager:
    POSTING_DIR = '_posts'

    def __init__(self, title):
        self.title = title
        self.filename = self.to_filename(title)
        self.commander = CommandManager(platform.system()).getCommander()
        self.processes_to_kill = []
        
    def to_filename(self, title):
        ymd = '{0:%Y-%m-%d}'.format(datetime.datetime.now())
        return f'{self.POSTING_DIR}/{ymd}-{title}.md'

    def prepare(self):
        with open(self.filename, 'a') as f:
            f.close()
        self.processes_to_kill.extend([
            self.commander.serve_jekyll(),
            self.commander.open_in_browser(self.title),
            self.commander.open_with_typora(self.filename)
        ])

        # Wait for deploy.
        option = input()
        if option == 'c':
            self.cleanup()
            return
        if option == 'd':
            self.deploy()
            return

    def deploy(self):
        print("Are you sure to deploy?(y)")
        option = input()
        if option != 'y':
            return
        commit_message = f'New post: {self.filename}.'
        self.commander.deploy(self.filename, commit_message)
        self.cleanup()

    def cleanup(self):
        print("Clean up.")
        for process in self.processes_to_kill:
            try:
                process = psutil.Process(process.pid)
                for proc in process.children(recursive=True):
                    proc.kill()
                process.kill()
            except:
                pass
        

def main():
    parser = argparse.ArgumentParser(description='Create new post.')
    parser.add_argument('title', help='title for new posting.')
    args = parser.parse_args()

    postManager = PostManager(args.title)
    postManager.prepare()


if __name__ == '__main__':
    main()
```

### 결론

만들고나서도 이 스크립트가 나를 글을 성실히 쓰는 사람으로 변화시킬 수 있을지는 여전히 의문점으로 남아 있는 듯한 느낌이다.

그렇지만 직접 써보니 꽤나 편리하므로(이 글은 실제로 저 스크립트로 deploy되었다), 나름대로 성과를 얻었다고 할 수 있겠다.

그리고 아래  TODO를 얻었다.

>  Mac에서 테스트.
>
>  새로운 포스팅하는 것 외에 기존 포스팅 수정할 때도 적용할 수 있게 하기.

나중에 기회가 된다면 앞서 넌지시 언급한 것처럼 평소 메모해 놓는 공간을 포스팅으로 convert시켜서 deploy하는 기능도 추가해볼까 한다.