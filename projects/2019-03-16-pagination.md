---
layout: post
title: Jekyll 사이트에 Pagination추가하기
category: [jekyll]
author: hyungsun
image: assets/images/pagination_1.png
---

### Activate Jekyll-paginate-v2 Plugin
굳이 javascript로 애쓸 필요 없이 jekyll 전용 plug-in 을 다운받으면 편하다. Javascript로 하려면 불필요한 네트워크 통신이 불가피하기 때문에 구현해내는 시간까지 생각하면 너무 효율이 떨어진다. 다운 받을 만한 플러그인에는 2가지 종류가 있는데, `jekyll-paginate` 와 `jekyll-paginate-v2`가 바로 그것이다. 당연히 `jekyll-paginate-v2`가 지원해주는 기능이 훨씬 더 많고, 제약 사항도 적다. 참고로 `jekyll-paginate`에는 페이지의 머리말에 `permalink`(고유주소)를 삽입하면 동작하지 않는 [치명적인 단점](https://jekyllrb-ko.github.io/docs/pagination/)이 있는데, 페이지네이션을 적용할 페이지가 분리되어 있는 사이트에게는 쥐약이다.

설치는 다음 명령어를 통해 한다:
```bash
❯ sudo gem install jekyll-paginate-v2
```

gem 설치를 했으면 `_config.yml` 파일을 수정해 주어야 한다. `_config.yml`파일은 여러분이 만들어낼 정적 jekyll사이트의 전반적인 설정들을 담고 있다. 만약 jekyll2를 쓰고 있다면 기본적으로 포함되어 있으니 별도로 명시를 하거나 gem을 다운로드 받지 않아도 된다. Jekyll3에서는 이 결정을 사용자에게 맡겼다.
다음은 현재 내 파일이다. 맨 아래 줄을 추가해 줌으로써 플러그인을 활성화 시켰다.
```yaml
# Use the following plug-ins
plugins: 
  - jekyll-sitemap  # Create a sitemap using the official Jekyll sitemap gem
  - jekyll-feed     # Create an Atom feed using the official Jekyll feed gem
  ...
  - jekyll-paginate-v2 # plugins 밑에 대충 추가한다.
```

### Config Jekyll-paginate
플러그인을 사용하도록 설정했다면 paginate 자체에 대한 설정을 해주어야 하는데, 이 역시 `_config.yml`파일에서 해주면 된다. 파일 내 어느 위치에 넣어도 상관없다.
```yaml
# Paginate config
pagination:
  enabled: true
  per_page: 4
  sort_reverse: true
  title: ':title'
  permalink: '/page/:num_'
  trail: 
    before: 2
    after: 2
```

각 의미는 다음과 같다:
- `enabled`: 활성화 여부
- `per_page`: 한 페이지에 표시할 최대 post의 개수
- `sort_reverse`: 시간 기준 정렬 여부, `true`로 해야 최신 포스트가 1페이지에 등장한다.
- `title`: 페이지 타이틀, `:title`을 통해 원래 있던 타이틀로 덮어썼다.
- `permalink`: Url 에 페이지가 어떻게 보여질지를 설정한다. `:num`은 선택된 페이지 이름이다.
- `trail`: 내가 선택한 페이지 외에 앞 뒤(`before`, `after`)로  몇 개씩 다른 페이지를 노출할 지를 결정한다. 

예를 들어, 만약 내가 작성한 총 포스트의 개수가 10개인데 `per_page`가 4로 설정되었다면 paginator는 총 3개의 페이지를 만들어내게 되고, 그 중 마지막 페이지의 포스트 개수는 2개이다. 또, 그 페이지의 url은 `/page/2_index`가 될 것이다. 

#### Tip: permalink
Jekyll에서 기본적으로 파일을 읽어들이는 기준이 `index.html`이기 때문에 `permalink`가 예상한대로 동작하지 않을 수 있다.
만약 `permalink`를 `/page/:num/`으로 설정한다면 이는 default 값이므로 설정하지 않아도 되며, 페이지 url은 `/page/3/index.html`따위의 형식이 된다. 주의해야 할 점은, `/page/:num/`처럼 맨 뒤에 '/'를 붙이게 될 경우 ".html"같은 확장자가 따라 붙게 된다. 하지만 그렇다고 해서 '/'를 빼게 되면 확장자가 달라붙지 않는 대신 위에 이야기 한 것처럼 'index'가 달라붙게 된다. 어느 쪽이든 예뻐보이지 않지만, 개인적으로는 확장자가 달라붙는 게 더 싫어서 '/'를 제거했다.

### Embed paginator
이제 설정을 모두 끝마쳤으니, 직접 블로그에 pagination을 구현할 차례다. 대충 pagination을 구현할 페이지는 아래와 같이 생겼다. 통상적으로 `blog.html`혹은 `page.html` 이라는 파일명을 사람들이 자주 사용하는 듯 하다. 어느 쪽이든 파일 안에 `site.posts`가 있는 지 확인한다.
<!-- {% raw %} -->
```html
<div id="main" role="main" class="container">
  <div class="posts">
    {% for post in site.posts %}
      <article class="post">
        <h4 class="blog_title">
          <a href="{{ site.baseurl }}{{ post.url }}">
            {{ post.title }}
          </a>
        </h4>

        <div class="date"> 
          <i class="fa fa-calendar-check-o" aria-hidden="true"></i> 
          {{ post.date | date: "%-d %B %Y"}} 
        </div>

        <div class="entry opacity_gradient">
          {{ post.content | markdownify | strip_html | truncatewords: 50 }}
        </div>

        <a href="{{ site.baseurl }}{{ post.url }}" class="read-more">Read More</a>
      </article>
    {% endfor %}
  </div>
</div>
```
<!-- {% endraw %}) -->

