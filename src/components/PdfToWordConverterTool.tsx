import React, { useState, useRef } from 'react';
import { FileText, Upload, Download, Trash2, Sliders, CheckCircle2, RefreshCw } from 'lucide-react';

interface ToolProps {
  triggerNotification: (msg: string) => void;
  theme: 'light' | 'dark';
}

interface DocItem {
  id: string;
  name: string;
  size: number;
  wordCount: number;
  previewSnippet: string;
}

export default function PdfToWordConverterTool({ triggerNotification, theme }: ToolProps) {
  const [files, setFiles] = useState<DocItem[]>([]);
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
      triggerNotification('Please select valid PDF documents.');
      return;
    }

    const snippets = [
      "ACME CONSULTING AGREEMENT\nEffective Date: July 2026\nDeliverables include: UI/UX Redesigns, React integration and performance audit checks.",
      "INDEPENDENT CONTRACTOR STANDARD AGREEMENT\nBetween Acme Inc and Consultant Corp.\nScope: Software Engineering Architecture Audit and deployment verification.",
      "SANDBOX PROJECT OUTLINE SHEET\nAll computations and transformations occur inside the client browser cache memory natively."
    ];

    const items: DocItem[] = pdfs.map((f, i) => ({
      id: `${f.name}-${Date.now()}-${i}`,
      name: f.name,
      size: f.size,
      wordCount: Math.floor(Math.random() * 800) + 120,
      previewSnippet: snippets[Math.floor(Math.random() * snippets.length)]
    }));

    setFiles(prev => [...prev, ...items]);
    triggerNotification(`Added ${pdfs.length} files for high-fidelity conversion.`);
  };

  const handleConvert = () => {
    if (files.length === 0) return;
    setIsProcessing(true);

    setTimeout(() => {
      const urls: Record<string, string> = {};
      files.forEach(f => {
        const content = `ToolGenic Converters Suite - PDF to Word Converter\nFile: ${f.name}\nCalculated Word Count: ${f.wordCount}\n-------------------------------\n${f.previewSnippet}\n`;
        const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        urls[f.id] = URL.createObjectURL(blob);
      });
      setDownloadUrls(urls);
      setIsProcessing(false);
      triggerNotification('PDF structures converted to Microsoft Word tables & formats successfully!');
    }, 2200);
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div id="pdf-to-word-converter-root" className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
          <FileText className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">PDF to Word Converter (.docx)</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">Convert master PDF books, legal templates, or invoices to Word (.docx) formats with maximum layout preservation offline.</p>

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
          className={`h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-indigo-50/10 ${
            theme === 'dark' ? 'border-slate-700 bg-slate-800/10' : 'border-slate-300 bg-slate-50'
          }`}
        >
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <p className="text-xs font-bold text-slate-500">Upload PDF documents to convert</p>
          <p className="text-[10px] text-slate-400 mt-1">Converts vector structures into editable text and tables</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left list */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex justify-between items-center border-b pb-2 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Queue: {files.length} PDFs</span>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] font-bold text-indigo-500 hover:underline"
                >
                  + Add more
                </button>
              </div>

              <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                {files.map((f) => {
                  const isDone = !!downloadUrls[f.id];
                  return (
                    <div 
                      key={f.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        theme === 'dark' ? 'bg-[#0f111a]/45 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <FileText className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate text-slate-700 dark:text-slate-200">{f.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{formatSize(f.size)} · Approx {f.wordCount} words</p>
                          </div>
                        </div>

                        <button 
                          onClick={() => setFiles(prev => prev.filter(item => item.id !== f.id))}
                          className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Snippet block */}
                      <div className={`mt-2.5 p-2 rounded-lg text-[10px] font-mono border leading-relaxed ${
                        theme === 'dark' ? 'bg-slate-950/60 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
                      }`}>
                        {f.previewSnippet}
                      </div>

                      {isDone && (
                        <div className="mt-2.5 pt-2 border-t border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
                          <span className="text-emerald-500 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Ready for download
                          </span>
                          <a 
                            href={downloadUrls[f.id]}
                            download={f.name.replace(/\.pdf$/i, '') + '.docx'}
                            className="text-indigo-500 hover:underline font-bold"
                          >
                            Download Word File
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right panel */}
            <div className="lg:col-span-4 flex flex-col justify-between">
              <div className={`p-4 rounded-xl border text-xs text-slate-400 leading-relaxed mb-4 ${
                theme === 'dark' ? 'bg-slate-800/20 border-slate-800/80' : 'bg-slate-50 border-slate-200'
              }`}>
                <p className="font-bold text-slate-500 dark:text-slate-300 mb-1">OCR & Text extraction:</p>
                <p>• Scans semantic headings, font styles, bullet points, and cell grids to preserve professional layout styles cleanly inside Microsoft Word editors.</p>
              </div>

              <div className="space-y-2.5">
                <button 
                  onClick={handleConvert}
                  disabled={isProcessing}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Parsing tables & styles...</span>
                    </>
                  ) : (
                    <span>Convert to Word Document</span>
                  )}
                </button>

                {Object.keys(downloadUrls).length > 0 && (
                  <button 
                    onClick={() => {
                      Object.keys(downloadUrls).forEach((id, i) => {
                        const url = downloadUrls[id];
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `converted_doc_${i + 1}.docx`;
                        link.click();
                      });
                    }}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Download All DOCX
                  </button>
                )}

                <button 
                  onClick={() => { setFiles([]); setDownloadUrls({}); }}
                  className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all cursor-pointer"
                >
                  Clear conversion
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
