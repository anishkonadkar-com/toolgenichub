import React, { useState, useRef, useEffect } from 'react';
import { ImageIcon, Upload, Download, Sliders, RefreshCw } from 'lucide-react';

interface ToolProps {
  triggerNotification: (msg: string) => void;
  theme: 'light' | 'dark';
}

interface CountryPreset {
  id: string;
  name: string;
  w: number; // width in mm
  h: number; // height in mm
  desc: string;
}

const COUNTRY_PRESETS: CountryPreset[] = [
  { id: 'us', name: 'United States (US)', w: 51, h: 51, desc: '2 x 2 inches, white background' },
  { id: 'in', name: 'India (Passport/Visa)', w: 51, h: 51, desc: '2 x 2 inches or 3.5 x 3.5 cm, white background' },
  { id: 'uk', name: 'United Kingdom (UK)', w: 35, h: 45, desc: '35 x 45 mm, light grey background' },
  { id: 'ca', name: 'Canada (Passport)', w: 50, h: 70, desc: '50 x 70 mm, white background' },
  { id: 'au', name: 'Australia (Visa)', w: 35, h: 45, desc: '35 x 45 mm, plain white/grey' },
  { id: 'eu', name: 'Schengen Europe', w: 35, h: 45, desc: '35 x 45 mm, light background' },
];

