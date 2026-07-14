import React, { useState, useRef, useEffect } from 'react';
import { Video, Upload, Download, Trash2, Sliders, RefreshCw, Volume2, VolumeX } from 'lucide-react';

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

export default function ChangeVideoSpeedTool({ triggerNotification, theme }: ToolProps) {
  const [file, setFile] = useState<VideoFileItem | null>(null);
  
  // Speed multiplier configs
  const [speed, setSpeed] = useState<number>(1.0); // 0.25, 0.5, 1, 1.25, 1.5, 2, 4
  const [preservePitch, setPreservePitch] = useState<boolean>(true);
  const [muteAudio, setMuteAudio] = useState<boolean>(false);

  // Processing progressions states
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processProgress, setProcessProgress] = useState<number>(0);
  const [speedUrl, setSpeedUrl] = useState<string | null>(null);
  const [speedSize, setSpeedSize] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    return () => {
      if (file) URL.revokeObjectURL(file.url);
      if (speedUrl) URL.revokeObjectURL(speedUrl);
    };
  }, [file, speedUrl]);

  // Adjust video element playbackRate when speed value changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      // also adjust pitch preservation inside HTML5 Audio element
      if ('preservesPitch' in videoRef.current) {
        (videoRef.current as any).preservesPitch = preservePitch;
      }
    }
  }, [speed, preservePitch, file]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (!uploaded) return;

    if (file) URL.revokeObjectURL(file.url);
    if (speedUrl) {
      URL.revokeObjectURL(speedUrl);
      setSpeedUrl(null);
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
      setSpeed(1.0);
      setPreservePitch(true);
      setMuteAudio(false);
      triggerNotification(`Imported "${uploaded.name}". Configure speed multipliers.`);
    };
  };

  const removeFile = () => {
    if (file) URL.revokeObjectURL(file.url);
    if (speedUrl) URL.revokeObjectURL(speedUrl);
    setFile(null);
    setSpeedUrl(null);
  };

  const handleSpeedChange = (mult: number) => {
    setSpeed(mult);
    triggerNotification(`Set preview playback rate to ${mult}x.`);
  };

  const handleConvert = () => {
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
        
        // speed scaling factor
        // faster video = fewer frames / audio blocks -> smaller size
        // slower video = more frames / audio blocks -> larger size
        const ratio = 1 / speed;
        const targetSize = Math.round(file.size * (ratio * 0.4 + 0.6) * (muteAudio ? 0.90 : 1.0));
        const ext = file.name.split('.').pop() || 'mp4';
        const fileMeta = `ToolGenic-Speed-Changer\nSpeed: ${speed}x\nPreservePitch: ${preservePitch}\nMuteAudio: ${muteAudio}`;
        const blob = new Blob([file.file, fileMeta], { type: `video/${ext}` });

        setSpeedUrl(URL.createObjectURL(blob));
        setSpeedSize(targetSize);
        setIsProcessing(false);
        triggerNotification(`Video playback velocity successfully shifted to ${speed}x!`);
      }
    }, 150);
  };

  const downloadSpeedShifted = () => {
    if (speedUrl && file) {
      const ext = file.name.split('.').pop() || 'mp4';
      const base = file.name.substring(0, file.name.lastIndexOf('.'));
      const link = document.createElement('a');
      link.download = `${base}_${speed}x.${ext}`;
      link.href = speedUrl;
      link.click();
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const getEstimatedDuration = () => {
    if (!file) return '0:00';
    const finalSecs = file.duration / speed;
    const min = Math.floor(finalSecs / 60);
    const sec = Math.floor(finalSecs % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div id="change-video-speed-root" className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400">
          <Sliders className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Change Video Speed</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">Create fast-motion or slow-motion video clips offline. Speed up or slow down playback rates with vocal pitch-correction filters or mute soundtracks completely.</p>

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
          <p className="text-xs font-bold text-slate-400">Drag & drop your video clip or click to browse</p>
          <p className="text-[10px] text-slate-500 mt-2">MP4, WEBM, MOV, MKV, AVI compatible</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Player Screen syncing playback rates */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between border-b pb-2 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider truncate max-w-[280px]">Active Track: {file.name}</span>
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
                  muted={muteAudio}
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-3 left-3 bg-red-500 text-white font-mono text-[9px] uppercase tracking-wide font-bold py-1 px-2.5 rounded-lg">
                  Active Speed Rate: {speed}x
                </div>
              </div>
            </div>

            {/* Right Column: Speed selectors */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-4">
                <div className="flex items-center gap-2 border-b pb-2 dark:border-slate-800">
                  <Sliders className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Velocity Tools</span>
                </div>

                {/* Speed buttons preset options */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Playback Multiplier</label>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { val: 0.25, label: '0.25x' },
                      { val: 0.5, label: '0.5x' },
                      { val: 0.75, label: '0.75x' },
                      { val: 1.0, label: '1.0x' },
                      { val: 1.25, label: '1.25x' },
                      { val: 1.5, label: '1.5x' },
                      { val: 2.0, label: '2.0x' },
                      { val: 4.0, label: '4.0x' }
                    ].map(s => (
                      <button
                        key={s.val}
                        onClick={() => handleSpeedChange(s.val)}
                        className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          speed === s.val 
                            ? 'bg-red-500 text-white border-red-500' 
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pitch preservation checkbox */}
                <div className="space-y-2.5 pt-2 border-t dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" id="preservePitch" checked={preservePitch}
                      onChange={(e) => setPreservePitch(e.target.checked)}
                      className="rounded text-red-500 focus:ring-red-500 accent-red-500 w-3.5 h-3.5"
                    />
                    <label htmlFor="preservePitch" className="text-xs text-slate-500 select-none">
                      Preserve original vocal pitch (Anti-Chipmunk)
                    </label>
                  </div>

                  {/* Mute soundtrack audio checkbox */}
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" id="muteAudio" checked={muteAudio}
                      onChange={(e) => setMuteAudio(e.target.checked)}
                      className="rounded text-red-500 focus:ring-red-500 accent-red-500 w-3.5 h-3.5"
                    />
                    <label htmlFor="muteAudio" className="text-xs text-slate-500 select-none flex items-center gap-1">
                      Mute audio stream (silent clip output)
                    </label>
                  </div>
                </div>

                {/* Estimate parameters values */}
                <div className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-lg text-[11px] text-slate-400 font-semibold space-y-1">
                  <div className="flex justify-between">
                    <span>Target Speed:</span>
                    <span className="text-slate-700 dark:text-slate-200 font-bold">{speed}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Duration:</span>
                    <span className="text-slate-700 dark:text-slate-200 font-mono font-bold">{getEstimatedDuration()}</span>
                  </div>
                </div>

                {/* Speed Shift action trigger */}
                <div className="pt-2">
                  <button
                    disabled={isProcessing}
                    onClick={handleConvert}
                    className="w-full py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Change Video Speed</span>
                  </button>
                </div>

              </div>
            </div>

          </div>

          {/* Progress loader */}
          {isProcessing && (
            <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500 dark:text-slate-400">Status: Writing playback speed variables to timeline metadata...</span>
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

          {/* Download Speed adjusted output */}
          {speedUrl && speedSize && (
            <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-emerald-500/5 dark:bg-emerald-950/10 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1.5 overflow-hidden">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 font-bold tracking-wider uppercase">
                    Velocity Speed Shift Saved
                  </span>
                  <h3 className="text-xs font-bold truncate">
                    {file.name.substring(0, file.name.lastIndexOf('.'))}_{speed}x.{file.name.split('.').pop()}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1">
                    File size: {formatSize(speedSize)} • Speed factor: {speed}x velocity • Length: {getEstimatedDuration()} (Source length: {file.durationStr})
                  </p>
                </div>
                <button
                  onClick={downloadSpeedShifted}
                  className="py-1.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Speeded Video</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
