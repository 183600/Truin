import { useState, useEffect, useRef, useCallback } from 'react';
import { questions } from './data/questions';
import { BigFiveTrait, JungFunction } from './data/questions';
import {
  JungScores,
  getEnneagramResult,
  getBigFiveResult,
  getMBTIFromJung,
} from './data/scoring';
import { QuestionCard } from './components/QuestionCard';
import { JungResult } from './components/JungResult';
import { EnneagramResultComponent } from './components/EnneagramResult';
import { BigFiveResult } from './components/BigFiveResult';
import { StatsCard } from './components/StatsCard';

type Phase = 'intro' | 'test' | 'results';
type ResultTab = 'jung' | 'enneagram' | 'bigfive' | 'stats';

const jungFunctions: JungFunction[] = ['Te', 'Ti', 'Fe', 'Fi', 'Se', 'Si', 'Ne', 'Ni'];
const bigFiveTraits: BigFiveTrait[] = ['E', 'N', 'C', 'A', 'O'];

function computeScores(answers: Record<number, number>) {
  const jungScores: JungScores = { Te: 0, Ti: 0, Fe: 0, Fi: 0, Se: 0, Si: 0, Ne: 0, Ni: 0 };
  const enneagramRaw: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  const bigFiveRaw: Record<BigFiveTrait, number> = { E: 0, N: 0, C: 0, A: 0, O: 0 };

  for (const question of questions) {
    const answer = answers[question.id];
    if (answer === undefined) continue;

    for (const fn of jungFunctions) {
      const weight = question.jung[fn] ?? 0;
      jungScores[fn] += answer * weight;
    }

    for (let t = 1; t <= 9; t++) {
      const weight = question.enneagram[t] ?? 0;
      enneagramRaw[t] += answer * weight;
    }

    for (const trait of bigFiveTraits) {
      const weight = question.bigFive[trait] ?? 0;
      bigFiveRaw[trait] += answer * weight;
    }
  }

  return { jungScores, enneagramRaw, bigFiveRaw };
}

