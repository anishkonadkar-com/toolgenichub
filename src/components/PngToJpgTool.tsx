import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, Download, Trash2, Sliders, CheckCircle2, RefreshCw } from 'lucide-react';

interface ToolProps {
  triggerNotification: (msg: string) => void;
  theme: 'light' | 'dark';
}

interface ImageItem {
  id: string;
  name: string;
  size: number;
  originalSrc: string;
  convertedUrl: string | null;
}

export default function PngToJpgTool({ triggerNotification, theme }: ToolProps) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [bgColor, setBgColor] = useState<'white' | 'black' | 'custom'>('white');
  const [customColor, setCustomColor] = useState<string>('#ffffff');
  const [quality, setQuality] = useState<number>(85);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    addFiles(Array.from(files));
  };

  const addFiles = (fileList: File[]) => {
    const pngs = fileList.filter(f => f.name.toLowerCase().endsWith('.png'));
    if (pngs.length === 0) {
      triggerNotification('Please select valid PNG images.');
      return;
    }

    pngs.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        const newItem: ImageItem = {
          id: `${file.name}-${Date.now()}-${index}`,
          name: file.name,
          size: file.size,
          originalSrc: src,
          convertedUrl: null
        };
        setImages(prev => [...prev, newItem]);
      };
      reader.readAsDataURL(file);
    });

    triggerNotification(`Successfully loaded ${pngs.length} PNG(s) for rendering.`);
  };

  const handleConvert = () => {
    if (images.length === 0) return;
    setIsProcessing(true);

    let processedCount = 0;
    images.forEach(img => {
      const htmlImg = new Image();
      htmlImg.src = img.originalSrc;
      htmlImg.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = htmlImg.naturalWidth;
        canvas.height = htmlImg.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Fill transparency background before drawing JPG
          let resolvedBg = '#ffffff';
          if (bgColor === 'black') resolvedBg = '#000000';
          else if (bgColor === 'custom') resolvedBg = customColor;

          ctx.fillStyle = resolvedBg;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Draw PNG image over background
          ctx.drawImage(htmlImg, 0, 0);
          const jpgDataUrl = canvas.toDataURL('image/jpeg', quality / 100);
          
          setImages(prev => prev.map(item => {
            if (item.id === img.id) {
              return { ...item, convertedUrl: jpgDataUrl };
            }
            return item;
          }));
        }

        processedCount++;
        if (processedCount === images.length) {
          setIsProcessing(false);
          triggerNotification('Successfully flattened transparency layers and converted PNG to JPG format!');
        }
      };
    });
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(item => item.id !== id));
  };

  const downloadAll = () => {
    images.forEach(img => {
      if (img.convertedUrl) {
        const link = document.createElement('a');
        link.download = img.name.replace(/\.png$/i, '') + '.jpg';
        link.href = img.convertedUrl;
        link.click();
      }
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div id="png-to-jpg-root" className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
          <ImageIcon className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">PNG to JPG Converter</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">Convert transparent PNG files into optimized JPG photographs. Customize transparency fallback colors and JPEG compression quality natively.</p>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFiles} 
        accept="image/png" 
        multiple
        className="hidden" 
      />

      {images.length === 0 ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-indigo-50/10 ${
            theme === 'dark' ? 'border-slate-700 bg-slate-800/10' : 'border-slate-300 bg-slate-50'
          }`}
        >
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <p className="text-xs font-bold text-slate-500">Upload PNG files</p>
          <p className="text-[10px] text-slate-400 mt-1">Converts transparent backdrops to solid colors safely</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Queue list */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex justify-between items-center border-b pb-2 dark:border-slate-800 text-xs text-slate-400">
                <span className="font-bold uppercase tracking-wider">Queue: {images.length} PNGs</span>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] font-bold text-indigo-500 hover:underline"
                >
                  + Add PNGs
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-1">
                {images.map((img) => (
                  <div 
                    key={img.id}
                    className={`p-3 rounded-xl border flex gap-3 relative ${
                      theme === 'dark' ? 'bg-[#0f111a]/45 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <img 
                      src={img.originalSrc} 
                      alt={img.name} 
                      className="w-14 h-14 object-cover rounded-lg border border-slate-200 dark:border-slate-800 shrink-0" 
                    />
                    <div className="min-w-0 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-semibold truncate text-slate-700 dark:text-slate-200">{img.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{formatSize(img.size)}</p>
                      </div>

                      {img.convertedUrl ? (
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Flattened
                          </span>
                          <a 
                            href={img.convertedUrl}
                            download={img.name.replace(/\.png$/i, '') + '.jpg'}
                            className="text-[10px] font-bold text-indigo-500 hover:underline"
                          >
                            Download JPG
                          </a>
                        </div>
                      ) : (
                        <div className="text-[9px] text-slate-400">Awaiting transcode...</div>
                      )}
                    </div>

                    <button 
                      onClick={() => removeImage(img.id)}
                      className="absolute top-2 right-2 p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-500 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Settings */}
            <div className="lg:col-span-5 space-y-4">
              <div className={`p-4 rounded-xl border space-y-4 ${
                theme === 'dark' ? 'bg-slate-800/20 border-slate-800/80' : 'bg-slate-50 border-slate-200'
              }`}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-indigo-500" /> Export settings
                </h3>

                {/* Transparency Fallback selection */}
                <div>
                  <span className="text-xs font-bold block mb-1.5">Transparency Fallback Color</span>
                  <div className="grid grid-cols-3 gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                    <button 
                      onClick={() => setBgColor('white')}
                      className={`py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                        bgColor === 'white' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      White
                    </button>
                    <button 
                      onClick={() => setBgColor('black')}
                      className={`py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                        bgColor === 'black' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      Black
                    </button>
                    <button 
                      onClick={() => setBgColor('custom')}
                      className={`py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                        bgColor === 'custom' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      Custom
                    </button>
                  </div>

                  {bgColor === 'custom' && (
                    <div className="flex gap-2 items-center mt-2.5">
                      <input 
                        type="color" 
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className="w-8 h-8 rounded border-none cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className={`p-1.5 rounded border font-mono text-xs w-24 outline-none ${
                          theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-white border-slate-200'
                        }`}
                      />
                    </div>
                  )}
                </div>

                {/* Quality optimization */}
                <div>
                  <div className="flex justify-between text-[10px] font-extrabold text-slate-400 uppercase mb-1">
                    <span>JPEG Quality level</span>
                    <span className="font-mono text-blue-500">{quality}%</span>
                  </div>
                  <input 
                    type="range"
                    min="50"
                    max="100"
                    step="5"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>

              {/* Action commands */}
              <div className="space-y-2.5">
                <button 
                  onClick={handleConvert}
                  disabled={isProcessing}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Merging Alpha matrices & compression...</span>
                    </>
                  ) : (
                    <span>Convert PNGs to JPG</span>
                  )}
                </button>

                {images.some(img => img.convertedUrl) && (
                  <button 
                    onClick={downloadAll}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Download All JPGs
                  </button>
                )}

                <button 
                  onClick={() => setImages([])}
                  className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all cursor-pointer"
                >
                  Reset List
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
