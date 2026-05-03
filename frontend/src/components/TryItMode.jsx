import { useState } from 'react';
import CaseForm from './CaseForm';
import ResultCard from './ResultCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';
import { useSynthesize } from '../hooks/useSynthesize';
import { exampleCases } from '../data/cases';

export default function TryItMode() {
  const { synthesize, loading, error, result, reset } = useSynthesize();
  const [isExampleCase, setIsExampleCase] = useState(false);

  const handleSubmit = async (formData) => {
    const isExample = Object.values(exampleCases).some(
      ({ data }) => data.presenter === formData.presenter && data.board_date === formData.board_date
    );
    setIsExampleCase(isExample);

    try {
      await synthesize(formData);
    } catch (err) {
      // Error is already handled by the hook
    }
  };

  const handleRetry = () => {
    reset();
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <CaseForm onSubmit={handleSubmit} loading={loading} />
        </div>

        <div>
          {loading && <LoadingSpinner />}
          {error && <ErrorDisplay error={error} onRetry={handleRetry} />}
          {result && (
            <ResultCard 
              synthesis={result.synthesis} 
              isSynthetic={isExampleCase}
            />
          )}
          {!loading && !error && !result && (
            <ResultCard synthesis={null} isSynthetic={false} />
          )}
        </div>
      </div>
    </div>
  );
}

// Made with Bob
