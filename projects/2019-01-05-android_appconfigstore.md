---
layout: post
title: Android에서 AppConfigStore 구현하기(Kotlin)
category: [android, kotlin]
author: hyungsun
image:
---

## AppConfigStore
우선 AppConfigStore가 무엇이고, 왜 만드는지부터 설명해야겠다. 
AppConfigStore는 그 이름에서 짐작이 가능하듯이, 앱(App)의 설정(Config)을 저장(Store) 및 관리하는 곳이다.
즉, 클라이언트(App)에서 가지고 있어야 할 설정들을 관리하기 위해 사용한다. 왜 사용하는 지는 아래에서 예를 들어 설명하겠다.

## 앱을 배포하는 경우라면
대부분의 안드로이드 앱 서비스가 서버와 연동되어 사용된다. 안드로이드로부터 서버주소로 패킷이 오가는 것이다. 그러기 위해서는 필연적으로 접속해야 할 서버 주소를 앱에서 가지고 있게 된다. 아래처럼 했다고 생각해보자.(예제는 Kotlin으로 작성되었다)

```kotlin
class AppConfigs {
  companion object {
    const val SERVER_URL = "poqw.github.io"
  }
}

// Usage.
val urlToConnect = AppConfig.SERVER_URL
```

그러나 앱이 배포되고, `"poqw.github.io"`라는 서버 주소가 바뀌어야 한다고 생각해보자. 이는 단순히 `SERVER_URL`을 바꿔준다고 해결되지 않는다. 새로 배포될 앱에 대해서는 업데이트 된 주소로 앱이 배포되겠지만, 이미 배포된 앱들은 서버 접속이 안되는 바보앱으로 전락해 버리기 때문이다.

하지만 이를 타파하기 위해 앱 강제 업데이트라는 방법이 있다. 

## 강제업데이트?

저러한 Config 가 업데이트 되어야 할 때마다 강제 업데이트를 시키는 건 사용자 경험측면에서 결코 좋은 현상은 아니지만, 어쨌든 위에서 제기한 문제는 해결할 수 있다. 그러나 다음 경우를 생각해보자.

앱마다 다른 예전 버전의 설정은 그대로 가져가면서, 신규 버전의 설정은 default value를 넣어주고 싶은 경우.

위와 같은 경우에서는 맨 처음 소개한 코드로는 해결하지 못한다.

즉, 어쨌든 앱을 배포될 것이라면 Client specific한 Config들을 저렇게 상수로 선언하지 말고 관리를 해주어야 한다.

## Migration
자, 그러면 AppConfigStore의 필요성을 모두 이해했으리라 생각하고 AppConfigStore을 구현할 때에 생각해 보아야 할 점을 소개하겠다. 바로 Migration이다. 위의 경우에서처럼 서버 주소가 바뀌었을 때, 이미 배포된 앱에서도 주소를 업데이트 해줄 로직이 필요한 것이다.

소스 코드로 보면 다음과 같다.

우선 AppConfigStore 는 [Google Protobuf Message](https://developers.google.com/protocol-buffers/)로 아래와 같이 만들었다.

```protobuf
syntax = "proto3";

package app.config;

option java_package = "poqw.github.io";
option java_outer_classname = "ConfigProto";

message AppConfig {
  int32 version = 1;
  string some_config_at_v1 = 2;
  string some_config_at_v2 = 3;
  string some_config_at_v3 = 4;
  string some_config_at_v4 = 5;
}
```

이를 Migrate 처리하는 로직은 아래와 같다.

```kotlin
  private fun migrateConfig() {
    val previousConfig = loadConfig()
    if (previousConfig.version == CURRENT_VERSION) {
      return
    }

    val newConfig = previousConfig.toBuilder()
    if (newConfig.version < 1) {
        // Set default value of version 0
    }
    if (newConfig.version < 2) {
        // Set default value of version 1
    }
    if (newConfig.version < 3) {
        // Set default value of version 2
    }
    if (newConfig.version < 4) {
        // Set default value of version 3
    }
    if (newConfig.version < 5) {
        // Set default value of version 4
    }

    newConfig.version = CURRENT_VERSION
    saveConfig(newConfig.build())
  }
```

만약 이미 배포된 버전이 2고, 새로 업데이트 된 버전이 4라면, 버전 2까지의 설정은 그대로 가져가면서, `some_config_at_v3` 와 `some_config_at_v4` 에는 default value가 세팅되게 된다.


## Conclusion
Class로 구현한다면 아래와 같다.
```kotlin
@Singleton
class AppConfigStore @Inject constructor(private val preferences: SharedPreferences) {

  companion object {
    private const val CURRENT_VERSION = 1
  }

  lateinit var config: AppConfig

  init {
    migrateConfig()
  }

  private fun migrateConfig() {
    val previousConfig = loadConfig()
    if (previousConfig.version == CURRENT_VERSION) {
      return
    }

    val newConfig = previousConfig.toBuilder()
    if (newConfig.version < 1) {
        // Set default value of version 0
    }
    // ...

    newConfig.version = CURRENT_VERSION
    saveConfig(newConfig.build())
  }

  private fun loadConfig(): AppConfig {
    val encoded = preferences.getString(PrefKeys.APP_CONFIG, null)
    return encoded?.decodeBase64Url(AppConfig.parser()) ?: AppConfig.getDefaultInstance()
  }

  /** Save the given [AppConfig] with version migration. */
  fun saveConfig(config: AppConfig) {
    this.config = config
    preferences.edit()
        .putString(PrefKeys.APP_CONFIG, config.encodeBase64Url())
        .apply()
  }
}
```

이상으로 Migration 로직에 대해 알아보고 AppConfigStore를 직접 구현해보았다.

