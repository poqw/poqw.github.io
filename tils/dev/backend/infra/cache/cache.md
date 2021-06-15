# Cache

## 캐시 전략

캐시 전략에는 다음 5가지가 있다.

* Cache Aside(Look Aside)
* Read Through
* Write Through
* Write Around
* Write Back

### Read Through

우리가 흔히 아는, 가장 많이 쓰이는 전략이다.

1. 데이터 읽기 요청을 받는다.
2. 캐시를 먼저 조회한다.
3. 캐시에 없다면 DB를 조회한다.
4. DB에서 조회했다면 캐시에 로드한다.

읽기와 관련된 트래픽이 많은 경우에 유리하다. 단, 데이터가 최신이 아니라면 정합성에 문제가 생긴다.

### Cache Aside

Read Through 방식과 똑같으나, Application 레벨에서 캐시에 값을 로딩하는 책임을 갖는다.

### Write Through

1. 데이터 쓰기 요청을 받는다.
2. 캐시에 데이터를 로드한다.
3. 디비에 데이터를 로드한다.

데이터가 항상 최신으로 유지된다는 장점이 있어 Read Through 와 함께 쓰이는 경우가 많다.

### Write Around

데이터를 읽은 경우에만 캐시에 로드한다. 실시간 로그 또는 채팅방에 쓰인다.

### Write Back

1. 데이터 쓰기 요청을 받는다.
2. 캐시에 데이터를 로드한다.
3. 일정한 지연이 있는 후, DB에 데이터를 로드한다.

쓰기와 관련된 트래픽이 많은 경우에 유리하다.