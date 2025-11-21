import React, { useState } from 'react';
import { Header } from './components/Header';
import { CodeInput } from './components/CodeInput';
import { AnalysisResult } from './components/AnalysisResult';
import { analyzeCode } from './services/analysisService';
import { AnalysisResponse } from './types';
import { Code as CodeIcon, Sparkles, Scan, X, AlertCircle } from 'lucide-react';
import './index.css';

// Background Component
const GridBackground = () => (
  <div className="absolute inset-0 z-0 pointer-events-none bg-[#050505]">
    {/* Green-Tinted Grid */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b9810f_1px,transparent_1px),linear-gradient(to_bottom,#10b9810f_1px,transparent_1px)] bg-[size:32px_32px]"></div>
    
    {/* The "Sides" Gradient: Black edges blending into deep Green center */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)]"></div>
    <div className="absolute inset-0 bg-gradient-to-b from-black via-emerald-950/20 to-black opacity-80"></div>
  </div>
);

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

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-zinc-100 overflow-hidden font-sans selection:bg-emerald-500/40 selection:text-white">
      <GridBackground />
      <Header />

      <main className="flex-1 flex overflow-hidden relative z-10">
        {/* Left Panel: Code Input */}
        <div className={`flex-1 flex flex-col border-r border-white/10 bg-[#09090b]/60 backdrop-blur-sm transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${result ? 'w-[45%]' : 'w-full max-w-6xl mx-auto border-x border-white/10 shadow-2xl'}`}>
          
          {/* Toolbar */}
          <div className="h-16 border-b border-white/10 bg-[#09090b]/80 flex justify-between items-center px-6">
            <div className="flex items-center gap-3 text-zinc-300">
              <div className="p-1.5 bg-zinc-900 rounded border border-white/10">
                <CodeIcon className="w-4 h-4" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider font-bold text-zinc-400">Input_Buffer</span>
            </div>
            <div className="flex gap-4">
              {code && (
                <button 
                  onClick={() => { setCode(''); setResult(null); }}
                  className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white hover:bg-white/10 rounded-md transition-colors border border-transparent hover:border-white/10"
                  aria-label="Clear Input"
                  title="Clear Input"
                >
                  CLEAR
                </button>
              )}
              
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !code.trim()}
                aria-label="Start Analysis"
                title="Start Analysis"
                className={`relative overflow-hidden group flex items-center gap-2 px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 shadow-xl
                  ${isAnalyzing || !code.trim() 
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5' 
                    : 'bg-emerald-500 text-black hover:bg-emerald-400 hover:shadow-emerald-500/40 hover:scale-105'}`}
              >
                {isAnalyzing ? (
                  <>
                    <Scan className="w-3 h-3 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3" />
                    <span>Initialize Scan</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Editor Area */}
          <div className="flex-1 relative bg-[#0c0c0e]/50">
            <CodeInput value={code} onChange={setCode} disabled={isAnalyzing} />
          </div>
          
          {/* Footer */}
          <div className="h-10 bg-[#09090b] border-t border-white/10 flex items-center justify-between px-6 text-[11px] font-mono text-zinc-500 uppercase font-semibold">
            <span className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${code ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' : 'bg-zinc-800'}`}></div>
              {code ? 'Ready for Analysis' : 'Waiting for Input'}
            </span>
            <span className="flex items-center gap-4">
               <span>UTF-8</span>
               <span>Ln {code.split('\n').length}, Col {code.length}</span>
            </span>
          </div>
        </div>

        {/* Right Panel: Analysis Result */}
        {result && (
           <div className="flex-1 flex flex-col bg-[#09090b]/95 backdrop-blur-xl overflow-hidden animate-in slide-in-from-right-10 duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] border-l border-white/10 shadow-2xl relative z-20">
             
             {/* Result Toolbar */}
             <div className="h-16 border-b border-white/10 bg-[#09090b] flex justify-between items-center px-8 shadow-sm">
               <div className="flex items-center gap-3 text-white">
                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-pulse"></div>
                 <h2 className="text-sm font-mono uppercase tracking-widest font-bold text-emerald-100">Scan_Complete</h2>
               </div>
               <button 
                 onClick={() => setResult(null)} 
                 className="text-zinc-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all border border-transparent hover:border-white/10"
                 aria-label="Close Analysis Report"
                 title="Close Analysis Report"
               >
                 <X className="w-5 h-5" />
               </button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-10 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
               <AnalysisResult data={result} />
             </div>
           </div>
        )}

        {/* Global Error Overlay */}
        {error && !result && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-50 animate-in fade-in duration-200">
            <div className="bg-[#111113] border border-rose-500/50 p-8 rounded-2xl max-w-md w-full shadow-2xl">
              <div className="flex items-center gap-3 text-rose-400 mb-4">
                <AlertCircle className="w-8 h-8" />
                <h3 className="text-lg font-mono uppercase tracking-wider font-bold">System Error</h3>
              </div>
              <p className="text-zinc-300 mb-8 font-light leading-relaxed">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="w-full py-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/50 text-rose-100 rounded-lg transition-colors font-mono text-sm uppercase tracking-wider font-bold"
                aria-label="Dismiss Error"
              >
                Acknowledge
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;