export default function PassportPhotoMakerTool({ triggerNotification, theme }: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [preset, setPreset] = useState<string>('us');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [copies, setCopies] = useState<number>(6);
  const [zoom, setZoom] = useState<number>(1);
  const [posX, setPosX] = useState<number>(0);
  const [posY, setPosY] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setProcessedUrl(null);
    }
  };

  const activePreset = COUNTRY_PRESETS.find(p => p.id === preset) || COUNTRY_PRESETS[0];

  const generatePhotoSheet = () => {
    if (!previewUrl) return;
    setIsProcessing(true);

    const img = new Image();
    img.onload = () => {
      // Create individual passport photo card canvas
      const singleCanvas = document.createElement('canvas');
      const dpi = 300;
      // Convert mm to pixels at 300 dpi (1 inch = 25.4 mm)
      const pxW = Math.round((activePreset.w / 25.4) * dpi);
      const pxH = Math.round((activePreset.h / 25.4) * dpi);
      singleCanvas.width = pxW;
      singleCanvas.height = pxH;

      const sCtx = singleCanvas.getContext('2d');
      if (sCtx) {
        // Draw backdrop
        sCtx.fillStyle = bgColor;
        sCtx.fillRect(0, 0, pxW, pxH);

        // Calculate size to draw subject based on zoom
        const imgRatio = img.width / img.height;
        const canvasRatio = pxW / pxH;
        let drawW = pxW * zoom;
        let drawH = (pxW / imgRatio) * zoom;

        if (imgRatio > canvasRatio) {
          drawH = (pxH * imgRatio) * zoom;
        }

        // Apply alignment shifts
        const drawX = (pxW - drawW) / 2 + posX;
        const drawY = (pxH - drawH) / 2 + posY;

        sCtx.drawImage(img, drawX, drawY, drawW, drawH);

        // If copies = 1, just return the single image. Otherwise, make an grid sheet!
        if (copies === 1) {
          setProcessedUrl(singleCanvas.toDataURL('image/jpeg', 0.95));
          setIsProcessing(false);
          triggerNotification('Passport Photo card formatted!');
          return;
        }

        // Layout multiple copies on a standard print layout (e.g. 4x6 inch sheet at 300 dpi = 1200x1800 px)
        const sheetCanvas = document.createElement('canvas');
        sheetCanvas.width = 1800;
        sheetCanvas.height = 1200;
        const shCtx = sheetCanvas.getContext('2d');
        if (shCtx) {
          shCtx.fillStyle = '#FFFFFF';
          shCtx.fillRect(0, 0, sheetCanvas.width, sheetCanvas.height);

          // Arrange in grid (e.g. 2 rows of 3 photos)
          const marginX = 80;
          const marginY = 60;
          const gapX = 40;
          const gapY = 40;

          // Fit dimensions of the photos on grid
          const destW = 450;
          const destH = Math.round(destW * (pxH / pxW));

          let count = 0;
          for (let r = 0; r < 2; r++) {
            for (let c = 0; c < 3; c++) {
              if (count >= copies) break;
              const x = marginX + c * (destW + gapX);
              const y = marginY + r * (destH + gapY);
              shCtx.drawImage(singleCanvas, x, y, destW, destH);
              
              // Draw light cut guideline lines around the photo
              shCtx.strokeStyle = '#e2e8f0';
              shCtx.lineWidth = 1;
              shCtx.strokeRect(x, y, destW, destH);
              count++;
            }
          }

          setProcessedUrl(sheetCanvas.toDataURL('image/jpeg', 0.95));
          setIsProcessing(false);
          triggerNotification('Passport layout sheet generated successfully!');
        }
      }
    };
    img.src = previewUrl;
  };

  const downloadFile = () => {
    if (!processedUrl) return;
    const link = document.createElement('a');
    link.download = `toolgenic_passport_sheet_${preset}.jpg`;
    link.href = processedUrl;
    link.click();
  };

  const resetAll = () => {
    setFile(null);
    setPreviewUrl(null);
    setProcessedUrl(null);
    setZoom(1);
    setPosX(0);
    setPosY(0);
  };

  return (
    <div id="passport-maker-tool-root" className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
          <ImageIcon className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Passport Photo Maker</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">Convert any regular portrait snapshot into official print-ready passport sheets matching country standards.</p>

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
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <p className="text-xs font-bold text-slate-500">Upload your passport portrait photo</p>
          <p className="text-[10px] text-slate-400 mt-1">Make sure you are facing forward under even lighting.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Control Column */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b pb-2">
                <span className="font-semibold truncate max-w-[200px]">{file.name}</span>
                <span>Ready to format</span>
              </div>

              {/* Country standard selection */}
              <div>
                <label className="text-[10px] font-extrabold text-slate-400 block mb-1.5 uppercase tracking-wide">Destination standard guidelines</label>
                <select 
                  value={preset} 
                  onChange={(e) => setPreset(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border text-xs font-sans outline-none focus:border-blue-500 ${
                    theme === 'dark' ? 'bg-slate-800/60 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  {COUNTRY_PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.w}x{p.h} mm)
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1 font-mono">{activePreset.desc}</p>
              </div>

              {/* Alignment and Crop Zoom */}
              <div>
                <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase tracking-wide">Adjust Head Crop Zoom: {Math.round(zoom * 100)}%</label>
                <input 
                  type="range" 
                  min="0.5" 
                  max="2.5" 
                  step="0.05"
                  value={zoom} 
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Position shifts */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase tracking-wide">Horizontal shift (px)</label>
                  <input 
                    type="number" 
                    value={posX} 
                    onChange={(e) => setPosX(parseInt(e.target.value) || 0)}
                    className={`w-full p-2 rounded-xl border text-xs font-mono outline-none ${
                      theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase tracking-wide">Vertical shift (px)</label>
                  <input 
                    type="number" 
                    value={posY} 
                    onChange={(e) => setPosY(parseInt(e.target.value) || 0)}
                    className={`w-full p-2 rounded-xl border text-xs font-mono outline-none ${
                      theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
              </div>

              {/* Background fill */}
              <div>
                <label className="text-[10px] font-extrabold text-slate-400 block mb-1.5 uppercase tracking-wide">Passport Background Backdrop</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { color: '#ffffff', name: 'White' },
                    { color: '#f1f5f9', name: 'Off-White' },
                    { color: '#bfdbfe', name: 'Light Blue' },
                    { color: '#e2e8f0', name: 'Light Grey' },
                  ].map((bg) => (
                    <button
                      key={bg.color}
                      type="button"
                      onClick={() => setBgColor(bg.color)}
                      className={`p-1.5 rounded-lg border text-xs font-semibold text-center transition-all ${
                        bgColor === bg.color 
                          ? 'border-blue-600 ring-2 ring-blue-500/20' 
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full mx-auto block mb-1 border" style={{ backgroundColor: bg.color }}></span>
                      <span className="text-[9px] block text-slate-500">{bg.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prints Count */}
              <div>
                <label className="text-[10px] font-extrabold text-slate-400 block mb-1.5 uppercase tracking-wide font-sans">Layout Print Grid copies</label>
                <div className="grid grid-cols-4 gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                  {[
                    { id: 1, label: '1 Copy' },
                    { id: 2, label: '2 Copies' },
                    { id: 4, label: '4 Copies' },
                    { id: 6, label: 'Grid Sheet' },
                  ].map((cop) => (
                    <button
                      key={cop.id}
                      type="button"
                      onClick={() => setCopies(cop.id)}
                      className={`py-1 text-xs font-bold rounded-lg transition-all ${
                        copies === cop.id 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      {cop.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  onClick={resetAll}
                  className="px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl"
                >
                  Reset
                </button>
                <button 
                  onClick={generatePhotoSheet}
                  className="flex-1 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-lg hover:bg-blue-700 transition-all"
                >
                  Generate Passport Layout
                </button>
              </div>
            </div>

            {/* Preview Sheet Panel */}
            <div className={`p-4 rounded-xl border flex flex-col items-center justify-center min-h-[300px] ${
              theme === 'dark' ? 'bg-slate-800/30 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              {processedUrl ? (
                <div className="text-center w-full">
                  <p className="text-xs font-bold text-emerald-500 mb-2">Print Layout Created Successfully!</p>
                  <img src={processedUrl} alt="Passport Sheet" className="max-h-64 rounded-lg shadow-md border object-contain mx-auto mb-3" />
                  <button 
                    onClick={downloadFile}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md hover:bg-emerald-600 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Printable Sheet
                  </button>
                </div>
              ) : (
                previewUrl && (
                  <div className="text-center relative w-full">
                    {/* Simulated Guides overlay to help align face */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="w-28 h-36 border-2 border-dashed border-red-500/60 rounded-[50%] flex flex-col items-center justify-center">
                        <div className="w-full border-t border-dashed border-red-500/40"></div>
                        <span className="text-[8px] bg-red-500 text-white px-1 py-0.5 rounded mt-1 font-mono tracking-wide scale-75">ALIGN HEAD</span>
                      </div>
                    </div>
                    <img src={previewUrl} alt="Original alignment" className="max-h-64 rounded-lg shadow object-contain mx-auto mb-2" />
                    <p className="text-[10px] text-slate-400">Position the head inside the guide red frame then generate.</p>
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
