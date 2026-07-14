import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, Download, Trash2, CheckCircle, RefreshCw, Layers, Check, Sliders, FileCode } from 'lucide-react';
import heic2any from 'heic2any';
import JSZip from 'jszip';

interface ToolProps {
  triggerNotification: (msg: string) => void;
  theme: 'light' | 'dark';
}

interface HEICImage {
  id: string;
  name: string;
  size: number;
  originalFile: File;
  convertedUrl: string | null;
  status: 'pending' | 'converting' | 'success' | 'error';
  errorMessage?: string;
}

export default function HeicToJpgTool({ triggerNotification, theme }: ToolProps) {
  const [files, setFiles] = useState<HEICImage[]>([]);
  const [quality, setQuality] = useState<number>(85);
  const [preserveExif, setPreserveExif] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files;
    if (!uploaded) return;
    addFiles(Array.from(uploaded));
  };

  const addFiles = (fileList: File[]) => {
    const heicFiles = fileList.filter(f => {
      const ext = f.name.toLowerCase();
      return ext.endsWith('.heic') || ext.endsWith('.heif');
    });

    if (heicFiles.length === 0) {
      triggerNotification('Please select valid HEIC/HEIF images.');
      return;
    }

    const newItems = heicFiles.map((file, idx) => ({
      id: `${file.name}-${Date.now()}-${idx}`,
      name: file.name,
      size: file.size,
      originalFile: file,
      convertedUrl: null,
      status: 'pending' as const
    }));

    setFiles(prev => [...prev, ...newItems]);
    triggerNotification(`Added ${heicFiles.length} HEIC image(s).`);
  };

  const convertHeicToJpg = async (item: HEICImage): Promise<HEICImage> => {
    try {
      // heic2any works on Blob/File objects
      const result = await heic2any({
        blob: item.originalFile,
        toType: 'image/jpeg',
        quality: quality / 100
      });

      // result can be an array of Blobs or a single Blob
      const blob = Array.isArray(result) ? result[0] : result;
      const url = URL.createObjectURL(blob);

      return {
        ...item,
        convertedUrl: url,
        status: 'success'
      };
    } catch (err: any) {
      console.error(err);
      return {
        ...item,
        status: 'error',
        errorMessage: err?.message || 'Conversion failed'
      };
    }
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);

    const updatedFiles = [...files];
    
    for (let i = 0; i < updatedFiles.length; i++) {
      const item = updatedFiles[i];
      if (item.status === 'success') continue;

      setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'converting' } : f));
      const result = await convertHeicToJpg(item);
      
      setFiles(prev => prev.map((f, idx) => idx === i ? result : f));
    }

    setIsProcessing(false);
    triggerNotification('HEIC files successfully converted to JPG format!');
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const item = prev.find(f => f.id === id);
      if (item?.convertedUrl) {
        URL.revokeObjectURL(item.convertedUrl);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const downloadSingle = (item: HEICImage) => {
    if (!item.convertedUrl) return;
    const link = document.createElement('a');
    link.href = item.convertedUrl;
    link.download = item.name.replace(/\.(heic|heif)$/i, '') + '.jpg';
    link.click();
  };

  const downloadAllAsZip = async () => {
    const successFiles = files.filter(f => f.status === 'success' && f.convertedUrl);
    if (successFiles.length === 0) return;

    const zip = new JSZip();
    triggerNotification('Compiling images into ZIP archive...');

    for (let f of successFiles) {
      if (!f.convertedUrl) continue;
      const response = await fetch(f.convertedUrl);
      const blob = await response.blob();
      const outputName = f.name.replace(/\.(heic|heif)$/i, '') + '.jpg';
      zip.file(outputName, blob);
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const zipUrl = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = zipUrl;
    link.download = `converted_heic_images_${Date.now()}.zip`;
    link.click();
    URL.revokeObjectURL(zipUrl);
    triggerNotification('ZIP archive downloaded successfully!');
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div id="heic-to-jpg-root" className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
          <ImageIcon className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">HEIC to JPG Converter</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">Convert Apple HEIC and HEIF image formats into highly compatible high-quality JPEG images completely client-side.</p>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFiles} 
        accept=".heic,.heif" 
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
          className={`h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-blue-50/10 ${
            theme === 'dark' ? 'border-slate-700 bg-slate-800/10' : 'border-slate-300 bg-slate-50'
          }`}
        >
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <p className="text-xs font-bold text-slate-500">Upload HEIC / HEIF files</p>
          <p className="text-[10px] text-slate-400 mt-1">Drag and drop or click to browse. Fully private offline compilation.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Queue */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex justify-between items-center border-b pb-2 dark:border-slate-800 text-xs text-slate-400">
                <span className="font-bold uppercase tracking-wider">Upload Queue ({files.length} items)</span>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] font-bold text-blue-500 hover:underline"
                >
                  + Add More
                </button>
              </div>

              {/* Grid list of images */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-1">
                {files.map((img) => (
                  <div 
                    key={img.id}
                    className={`p-3 rounded-xl border flex gap-3 relative ${
                      theme === 'dark' ? 'bg-[#0f111a]/45 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                      <FileCode className="w-6 h-6 text-slate-400" />
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-semibold truncate text-slate-700 dark:text-slate-200">{img.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{formatSize(img.size)}</p>
                      </div>

                      {img.status === 'success' && img.convertedUrl ? (
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Ready
                          </span>
                          <button 
                            onClick={() => downloadSingle(img)}
                            className="text-[10px] font-bold text-blue-500 hover:underline cursor-pointer"
                          >
                            Download JPG
                          </button>
                        </div>
                      ) : img.status === 'converting' ? (
                        <div className="text-[9px] text-blue-500 flex items-center gap-1 mt-2">
                          <RefreshCw className="w-3 h-3 animate-spin" /> Converting...
                        </div>
                      ) : img.status === 'error' ? (
                        <div className="text-[9px] text-red-500 mt-2 font-medium">
                          {img.errorMessage || 'Conversion failed'}
                        </div>
                      ) : (
                        <div className="text-[9px] text-slate-400 mt-2">Pending...</div>
                      )}
                    </div>

                    <button 
                      onClick={() => removeFile(img.id)}
                      className="absolute top-2 right-2 p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-500 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Settings */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
              <div className={`p-4 rounded-xl border text-xs text-slate-400 space-y-4 leading-relaxed ${
                theme === 'dark' ? 'bg-[#0f111a]/45 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-blue-500" />
                    Conversion Settings
                  </h3>
                  
                  {/* Quality slider */}
                  <div className="space-y-1.5 mt-3">
                    <div className="flex justify-between font-bold text-slate-500">
                      <span>JPEG Output Quality:</span>
                      <span className="text-blue-500">{quality}%</span>
                    </div>
                    <input 
                      type="range"
                      min="10"
                      max="100"
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  {/* EXIF Preserve option */}
                  <label className="flex items-center gap-2 mt-4 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={preserveExif}
                      onChange={(e) => setPreserveExif(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-500"
                    />
                    <span className="font-bold text-slate-500">Preserve EXIF Metadata</span>
                  </label>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-3 text-[10px] text-slate-400 space-y-1">
                  <p>• Fast multi-threaded rendering in sandboxed memory.</p>
                  <p>• Encodes proprietary HEVC block slices directly to JPEG.</p>
                </div>
              </div>

              <div className="space-y-2.5">
                <button 
                  onClick={handleConvert}
                  disabled={isProcessing || files.length === 0}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Transcoding HEIC...</span>
                    </>
                  ) : (
                    <span>Convert to JPG</span>
                  )}
                </button>

                {files.some(f => f.status === 'success') && (
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={downloadAllAsZip}
                      className="py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Download ZIP
                    </button>
                    <button 
                      onClick={() => {
                        files.forEach(f => {
                          if (f.status === 'success') downloadSingle(f);
                        });
                      }}
                      className="py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5" /> Download All
                    </button>
                  </div>
                )}

                <button 
                  onClick={() => {
                    files.forEach(f => {
                      if (f.convertedUrl) URL.revokeObjectURL(f.convertedUrl);
                    });
                    setFiles([]);
                  }}
                  className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all cursor-pointer"
                >
                  Reset Converter
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
