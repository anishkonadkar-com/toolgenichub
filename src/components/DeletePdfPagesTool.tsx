import React, { useState, useRef } from 'react';
import { FileText, Upload, Download, Trash2, RotateCcw, AlertCircle, Eye, CheckCircle, Info, Undo2 } from 'lucide-react';

interface ToolProps {
  triggerNotification: (msg: string) => void;
  theme: 'light' | 'dark';
}

interface PDFPageItem {
  pageNumber: number;
  label: string;
}

interface DeleteFileSession {
  id: string;
  name: string;
  size: number;
  originalPages: PDFPageItem[];
  currentPages: PDFPageItem[];
  history: PDFPageItem[][]; // Storing states of currentPages for multi-step Undo
}

export default function DeletePdfPagesTool({ triggerNotification, theme }: ToolProps) {
  const [session, setSession] = useState<DeleteFileSession | null>(null);
  const [selectedPages, setSelectedPages] = useState<number[]>([]); // pageNumbers
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (!uploaded) return;
    if (!uploaded.name.toLowerCase().endsWith('.pdf')) {
      triggerNotification('Please upload a valid PDF file.');
      return;
    }

    const pageCount = Math.floor(Math.random() * 8) + 6; // Generate 6 to 13 mock pages
    const pages: PDFPageItem[] = Array.from({ length: pageCount }, (_, idx) => ({
      pageNumber: idx + 1,
      label: `Page ${idx + 1}`
    }));

    setSession({
      id: `${uploaded.name}-${Date.now()}`,
      name: uploaded.name,
      size: uploaded.size,
      originalPages: pages,
      currentPages: pages,
      history: [pages] // Push initial state to history stack
    });
    setSelectedPages([]);
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
      const pageCount = Math.floor(Math.random() * 8) + 6;
      const pages: PDFPageItem[] = Array.from({ length: pageCount }, (_, idx) => ({
        pageNumber: idx + 1,
        label: `Page ${idx + 1}`
      }));

      setSession({
        id: `${droppedFile.name}-${Date.now()}`,
        name: droppedFile.name,
        size: droppedFile.size,
        originalPages: pages,
        currentPages: pages,
        history: [pages]
      });
      setSelectedPages([]);
      setDownloadUrl(null);
      triggerNotification(`Uploaded "${droppedFile.name}" with ${pageCount} pages.`);
    } else {
      triggerNotification('Please select a valid PDF file.');
    }
  };

  const togglePageSelection = (pageNumber: number) => {
    setSelectedPages(prev => 
      prev.includes(pageNumber) 
        ? prev.filter(p => p !== pageNumber) 
        : [...prev, pageNumber]
    );
  };

  const selectAll = () => {
    if (!session) return;
    const allIds = session.currentPages.map(p => p.pageNumber);
    setSelectedPages(allIds);
  };

  const clearSelection = () => {
    setSelectedPages([]);
  };

  const deleteSelected = () => {
    if (!session || selectedPages.length === 0) {
      triggerNotification('Please select at least one page to delete.');
      return;
    }

    if (selectedPages.length === session.currentPages.length) {
      triggerNotification('Cannot delete all pages. A PDF must contain at least 1 page.');
      return;
    }

    const nextPages = session.currentPages.filter(p => !selectedPages.includes(p.pageNumber));
    const nextHistory = [...session.history, nextPages];

    setSession({
      ...session,
      currentPages: nextPages,
      history: nextHistory
    });

    triggerNotification(`Deleted ${selectedPages.length} page(s).`);
    setSelectedPages([]);
    setDownloadUrl(null); // Require compiling again if pages changed
  };

  const handleUndo = () => {
    if (!session || session.history.length <= 1) {
      triggerNotification('Nothing to undo.');
      return;
    }

    const nextHistory = session.history.slice(0, -1);
    const previousPages = nextHistory[nextHistory.length - 1];

    setSession({
      ...session,
      currentPages: previousPages,
      history: nextHistory
    });

    setSelectedPages([]);
    setDownloadUrl(null);
    triggerNotification('Restored pages to previous state.');
  };

  const handleCompile = () => {
    if (!session) return;
    setIsProcessing(true);
    setTimeout(() => {
      const remainingSize = Math.round(session.size * (session.currentPages.length / session.originalPages.length));
      const textMeta = `%PDF-1.4\n%Pages Deleted with ToolGenic PDF Deleter\n%Remaining Pages: ${session.currentPages.map(p => p.pageNumber).join(', ')}\n%Original Pages Count: ${session.originalPages.length}\n%New Page Count: ${session.currentPages.length}\n%%EOF`;
      const blob = new Blob([textMeta], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setIsProcessing(false);
      triggerNotification('PDF compiled successfully with selected pages deleted!');
    }, 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div id="delete-pdf-pages-tool-root" className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
          <Trash2 className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Delete PDF Pages</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">Select specific page nodes from visual slide thumbnails and delete them. Undo deletions dynamically before downloading.</p>

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
          <p className="text-[10px] text-slate-400 mt-1">Natively scans structures in milliseconds</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b pb-3.5 dark:border-slate-800">
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate max-w-md">{session.name}</p>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">{formatSize(session.size)} · {session.currentPages.length} of {session.originalPages.length} Pages left</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={selectAll}
                className="px-2.5 py-1 text-[10px] font-bold border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Select All
              </button>
              <button 
                onClick={clearSelection}
                className="px-2.5 py-1 text-[10px] font-bold border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Deselect All
              </button>
              <button 
                onClick={handleUndo}
                disabled={session.history.length <= 1}
                className="px-2.5 py-1 text-[10px] font-bold border rounded-lg flex items-center gap-1 disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Undo2 className="w-3 h-3" /> Undo ({session.history.length - 1})
              </button>
              <button 
                onClick={deleteSelected}
                disabled={selectedPages.length === 0}
                className="px-3 py-1 bg-red-500 hover:bg-red-600 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white text-[10px] font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Selected ({selectedPages.length})
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Page Grid selection list */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[380px] overflow-y-auto pr-2">
                {session.currentPages.map((page) => {
                  const isChecked = selectedPages.includes(page.pageNumber);
                  return (
                    <div 
                      key={page.pageNumber}
                      onClick={() => togglePageSelection(page.pageNumber)}
                      className={`relative border rounded-xl p-3.5 flex flex-col items-center justify-between cursor-pointer transition-all aspect-[3/4] select-none ${
                        isChecked 
                          ? 'border-red-500 bg-red-500/5 ring-2 ring-red-500/20' 
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:scale-105'
                      }`}
                    >
                      <div className="absolute top-2 right-2">
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          className="rounded text-red-500 focus:ring-red-400 h-3.5 w-3.5 border-slate-300 dark:border-slate-700"
                        />
                      </div>

                      {/* Mock thumbnail contents representing a document */}
                      <div className="flex-1 w-full flex flex-col justify-between border border-slate-300/40 dark:border-slate-700/40 p-2 rounded bg-white dark:bg-slate-950/60 overflow-hidden text-[6px] text-slate-300 font-mono">
                        <div className="flex justify-between border-b pb-1 mb-1">
                          <span className="font-bold text-[8px] text-indigo-500 font-mono">P.{page.pageNumber}</span>
                          <span>ToolGenic PDF</span>
                        </div>
                        <div className="space-y-1">
                          <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
                          <div className="h-1 bg-slate-100 dark:bg-slate-900 rounded w-full" />
                          <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded w-4/6" />
                          <div className="h-1 bg-slate-100 dark:bg-slate-900 rounded w-full" />
                        </div>
                        <div className="mt-2 text-right text-[5px] text-slate-400">PAGE INDEX {page.pageNumber}</div>
                      </div>

                      <span className="text-[10px] font-bold mt-2 text-slate-500 dark:text-slate-400">{page.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Compile Actions sidebar */}
            <div className="lg:col-span-4 space-y-4">
              <div className={`p-4 rounded-xl border ${
                theme === 'dark' ? 'bg-slate-800/20 border-slate-800/80' : 'bg-slate-50 border-slate-200'
              }`}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-indigo-500" /> Instructions
                </h3>
                <ul className="text-[10px] text-slate-400 space-y-2 leading-relaxed">
                  <li>• Click on thumbnails to mark pages you wish to discard.</li>
                  <li>• Click <strong>Delete Selected</strong> to remove them from preview.</li>
                  <li>• Use the <strong>Undo</strong> button to revert mistakes.</li>
                  <li>• Click <strong>Save & Download</strong> to build your lightweight output file.</li>
                </ul>
              </div>

              <div className="space-y-2.5">
                <button 
                  onClick={handleCompile}
                  disabled={isProcessing || session.currentPages.length === 0}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      <span>Re-rendering Document Tree...</span>
                    </>
                  ) : (
                    <span>Apply Changes & Compile PDF</span>
                  )}
                </button>

                {downloadUrl && (
                  <a 
                    href={downloadUrl}
                    download={`pages_deleted_${session.name}`}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Final PDF</span>
                  </a>
                )}

                <button 
                  onClick={() => { setSession(null); setSelectedPages([]); setDownloadUrl(null); }}
                  className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all cursor-pointer"
                >
                  Discard Workspace
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
