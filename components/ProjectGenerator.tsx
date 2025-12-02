import React, { useState } from 'react';
import { ProjectSettings } from '../types';

interface ProjectGeneratorProps {
  onGenerate: (settings: ProjectSettings) => void;
}

export const ProjectGenerator: React.FC<ProjectGeneratorProps> = ({ onGenerate }) => {
  const [title, setTitle] = useState('');
  const [sceneCount, setSceneCount] = useState(3);
  const [characters, setCharacters] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    onGenerate({ title, sceneCount, characters });
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-800/50 p-8 rounded-2xl border border-slate-700 shadow-xl backdrop-blur-sm">
      <h2 className="text-2xl font-bold text-white mb-2">Generate Full Project</h2>
      <p className="text-slate-400 mb-8">The AI will combine your Visual Template and Script Template to create a cohesive project.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Project Title / Topic</label>
          <input 
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., The Last Cyberpunk Samurai"
            className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Number of Scenes (1-10)</label>
          <input 
            type="range"
            min="1"
            max="10"
            value={sceneCount}
            onChange={(e) => setSceneCount(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>1 Scene</span>
            <span className="text-cyan-400 font-bold text-lg">{sceneCount} Scenes</span>
            <span>10 Scenes</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Key Characters (Optional)</label>
          <input 
            type="text"
            value={characters}
            onChange={(e) => setCharacters(e.target.value)}
            placeholder="e.g., Sarah (Detective), K-9 (Robot Dog)"
            className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-cyan-900/30 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 mt-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          Generate Full Script + Visuals
        </button>
      </form>
    </div>
  );
};
