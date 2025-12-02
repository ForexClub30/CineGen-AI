import React, { useState } from 'react';
import { ScriptStyleTemplate } from '../types';
import { analyzeScriptRef } from '../services/geminiService';

interface ScriptAnalyzerProps {
  onAnalysisComplete: (template: ScriptStyleTemplate) => void;
}

export const ScriptAnalyzer: React.FC<ScriptAnalyzerProps> = ({ onAnalysisComplete }) => {
  const [scriptText, setScriptText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (scriptText.length < 50) {
      setError("Please enter a longer script sample for better analysis.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const template = await analyzeScriptRef(scriptText);
      onAnalysisComplete(template);
    } catch (err) {
      setError("Failed to analyze script. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-800/50 p-8 rounded-2xl border border-slate-700 shadow-xl backdrop-blur-sm">
      <h2 className="text-2xl font-bold text-white mb-2">Paste Reference Script Style</h2>
      <p className="text-slate-400 mb-6">Paste a sample scene to let the AI learn your storytelling style, pacing, and format.</p>

      <div className="relative">
        <textarea
          value={scriptText}
          onChange={(e) => setScriptText(e.target.value)}
          placeholder="INT. COFFEE SHOP - DAY&#10;&#10;JOHN (30s, nervous) taps his fingers on the table. The steam from his coffee swirls into the void..."
          className="w-full h-64 bg-slate-900/50 border border-slate-600 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono text-sm resize-none"
        />
        
        {loading && (
          <div className="absolute inset-0 bg-slate-900/80 rounded-xl flex flex-col items-center justify-center backdrop-blur-sm z-10">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-cyan-400 font-mono animate-pulse">Extracting narrative patterns...</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleAnalyze}
        disabled={loading || scriptText.length === 0}
        className="mt-6 w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg shadow-lg shadow-cyan-900/30 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Analyzing...' : 'Save Script Style'}
      </button>
    </div>
  );
};
