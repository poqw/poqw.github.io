# SEO

![](https://i4d9k9u7.rocketcdn.me/wp-content/uploads/2019/04/what-is-seo-and-why-you-need-it-1200x565.png)

SEO(Search Engine Optimization)의 핵심은 검색 엔진이 노출하고 싶은 내 사이트의 곳곳을 잘 크롤링할 수 있게 만들어 주는 것이다.

## robots.txt & sitemap.xml

검색 엔진 크롤러가 제일 먼저 참고하는 것은 해당 도메인 루트에 있는 `robots.txt` 이다.
이 파일을 통해 `sitemap.xml`의 위치를 크롤러에게 알려줄 수 있다. 다음은 예시다.

```
User-agent: *
Allow: /please-crawl/
Disallow: /dont-crawl/
Sitemap: https://www.example.com/sitemap.xml
```

- User-agent: 접근을 제어할 봇(크롤러)의 이름, * 은 모든 봇들을 의미함 ex) Googlebot, Yeti 등
- Allow: 크롤링 해줬으면 하는 영역
- Disallow: 크롤링 하지 않으면 하는 영역
- Sitemap: 내 사이트 맵의 경로

## Meta tag

검색 엔진 최적화를 위해 `title` & `description` 태그를 추가하는 것도 좋다.

### 소셜 검색엔진 최적화 메타태그