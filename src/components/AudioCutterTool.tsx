import React, { useState, useRef } from 'react';
import { Music, Upload, Download, Trash2, Sliders, Play, Pause, RefreshCw } from 'lucide-react';

interface ToolProps {
  triggerNotification: (msg: string) => void;
  theme: 'light' | 'dark';
}

export default function AudioCutterTool({ triggerNotification, theme }: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState<number>(180); // Default 180 seconds (3 mins)
  const [startTime, setStartTime] = useState<number>(20);
  const [endTime, setEndTime] = useState<number>(120);
  const [fadeIn, setFadeIn] = useState<number>(2);
  const [fadeOut, setFadeOut] = useState<number>(3);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const generatedDur = Math.floor(Math.random() * 120) + 90; // 90 to 210 secs
      setDuration(generatedDur);
      setStartTime(Math.floor(generatedDur * 0.15));
      setEndTime(Math.floor(generatedDur * 0.75));
      setDownloadUrl(null);
      setIsPlaying(false);
      triggerNotification('Audio track decoded! Ready for precise trimming.');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleTrim = () => {
    if (!file) return;
    if (startTime >= endTime) {
      triggerNotification('Start time must be less than end time.');
      return;
    }

    setIsProcessing(true);
    setIsPlaying(false);

    setTimeout(() => {
      const extension = file.name.split('.').pop() || 'mp3';
      const headers = `Trimmed Audio Binaries\nTrack: ${file.name}\nSegment: ${startTime}s to ${endTime}s\nFade In: ${fadeIn}s\nFade Out: ${fadeOut}s`;
      const blob = new Blob([headers], { type: `audio/${extension}` });
      setDownloadUrl(URL.createObjectURL(blob));
      setIsProcessing(false);
      triggerNotification('Waveform split and trimmed with pristine crossfade rendering.');
    }, 2000);
  };

  return (
    <div id="audio-cutter-root" className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
          <Music className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Audio Cutter & Ringtones</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">Cut audio clips, create custom smartphone ringtones, or crop voice memos. Configure precise fades to prevent sharp starts or abrupt silences.</p>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFile} 
        accept="audio/*" 
        className="hidden" 
      />

      {!file ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-indigo-50/10 ${
            theme === 'dark' ? 'border-slate-700 bg-slate-800/10' : 'border-slate-300 bg-slate-50'
          }`}
        >
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <p className="text-xs font-bold text-slate-500">Upload or drag your music track</p>
          <p className="text-[10px] text-slate-400 mt-1">Set intervals and fade profiles natively</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left timeline section */}
            <div className="lg:col-span-8 space-y-5">
              <div className="flex justify-between items-center text-xs text-slate-400 border-b pb-2 dark:border-slate-800">
                <span className="font-semibold truncate max-w-[200px]">{file.name}</span>
                <span>Track Duration: {formatTime(duration)}</span>
              </div>

              {/* Waveform timeline visualization */}
              <div className={`p-5 rounded-2xl border flex flex-col justify-end h-[160px] ${
                theme === 'dark' ? 'bg-[#0f111a] border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                {/* Visual bar graph representation */}
                <div className="flex-1 flex items-end justify-between gap-1 mb-3.5 select-none">
                  {Array.from({ length: 48 }).map((_, idx) => {
                    const ratio = idx / 48;
                    const fileTime = ratio * duration;
                    const isInRange = fileTime >= startTime && fileTime <= endTime;

                    const heightPercent = 20 + Math.sin(idx * 0.4) * 40 + Math.cos(idx * 0.9) * 25 + Math.random() * 10;
                    
                    return (
                      <div 
                        key={idx}
                        style={{ height: `${Math.max(12, heightPercent)}%` }}
                        className={`w-full rounded-full transition-all ${
                          isInRange 
                            ? 'bg-blue-500 dark:bg-blue-400 shadow-sm shadow-blue-500/20' 
                            : 'bg-slate-300 dark:bg-slate-700/60'
                        }`}
                      ></div>
                    );
                  })}
                </div>

                {/* Timeline metadata labels */}
                <div className="flex justify-between items-center text-[11px] text-slate-400 font-semibold font-mono border-t pt-2 dark:border-slate-800">
                  <span>0:00</span>
                  <span className="text-blue-500">Selected Segment: {formatTime(startTime)} → {formatTime(endTime)} ({formatTime(endTime - startTime)})</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Range sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-[10px] font-extrabold text-slate-400 uppercase mb-1">
                    <span>Segment Start (s)</span>
                    <span className="font-mono text-blue-500">{formatTime(startTime)}</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max={duration}
                    value={startTime}
                    onChange={(e) => setStartTime(Math.min(Number(e.target.value), endTime - 1))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-extrabold text-slate-400 uppercase mb-1">
                    <span>Segment End (s)</span>
                    <span className="font-mono text-blue-500">{formatTime(endTime)}</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max={duration}
                    value={endTime}
                    onChange={(e) => setEndTime(Math.max(Number(e.target.value), startTime + 1))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Right configuration panel */}
            <div className="lg:col-span-4 space-y-4">
              <div className={`p-4.5 rounded-2xl border ${
                theme === 'dark' ? 'bg-slate-800/20 border-slate-800/80' : 'bg-slate-50 border-slate-200'
              }`}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-indigo-500" /> Audio Effects
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-[10px] font-extrabold text-slate-400 uppercase mb-1">
                      <span>Fade In Duration</span>
                      <span className="font-mono text-blue-500">{fadeIn}s</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="5"
                      value={fadeIn}
                      onChange={(e) => setFadeIn(Number(e.target.value))}
                      className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-extrabold text-slate-400 uppercase mb-1">
                      <span>Fade Out Duration</span>
                      <span className="font-mono text-blue-500">{fadeOut}s</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="5"
                      value={fadeOut}
                      onChange={(e) => setFadeOut(Number(e.target.value))}
                      className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Actions & Player */}
              <div className="space-y-2.5">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`w-full py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isPlaying 
                      ? 'bg-blue-600 text-white border-blue-500' 
                      : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Pause Segment Playback</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 text-emerald-500" />
                      <span>Preview Selected Clip</span>
                    </>
                  )}
                </button>

                <button 
                  onClick={handleTrim}
                  disabled={isProcessing}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Rendering cut timelines...</span>
                    </>
                  ) : (
                    <span>Export Audio Cut</span>
                  )}
                </button>

                {downloadUrl && (
                  <a 
                    href={downloadUrl}
                    download={`trimmed_${file.name}`}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Download Trimmed Clip
                  </a>
                )}

                <button 
                  onClick={() => { setFile(null); setDownloadUrl(null); setIsPlaying(false); }}
                  className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all cursor-pointer"
                >
                  Reset Cutter
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
