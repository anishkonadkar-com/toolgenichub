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
  convertedSize: number | null;
  status: 'pending' | 'converting' | 'success' | 'error';
}

export default function WebPToJpgTool({ triggerNotification, theme }: ToolProps) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [quality, setQuality] = useState<number>(85);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeCompareId, setActiveCompareId] = useState<string | null>(null);
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files;
    if (!uploaded) return;
    addFiles(Array.from(uploaded));
  };

  const addFiles = (fileList: File[]) => {
    const webps = fileList.filter(f => f.name.toLowerCase().endsWith('.webp'));

    if (webps.length === 0) {
      triggerNotification('Please select valid WebP image files.');
      return;
    }

    webps.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        const newItem: ImageItem = {
          id: `${file.name}-${Date.now()}-${index}`,
          name: file.name,
          size: file.size,
          originalSrc: src,
          convertedUrl: null,
          convertedSize: null,
          status: 'pending'
        };
        setImages(prev => [...prev, newItem]);
        if (!activeCompareId) {
          setActiveCompareId(newItem.id);
        }
      };
      reader.readAsDataURL(file);
    });

    triggerNotification(`Added ${webps.length} WebP image(s) to convert.`);
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
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(htmlImg, 0, 0);

          const jpgDataUrl = canvas.toDataURL('image/jpeg', quality / 100);
          
          const head = 'data:image/jpeg;base64,';
          const sizeInBytes = Math.round((jpgDataUrl.length - head.length) * 3 / 4);

          setImages(prev => prev.map(item => {
            if (item.id === img.id) {
              return { 
                ...item, 
                convertedUrl: jpgDataUrl, 
                convertedSize: sizeInBytes,
                status: 'success' 
              };
            }
            return item;
          }));
        }

        processedCount++;
        if (processedCount === images.length) {
          setIsProcessing(false);
          triggerNotification('All WebP images successfully converted to JPG format!');
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
      const remaining = prev.filter(item => item.id !== id);
      if (activeCompareId === id) {
        setActiveCompareId(remaining[0]?.id || null);
      }
      return remaining;
    });
  };

  const downloadSingle = (img: ImageItem) => {
    if (!img.convertedUrl) return;
    const link = document.createElement('a');
    link.download = img.name.replace(/\.webp$/i, '') + '.jpg';
    link.href = img.convertedUrl;
    link.click();
  };

  const downloadAllAsZip = async () => {
    const readyImages = images.filter(img => img.status === 'success' && img.convertedUrl);
    if (readyImages.length === 0) return;

    const zip = new JSZip();
    triggerNotification('Compiling JPG ZIP archive...');

    for (let img of readyImages) {
      if (!img.convertedUrl) continue;
      const response = await fetch(img.convertedUrl);
      const blob = await response.blob();
      const outputName = img.name.replace(/\.webp$/i, '') + '.jpg';
      zip.file(outputName, blob);
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const zipUrl = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = zipUrl;
    link.download = `converted_webp_images_${Date.now()}.zip`;
    link.click();
    URL.revokeObjectURL(zipUrl);
    triggerNotification('ZIP archive downloaded successfully!');
  };

  const formatSize = (bytes: number | null) => {
    if (!bytes) return 'N/A';
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const activeCompareImage = images.find(img => img.id === activeCompareId);

  return (
    <div id="webp-to-jpg-workspace" className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
          <ImageIcon className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">WebP to JPG Converter</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6 font-medium">Convert WebP images into highly compatible and lightweight JPG format natively in your browser with side-by-side split comparison sliders.</p>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFiles} 
        accept="image/webp" 
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
          <p className="text-xs font-bold text-slate-500">Upload WebP files</p>
          <p className="text-[10px] text-slate-400 mt-1">Batch drag & drop. Processes fully in-browser for complete privacy.</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Split Compare Preview */}
          {activeCompareImage && activeCompareImage.convertedUrl && (
            <div className={`p-4 rounded-2xl border relative flex flex-col items-center ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50/50 border-slate-200'}`}>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 self-start">Interactive Split Preview: {activeCompareImage.name}</h3>
              
              <div 
                className="relative w-full max-w-xl h-64 border rounded-xl overflow-hidden cursor-ew-resize select-none border-slate-200 dark:border-slate-800"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = ((e.clientX - rect.left) / rect.width) * 100;
                  setSliderPosition(Math.max(0, Math.min(100, pos)));
                }}
              >
                {/* Original Left side */}
                <img 
                  src={activeCompareImage.originalSrc} 
                  alt="Original" 
                  className="absolute inset-0 w-full h-full object-contain" 
                />
                
                {/* Converted Right side (Clipped) */}
                <div 
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` }}
                >
                  <img 
                    src={activeCompareImage.convertedUrl} 
                    alt="JPG" 
                    className="absolute inset-0 w-full h-full object-contain" 
                  />
                </div>

                {/* Vertical Slider divider */}
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize flex items-center justify-center z-10"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="w-5 h-5 bg-white rounded-full border border-slate-300 shadow flex items-center justify-center text-[10px] text-slate-500 font-bold font-sans">↔</div>
                </div>

                {/* Labels */}
                <div className="absolute top-2 left-2 bg-slate-950/80 px-2 py-0.5 rounded text-[9px] font-bold text-white z-20 shadow">
                  Before: {formatSize(activeCompareImage.size)}
                </div>
                <div className="absolute top-2 right-2 bg-blue-500 px-2 py-0.5 rounded text-[9px] font-bold text-white z-20 shadow">
                  JPG After: {formatSize(activeCompareImage.convertedSize)} (-{Math.round((1 - (activeCompareImage.convertedSize || 0) / activeCompareImage.size) * 100)}%)
                </div>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 font-medium">Hover/Move your mouse across the preview above to view raw encoding quality comparison split-screens.</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Queue */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex justify-between items-center border-b pb-2 dark:border-slate-800 text-xs text-slate-400">
                <span className="font-bold uppercase tracking-wider">Queue: {images.length} WebP Images</span>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] font-bold text-blue-500 hover:underline"
                >
                  + Add WebPs
                </button>
              </div>

              {/* Grid list of images */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[360px] overflow-y-auto pr-1">
                {images.map((img) => (
                  <div 
                    key={img.id}
                    onClick={() => img.convertedUrl && setActiveCompareId(img.id)}
                    className={`p-3 rounded-xl border flex gap-3 relative cursor-pointer transition-all ${
                      activeCompareId === img.id
                        ? 'border-blue-500 bg-blue-500/5'
                        : theme === 'dark' ? 'bg-[#0f111a]/45 border-slate-800' : 'bg-slate-50 border-slate-200'
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

                      {img.status === 'success' && img.convertedUrl ? (
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Ready
                          </span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadSingle(img);
                            }}
                            className="text-[10px] font-bold text-blue-500 hover:underline cursor-pointer"
                          >
                            Download JPG
                          </button>
                        </div>
                      ) : img.status === 'converting' ? (
                        <div className="text-[9px] text-blue-500 flex items-center gap-1 mt-2">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Converting...
                        </div>
                      ) : (
                        <div className="text-[9px] text-slate-400 mt-2">Pending...</div>
                      )}
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(img.id);
                      }}
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
              <div className={`p-4 rounded-xl border text-xs text-slate-400 space-y-4 leading-relaxed ${
                theme === 'dark' ? 'bg-[#0f111a]/45 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-blue-500" />
                    Conversion Settings
                  </h3>

                  {/* Quality slider */}
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
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-3 text-[10px] text-slate-400 space-y-1">
                  <p>• Transcoding converts lossy WebP formats to universally compatible JPG files natively in-browser.</p>
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
                      <span>Transcoding WebP to JPG...</span>
                    </>
                  ) : (
                    <span>Convert WebPs to JPG</span>
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
                  onClick={() => {
                    setImages([]);
                    setActiveCompareId(null);
                  }}
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
