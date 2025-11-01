import React, { useState, useEffect } from 'react';
import { StoryPrompt } from './components/StoryPrompt';
import { StoryDisplay } from './components/StoryDisplay';
import { generateStoryAndImage } from './services/geminiService';
import type { StoryResult } from './types';

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
);

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
);


function App() {
  const [prompt, setPrompt] = useState<string>('');
  const [genre, setGenre] = useState<string>('Fantasy');
  const [mood, setMood] = useState<string>('Adventurous');
  const [language, setLanguage] = useState<string>('English');
  const [storyResult, setStoryResult] = useState<StoryResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setStoryResult(null);

    try {
      const result = await generateStoryAndImage(prompt, genre, mood, language);
      setStoryResult(result);
    } catch (err) {
      console.error(err);
      setError('The muses are silent. The story could not be written. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setStoryResult(null);
    setError(null);
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans transition-colors duration-300">
      <header className="w-full max-w-4xl flex justify-between items-center mb-8">
        <div className="text-left">
           <h1 className="font-display text-4xl sm:text-5xl font-bold text-primary-light dark:text-primary-dark">
            Didarul Story Box
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Bring your imagination to life.
          </p>
        </div>
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
      </header>
      
      <main className="w-full max-w-4xl flex-grow flex flex-col items-center">
        {!storyResult ? (
          <div className="w-full max-w-xl">
            <StoryPrompt
              prompt={prompt}
              setPrompt={setPrompt}
              genre={genre}
              setGenre={setGenre}
              mood={mood}
              setMood={setMood}
              language={language}
              setLanguage={setLanguage}
              onGenerate={handleGenerate}
              isLoading={isLoading}
            />
          </div>
        ) : null}

        <StoryDisplay
          storyResult={storyResult}
          isLoading={isLoading}
          error={error}
          onReset={handleReset}
        />
      </main>
      
      <footer className="w-full max-w-4xl text-center mt-8 text-xs text-gray-500 dark:text-gray-600">
        <p>Stories and images generated with Google Gemini.</p>
      </footer>
    </div>
  );
}

export default App;