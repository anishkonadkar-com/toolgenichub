import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, Download, Trash2, CheckCircle2, RefreshCw } from 'lucide-react';

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

export default function JpgToPngTool({ triggerNotification, theme }: ToolProps) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    addFiles(Array.from(files));
  };

  const addFiles = (fileList: File[]) => {
    const jpgs = fileList.filter(f => {
      const ext = f.name.toLowerCase();
      return ext.endsWith('.jpg') || ext.endsWith('.jpeg');
    });

    if (jpgs.length === 0) {
      triggerNotification('Please select valid JPG/JPEG image files.');
      return;
    }

    jpgs.forEach((file, index) => {
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

    triggerNotification(`Added ${jpgs.length} JPG image(s) to convert.`);
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
          ctx.drawImage(htmlImg, 0, 0);
          const pngDataUrl = canvas.toDataURL('image/png');
          
          setImages(prev => prev.map(item => {
            if (item.id === img.id) {
              return { ...item, convertedUrl: pngDataUrl };
            }
            return item;
          }));
        }

        processedCount++;
        if (processedCount === images.length) {
          setIsProcessing(false);
          triggerNotification('Successfully transcoded JPEG waveforms to lossless portable network graphics (PNG) files!');
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
        link.download = img.name.replace(/\.jpe?g$/i, '') + '.png';
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
    <div id="jpg-to-png-root" className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
          <ImageIcon className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">JPG to PNG Converter</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">Convert lossy JPG/JPEG photographs into professional lossless PNG images natively and securely inside your web memory.</p>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFiles} 
        accept="image/jpeg,image/jpg" 
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
          <p className="text-xs font-bold text-slate-500">Upload JPG / JPEG files</p>
          <p className="text-[10px] text-slate-400 mt-1">Files are compiled entirely client-side for maximum safety</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Queue */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex justify-between items-center border-b pb-2 dark:border-slate-800 text-xs text-slate-400">
                <span className="font-bold uppercase tracking-wider">Queue: {images.length} Photographs</span>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] font-bold text-indigo-500 hover:underline"
                >
                  + Add JPGs
                </button>
              </div>

              {/* Grid list of images */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[360px] overflow-y-auto pr-1">
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
                            <CheckCircle2 className="w-3.5 h-3.5" /> Transcoded
                          </span>
                          <a 
                            href={img.convertedUrl}
                            download={img.name.replace(/\.jpe?g$/i, '') + '.png'}
                            className="text-[10px] font-bold text-indigo-500 hover:underline"
                          >
                            Download PNG
                          </a>
                        </div>
                      ) : (
                        <div className="text-[9px] text-slate-400">Pending conversion...</div>
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
            <div className="lg:col-span-4 flex flex-col justify-between">
              <div className={`p-4 rounded-xl border mb-4 text-xs text-slate-400 space-y-2 leading-relaxed ${
                theme === 'dark' ? 'bg-slate-800/20 border-slate-800/80' : 'bg-slate-50 border-slate-200'
              }`}>
                <p className="font-bold text-slate-500 dark:text-slate-300">Lossless Conversion Details:</p>
                <p>• Transcoding converts JPG's lossy 8x8 discrete cosine transform macroblocks into clean, lossless PNG DEFLATE scanlines.</p>
                <p>• Supports full pixel transparency mapping.</p>
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
                      <span>Synthesizing PNG buffers...</span>
                    </>
                  ) : (
                    <span>Convert JPGs to PNG</span>
                  )}
                </button>

                {images.some(img => img.convertedUrl) && (
                  <button 
                    onClick={downloadAll}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Download All PNGs
                  </button>
                )}

                <button 
                  onClick={() => setImages([])}
                  className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all cursor-pointer"
                >
                  Reset Converter
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
