import React from 'react';

interface WelcomePageProps {
  onStart: () => void;
  isExiting: boolean;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onStart, isExiting }) => {
  return (
    <div className={`min-h-screen flex items-center justify-center text-slate-200 font-sans p-4 transition-opacity duration-500 ${isExiting ? 'animate-fadeOut' : 'opacity-100'}`}>
        <div className="w-full max-w-2xl text-center">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 shadow-2xl shadow-sky-500/10 p-8 md:p-12 animate-scale-in-center">
                <div className="overflow-hidden pb-2">
                    <h1 className="text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-sky-400 to-red-400 animate-slide-in-top">
                        SentiIQ
                    </h1>
                </div>

                <p className="text-slate-400 text-lg md:text-xl mt-2 mb-8 animate-fade-in-delay-1">
                    Your intelligent sentiment analysis dashboard.
                </p>

                <div className="animate-fade-in-delay-2">
                    <button
                        onClick={onStart}
                        className="bg-sky-600 text-white font-bold py-4 px-10 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                        style={{ animation: 'pulse-glow 2.5s infinite' }}
                    >
                        Enter SentiIQ
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default WelcomePage;
