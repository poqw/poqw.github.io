# Android 배포

## proguard 와 @keep annotation

`@keep`은 일반적으로 reflection이나 jni 같은 코드를 빌드시에 minify하지 않게 하기 위해 쓰는 annotation 같다.

proguard 때문에 속이 썩어갈 때 편하게 쓰려고 썼던 어노테이션 같은데, proguard로 왠만하면 쇼부치는 게 맞을 것 같다.
