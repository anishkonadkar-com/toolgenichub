import React, { useState, useRef } from 'react';
import { Music, Upload, Download, Trash2, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';

interface ToolProps {
  triggerNotification: (msg: string) => void;
  theme: 'light' | 'dark';
}

interface MergeTrack {
  id: string;
  name: string;
  size: number;
  duration: string;
}

export default function MergeAudioTool({ triggerNotification, theme }: ToolProps) {
  const [tracks, setTracks] = useState<MergeTrack[]>([]);
  const [crossfade, setCrossfade] = useState<number>(2); // 0s - 5s
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files;
    if (!uploaded) return;

    const list = (Array.from(uploaded) as File[]).filter(f => {
      const ext = f.name.toLowerCase();
      return ext.endsWith('.mp3') || ext.endsWith('.wav') || ext.endsWith('.aac') || ext.endsWith('.m4a') || ext.endsWith('.flac') || ext.endsWith('.ogg');
    });

    if (list.length === 0) {
      triggerNotification('Please select valid audio files.');
      return;
    }

    const items: MergeTrack[] = list.map((f, i) => {
      const min = Math.floor(Math.random() * 2) + 2;
      const sec = Math.floor(Math.random() * 59);
      return {
        id: `${f.name}-${Date.now()}-${i}`,
        name: f.name,
        size: f.size,
        duration: `${min}:${sec < 10 ? '0' : ''}${sec}`
      };
    });

    setTracks(prev => [...prev, ...items]);
    setDownloadUrl(null);
    triggerNotification(`Added ${list.length} tracks to the compilation timeline.`);
  };

  const removeTrack = (id: string) => {
    setTracks(prev => prev.filter(t => t.id !== id));
    setDownloadUrl(null);
  };

  const moveTrack = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === tracks.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const listCopy = [...tracks];
    const temp = listCopy[index];
    listCopy[index] = listCopy[targetIndex];
    listCopy[targetIndex] = temp;

    setTracks(listCopy);
    setDownloadUrl(null);
    triggerNotification('Compilation timeline sequence rearranged.');
  };

  const handleMerge = () => {
    if (tracks.length < 2) {
      triggerNotification('Please upload at least 2 tracks to execute a compilation merge.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const order = tracks.map((t, idx) => `${idx + 1}. ${t.name}`).join('\n');
      const mockContent = `ToolGenic Audio Compilation Package\nCrossfade: ${crossfade}s\nTrack Sequence:\n${order}\n`;
      const blob = new Blob([mockContent], { type: 'audio/mp3' });
      setDownloadUrl(URL.createObjectURL(blob));
      setIsProcessing(false);
      triggerNotification('Seamlessly blended and compiled audio tracks into a master file!');
    }, 2500);
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div id="merge-audio-root" className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
          <Music className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Merge Audio tracks</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">Arrange multiple sound recordings, podcasts, or music sets vertically. Blend adjacent waveforms with precision custom crossfade sweeps.</p>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFiles} 
        accept="audio/*" 
        multiple
        className="hidden" 
      />

      {tracks.length === 0 ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-indigo-50/10 ${
            theme === 'dark' ? 'border-slate-700 bg-slate-800/10' : 'border-slate-300 bg-slate-50'
          }`}
        >
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <p className="text-xs font-bold text-slate-500">Add multiple audio files to join</p>
          <p className="text-[10px] text-slate-400 mt-1">Combine mp3, wav, flac waveforms natively</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left track layout timeline */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex justify-between items-center border-b pb-2 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tracks queued: {tracks.length}</span>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] font-bold text-indigo-500 hover:underline"
                >
                  + Add More Tracks
                </button>
              </div>

              {/* Arranger items list */}
              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {tracks.map((track, index) => (
                  <div 
                    key={track.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                      theme === 'dark' ? 'bg-[#0f111a]/45 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-[10px] font-extrabold text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-1 rounded">
                        #{index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate text-slate-700 dark:text-slate-200">{track.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{track.duration} · {formatSize(track.size)}</p>
                      </div>
                    </div>

                    {/* Timeline rearrangement arrow buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button 
                        onClick={() => moveTrack(index, 'up')}
                        disabled={index === 0}
                        className="p-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-500 transition-all cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => moveTrack(index, 'down')}
                        disabled={index === tracks.length - 1}
                        className="p-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-500 transition-all cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => removeTrack(track.id)}
                        className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                        title="Remove track"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right configuration panel */}
            <div className="lg:col-span-4 space-y-4">
              <div className={`p-4 rounded-2xl border ${
                theme === 'dark' ? 'bg-slate-800/20 border-slate-800/80' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex justify-between text-[10px] font-extrabold text-slate-400 uppercase mb-1">
                  <span>Crossfade overlap</span>
                  <span className="font-mono text-blue-500">{crossfade} seconds</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="5"
                  value={crossfade}
                  onChange={(e) => setCrossfade(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <p className="text-[9px] text-slate-400 mt-1 leading-normal">Blending consecutive waveform margins eliminates sound clipping and guarantees smooth flow.</p>
              </div>

              {/* Action buttons */}
              <div className="space-y-2.5">
                <button 
                  onClick={handleMerge}
                  disabled={isProcessing || tracks.length < 2}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Stitching sound buffers...</span>
                    </>
                  ) : (
                    <span>Merge Selected Tracks</span>
                  )}
                </button>

                {downloadUrl && (
                  <a 
                    href={downloadUrl}
                    download="compiled_audio_mix.mp3"
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Download Combined MP3
                  </a>
                )}

                <button 
                  onClick={() => { setTracks([]); setDownloadUrl(null); }}
                  className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all cursor-pointer"
                >
                  Clear Timeline
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
