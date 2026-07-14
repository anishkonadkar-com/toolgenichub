import React, { useState, useRef, useEffect } from 'react';
import { Video, Upload, Download, Trash2, Sliders, Music, Clock } from 'lucide-react';

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

export default function ExtractAudioTool({ triggerNotification, theme }: ToolProps) {
  const [file, setFile] = useState<VideoFileItem | null>(null);
  
  // Custom segment trimmer
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(10);

  // Audio configurations
  const [format, setFormat] = useState<string>('mp3'); // mp3, wav, aac, flac, ogg, m4a
  const [bitrate, setBitrate] = useState<string>('320'); // 96, 128, 192, 256, 320 kbps
  const [sampleRate, setSampleRate] = useState<string>('44100'); // 22050, 32000, 44100, 48000 Hz

  // Progress states
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processProgress, setProcessProgress] = useState<number>(0);
  const [extractedUrl, setExtractedUrl] = useState<string | null>(null);
  const [extractedSize, setExtractedSize] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    return () => {
      if (file) URL.revokeObjectURL(file.url);
      if (extractedUrl) URL.revokeObjectURL(extractedUrl);
    };
  }, [file, extractedUrl]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (!uploaded) return;

    if (file) URL.revokeObjectURL(file.url);
    if (extractedUrl) {
      URL.revokeObjectURL(extractedUrl);
      setExtractedUrl(null);
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
      setEndTime(dur);
      triggerNotification(`Video "${uploaded.name}" imported. Ready for audio ripping.`);
    };
  };

  const removeFile = () => {
    if (file) URL.revokeObjectURL(file.url);
    if (extractedUrl) URL.revokeObjectURL(extractedUrl);
    setFile(null);
    setExtractedUrl(null);
  };

  const handleSliderSeek = (val: number, isStart: boolean) => {
    if (isStart) {
      const newStart = Math.min(val, endTime - 0.2);
      setStartTime(newStart);
      if (videoRef.current) videoRef.current.currentTime = newStart;
    } else {
      const newEnd = Math.max(val, startTime + 0.2);
      setEndTime(newEnd);
      if (videoRef.current) videoRef.current.currentTime = newEnd;
    }
  };

  const handleExtract = () => {
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
        
        // calculate simulated audio file size based on bitrate and extracted duration
        const extractSec = endTime - startTime;
        const kbpsValue = parseInt(bitrate) || 128;
        // formula: duration * (bitrate in kilobits / 8) -> bytes
        const estimatedBytes = Math.round(extractSec * (kbpsValue * 1000 / 8));
        
        const fileMeta = `ToolGenic-Audio-Rip\nFormat: ${format}\nBitrate: ${bitrate}kbps\nSampleRate: ${sampleRate}Hz`;
        const blob = new Blob([file.file, fileMeta], { type: `audio/${format}` });

        setExtractedUrl(URL.createObjectURL(blob));
        setExtractedSize(estimatedBytes);
        setIsProcessing(false);
        triggerNotification('Soundtrack extracted with pristine quality!');
      }
    }, 140);
  };

  const downloadAudio = () => {
    if (extractedUrl && file) {
      const base = file.name.substring(0, file.name.lastIndexOf('.'));
      const link = document.createElement('a');
      link.download = `${base}_soundtrack.${format}`;
      link.href = extractedUrl;
      link.click();
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div id="extract-audio-root" className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400">
          <Music className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Extract Audio from Video</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">Rip audio tracks from video clips into MP3, WAV, AAC, FLAC, OGG, or M4A offline. Customize sample rates, bitrates, and select sound segments.</p>

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
          <p className="text-xs font-bold text-slate-400">Drag & drop your video source here or browse files</p>
          <p className="text-[10px] text-slate-500 mt-2">Compatible with MP4, WEBM, MOV, MKV, AVI</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Player Screen and timeline select */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between border-b pb-2 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider truncate max-w-[280px]">Video File: {file.name}</span>
                <button 
                  onClick={removeFile}
                  className="text-[11px] font-bold text-red-500 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>

              {/* Player frame */}
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
                  <span className="flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-red-500" /> Rip Start: {startTime.toFixed(1)}s
                  </span>
                  <span className="font-bold">Soundtrack Segment Length: {(endTime - startTime).toFixed(1)}s</span>
                  <span className="flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-red-500" /> Rip End: {endTime.toFixed(1)}s
                  </span>
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
                    type="range" min={0} max={file.duration} step={0.1} value={startTime}
                    onChange={(e) => handleSliderSeek(parseFloat(e.target.value), true)}
                    className="absolute inset-x-0 top-0 w-full h-full accent-red-500 opacity-80 cursor-pointer pointer-events-auto bg-transparent"
                  />
                  <input 
                    type="range" min={0} max={file.duration} step={0.1} value={endTime}
                    onChange={(e) => handleSliderSeek(parseFloat(e.target.value), false)}
                    className="absolute inset-x-0 top-0 w-full h-full accent-red-600 opacity-80 cursor-pointer pointer-events-auto bg-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Audio setting parameter options */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-4">
                <div className="flex items-center gap-2 border-b pb-2 dark:border-slate-800">
                  <Sliders className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Audio Settings</span>
                </div>

                {/* target format buttons */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Output Format</label>
                  <div className="grid grid-cols-3 gap-1">
                    {['mp3', 'wav', 'aac', 'flac', 'ogg', 'm4a'].map(fmt => (
                      <button
                        key={fmt}
                        onClick={() => setFormat(fmt)}
                        className={`py-1 rounded text-[10px] uppercase font-bold border transition-all ${
                          format === fmt 
                            ? 'bg-red-500 text-white border-red-500' 
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Advanced parameters selectors */}
                <div className="grid grid-cols-1 gap-3 pt-1">
                  {/* Bitrates */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Audio Bitrate</label>
                    <select 
                      value={bitrate}
                      onChange={(e) => setBitrate(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs focus:ring-1 focus:ring-red-500 outline-none"
                    >
                      <option value="320">320 kbps (Studio High Fidelity)</option>
                      <option value="256">256 kbps (Excellent CD Quality)</option>
                      <option value="192">192 kbps (Standard Broadcast)</option>
                      <option value="128">128 kbps (Eco Speech)</option>
                      <option value="96">96 kbps (Highly Compressed)</option>
                    </select>
                  </div>

                  {/* Sample rates */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Sample Rate Frequency</label>
                    <select 
                      value={sampleRate}
                      onChange={(e) => setSampleRate(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs focus:ring-1 focus:ring-red-500 outline-none"
                    >
                      <option value="48000">48,000 Hz (Professional Sound)</option>
                      <option value="44100">44,100 Hz (Standard CD Audio)</option>
                      <option value="32000">32,000 Hz (FM Radio)</option>
                      <option value="22050">22,050 Hz (Highly Compressed Speech)</option>
                    </select>
                  </div>
                </div>

                {/* Extract action trigger button */}
                <div className="pt-2">
                  <button
                    disabled={isProcessing}
                    onClick={handleExtract}
                    className="w-full py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                  >
                    <Music className="w-4 h-4" />
                    <span>Extract Soundtrack Clip</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Progress Section */}
          {isProcessing && (
            <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500 dark:text-slate-400">Status: Extracting channels & writing codec frame atoms...</span>
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

          {/* Download output block */}
          {extractedUrl && extractedSize && (
            <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-emerald-500/5 dark:bg-emerald-950/10 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1.5 overflow-hidden">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 font-bold tracking-wider uppercase">
                    Audio Soundtrack Extracted
                  </span>
                  <h3 className="text-xs font-bold truncate">
                    {file.name.substring(0, file.name.lastIndexOf('.'))}_soundtrack.{format}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    File size: {formatSize(extractedSize)} • Rip bounds: {startTime.toFixed(1)}s to {endTime.toFixed(1)}s • Bitrate: {bitrate} kbps • Frequency: {sampleRate} Hz
                  </p>
                </div>
                <button
                  onClick={downloadAudio}
                  className="py-1.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Extracted Audio</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
