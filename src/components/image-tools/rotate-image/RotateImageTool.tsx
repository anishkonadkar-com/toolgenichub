import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, Download, Trash2, Check, RefreshCw, Layers, RotateCcw, RotateCw, Sliders } from 'lucide-react';
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
  angle: number; // custom degree rotation
  convertedUrl: string | null;
  status: 'pending' | 'processing' | 'success';
}

export default function RotateImageTool({ triggerNotification, theme }: ToolProps) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [globalAngle, setGlobalAngle] = useState<number>(90);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files;
    if (!uploaded) return;
    addFiles(Array.from(uploaded));
  };

  const addFiles = (fileList: File[]) => {
    const validFiles = fileList.filter(f => {
      const ext = f.name.toLowerCase();
      return ext.endsWith('.jpg') || ext.endsWith('.jpeg') || ext.endsWith('.png') || ext.endsWith('.webp');
    });

    if (validFiles.length === 0) {
      triggerNotification('Please select valid images.');
      return;
    }

    validFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        const newItem: ImageItem = {
          id: `${file.name}-${Date.now()}-${index}`,
          name: file.name,
          size: file.size,
          originalSrc: src,
          angle: 0,
          convertedUrl: null,
          status: 'pending'
        };
        setImages(prev => [...prev, newItem]);
      };
      reader.readAsDataURL(file);
    });

    triggerNotification(`Added ${validFiles.length} images to queue.`);
  };

  const rotateImageOnCanvas = (imgItem: ImageItem, targetAngle: number): Promise<ImageItem> => {
    return new Promise((resolve) => {
      const htmlImg = new Image();
      htmlImg.src = imgItem.originalSrc;
      htmlImg.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ ...imgItem, status: 'pending' });
          return;
        }

        // Calculate absolute bounds for rotated dimensions
        const angleRad = (targetAngle * Math.PI) / 180;
        const sin = Math.abs(Math.sin(angleRad));
        const cos = Math.abs(Math.cos(angleRad));
        
        const width = htmlImg.naturalWidth;
        const height = htmlImg.naturalHeight;
        
        const newWidth = width * cos + height * sin;
        const newHeight = width * sin + height * cos;

        canvas.width = newWidth;
        canvas.height = newHeight;

        // Draw and rotate
        ctx.translate(newWidth / 2, newHeight / 2);
        ctx.rotate(angleRad);
        ctx.drawImage(htmlImg, -width / 2, -height / 2);

        const dataUrl = canvas.toDataURL('image/png');
        resolve({
          ...imgItem,
          angle: targetAngle,
          convertedUrl: dataUrl,
          status: 'success'
        });
      };
      htmlImg.onerror = () => {
        resolve({ ...imgItem, status: 'pending' });
      };
    });
  };

  const handleApplyRotation = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);

    const processed: ImageItem[] = [];
    for (let img of images) {
      setImages(prev => prev.map(item => item.id === img.id ? { ...item, status: 'processing' } : item));
      const rotated = await rotateImageOnCanvas(img, globalAngle);
      processed.push(rotated);
      setImages(prev => prev.map(item => item.id === img.id ? rotated : item));
    }

    setIsProcessing(false);
    triggerNotification(`Successfully rotated all queue images by ${globalAngle}°!`);
  };

  const adjustIndividualAngle = async (id: string, dir: 'left' | 'right') => {
    const img = images.find(item => item.id === id);
    if (!img) return;

    const currentAngle = img.angle;
    const offset = dir === 'left' ? -90 : 90;
    const newAngle = (currentAngle + offset + 360) % 360;

    const rotated = await rotateImageOnCanvas(img, newAngle);
    setImages(prev => prev.map(item => item.id === id ? rotated : item));
    triggerNotification(`Rotated individual photo to ${newAngle}°.`);
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
    link.download = `rotated_${globalAngle}_deg_${img.name}`;
    link.href = img.convertedUrl;
    link.click();
  };

  const downloadAllAsZip = async () => {
    const readyImages = images.filter(img => img.status === 'success' && img.convertedUrl);
    if (readyImages.length === 0) return;

    const zip = new JSZip();
    triggerNotification('Compiling Rotated ZIP bundle...');

    for (let img of readyImages) {
      if (!img.convertedUrl) continue;
      const response = await fetch(img.convertedUrl);
      const blob = await response.blob();
      zip.file(`rotated_${img.angle}_deg_${img.name}`, blob);
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const zipUrl = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = zipUrl;
    link.download = `rotated_images_${Date.now()}.zip`;
    link.click();
    URL.revokeObjectURL(zipUrl);
    triggerNotification('ZIP downloaded successfully!');
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div id="rotate-image-workspace" className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
          <RotateCw className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Rotate Image</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6 font-medium">Rotate pictures left or right, apply standardized angles (90°, 180°, 270°), or specify custom degree sweeps in batch.</p>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFiles} 
        accept="image/*" 
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
          <p className="text-xs font-bold text-slate-500">Upload Images to Rotate</p>
          <p className="text-[10px] text-slate-400 mt-1">Batch drag & drop. Fully private local client-side processing.</p>
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
                  className="text-[11px] font-bold text-blue-500 hover:underline"
                >
                  + Add Images
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
                    <div className="relative shrink-0 w-14 h-14 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 flex items-center justify-center bg-slate-900/10 dark:bg-slate-950/20">
                      <img 
                        src={img.convertedUrl || img.originalSrc} 
                        alt={img.name} 
                        className="max-w-full max-h-full object-contain"
                        style={{
                          transform: img.convertedUrl ? 'none' : `rotate(${img.angle}deg)`,
                          transition: 'transform 0.15s ease-out'
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-semibold truncate text-slate-700 dark:text-slate-200">{img.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{formatSize(img.size)}</p>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-1.5">
                          <button 
                            onClick={() => adjustIndividualAngle(img.id, 'left')}
                            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-blue-500 transition-all"
                            title="Rotate 90° Left"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => adjustIndividualAngle(img.id, 'right')}
                            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-blue-500 transition-all"
                            title="Rotate 90° Right"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {img.status === 'success' && img.convertedUrl ? (
                          <button 
                            onClick={() => downloadSingle(img)}
                            className="text-[10px] font-bold text-blue-500 hover:underline cursor-pointer"
                          >
                            Download
                          </button>
                        ) : img.status === 'processing' ? (
                          <span className="text-[9px] text-blue-500 flex items-center gap-1">
                            <RefreshCw className="w-3 h-3 animate-spin" /> Rotating...
                          </span>
                        ) : (
                          <span className="text-[9px] text-slate-400">Angle: {img.angle}°</span>
                        )}
                      </div>
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
                    Batch Rotation Settings
                  </h3>

                  {/* Preset rotation degree selections */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[90, 180, 270].map((deg) => (
                      <button
                        key={deg}
                        onClick={() => setGlobalAngle(deg)}
                        className={`py-1.5 rounded border text-[10px] font-bold ${globalAngle === deg ? 'border-blue-500 text-blue-500 bg-blue-500/5' : 'border-slate-200 dark:border-slate-800 text-slate-400'}`}
                      >
                        {deg}° Degree
                      </button>
                    ))}
                  </div>

                  {/* Custom degree slider */}
                  <div className="space-y-1.5 mt-2">
                    <div className="flex justify-between font-bold text-slate-500">
                      <span>Custom Precision Angle:</span>
                      <span className="text-blue-500">{globalAngle}°</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="360"
                      value={globalAngle}
                      onChange={(e) => setGlobalAngle(Number(e.target.value))}
                      className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-3 text-[10px] text-slate-400 space-y-1">
                  <p>• Apply orientations in bulk to make rapid horizontal/vertical landscape alignment adjustments.</p>
                </div>
              </div>

              <div className="space-y-2.5">
                <button 
                  onClick={handleApplyRotation}
                  disabled={isProcessing}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Rotating Queue...</span>
                    </>
                  ) : (
                    <span>Rotate Queue by {globalAngle}°</span>
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
                  Reset Rotation Canvas
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
