# Android 배포

이 글에서는 library를 이미 만들어 배포를 준비하고 있는 분들을 위해 작성되었고, 배포 준비 단계에서부터 jcenter에 라이브러리를 배포하는 과정까지를 소개할 것이다. 만약 Android 라이브러리를 작성하는 방법을 원하시는 분들은 [Android 문서를](https://developer.android.com/studio/projects/android-library) 참고해 주시면 좋을 것 같다.

## About jcenter
Android 및 java 라이브러리 생태계에서 가장 인기있는 중앙 레포지토리는 jcenter이다. 아래와 같이 build.gradle 파일에서 많이들 봐왔을 것이다.
```gradle
repositories {
  jcenter()
}
```
이 클로져를 통해 프로젝트는 외부 dependency들을 어디서 가져올 수 있는지 알 수 있게 된다. jcenter는 예전 많이 쓰이던 라이브러리 공유 레포지토리였던 Maven Central이 Migration된 레포지토리이며, Maven Central의 상위호환 집합이라고 보면 된다. Maven Central을 여기서 갑자기 소개하는 이유는 먼저 Maven Central로 배포를 해야 jcenter에 라이브러리를 연동시킬 수 있기 때문이다.

## Sign up to bintray

Maven Central에 라이브러리를 publish 하기 위해서는 [JFrog bintray](https://bintray.com/)라는 회사 사이트에 가입을 해야 한다. 가입을 할 수 있는 방법에는 2가지가 있는데, Free trial과 Open Source account가 바로 그것이다. 이 때 반드시 Open Source account로 가입해야 한다는 것을 유의하자. 링크로는 [여기로](https://bintray.com/signup/oss) 바로 들어가주시면 된다. Free trial로 가입을 하게 되는 경우 jcenter에 연동할 수 있는 링크 버튼이나 이미 올렸던 라이브러리 버전 삭제 등 꼭 필요한 기능들을 제공해주지 않는다.
가입을 하고 난 뒤 사이트에서 Edit profile > API Key 를 들어가보면 Key 를 확인할 수 있다.

이 API Key는 배포과정에 쓰이게 될 키이므로 .bashprofile같은 곳에 저장 및 적용해두도록 하자. 나는 zsh을 쓰기 때문에 .zshrc에 저장해 두었다. User 이름도 profile의 Accounts에서 확인 가능하다.

```bash
# Bintray Publish API Key.
export BINTRAY_API_KEY="YOUR_BINTRAY_API_KEY"
export BINTRAY_USER="YOUR_BINTRAY_USER"
```

## Make your repository

계정을 만들었다면, repository를 만들어 주어야 한다.
자유롭게 설정하여 만들면 되는데, repository name 같은 경우 아래에서 다시 쓰이게 되므로 주의 깊게 설정하고, type은 Maven으로 설정해야 한다.

## Novoda/bintray-release

bintray repository에 업로드를 하기 위해서 사람들은 보통 gradle plugin을 주로 사용한다. 이 플러그인이 하는 일은 사용자의 설정에 따라 release 모드로 빌드한 라이브러리를 bintray 레포지토리에 업로드 하는 것이다. [bintray 공식 플러그인](https://github.com/novoda/bintray-release)이 있긴 하지만, 설정해주어야 할 게 너무 많아 사용하기 까다롭고 나의 build.gradle 파일이 매우 더러워지기 때문에 나는 [novoda 플러그인](https://github.com/novoda/bintray-release)을 사용했으며, 또 이를 추천한다. 아래는 bintray-release 플러그인을 사용해 배포하기 위해 내가 작성한 publish.gradle 스크립트이다. build.gradle이 더러워지는 게 보기 싫다면 이렇게 파일을 나누어도 좋고, 아니면 build.gradle안에 전부 합쳐도 상관없다.

```gradle
apply plugin: 'com.novoda.bintray-release'

group 'YOUR_GROUP_NAME'
version 'YOUR_VERSION_NAME'

/** Configurations for com.novoda.bintray-release plugin.
 *
 * This plugin uses https://github.com/bintray/gradle-bintray-plugin internally.
 * See https://github.com/novoda/bintray-release/wiki/Configuration-of-the-publish-closure for more
 * detail about options in `publish` closure.
 */
publish {
  // Required.
  bintrayUser = System.getenv('BINTRAY_USER')
  bintrayKey = System.getenv('BINTRAY_API_KEY')
  groupId = this.group
  publishVersion = this.version
  artifactId = 'YOUR_ARTIFACT_ID'

  // Optional.
  userOrg = 'YOUR_ORGANIZATION_NAME'
  repoName = 'YOUR_REPO_NAME'  // Should be same as bintray repo name.
  desc = 'YOUR_DESCRIPTION_FOR_THE_ARTIFACT'
  issueTracker = 'YOUR_ISSUE_TRACKER_URL'
  website = 'YOUR_WEBSITE_URL'
  repository = 'YOUR_REPOSITORY_URL'
  dryRun = false
  override = true
}

/** Add support for syncing to maven central.
 *
 * This closure synchronizes the POM file that specifies transitive dependencies with the maven
 * central.
 * See https://github.com/novoda/bintray-release/wiki/Add-support-for-syncing-to-maven-central for
 * more detail.
 */
subprojects {
  group = this.group
  version = this.version

  def isUploading = project.getGradle().startParameter.taskNames.any {
    it.contains('bintrayUpload')
  }
  if (isUploading && project.name in [MODULE_NAME]) {
    apply plugin: 'maven'

    def defaultPomPath = "build/publications/maven/pom-default.xml"
    gradle.taskGraph.whenReady { taskGraph ->
      taskGraph.getAllTasks().find {
        it.path == ":$project.name:generatePomFileForMavenPublication"
      }.doLast {
        file(defaultPomPath).delete()

        // Overriding POM file to make sure we can sync to maven central.
        // See https://maven.apache.org/pom.html for more detail about POM.
        pom {
          project {
            name project.publish.artifactId
            artifactId project.publish.artifactId
            packaging project.name == 'compiler' ? 'jar' : 'aar'
            url project.publish.website
            version this.version
          }
        }.writeTo(defaultPomPath)
      }
    }
  }
}
```

여기서 `YOUR_`로 시작하는 값들은 전부 당신이 설정해주어야 하는 내용이다.

- YOUR_GROUP_NAME: 라이브러리가 패키지 주소라고 생각하면 된다. e.g. com.google.guava
- YOUR_VERSION_NAME: 라이브러리 버전이다. 주의할 점은 라이브러리의 build.gradle에 명시된 defaultConfig 의 versionName 같아야 한다. e.g. '1.0.0'
- YOUR_ARTIFACT_ID: 아티펙트(라이브러리) 이름이다. e.g. guava
- YOUR_ORGANIZATION_NAME: 조직 이름이며, 안 적어도 상관없다. 이 경우 User name이 이를 대체한다. e.g. google
- YOUR_REPO_NAME: bintray 레포지토리 이름이다. e.g. guava
- YOUR_DESCRIPTION_FOR_THE_ARTIFACT: 라이브러리 설명이다.
- YOUR_ISSUE_TRACKER_URL: 이슈 트래커 주소다. e.g. https://github.com/google/guava/issues
- YOUR_WEBSITE_URL: 웹사이트 주소다. 적지 않아도 된다.
- YOUR_REPOSITORY_URL: 레포지토리 주소다. e.g. https://github.com/google/guava

코드 하단부에 subprojects에서 pom파일과 관련된 설정을 해주는 것이 보이는데, 여기서 pom 파일은 라이브러리의 세부정보들을 담는 파일이다. 이 세부정보에는 라이브러리 이름, 설명, 해당 라이브러리가 외부로부터 가져오는 의존성 정보들이 포함된다. bintray plugin 버그로 해당 워크어라운드를 통하지 않으면 pom파일에 의존성 정보들이 누락된다.

위에서 작성한 publish.gradle 파일을 build.gradle에서 설정해주면 마무리가 끝나게 된다.
```gradle
...
apply from: 'publish.gradle'

buildscript {
  ...
  
  dependencies {
    ...
    // Required for publish.
    classpath 'com.novoda:bintray-release:0.9.1'
  }
}
```

## Publish to maven central

이제 터미널에서 다음과 같은 명령어를 통해 손쉽게 배포가 가능하다.

```sh
$ ./gradlew clean build bintrayUpload --info
```

만약 로컬에 먼저 publish해서 테스트하고 싶다면 아래 명령어를 사용하면 된다. 다만 이 경우에는 build.gradle의 repositories 클로져에 mavenLocal() 이 명시되어 있어야 한다. 자세한 건 [여기를](https://proandroiddev.com/tip-work-with-third-party-projects-locally-with-gradle-961d6c9efb02) 참고하자.
```sh
$ ./gradlew clean build publishToMavenLocal --info
```

## Link to jcenter

bintray 화면에서 제공해주는 "Add To JCenter" 버튼을 누르게 된다면 jcenter 운영진이 심사후 확인 이메일을 전송해주게 된다.

## Conclusion

여기까지 Maven Central을 통해 jcenter에 안드로이드 라이브러리 배포하는 과정을 알아보았다.

## 참고

### proguard 와 @keep annotation

`@keep`은 일반적으로 reflection이나 jni 같은 코드를 빌드시에 minify하지 않게 하기 위해 쓰는 annotation 같다.

proguard 때문에 속이 썩어갈 때 편하게 쓰려고 썼던 어노테이션 같은데, proguard로 왠만하면 쇼부치는 게 맞을 것 같다.
