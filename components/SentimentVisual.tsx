import React from 'react';
import { Sentiment } from '../types';
import { PositiveIcon, NegativeIcon, NeutralIcon, MixedIcon, SurpriseIcon, JoyIcon, SadnessIcon, AngerIcon, FearIcon } from './IconComponents';

interface SentimentVisualProps {
  sentiment: Sentiment;
  confidence: number;
  size?: 'small' | 'large';
}

// FIX: Changed icon type from React.ReactNode to React.ReactElement for better type safety with React.cloneElement.
// FIX: Update icon type to specify it accepts a className prop, resolving the cloneElement error.
const sentimentDetails: Record<Sentiment, { icon: React.ReactElement<{ className?: string }>; color: string; glow: string; }> = {
  [Sentiment.Positive]: { icon: <PositiveIcon />, color: 'text-green-400', glow: 'rgba(74, 222, 128, 0.4)' },
  [Sentiment.Negative]: { icon: <NegativeIcon />, color: 'text-red-400', glow: 'rgba(248, 113, 113, 0.4)' },
  [Sentiment.Neutral]: { icon: <NeutralIcon />, color: 'text-yellow-400', glow: 'rgba(250, 204, 21, 0.4)' },
  [Sentiment.Mixed]: { icon: <MixedIcon />, color: 'text-indigo-400', glow: 'rgba(129, 140, 248, 0.4)' },
  [Sentiment.Surprise]: { icon: <SurpriseIcon />, color: 'text-orange-400', glow: 'rgba(251, 146, 60, 0.4)' },
  [Sentiment.Joy]: { icon: <JoyIcon />, color: 'text-pink-400', glow: 'rgba(244, 114, 182, 0.4)' },
  [Sentiment.Sadness]: { icon: <SadnessIcon />, color: 'text-blue-400', glow: 'rgba(96, 165, 250, 0.4)' },
  [Sentiment.Anger]: { icon: <AngerIcon />, color: 'text-purple-400', glow: 'rgba(192, 132, 252, 0.4)' },
  [Sentiment.Fear]: { icon: <FearIcon />, color: 'text-cyan-400', glow: 'rgba(34, 211, 238, 0.4)' },
};

const SentimentVisual: React.FC<SentimentVisualProps> = ({ sentiment, confidence, size = 'large' }) => {
  const details = sentimentDetails[sentiment];
  const scale = (confidence * 0.5) + 0.7; // Scale from 0.7 to 1.2 based on confidence
  const pulseDuration = 2.5 - (confidence * 1.5); // Faster pulse for higher confidence (1s to 2.5s)
  
  const sizeClasses = size === 'large' 
    ? { perspective: 'w-48 h-48', visual: 'w-32 h-32', icon: 'w-16 h-16' }
    : { perspective: 'w-32 h-32', visual: 'w-24 h-24', icon: 'w-12 h-12' };

  // FIX: Cast style object to React.CSSProperties to allow for custom CSS properties.
  const visualStyle = {
    '--glow-color': details.glow,
    transform: `scale(${scale})`,
    animation: `spin-3d 20s linear infinite, confidence-pulse ${pulseDuration}s ease-in-out infinite`,
    transformStyle: 'preserve-3d',
  } as React.CSSProperties;

  return (
    <div className={`flex items-center justify-center ${sizeClasses.perspective}`} style={{ perspective: '800px' }}>
      <div 
        className={`relative ${sizeClasses.visual} rounded-full transition-transform duration-500`}
        style={visualStyle}
      >
        <div className="absolute inset-0 border-2 border-white/10 rounded-full" style={{ transform: 'translateZ(-20px) rotateY(45deg)' }}></div>
        <div className="absolute inset-0 border-2 border-white/10 rounded-full" style={{ transform: 'translateZ(20px) rotateY(-45deg)' }}></div>
        <div className="absolute inset-0 border-2 border-white/10 rounded-full" style={{ transform: 'translateZ(0px) rotateY(90deg)' }}></div>
        <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-sm rounded-full"></div>
        
        <div className={`absolute inset-0 flex items-center justify-center ${details.color}`} style={{ transform: 'translateZ(0px)' }}>
          {/* FIX: Removed the invalid generic argument from cloneElement as the icon's type is now correctly defined in sentimentDetails. */}
          {React.cloneElement(details.icon, { className: sizeClasses.icon })}
        </div>
      </div>
    </div>
  );
};

export default SentimentVisual;