import React from 'react';

interface Props {
  totalTime: number; // seconds
  questionCount: number;
  questionTimes: number[]; // seconds per question
}

export const StatsCard: React.FC<Props> = ({ totalTime, questionCount, questionTimes }) => {
  const avgTime = totalTime / questionCount;
  const minTime = Math.min(...questionTimes);
  const maxTime = Math.max(...questionTimes);
  const fastestQ = questionTimes.indexOf(minTime) + 1;
  const slowestQ = questionTimes.indexOf(maxTime) + 1;

  const formatTime = (s: number) => {
    if (s < 60) return `${s.toFixed(1)}秒`;
    return `${Math.floor(s / 60)}分${(s % 60).toFixed(0)}秒`;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">⏱️ 答题速度分析</h3>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-indigo-50 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-indigo-700">{formatTime(totalTime)}</div>
          <div className="text-xs text-indigo-500 mt-1">总用时</div>
        </div>
        <div className="bg-violet-50 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-violet-700">{formatTime(avgTime)}</div>
          <div className="text-xs text-violet-500 mt-1">平均每题用时</div>
        </div>
        <div className="bg-green-50 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-green-700">{formatTime(minTime)}</div>
          <div className="text-xs text-green-500 mt-0.5">最快（第{fastestQ}题）</div>
        </div>
        <div className="bg-orange-50 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-orange-700">{formatTime(maxTime)}</div>
          <div className="text-xs text-orange-500 mt-0.5">最慢（第{slowestQ}题）</div>
        </div>
      </div>

      {/* Per-question bars */}
      <div className="space-y-1.5">
        <div className="text-xs font-semibold text-gray-500 mb-2">每道题用时</div>
        {questionTimes.map((t, idx) => {
          const pct = (t / maxTime) * 100;
          const isfast = t <= avgTime;
          return (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-xs text-gray-400 w-6 text-right shrink-0">Q{idx + 1}</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${isfast ? 'bg-green-400' : 'bg-amber-400'}`}
                  style={{ width: `${Math.max(3, pct)}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 w-12 text-right shrink-0">{t.toFixed(1)}s</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-xl text-xs text-gray-500 flex gap-4">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-green-400 inline-block" />
          快于平均速度
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
          慢于平均速度
        </span>
      </div>
    </div>
  );
};
