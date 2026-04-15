import React, { useState } from 'react';
import { JungScores, MBTIType, getMBTIFromJung, getMBTIResult, getMBTIDichotomy, getMultiStandardMBTI } from '../data/scoring';
import { JungFunction } from '../data/questions';

interface Props {
  scores: JungScores;
}

const functionColors: Record<JungFunction, string> = {
  Te: 'from-blue-500 to-blue-600',
  Ti: 'from-sky-400 to-blue-500',
  Fe: 'from-pink-400 to-rose-500',
  Fi: 'from-purple-400 to-violet-500',
  Se: 'from-orange-400 to-amber-500',
  Si: 'from-yellow-400 to-amber-400',
  Ne: 'from-green-400 to-emerald-500',
  Ni: 'from-indigo-400 to-violet-600',
};

const functionBg: Record<JungFunction, string> = {
  Te: 'bg-blue-50 border-blue-200',
  Ti: 'bg-sky-50 border-sky-200',
  Fe: 'bg-pink-50 border-pink-200',
  Fi: 'bg-purple-50 border-purple-200',
  Se: 'bg-orange-50 border-orange-200',
  Si: 'bg-yellow-50 border-yellow-200',
  Ne: 'bg-green-50 border-green-200',
  Ni: 'bg-indigo-50 border-indigo-200',
};

const functionDescriptions: Record<JungFunction, { name: string; type: string; description: string }> = {
  Te: { name: '外倾思维', type: '判断·外向', description: '客观分析外部世界，注重效率、系统与可量化目标，善于组织资源。' },
  Ti: { name: '内倾思维', type: '判断·内向', description: '追求内部逻辑的精确性，构建独立的思维框架，深入分析原理。' },
  Fe: { name: '外倾情感', type: '判断·外向', description: '关注外部的情感氛围与人际和谐，善于读懂他人情感需求。' },
  Fi: { name: '内倾情感', type: '判断·内向', description: '基于深刻的个人价值观做决定，追求真实性与内在的道德一致性。' },
  Se: { name: '外倾感觉', type: '感知·外向', description: '高度关注当下的感官体验与外部环境，享受即时的现实刺激。' },
  Si: { name: '内倾感觉', type: '感知·内向', description: '通过与过去经验对比来处理信息，注重传统、细节与稳定性。' },
  Ne: { name: '外倾直觉', type: '感知·外向', description: '快速发现外部世界中的可能性与模式，喜爱头脑风暴与创新思维。' },
  Ni: { name: '内倾直觉', type: '感知·内向', description: '整合信息形成深刻洞见与长远预判，专注于潜在含义与未来趋势。' },
};

const mbtiTypeColors: Record<MBTIType, string> = {
  INTJ: 'from-indigo-600 to-violet-700',
  INTP: 'from-blue-500 to-indigo-600',
  ENTJ: 'from-red-500 to-rose-600',
  ENTP: 'from-orange-500 to-amber-500',
  INFJ: 'from-purple-500 to-violet-600',
  INFP: 'from-pink-400 to-purple-500',
  ENFJ: 'from-green-500 to-teal-500',
  ENFP: 'from-yellow-400 to-orange-400',
  ISTJ: 'from-blue-600 to-blue-800',
  ISFJ: 'from-teal-400 to-cyan-500',
  ESTJ: 'from-red-600 to-red-800',
  ESFJ: 'from-pink-500 to-rose-500',
  ISTP: 'from-gray-500 to-slate-600',
  ISFP: 'from-lime-400 to-green-500',
  ESTP: 'from-amber-500 to-orange-600',
  ESFP: 'from-yellow-400 to-pink-400',
};

