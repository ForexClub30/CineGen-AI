import React, { useState } from 'react';
import { VisualStyleTemplate } from '../types';
import { analyzeVisualRef } from '../services/geminiService';

interface VisualAnalyzerProps {
  onAnalysisComplete: (template: VisualStyleTemplate) => void;
}

export const VisualAnalyzer: React.FC<VisualAnalyzerProps> = ({ onAnalysisComplete }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      processAnalysis(file, base64String);
    };
    reader.readAsDataURL(file);
  };

  const processAnalysis = async (file: File, base64Full: string) => {
    setLoading(true);
    setError(null);
    try {
      // Remove data URL prefix for API
      const base64Data = base64Full.split(',')[1];
      const template = await analyzeVisualRef(base64Data, file.type);
      onAnalysisComplete(template);
    } catch (err) {
      setError("Failed to analyze image. Please ensure your API key is valid and try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-800/50 p-8 rounded-2xl border border-slate-700 shadow-xl backdrop-blur-sm">
      <h2 className="text-2xl font-bold text-white mb-2">Upload Reference Image Style</h2>
      <p className="text-slate-400 mb-6">This image will be used to extract the visual style (lighting, colors, art style) for your entire project.</p>

      {!imagePreview ? (
        <div className="border-2 border-dashed border-slate-600 rounded-xl p-12 text-center hover:border-cyan-500 transition-colors cursor-pointer relative group">
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="text-slate-400 group-hover:text-cyan-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="font-medium text-lg">Click to upload reference image</p>
            <p className="text-sm mt-2 opacity-75">JPG, PNG, WebP supported</p>
          </div>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden border border-slate-600 bg-black/50">
          <img src={imagePreview} alt="Reference" className="w-full h-64 object-contain" />
          {loading && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center backdrop-blur-sm">
              <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-cyan-400 font-mono animate-pulse">Analyzing visual style...</p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};
