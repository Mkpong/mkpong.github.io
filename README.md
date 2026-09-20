# Jaeyoung — CV

Hugo 로 만든 문서형 단일 페이지 이력서 사이트. 한국어(`/`)와 영어(`/en/`) 두 버전을 빌드하고, GitHub Actions 로 GitHub Pages 에 배포한다.

- 사이트: https://mkpong.github.io/ (영어: https://mkpong.github.io/en/)
- 배포 워크플로: [`.github/workflows/hugo.yml`](.github/workflows/hugo.yml)

## 내용 수정하기

**모든 내용은 `data/cv/` 의 YAML 두 파일에 있다.** 템플릿을 건드릴 일은 거의 없다.

| 파일 | 언어 |
|---|---|
| `data/cv/ko.yaml` | 한국어 (`/`) |
| `data/cv/en.yaml` | 영어 (`/en/`) |

두 파일은 구조가 같다. 한쪽을 고치면 다른 쪽도 같이 고칠 것.

```yaml
profile:        # 상단 헤더: 이름, 한 줄 소개, 소속, 연락처, focus(해시태그로 표시)
summary:        # 자기소개 (마크다운)
experience:     # 경력 — role / org / period / bullets / tags
education:      # 학력 — 형식은 experience 와 동일
publications:   # 논문 — title / venue / year / type / award / status / note / url / korean / title_en
awards:         # 수상 — name / org / year
projects:       # 프로젝트 — items 가 비어 있으면 섹션 자체가 숨겨짐
activities:     # 발표·멘토링 등 — projects 와 동일
skills:         # 기술 — groups: [{name, items}]
meta:           # UI 문구 (건너뛰기, PDF 저장, 테마 등)
```

- `items: []` 인 섹션은 화면과 상단 내비게이션에서 사라진다.
- `summary.body` 와 `bullets` 는 마크다운을 쓸 수 있다.
- 논문 `type` 은 `journal` / `international` / `domestic` / `poster` 중 하나. 배지 문구는 `publications.labels` 에서 바꾼다.
- 한국어 논문은 `korean: true` 로 표시하면 영어판에서 `in Korean` 배지가 붙고, `title_en` 이 있으면 영문 제목이 부제로 나온다.
- 항목에 `url` 을 넣으면 제목이 링크가 된다.
- 프로필 사진은 `hugo.toml` 의 `params.avatar` (기본: GitHub 아바타). 직접 올리려면 `static/images/` 에 넣고 `/images/...` 로 지정.
- 섹션 순서는 `layouts/home.html` 의 `$order` 와 섹션 블록 순서에 고정돼 있다.
- `experience` 등의 `tags` 는 항목 아래에 `#해시태그` 로 표시된다.

## 로컬에서 보기

### 요구 사항

| 항목 | 값 | 비고 |
|---|---|---|
| Hugo | **v0.165.0 extended** | 워크플로의 `HUGO_VERSION` 과 동일하게 유지 |

```bash
# Linux x86_64, sudo 불필요
HUGO_VERSION=0.165.0
cd "$(mktemp -d)"
curl -LO "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.tar.gz"
tar -xzf "hugo_extended_${HUGO_VERSION}_linux-amd64.tar.gz" hugo
install -m 755 hugo ~/.local/bin/hugo     # ~/.local/bin 이 PATH 에 있어야 함
hugo version
```

### 실행

```bash
git clone https://github.com/mkpong/mkpong.github.io.git
cd mkpong.github.io
hugo server
# → http://localhost:1313/      (한국어)
# → http://localhost:1313/en/   (영어)
```

테마나 submodule 은 없다. clone 만 하면 된다.

### 저장소에 없는 것 (재생성됨, `.gitignore` 대상)

| 경로 | 설명 |
|---|---|
| `public/` | 빌드 결과물. 배포는 CI 가 직접 빌드 |
| `resources/_gen/` | Hugo Pipes 캐시 (CSS/JS 압축·핑거프린트) |
| `.hugo_build.lock` | 빌드 중에만 존재하는 잠금 파일 |

## 기능

- **한/영 토글** — 헤더의 `KO | EN`. Hugo 다국어로 두 페이지를 따로 빌드하며(`hreflang` 포함), 선택한 언어는 브라우저에 기억되어 다음 방문 때 자동으로 그 언어로 열린다.
- **다크 모드** — 시스템 설정을 따르고, 헤더 버튼으로 고정할 수 있다.
- **PDF 저장** — 오른쪽 위 인쇄 버튼 → 브라우저의 "PDF로 저장". 인쇄 전용 스타일이 적용된다(컨트롤·섹션 링크 제거, 링크 주소 표기).
- 접근성: 본문 건너뛰기 링크, 시맨틱 섹션, `prefers-reduced-motion`.

## 배포

`main` 에 push 하면 `.github/workflows/hugo.yml` 이 실행된다 (`build` → `deploy`, 1~2분).

- 진행 상황: https://github.com/mkpong/mkpong.github.io/actions
- GitHub 저장소 Settings > Pages > Source 는 **GitHub Actions** 여야 한다

## 프로젝트 구조

```
.
├── hugo.toml                  # 사이트 설정, 다국어(ko/en) 정의
├── data/cv/
│   ├── ko.yaml                # 한국어 내용
│   └── en.yaml                # 영어 내용
├── content/
│   ├── _index.ko.md           # 홈 페이지 스텁 (내용은 data 에서)
│   └── _index.en.md
├── layouts/
│   ├── baseof.html            # 문서 뼈대
│   ├── home.html              # CV 페이지: 헤더(이름·연락처) + 섹션 링크 + 섹션
│   ├── 404.html
│   └── _partials/
│       ├── head.html          # meta, hreflang, 파비콘, 폰트, CSS
│       ├── header.html        # 오른쪽 위 컨트롤: KO/EN, 테마, 인쇄
│       ├── footer.html
│       ├── entries.html       # 경력/학력/프로젝트/활동 타임라인
│       ├── publications.html  # 논문 목록 + 배지
│       ├── awards.html
│       ├── skills.html
│       └── icon.html          # 인라인 SVG 아이콘
├── assets/
│   ├── css/main.css           # 스타일 (라이트/다크/인쇄, Pretendard)
│   └── js/main.js             # 테마·언어 토글, 인쇄
├── static/                    # 파비콘 (svg + png 16/32/180)
└── .github/workflows/hugo.yml
```

## 이전 블로그 버전

이 저장소는 원래 PaperMod 기반 블로그였다. 그 버전은 커밋 `c29bae7` 까지의 히스토리에 남아 있다.