export const JungResult: React.FC<Props> = ({ scores }) => {
  const [showAllRankings, setShowAllRankings] = useState(false);

  const allFunctions = Object.entries(scores) as [JungFunction, number][];
  const maxScore = Math.max(...allFunctions.map(([, s]) => Math.abs(s)), 1);
  const sortedFunctions = [...allFunctions].sort((a, b) => b[1] - a[1]);

  const cognitiveResult = getMBTIFromJung(scores);
  const primaryMBTI = getMBTIResult(cognitiveResult.primary);
  const dichotomy = getMBTIDichotomy(scores);
  const standards = getMultiStandardMBTI(scores);

  return (
    <div className="space-y-6">
      {/* Primary MBTI Type */}
      <div className={`bg-gradient-to-br ${mbtiTypeColors[primaryMBTI.type]} rounded-2xl p-6 text-white shadow-xl`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm font-medium opacity-80 mb-1">认知功能分析结果</div>
            <div className="text-4xl font-black tracking-widest">{primaryMBTI.type}</div>
            <div className="text-xl font-semibold opacity-90 mt-1">{primaryMBTI.nickname}</div>
          </div>
          <div className="text-6xl">🧠</div>
        </div>
        <p className="text-sm opacity-85 leading-relaxed">{primaryMBTI.description}</p>
        <div className="mt-4 flex gap-2 flex-wrap">
          {primaryMBTI.stack.map((fn, idx) => (
            <span key={fn} className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
              {idx + 1}. {fn} ({functionDescriptions[fn].name})
            </span>
          ))}
        </div>
      </div>

      {/* Jung 8 Functions Strength */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">🎯 荣格八维功能强度</h3>
        <div className="space-y-3">
          {sortedFunctions.map(([fn, score]) => {
            const normalized = score / maxScore;
            const pct = Math.max(0, normalized * 100);
            const info = functionDescriptions[fn];
            return (
              <div key={fn} className={`rounded-xl border p-3 ${functionBg[fn]}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`inline-block px-2 py-0.5 rounded-lg text-white text-sm font-bold bg-gradient-to-r ${functionColors[fn]}`}>
                      {fn}
                    </span>
                    <span className="font-semibold text-gray-800 text-sm">{info.name}</span>
                    <span className="text-xs text-gray-400">{info.type}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-600">{score.toFixed(2)}</span>
                </div>
                <div className="h-2 bg-white/60 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full bg-gradient-to-r ${functionColors[fn]} rounded-full transition-all duration-700`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">{info.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Multiple Standards */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">📊 不同标准的 MBTI 结果</h3>
        <div className="space-y-3">
          {standards.map((s) => (
            <div key={s.standard} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
              <div className={`shrink-0 px-3 py-1.5 bg-gradient-to-r ${mbtiTypeColors[s.type]} text-white text-sm font-bold rounded-lg`}>
                {s.type}
              </div>
              <div>
                <div className="font-semibold text-gray-700 text-sm">{s.standard}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Dichotomy scores */}
        <div className="mt-4 p-4 bg-indigo-50 rounded-xl">
          <div className="text-sm font-bold text-indigo-800 mb-3">维度倾向分析（二分法）</div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'E / I', value: dichotomy.EI, pos: 'E 外倾', neg: 'I 内倾' },
              { label: 'S / N', value: dichotomy.SN, pos: 'S 感觉', neg: 'N 直觉' },
              { label: 'T / F', value: dichotomy.TF, pos: 'T 思维', neg: 'F 情感' },
              { label: 'J / P', value: dichotomy.JP, pos: 'J 判断', neg: 'P 感知' },
            ].map(({ label, value, pos, neg }) => {
              const isPos = value >= 0;
              const pct = Math.min(100, Math.abs(value) / (maxScore * 4) * 100);
              return (
                <div key={label} className="bg-white rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">{label}</div>
                  <div className="text-sm font-bold text-gray-800 mb-1.5">
                    {isPos ? pos : neg}
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isPos ? 'bg-indigo-500' : 'bg-violet-500'}`}
                      style={{ width: `${Math.max(10, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MBTI Rankings */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">🏆 全部16型匹配度排名</h3>
          <button
            onClick={() => setShowAllRankings(!showAllRankings)}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            {showAllRankings ? '收起' : '展开'}
          </button>
        </div>
        <div className="space-y-2">
          {(showAllRankings ? cognitiveResult.rankings : cognitiveResult.rankings.slice(0, 5)).map((r, idx) => {
            const info = getMBTIResult(r.type);
            const maxRankScore = cognitiveResult.rankings[0].score;
            const pct = maxRankScore > 0 ? (r.score / maxRankScore) * 100 : 0;
            return (
              <div key={r.type} className="flex items-center gap-3">
                <span className={`text-xs font-bold w-5 text-center ${idx === 0 ? 'text-yellow-500' : 'text-gray-400'}`}>
                  {idx + 1}
                </span>
                <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-lg text-white bg-gradient-to-r ${mbtiTypeColors[r.type]}`}>
                  {r.type}
                </span>
                <span className="text-xs text-gray-500 w-16 shrink-0">{info.nickname}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${mbtiTypeColors[r.type]} rounded-full`}
                    style={{ width: `${Math.max(2, pct)}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-8 text-right">{pct.toFixed(0)}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
