import React from 'react';
import { GeneratedScene, VisualStyleTemplate, ScriptStyleTemplate } from '../types';

interface OutputDashboardProps {
  scenes: GeneratedScene[];
  visualStyle: VisualStyleTemplate;
  scriptStyle: ScriptStyleTemplate;
  onReset: () => void;
}

const StyleCard: React.FC<{ title: string, data: any, color: string }> = ({ title, data, color }) => (
  <div className={`bg-slate-800/50 rounded-xl p-4 border border-${color}-500/30`}>
    <h4 className={`text-${color}-400 text-xs font-bold uppercase tracking-wider mb-2`}>{title}</h4>
    <div className="flex flex-wrap gap-2">
      {Object.entries(data).slice(0, 4).map(([key, value]) => (
        <span key={key} className="text-xs bg-slate-900 px-2 py-1 rounded text-slate-300 truncate max-w-[150px]" title={String(value)}>
          <span className="opacity-50 mr-1">{key}:</span>{Array.isArray(value) ? value.join(', ') : String(value)}
        </span>
      ))}
    </div>
  </div>
);

export const OutputDashboard: React.FC<OutputDashboardProps> = ({ scenes, visualStyle, scriptStyle, onReset }) => {
  return (
    <div className="w-full max-w-6xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-8 px-4">
        <h2 className="text-3xl font-bold text-white">Production Dashboard</h2>
        <button 
          onClick={onReset}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors border border-slate-700"
        >
          Start New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 px-4">
        <StyleCard title="Active Visual Style" data={visualStyle} color="green" />
        <StyleCard title="Active Script Style" data={scriptStyle} color="blue" />
      </div>

      <div className="space-y-8 px-4">
        {scenes.map((scene) => (
          <div key={scene.sceneNumber} className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-xl">
            <div className="bg-slate-900/50 p-4 border-b border-slate-700 flex justify-between items-center">
              <h3 className="font-bold text-xl text-white">Scene {scene.sceneNumber}</h3>
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span className="w-3 h-3 rounded-full bg-orange-500"></span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Script Section */}
              <div className="p-6 border-b lg:border-b-0 lg:border-r border-slate-700 bg-slate-800/30">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded font-mono">SCRIPT</span>
                </div>
                <div className="prose prose-invert prose-sm font-mono whitespace-pre-wrap text-slate-300 max-w-none">
                  {scene.script}
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-orange-500/20 text-orange-400 text-xs px-2 py-1 rounded font-mono">VOICE OVER</span>
                  </div>
                  <p className="text-orange-200/90 italic text-sm leading-relaxed">
                    "{scene.voiceOver}"
                  </p>
                </div>
              </div>

              {/* Visuals Section */}
              <div className="p-6 bg-black/20">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded font-mono">IMAGE PROMPT</span>
                  </div>
                  <div className="bg-black/40 p-3 rounded-lg border border-slate-700/50">
                    <p className="text-green-100/90 text-sm leading-relaxed">{scene.imagePrompt}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded font-mono">ANIMATION PROMPT</span>
                  </div>
                  <div className="bg-black/40 p-3 rounded-lg border border-slate-700/50">
                    <p className="text-yellow-100/90 text-sm leading-relaxed">{scene.animationPrompt}</p>
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                    <button 
                        className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-xs text-white rounded transition-colors"
                        onClick={() => navigator.clipboard.writeText(scene.imagePrompt)}
                    >
                        Copy Image Prompt
                    </button>
                    <button 
                        className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-xs text-white rounded transition-colors"
                        onClick={() => navigator.clipboard.writeText(scene.animationPrompt)}
                    >
                        Copy Anim. Prompt
                    </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
