# Jaeyoung Tech

AI 인프라를 공부하는 대학원생의 기술 블로그. Hugo + [PaperMod](https://github.com/adityatelange/hugo-PaperMod) 로 만들고 GitHub Actions 로 GitHub Pages 에 배포한다.

- 사이트: https://mkpong.github.io/
- 배포 워크플로: [`.github/workflows/hugo.yml`](.github/workflows/hugo.yml)

## 요구 사항

| 항목 | 값 | 비고 |
|---|---|---|
| Hugo | **v0.165.0 extended** | 워크플로의 `HUGO_VERSION` 과 동일하게 유지. `hugo version` 출력에 `+extended` 가 있어야 함 |
| Git | submodule 지원 버전 아무거나 | 테마가 submodule |

`apt` 의 hugo 는 버전이 낮고 extended 빌드가 아니므로 쓰지 않는다.

### Hugo 설치 (Linux x86_64, sudo 불필요)

```bash
HUGO_VERSION=0.165.0
cd "$(mktemp -d)"
curl -LO "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.tar.gz"
tar -xzf "hugo_extended_${HUGO_VERSION}_linux-amd64.tar.gz" hugo
install -m 755 hugo ~/.local/bin/hugo     # ~/.local/bin 이 PATH 에 있어야 함
hugo version
```

sudo 가 가능하면 같은 릴리스 페이지의 `.deb` 를 `sudo dpkg -i` 로 설치해도 된다.

## 새로 clone 해서 시작하기

```bash
# 1. submodule(테마) 포함해서 clone
git clone --recurse-submodules https://github.com/mkpong/mkpong.github.io.git
cd mkpong.github.io

# 2. 테마가 받아졌는지 확인 — 파일 목록이 보여야 함
ls themes/PaperMod/

# 3. 로컬 서버
hugo server -D          # -D: draft 글도 표시
# → http://localhost:1313/
```

이미 `--recurse-submodules` 없이 clone 해서 `themes/PaperMod/` 가 비어 있다면:

```bash
git submodule update --init --recursive
```

빈 상태로 `hugo` 를 실행하면 `module "PaperMod" not found` 류의 오류가 난다.

### 저장소에 없는 것 (재생성됨, `.gitignore` 대상)

| 경로 | 설명 |
|---|---|
| `public/` | `hugo` 빌드 결과물. 배포는 CI 가 직접 빌드하므로 로컬 결과물은 사용되지 않음 |
| `resources/_gen/` | Hugo Pipes 캐시 (CSS 병합·핑거프린트 등). 빌드 시 자동 생성 |
| `.hugo_build.lock` | `hugo` / `hugo server` 실행 중에만 존재하는 잠금 파일 |

Hugo 바이너리 자체도 저장소 밖(`~/.local/bin`)에 있으므로 다른 컴퓨터에서는 위 설치 절차를 다시 해야 한다.

## 사이트 구성

| 경로 | 내용 | 어디서 고치나 |
|---|---|---|
| 모든 페이지 왼쪽 | **사이드바**: 프로필(사진·이름·역할·한 줄 소개·소셜 링크·글/카테고리/태그 수) + 카테고리 + 시리즈 + 태그. 860px 이하에서는 본문 위로 접힘 | `hugo.toml` 의 `[params.profile]`, `[params.sidebar]` / 템플릿은 `layouts/_partials/sidebar.html`, 2단 레이아웃은 `layouts/baseof.html` |
| `/` | 최근 글 목록 (페이지네이션) | `layouts/home.html` |
| `/about/` | 소개, 관심 분야, 이력 타임라인, 논문 목록, 기술 스택, 연락처 | `content/about/index.md` |
| `/posts/` | 글 목록 | `content/posts/` |
| `/categories/`, `/tags/`, `/series/` | 분류 페이지 | 글 front matter 의 `categories` / `tags` / `series` |
| `/archives/` | 연·월별 목록 | `content/archives.md`, `layouts/archives.html` |
| `/search/` | 검색 (Fuse.js, `index.json` 기반) | `content/search.md`, `hugo.toml` 의 `[params.fuseOpts]` |
| 글 페이지 | 1300px 이상에서 오른쪽 고정 목차(현재 섹션 강조), 상단 읽기 진행 바, 작성일·수정일·읽는 시간, 이전/다음 글 | `layouts/_partials/extend_footer.html`(스크립트), `post_meta.html`, `post_nav_links.html`, CSS 는 `site.css` |
| 글 하단 | 시리즈 내비게이션, 함께 읽기(관련 글), 댓글(giscus) | `layouts/_partials/extend_post_content.html`, `comments.html` |
| 404 | 홈/검색/아카이브로 안내 | `layouts/404.html` |

### 사이드바 프로필 수정

`hugo.toml` 의 `[params.profile]`:

```toml
[params.profile]
  name = "Jaeyoung"
  role = "AI Infrastructure · Graduate Student"
  tagline = "한 줄 소개 (마크다운 가능)"
  bio = """여러 줄 소개"""
  avatar = "https://github.com/mkpong.png"   # 또는 static/images/avatar.jpg → "/images/avatar.jpg"
```

`interests` 는 현재 사이드바에서 사용하지 않는다(소개 페이지에 관심 분야 섹션이 있음).

소셜 링크는 `[[params.socialIcons]]` (github, email, rss, linkedin, x 등 PaperMod 가 지원하는 이름).

### 소개 페이지의 이력 타임라인

`content/about/index.md` 에서 shortcode 로 작성한다. 현재 들어 있는 항목은 **자리표시자**이므로 실제 이력으로 바꿔야 한다.

```markdown
{{< timeline >}}
{{< tl-item date="2026.03 – 현재" title="OO대학교 석사과정" sub="OO 연구실" >}}
설명 (마크다운, 생략 가능)
{{< /tl-item >}}
{{< /timeline >}}
```

### 댓글 (giscus)

1. 저장소 Settings > General > Features 에서 **Discussions** 활성화
2. https://github.com/apps/giscus 앱을 저장소에 설치
3. https://giscus.app 에서 저장소를 입력하면 나오는 `data-repo-id`, `data-category`, `data-category-id` 값을 `hugo.toml` 의 `[params.giscus]` 에 채운다

`repo` 가 비어 있는 동안에는 댓글 영역이 렌더링되지 않는다.

## 글 쓰기

```bash
hugo new posts/my-post.md     # archetypes/posts.md 템플릿 사용, draft: true 로 생성
```

Front matter 주요 항목:

| 키 | 설명 |
|---|---|
| `draft` | `true` 면 배포에서 제외. 발행할 때 `false` 로 |
| `description` | 목록·검색·SNS 미리보기에 쓰이는 한 줄 요약 |
| `tags`, `categories` | 분류. 홈과 분류 페이지에 집계됨 |
| `series` | 같은 이름의 글끼리 묶여 글 하단에 시리즈 내비게이션이 생김 |
| `showToc` | 목차 표시 |
| `math` | `true` 면 KaTeX CSS 로드 (수식이 감지되면 자동으로도 로드되지만 명시하는 편이 안전) |
| `hiddenInHomeList` | `true` 면 홈 "최근 글"에서 제외 |
| `lastmod` | 보통 생략. `enableGitInfo` 로 파일의 마지막 커밋 시각이 자동으로 쓰이며, 작성일보다 하루 이상 뒤면 "Updated …" 으로 표시됨 |

### 카테고리 / 시리즈 정의

사이드바와 `/categories/`, `/series/` 페이지는 `content/categories/<name>/_index.md`, `content/series/<name>/_index.md` 로 정의된 항목을 보여준다. **글이 아직 없는 카테고리도 여기에 `_index.md` 만 만들면 표시된다.**

```yaml
# content/categories/kubernetes/_index.md
---
title: "Kubernetes"
description: "카드와 사이드바 툴팁에 쓰이는 한 줄 설명"
weight: 10        # 작을수록 위. 없으면 맨 뒤
---
```

글의 front matter 에서 `categories: ["Kubernetes"]` 처럼 **title 과 같은 이름**을 쓰면 그 카테고리에 묶인다. `_index.md` 없이 글에서만 쓴 카테고리도 자동 생성되지만 설명과 순서는 지정할 수 없다.

### 본문에서 쓸 수 있는 것

- **코드 블록**: ` ```python ` 등 언어 지정. Hugo 내장 Chroma 로 빌드 시 하이라이팅
- **Mermaid**: ` ```mermaid ` 코드 펜스. 해당 글에서만 스크립트가 로드되고 다크 모드 토글에 맞춰 다시 그려짐
- **수식**: `$$ … $$` / `\[ … \]` (블록), `$ … $` / `\( … \)` (인라인). 빌드 시 KaTeX HTML 로 변환되므로 브라우저 JS 불필요
  - 본문에 달러 기호(`$5`)를 자주 쓴다면 `hugo.toml` 의 `passthrough.delimiters.inline` 에서 `['$', '$']` 를 제거할 것
- **타임라인**: 위 `timeline` / `tl-item` shortcode (소개 페이지 외에서도 사용 가능)
- **논문 목록**: `pubs` / `pub` shortcode. `title`, `venue` 필수, `type`(Poster 등)·`note`(2nd author 등)·`award`·`status`(Under review 등)·`url` 선택

"함께 읽기"는 `hugo.toml` 의 `[related]` 가중치(series > tags > categories > date)로 고른다.

렌더링 확인용 샘플: [`content/posts/hello-world.md`](content/posts/hello-world.md)

## 배포

`main` 에 push 하면 `.github/workflows/hugo.yml` 이 실행된다 (`build` → `deploy`, 1~2분).

- 진행 상황: https://github.com/mkpong/mkpong.github.io/actions
- GitHub 저장소 Settings > Pages > Source 는 **GitHub Actions** 여야 한다
- 워크플로는 `submodules: recursive` 로 체크아웃하고, `HUGO_VERSION` 에 지정된 extended 빌드를 설치해 `hugo --gc --minify` 로 빌드한다

## 프로젝트 구조

```
.
├── hugo.toml                          # 사이트 설정 (프로필, 메뉴, 검색, 관련 글, 댓글, 수식 passthrough)
├── content/
│   ├── about/index.md                 # 소개 페이지
│   ├── posts/                         # 글 (_index.md 는 섹션 제목)
│   ├── categories/, tags/, series/    # 분류 페이지 제목 + 개별 카테고리 정의 (<name>/_index.md)
│   ├── search.md                      # 검색 페이지 (PaperMod Fuse.js)
│   └── archives.md                    # 아카이브 페이지
├── i18n/ko.yaml                       # 테마 UI 문구를 영어로 덮어씀 (목차, 읽는 시간, 복사 등)
├── archetypes/posts.md                # hugo new posts/... 템플릿
├── assets/css/extended/
│   ├── typography.css                 # 한글 타이포그래피 (Pretendard, keep-all, line-height 1.7)
│   └── site.css                       # 2단 레이아웃, 사이드바, 글 목록, 시리즈, 타임라인, 함께 읽기, 404
├── layouts/
│   ├── baseof.html                    # 테마 baseof 오버라이드: 사이드바 + 본문 2단 레이아웃, 본문 건너뛰기 링크, 푸터 캐시 해제
│   ├── archives.html                  # 테마 오버라이드: 월 그룹 표기
│   ├── taxonomy.html                  # 테마 오버라이드: 글 0개인 카테고리도 표시, 설명 카드
│   ├── home.html                      # 홈 (글 목록)
│   ├── 404.html
│   ├── _partials/
│   │   ├── sidebar.html               # 왼쪽 사이드바 (프로필·카테고리·시리즈·태그)
│   │   ├── extend_head.html           # Pretendard 폰트, KaTeX CSS 로드
│   │   ├── extend_footer.html         # Mermaid 로더, 읽기 진행 바, 목차 현재 섹션 강조
│   │   ├── extend_post_content.html   # 시리즈 내비게이션, 함께 읽기
│   │   ├── post_meta.html             # 테마 오버라이드: 수정일 표시
│   │   ├── post_nav_links.html        # 테마 오버라이드: "Previous / Next"
│   │   └── comments.html              # giscus
│   ├── _shortcodes/                   # timeline, tl-item, pubs, pub
│   └── _markup/
│       ├── render-codeblock-mermaid.html  # ```mermaid → <pre class="mermaid">
│       └── render-passthrough.html        # 수식 → transform.ToMath (빌드 시 KaTeX)
├── static/                            # favicon.svg + PNG 파비콘 (16/32/180px)
├── themes/PaperMod/                   # git submodule
└── .github/workflows/hugo.yml         # GitHub Pages 배포
```

PaperMod 는 Hugo 신규 레이아웃 구조(`layouts/_partials/`, `layouts/_markup/`, `layouts/_shortcodes/`)를 쓰므로 테마 오버라이드도 같은 경로에 둔다.

## 테마 업데이트

```bash
git submodule update --remote --merge themes/PaperMod
hugo server            # 깨진 곳 없는지 확인 (특히 layouts/ 오버라이드와 CSS 변수)
# 오버라이드한 테마 파일에 변경분 반영
for f in baseof.html archives.html taxonomy.html _partials/post_meta.html _partials/post_nav_links.html; do
  diff themes/PaperMod/layouts/$f layouts/$f
done
git add themes/PaperMod
git commit -m "Update PaperMod"
```

## 알려진 경고 / 미구현

- `layouts/_partials/footer.html` 은 테마가 `partialCached` 로 캐시하지만, 이 사이트의 `baseof.html` 은 캐시 없이 호출한다. Mermaid 로더와 읽기 진행 바가 페이지별 조건에 의존하기 때문이다.
- 빌드 시 나오는 `.Language.LanguageCode` / `.Language.LanguageDirection` deprecated WARN 은 PaperMod 테마 내부 코드에서 나오는 것으로, 이 저장소에서 고칠 수 없고 빌드에 영향도 없다.
- SNS 공유용 기본 OG 이미지가 없다. `static/images/og.png` 를 만들고 `hugo.toml` 에 `params.images = ["/images/og.png"]` 를 추가하면 된다.
