# Cache

## Look aside & Write back

캐시에는 두 가지 방식이 있다. 먼저 Look aside 방식은 Lazy loading 방식으로 가장 일반적인 방식이다.

1. Cache 에서 먼저 조회
2. hit 나면 데이터 반환하고 끝
3. miss 나면 DB에서 조회하고 캐시에 저장

Write back 방식은 다음과 같다.

1. 데이터를 Cache에 저장
2. Cache에 있는 데이터들이 일정 크기나 일정 시간이 지날떄까지 검사
3. Cache에 있는 데이터들을 모아서 DB에 저장
4. Cache에 있는 데이터 삭제
