# Unix commands

![Docker](https://upload.wikimedia.org/wikipedia/commons/3/36/Rmdir_--help_Command_-_Unix.png)

잘 까먹는 UNIX 계열 명령어들에 대해 정리한다. 알파벳 순으로 소팅하여 찾기 쉽게 해놓았다.

## find

아래 명령은 폴더 타입(-type d)으로 recursive하게 현재 폴더를 검색한다. -name은 regex도 사용 가능하다.

```bash
find . -type d -name "k8s" -print 2>/dev/null
```

## wget

Web get의 약자라 한다.

```bash
wget [URL] -o output.text
```

- o (output-file): 아웃풋 파일이름을 지정한다.