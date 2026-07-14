import React, { useState, useRef } from 'react';
import { FileText, Upload, Download, Trash2, ArrowRight, Sliders, ChevronRight } from 'lucide-react';

interface ToolProps {
  triggerNotification: (msg: string) => void;
  theme: 'light' | 'dark';
}

interface ImageItem {
  id: string;
  name: string;
  url: string;
  size: string;
}

export default function ImageToPdfTool({ triggerNotification, theme }: ToolProps) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<'A4' | 'Letter'>('A4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [margin, setMargin] = useState<'none' | 'small' | 'large'>('small');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newItems: ImageItem[] = [];
    (Array.from(files) as File[]).forEach((f) => {
      const url = URL.createObjectURL(f);
      const kbSize = (f.size / 1024).toFixed(1);
      newItems.push({
        id: Math.random().toString(36).substr(2, 9),
        name: f.name,
        url: url,
        size: `${kbSize} KB`
      });
    });

    setImages((prev) => [...prev, ...newItems]);
    triggerNotification(`Added ${newItems.length} images to compile list`);
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    triggerNotification('Image removed');
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === images.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newList = [...images];
    const temp = newList[index];
    newList[index] = newList[targetIndex];
    newList[targetIndex] = temp;
    setImages(newList);
  };

  // Compile layout sheets into a native Print document viewport for the browser's "Save to PDF"
  const handleCompile = () => {
    if (images.length === 0) return;
    setIsProcessing(true);

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      triggerNotification('Please allow popups to compile and download PDF documents.');
      setIsProcessing(false);
      return;
    }

    const marginStyles = {
      none: '0px',
      small: '15px',
      large: '40px'
    };

    // Construct a beautiful print sheet page matching exactly standard dimensions
    const pageW = pageSize === 'A4' ? '210mm' : '8.5in';
    const pageH = pageSize === 'A4' ? '297mm' : '11in';

    printWindow.document.write(`
      <html>
        <head>
          <title>ToolGenic_Compiled_Document</title>
          <style>
            @page {
              size: ${pageSize === 'A4' ? 'A4' : 'letter'} ${orientation};
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              background-color: #ffffff;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }
            .pdf-page {
              width: ${orientation === 'portrait' ? pageW : pageH};
              height: ${orientation === 'portrait' ? pageH : pageW};
              box-sizing: border-box;
              padding: ${marginStyles[margin]};
              page-break-after: always;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
            }
            .pdf-page img {
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
            }
            @media print {
              .no-print { display: none; }
              .pdf-page { page-break-after: always; }
            }
            .print-header {
              background-color: #f8fafc;
              padding: 20px;
              border-bottom: 1px solid #e2e8f0;
              text-align: center;
            }
            .print-btn {
              background-color: #2563eb;
              color: white;
              border: none;
              padding: 12px 24px;
              font-weight: bold;
              border-radius: 8px;
              font-size: 14px;
              cursor: pointer;
              margin-top: 10px;
              box-shadow: 0 4px 6px rgba(37,99,235,0.2);
            }
          </style>
        </head>
        <body>
          <div class="print-header no-print">
            <h2 style="margin:0 0 8px 0; color:#1e293b;">Your Compiled PDF is Ready!</h2>
            <p style="margin:0 0 15px 0; font-size:13px; color:#64748b;">Click the button below and choose <strong>"Save as PDF"</strong> under Destination.</p>
            <button class="print-btn" onclick="window.print()">Print or Save as PDF</button>
          </div>
          ${images.map((img) => `
            <div class="pdf-page">
              <img src="${img.url}" />
            </div>
          `).join('')}
        </body>
      </html>
    `);

    printWindow.document.close();
    setIsProcessing(false);
    triggerNotification('PDF sheets compilation successful!');
  };

  const resetAll = () => {
    setImages([]);
  };

  return (
    <div id="img-to-pdf-tool-root" className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
          <FileText className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Image to PDF Compiler</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">Convert individual pages or batch groups of PNG, JPG and WebP photos into a beautiful unified PDF.</p>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFiles} 
        accept="image/*" 
        multiple 
        className="hidden" 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Settings Column */}
        <div className="space-y-4">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50/10 transition-all"
          >
            <Upload className="w-8 h-8 text-slate-400 mb-2" />
            <p className="text-xs font-bold text-slate-500">Upload or drop multiple files</p>
            <p className="text-[10px] text-slate-400 mt-1">Reorder sequence anytime before output</p>
          </button>

          {/* Layout dimensions options */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 block mb-1.5 uppercase">Paper Size</label>
              <select 
                value={pageSize} 
                onChange={(e) => setPageSize(e.target.value as any)}
                className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                  theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <option value="A4">A4 (210x297 mm)</option>
                <option value="Letter">US Letter</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-slate-400 block mb-1.5 uppercase">Orientation</label>
              <select 
                value={orientation} 
                onChange={(e) => setOrientation(e.target.value as any)}
                className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                  theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-slate-400 block mb-1.5 uppercase">Margins</label>
              <select 
                value={margin} 
                onChange={(e) => setMargin(e.target.value as any)}
                className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                  theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <option value="none">No Margin</option>
                <option value="small">Small</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={resetAll}
              disabled={images.length === 0}
              className="px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl disabled:opacity-50"
            >
              Clear List
            </button>
            <button 
              onClick={handleCompile}
              disabled={images.length === 0 || isProcessing}
              className="flex-1 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 transition-all"
            >
              {isProcessing ? 'Compiling PDF...' : `Compile & Export PDF (${images.length} Pages)`}
            </button>
          </div>
        </div>

        {/* List & Reorder Column */}
        <div className={`p-4 rounded-xl border flex flex-col h-[320px] overflow-hidden ${
          theme === 'dark' ? 'bg-slate-800/30 border-slate-800' : 'bg-slate-100 border-slate-200'
        }`}>
          <div className="text-xs font-bold text-slate-400 border-b pb-2 mb-2 flex justify-between">
            <span>FILES QUEUE</span>
            <span>{images.length} items</span>
          </div>

          {images.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <FileText className="w-8 h-8 opacity-40 mb-2" />
              <p className="text-xs">No images loaded yet.</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {images.map((img, idx) => (
                <div 
                  key={img.id} 
                  className={`flex items-center gap-3 p-2 rounded-xl border text-xs ${
                    theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                  }`}
                >
                  <img src={img.url} alt="Page thumbnail" className="w-10 h-10 object-cover rounded border" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate">{img.name}</p>
                    <p className="text-[10px] text-slate-400">Page {idx + 1} • {img.size}</p>
                  </div>

                  <div className="flex gap-1.5 shrink-0">
                    <button 
                      type="button" 
                      onClick={() => moveImage(idx, 'up')}
                      disabled={idx === 0}
                      className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded font-bold disabled:opacity-40"
                    >
                      ▲
                    </button>
                    <button 
                      type="button" 
                      onClick={() => moveImage(idx, 'down')}
                      disabled={idx === images.length - 1}
                      className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded font-bold disabled:opacity-40"
                    >
                      ▼
                    </button>
                    <button 
                      type="button" 
                      onClick={() => removeImage(img.id)}
                      className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
