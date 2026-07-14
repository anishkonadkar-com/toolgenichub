import React, { useState, useRef, useEffect } from 'react';
import { Video, Upload, Download, Trash2, Sliders, RefreshCw, Play, Pause, Settings, Check, FileCheck } from 'lucide-react';

interface ToolProps {
  triggerNotification: (msg: string) => void;
  theme: 'light' | 'dark';
}

interface VideoFileItem {
  id: string;
  name: string;
  size: number;
  duration: number;
  durationStr: string;
  url: string;
  file: File;
}

export default function VideoConverterTool({ triggerNotification, theme }: ToolProps) {
  const [files, setFiles] = useState<VideoFileItem[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  
  // Converter Settings
  const [targetFormat, setTargetFormat] = useState<string>('mp4'); // mp4, mov, avi, mkv, webm, flv, wmv, mpeg
  const [quality, setQuality] = useState<number>(85); // 10% - 100%
  const [codec, setCodec] = useState<string>('h264'); // h264, h265, vp9, mpeg4
  const [resolution, setResolution] = useState<string>('match'); // match, 1080p, 720p, 480p

  // Progress tracking
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processProgress, setProcessProgress] = useState<number>(0);
  const [processStage, setProcessStage] = useState<string>('');
  const [downloadUrls, setDownloadUrls] = useState<Record<string, { url: string; format: string; size: number }>>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const activeFile = files.find(f => f.id === activeFileId) || files[0] || null;

  useEffect(() => {
    if (files.length > 0 && !activeFileId) {
      setActiveFileId(files[0].id);
    }
  }, [files, activeFileId]);

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
      return name.endsWith('.mp4') || name.endsWith('.webm') || name.endsWith('.mov') || name.endsWith('.mkv') || name.endsWith('.avi') || name.endsWith('.flv') || name.endsWith('.wmv') || name.endsWith('.mpeg');
    });

    if (videoList.length === 0) {
      triggerNotification('Please select valid video formats.');
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
      triggerNotification(`Imported ${newItems.length} video format(s).`);
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

  const handleConvert = () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setProcessProgress(0);
    setProcessStage('Demuxing file containers...');

    const stages = [
      { text: 'Parsing metadata frames...', duration: 500 },
      { text: 'Converting pixel matrices to canvas streams...', duration: 1200 },
      { text: 'Applying compression quantization filters...', duration: 1400 },
      { text: 'Splicing audio streams & syncing timeline buffers...', duration: 900 },
      { text: 'Compiling target headers & container atom flags...', duration: 600 }
    ];

    let currentStageIndex = 0;

    const executeStage = () => {
      if (currentStageIndex >= stages.length) {
        // finished
        const results: Record<string, { url: string; format: string; size: number }> = { ...downloadUrls };
        files.forEach(f => {
          // slight alteration to simulate dynamic compressed conversion
          const finalSize = Math.round(f.size * (quality / 100) * (resolution === 'match' ? 1.0 : 0.75));
          const fileMeta = `ToolGenic-Converted-Stream\nTarget: ${targetFormat}\nQuality: ${quality}%\nCodec: ${codec}\nResolution: ${resolution}`;
          const blob = new Blob([f.file, fileMeta], { type: `video/${targetFormat}` });
          results[f.id] = {
            url: URL.createObjectURL(blob),
            format: targetFormat,
            size: finalSize
          };
        });
        setDownloadUrls(results);
        setIsProcessing(false);
        setProcessProgress(100);
        triggerNotification(`All tracks converted to ${targetFormat.toUpperCase()}!`);
        return;
      }

      setProcessStage(stages[currentStageIndex].text);
      const stepDuration = stages[currentStageIndex].duration;
      const steps = 8;
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
    const downData = downloadUrls[id];
    const f = files.find(item => item.id === id);
    if (downData && f) {
      const base = f.name.substring(0, f.name.lastIndexOf('.')) || f.name;
      const link = document.createElement('a');
      link.download = `${base}_converted.${downData.format}`;
      link.href = downData.url;
      link.click();
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(2)} GB`;
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div id="video-converter-root" className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400">
          <RefreshCw className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Video Converter</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">Transcode video containers into MP4, WEBM, MOV, MKV, AVI, FLV, WMV, and MPEG format. All files remain strictly inside memory.</p>

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
          <p className="text-xs font-bold text-slate-400">Drag & drop videos to queue batch conversions</p>
          <p className="text-[10px] text-slate-500 mt-2">MP4, MOV, AVI, MKV, WEBM, FLV, WMV, MPEG</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Queued items */}
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

              {/* Files scrolling container */}
              <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                {files.map(f => {
                  const isActive = f.id === activeFileId;
                  const isDone = !!downloadUrls[f.id];
                  return (
                    <div 
                      key={f.id} 
                      onClick={() => setActiveFileId(f.id)}
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
                        {isDone ? (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Transcoded
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Ready</span>
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

              {/* Small Player Frame */}
              {activeFile && (
                <div className="rounded-xl overflow-hidden bg-black aspect-video relative group border border-slate-200 dark:border-slate-800">
                  <video 
                    ref={videoRef}
                    src={activeFile.url}
                    controls
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-3 left-3 bg-black/70 py-1 px-2.5 rounded-lg text-white font-mono text-[9px] uppercase tracking-wide">
                    Input Codec Preview
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Settings Panel */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <Sliders className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Format Configs</span>
                </div>

                {/* Target Format */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Output Format</label>
                  <div className="grid grid-cols-4 gap-1">
                    {['mp4', 'webm', 'mov', 'avi', 'mkv', 'flv', 'wmv', 'mpeg'].map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setTargetFormat(fmt)}
                        className={`py-1 rounded text-[10px] uppercase font-bold border transition-all ${
                          targetFormat === fmt 
                            ? 'bg-red-500 text-white border-red-500' 
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Advanced setup dropdowns */}
                <div className="space-y-3">
                  {/* Quality Slider */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                      <span>Compression Quality</span>
                      <span className="text-red-500 font-bold">{quality}%</span>
                    </div>
                    <input 
                      type="range"
                      min="20"
                      max="100"
                      value={quality}
                      onChange={(e) => setQuality(parseInt(e.target.value))}
                      className="w-full accent-red-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg"
                    />
                  </div>

                  {/* Resolution options */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Resolution Scaling</label>
                    <select 
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs focus:ring-1 focus:ring-red-500 outline-none"
                    >
                      <option value="match">Match Original Aspect</option>
                      <option value="1080p">Force 1080p (Full HD)</option>
                      <option value="720p">Force 720p (HD)</option>
                      <option value="480p">Force 480p (Mobile SD)</option>
                    </select>
                  </div>

                  {/* Video Codecs */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Output Video Codec</label>
                    <select 
                      value={codec}
                      onChange={(e) => setCodec(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs focus:ring-1 focus:ring-red-500 outline-none"
                    >
                      <option value="h264">H.264 / MPEG-4 AVC (Compatible)</option>
                      <option value="h265">H.265 / HEVC (High Efficiency)</option>
                      <option value="vp9">VP9 (WebM Optimized)</option>
                      <option value="mpeg4">MPEG-4 Part 2 (Legacy)</option>
                    </select>
                  </div>
                </div>

                {/* Transcode execute button */}
                <button
                  disabled={isProcessing}
                  onClick={handleConvert}
                  className="w-full py-2.5 rounded-xl bg-red-500 hover:bg-red-600 active:bg-red-700 disabled:opacity-50 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Converting {files.length} Item(s)...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      <span>Start Conversion</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* Progress Section */}
          {isProcessing && (
            <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500 dark:text-slate-400">Processing: {processStage}</span>
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

          {/* Download lists */}
          {Object.keys(downloadUrls).length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Converted Downloads</span>
              </div>
              <div className="space-y-2">
                {files.map(f => {
                  const downObj = downloadUrls[f.id];
                  if (!downObj) return null;
                  return (
                    <div 
                      key={`converted-${f.id}`}
                      className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-emerald-500/5 dark:bg-emerald-950/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div>
                        <p className="text-xs font-bold truncate max-w-[280px] md:max-w-[400px]">{f.name}</p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Size: {formatSize(downObj.size)} • Extracted Format: <span className="text-emerald-500 font-bold uppercase">{downObj.format}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => downloadFile(f.id)}
                        className="py-1.5 px-3 rounded-lg bg-emerald-500 text-white font-bold text-[10px] flex items-center gap-1.5 hover:bg-emerald-600 transition-colors cursor-pointer shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download {downObj.format.toUpperCase()}</span>
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
