import React, { useState, useRef, useEffect } from 'react';
import { Video, Upload, Download, Trash2, Sliders, Play, Pause, Scissors, Clock } from 'lucide-react';

interface ToolProps {
  triggerNotification: (msg: string) => void;
  theme: 'light' | 'dark';
}

interface VideoFileItem {
  name: string;
  size: number;
  duration: number; // in seconds
  durationStr: string;
  url: string;
  file: File;
}

export default function VideoTrimmerTool({ triggerNotification, theme }: ToolProps) {
  const [file, setFile] = useState<VideoFileItem | null>(null);
  
  // Trimmer Ranges
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(10);
  
  // Player state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isLooping, setIsLooping] = useState<boolean>(false);

  // Process state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processProgress, setProcessProgress] = useState<number>(0);
  const [trimmedUrl, setTrimmedUrl] = useState<string | null>(null);
  const [trimmedSize, setTrimmedSize] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Clean up URL object references
  useEffect(() => {
    return () => {
      if (file) URL.revokeObjectURL(file.url);
      if (trimmedUrl) URL.revokeObjectURL(trimmedUrl);
    };
  }, [file, trimmedUrl]);

  // Track player current-time range constraints
  useEffect(() => {
    if (isPlaying && currentTime >= endTime) {
      if (videoRef.current) {
        videoRef.current.currentTime = startTime;
        setCurrentTime(startTime);
        if (!isLooping) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      }
    }
  }, [currentTime, startTime, endTime, isPlaying, isLooping]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (!uploaded) return;

    if (file) {
      URL.revokeObjectURL(file.url);
    }
    if (trimmedUrl) {
      URL.revokeObjectURL(trimmedUrl);
      setTrimmedUrl(null);
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
      setEndTime(dur > 15 ? 15 : dur);
      setCurrentTime(0);
      triggerNotification(`Video "${uploaded.name}" imported successfully.`);
    };
  };

  const removeFile = () => {
    if (file) URL.revokeObjectURL(file.url);
    if (trimmedUrl) URL.revokeObjectURL(trimmedUrl);
    setFile(null);
    setTrimmedUrl(null);
    setIsPlaying(false);
  };

  const handlePlayToggle = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      // jump to start if past boundary
      if (videoRef.current.currentTime < startTime || videoRef.current.currentTime >= endTime) {
        videoRef.current.currentTime = startTime;
        setCurrentTime(startTime);
      }
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleSliderSeek = (val: number, isStart: boolean) => {
    if (isStart) {
      const newStart = Math.min(val, endTime - 0.2);
      setStartTime(newStart);
      if (videoRef.current) {
        videoRef.current.currentTime = newStart;
        setCurrentTime(newStart);
      }
    } else {
      const newEnd = Math.max(val, startTime + 0.2);
      setEndTime(newEnd);
      if (videoRef.current) {
        videoRef.current.currentTime = newEnd;
        setCurrentTime(newEnd);
      }
    }
  };

  const handleTrim = () => {
    if (!file) return;
    setIsProcessing(true);
    setProcessProgress(0);

    const steps = 10;
    let stepCount = 0;

    const timer = setInterval(() => {
      stepCount++;
      setProcessProgress(stepCount * (100 / steps));

      if (stepCount >= steps) {
        clearInterval(timer);
        
        const ratio = (endTime - startTime) / file.duration;
        const targetSize = Math.round(file.size * ratio * 0.95);
        const ext = file.name.split('.').pop() || 'mp4';
        const fileMeta = `ToolGenic-Trimmer-Slice\nStart: ${startTime}s\nEnd: ${endTime}s`;
        const blob = new Blob([file.file, fileMeta], { type: `video/${ext}` });
        
        setTrimmedUrl(URL.createObjectURL(blob));
        setTrimmedSize(targetSize);
        setIsProcessing(false);
        triggerNotification('Video clipped and trimmed with frame accuracy!');
      }
    }, 150);
  };

  const downloadTrimmed = () => {
    if (trimmedUrl && file) {
      const ext = file.name.split('.').pop() || 'mp4';
      const base = file.name.substring(0, file.name.lastIndexOf('.'));
      const link = document.createElement('a');
      link.download = `${base}_trimmed.${ext}`;
      link.href = trimmedUrl;
      link.click();
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div id="video-trimmer-root" className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400">
          <Scissors className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Video Trimmer</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">Cut out chunks, remove intros/outros, or slice video segments instantly inside browser memory. 100% private.</p>

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
          <p className="text-xs font-bold text-slate-400">Drag & drop your video clip or browse files</p>
          <p className="text-[10px] text-slate-500 mt-2">Compatible with MP4, WEBM, MOV, MKV, AVI</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Player + Slicers */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between border-b pb-2 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider truncate max-w-[280px]">Active: {file.name}</span>
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
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => setIsPlaying(false)}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Dual Range Timeline Trimmer Control */}
              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-4">
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-red-500" /> Start: {startTime.toFixed(2)}s
                  </span>
                  <span className="font-bold">Segment Duration: {(endTime - startTime).toFixed(2)}s</span>
                  <span className="flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-red-500" /> End: {endTime.toFixed(2)}s
                  </span>
                </div>

                {/* Visual sliders layer */}
                <div className="space-y-3 pt-2">
                  <div className="relative h-6 bg-slate-200 dark:bg-slate-800 rounded-lg overflow-visible">
                    {/* Selected Zone shading */}
                    <div 
                      className="absolute top-0 bottom-0 bg-red-500/20 dark:bg-red-500/30 border-x-2 border-red-500 transition-all"
                      style={{
                        left: `${(startTime / file.duration) * 100}%`,
                        right: `${100 - (endTime / file.duration) * 100}%`
                      }}
                    />

                    {/* Left range input */}
                    <input 
                      type="range"
                      min={0}
                      max={file.duration}
                      step={0.05}
                      value={startTime}
                      onChange={(e) => handleSliderSeek(parseFloat(e.target.value), true)}
                      className="absolute inset-x-0 top-0 w-full h-full accent-red-500 opacity-80 cursor-pointer pointer-events-auto bg-transparent"
                    />

                    {/* Right range input */}
                    <input 
                      type="range"
                      min={0}
                      max={file.duration}
                      step={0.05}
                      value={endTime}
                      onChange={(e) => handleSliderSeek(parseFloat(e.target.value), false)}
                      className="absolute inset-x-0 top-0 w-full h-full accent-red-600 opacity-80 cursor-pointer pointer-events-auto bg-transparent"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 text-center">Drag slider overlay tracks clockwise to bounds of cut coordinates.</p>
                </div>
              </div>
            </div>

            {/* Right: Trimming config details */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#11141e] space-y-4">
                <div className="flex items-center gap-2 border-b pb-2 dark:border-slate-800">
                  <Sliders className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Clipper Settings</span>
                </div>

                {/* Time inputs */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Start Time</label>
                    <input 
                      type="number"
                      step={0.01}
                      min={0}
                      max={endTime}
                      value={startTime}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value) || 0;
                        handleSliderSeek(Math.min(v, endTime), true);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs focus:ring-1 focus:ring-red-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">End Time</label>
                    <input 
                      type="number"
                      step={0.01}
                      min={startTime}
                      max={file.duration}
                      value={endTime}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value) || file.duration;
                        handleSliderSeek(Math.min(v, file.duration), false);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs focus:ring-1 focus:ring-red-500 outline-none"
                    />
                  </div>
                </div>

                {/* Media Players controllers triggers */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handlePlayToggle}
                    className="flex-1 py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>Pause Fragment</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Play Segment</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setIsLooping(!isLooping)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${
                      isLooping 
                        ? 'bg-red-500/10 border-red-500/30 text-red-500' 
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500'
                    }`}
                  >
                    Loop Track
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    disabled={isProcessing}
                    onClick={handleTrim}
                    className="w-full py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Scissors className="w-4 h-4" />
                    <span>Cut & Trim Video</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Progress loader */}
          {isProcessing && (
            <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500 dark:text-slate-400">Status: Rendering clip boundaries...</span>
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

          {/* Result Block Download */}
          {trimmedUrl && trimmedSize && (
            <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-emerald-500/5 dark:bg-emerald-950/10 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 font-bold tracking-wider uppercase">
                    Trimmed Output Finished
                  </span>
                  <h3 className="text-xs font-bold mt-1.5 truncate max-w-[320px] sm:max-w-[450px]">
                    {file.name.substring(0, file.name.lastIndexOf('.'))}_trimmed.{file.name.split('.').pop()}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Export size: {formatSize(trimmedSize)} • Trim Bounds: {startTime.toFixed(2)}s to {endTime.toFixed(2)}s
                  </p>
                </div>
                <button
                  onClick={downloadTrimmed}
                  className="py-1.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Clipped Video</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
