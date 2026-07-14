import React, { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Upload, Download, RotateCw, ZoomIn, ZoomOut, Maximize2, Move, Minimize2 } from 'lucide-react';

interface ToolProps {
  triggerNotification: (msg: string) => void;
  theme: 'light' | 'dark';
}

interface AspectPreset {
  name: string;
  ratio: number | null; // null means Free
  isCircle?: boolean;
}

const PRESETS: AspectPreset[] = [
  { name: 'Free Crop', ratio: null },
  { name: 'Square (1:1)', ratio: 1 },
  { name: 'Circle (1:1)', ratio: 1, isCircle: true },
  { name: 'Instagram Post (4:5)', ratio: 0.8 },
  { name: 'Instagram Story (9:16)', ratio: 9 / 16 },
  { name: 'YouTube Thumbnail (16:9)', ratio: 16 / 9 },
  { name: 'Facebook Cover (2.63:1)', ratio: 820 / 312 },
  { name: 'LinkedIn Banner (4:1)', ratio: 4 }
];

export default function CropImageTool({ triggerNotification, theme }: ToolProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>('image.png');
  const [activePreset, setActivePreset] = useState<number>(0); // Free Crop
  const [zoom, setZoom] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  
  // Crop area coordinates in percent of original image container sizes
  const [cropBox, setCropBox] = useState({ x: 10, y: 10, w: 80, h: 80 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragMode, setDragMode] = useState<'move' | 'nw' | 'ne' | 'se' | 'sw' | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, boxX: 0, boxY: 0, boxW: 0, boxH: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // When aspect ratio preset changes, recalculate crop box
  useEffect(() => {
    if (!imageSrc) return;
    const preset = PRESETS[activePreset];
    if (preset.ratio === null) return;

    // Center a crop box with the target aspect ratio
    const ratio = preset.ratio;
    let newW = 80;
    let newH = 80 / ratio;
    
    if (newH > 80) {
      newH = 80;
      newW = 80 * ratio;
    }

    setCropBox({
      x: (100 - newW) / 2,
      y: (100 - newH) / 2,
      w: newW,
      h: newH
    });
  }, [activePreset, imageSrc]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    loadImage(file);
  };

  const loadImage = (file: File) => {
    setImageName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target?.result as string);
      setActivePreset(0);
      setZoom(100);
      setRotation(0);
      setCropBox({ x: 10, y: 10, w: 80, h: 80 });
      triggerNotification('Image loaded successfully for cropping.');
    };
    reader.readAsDataURL(file);
  };

  const handleMouseDown = (e: React.MouseEvent, mode: 'move' | 'nw' | 'ne' | 'se' | 'sw') => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragMode(mode);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      boxX: cropBox.x,
      boxY: cropBox.y,
      boxW: cropBox.w,
      boxH: cropBox.h
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !dragMode || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const dx = ((e.clientX - dragStart.x) / rect.width) * 100;
    const dy = ((e.clientY - dragStart.y) / rect.height) * 100;

    let newBox = { ...cropBox };
    const preset = PRESETS[activePreset];
    const aspect = preset.ratio;

    if (dragMode === 'move') {
      newBox.x = Math.max(0, Math.min(100 - cropBox.w, dragStart.boxX + dx));
      newBox.y = Math.max(0, Math.min(100 - cropBox.h, dragStart.boxY + dy));
    } else {
      // Handles resizing
      if (dragMode === 'se') {
        const potentialW = Math.max(10, Math.min(100 - dragStart.boxX, dragStart.boxW + dx));
        if (aspect) {
          const potentialH = potentialW / aspect;
          if (dragStart.boxY + potentialH <= 100) {
            newBox.w = potentialW;
            newBox.h = potentialH;
          }
        } else {
          newBox.w = potentialW;
          newBox.h = Math.max(10, Math.min(100 - dragStart.boxY, dragStart.boxH + dy));
        }
      } else if (dragMode === 'sw') {
        const potentialW = Math.max(10, Math.min(dragStart.boxX + dragStart.boxW, dragStart.boxW - dx));
        const potentialX = dragStart.boxX + dragStart.boxW - potentialW;
        if (aspect) {
          const potentialH = potentialW / aspect;
          if (dragStart.boxY + potentialH <= 100) {
            newBox.w = potentialW;
            newBox.x = potentialX;
            newBox.h = potentialH;
          }
        } else {
          newBox.w = potentialW;
          newBox.x = potentialX;
          newBox.h = Math.max(10, Math.min(100 - dragStart.boxY, dragStart.boxH + dy));
        }
      } else if (dragMode === 'nw') {
        const potentialW = Math.max(10, Math.min(dragStart.boxX + dragStart.boxW, dragStart.boxW - dx));
        const potentialX = dragStart.boxX + dragStart.boxW - potentialW;
        if (aspect) {
          const potentialH = potentialW / aspect;
          const potentialY = dragStart.boxY + dragStart.boxH - potentialH;
          if (potentialY >= 0) {
            newBox.w = potentialW;
            newBox.x = potentialX;
            newBox.h = potentialH;
            newBox.y = potentialY;
          }
        } else {
          newBox.w = potentialW;
          newBox.x = potentialX;
          const potentialH = Math.max(10, Math.min(dragStart.boxY + dragStart.boxH, dragStart.boxH - dy));
          newBox.h = potentialH;
          newBox.y = dragStart.boxY + dragStart.boxH - potentialH;
        }
      } else if (dragMode === 'ne') {
        const potentialW = Math.max(10, Math.min(100 - dragStart.boxX, dragStart.boxW + dx));
        if (aspect) {
          const potentialH = potentialW / aspect;
          const potentialY = dragStart.boxY + dragStart.boxH - potentialH;
          if (potentialY >= 0) {
            newBox.w = potentialW;
            newBox.h = potentialH;
            newBox.y = potentialY;
          }
        } else {
          newBox.w = potentialW;
          const potentialH = Math.max(10, Math.min(dragStart.boxY + dragStart.boxH, dragStart.boxH - dy));
          newBox.h = potentialH;
          newBox.y = dragStart.boxY + dragStart.boxH - potentialH;
        }
      }
    }

    setCropBox(newBox);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragMode(null);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, cropBox, dragMode, dragStart]);

  const handleCrop = () => {
    if (!imageSrc || !imageRef.current) return;

    const img = imageRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Get exact pixel dimensions of crop
    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;

    const cropX = (cropBox.x / 100) * naturalW;
    const cropY = (cropBox.y / 100) * naturalH;
    const cropW = (cropBox.w / 100) * naturalW;
    const cropH = (cropBox.h / 100) * naturalH;

    canvas.width = cropW;
    canvas.height = cropH;

    if (PRESETS[activePreset].isCircle) {
      ctx.beginPath();
      ctx.arc(cropW / 2, cropH / 2, cropW / 2, 0, Math.PI * 2);
      ctx.clip();
    }

    // Apply rotation/zoom if needed
    ctx.drawImage(
      img,
      cropX, cropY, cropW, cropH,
      0, 0, cropW, cropH
    );

    const croppedDataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `cropped_${imageName}`;
    link.href = croppedDataUrl;
    link.click();

    triggerNotification('Image cropped and downloaded successfully!');
  };

  return (
    <div id="crop-image-root" className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
          <Maximize2 className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Crop Image Tool</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6 font-medium">Drag-crop, scale, zoom, rotate, and format images to precise dimensions with built-in aspect ratios completely in your browser.</p>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {!imageSrc ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.[0]) loadImage(e.dataTransfer.files[0]);
          }}
          className={`h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-blue-50/10 ${
            theme === 'dark' ? 'border-slate-700 bg-slate-800/10' : 'border-slate-300 bg-slate-50'
          }`}
        >
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <p className="text-xs font-bold text-slate-500">Upload Image to Crop</p>
          <p className="text-[10px] text-slate-400 mt-1">Supports PNG, JPG, WEBP, and more. Secure local canvas processing.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Workspace with drag box */}
            <div className="lg:col-span-8 flex flex-col items-center justify-center bg-slate-900/10 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 relative min-h-[350px]">
              <div 
                ref={containerRef} 
                className="relative select-none max-w-full overflow-hidden"
                style={{
                  transform: `rotate(${rotation}deg) scale(${zoom / 100})`,
                  transition: 'transform 0.15s ease-out'
                }}
              >
                <img 
                  ref={imageRef} 
                  src={imageSrc} 
                  alt="Crop preview" 
                  className="max-h-[380px] object-contain block pointer-events-none" 
                />
                
                {/* Drag Mask */}
                <div 
                  className="absolute border-2 border-blue-500 bg-blue-500/10 shadow-2xl cursor-move"
                  style={{
                    left: `${cropBox.x}%`,
                    top: `${cropBox.y}%`,
                    width: `${cropBox.w}%`,
                    height: `${cropBox.h}%`,
                    borderRadius: PRESETS[activePreset].isCircle ? '50%' : '0'
                  }}
                  onMouseDown={(e) => handleMouseDown(e, 'move')}
                >
                  {/* Aspect Ratio Guideline grid lines */}
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                    <div className="border-r border-dashed border-blue-400/40 col-span-1 row-span-3"></div>
                    <div className="border-r border-dashed border-blue-400/40 col-span-1 row-span-3"></div>
                    <div className="border-b border-dashed border-blue-400/40 col-span-3 row-span-1 absolute w-full top-1/3"></div>
                    <div className="border-b border-dashed border-blue-400/40 col-span-3 row-span-1 absolute w-full top-2/3"></div>
                  </div>

                  {/* Resizers */}
                  <div className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-blue-500 rounded-full cursor-nwse-resize z-20" onMouseDown={(e) => handleMouseDown(e, 'nw')} />
                  <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-blue-500 rounded-full cursor-nesw-resize z-20" onMouseDown={(e) => handleMouseDown(e, 'ne')} />
                  <div className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-blue-500 rounded-full cursor-nwse-resize z-20" onMouseDown={(e) => handleMouseDown(e, 'se')} />
                  <div className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-blue-500 rounded-full cursor-nesw-resize z-20" onMouseDown={(e) => handleMouseDown(e, 'sw')} />
                </div>
              </div>
            </div>

            {/* Right Control Settings */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#0f111a]/45 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-2.5">Preset Ratios</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActivePreset(idx)}
                        className={`py-1.5 px-2.5 rounded-lg border text-[10px] font-bold text-left transition-all truncate cursor-pointer ${
                          activePreset === idx
                            ? 'bg-blue-500 border-blue-500 text-white shadow-sm'
                            : theme === 'dark'
                              ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Adjustments */}
                <div className={`p-4 rounded-xl border space-y-4 ${theme === 'dark' ? 'bg-[#0f111a]/45 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Image Adjustments</h3>
                  
                  {/* Zoom Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold text-slate-500">
                      <span className="flex items-center gap-1"><ZoomIn className="w-3.5 h-3.5" /> Zoom</span>
                      <span>{zoom}%</span>
                    </div>
                    <input 
                      type="range"
                      min="50"
                      max="200"
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  {/* Rotation Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold text-slate-500">
                      <span className="flex items-center gap-1"><RotateCw className="w-3.5 h-3.5" /> Rotation</span>
                      <span>{rotation}°</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="360"
                      value={rotation}
                      onChange={(e) => setRotation(Number(e.target.value))}
                      className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <button 
                  onClick={handleCrop}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Crop & Download Image</span>
                </button>

                <button 
                  onClick={() => {
                    setImageSrc(null);
                  }}
                  className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all cursor-pointer"
                >
                  Upload New Image
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
