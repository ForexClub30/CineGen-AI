import React, { useState } from 'react';
import { StepIndicator } from './components/StepIndicator';
import { VisualAnalyzer } from './components/VisualAnalyzer';
import { ScriptAnalyzer } from './components/ScriptAnalyzer';
import { ProjectGenerator } from './components/ProjectGenerator';
import { OutputDashboard } from './components/OutputDashboard';
import { generateFullProject } from './services/geminiService';
import { 
  AppStep, 
  VisualStyleTemplate, 
  ScriptStyleTemplate, 
  ProjectSettings, 
  GeneratedScene 
} from './types';

function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.UPLOAD_IMAGE);
  const [visualStyle, setVisualStyle] = useState<VisualStyleTemplate | null>(null);
  const [scriptStyle, setScriptStyle] = useState<ScriptStyleTemplate | null>(null);
  const [generatedScenes, setGeneratedScenes] = useState<GeneratedScene[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVisualAnalysis = (template: VisualStyleTemplate) => {
    setVisualStyle(template);
    setCurrentStep(AppStep.PASTE_SCRIPT);
  };

  const handleScriptAnalysis = (template: ScriptStyleTemplate) => {
    setScriptStyle(template);
    setCurrentStep(AppStep.GENERATE_PROJECT);
  };

  const handleGenerate = async (settings: ProjectSettings) => {
    if (!visualStyle || !scriptStyle) return;

    setIsGenerating(true);
    setError(null);
    try {
      const scenes = await generateFullProject(visualStyle, scriptStyle, settings);
      setGeneratedScenes(scenes);
      setCurrentStep(AppStep.OUTPUT);
    } catch (err) {
      console.error(err);
      setError("Failed to generate project. Please check your API key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const resetApp = () => {
    setVisualStyle(null);
    setScriptStyle(null);
    setGeneratedScenes([]);
    setCurrentStep(AppStep.UPLOAD_IMAGE);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black text-slate-200 pb-20">
      <header className="pt-8 pb-12 text-center bg-[url('https://picsum.photos/1920/300?blur=10')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm"></div>
        <div className="relative z-10 px-4">
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
            CineGen AI
            </h1>
            <p className="text-slate-400 font-light text-lg tracking-wide">
            Multimodal Cinematic Style & Narrative Architect
            </p>
        </div>
      </header>

      <main className="container mx-auto px-4 -mt-6 relative z-10">
        <StepIndicator currentStep={currentStep} />

        <div className="mt-8">
          {currentStep === AppStep.UPLOAD_IMAGE && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
               <VisualAnalyzer onAnalysisComplete={handleVisualAnalysis} />
               {visualStyle && (
                 <div className="max-w-2xl mx-auto mt-4 p-4 bg-green-900/20 border border-green-500/30 rounded-lg flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-green-500"></div>
                   <span className="text-green-300 text-sm">Visual Style Extracted: {visualStyle.artStyle}, {visualStyle.mood}</span>
                 </div>
               )}
            </div>
          )}

          {currentStep === AppStep.PASTE_SCRIPT && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <ScriptAnalyzer onAnalysisComplete={handleScriptAnalysis} />
              {scriptStyle && (
                 <div className="max-w-2xl mx-auto mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                   <span className="text-blue-300 text-sm">Script Style Extracted: {scriptStyle.narrativeTone}</span>
                 </div>
               )}
            </div>
          )}

          {currentStep === AppStep.GENERATE_PROJECT && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 relative">
              {isGenerating ? (
                 <div className="w-full max-w-2xl mx-auto bg-slate-800 p-12 rounded-2xl border border-slate-700 shadow-xl flex flex-col items-center justify-center text-center">
                    <div className="relative w-24 h-24 mb-6">
                        <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Directing the AI...</h3>
                    <p className="text-slate-400">Synthesizing visual style {visualStyle?.artStyle} with narrative tone {scriptStyle?.narrativeTone}.</p>
                    <p className="text-slate-500 text-sm mt-4">Generating script, image prompts, animations, and voiceovers.</p>
                 </div>
              ) : (
                <ProjectGenerator onGenerate={handleGenerate} />
              )}
              {error && (
                <div className="max-w-2xl mx-auto mt-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200 text-center">
                  {error}
                </div>
              )}
            </div>
          )}

          {currentStep === AppStep.OUTPUT && visualStyle && scriptStyle && (
            <div className="animate-in fade-in zoom-in-95 duration-700">
              <OutputDashboard 
                scenes={generatedScenes} 
                visualStyle={visualStyle} 
                scriptStyle={scriptStyle} 
                onReset={resetApp} 
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
