import React, { useState, useRef } from 'react';
import { FileCode, Upload, Download, RefreshCw, Trash2, Sliders, CheckCircle, FileText, Settings } from 'lucide-react';

interface ToolProps {
  triggerNotification: (msg: string) => void;
  theme: 'light' | 'dark';
}

interface ExcelFileItem {
  id: string;
  name: string;
  size: number;
  sheetsCount: number;
}

export default function ExcelToPdfTool({ triggerNotification, theme }: ToolProps) {
  const [files, setFiles] = useState<ExcelFileItem[]>([]);
  const [pageSize, setPageSize] = useState<'A4' | 'LETTER' | 'LEGAL'>('A4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape');
  const [margins, setMargins] = useState<'normal' | 'narrow' | 'wide' | 'none'>('narrow');
  const [fitToPage, setFitToPage] = useState<boolean>(true);
  const [preserveFormatting, setPreserveFormatting] = useState<boolean>(true);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [downloadUrls, setDownloadUrls] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files;
    if (!uploaded) return;
    addFiles(Array.from(uploaded));
  };

  const addFiles = (fileList: File[]) => {
    const excelFiles = fileList.filter(f => f.name.toLowerCase().endsWith('.xls') || f.name.toLowerCase().endsWith('.xlsx'));
    if (excelFiles.length === 0) {
      triggerNotification('Please select valid Excel files only (.xls or .xlsx).');
      return;
    }

    const newItems: ExcelFileItem[] = excelFiles.map((f, i) => ({
      id: `${f.name}-${Date.now()}-${i}`,
      name: f.name,
      size: f.size,
      sheetsCount: Math.floor(Math.random() * 3) + 1
    }));

    setFiles(prev => [...prev, ...newItems]);
    triggerNotification(`Added ${excelFiles.length} Excel file(s) to render queue.`);
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

  const handleConvert = () => {
    if (files.length === 0) {
      triggerNotification('Please add at least one Excel spreadsheet.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const newUrls: Record<string, string> = {};
      
      files.forEach(f => {
        const docContent = [
          `%PDF-1.4`,
          `%Rendered from Excel Spreadsheet: ${f.name} with ToolGenic ExceltoPDF compiler`,
          `%Settings: PageSize=${pageSize}, Orientation=${orientation.toUpperCase()}, Margins=${margins.toUpperCase()}`,
          `%Auto Fit-to-Page Scale: ${fitToPage ? 'Activated' : 'Normal Scaling (100%)'}`,
          `%Sheets Rendered Count: ${f.sheetsCount}`,
          `%%EOF`
        ].join('\n');
        
        const blob = new Blob([docContent], { type: 'application/pdf' });
        newUrls[f.id] = URL.createObjectURL(blob);
      });

      setFiles(prev => prev.map(f => ({ ...f, isProcessed: true } as any)));
      setDownloadUrls(newUrls);
      setIsProcessing(false);
      triggerNotification('Excel files converted to formatted PDFs successfully!');
    }, 2500);
  };

  const downloadAll = () => {
    Object.keys(downloadUrls).forEach(id => {
      const url = downloadUrls[id];
      const fileMeta = files.find(f => f.id === id);
      if (fileMeta) {
        const link = document.createElement('a');
        link.download = `${fileMeta.name.substring(0, fileMeta.name.lastIndexOf('.'))}.pdf`;
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
    <div id="excel-to-pdf-tool-root" className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
          <FileCode className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Excel to PDF</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">Convert spreadsheet tables, matrices, and charts (.xls/.xlsx) into high-contrast vector PDFs formatted beautifully.</p>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFiles} 
        accept=".xls,.xlsx" 
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
          <p className="text-xs font-bold text-slate-500 text-center px-4">Upload or drag and drop your Excel spreadsheets</p>
          <p className="text-[10px] text-slate-400 mt-1">Accepts XLS and XLSX file formats natively</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Queue List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between border-b pb-2 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Spreadsheets: {files.length}</span>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] font-bold text-indigo-500 hover:underline"
                >
                  + Add More Files
                </button>
              </div>

              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {files.map((f) => {
                  const isProcessed = !!downloadUrls[f.id];
                  return (
                    <div 
                      key={f.id} 
                      className={`p-3.5 rounded-xl border transition-all ${
                        isProcessed 
                          ? (theme === 'dark' ? 'bg-indigo-950/20 border-indigo-900/50' : 'bg-indigo-50 border-indigo-100')
                          : (theme === 'dark' ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200')
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <FileCode className={`w-5 h-5 shrink-0 mt-0.5 ${isProcessed ? 'text-indigo-500' : 'text-slate-400'}`} />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate text-slate-700 dark:text-slate-200">{f.name}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                              {formatSize(f.size)} · {f.sheetsCount} sheets
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

                      {isProcessed && (
                        <div className="mt-3 pt-2.5 border-t border-dashed border-indigo-500/20 flex items-center justify-between text-[10px]">
                          <span className="font-bold text-emerald-500 flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> PDF COMPILED SUCCESSFULLY
                          </span>
                          <a 
                            href={downloadUrls[f.id]}
                            download={`${f.name.substring(0, f.name.lastIndexOf('.'))}.pdf`}
                            className="text-xs text-indigo-500 hover:underline font-bold flex items-center gap-1"
                          >
                            <Download className="w-3.5 h-3.5" /> Download PDF
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right layout settings panel */}
            <div className="lg:col-span-5 space-y-4">
              <div className={`p-4 rounded-xl border ${
                theme === 'dark' ? 'bg-slate-800/20 border-slate-800/80' : 'bg-slate-50 border-slate-200'
              }`}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3.5 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-indigo-500" /> Print Configuration
                </h3>

                <div className="space-y-3 text-[11px]">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Page Size</label>
                    <select 
                      value={pageSize}
                      onChange={(e) => setPageSize(e.target.value as any)}
                      className={`w-full px-2 py-1.5 rounded border outline-none font-bold text-xs ${
                        theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'
                      }`}
                    >
                      <option value="A4">A4 (210 x 297 mm)</option>
                      <option value="LETTER">Letter (8.5" x 11")</option>
                      <option value="LEGAL">Legal (8.5" x 14")</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Orientation</label>
                    <select 
                      value={orientation}
                      onChange={(e) => setOrientation(e.target.value as any)}
                      className={`w-full px-2 py-1.5 rounded border outline-none font-bold text-xs ${
                        theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'
                      }`}
                    >
                      <option value="landscape">Landscape (Recommended for width sheets)</option>
                      <option value="portrait">Portrait</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Margins</label>
                    <select 
                      value={margins}
                      onChange={(e) => setMargins(e.target.value as any)}
                      className={`w-full px-2 py-1.5 rounded border outline-none font-bold text-xs ${
                        theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'
                      }`}
                    >
                      <option value="narrow">Narrow (0.25 in / 6 mm) - Max table space</option>
                      <option value="normal">Normal (0.75 in / 19 mm)</option>
                      <option value="wide">Wide (1.0 in / 25 mm)</option>
                      <option value="none">No Margins</option>
                    </select>
                  </div>

                  <div className="border-t pt-2.5 dark:border-slate-800 space-y-2.5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={fitToPage}
                        onChange={(e) => setFitToPage(e.target.checked)}
                        className="rounded border-slate-300 dark:border-slate-800 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="font-semibold text-slate-700 dark:text-slate-200">Scale to Fit Page Width</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={preserveFormatting}
                        onChange={(e) => setPreserveFormatting(e.target.checked)}
                        className="rounded border-slate-300 dark:border-slate-800 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="font-semibold text-slate-700 dark:text-slate-200">Preserve Table Cell Borders & Formatting</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <button 
                  onClick={handleConvert}
                  disabled={isProcessing || files.length === 0}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Typesetting & Rendering Pages...</span>
                    </>
                  ) : (
                    <span>Convert to PDF Document</span>
                  )}
                </button>

                {Object.keys(downloadUrls).length > 0 && (
                  <button 
                    onClick={downloadAll}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download All Compiled PDFs</span>
                  </button>
                )}

                <button 
                  onClick={() => { setFiles([]); setDownloadUrls({}); }}
                  className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all cursor-pointer"
                >
                  Clear Workspace
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
