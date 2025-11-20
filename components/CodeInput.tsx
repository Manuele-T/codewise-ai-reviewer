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

  const validateAndReadFile = (file: File) => {
    setUploadError(null);

    // 1. Extension Check
    if (!file.name.toLowerCase().endsWith('.txt')) {
      setUploadError("Security Policy: Only .txt files are allowed.");
      return;
    }

    // 2. Size Check (Max 1MB)
    if (file.size > 1024 * 1024) {
      setUploadError("File too large. Limit is 1MB.");
      return;
    }

    const reader = new FileReader();
    
    // Read as ArrayBuffer first to inspect bytes (Security Guardrail)
    reader.readAsArrayBuffer(file);
    
    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      const uint8 = new Uint8Array(buffer);

      // 3. Magic Number Check (Block executables/zips)
      // MZ (exe), PK (zip/docx), ELF (linux), PDF
      const headers = [
        [0x4D, 0x5A],       // MZ
        [0x50, 0x4B],       // PK
        [0x7F, 0x45, 0x4C, 0x46], // ELF
        [0x25, 0x50, 0x44, 0x46]  // %PDF
      ];

      const isBinaryMagic = headers.some(header => 
        header.every((byte, i) => uint8[i] === byte)
      );

      if (isBinaryMagic) {
        setUploadError("Security Alert: Binary file detected disguised as .txt.");
        return;
      }

      // 4. Null Byte Check (The ultimate text test)
      // Text files should not have null bytes (0x00) in the first 1KB
      const checkLength = Math.min(uint8.length, 1024);
      for (let i = 0; i < checkLength; i++) {
        if (uint8[i] === 0x00) {
          setUploadError("Security Alert: File contains binary data (null bytes).");
          return;
        }
      }

      // 5. Safe to Decode
      const text = new TextDecoder("utf-8").decode(uint8);
      onChange(text);
    };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) validateAndReadFile(file);
  };

  const triggerFileUpload = () => fileInputRef.current?.click();

  return (
    <div className="h-full flex flex-col relative group">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="// Paste your code here or upload a .txt file..."
        className="flex-1 w-full h-full bg-transparent p-4 font-mono text-sm resize-none outline-none text-slate-300 placeholder:text-slate-600 leading-relaxed"
        spellCheck={false}
      />
      
      {/* Error Toast */}
      {uploadError && (
        <div className="absolute top-4 left-4 right-4 bg-red-500/10 border border-red-500/50 p-3 rounded text-red-200 text-xs flex items-center gap-2 backdrop-blur-md animate-in fade-in slide-in-from-top-2">
           <AlertCircle className="w-4 h-4" />
           {uploadError}
        </div>
      )}

      {/* Floating Upload Button */}
      {!value && !disabled && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center pointer-events-auto">
            <button
              onClick={triggerFileUpload}
              className="group/btn flex flex-col items-center gap-3 p-8 border-2 border-dashed border-slate-700 rounded-xl hover:border-indigo-500 hover:bg-slate-900/50 transition-all cursor-pointer"
            >
              <div className="p-4 bg-slate-800 rounded-full group-hover/btn:bg-indigo-600/20 transition-colors">
                <UploadCloud className="w-8 h-8 text-slate-400 group-hover/btn:text-indigo-400" />
              </div>
              <div className="space-y-1">
                <p className="text-slate-300 font-medium">Upload Code File</p>
                <p className="text-xs text-slate-500">.txt files only (Max 1MB)</p>
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
        aria-label="Upload code file" 
      />
    </div>
  );
};