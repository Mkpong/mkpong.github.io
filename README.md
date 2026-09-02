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

## 글 쓰기

```bash
hugo new posts/my-post.md     # archetypes/posts.md 템플릿 사용, draft: true 로 생성
```

Front matter 주요 항목:

| 키 | 설명 |
|---|---|
| `draft` | `true` 면 배포에서 제외. 발행할 때 `false` 로 |
| `showToc` | 목차 표시 |
| `math` | `true` 면 KaTeX CSS 로드 (수식이 감지되면 자동으로도 로드되지만 명시하는 편이 안전) |
| `tags`, `categories`, `series` | 분류 |

### 본문에서 쓸 수 있는 것

- **코드 블록**: ` ```python ` 등 언어 지정. Hugo 내장 Chroma 로 빌드 시 하이라이팅
- **Mermaid**: ` ```mermaid ` 코드 펜스. 해당 글에서만 스크립트가 로드되고 다크 모드 토글에 맞춰 다시 그려짐
- **수식**: `$$ … $$` / `\[ … \]` (블록), `$ … $` / `\( … \)` (인라인). 빌드 시 KaTeX HTML 로 변환되므로 브라우저 JS 불필요
  - 본문에 달러 기호(`$5`)를 자주 쓴다면 `hugo.toml` 의 `passthrough.delimiters.inline` 에서 `['$', '$']` 를 제거할 것

렌더링 확인용 샘플: [`content/posts/hello-world.md`](content/posts/hello-world.md)

## 배포

`main` 에 push 하면 `.github/workflows/hugo.yml` 이 실행된다 (`build` → `deploy`, 1~2분).

- 진행 상황: https://github.com/mkpong/mkpong.github.io/actions
- GitHub 저장소 Settings > Pages > Source 는 **GitHub Actions** 여야 한다
- 워크플로는 `submodules: recursive` 로 체크아웃하고, `HUGO_VERSION` 에 지정된 extended 빌드를 설치해 `hugo --gc --minify` 로 빌드한다

## 프로젝트 구조

```
.
├── hugo.toml                          # 사이트 설정 (메뉴, 검색, 하이라이팅, 수식 passthrough)
├── content/
│   ├── posts/                         # 글
│   ├── search.md                      # 검색 페이지 (PaperMod Fuse.js)
│   └── archives.md                    # 아카이브 페이지
├── archetypes/posts.md                # hugo new posts/... 템플릿
├── assets/css/extended/typography.css # 한글 타이포그래피 (Pretendard, keep-all, line-height 1.7)
├── layouts/
│   ├── _partials/extend_head.html     # Pretendard 폰트, KaTeX CSS 로드
│   ├── _partials/extend_footer.html   # Mermaid 로더 (다크 모드 대응)
│   └── _markup/
│       ├── render-codeblock-mermaid.html  # ```mermaid → <pre class="mermaid">
│       └── render-passthrough.html        # 수식 → transform.ToMath (빌드 시 KaTeX)
├── themes/PaperMod/                   # git submodule
└── .github/workflows/hugo.yml         # GitHub Pages 배포
```

PaperMod 는 Hugo 신규 레이아웃 구조(`layouts/_partials/`, `layouts/_markup/`)를 쓰므로 테마 오버라이드도 같은 경로에 둔다.

## 테마 업데이트

```bash
git submodule update --remote --merge themes/PaperMod
hugo server            # 깨진 곳 없는지 확인
git add themes/PaperMod
git commit -m "Update PaperMod"
```

## 알려진 경고

빌드 시 나오는 `.Language.LanguageCode` / `.Language.LanguageDirection` deprecated WARN 은 PaperMod 테마 내부 코드에서 나오는 것으로, 이 저장소에서 고칠 수 없고 빌드에 영향도 없다. 테마 업데이트로 해소될 때까지 무시한다.
