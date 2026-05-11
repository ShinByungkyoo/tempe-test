import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { TYPE_LABELS, TypeKey } from "@/lib/questions";
import { TYPE_DESCRIPTIONS } from "@/lib/typeDescriptions";

export const runtime = "nodejs";

function buildSystemPrompt(): string {
  const typeBlock = (Object.keys(TYPE_DESCRIPTIONS) as TypeKey[])
    .map((k) => {
      const d = TYPE_DESCRIPTIONS[k];
      const l = TYPE_LABELS[k];
      return `## ${l.symbol} ${d.name} (${d.tagline})
- 요약: ${d.summary}
- 강점: ${d.strengths.join(", ")}
- 약점: ${d.weaknesses.join(", ")}
- 업무: ${d.workStyle}
- 관계: ${d.socialStyle}
- 추천 역할: ${d.recommendedRoles.join(", ")}`;
    })
    .join("\n\n");

  return `당신은 성격 진단 결과를 따뜻하고 깊이 있게 해설해주는 전문 상담사입니다.
사용자는 20문항짜리 자기진단 테스트를 마쳤습니다. 4가지 성격 유형이 있습니다:

${typeBlock}

해설 작성 원칙:
1. 사용자의 점수 분포를 보고 단순히 "당신은 X형입니다"가 아니라, 점수 차이까지 고려해 입체적으로 해설하세요.
2. 1등 유형과 2등 유형의 점수 차이가 크지 않으면 "하이브리드형"으로 해석하고 두 유형의 특성이 어떻게 공존하는지 설명하세요.
3. 강점은 구체적으로, 약점은 보완 방향과 함께 부드럽게 제시하세요.
4. 마지막에는 "당신에게 추천하는 한 가지 실천 행동"을 제안하세요.
5. 한국어로, 친근하면서도 통찰력 있는 어조로 작성하세요. 마크다운 헤더(##) 사용 가능.
6. 분량: 약 400~600자.`;
}

export async function POST(req: Request) {
  try {
    const { topType, scores, sortedTypes } = (await req.json()) as {
      topType: TypeKey;
      scores: Record<TypeKey, number>;
      sortedTypes: TypeKey[];
    };

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const client = new Anthropic({ apiKey });

    const scoreText = sortedTypes
      .map((t, i) => `${i + 1}위: ${TYPE_LABELS[t].name} (${scores[t]}점)`)
      .join("\n");

    const userMessage = `사용자의 진단 결과는 다음과 같습니다:

${scoreText}

최고 점수 유형: ${TYPE_LABELS[topType].name}
1등과 2등 점수 차이: ${scores[sortedTypes[0]] - scores[sortedTypes[1]]}점

이 결과를 바탕으로 개인화된 해설을 작성해주세요.`;

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: buildSystemPrompt(),
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: userMessage }],
    });

    const text = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    return NextResponse.json({ text });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e.message || "AI 해설 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}
