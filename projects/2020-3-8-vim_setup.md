---

layout: post
title: 개발자를 위한 vim 설정하기
category: [vim]
author: hyungsun
image: assets/images/vim_setup.png
---

## Vim
텍스트 에디터는 개발자에게 떼어낼래야 뗄 수 없는 존재다. 따라서 개발자들은 텍스트 파일을 편집할 때나 심지어는 코딩할 때 곧잘 [Vim](https://github.com/vim/vim)을 애용하곤 한다.
vim은 정말 가볍고 강력한 텍스트 에디터이며, 무엇보다 커스터마이징이 자유롭기 때문에 사용자의 입맛에 맞게 사용이 가능하다는 점이 참 매력적이다.

이 글에서는 어떻게 하면 vim 을 지지고 볶아서 내게 맞게 최적화를 시킬 것인가? 에 대한 내용을 다룰 것이다.

## vimrc file setup
vim은 기본적으로 켜질 때마다 세팅을 새로 불러온다. 그 불러오는 세팅은 보통 홈 디렉토리의 `.vimrc` 파일에 저장되어 있다.
8버전 이상의 vim에서는 홈 디렉토리의 `.vim`안에 있는 `vimrc`도 불러오는 기능이 추가되었는데, 보통 플러그인 파일들이 `~/.vim`안에 저장되므로 사용하지 않을 이유가 없는 좋은 기능이다.
이 말은 곧 나중에 다른 환경에서 내가 사용하던 설정을 그대로 가져가려면 이제 `~/.vim` 디렉토리만 복사하면 된다는 뜻이기 때문이다.
간단하게 다음 명령어로 디렉토리부터 만들어주자.
```bash
$ mkdir ~/.vim
$ mv ~/.vimrc ~/.vim/vimrc 2>/dev/null
```

이제 우리는 `vimrc`를 열어 수정해주면 된다!
```bash
$ vim ~/.vim/vimrc
```

우선 간단하게 플러그인 없이도 설정할 수 있는 부분들을 설정해보자. 아래에서 소개된 것들 외에 Vim 설정에 대한 자세한 설명을 보고 싶다면 
[document](http://vimdoc.sourceforge.net/htmldoc/options.html) 를 참고하자.

### Indent options
```
set autoindent " New lines inherit the indentation of previous lines.
set tabstop=2 " Indent using two spaces.
set expandtab " Convert tabs to spaces.
set shiftwidth=2 " When shifting, indent using four spaces.
set shiftround " When shifting lines, round the indentation to the nearest multiple of “shiftwidth.”
set smarttab " Insert “tabstop” number of spaces when the “tab” key is pressed.
```
여기서 크게 특별한 부분은 없다. 다만 나는 탭 사이즈가 2인 편이 여러모로 작업하는데 편리해서 2로 설정해 두었는데, 만약 4로 설정하고 싶으신 분들은 `" Indent
 options` 아래에서 2를 전부 4로 바꿔주면 되겠다.

### Search options
```
set hlsearch " Highlight searched keyword
nnoremap i :noh<cr>i
nnoremap o :noh<cr>o
nnoremap O :noh<cr>O
set incsearch " Incremental search that shows partial matches.
set ignorecase " Automatically switch search to case-sensitive when search query contains an uppercase letter.
```
`hlsearch`는 vim 안에서 검색을 했을 때 검색에서 하이라이팅을 해주는 기능이다. 
vim에서 검색을 하다보면 아래처럼 하이라이팅이 되는데, 이걸 끌 수 있는 방법이 `:set noh` 명령어를 치는 것이다. 이건 너무 길고 복잡해서 사용하기 끔찍하다.
<p align="center">
  <img src="{{ site.url }}/assets/images/vim_setup_2.png">
</p>
때문에 아래 3개의 nnoremap으로 insert모드로 진입하는 과정에서 하이라이팅을 토글하도록 했다. 이제 insert모드로 진입하면 검색어 하이라이팅은 모두 꺼진다.

### Performance options 
```
set complete-=i " Limit the files searched for auto-completes.
set lazyredraw " Don’t update screen during macro and script execution.
```
여긴 딱히 설명할 부분이 없다. 주석을 읽어보자.

### Text rendering options
```
set display+=lastline " Always try to show a paragraph’s last line.
set fileencodings=utf-8 " Set file encoding
syntax enable
```
여기도 마찬가지로 설명할 부분이 없다. 주석을 참고하자!

### UI options
```
set laststatus=2 " Always display the status bar.
set ruler " Always show cursor position.
set wildmenu " Display command line’s tab complete options as a menu.
set tabpagemax=50 " Maximum number of tab pages that can be opened from the command line.
set number " Show line number
set noerrorbells " Disable beep on errors.은
set title " Set the window’s title, reflecting the file currently being edited.
" Only for unix users.
set mouse=a " Enable mouse for scrolling and resizing.
" vim-gtk is needed at this point
vmap <C-c> "+y
map <C-v> "+p
imap <C-v> <esc><C-v>
```
Only for unix users 이하 부분은 우분투 환경에서만 해당된다. mac에서는 또 다른 해결책이 필요한 것으로 보이는데, 아직 알아보진 못했다.
`set mouse=a`라는 옵션은 vim안에서 스크롤링을 도와주기도 하지만, 마우스 드래깅을 통해 Visual 모드로 진입하는 효과도 포함한다.
나는 기껏해야 마우스로 드래깅해서 복사 붙여넣기를 하는게 비쥬얼 모드 사용의 전부기 때문에 나와 비슷한 사람들에게는 위 옵션이 효과적일 것이다.
`set mouse` 아래에 있는 매핑옵션들을 이해하려면 vim에서는 클립보드를 2가지 쓰고 있다는 것부터 알아야 한다. 
이 글을 읽는 사람들이 매핑 옵션에 대해 크게 관심있는 사람들일 것 같지 않으므로 그냥 한 줄 요약으로 설명드리자면, yank는 vim의 클립보드로, copy는 시스템의 클립보드로 매핑시켜 두었다고 보면 된다.
즉 마우스로 드래그 한 영역을 Ctrl + c키로 copy하는 건 시스템 클립보드에, `yy` 로 yank하는 건 vim 내부에서만 쓰이도록 했다.

테스트 환경 우분투(18.04)고, Ctrl + c 키를 매핑하는 과정에서 vim-gtk 를 연결해주어야 한다.
연결해 주는 작업은 아래 명령어로 간단히 할 수 있다.
```bash
$ sudo update-alternatives --config vim
```
자신이 Visual 모드를 잘 사용하지 않고 위와 같은 작업이 번거롭다면 `set mouse=a` 부터 아래 매핑 옵션까지(`imap` 으로 시작하는 부분까지)를 쓰지 않아도 좋다. 

### Miscellaneous Options
```
set autoread " Automatically re-read files if unmodified inside Vim.
```
기타 잡다한 옵션이다.

## Vim plugin 
위에서 기본적인 설정을 마쳤다면, 이제 좀 더 입맛에 맞게 color scheme 같은 걸 바꾸고 싶을 것이다. 예전에는 vim color file을 다운받아서 vim
디렉토리 안으로 옮겨주는 번거로운 작업을 해야 했지만, 이제는 플러그인을 통해 간단히 설치 및 적용이 가능하다.

### Vim plugin manager
어썸한 플러그인 설치에 앞서 plugin manager에 대한 개념을 짚고 가자. plugin manager
는 종류가 상당히 많다. 때문에 그걸 전부 설명하는 건 이 포스팅의 범주를 넘어가므로 가장 많이 쓰이는 2가지를 꼽아 설명드려야겠다.
바로 [Vundle](https://github.com/VundleVim/Vundle.vim)과 [vim-plugin](https://github.com/junegunn/vim-plug)이다.
 
장단점이 있는데, 서로 완벽한 트레이드 오프라 어떤 걸 사용할 지 심사숙고해 볼 만하다. 이 글에서는 vim-plugin 을 사용했다. 그 이유는 vim-plugin
이 훨씬 빠르고 무엇보다 요새 점점 많이 쓰이는 추세이면서 [한국인](https://github.com/junegunn)이 만들었기 때문이다. 
이 분은 이번 포스팅을 하면서 처음 알게 됐는데, vim 이라는 영역에 있어서는 고수 중의 고수 반열에 오르신 분 같았다.
Vundle은 앞선 장점들을 살짝 내려놓는 반면, 가장 오래된 매니져기 때문에 더 많은 플러그인 풀을 보유하고 있다.
요즘 나오는 플러그인들은 Vundle이나 vim-plugin 외에도 여러가지 플러그인 매니져를 한꺼번에 쓸 수 있게 나오는 경우가 많기 때문에 플러그인 풀을 vim-plugin을 쓴다고 해서 크게 걱정할 것은 없다.

vim-plugin에는 지원하는 옵션들이 많지만, 이 글에서는 필요한 부분만 짚고 넘어갈 것이므로 자세한 내용은 [README](https://github.com/junegunn/vim-plug)를 참고하시기 바란다.
먼저 `vimrc` 의 아랫부분에 다음을 추가한다.
```
if empty(glob('~/.vim/autoload/plug.vim'))
  silent !curl -fLo ~/.vim/autoload/plug.vim --create-dirs
    \ https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
  autocmd VimEnter * PlugInstall --sync | source $MYVIMRC
endif
```
이 스크립트는 vim-plug를 설치함과 동시에, 플러그인 중에 설치되지 않은 것들이 있다면 같이 설치해버린다.
그럼 설치할 플러그인들은 어떻게 등록하느냐? 만약 AAA라는 플러그인을 설치하고 싶다면, 다음과 같이 설정하면 된다. 
(**주의: 반드시 위 스크립트보다 하단 부에 위치해야 한다!**)
```
" Specify a directory for plugins
call plug#begin('~/.vim/plugged')

" Here you cat set your plug AAA!
Plug 'AAA'

" Initialize plugin system
call plug#end()
```
즉, call 사이에 원하는 플러그인을 `Plug some-plug`와 같은 형식으로 지정하면 된다.

### Vim plugin: color scheme
이제 본격적으로 Vim plugins를 설치해 보자. 뭐니뭐니해도 가장 중요한 건 color scheme 이다! [vimaweome](https://vimawesome.com/)에서 마음에 드는 테마를 골라보자.
일단 이 글에서는 [darcular](https://vimawesome.com/plugin/darcula-tree-and-truth)를 사용했다. (그것은 바로 내가 jetbrain IDE를 좋아하기 때문이다)
이 테마는 심지어 2020년에 나온거라, 최신 vim(8 버전 이상)에 찰떡궁합이다. 나처럼 jetbrain계열 IDE의 다큘라스타일에 익숙하신 분들이라면 추천드리고 싶다.

설치 역시 간편하다. 아래 설정을 Plugin설정 부분에 추가한다.
```
Plug 'doums/darcula'
```
이제 가장 하단 부에 다음을 추가하면 vimrc를 로드할 때 칼라스킴이 적용된다.
```
colo darcula
set termguicolors
```
참고로 `set termguicolors`는 색깔이 흐리멍텅하게 나오는 것을 막아주는 옵션이다.

추가적으로, IDE에서 컬럼 비쥬얼 가이드를 쓰는 사람들은 아래 옵션을 `colo darcula` 밑에 추가하면 좋다.
```
" TODO: Find a way to prevent syntax highlighting from being disabled over color-column.
highlight ColorColumn guibg=#2d2d2d 
let &colorcolumn="".join(range(100, 999),",")
```
위에 까지 설정을 했다면, vim의 생김새는 다음과 같을 것이다! (당신의 vim 에서도 당장 시험해보고 싶다면 `:source %` 와 `:PluginInstall` 을 해주어야 한다)

<p align="center">
  <img src="{{ site.url }}/assets/images/vim_setup_3.png">
</p>
100자 넘어가는 부분부터 배경색이 살짝 밝아지는 게 보이는가? 색이 마음에 안든다면 위에서 `#2d2d2d` 부분을 다른 색으로 수정해주면 된다.

사실 여기서 100자 넘어가는 부분은 syntax highlighting 이 살짝 망가지는데, 이 부분은 해결해야 할 이슈로 남겨두었다.  😭

### Vim plugin: nerd-tree
[너드트리](https://github.com/preservim/nerdtree)는 IDE처럼 왼쪽 사이드 바 형식으로 디렉터리 구조를 보여주는 플러그인이다. 백문이 불여일견이니 스크린샷부터 보도록 하자.
<p align="center">
  <img src="{{ site.url }}/assets/images/vim_setup_4.png">
</p>

나는 좀 더 편하게 너드트리를 쓰기 위해 여러가지 다음과 같은 고급 옵션을 맨 아래에 추가했다.
```
autocmd StdinReadPre * let s:std_in=1
autocmd VimEnter * if argc() == 1 && isdirectory(argv()[0]) && !exists("s:std_in") | exe 'NERDTree' argv()[0] | wincmd p | ene | exe 'cd '.argv()[0] | endif
autocmd bufenter * if (winnr("$") == 1 && exists("b:NERDTree") && b:NERDTree.isTabTree()) | q | endif
map <C-n> :NERDTreeToggle<CR>
let g:NERDTreeDirArrowExpandable = ''
let g:NERDTreeDirArrowCollapsible = ''
```
너드트리라는 게 사실 explore를 vim 윈도우로 여는 것이기 때문에 결국 내가 지금 edit하려고 하는 창이 하나도 남지 않았다면 바로 종료하도록 하는 옵션과
vim 에 넣어지는 인자가 폴더인 경우만 왼쪽에 너드트리가 뜨게 하는 옵션을 추가했다.
하지만 편집하다가 도중에 파일 tree가 보고싶을 수도 있으므로... `Ctrl + n`키를 눌러 디렉터리 구조 윈도우를 토글할 수 있게 했다.
마지막 두 줄은 디렉토리 구조에서 collapse된 애들과 expand된 애들 앞에 어떤 표시할까? 라는 내용인데 없는 게 제일 예뻐서 그냥 빼버렸다.

참고로 디렉토리 창과 에디터 창을 오가고 싶다면 `Ctrl + w + w`로 오가면 된다.

### Vim plugin: lightline
이제 플러그인 소개의 막바지에 다다랐다. 마지막으로 추천할만한 플러그인은 바로 [`lightline`](https://github.com/itchyny/lightline.vim)이다. 
이 플러그인이 해주는 일은 그저 아래에 다음과 같이 쿨한 막대가 생기게 하는 것이다.
<p align="center">
  <img src="{{ site.url }}/assets/images/vim_setup_5.png">
</p>

이 플러그인이 빛을 발하려면, 아래 추가 옵션을 세팅해 주어야 한다. 어차피 lightline에서 현재 모드를 보여주고 있기 때문에 vim 에서 보여주는 모드를 막아버리고, 대신 맨 마지막에 쳤던 vim 명령어를 그 자리에 대신 보여준다.
```
set noshowmode
```

아래는 위에서 나처럼 darcular 스킴을 쓰는 사람들을 위한 전용 ligtline옵션이다.
```
let g:lightline = { 'colorscheme': 'darculaOriginal' }
``` 

## Congratulations! Now enjoy your vim!
이제 다 끝났다. 이제 vim 을 껏다가 켜면 모든 게 적용되어 있을 것이다.

👏👏👏👏 👏👏👏👏 

 
vim을 설정하느라 고생한 당신에게 박수를 보낸다!
마지막으로 내가 쓰는 `vimrc`파일을 공개하며 글을 마치도록 하겠다. 

```
" Indent options
set autoindent " New lines inherit the indentation of previous lines.
set tabstop=2 " Indent using two spaces.
set expandtab " Convert tabs to spaces.
set shiftwidth=2 " When shifting, indent using four spaces.
set shiftround " When shifting lines, round the indentation to the nearest multiple of “shiftwidth.”
set smarttab " Insert “tabstop” number of spaces when the “tab” key is pressed.

" Search options
set hlsearch " Highlight searched keyword
nnoremap i :noh<cr>i
nnoremap o :noh<cr>o
nnoremap O :noh<cr>O
set incsearch " Incremental search that shows partial matches.
set ignorecase " Automatically switch search to case-sensitive when search query contains an uppercase letter.

" Performance options
set complete-=i " Limit the files searched for auto-completes.
set lazyredraw " Don’t update screen during macro and script execution.

" Text rendering options
set display+=lastline " Always try to show a paragraph’s last line.
set fileencodings=utf-8 " Set file encoding
syntax enable

" UI options
set laststatus=2 " Always display the status bar.
set ruler " Always show cursor position.
set wildmenu " Display command line’s tab complete options as a menu.
set tabpagemax=50 " Maximum number of tab pages that can be opened from the command line.
set number " Show line number
set noerrorbells " Disable beep on errors.은
set title " Set the window’s title, reflecting the file currently being edited.
" Only for unix users.
set mouse=a " Enable mouse for scrolling and resizing.
" vim-gtk is needed at this point
vmap <C-c> "+y
map <C-v> "+p
imap <C-v> <esc><C-v>

" Miscellaneous Options
set autoread " Automatically re-read files if unmodified inside Vim.

" Auto install plugins
if empty(glob('~/.vim/autoload/plug.vim'))
  silent !curl -fLo ~/.vim/autoload/plug.vim --create-dirs
    \ https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
  autocmd VimEnter * PlugInstall --sync | source $MYVIMRC
endif

" Specify a directory for plugins
call plug#begin('~/.vim/plugged')

" UI plugins
Plug 'preservim/nerdtree'

" Color themes
Plug 'doums/darcula'

" Lightline settings
Plug 'itchyny/lightline.vim'

" Language syntaxes
Plug 'leafgarland/typescript-vim'

" Initialize plugin system
call plug#end()

" Color scheme settings
colo darcula
set termguicolors
" TODO: Find a way to prevent syntax highlighting from being disabled over color-column.
highlight ColorColumn guibg=#2d2d2d 
let &colorcolumn="".join(range(100, 999),",")

" Nerdtree settings
autocmd StdinReadPre * let s:std_in=1
autocmd VimEnter * if argc() == 1 && isdirectory(argv()[0]) && !exists("s:std_in") | exe 'NERDTree' argv()[0] | wincmd p | ene | exe 'cd '.argv()[0] | endif
autocmd bufenter * if (winnr("$") == 1 && exists("b:NERDTree") && b:NERDTree.isTabTree()) | q | endif
map <C-n> :NERDTreeToggle<CR>
let g:NERDTreeDirArrowExpandable = ''
let g:NERDTreeDirArrowCollapsible = ''

" Lightline settings
set noshowmode
let g:lightline = { 'colorscheme': 'darculaOriginal' }
```
