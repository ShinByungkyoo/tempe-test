# tempe-test — 자기진단 테스트

20문항으로 알아보는 성격 유형 자기진단 테스트 프로젝트. 각 문항의 4개 보기에 1~4점을 중복 없이 부여해 **주도형 / 섬세형 / 비범형 / 은둔형** 점수를 산출합니다.

이 저장소에는 두 가지 구현체가 들어 있습니다.

## 1) `self-diagnosis.html` — 단일 HTML 버전

빌드가 필요 없는 정적 HTML 파일 하나로 동작하는 버전입니다. 파일을 브라우저에서 열면 바로 설문을 풀 수 있으며, Tailwind와 Chart.js는 CDN에서 로드됩니다.

## 2) `webapp/` — Next.js 버전 (AI 해설 포함)

Next.js 15 App Router + TypeScript + Tailwind v3 기반으로, **Claude API(Haiku 4.5)** 를 연동해 다음 기능을 추가로 제공합니다.

- 점수 분포를 반영한 **AI 개인화 해설** (1·2위 점수차를 고려한 하이브리드 해석)
- 결과에 대한 **후속 질문 챗** (유형 정보를 시스템 프롬프트에 처널 온도이드 캡셔링)
- localStorage를 이용한 **이어서 하기**
- Recharts 기반 점수 시각화
- 프린트/PDF 내보내기

### 설치 및 실행

```bash
cd webapp
npm install
cp .env.local.example .env.local
# .env.local 에 ANTHROPIC_API_KEY 값을 채웁니다
npm run dev
```

### 기술 스택

- Next.js 15.1 (App Router, React 19)
- TypeScript, Tailwind CSS 3
- Recharts (막대 그래프)
- @anthropic-ai/sdk (Claude Haiku 4.5, 프롬프트 캡셔링 활용)

## 프로젝트 구조

```
tempe-test/
├─ self-diagnosis.html       # 단일 HTML 버전 (추후 추가)
└─ webapp/
   ├─ app/
   │  ├─ api/
   │  │  ├─ chat/route.ts        # 후속 질문 챗 (캡셔링\xc7d斌)
   │  │  └─ explain/route.ts     # AI 개인화 해설
   │  ├─ layout.tsx
   │  ├─ page.tsx               # intro / survey / result 단계 관리
   │  └─ globals.css
   ├─ components/
   │  ├─ Intro.tsx
   │  ├─ Survey.tsx             # 20문항, 중복 방지 점수 입력
   │  ├─ Result.tsx             # 유형 설명 + 우서도 표시
   │  ├─ ScoreChart.tsx         # Recharts 막대그래프
   │  └─ AIExplanation.tsx      # AI 해설 + 챗 UI
   └─ lib/
      ├─ questions.ts           # 20문항 데이터, 유형 라벨
      ├─ scoring.ts             # 점수 계산 및 유효성 검증
      └─ typeDescriptions.ts    # 각 유형 설명/강점/약점
```

## 라이선스

MIT
