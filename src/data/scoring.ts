import { JungFunction, BigFiveTrait } from './questions';

// ─── Jung 8 Functions ───────────────────────────────────────────────────────

export type MBTIType =
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

export interface JungScores {
  Te: number; Ti: number; Fe: number; Fi: number;
  Se: number; Si: number; Ne: number; Ni: number;
}

export interface MBTIResult {
  type: MBTIType;
  stack: JungFunction[];
  description: string;
  nickname: string;
}

// Cognitive function stacks for each MBTI type
const mbtiStacks: Record<MBTIType, JungFunction[]> = {
  INTJ: ['Ni', 'Te', 'Fi', 'Se'],
  INTP: ['Ti', 'Ne', 'Si', 'Fe'],
  ENTJ: ['Te', 'Ni', 'Se', 'Fi'],
  ENTP: ['Ne', 'Ti', 'Fe', 'Si'],
  INFJ: ['Ni', 'Fe', 'Ti', 'Se'],
  INFP: ['Fi', 'Ne', 'Si', 'Te'],
  ENFJ: ['Fe', 'Ni', 'Se', 'Ti'],
  ENFP: ['Ne', 'Fi', 'Te', 'Si'],
  ISTJ: ['Si', 'Te', 'Fi', 'Ne'],
  ISFJ: ['Si', 'Fe', 'Ti', 'Ne'],
  ESTJ: ['Te', 'Si', 'Ne', 'Fi'],
  ESFJ: ['Fe', 'Si', 'Ne', 'Ti'],
  ISTP: ['Ti', 'Se', 'Ni', 'Fe'],
  ISFP: ['Fi', 'Se', 'Ni', 'Te'],
  ESTP: ['Se', 'Ti', 'Fe', 'Ni'],
  ESFP: ['Se', 'Fi', 'Te', 'Ni'],
};

const mbtiDescriptions: Record<MBTIType, { nickname: string; description: string }> = {
  INTJ: { nickname: '建筑师', description: '独立、有远见、战略性强，追求知识与效率的完美主义者。' },
  INTP: { nickname: '逻辑学家', description: '创新、逻辑严密，热爱理论与分析，享受思维的纯粹乐趣。' },
  ENTJ: { nickname: '指挥官', description: '果断、有领导力，善于制定长期目标并高效推进实现。' },
  ENTP: { nickname: '辩论家', description: '机智、充满创意，热爱辩论与探索新概念，思维极为灵活。' },
  INFJ: { nickname: '提倡者', description: '有理想、有洞察力，深刻理解他人，致力于使世界更美好。' },
  INFP: { nickname: '调停者', description: '富有想象力、忠于价值观，追求真实与意义的理想主义者。' },
  ENFJ: { nickname: '主人公', description: '热情、有感染力，天生的领导者，善于激励他人实现潜能。' },
  ENFP: { nickname: '竞选者', description: '热情洋溢、有创造力，总能在生活中发现新的可能与意义。' },
  ISTJ: { nickname: '检查员', description: '可靠、负责、注重细节，是传统秩序与稳定的忠实守护者。' },
  ISFJ: { nickname: '守卫者', description: '体贴周到、尽职尽责，默默守护着身边每一个重要的人。' },
  ESTJ: { nickname: '总经理', description: '务实、传统、强有执行力，擅长管理团队与维护秩序规则。' },
  ESFJ: { nickname: '执政官', description: '关心他人、注重和谐，用温暖与责任感凝聚身边的每一个人。' },
  ISTP: { nickname: '鉴赏家', description: '冷静、灵活，善于分析与动手解决实际问题的工具型天才。' },
  ISFP: { nickname: '探险家', description: '温和、敏感、热爱美，以行动而非语言表达自己独特的内心世界。' },
  ESTP: { nickname: '企业家', description: '精力充沛、机敏务实，最享受即时的体验与现实世界的挑战。' },
  ESFP: { nickname: '表演者', description: '开朗活泼、自发随性，是聚会中最亮眼的那道光。' },
};

