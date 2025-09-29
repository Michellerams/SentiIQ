
import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon, TextIcon, LoaderIcon, ImageIcon, XIcon, FileIcon } from './IconComponents';

interface InputTabsProps {
  onAnalyze: (payload: { texts: string[] } | { image: { data: string, mimeType: string }, prompt: string } | { document: { data: string, mimeType: string, name: string } }) => void;
  isLoading: boolean;
}

const InputTabs: React.FC<InputTabsProps> = ({ onAnalyze, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'text' | 'file' | 'image'>('text');
  const [textInput, setTextInput] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [uploadedImage, setUploadedImage] = useState<{ data: string; mimeType: string; name: string; dataUrl: string; } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploadedFileForAnalysis, setUploadedFileForAnalysis] = useState<{ data: string; mimeType: string; name: string; } | null>(null);
  const analyzeButtonRef = useRef<HTMLButtonElement>(null);


  const createConfetti = () => {
    if (!analyzeButtonRef.current) return;
    const buttonRect = analyzeButtonRef.current.getBoundingClientRect();
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = `${buttonRect.left}px`;
    container.style.top = `${buttonRect.top}px`;
    container.style.width = `${buttonRect.width}px`;
    container.style.height = `${buttonRect.height}px`;
    container.style.pointerEvents = 'none';
    container.style.overflow = 'hidden';
    document.body.appendChild(container);

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        const size = Math.random() * 8 + 4;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = `${-20}px`;
        const animDuration = Math.random() * 1 + 0.5;
        confetti.style.animation = `confetti-burst ${animDuration}s ease-out forwards`;
        confetti.style.animationDelay = `${Math.random() * 0.2}s`;
        container.appendChild(confetti);
    }
    setTimeout(() => container.remove(), 2000);
  };

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    setUploadedFileForAnalysis(null);
    
    const file = event.target.files?.[0];
    if (!file) return;

    const mimeMap: Record<string, string> = {
      txt: 'text/plain',
      csv: 'text/csv',
      md: 'text/markdown',
      json: 'application/json',
      log: 'text/plain',
      pdf: 'application/pdf',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };
    
    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
    const mimeType = mimeMap[extension];
    
    if (!mimeType) {
        setFileError('Unsupported file type. Supported: TXT, CSV, MD, JSON, LOG, PDF, DOCX.');
        return;
    }

    const maxSizeInMB = 10;
    if (file.size > maxSizeInMB * 1024 * 1024) {
      setFileError(`File is too large. Maximum size is ${maxSizeInMB}MB.`);
      return;
    }

    setFileError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const base64Data = dataUrl.split(',')[1];
      if (!base64Data) {
        setFileError('Could not read file data.');
        return;
      }
      setUploadedFileForAnalysis({ data: base64Data, mimeType, name: file.name });
    };
    reader.onerror = () => setFileError('Failed to read the file.');
    reader.readAsDataURL(file);

    event.target.value = '';
}, []);

  const handleImageFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setFileError('Invalid file type. Please upload a JPG, PNG, or WEBP image.');
      return;
    }
    const maxSizeInMB = 5;
    if (file.size > maxSizeInMB * 1024 * 1024) {
      setFileError(`File is too large. Maximum size is ${maxSizeInMB}MB.`);
      return;
    }

    setFileError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const [header, base64Data] = dataUrl.split(',');
      const mimeTypeMatch = header.match(/:(.*?);/);
      if (!mimeTypeMatch || !mimeTypeMatch[1]) {
        setFileError('Could not determine file type from image data.');
        return;
      }
      const mimeType = mimeTypeMatch[1];
      setUploadedImage({ data: base64Data, mimeType, name: file.name, dataUrl });
    };
    reader.onerror = () => setFileError('Failed to read the image file.');
    reader.readAsDataURL(file);
    event.target.value = '';
  }, []);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(e.target.value);
  };

  const handleAnalyzeClick = () => {
    if (isLoading) return;
    
    createConfetti();

    if (activeTab === 'image') {
      if (uploadedImage) {
        onAnalyze({ 
          image: { data: uploadedImage.data, mimeType: uploadedImage.mimeType }, 
          prompt: imagePrompt 
        });
      }
    } else if (activeTab === 'file') {
      if (uploadedFileForAnalysis) {
        onAnalyze({ document: uploadedFileForAnalysis });
      }
    } else { // 'text'
      const lines = textInput.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      onAnalyze({ texts: lines });
      setTextInput('');
    }
  };
  
  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700">
      <div className="flex border-b border-slate-700">
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 p-3 font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'text' ? 'bg-sky-500/10 text-sky-400' : 'text-slate-400 hover:bg-slate-700/50'}`}
        >
          <TextIcon className="h-5 w-5" /> Direct Input
        </button>
        <button
          onClick={() => setActiveTab('file')}
          className={`flex-1 p-3 font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'file' ? 'bg-sky-500/10 text-sky-400' : 'text-slate-400 hover:bg-slate-700/50'}`}
        >
          <UploadIcon className="h-5 w-5" /> File Upload
        </button>
        <button
          onClick={() => setActiveTab('image')}
          className={`flex-1 p-3 font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'image' ? 'bg-sky-500/10 text-sky-400' : 'text-slate-400 hover:bg-slate-700/50'}`}
        >
          <ImageIcon className="h-5 w-5" /> Image
        </button>
      </div>
      <div className="p-4">
        {activeTab === 'text' && (
          <textarea
            className="w-full h-48 p-3 bg-slate-900 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none text-slate-300 placeholder-slate-500 resize-none"
            placeholder="Enter text to analyze. Each line will be treated as a separate entry."
            value={textInput}
            onChange={handleTextareaChange}
            disabled={isLoading}
          />
        )}
        {activeTab === 'file' && (
          <div className="flex flex-col items-center justify-center w-full h-48">
            {uploadedFileForAnalysis ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 border-2 border-slate-600 rounded-lg p-4 text-center">
                <FileIcon className="w-12 h-12 text-sky-400 mb-3" />
                <p className="font-semibold text-slate-200 truncate w-full px-2" title={uploadedFileForAnalysis.name}>
                  {uploadedFileForAnalysis.name}
                </p>
                <p className="text-xs text-slate-500 mb-4">{uploadedFileForAnalysis.mimeType}</p>
                <button 
                  onClick={() => setUploadedFileForAnalysis(null)}
                  className="bg-red-600/80 hover:bg-red-500 text-white rounded-md px-3 py-1 text-sm font-semibold transition-colors flex items-center gap-1.5"
                  aria-label="Remove uploaded file"
                >
                  <XIcon className="h-4 w-4" />
                  Remove
                </button>
              </div>
            ) : (
              <label htmlFor="document-file-upload" className="flex flex-col items-center justify-center w-full h-full border-2 border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-900 hover:bg-slate-800/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadIcon className="w-8 h-8 mb-4 text-slate-500" />
                  <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload a document</span></p>
                  <p className="text-xs text-slate-600">PDF, DOCX, TXT, CSV, etc.</p>
                </div>
                <input
                  id="document-file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isLoading}
                  accept=".txt,.csv,.md,.json,.log,.pdf,.docx"
                />
              </label>
            )}
            {fileError && <p className="text-red-400 text-sm mt-2 text-center">{fileError}</p>}
          </div>
        )}
        {activeTab === 'image' && (
          <div className="flex flex-col gap-4">
            {uploadedImage ? (
                <div className="relative group">
                    <img src={uploadedImage.dataUrl} alt="Upload preview" className="w-full h-36 object-cover rounded-lg" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => setUploadedImage(null)} className="bg-red-600/80 hover:bg-red-500 text-white rounded-full p-2" aria-label="Remove image">
                           <XIcon className="h-5 w-5" />
                       </button>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center w-full">
                    <label htmlFor="image-file-upload" className="flex flex-col items-center justify-center w-full h-36 border-2 border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-900 hover:bg-slate-800/50 transition-colors">
                        <div className="flex flex-col items-center justify-center">
                            <ImageIcon className="w-8 h-8 mb-2 text-slate-500" />
                            <p className="text-sm text-slate-500"><span className="font-semibold">Upload an image</span></p>
                        </div>
                        <input id="image-file-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleImageFileChange} disabled={isLoading} />
                    </label>
                </div>
            )}
            {fileError && activeTab === 'image' && <p className="text-red-400 text-sm">{fileError}</p>}
            <textarea
                className="w-full p-3 bg-slate-900 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none text-slate-300 placeholder-slate-500 resize-none"
                placeholder="Optional: Add a prompt to guide the image analysis (e.g., 'What is the mood of this scene?')"
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                rows={3}
                disabled={isLoading}
             />
          </div>
        )}

         <button
          ref={analyzeButtonRef}
          onClick={handleAnalyzeClick}
          disabled={isLoading || (activeTab === 'image' && !uploadedImage) || (activeTab === 'text' && !textInput) || (activeTab === 'file' && !uploadedFileForAnalysis)}
          className="w-full mt-4 bg-gradient-to-r from-sky-500 to-green-500 hover:from-sky-400 hover:to-green-400 text-white font-bold py-3 px-4 rounded-md transition-all duration-300 flex items-center justify-center disabled:bg-slate-600 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed transform hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-500/30"
        >
          {isLoading ? (
            <>
              <LoaderIcon className="h-5 w-5 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Analyze Sentiment'
          )}
        </button>
      </div>
    </div>
  );
};

export default InputTabs;
