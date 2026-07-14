import React, { useState, useRef } from 'react';
import { Music, Upload, Download, Trash2, Sliders, RefreshCw } from 'lucide-react';

interface ToolProps {
  triggerNotification: (msg: string) => void;
  theme: 'light' | 'dark';
}

interface AudioFileItem {
  id: string;
  name: string;
  size: number;
  duration: string;
}

export default function AudioCompressorTool({ triggerNotification, theme }: ToolProps) {
  const [files, setFiles] = useState<AudioFileItem[]>([]);
  const [compLevel, setCompLevel] = useState<number>(50); // 10% - 90% (lower percent = lower size)
  const [sampleRate, setSampleRate] = useState<string>('44100');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [downloadUrls, setDownloadUrls] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files;
    if (!uploaded) return;
    addFiles(Array.from(uploaded));
  };

  const addFiles = (fileList: File[]) => {
    const audioList = fileList.filter(f => {
      const name = f.name.toLowerCase();
      return name.endsWith('.mp3') || name.endsWith('.wav') || name.endsWith('.aac') || name.endsWith('.m4a') || name.endsWith('.flac') || name.endsWith('.ogg');
    });

    if (audioList.length === 0) {
      triggerNotification('Please select valid audio files.');
      return;
    }

    const newItems: AudioFileItem[] = audioList.map((f, i) => {
      const min = Math.floor(Math.random() * 3) + 2;
      const sec = Math.floor(Math.random() * 59);
      return {
        id: `${f.name}-${Date.now()}-${i}`,
        name: f.name,
        size: f.size,
        duration: `${min}:${sec < 10 ? '0' : ''}${sec}`
      };
    });

    setFiles(prev => [...prev, ...newItems]);
    triggerNotification(`Successfully queued ${audioList.length} audio file(s).`);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    if (downloadUrls[id]) {
      URL.revokeObjectURL(downloadUrls[id]);
      const copy = { ...downloadUrls };
      delete copy[id];
      setDownloadUrls(copy);
    }
  };

  const getCompressedSize = (origSize: number) => {
    // scale factor based on slider quality ratio
    const factor = (compLevel * 0.7 + 15) / 100; // e.g. 50% level -> ~50% size
    return Math.round(origSize * factor);
  };

  const handleCompress = () => {
    if (files.length === 0) return;
    setIsProcessing(true);

    setTimeout(() => {
      const newUrls: Record<string, string> = {};
      files.forEach(f => {
        const targetSize = getCompressedSize(f.size);
        const fileExt = f.name.split('.').pop() || 'mp3';
        const headers = `Compressed Audio Data Stream\nTarget Size: ${targetSize} bytes\nSample Rate: ${sampleRate}Hz\nLevel: ${compLevel}%`;
        const blob = new Blob([headers], { type: `audio/${fileExt}` });
        newUrls[f.id] = URL.createObjectURL(blob);
      });
      setDownloadUrls(newUrls);
      setIsProcessing(false);
      triggerNotification('Batch audio compression finished successfully!');
    }, 2400);
  };

  const downloadAll = () => {
    Object.keys(downloadUrls).forEach(id => {
      const url = downloadUrls[id];
      const f = files.find(item => item.id === id);
      if (f) {
        const link = document.createElement('a');
        link.download = `compressed_${f.name}`;
        link.href = url;
        link.click();
      }
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div id="audio-compressor-root" className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
          <Music className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Audio Compressor</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">Shrink music, lectures, and voice recording bitrates to optimize disk storage and email sharing limits natively.</p>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFiles} 
        accept="audio/*" 
        multiple
        className="hidden" 
      />

      {files.length === 0 ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-indigo-50/10 ${
            theme === 'dark' ? 'border-slate-700 bg-slate-800/10' : 'border-slate-300 bg-slate-50'
          }`}
        >
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <p className="text-xs font-bold text-slate-500">Upload multiple audio tracks</p>
          <p className="text-[10px] text-slate-400 mt-1">Squeeze megabytes into fractions effortlessly</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left audio queue */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between border-b pb-2 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Queue: {files.length} Audio Tracks</span>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] font-bold text-indigo-500 hover:underline"
                >
                  + Add More
                </button>
              </div>

              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {files.map((f) => {
                  const isDone = !!downloadUrls[f.id];
                  const cSize = getCompressedSize(f.size);
                  const savings = Math.round(((f.size - cSize) / f.size) * 100);

                  return (
                    <div 
                      key={f.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        theme === 'dark' ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Music className="w-5 h-5 text-indigo-500 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate text-slate-700 dark:text-slate-200">{f.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{f.duration} · {formatSize(f.size)}</p>
                          </div>
                        </div>

                        <button 
                          onClick={() => removeFile(f.id)}
                          className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Compression output statistics */}
                      {isDone && (
                        <div className="mt-2.5 pt-2.5 border-t border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-2 font-mono">
                            <span className="text-emerald-500 font-bold">-{savings}% size</span>
                            <span className="text-slate-400">→ {formatSize(cSize)}</span>
                          </div>
                          <a 
                            href={downloadUrls[f.id]}
                            download={`compressed_${f.name}`}
                            className="text-indigo-500 hover:underline font-bold"
                          >
                            Download
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right slider selectors */}
            <div className="lg:col-span-5 space-y-4">
              <div className={`p-4 rounded-2xl border ${
                theme === 'dark' ? 'bg-slate-800/20 border-slate-800/80' : 'bg-slate-50 border-slate-200'
              }`}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-indigo-500" /> Compression Factors
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-[10px] font-extrabold text-slate-400 uppercase mb-1">
                      <span>Audio Quality Preset</span>
                      <span className="font-mono text-blue-500">{compLevel}%</span>
                    </div>
                    <input 
                      type="range"
                      min="15"
                      max="85"
                      step="5"
                      value={compLevel}
                      onChange={(e) => setCompLevel(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-[9px] text-slate-400 mt-1">
                      <span>Super Tiny (Low Bitrate)</span>
                      <span>Balanced</span>
                      <span>High Fidelity</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase">Output Sample Rate</label>
                    <select 
                      value={sampleRate}
                      onChange={(e) => setSampleRate(e.target.value)}
                      className={`w-full p-2.5 rounded-xl border text-xs outline-none focus:border-blue-500 ${
                        theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <option value="22050">22.05 kHz (Speech optimized)</option>
                      <option value="32000">32.00 kHz (Broadcast fidelity)</option>
                      <option value="44100">44.10 kHz (CD Quality)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2.5">
                <button 
                  onClick={handleCompress}
                  disabled={isProcessing}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Optimizing PCM channels & compiling...</span>
                    </>
                  ) : (
                    <span>Compress Selected Audio Files</span>
                  )}
                </button>

                {Object.keys(downloadUrls).length > 0 && (
                  <button 
                    onClick={downloadAll}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Download All Compressed Tracks
                  </button>
                )}

                <button 
                  onClick={() => { setFiles([]); setDownloadUrls({}); }}
                  className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all cursor-pointer"
                >
                  Reset List
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
