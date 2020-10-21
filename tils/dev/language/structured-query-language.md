# SQL

## Foreign key 는 누가 소유해야 하는가.

항상 속해지는 쪽(belongs to)에서 foreign key를 들고 있어야 한다. one-to-many 관계를 떠올리면 쉽게 이해할 수 있는데,
유저가 여러 개의 토큰을 가지고 있는 상황에 만약 유저가 토큰의 foreign key를 들고 있으면 array를 들고 있게 되므로 비효율이 발생하기 때문이다.
