"use client";

import { useState } from "react";
import { TYPE_LABELS, TypeKey } from "@/lib/questions";

interface Props {
  topType: TypeKey;
  scores: Record<TypeKey, number>;
  sortedTypes: TypeKey[];
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function AIExplanation({ topType, scores, sortedTypes }: Props) {
  const [explanation, setExplanation] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topType, scores, sortedTypes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "요청 실패");
      setExplanation(data.text);
    } catch (e: any) {
      setError(e.message || "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    const q = input.trim();
    if (!q || chatLoading) return;
    const newMessages: ChatMessage[] = [...messages, { role: "user", content: q }];
    setMessages(newMessages);
    setInput("");
    setChatLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topType,
          scores,
          messages: newMessages,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "요청 실패");
      setMessages([...newMessages, { role: "assistant", content: data.text }]);
    } catch (e: any) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: `⚠ 오류: ${e.message || "응답 실패"}` },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">🤖 AI 개인화 해설</h2>
        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
          Claude
        </span>
      </div>

      {!explanation && !loading && (
        <div className="mt-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            당신의 응답 패턴을 바탕으로 더 깊이 있는 맞춤형 해설을 생성합니다.
          </p>
          <button
            onClick={generate}
            className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            AI 해설 생성하기
          </button>
        </div>
      )}

      {loading && (
        <div className="mt-4 flex items-center gap-2 text-sm text-zinc-500">
          <Spinner /> AI가 해설을 작성하고 있습니다...
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          ⚠ {error}
          <p className="mt-1 text-xs">
            API 키가 설정되어 있는지 확인하세요 (.env.local의 ANTHROPIC_API_KEY)
          </p>
        </div>
      )}

      {explanation && (
        <>
          <div className="prose prose-sm mt-4 max-w-none whitespace-pre-wrap leading-relaxed text-zinc-800 dark:text-zinc-200">
            {explanation}
          </div>

          <div className="mt-6 border-t border-zinc-200 pt-5 dark:border-zinc-800">
            <h3 className="text-sm font-semibold">💬 추가 질문하기</h3>
            <p className="mt-1 text-xs text-zinc-500">
              결과에 대해 궁금한 점을 자유롭게 질문해보세요.
            </p>

            {messages.length > 0 && (
              <div className="mt-3 max-h-96 space-y-3 overflow-y-auto rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/40">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      m.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                        m.role === "user"
                          ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                          : "bg-white dark:bg-zinc-900"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Spinner /> 답변 작성 중...
                  </div>
                )}
              </div>
            )}

            <div className="mt-3 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="예: 주도형의 약점을 어떻게 보완하면 좋을까요?"
                disabled={chatLoading}
                className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-white"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || chatLoading}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
              >
                전송
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-white" />
  );
}
