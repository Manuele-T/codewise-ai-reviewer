import React from 'react';
import { BrainCircuit, Github } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="h-16 border-b border-white/10 bg-[#09090b]/90 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-20 relative shadow-lg">
      <div className="flex items-center gap-3">
        <div className="relative group">
          {/* Green/Teal Glow Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
          <div className="relative p-2 bg-zinc-900 rounded-lg border border-white/20 shadow-inner">
            <BrainCircuit className="w-5 h-5 text-emerald-300" />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight font-mono drop-shadow-sm">
            CodeWise_
          </h1>
        </div>
      </div>
      
      <div className="flex items-center gap-6 text-sm font-mono text-zinc-400">
        <a 
          href="https://github.com/Manuele-T/codewise-ai-reviewer" 
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-300 hover:text-white transition-colors hover:bg-white/10 p-2 rounded-full border border-transparent hover:border-white/20"
          aria-label="View Source on GitHub"
          title="View Source on GitHub"
        >
          <Github className="w-5 h-5" />
        </a>
      </div>
    </header>
  );
};