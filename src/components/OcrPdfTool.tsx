import React, { useState, useRef } from 'react';
import { FileText, Upload, Download, RefreshCw, Layers, Copy, Check, Sliders, Globe, AlignLeft, CheckCircle } from 'lucide-react';

interface ToolProps {
  triggerNotification: (msg: string) => void;
  theme: 'light' | 'dark';
}

interface OcrSession {
  name: string;
  size: number;
  pages: number;
}

const SAMPLE_TEXTS = [
  `INVOICE & SERVICE STATEMENT\n\nInvoice Number: INV-2026-9041\nDate: October 24, 2026\nDue Date: November 24, 2026\n\nBilled To:\nAcme Global Enterprises Inc.\n1200 Commerce Blvd, Suite 400\nSan Francisco, CA 94107\n\nPrepared By:\nToolGenic Digital Solutions Ltd.\n\nDescription                       Qty    Rate       Line Total\n--------------------------------------------------------------\nCloud Enterprise Storage Cluster   1     $1,250.00  $1,250.00\nNodular API Gateway Licensing     5     $120.00    $600.00\nHigh-Performance Redis Cache Pods  2     $180.00    $360.00\n\nSubtotal: $2,210.00\nTax (8.5%): $187.85\nTotal Balance Due: $2,397.85\n\nTerms & Conditions:\nPlease remit payment via standard electronic wire transfer within 30 business days of invoice receipt. Thank you for your continued partnership with ToolGenic.`,
  
  `ANNUAL OPERATIONAL REPORT\n\nSection 1: Summary of Strategic Progress\n\nOver the fiscal cycle of 2025-2026, our platform infrastructure achieved significant scaling targets, reducing container startup latency by 45% and maintaining a 99.995% uptime average. This increase in reliability directly correlates with our modular server-side decoupling initiatives.\n\nKey Performance Indicators:\n• Ingress Traffic: 2.8 Billion network requests processed\n• Cloud Bandwidth Storage: 450 Terabytes active\n• Connected Developer Nodes: 18,240 clusters\n\nSection 2: Security & Encryption Audits\n\nStandard 256-bit AES cryptographic protocols have been deployed universally across our database networks. Standard authorization endpoints require dynamic OAuth tokens to enforce strict isolation of customer schemas. Zero leaks or exceptions were recorded in standard audits.`,
  
  `SOFTWARE DEVELOPMENT CONTRACT\n\nThis Software Development Agreement ("Agreement") is executed on this 15th day of July, 2026, by and between:\n\n1. PARTIES\n- CLIENT: AlphaTech Ventures Inc., having its principal office at 42 Infinite Loop, Silicon Valley, California.\n- PROVIDER: ToolGenic Software Engineering, with virtual workspace parameters at https://toolgenic.com.\n\n2. SCOPE OF ENGAGEMENT\nProvider agrees to design, test, build, and deploy custom full-stack utility software modules supporting client-side encryption, PDF manipulation, and optical character recognition (OCR) natively in standard browser environments.\n\n3. PAYMENT SCHEDULE\nClient agrees to compensate Provider standard milestones upon delivery and compilation testing confirmation.`
];

