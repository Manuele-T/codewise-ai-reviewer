import React, { useRef, useState } from 'react';
import { UploadCloud, AlertCircle } from 'lucide-react';

interface CodeInputProps {
  value: string;
  onChange: (val: string) => void;
  disabled: boolean;
}

export const CodeInput: React.FC<CodeInputProps> = ({ value, onChange, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateAndReadFile = (file: File) => {
    setUploadError(null);
    
    // 1. Strict .txt Extension Check
    if (!file.name.toLowerCase().endsWith('.txt')) {
      setUploadError("Security Policy: Only .txt files are allowed.");
      return;
    }

    // 2. Size Check (Max 1MB)
    if (file.size > 1024 * 1024) {
      setUploadError("File too large (Max 1MB).");
      return;
    }

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    
    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      const uint8 = new Uint8Array(buffer);
      
      // 3. Magic Number Check (Block binaries)
      for (let i = 0; i < Math.min(uint8.length, 1024); i++) {
        if (uint8[i] === 0x00) {
          setUploadError("Security Alert: Binary file detected.");
          return;
        }
      }

      const text = new TextDecoder("utf-8").decode(uint8);
      onChange(text);
    };
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndReadFile(file);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) validateAndReadFile(file);
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
      className={`h-full flex flex-col relative group transition-all duration-300 
        ${isDragging ? 'bg-emerald-900/20 border-2 border-emerald-500' : 'bg-transparent'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="// Paste your code here or upload a .txt file..."
        aria-label="Source Code Input"
        className="flex-1 w-full h-full bg-transparent p-8 font-mono text-sm resize-none outline-none text-white placeholder:text-zinc-500 leading-relaxed border-none focus:ring-0 z-10 selection:bg-emerald-500/50"
        spellCheck={false}
      />
      
      {/* Floating Error Toast */}
      {uploadError && (
        <div className="absolute top-4 left-4 right-4 bg-rose-950/95 border border-rose-500 p-4 rounded-lg text-rose-100 text-sm font-semibold flex items-center gap-3 backdrop-blur-md z-40 shadow-2xl animate-in fade-in slide-in-from-top-4">
           <AlertCircle className="w-5 h-5 text-rose-400" />
           {uploadError}
        </div>
      )}

      {/* Empty State / Upload Trigger */}
      {!value && !disabled && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div className="text-center pointer-events-auto">
            <button
              onClick={triggerUpload}
              className="group/btn flex flex-col items-center gap-5 p-12 border-2 border-dashed border-zinc-600 rounded-3xl hover:border-emerald-500/50 hover:bg-[#1a1a1e] transition-all cursor-pointer shadow-xl active:scale-95 bg-[#09090b]/80 backdrop-blur-sm"
              aria-label="Upload File"
              title="Upload File"
            >
              <div className="p-6 bg-zinc-800 rounded-full group-hover/btn:bg-emerald-600 group-hover/btn:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all duration-300 border border-white/10">
                <UploadCloud className="w-12 h-12 text-zinc-300 group-hover/btn:text-white" />
              </div>
              <div className="space-y-2">
                <p className="text-white font-bold tracking-wide text-lg group-hover/btn:text-emerald-300 transition-colors">UPLOAD SOURCE</p>
                <p className="text-sm text-zinc-400 font-mono bg-zinc-800 px-4 py-1.5 rounded-full border border-white/10">.txt only</p>
              </div>
            </button>
          </div>
        </div>
      )}

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
        accept=".txt" 
        aria-label="File Upload"
      />
    </div>
  );
};