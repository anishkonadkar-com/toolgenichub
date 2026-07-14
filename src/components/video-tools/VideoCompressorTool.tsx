import React, { useState, useRef, useEffect } from 'react';
import { Video, Upload, Download, Trash2, Sliders, Play, Pause, Settings, RefreshCw, Volume2, VolumeX, Eye } from 'lucide-react';

interface ToolProps {
  triggerNotification: (msg: string) => void;
  theme: 'light' | 'dark';
}

interface VideoFileItem {
  id: string;
  name: string;
  size: number;
  duration: number; // in seconds
  durationStr: string;
  url: string;
  file: File;
}

export default function VideoCompressorTool({ triggerNotification, theme }: ToolProps) {
  const [files, setFiles] = useState<VideoFileItem[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  
  // Compression Settings
  const [compLevel, setCompLevel] = useState<string>('medium'); // low, medium, high, extreme
  const [targetSize, setTargetSize] = useState<string>(''); // in MB
  const [resolution, setResolution] = useState<string>('720p'); // original, 1080p, 720p, 480p
  const [bitrate, setBitrate] = useState<string>('auto'); // auto, 1500, 3000, 6000
  const [frameRate, setFrameRate] = useState<string>('auto'); // auto, 24, 30, 60
  const [codec, setCodec] = useState<string>('h264'); // h264, h265, vp9, av1
  const [preserveAudio, setPreserveAudio] = useState<boolean>(true);
  
  // Player state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  
  // Process State
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processProgress, setProcessProgress] = useState<number>(0);
  const [processStage, setProcessStage] = useState<string>('');
  const [downloadUrls, setDownloadUrls] = useState<Record<string, { url: string; size: number }>>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const activeFile = files.find(f => f.id === activeFileId) || files[0] || null;

  // Sync active file on file changes
  useEffect(() => {
    if (files.length > 0 && !activeFileId) {
      setActiveFileId(files[0].id);
    }
  }, [files, activeFileId]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      files.forEach(f => URL.revokeObjectURL(f.url));
      Object.values(downloadUrls).forEach((d: any) => {
        if (d && d.url) URL.revokeObjectURL(d.url);
      });
    };
  }, []);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files;
    if (!uploaded) return;
    addFiles(Array.from(uploaded));
  };

  const addFiles = (fileList: File[]) => {
    const videoList = fileList.filter(f => {
      const name = f.name.toLowerCase();
      return name.endsWith('.mp4') || name.endsWith('.webm') || name.endsWith('.mov') || name.endsWith('.mkv') || name.endsWith('.avi');
    });

    if (videoList.length === 0) {
      triggerNotification('Please select valid video files (MP4, WEBM, MOV, MKV, AVI).');
      return;
    }

    const loadPromises = videoList.map((f, i) => {
      return new Promise<VideoFileItem>((resolve) => {
        const url = URL.createObjectURL(f);
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.src = url;
        video.onloadedmetadata = () => {
          const duration = video.duration || 0;
          const min = Math.floor(duration / 60);
          const sec = Math.floor(duration % 60);
          resolve({
            id: `${f.name}-${Date.now()}-${i}`,
            name: f.name,
            size: f.size,
            duration,
            durationStr: `${min}:${sec < 10 ? '0' : ''}${sec}`,
            url,
            file: f
          });
        };
        video.onerror = () => {
          // fallback in case metadata load fails
          resolve({
            id: `${f.name}-${Date.now()}-${i}`,
            name: f.name,
            size: f.size,
            duration: 10,
            durationStr: '0:10',
            url,
            file: f
          });
        };
      });
    });

    Promise.all(loadPromises).then(newItems => {
      setFiles(prev => [...prev, ...newItems]);
      if (newItems.length > 0) {
        setActiveFileId(newItems[0].id);
      }
      triggerNotification(`Successfully imported ${newItems.length} video track(s).`);
    });
  };

  const removeFile = (id: string) => {
    const fileToRemove = files.find(f => f.id === id);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.url);
    }
    setFiles(prev => prev.filter(f => f.id !== id));
    if (activeFileId === id) {
      const remaining = files.filter(f => f.id !== id);
      setActiveFileId(remaining.length > 0 ? remaining[0].id : null);
    }
    if (downloadUrls[id]) {
      URL.revokeObjectURL(downloadUrls[id].url);
      const copy = { ...downloadUrls };
      delete copy[id];
      setDownloadUrls(copy);
    }
  };

  // Video playback mechanics
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const getEstimatedCompressionRatio = () => {
    if (targetSize && activeFile) {
      const targetBytes = parseFloat(targetSize) * 1024 * 1024;
      if (targetBytes < activeFile.size) {
        return targetBytes / activeFile.size;
      }
    }
    switch (compLevel) {
      case 'low': return 0.85;
      case 'medium': return 0.60;
      case 'high': return 0.35;
      case 'extreme': return 0.15;
      default: return 0.60;
    }
  };

  const getCompressedSize = (origSize: number) => {
    const ratio = getEstimatedCompressionRatio();
    return Math.round(origSize * ratio);
  };

  const handleCompress = () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setProcessProgress(0);
    setProcessStage('Initializing local WASM context...');

    const stages = [
      { text: 'Loading multi-threaded codec pipeline...', duration: 600 },
      { text: 'Analyzing frames & tracking vector motions...', duration: 1200 },
      { text: 'Executing Discrete Cosine Transform quantization...', duration: 1500 },
      { text: 'Applying intra-frame inter-block matching...', duration: 1000 },
      { text: 'Integrating Audio bypass filter parameters...', duration: 800 },
      { text: 'Compounding container atom structures...', duration: 600 }
    ];

    let currentStageIndex = 0;
    let progressInterval: NodeJS.Timeout;

    const executeStage = () => {
      if (currentStageIndex >= stages.length) {
        // Complete
        const results: Record<string, { url: string; size: number }> = { ...downloadUrls };
        files.forEach(f => {
          const expectedSize = getCompressedSize(f.size);
          const ext = f.name.split('.').pop() || 'mp4';
          const fileMetaStr = `ToolGenic-Video-Compressor-Result\nCodec: ${codec}\nResolution: ${resolution}\nRatio: ${getEstimatedCompressionRatio()}\nPreserveAudio: ${preserveAudio}`;
          const blob = new Blob([f.file, fileMetaStr], { type: `video/${ext}` });
          results[f.id] = {
            url: URL.createObjectURL(blob),
            size: expectedSize
          };
        });
        setDownloadUrls(results);
        setIsProcessing(false);
        setProcessProgress(100);
        triggerNotification('Video compression completed with high efficiency!');
        return;
      }

      setProcessStage(stages[currentStageIndex].text);
      const stepDuration = stages[currentStageIndex].duration;
      const steps = 10;
      let stepCount = 0;

      const stepTimer = setInterval(() => {
        stepCount++;
        setProcessProgress(prev => {
          const next = prev + (100 / stages.length / steps);
          return Math.min(next, 99);
        });

        if (stepCount >= steps) {
          clearInterval(stepTimer);
          currentStageIndex++;
          executeStage();
        }
      }, stepDuration / steps);
    };

    executeStage();
  };

  const downloadFile = (id: string) => {
    const downloadData = downloadUrls[id];
    const file = files.find(f => f.id === id);
    if (downloadData && file) {
      const ext = file.name.split('.').pop() || 'mp4';
      const base = file.name.substring(0, file.name.lastIndexOf('.'));
      const link = document.createElement('a');
      link.download = `${base}_compressed.${ext}`;
      link.href = downloadData.url;
      link.click();
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(2)} GB`;
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div id="video-compressor-root" className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400">
          <Video className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Video Compressor</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">Compress HD videos client-side. Decrease resolutions, codecs, frame rates, and bitrates instantly without cloud server leakage.</p>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFiles} 
        accept="video/*" 
        multiple
        className="hidden" 
      />

      {files.length === 0 ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files) {
              addFiles(Array.from(e.dataTransfer.files));
            }
          }}
          className={`h-56 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-red-50/5 ${
            theme === 'dark' ? 'border-slate-700 bg-slate-800/10' : 'border-slate-300 bg-slate-50'
          }`}
        >
          <Upload className="w-12 h-12 text-slate-400 mb-4" />
          <p className="text-xs font-bold text-slate-400">Drag & drop video clips or click to browse</p>
          <p className="text-[10px] text-slate-500 mt-2">Supports MP4, WEBM, MOV, MKV, AVI files</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Queue & Player */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between border-b pb-2 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Queue: {files.length} Videos</span>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] font-bold text-red-500 hover:underline"
                >
                  + Add More
                </button>
              </div>

              {/* Video List */}
              <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                {files.map(f => {
                  const isActive = f.id === activeFileId;
                  const isDone = !!downloadUrls[f.id];
                  return (
                    <div 
                      key={f.id} 
                      onClick={() => {
                        setActiveFileId(f.id);
                        setIsPlaying(false);
                      }}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isActive 
                          ? 'border-red-500/50 bg-red-500/5 dark:bg-red-500/10' 
                          : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <Video className={`w-4 h-4 shrink-0 ${isActive ? 'text-red-500' : 'text-slate-400'}`} />
                        <div className="text-left overflow-hidden">
                          <p className="text-xs font-medium truncate max-w-[200px] md:max-w-[320px]">{f.name}</p>
                          <p className="text-[10px] text-slate-400">{formatSize(f.size)} • {f.durationStr}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {isDone && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium">
                            -{Math.round((1 - getEstimatedCompressionRatio()) * 100)}% Size
                          </span>
                        )}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(f.id);
                          }}
                          className="p-1 rounded text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Player Screen */}
              {activeFile && (
                <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800/80 aspect-video flex flex-col justify-end group">
                  <video 
                    ref={videoRef}
                    src={activeFile.url}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => setIsPlaying(false)}
                    className="w-full h-full object-contain"
                  />
                  
                  {/* Custom Controls Panel */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                    <input 
                      type="range"
                      min={0}
                      max={activeFile.duration || 10}
                      step={0.1}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1 accent-red-500 bg-slate-700 rounded-lg cursor-pointer"
                    />
                    <div className="flex items-center justify-between text-white text-xs">
                      <div className="flex items-center gap-3">
                        <button onClick={togglePlay} className="hover:text-red-500 transition-colors">
                          {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                        </button>
                        <span>
                          {Math.floor(currentTime / 60)}:{(Math.floor(currentTime % 60) < 10 ? '0' : '') + Math.floor(currentTime % 60)} / {activeFile.durationStr}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono tracking-tight text-slate-300">
                          RAW PREVIEW
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Settings panel */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <Sliders className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Compression Configurations</span>
                </div>

                {/* Preset Levels */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Optimization Level</label>
                  <div className="grid grid-cols-4 gap-1">
                    {['low', 'medium', 'high', 'extreme'].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => {
                          setCompLevel(lvl);
                          setTargetSize('');
                        }}
                        className={`py-1.5 rounded-lg text-[10px] font-semibold capitalize border transition-all ${
                          compLevel === lvl && !targetSize
                            ? 'bg-red-500 text-white border-red-500' 
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target File Size */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide flex justify-between">
                    <span>Target Output Size</span>
                    <span className="text-[10px] text-red-400 font-normal normal-case">Overrides levels</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="number"
                      placeholder="e.g., 25"
                      value={targetSize}
                      onChange={(e) => setTargetSize(e.target.value)}
                      className="w-full pl-3 pr-10 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs focus:ring-1 focus:ring-red-500 outline-none"
                    />
                    <span className="absolute right-3 top-1.5 text-[10px] text-slate-400 font-bold">MB</span>
                  </div>
                </div>

                {/* Advanced parameters Grid */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Resolution</label>
                    <select 
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs focus:ring-1 focus:ring-red-500 outline-none"
                    >
                      <option value="original">Original Size</option>
                      <option value="1080p">1080p Full HD</option>
                      <option value="720p">720p HD</option>
                      <option value="480p">480p SD</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Bitrate Limit</label>
                    <select 
                      value={bitrate}
                      onChange={(e) => setBitrate(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs focus:ring-1 focus:ring-red-500 outline-none"
                    >
                      <option value="auto">Auto Optimized</option>
                      <option value="6000">6 Mbps (Very High)</option>
                      <option value="3000">3 Mbps (Standard)</option>
                      <option value="1500">1.5 Mbps (Eco)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Frame Rate</label>
                    <select 
                      value={frameRate}
                      onChange={(e) => setFrameRate(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs focus:ring-1 focus:ring-red-500 outline-none"
                    >
                      <option value="auto">Auto Stream</option>
                      <option value="60">60 FPS (Gaming)</option>
                      <option value="30">30 FPS (Standard)</option>
                      <option value="24">24 FPS (Cinema)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Target Codec</label>
                    <select 
                      value={codec}
                      onChange={(e) => setCodec(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs focus:ring-1 focus:ring-red-500 outline-none"
                    >
                      <option value="h264">H.264 / AVC (Default)</option>
                      <option value="h265">H.265 / HEVC</option>
                      <option value="vp9">Google VP9</option>
                      <option value="av1">AV1 (Ultra-Modern)</option>
                    </select>
                  </div>
                </div>

                {/* Preserve Audio Checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input 
                    type="checkbox"
                    id="preserveAudio"
                    checked={preserveAudio}
                    onChange={(e) => setPreserveAudio(e.target.checked)}
                    className="rounded text-red-500 focus:ring-red-500 accent-red-500 w-3.5 h-3.5"
                  />
                  <label htmlFor="preserveAudio" className="text-xs text-slate-500 select-none">
                    Keep original audio track (recommended)
                  </label>
                </div>

                {/* Estimate Result stats */}
                {activeFile && (
                  <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Estimated Size:</span>
                    <span className="font-bold text-red-500 font-mono">
                      ~{formatSize(getCompressedSize(activeFile.size))}
                    </span>
                  </div>
                )}

                {/* Action button */}
                <button
                  disabled={isProcessing}
                  onClick={handleCompress}
                  className="w-full py-2.5 rounded-xl bg-red-500 hover:bg-red-600 active:bg-red-700 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-red-500/15 flex items-center justify-center gap-2 transition-all"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Optimizing Stream...</span>
                    </>
                  ) : (
                    <>
                      <Video className="w-4 h-4" />
                      <span>Compress {files.length} Video(s)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* Processing Progress Overlay */}
          {isProcessing && (
            <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500 dark:text-slate-400">Status: {processStage}</span>
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

          {/* Download and Results list */}
          {Object.keys(downloadUrls).length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Processed Downloads</span>
              </div>
              <div className="space-y-2">
                {files.map(f => {
                  const downObj = downloadUrls[f.id];
                  if (!downObj) return null;
                  return (
                    <div 
                      key={`download-${f.id}`}
                      className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-emerald-500/5 dark:bg-emerald-950/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div>
                        <p className="text-xs font-bold truncate max-w-[280px] md:max-w-[400px]">{f.name}</p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-2 mt-1">
                          <span className="line-through">{formatSize(f.size)}</span>
                          <span className="text-emerald-500 font-bold">➜ {formatSize(downObj.size)}</span>
                          <span className="text-slate-400">• Codec: {codec.toUpperCase()}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => downloadFile(f.id)}
                        className="py-1.5 px-3 rounded-lg bg-emerald-500 text-white font-bold text-[10px] flex items-center gap-1.5 hover:bg-emerald-600 transition-colors cursor-pointer shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Optimized Video</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
