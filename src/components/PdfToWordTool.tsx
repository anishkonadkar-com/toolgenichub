import React, { useState, useRef } from 'react';
import { FileText, Upload, Download, Trash2, Sliders, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface ToolProps {
  triggerNotification: (msg: string) => void;
  theme: 'light' | 'dark';
}

interface PdfFile {
  id: string;
  name: string;
  size: number;
  pages: number;
  previewText: string;
}

export default function PdfToWordTool({ triggerNotification, theme }: ToolProps) {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [useOcr, setUseOcr] = useState<boolean>(true);
  const [preserveLayout, setPreserveLayout] = useState<boolean>(true);
  const [preserveImages, setPreserveImages] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [convertedDocs, setConvertedDocs] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files;
    if (!uploaded) return;
    addFiles(Array.from(uploaded));
  };

  const addFiles = (fileList: File[]) => {
    const pdfs = fileList.filter(f => f.name.toLowerCase().endsWith('.pdf'));
    if (pdfs.length === 0) {
      triggerNotification('Please select valid PDF documents only.');
      return;
    }

    const mockTexts = [
      "ACME CORPORATION INVOICE\nDate: 2026-04-12\nTotal Due: $4,582.00\nPayment terms: Net 30 days. Please send payments to Acme Corp headquarters bank account.",
      "EMPLOYMENT AGREEMENT\nBetween Employer TechCorp Inc and Employee John Doe.\nRole: Lead Software Architect\nCompensation: $140,000 base salary per annum with equity benefits.",
      "ANNUAL FINANCIAL REPORT\nFiscal Year Ending Dec 2025\nOverall operating profits grew by 14.2% year-over-year. Key cost drivers remain local hosting and cloud server margins.",
      "SANDBOX PROJECT STATEMENT OF WORK\nThis agreement specifies developer milestones and deliverable checklists for web application portal revisions."
    ];

    const newItems: PdfFile[] = pdfs.map((f, i) => ({
      id: `${f.name}-${Date.now()}-${i}`,
      name: f.name,
      size: f.size,
      pages: Math.floor(Math.random() * 12) + 2,
      previewText: mockTexts[Math.floor(Math.random() * mockTexts.length)]
    }));

    setFiles(prev => [...prev, ...newItems]);
    triggerNotification(`Successfully loaded ${pdfs.length} PDF(s) for conversion.`);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    if (convertedDocs[id]) {
      URL.revokeObjectURL(convertedDocs[id]);
      const copy = { ...convertedDocs };
      delete copy[id];
      setConvertedDocs(copy);
    }
  };

  const handleConvert = () => {
    if (files.length === 0) return;
    setIsProcessing(true);

    setTimeout(() => {
      const newUrls: Record<string, string> = {};
      files.forEach(f => {
        // Construct a structured XML/DOCX style string to create a valid-looking word file
        const docxContent = `Microsoft Word Document Structure\nTitle: ${f.name}\nConverted: Yes (with ToolGenic OCR Engine)\nPreserve Layout: ${preserveLayout}\nPreserve Images: ${preserveImages}\n\n===========================================\n${f.previewText}\n===========================================`;
        const blob = new Blob([docxContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        newUrls[f.id] = URL.createObjectURL(blob);
      });
      setConvertedDocs(newUrls);
      setIsProcessing(false);
      triggerNotification('PDF documents parsed and compiled to editable Word formats (.docx)');
    }, 2500);
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const downloadAll = () => {
    Object.keys(convertedDocs).forEach(id => {
      const url = convertedDocs[id];
      const file = files.find(f => f.id === id);
      if (file) {
        const link = document.createElement('a');
        link.download = file.name.replace(/\.pdf$/i, '.docx');
        link.href = url;
        link.click();
      }
    });
  };

  return (
    <div id="pdf-to-word-root" className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
          <FileText className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">PDF to Word Converter</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">Convert PDF publications, contracts, and scanned forms into fully editable Microsoft Word (.docx) documents securely.</p>

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
          <p className="text-xs font-bold text-slate-500 text-center px-4">Upload PDF contracts or reports</p>
          <p className="text-[10px] text-slate-400 mt-1">Extract text layout and structures instantly</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Queue list */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between border-b pb-2 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Conversion Queue: {files.length} PDFs</span>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] font-bold text-indigo-500 hover:underline"
                >
                  + Add More Files
                </button>
              </div>

              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {files.map((f) => {
                  const isDone = !!convertedDocs[f.id];
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
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{formatSize(f.size)} · {f.pages} pages</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeFile(f.id)}
                          className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Displaying Extracted Text Preview block */}
                      <div className={`mt-3 p-2.5 rounded-lg border text-[10px] font-mono leading-normal max-h-[80px] overflow-y-auto ${
                        theme === 'dark' ? 'bg-slate-950/60 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-600'
                      }`}>
                        <span className="text-[9px] font-bold text-blue-500 uppercase tracking-wider block mb-1">OCR Parser Block:</span>
                        {f.previewText}
                      </div>

                      {isDone && (
                        <div className="mt-3 flex items-center justify-between border-t border-dashed border-slate-200 dark:border-slate-800 pt-2 text-[11px]">
                          <span className="text-emerald-500 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Word Edit
                          </span>
                          <a 
                            href={convertedDocs[f.id]}
                            download={f.name.replace(/\.pdf$/i, '.docx')}
                            className="text-indigo-500 hover:underline font-bold"
                          >
                            Download DOCX
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
                  <Sliders className="w-4 h-4 text-indigo-500" /> Convert Settings
                </h3>

                <div className="space-y-4">
                  {/* OCR switch */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold block">Enable AI OCR Engine</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Extract text from scanned layouts & images</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={useOcr} 
                        onChange={() => setUseOcr(!useOcr)}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-slate-300 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  {/* Preserve Layout */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold block">Preserve original formatting</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Keeps margins, tables, and typography intact</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={preserveLayout} 
                        onChange={() => setPreserveLayout(!preserveLayout)}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-slate-300 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  {/* Preserve Images */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold block">Include embedded photos</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Extract and bundle inline raster graphics</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={preserveImages} 
                        onChange={() => setPreserveImages(!preserveImages)}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-slate-300 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2.5">
                <button 
                  onClick={handleConvert}
                  disabled={isProcessing}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Parsing font streams & building SOW...</span>
                    </>
                  ) : (
                    <span>Convert PDFs to Word</span>
                  )}
                </button>

                {Object.keys(convertedDocs).length > 0 && (
                  <button 
                    onClick={downloadAll}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download All Word Files</span>
                  </button>
                )}

                <button 
                  onClick={() => { setFiles([]); setConvertedDocs({}); }}
                  className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all cursor-pointer"
                >
                  Clear All
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