export function getMBTIFromJung(scores: JungScores): { primary: MBTIType; rankings: Array<{ type: MBTIType; score: number }> } {
  const typeScores: Array<{ type: MBTIType; score: number }> = [];

  for (const [type, stack] of Object.entries(mbtiStacks) as [MBTIType, JungFunction[]][]) {
    // Weight: dominant=4, auxiliary=3, tertiary=2, inferior=1
    const weights = [4, 3, 2, 1];
    let score = 0;
    stack.forEach((fn, idx) => {
      score += (scores[fn] ?? 0) * weights[idx];
    });
    typeScores.push({ type, score });
  }

  typeScores.sort((a, b) => b.score - a.score);
  return { primary: typeScores[0].type, rankings: typeScores };
}

export function getMBTIResult(type: MBTIType): MBTIResult {
  const info = mbtiDescriptions[type];
  return {
    type,
    stack: mbtiStacks[type],
    description: info.description,
    nickname: info.nickname,
  };
}

// Alternative MBTI calculation from dichotomies
export function getMBTIDichotomy(scores: JungScores): {
  EI: number; SN: number; TF: number; JP: number; type: MBTIType;
} {
  const E = scores.Fe + scores.Se + scores.Te + scores.Ne;
  const I = scores.Fi + scores.Si + scores.Ti + scores.Ni;
  const S = scores.Se + scores.Si;
  const N = scores.Ne + scores.Ni;
  const T = scores.Te + scores.Ti;
  const F = scores.Fe + scores.Fi;
  const Je = scores.Te + scores.Fe; // Judging extraverted
  const Pe = scores.Se + scores.Ne; // Perceiving extraverted

  const EI = E - I; // positive = E
  const SN = S - N; // positive = S
  const TF = T - F; // positive = T
  const JP = Je - Pe; // positive = J

  const eChar = EI >= 0 ? 'E' : 'I';
  const sChar = SN >= 0 ? 'S' : 'N';
  const tChar = TF >= 0 ? 'T' : 'F';
  const jChar = JP >= 0 ? 'J' : 'P';
  const type = `${eChar}${sChar}${tChar}${jChar}` as MBTIType;

  return { EI, SN, TF, JP, type };
}

// ─── Enneagram ───────────────────────────────────────────────────────────────

export interface EnneagramResult {
  type: number;
  wing: number;
  score: number;
  allScores: Array<{ type: number; score: number }>;
  description: string;
  nickname: string;
  coreDesire: string;
  coreFear: string;
  healthLevels: { high: string; average: string; low: string };
  tritypes: number[];
  instinctualVariant: string;
}

