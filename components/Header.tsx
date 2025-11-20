import React from 'react';
import { BrainCircuit, Github } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-6 shrink-0 z-10">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
          <BrainCircuit className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">CodeWise</h1>
          <p className="text-xs text-slate-400 font-medium">AI-Powered Code Reviewer</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-sm text-slate-400">
        <div className="hidden md:flex items-center gap-6 mr-4">
           <span className="hover:text-indigo-400 cursor-pointer transition-colors">Documentation</span>
           <span className="hover:text-indigo-400 cursor-pointer transition-colors">Privacy</span>
        </div>
        <a href="#" className="text-slate-500 hover:text-white transition-colors">
          <Github className="w-5 h-5" />
        </a>
      </div>
    </header>
  );
};