이제 코드 상에 있는 <!-- {% raw %} -->`{% for post in site.posts %}`<!-- {% endraw %}) --> 안의 `site.posts`를 `paginator.posts`로 바꿔주면 기존에 있던 모든 post 들이 아닌, paginator가 관리하는 post들이 뿌려지게 된다.

이제 위 파일과 매칭되는 markdown 파일을 수정하자. 아래는 내 `blog.md`이다.
<!-- {% raw %} -->
```markdown
---
layout: blog
permalink: /blog/
pagination:
  enabled: true
---
```
<!-- {% endraw %}) -->

의외로 별로 어렵지 않게 구현되는 듯 하지만, 아직 한 가지가 더 남았다. 아직 이전 페이지나 다음 페이지로 갈 수 있을 만한 링크가 없어서 사용자들이 불편하게 느낄 것이기 때문이다. 

### Pagination link
`_includes` 폴더 아래 다음과 같은 `pagination.html`를 생성하자. 아래는 직접 작성한 내용으로, 복사한 뒤 css와 같은 세부 내용을 수정해도 좋다.
<!-- {% raw %} -->
```html
{% if paginator.total_pages > 1 %}
  <div class='pagination'>
    {% if paginator.previous_page %}
      <a href="{{ paginator.previous_page_path | prepend: site.baseurl }}">
        &laquo; Prev
      </a>
    {% else %}
      <span>&laquo; Prev</span>
    {% endif %}

    {% if paginator.page_trail %}
      {% for trail in paginator.page_trail %}
        <span {% if paginator.page  == trail.num %} class="pagination-selected" {% endif %}>
          <a href="{{ trail.path | prepend: site.baseurl }}" title="{{ trail.title }}">
            {{ trail.num }}
          </a>
        </span>
      {% endfor %}
    {% endif %}

    {% if paginator.next_page %}
      <a href="{{ paginator.next_page_path | prepend: site.baseurl }}">
        Next &raquo;
      </a>
    {% else %}
      <span>Next &raquo;</span>
    {% endif %}
  </div>
  {% endif %}
</div>

<style lang="scss">
  .pagination {
    margin: auto;
    text-align: center;
    display: block;
    font-size: 1.1rem;
    font-weight: bold;
    padding: 55px 0 25px 0;
    color: #999;
  }
  span.pagination-selected {
    display: inline-block;
    font-size: 1.3rem;
  }
</style>
```
<!-- {% endraw %}) -->
코드가 워낙 간단하니 설명을 생략했다. 질문이 있다면 댓글을 이용바란다. 

아직 끝난 것이 아니다. 여러분이 `site.posts`를 바꿔주었던 파일로 돌아가 아래를 삽입해주어야 pagination이 보일 것이다.
<!-- {% raw %} -->
```markdown
{% include pagination.html %}
```
<!-- {% endraw %}) -->

### Conclusion
이상으로 Jekyll 사이트에 페이지네이션을 구현해 보았다. `jekyll-paginate-v2` 플러그인은 이 포스트에 나와있는 내용보다 훨씬 더 많은 기능을 제공하는데,  infinite scroll,  auto pager 와 같은 기능들을 찾고 계신 분은 [여기를](https://github.com/sverrirs/jekyll-paginate-v2/blob/master/README-GENERATOR.md) 참고하시면 좋을 듯하다. 이 포스트도 해당 글을 참고하여 작성되었다.