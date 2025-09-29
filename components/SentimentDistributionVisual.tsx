import React, { useMemo } from 'react';
import { AnalysisResult, Sentiment } from '../types';
import { PositiveIcon, NegativeIcon, NeutralIcon, MixedIcon, SurpriseIcon, JoyIcon, SadnessIcon, AngerIcon, FearIcon } from './IconComponents';

// FIX: Update icon type to specify it accepts a className prop, resolving the cloneElement error.
const sentimentDetails: Record<Sentiment, {
    icon: React.ReactElement<{ className?: string }>;
    color: string;
    borderColor: string;
}> = {
  [Sentiment.Positive]: { icon: <PositiveIcon />, color: 'bg-green-500/60', borderColor: 'border-green-300' },
  [Sentiment.Negative]: { icon: <NegativeIcon />, color: 'bg-red-500/60', borderColor: 'border-red-300' },
  [Sentiment.Neutral]: { icon: <NeutralIcon />, color: 'bg-yellow-500/60', borderColor: 'border-yellow-300' },
  [Sentiment.Mixed]: { icon: <MixedIcon />, color: 'bg-indigo-500/60', borderColor: 'border-indigo-300' },
  [Sentiment.Surprise]: { icon: <SurpriseIcon />, color: 'bg-orange-500/60', borderColor: 'border-orange-300' },
  [Sentiment.Joy]: { icon: <JoyIcon />, color: 'bg-pink-500/60', borderColor: 'border-pink-300' },
  [Sentiment.Sadness]: { icon: <SadnessIcon />, color: 'bg-blue-500/60', borderColor: 'border-blue-300' },
  [Sentiment.Anger]: { icon: <AngerIcon />, color: 'bg-purple-500/60', borderColor: 'border-purple-300' },
  [Sentiment.Fear]: { icon: <FearIcon />, color: 'bg-cyan-500/60', borderColor: 'border-cyan-300' },
};

const ANIMATIONS = ['float-1', 'float-2', 'float-3', 'float-4'];

interface SentimentDistributionVisualProps {
  data: AnalysisResult[];
}

const SentimentDistributionVisual: React.FC<SentimentDistributionVisualProps> = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const sentimentCounts = data.reduce((acc, result) => {
      acc[result.sentiment] = (acc[result.sentiment] || 0) + 1;
      return acc;
    }, {} as Record<Sentiment, number>);

    const total = data.length;

    return Object.entries(sentimentCounts)
      .map(([name, value], index) => {
        const percentage = (value / total);
        const size = 40 + Math.pow(percentage, 0.5) * 120; // Non-linear scale for better visibility
        return {
          name: name as Sentiment,
          value,
          percentage: (percentage * 100).toFixed(1),
          size,
          top: `${10 + (index * 15) % 60}%`,
          left: `${10 + (index * 25) % 60}%`,
          animation: `${ANIMATIONS[index % ANIMATIONS.length]} ${20 + Math.random() * 15}s ease-in-out infinite`,
          animationDelay: `${Math.random() * -10}s`,
        };
      })
      .sort((a, b) => b.size - a.size); // Render larger items first (lower z-index)
  }, [data]);

  if (chartData.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-80 overflow-hidden bg-slate-900/50 rounded-lg backdrop-blur-sm" style={{ perspective: '1200px', perspectiveOrigin: '50% 50%' }}>
      {chartData.map((entry) => {
        const details = sentimentDetails[entry.name];
        const faceBaseClasses = `dice-face ${details.color} ${details.borderColor}`;
        const nameFontSize = Math.max(8, entry.size * 0.15);
        const percentFontSize = Math.max(7, entry.size * 0.12);
        
        return (
          <div
            key={entry.name}
            className="dice-container"
            style={{
              width: `${entry.size}px`,
              height: `${entry.size}px`,
              top: entry.top,
              left: entry.left,
              zIndex: Math.round(100 - entry.size),
              animation: entry.animation,
              animationDelay: entry.animationDelay,
            }}
          >
            <div
                className="dice"
                style={{ '--dice-size': `${entry.size}px` } as React.CSSProperties}
            >
              <div className={`${faceBaseClasses} front`}>{React.cloneElement(details.icon, { className: 'w-1/2 h-1/2 text-white' })}</div>
              <div className={`${faceBaseClasses} back`}>{React.cloneElement(details.icon, { className: 'w-1/2 h-1/2 text-white' })}</div>
              <div className={`${faceBaseClasses} left text-white p-1`}><p className="font-bold" style={{ fontSize: `${nameFontSize}px` }}>{entry.name}</p></div>
              <div className={`${faceBaseClasses} right text-white p-1`}><p className="font-bold" style={{ fontSize: `${nameFontSize}px` }}>{entry.name}</p></div>
              <div className={`${faceBaseClasses} top text-white p-1`}><p className="font-medium" style={{ fontSize: `${percentFontSize}px` }}>{entry.percentage}%</p></div>
              <div className={`${faceBaseClasses} bottom text-white p-1`}><p className="font-medium" style={{ fontSize: `${percentFontSize}px` }}>{entry.percentage}%</p></div>
            </div>
          </div>
        )
      })}
    </div>
  );
};

export default SentimentDistributionVisual;