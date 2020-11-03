# Unix commands

![Unix commands](https://upload.wikimedia.org/wikipedia/commons/3/36/Rmdir_--help_Command_-_Unix.png)

잘 까먹는 UNIX 계열 명령어들에 대해 정리한다. 알파벳 순으로 소팅하여 찾기 쉽게 해놓았다.

## curl

기본적으로 아래와 같은 형태로 명령어를 실행한다.

```bash
curl [options] <url>
```

자주 쓰이는 옵션을 정리했다.

- `-d`: data 의 약자로, 요청에 포함할 JSON 데이터를 넣어줄 수 있다.

## find

아래 명령은 폴더 타입(-type d)으로 recursive하게 현재 폴더를 검색한다. -name은 regex도 사용 가능하다.

```bash
find . -type d -name "k8s" -print 2>/dev/null
```

아래 처럼 파일 내부에 특정한 문자열을 포함하는 경우까지도 찾을 수 있다.

```bash
find ../../ -name '파일 이름' -type f -exec grep -i "문자열" {} \; -print
```

- `-i`는 대소문자를 무시하는 옵션이다.
- `{} \` 가 파일 내용까지 살펴보는 역할을 한다.
- `-print` 는 매칭되는 내용을 같이 출력한다.

## netstat

열려 있는 포트 확인하려고 자주 썼던 것 같다.

```bash
netstat -lntp
```

## wget

Web get의 약자라 한다.

```bash
wget [URL] -o output.text
```

- `-o` (output-file): 아웃풋 파일이름을 지정한다.