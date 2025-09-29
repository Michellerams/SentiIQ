import React from 'react';
import { Sentiment } from '../types';
import { TagIcon } from './IconComponents';

interface KeywordChipProps {
  keyword: string;
  sentiment: Sentiment;
}

const sentimentChipStyles: Record<Sentiment, string> = {
  [Sentiment.Positive]: 'bg-green-400/20 text-green-300 border-green-400/30',
  [Sentiment.Negative]: 'bg-red-400/20 text-red-300 border-red-400/30',
  [Sentiment.Neutral]: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30',
  [Sentiment.Mixed]: 'bg-indigo-400/20 text-indigo-300 border-indigo-400/30',
  [Sentiment.Surprise]: 'bg-orange-400/20 text-orange-300 border-orange-400/30',
  [Sentiment.Joy]: 'bg-pink-400/20 text-pink-300 border-pink-400/30',
  [Sentiment.Sadness]: 'bg-blue-400/20 text-blue-300 border-blue-400/30',
  [Sentiment.Anger]: 'bg-purple-400/20 text-purple-300 border-purple-400/30',
  [Sentiment.Fear]: 'bg-cyan-400/20 text-cyan-300 border-cyan-400/30',
};

const KeywordChip: React.FC<KeywordChipProps> = ({ keyword, sentiment }) => {
  const style = sentimentChipStyles[sentiment];
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${style} transition-transform duration-200 transform hover:scale-105`}>
      <TagIcon className="h-4 w-4" />
      {keyword}
    </div>
  );
};

export default KeywordChip;