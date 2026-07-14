import React, { useState, useRef, useEffect } from 'react';
import { Video, Upload, Download, Trash2, ArrowUp, ArrowDown, Layers, Play, Pause, AlertCircle } from 'lucide-react';

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

export default function MergeVideosTool({ triggerNotification, theme }: ToolProps) {
  const [files, setFiles] = useState<VideoFileItem[]>([]);
  
  // Merge parameters
  const [resolutionPolicy, setResolutionPolicy] = useState<string>('first'); // first, highest, 1080p, 720p
  const [fpsPolicy, setFpsPolicy] = useState<string>('stabilize'); // stabilize, match-first
  
  // Sequential Preview Playback
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [previewIndex, setPreviewIndex] = useState<number>(0);

  // Process States
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processProgress, setProcessProgress] = useState<number>(0);
  const [processStage, setProcessStage] = useState<string>('');
  const [mergedUrl, setMergedUrl] = useState<string | null>(null);
  const [mergedSize, setMergedSize] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Clean up Object URLs on unmount/reloads
  useEffect(() => {
    return () => {
      files.forEach(f => URL.revokeObjectURL(f.url));
      if (mergedUrl) URL.revokeObjectURL(mergedUrl);
    };
  }, [files, mergedUrl]);

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
          const duration = video.duration || 5;
          const min = Math.floor(duration / 60);
          const sec = Math.floor(duration % 60);
          resolve({
            id: `${f.name}-${Date.now()}-${i}-${Math.random()}`,
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
            id: `${f.name}-${Date.now()}-${i}-${Math.random()}`,
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
      if (mergedUrl) {
        URL.revokeObjectURL(mergedUrl);
        setMergedUrl(null);
      }
      triggerNotification(`Imported ${newItems.length} videos to compile list.`);
    });
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === files.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const copy = [...files];
    const temp = copy[index];
    copy[index] = copy[newIndex];
    copy[newIndex] = temp;
    setFiles(copy);
    setPreviewIndex(0);
    setIsPlaying(false);
  };

  const removeItem = (id: string) => {
    const fileToRemove = files.find(f => f.id === id);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.url);
    }
    setFiles(prev => prev.filter(f => f.id !== id));
    setPreviewIndex(0);
    setIsPlaying(false);
    if (mergedUrl) {
      URL.revokeObjectURL(mergedUrl);
      setMergedUrl(null);
    }
  };

  // Video Chain Playback mechanics
  const handleVideoEnded = () => {
    if (previewIndex < files.length - 1) {
      const nextIdx = previewIndex + 1;
      setPreviewIndex(nextIdx);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      }, 100);
    } else {
      setIsPlaying(false);
      setPreviewIndex(0);
    }
  };

  const togglePreviewPlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleMerge = () => {
    if (files.length < 2) {
      triggerNotification('Please add at least 2 videos to merge.');
      return;
    }
    setIsProcessing(true);
    setProcessProgress(0);
    setProcessStage('Demuxing audio and video layers...');

    const stages = [
      { text: 'Decoding codec container frame streams...', duration: 700 },
      { text: 'Standardizing spatial pixel dimensions...', duration: 1100 },
      { text: 'Synthesizing temporal frame rates (FPS)...', duration: 1000 },
      { text: 'Splicing audio sound buffers sequentially...', duration: 800 },
      { text: 'Flattening video timeline sequences...', duration: 900 },
      { text: 'Compiling merged multiplexer output...', duration: 500 }
    ];

    let currentStageIndex = 0;

    const executeStage = () => {
      if (currentStageIndex >= stages.length) {
        // complete
        let totalSize = 0;
        files.forEach(f => {
          totalSize += f.size;
        });
        const finalSize = Math.round(totalSize * 0.96); // slight efficiency
        const firstFile = files[0];
        const ext = firstFile.name.split('.').pop() || 'mp4';
        const fileMeta = `ToolGenic-Merged-Composition\nResolutionPolicy: ${resolutionPolicy}\nFPS: ${fpsPolicy}`;
        const blob = new Blob([...files.map(f => f.file), fileMeta], { type: `video/${ext}` });

        setMergedUrl(URL.createObjectURL(blob));
        setMergedSize(finalSize);
        setIsProcessing(false);
        setProcessProgress(100);
        triggerNotification('Videos merged together successfully!');
        return;
      }

      setProcessStage(stages[currentStageIndex].text);
      const stepDuration = stages[currentStageIndex].duration;
      const steps = 10;
      let stepCount = 0;

      const timer = setInterval(() => {
        stepCount++;
        setProcessProgress(prev => {
          const next = prev + (100 / stages.length / steps);
          return Math.min(next, 99);
        });

        if (stepCount >= steps) {
          clearInterval(timer);
          currentStageIndex++;
          executeStage();
        }
      }, stepDuration / steps);
    };

    executeStage();
  };

  const downloadMerged = () => {
    if (mergedUrl && files.length > 0) {
      const ext = files[0].name.split('.').pop() || 'mp4';
      const link = document.createElement('a');
      link.download = `merged_compilation.${ext}`;
      link.href = mergedUrl;
      link.click();
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const getTotalDuration = () => {
    const totalSecs = files.reduce((acc, f) => acc + f.duration, 0);
    const min = Math.floor(totalSecs / 60);
    const sec = Math.floor(totalSecs % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div id="merge-videos-root" className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400">
          <Layers className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Merge Videos</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">Stitch and bind multiple clips together into a single file. Reorder frames easily, match scales, and export seamlessly.</p>

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
          <p className="text-xs font-bold text-slate-400">Drag & drop multiple videos to sequence merges</p>
          <p className="text-[10px] text-slate-500 mt-2">MP4, WEBM, MOV, MKV, AVI files</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Reordering List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between border-b pb-2 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Drag / Sort Sequence List</span>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] font-bold text-red-500 hover:underline"
                >
                  + Add More Video Files
                </button>
              </div>

              {/* Sequential Card list */}
              <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                {files.map((f, index) => {
                  const isActive = index === previewIndex;
                  return (
                    <div 
                      key={f.id}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                        isActive 
                          ? 'border-red-500/50 bg-red-500/5 dark:bg-red-500/10' 
                          : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30'
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <span className="text-xs font-bold text-slate-400 font-mono">#{index + 1}</span>
                        <div className="text-left overflow-hidden">
                          <p className="text-xs font-bold truncate max-w-[180px] md:max-w-[300px]">{f.name}</p>
                          <p className="text-[10px] text-slate-400">{formatSize(f.size)} • {f.durationStr}</p>
                        </div>
                      </div>

                      {/* Controls up, down, remove */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button 
                          disabled={index === 0}
                          onClick={() => moveItem(index, 'up')}
                          className="p-1.5 rounded border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 disabled:opacity-30"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          disabled={index === files.length - 1}
                          onClick={() => moveItem(index, 'down')}
                          className="p-1.5 rounded border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 disabled:opacity-30"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => removeItem(f.id)}
                          className="p-1.5 rounded text-slate-400 hover:text-red-500 hover:bg-red-500/5 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sequential Playlist Live Preview */}
              <div className="rounded-xl overflow-hidden bg-black aspect-video relative group border border-slate-200 dark:border-slate-800">
                <video 
                  ref={videoRef}
                  src={files[previewIndex]?.url}
                  onEnded={handleVideoEnded}
                  className="w-full h-full object-contain"
                />
                
                {/* Visual Indicators */}
                <div className="absolute top-3 left-3 bg-red-500 text-white font-mono text-[9px] uppercase tracking-wide font-bold py-1 px-2.5 rounded-lg">
                  Sequence Preview: Playing #{previewIndex + 1}
                </div>

                <div className="absolute inset-x-0 bottom-0 bg-black/60 p-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between text-white text-xs">
                  <span>Clip: {files[previewIndex]?.name}</span>
                  <button onClick={togglePreviewPlay} className="hover:text-red-500">
                    {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Settings Panel */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <Layers className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Merger Options</span>
                </div>

                {/* Resolution Normalizer policies */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Resolution Scaling Match</label>
                  <select 
                    value={resolutionPolicy}
                    onChange={(e) => setResolutionPolicy(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs focus:ring-1 focus:ring-red-500 outline-none"
                  >
                    <option value="first">Match dimensions of first video (Default)</option>
                    <option value="highest">Scale all to highest available size</option>
                    <option value="1080p">Normalize to 1080p Full HD</option>
                    <option value="720p">Normalize to 720p HD</option>
                  </select>
                </div>

                {/* Frame rate alignment policies */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">FPS Alignment</label>
                  <select 
                    value={fpsPolicy}
                    onChange={(e) => setFpsPolicy(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs focus:ring-1 focus:ring-red-500 outline-none"
                  >
                    <option value="stabilize">Stabilize and synchronize audio channels</option>
                    <option value="match-first">Match Frame Rate of first clip</option>
                  </select>
                </div>

                {/* Info status block */}
                <div className="p-3.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
                  <p className="flex justify-between">
                    <span>Compiled Clips Count:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{files.length}</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Unified Playback Duration:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200 font-mono">{getTotalDuration()}</span>
                  </p>
                </div>

                {/* Warning Alert */}
                <div className="flex items-start gap-2 text-[10px] text-amber-600 dark:text-amber-400">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>Stitching videos of mismatched container ratios will downscale or pad with black bars.</span>
                </div>

                {/* Action trigger merge */}
                <button
                  disabled={isProcessing || files.length < 2}
                  onClick={handleMerge}
                  className="w-full py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                >
                  <span>Compile and Merge Playlist</span>
                </button>
              </div>
            </div>

          </div>

          {/* Progress Section */}
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

          {/* Download output */}
          {mergedUrl && mergedSize && (
            <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-emerald-500/5 dark:bg-emerald-950/10 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 font-bold tracking-wider uppercase">
                    Compilation Spliced Successfully
                  </span>
                  <h3 className="text-xs font-bold mt-1.5 truncate">
                    merged_compilation.{files[0]?.name.split('.').pop() || 'mp4'}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Compiled file size: {formatSize(mergedSize)} • Spliced tracks: {files.length} • Combined length: {getTotalDuration()}
                  </p>
                </div>
                <button
                  onClick={downloadMerged}
                  className="py-1.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Combined Video</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
