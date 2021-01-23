# TypeORM

## ORM

ORM(Object-relational mapping)은 객체지향(Object-Oriented) 언어와 
관계형 데이터베이스(Relational-Database)사이의 객체-데이터 매핑 시스템이다.
객체지향 언어의 Class가 관계형 데이터베이스는 Table에 해당된다고 보면 된다.

## TypeOrm

[TypeOrm](https://typeorm.io/) 이란 TypeScript 와 JavaScript(ES5 , ES6 , ES7) 용 ORM이다.
MySQL, PostgreSQL, MariaDB, SQLite, MS SQL Server, Oracle, WebSQL 데이터베이스를 지원한다.

## Setting

설치는 다음과 같이 한다.

```bash
yarn add typescript typeorm @types/express
```

## 프로젝트 구조

보통 프로젝트는 초기에 다음과 같이 세팅을 많이 한다.

```
프로젝트이름
├── src
│   ├── entity       // Entity들이 선언되는 곳 
│   │   └── User.ts  // User 엔티티
│   ├── migration    // 마이그레이션과 관련된 디렉토리 (없어도 됨)
│   └── index.ts
├── ormconfig.json   // ORM, database 연결 설정 파일
├── package.json
└── tsconfig.json
```

여기서 `ormconfig.json` 파일이 중요한데, 이 파일에 있는 정보를 토대로 데이터베이스의 연결 구성 옵션이 설정된다.
생긴 건 아래처럼 생겼다. 아래에서 `entities`를 반드시 지정해주어야 함에 주의하자.

```json
{
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "username",
  "password": "password",
  "database": "database_name",
  "synchronize": true,
  "logging": false,
  "entities": [
    "src/entity/**/*.ts"
  ],
  "migrations": [
    "src/migration/**/*.ts"
  ]
}
```

하지만 선언적으로 `ormconfig.json`을 쓰지 않고도, `createConnection`에 `ConnectionOptions`를 넘겨주어 연결 구성을 할 수도 있다.

```typescript
import { createConnection } from 'typeorm'

const connection = await createConnection({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'username',
  password: 'password',
  database: 'database_name',
  synchronize: true,
  logging: false,
  entities: [
    'src/entity/**/*.ts'
  ],
  migrations: [
    'src/migration/**/*.ts'
  ]
})
```

이 때, 똑같은 연결을 2번 하려고 하면 앱이 crash가 난다. 여러가지 multiple한 상황에 신경써야 한다면 [여기를](https://github.com/typeorm/typeorm/blob/master/docs/multiple-connections) 참고하자.

여기서 얻어진 `connection`은 `getConnection`을 이용하여 언제 어디서든지 받아올 수 있다.
```typescript
import { getConnection } from 'typeorm'

const connection = getConnection()
``` 

## Entity

디음과 같이 데코레이터를 사용하여 Entity를 선언한다.

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
class User extends BaseEntity {  
  @PrimaryGeneratedColumn()
  id : number

  @Column()
  fistname : string

  @Column()
  lastname : string
  
  @Column()
  isActive: boolean;
}
```

위의 코드는 아래 스키마에 매핑된다.

```
 +-------------+--------------+----------------------------+
 |                          user                           |
 +-------------+--------------+----------------------------+
 | id          | int(11)      | PRIMARY KEY AUTO_INCREMENT |
 | firstName   | varchar(255) |                            |
 | lastName    | varchar(255) |                            |
 | isActive    | boolean      |                            |
 +-------------+--------------+----------------------------+
```
