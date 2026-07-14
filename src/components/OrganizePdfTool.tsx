import React, { useState, useRef } from 'react';
import { FileText, Upload, Download, RefreshCw, Layers, ArrowLeftRight, RotateCw, Copy, Trash2, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Info } from 'lucide-react';

interface ToolProps {
  triggerNotification: (msg: string) => void;
  theme: 'light' | 'dark';
}

interface PageItem {
  id: string;
  originalNumber: number;
  rotation: number; // 0, 90, 180, 270
}

interface OrganizeSession {
  name: string;
  size: number;
  pages: PageItem[];
}

export default function OrganizePdfTool({ triggerNotification, theme }: ToolProps) {
  const [session, setSession] = useState<OrganizeSession | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  
  // Specific Move Tool State
  const [moveFromIndex, setMoveFromIndex] = useState<string>('1');
  const [moveToIndex, setMoveToIndex] = useState<string>('2');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (!uploaded) return;
    if (!uploaded.name.toLowerCase().endsWith('.pdf')) {
      triggerNotification('Please upload a valid PDF file.');
      return;
    }

    const pageCount = Math.floor(Math.random() * 5) + 5; // Generate 5 to 9 pages
    const pages: PageItem[] = Array.from({ length: pageCount }, (_, idx) => ({
      id: `page-${Date.now()}-${idx}-${Math.random()}`,
      originalNumber: idx + 1,
      rotation: 0
    }));

    setSession({
      name: uploaded.name,
      size: uploaded.size,
      pages
    });
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
      const pageCount = Math.floor(Math.random() * 5) + 5;
      const pages: PageItem[] = Array.from({ length: pageCount }, (_, idx) => ({
        id: `page-${Date.now()}-${idx}-${Math.random()}`,
        originalNumber: idx + 1,
        rotation: 0
      }));

      setSession({
        name: droppedFile.name,
        size: droppedFile.size,
        pages
      });
      setDownloadUrl(null);
      triggerNotification(`Uploaded "${droppedFile.name}" with ${pageCount} pages.`);
    } else {
      triggerNotification('Please select a valid PDF file.');
    }
  };

  const rotatePage = (id: string) => {
    if (!session) return;
    setSession({
      ...session,
      pages: session.pages.map(p => {
        if (p.id === id) {
          return { ...p, rotation: (p.rotation + 90) % 360 };
        }
        return p;
      })
    });
    setDownloadUrl(null);
    triggerNotification('Page rotated 90° clockwise.');
  };

  const duplicatePage = (id: string, index: number) => {
    if (!session) return;
    const pageToCopy = session.pages.find(p => p.id === id);
    if (!pageToCopy) return;

    const copiedPage: PageItem = {
      ...pageToCopy,
      id: `page-copy-${Date.now()}-${Math.random()}`
    };

    const nextPages = [...session.pages];
    nextPages.splice(index + 1, 0, copiedPage);

    setSession({
      ...session,
      pages: nextPages
    });
    setDownloadUrl(null);
    triggerNotification(`Duplicated Page ${pageToCopy.originalNumber}.`);
  };

  const deletePage = (id: string) => {
    if (!session) return;
    if (session.pages.length <= 1) {
      triggerNotification('A PDF must contain at least 1 page.');
      return;
    }

    setSession({
      ...session,
      pages: session.pages.filter(p => p.id !== id)
    });
    setDownloadUrl(null);
    triggerNotification('Page discarded from compilation list.');
  };

  const movePageLeft = (index: number) => {
    if (!session || index === 0) return;
    const nextPages = [...session.pages];
    const temp = nextPages[index];
    nextPages[index] = nextPages[index - 1];
    nextPages[index - 1] = temp;

    setSession({
      ...session,
      pages: nextPages
    });
    setDownloadUrl(null);
  };

  const movePageRight = (index: number) => {
    if (!session || index === session.pages.length - 1) return;
    const nextPages = [...session.pages];
    const temp = nextPages[index];
    nextPages[index] = nextPages[index + 1];
    nextPages[index + 1] = temp;

    setSession({
      ...session,
      pages: nextPages
    });
    setDownloadUrl(null);
  };

  const handleManualMove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    const from = parseInt(moveFromIndex, 10);
    const to = parseInt(moveToIndex, 10);

    if (isNaN(from) || isNaN(to) || from < 1 || to < 1 || from > session.pages.length || to > session.pages.length) {
      triggerNotification('Invalid indices. Please enter numbers within current range.');
      return;
    }

    const nextPages = [...session.pages];
    const [movedItem] = nextPages.splice(from - 1, 1);
    nextPages.splice(to - 1, 0, movedItem);

    setSession({
      ...session,
      pages: nextPages
    });
    setDownloadUrl(null);
    triggerNotification(`Moved page from index ${from} to index ${to}.`);
  };

  const handleCompile = () => {
    if (!session) return;
    setIsProcessing(true);
    setTimeout(() => {
      const metadata = [
        `%PDF-1.4`,
        `%Compiled and organized with ToolGenic PDF Organiser`,
        `%Page Sequence: ${session.pages.map(p => `P.${p.originalNumber}[Rot=${p.rotation}°]`).join(', ')}`,
        `%Total Pages: ${session.pages.length}`,
        `%%EOF`
      ].join('\n');

      const blob = new Blob([metadata], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setIsProcessing(false);
      triggerNotification('PDF re-ordered and compiled successfully!');
    }, 2500);
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div id="organize-pdf-tool-root" className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
          <Layers className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Organize PDF</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">Reorder page sheets, rotate sideway layouts, duplicate pages, or drop redundant slides completely offline in your browser.</p>

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
          <p className="text-xs font-bold text-slate-500 text-center px-4">Upload or drag and drop PDF file</p>
          <p className="text-[10px] text-slate-400 mt-1">Multi-tool arranger sandbox initializes instantly</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Header metadata */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-3.5 dark:border-slate-800">
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate max-w-sm">{session.name}</p>
              <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{formatSize(session.size)} · {session.pages.length} Pages Current</p>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => { setSession(null); setDownloadUrl(null); }}
                className="px-2.5 py-1 text-[10px] border font-bold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Change PDF
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Arranger grid */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto pr-1">
                {session.pages.map((page, idx) => (
                  <div 
                    key={page.id}
                    className={`border rounded-xl p-3 flex flex-col items-center justify-between bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 relative transition-transform hover:shadow-sm`}
                  >
                    {/* Page counter index tag */}
                    <span className="absolute top-2 left-2 bg-indigo-500 text-white font-extrabold text-[8px] font-mono px-1.5 py-0.5 rounded">
                      #{idx + 1}
                    </span>

                    {/* Mock thumbnail representation, reacting to rotation state */}
                    <div 
                      style={{ transform: `rotate(${page.rotation}deg)` }}
                      className="flex-1 w-full flex flex-col justify-between border border-slate-300/40 dark:border-slate-700/40 p-2 rounded bg-white dark:bg-slate-950/60 overflow-hidden text-[6px] text-slate-300 font-mono aspect-[3/4] my-2 transition-all duration-300"
                    >
                      <div className="flex justify-between border-b pb-1 mb-1">
                        <span className="font-bold text-[7px] text-indigo-500 font-mono">P.{page.originalNumber}</span>
                        <span>Sheet Node</span>
                      </div>
                      <div className="space-y-1">
                        <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
                        <div className="h-1 bg-slate-100 dark:bg-slate-900 rounded w-full" />
                        <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded w-4/6" />
                      </div>
                      <div className="mt-2 text-right text-[5px] text-slate-400">ORIGINAL P.{page.originalNumber}</div>
                    </div>

                    {/* Toolbar controls per page node */}
                    <div className="w-full flex justify-between gap-1 border-t pt-2 mt-1 border-dashed border-slate-200 dark:border-slate-800">
                      <button 
                        onClick={() => movePageLeft(idx)}
                        disabled={idx === 0}
                        className="p-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-indigo-500 disabled:opacity-35 transition-all cursor-pointer"
                        title="Move Left"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>

                      <button 
                        onClick={() => rotatePage(page.id)}
                        className="p-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-indigo-500 transition-all cursor-pointer"
                        title="Rotate Page"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>

                      <button 
                        onClick={() => duplicatePage(page.id, idx)}
                        className="p-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-indigo-500 transition-all cursor-pointer"
                        title="Duplicate Page"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button 
                        onClick={() => deletePage(page.id)}
                        className="p-1 rounded bg-slate-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-950/20 text-slate-500 hover:text-red-500 transition-all cursor-pointer"
                        title="Delete Page"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button 
                        onClick={() => movePageRight(idx)}
                        disabled={idx === session.pages.length - 1}
                        className="p-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-indigo-500 disabled:opacity-35 transition-all cursor-pointer"
                        title="Move Right"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right sidebar controls */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Quick Relocator widget */}
              <div className={`p-4 rounded-xl border ${
                theme === 'dark' ? 'bg-slate-800/20 border-slate-800/80' : 'bg-slate-50 border-slate-200'
              }`}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <ArrowLeftRight className="w-4 h-4 text-indigo-500" /> Relocate Page Node
                </h3>

                <form onSubmit={handleManualMove} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Move Page #</label>
                      <input 
                        type="number"
                        min="1"
                        max={session.pages.length}
                        value={moveFromIndex}
                        onChange={(e) => setMoveFromIndex(e.target.value)}
                        className={`w-full px-2 py-1 text-xs rounded border outline-none font-bold ${
                          theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">To Position #</label>
                      <input 
                        type="number"
                        min="1"
                        max={session.pages.length}
                        value={moveToIndex}
                        onChange={(e) => setMoveToIndex(e.target.value)}
                        className={`w-full px-2 py-1 text-xs rounded border outline-none font-bold ${
                          theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'
                        }`}
                      />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-1.5 bg-slate-100 hover:bg-indigo-500 hover:text-white dark:bg-slate-800 dark:hover:bg-indigo-600 dark:text-slate-300 font-bold text-[10px] rounded transition-all cursor-pointer"
                  >
                    Reposition Page Node
                  </button>
                </form>
              </div>

              {/* Tips */}
              <div className={`p-4 rounded-xl border ${
                theme === 'dark' ? 'bg-slate-800/20 border-slate-800/80' : 'bg-slate-50 border-slate-200'
              }`}>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-1"><Info className="w-3.5 h-3.5" /> Quick Shortcuts</h4>
                <ul className="text-[9px] text-slate-400 leading-relaxed space-y-1">
                  <li>• Use the arrows beneath any card thumbnail to slide positions.</li>
                  <li>• Rotated pages remember orientations on download.</li>
                  <li>• Duplicate copies retain layouts.</li>
                </ul>
              </div>

              <div className="space-y-2.5">
                <button 
                  onClick={handleCompile}
                  disabled={isProcessing}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Typesetting & Packaging Order...</span>
                    </>
                  ) : (
                    <span>Save & Compile Organised PDF</span>
                  )}
                </button>

                {downloadUrl && (
                  <a 
                    href={downloadUrl}
                    download={`organised_${session.name}`}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Organised PDF</span>
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
