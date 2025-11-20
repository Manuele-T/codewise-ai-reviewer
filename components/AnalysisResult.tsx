import React from 'react';
import { AnalysisResponse } from '../App';
import { ShieldAlert, TrendingUp, Lightbulb, CheckCircle, Copy } from 'lucide-react';

interface AnalysisResultProps {
  data: AnalysisResponse;
}

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; className?: string }> = ({ title, icon, children, className = "" }) => (
  <div className={`rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden ${className}`}>
    <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-800 flex items-center gap-2">
      {icon}
      <h3 className="font-semibold text-slate-200 text-sm tracking-wide uppercase">{title}</h3>
    </div>
    <div className="p-5">
      {children}
    </div>
  </div>
);

const ListItems: React.FC<{ items: string[]; icon?: React.ReactNode; type?: 'success' | 'warning' | 'danger' | 'info' }> = ({ items, type = 'info' }) => {
  if (!items || items.length === 0) return <p className="text-slate-500 italic">None detected.</p>;

  return (
    <ul className="space-y-3">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm leading-relaxed">
          <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 
            ${type === 'success' ? 'bg-emerald-500' : 
              type === 'warning' ? 'bg-amber-500' : 
              type === 'danger' ? 'bg-rose-500' : 'bg-indigo-500'}`} 
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
};

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ data }) => {
  const copyCode = () => {
    if (data.refactoredCode) {
      navigator.clipboard.writeText(data.refactoredCode);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Summary */}
      <div className="bg-gradient-to-r from-indigo-900/20 to-slate-900 border border-indigo-500/20 rounded-xl p-6">
        <h3 className="text-indigo-400 font-semibold mb-2">Executive Summary</h3>
        <p className="text-slate-300 leading-relaxed">{data.summary}</p>
      </div>

      {/* Grid for Strengths & Weaknesses */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Section title="Strengths" icon={<CheckCircle className="w-4 h-4 text-emerald-500" />}>
          <ListItems items={data.strengths} type="success" />
        </Section>

        <Section title="Areas for Improvement" icon={<TrendingUp className="w-4 h-4 text-amber-500" />}>
           <ListItems items={data.weaknesses} type="warning" />
        </Section>
      </div>

      {/* Security */}
      <Section title="Security Audit" icon={<ShieldAlert className="w-4 h-4 text-rose-500" />} className="border-rose-900/30 bg-rose-950/10">
        <ListItems items={data.securityIssues} type="danger" />
      </Section>

      {/* Suggested Improvements */}
      <Section title="Actionable Advice" icon={<Lightbulb className="w-4 h-4 text-yellow-400" />}>
        <ListItems items={data.improvements} type="info" />
      </Section>

      {/* Refactored Code Block */}
      {data.refactoredCode && (
        <div className="rounded-xl border border-slate-800 overflow-hidden bg-[#0d1117]">
          <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
            <span className="text-xs font-mono text-slate-500">Refactored Snippet</span>
            <button 
              onClick={copyCode}
              className="text-xs flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
            >
              <Copy className="w-3 h-3" /> Copy
            </button>
          </div>
          <pre className="p-4 overflow-x-auto text-sm text-slate-300 font-mono leading-loose">
            <code>{data.refactoredCode}</code>
          </pre>
        </div>
      )}
    </div>
  );
};