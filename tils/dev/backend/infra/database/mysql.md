# Mysql

![](https://blog.kakaocdn.net/dn/m9bLX/btqx3TamF9P/RW8DUIknKEMDUGkcfdgYsk/img.png)

## RDBMS

[MySQL](https://www.mysql.com/) 은 대표적인 관계형 데이터베이스(RDB)다. 관계형이라는 그 이름에 걸맞게,
데이터 간 관계를 표현하는 데 있어 강력한 힘을 발휘한다. 관계의 종류는 다음과 같다.

- 1:1 관계: 유저와 프로필 사진의 관계
- 1:N 관계: 사용자와 리뷰의 관계
- M:N 관계: 한 카테고리에 여러 상품들이 속하고, 한 상품에 여러 카테고리가 태깅되는 관계

이러한 관계들에게서 어떤 요청이든지 간에 고속의 처리 시간을 유지하기 위해 관계형 데이터베이스는 테이블의 스키마를 사전에 정의하도록 강제한다.
이 특징은 양날의 검이라고 볼 수 있는데, 데이터의 표현을 2차원의 테이블 형식으로 제한할 뿐 아니라 스키마의 확장이 어려워지기 때문이다.

이러한 단점들 때문에 나온 것이 Mongo DB 같은 Document 형 DB 인데, 문서형 DB라고 또 완벽한 것은 아니다. 그러니 상황에 맞게 어떤 DB를 선택할 지
신중하게 고려해보아야 할 것이다. 

## Charset

문자열을 다루다 보면 한번쯤 인코딩 문제로 애먹는 일이 있다. 아무래도 데이터를 다루다보니 MySQL 도 예외는 아니다.
Table이나 DB를 생성할 때 미리 charset에 대한 고려가 되어 있으면 좋다.

다음은 DB 를 생성할 때 charset을 같이 지정해주는 예제다.

```sql
CREATE DATABASE IF NOT EXISTS `test-database` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

이 때, `utf8mb4` 는 `utf8`이 이모지를 표현하지 못했던 단점을 보완해서 나온 charset이다.

실험해본 결과, MySQL 8.0 이상에서는 default가 저 charset으로 되는 모양이다.
