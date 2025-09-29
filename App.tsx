
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { AnalysisResult } from './types';
import { analyzeSentimentBatch, analyzeImageSentiment, analyzeDocumentSentiment } from './services/geminiService';
import InputTabs from './components/InputTabs';
import AnalysisResults from './components/AnalysisResults';
import DetailedView from './components/DetailedView';
import ComparisonView from './components/ComparisonView';
import ModelInfoModal from './components/ModelInfoModal';
import NameCaptureModal from './components/NameCaptureModal';
import RecordingReadyModal from './components/RecordingReadyModal';
import WelcomePage from './components/WelcomePage';
import { LoaderIcon, AlertTriangleIcon, InfoIcon, SparklesIcon, RecordIcon, StopIcon } from './components/IconComponents';
import { useExport } from './hooks/useExport';
import SentimentDistributionVisual from './components/SentimentDistributionVisual';


const App: React.FC = () => {
  const [appStarted, setAppStarted] = useState<boolean>(false);
  const [isExitingWelcome, setIsExitingWelcome] = useState<boolean>(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [isNameModalOpen, setIsNameModalOpen] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const { exportToCSV, exportToJSON, exportToPDF } = useExport(resultsRef, analysisResults);

  useEffect(() => {
    if (!appStarted) return; // Don't run this effect on the welcome page
    
    const savedName = localStorage.getItem('senti-iq-username');
    if (savedName) {
      setUserName(savedName);
    } else {
      setTimeout(() => setIsNameModalOpen(true), 500); // Delay for entry animation
    }
  }, [appStarted]);

  useEffect(() => {
    // Cleanup blob URL to prevent memory leaks
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);
  
  useEffect(() => {
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    document.body.appendChild(dot);

    const follower = document.createElement('div');
    follower.className = 'cursor-follower';
    document.body.appendChild(follower);

    const onMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;

        requestAnimationFrame(() => {
            dot.style.left = `${clientX}px`;
            dot.style.top = `${clientY}px`;
            follower.style.left = `${clientX}px`;
            follower.style.top = `${clientY}px`;

            const target = e.target as HTMLElement;
            // Check for interactive elements
            if (target.closest('button, a, [role="button"], input, textarea, label[for], .cursor-pointer')) {
                follower.classList.add('cursor-hover');
            } else {
                follower.classList.remove('cursor-hover');
            }
        });
    };

    window.addEventListener('mousemove', onMouseMove);

    return () => {
        window.removeEventListener('mousemove', onMouseMove);
        document.body.removeChild(dot);
        document.body.removeChild(follower);
    };
}, []);

  const handleStartApp = () => {
    setIsExitingWelcome(true);
    setTimeout(() => {
        setAppStarted(true);
    }, 500); // Match animation duration
  };

  const handleNameSubmit = (name: string) => {
    localStorage.setItem('senti-iq-username', name);
    setUserName(name);
    setIsNameModalOpen(false);
  };

  const createParticles = (e: React.MouseEvent) => {
    if (!headerRef.current) return;
    const rect = headerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const color = `hsl(${Math.random() * 360}, 90%, 70%)`;
        particle.style.background = color;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        headerRef.current.appendChild(particle);
        setTimeout(() => particle.remove(), 700);
    }
  };

  const createLoveEmojis = (e: React.MouseEvent) => {
    if (!headerRef.current) return;
    const rect = headerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (let i = 0; i < 2; i++) {
        const emoji = document.createElement('div');
        emoji.className = 'love-emoji';
        emoji.innerText = '❤️';
        
        const offsetX = (Math.random() - 0.5) * 40;
        const offsetY = (Math.random() - 0.5) * 40;

        emoji.style.left = `${x + offsetX}px`;
        emoji.style.top = `${y + offsetY}px`;
        emoji.style.animationDelay = `${Math.random() * 0.2}s`;

        headerRef.current.appendChild(emoji);
        setTimeout(() => emoji.remove(), 1500);
    }
  };


  const handleAnalyze = useCallback(async (payload: { texts?: string[]; image?: { data: string; mimeType: string; }; prompt?: string; document?: { data: string; mimeType: string; name: string; } }) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResults([]);
    setSelectedIndices([]);

    try {
      let results: AnalysisResult[] = [];
      if (payload.texts) {
        if (payload.texts.length === 0) {
          setError("Please input text or upload a file to analyze.");
          setIsLoading(false);
          return;
        }
        results = await analyzeSentimentBatch(payload.texts);
      } else if (payload.image && payload.prompt !== undefined) {
         const singleResult = await analyzeImageSentiment(payload.image, payload.prompt);
         results = [singleResult];
      } else if (payload.document) {
        results = await analyzeDocumentSentiment(payload.document);
        if (results.length === 0) {
            setError("The document contained no analyzable text or could not be processed.");
        }
      }
      
      setAnalysisResults(results);
      if (results.length > 0) {
        setSelectedIndices([0]);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelect = useCallback((index: number) => {
    setSelectedIndices(prev => {
      const isSelected = prev.includes(index);
      if (isSelected) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index].slice(-2);
      }
    });
  }, []);
  
  const handleStopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
    }
    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    setIsRecording(false);
  }, []);

  const handleStartRecording = useCallback(async () => {
    if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
        setVideoUrl(null);
    }
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      mediaStreamRef.current = stream;
      
      recordedChunksRef.current = [];
      const options = { mimeType: 'video/webm; codecs=vp9,opus' };
      mediaRecorderRef.current = new MediaRecorder(stream, options);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      stream.getVideoTracks()[0].onended = () => {
        handleStopRecording();
      };

    } catch (err) {
      console.error("Error starting recording:", err);
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
          setError("Permission denied. To record a demo, you must grant screen sharing permissions when prompted by your browser.");
      } else {
          setError("Screen recording failed to start. Please ensure your browser supports this feature and that no other application is currently recording.");
      }
      setIsRecording(false);
    }
  }, [videoUrl, handleStopRecording]);


  const selectedResults = selectedIndices.map(i => analysisResults[i]).filter(Boolean);

  if (!appStarted) {
    return <WelcomePage onStart={handleStartApp} isExiting={isExitingWelcome} />;
  }

  return (
    <>
      <ModelInfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
      <NameCaptureModal isOpen={isNameModalOpen} onNameSubmit={handleNameSubmit} />
      <RecordingReadyModal isOpen={!!videoUrl} onClose={() => setVideoUrl(null)} videoUrl={videoUrl} />

      <div className="text-slate-200 min-h-screen font-sans flex flex-col animate-fadeInUp">
        <header className="bg-slate-800/50 backdrop-blur-md border-b border-slate-700/50 p-4 sticky top-0 z-10 flex items-center justify-between">
          <div className="flex-1">
            {userName && (
              <p className="text-slate-400 text-sm animate-fadeInUp">Hello, {userName}!</p>
            )}
          </div>
          <div ref={headerRef} className="flex-1 text-center group relative overflow-hidden" style={{ perspective: '1000px' }} onClick={createParticles} onMouseMove={createLoveEmojis}>
             <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-sky-400 to-red-400 transition-transform duration-500 ease-out group-hover:[transform:translateZ(20px)] cursor-pointer">
                SentiIQ
             </h1>
            <p className="text-slate-400 text-sm">sentiment analysis system</p>
          </div>
          <div className="flex-1 flex justify-end items-center gap-2">
            <button
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                className={`flex items-center justify-center px-3 py-2 rounded-md font-semibold text-white transition-all duration-300 transform hover:scale-105 ${isRecording ? 'bg-red-600 hover:bg-red-500 animate-recording-pulse' : 'bg-slate-700 hover:bg-slate-600'}`}
                aria-label={isRecording ? 'Stop recording' : 'Start recording demo'}
            >
                {isRecording ? <StopIcon className="h-5 w-5" /> : <RecordIcon className="h-5 w-5" />}
                <span className="ml-2 hidden sm:inline">{isRecording ? 'Stop' : 'Record'}</span>
            </button>
            <button onClick={() => setIsInfoModalOpen(true)} className="text-slate-400 hover:text-sky-400 transition-colors p-2 rounded-full hover:bg-slate-700" aria-label="About the model">
              <InfoIcon className="h-6 w-6" />
            </button>
          </div>
        </header>
        
        <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 flex flex-col gap-6">
            <InputTabs onAnalyze={handleAnalyze} isLoading={isLoading} />

            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg flex items-center gap-3 animate-fadeInUp">
                <AlertTriangleIcon className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            {isLoading && (
               <div className="flex flex-col items-center justify-center gap-4 p-8 bg-slate-800/50 rounded-lg">
                  <div className="relative h-10 w-10">
                    <LoaderIcon className="h-10 w-10 animate-spin text-sky-400" />
                    <SparklesIcon className="absolute top-0 left-0 h-3 w-3 text-yellow-400 animate-orbit" style={{ animationDelay: '0s' }}/>
                    <SparklesIcon className="absolute top-0 left-0 h-3 w-3 text-green-400 animate-orbit" style={{ animationDelay: '0.5s' }}/>
                    <SparklesIcon className="absolute top-0 left-0 h-3 w-3 text-red-400 animate-orbit" style={{ animationDelay: '1s' }}/>
                  </div>
                  <p className="text-slate-400 text-lg animate-pulse-subtle">Analyzing sentiment...</p>
                  <p className="text-slate-500 text-sm text-center">This may take a moment for large batches or images.</p>
              </div>
            )}

            {analysisResults.length > 0 && !isLoading && (
              <AnalysisResults 
                results={analysisResults}
                selectedIndices={selectedIndices}
                onSelect={handleSelect}
              />
            )}
          </div>

          <div className="lg:col-span-2">
            {analysisResults.length > 0 && !isLoading ? (
              <div className="flex flex-col gap-6 animate-fadeInUp" ref={resultsRef}>
                <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                  <h2 className="text-xl font-semibold mb-4 text-slate-100">Overall Sentiment Distribution</h2>
                  <SentimentDistributionVisual data={analysisResults} />
                </div>

                {selectedResults.length === 1 && <DetailedView result={selectedResults[0]} />}
                {selectedResults.length === 2 && <ComparisonView result1={selectedResults[0]} result2={selectedResults[1]} />}
                
                 <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex items-center justify-end gap-3">
                  <span className="text-sm text-slate-400 mr-auto">Export Results</span>
                  <button onClick={exportToCSV} className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-md transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(34,197,94,0.5)]">CSV</button>
                  <button onClick={exportToJSON} className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded-md transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(2,132,199,0.5)]">JSON</button>
                  <button onClick={exportToPDF} className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-md transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(220,38,38,0.5)]">PDF</button>
                </div>
              </div>
            ) : !isLoading && (
              <div className="flex items-center justify-center h-full">
                <div className="bg-slate-800/60 rounded-lg w-full h-full flex items-center justify-center p-4 animate-scale-in-center border border-slate-700/50 shadow-2xl shadow-sky-500/10">
                    <div className="text-center p-8 space-y-4">
                        <div className="overflow-hidden pb-2">
                             <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-sky-400 to-red-400 animate-slide-in-top">
                                {userName ? `Welcome, ${userName}!` : 'Welcome to SentiIQ'}
                             </h2>
                        </div>
                        <p className="text-slate-400 text-lg animate-fade-in-delay-1">
                            Your intelligent sentiment analysis dashboard.
                        </p>
                        <div className="animate-fade-in-delay-2 pt-4">
                            <div className="p-[2px] inline-block rounded-lg bg-gradient-to-r from-green-400 via-sky-500 to-red-500 animate-border-pan">
                                 <div className="bg-slate-800 rounded-md px-6 py-3">
                                     <p className="text-slate-300">Enter text, upload a file, or analyze an image to begin.</p>
                                 </div>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default App;