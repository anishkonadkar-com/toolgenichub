import React, { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Upload, Download, Type, Sliders, Layout, RotateCw, AlignCenter } from 'lucide-react';

interface ToolProps {
  triggerNotification: (msg: string) => void;
  theme: 'light' | 'dark';
}

type PositionMode = 'tl' | 'tc' | 'tr' | 'cl' | 'cc' | 'cr' | 'bl' | 'bc' | 'br';

const POSITIONS: { label: string; value: PositionMode }[] = [
  { label: 'Top Left', value: 'tl' },
  { label: 'Top Center', value: 'tc' },
  { label: 'Top Right', value: 'tr' },
  { label: 'Center Left', value: 'cl' },
  { label: 'Center', value: 'cc' },
  { label: 'Center Right', value: 'cr' },
  { label: 'Bottom Left', value: 'bl' },
  { label: 'Bottom Center', value: 'bc' },
  { label: 'Bottom Right', value: 'br' }
];

export default function AddWatermarkTool({ triggerNotification, theme }: ToolProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>('image.png');
  const [watermarkType, setWatermarkType] = useState<'text' | 'image'>('text');
  
  // Text Watermark States
  const [text, setText] = useState<string>('ToolGenic Copyright');
  const [color, setColor] = useState<string>('#ffffff');
  const [fontSize, setFontSize] = useState<number>(32);
  const [opacity, setOpacity] = useState<number>(50);
  const [rotation, setRotation] = useState<number>(0);
  const [position, setPosition] = useState<PositionMode>('br');

  // Image Watermark States
  const [watermarkImageSrc, setWatermarkImageSrc] = useState<string | null>(null);
  const [watermarkScale, setWatermarkScale] = useState<number>(20); // percent of main image width

  const fileInputRef = useRef<HTMLInputElement>(null);
  const watermarkFileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mainImageRef = useRef<HTMLImageElement>(null);
  const watermarkImageRef = useRef<HTMLImageElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    loadImage(file);
  };

  const handleWatermarkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setWatermarkImageSrc(event.target?.result as string);
      triggerNotification('Watermark graphic loaded successfully!');
    };
    reader.readAsDataURL(file);
  };

  const loadImage = (file: File) => {
    setImageName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target?.result as string);
      triggerNotification('Main photo loaded. Configure your watermark.');
    };
    reader.readAsDataURL(file);
  };

  const drawWatermark = () => {
    const canvas = canvasRef.current;
    const img = mainImageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Standardize canvas dimensions to match the source image natural resolution
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Draw main image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    // Save context state for watermark transparency/rotation parameters
    ctx.save();
    ctx.globalAlpha = opacity / 100;

    let x = 0;
    let y = 0;
    const margin = canvas.width * 0.05; // 5% margin from edges

    if (watermarkType === 'text') {
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.fillStyle = color;
      ctx.textBaseline = 'middle';
      const textMetrics = ctx.measureText(text);
      const textWidth = textMetrics.width;
      const textHeight = fontSize;

      // Position math
      switch (position) {
        case 'tl':
          x = margin;
          y = margin + textHeight / 2;
          ctx.textAlign = 'left';
          break;
        case 'tc':
          x = canvas.width / 2;
          y = margin + textHeight / 2;
          ctx.textAlign = 'center';
          break;
        case 'tr':
          x = canvas.width - margin;
          y = margin + textHeight / 2;
          ctx.textAlign = 'right';
          break;
        case 'cl':
          x = margin;
          y = canvas.height / 2;
          ctx.textAlign = 'left';
          break;
        case 'cc':
          x = canvas.width / 2;
          y = canvas.height / 2;
          ctx.textAlign = 'center';
          break;
        case 'cr':
          x = canvas.width - margin;
          y = canvas.height / 2;
          ctx.textAlign = 'right';
          break;
        case 'bl':
          x = margin;
          y = canvas.height - margin - textHeight / 2;
          ctx.textAlign = 'left';
          break;
        case 'bc':
          x = canvas.width / 2;
          y = canvas.height - margin - textHeight / 2;
          ctx.textAlign = 'center';
          break;
        case 'br':
          x = canvas.width - margin;
          y = canvas.height - margin - textHeight / 2;
          ctx.textAlign = 'right';
          break;
      }

      // Apply rotation around calculated point
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.fillText(text, 0, 0);

    } else if (watermarkType === 'image' && watermarkImageRef.current) {
      const wmImg = watermarkImageRef.current;
      const wmAspect = wmImg.naturalWidth / wmImg.naturalHeight;
      const wmWidth = canvas.width * (watermarkScale / 100);
      const wmHeight = wmWidth / wmAspect;

      // Position math for image block bounds
      switch (position) {
        case 'tl':
          x = margin;
          y = margin;
          break;
        case 'tc':
          x = canvas.width / 2 - wmWidth / 2;
          y = margin;
          break;
        case 'tr':
          x = canvas.width - margin - wmWidth;
          y = margin;
          break;
        case 'cl':
          x = margin;
          y = canvas.height / 2 - wmHeight / 2;
          break;
        case 'cc':
          x = canvas.width / 2 - wmWidth / 2;
          y = canvas.height / 2 - wmHeight / 2;
          break;
        case 'cr':
          x = canvas.width - margin - wmWidth;
          y = canvas.height / 2 - wmHeight / 2;
          break;
        case 'bl':
          x = margin;
          y = canvas.height - margin - wmHeight;
          break;
        case 'bc':
          x = canvas.width / 2 - wmWidth / 2;
          y = canvas.height - margin - wmHeight;
          break;
        case 'br':
          x = canvas.width - margin - wmWidth;
          y = canvas.height - margin - wmHeight;
          break;
      }

      ctx.translate(x + wmWidth / 2, y + wmHeight / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(wmImg, -wmWidth / 2, -wmHeight / 2, wmWidth, wmHeight);
    }

    ctx.restore();
  };

  useEffect(() => {
    if (imageSrc) {
      // Delay slightly to ensure canvas DOM painting is fully aligned
      const t = setTimeout(drawWatermark, 100);
      return () => clearTimeout(t);
    }
  }, [imageSrc, watermarkType, text, color, fontSize, opacity, rotation, position, watermarkImageSrc, watermarkScale]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `watermarked_${imageName}`;
    link.href = dataUrl;
    link.click();

    triggerNotification('Watermarked image downloaded successfully!');
  };

  return (
    <div id="add-watermark-root" className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
          <Type className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Add Watermark</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6 font-medium">Add text signatures, brand copyrights, or graphical logos onto images with custom alignments and real-time previews.</p>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      <input 
        type="file" 
        ref={watermarkFileInputRef} 
        onChange={handleWatermarkFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Hidden images loaded for source elements to draw on canvas */}
      {imageSrc && (
        <img 
          ref={mainImageRef} 
          src={imageSrc} 
          alt="Main hidden source" 
          className="hidden" 
          onLoad={drawWatermark}
        />
      )}
      {watermarkImageSrc && (
        <img 
          ref={watermarkImageRef} 
          src={watermarkImageSrc} 
          alt="Watermark hidden source" 
          className="hidden" 
          onLoad={drawWatermark}
        />
      )}

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
          <p className="text-xs font-bold text-slate-500">Upload Target Image</p>
          <p className="text-[10px] text-slate-400 mt-1">Supports PNG, JPG, WEBP formats. Secure completely offline canvas stitching.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Workspace (Canvas display preview) */}
            <div className="lg:col-span-8 flex flex-col items-center justify-center bg-slate-900/10 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 relative min-h-[350px]">
              <canvas 
                ref={canvasRef} 
                className="max-w-full max-h-[380px] object-contain rounded-lg shadow-xl"
              />
            </div>

            {/* Right Settings */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                
                {/* Type Selection */}
                <div className={`p-1 rounded-xl border flex ${theme === 'dark' ? 'bg-[#0f111a]/45 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <button
                    onClick={() => setWatermarkType('text')}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold text-center transition-all cursor-pointer ${
                      watermarkType === 'text'
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'
                    }`}
                  >
                    Text Copyright
                  </button>
                  <button
                    onClick={() => setWatermarkType('image')}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold text-center transition-all cursor-pointer ${
                      watermarkType === 'image'
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'
                    }`}
                  >
                    Image Logo
                  </button>
                </div>

                {/* Configurations */}
                <div className={`p-4 rounded-xl border space-y-4 ${theme === 'dark' ? 'bg-[#0f111a]/45 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-blue-500" />
                    Watermark Attributes
                  </h3>

                  {watermarkType === 'text' ? (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-500">Watermark Text:</span>
                        <input 
                          type="text"
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          className={`w-full p-2 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                            theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
                          }`}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500">Color:</span>
                          <div className="flex items-center gap-1.5 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 bg-white dark:bg-slate-900">
                            <input 
                              type="color" 
                              value={color} 
                              onChange={(e) => setColor(e.target.value)}
                              className="w-4 h-4 cursor-pointer rounded-full overflow-hidden p-0 border-none shrink-0" 
                            />
                            <span className="text-[10px] font-mono select-none truncate">{color}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500">Size (px):</span>
                          <input 
                            type="number"
                            min="10"
                            max="200"
                            value={fontSize}
                            onChange={(e) => setFontSize(Number(e.target.value))}
                            className={`w-full p-1.5 text-xs rounded border focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                              theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <span className="text-[10px] font-bold text-slate-500 block">Watermark Logo graphic:</span>
                      {!watermarkImageSrc ? (
                        <button
                          onClick={() => watermarkFileInputRef.current?.click()}
                          className="w-full py-2 bg-slate-100 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 text-[10px] font-bold text-slate-500 rounded-lg"
                        >
                          + Upload Custom Logo PNG
                        </button>
                      ) : (
                        <div className="flex items-center justify-between gap-2 p-1.5 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900">
                          <img src={watermarkImageSrc} className="w-10 h-10 object-contain rounded border" alt="Watermark logo thumbnail" />
                          <button
                            onClick={() => {
                              setWatermarkImageSrc(null);
                              drawWatermark();
                            }}
                            className="text-[10px] font-bold text-red-500 hover:underline"
                          >
                            Remove Logo
                          </button>
                        </div>
                      )}

                      {/* Image Logo Scale Slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-bold text-slate-500">
                          <span>Scale Logo size:</span>
                          <span>{watermarkScale}%</span>
                        </div>
                        <input 
                          type="range"
                          min="5"
                          max="80"
                          value={watermarkScale}
                          onChange={(e) => setWatermarkScale(Number(e.target.value))}
                          className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Shared Sliders: Opacity and Rotation */}
                  <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                    {/* Opacity slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold text-slate-500">
                        <span>Watermark Opacity:</span>
                        <span>{opacity}%</span>
                      </div>
                      <input 
                        type="range"
                        min="5"
                        max="100"
                        value={opacity}
                        onChange={(e) => setOpacity(Number(e.target.value))}
                        className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>

                    {/* Rotation slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold text-slate-500">
                        <span>Rotation Rotation:</span>
                        <span>{rotation}°</span>
                      </div>
                      <input 
                        type="range"
                        min="-180"
                        max="180"
                        value={rotation}
                        onChange={(e) => setRotation(Number(e.target.value))}
                        className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Alignment Grid Box */}
                <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#0f111a]/45 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Layout className="w-3.5 h-3.5 text-blue-500" />
                    Overlay Alignment
                  </h3>

                  <div className="grid grid-cols-3 gap-1">
                    {POSITIONS.map((pos) => (
                      <button
                        key={pos.value}
                        onClick={() => setPosition(pos.value)}
                        className={`py-1 text-[8px] font-bold rounded border truncate transition-all cursor-pointer ${
                          position === pos.value
                            ? 'border-blue-500 text-blue-500 bg-blue-500/5'
                            : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:border-slate-300'
                        }`}
                        title={pos.label}
                      >
                        {pos.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              <div className="space-y-2.5">
                <button 
                  onClick={handleDownload}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Watermarked Image</span>
                </button>

                <button 
                  onClick={() => {
                    setImageSrc(null);
                    setWatermarkImageSrc(null);
                  }}
                  className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all cursor-pointer"
                >
                  Reset / Upload New Image
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
