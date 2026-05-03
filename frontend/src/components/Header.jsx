export default function Header({ mode, onModeChange }) {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">TumorBoardPrep</h1>
            <p className="text-sm text-slate-600 mt-1">Clinical prep tool for oncology tumor boards</p>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => onModeChange('tryit')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === 'tryit'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              aria-pressed={mode === 'tryit'}
            >
              Try It
            </button>
            <button
              onClick={() => onModeChange('demo')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === 'demo'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              aria-pressed={mode === 'demo'}
            >
              Demo Mode
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

// Made with Bob
