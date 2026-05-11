"use client";

import { TYPE_LABELS } from "@/lib/questions";

interface Props {
  onStart: (resume: boolean) => void;
  hasSaved: boolean;
}

export default function Intro({ onStart, hasSaved }: Props) {
  return (
    <div className="flex flex-col items-center gap-8 py-10 text-center">
      <div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          자기진단 테스트
        </h1>
        <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400">
          20문항으로 알아보는 나의 성격 유형
        </p>
      </div>

      <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
        {(Object.entries(TYPE_LABELS) as [keyof typeof TYPE_LABELS, (typeof TYPE_LABELS)[keyof typeof TYPE_LABELS]][]).map(
          ([key, t]) => (
            <div
              key={key}
              className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="text-3xl" style={{ color: t.color }}>
                {t.symbol}
              </div>
              <div className="mt-1 text-sm font-medium">{t.name}</div>
            </div>
          )
        )}
      </div>

      <div className="rounded-xl bg-zinc-100 p-5 text-left text-sm leading-relaxed text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
        <p className="font-semibold">검사 방법</p>
        <p className="mt-2">
          각 문항마다 4개의 보기에 <b>중복 없이 1~4점</b>을 부여하세요.
        </p>
        <ul className="mt-2 list-disc pl-5">
          <li>4점 = 가장 잘 부합됨</li>
          <li>3점 = 대체로 부합됨</li>
          <li>2점 = 조금 부합됨</li>
          <li>1점 = 거의 부합되지 않음</li>
        </ul>
      </div>

      <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
        <button
          onClick={() => onStart(false)}
          className="rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          새로 시작하기
        </button>
        {hasSaved && (
          <button
            onClick={() => onStart(true)}
            className="rounded-lg border border-zinc-300 px-6 py-3 font-medium transition hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            이어서 하기
          </button>
        )}
      </div>
    </div>
  );
}
