import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, Download, Trash2, Check, RefreshCw, Layers } from 'lucide-react';
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

export default function WebPToPngTool({ triggerNotification, theme }: ToolProps) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [preserveTransparency, setPreserveTransparency] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files;
    if (!uploaded) return;
    addFiles(Array.from(uploaded));
  };

  const addFiles = (fileList: File[]) => {
    const webps = fileList.filter(f => {
      const ext = f.name.toLowerCase();
      return ext.endsWith('.webp');
    });

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
      };
      reader.readAsDataURL(file);
    });

    triggerNotification(`Added ${webps.length} WebP images to queue.`);
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
          if (!preserveTransparency) {
            // Fill background with white if user disables transparency
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          } else {
            // Standard transparent clear
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }
          ctx.drawImage(htmlImg, 0, 0);

          // Render as PNG (lossless format)
          const pngDataUrl = canvas.toDataURL('image/png');
          
          // Calculate estimated converted size (base64 string to bytes)
          const head = 'data:image/png;base64,';
          const sizeInBytes = Math.round((pngDataUrl.length - head.length) * 3 / 4);

          setImages(prev => prev.map(item => {
            if (item.id === img.id) {
              return { 
                ...item, 
                convertedUrl: pngDataUrl, 
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
          triggerNotification('All WebP images converted to PNG!');
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
    link.download = img.name.replace(/\.webp$/i, '') + '.png';
    link.href = img.convertedUrl;
    link.click();
  };

  const downloadAllAsZip = async () => {
    const readyImages = images.filter(img => img.status === 'success' && img.convertedUrl);
    if (readyImages.length === 0) return;

    const zip = new JSZip();
    triggerNotification('Compiling PNG ZIP bundle...');

    for (let img of readyImages) {
      if (!img.convertedUrl) continue;
      const response = await fetch(img.convertedUrl);
      const blob = await response.blob();
      const outputName = img.name.replace(/\.webp$/i, '') + '.png';
      zip.file(outputName, blob);
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const zipUrl = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = zipUrl;
    link.download = `converted_png_images_${Date.now()}.zip`;
    link.click();
    URL.revokeObjectURL(zipUrl);
    triggerNotification('ZIP downloaded successfully!');
  };

  const formatSize = (bytes: number | null) => {
    if (!bytes) return 'N/A';
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div id="webp-to-png-workspace" className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
          <ImageIcon className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">WebP to PNG Converter</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6 font-medium">Convert next-gen WebP images to lossless PNG format, maintaining transparency and crisp resolutions fully offline.</p>

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
          className={`h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-emerald-50/10 ${
            theme === 'dark' ? 'border-slate-700 bg-slate-800/10' : 'border-slate-300 bg-slate-50'
          }`}
        >
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <p className="text-xs font-bold text-slate-500">Upload WebP files</p>
          <p className="text-[10px] text-slate-400 mt-1">Batch upload WebP files. All conversion runs offline inside your browser sandbox.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Queue */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex justify-between items-center border-b pb-2 dark:border-slate-800 text-xs text-slate-400">
                <span className="font-bold uppercase tracking-wider">Queue: {images.length} Images</span>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] font-bold text-emerald-500 hover:underline"
                >
                  + Add WebPs
                </button>
              </div>

              {/* Grid list of images */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[360px] overflow-y-auto pr-1">
                {images.map((img) => (
                  <div 
                    key={img.id}
                    className={`p-3 rounded-xl border flex gap-3 relative transition-all ${
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

                      {img.status === 'success' && img.convertedUrl ? (
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Conv. {formatSize(img.convertedSize)}
                          </span>
                          <button 
                            onClick={() => downloadSingle(img)}
                            className="text-[10px] font-bold text-emerald-500 hover:underline cursor-pointer"
                          >
                            Download PNG
                          </button>
                        </div>
                      ) : img.status === 'converting' ? (
                        <div className="text-[9px] text-blue-500 flex items-center gap-1 mt-2">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Transcoding...
                        </div>
                      ) : (
                        <div className="text-[9px] text-slate-400 mt-2">Pending...</div>
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
              <div className={`p-4 rounded-xl border text-xs text-slate-400 space-y-4 leading-relaxed ${
                theme === 'dark' ? 'bg-[#0f111a]/45 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-1.5">
                    ⚙ Configuration Settings
                  </h3>

                  {/* Preserve Transparency Toggle */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={preserveTransparency}
                      onChange={(e) => setPreserveTransparency(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-500"
                    />
                    <span className="font-bold text-slate-500">Preserve Transparency</span>
                  </label>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-3 text-[10px] text-slate-400 space-y-1">
                  <p>• Converted output files are structured in lossless PNG8/PNG24 formats.</p>
                  <p>• Transparency preservation extracts WebP alpha channels to retain blank background nodes perfectly.</p>
                </div>
              </div>

              <div className="space-y-2.5">
                <button 
                  onClick={handleConvert}
                  disabled={isProcessing}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Converting WebP...</span>
                    </>
                  ) : (
                    <span>Convert WebPs to PNG</span>
                  )}
                </button>

                {images.some(img => img.status === 'success') && (
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={downloadAllAsZip}
                      className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer"
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
