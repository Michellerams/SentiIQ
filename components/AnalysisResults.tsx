import React from 'react';
import { AnalysisResult, Sentiment } from '../types';
import { PositiveIcon, NegativeIcon, NeutralIcon, MixedIcon, SurpriseIcon, JoyIcon, SadnessIcon, AngerIcon, FearIcon } from './IconComponents';

interface AnalysisResultsProps {
  results: AnalysisResult[];
  selectedIndices: number[];
  onSelect: (index: number) => void;
}

const sentimentStyles: Record<Sentiment, { icon: React.ReactNode; bg: string; text: string; ring: string; selectedBg: string; emoji: string; }> = {
  [Sentiment.Positive]: {
    icon: <PositiveIcon className="h-5 w-5 text-green-400" />,
    bg: 'hover:bg-green-500/10',
    text: 'text-green-400',
    ring: 'ring-green-400',
    selectedBg: 'bg-green-500/20',
    emoji: '✨'
  },
  [Sentiment.Negative]: {
    icon: <NegativeIcon className="h-5 w-5 text-red-400" />,
    bg: 'hover:bg-red-500/10',
    text: 'text-red-400',
    ring: 'ring-red-400',
    selectedBg: 'bg-red-500/20',
    emoji: '😞'
  },
  [Sentiment.Neutral]: {
    icon: <NeutralIcon className="h-5 w-5 text-yellow-400" />,
    bg: 'hover:bg-yellow-500/10',
    text: 'text-yellow-400',
    ring: 'ring-yellow-400',
    selectedBg: 'bg-yellow-500/20',
    emoji: '😐'
  },
  [Sentiment.Mixed]: {
    icon: <MixedIcon className="h-5 w-5 text-indigo-400" />,
    bg: 'hover:bg-indigo-500/10',
    text: 'text-indigo-400',
    ring: 'ring-indigo-400',
    selectedBg: 'bg-indigo-500/20',
    emoji: '🎭'
  },
  [Sentiment.Surprise]: {
    icon: <SurpriseIcon className="h-5 w-5 text-orange-400" />,
    bg: 'hover:bg-orange-500/10',
    text: 'text-orange-400',
    ring: 'ring-orange-400',
    selectedBg: 'bg-orange-500/20',
    emoji: '😮'
  },
  [Sentiment.Joy]: {
    icon: <JoyIcon className="h-5 w-5 text-pink-400" />,
    bg: 'hover:bg-pink-500/10',
    text: 'text-pink-400',
    ring: 'ring-pink-400',
    selectedBg: 'bg-pink-500/20',
    emoji: '😄'
  },
  [Sentiment.Sadness]: {
    icon: <SadnessIcon className="h-5 w-5 text-blue-400" />,
    bg: 'hover:bg-blue-500/10',
    text: 'text-blue-400',
    ring: 'ring-blue-400',
    selectedBg: 'bg-blue-500/20',
    emoji: '😢'
  },
  [Sentiment.Anger]: {
    icon: <AngerIcon className="h-5 w-5 text-purple-400" />,
    bg: 'hover:bg-purple-500/10',
    text: 'text-purple-400',
    ring: 'ring-purple-400',
    selectedBg: 'bg-purple-500/20',
    emoji: '😠'
  },
  [Sentiment.Fear]: {
    icon: <FearIcon className="h-5 w-5 text-cyan-400" />,
    bg: 'hover:bg-cyan-500/10',
    text: 'text-cyan-400',
    ring: 'ring-cyan-400',
    selectedBg: 'bg-cyan-500/20',
    emoji: '😨'
  },
};

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results, selectedIndices, onSelect }) => {
  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-lg font-semibold text-slate-100">Analysis Items ({results.length})</h2>
        <p className="text-xs text-slate-400">Select one for details, or two to compare.</p>
      </div>
      <div className="overflow-y-auto max-h-96">
        <ul className="divide-y divide-slate-700">
          {results.map((result, index) => {
            const styles = sentimentStyles[result.sentiment];
            const isSelected = selectedIndices.includes(index);
            return (
              <li key={index} 
                  className="animate-fadeInUp" 
                  style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}>
                <button
                  onClick={() => onSelect(index)}
                  className={`w-full text-left p-4 flex items-start gap-3 transition-all duration-300 transform ${styles.bg} ${isSelected ? `${styles.selectedBg} ring-2 ring-inset ${styles.ring}` : 'hover:-translate-y-1 hover:shadow-lg'}`}
                >
                  <div className="flex-shrink-0 pt-1">{styles.icon}</div>
                  <div className="flex-grow">
                    <p className="text-slate-300 truncate text-sm">{result.text}</p>
                    <p className={`text-xs font-semibold ${styles.text}`}>{styles.emoji} {result.sentiment}</p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default AnalysisResults;