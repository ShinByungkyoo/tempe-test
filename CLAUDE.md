# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

The repo root holds the source/reference materials for a Korean personality self-diagnosis test:

- `질문.docx`, `질문.pdf`, `자기진단 테스트_샘플.xlsx` — the canonical 20-question instrument and sample scoring
- `self-diagnosis.html` — earlier single-file prototype (reference only; the live app is the Next.js port)
- `webapp/` — the actual Next.js application; **all code work happens here**

When the user asks to "run the app", "edit a component", etc., `cd webapp` first.

## Commands (run from `webapp/`)

```
npm run dev      # next dev — local dev server
npm run build    # next build
npm run start    # next start (serve production build)
npm run lint     # next lint
```

There is no test suite. Type-checking happens implicitly via `next build` (strict mode is on).

The AI features require `ANTHROPIC_API_KEY` in `webapp/.env.local` (see `.env.local.example`). Without it, `/api/explain` and `/api/chat` return a 500.

## Architecture

The app is a single-page Next.js 15 App Router project (React 19, Tailwind 3.4, TypeScript strict). It is almost entirely client-side; the only server code is two thin Anthropic SDK proxies.

### Stage machine (single-page flow)

`app/page.tsx` is a client component that drives a three-stage flow via local state: `intro → survey → result`. Each stage maps to one component (`components/Intro.tsx`, `Survey.tsx`, `Result.tsx`). Answers persist to `localStorage` under the key `self-diagnosis-answers-v1` so users can resume mid-survey. There is no router-based navigation.

### Domain model — the four types

Everything keys off `TypeKey = "leader" | "sensitive" | "unique" | "hermit"` (주도형 / 섬세형 / 비범형 / 은둔형) declared in `lib/questions.ts`. Three parallel records are indexed by this key and must stay in sync:

- `TYPE_LABELS` (lib/questions.ts) — display name, symbol, color
- `TYPE_DESCRIPTIONS` (lib/typeDescriptions.ts) — long-form copy used in `Result` and injected into AI system prompts
- `Question.mapping` (lib/questions.ts) — for each question, a 4-tuple of `TypeKey` mapping option index → type that option scores for

Adding a new type means updating all three plus every question's `mapping` array.

### Scoring (lib/scoring.ts)

Each question presents 4 options; the user assigns the values 1, 2, 3, 4 across them with no repeats (enforced by `isAnswerValid`, which sorts and compares to `[1,2,3,4]`). Per question, each option's value is added to the type bucket given by `mapping[i]`. The top-scoring type is the result. `isComplete` requires every question to have a valid 4-value tuple.

`Survey.tsx` enforces the no-duplicate rule by disabling already-used score buttons within a question and showing per-question validation only after the user attempts to submit.

### AI features (app/api/{explain,chat}/route.ts)

Both routes use `runtime = "nodejs"` and the `@anthropic-ai/sdk` directly (model `claude-haiku-4-5-20251001`). The system prompt for each is built by concatenating all four `TYPE_DESCRIPTIONS` entries and is sent with `cache_control: { type: "ephemeral" }` to leverage prompt caching across requests.

- `POST /api/explain` — one-shot personalized writeup. Body: `{ topType, scores, sortedTypes }`. The user message includes the gap between #1 and #2 so the prompt can instruct the model to call out "hybrid" results.
- `POST /api/chat` — multi-turn follow-up Q&A. Body: `{ topType, scores, messages: [{role, content}] }`. The full conversation history is replayed each call (no server-side session state). The system prompt is told to redirect off-topic questions back to the diagnosis.

Both endpoints filter `message.content` for `TextBlock` and concatenate, returning `{ text }` or `{ error }`.

`components/AIExplanation.tsx` orchestrates both: a "generate" button calls `/api/explain` first, then the chat input box (which calls `/api/chat`) only renders once an explanation exists.

### Path aliases

`tsconfig.json` defines `@/*` → repo root (`webapp/*`). Imports use `@/lib/...`, `@/components/...`.

## Conventions

- All user-facing copy is Korean. Keep it Korean unless explicitly told otherwise — the type names, taglines, and AI prompts are all written in Korean and the tone is intentional.
- Components are client components (`"use client"`) by default; only the two API route handlers run server-side.
- Tailwind utility classes carry dark-mode variants (`dark:...`). Match the existing pattern when adding UI.
