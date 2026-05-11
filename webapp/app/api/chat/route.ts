import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { TYPE_LABELS, TypeKey } from "@/lib/questions";
import { TYPE_DESCRIPTIONS } from "@/lib/typeDescriptions";

export const runtime = "nodejs";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function buildSystemPrompt(topType: TypeKey, scores: Record<TypeKey, number>): string {
  const typeBlock = (Object.keys(TYPE_DESCRIPTIONS) as TypeKey[])
    .map((k) => {
      const d = TYPE_DESCRIPTIONS[k];
      const l = TYPE_LABELS[k];
      return `## ${l.symbol} ${d.name}
- ${d.tagline}
- 강점: ${d.strengths.join(", ")}
- 약점: ${d.weaknesses.join(", ")}
- 업무: ${d.workStyle}
- 관계: ${d.socialStyle}`;
    })
    .join("\n\n");

  const scoreText = (Object.keys(scores) as TypeKey[])
    .map((k) => `${TYPE_LABELS[k].name}: ${scores[k]}점`)
    .join(", ");

  return `당신은 사용자의 자기진단 결과를 바탕으로 후속 질문에 답하는 상담사입니다.

[4가지 유형 정보]
${typeBlock}

[사용자의 진단 결과]
- 점수: ${scoreText}
- 최고 점수 유형: ${TYPE_LABELS[topType].name}

답변 원칙:
- 한국어로 간결하게 (2~4문단)
- 사용자의 유형 특성을 고려해 맞춤형으로 답변
- 진단 결과 범위를 벗어나는 질문은 정중히 안내하며 진단 관련 대화로 유도`;
}

export async function POST(req: Request) {
  try {
    const { topType, scores, messages } = (await req.json()) as {
      topType: TypeKey;
      scores: Record<TypeKey, number>;
      messages: ChatMessage[];
    };

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: buildSystemPrompt(topType, scores),
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const text = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    return NextResponse.json({ text });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e.message || "응답 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}
