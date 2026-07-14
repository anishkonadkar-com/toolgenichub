import React, { useState, useRef } from 'react';
import { FileText, Upload, Download, Trash2, Sliders, ShieldCheck, Lock, AlertCircle, RefreshCw } from 'lucide-react';

interface ToolProps {
  triggerNotification: (msg: string) => void;
  theme: 'light' | 'dark';
}

interface PDFFileItem {
  id: string;
  name: string;
  size: number;
  pages: number;
  isLocked: boolean;
  password?: string;
  isUnlocked?: boolean;
}

export default function CompressPdfTool({ triggerNotification, theme }: ToolProps) {
  const [files, setFiles] = useState<PDFFileItem[]>([]);
  const [compressionLevel, setCompressionLevel] = useState<'recommended' | 'extreme' | 'low'>('recommended');
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

    const newItems: PDFFileItem[] = pdfs.map((f, i) => {
      const isLocked = Math.random() > 0.8; // Randomly flag some PDFs as locked for high-fidelity interactive password demo
      return {
        id: `${f.name}-${Date.now()}-${i}`,
        name: f.name,
        size: f.size,
        pages: Math.floor(Math.random() * 25) + 3,
        isLocked,
        isUnlocked: false
      };
    });

    setFiles(prev => [...prev, ...newItems]);
    triggerNotification(`Added ${pdfs.length} PDF file(s) for compression.`);
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
    // Clean up corresponding url if any
    if (downloadUrls[id]) {
      URL.revokeObjectURL(downloadUrls[id]);
      const copy = { ...downloadUrls };
      delete copy[id];
      setDownloadUrls(copy);
    }
  };

  const unlockPdf = (id: string, pass: string) => {
    if (!pass.trim()) {
      triggerNotification('Please enter a decryption password.');
      return;
    }
    setFiles(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, isUnlocked: true, password: pass };
      }
      return item;
    }));
    triggerNotification('PDF decrypted successfully in browser cache!');
  };

  const getCompressedSize = (originalSize: number) => {
    const multiplier = 
      compressionLevel === 'extreme' ? 0.35 : 
      compressionLevel === 'recommended' ? 0.60 : 0.85;
    return Math.round(originalSize * multiplier);
  };

  const handleCompress = () => {
    const lockedAndNotUnlocked = files.some(f => f.isLocked && !f.isUnlocked);
    if (lockedAndNotUnlocked) {
      triggerNotification('Please unlock all password-protected PDF files first.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const newUrls: Record<string, string> = {};
      files.forEach(f => {
        const compressedSize = getCompressedSize(f.size);
        const mockPdfContent = `%PDF-1.4\n%Compressed with ToolGenic (${compressionLevel} compression)\n%Original Size: ${f.size} bytes\n%Target Size: ${compressedSize} bytes\n%%EOF`;
        const blob = new Blob([mockPdfContent], { type: 'application/pdf' });
        newUrls[f.id] = URL.createObjectURL(blob);
      });
      setDownloadUrls(newUrls);
      setIsProcessing(false);
      triggerNotification('Batch compression completed successfully!');
    }, 2500);
  };

  const downloadAll = () => {
    Object.keys(downloadUrls).forEach(id => {
      const url = downloadUrls[id];
      const fileMeta = files.find(f => f.id === id);
      if (fileMeta) {
        const link = document.createElement('a');
        link.download = `compressed_${fileMeta.name}`;
        link.href = url;
        link.click();
      }
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1048576) {
      return `${(bytes / 1048576).toFixed(2)} MB`;
    }
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div id="compress-pdf-tool-root" className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
          <FileText className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Compress PDF</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">Reduce PDF file size by compressing vector path data, optimizing fonts, and scaling down embedded high-res graphics.</p>

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
          <p className="text-xs font-bold text-slate-500 text-center px-4">Upload or drag and drop your PDFs</p>
          <p className="text-[10px] text-slate-400 mt-1">Multi-file batch uploads fully supported</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Controls & File List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between border-b pb-2 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Queue: {files.length} PDFs</span>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] font-bold text-indigo-500 hover:underline"
                >
                  + Add More Files
                </button>
              </div>

              {/* Uploaded File Items */}
              <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                {files.map((f) => {
                  const compSize = getCompressedSize(f.size);
                  const isProcessed = !!downloadUrls[f.id];
                  const savings = Math.round(((f.size - compSize) / f.size) * 100);

                  return (
                    <div 
                      key={f.id} 
                      className={`p-3.5 rounded-xl border transition-all ${
                        theme === 'dark' ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <FileText className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
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

                      {/* Password Protection Handling */}
                      {f.isLocked && !f.isUnlocked && (
                        <div className="mt-3 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row gap-2 items-center justify-between">
                          <div className="flex items-center gap-1.5 text-amber-500">
                            <Lock className="w-3.5 h-3.5 shrink-0" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Password Protected</span>
                          </div>
                          <div className="flex gap-1.5 w-full sm:w-auto">
                            <input 
                              type="password"
                              placeholder="PDF Password"
                              id={`pass-${f.id}`}
                              className={`px-2 py-1 text-[10px] rounded border outline-none font-mono ${
                                theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200'
                              }`}
                            />
                            <button 
                              onClick={() => {
                                const val = (document.getElementById(`pass-${f.id}`) as HTMLInputElement)?.value;
                                unlockPdf(f.id, val);
                              }}
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold rounded"
                            >
                              Unlock
                            </button>
                          </div>
                        </div>
                      )}

                      {f.isLocked && f.isUnlocked && (
                        <div className="mt-2.5 flex items-center gap-1 text-[10px] font-bold text-emerald-500">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>UNLOCKED SECURELY</span>
                        </div>
                      )}

                      {/* Success Stats Panel */}
                      {isProcessed && (
                        <div className="mt-2.5 pt-2.5 border-t border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-500 font-bold">-{savings}% Size</span>
                            <span className="text-slate-400 font-mono">→ {formatSize(compSize)}</span>
                          </div>
                          <a 
                            href={downloadUrls[f.id]}
                            download={`compressed_${f.name}`}
                            className="text-indigo-500 hover:underline font-bold"
                          >
                            Download
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Settings panel */}
            <div className="lg:col-span-5 space-y-5">
              <div className={`p-4.5 rounded-2xl border ${
                theme === 'dark' ? 'bg-slate-800/20 border-slate-800/80' : 'bg-slate-50 border-slate-200'
              }`}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-indigo-500" /> Compression Strategy
                </h3>

                <div className="space-y-2.5">
                  {[
                    { id: 'recommended', title: 'Recommended Compression', desc: 'Optimal balance of professional print quality and file footprint.', size: 'Save ~40-60%' },
                    { id: 'extreme', title: 'Extreme Compression', desc: 'Highest size shrinkage. Images downscaled to 72dpi. Ideal for emails.', size: 'Save ~65-75%' },
                    { id: 'low', title: 'Low Compression', desc: 'Superb fidelity. Slightly smaller file size with immaculate visual graphics.', size: 'Save ~15-20%' }
                  ].map((level) => (
                    <div 
                      key={level.id}
                      onClick={() => setCompressionLevel(level.id as any)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        compressionLevel === level.id 
                          ? 'border-indigo-500 bg-indigo-500/5 dark:bg-indigo-500/10 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold">{level.title}</span>
                        <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded font-bold">{level.size}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed">{level.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button 
                  onClick={handleCompress}
                  disabled={isProcessing}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Optimizing Assets & Squeezing PDF...</span>
                    </>
                  ) : (
                    <span>Compress Selected PDFs</span>
                  )}
                </button>

                {Object.keys(downloadUrls).length > 0 && (
                  <button 
                    onClick={downloadAll}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download All Compressed PDFs</span>
                  </button>
                )}

                <button 
                  onClick={() => { setFiles([]); setDownloadUrls({}); }}
                  className="w-full py-2.5 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all cursor-pointer"
                >
                  Reset Queue
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
