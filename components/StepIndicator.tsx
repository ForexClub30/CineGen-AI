import React from 'react';
import { AppStep } from '../types';

interface StepIndicatorProps {
  currentStep: AppStep;
}

const steps = [
  { id: AppStep.UPLOAD_IMAGE, label: 'Visual Style' },
  { id: AppStep.PASTE_SCRIPT, label: 'Script Style' },
  { id: AppStep.GENERATE_PROJECT, label: 'Project Setup' },
  { id: AppStep.OUTPUT, label: 'Results' },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8 px-4">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-800 -z-10 rounded"></div>
        {steps.map((step, index) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
                <div key={step.id} className="flex flex-col items-center group">
                    <div 
                        className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-300 font-bold ${
                            isActive 
                                ? 'bg-cyan-500 border-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.5)] scale-110' 
                                : isCompleted 
                                    ? 'bg-slate-700 border-cyan-500 text-cyan-400' 
                                    : 'bg-slate-900 border-slate-700 text-slate-500'
                        }`}
                    >
                        {isCompleted ? '✓' : step.id}
                    </div>
                    <span className={`mt-2 text-xs font-medium uppercase tracking-wider ${isActive ? 'text-cyan-400' : 'text-slate-500'}`}>
                        {step.label}
                    </span>
                </div>
            );
        })}
      </div>
    </div>
  );
};
