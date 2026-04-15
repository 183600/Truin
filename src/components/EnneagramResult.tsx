import React, { useState } from 'react';
import { EnneagramResult as EnneagramResultType } from '../data/scoring';

interface Props {
  result: EnneagramResultType;
}

const typeColors: Record<number, { bg: string; text: string; border: string; gradient: string; emoji: string }> = {
  1: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', gradient: 'from-amber-400 to-orange-500', emoji: '⚖️' },
  2: { bg: 'bg-pink-50', text: 'text-pink-800', border: 'border-pink-200', gradient: 'from-pink-400 to-rose-500', emoji: '💗' },
  3: { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-200', gradient: 'from-yellow-400 to-amber-500', emoji: '🏆' },
  4: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200', gradient: 'from-purple-400 to-violet-600', emoji: '🎭' },
  5: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200', gradient: 'from-blue-400 to-indigo-600', emoji: '🔭' },
  6: { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200', gradient: 'from-green-400 to-teal-500', emoji: '🛡️' },
  7: { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-200', gradient: 'from-orange-400 to-yellow-400', emoji: '🎉' },
  8: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200', gradient: 'from-red-500 to-rose-600', emoji: '⚡' },
  9: { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200', gradient: 'from-teal-400 to-cyan-500', emoji: '☮️' },
};

const centerInfo: Record<number, string> = {
  1: '本能中心（肠脑）', 8: '本能中心（肠脑）', 9: '本能中心（肠脑）',
  2: '情感中心（心脑）', 3: '情感中心（心脑）', 4: '情感中心（心脑）',
  5: '思维中心（头脑）', 6: '思维中心（头脑）', 7: '思维中心（头脑）',
};

export const EnneagramResultComponent: React.FC<Props> = ({ result }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'health' | 'tritype'>('overview');
  const color = typeColors[result.type];
  const maxScore = result.allScores[0].score;

  return (
    <div className="space-y-6">
      {/* Primary Type Card */}
      <div className={`bg-gradient-to-br ${color.gradient} rounded-2xl p-6 text-white shadow-xl`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-sm font-medium opacity-80 mb-1">九型人格结果</div>
            <div className="flex items-center gap-3">
              <div className="text-5xl font-black">{result.type}</div>
              <div className="text-4xl">{color.emoji}</div>
            </div>
            <div className="text-xl font-bold opacity-90 mt-1">{result.nickname}</div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-75">翼型</div>
            <div className="text-2xl font-bold">{result.type}w{result.wing}</div>
          </div>
        </div>
        <p className="text-sm opacity-85 leading-relaxed mb-3">{result.description}</p>
        <div className="flex gap-4 text-sm">
          <span className="bg-white/20 px-3 py-1 rounded-full">
            {centerInfo[result.type]}
          </span>
          <span className="bg-white/20 px-3 py-1 rounded-full">
            {result.instinctualVariant}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100">
          {(['overview', 'health', 'tritype'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab === 'overview' ? '💡 核心信息' : tab === 'health' ? '🌡️ 健康层级' : '🔺 三联型'}
            </button>
          ))}
        </div>

        <div className="p-5">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className={`${color.bg} ${color.border} border rounded-xl p-4`}>
                <div className={`text-xs font-bold ${color.text} mb-2 uppercase tracking-wide`}>核心渴望</div>
                <p className="text-gray-700 text-sm">{result.coreDesire}</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="text-xs font-bold text-red-700 mb-2 uppercase tracking-wide">核心恐惧</div>
                <p className="text-gray-700 text-sm">{result.coreFear}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-xs font-bold text-gray-600 mb-3 uppercase tracking-wide">翼型说明</div>
                <p className="text-gray-600 text-sm">
                  你的主型是 <strong>第{result.type}型</strong>，辅助翼型为 <strong>第{result.wing}型</strong>。
                  翼型会影响主型的表现方式，使你同时具有邻近类型的部分特征。
                  你的完整类型可以记为 <strong>{result.type}w{result.wing}</strong>。
                </p>
              </div>
            </div>
          )}

          {activeTab === 'health' && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="text-xs font-bold text-green-700 mb-2">🌟 健康状态（高层次）</div>
                <p className="text-gray-700 text-sm">{result.healthLevels.high}</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="text-xs font-bold text-yellow-700 mb-2">⚡ 一般状态（中层次）</div>
                <p className="text-gray-700 text-sm">{result.healthLevels.average}</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="text-xs font-bold text-red-700 mb-2">⚠️ 不健康状态（低层次）</div>
                <p className="text-gray-700 text-sm">{result.healthLevels.low}</p>
              </div>
            </div>
          )}

          {activeTab === 'tritype' && (
            <div className="space-y-4">
              <div className="text-sm text-gray-600 bg-indigo-50 rounded-xl p-4">
                三联型（Tritype）指在九型的三个中心（本能、情感、思维）中各选一个最强的类型，组合成你独特的人格模式。
              </div>
              <div className="flex gap-3 justify-center">
                {result.tritypes.map((t) => {
                  const tc = typeColors[t];
                  const sortedCenters = [
                    { center: '本能', types: [1, 8, 9] },
                    { center: '情感', types: [2, 3, 4] },
                    { center: '思维', types: [5, 6, 7] },
                  ];
                  const centerName = sortedCenters.find(c => c.types.includes(t))?.center ?? '';
                  return (
                    <div key={t} className={`flex-1 ${tc.bg} ${tc.border} border rounded-xl p-4 text-center`}>
                      <div className={`text-xs font-medium ${tc.text} mb-1`}>{centerName}中心</div>
                      <div className={`text-3xl font-black bg-gradient-to-br ${tc.gradient} bg-clip-text text-transparent`}>{t}</div>
                      <div className="text-2xl mt-1">{tc.emoji}</div>
                    </div>
                  );
                })}
              </div>
              <div className="text-center text-sm font-bold text-gray-700">
                三联型代码：{result.tritypes.join('-')}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* All Type Scores */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">📊 九型得分排名</h3>
        <div className="space-y-2">
          {result.allScores.map((s, idx) => {
            const tc = typeColors[s.type];
            const pct = maxScore > 0 ? (s.score / maxScore) * 100 : 0;
            return (
              <div key={s.type} className="flex items-center gap-3">
                <span className={`text-xs font-bold w-4 ${idx === 0 ? 'text-yellow-500' : 'text-gray-400'}`}>{idx + 1}</span>
                <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold bg-gradient-to-br ${tc.gradient}`}>
                  {s.type}
                </span>
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${tc.gradient} rounded-full`}
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
