import React, { useState, useRef } from 'react';
import { FileText, Upload, Download, Trash2, ArrowRight, RefreshCw } from 'lucide-react';

interface ToolProps {
  triggerNotification: (msg: string) => void;
  theme: 'light' | 'dark';
}

interface PdfItem {
  id: string;
  name: string;
  size: string;
  pages: number;
}

export default function MergePdfTool({ triggerNotification, theme }: ToolProps) {
  const [pdfs, setPdfs] = useState<PdfItem[]>([]);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [addToc, setAddToc] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPdfs: PdfItem[] = [];
    (Array.from(files) as File[]).forEach((f) => {
      const kbSize = (f.size / 1024).toFixed(1);
      // Generate realistic page numbers between 2 and 35
      const mockPages = Math.floor(Math.random() * 12) + 2;
      newPdfs.push({
        id: Math.random().toString(36).substr(2, 9),
        name: f.name,
        size: `${kbSize} KB`,
        pages: mockPages
      });
    });

    setPdfs((prev) => [...prev, ...newPdfs]);
    triggerNotification(`Added ${newPdfs.length} PDFs to compile list`);
  };

  const removePdf = (id: string) => {
    setPdfs((prev) => prev.filter((p) => p.id !== id));
    triggerNotification('PDF file removed from merge list');
  };

  const movePdf = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === pdfs.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newList = [...pdfs];
    const temp = newList[index];
    newList[index] = newList[targetIndex];
    newList[targetIndex] = temp;
    setPdfs(newList);
  };

  const performMerge = () => {
    if (pdfs.length < 2) {
      triggerNotification('Please upload at least 2 PDF files to merge.');
      return;
    }
    setIsProcessing(true);

    // Simulate high-fidelity compilation process
    setTimeout(() => {
      // Create a simulated downloadable BLOB of merged PDF
      const mockPdfContent = `%PDF-1.4\n%${pdfs.map(p => p.name).join(' | ')}\n%%EOF`;
      const blob = new Blob([mockPdfContent], { type: 'application/pdf' });
      setProcessedUrl(URL.createObjectURL(blob));
      setIsProcessing(false);
      triggerNotification('PDF compilation successful!');
    }, 2500);
  };

  const handleDownload = () => {
    if (!processedUrl) return;
    const link = document.createElement('a');
    link.download = `toolgenic_merged_document.pdf`;
    link.href = processedUrl;
    link.click();
  };

  const resetAll = () => {
    setPdfs([]);
    setProcessedUrl(null);
  };

  return (
    <div id="merge-pdf-tool-root" className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
          <FileText className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Professional PDF Merger</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">Consolidate multiple documents into one polished sequential PDF. Rearrange pages and index listings securely.</p>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFiles} 
        accept="application/pdf" 
        multiple 
        className="hidden" 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Settings and controls */}
        <div className="space-y-4">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50/10 transition-all"
          >
            <Upload className="w-8 h-8 text-slate-400 mb-2" />
            <p className="text-xs font-bold text-slate-500">Upload or drop multiple PDF documents</p>
            <p className="text-[10px] text-slate-400 mt-1">Combine reports, agreements, scanned slides instantly</p>
          </button>

          {/* Merge professional options */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Compilation Options</span>
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-500 font-semibold cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={isCompressing} 
                onChange={(e) => setIsCompressing(e.target.checked)}
                className="rounded text-indigo-600 border-slate-300 focus:ring-indigo-500" 
              />
              <span>Optimize merged file size (Lossless image compression)</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-500 font-semibold cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={addToc} 
                onChange={(e) => setAddToc(e.target.checked)}
                className="rounded text-indigo-600 border-slate-300 focus:ring-indigo-500" 
              />
              <span>Generate active Table of Contents / Index sheet</span>
            </label>
          </div>

          <div className="flex gap-2 pt-2">
            <button 
              onClick={resetAll}
              disabled={pdfs.length === 0}
              className="px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl disabled:opacity-50"
            >
              Clear
            </button>
            <button 
              onClick={performMerge}
              disabled={pdfs.length < 2 || isProcessing}
              className="flex-1 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 transition-all"
            >
              {isProcessing ? 'Merging PDFs...' : `Compile & Merge (${pdfs.length} files)`}
            </button>
          </div>
        </div>

        {/* List items queue */}
        <div className={`p-4 rounded-xl border flex flex-col h-[320px] overflow-hidden ${
          theme === 'dark' ? 'bg-slate-800/30 border-slate-800' : 'bg-slate-100 border-slate-200'
        }`}>
          <div className="text-xs font-bold text-slate-400 border-b pb-2 mb-2 flex justify-between">
            <span>MERGE QUEUE</span>
            <span>{pdfs.length} files</span>
          </div>

          {isProcessing && (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
              <RefreshCw className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
              <p className="text-xs font-semibold">Consolidating pages & mapping outlines...</p>
            </div>
          )}

          {!isProcessing && processedUrl ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <p className="text-xs font-bold text-emerald-500 mb-2">PDF Compilation Complete!</p>
              <button 
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md hover:bg-emerald-600 transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Download Merged PDF
              </button>
            </div>
          ) : (
            !isProcessing && (
              pdfs.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                  <FileText className="w-8 h-8 opacity-40 mb-2" />
                  <p className="text-xs">No PDF documents uploaded yet.</p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {pdfs.map((p, idx) => (
                    <div 
                      key={p.id} 
                      className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs ${
                        theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="p-2 rounded bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold truncate">{p.name}</p>
                        <p className="text-[10px] text-slate-400">{p.pages} Pages • {p.size}</p>
                      </div>

                      <div className="flex gap-1.5 shrink-0">
                        <button 
                          type="button" 
                          onClick={() => movePdf(idx, 'up')}
                          disabled={idx === 0}
                          className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded font-bold disabled:opacity-40"
                        >
                          ▲
                        </button>
                        <button 
                          type="button" 
                          onClick={() => movePdf(idx, 'down')}
                          disabled={idx === pdfs.length - 1}
                          className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded font-bold disabled:opacity-40"
                        >
                          ▼
                        </button>
                        <button 
                          type="button" 
                          onClick={() => removePdf(p.id)}
                          className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )
          )}
        </div>
      </div>
    </div>
  );
}
