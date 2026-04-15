import React from 'react';
import { BigFiveResult as BigFiveResultType } from '../data/scoring';
import { BigFiveTrait } from '../data/questions';

interface Props {
  result: BigFiveResultType;
}

const traitOrder: BigFiveTrait[] = ['E', 'N', 'C', 'A', 'O'];

const traitConfig: Record<BigFiveTrait, {
  fullName: string;
  posLabel: string; negLabel: string;
  posCode: string; negCode: string;
  posColor: string; negColor: string;
  emoji: string;
  posDesc: string; negDesc: string;
}> = {
  E: {
    fullName: '外向性 Extraversion',
    posLabel: 'Social 社交的', negLabel: 'Reserved 内向的',
    posCode: 'S', negCode: 'R',
    posColor: 'from-orange-400 to-amber-500',
    negColor: 'from-blue-400 to-indigo-500',
    emoji: '🎭',
    posDesc: '你外向、喜爱社交，在人群中充满活力，善于建立人际关系。',
    negDesc: '你内敛低调，享受独处，更喜欢深度一对一的交流。',
  },
  N: {
    fullName: '神经质 Neuroticism',
    posLabel: 'Limbic 易激动的', negLabel: 'Calm 冷静的',
    posCode: 'L', negCode: 'C',
    posColor: 'from-red-400 to-rose-500',
    negColor: 'from-teal-400 to-cyan-500',
    emoji: '🌊',
    posDesc: '你情感丰富、感受敏锐，对外界刺激反应强烈，情绪波动较大。',
    negDesc: '你情绪稳定、冷静自持，在压力下仍能保持理智与平静。',
  },
  C: {
    fullName: '尽责性 Conscientiousness',
    posLabel: 'Organized 有效率的', negLabel: 'Unstructured 非条理化的',
    posCode: 'O', negCode: 'U',
    posColor: 'from-green-500 to-emerald-500',
    negColor: 'from-amber-400 to-yellow-500',
    emoji: '📋',
    posDesc: '你有条理、自律、追求效率，善于规划并坚持执行目标。',
    negDesc: '你灵活随性，不拘小节，更享受自由探索而非预设框架。',
  },
  A: {
    fullName: '宜人性 Agreeableness',
    posLabel: 'Accommodating 迁就的', negLabel: 'Egocentric 自我中心的',
    posCode: 'A', negCode: 'E',
    posColor: 'from-pink-400 to-rose-400',
    negColor: 'from-gray-500 to-slate-600',
    emoji: '🤝',
    posDesc: '你友善、富有同理心，乐于合作和助人，关注他人感受。',
    negDesc: '你独立、直接，优先考虑自身利益，不轻易妥协原则。',
  },
  O: {
    fullName: '开放性 Openness',
    posLabel: 'Inquisitive 好奇的', negLabel: 'Non-curious 不好奇的',
    posCode: 'I', negCode: 'N',
    posColor: 'from-violet-400 to-purple-600',
    negColor: 'from-stone-400 to-gray-500',
    emoji: '🔭',
    posDesc: '你好奇心强、思维开放，热爱探索新想法、艺术与抽象概念。',
    negDesc: '你务实稳健，专注于具体事物，更偏好熟悉、可靠的方式。',
  },
};



export const BigFiveResult: React.FC<Props> = ({ result }) => {
  return (
    <div className="space-y-6">
      {/* Type Code Banner */}
      <div className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-2xl p-6 text-white shadow-xl">
        <div className="text-sm font-medium opacity-70 mb-3">大五人格类型代码</div>
        <div className="flex gap-2 mb-4">
          {result.typeCode.split('').map((char, idx) => {
            const trait = traitOrder[idx];
            const config = traitConfig[trait];
            const isPos = result.traits[trait].isPositive;
            const gradient = isPos ? config.posColor : config.negColor;
            return (
              <div
                key={idx}
                className={`flex-1 bg-gradient-to-br ${gradient} rounded-xl flex flex-col items-center justify-center py-3 shadow-lg`}
              >
                <div className="text-2xl font-black">{char}</div>
                <div className="text-xs opacity-80 mt-0.5">{trait}</div>
              </div>
            );
          })}
        </div>
        <p className="text-sm opacity-85 leading-relaxed">{result.description}</p>
      </div>

      {/* Each Trait Detail */}
      <div className="space-y-4">
        {traitOrder.map((trait) => {
          const config = traitConfig[trait];
          const rawScore = result.scores[trait];
          const info = result.traits[trait];
          const isPositive = info.isPositive;
          const code = isPositive ? config.posCode : config.negCode;
          const gradient = isPositive ? config.posColor : config.negColor;
          const desc = isPositive ? config.posDesc : config.negDesc;

          // Normalize for display: score is roughly -5 to 5
          const normalized = Math.min(1, Math.abs(rawScore) / 5);
          const pct = normalized * 100;

          return (
            <div key={trait} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{config.emoji}</span>
                  <div>
                    <div className="font-bold text-gray-800 text-sm">{config.fullName}</div>
                    <div className="text-xs text-gray-500">{info.label}</div>
                  </div>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r ${gradient} text-white rounded-xl`}>
                  <span className="text-lg font-black">{code}</span>
                  <span className="text-xs opacity-85">{isPositive ? '+' : '-'}</span>
                </div>
              </div>

              {/* Bipolar bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                  <span>[{config.negCode}] {config.negLabel}</span>
                  <span>[{config.posCode}] {config.posLabel}</span>
                </div>
                <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden flex">
                  <div className="w-1/2 flex justify-end">
                    {!isPositive && (
                      <div
                        className={`h-full bg-gradient-to-l ${config.negColor} rounded-l-full`}
                        style={{ width: `${pct}%` }}
                      />
                    )}
                  </div>
                  <div className="w-px bg-gray-400 z-10" />
                  <div className="w-1/2 flex justify-start">
                    {isPositive && (
                      <div
                        className={`h-full bg-gradient-to-r ${config.posColor} rounded-r-full`}
                        style={{ width: `${pct}%` }}
                      />
                    )}
                  </div>
                </div>
                <div className="text-center text-xs text-gray-400 mt-1">
                  原始分: {rawScore.toFixed(2)} | 强度: {pct.toFixed(0)}%
                </div>
              </div>

              <div className={`text-sm text-gray-600 bg-gray-50 rounded-xl p-3 leading-relaxed`}>
                {desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Radar-like summary */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">🔢 大五维度汇总</h3>
        <div className="grid grid-cols-2 gap-3">
          {traitOrder.map((trait) => {
            const config = traitConfig[trait];
            const rawScore = result.scores[trait];
            const info = result.traits[trait];
            const isPositive = info.isPositive;
            const code = isPositive ? config.posCode : config.negCode;
            const label = isPositive ? config.posLabel : config.negLabel;
            const gradient = isPositive ? config.posColor : config.negColor;
            const pct = Math.min(100, Math.abs(rawScore) / 5 * 100);

            return (
              <div key={trait} className="p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-7 h-7 flex items-center justify-center rounded-lg text-white text-sm font-bold bg-gradient-to-br ${gradient}`}>
                    {code}
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-gray-700">{info.label}</div>
                    <div className="text-xs text-gray-400">{label}</div>
                  </div>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${gradient} rounded-full`} style={{ width: `${Math.max(5, pct)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
