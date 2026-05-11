"use client";

import { useMemo, useState } from "react";
import { QUESTIONS } from "@/lib/questions";
import { Answers, isAnswerValid, isComplete } from "@/lib/scoring";

interface Props {
  initialAnswers: Answers;
  onSubmit: (answers: Answers) => void;
}

const SCORE_OPTIONS = [4, 3, 2, 1];

export default function Survey({ initialAnswers, onSubmit }: Props) {
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [showErrors, setShowErrors] = useState(false);

  const handleChange = (qid: number, optIdx: number, value: number) => {
    setAnswers((prev) => {
      const current: [number, number, number, number] = prev[qid] ?? [0, 0, 0, 0];
      const next: [number, number, number, number] = [...current] as [
        number,
        number,
        number,
        number
      ];
      next[optIdx] = value;
      return { ...prev, [qid]: next };
    });
  };

  const completedCount = useMemo(
    () =>
      QUESTIONS.filter((q) => {
        const ans = answers[q.id];
        return ans && isAnswerValid(ans);
      }).length,
    [answers]
  );

  const progress = (completedCount / QUESTIONS.length) * 100;

  const handleSubmit = () => {
    if (!isComplete(answers)) {
      setShowErrors(true);
      const firstIncomplete = QUESTIONS.find((q) => {
        const ans = answers[q.id];
        return !ans || !isAnswerValid(ans);
      });
      if (firstIncomplete) {
        document
          .getElementById(`q-${firstIncomplete.id}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    onSubmit(answers);
  };

  return (
    <div>
      <div className="sticky top-0 z-10 -mx-4 mb-6 bg-[var(--bg)]/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">
            진행도 {completedCount} / {QUESTIONS.length}
          </span>
          <span className="text-zinc-500">{Math.round(progress)}%</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div
            className="h-full bg-zinc-900 transition-all dark:bg-white"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-6">
        {QUESTIONS.map((q) => {
          const current = answers[q.id];
          const valid = current && isAnswerValid(current);
          const hasError = showErrors && !valid;
          const usedValues = new Set(current?.filter((v) => v > 0) ?? []);

          return (
            <div
              key={q.id}
              id={`q-${q.id}`}
              className={`rounded-xl border bg-white p-5 transition dark:bg-zinc-900 ${
                hasError
                  ? "border-red-400 ring-2 ring-red-200 dark:ring-red-900/40"
                  : valid
                  ? "border-emerald-300 dark:border-emerald-800"
                  : "border-zinc-200 dark:border-zinc-800"
              }`}
            >
              <div className="mb-4">
                <span className="inline-block rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium dark:bg-zinc-800">
                  Q{q.id}
                </span>
                <p className="mt-2 font-medium leading-relaxed">{q.text}</p>
              </div>

              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  const selected = current?.[optIdx] ?? 0;
                  return (
                    <div
                      key={optIdx}
                      className="flex items-start gap-3 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/40"
                    >
                      <div className="flex shrink-0 gap-1">
                        {SCORE_OPTIONS.map((val) => {
                          const isSelected = selected === val;
                          const isDisabled =
                            !isSelected && usedValues.has(val);
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => handleChange(q.id, optIdx, val)}
                              disabled={isDisabled}
                              className={`h-9 w-9 rounded-md text-sm font-semibold transition ${
                                isSelected
                                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                                  : isDisabled
                                  ? "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-600"
                                  : "bg-white text-zinc-700 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                              }`}
                            >
                              {val}
                            </button>
                          );
                        })}
                      </div>
                      <span className="pt-1.5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                        <span className="mr-1 font-semibold">
                          {["①", "②", "③", "④"][optIdx]}
                        </span>
                        {opt}
                      </span>
                    </div>
                  );
                })}
              </div>

              {hasError && (
                <p className="mt-3 text-sm text-red-600 dark:text-red-400">
                  ⚠ 4개 보기에 각각 1·2·3·4점을 중복 없이 입력해주세요.
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-0 -mx-4 mt-8 bg-[var(--bg)]/95 px-4 py-4 backdrop-blur">
        <button
          onClick={handleSubmit}
          className="w-full rounded-lg bg-zinc-900 px-6 py-3.5 font-medium text-white transition hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          결과 보기
        </button>
      </div>
    </div>
  );
}
