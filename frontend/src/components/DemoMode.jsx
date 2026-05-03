import { useState, useEffect } from 'react';
import ResultCard from './ResultCard';
import { exampleCases } from '../data/cases';
import { expectedOutputs } from '../data/expectedOutputs';

const demoSteps = [
  {
    id: 'case_01_nsclc',
    caseLabel: 'EGFR-mutant NSCLC, progression on osimertinib',
    narrative: 'Case 1: A 68-year-old woman with EGFR-mutant lung cancer progressing on targeted therapy. The board must decide on next-line treatment with new MET amplification detected.',
    output: expectedOutputs.case_01_nsclc
  },
  {
    id: 'case_02_breast',
    caseLabel: 'HR+/HER2- breast cancer, surveillance lung nodules',
    narrative: 'Case 2: A 52-year-old woman four years post-curative breast cancer treatment with new indeterminate lung nodules. The board must decide between biopsy and surveillance.',
    output: expectedOutputs.case_02_breast
  },
  {
    id: 'case_03_crc',
    caseLabel: 'Stage IV colorectal cancer, KRAS G12C, partial response',
    narrative: 'Case 3: A 58-year-old man with metastatic colorectal cancer showing excellent response to chemotherapy. The board must decide on surgical resection timing and sequencing.',
    output: expectedOutputs.case_03_crc
  }
];

export default function DemoMode() {
  const [currentStep, setCurrentStep] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(true);

  useEffect(() => {
    if (!autoAdvance) return;

    const timer = setTimeout(() => {
      if (currentStep < demoSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setAutoAdvance(false);
      }
    }, 8000);

    return () => clearTimeout(timer);
  }, [currentStep, autoAdvance]);

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setAutoAdvance(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setAutoAdvance(false);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAutoAdvance(true);
  };

  const currentDemo = demoSteps[currentStep];

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-8">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-emerald-900 mb-2">
              Demo Mode: Guided Walkthrough
            </h2>
            <p className="text-sm text-emerald-800 mb-3">
              {currentDemo.narrative}
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className="font-medium text-emerald-900">
                Case {currentStep + 1} of {demoSteps.length}
              </span>
              {autoAdvance && currentStep < demoSteps.length - 1 && (
                <span className="text-emerald-700">
                  Auto-advancing in 8 seconds...
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <ResultCard 
          synthesis={currentDemo.output} 
          isSynthetic={true}
        />
      </div>

      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-4 py-2 border border-slate-200 text-slate-700 font-medium rounded hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentStep === demoSteps.length - 1}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRestart}
            className="px-4 py-2 border border-slate-200 text-slate-700 font-medium rounded hover:bg-slate-50 transition-colors"
          >
            Restart
          </button>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent('switchToTryIt'));
            }}
            className="text-sm font-medium text-primary hover:text-primary-hover underline"
          >
            Switch to Try It mode
          </a>
        </div>
      </div>

      <div className="mt-6 bg-slate-50 border border-slate-200 rounded-lg p-4">
        <p className="text-sm text-slate-600">
          <strong>Note:</strong> Demo Mode works offline using pre-cached outputs. No API key required. 
          Switch to Try It mode to generate real-time synthesis with your own case data.
        </p>
      </div>
    </div>
  );
}

// Made with Bob