export default function App() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [activeTab, setActiveTab] = useState<ResultTab>('jung');
  const [questionTimes, setQuestionTimes] = useState<number[]>([]);
  const [totalTime, setTotalTime] = useState(0);
  const questionStartRef = useRef<number>(Date.now());
  const testStartRef = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (phase === 'test') {
      testStartRef.current = Date.now();
      questionStartRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - testStartRef.current) / 1000));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  const handleAnswer = useCallback((value: number) => {
    const questionId = questions[currentIndex].id;
    const elapsed = (Date.now() - questionStartRef.current) / 1000;

    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setQuestionTimes(prev => {
      const updated = [...prev];
      updated[currentIndex] = elapsed;
      return updated;
    });

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        questionStartRef.current = Date.now();
      } else {
        const total = (Date.now() - testStartRef.current) / 1000;
        setTotalTime(total);
        setPhase('results');
      }
    }, 300);
  }, [currentIndex]);

  const restartTest = () => {
    setPhase('intro');
    setCurrentIndex(0);
    setAnswers({});
    setQuestionTimes([]);
    setTotalTime(0);
    setElapsedSeconds(0);
    setActiveTab('jung');
  };

  const goToResults = () => {
    const total = (Date.now() - testStartRef.current) / 1000;
    setTotalTime(total);
    setPhase('results');
  };

  const formatTimer = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  // ─── Intro Screen ─────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🧩</div>
            <h1 className="text-4xl font-black text-white mb-3 leading-tight">
              综合人格测试
            </h1>
            <p className="text-lg text-indigo-200 leading-relaxed">
              同时测量三大人格体系，深度了解你的内心世界
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-8">
            {[
              {
                icon: '🧠', title: '荣格八维认知功能',
                items: ['测量 Te/Ti/Fe/Fi/Se/Si/Ne/Ni 八维强度', '推算最匹配的 MBTI 类型', '提供多种计算标准对比', '展示全部16型匹配度排名'],
                color: 'from-indigo-500/20 to-violet-500/20 border-indigo-500/30',
              },
              {
                icon: '🔺', title: '九型人格',
                items: ['识别主型与翼型（如 4w5）', '分析三联型（Tritype）代码', '揭示本能变式（sp / so / sx）', '展示三个健康层级描述'],
                color: 'from-pink-500/20 to-rose-500/20 border-pink-500/30',
              },
              {
                icon: '📊', title: '大五人格（SLOAN分类）',
                items: ['生成五字母类型代码（如 RLUEI）', '按照 S/R · L/C · O/U · A/E · I/N 分类', '对应标准大五 E/N/C/A/O 五维度', '展示每个维度的详细解读'],
                color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
              },
            ].map((sys) => (
              <div key={sys.title} className={`bg-gradient-to-r ${sys.color} border rounded-2xl p-5`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{sys.icon}</span>
                  <h3 className="text-white font-bold text-lg">{sys.title}</h3>
                </div>
                <ul className="space-y-1.5">
                  {sys.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-indigo-200">
                      <span className="text-indigo-400 mt-0.5">✦</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-6 text-sm text-indigo-300 mb-8">
            <span className="flex items-center gap-1.5"><span>📝</span> 共 {questions.length} 道题</span>
            <span className="flex items-center gap-1.5"><span>⏱️</span> 约 5~10 分钟</span>
            <span className="flex items-center gap-1.5"><span>🔒</span> 数据不上传</span>
          </div>

          <button
            onClick={() => setPhase('test')}
            className="w-full py-4 bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-0.5"
          >
            开始测试 →
          </button>
        </div>
      </div>
    );
  }

  // ─── Test Screen ──────────────────────────────────────────────────────────
  if (phase === 'test') {
    const question = questions[currentIndex];
    const selectedValue = answers[question.id];
    const answeredCount = Object.keys(answers).length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-4">
        <div className="max-w-2xl mx-auto mb-4">
          <div className="flex items-center justify-between">
            <button onClick={restartTest} className="text-xs text-gray-400 hover:text-gray-600">← 退出</button>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 font-mono">⏱️ {formatTimer(elapsedSeconds)}</span>
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
                已答 {answeredCount}/{questions.length}
              </span>
            </div>
          </div>
        </div>

        <QuestionCard
          question={question}
          current={currentIndex + 1}
          total={questions.length}
          onAnswer={handleAnswer}
          selectedValue={selectedValue}
        />

        <div className="max-w-2xl mx-auto flex gap-3 mt-2">
          <button
            onClick={() => { if (currentIndex > 0) { setCurrentIndex(p => p - 1); questionStartRef.current = Date.now(); } }}
            disabled={currentIndex === 0}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← 上一题
          </button>
          <div className="flex-1" />
          {selectedValue !== undefined && currentIndex < questions.length - 1 && (
            <button
              onClick={() => { setCurrentIndex(p => p + 1); questionStartRef.current = Date.now(); }}
              className="px-4 py-2 text-sm text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50"
            >
              下一题 →
            </button>
          )}
          {selectedValue !== undefined && currentIndex === questions.length - 1 && (
            <button
              onClick={goToResults}
              className="px-6 py-2 text-sm bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-xl font-medium hover:shadow-md"
            >
              查看结果 ✓
            </button>
          )}
        </div>

        <div className="max-w-2xl mx-auto mt-4 flex flex-wrap gap-1.5 justify-center">
          {questions.map((q, idx) => {
            const answered = answers[q.id] !== undefined;
            return (
              <button
                key={q.id}
                onClick={() => { setCurrentIndex(idx); questionStartRef.current = Date.now(); }}
                className={`w-7 h-7 rounded-full text-xs font-medium transition-all ${
                  idx === currentIndex
                    ? 'bg-indigo-600 text-white scale-110 shadow-md'
                    : answered
                    ? 'bg-indigo-200 text-indigo-700'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── Results Screen ───────────────────────────────────────────────────────
  const { jungScores, enneagramRaw, bigFiveRaw } = computeScores(answers);
  const enneagramResult = getEnneagramResult(enneagramRaw);
  const bigFiveResult = getBigFiveResult(bigFiveRaw);
  const mbtiPrimary = getMBTIFromJung(jungScores).primary;

  const answeredQTimes = questionTimes.filter(t => t !== undefined && t > 0);
  const validTotal = totalTime > 0 ? totalTime : answeredQTimes.reduce((a, b) => a + b, 0);
  const avgTimePerQ = answeredQTimes.length > 0
    ? (answeredQTimes.reduce((a, b) => a + b, 0) / answeredQTimes.length).toFixed(1)
    : '0';

  const tabs: { id: ResultTab; label: string; icon: string }[] = [
    { id: 'jung', label: '荣格八维', icon: '🧠' },
    { id: 'enneagram', label: '九型人格', icon: '🔺' },
    { id: 'bigfive', label: '大五人格', icon: '📊' },
    { id: 'stats', label: '速度分析', icon: '⏱️' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 text-white px-4 pt-6 pb-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-black">🧩 你的人格测试结果</h1>
              <p className="text-indigo-300 text-sm mt-1">基于 {Object.keys(answers).length} 道题的综合分析</p>
            </div>
            <button
              onClick={restartTest}
              className="text-xs bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl transition-colors"
            >
              重新测试
            </button>
          </div>

          {/* Summary badges */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: '荣格MBTI', value: mbtiPrimary },
              { label: '九型人格', value: `${enneagramResult.type}w${enneagramResult.wing}` },
              { label: '大五代码', value: bigFiveResult.typeCode },
              { label: '平均每题', value: `${avgTimePerQ}s` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/10 rounded-xl p-2 text-center">
                <div className="text-xs text-indigo-300 mb-0.5">{label}</div>
                <div className="font-black text-base tracking-wider leading-tight">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-2xl mx-auto flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-1 text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
                activeTab === tab.id
                  ? 'text-indigo-700 border-b-2 border-indigo-600 bg-indigo-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.slice(0, 4)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-4">
        {activeTab === 'jung' && <JungResult scores={jungScores} />}
        {activeTab === 'enneagram' && <EnneagramResultComponent result={enneagramResult} />}
        {activeTab === 'bigfive' && <BigFiveResult result={bigFiveResult} />}
        {activeTab === 'stats' && (
          <StatsCard
            totalTime={validTotal}
            questionCount={Math.max(1, answeredQTimes.length)}
            questionTimes={answeredQTimes.length > 0 ? answeredQTimes : [1]}
          />
        )}

        <div className="mt-8 text-center pb-8">
          <button
            onClick={restartTest}
            className="px-8 py-3 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
          >
            重新测试
          </button>
        </div>
      </div>
    </div>
  );
}
