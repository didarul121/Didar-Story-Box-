import React, { useState, useEffect } from 'react';
import type { StoryResult } from '../types';

interface StoryDisplayProps {
  storyResult: StoryResult | null;
  isLoading: boolean;
  error: string | null;
  onReset: () => void;
}

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
);

const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
);

const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);


const LoadingIndicator: React.FC = () => {
    return (
        <div className="text-center p-8 flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary-light dark:border-primary-dark mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">The story is writing itself...</p>
        </div>
    );
};

const useTypewriter = (text: string, speed: number = 20) => {
    const [displayText, setDisplayText] = useState('');
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        setDisplayText('');
        setIsFinished(false);
        if (!text) return;
        
        let i = 0;
        const intervalId = setInterval(() => {
            if (i < text.length) {
                setDisplayText(prev => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(intervalId);
                setIsFinished(true);
            }
        }, speed);

        return () => clearInterval(intervalId);
    }, [text, speed]);

    return { displayText, isFinished };
};

export const StoryDisplay: React.FC<StoryDisplayProps> = ({ storyResult, isLoading, error, onReset }) => {
  const [copyButtonText, setCopyButtonText] = useState('Copy Text');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { displayText, isFinished } = useTypewriter(storyResult?.story || '');

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [storyResult]);


  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-500/10 border border-red-500/30 rounded-lg max-w-xl">
        <p className="font-bold text-red-600 dark:text-red-400">An Error Occurred</p>
        <p className="text-red-700 dark:text-red-300 mt-2">{error}</p>
         <button onClick={onReset} className="mt-4 px-4 py-2 text-sm font-medium rounded-md text-white bg-primary-light dark:bg-primary-dark hover:bg-primary-hover-light dark:hover:bg-primary-hover-dark transition-all">
            Try Again
        </button>
      </div>
    );
  }

  if (storyResult) {
    const handleCopy = () => {
        navigator.clipboard.writeText(storyResult.story);
        setCopyButtonText('Copied!');
        setTimeout(() => setCopyButtonText('Copy Text'), 2000);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % storyResult.imageUrl.length);
    }

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + storyResult.imageUrl.length) % storyResult.imageUrl.length);
    }

    return (
      <div className="animate-fade-in w-full bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg shadow-lg overflow-hidden">
        <div className="md:grid md:grid-cols-12 gap-6">
            <div className="md:col-span-5 relative group">
                <img
                  src={storyResult.imageUrl[currentImageIndex]}
                  alt={`An AI-generated illustration for the story (${currentImageIndex + 1}/${storyResult.imageUrl.length})`}
                  className="w-full h-auto object-cover aspect-[3/4] transition-opacity duration-300"
                  key={currentImageIndex} // force re-render on image change for transition
                />
                 {storyResult.imageUrl.length > 1 && (
                    <>
                        <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronLeftIcon />
                        </button>
                        <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRightIcon />
                        </button>
                         <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                            {storyResult.imageUrl.map((_, index) => (
                                <button key={index} onClick={() => setCurrentImageIndex(index)} className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}></button>
                            ))}
                        </div>
                    </>
                 )}
            </div>
            <div className="p-6 md:col-span-7 flex flex-col">
                <div className="flex-grow">
                    <p className="text-text-light dark:text-text-dark whitespace-pre-wrap leading-relaxed text-base md:text-lg">
                        {displayText}
                        {!isFinished && <span className="inline-block w-0.5 h-6 bg-gray-700 dark:bg-gray-300 ml-1 animate-blink-cursor" style={{ verticalAlign: 'text-bottom' }}></span>}
                    </p>
                </div>
                <div className="flex items-center gap-4 mt-6 pt-4 border-t border-border-light dark:border-border-dark">
                    <button onClick={onReset} className="px-4 py-2 text-sm font-medium rounded-md text-white bg-primary-light dark:bg-primary-dark hover:bg-primary-hover-light dark:hover:bg-primary-hover-dark transition-all">
                        Generate Another Story
                    </button>
                    <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-border-light dark:border-border-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                        <CopyIcon />
                        {copyButtonText}
                    </button>
                </div>
            </div>
        </div>
      </div>
    );
  }

  return null;
};