import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, Download, Trash2, Check, RefreshCw, Layers, Sliders } from 'lucide-react';
import JSZip from 'jszip';

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
  status: 'pending' | 'converting' | 'success' | 'error';
}

export default function PngToJpgTool({ triggerNotification, theme }: ToolProps) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [quality, setQuality] = useState<number>(85);
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files;
    if (!uploaded) return;
    addFiles(Array.from(uploaded));
  };

  const addFiles = (fileList: File[]) => {
    const pngs = fileList.filter(f => f.name.toLowerCase().endsWith('.png'));

    if (pngs.length === 0) {
      triggerNotification('Please select valid PNG files.');
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
          convertedUrl: null,
          status: 'pending'
        };
        setImages(prev => [...prev, newItem]);
      };
      reader.readAsDataURL(file);
    });

    triggerNotification(`Added ${pngs.length} PNG files to queue.`);
  };

  const handleConvert = () => {
    if (images.length === 0) return;
    setIsProcessing(true);

    let processedCount = 0;
    images.forEach((img) => {
      if (img.status === 'success') {
        processedCount++;
        if (processedCount === images.length) setIsProcessing(false);
        return;
      }

      setImages(prev => prev.map(item => item.id === img.id ? { ...item, status: 'converting' } : item));

      const htmlImg = new Image();
      htmlImg.src = img.originalSrc;
      htmlImg.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = htmlImg.naturalWidth;
        canvas.height = htmlImg.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Fill transparency with configured background color
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(htmlImg, 0, 0);

          const jpgDataUrl = canvas.toDataURL('image/jpeg', quality / 100);
          
          setImages(prev => prev.map(item => {
            if (item.id === img.id) {
              return { ...item, convertedUrl: jpgDataUrl, status: 'success' };
            }
            return item;
          }));
        }

        processedCount++;
        if (processedCount === images.length) {
          setIsProcessing(false);
          triggerNotification('All PNG images successfully converted to flattened JPG format!');
        }
      };
      htmlImg.onerror = () => {
        setImages(prev => prev.map(item => item.id === img.id ? { ...item, status: 'error' } : item));
        processedCount++;
        if (processedCount === images.length) setIsProcessing(false);
      };
    });
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const img = prev.find(item => item.id === id);
      if (img?.convertedUrl) URL.revokeObjectURL(img.convertedUrl);
      return prev.filter(item => item.id !== id);
    });
  };

  const downloadSingle = (img: ImageItem) => {
    if (!img.convertedUrl) return;
    const link = document.createElement('a');
    link.download = img.name.replace(/\.png$/i, '') + '.jpg';
    link.href = img.convertedUrl;
    link.click();
  };

  const downloadAllAsZip = async () => {
    const readyImages = images.filter(img => img.status === 'success' && img.convertedUrl);
    if (readyImages.length === 0) return;

    const zip = new JSZip();
    triggerNotification('Compiling JPG ZIP bundle...');

    for (let img of readyImages) {
      if (!img.convertedUrl) continue;
      const response = await fetch(img.convertedUrl);
      const blob = await response.blob();
      const outputName = img.name.replace(/\.png$/i, '') + '.jpg';
      zip.file(outputName, blob);
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const zipUrl = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = zipUrl;
    link.download = `converted_jpg_images_${Date.now()}.zip`;
    link.click();
    URL.revokeObjectURL(zipUrl);
    triggerNotification('ZIP downloaded successfully!');
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div id="png-to-jpg-workspace" className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
          <ImageIcon className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">PNG to JPG Converter</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6 font-medium">Batch convert transparent PNG files into lightweight flattened JPG images with customizable transparency backgrounds.</p>

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
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files) addFiles(Array.from(e.dataTransfer.files));
          }}
          className={`h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-blue-50/10 ${
            theme === 'dark' ? 'border-slate-700 bg-slate-800/10' : 'border-slate-300 bg-slate-50'
          }`}
        >
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <p className="text-xs font-bold text-slate-500">Upload PNG files</p>
          <p className="text-[10px] text-slate-400 mt-1">Batch drag & drop. Flatten transparent layers client-side instantly.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Queue */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex justify-between items-center border-b pb-2 dark:border-slate-800 text-xs text-slate-400">
                <span className="font-bold uppercase tracking-wider">Queue: {images.length} Portable Network Graphics</span>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] font-bold text-blue-500 hover:underline"
                >
                  + Add PNGs
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
                    <div className="relative shrink-0 w-14 h-14 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
                      {/* Grid background behind original to show transparency */}
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,#ccc_25%,transparent_25%),linear-gradient(-45deg,#ccc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ccc_75%),linear-gradient(-45deg,transparent_75%,#ccc_75%)] bg-[size:8px_8px] bg-[position:0_0,0_4px,4px_-4px,-4px_0] opacity-20"></div>
                      <img 
                        src={img.originalSrc} 
                        alt={img.name} 
                        className="absolute inset-0 w-full h-full object-cover" 
                      />
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-semibold truncate text-slate-700 dark:text-slate-200">{img.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{formatSize(img.size)}</p>
                      </div>

                      {img.status === 'success' && img.convertedUrl ? (
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Flattened
                          </span>
                          <button 
                            onClick={() => downloadSingle(img)}
                            className="text-[10px] font-bold text-blue-500 hover:underline cursor-pointer"
                          >
                            Download JPG
                          </button>
                        </div>
                      ) : img.status === 'converting' ? (
                        <div className="text-[9px] text-blue-500 flex items-center gap-1 mt-2">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Flattening...
                        </div>
                      ) : (
                        <div className="text-[9px] text-slate-400 mt-2">Pending conversion...</div>
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
            <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
              <div className={`p-4 rounded-xl border text-xs text-slate-400 space-y-5 leading-relaxed ${
                theme === 'dark' ? 'bg-[#0f111a]/45 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-blue-500" />
                    Export Configurations
                  </h3>

                  {/* Quality Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-bold text-slate-500">
                      <span>JPEG Output Quality:</span>
                      <span className="text-blue-500">{quality}%</span>
                    </div>
                    <input 
                      type="range"
                      min="10"
                      max="100"
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  {/* Background Fallback preset toggles */}
                  <div className="space-y-2 mt-4">
                    <span className="font-bold text-slate-500 block">Transparency Background Fallback:</span>
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        onClick={() => setBgColor('#ffffff')}
                        className={`py-1 rounded border text-[10px] font-bold ${bgColor === '#ffffff' ? 'border-blue-500 text-blue-500 bg-blue-500/5' : 'border-slate-200 dark:border-slate-800 text-slate-400'}`}
                      >
                        White
                      </button>
                      <button 
                        onClick={() => setBgColor('#000000')}
                        className={`py-1 rounded border text-[10px] font-bold ${bgColor === '#000000' ? 'border-blue-500 text-blue-500 bg-blue-500/5' : 'border-slate-200 dark:border-slate-800 text-slate-400'}`}
                      >
                        Black
                      </button>
                      <div className="flex items-center gap-1.5 border border-slate-200 dark:border-slate-800 rounded px-1.5 py-0.5">
                        <input 
                          type="color" 
                          value={bgColor} 
                          onChange={(e) => setBgColor(e.target.value)}
                          className="w-4 h-4 cursor-pointer rounded-full overflow-hidden p-0 border-none shrink-0" 
                        />
                        <span className="text-[9px] font-mono select-none truncate">{bgColor}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-3 text-[10px] text-slate-400 space-y-1">
                  <p>• Transcoding flattens multiple transparent canvas channels directly onto the selected solid backdrop color.</p>
                </div>
              </div>

              <div className="space-y-2.5">
                <button 
                  onClick={handleConvert}
                  disabled={isProcessing}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Transcoding PNGs to JPG...</span>
                    </>
                  ) : (
                    <span>Convert PNGs to JPG</span>
                  )}
                </button>

                {images.some(img => img.status === 'success') && (
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={downloadAllAsZip}
                      className="py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Download ZIP
                    </button>
                    <button 
                      onClick={() => {
                        images.forEach(img => {
                          if (img.status === 'success') downloadSingle(img);
                        });
                      }}
                      className="py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5" /> Download All
                    </button>
                  </div>
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
