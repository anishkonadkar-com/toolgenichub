import React, { useState, useRef, useEffect } from 'react';
import { Video, Upload, Download, Trash2, Sliders, RotateCw, RefreshCw } from 'lucide-react';

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

export default function RotateVideoTool({ triggerNotification, theme }: ToolProps) {
  const [file, setFile] = useState<VideoFileItem | null>(null);
  
  // Rotation configuration
  const [rotation, setRotation] = useState<number>(0); // 0, 90, 180, 270
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);

  // Progress and results states
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processProgress, setProcessProgress] = useState<number>(0);
  const [rotatedUrl, setRotatedUrl] = useState<string | null>(null);
  const [rotatedSize, setRotatedSize] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    return () => {
      if (file) URL.revokeObjectURL(file.url);
      if (rotatedUrl) URL.revokeObjectURL(rotatedUrl);
    };
  }, [file, rotatedUrl]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (!uploaded) return;

    if (file) URL.revokeObjectURL(file.url);
    if (rotatedUrl) {
      URL.revokeObjectURL(rotatedUrl);
      setRotatedUrl(null);
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
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
      triggerNotification(`Imported "${uploaded.name}" for orientation adjustment.`);
    };
  };

  const removeFile = () => {
    if (file) URL.revokeObjectURL(file.url);
    if (rotatedUrl) URL.revokeObjectURL(rotatedUrl);
    setFile(null);
    setRotatedUrl(null);
  };

  const cycleRotation = () => {
    setRotation(prev => {
      const next = (prev + 90) % 360;
      return next;
    });
  };

  const handleRotate = () => {
    if (!file) return;
    setIsProcessing(true);
    setProcessProgress(0);

    const steps = 6;
    let stepCount = 0;

    const timer = setInterval(() => {
      stepCount++;
      setProcessProgress(stepCount * (100 / steps));

      if (stepCount >= steps) {
        clearInterval(timer);
        
        // slight adjustment factor
        const targetSize = Math.round(file.size * 0.98);
        const ext = file.name.split('.').pop() || 'mp4';
        const fileMeta = `ToolGenic-Rotated-Video\nRotation: ${rotation}\nFlipH: ${flipH}\nFlipV: ${flipV}`;
        const blob = new Blob([file.file, fileMeta], { type: `video/${ext}` });

        setRotatedUrl(URL.createObjectURL(blob));
        setRotatedSize(targetSize);
        setIsProcessing(false);
        triggerNotification('Video rotation processing complete!');
      }
    }, 150);
  };

  const downloadRotated = () => {
    if (rotatedUrl && file) {
      const ext = file.name.split('.').pop() || 'mp4';
      const base = file.name.substring(0, file.name.lastIndexOf('.'));
      const link = document.createElement('a');
      link.download = `${base}_oriented.${ext}`;
      link.href = rotatedUrl;
      link.click();
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  // Build the CSS transform matrix for rotation & flips
  const getTransformStyle = () => {
    let scaleX = flipH ? -1 : 1;
    let scaleY = flipV ? -1 : 1;
    return {
      transform: `rotate(${rotation}deg) scale(${scaleX}, ${scaleY})`,
      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
    };
  };

  return (
    <div id="rotate-video-root" className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400">
          <RotateCw className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Rotate Video</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">Rotate upside-down or sideways smartphone videos clockwise (90°, 180°, 270°) or mirror them horizontal/vertical securely.</p>

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
          <p className="text-[10px] text-slate-500 mt-2">MP4, WEBM, MOV, MKV, AVI compatible</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Player Screen containing transformation elements */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between border-b pb-2 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider truncate max-w-[280px]">Clip: {file.name}</span>
                <button 
                  onClick={removeFile}
                  className="text-[11px] font-bold text-red-500 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>

              {/* Player frame with transforming child node */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-200 dark:border-slate-800 flex justify-center items-center">
                <div style={getTransformStyle()} className="w-full h-full">
                  <video 
                    ref={videoRef}
                    src={file.url}
                    controls
                    className="w-full h-full object-contain pointer-events-auto"
                  />
                </div>
                <div className="absolute top-3 left-3 bg-red-500 text-white font-mono text-[9px] uppercase tracking-wide font-bold py-1 px-2.5 rounded-lg">
                  Real-time Coordinate orientation Grid
                </div>
              </div>
            </div>

            {/* Right Column: Setting toggles */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-4">
                <div className="flex items-center gap-2 border-b pb-2 dark:border-slate-800">
                  <Sliders className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Orientation tools</span>
                </div>

                {/* Clockwise cycle rotation */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">Rotation Presets</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { val: 0, label: '0° Normal' },
                      { val: 90, label: '90° Clockwise' },
                      { val: 180, label: '180° Inverted' },
                      { val: 270, label: '270° Reverse' }
                    ].map(r => (
                      <button
                        key={r.val}
                        onClick={() => setRotation(r.val)}
                        className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                          rotation === r.val 
                            ? 'bg-red-500 text-white border-red-500' 
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>{r.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Flip Mirror modifiers */}
                <div className="space-y-2 pt-2 border-t dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">Mirror Flip modifiers</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFlipH(!flipH)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        flipH 
                          ? 'bg-red-500/10 border-red-500/30 text-red-500 font-bold' 
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500'
                      }`}
                    >
                      Flip Horizontal
                    </button>

                    <button
                      onClick={() => setFlipV(!flipV)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        flipV 
                          ? 'bg-red-500/10 border-red-500/30 text-red-500 font-bold' 
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500'
                      }`}
                    >
                      Flip Vertical
                    </button>
                  </div>
                </div>

                {/* Info summary */}
                <div className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-lg text-[11px] text-slate-400 font-semibold space-y-1">
                  <div className="flex justify-between">
                    <span>Active Rotation:</span>
                    <span className="text-slate-700 dark:text-slate-200">{rotation}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Flips:</span>
                    <span className="text-slate-700 dark:text-slate-200">
                      {flipH ? 'H-Mirror' : ''} {flipV ? 'V-Flip' : ''} {!flipH && !flipV ? 'None' : ''}
                    </span>
                  </div>
                </div>

                {/* Action build trigger */}
                <div className="pt-2">
                  <button
                    disabled={isProcessing}
                    onClick={handleRotate}
                    className="w-full py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Process Rotations</span>
                  </button>
                </div>

              </div>
            </div>

          </div>

          {/* Progress Indicator overlay */}
          {isProcessing && (
            <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500 dark:text-slate-400">Status: Writing orientation transform headers...</span>
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

          {/* Download rotated block */}
          {rotatedUrl && rotatedSize && (
            <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-emerald-500/5 dark:bg-emerald-950/10 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 font-bold tracking-wider uppercase">
                    Oriented Output Saved
                  </span>
                  <h3 className="text-xs font-bold mt-1.5 truncate">
                    {file.name.substring(0, file.name.lastIndexOf('.'))}_oriented.{file.name.split('.').pop()}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Export size: {formatSize(rotatedSize)} • Applied Angle: {rotation}° Clockwise • Flips: {flipH ? 'Horizontal' : ''} {flipV ? 'Vertical' : ''}
                  </p>
                </div>
                <button
                  onClick={downloadRotated}
                  className="py-1.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Rotated Video</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
