export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
        <p className="text-slate-600 text-sm">Synthesizing case card with Granite...</p>
      </div>
    </div>
  );
}

// Made with Bob
