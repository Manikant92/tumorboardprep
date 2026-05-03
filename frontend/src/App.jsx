import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import TryItMode from './components/TryItMode';
import DemoMode from './components/DemoMode';

export default function App() {
  const [mode, setMode] = useState('tryit');

  useEffect(() => {
    const handleSwitchToTryIt = () => {
      setMode('tryit');
    };

    window.addEventListener('switchToTryIt', handleSwitchToTryIt);
    return () => window.removeEventListener('switchToTryIt', handleSwitchToTryIt);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header mode={mode} onModeChange={setMode} />
      
      <main className="flex-1">
        {mode === 'tryit' ? <TryItMode /> : <DemoMode />}
      </main>
      
      <Footer />
    </div>
  );
}

// Made with Bob
