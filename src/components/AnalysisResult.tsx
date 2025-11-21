import React from 'react';
import { AnalysisResponse } from '../types';
import { ShieldAlert, TrendingUp, Lightbulb, CheckCircle2, Cpu } from 'lucide-react';

interface AnalysisResultProps {
  data: AnalysisResponse;
}

// Helper Component for Cards
const ResultCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; className?: string; delayClass?: string }> = ({ title, icon, children, className = "", delayClass="delay-0" }) => (
  <div className={`group relative rounded-2xl border border-white/10 bg-[#121214] overflow-hidden hover:border-white/30 transition-all duration-300 shadow-lg hover:shadow-2xl animate-in fade-in slide-in-from-bottom-4 fill-mode-both ${className} ${delayClass}`}>
    
    {/* Subtle Highlight Gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none"></div>

    <div className="relative px-6 py-4 border-b border-white/10 flex items-center gap-3 bg-white/[0.02]">
      {icon}
      <h3 className="font-mono text-zinc-100 text-xs uppercase tracking-widest font-bold">{title}</h3>
    </div>
    <div className="relative p-6">
      {children}
    </div>
  </div>
);

// Helper Component for Lists
const ListItems: React.FC<{ items: string[]; type?: 'success' | 'warning' | 'danger' | 'info' }> = ({ items, type = 'info' }) => {
  if (!items || items.length === 0) return <p className="text-zinc-500 italic text-sm font-mono">No data detected.</p>;

  const dotColors = {
    success: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
    warning: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]",
    danger: "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]",
    info: "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]"
  };

  return (
    <ul className="space-y-4">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-4 text-zinc-200 text-sm leading-relaxed group/item">
          <span className={`mt-2 w-2 h-2 rounded-full shrink-0 ${dotColors[type]} transition-transform group-hover/item:scale-125`} />
          <span className="font-medium opacity-90">{item}</span>
        </li>
      ))}
    </ul>
  );
};

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ data }) => {
  return (
    <div className="space-y-8 pb-10 max-w-5xl mx-auto">
      {/* Summary Card */}
      <div className="relative rounded-2xl border border-emerald-500/50 bg-emerald-950/20 p-8 overflow-hidden animate-in fade-in zoom-in-95 duration-500 shadow-xl">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.6)]"></div>
        <h3 className="text-emerald-200 font-mono text-sm font-bold mb-4 uppercase tracking-wider flex items-center gap-3">
          <Cpu className="w-5 h-5 text-emerald-300 animate-pulse" /> Executive Summary
        </h3>
        <p className="text-white leading-relaxed font-normal text-base drop-shadow-sm">{data.summary}</p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ResultCard title="System Strengths" icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />} delayClass="delay-100">
          <ListItems items={data.strengths} type="success" />
        </ResultCard>

        <ResultCard title="Optimization Targets" icon={<TrendingUp className="w-5 h-5 text-amber-400" />} delayClass="delay-200">
           <ListItems items={data.weaknesses} type="warning" />
        </ResultCard>
      </div>

      {/* Security Audit */}
      <ResultCard 
        title="Security Audit" 
        icon={<ShieldAlert className="w-5 h-5 text-rose-500" />} 
        className="border-rose-900/50 bg-rose-950/20"
        delayClass="delay-300"
      >
        <ListItems items={data.securityIssues} type="danger" />
      </ResultCard>

      {/* Improvements */}
      <ResultCard title="Recommended Actions" icon={<Lightbulb className="w-5 h-5 text-blue-400" />} delayClass="delay-400">
        <ListItems items={data.improvements} type="info" />
      </ResultCard>
    </div>
  );
};