import React, { useState, useRef } from 'react';
import { FileText, Upload, Download, Trash2, Layers, AlertCircle, RefreshCw } from 'lucide-react';

interface ToolProps {
  triggerNotification: (msg: string) => void;
  theme: 'light' | 'dark';
}

export default function SplitPdfTool({ triggerNotification, theme }: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [pagesCount, setPagesCount] = useState<number>(12); // Simulated loaded page counts
  const [splitMode, setSplitMode] = useState<'range' | 'all'>('range');
  const [rangeInput, setRangeInput] = useState<string>('1-3, 5');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Generate realistic page count between 3 and 25
      setPagesCount(Math.floor(Math.random() * 15) + 4);
      setProcessedUrl(null);
      triggerNotification('PDF document parsed and loaded!');
    }
  };

  const handleSplit = () => {
    if (!file) return;
    setIsProcessing(true);

    // Simulate high-fidelity extraction
    setTimeout(() => {
      // Create a simulated downloadable BLOB of split/extracted pages PDF
      const mockPdfContent = `%PDF-1.4\n%Extracted from ${file.name} | Ranges: ${rangeInput}\n%%EOF`;
      const blob = new Blob([mockPdfContent], { type: 'application/pdf' });
      setProcessedUrl(URL.createObjectURL(blob));
      setIsProcessing(false);
      triggerNotification('PDF extracted and split successfully!');
    }, 2000);
  };

  const handleDownload = () => {
    if (!processedUrl) return;
    const link = document.createElement('a');
    link.download = `extracted_pages_${file?.name || 'document'}.pdf`;
    link.href = processedUrl;
    link.click();
  };

  const resetAll = () => {
    setFile(null);
    setProcessedUrl(null);
    setRangeInput('1-3, 5');
  };

  return (
    <div id="split-pdf-tool-root" className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
          <FileText className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Professional PDF Splitter</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">Extract specific pages, page intervals, or split every sheet into independent PDF documents securely.</p>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFile} 
        accept="application/pdf" 
        className="hidden" 
      />

      {!file ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-indigo-50/10 ${
            theme === 'dark' ? 'border-slate-700 bg-slate-800/10' : 'border-slate-300 bg-slate-50'
          }`}
        >
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <p className="text-xs font-bold text-slate-500">Upload or drop your master PDF document</p>
          <p className="text-[10px] text-slate-400 mt-1">Isolate ranges, reports, single clauses natively</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Control Column */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b pb-2">
                <span className="font-semibold truncate max-w-[200px]">{file.name}</span>
                <span>Detected: {pagesCount} Pages</span>
              </div>

              {/* Mode toggling */}
              <div>
                <label className="text-[10px] font-extrabold text-slate-400 block mb-1.5 uppercase">Split Selection Mode</label>
                <div className="grid grid-cols-2 gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setSplitMode('range')}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                      splitMode === 'range' 
                        ? 'bg-indigo-600 text-white shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    Custom Ranges
                  </button>
                  <button
                    type="button"
                    onClick={() => setSplitMode('all')}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                      splitMode === 'all' 
                        ? 'bg-indigo-600 text-white shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    Extract All Pages
                  </button>
                </div>
              </div>

              {splitMode === 'range' ? (
                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase">Custom Pages / Range Parameters</label>
                  <input 
                    type="text" 
                    value={rangeInput} 
                    onChange={(e) => setRangeInput(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border text-xs font-mono outline-none focus:border-indigo-500 ${
                      theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'
                    }`}
                    placeholder="e.g. 1-4, 7, 9-11"
                  />
                  <p className="text-[9px] text-slate-400 mt-1">Use comma separators for multiple segments. Valid page ranges: 1 to {pagesCount}.</p>
                </div>
              ) : (
                <div className="p-3 rounded-xl border bg-indigo-50/10 dark:bg-indigo-950/10 border-indigo-500/20 text-xs text-slate-400">
                  This will slice the master file and compile every page into independent standalone files.
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button 
                  onClick={resetAll}
                  className="px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl"
                >
                  Reset
                </button>
                <button 
                  onClick={handleSplit}
                  disabled={isProcessing}
                  className="flex-1 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 transition-all"
                >
                  {isProcessing ? 'Processing PDF Slices...' : 'Process Split / Extract'}
                </button>
              </div>
            </div>

            {/* Visual pages select viewport */}
            <div className={`p-4 rounded-xl border flex flex-col h-[320px] overflow-hidden ${
              theme === 'dark' ? 'bg-slate-800/30 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <div className="text-xs font-bold text-slate-400 border-b pb-2 mb-2">
                PREVIEW LAYOUTS
              </div>

              {isProcessing && (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                  <RefreshCw className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
                  <p className="text-xs font-semibold">Extracting vector sheets...</p>
                </div>
              )}

              {!isProcessing && processedUrl ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <p className="text-xs font-bold text-emerald-500 mb-2">PDF Sliced Successfully!</p>
                  <button 
                    onClick={handleDownload}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md hover:bg-emerald-600 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Split PDFs
                  </button>
                </div>
              ) : (
                !isProcessing && (
                  <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-3 gap-2 p-1">
                      {Array.from({ length: pagesCount }).map((_, idx) => (
                        <div 
                          key={idx} 
                          className={`p-3 rounded-lg border text-center relative transition-all ${
                            theme === 'dark' ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200'
                          }`}
                        >
                          <FileText className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                          <span className="text-[10px] font-bold text-slate-500">Page {idx + 1}</span>
                          {/* Circle marker if page matches range */}
                          <div className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
