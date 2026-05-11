import { TypeKey } from "./questions";

export interface TypeDescription {
  name: string;
  tagline: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  workStyle: string;
  socialStyle: string;
  recommendedRoles: string[];
}

export const TYPE_DESCRIPTIONS: Record<TypeKey, TypeDescription> = {
  leader: {
    name: "주도형",
    tagline: "체계와 성과를 이끌는 조정자",
    summary:
      "현실적이고 책임감이 강하며, 명확한 기준과 절차 안에서 가시적 성과를 만들어내는 데 능합니다. 사람들 사이의 조정자 역할을 자연스럽게 수행하고, 조직과 시스템을 안정적으로 운영하는 데 강점이 있습니다.",
    strengths: ["체계적 사고", "신뢰성과 책임감", "실행력", "타인 배려와 협업 조율"],
    weaknesses: ["변화에 대한 저항", "지나친 형식주의 우려", "감정 표현에 소극적일 수 있음"],
    workStyle: "명확한 목표·기준·일정이 주어진 환경에서 최고 성과. 점진적 개선과 안정적 운영에 강함.",
    socialStyle: "넓고 적절한 인간관계를 유지하며 신뢰를 쌓아 가는 스타일. 깊은 친밀감보다는 안정적 관계 선호.",
    recommendedRoles: ["프로젝트 매니저", "운영 책임자", "팀 리더", "조직 컨설턴트"],
  },
  sensitive: {
    name: "섬세형",
    tagline: "관계와 조화를 살피는 공감자",
    summary:
      "타인의 감정과 분위기를 빠르게 감지하며, 작은 자극에도 깊게 반응합니다. 배려심이 깊고 조화를 중시하지만, 그만큼 외부 자극에 쉽게 피로해질 수 있습니다.",
    strengths: ["공감 능력", "세심한 관찰력", "심미적 감각", "조화로운 관계 형성"],
    weaknesses: ["과민 반응", "타인 시선 의존", "자기 주장 약함", "쉽게 지침"],
    workStyle: "조용하고 안정적인 환경, 인간적 교감이 있는 일에서 빛남. 갈등이 잦은 환경엔 빠르게 소모됨.",
    socialStyle: "소수의 깊은 관계를 선호. 친밀한 사람에게는 매우 따뜻하고 헌신적.",
    recommendedRoles: ["상담사", "디자이너", "교사", "콘텐츠 기획자", "심리/예술 분야"],
  },
  unique: {
    name: "비범형",
    tagline: "가능성과 효율을 좋는 혁신가",
    summary:
      "관습에 얽매이지 않고 가능성·효율·기능에 가치를 둡니다. 논리적이고 분석적이며, 새로운 아이디어를 빠르게 흡수하고 적용하는 데 능합니다. 다만 인간적 교감보다 결과 중심으로 사고하는 경향이 있습니다.",
    strengths: ["분석력", "독창성", "효율 추구", "전문 분야 깊이"],
    weaknesses: ["감정 영역에서 둘감", "고집이 셌", "타인 의견에 비판적", "스모토크 거부감"],
    workStyle: "자율적이고 지적 자극이 풍부한 환경에서 최고 성과. 권위나 형식적 절차에 답답해함.",
    socialStyle: "전문성을 공유할 수 있는 사람과 깊은 대화 선호. 피상적 친목 모임은 회피.",
    recommendedRoles: ["연구원", "엔지니어", "전략 컨설턴트", "창업가", "데이터 전문가"],
  },
  hermit: {
    name: "은둔형",
    tagline: "내면과 사색을 사랑하는 관찰자",
    summary:
      "혼자만의 시간과 깊은 사색을 통해 에너지를 충전합니다. 외부 자극이 적은 환경에서 창의성과 통찰을 발휘하며, 떠들썭한 사회적 자리보다는 조용한 관찰자 위치를 선호합니다.",
    strengths: ["깊이 있는 사고", "관찰력", "독립성", "차분함"],
    weaknesses: ["사회적 노출 회피", "결정의 지연", "감정 표현 부족", "기회 놓침 가능"],
    workStyle: "혼자 집중할 수 있는 환경, 시간에 쪼기지 않는 작업에서 최고 성과. 즉흥적 협업엔 약함.",
    socialStyle: "소수의 신뢰하는 사람과의 조용한 관계를 선호. 큰 모임은 회피하거나 빨리 자리를 뜨.",
    recommendedRoles: ["작가", "연구자", "프로그래머", "예술가", "장인/기술자"],
  },
};
