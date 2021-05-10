# Redis

## Overview

Redis 는 Single thread 라서 원자성을 보장하고, persistence 하기 까지 하다.
또한, SortedMap, List, Strings 등 다양한 Collection 들을 제공한다.

## Spring 에서 접근하기

`RedisTemplate` 이나 `RedisRepository` 로 접근이 가능하다. `RedisTemplate` 방식 + redis client로 `Lettuce`를 사용한다면 설정 예시는 다음과 같다.

```kotlin
@Configuration
class RedisConfig() {

    @Value("${spring.redis.cluster.nodes}")
    lateinit var clusters: List<String>

    @Bean
    fun redisConnectionFactory(): LettuceConnectionFactory {
        val clientResources = DefaultClientResources.builder()
            .commandLatencyPublisherOptions(
                DefaultEventPublisherOptions.builder()
                    .eventEmitInterval(Duration.ofSeconds(10))
                    .build()
            )
            .build()
        val clientConfig = LettuceClientConfiguration.builder()
            .clientResources(clientResources)
            .build()
        val redisClusterConfiguration = RedisClusterConfiguration(clusters)
        return LettuceConnectionFactory(redisClusterConfiguration, clientConfig)
    }
    
    // Kryo는 Java 진영의 빠르고 효율적인 바이너리 객체 그래프 직렬화 프레임워크다.
    @Bean()
    fun compressionTimelineReactiveRedisTemplate(
        redisTimelineConnectionFactory: LettuceConnectionFactory
    ): ReactiveRedisTemplate<String, Any> {
        val kryoFactory = KryoSerializer
            .factoryBuilder()
            .register(MyData::class.java) // 여기다가 내 클래스들을 등록.
            .build()
        val redisSerializer = KryoGZipCompressionRedisSerializer(kryoFactory)

        val context = RedisSerializationContext
            .newSerializationContext<String, Any>(StringRedisSerializer())
            .value(redisSerializer)
            .hashValue(redisSerializer)
            .build()

        return ReactiveRedisTemplate<String, Any>(
            redisTimelineConnectionFactory,
            context
        )
    }
}
```

`RedisTemplate`에서는 Redis의 여러 자료구조를 손쉽게 활용하기 위해 다음과 같이 `opsFor*` 인터페이스를 제공한다.

* `opsForValue`	Strings를 쉽게 Serialize / Deserialize 해주는 Interface
* `opsForList`	List를 쉽게 Serialize / Deserialize 해주는 Interface
* `opsForSet`	Set를 쉽게 Serialize / Deserialize 해주는 Interface
* `opsForZSet`	ZSet를 쉽게 Serialize / Deserialize 해주는 Interface (Zset은 Sorted Set 이다)
* `opsForHash`	Hash를 쉽게 Serialize / Deserialize 해주는 Interface

다음과 같이 사용한다.

```kotlin
val operation = redisTemplate.opsForValue()
operation.set("my-key", "My-data", Duration.ofDays(5))
operation.get("my-key")
```
