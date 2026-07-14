import React, { useState, useEffect, useRef } from 'react';
import { ImageIcon, Upload, Download, Sliders, RefreshCw, AlertCircle, HelpCircle } from 'lucide-react';

interface ToolProps {
  triggerNotification: (msg: string) => void;
  theme: 'light' | 'dark';
}

export default function ResizeImageTool({ triggerNotification, theme }: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const [unit, setUnit] = useState<'px' | '%' | 'in' | 'cm' | 'mm'>('px');
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [dpi, setDpi] = useState<number>(300);
  const [lockRatio, setLockRatio] = useState<boolean>(true);
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);
  const [aspectRatio, setAspectRatio] = useState<number>(4 / 3);
  const [mode, setMode] = useState<'fit' | 'fill' | 'stretch'>('fit');
  const [format, setFormat] = useState<string>('image/jpeg');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      loadImage(selectedFile);
    }
  };

  const loadImage = (selectedFile: File) => {
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    setResizedUrl(null);

    const img = new Image();
    img.onload = () => {
      setOriginalWidth(img.width);
      setOriginalHeight(img.height);
      setAspectRatio(img.width / img.height);
      setWidth(img.width);
      setHeight(img.height);
    };
    img.src = url;
  };

  const convertValue = (val: number, from: typeof unit, to: typeof unit) => {
    if (from === to) return val;
    // Base is pixels
    let px = val;
    if (from === '%') {
      px = (val / 100) * originalWidth;
    } else if (from === 'in') {
      px = val * dpi;
    } else if (from === 'cm') {
      px = (val / 2.54) * dpi;
    } else if (from === 'mm') {
      px = (val / 25.4) * dpi;
    }

    if (to === 'px') return Math.round(px);
    if (to === '%') return Math.round((px / originalWidth) * 100);
    if (to === 'in') return parseFloat((px / dpi).toFixed(2));
    if (to === 'cm') return parseFloat(((px / dpi) * 2.54).toFixed(2));
    if (to === 'mm') return parseFloat(((px / dpi) * 25.4).toFixed(2));
    return val;
  };

  const handleUnitChange = (newUnit: typeof unit) => {
    const convertedW = convertValue(width, unit, newUnit);
    const convertedH = convertValue(height, unit, newUnit);
    setUnit(newUnit);
    setWidth(convertedW);
    setHeight(convertedH);
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (lockRatio && originalWidth > 0) {
      if (unit === '%') {
        setHeight(val);
      } else {
        // Find pixel width, calc pixel height, convert back to unit
        const pxWidth = convertValue(val, unit, 'px');
        const pxHeight = Math.round(pxWidth / aspectRatio);
        setHeight(convertValue(pxHeight, 'px', unit));
      }
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (lockRatio && originalHeight > 0) {
      if (unit === '%') {
        setWidth(val);
      } else {
        const pxHeight = convertValue(val, unit, 'px');
        const pxWidth = Math.round(pxHeight * aspectRatio);
        setWidth(convertValue(pxWidth, 'px', unit));
      }
    }
  };

  const handleResize = () => {
    if (!previewUrl) return;
    setIsProcessing(true);

    const pxW = Math.round(convertValue(width, unit, 'px'));
    const pxH = Math.round(convertValue(height, unit, 'px'));

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = pxW;
      canvas.height = pxH;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Handle transparency
        if (format === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, pxW, pxH);
        }

        if (mode === 'stretch') {
          ctx.drawImage(img, 0, 0, pxW, pxH);
        } else if (mode === 'fit') {
          const imgRatio = img.width / img.height;
          const canvasRatio = pxW / pxH;
          let drawW = pxW;
          let drawH = pxH;
          let offsetX = 0;
          let offsetY = 0;

          if (imgRatio > canvasRatio) {
            drawH = pxW / imgRatio;
            offsetY = (pxH - drawH) / 2;
          } else {
            drawW = pxH * imgRatio;
            offsetX = (pxW - drawW) / 2;
          }
          ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
        } else if (mode === 'fill') {
          const imgRatio = img.width / img.height;
          const canvasRatio = pxW / pxH;
          let drawW = pxW;
          let drawH = pxH;
          let offsetX = 0;
          let offsetY = 0;

          if (imgRatio > canvasRatio) {
            drawW = pxH * imgRatio;
            offsetX = (pxW - drawW) / 2;
          } else {
            drawH = pxW / imgRatio;
            offsetY = (pxH - drawH) / 2;
          }
          ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
        }

        const dataUrl = canvas.toDataURL(format, 0.92);
        setResizedUrl(dataUrl);
        setIsProcessing(false);
        triggerNotification('Image resized successfully!');
      }
    };
    img.src = previewUrl;
  };

  const handleDownload = () => {
    if (!resizedUrl) return;
    const link = document.createElement('a');
    const ext = format === 'image/png' ? 'png' : format === 'image/webp' ? 'webp' : 'jpg';
    link.download = `toolgenic_resized_${file?.name.replace(/\.[^/.]+$/, "") || 'image'}.${ext}`;
    link.href = resizedUrl;
    link.click();
  };

  const resetAll = () => {
    setFile(null);
    setPreviewUrl(null);
    setResizedUrl(null);
    setWidth(800);
    setHeight(600);
    setUnit('px');
    setLockRatio(true);
    setMode('fit');
  };

  return (
    <div id="resize-image-tool-root" className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
          <ImageIcon className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Professional Image Resizer</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">Scale layout, pixels, print parameters, aspect locking and customize dimensions securely.</p>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFile} 
        accept="image/*" 
        className="hidden" 
      />

      {!file ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-blue-50/10 ${
            theme === 'dark' ? 'border-slate-700 bg-slate-800/10' : 'border-slate-300 bg-slate-50'
          }`}
        >
          <Upload className="w-10 h-10 text-slate-400 mb-3 animate-pulse" />
          <p className="text-xs font-bold text-slate-500">Click to upload your image file (PNG, JPG, WebP)</p>
          <p className="text-[10px] text-slate-400 mt-1">Files are fully secure and never leave your machine.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b pb-2">
                <span className="font-semibold truncate max-w-[200px]">{file.name}</span>
                <span>Original: {originalWidth}x{originalHeight} px</span>
              </div>

              {/* Units */}
              <div>
                <label className="text-[10px] font-extrabold text-slate-400 block mb-1.5 uppercase tracking-wide">Dimension Unit</label>
                <div className="grid grid-cols-5 gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                  {(['px', '%', 'in', 'cm', 'mm'] as const).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => handleUnitChange(u)}
                      className={`py-1 text-xs font-bold rounded-lg transition-all ${
                        unit === u 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dimensions Input */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase tracking-wide">Width</label>
                  <input 
                    type="number" 
                    value={width} 
                    onChange={(e) => handleWidthChange(parseFloat(e.target.value) || 0)}
                    className={`w-full p-2.5 rounded-xl border text-xs font-mono outline-none focus:border-blue-500 ${
                      theme === 'dark' ? 'bg-slate-800/60 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase tracking-wide">Height</label>
                  <input 
                    type="number" 
                    value={height} 
                    onChange={(e) => handleHeightChange(parseFloat(e.target.value) || 0)}
                    className={`w-full p-2.5 rounded-xl border text-xs font-mono outline-none focus:border-blue-500 ${
                      theme === 'dark' ? 'bg-slate-800/60 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
              </div>

              {/* Lock Ratio */}
              <div className="flex items-center gap-2">
                <input 
                  id="lock-ratio-chk"
                  type="checkbox" 
                  checked={lockRatio} 
                  onChange={(e) => setLockRatio(e.target.checked)}
                  className="rounded text-blue-600 border-slate-300 focus:ring-blue-500" 
                />
                <label htmlFor="lock-ratio-chk" className="text-xs font-semibold text-slate-500 cursor-pointer select-none">
                  Lock Aspect Ratio ({aspectRatio.toFixed(2)}:1)
                </label>
              </div>

              {/* DPI / Print Settings */}
              {['in', 'cm', 'mm'].includes(unit) && (
                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 block mb-1.5 uppercase tracking-wide">Target Print Resolution (DPI)</label>
                  <select 
                    value={dpi} 
                    onChange={(e) => setDpi(parseInt(e.target.value))}
                    className={`w-full p-2.5 rounded-xl border text-xs font-sans outline-none focus:border-blue-500 ${
                      theme === 'dark' ? 'bg-slate-800/60 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value={72}>72 DPI (Web standard)</option>
                    <option value={150}>150 DPI (Medium resolution print)</option>
                    <option value={300}>300 DPI (High professional print standard)</option>
                  </select>
                </div>
              )}

              {/* Canvas Scaling Mode */}
              <div>
                <label className="text-[10px] font-extrabold text-slate-400 block mb-1.5 uppercase tracking-wide">Canvas Adjustment Mode</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'fit', label: 'Aspect Fit', desc: 'Add letterbox bounds' },
                    { id: 'fill', label: 'Aspect Fill', desc: 'Smart crop to center' },
                    { id: 'stretch', label: 'Stretch', desc: 'Distort to dimensions' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMode(m.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        mode === m.id 
                          ? 'border-blue-600 bg-blue-50/20 dark:bg-blue-950/20 text-blue-600' 
                          : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="text-xs font-bold">{m.label}</div>
                      <div className="text-[9px] text-slate-400 mt-0.5">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Output Format */}
              <div>
                <label className="text-[10px] font-extrabold text-slate-400 block mb-1.5 uppercase tracking-wide">Output Format</label>
                <div className="grid grid-cols-3 gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                  {[
                    { id: 'image/jpeg', label: 'JPG/JPEG' },
                    { id: 'image/png', label: 'PNG' },
                    { id: 'image/webp', label: 'WEBP' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFormat(f.id)}
                      className={`py-1 text-xs font-bold rounded-lg transition-all ${
                        format === f.id 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button 
                  onClick={resetAll}
                  className="px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 border border-transparent rounded-xl"
                >
                  Reset Settings
                </button>
                <button 
                  onClick={handleResize}
                  disabled={isProcessing}
                  className="flex-1 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-lg hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 transition-all"
                >
                  {isProcessing ? 'Processing...' : 'Apply Dimension Resize'}
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className={`p-4 rounded-xl border flex flex-col items-center justify-center min-h-[300px] ${
              theme === 'dark' ? 'bg-slate-800/30 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              {resizedUrl ? (
                <div className="text-center w-full">
                  <p className="text-xs font-bold text-emerald-500 mb-2">Scaled successfully!</p>
                  <img src={resizedUrl} alt="Resized Result" className="max-h-64 rounded-lg shadow-md object-contain mx-auto mb-3" />
                  <button 
                    onClick={handleDownload}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md hover:bg-emerald-600 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Resized Asset
                  </button>
                </div>
              ) : (
                previewUrl && (
                  <div className="text-center">
                    <img src={previewUrl} alt="Original layout" className="max-h-64 rounded-lg shadow object-contain mx-auto mb-2" />
                    <p className="text-[10px] text-slate-400 font-mono">Original canvas preview ({originalWidth} x {originalHeight}px)</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
