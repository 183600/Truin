export interface Question {
  id: number;
  text: string;
  // Jung 8 functions scoring: key = function, value = weight (-2 to 2)
  jung: Partial<Record<JungFunction, number>>;
  // Enneagram scoring: key = type number, value = weight
  enneagram: Partial<Record<number, number>>;
  // Big Five scoring: key = trait, value = weight
  bigFive: Partial<Record<BigFiveTrait, number>>;
}

export type JungFunction = 'Te' | 'Ti' | 'Fe' | 'Fi' | 'Se' | 'Si' | 'Ne' | 'Ni';
export type BigFiveTrait = 'E' | 'N' | 'C' | 'A' | 'O';

export const questions: Question[] = [
  {
    id: 1,
    text: "在社交场合中，我通常是那个主动发起话题、让气氛活跃起来的人。",
    jung: { Fe: 2, Se: 1, Te: 0.5 },
    enneagram: { 2: 1, 3: 1.5, 7: 1.5, 6: 0.5 },
    bigFive: { E: 2, A: 0.5 }
  },
  {
    id: 2,
    text: "我喜欢深入思考抽象的概念和理论，而不仅仅满足于表面的答案。",
    jung: { Ni: 2, Ti: 1.5, Ne: 1 },
    enneagram: { 5: 2, 4: 1, 1: 0.5 },
    bigFive: { O: 2, N: -0.5 }
  },
  {
    id: 3,
    text: "我在做决定时，更看重规则、逻辑和效率，而不是情感和个人感受。",
    jung: { Te: 2, Ti: 1.5, Se: 0.5 },
    enneagram: { 1: 1.5, 3: 1, 5: 1 },
    bigFive: { A: -1.5, C: 1, O: -0.5 }
  },
  {
    id: 4,
    text: "我能快速感知周围环境的变化，并且享受当下的感官体验。",
    jung: { Se: 2, Fe: 0.5, Te: 0.5 },
    enneagram: { 7: 2, 8: 1, 3: 0.5 },
    bigFive: { E: 1, O: 1, N: -1 }
  },
  {
    id: 5,
    text: "我经常反思自己的内心世界，思考自己的情感、价值观和人生意义。",
    jung: { Fi: 2, Ni: 1, Si: 0.5 },
    enneagram: { 4: 2, 9: 1, 5: 0.5 },
    bigFive: { O: 1.5, N: 1, E: -1 }
  },
  {
    id: 6,
    text: "我擅长制定计划并严格执行，不喜欢随意改变既定安排。",
    jung: { Te: 2, Si: 1.5, Ti: 0.5 },
    enneagram: { 1: 2, 3: 1, 6: 1 },
    bigFive: { C: 2, N: -0.5, E: -0.5 }
  },
  {
    id: 7,
    text: "我能感受到他人的情绪，并且很自然地想要帮助或安慰他们。",
    jung: { Fe: 2, Fi: 0.5, Si: 0.5 },
    enneagram: { 2: 2, 9: 1.5, 6: 0.5 },
    bigFive: { A: 2, E: 0.5, N: 0.5 }
  },
  {
    id: 8,
    text: "我喜欢探索各种可能性和新想法，常常同时对多件事情感兴趣。",
    jung: { Ne: 2, Se: 0.5, Ni: 0.5 },
    enneagram: { 7: 2, 5: 1, 4: 0.5 },
    bigFive: { O: 2, E: 0.5, C: -1 }
  },
  {
    id: 9,
    text: "我会记住过去的细节，并通过过去的经验来指导当前的决策。",
    jung: { Si: 2, Te: 0.5, Ti: 0.5 },
    enneagram: { 6: 1.5, 1: 1, 9: 1 },
    bigFive: { C: 1, N: 0.5, O: -1 }
  },
  {
    id: 10,
    text: "我倾向于独立工作，不喜欢被他人打扰或在嘈杂的环境中思考。",
    jung: { Ti: 2, Ni: 1, Fi: 1 },
    enneagram: { 5: 2.5, 4: 1, 9: 0.5 },
    bigFive: { E: -2, N: 0.5, O: 1 }
  },
  {
    id: 11,
    text: "我经常感受到强烈的情绪，情绪波动对我来说是家常便饭。",
    jung: { Fi: 1.5, Fe: 1, Ne: 0.5 },
    enneagram: { 4: 2, 2: 1, 6: 1 },
    bigFive: { N: 2, E: -0.5, A: 0.5 }
  },
  {
    id: 12,
    text: "在竞争中，我天生就有强烈的获胜欲望，喜欢接受挑战证明自己。",
    jung: { Te: 1.5, Se: 1.5, Fe: 0.5 },
    enneagram: { 3: 2.5, 8: 2, 1: 0.5 },
    bigFive: { E: 1.5, A: -1.5, C: 1, N: -0.5 }
  },
  {
    id: 13,
    text: "我通常能看到不同观点之间的联系，喜欢综合多方信息形成整体判断。",
    jung: { Ni: 2, Ne: 1, Ti: 1 },
    enneagram: { 5: 1.5, 9: 1, 1: 0.5 },
    bigFive: { O: 2, C: 0.5, N: -0.5 }
  },
  {
    id: 14,
    text: "我很在意自己在他人眼中的形象，并且会根据不同场合调整自己的行为方式。",
    jung: { Fe: 2, Se: 1, Te: 0.5 },
    enneagram: { 3: 2.5, 2: 1, 6: 0.5 },
    bigFive: { E: 1, A: 1, N: 0.5 }
  },
  {
    id: 15,
    text: "我渴望生活中有强烈的体验——无论是冒险、艺术还是情感上的深度。",
    jung: { Se: 1.5, Fi: 1.5, Ne: 0.5 },
    enneagram: { 4: 2, 7: 1.5, 8: 0.5 },
    bigFive: { O: 2, N: 0.5, E: 0.5 }
  },
  {
    id: 16,
    text: "我非常注重安全感，倾向于提前预想各种可能出现的风险或问题。",
    jung: { Si: 1.5, Ni: 1, Te: 0.5 },
    enneagram: { 6: 3, 1: 0.5, 5: 0.5 },
    bigFive: { N: 1.5, C: 1, O: -0.5 }
  },
  {
    id: 17,
    text: "我热衷于帮助他人成长或达成目标，能从中获得极大的满足感。",
    jung: { Fe: 2, Te: 0.5, Fi: 0.5 },
    enneagram: { 2: 2.5, 9: 1, 3: 0.5 },
    bigFive: { A: 2, E: 0.5, N: -0.5 }
  },
  {
    id: 18,
    text: "我有很强的自主意识，不喜欢被别人控制或指挥，倾向于按自己的方式行事。",
    jung: { Ti: 1.5, Fi: 1.5, Se: 0.5 },
    enneagram: { 8: 2.5, 4: 1, 5: 0.5 },
    bigFive: { E: 0.5, A: -2, C: 0.5, N: -0.5 }
  },
  {
    id: 19,
    text: "我通常保持平和淡定，很少感到焦虑或情绪激动，倾向于顺其自然。",
    jung: { Si: 1, Fe: 0.5, Ti: 0.5 },
    enneagram: { 9: 3, 5: 0.5, 6: -0.5 },
    bigFive: { N: -2, E: -0.5, A: 1 }
  },
  {
    id: 20,
    text: "我相信对的就是对的，我有强烈的原则感，并会努力按照自己的价值标准行事。",
    jung: { Fi: 2, Te: 0.5, Ti: 0.5 },
    enneagram: { 1: 2.5, 4: 0.5, 6: 0.5 },
    bigFive: { C: 1.5, A: 0.5, N: -0.5 }
  }
];
