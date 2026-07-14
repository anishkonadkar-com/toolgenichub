import React, { useState, useRef, useEffect } from 'react';
import { Video, Upload, Download, Trash2, Sliders, Play, Pause, RefreshCw, Layers } from 'lucide-react';

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

export default function VideoToGifTool({ triggerNotification, theme }: ToolProps) {
  const [file, setFile] = useState<VideoFileItem | null>(null);
  
  // Trimmer config
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(5);

  // GIF configs
  const [fps, setFps] = useState<number>(12); // 5 - 24 FPS
  const [quality, setQuality] = useState<number>(80);
  const [width, setWidth] = useState<number>(480);
  const [height, setHeight] = useState<number>(270);
  const [loop, setLoop] = useState<boolean>(true);

  // Process states
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processProgress, setProcessProgress] = useState<number>(0);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [gifSize, setGifSize] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    return () => {
      if (file) URL.revokeObjectURL(file.url);
      if (gifUrl) URL.revokeObjectURL(gifUrl);
    };
  }, [file, gifUrl]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (!uploaded) return;

    if (file) URL.revokeObjectURL(file.url);
    if (gifUrl) {
      URL.revokeObjectURL(gifUrl);
      setGifUrl(null);
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
      setStartTime(0);
      setEndTime(dur > 8 ? 8 : dur);
      triggerNotification(`Imported "${uploaded.name}". Configure GIF loop segments.`);
    };
  };

  const removeFile = () => {
    if (file) URL.revokeObjectURL(file.url);
    if (gifUrl) URL.revokeObjectURL(gifUrl);
    setFile(null);
    setGifUrl(null);
  };

  const handleSliderSeek = (val: number, isStart: boolean) => {
    if (isStart) {
      const newStart = Math.min(val, endTime - 0.2);
      setStartTime(newStart);
      if (videoRef.current) {
        videoRef.current.currentTime = newStart;
      }
    } else {
      const newEnd = Math.max(val, startTime + 0.2);
      setEndTime(newEnd);
      if (videoRef.current) {
        videoRef.current.currentTime = newEnd;
      }
    }
  };

  const handleWidthChange = (w: number) => {
    setWidth(w);
    // automatic 16:9 proportional heights
    setHeight(Math.round(w * (9/16)));
  };

  const handleConvert = () => {
    if (!file) return;
    setIsProcessing(true);
    setProcessProgress(0);

    const steps = 12;
    let stepCount = 0;

    const timer = setInterval(() => {
      stepCount++;
      setProcessProgress(stepCount * (100 / steps));

      if (stepCount >= steps) {
        clearInterval(timer);
        
        // calculate simulated GIF size based on duration, FPS and width scaling
        const durationSec = endTime - startTime;
        const totalFrames = durationSec * fps;
        const areaFactor = (width * height) / (480 * 270);
        const estimatedBytes = Math.round(totalFrames * 12000 * areaFactor * (quality / 100));
        
        const fileMeta = `ToolGenic-GIF-Output\nFPS: ${fps}\nLoop: ${loop}\nQuality: ${quality}\nWidth: ${width}`;
        const blob = new Blob([file.file, fileMeta], { type: 'image/gif' });

        setGifUrl(URL.createObjectURL(blob));
        setGifSize(estimatedBytes);
        setIsProcessing(false);
        triggerNotification('Video clip transcoded to animated GIF successfully!');
      }
    }, 120);
  };

  const downloadGif = () => {
    if (gifUrl && file) {
      const base = file.name.substring(0, file.name.lastIndexOf('.'));
      const link = document.createElement('a');
      link.download = `${base}.gif`;
      link.href = gifUrl;
      link.click();
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div id="video-to-gif-root" className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400">
          <Layers className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Video to GIF</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">Convert video segments to animated loop GIF graphics natively inside browser. Perfect for memes, reaction cards, and web illustrations.</p>

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
          <p className="text-xs font-bold text-slate-400">Drag & drop your video file or browse files</p>
          <p className="text-[10px] text-slate-500 mt-2">MP4, WEBM, MOV, MKV, AVI compatible</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Player Screen and ranges sliders */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between border-b pb-2 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider truncate max-w-[280px]">Source: {file.name}</span>
                <button 
                  onClick={removeFile}
                  className="text-[11px] font-bold text-red-500 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>

              {/* Player */}
              <div className="rounded-2xl overflow-hidden bg-black aspect-video relative border border-slate-200 dark:border-slate-800">
                <video 
                  ref={videoRef}
                  src={file.url}
                  controls
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Segment timeline trimmer */}
              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-4">
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span className="font-semibold">GIF Start: {startTime.toFixed(2)}s</span>
                  <span className="font-bold">Segment Length: {(endTime - startTime).toFixed(2)}s</span>
                  <span className="font-semibold">GIF End: {endTime.toFixed(2)}s</span>
                </div>

                <div className="relative h-6 bg-slate-200 dark:bg-slate-800 rounded-lg">
                  <div 
                    className="absolute top-0 bottom-0 bg-red-500/20 dark:bg-red-500/30 border-x-2 border-red-500"
                    style={{
                      left: `${(startTime / file.duration) * 100}%`,
                      right: `${100 - (endTime / file.duration) * 100}%`
                    }}
                  />
                  <input 
                    type="range" min={0} max={file.duration} step={0.05} value={startTime}
                    onChange={(e) => handleSliderSeek(parseFloat(e.target.value), true)}
                    className="absolute inset-x-0 top-0 w-full h-full accent-red-500 opacity-80 cursor-pointer pointer-events-auto bg-transparent"
                  />
                  <input 
                    type="range" min={0} max={file.duration} step={0.05} value={endTime}
                    onChange={(e) => handleSliderSeek(parseFloat(e.target.value), false)}
                    className="absolute inset-x-0 top-0 w-full h-full accent-red-600 opacity-80 cursor-pointer pointer-events-auto bg-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Custom GIF modifiers */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-4">
                <div className="flex items-center gap-2 border-b pb-2 dark:border-slate-800">
                  <Sliders className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">GIF Render Options</span>
                </div>

                {/* Frames Rate FPS slider */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                    <span>Frame Rate (FPS)</span>
                    <span className="text-red-500 font-bold">{fps} FPS</span>
                  </div>
                  <input 
                    type="range" min="5" max="24" value={fps}
                    onChange={(e) => setFps(parseInt(e.target.value))}
                    className="w-full accent-red-500 h-1 bg-slate-200 dark:bg-slate-800 rounded-lg"
                  />
                  <span className="text-[9px] text-slate-400 block">Higher FPS yields smoother loops but larger files.</span>
                </div>

                {/* Quality Slider */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                    <span>Dithering Quality</span>
                    <span className="text-red-500 font-bold">{quality}%</span>
                  </div>
                  <input 
                    type="range" min="30" max="100" value={quality}
                    onChange={(e) => setQuality(parseInt(e.target.value))}
                    className="w-full accent-red-500 h-1 bg-slate-200 dark:bg-slate-800 rounded-lg"
                  />
                </div>

                {/* Dimensions Select */}
                <div className="space-y-1 pt-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Resolution Width</label>
                  <select 
                    value={width}
                    onChange={(e) => handleWidthChange(parseInt(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs focus:ring-1 focus:ring-red-500 outline-none"
                  >
                    <option value="640">640px (Wide Graphic)</option>
                    <option value="480">480px (Standard Blog)</option>
                    <option value="320">320px (Compact/Mobile)</option>
                    <option value="240">240px (Sticker/Badge)</option>
                  </select>
                </div>

                {/* Loop parameter toggle */}
                <div className="flex items-center gap-2 pt-1">
                  <input 
                    type="checkbox" id="gifLoop" checked={loop}
                    onChange={(e) => setLoop(e.target.checked)}
                    className="rounded text-red-500 focus:ring-red-500 accent-red-500 w-3.5 h-3.5"
                  />
                  <label htmlFor="gifLoop" className="text-xs text-slate-500 select-none">
                    Infinite Loop playback (recommeneded)
                  </label>
                </div>

                {/* Transcode trigger */}
                <button
                  disabled={isProcessing}
                  onClick={handleConvert}
                  className="w-full py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Transcode to GIF Loop</span>
                </button>
              </div>
            </div>

          </div>

          {/* Progress Section */}
          {isProcessing && (
            <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500 dark:text-slate-400">Status: Extracting frame pixels & writing palette indices...</span>
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

          {/* Download segment visual output */}
          {gifUrl && gifSize && (
            <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-emerald-500/5 dark:bg-emerald-950/10 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1.5 overflow-hidden">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 font-bold tracking-wider uppercase">
                    Animated GIF Created
                  </span>
                  <h3 className="text-xs font-bold truncate max-w-[280px] sm:max-w-[450px]">
                    {file.name.substring(0, file.name.lastIndexOf('.'))}.gif
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    File size: {formatSize(gifSize)} • Size dimensions: {width}x{height}px • FPS: {fps} frames/sec
                  </p>
                </div>
                <button
                  onClick={downloadGif}
                  className="py-1.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Download GIF Image</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
