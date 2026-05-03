import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function ResultCard({ synthesis, isSynthetic }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(synthesis);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('Failed to copy to clipboard');
    }
  };

  if (!synthesis) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-12 text-center">
        <p className="text-slate-600">
          Fill the form and click Generate, or switch to Demo Mode to see how it works.
        </p>
      </div>
    );
  }

  return (
    <div className="result-card bg-white border border-slate-200 rounded-lg shadow-sm">
      {isSynthetic && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 rounded-t-lg">
          <p className="text-sm text-amber-800 font-medium">
            ⚠️ Synthetic case for demonstration only
          </p>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4 no-print">
          <h2 className="text-xl font-semibold text-slate-900">Tumor Board Case Card</h2>
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded shadow-sm transition-colors"
          >
            {copied ? 'Copied!' : 'Copy as Markdown'}
          </button>
        </div>
        
        <div className="prose prose-slate max-w-none">
          <ReactMarkdown>{synthesis}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