const enneagramInfo: Record<number, {
  nickname: string; description: string;
  coreDesire: string; coreFear: string;
  healthLevels: { high: string; average: string; low: string };
  center: 'gut' | 'heart' | 'head';
}> = {
  1: {
    nickname: '改革者/完美主义者', description: '有原则、有道德感，追求改善世界，但有时陷入苛求完美。',
    coreDesire: '成为善良、正直的人', coreFear: '成为邪恶或腐败的人',
    healthLevels: {
      high: '理智、有判断力、接受自我、内心平静，以理想激励他人',
      average: '有教义性、爱说教、有条理，对自我和他人要求严格',
      low: '苛刻、愤怒、强迫性、自以为是，容易崩溃'
    },
    center: 'gut'
  },
  2: {
    nickname: '助人者/给予者', description: '热心、有爱心，总想帮助他人，但有时忽视自身需求。',
    coreDesire: '被爱和珍视', coreFear: '不被爱或不受欢迎',
    healthLevels: {
      high: '无私、给予爱、有同理心、真正关心他人',
      average: '爱奉承、总想着取悦他人、需要被感激',
      low: '控制欲强、操纵性、对他人有强烈期望'
    },
    center: 'heart'
  },
  3: {
    nickname: '成就者/实现者', description: '上进、有魅力、注重成功，是目标导向的实干家。',
    coreDesire: '有价值感，感到被欣赏', coreFear: '毫无价值或失败',
    healthLevels: {
      high: '自我接纳、真实、慷慨，以身作则激励他人',
      average: '以形象为导向、有竞争心、工作狂',
      low: '自欺欺人、机会主义、无情追求成功'
    },
    center: 'heart'
  },
  4: {
    nickname: '个人主义者/浪漫主义者', description: '有创造力、敏感、个性独特，寻找真实的自我与意义。',
    coreDesire: '找到自己的身份认同', coreFear: '没有特别之处，没有意义',
    healthLevels: {
      high: '有创造力、自我更新、深刻理解情感',
      average: '爱幻想、情绪化、疏远他人',
      low: '自怜、心理扭曲、有自我毁灭倾向'
    },
    center: 'heart'
  },
  5: {
    nickname: '调查者/观察者', description: '好奇、洞察力强，热爱知识与思考，倾向独立与私密。',
    coreDesire: '能干且知识渊博', coreFear: '无知、无能或无用',
    healthLevels: {
      high: '有远见、有洞察力、开放思想，与他人分享知识',
      average: '过度分析、与世隔绝、吝啬分享',
      low: '偏激、虚无主义、与外界完全脱离'
    },
    center: 'head'
  },
  6: {
    nickname: '忠诚者/怀疑者', description: '负责、可靠、注重安全，对权威既忠诚又多疑。',
    coreDesire: '安全感与支持', coreFear: '没有支撑、孤立无援',
    healthLevels: {
      high: '自信、勇敢、对他人真诚负责',
      average: '多疑、焦虑、寻求保证',
      low: '自我怀疑、偏执、陷入恐惧'
    },
    center: 'head'
  },
  7: {
    nickname: '热情者/享乐主义者', description: '乐观、活力满满，热爱冒险与新体验，逃避痛苦与束缚。',
    coreDesire: '快乐且满足', coreFear: '被剥夺或痛苦',
    healthLevels: {
      high: '感恩、有深度、充满活力，专注于真正重要的事',
      average: '贪图享乐、分散注意力、无法深入',
      low: '冲动、鲁莽、轻率行事逃避现实'
    },
    center: 'head'
  },
  8: {
    nickname: '挑战者/领袖', description: '有力量、果断、保护弱者，但有时显得过于强硬或控制欲强。',
    coreDesire: '保护自己，主宰自己的命运', coreFear: '被他人控制或伤害',
    healthLevels: {
      high: '有领导力、自我控制、慷慨大方，保护他人',
      average: '对抗性、强势、不断挑战边界',
      low: '冷酷无情、破坏性、沉溺于愤怒'
    },
    center: 'gut'
  },
  9: {
    nickname: '和平主义者/调解者', description: '宽容、随和、有耐心，追求内心平静与和谐共处。',
    coreDesire: '内心和平，与周围和谐', coreFear: '分裂与冲突',
    healthLevels: {
      high: '接纳自我、心理健康、带来真正的和平',
      average: '服从、回避冲突、麻木自我',
      low: '极度顺从、解离、完全失去自我'
    },
    center: 'gut'
  },
};

const wingMap: Record<number, number[]> = {
  1: [9, 2], 2: [1, 3], 3: [2, 4], 4: [3, 5],
  5: [4, 6], 6: [5, 7], 7: [6, 8], 8: [7, 9], 9: [8, 1]
};

const tritypeGroups = {
  gut: [1, 8, 9],
  heart: [2, 3, 4],
  head: [5, 6, 7]
};

const instinctVariants = ['自我保存 (sp)', '社交 (so)', '性/一对一 (sx)'];

export function getEnneagramResult(rawScores: Record<number, number>): EnneagramResult {
  const allScores = Object.entries(rawScores)
    .map(([t, s]) => ({ type: parseInt(t), score: s }))
    .sort((a, b) => b.score - a.score);

  const primary = allScores[0].type;
  const wings = wingMap[primary];
  const wingScores = wings.map(w => ({ w, s: rawScores[w] ?? 0 }));
  const wing = wingScores.sort((a, b) => b.s - a.s)[0].w;

  // Tritype: best from each center
  const tritype = Object.values(tritypeGroups).map(group => {
    return group.sort((a, b) => (rawScores[b] ?? 0) - (rawScores[a] ?? 0))[0];
  }).sort((a, b) => (rawScores[b] ?? 0) - (rawScores[a] ?? 0));

  // Instinctual variant (simplified heuristic)
  const EScore = rawScores[2] + rawScores[3] + rawScores[6] + rawScores[9];
  const SelfScore = rawScores[1] + rawScores[5] + rawScores[6];
  const SxScore = rawScores[4] + rawScores[7] + rawScores[8];
  const variantIdx = [SelfScore, EScore, SxScore].indexOf(Math.max(SelfScore, EScore, SxScore));

  const info = enneagramInfo[primary];
  return {
    type: primary,
    wing,
    score: allScores[0].score,
    allScores,
    description: info.description,
    nickname: info.nickname,
    coreDesire: info.coreDesire,
    coreFear: info.coreFear,
    healthLevels: info.healthLevels,
    tritypes: tritype,
    instinctualVariant: instinctVariants[variantIdx],
  };
}

