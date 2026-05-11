"use client";

import { useMemo } from "react";
import { calculateScores, Answers } from "@/lib/scoring";
import { TYPE_LABELS, QUESTIONS, TypeKey } from "@/lib/questions";
import { TYPE_DESCRIPTIONS } from "@/lib/typeDescriptions";
import ScoreChart from "./ScoreChart";
import AIExplanation from "./AIExplanation";

interface Props {
  answers: Answers;
  onRestart: () => void;
}

export default function Result({ answers, onRestart }: Props) {
  const result = useMemo(() => calculateScores(answers), [answers]);
  const topDesc = TYPE_DESCRIPTIONS[result.topType];
  const topLabel = TYPE_LABELS[result.topType];

  const totalScore = Object.values(result.scores).reduce((a, b) => a + b, 0);
  const topPercent = Math.round((result.scores[result.topType] / totalScore) * 100);

  const topContributions = useMemo(() => {
    return QUESTIONS.map((q) => {
      const ans = answers[q.id];
      if (!ans) return null;
      const idx = q.mapping.findIndex((t) => t === result.topType);
      if (idx === -1) return null;
      return { qid: q.id, text: q.text, optionText: q.options[idx], score: ans[idx] };
    })
      .filter((x): x is NonNullable<typeof x> => x !== null && x.score >= 3)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [answers, result.topType]);

  return (
    <div className="space-y-8 py-4">
      <div className="text-center">
        <p className="text-sm text-zinc-500">당신의 성격 유형은</p>
        <div className="mt-3 flex items-center justify-center gap-3">
          <span className="text-5xl" style={{ color: topLabel.color }}>
            {topLabel.symbol}
          </span>
          <h1 className="text-4xl font-bold">{topDesc.name}</h1>
        </div>
        <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400">
          {topDesc.tagline}
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          전체 응답 중 <b>{topPercent}%</b> 가 이 유형 ({result.scores[result.topType]}점 /{" "}
          {totalScore}점)
        </p>
      </div>

      <ScoreChart scores={result.scores} />

      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-xl font-bold">📝 유형 설명</h2>
        <p className="mt-3 leading-relaxed text-zinc-700 dark:text-zinc-300">
          {topDesc.summary}
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Card title="💪 강점" items={topDesc.strengths} />
          <Card title="⚠️ 약점" items={topDesc.weaknesses} />
        </div>

        <div className="mt-5 space-y-3">
          <Block title="업무 스타일" content={topDesc.workStyle} />
          <Block title="대인 관계" content={topDesc.socialStyle} />
          <Block
            title="추천 역할/직업"
            content={topDesc.recommendedRoles.join(", ")}
          />
        </div>
      </div>

      {topContributions.length > 0 && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-xl font-bold">🔍 이 결과의 핵심 응답</h2>
          <p className="mt-2 text-sm text-zinc-500">
            {topDesc.name} 성향과 가장 잘 맞는 응답들이에요.
          </p>
          <ul className="mt-4 space-y-3">
            {topContributions.map((c) => (
              <li
                key={c.qid}
                className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50"
              >
                <div className="text-xs font-medium text-zinc-500">
                  Q{c.qid} · {c.score}점 부여
                </div>
                <div className="mt-1 text-sm font-medium">{c.text}</div>
                <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  → {c.optionText}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <AIExplanation
        topType={result.topType}
        scores={result.scores}
        sortedTypes={result.sortedTypes}
      />

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          onClick={onRestart}
          className="flex-1 rounded-lg border border-zinc-300 px-6 py-3 font-medium transition hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          다시 시작하기
        </button>
        <button
          onClick={() => window.print()}
          className="flex-1 rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          결과 저장 (인쇄/PDF)
        </button>
      </div>
    </div>
  );
}

function Card({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/50">
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-2 space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
        {items.map((it) => (
          <li key={it}>• {it}</li>
        ))}
      </ul>
    </div>
  );
}

function Block({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        {content}
      </p>
    </div>
  );
}
