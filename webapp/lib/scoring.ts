import { QUESTIONS, TypeKey } from "./questions";

export type Answers = Record<number, [number, number, number, number]>;

export interface ScoreResult {
  scores: Record<TypeKey, number>;
  topType: TypeKey;
  sortedTypes: TypeKey[];
}

export function calculateScores(answers: Answers): ScoreResult {
  const scores: Record<TypeKey, number> = {
    leader: 0,
    sensitive: 0,
    unique: 0,
    hermit: 0,
  };

  for (const q of QUESTIONS) {
    const ans = answers[q.id];
    if (!ans) continue;
    for (let i = 0; i < 4; i++) {
      const typeKey = q.mapping[i];
      scores[typeKey] += ans[i];
    }
  }

  const sortedTypes = (Object.keys(scores) as TypeKey[]).sort(
    (a, b) => scores[b] - scores[a]
  );

  return {
    scores,
    topType: sortedTypes[0],
    sortedTypes,
  };
}

export function isAnswerValid(values: [number, number, number, number]): boolean {
  const sorted = [...values].sort();
  return JSON.stringify(sorted) === JSON.stringify([1, 2, 3, 4]);
}

export function isComplete(answers: Answers): boolean {
  return QUESTIONS.every((q) => {
    const ans = answers[q.id];
    return ans && isAnswerValid(ans);
  });
}
