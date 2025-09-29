import React from 'react';
import { AnalysisResult, Sentiment } from '../types';
import { SparklesIcon } from './IconComponents';
import KeywordChip from './KeywordChip';
import SentimentVisual from './SentimentVisual';

interface ComparisonViewProps {
  result1: AnalysisResult;
  result2: AnalysisResult;
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

const ResultCard: React.FC<{ result: AnalysisResult }> = ({ result }) => {
    const details = sentimentDetails[result.sentiment];

    return (
        <div className={`bg-slate-800/50 rounded-lg border ${details.border} p-4 flex flex-col gap-4 h-full`}>
            <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-2">Analyzed Text</h4>
                <p className="bg-slate-900 p-2 rounded-md text-slate-400 text-sm border border-slate-700 italic">"{result.text}"</p>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 py-4">
                <SentimentVisual sentiment={result.sentiment} confidence={result.confidence} size="small" />
                <div className="text-center">
                    <h3 className="text-xl font-bold text-slate-100">{result.sentiment}</h3>
                    <p className="text-slate-400 text-sm">Confidence: {(result.confidence * 100).toFixed(1)}%</p>
                </div>
            </div>


            <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-2">Sentiment Drivers</h4>
                <div className="flex flex-wrap gap-1.5">
                    {result.keywords.map((keyword, index) => (
                        <KeywordChip key={index} keyword={keyword} sentiment={result.sentiment} />
                    ))}
                </div>
            </div>

            <div className="mt-auto">
                 <h4 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                    <SparklesIcon className="h-4 w-4 text-sky-400"/>
                    AI Explanation
                </h4>
                <p className="text-slate-400 text-sm">{result.explanation}</p>
            </div>
        </div>
    );
};


const ComparisonView: React.FC<ComparisonViewProps> = ({ result1, result2 }) => {
  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6 transition-all duration-300 transform hover:shadow-2xl hover:shadow-sky-500/20 hover:border-sky-500/50 hover:-translate-y-1">
        <h2 className="text-xl font-semibold mb-4 text-slate-100">Comparative Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResultCard result={result1} />
            <ResultCard result={result2} />
        </div>
    </div>
  );
};

export default ComparisonView;