// ─── Big Five ─────────────────────────────────────────────────────────────────

export interface BigFiveResult {
  scores: Record<BigFiveTrait, number>;
  typeCode: string; // e.g. RLUEI
  traits: Record<BigFiveTrait, { label: string; positive: string; negative: string; isPositive: boolean }>;
  description: string;
}

const bigFiveLabels: Record<BigFiveTrait, { pos: string; neg: string; posCode: string; negCode: string; name: string }> = {
  E: { pos: 'Social 社交的', neg: 'Reserved 内向的', posCode: 'S', negCode: 'R', name: '外向性' },
  N: { pos: 'Limbic 易激动的', neg: 'Calm 冷静的', posCode: 'L', negCode: 'C', name: '神经质' },
  C: { pos: 'Organized 有效率的', neg: 'Unstructured 非条理化的', posCode: 'O', negCode: 'U', name: '尽责性' },
  A: { pos: 'Accommodating 迁就的', neg: 'Egocentric 自我中心的', posCode: 'A', negCode: 'E', name: '宜人性' },
  O: { pos: 'Inquisitive 好奇的', neg: 'Non-curious 不好奇的', posCode: 'I', negCode: 'N', name: '开放性' },
};

export function getBigFiveResult(scores: Record<BigFiveTrait, number>): BigFiveResult {
  const order: BigFiveTrait[] = ['E', 'N', 'C', 'A', 'O'];
  let typeCode = '';
  const traits: BigFiveResult['traits'] = {} as BigFiveResult['traits'];

  for (const trait of order) {
    const info = bigFiveLabels[trait];
    const isPositive = scores[trait] >= 0;
    const code = isPositive ? info.posCode : info.negCode;
    typeCode += code;
    traits[trait] = {
      label: info.name,
      positive: info.pos,
      negative: info.neg,
      isPositive,
    };
  }

  // Generate a contextual description based on the code
  const descParts: string[] = [];
  if (scores.E >= 0) descParts.push('外向、善于社交');
  else descParts.push('内敛、喜爱独处');
  if (scores.N >= 0) descParts.push('情感丰富、易受刺激');
  else descParts.push('情绪稳定、冷静自持');
  if (scores.C >= 0) descParts.push('有条理、目标明确');
  else descParts.push('灵活随性、不拘小节');
  if (scores.A >= 0) descParts.push('友善合作、乐于助人');
  else descParts.push('独立自主、直接坦率');
  if (scores.O >= 0) descParts.push('好奇心强、思维开放');
  else descParts.push('务实稳健、专注具体');

  return {
    scores,
    typeCode,
    traits,
    description: descParts.join('，') + '。',
  };
}

// ─── MBTI Standard comparison ─────────────────────────────────────────────────

export interface StandardResult {
  standard: string;
  type: MBTIType;
  description: string;
}

export function getMultiStandardMBTI(jungScores: JungScores): StandardResult[] {
  const dichotomy = getMBTIDichotomy(jungScores);
  const cognitiveResult = getMBTIFromJung(jungScores);

  return [
    {
      standard: '认知功能叠加法（荣格认知功能加权）',
      type: cognitiveResult.primary,
      description: '通过对每种MBTI类型的功能栈加权求和，找出最匹配的类型。',
    },
    {
      standard: '二分法（经典MBTI维度）',
      type: dichotomy.type,
      description: 'E/I、S/N、T/F、J/P四个维度各自独立计算，经典MBTI标准。',
    },
  ];
}
