import React, { useState } from 'react';

interface NameCaptureModalProps {
  isOpen: boolean;
  onNameSubmit: (name: string) => void;
}

const NameCaptureModal: React.FC<NameCaptureModalProps> = ({ isOpen, onNameSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onNameSubmit(name.trim());
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out opacity-100"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-slate-800 rounded-lg border border-slate-700 shadow-2xl p-8 m-4 max-w-md w-full relative transform transition-all duration-300 ease-in-out scale-100 opacity-100"
      >
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-green-400 mb-4 text-center">
          Welcome to SentiIQ!
        </h2>
        <p className="text-slate-400 mb-6 text-center">What should we call you?</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full p-3 bg-slate-900 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none text-slate-200 placeholder-slate-500 text-center"
            autoFocus
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full mt-4 bg-gradient-to-r from-sky-500 to-green-500 hover:from-sky-400 hover:to-green-400 text-white font-bold py-3 px-4 rounded-md transition-all duration-300 disabled:bg-slate-600 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed transform hover:-translate-y-1"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default NameCaptureModal;
