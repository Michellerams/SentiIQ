import React from 'react';
import { XIcon, DownloadIcon } from './IconComponents';

interface RecordingReadyModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string | null;
}

const RecordingReadyModal: React.FC<RecordingReadyModalProps> = ({ isOpen, onClose, videoUrl }) => {
  if (!isOpen || !videoUrl) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className={`bg-slate-800 rounded-lg border border-slate-700 shadow-2xl p-6 m-4 max-w-lg w-full relative transform transition-all duration-300 ease-in-out ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-200 transition-colors"
          aria-label="Close modal"
        >
          <XIcon className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-green-400 mb-4">Demo Recording Ready</h2>
        <p className="text-slate-400 mb-6">Your screen recording is complete. You can now download it as a high-quality video file.</p>
        
        <video src={videoUrl} controls className="w-full rounded-md mb-6 border border-slate-700 bg-black"></video>

        <a
          href={videoUrl}
          download={`SentiIQ-Demo-${new Date().toISOString().slice(0,19).replace('T', '_').replace(/:/g, '-')}.webm`}
          className="w-full bg-gradient-to-r from-sky-500 to-green-500 hover:from-sky-400 hover:to-green-400 text-white font-bold py-3 px-4 rounded-md transition-all duration-300 flex items-center justify-center transform hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-500/30"
        >
          <DownloadIcon className="h-5 w-5 mr-2" />
          Download Demo Video
        </a>
      </div>
    </div>
  );
};

export default RecordingReadyModal;
