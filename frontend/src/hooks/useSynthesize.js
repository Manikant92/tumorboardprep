import { useState } from 'react';

export function useSynthesize() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const synthesize = async (caseData) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/synthesize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(caseData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        if (response.status === 401) {
          throw new Error('Authentication failed. Check your WATSONX_API_KEY in the backend .env file.');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again in 60 seconds.');
        } else if (response.status === 504) {
          throw new Error('Request timed out. The synthesis took too long. Please try again.');
        } else {
          throw new Error(errorData.detail || `Synthesis failed (HTTP ${response.status})`);
        }
      }

      const data = await response.json();
      setResult(data);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setResult(null);
  };

  return { synthesize, loading, error, result, reset };
}

// Made with Bob
