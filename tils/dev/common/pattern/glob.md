# Glob

Glob 패턴은 와일드카드 문자를 사용해서 일정한 패턴을 가진 파일 이름들을 지정하기 위한 패턴이다.
대표적인 예로 유닉스 운영체제에서 쓰이는 `rm *.txt` `나 git add *.ts` 등이 있겠다.

우리가 자주 만드는 `.gitignore` 도 이 패턴을 사용한다.

## Pattern

| 패턴 | 설명 |
|:---:|:----|
| `*` | `/`를 제외한 모든 문자열과 매칭 (문자열 길이 0 이상) |
| `**` | `/`를 포함한 모든 문자열과 매칭 (문자열 길이 0 이상) |
| `?` | `/`를 제외한 하나의 문자와 매칭 (빈 문자 X) |
| `[abc]` | `[]`안에 있는 모든 각각의 문자들과 매칭 |
| `{a, b, c}` | `{}`안에 있는 `,`로 구분된 각각의 문자열들과 매칭 |
| `[^abc]` | `[]`안에 있는 모든 각각의 문자들을 제외한 문자들과 매칭 |
| `[a-z]` | `[]`안에서 `-` 사이에 있는 첫 문자와 마지막 문자의 범위 안에 있는 모든 문자들에 대해 매칭 |
| `!` | 뒤에 등장하는 패턴의 부정 표현 |

## Example

`/**/*.js`: 현재 디렉토리와 그 하위 디렉토리 내에 존재하는 모든 .js 파일들을 선택

`/*.{js,ts}`: 현재 디렉토리 내에 존재하는 모든 .js, .ts파일들을 선택

`/example[1-3].js`: 현재 디렉토리 내에 있는 example1.js, example2.js, example3.js파일들을 선택

## Online Globbing Test

[globster.xyz](https://globster.xyz/) 에서 온라인으로 테스트가 가능하다.