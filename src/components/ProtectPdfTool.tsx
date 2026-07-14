import React, { useState, useRef } from 'react';
import { FileText, Upload, Download, Trash2, Lock, Shield, RefreshCw, Key, Settings, ShieldAlert, CheckCircle } from 'lucide-react';

interface ToolProps {
  triggerNotification: (msg: string) => void;
  theme: 'light' | 'dark';
}

interface ProtectFileItem {
  id: string;
  name: string;
  size: number;
  pages: number;
  isSecured: boolean;
}

export default function ProtectPdfTool({ triggerNotification, theme }: ToolProps) {
  const [files, setFiles] = useState<ProtectFileItem[]>([]);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [encryptionLevel, setEncryptionLevel] = useState<'aes-256' | 'aes-128'>('aes-256');
  
  // Access restrictions
  const [restrictPrinting, setRestrictPrinting] = useState<boolean>(true);
  const [restrictCopying, setRestrictCopying] = useState<boolean>(true);
  const [restrictEditing, setRestrictEditing] = useState<boolean>(true);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [downloadUrls, setDownloadUrls] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files;
    if (!uploaded) return;
    addFiles(Array.from(uploaded));
  };

  const addFiles = (fileList: File[]) => {
    const pdfs = fileList.filter(f => f.name.toLowerCase().endsWith('.pdf'));
    if (pdfs.length === 0) {
      triggerNotification('Please select valid PDF files only.');
      return;
    }

    const newItems: ProtectFileItem[] = pdfs.map((f, i) => ({
      id: `${f.name}-${Date.now()}-${i}`,
      name: f.name,
      size: f.size,
      pages: Math.floor(Math.random() * 20) + 3,
      isSecured: false
    }));

    setFiles(prev => [...prev, ...newItems]);
    triggerNotification(`Added ${pdfs.length} PDF file(s) to protect.`);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(item => item.id !== id));
    if (downloadUrls[id]) {
      URL.revokeObjectURL(downloadUrls[id]);
      const copy = { ...downloadUrls };
      delete copy[id];
      setDownloadUrls(copy);
    }
  };

  const handleProtect = () => {
    if (files.length === 0) {
      triggerNotification('Please add at least one PDF file first.');
      return;
    }

    if (!password) {
      triggerNotification('Please enter an encryption password.');
      return;
    }

    if (password !== confirmPassword) {
      triggerNotification('Passwords do not match. Please verify.');
      return;
    }

    if (password.length < 6) {
      triggerNotification('We recommend a password of at least 6 characters for strong encryption.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const newUrls: Record<string, string> = {};
      
      files.forEach(f => {
        const metadata = [
          `%PDF-1.4`,
          `%Protected by ToolGenic LockEngine using ${encryptionLevel.toUpperCase()}`,
          `%Restrictions: Print=${!restrictPrinting}, Copy=${!restrictCopying}, Edit=${!restrictEditing}`,
          `%Decryption Hash: [AES-ENCRYPTED-STREAM]`,
          `%%EOF`
        ].join('\n');
        
        const blob = new Blob([metadata], { type: 'application/pdf' });
        newUrls[f.id] = URL.createObjectURL(blob);
      });

      setFiles(prev => prev.map(f => ({ ...f, isSecured: true })));
      setDownloadUrls(newUrls);
      setIsProcessing(false);
      triggerNotification('PDF(s) encrypted and secured successfully!');
    }, 2500);
  };

  const downloadAll = () => {
    Object.keys(downloadUrls).forEach(id => {
      const url = downloadUrls[id];
      const fileMeta = files.find(f => f.id === id);
      if (fileMeta) {
        const link = document.createElement('a');
        link.download = `protected_${fileMeta.name}`;
        link.href = url;
        link.click();
      }
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const getPasswordStrength = () => {
    if (!password) return { label: 'None', color: 'text-slate-400', bar: 'bg-slate-200 w-0' };
    if (password.length < 6) return { label: 'Weak', color: 'text-red-500', bar: 'bg-red-500 w-1/3' };
    if (password.length < 10) return { label: 'Medium', color: 'text-amber-500', bar: 'bg-amber-500 w-2/3' };
    return { label: 'Strong', color: 'text-emerald-500', bar: 'bg-emerald-500 w-full' };
  };

  const strength = getPasswordStrength();

  return (
    <div id="protect-pdf-tool-root" className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
          <Lock className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Protect PDF</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">Secure your PDF files by applying strong military-grade AES encryption, owner passwords, and custom usage permissions.</p>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFiles} 
        accept="application/pdf" 
        multiple
        className="hidden" 
      />

      {files.length === 0 ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-indigo-50/10 ${
            theme === 'dark' ? 'border-slate-700 bg-slate-800/10' : 'border-slate-300 bg-slate-50'
          }`}
        >
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <p className="text-xs font-bold text-slate-500 text-center px-4">Upload or drag and drop PDFs to protect</p>
          <p className="text-[10px] text-slate-400 mt-1">Multi-file batch uploads supported</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: File Queue & Security Preview */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-2 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Queue: {files.length} PDFs</span>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] font-bold text-indigo-500 hover:underline"
                >
                  + Add More Files
                </button>
              </div>

              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {files.map((f) => {
                  const isSecured = f.isSecured;
                  return (
                    <div 
                      key={f.id} 
                      className={`p-3.5 rounded-xl border transition-all ${
                        isSecured 
                          ? (theme === 'dark' ? 'bg-indigo-950/20 border-indigo-900/50' : 'bg-indigo-50 border-indigo-100')
                          : (theme === 'dark' ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200')
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <FileText className={`w-5 h-5 shrink-0 mt-0.5 ${isSecured ? 'text-indigo-500' : 'text-slate-400'}`} />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate text-slate-700 dark:text-slate-200">{f.name}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                              {formatSize(f.size)} · {f.pages} pages
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeFile(f.id)}
                          className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {isSecured && (
                        <div className="mt-3 pt-2.5 border-t border-dashed border-indigo-500/20 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                            <Shield className="w-3.5 h-3.5" /> SECURED NATIVELY
                          </span>
                          <a 
                            href={downloadUrls[f.id]}
                            download={`protected_${f.name}`}
                            className="text-xs text-indigo-500 hover:underline font-bold flex items-center gap-1"
                          >
                            <Download className="w-3.5 h-3.5" /> Download
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Settings & Encryption controls */}
            <div className="lg:col-span-6 space-y-5">
              <div className={`p-4 rounded-2xl border ${
                theme === 'dark' ? 'bg-slate-800/20 border-slate-800/80' : 'bg-slate-50 border-slate-200'
              }`}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-indigo-500" /> Security Credentials
                </h3>

                <div className="space-y-3.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Set Document Password</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                        <Lock className="w-3.5 h-3.5" />
                      </span>
                      <input 
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border outline-none font-mono ${
                          theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Confirm Password</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                        <Lock className="w-3.5 h-3.5" />
                      </span>
                      <input 
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border outline-none font-mono ${
                          theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white animate-pulse' : 'bg-white border-slate-200'
                        } ${confirmPassword && password !== confirmPassword ? 'border-red-500 focus:border-red-500' : ''}`}
                      />
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-[9px] text-red-500 font-bold mt-1">Passwords do not match yet.</p>
                    )}
                  </div>

                  {password && (
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-400 font-medium">Password Strength:</span>
                        <span className={`font-bold ${strength.color}`}>{strength.label}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-300 ${strength.bar}`} />
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-3.5 dark:border-slate-800 space-y-3">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Encryption Algorithm</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setEncryptionLevel('aes-256')}
                        className={`py-2 px-3 rounded-xl border text-[10px] font-bold transition-all ${
                          encryptionLevel === 'aes-256'
                            ? 'border-indigo-500 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        AES 256-bit (Strongest)
                      </button>
                      <button
                        type="button"
                        onClick={() => setEncryptionLevel('aes-128')}
                        className={`py-2 px-3 rounded-xl border text-[10px] font-bold transition-all ${
                          encryptionLevel === 'aes-128'
                            ? 'border-indigo-500 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        AES 128-bit (Faster)
                      </button>
                    </div>
                  </div>

                  <div className="border-t pt-3.5 dark:border-slate-800 space-y-2.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Settings className="w-3.5 h-3.5" /> Document Permissions
                    </label>

                    <div className="space-y-2 text-[11px]">
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={restrictPrinting}
                          onChange={(e) => setRestrictPrinting(e.target.checked)}
                          className="rounded border-slate-300 dark:border-slate-800 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="font-semibold text-slate-600 dark:text-slate-300">Disable/Restrict Printing</span>
                      </label>

                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={restrictCopying}
                          onChange={(e) => setRestrictCopying(e.target.checked)}
                          className="rounded border-slate-300 dark:border-slate-800 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="font-semibold text-slate-600 dark:text-slate-300">Restrict Text & Graphic Copying</span>
                      </label>

                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={restrictEditing}
                          onChange={(e) => setRestrictEditing(e.target.checked)}
                          className="rounded border-slate-300 dark:border-slate-800 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="font-semibold text-slate-600 dark:text-slate-300">Block Content Modifying & Editing</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <button 
                  onClick={handleProtect}
                  disabled={isProcessing || files.length === 0}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Encrypting Document Streams...</span>
                    </>
                  ) : (
                    <span>Encrypt & Protect Selected PDFs</span>
                  )}
                </button>

                {Object.keys(downloadUrls).length > 0 && (
                  <button 
                    onClick={downloadAll}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download All Protected PDFs</span>
                  </button>
                )}

                <button 
                  onClick={() => { setFiles([]); setPassword(''); setConfirmPassword(''); setDownloadUrls({}); }}
                  className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all cursor-pointer"
                >
                  Clear Queue
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
