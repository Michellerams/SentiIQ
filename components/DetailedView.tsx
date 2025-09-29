import React from 'react';
import { AnalysisResult, Sentiment } from '../types';
import { SparklesIcon } from './IconComponents';
import KeywordChip from './KeywordChip';
import SentimentVisual from './SentimentVisual';

interface DetailedViewProps {
  result: AnalysisResult;
}

const sentimentDetails: Record<Sentiment, { border: string; }> = {
  [Sentiment.Positive]: { border: 'border-green-400/50' },
  [Sentiment.Negative]: { border: 'border-red-400/50' },
  [Sentiment.Neutral]: { border: 'border-yellow-400/50' },
  [Sentiment.Mixed]: { border: 'border-indigo-400/50' },
  [Sentiment.Surprise]: { border: 'border-orange-400/50' },
  [Sentiment.Joy]: { border: 'border-pink-400/50' },
  [Sentiment.Sadness]: { border: 'border-blue-400/50' },
  [Sentiment.Anger]: { border: 'border-purple-400/50' },
  [Sentiment.Fear]: { border: 'border-cyan-400/50' },
};

const DetailedView: React.FC<DetailedViewProps> = ({ result }) => {
  const details = sentimentDetails[result.sentiment];

  return (
    <div className={`bg-slate-800/50 rounded-lg border ${details.border} p-6 flex flex-col gap-6 transition-all duration-300 transform hover:shadow-2xl hover:shadow-sky-500/20 hover:border-sky-500/50 hover:-translate-y-1`}>
      <div>
        <h3 className="text-lg font-semibold text-slate-300 mb-2">Analyzed Text</h3>
        <p className="bg-slate-900 p-4 rounded-md text-slate-400 border border-slate-700 italic">"{result.text}"</p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6 p-4">
        <SentimentVisual sentiment={result.sentiment} confidence={result.confidence} />
        <div className="text-center md:text-left">
           <h3 className="text-3xl font-bold text-slate-100">{result.sentiment}</h3>
           <p className="text-slate-400">Confidence Score: {(result.confidence * 100).toFixed(1)}%</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-300 mb-2">Sentiment Drivers</h3>
        <div className="flex flex-wrap gap-2">
          {result.keywords.map((keyword, index) => (
            <KeywordChip key={index} keyword={keyword} sentiment={result.sentiment} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-300 mb-2 flex items-center gap-2">
            <SparklesIcon className="h-5 w-5 text-sky-400"/>
            AI Explanation
        </h3>
        <p className="text-slate-400">{result.explanation}</p>
      </div>
    </div>
  );
};

export default DetailedView;