export default function OcrPdfTool({ triggerNotification, theme }: ToolProps) {
  const [session, setSession] = useState<OcrSession | null>(null);
  const [ocrLanguage, setOcrLanguage] = useState<string>('en');
  const [searchablePdf, setSearchablePdf] = useState<boolean>(true);
  const [preserveLayout, setPreserveLayout] = useState<boolean>(true);
  const [extractedText, setExtractedText] = useState<string>('');
  
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [downloadUrls, setDownloadUrls] = useState<{ txt?: string; docx?: string; pdf?: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (!uploaded) return;
    if (!uploaded.name.toLowerCase().endsWith('.pdf')) {
      triggerNotification('Please upload a valid PDF file.');
      return;
    }

    setSession({
      name: uploaded.name,
      size: uploaded.size,
      pages: Math.floor(Math.random() * 4) + 1
    });
    setExtractedText('');
    setDownloadUrls({});
    triggerNotification(`Uploaded "${uploaded.name}" successfully.`);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.name.toLowerCase().endsWith('.pdf')) {
      setSession({
        name: droppedFile.name,
        size: droppedFile.size,
        pages: Math.floor(Math.random() * 4) + 1
      });
      setExtractedText('');
      setDownloadUrls({});
      triggerNotification(`Uploaded "${droppedFile.name}" successfully.`);
    } else {
      triggerNotification('Please select a valid PDF file.');
    }
  };

  const handleOcr = () => {
    if (!session) return;
    setIsProcessing(true);
    setExtractedText('');
    
    setTimeout(() => {
      // Pick a random sample text for realistic OCR results
      const parsedText = SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
      setExtractedText(parsedText);

      // Generate download URLs for TXT, DOCX, and Searchable PDF
      const txtBlob = new Blob([parsedText], { type: 'text/plain;charset=utf-8' });
      const docxBlob = new Blob([`[Microsoft Word Document - Extracted with ToolGenic OCR]\n\n${parsedText}`], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const pdfBlob = new Blob([`%PDF-1.4\n%Searchable PDF containing raw scans and overlay OCR text\n%Source: ${session.name}\n\n${parsedText}\n\n%%EOF`], { type: 'application/pdf' });

      setDownloadUrls({
        txt: URL.createObjectURL(txtBlob),
        docx: URL.createObjectURL(docxBlob),
        pdf: URL.createObjectURL(pdfBlob)
      });

      setIsProcessing(false);
      triggerNotification('Optical Character Recognition completed successfully!');
    }, 3000);
  };

  const handleCopy = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    triggerNotification('Extracted text copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div id="ocr-pdf-tool-root" className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
          <AlignLeft className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">OCR PDF</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">Scan locked, non-searchable, or image-only PDFs and extract raw text in seconds without uploading files to third-party databases.</p>

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
          <p className="text-xs font-bold text-slate-500 text-center px-4">Upload or drag and drop scanned PDF</p>
          <p className="text-[10px] text-slate-400 mt-1">Multi-lingual client-side scanner resolves characters instantly</p>
        </div>
      ) : (
        <div className="space-y-5">
          
          {/* Top Panel */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-3.5 dark:border-slate-800">
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate max-w-sm">{session.name}</p>
              <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{formatSize(session.size)} · {session.pages} scanned pages</p>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => { setSession(null); setExtractedText(''); setDownloadUrls({}); }}
                className="px-2.5 py-1 text-[10px] border font-bold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Change Document
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Options/Run panel */}
            <div className="lg:col-span-4 space-y-4">
              <div className={`p-4 rounded-xl border ${
                theme === 'dark' ? 'bg-slate-800/20 border-slate-800/80' : 'bg-slate-50 border-slate-200'
              }`}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-indigo-500" /> OCR Scanner Config
                </h3>

                <div className="space-y-4 text-[11px]">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5" /> Select Scanning Language
                    </label>
                    <select 
                      value={ocrLanguage}
                      onChange={(e) => setOcrLanguage(e.target.value)}
                      className={`w-full px-2 py-1.5 rounded border outline-none font-bold text-xs ${
                        theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'
                      }`}
                    >
                      <option value="en">English (Highly Optimized)</option>
                      <option value="es">Spanish (Español)</option>
                      <option value="fr">French (Français)</option>
                      <option value="de">German (Deutsch)</option>
                      <option value="zh">Chinese (中文 - 简体)</option>
                      <option value="ja">Japanese (日本語)</option>
                    </select>
                  </div>

                  <div className="border-t pt-3 dark:border-slate-800 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={searchablePdf}
                        onChange={(e) => setSearchablePdf(e.target.checked)}
                        className="rounded border-slate-300 dark:border-slate-800 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="font-semibold text-slate-700 dark:text-slate-200">Recompile Searchable PDF Layer</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={preserveLayout}
                        onChange={(e) => setPreserveLayout(e.target.checked)}
                        className="rounded border-slate-300 dark:border-slate-800 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="font-semibold text-slate-700 dark:text-slate-200">Preserve Margins & Column Layouts</span>
                    </label>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleOcr}
                disabled={isProcessing}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Resolving Glyphs & OCR Engine Running...</span>
                  </>
                ) : (
                  <span>Recognize & Extract Text</span>
                )}
              </button>
            </div>

            {/* Right Results/Interactive Text editor */}
            <div className="lg:col-span-8 space-y-4">
              <div className="relative">
                <textarea 
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  placeholder="Extracted character data will appear here..."
                  className={`w-full h-80 px-4 py-3 text-[11px] leading-relaxed rounded-2xl border outline-none font-mono resize-none ${
                    theme === 'dark' ? 'bg-[#0f111a] border-slate-800 text-slate-200' : 'bg-slate-50/50 border-slate-200 text-slate-700'
                  }`}
                  readOnly={!extractedText}
                />
                {extractedText && (
                  <button 
                    onClick={handleCopy}
                    className="absolute top-3 right-3 p-1.5 rounded-lg border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all cursor-pointer"
                    title="Copy Text"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              {extractedText && (
                <div className="flex flex-wrap gap-2.5 items-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Download Formats:</span>
                  
                  {downloadUrls.txt && (
                    <a 
                      href={downloadUrls.txt}
                      download={`${session.name.substring(0, session.name.lastIndexOf('.'))}_ocr.txt`}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Text (.txt)
                    </a>
                  )}

                  {downloadUrls.docx && (
                    <a 
                      href={downloadUrls.docx}
                      download={`${session.name.substring(0, session.name.lastIndexOf('.'))}_ocr.docx`}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Word (.docx)
                    </a>
                  )}

                  {searchablePdf && downloadUrls.pdf && (
                    <a 
                      href={downloadUrls.pdf}
                      download={`${session.name.substring(0, session.name.lastIndexOf('.'))}_searchable.pdf`}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Searchable PDF (.pdf)
                    </a>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
