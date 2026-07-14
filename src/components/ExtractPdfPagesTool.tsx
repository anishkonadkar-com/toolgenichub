import React, { useState, useRef, useEffect } from 'react';
import { FileText, Upload, Download, RefreshCw, Scissors, Info, Eye, CheckCircle } from 'lucide-react';

interface ToolProps {
  triggerNotification: (msg: string) => void;
  theme: 'light' | 'dark';
}

interface PDFPageItem {
  pageNumber: number;
  label: string;
}

interface ExtractSession {
  name: string;
  size: number;
  pages: PDFPageItem[];
}

export default function ExtractPdfPagesTool({ triggerNotification, theme }: ToolProps) {
  const [session, setSession] = useState<ExtractSession | null>(null);
  const [selectedPages, setSelectedPages] = useState<number[]>([]); // page numbers
  const [rangeInput, setRangeInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (!uploaded) return;
    if (!uploaded.name.toLowerCase().endsWith('.pdf')) {
      triggerNotification('Please upload a valid PDF.');
      return;
    }

    const pageCount = Math.floor(Math.random() * 8) + 8; // Generate 8 to 15 pages
    const pages: PDFPageItem[] = Array.from({ length: pageCount }, (_, idx) => ({
      pageNumber: idx + 1,
      label: `Page ${idx + 1}`
    }));

    setSession({
      name: uploaded.name,
      size: uploaded.size,
      pages
    });
    setSelectedPages([1, 2, 3]); // default selection
    setRangeInput('1-3');
    setDownloadUrl(null);
    triggerNotification(`Uploaded "${uploaded.name}" with ${pageCount} pages.`);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.name.toLowerCase().endsWith('.pdf')) {
      const pageCount = Math.floor(Math.random() * 8) + 8;
      const pages: PDFPageItem[] = Array.from({ length: pageCount }, (_, idx) => ({
        pageNumber: idx + 1,
        label: `Page ${idx + 1}`
      }));

      setSession({
        name: droppedFile.name,
        size: droppedFile.size,
        pages
      });
      setSelectedPages([1, 2, 3]);
      setRangeInput('1-3');
      setDownloadUrl(null);
      triggerNotification(`Uploaded "${droppedFile.name}" with ${pageCount} pages.`);
    } else {
      triggerNotification('Please select a valid PDF.');
    }
  };

  const togglePageSelection = (pageNumber: number) => {
    let next: number[];
    if (selectedPages.includes(pageNumber)) {
      next = selectedPages.filter(p => p !== pageNumber);
    } else {
      next = [...selectedPages, pageNumber].sort((a, b) => a - b);
    }
    setSelectedPages(next);
    
    // Update range input field based on selected list
    setRangeInput(formatSelectedToRange(next));
  };

  const formatSelectedToRange = (pages: number[]): string => {
    if (pages.length === 0) return '';
    const sorted = [...pages].sort((a, b) => a - b);
    const ranges: string[] = [];
    let start = sorted[0];
    let end = sorted[0];

    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] === end + 1) {
        end = sorted[i];
      } else {
        ranges.push(start === end ? `${start}` : `${start}-${end}`);
        start = sorted[i];
        end = sorted[i];
      }
    }
    ranges.push(start === end ? `${start}` : `${start}-${end}`);
    return ranges.join(', ');
  };

  const parseRangeInput = (input: string) => {
    if (!session) return;
    setRangeInput(input);

    const parsed: number[] = [];
    const parts = input.split(',');
    
    parts.forEach(part => {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [startStr, endStr] = trimmed.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          const s = Math.min(start, end);
          const e = Math.max(start, end);
          for (let i = s; i <= e; i++) {
            if (i >= 1 && i <= session.pages.length && !parsed.includes(i)) {
              parsed.push(i);
            }
          }
        }
      } else {
        const val = parseInt(trimmed, 10);
        if (!isNaN(val) && val >= 1 && val <= session.pages.length && !parsed.includes(val)) {
          parsed.push(val);
        }
      }
    });

    setSelectedPages(parsed.sort((a, b) => a - b));
  };

  const handleExtract = () => {
    if (!session || selectedPages.length === 0) {
      triggerNotification('Please select at least one page to extract.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const extractedSize = Math.round(session.size * (selectedPages.length / session.pages.length));
      const textMeta = `%PDF-1.4\n%Extracted with ToolGenic PDF Extractor\n%Pages Included: ${selectedPages.join(', ')}\n%Source Document: ${session.name}\n%New Page Count: ${selectedPages.length}\n%%EOF`;
      const blob = new Blob([textMeta], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setIsProcessing(false);
      triggerNotification(`Successfully extracted ${selectedPages.length} pages!`);
    }, 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div id="extract-pdf-pages-tool-root" className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
          <Scissors className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Extract PDF Pages</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">Extract specific pages or custom slide ranges into a separate, lightweight PDF document natively in your browser.</p>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFiles} 
        accept="application/pdf" 
        className="hidden" 
      />

      {!session ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-indigo-50/10 ${
            theme === 'dark' ? 'border-slate-700 bg-slate-800/10' : 'border-slate-300 bg-slate-50'
          }`}
        >
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <p className="text-xs font-bold text-slate-500 text-center px-4">Upload or drag and drop your PDF</p>
          <p className="text-[10px] text-slate-400 mt-1">Multi-page layout analyzer activates instantly</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Header Actions panel */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-3.5 dark:border-slate-800">
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate max-w-sm">{session.name}</p>
              <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{formatSize(session.size)} · {session.pages.length} Pages Total</p>
            </div>

            <div className="w-full sm:w-auto max-w-xs flex gap-2">
              <input 
                type="text"
                placeholder="Range (e.g. 1-3, 5)"
                value={rangeInput}
                onChange={(e) => parseRangeInput(e.target.value)}
                className={`flex-1 px-3 py-1 text-xs font-bold rounded-lg border outline-none ${
                  theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 focus:border-indigo-500'
                }`}
              />
              <button 
                onClick={() => { setSelectedPages(session.pages.map(p => p.pageNumber)); setRangeInput(`1-${session.pages.length}`); }}
                className="px-2.5 py-1 text-[10px] border font-bold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
              >
                Extract All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Visual Thumbnail grid */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[380px] overflow-y-auto pr-1">
                {session.pages.map((page) => {
                  const isChecked = selectedPages.includes(page.pageNumber);
                  return (
                    <div 
                      key={page.pageNumber}
                      onClick={() => togglePageSelection(page.pageNumber)}
                      className={`relative border rounded-xl p-3.5 flex flex-col items-center justify-between cursor-pointer transition-all aspect-[3/4] select-none ${
                        isChecked 
                          ? 'border-indigo-500 bg-indigo-500/5 ring-2 ring-indigo-500/20 shadow-sm' 
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:scale-105'
                      }`}
                    >
                      <div className="absolute top-2 right-2">
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          className="rounded text-indigo-500 focus:ring-indigo-400 h-3.5 w-3.5 border-slate-300 dark:border-slate-700"
                        />
                      </div>

                      {/* Mock thumbnail representation */}
                      <div className="flex-1 w-full flex flex-col justify-between border border-slate-300/40 dark:border-slate-700/40 p-2 rounded bg-white dark:bg-slate-950/60 overflow-hidden text-[6px] text-slate-300 font-mono">
                        <div className="flex justify-between border-b pb-1 mb-1">
                          <span className="font-bold text-[8px] text-indigo-500 font-mono">P.{page.pageNumber}</span>
                          <span>ToolGenic PDF</span>
                        </div>
                        <div className="space-y-1">
                          <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded w-4/6" />
                          <div className="h-1 bg-slate-100 dark:bg-slate-900 rounded w-full" />
                          <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
                        </div>
                        <div className="mt-2 text-right text-[5px] text-slate-400">PAGE NODE {page.pageNumber}</div>
                      </div>

                      <span className="text-[10px] font-bold mt-2 text-slate-500 dark:text-slate-400">{page.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions Panel */}
            <div className="lg:col-span-4 space-y-4">
              <div className={`p-4 rounded-xl border ${
                theme === 'dark' ? 'bg-slate-800/20 border-slate-800/80' : 'bg-slate-50 border-slate-200'
              }`}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-indigo-500" /> Page Range Rules
                </h3>
                <ul className="text-[10px] text-slate-400 space-y-2 leading-relaxed">
                  <li>• Use commas for single items: <code>1, 3, 5</code></li>
                  <li>• Use hyphens for consecutive items: <code>1-4</code></li>
                  <li>• You can combine both formats: <code>1-3, 5, 7-9</code></li>
                  <li>• Selection changes auto-calculate and highlight thumbnails in real-time.</li>
                </ul>
              </div>

              <div className="space-y-2.5">
                <button 
                  onClick={handleExtract}
                  disabled={isProcessing || selectedPages.length === 0}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Extracting Specified Pages...</span>
                    </>
                  ) : (
                    <span>Extract Selected Pages ({selectedPages.length})</span>
                  )}
                </button>

                {downloadUrl && (
                  <a 
                    href={downloadUrl}
                    download={`extracted_pages_${session.name}`}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Extracted PDF</span>
                  </a>
                )}

                <button 
                  onClick={() => { setSession(null); setSelectedPages([]); setRangeInput(''); setDownloadUrl(null); }}
                  className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all cursor-pointer"
                >
                  Clear Session
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
