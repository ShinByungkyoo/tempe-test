"use client";

import { TYPE_LABELS, TypeKey } from "@/lib/questions";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  scores: Record<TypeKey, number>;
}

export default function ScoreChart({ scores }: Props) {
  const data = (Object.keys(scores) as TypeKey[]).map((k) => ({
    type: `${TYPE_LABELS[k].symbol} ${TYPE_LABELS[k].name}`,
    typeKey: k,
    score: scores[k],
    color: TYPE_LABELS[k].color,
  }));

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-xl font-bold">📊 유형별 점수</h2>
      <div className="mt-4 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="type" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                background: "#fff",
                border: "1px solid #e5e5e5",
                borderRadius: 8,
                fontSize: 13,
              }}
              formatter={(v: number) => [`${v}점`, "점수"]}
            />
            <Bar dataKey="score" radius={[6, 6, 0, 0]}>
              {data.map((d) => (
                <Cell key={d.typeKey} fill={d.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
