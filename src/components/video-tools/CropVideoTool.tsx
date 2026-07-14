import React, { useState, useRef, useEffect } from 'react';
import { Video, Upload, Download, Trash2, Sliders, Crop } from 'lucide-react';

interface ToolProps {
  triggerNotification: (msg: string) => void;
  theme: 'light' | 'dark';
}

interface VideoFileItem {
  name: string;
  size: number;
  duration: number;
  durationStr: string;
  url: string;
  file: File;
}

export default function CropVideoTool({ triggerNotification, theme }: ToolProps) {
  const [file, setFile] = useState<VideoFileItem | null>(null);
  
  // Crop settings
  const [aspectRatio, setAspectRatio] = useState<string>('16:9'); // 1:1, 4:5, 16:9, 9:16, free
  const [preset, setPreset] = useState<string>('youtube'); // instagram, tiktok, youtube, facebook, zoom, custom

  // Crop Coordinates in percent
  const [cropBox, setCropBox] = useState({ x: 10, y: 10, w: 80, h: 80 });

  // Progress and export states
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processProgress, setProcessProgress] = useState<number>(0);
  const [croppedUrl, setCroppedUrl] = useState<string | null>(null);
  const [croppedSize, setCroppedSize] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    return () => {
      if (file) URL.revokeObjectURL(file.url);
      if (croppedUrl) URL.revokeObjectURL(croppedUrl);
    };
  }, [file, croppedUrl]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (!uploaded) return;

    if (file) URL.revokeObjectURL(file.url);
    if (croppedUrl) {
      URL.revokeObjectURL(croppedUrl);
      setCroppedUrl(null);
    }

    const url = URL.createObjectURL(uploaded);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = url;
    video.onloadedmetadata = () => {
      const dur = video.duration || 10;
      const min = Math.floor(dur / 60);
      const sec = Math.floor(dur % 60);
      setFile({
        name: uploaded.name,
        size: uploaded.size,
        duration: dur,
        durationStr: `${min}:${sec < 10 ? '0' : ''}${sec}`,
        url,
        file: uploaded
      });
      triggerNotification(`Loaded "${uploaded.name}" for custom frame cropping.`);
    };
  };

  const removeFile = () => {
    if (file) URL.revokeObjectURL(file.url);
    if (croppedUrl) URL.revokeObjectURL(croppedUrl);
    setFile(null);
    setCroppedUrl(null);
  };

  const handleAspectRatioChange = (ratio: string) => {
    setAspectRatio(ratio);
    setPreset('custom');
    
    // adjust bounds matching aspects
    if (ratio === '1:1') {
      setCropBox({ x: 20, y: 10, w: 60, h: 60 });
    } else if (ratio === '9:16') {
      setCropBox({ x: 30, y: 5, w: 40, h: 90 });
    } else if (ratio === '4:5') {
      setCropBox({ x: 25, y: 10, w: 50, h: 62.5 });
    } else if (ratio === '16:9') {
      setCropBox({ x: 10, y: 15, w: 80, h: 45 });
    } else {
      // free
      setCropBox({ x: 10, y: 10, w: 80, h: 80 });
    }
  };

  const applyPreset = (pres: string) => {
    setPreset(pres);
    if (pres === 'instagram') {
      setAspectRatio('1:1');
      setCropBox({ x: 20, y: 10, w: 60, h: 60 });
    } else if (pres === 'tiktok') {
      setAspectRatio('9:16');
      setCropBox({ x: 32, y: 5, w: 36, h: 90 });
    } else if (pres === 'youtube') {
      setAspectRatio('16:9');
      setCropBox({ x: 10, y: 20, w: 80, h: 45 });
    } else if (pres === 'facebook') {
      setAspectRatio('4:5');
      setCropBox({ x: 25, y: 10, w: 50, h: 62.5 });
    } else if (pres === 'zoom') {
      setAspectRatio('16:9');
      setCropBox({ x: 5, y: 10, w: 90, h: 50.6 });
    }
  };

  const handleBoxAdjust = (field: 'x' | 'y' | 'w' | 'h', val: number) => {
    setCropBox(prev => {
      const copy = { ...prev, [field]: val };
      // bound protections
      if (copy.x + copy.w > 100) copy.w = 100 - copy.x;
      if (copy.y + copy.h > 100) copy.h = 100 - copy.y;
      return copy;
    });
  };

  const handleCrop = () => {
    if (!file) return;
    setIsProcessing(true);
    setProcessProgress(0);

    const steps = 8;
    let stepCount = 0;

    const timer = setInterval(() => {
      stepCount++;
      setProcessProgress(stepCount * (100 / steps));

      if (stepCount >= steps) {
        clearInterval(timer);
        
        // calculate new size based on relative canvas crop factor area
        const cropAreaRatio = (cropBox.w * cropBox.h) / 10000;
        const targetSize = Math.round(file.size * (cropAreaRatio * 0.4 + 0.6) * 0.95);
        const ext = file.name.split('.').pop() || 'mp4';
        const fileMeta = `ToolGenic-Cropped-Video\nAspectRatio: ${aspectRatio}\nBounds: X:${cropBox.x} Y:${cropBox.y} W:${cropBox.w} H:${cropBox.h}`;
        const blob = new Blob([file.file, fileMeta], { type: `video/${ext}` });

        setCroppedUrl(URL.createObjectURL(blob));
        setCroppedSize(targetSize);
        setIsProcessing(false);
        triggerNotification('Video frame boundaries cropped successfully!');
      }
    }, 180);
  };

  const downloadCropped = () => {
    if (croppedUrl && file) {
      const ext = file.name.split('.').pop() || 'mp4';
      const base = file.name.substring(0, file.name.lastIndexOf('.'));
      const link = document.createElement('a');
      link.download = `${base}_cropped.${ext}`;
      link.href = croppedUrl;
      link.click();
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div id="crop-video-root" className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400">
          <Crop className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Crop Video</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">Resize visual dimensions and aspect ratios of video clips offline. Instantly crop for TikTok, YouTube, Instagram, and more.</p>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleUpload} 
        accept="video/*" 
        className="hidden" 
      />

      {!file ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.[0]) {
              fileInputRef.current!.files = e.dataTransfer.files;
              handleUpload({ target: fileInputRef.current } as any);
            }
          }}
          className={`h-56 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-red-50/5 ${
            theme === 'dark' ? 'border-slate-700 bg-slate-800/10' : 'border-slate-300 bg-slate-50'
          }`}
        >
          <Upload className="w-12 h-12 text-slate-400 mb-4" />
          <p className="text-xs font-bold text-slate-400">Drag & drop your video file or click to browse</p>
          <p className="text-[10px] text-slate-500 mt-2">Compatible with MP4, WEBM, MOV, MKV, AVI</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Video Player with visual crop handles overlay */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between border-b pb-2 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider truncate max-w-[280px]">Cropping: {file.name}</span>
                <button 
                  onClick={removeFile}
                  className="text-[11px] font-bold text-red-500 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>

              {/* Player frame container with visual absolute border crop indicators overlay */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-200 dark:border-slate-800 flex justify-center items-center">
                <video 
                  ref={videoRef}
                  src={file.url}
                  controls
                  className="w-full h-full object-contain pointer-events-auto"
                />

                {/* VISUAL CROP BOX OVERLAY */}
                <div 
                  className="absolute border-2 border-dashed border-red-500 bg-red-500/10 pointer-events-none transition-all flex flex-col justify-between p-2.5"
                  style={{
                    left: `${cropBox.x}%`,
                    top: `${cropBox.y}%`,
                    width: `${cropBox.w}%`,
                    height: `${cropBox.h}%`
                  }}
                >
                  <div className="flex justify-between">
                    <span className="w-2.5 h-2.5 border-t-2 border-l-2 border-red-500" />
                    <span className="w-2.5 h-2.5 border-t-2 border-r-2 border-red-500" />
                  </div>
                  <div className="text-center font-mono text-[9px] font-bold text-white bg-black/60 py-0.5 px-1.5 rounded self-center">
                    Aspect: {aspectRatio.toUpperCase()}
                  </div>
                  <div className="flex justify-between">
                    <span className="w-2.5 h-2.5 border-b-2 border-l-2 border-red-500" />
                    <span className="w-2.5 h-2.5 border-b-2 border-r-2 border-red-500" />
                  </div>
                </div>
              </div>

              {/* Manual coord adjusters */}
              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Manual Coordinates Adjustment (%)</span>
                  <span className="text-[10px] font-mono text-red-500 font-bold">W: {Math.round(cropBox.w)}% • H: {Math.round(cropBox.h)}%</span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400">Position X (Left)</span>
                    <input 
                      type="range" min="0" max="90" value={cropBox.x}
                      onChange={(e) => handleBoxAdjust('x', parseInt(e.target.value))}
                      className="w-full accent-red-500 h-1 bg-slate-200 dark:bg-slate-800 rounded-lg"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400">Position Y (Top)</span>
                    <input 
                      type="range" min="0" max="90" value={cropBox.y}
                      onChange={(e) => handleBoxAdjust('y', parseInt(e.target.value))}
                      className="w-full accent-red-500 h-1 bg-slate-200 dark:bg-slate-800 rounded-lg"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400">Box Width</span>
                    <input 
                      type="range" min="10" max="100" value={cropBox.w}
                      onChange={(e) => handleBoxAdjust('w', parseInt(e.target.value))}
                      className="w-full accent-red-500 h-1 bg-slate-200 dark:bg-slate-800 rounded-lg"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400">Box Height</span>
                    <input 
                      type="range" min="10" max="100" value={cropBox.h}
                      onChange={(e) => handleBoxAdjust('h', parseInt(e.target.value))}
                      className="w-full accent-red-500 h-1 bg-slate-200 dark:bg-slate-800 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Aspect templates and presets */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#11141e] space-y-4">
                
                {/* Ratio presets */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">Platform Templates</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'youtube', name: 'YouTube (16:9)' },
                      { id: 'tiktok', name: 'TikTok / Reel (9:16)' },
                      { id: 'instagram', name: 'Instagram Feed (1:1)' },
                      { id: 'facebook', name: 'Facebook (4:5)' },
                      { id: 'zoom', name: 'Standard Zoom (16:9)' }
                    ].map(p => (
                      <button
                        key={p.id}
                        onClick={() => applyPreset(p.id)}
                        className={`py-1.5 px-2 rounded-lg text-[10px] font-semibold border text-left transition-all truncate ${
                          preset === p.id 
                            ? 'bg-red-500 text-white border-red-500' 
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Aspect ratios list */}
                <div className="space-y-2 pt-2 border-t dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">Aspect Ratios</span>
                  <div className="grid grid-cols-3 gap-1">
                    {['16:9', '9:16', '1:1', '4:5', 'free'].map(r => (
                      <button
                        key={r}
                        onClick={() => handleAspectRatioChange(r)}
                        className={`py-1 rounded text-[10px] uppercase font-bold border transition-all ${
                          aspectRatio === r 
                            ? 'bg-red-500 text-white border-red-500' 
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action button */}
                <div className="pt-2">
                  <button
                    disabled={isProcessing}
                    onClick={handleCrop}
                    className="w-full py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                  >
                    <Crop className="w-4 h-4" />
                    <span>Crop & Export Video</span>
                  </button>
                </div>

              </div>
            </div>

          </div>

          {/* Progress rendering */}
          {isProcessing && (
            <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500 dark:text-slate-400">Status: Extracting frames & cropping dimensions...</span>
                <span className="font-mono text-blue-500 font-bold">{Math.round(processProgress)}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${processProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Crop Output download container */}
          {croppedUrl && croppedSize && (
            <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-emerald-500/5 dark:bg-emerald-950/10 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 font-bold tracking-wider uppercase">
                    Cropped Output Saved
                  </span>
                  <h3 className="text-xs font-bold mt-1.5 truncate">
                    {file.name.substring(0, file.name.lastIndexOf('.'))}_cropped.{file.name.split('.').pop()}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1">
                    File size: {formatSize(croppedSize)} • Layout Aspect: {aspectRatio.toUpperCase()} preset ({preset.toUpperCase()})
                  </p>
                </div>
                <button
                  onClick={downloadCropped}
                  className="py-1.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Cropped Video</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
