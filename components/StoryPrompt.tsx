import React from 'react';

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/><path d="M18 8a2 2 0 0 0 2-2"/><path d="M18 16a2 2 0 0 1-2 2"/></svg>
);


const genres = ["Fantasy", "Science Fiction", "Mystery", "Horror", "Romance", "Adventure"];
const moods = ["Adventurous", "Mysterious", "Humorous", "Somber", "Uplifting", "Tense"];
const languages = ["English", "Spanish", "French", "German", "Japanese", "Mandarin Chinese", "Russian", "Hindi", "Arabic", "Portuguese", "Italian", "Bangla"];

interface StoryPromptProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  genre: string;
  setGenre: (genre: string) => void;
  mood: string;
  setMood: (mood: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const StoryPrompt: React.FC<StoryPromptProps> = ({ prompt, setPrompt, genre, setGenre, mood, setMood, language, setLanguage, onGenerate, isLoading }) => {
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onGenerate();
    }
  };

  const renderSelect = (label: string, value: string, onChange: (val: string) => void, options: string[]) => (
    <div className="flex-1">
      <label htmlFor={label.toLowerCase()} className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
        {label}
      </label>
      <select
        id={label.toLowerCase()}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isLoading}
        className="w-full p-2 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-md focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-transparent transition-all"
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );

  return (
    <div className="w-full p-6 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg shadow-md animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {renderSelect("Genre", genre, setGenre, genres)}
        {renderSelect("Mood", mood, setMood, moods)}
        {renderSelect("Language", language, setLanguage, languages)}
      </div>

      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          Your Story Idea...
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g., A lighthouse keeper who finds a mysterious glowing pearl."
          className="w-full h-28 p-3 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-md resize-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-transparent transition-all placeholder-gray-500"
          disabled={isLoading}
        />
      </div>

      <button
        onClick={onGenerate}
        disabled={isLoading || !prompt.trim()}
        className="mt-4 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-light dark:bg-primary-dark hover:bg-primary-hover-light dark:hover:bg-primary-hover-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card-light dark:focus:ring-offset-card-dark focus:ring-primary-light dark:focus:ring-primary-dark transition-all disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed group"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            <SparklesIcon />
            <span className="ml-2">Generate Story</span>
          </>
        )}
      </button>
    </div>
  );
};