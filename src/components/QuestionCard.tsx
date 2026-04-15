import React from 'react';
import { Question } from '../data/questions';

interface Props {
  question: Question;
  current: number;
  total: number;
  onAnswer: (value: number) => void;
  selectedValue?: number;
}

const options = [
  { value: 2, label: '非常同意', emoji: '💯', color: 'from-emerald-500 to-green-400', selected: 'ring-2 ring-emerald-400 bg-emerald-50' },
  { value: 1, label: '比较同意', emoji: '👍', color: 'from-teal-400 to-cyan-400', selected: 'ring-2 ring-teal-400 bg-teal-50' },
  { value: 0, label: '不确定', emoji: '🤔', color: 'from-gray-400 to-gray-300', selected: 'ring-2 ring-gray-400 bg-gray-50' },
  { value: -1, label: '比较不同意', emoji: '👎', color: 'from-orange-400 to-amber-300', selected: 'ring-2 ring-orange-400 bg-orange-50' },
  { value: -2, label: '非常不同意', emoji: '❌', color: 'from-red-500 to-rose-400', selected: 'ring-2 ring-red-400 bg-red-50' },
];

export const QuestionCard: React.FC<Props> = ({
  question,
  current,
  total,
  onAnswer,
  selectedValue,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>第 {current} / {total} 题</span>
          <span>{Math.round((current / total) * 100)}% 完成</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${(current / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
        <div className="flex items-start gap-3 mb-6">
          <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {current}
          </span>
          <p className="text-lg text-gray-800 leading-relaxed font-medium">{question.text}</p>
        </div>

        <div className="grid gap-3">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onAnswer(opt.value)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 text-left hover:shadow-md hover:-translate-y-0.5 ${
                selectedValue === opt.value
                  ? opt.selected + ' border-transparent shadow-md'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <span className="text-xl">{opt.emoji}</span>
              <span className={`font-medium ${selectedValue === opt.value ? 'text-gray-800' : 'text-gray-600'}`}>
                {opt.label}
              </span>
              {selectedValue === opt.value && (
                <span className="ml-auto text-green-500">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
