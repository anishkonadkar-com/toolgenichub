import React, { useState, useRef } from 'react';
import { RefreshCw, Upload, Download, Trash2, Check, Sliders, Layers } from 'lucide-react';
import JSZip from 'jszip';

interface ToolProps {
  triggerNotification: (msg: string) => void;
  theme: 'light' | 'dark';
}

interface SvgItem {
  id: string;
  name: string;
  size: number;
  rawXml: string;
  naturalWidth: number;
  naturalHeight: number;
  convertedUrl: string | null;
  convertedSize: number | null;
  status: 'pending' | 'converting' | 'success' | 'error';
}

export default function SvgToJpgTool({ triggerNotification, theme }: ToolProps) {
  const [svgs, setSvgs] = useState<SvgItem[]>([]);
  const [targetWidth, setTargetWidth] = useState<number>(512);
  const [targetHeight, setTargetHeight] = useState<number>(512);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
  const [dpi, setDpi] = useState<number>(300); // Default to high-res 300 DPI
  const [quality, setQuality] = useState<number>(90);
  const [bgColor, setBgColor] = useState<string>('#ffffff'); // Defaults to clean white
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files;
    if (!uploaded) return;
    addFiles(Array.from(uploaded));
  };

  const addFiles = (fileList: File[]) => {
    const svgFiles = fileList.filter(f => f.name.toLowerCase().endsWith('.svg'));

    if (svgFiles.length === 0) {
      triggerNotification('Please select valid SVG files.');
      return;
    }

    svgFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        
        let width = 512;
        let height = 512;
        try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(text, 'image/svg+xml');
          const svgEl = doc.querySelector('svg');
          if (svgEl) {
            const wAttr = svgEl.getAttribute('width');
            const hAttr = svgEl.getAttribute('height');
            const viewBoxAttr = svgEl.getAttribute('viewBox');

            if (wAttr && !isNaN(parseFloat(wAttr))) {
              width = parseFloat(wAttr);
            }
            if (hAttr && !isNaN(parseFloat(hAttr))) {
              height = parseFloat(hAttr);
            }

            if (viewBoxAttr) {
              const parts = viewBoxAttr.split(/[\s,]+/).map(parseFloat);
              if (parts.length === 4) {
                const vbWidth = parts[2] - parts[0];
                const vbHeight = parts[3] - parts[1];
                if (!wAttr) width = vbWidth;
                if (!hAttr) height = vbHeight;
              }
            }
          }
        } catch (err) {
          console.error('Error parsing SVG dimensions:', err);
        }

        const newItem: SvgItem = {
          id: `${file.name}-${Date.now()}-${index}`,
          name: file.name,
          size: file.size,
          rawXml: text,
          naturalWidth: width,
          naturalHeight: height,
          convertedUrl: null,
          convertedSize: null,
          status: 'pending'
        };

        setSvgs(prev => {
          const updated = [...prev, newItem];
          if (updated.length === 1) {
            setTargetWidth(width);
            setTargetHeight(height);
            setAspectRatio(width / height);
          }
          return updated;
        });
      };
      reader.readAsText(file);
    });

    triggerNotification(`Added ${svgFiles.length} SVG files.`);
  };

  const handleWidthChange = (val: number) => {
    setTargetWidth(val);
    if (lockAspectRatio && aspectRatio) {
      setTargetHeight(Math.round(val / aspectRatio));
    }
  };

  const handleHeightChange = (val: number) => {
    setTargetHeight(val);
    if (lockAspectRatio && aspectRatio) {
      setTargetWidth(Math.round(val * aspectRatio));
    }
  };

  const handleConvert = () => {
    if (svgs.length === 0) return;
    setIsProcessing(true);

    let processedCount = 0;
    const dpiScale = dpi / 96;
    const finalWidth = Math.round(targetWidth * dpiScale);
    const finalHeight = Math.round(targetHeight * dpiScale);

    svgs.forEach((item) => {
      if (item.status === 'success') {
        processedCount++;
        if (processedCount === svgs.length) setIsProcessing(false);
        return;
      }

      setSvgs(prev => prev.map(s => s.id === item.id ? { ...s, status: 'converting' } : s));

      const blob = new Blob([item.rawXml], { type: 'image/svg+xml;charset=utf-8' });
      const blobUrl = URL.createObjectURL(blob);

      const htmlImg = new Image();
      htmlImg.src = blobUrl;
      htmlImg.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = finalWidth;
        canvas.height = finalHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Fill Solid background for JPEG (transparency not supported in JPG/JPEG)
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, finalWidth, finalHeight);
          
          ctx.drawImage(htmlImg, 0, 0, finalWidth, finalHeight);

          // Render as JPEG with specified quality ratio (0.1 to 1.0)
          const jpgDataUrl = canvas.toDataURL('image/jpeg', quality / 100);
          
          const head = 'data:image/jpeg;base64,';
          const sizeInBytes = Math.round((jpgDataUrl.length - head.length) * 3 / 4);

          setSvgs(prev => prev.map(s => {
            if (s.id === item.id) {
              return {
                ...s,
                convertedUrl: jpgDataUrl,
                convertedSize: sizeInBytes,
                status: 'success'
              };
            }
            return s;
          }));
        }

        URL.revokeObjectURL(blobUrl);
        processedCount++;
        if (processedCount === svgs.length) {
          setIsProcessing(false);
          triggerNotification('All SVGs successfully converted to high-quality JPG!');
        }
      };

      htmlImg.onerror = () => {
        URL.revokeObjectURL(blobUrl);
        setSvgs(prev => prev.map(s => s.id === item.id ? { ...s, status: 'error' } : s));
        processedCount++;
        if (processedCount === svgs.length) setIsProcessing(false);
      };
    });
  };

  const removeSvg = (id: string) => {
    setSvgs(prev => {
      const remaining = prev.filter(s => s.id !== id);
      if (remaining.length > 0) {
        setAspectRatio(remaining[0].naturalWidth / remaining[0].naturalHeight);
      } else {
        setAspectRatio(null);
      }
      return remaining;
    });
  };

  const downloadSingle = (item: SvgItem) => {
    if (!item.convertedUrl) return;
    const link = document.createElement('a');
    link.download = item.name.replace(/\.svg$/i, '') + '.jpg';
    link.href = item.convertedUrl;
    link.click();
  };

  const downloadAllAsZip = async () => {
    const readySvgs = svgs.filter(s => s.status === 'success' && s.convertedUrl);
    if (readySvgs.length === 0) return;

    const zip = new JSZip();
    triggerNotification('Compiling JPG ZIP bundle...');

    for (let s of readySvgs) {
      if (!s.convertedUrl) continue;
      const response = await fetch(s.convertedUrl);
      const blob = await response.blob();
      const outputName = s.name.replace(/\.svg$/i, '') + '.jpg';
      zip.file(outputName, blob);
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const zipUrl = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = zipUrl;
    link.download = `rasterized_svg_jpg_images_${Date.now()}.zip`;
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
    <div id="svg-to-jpg-workspace" className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
          <RefreshCw className="w-5 h-5 animate-spin-slow" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">SVG to JPG Converter</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6 font-medium">Convert SVG scalable vector graphics into lightweight flattened JPG images with custom resolutions, dimensions, and compression quality settings.</p>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFiles} 
        accept="image/svg+xml" 
        multiple
        className="hidden" 
      />

      {svgs.length === 0 ? (
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
          <p className="text-xs font-bold text-slate-500">Upload SVG files</p>
          <p className="text-[10px] text-slate-400 mt-1">Batch upload vector files. Adjust compression values and high-resolution scaling multi-threads offline.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Queue */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex justify-between items-center border-b pb-2 dark:border-slate-800 text-xs text-slate-400">
                <span className="font-bold uppercase tracking-wider">Queue: {svgs.length} Vector Files</span>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] font-bold text-emerald-500 hover:underline"
                >
                  + Add SVGs
                </button>
              </div>

              {/* Grid list of svgs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[360px] overflow-y-auto pr-1">
                {svgs.map((item) => (
                  <div 
                    key={item.id}
                    className={`p-3 rounded-xl border flex gap-3 relative transition-all ${
                      theme === 'dark' ? 'bg-[#0f111a]/45 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="w-14 h-14 bg-white/5 rounded-lg border border-slate-200 dark:border-slate-800 shrink-0 flex items-center justify-center overflow-hidden p-1">
                      <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: item.rawXml }} />
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-semibold truncate text-slate-700 dark:text-slate-200">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">Original: {formatSize(item.size)} | Bounds: {item.naturalWidth}x{item.naturalHeight}</p>
                      </div>

                      {item.status === 'success' && item.convertedUrl ? (
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> JPG {formatSize(item.convertedSize)}
                          </span>
                          <button 
                            onClick={() => downloadSingle(item)}
                            className="text-[10px] font-bold text-emerald-500 hover:underline cursor-pointer"
                          >
                            Download JPG
                          </button>
                        </div>
                      ) : item.status === 'converting' ? (
                        <div className="text-[9px] text-blue-500 flex items-center gap-1 mt-2">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Rasterizing...
                        </div>
                      ) : (
                        <div className="text-[9px] text-slate-400 mt-2">Pending...</div>
                      )}
                    </div>

                    <button 
                      onClick={() => removeSvg(item.id)}
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
                  <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-1.5 border-b pb-1.5 dark:border-slate-800">
                    <Sliders className="w-3.5 h-3.5 text-emerald-500" />
                    Canvas Dimensions
                  </h3>

                  {/* Width and Height inputs */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">Target Width (px)</label>
                      <input 
                        type="number"
                        value={targetWidth}
                        onChange={(e) => handleWidthChange(Math.max(1, parseInt(e.target.value) || 0))}
                        className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-semibold focus:outline-none focus:border-emerald-500 ${
                          theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">Target Height (px)</label>
                      <input 
                        type="number"
                        value={targetHeight}
                        onChange={(e) => handleHeightChange(Math.max(1, parseInt(e.target.value) || 0))}
                        className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-semibold focus:outline-none focus:border-emerald-500 ${
                          theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Lock Aspect Ratio Toggle */}
                  <label className="flex items-center gap-2 mb-4 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={lockAspectRatio}
                      onChange={(e) => {
                        setLockAspectRatio(e.target.checked);
                        if (e.target.checked && svgs.length > 0) {
                          const ratio = svgs[0].naturalWidth / svgs[0].naturalHeight;
                          setAspectRatio(ratio);
                          setTargetHeight(Math.round(targetWidth / ratio));
                        }
                      }}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-500"
                    />
                    <span className="font-bold text-slate-500">Lock Aspect Ratio</span>
                  </label>

                  <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-1.5 border-b pb-1.5 dark:border-slate-800 pt-1">
                    🎨 Output Configurations
                  </h3>

                  {/* DPI Selection */}
                  <div className="mb-4">
                    <label className="block text-[10px] font-bold text-slate-400 mb-1.5">Output DPI Preset</label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[72, 96, 150, 300].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setDpi(val)}
                          className={`py-1 text-[10px] font-bold rounded-lg border transition-all ${
                            dpi === val
                              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                              : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                          }`}
                        >
                          {val} DPI
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quality Slider */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between font-bold text-slate-500 text-[10px]">
                      <span>JPG Output Quality:</span>
                      <span className="text-emerald-500">{quality}%</span>
                    </div>
                    <input 
                      type="range"
                      min="10"
                      max="100"
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>

                  {/* Backdrop Color Picker */}
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-slate-500 shrink-0">Backdrop Color:</span>
                    <input 
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-8 h-6 p-0 border-0 cursor-pointer rounded bg-transparent"
                    />
                    <input 
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className={`w-24 px-2 py-0.5 rounded border text-[11px] font-mono focus:outline-none ${
                        theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
                      }`}
                    />
                  </div>

                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-3 text-[10px] text-slate-400 space-y-1">
                  <p>• High-res 300 DPI multiplies canvas layout grids by 3.125x for extreme print crispness.</p>
                  <p>• Since JPG formats do not support transparency layers, a solid backdrop fill is mandatory (defaults to white).</p>
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
                      <span>Rasterizing vector...</span>
                    </>
                  ) : (
                    <span>Convert SVG to JPG</span>
                  )}
                </button>

                {svgs.some(item => item.status === 'success') && (
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={downloadAllAsZip}
                      className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Download ZIP
                    </button>
                    <button 
                      onClick={() => {
                        svgs.forEach(item => {
                          if (item.status === 'success') downloadSingle(item);
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
                    setSvgs([]);
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
