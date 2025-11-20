import React, { useState } from 'react';
import { CodeInput } from './components/CodeInput';
import { AnalysisResult } from './components/AnalysisResult';
import { Header } from './components/Header';
import { analyzeCode } from './services/analysisService';
import { Code, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';

export interface AnalysisResponse {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  securityIssues: string[];
  refactoredCode?: string;
}

const App: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!code.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const analysis = await analyzeCode(code);
      setResult(analysis);
    } catch (err: any) {
      setError(err.message || "An error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setCode('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200">
      <Header />

      <main className="flex-1 flex overflow-hidden relative">
        {/* Left Panel: Input */}
        <div className={`flex-1 flex flex-col border-r border-slate-800 transition-all duration-500 ${result ? 'w-1/2' : 'w-full max-w-4xl mx-auto'}`}>
          <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center backdrop-blur-sm">
            <div className="flex items-center gap-2 text-slate-100 font-semibold">
              <Code className="w-5 h-5 text-indigo-400" />
              <h2>Source Code</h2>
            </div>
            <div className="flex gap-2">
               <button 
                onClick={handleClear}
                className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
              >
                Clear
              </button>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !code.trim()}
                className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded shadow-lg shadow-indigo-500/20 transition-all
                  ${isAnalyzing || !code.trim() 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-indigo-500/40'}`}
              >
                {isAnalyzing ? (
                  <>
                    <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Review Code
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="flex-1 relative bg-slate-900/30">
            <CodeInput 
              value={code} 
              onChange={setCode} 
              disabled={isAnalyzing}
            />
          </div>
          
          <div className="p-3 bg-slate-900 text-xs text-slate-500 border-t border-slate-800 flex justify-between">
            <span>Supported: JS, TS, PY, HTML, CSS, JSON, etc.</span>
            <span>{code.length} chars</span>
          </div>
        </div>

        {/* Right Panel: Analysis (Conditional) */}
        {result && (
           <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden animate-in slide-in-from-right-10 duration-300">
             <div className="p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm flex justify-between items-center">
               <div className="flex items-center gap-2 text-slate-100 font-semibold">
                 <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                 <h2>Analysis Report</h2>
               </div>
             </div>
             <div className="flex-1 overflow-y-auto p-6">
               <AnalysisResult data={result} />
             </div>
           </div>
        )}

        {/* Error State */}
        {error && !result && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <div className="bg-slate-900 border border-red-500/30 p-6 rounded-lg max-w-md w-full shadow-2xl">
              <div className="flex items-center gap-3 text-red-400 mb-2">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-lg font-semibold">Analysis Failed</h3>
              </div>
              <p className="text-slate-400 mb-4">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;