# Hikari

Spring의 application.yaml에 아래와 같은 설정이 있길래 찾아보았다.

```yaml
spring:
  datasource:
    hikari:
      jdbcUrl: jdbc:h2:mem://localhost/~/happy-nut;MVCC=TRUE
      username: happy-nut
      password: p@ssw0rd
```

Configuration 에 연결되는 부분을 찾아보면:

```kotlin
    @Bean
    @ConfigurationProperties(prefix = "spring.datasource.hikari")
    fun dataSource(): HikariDataSource {
        return HikariDataSource()
    }
```

이렇게 되어 있는데, Spring Boot 2.0부터 기본 Datasource가 hikari로 바뀐것 같다.
