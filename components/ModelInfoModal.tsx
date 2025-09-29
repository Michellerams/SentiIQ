import React from 'react';
import { XIcon } from './IconComponents';

interface ModelInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModelInfoModal: React.FC<ModelInfoModalProps> = ({ isOpen, onClose }) => {
  return (
    <div 
      className={`fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className={`bg-slate-800 rounded-lg border border-slate-700 shadow-2xl p-6 m-4 max-w-2xl w-full relative transform transition-all duration-300 ease-in-out ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-200 transition-colors"
          aria-label="Close modal"
        >
          <XIcon className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-yellow-400 mb-4">About the AI Model</h2>
        <div className="text-slate-400 space-y-4 prose prose-invert prose-sm max-w-none">
          <p>
            This dashboard uses a powerful large language model (Gemini) to perform sentiment analysis. While highly capable, it's important to understand its limitations to interpret the results correctly.
          </p>
          <ul>
            <li><strong>Subjectivity of Sentiment:</strong> Sentiment is often subjective and context-dependent. The AI classifies text based on patterns in its training data, which might not always align with human nuance, sarcasm, or specific domain knowledge.</li>
            <li><strong>Confidence Scores:</strong> The confidence score reflects the model's certainty in its classification. It is an estimation, not a guarantee of accuracy. A low confidence score may indicate ambiguous text that could be interpreted in multiple ways.</li>
            <li><strong>Potential for Bias:</strong> Like all AI models, Gemini is trained on vast amounts of text from the internet and may reflect biases present in that data. This can sometimes lead to skewed or unfair interpretations for certain types of text or demographics.</li>
            <li><strong>Lack of True Understanding:</strong> The model does not "understand" text in the way a human does. It identifies patterns and relationships between words. It may miss subtle cues, cultural references, or the broader context of a conversation.</li>
          </ul>
          <p>
            Always use these results as a guide or a starting point for deeper analysis, and consider cross-referencing with human judgment for critical applications.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModelInfoModal;