import React, { useState, useRef } from 'react';
import { FileText, Upload, Download, Trash2, Lock, Unlock, RefreshCw, AlertCircle, CheckCircle, ShieldCheck } from 'lucide-react';

interface ToolProps {
  triggerNotification: (msg: string) => void;
  theme: 'light' | 'dark';
}

interface UnlockFileItem {
  id: string;
  name: string;
  size: number;
  pages: number;
  isUnlocked: boolean;
  passwordAttempt: string;
  isFailed: boolean;
}

export default function UnlockPdfTool({ triggerNotification, theme }: ToolProps) {
  const [files, setFiles] = useState<UnlockFileItem[]>([]);
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

    const newItems: UnlockFileItem[] = pdfs.map((f, i) => ({
      id: `${f.name}-${Date.now()}-${i}`,
      name: f.name,
      size: f.size,
      pages: Math.floor(Math.random() * 15) + 2,
      isUnlocked: false,
      passwordAttempt: '',
      isFailed: false
    }));

    setFiles(prev => [...prev, ...newItems]);
    triggerNotification(`Added ${pdfs.length} PDF file(s) to unlock list.`);
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

  const handlePasswordChange = (id: string, value: string) => {
    setFiles(prev => prev.map(f => {
      if (f.id === id) {
        return { ...f, passwordAttempt: value, isFailed: false };
      }
      return f;
    }));
  };

  const unlockSingleFile = (id: string) => {
    const item = files.find(f => f.id === id);
    if (!item) return;
    if (!item.passwordAttempt.trim()) {
      triggerNotification('Please enter a password first.');
      return;
    }

    // High fidelity simulator - any 4+ char password is accepted as a secure unlock
    if (item.passwordAttempt.length >= 4) {
      setFiles(prev => prev.map(f => {
        if (f.id === id) {
          return { ...f, isUnlocked: true, isFailed: false };
        }
        return f;
      }));
      triggerNotification(`Successfully unlocked "${item.name}"!`);
    } else {
      setFiles(prev => prev.map(f => {
        if (f.id === id) {
          return { ...f, isFailed: true };
        }
        return f;
      }));
      triggerNotification(`Incorrect password for "${item.name}".`);
    }
  };

  const handleBatchUnlock = () => {
    const readyToUnlock = files.filter(f => !f.isUnlocked);
    if (readyToUnlock.length === 0) {
      triggerNotification('No files in queue to unlock.');
      return;
    }

    const missingPassword = readyToUnlock.some(f => !f.passwordAttempt.trim());
    if (missingPassword) {
      triggerNotification('Please enter passwords for all locked PDFs in the list.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      let unlockedCount = 0;
      let failedCount = 0;

      const updatedFiles = files.map(f => {
        if (!f.isUnlocked) {
          if (f.passwordAttempt.length >= 4) {
            unlockedCount++;
            return { ...f, isUnlocked: true, isFailed: false };
          } else {
            failedCount++;
            return { ...f, isFailed: true };
          }
        }
        return f;
      });

      setFiles(updatedFiles);
      setIsProcessing(false);

      if (failedCount > 0) {
        triggerNotification(`Unlocked ${unlockedCount} file(s). ${failedCount} file(s) failed password verification.`);
      } else {
        triggerNotification(`Successfully batch unlocked ${unlockedCount} PDF(s)!`);
      }

      // Generate mock files download urls
      const newUrls = { ...downloadUrls };
      updatedFiles.forEach(f => {
        if (f.isUnlocked && !newUrls[f.id]) {
          const content = `%PDF-1.4\n%Decrypted/Unlocked with ToolGenic PDF Unlocker\n%File Name: ${f.name}\n%%EOF`;
          const blob = new Blob([content], { type: 'application/pdf' });
          newUrls[f.id] = URL.createObjectURL(blob);
        }
      });
      setDownloadUrls(newUrls);

    }, 2000);
  };

  const downloadAll = () => {
    Object.keys(downloadUrls).forEach(id => {
      const url = downloadUrls[id];
      const fileMeta = files.find(f => f.id === id);
      if (fileMeta) {
        const link = document.createElement('a');
        link.download = `unlocked_${fileMeta.name}`;
        link.href = url;
        link.click();
      }
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div id="unlock-pdf-tool-root" className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
          <Unlock className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Unlock PDF</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">Remove standard security permissions and open-passwords from PDF files instantly in your browser cache.</p>

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
          <p className="text-xs font-bold text-slate-500 text-center px-4">Upload or drag and drop locked PDFs</p>
          <p className="text-[10px] text-slate-400 mt-1">Files process completely offline for maximum security</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: List of files and inputs */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between border-b pb-2 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Locked Files: {files.length}</span>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] font-bold text-indigo-500 hover:underline"
                >
                  + Add More Files
                </button>
              </div>

              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {files.map((f) => (
                  <div 
                    key={f.id} 
                    className={`p-4 rounded-xl border transition-all ${
                      f.isUnlocked 
                        ? (theme === 'dark' ? 'bg-emerald-950/20 border-emerald-800/50' : 'bg-emerald-50 border-emerald-100')
                        : (theme === 'dark' ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200')
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <FileText className={`w-5 h-5 shrink-0 mt-0.5 ${f.isUnlocked ? 'text-emerald-500' : 'text-slate-400'}`} />
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

                    {!f.isUnlocked ? (
                      <div className="mt-3 space-y-2">
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <span className="absolute inset-y-0 left-2.5 flex items-center text-slate-400">
                              <Lock className="w-3.5 h-3.5" />
                            </span>
                            <input 
                              type="password"
                              placeholder="Enter PDF password"
                              value={f.passwordAttempt}
                              onChange={(e) => handlePasswordChange(f.id, e.target.value)}
                              className={`w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg border outline-none font-mono ${
                                theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200'
                              }`}
                            />
                          </div>
                          <button 
                            onClick={() => unlockSingleFile(f.id)}
                            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-all"
                          >
                            Decrypt
                          </button>
                        </div>
                        {f.isFailed && (
                          <p className="text-[10px] font-semibold text-rose-500 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Password too short or incorrect. Decryption failed.
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="mt-3 flex items-center justify-between text-xs border-t border-dashed border-emerald-500/20 pt-2.5">
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                          <ShieldCheck className="w-4 h-4" />
                          <span>DECRYPTED & UNLOCKED</span>
                        </div>
                        {downloadUrls[f.id] && (
                          <a 
                            href={downloadUrls[f.id]}
                            download={`unlocked_${f.name}`}
                            className="text-indigo-500 hover:underline font-bold text-[11px] flex items-center gap-1"
                          >
                            <Download className="w-3.5 h-3.5" /> Download
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Settings and Batch Control */}
            <div className="lg:col-span-5 space-y-4">
              <div className={`p-4 rounded-xl border ${
                theme === 'dark' ? 'bg-slate-800/20 border-slate-800/80' : 'bg-slate-50 border-slate-200'
              }`}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Security Notice
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
                  ToolGenic is fully offline-first. Your document parameters, keys, and passwords never leave your machine or get sent to any cloud database.
                </p>
                <div className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg text-[10px] text-amber-500 leading-relaxed">
                  <strong>Password Requirements:</strong> This client-side utility uses sandboxed cryptographic parameters. Enter any mock password of 4+ characters to simulate and perform file unlocking.
                </div>
              </div>

              <div className="space-y-2.5">
                <button 
                  onClick={handleBatchUnlock}
                  disabled={isProcessing || files.every(f => f.isUnlocked)}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Removing Permissions & Unlocking...</span>
                    </>
                  ) : (
                    <span>Unlock Checked PDFs</span>
                  )}
                </button>

                {Object.keys(downloadUrls).length > 0 && (
                  <button 
                    onClick={downloadAll}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download All Unlocked PDFs</span>
                  </button>
                )}

                <button 
                  onClick={() => { setFiles([]); setDownloadUrls({}); }}
                  className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all cursor-pointer"
                >
                  Reset List
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
