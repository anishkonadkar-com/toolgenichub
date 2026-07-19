import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, Sun, Moon, Trash2, Copy, Check, Sparkles, 
  Code, FileText, Calculator, RefreshCw, Sliders, 
  Download, Upload, Heart, History, CheckCircle, 
  AlertCircle, HelpCircle, ArrowRight, ShieldCheck, 
  FileCode, Settings, Layers, ChevronRight, Minimize2, Lock, Image as ImageIcon,
  Video, Music, Menu, X, Mail, Github, Twitter, Linkedin, Send, Info, Shield, Scale
} from 'lucide-react';

import ResizeImageTool from './components/ResizeImageTool';
import BackgroundRemoverTool from './components/BackgroundRemoverTool';
import PassportPhotoMakerTool from './components/PassportPhotoMakerTool';
import ImageToPdfTool from './components/ImageToPdfTool';
import MergePdfTool from './components/MergePdfTool';
import SplitPdfTool from './components/SplitPdfTool';
import PasswordGeneratorTool from './components/PasswordGeneratorTool';

import CompressPdfTool from './components/CompressPdfTool';
import PdfToWordTool from './components/PdfToWordTool';
import WordToPdfTool from './components/WordToPdfTool';
import PdfToImageTool from './components/PdfToImageTool';
import RotatePdfTool from './components/RotatePdfTool';

import Mp3ConverterTool from './components/Mp3ConverterTool';
import AudioCompressorTool from './components/AudioCompressorTool';
import AudioCutterTool from './components/AudioCutterTool';
import MergeAudioTool from './components/MergeAudioTool';
import VoiceRecorderTool from './components/VoiceRecorderTool';

import JpgToPngTool from './components/JpgToPngTool';
import PngToJpgTool from './components/PngToJpgTool';
import CurrencyConverterTool from './components/CurrencyConverterTool';
import PdfToWordConverterTool from './components/PdfToWordConverterTool';
import WordToPdfConverterTool from './components/WordToPdfConverterTool';

// New PDF Tools
import UnlockPdfTool from './components/UnlockPdfTool';
import ProtectPdfTool from './components/ProtectPdfTool';
import DeletePdfPagesTool from './components/DeletePdfPagesTool';
import ExtractPdfPagesTool from './components/ExtractPdfPagesTool';
import PdfToExcelTool from './components/PdfToExcelTool';
import ExcelToPdfTool from './components/ExcelToPdfTool';
import OcrPdfTool from './components/OcrPdfTool';
import OrganizePdfTool from './components/OrganizePdfTool';

// New Image Tools
import HeicToJpgTool from './components/image-tools/heic-to-jpg/HeicToJpgTool';
import CropImageTool from './components/image-tools/crop-image/CropImageTool';
import JpgToPngToolImage from './components/image-tools/jpg-to-png/JpgToPngTool';
import PngToJpgToolImage from './components/image-tools/png-to-jpg/PngToJpgTool';
import WebPToJpgTool from './components/image-tools/webp-to-jpg/WebPToJpgTool';
import JpgToWebpTool from './components/image-tools/jpg-to-webp/JpgToWebpTool';
import WebPToPngTool from './components/image-tools/webp-to-png/WebPToPngTool';
import PngToWebpTool from './components/image-tools/png-to-webp/PngToWebpTool';
import SvgToPngTool from './components/image-tools/svg-to-png/SvgToPngTool';
import SvgToJpgTool from './components/image-tools/svg-to-jpg/SvgToJpgTool';
import RotateImageTool from './components/image-tools/rotate-image/RotateImageTool';
import FlipImageTool from './components/image-tools/flip-image/FlipImageTool';
import AddWatermarkTool from './components/image-tools/add-watermark/AddWatermarkTool';

// New Video Tools
import VideoCompressorTool from './components/video-tools/VideoCompressorTool';
import VideoConverterTool from './components/video-tools/VideoConverterTool';
import VideoTrimmerTool from './components/video-tools/VideoTrimmerTool';
import MergeVideosTool from './components/video-tools/MergeVideosTool';
import CropVideoTool from './components/video-tools/CropVideoTool';
import RotateVideoTool from './components/video-tools/RotateVideoTool';
import VideoToGifTool from './components/video-tools/VideoToGifTool';
import GifToMp4Tool from './components/video-tools/GifToMp4Tool';
import ExtractAudioTool from './components/video-tools/ExtractAudioTool';
import ChangeVideoSpeedTool from './components/video-tools/ChangeVideoSpeedTool';

// New Calculator Tools
import AgeCalculatorTool from './components/calculators/AgeCalculatorTool';
import PercentageCalculatorTool from './components/calculators/PercentageCalculatorTool';
import EmiCalculatorTool from './components/calculators/EmiCalculatorTool';
import GstCalculatorTool from './components/calculators/GstCalculatorTool';
import BmiCalculatorTool from './components/calculators/BmiCalculatorTool';
import LoanCalculatorTool from './components/calculators/LoanCalculatorTool';
import SipCalculatorTool from './components/calculators/SipCalculatorTool';
import ScientificCalculatorTool from './components/calculators/ScientificCalculatorTool';
import DiscountCalculatorTool from './components/calculators/DiscountCalculatorTool';
import IncomeTaxCalculatorTool from './components/calculators/IncomeTaxCalculatorTool';

import { TOOLS as METADATA, CATEGORIES, updateSeoTags, ToolMetadata } from './data/tools';

// ================= TYPES =================
interface Tool {
  id: string;
  name: string;
  category: 'image' | 'pdf' | 'converters' | 'dev' | 'ai' | 'calculators';
  desc: string;
  icon: React.ComponentType<any>;
  colorClass: string;
  darkColorClass: string;
}

const POPULAR_TOOLS = [
  { id: 'image-compressor', name: 'Compress Image', path: '/image-tools/compress-image/', desc: 'Dramatically reduce JPG, PNG, and WebP image files' },
  { id: 'merge-pdf', name: 'Merge PDF', path: '/pdf-tools/merge-pdf/', desc: 'Combine multiple PDF files into one single document' },
  { id: 'heic-to-jpg', name: 'HEIC to JPG', path: '/image-tools/heic-to-jpg/', desc: 'Convert Apple HEIC photos to standard JPEGs instantly' },
  { id: 'json-formatter', name: 'JSON Formatter', path: '/developer-tools/json-formatter/', desc: 'Prettify, validate, parse, and minify JSON payloads' }
];

const TRENDING_TOOLS = [
  { id: 'background-remover', name: 'Background Remover', path: '/image-tools/background-remover/', desc: 'Isolate subjects and strip photo backdrops locally' },
  { id: 'crop-video', name: 'Crop Video', path: '/video-tools/crop-video/', desc: 'Crop video aspect ratios and borders' },
  { id: 'emi-calculator', name: 'EMI Calculator', path: '/calculators/emi-calculator/', desc: 'Calculate home and car loan EMIs with amortization schedules' },
  { id: 'unit-converter', name: 'Unit Converter', path: '/converters/unit-converter/', desc: 'Convert length, weight, temperature, and volume metrics' }
];

export default function App() {
  // ================= STATE =================
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('tg-theme');
    return (saved as 'light' | 'dark') || 'light';
  });
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('tg-favorites') || '[]');
  });
  const [recentTools, setRecentTools] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('tg-recents') || '[]');
  });
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [isSitemapPage, setIsSitemapPage] = useState(false);
  const [activeLegalPage, setActiveLegalPage] = useState<'about' | 'privacy' | 'terms' | 'contact' | null>(null);

  // ================= THEME EFFECT =================
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('tg-theme', theme);
  }, [theme]);

  // Save favorites & recents to localStorage
  useEffect(() => {
    localStorage.setItem('tg-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('tg-recents', JSON.stringify(recentTools));
  }, [recentTools]);

  // ================= SIDEBAR DRAWER AND RESPONSIVE INTERACTION =================
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) { // Swipe left by at least 50px closes sidebar
      setIsSidebarOpen(false);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // ================= DYNAMIC ROUTING & SEO =================
  const handlePathChange = (path: string) => {
    const cleanPath = path.replace(/\/$/, ''); // Normalize trailing slash for checks

    if (cleanPath === '/sitemap') {
      setIsSitemapPage(true);
      setActiveLegalPage(null);
      setActiveTool(null);
      setSelectedCategory('all');
      updateSeoTags(null, null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setIsSitemapPage(false);

    if (cleanPath === '/about') {
      setActiveLegalPage('about');
      setActiveTool(null);
      setSelectedCategory('all');
      updateSeoTags(null, null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (cleanPath === '/privacy' || cleanPath === '/privacy-policy') {
      setActiveLegalPage('privacy');
      setActiveTool(null);
      setSelectedCategory('all');
      updateSeoTags(null, null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (cleanPath === '/terms' || cleanPath === '/terms-conditions' || cleanPath === '/terms-and-conditions') {
      setActiveLegalPage('terms');
      setActiveTool(null);
      setSelectedCategory('all');
      updateSeoTags(null, null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (cleanPath === '/contact') {
      setActiveLegalPage('contact');
      setActiveTool(null);
      setSelectedCategory('all');
      updateSeoTags(null, null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setActiveLegalPage(null);

    // Check if matching a tool
    const matchedTool = METADATA.find(t => t.path === path || t.path.replace(/\/$/, '') === cleanPath);
    if (matchedTool) {
      setActiveTool(matchedTool.id);
      setSelectedCategory(matchedTool.category);
      updateSeoTags(matchedTool, null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Check if matching a category
    const matchedCategory = CATEGORIES.find(c => c.path === path || c.path.replace(/\/$/, '') === cleanPath);
    if (matchedCategory) {
      setActiveTool(null);
      setSelectedCategory(matchedCategory.id);
      updateSeoTags(null, matchedCategory);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Default to home page
    setActiveTool(null);
    setSelectedCategory('all');
    updateSeoTags(null, null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    // Initial load path handling
    handlePathChange(window.location.pathname);

    const handlePopState = () => {
      handlePathChange(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    handlePathChange(path);
  };

  const triggerNotification = (message: string) => {
    setShowNotification(message);
    setTimeout(() => setShowNotification(null), 3000);
  };

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
    triggerNotification(favorites.includes(id) ? "Removed from Favorites" : "Added to Favorites");
  };

  const openTool = (id: string) => {
    const toolMeta = METADATA.find(t => t.id === id);
    if (toolMeta) {
      navigateTo(toolMeta.path);
      setRecentTools(prev => {
        const filtered = prev.filter(t => t !== id);
        return [id, ...filtered].slice(0, 5); // Keep top 5 recents
      });
    }
  };

  // Map string icon names to Lucide icon components
  const iconMap: Record<string, React.ComponentType<any>> = {
    ImageIcon: ImageIcon,
    FileText: FileText,
    Sparkles: Sparkles,
    Calculator: Calculator,
    RefreshCw: RefreshCw,
    Code: Code,
    Lock: Lock,
    Sliders: Sliders,
    FileCode: FileCode,
    Layers: Layers,
    Video: Video,
    Music: Music
  };

  // Build reactive tools representations with Lucide icons attached
  const TOOLS = useMemo(() => {
    return METADATA.map(t => ({
      ...t,
      icon: iconMap[t.iconName] || Code,
      colorClass: CATEGORIES.find(c => c.id === t.category)?.colorClass || 'bg-slate-50 text-slate-600',
      darkColorClass: CATEGORIES.find(c => c.id === t.category)?.darkColorClass || 'dark:bg-slate-900/50 dark:text-slate-400'
    }));
  }, []);

  // Filters and Searching
  const filteredTools = useMemo(() => {
    return TOOLS.filter(tool => {
      const categoryName = CATEGORIES.find(c => c.id === tool.category)?.name || '';
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            tool.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            categoryName.toLowerCase().includes(searchQuery.toLowerCase());
      
      // If a search query is active, search across ALL categories (as requested)
      if (searchQuery) {
        return matchesSearch;
      }

      if (selectedCategory === 'all') {
        return true;
      } else if (selectedCategory === 'favorites') {
        return favorites.includes(tool.id);
      } else if (selectedCategory === 'recent') {
        return recentTools.includes(tool.id);
      } else {
        return tool.category === selectedCategory;
      }
    });
  }, [searchQuery, selectedCategory, favorites, recentTools, TOOLS]);

  // Tool Counts
  const counts = useMemo(() => {
    const countsMap: Record<string, number> = {
      all: 0,
      favorites: favorites.length,
      recent: recentTools.length
    };
    
    // Initialize all existing categories dynamically with 0
    CATEGORIES.forEach(c => {
      countsMap[c.id] = 0;
    });

    // Count tools for each category
    TOOLS.forEach(t => {
      if (countsMap[t.category] === undefined) {
        countsMap[t.category] = 0;
      }
      countsMap[t.category]++;
    });

    // Calculate total from categories dynamically
    let totalFromCategories = 0;
    CATEGORIES.forEach(c => {
      totalFromCategories += (countsMap[c.id] || 0);
    });
    countsMap.all = totalFromCategories;

    return countsMap;
  }, [favorites, recentTools, TOOLS]);

  const activeToolObj = useMemo(() => {
    return METADATA.find(t => t.id === activeTool) || null;
  }, [activeTool]);

  return (
    <div className={`min-h-screen w-full transition-colors duration-200 flex flex-col ${
      theme === 'dark' ? 'bg-[#0f111a] text-slate-100' : 'bg-slate-50 text-slate-800'
    }`}>
      {/* ================= DRAWER OVERLAY (BACKDROP) ================= */}
      <div 
        onClick={() => setIsSidebarOpen(false)}
        className={`fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-[2px] transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* ================= SLIDE-OUT CATEGORIES DRAWER ================= */}
      <aside 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-80 h-full max-h-screen flex flex-col p-6 shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          theme === 'dark' ? 'bg-[#151924] border-r border-slate-800/80 text-slate-100' : 'bg-white border-r border-slate-200 text-slate-800'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800/80 mb-5">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { navigateTo('/'); setIsSidebarOpen(false); }}>
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm shadow-blue-500/20">
              <div className="w-3 h-3 border-2 border-white rounded-sm rotate-45"></div>
            </div>
            <div>
              <span className="font-extrabold tracking-tight font-display text-sm block leading-none">ToolGenic</span>
              <span className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5 block">Categories Panel</span>
            </div>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className={`p-1.5 rounded-lg border hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors ${
              theme === 'dark' ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable menu content */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-1 select-none scrollbar-thin">
          {/* Main sections */}
          <div className="space-y-1.5">
            {[
              {
                id: 'all',
                name: 'All Tools Registry',
                icon: <Settings className="w-4 h-4" />,
                onClick: () => navigateTo('/'),
                isActive: !activeTool && selectedCategory === 'all',
                count: counts.all
              },
              {
                id: 'favorites',
                name: 'Favorites',
                icon: <Heart className={`w-4 h-4 ${favorites.length > 0 ? 'text-rose-500 fill-rose-500' : 'text-slate-400'}`} />,
                onClick: () => { setActiveTool(null); setSelectedCategory('favorites'); },
                isActive: !activeTool && selectedCategory === 'favorites',
                count: counts.favorites
              },
              {
                id: 'recent',
                name: 'Recent History',
                icon: <History className="w-4 h-4 text-amber-500" />,
                onClick: () => { setActiveTool(null); setSelectedCategory('recent'); },
                isActive: !activeTool && selectedCategory === 'recent',
                count: counts.recent
              }
            ].map((item, idx) => {
              return (
                <button 
                  key={item.id}
                  onClick={() => { item.onClick(); setIsSidebarOpen(false); }}
                  style={{ transitionDelay: isSidebarOpen ? `${idx * 30}ms` : '0ms' }}
                  className={`w-full relative flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-xs tracking-wide uppercase transition-all duration-300 transform cursor-pointer ${
                    isSidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  } ${
                    item.isActive
                      ? 'bg-blue-600 text-white shadow-md hover:shadow-lg' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:translate-x-1 hover:shadow-[0_0_12px_rgba(59,130,246,0.06)] hover:scale-[1.01]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {item.icon}
                    {item.name}
                  </span>
                  {item.count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                      item.isActive ? 'bg-blue-700 text-white font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {item.count}
                    </span>
                  )}
                  {/* Active Indicator bar */}
                  {item.isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-r bg-white" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Categories section */}
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">Categories</div>
            <div className="space-y-1.5">
              {CATEGORIES.map((cat, idx) => {
                const isActive = !activeTool && selectedCategory === cat.id;
                const staggerIdx = idx + 3;
                return (
                  <button 
                    key={cat.id}
                    onClick={() => { navigateTo(cat.path); setIsSidebarOpen(false); }}
                    style={{ transitionDelay: isSidebarOpen ? `${staggerIdx * 30}ms` : '0ms' }}
                    className={`w-full relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 transform cursor-pointer ${
                      isSidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                    } ${
                      isActive 
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 shadow-sm' 
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:translate-x-1 hover:shadow-[0_0_12px_rgba(59,130,246,0.06)] hover:scale-[1.01]'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        isActive ? 'bg-blue-500 scale-125' : 'bg-slate-300 dark:bg-slate-600'
                      }`} />
                      {cat.name}
                    </span>
                    {counts[cat.id] > 0 && (
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-slate-500">
                        {counts[cat.id]}
                      </span>
                    )}
                    {/* Active Indicator bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r bg-blue-500 dark:bg-blue-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Security Upgrade Card in Drawer */}
        <div className={`mt-auto p-4 rounded-xl border relative overflow-hidden ${
          theme === 'dark' ? 'bg-slate-800/30 border-slate-800/60' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-blue-500/10 rounded-full blur-xl"></div>
          <p className="text-[9px] font-bold text-blue-500 tracking-wider mb-1 uppercase">LOCAL SAFE TOOLBOX</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed mb-2">
            All conversions and processes execute inside your browser. No files or strings ever touch external servers.
          </p>
          <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-500 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Private Processing</span>
          </div>
        </div>
      </aside>

      {/* ================= HEADER / NAV ================= */}
      <nav className={`h-16 sticky top-0 z-40 flex items-center justify-between px-6 border-b transition-colors ${
        theme === 'dark' ? 'bg-[#151924] border-slate-800 shadow-md' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-4">
          {/* Slide-out categories activator button */}
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold tracking-wide transition-all cursor-pointer shadow-sm hover:shadow active:scale-95 duration-200 ${
              theme === 'dark' 
                ? 'border-slate-800 hover:bg-slate-800/85 text-slate-200 bg-slate-800/25' 
                : 'border-slate-200 hover:bg-slate-100 text-slate-700 bg-slate-50'
            }`}
          >
            <Menu className="w-4 h-4" />
            <span>Categories</span>
          </button>

          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigateTo('/')}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20">
              <div className="w-3.5 h-3.5 border-2 border-white rounded-sm rotate-45"></div>
            </div>
            <div>
              <span className="font-extrabold tracking-tight font-display text-base block leading-none">ToolGenic</span>
              <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block tracking-wider uppercase">Sandbox Utilities</span>
            </div>
          </div>
        </div>

        {/* Search Input on Desktop */}
        <div className="hidden md:block w-96 relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full py-1.5 pl-9 pr-4 rounded-xl border text-xs outline-none transition-all ${
              theme === 'dark' 
                ? 'bg-[#1e2433] border-slate-700/60 text-slate-200 focus:border-blue-500' 
                : 'bg-slate-50 border-slate-200 focus:border-blue-500'
            }`}
            placeholder={`Search ${counts.all} browser tool engines...`}
          />
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`p-2 rounded-xl border transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 ${
              theme === 'dark' ? 'border-slate-800 text-amber-400' : 'border-slate-200 text-slate-600'
            }`}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>
        </div>
      </nav>

      {/* ================= NOTIFICATION BANNER ================= */}
      {showNotification && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold animate-slide-in">
          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{showNotification}</span>
        </div>
      )}

      {/* ================= BODY WRAPPER ================= */}
      <div className="flex-1 flex flex-col max-w-[1600px] w-full mx-auto">

        {/* ================= MAIN CONTENT ================= */}
        <main className="flex-1 p-5 md:p-8 overflow-y-auto">
          {activeTool ? (
            /* ================= ACTIVE INTERACTIVE WORKSPACE ================= */
            <div className="max-w-5xl mx-auto">
              {/* Tool Navigation Back & Favorite toggle */}
              <div className="flex items-center justify-between mb-6">
                <button 
                  onClick={() => navigateTo('/')}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  ← Back to Dashboard
                </button>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => toggleFavorite(activeTool, e)}
                    className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                      favorites.includes(activeTool)
                        ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-400'
                        : 'bg-white border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${favorites.includes(activeTool) ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{favorites.includes(activeTool) ? 'Favorited' : 'Add Favorite'}</span>
                  </button>
                </div>
              </div>

              {/* Workstation Container */}
              <div className="space-y-8">
                {activeTool === 'json-formatter' && <JsonFormatter triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'base64-codec' && <Base64Codec triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'url-codec' && <UrlCodec triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'hash-generator' && <HashGenerator triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'jwt-debugger' && <JwtDebugger triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'word-counter' && <WordCounterTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'image-compressor' && <ImageCompressorTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'unit-converter' && <UnitConverterTool triggerNotification={triggerNotification} theme={theme} />}
                
                {/* Imported Standalone Tools */}
                {activeTool === 'resize-image' && <ResizeImageTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'background-remover' && <BackgroundRemoverTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'passport-photo-maker' && <PassportPhotoMakerTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'image-to-pdf' && <ImageToPdfTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'merge-pdf' && <MergePdfTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'split-pdf' && <SplitPdfTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'password-generator' && <PasswordGeneratorTool triggerNotification={triggerNotification} theme={theme} />}

                {activeTool === 'compress-pdf' && <CompressPdfTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'pdf-to-word' && <PdfToWordTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'word-to-pdf' && <WordToPdfTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'pdf-to-image' && <PdfToImageTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'rotate-pdf' && <RotatePdfTool triggerNotification={triggerNotification} theme={theme} />}

                {activeTool === 'mp3-converter' && <Mp3ConverterTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'audio-compressor' && <AudioCompressorTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'audio-cutter' && <AudioCutterTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'merge-audio' && <MergeAudioTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'voice-recorder' && <VoiceRecorderTool triggerNotification={triggerNotification} theme={theme} />}

                {activeTool === 'jpg-to-png' && <JpgToPngTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'png-to-jpg' && <PngToJpgTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'currency-converter' && <CurrencyConverterTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'pdf-to-word-converter' && <PdfToWordConverterTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'word-to-pdf-converter' && <WordToPdfConverterTool triggerNotification={triggerNotification} theme={theme} />}

                {/* New PDF Tools */}
                {activeTool === 'unlock-pdf' && <UnlockPdfTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'protect-pdf' && <ProtectPdfTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'delete-pdf-pages' && <DeletePdfPagesTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'extract-pdf-pages' && <ExtractPdfPagesTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'pdf-to-excel' && <PdfToExcelTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'excel-to-pdf' && <ExcelToPdfTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'ocr-pdf' && <OcrPdfTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'organize-pdf' && <OrganizePdfTool triggerNotification={triggerNotification} theme={theme} />}

                {/* New Image Tools */}
                {activeTool === 'heic-to-jpg' && <HeicToJpgTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'crop-image' && <CropImageTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'jpg-to-png-img' && <JpgToPngToolImage triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'png-to-jpg-img' && <PngToJpgToolImage triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'webp-to-jpg' && <WebPToJpgTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'jpg-to-webp' && <JpgToWebpTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'webp-to-png' && <WebPToPngTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'png-to-webp' && <PngToWebpTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'svg-to-png' && <SvgToPngTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'svg-to-jpg' && <SvgToJpgTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'rotate-image' && <RotateImageTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'flip-image' && <FlipImageTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'add-watermark' && <AddWatermarkTool triggerNotification={triggerNotification} theme={theme} />}

                {/* New Video Tools */}
                {activeTool === 'video-compressor' && <VideoCompressorTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'video-converter' && <VideoConverterTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'video-trimmer' && <VideoTrimmerTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'merge-videos' && <MergeVideosTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'crop-video' && <CropVideoTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'rotate-video' && <RotateVideoTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'video-to-gif' && <VideoToGifTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'gif-to-mp4' && <GifToMp4Tool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'extract-audio' && <ExtractAudioTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'change-video-speed' && <ChangeVideoSpeedTool triggerNotification={triggerNotification} theme={theme} />}

                {/* New Calculator Tools */}
                {activeTool === 'age-calculator' && <AgeCalculatorTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'percentage-calculator' && <PercentageCalculatorTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'emi-calculator' && <EmiCalculatorTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'gst-calculator' && <GstCalculatorTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'bmi-calculator' && <BmiCalculatorTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'loan-calculator' && <LoanCalculatorTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'sip-calculator' && <SipCalculatorTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'scientific-calculator' && <ScientificCalculatorTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'discount-calculator' && <DiscountCalculatorTool triggerNotification={triggerNotification} theme={theme} />}
                {activeTool === 'income-tax-calculator' && <IncomeTaxCalculatorTool triggerNotification={triggerNotification} theme={theme} />}
              </div>

              {/* Standard SEO Rich features guides */}
              {activeToolObj && (
                <div className="mt-12 space-y-12 border-t border-slate-200 dark:border-slate-800 pt-12 max-w-4xl mx-auto px-4">
                  {/* Breadcrumbs */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <span className="cursor-pointer hover:text-blue-600 transition-colors" onClick={() => navigateTo('/')}>Home</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="cursor-pointer hover:text-blue-600 transition-colors" onClick={() => {
                      const cat = CATEGORIES.find(c => c.id === activeToolObj.category);
                      if (cat) navigateTo(cat.path);
                    }}>
                      {CATEGORIES.find(c => c.id === activeToolObj.category)?.name}
                    </span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-slate-600 dark:text-slate-300">{activeToolObj.name}</span>
                  </div>

                  {/* Feature List */}
                  <section>
                    <h3 className="text-base font-bold mb-3">Key Features of {activeToolObj.name}</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {activeToolObj.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          <span className="text-emerald-500 font-bold shrink-0">✔</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* Step by Step Guide */}
                  <section>
                    <h3 className="text-base font-bold mb-3">How to Use {activeToolObj.name}</h3>
                    <ol className="space-y-3">
                      {activeToolObj.steps.map((step, idx) => (
                        <li key={idx} className="flex gap-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 font-extrabold shrink-0 text-[10px]">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </section>

                  {/* Benefits */}
                  <section>
                    <h3 className="text-base font-bold mb-3">Why Use Our Online {activeToolObj.name}?</h3>
                    <ul className="space-y-2.5">
                      {activeToolObj.benefits.map((ben, idx) => (
                        <li key={idx} className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          • {ben}
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* Supported Formats */}
                  <section>
                    <h3 className="text-sm font-bold mb-2 uppercase text-slate-400 tracking-wider">Supported Formats</h3>
                    <div className="flex gap-1.5 flex-wrap">
                      {activeToolObj.formats.map((fmt) => (
                        <span key={fmt} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-[10px] font-bold font-mono text-slate-600 dark:text-slate-300 rounded">
                          {fmt}
                        </span>
                      ))}
                    </div>
                  </section>

                  {/* FAQ */}
                  <section className="bg-slate-50 dark:bg-slate-900/40 border rounded-2xl p-6 border-slate-200 dark:border-slate-800">
                    <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-blue-500" /> Frequently Asked Questions
                    </h3>
                    <div className="space-y-4">
                      {activeToolObj.faq.map((item, idx) => (
                        <div key={idx} className="border-b border-slate-200 dark:border-slate-800 pb-3 last:border-0 last:pb-0">
                          <h4 className="font-bold text-xs text-slate-700 dark:text-slate-200 mb-1">{item.q}</h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{item.a}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Previous / Next Tool Navigation */}
                  <div className="grid grid-cols-2 gap-4 pb-8 border-b border-slate-200 dark:border-slate-800">
                    {(() => {
                      const currentIndex = METADATA.findIndex(t => t.id === activeToolObj.id);
                      const prevTool = METADATA[currentIndex - 1] || METADATA[METADATA.length - 1];
                      const nextTool = METADATA[currentIndex + 1] || METADATA[0];
                      return (
                        <>
                          <button 
                            onClick={() => navigateTo(prevTool.path)}
                            className="flex flex-col items-start p-4 border rounded-2xl hover:border-blue-500 hover:bg-blue-50/5 transition-all text-left border-slate-200 dark:border-slate-800 select-none cursor-pointer group"
                          >
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 flex items-center gap-1">
                              <span className="group-hover:-translate-x-0.5 transition-transform">←</span> Previous Tool
                            </span>
                            <span className="font-extrabold text-xs text-slate-800 dark:text-white group-hover:text-blue-500 transition-colors">
                              {prevTool.name}
                            </span>
                          </button>

                          <button 
                            onClick={() => navigateTo(nextTool.path)}
                            className="flex flex-col items-end p-4 border rounded-2xl hover:border-blue-500 hover:bg-blue-50/5 transition-all text-right border-slate-200 dark:border-slate-800 select-none cursor-pointer group"
                          >
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 flex items-center gap-1">
                              Next Tool <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                            </span>
                            <span className="font-extrabold text-xs text-slate-800 dark:text-white group-hover:text-blue-500 transition-colors">
                              {nextTool.name}
                            </span>
                          </button>
                        </>
                      );
                    })()}
                  </div>

                  {/* Related Tools */}
                  <section className="pb-8 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider mb-4">Related Tools</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {(() => {
                        const sameCat = METADATA.filter(t => t.category === activeToolObj.category && t.id !== activeToolObj.id);
                        const otherCat = METADATA.filter(t => t.category !== activeToolObj.category && t.id !== activeToolObj.id);
                        const combined = [...sameCat, ...otherCat].slice(0, 6);
                        return combined.map((tool) => (
                          <div 
                            key={tool.id} 
                            onClick={() => navigateTo(tool.path)}
                            className="p-4 border rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50/5 transition-all text-left border-slate-200 dark:border-slate-800 group"
                          >
                            <h4 className="font-bold text-xs text-slate-800 dark:text-white mb-1 group-hover:text-blue-500 transition-colors">{tool.name}</h4>
                            <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{tool.desc}</p>
                          </div>
                        ));
                      })()}
                    </div>
                  </section>

                  {/* Popular Tools (Global Internal Linking) */}
                  <section className="pb-8">
                    <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider mb-4">Popular Tools</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {POPULAR_TOOLS.filter(t => t.id !== activeToolObj.id).slice(0, 4).map((tool) => (
                        <div 
                          key={tool.id} 
                          onClick={() => navigateTo(tool.path)}
                          className="p-4 border rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50/5 transition-all text-left border-slate-200 dark:border-slate-800"
                        >
                          <h4 className="font-bold text-xs text-slate-800 dark:text-white mb-1">{tool.name}</h4>
                          <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{tool.desc}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )}
            </div>
          ) : activeLegalPage ? (
            /* ================= LEGAL & INFORMATIONAL PAGES ================= */
            <div className="max-w-6xl mx-auto px-4">
              {activeLegalPage === 'about' && (
                <div className="max-w-4xl mx-auto px-4 py-8">
                  {/* Breadcrumbs */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-6">
                    <span className="cursor-pointer hover:text-blue-600 transition-colors" onClick={() => navigateTo('/')}>Home</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-slate-600 dark:text-slate-300">About Us</span>
                  </div>

                  <div className="text-center md:text-left mb-10">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-bold tracking-wider uppercase">Our Mission &amp; Philosophy</span>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display text-slate-800 dark:text-white mt-3">
                      About ToolGenic
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 max-w-2xl leading-relaxed">
                      ToolGenic is a premium collection of free online utilities, calculators, and media converters.
                      All processing occurs locally in your browser memory, guaranteeing absolute file privacy and speed.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="p-6 border rounded-2xl bg-white dark:bg-[#121420] border-slate-200 dark:border-slate-800 shadow-sm">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950/40 rounded-xl flex items-center justify-center mb-4">
                        <Sparkles className="w-5 h-5 text-blue-500" />
                      </div>
                      <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-2">Our Mission</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        To empower developers, designers, students, and everyday users with quick digital sandbox utility tools without annoying popups, subscriptions, or file limits. We believe utility tools should be free and instant.
                      </p>
                    </div>

                    <div className="p-6 border rounded-2xl bg-white dark:bg-[#121420] border-slate-200 dark:border-slate-800 shadow-sm">
                      <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-950/40 rounded-xl flex items-center justify-center mb-4">
                        <ShieldCheck className="w-5 h-5 text-indigo-500" />
                      </div>
                      <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-2">Our Privacy Promise</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        No server transfers. No cloud leaks. Everything you process on ToolGenic—whether converting an image, calculating an EMI, parsing text, or formatting JSON—stays entirely inside your local browser memory.
                      </p>
                    </div>
                  </div>

                  <div className="p-8 border rounded-2xl bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800 mb-12">
                    <h3 className="font-extrabold text-sm text-slate-800 dark:text-white mb-4">Core Principles of Our Engineering</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300 mb-1">1. Zero Friction</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">No registrations, login screens, or dynamic email newsletters required to unlock your outputs. Download instantly.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300 mb-1">2. Offline Ready</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">ToolGenic's client-side layout continues working even in tunnels or offline, since tools are written fully in local browser JS.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300 mb-1">3. Mobile-First Craft</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">Designed defensively with elegant responsive grids, safe touch points, and crisp typography to run brilliantly on mobile devices.</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-slate-400 mb-4">Ready to start converting, calculating, or formatting?</p>
                    <button 
                      onClick={() => navigateTo('/')}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 mx-auto cursor-pointer"
                    >
                      Explore Free Tools <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {activeLegalPage === 'privacy' && (
                <div className="max-w-4xl mx-auto px-4 py-8">
                  {/* Breadcrumbs */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-6">
                    <span className="cursor-pointer hover:text-blue-600 transition-colors" onClick={() => navigateTo('/')}>Home</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-slate-600 dark:text-slate-300">Privacy Policy</span>
                  </div>

                  <div className="text-center md:text-left mb-10">
                    <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-bold tracking-wider uppercase">GDPR &amp; CCPA Compliant</span>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display text-slate-800 dark:text-white mt-3">
                      Privacy Policy
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                      Last Updated: July 2026. Your files and calculation inputs NEVER leave your device.
                    </p>
                  </div>

                  <div className="space-y-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <div className="p-6 border rounded-2xl bg-white dark:bg-[#121420] border-slate-200 dark:border-slate-800 text-left">
                      <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-emerald-500" /> 1. No Upload Processing (Browser Local Sandbox)
                      </h3>
                      <p className="mb-2">
                        ToolGenic's primary architecture is browser-centric. Unlike traditional tool portals that upload files to cloud VMs, all our converter calculations, resizing filters, text operations, and encoders run directly within your device's web sandbox.
                      </p>
                      <p>
                        Since we have zero file transfer code, there is no chance of data leakage or unauthorized file persistence.
                      </p>
                    </div>

                    <div className="p-6 border rounded-2xl bg-white dark:bg-[#121420] border-slate-200 dark:border-slate-800 text-left">
                      <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-indigo-500" /> 2. No Personal Data Collected
                      </h3>
                      <p className="mb-2">
                        You do not need to construct accounts or verify your credit card. We do not prompt for:
                      </p>
                      <ul className="list-disc pl-5 space-y-1 mb-2">
                        <li>Your name, address, or phone number</li>
                        <li>Payment details or invoices</li>
                        <li>Any authentication or identity certificates</li>
                      </ul>
                      <p>
                        You are completely anonymous when traversing and using ToolGenic utilities.
                      </p>
                    </div>

                    <div className="p-6 border rounded-2xl bg-white dark:bg-[#121420] border-slate-200 dark:border-slate-800 text-left">
                      <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-blue-500" /> 3. Cookies and Browser LocalStorage
                      </h3>
                      <p className="mb-2">
                        We utilize standard browser <code>localStorage</code> purely to capture user preference settings such as your active visual Theme (Light/Dark), your bookmarked Favorites list, and your Recent Tools history so you can pick up exactly where you left off.
                      </p>
                      <p>
                        This storage resides exclusively on your local computer or phone. You can clear this completely at any time by wiping your browser site cookies/storage.
                      </p>
                    </div>

                    <div className="p-6 border rounded-2xl bg-white dark:bg-[#121420] border-slate-200 dark:border-slate-800 text-left">
                      <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                        <Info className="w-4 h-4 text-slate-500" /> 4. GDPR and CCPA Compliance Statement
                      </h3>
                      <p>
                        Because ToolGenic does not store, harvest, or aggregate personal datasets, we are fundamentally compliant with both European GDPR and California CCPA legislation by design. There is simply no personal information stored on our end to query, delete, or modify.
                      </p>
                    </div>

                    <div className="p-6 border rounded-2xl bg-white dark:bg-[#121420] border-slate-200 dark:border-slate-800 text-left">
                      <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-500" /> 5. Questions and Legal Requests
                      </h3>
                      <p>
                        For any questions regarding our browser-side sandboxed operations, contact us at: 
                        <strong className="text-blue-500 ml-1">support@toolgenichub.com</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeLegalPage === 'terms' && (
                <div className="max-w-4xl mx-auto px-4 py-8">
                  {/* Breadcrumbs */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-6">
                    <span className="cursor-pointer hover:text-blue-600 transition-colors" onClick={() => navigateTo('/')}>Home</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-slate-600 dark:text-slate-300">Terms &amp; Conditions</span>
                  </div>

                  <div className="text-center md:text-left mb-10">
                    <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full text-[10px] font-bold tracking-wider uppercase">Browser Licensing Agreement</span>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display text-slate-800 dark:text-white mt-3">
                      Terms &amp; Conditions
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                      Last Updated: July 2026. Standard usage parameters for browser-side utilities.
                    </p>
                  </div>

                  <div className="space-y-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <div className="p-6 border rounded-2xl bg-white dark:bg-[#121420] border-slate-200 dark:border-slate-800 text-left">
                      <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                        <Scale className="w-4 h-4 text-amber-500" /> 1. Agreement of Terms
                      </h3>
                      <p>
                        By loading and using ToolGenic or any of our offline-friendly calculators and encoders, you agree to these Terms. If you do not accept these local execution clauses, you are instructed to exit the application.
                      </p>
                    </div>

                    <div className="p-6 border rounded-2xl bg-white dark:bg-[#121420] border-slate-200 dark:border-slate-800 text-left">
                      <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-2">
                        2. Permitted Sandbox Use
                      </h3>
                      <p className="mb-2">
                        You are granted a revocable, non-exclusive license to run ToolGenic within standard browser environments for both commercial and private calculation/media-processing operations.
                      </p>
                      <p>
                        <strong>Abuse Restrictions:</strong> You are strictly forbidden from launching high-frequency headless bot scrapers, security vulnerability crawlers, or automation engines aimed at scraping code scripts or bypassing general page visibility.
                      </p>
                    </div>

                    <div className="p-6 border rounded-2xl bg-white dark:bg-[#121420] border-slate-200 dark:border-slate-800 text-left">
                      <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-2">
                        3. Intellectual Property
                      </h3>
                      <p className="mb-2">
                        All custom styling scripts, layout markup, branding logos, sitemaps, and core assembly utilities are the exclusive property of ToolGenic and its designers.
                      </p>
                      <p>
                        Your processed images, decoded text outputs, structured files, and user logs are 100% owned by you. ToolGenic lays no claim to any data output from our browser-side processors.
                    </p>
                    </div>

                    <div className="p-6 border rounded-2xl bg-white dark:bg-[#121420] border-slate-200 dark:border-slate-800 text-left">
                      <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-2">
                        4. Limitation of Warranty
                      </h3>
                      <p className="mb-2">
                        TOOLGENIC AND ALL INTEGRATED CALCULATORS, IMAGE PROCESSORS, AND FORMATTERS ARE PROVIDED "AS IS" AND "AS AVAILABLE", WITHOUT WARRANTY OF ANY QUALITY OR ACCURACY.
                      </p>
                      <p>
                        While we craft every algorithm to be mathematically and procedurally perfect, we make no guarantees that results will be absolutely error-free. You are responsible for verifying your financial and developer outputs before production deployment.
                      </p>
                    </div>

                    <div className="p-6 border rounded-2xl bg-white dark:bg-[#121420] border-slate-200 dark:border-slate-800 text-left">
                      <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-2">
                        5. Liability Limitation
                      </h3>
                      <p>
                        Under no circumstances shall ToolGenic, its authors, or maintainers be liable for any special, direct, indirect, or incidental damage (including financial calculation losses, corrupted image downscales, or server downtime) stemming from your usage.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeLegalPage === 'contact' && (
                <div className="max-w-4xl mx-auto px-4 py-8">
                  {/* Breadcrumbs */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-6">
                    <span className="cursor-pointer hover:text-blue-600 transition-colors" onClick={() => navigateTo('/')}>Home</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-slate-600 dark:text-slate-300">Contact Us</span>
                  </div>

                  <div className="text-center md:text-left mb-10">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 w-fit mx-auto md:mx-0">
                      <CheckCircle className="w-3 h-3" /> 24-Hour Reply SLA Guaranteed
                    </span>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display text-slate-800 dark:text-white mt-3">
                      Get in Touch with ToolGenic
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-xl">
                      Need support, spotted an engineering bug, or want to suggest a new free converter tool? Drop us a note below!
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
                    {/* Left Column: Contact Info */}
                    <div className="md:col-span-5 space-y-6">
                      <div className="p-6 border rounded-2xl bg-white dark:bg-[#121420] border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="font-extrabold text-sm text-slate-800 dark:text-white mb-4">Direct Communication</h3>
                        
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-950/40 rounded-lg flex items-center justify-center shrink-0">
                            <Mail className="w-4 h-4 text-blue-500" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Support</p>
                            <a href="mailto:support@toolgenichub.com" className="text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-blue-500 transition-colors">
                              support@toolgenichub.com
                            </a>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-950/40 rounded-lg flex items-center justify-center shrink-0">
                            <CheckCircle className="w-4 h-4 text-indigo-500" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Response Time</p>
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                              Within 24 business hours
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 border rounded-2xl bg-white dark:bg-[#121420] border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="font-extrabold text-sm text-slate-800 dark:text-white mb-4">Join Our Community</h3>
                        <div className="flex items-center gap-3">
                          <a 
                            href="https://github.com/toolgenic" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-10 h-10 border rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer animate-none"
                          >
                            <Github className="w-5 h-5" />
                          </a>
                          <a 
                            href="https://twitter.com/toolgenic" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-10 h-10 border rounded-xl flex items-center justify-center text-slate-500 hover:text-blue-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer animate-none"
                          >
                            <Twitter className="w-5 h-5" />
                          </a>
                          <a 
                            href="https://linkedin.com/company/toolgenic" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-10 h-10 border rounded-xl flex items-center justify-center text-slate-500 hover:text-blue-600 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer animate-none"
                          >
                            <Linkedin className="w-5 h-5" />
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <div className="md:col-span-7">
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          const form = e.currentTarget;
                          const formData = new FormData(form);
                          const name = formData.get('name');
                          if (name) {
                            setShowNotification(`Thank you, ${name}! Your request has been dispatched. We will reply within 24 hours.`);
                            setTimeout(() => setShowNotification(null), 5500);
                          }
                          form.reset();
                        }}
                        className="p-6 md:p-8 border rounded-2xl bg-white dark:bg-[#121420] border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-left"
                      >
                        <h3 className="font-extrabold text-sm text-slate-800 dark:text-white mb-2">Send a Message</h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Name</label>
                            <input 
                              required 
                              type="text" 
                              name="name"
                              placeholder="John Doe"
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs text-slate-800 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                            <input 
                              required 
                              type="email" 
                              name="email"
                              placeholder="john@example.com"
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs text-slate-800 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subject</label>
                          <input 
                            required 
                            type="text" 
                            name="subject"
                            placeholder="Custom Tool Suggestion / General Inquiry"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs text-slate-800 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Message Description</label>
                          <textarea 
                            required 
                            rows={4}
                            name="message"
                            placeholder="How can we help your browser workflow?"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs text-slate-800 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                          ></textarea>
                        </div>

                        <button 
                          type="submit"
                          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                        >
                          Submit Dispatch <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* FAQ Block for Contact */}
                  <section className="bg-slate-50 dark:bg-slate-900/40 border rounded-2xl p-6 border-slate-200 dark:border-slate-800 text-left mt-8">
                    <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-blue-500" /> Contact Support FAQ
                    </h3>
                    <div className="space-y-4">
                      <div className="border-b border-slate-200 dark:border-slate-800 pb-3 last:border-0 last:pb-0">
                        <h4 className="font-bold text-xs text-slate-700 dark:text-slate-200 mb-1">Can I request a brand new utility?</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">Absolutely! Over 40% of our utility tools exist because of direct requests from developers, students, and engineers. Describe your specifications, inputs, and desired outputs in the contact form, and we will get back to you once integrated.</p>
                      </div>
                      <div className="border-b border-slate-200 dark:border-slate-800 pb-3 last:border-0 last:pb-0">
                        <h4 className="font-bold text-xs text-slate-700 dark:text-slate-200 mb-1">Do you sell custom tool integration?</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">No. ToolGenic is a 100% free community project. We do not sell tools, charge subscriptions, or integrate custom branding paid services.</p>
                      </div>
                      <div className="border-b border-slate-200 dark:border-slate-800 pb-3 last:border-0 last:pb-0">
                        <h4 className="font-bold text-xs text-slate-700 dark:text-slate-200 mb-1">Is my contact message secure?</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">Yes. Messages dispatched through this portal are only used to address your support or suggestion requests. We do not share, sell, or leverage emails for marketing lists or external trackers.</p>
                      </div>
                    </div>
                  </section>
                </div>
              )}
            </div>
          ) : isSitemapPage ? (
            /* ================= VISUAL SITEMAP PAGE ================= */
            <div className="max-w-6xl mx-auto px-4">
              {/* Breadcrumbs */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-6">
                <span className="cursor-pointer hover:text-blue-600 transition-colors" onClick={() => navigateTo('/')}>Home</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-600 dark:text-slate-300">Sitemap</span>
              </div>

              <div className="mb-10 text-center md:text-left">
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-2">XML Structural crawler index</p>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display text-slate-800 dark:text-white">
                  ToolGenic Site Map
                </h1>
                <p className="mt-3 text-base text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                  Browse and discover the complete structural hierarchy of all free online utility tools. Jump to any category workspace or click individual tools to access specialized browser-cached engines.
                </p>
              </div>

              {/* Sitemap Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {CATEGORIES.map(cat => {
                  const IconComp = iconMap[cat.iconName] || Code;
                  const catTools = METADATA.filter(t => t.category === cat.id);
                  return (
                    <div 
                      key={cat.id}
                      className={`p-6 rounded-2xl border ${
                        theme === 'dark' ? 'bg-[#151924]/90 border-slate-800/80' : 'bg-white border-slate-200'
                      }`}
                    >
                      {/* Category Title */}
                      <div className="flex items-center gap-2 mb-4 cursor-pointer" onClick={() => navigateTo(cat.path)}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${cat.colorClass} ${cat.darkColorClass}`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <h3 className="font-extrabold text-xs tracking-tight text-slate-800 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 transition-colors uppercase">
                          {cat.name}
                        </h3>
                      </div>

                      {/* Tool links list */}
                      <ul className="space-y-2 border-t border-slate-100 dark:border-slate-800/60 pt-3">
                        {catTools.map(t => (
                          <li key={t.id}>
                            <button 
                              onClick={() => navigateTo(t.path)}
                              className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:underline text-left leading-tight w-full"
                            >
                              • {t.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {/* Quick Sitemaps FAQ */}
              <section className="bg-slate-50 dark:bg-slate-900/40 border rounded-2xl p-6 border-slate-200 dark:border-slate-800 mb-12">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-3">XML Sitemap & Search Crawling Details</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                  This visual index serves as an index map ensuring 100% search accessibility, completely avoiding orphan pages, and establishing clean structural paths for search engines like Google and Bing.
                </p>
                <div className="flex gap-3">
                  <a href="/sitemap.xml" target="_blank" className="text-xs font-semibold text-blue-500 hover:underline">View sitemap.xml →</a>
                  <a href="/robots.txt" target="_blank" className="text-xs font-semibold text-blue-500 hover:underline">View robots.txt →</a>
                </div>
              </section>
            </div>
          ) : (selectedCategory !== 'all' && selectedCategory !== 'favorites' && selectedCategory !== 'recent') ? (
            /* ================= CATEGORY DEDICATED PAGE ================= */
            <div className="max-w-6xl mx-auto px-4">
              {/* Breadcrumbs */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-6">
                <span className="cursor-pointer hover:text-blue-600 transition-colors" onClick={() => navigateTo('/')}>Home</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-600 dark:text-slate-300">
                  {CATEGORIES.find(c => c.id === selectedCategory)?.name}
                </span>
              </div>

              {/* Category Hero */}
              {(() => {
                const activeCatObj = CATEGORIES.find(c => c.id === selectedCategory);
                if (!activeCatObj) return null;
                const IconComp = iconMap[activeCatObj.iconName] || Code;
                return (
                  <div className="mb-10 text-left">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activeCatObj.colorClass} ${activeCatObj.darkColorClass}`}>
                        <IconComp className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 tracking-widest uppercase">Dedicated Category Suite</span>
                        <h1 className="text-3xl font-extrabold tracking-tight font-display text-slate-800 dark:text-white">
                          {activeCatObj.name}
                        </h1>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                      Explore our fully private suite of {activeCatObj.name}. {activeCatObj.desc} All calculations, media adjustments, and cryptographic digests are compiled natively in your browser cache.
                    </p>
                  </div>
                );
              })()}

              {/* Grid Header */}
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-8">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Available tools in this Category
                </h2>
              </div>

              {/* Tools Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                {filteredTools.map((tool) => {
                  const IconComp = tool.icon;
                  return (
                    <div 
                      key={tool.id}
                      onClick={() => openTool(tool.id)}
                      className={`p-6 rounded-2xl border cursor-pointer group transition-all duration-200 hover:-translate-y-1 ${
                        theme === 'dark' 
                          ? 'bg-[#151924]/90 border-slate-800/80 hover:border-slate-700 hover:shadow-lg hover:shadow-blue-950/20' 
                          : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-md hover:shadow-slate-200/50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${tool.colorClass} ${tool.darkColorClass}`}>
                          <IconComp className="w-5.5 h-5.5" />
                        </div>
                        <button 
                          onClick={(e) => toggleFavorite(tool.id, e)}
                          className={`p-1.5 rounded-lg border hover:scale-110 active:scale-95 transition-all ${
                            favorites.includes(tool.id)
                              ? 'bg-rose-50 border-rose-200 text-rose-500 dark:bg-rose-950/30'
                              : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${favorites.includes(tool.id) ? 'fill-rose-500' : ''}`} />
                        </button>
                      </div>

                      <h3 className="font-bold text-sm tracking-tight text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed h-12 overflow-hidden text-ellipsis">
                        {tool.desc}
                      </p>
                      
                      <div className="flex items-center gap-1 mt-4 text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1.5 transition-transform duration-200">
                        <span>Open Tool</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Related Categories Navigation for Internal linking */}
              <section className={`p-8 rounded-3xl border mb-12 ${theme === 'dark' ? 'bg-[#151924]/40 border-slate-800' : 'bg-white border-slate-200/60 shadow-sm'}`}>
                <h3 className="text-base font-bold mb-4">Explore Other Categories</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {CATEGORIES.filter(c => c.id !== selectedCategory).map(cat => (
                    <button 
                      key={cat.id} 
                      onClick={() => navigateTo(cat.path)}
                      className="px-4 py-3 border text-xs font-semibold rounded-xl text-left hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50/5 transition-all truncate"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          ) : (
            /* ================= APP DASHBOARD HOME ================= */
            <div className="max-w-6xl mx-auto px-4">
              
              {/* Hero Header */}
              <div className="mb-10 text-center md:text-left">
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-2">15+ tools · offline-first sandbox</p>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display text-slate-800 dark:text-white">
                  Free Online Utility Tools
                </h1>
                <p className="mt-3 text-base text-slate-500 dark:text-slate-400 max-w-2xl">
                  ToolGenic is a highly curated, professional suite of local utilities. Compress photos, split PDFs, encode Base64 strings, or manage cryptographic digests safely inside your web memory. 
                </p>

                {/* Mobile Search bar */}
                <div className="mt-6 md:hidden max-w-md mx-auto">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                      <Search className="w-4 h-4" />
                    </span>
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full py-2.5 pl-10 pr-4 rounded-xl border text-sm outline-none transition-all ${
                        theme === 'dark' 
                          ? 'bg-slate-800 border-slate-700 text-slate-200' 
                          : 'bg-white border-slate-200 focus:border-blue-500'
                      }`}
                      placeholder="Type tool name (e.g. Base64)..."
                    />
                  </div>
                </div>

                {/* Popular searches chips */}
                <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs">
                  <span className="text-slate-400 font-medium">Quick Access:</span>
                  <button onClick={() => openTool('image-compressor')} className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-slate-600 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700 transition-all cursor-pointer">
                    Compress Image
                  </button>
                  <button onClick={() => openTool('json-formatter')} className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-slate-600 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700 transition-all cursor-pointer">
                    Format JSON
                  </button>
                  <button onClick={() => openTool('hash-generator')} className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-slate-600 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700 transition-all cursor-pointer">
                    Hash Tool
                  </button>
                  <button onClick={() => openTool('jwt-debugger')} className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-slate-600 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700 transition-all cursor-pointer">
                    JWT Decode
                  </button>
                </div>
              </div>

              {/* Homepage Section: Categories Grid (Prominent category linking) */}
              <section className="mb-12">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h2 className="text-base font-bold tracking-tight uppercase text-slate-400 tracking-wider">Browse Utilities by Category</h2>
                    <p className="text-xs text-slate-400 mt-1">Directly navigate to any dedicated category workbench.</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {CATEGORIES.map((cat) => {
                    const IconComp = iconMap[cat.iconName] || Code;
                    const catCount = METADATA.filter(t => t.category === cat.id).length;
                    return (
                      <div 
                        key={cat.id}
                        onClick={() => navigateTo(cat.path)}
                        className={`p-5 rounded-2xl border cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-200 ${
                          theme === 'dark' 
                            ? 'bg-[#151924]/80 border-slate-800 hover:border-slate-700' 
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${cat.colorClass} ${cat.darkColorClass}`}>
                          <IconComp className="w-5.5 h-5.5" />
                        </div>
                        <h3 className="font-bold text-xs tracking-tight text-slate-800 dark:text-white">{cat.name}</h3>
                        <p className="text-[10px] text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">{cat.desc}</p>
                        <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-blue-600 dark:text-blue-400">
                          <span>{catCount} Tools</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Homepage Section: Popular & Trending Tools */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {/* Popular Tools Column */}
                <section className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924]/40 border-slate-800/80' : 'bg-white border-slate-200/80'}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                      <Sparkles className="w-4 h-4 fill-amber-500" />
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">🔥 Popular Tools</h3>
                  </div>
                  <div className="space-y-3">
                    {POPULAR_TOOLS.map(pt => (
                      <div 
                        key={pt.id} 
                        onClick={() => navigateTo(pt.path)}
                        className="flex items-start justify-between p-3 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/40 cursor-pointer transition-all"
                      >
                        <div>
                          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">{pt.name}</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">{pt.desc}</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0 mt-1" />
                      </div>
                    ))}
                  </div>
                </section>

                {/* Trending Tools Column */}
                <section className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924]/40 border-slate-800/80' : 'bg-white border-slate-200/80'}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
                      <RefreshCw className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">⚡ Trending Tools</h3>
                  </div>
                  <div className="space-y-3">
                    {TRENDING_TOOLS.map(tt => (
                      <div 
                        key={tt.id} 
                        onClick={() => navigateTo(tt.path)}
                        className="flex items-start justify-between p-3 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/40 cursor-pointer transition-all"
                      >
                        <div>
                          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">{tt.name}</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">{tt.desc}</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0 mt-1" />
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Grid Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-200 dark:border-slate-800 pb-5 mb-8">
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-slate-800 dark:text-white uppercase">
                    {selectedCategory === 'all' && 'Featured Utilities Registry'}
                    {selectedCategory === 'favorites' && 'Your Favorite Tools'}
                    {selectedCategory === 'recent' && 'Recently Used Tools'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Showing {filteredTools.length} sandbox-processed local engines.</p>
                </div>

                {/* Category selectors for mobile layout */}
                <div className="flex lg:hidden flex-wrap gap-1.5 w-full">
                  {['all', 'image-tools', 'pdf-tools', 'ai-tools', 'calculators', 'converters', 'developer-tools'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-all ${
                        selectedCategory === cat
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {cat.replace('-tools', '')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tools Grid */}
              {filteredTools.length === 0 ? (
                <div className={`p-12 text-center rounded-2xl border ${
                  theme === 'dark' ? 'bg-[#151924]/40 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <HelpCircle className="w-10 h-10 text-slate-400 mx-auto mb-4" />
                  <p className="text-lg font-bold text-slate-600 dark:text-slate-300">No matching tools found</p>
                  <p className="text-sm text-slate-400 mt-1 mb-4">Try clearing your filters or testing other search terms.</p>
                  <button 
                    onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl text-xs hover:bg-blue-700 transition-all"
                  >
                    Reset Grid filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                  {filteredTools.map((tool) => {
                    const IconComp = tool.icon;
                    return (
                      <div 
                        key={tool.id}
                        onClick={() => openTool(tool.id)}
                        className={`p-6 rounded-2xl border cursor-pointer group transition-all duration-200 hover:-translate-y-1 ${
                          theme === 'dark' 
                            ? 'bg-[#151924]/90 border-slate-800/80 hover:border-slate-700 hover:shadow-lg hover:shadow-blue-950/20' 
                            : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-md hover:shadow-slate-200/50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${tool.colorClass} ${tool.darkColorClass}`}>
                            <IconComp className="w-5.5 h-5.5" />
                          </div>
                          <button 
                            onClick={(e) => toggleFavorite(tool.id, e)}
                            className={`p-1.5 rounded-lg border hover:scale-110 active:scale-95 transition-all ${
                              favorites.includes(tool.id)
                                ? 'bg-rose-50 border-rose-200 text-rose-500 dark:bg-rose-950/30 dark:border-rose-900/40 dark:text-rose-400'
                                : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${favorites.includes(tool.id) ? 'fill-rose-500' : ''}`} />
                          </button>
                        </div>

                        <h3 className="font-bold text-sm tracking-tight text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {tool.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed h-12 overflow-hidden text-ellipsis">
                          {tool.desc}
                        </p>
                        
                        <div className="flex items-center gap-1 mt-4 text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1.5 transition-transform duration-200">
                          <span>Open Tool</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ================= FAQ SECTION ================= */}
              <section id="faq" className={`p-8 md:p-10 rounded-3xl border mb-12 ${
                theme === 'dark' ? 'bg-[#151924]/40 border-slate-800' : 'bg-white border-slate-200/60 shadow-sm'
              }`}>
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-xl font-bold font-display text-center mb-1 text-slate-800 dark:text-white">Frequently Asked Questions</h3>
                  <p className="text-xs text-slate-400 text-center mb-8">Answers to your security, capability, and performance concerns.</p>
                  
                  <div className="space-y-4">
                    {[
                      {
                        q: "Is ToolGenic really free to use?",
                        a: "Yes. Every utility on ToolGenic is 100% free with no premium paywalls, no character constraints, no hidden tiers, and absolutely no watermarks."
                      },
                      {
                        q: "Are my files uploaded to any servers?",
                        a: "No! Privacy is our design. All image compression, base64 conversion, JWT decoding, unit calculations, and cryptographic hashes are computed entirely client-side using JavaScript inside your browser. No files leave your device."
                      },
                      {
                        q: "Do I need to install anything?",
                        a: "No installation required. ToolGenic is a web application that runs inside any modern mobile, tablet, or desktop browser immediately."
                      }
                    ].map((item, idx) => (
                      <details key={idx} className="group border-b border-slate-200 dark:border-slate-800 pb-4 cursor-pointer">
                        <summary className="flex items-center justify-between font-semibold text-xs text-slate-700 dark:text-slate-200 list-none focus:outline-none">
                          <span>{item.q}</span>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform duration-200" />
                        </summary>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed pl-1">
                          {item.a}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              </section>

              {/* ================= SYSTEMS METADATA FOOTER ================= */}
              <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-6 text-xs text-slate-400">
                <div className="flex items-center gap-2 mb-4 sm:mb-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="font-semibold text-slate-500 dark:text-slate-400">All Client-Side Engines Active</span>
                </div>
                <div className="font-mono">
                  v3.1.0 Build 1042 • Private Browser Storage Enabled
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className={`border-t transition-colors text-left ${
        theme === 'dark' ? 'bg-[#0b0c13] border-slate-800/80 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
      }`}>
        {/* Top Segment: Newsletter & Socials */}
        <div className="max-w-6xl mx-auto px-6 py-8 border-b border-slate-200 dark:border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white">Subscribe to ToolGenic Updates</h4>
            <p className="text-[11px] text-slate-400 mt-1">Get notified of newly added calculators, converters, and engineering tools.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch gap-2.5 w-full md:w-auto max-w-md">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const email = new FormData(form).get('email');
                if (email) {
                  setShowNotification(`Successfully subscribed ${email} to weekly tool updates!`);
                  setTimeout(() => setShowNotification(null), 5000);
                }
                form.reset();
              }}
              className="flex items-center gap-2 w-full"
            >
              <input 
                required
                type="email" 
                name="email"
                placeholder="your.email@example.com" 
                className="px-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121420] text-slate-800 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all flex-1"
              />
              <button 
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer select-none"
              >
                Join <Send className="w-3 h-3" />
              </button>
            </form>
          </div>
        </div>

        {/* Middle Segment: Grid */}
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Col 1: Categories */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-4">Categories</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => navigateTo('/image-tools/')} className="hover:text-blue-500 transition-colors cursor-pointer text-left">Image Tools</button></li>
              <li><button onClick={() => navigateTo('/pdf-tools/')} className="hover:text-blue-500 transition-colors cursor-pointer text-left">PDF Tools</button></li>
              <li><button onClick={() => navigateTo('/video-tools/')} className="hover:text-blue-500 transition-colors cursor-pointer text-left">Video Tools</button></li>
              <li><button onClick={() => navigateTo('/audio-tools/')} className="hover:text-blue-500 transition-colors cursor-pointer text-left">Audio Tools</button></li>
              <li><button onClick={() => navigateTo('/calculators/')} className="hover:text-blue-500 transition-colors cursor-pointer text-left">Calculators</button></li>
              <li><button onClick={() => navigateTo('/converters/')} className="hover:text-blue-500 transition-colors cursor-pointer text-left">Converters</button></li>
              <li><button onClick={() => navigateTo('/developer-tools/')} className="hover:text-blue-500 transition-colors cursor-pointer text-left">Developer Tools</button></li>
            </ul>
          </div>

          {/* Col 2: Popular Tools */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-4">Popular Tools</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => navigateTo('/image-tools/compress-image/')} className="hover:text-blue-500 transition-colors cursor-pointer text-left">Compress Image</button></li>
              <li><button onClick={() => navigateTo('/pdf-tools/merge-pdf/')} className="hover:text-blue-500 transition-colors cursor-pointer text-left">Merge PDF</button></li>
              <li><button onClick={() => navigateTo('/image-tools/heic-to-jpg/')} className="hover:text-blue-500 transition-colors cursor-pointer text-left">HEIC to JPG</button></li>
              <li><button onClick={() => navigateTo('/developer-tools/json-formatter/')} className="hover:text-blue-500 transition-colors cursor-pointer text-left">JSON Formatter</button></li>
              <li><button onClick={() => navigateTo('/calculators/age-calculator/')} className="hover:text-blue-500 transition-colors cursor-pointer text-left">Age Calculator</button></li>
            </ul>
          </div>

          {/* Col 3: Latest Additions */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-4">Latest Releases</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => navigateTo('/calculators/sip-calculator/')} className="hover:text-blue-500 transition-colors cursor-pointer text-left">SIP Calculator</button></li>
              <li><button onClick={() => navigateTo('/calculators/income-tax-calculator/')} className="hover:text-blue-500 transition-colors cursor-pointer text-left">Income Tax Calc</button></li>
              <li><button onClick={() => navigateTo('/calculators/gst-calculator/')} className="hover:text-blue-500 transition-colors cursor-pointer text-left">GST Calculator</button></li>
              <li><button onClick={() => navigateTo('/calculators/bmi-calculator/')} className="hover:text-blue-500 transition-colors cursor-pointer text-left">BMI Calculator</button></li>
              <li><button onClick={() => navigateTo('/calculators/scientific-calculator/')} className="hover:text-blue-500 transition-colors cursor-pointer text-left">Scientific Calc</button></li>
            </ul>
          </div>

          {/* Col 4: Legal & Contact */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-4">Support &amp; Legal</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => navigateTo('/about')} className="hover:text-blue-500 transition-colors cursor-pointer text-left font-semibold">About Us</button></li>
              <li><button onClick={() => navigateTo('/privacy')} className="hover:text-blue-500 transition-colors cursor-pointer text-left font-semibold">Privacy Policy</button></li>
              <li><button onClick={() => navigateTo('/terms')} className="hover:text-blue-500 transition-colors cursor-pointer text-left font-semibold">Terms &amp; Conditions</button></li>
              <li><button onClick={() => navigateTo('/contact')} className="hover:text-blue-500 transition-colors cursor-pointer text-left font-semibold text-blue-500">Contact Support</button></li>
              <li><button onClick={() => navigateTo('/sitemap')} className="hover:text-blue-500 transition-colors cursor-pointer text-left">Visual Sitemap</button></li>
            </ul>
          </div>

          {/* Col 5: Security & Platform */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-4">Secure Sandbox</h4>
            <p className="text-[11px] leading-relaxed text-slate-400 mb-4">
              100% browser-based processing. Your files and data are parsed instantly on your local processor with zero server interaction.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                <div className="w-2 h-2 border border-white rounded-sm rotate-45"></div>
              </div>
              <span className="font-extrabold tracking-tight font-display text-xs text-slate-800 dark:text-white">ToolGenic © 2026</span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <a href="https://github.com/toolgenic" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://twitter.com/toolgenic" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com/company/toolgenic" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Segment: Copyright & XML Links */}
        <div className="border-t border-slate-200 dark:border-slate-800/80 py-4 px-6">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-400">
            <div>
              ToolGenic utility suites process all calculations and inputs under client sandboxing permissions.
            </div>
            <div className="flex items-center gap-3">
              <a href="/sitemap.xml" target="_blank" className="hover:text-blue-500 transition-colors font-medium">sitemap.xml</a>
              <span>•</span>
              <a href="/robots.txt" target="_blank" className="hover:text-blue-500 transition-colors font-medium">robots.txt</a>
              <span>•</span>
              <span className="text-emerald-500 font-bold flex items-center gap-1">● SSL Secured Local Sandbox</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// =========================================================================
// ================= INTERACTIVE COMPONENT WORKSPACES =====================
// =========================================================================

interface WorkspaceProps {
  triggerNotification: (msg: string) => void;
  theme: 'light' | 'dark';
}

// ================= JSON FORMATTER =================
function JsonFormatter({ triggerNotification, theme }: WorkspaceProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleFormat = () => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError(null);
      triggerNotification("JSON Formatted Successfully");
    } catch (e: any) {
      setError(e.message || "Invalid JSON syntax");
      setOutput('');
    }
  };

  const handleMinify = () => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
      triggerNotification("JSON Minified Successfully");
    } catch (e: any) {
      setError(e.message || "Invalid JSON syntax");
      setOutput('');
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    triggerNotification("Copied output to clipboard!");
  };

  const loadTemplate = () => {
    const template = {
      app: "ToolGenic",
      version: "2.8.0",
      status: "operational",
      features: ["Format", "Minify", "Validate", "Local-Secure"],
      contributors: [
        { name: "Anish", role: "Maintainer" }
      ],
      settings: {
        theme: "dark",
        offline: true,
        maxFileSizeInMb: 15
      }
    };
    setInput(JSON.stringify(template, null, 2));
    setError(null);
    setOutput('');
  };

  return (
    <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
          <Code className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">JSON Formatter & Validator</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">Validate, pretty-print, indentation tab formatting, and minify strings in real-time.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Raw JSON Input</span>
            <button 
              onClick={loadTemplate}
              className="text-[11px] text-blue-500 hover:underline font-semibold"
            >
              Load Sample Template
            </button>
          </div>
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`w-full h-80 p-4 rounded-xl border text-xs font-mono outline-none focus:ring-1 focus:ring-indigo-500 ${
              theme === 'dark' ? 'bg-slate-800/50 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200'
            }`}
            placeholder='Paste your JSON payload here... e.g. {"key": "value"}'
          />
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Formatted JSON Output</span>
            {output && (
              <button 
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] text-blue-500 hover:underline font-semibold"
              >
                <Copy className="w-3 h-3" /> Copy Output
              </button>
            )}
          </div>
          <div className="relative">
            <textarea 
              readOnly
              value={output}
              className={`w-full h-80 p-4 rounded-xl border text-xs font-mono outline-none cursor-text ${
                theme === 'dark' ? 'bg-slate-800/30 border-slate-700 text-emerald-400' : 'bg-slate-100 border-slate-200 text-emerald-600'
              }`}
              placeholder="Your formatted JSON will output here..."
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2 p-3.5 rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-950/20 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">JSON Syntax Error:</span> {error}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="mt-6 flex flex-wrap gap-2 justify-end border-t border-slate-200 dark:border-slate-800 pt-5">
        <button 
          onClick={() => { setInput(''); setOutput(''); setError(null); }}
          className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          Clear Workspace
        </button>
        <button 
          onClick={handleMinify}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-800 text-white dark:bg-slate-700 dark:hover:bg-slate-600 hover:bg-slate-700 transition-colors"
        >
          Minify JSON
        </button>
        <button 
          onClick={handleFormat}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/10 transition-colors"
        >
          Format & Validate
        </button>
      </div>
    </div>
  );
}

// ================= BASE64 CODEC =================
function Base64Codec({ triggerNotification, theme }: WorkspaceProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isDecode, setIsDecode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCompute = (text: string, decoding: boolean) => {
    if (!text.trim()) {
      setOutput('');
      setError(null);
      return;
    }
    try {
      if (decoding) {
        // base64 decode
        const decoded = atob(text);
        setOutput(decoded);
        setError(null);
      } else {
        // base64 encode
        const encoded = btoa(text);
        setOutput(encoded);
        setError(null);
      }
    } catch (e: any) {
      setError("Unable to convert: Invalid Base64 encoded character bytes.");
      setOutput('');
    }
  };

  const onInputChange = (val: string) => {
    setInput(val);
    handleCompute(val, isDecode);
  };

  const toggleMode = () => {
    const tempInput = input;
    const tempOutput = output;
    setInput(tempOutput);
    setOutput(tempInput);
    setIsDecode(!isDecode);
    setError(null);
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    triggerNotification("Copied output!");
  };

  return (
    <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
          <RefreshCw className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Base64 Encoder / Decoder</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">Encode simple text to binary-safe transport structures or decode strings back instantly.</p>

      {/* Mode selectors */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 pb-4 mb-4 gap-2">
        <button 
          onClick={() => { setIsDecode(false); handleCompute(input, false); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            !isDecode 
              ? 'bg-blue-600 text-white' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          Encode Mode (Text → Base64)
        </button>
        <button 
          onClick={() => { setIsDecode(true); handleCompute(input, true); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            isDecode 
              ? 'bg-blue-600 text-white' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          Decode Mode (Base64 → Text)
        </button>
        <button 
          onClick={toggleMode}
          className="ml-auto flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 hover:text-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl"
        >
          <RefreshCw className="w-3 h-3" /> Swap
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <span className="text-xs font-bold text-slate-400 block mb-2 uppercase">
            {isDecode ? "Encoded Base64 Input" : "UTF-8 Text Input"}
          </span>
          <textarea 
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            className={`w-full h-64 p-4 rounded-xl border text-xs font-mono outline-none focus:ring-1 focus:ring-emerald-500 ${
              theme === 'dark' ? 'bg-slate-800/50 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200'
            }`}
            placeholder={isDecode ? 'Paste Base64 payload (e.g. VG9vbEdlbmlj)' : 'Type or paste readable text here...'}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">
              {isDecode ? "Decoded Plaintext Output" : "Encoded Base64 Output"}
            </span>
            {output && (
              <button onClick={handleCopy} className="flex items-center gap-1 text-[11px] text-blue-500 font-semibold hover:underline">
                <Copy className="w-3 h-3" /> Copy Output
              </button>
            )}
          </div>
          <textarea 
            readOnly
            value={output}
            className={`w-full h-64 p-4 rounded-xl border text-xs font-mono outline-none ${
              theme === 'dark' ? 'bg-slate-800/30 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}
            placeholder="Result will automatically compute here..."
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 rounded-xl text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

// ================= URL CODEC =================
function UrlCodec({ triggerNotification, theme }: WorkspaceProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isDecode, setIsDecode] = useState(false);

  const handleCompute = (text: string, dec: boolean) => {
    if (!text.trim()) {
      setOutput('');
      return;
    }
    try {
      if (dec) {
        setOutput(decodeURIComponent(text));
      } else {
        setOutput(encodeURIComponent(text));
      }
    } catch {
      setOutput("Error: Invalid URI character sequences.");
    }
  };

  const onInputChange = (val: string) => {
    setInput(val);
    handleCompute(val, isDecode);
  };

  return (
    <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
          <Sliders className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">URL Encoder / Decoder</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">Convert special path or query characters into percentage encodings for safe web browser standard operations.</p>

      <div className="flex border-b border-slate-200 dark:border-slate-800 pb-4 mb-4 gap-2">
        <button 
          onClick={() => { setIsDecode(false); handleCompute(input, false); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            !isDecode ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
          }`}
        >
          Encode (Param → %20)
        </button>
        <button 
          onClick={() => { setIsDecode(true); handleCompute(input, true); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            isDecode ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
          }`}
        >
          Decode (%20 → Param)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <span className="text-xs font-bold text-slate-400 block mb-2 uppercase">URI String Input</span>
          <textarea 
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            className={`w-full h-64 p-4 rounded-xl border text-xs font-mono outline-none focus:ring-1 focus:ring-amber-500 ${
              theme === 'dark' ? 'bg-slate-800/50 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200'
            }`}
            placeholder="Paste raw URL or encoded parameters here..."
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Computed Output</span>
            {output && (
              <button onClick={() => { navigator.clipboard.writeText(output); triggerNotification("Copied URL!"); }} className="flex items-center gap-1 text-[11px] text-blue-500 font-semibold hover:underline">
                <Copy className="w-3 h-3" /> Copy Output
              </button>
            )}
          </div>
          <textarea 
            readOnly
            value={output}
            className={`w-full h-64 p-4 rounded-xl border text-xs font-mono outline-none ${
              theme === 'dark' ? 'bg-slate-800/30 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}
            placeholder="Outputs immediately in real-time..."
          />
        </div>
      </div>
    </div>
  );
}

// ================= CRYPTO HASH GENERATOR =================
function HashGenerator({ triggerNotification, theme }: WorkspaceProps) {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState({ sha1: '', sha256: '', sha512: '' });

  const computeHashes = async (text: string) => {
    if (!text) {
      setHashes({ sha1: '', sha256: '', sha512: '' });
      return;
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    const runHash = async (alg: 'SHA-1' | 'SHA-256' | 'SHA-512') => {
      const buffer = await crypto.subtle.digest(alg, data);
      return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    };

    const s1 = await runHash('SHA-1');
    const s256 = await runHash('SHA-256');
    const s512 = await runHash('SHA-512');
    setHashes({ sha1: s1, sha256: s256, sha512: s512 });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInput(val);
    computeHashes(val);
  };

  const copyHash = (hash: string, label: string) => {
    if (!hash) return;
    navigator.clipboard.writeText(hash);
    triggerNotification(`Copied ${label} Checksum!`);
  };

  return (
    <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
          <FileCode className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Cryptographic Hash Generator</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">Compute secure, irreversible SHA-1, SHA-256, and SHA-512 hashes from input strings locally.</p>

      <div className="space-y-5">
        <div>
          <span className="text-xs font-bold text-slate-400 block mb-2 uppercase">Plaintext String Input</span>
          <textarea 
            value={input}
            onChange={handleInputChange}
            className={`w-full h-32 p-4 rounded-xl border text-xs font-mono outline-none focus:ring-1 focus:ring-rose-500 ${
              theme === 'dark' ? 'bg-slate-800/50 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200'
            }`}
            placeholder="Type or paste text string to generate crypt hashes..."
          />
        </div>

        {/* Hashes Outputs */}
        <div className="space-y-4">
          {[
            { label: 'SHA-256 Checksum', value: hashes.sha256, color: 'text-rose-500' },
            { label: 'SHA-1 (Legacy)', value: hashes.sha1, color: 'text-amber-500' },
            { label: 'SHA-512 (Extended)', value: hashes.sha512, color: 'text-indigo-500' }
          ].map((item, idx) => (
            <div key={idx} className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/30 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold tracking-wide uppercase">{item.label}</span>
                {item.value && (
                  <button 
                    onClick={() => copyHash(item.value, item.label)} 
                    className="flex items-center gap-1 text-[11px] text-blue-500 font-bold hover:underline"
                  >
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                )}
              </div>
              <p className={`text-xs font-mono break-all leading-relaxed ${item.value ? item.color : 'text-slate-400'}`}>
                {item.value || 'Input text to calculate checksum...'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ================= JWT DEBUGGER =================
function JwtDebugger({ triggerNotification, theme }: WorkspaceProps) {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState<string>('');
  const [payload, setPayload] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleDecode = (jwt: string) => {
    if (!jwt.trim()) {
      setHeader('');
      setPayload('');
      setError(null);
      return;
    }
    const parts = jwt.split('.');
    if (parts.length < 2 || parts.length > 3) {
      setError("Invalid format: A JWT must consist of 3 parts separated by dots (Header, Payload, Signature).");
      setHeader('');
      setPayload('');
      return;
    }

    try {
      const base64UrlDecode = (str: string) => {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
          base64 += '=';
        }
        return decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
      };

      const hDec = base64UrlDecode(parts[0]);
      const pDec = base64UrlDecode(parts[1]);

      setHeader(JSON.stringify(JSON.parse(hDec), null, 2));
      setPayload(JSON.stringify(JSON.parse(pDec), null, 2));
      setError(null);
    } catch {
      setError("Decoder Error: Failed to base64url decode token components.");
      setHeader('');
      setPayload('');
    }
  };

  const loadSampleJwt = () => {
    // Sample JWT token structure
    const sample = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFuaXNoIEtvbmFka2FyIiwiZW1haWwiOiJhbmlzaC5rb25hZGthckBnbWFpbC5jb20iLCJpYXQiOjE1MTYyMzkwMjIsImFjdGl2ZSI6dHJ1ZX0.signatureHere";
    setToken(sample);
    handleDecode(sample);
  };

  return (
    <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-400">
          <Layers className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">JWT Debugger</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">Decode JSON Web Tokens (JWT) locally to inspect token claims, headers, and expiry timestamps.</p>

      <div className="space-y-5">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">JWT Encoded String</span>
            <button onClick={loadSampleJwt} className="text-[11px] text-blue-500 font-bold hover:underline">
              Load Demo JWT Token
            </button>
          </div>
          <textarea 
            value={token}
            onChange={(e) => { setToken(e.target.value); handleDecode(e.target.value); }}
            className={`w-full h-24 p-4 rounded-xl border text-xs font-mono outline-none focus:ring-1 focus:ring-cyan-500 ${
              theme === 'dark' ? 'bg-slate-800/50 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200'
            }`}
            placeholder="Paste your base64url-encoded JWT here..."
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 rounded-xl text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Header section */}
          <div>
            <span className="text-xs font-bold text-slate-400 block mb-2 uppercase">Decoded Header (Algorithm & Typ)</span>
            <textarea 
              readOnly
              value={header}
              className={`w-full h-64 p-4 rounded-xl border text-xs font-mono outline-none ${
                theme === 'dark' ? 'bg-slate-800/30 border-slate-700 text-rose-400' : 'bg-slate-100 border-slate-200 text-rose-600'
              }`}
              placeholder="Header JSON metadata..."
            />
          </div>

          {/* Payload section */}
          <div>
            <span className="text-xs font-bold text-slate-400 block mb-2 uppercase">Decoded Payload (Data Claims)</span>
            <textarea 
              readOnly
              value={payload}
              className={`w-full h-64 p-4 rounded-xl border text-xs font-mono outline-none ${
                theme === 'dark' ? 'bg-slate-800/30 border-slate-700 text-blue-400' : 'bg-slate-100 border-slate-200 text-blue-600'
              }`}
              placeholder="Payload data claims..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ================= WORD COUNTER & SCRATCHPAD =================
function WordCounterTool({ triggerNotification, theme }: WorkspaceProps) {
  const [text, setText] = useState('');

  const metrics = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed === '' ? 0 : trimmed.split(/\s+/).length;
    const chars = text.length;
    const noSpaceChars = text.replace(/\s/g, '').length;
    const paragraphs = trimmed === '' ? 0 : text.split(/\n+/).filter(p => p.trim() !== '').length;
    const sentences = trimmed === '' ? 0 : text.split(/[.!?]+/).filter(s => s.trim() !== '').length;
    const readTime = Math.ceil(words / 225); // average 225 wpm reading speed
    return { words, chars, noSpaceChars, paragraphs, sentences, readTime };
  }, [text]);

  const changeCase = (mode: 'upper' | 'lower' | 'title' | 'trim') => {
    if (!text) return;
    if (mode === 'upper') {
      setText(text.toUpperCase());
    } else if (mode === 'lower') {
      setText(text.toLowerCase());
    } else if (mode === 'title') {
      const title = text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
      setText(title);
    } else if (mode === 'trim') {
      setText(text.trim().replace(/\s+/g, ' '));
    }
    triggerNotification(`Converted text case style`);
  };

  return (
    <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-pink-50 text-pink-600 dark:bg-pink-950/50 dark:text-pink-400">
          <FileText className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Word Counter & Content Workspace</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6 font-sans">Analyze paragraphs, letters, spaces, and apply dynamic formatting conversions natively.</p>

      {/* Grid of indicators */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3.5 mb-5">
        {[
          { label: 'Words', value: metrics.words, color: 'text-indigo-500' },
          { label: 'Characters', value: metrics.chars, color: 'text-emerald-500' },
          { label: 'No Spaces', value: metrics.noSpaceChars, color: 'text-blue-500' },
          { label: 'Sentences', value: metrics.sentences, color: 'text-pink-500' },
          { label: 'Paragraphs', value: metrics.paragraphs, color: 'text-amber-500' },
          { label: 'Read Time', value: `${metrics.readTime}m`, color: 'text-rose-500' }
        ].map((stat, idx) => (
          <div key={idx} className={`p-3 rounded-xl border text-center ${theme === 'dark' ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'}`}>
            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">{stat.label}</div>
            <div className={`text-lg font-extrabold font-mono ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      <textarea 
        value={text}
        onChange={(e) => setText(e.target.value)}
        className={`w-full h-64 p-4 rounded-xl border text-xs font-sans outline-none focus:ring-1 focus:ring-pink-500 mb-4 ${
          theme === 'dark' ? 'bg-slate-800/50 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200'
        }`}
        placeholder="Type, write or paste content logs to calculate metrics in real-time..."
      />

      {/* Case formatting buttons */}
      <div className="flex flex-wrap gap-2 justify-between">
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => changeCase('upper')} className="px-3.5 py-2 text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
            UPPERCASE
          </button>
          <button onClick={() => changeCase('lower')} className="px-3.5 py-2 text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
            lowercase
          </button>
          <button onClick={() => changeCase('title')} className="px-3.5 py-2 text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
            Title Case
          </button>
          <button onClick={() => changeCase('trim')} className="px-3.5 py-2 text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg" title="Remove excessive double spacing">
            Trim Spacing
          </button>
        </div>

        <div className="flex gap-2">
          <button onClick={() => { setText(''); triggerNotification("Cleared Workspace"); }} className="px-3.5 py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg border border-transparent">
            Clear Text
          </button>
          <button onClick={() => { navigator.clipboard.writeText(text); triggerNotification("Copied text!"); }} className="px-4 py-2 text-xs font-bold bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700">
            Copy Text
          </button>
        </div>
      </div>
    </div>
  );
}

// ================= IMAGE COMPRESSOR & RESIZER =================
function ImageCompressorTool({ triggerNotification, theme }: WorkspaceProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  
  const [quality, setQuality] = useState<number>(0.75);
  const [scaleWidth, setScaleWidth] = useState<number>(0);
  const [scaleHeight, setScaleHeight] = useState<number>(0);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [keepAspect, setKeepAspect] = useState<boolean>(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    loadImage(file);
  };

  const loadImage = (file: File) => {
    setImageFile(file);
    setOriginalSize(file.size);
    setCompressedUrl(null);
    setCompressedSize(0);

    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setPreviewUrl(url);

      const img = new Image();
      img.onload = () => {
        setScaleWidth(img.width);
        setScaleHeight(img.height);
        setAspectRatio(img.width / img.height);
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
  };

  const handleWidthChange = (val: number) => {
    setScaleWidth(val);
    if (keepAspect) {
      setScaleHeight(Math.round(val / aspectRatio));
    }
  };

  const handleHeightChange = (val: number) => {
    setScaleHeight(val);
    if (keepAspect) {
      setScaleWidth(Math.round(val * aspectRatio));
    }
  };

  const performCompression = () => {
    if (!previewUrl || !imageFile) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = scaleWidth || img.width;
      canvas.height = scaleHeight || img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Export to JPEG with quality scale (0 to 1)
        const outputType = 'image/jpeg';
        const dataUrl = canvas.toDataURL(outputType, quality);
        setCompressedUrl(dataUrl);

        // Calculate size from base64 string bytes representation
        const head = `data:${outputType};base64,`;
        const approxSize = Math.round((dataUrl.length - head.length) * 3 / 4);
        setCompressedSize(approxSize);
        triggerNotification("Image Scaled & Compressed Successfully");
      }
    };
    img.src = previewUrl;
  };

  const downloadImage = () => {
    if (!compressedUrl || !imageFile) return;
    const link = document.createElement('a');
    link.download = `toolgenic_${imageFile.name.replace(/\.[^/.]+$/, "")}.jpg`;
    link.href = compressedUrl;
    link.click();
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
          <ImageIcon className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Local Image Compressor & Resizer</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">Compress PNG/JPG files locally using browser Canvas. Re-scale aspect width and heights instantly.</p>

      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {!imageFile ? (
        /* Drag box */
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-blue-50/10 ${
            theme === 'dark' ? 'border-slate-700 bg-slate-800/10' : 'border-slate-300 bg-slate-50'
          }`}
        >
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <p className="text-xs font-bold text-slate-500">Click to upload your image file (PNG, JPG, WebP)</p>
          <p className="text-[10px] text-slate-400 mt-1">100% Secure: Files never leave your local browser sandbox</p>
        </div>
      ) : (
        /* Loaded tool screen */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Control Form */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b pb-2">
                <span className="font-semibold">Selected: {imageFile.name}</span>
                <span>Original Size: {formatBytes(originalSize)}</span>
              </div>

              {/* Quality slider */}
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1.5 uppercase">Compression Quality: {Math.round(quality * 100)}%</label>
                <input 
                  type="range" 
                  min="0.1" 
                  max="1.0" 
                  step="0.05"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Scaling settings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1 uppercase">Width (px)</label>
                  <input 
                    type="number"
                    value={scaleWidth}
                    onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                    className={`w-full p-2.5 rounded-xl border text-xs font-mono outline-none focus:border-blue-500 ${
                      theme === 'dark' ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1 uppercase">Height (px)</label>
                  <input 
                    type="number"
                    value={scaleHeight}
                    onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                    className={`w-full p-2.5 rounded-xl border text-xs font-mono outline-none focus:border-blue-500 ${
                      theme === 'dark' ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
              </div>

              {/* Aspect option */}
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={keepAspect}
                  onChange={(e) => setKeepAspect(e.target.checked)}
                  className="rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <span>Lock Aspect Ratio ({aspectRatio.toFixed(2)}:1)</span>
              </label>

              <button 
                onClick={performCompression}
                className="w-full py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-lg hover:bg-blue-700 transition-all"
              >
                Apply Scaling & Compress
              </button>
            </div>

            {/* Preview image panel */}
            <div className={`p-4 rounded-xl border flex flex-col items-center justify-center ${
              theme === 'dark' ? 'bg-slate-800/30 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              {compressedUrl ? (
                <>
                  <img src={compressedUrl} alt="Compressed Result" className="max-h-48 rounded-lg shadow object-contain mb-3" />
                  <div className="text-center">
                    <p className="text-xs font-bold text-emerald-500">Compressed Successfully!</p>
                    <p className="text-xs font-mono text-slate-400 mt-1">
                      New Size: {formatBytes(compressedSize)} (Saved {Math.max(0, Math.round((1 - compressedSize/originalSize)*100))}%!)
                    </p>
                    <button 
                      onClick={downloadImage}
                      className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md hover:bg-emerald-600 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Compressed JPG
                    </button>
                  </div>
                </>
              ) : (
                previewUrl && (
                  <>
                    <img src={previewUrl} alt="Original uploaded file" className="max-h-48 rounded-lg shadow object-contain mb-2" />
                    <span className="text-[10px] text-slate-400">Preview of original file</span>
                  </>
                )
              )}
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-800 pt-4">
            <button 
              onClick={() => { setImageFile(null); setPreviewUrl(null); setCompressedUrl(null); }}
              className="text-xs font-bold text-red-500 hover:underline"
            >
              Reset / Load Different Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ================= SMART UNIT CONVERTER =================
function UnitConverterTool({ theme }: WorkspaceProps) {
  const [category, setCategory] = useState<'length' | 'weight' | 'temp'>('length');
  const [valFrom, setValFrom] = useState<number>(1);
  const [unitFrom, setUnitFrom] = useState<string>('m');
  const [unitTo, setUnitTo] = useState<string>('ft');

  const convertUnits = () => {
    const from = unitFrom;
    const to = unitTo;
    const val = valFrom;

    if (category === 'length') {
      // Base unit: meters (m)
      const toMeters: Record<string, number> = { m: 1, cm: 0.01, mm: 0.001, ft: 0.3048, in: 0.0254, km: 1000 };
      const valInM = val * (toMeters[from] || 1);
      const result = valInM / (toMeters[to] || 1);
      return parseFloat(result.toFixed(4));
    } else if (category === 'weight') {
      // Base unit: kilograms (kg)
      const toKg: Record<string, number> = { kg: 1, g: 0.001, lb: 0.45359237, oz: 0.028349523125 };
      const valInKg = val * (toKg[from] || 1);
      const result = valInKg / (toKg[to] || 1);
      return parseFloat(result.toFixed(4));
    } else if (category === 'temp') {
      if (from === to) return val;
      let valInC = val;
      if (from === 'f') valInC = (val - 32) * 5/9;
      if (from === 'k') valInC = val - 273.15;

      let finalVal = valInC;
      if (to === 'f') finalVal = (valInC * 9/5) + 32;
      if (to === 'k') finalVal = valInC + 273.15;
      return parseFloat(finalVal.toFixed(2));
    }
    return 0;
  };

  const convertedValue = convertUnits();

  // Handle switching type
  const handleCatChange = (cat: 'length' | 'weight' | 'temp') => {
    setCategory(cat);
    if (cat === 'length') {
      setUnitFrom('m');
      setUnitTo('ft');
    } else if (cat === 'weight') {
      setUnitFrom('kg');
      setUnitTo('lb');
    } else {
      setUnitFrom('c');
      setUnitTo('f');
    }
  };

  return (
    <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
          <Calculator className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Smart Unit Converter</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">Instantly convert measurements across metric, imperial, and astronomical weight / dimensions.</p>

      {/* Category selector tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 pb-4 mb-5 gap-2">
        {(['length', 'weight', 'temp'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => handleCatChange(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
              category === cat
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* From side */}
        <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/30 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <label className="text-xs font-bold text-slate-400 block mb-1.5 uppercase">From Quantity</label>
          <div className="flex gap-2">
            <input 
              type="number"
              value={valFrom}
              onChange={(e) => setValFrom(parseFloat(e.target.value) || 0)}
              className={`flex-1 p-2.5 rounded-xl border text-xs font-mono outline-none focus:border-blue-500 ${
                theme === 'dark' ? 'bg-slate-800/60 border-slate-700 text-slate-100' : 'bg-white border-slate-200'
              }`}
            />
            <select
              value={unitFrom}
              onChange={(e) => setUnitFrom(e.target.value)}
              className={`p-2 rounded-xl border text-xs outline-none ${
                theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-200'
              }`}
            >
              {category === 'length' && (
                <>
                  <option value="m">Meters (m)</option>
                  <option value="cm">Centimeters (cm)</option>
                  <option value="mm">Millimeters (mm)</option>
                  <option value="km">Kilometers (km)</option>
                  <option value="ft">Feet (ft)</option>
                  <option value="in">Inches (in)</option>
                </>
              )}
              {category === 'weight' && (
                <>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="g">Grams (g)</option>
                  <option value="lb">Pounds (lb)</option>
                  <option value="oz">Ounces (oz)</option>
                </>
              )}
              {category === 'temp' && (
                <>
                  <option value="c">Celsius (°C)</option>
                  <option value="f">Fahrenheit (°F)</option>
                  <option value="k">Kelvin (K)</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* To side */}
        <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/30 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <label className="text-xs font-bold text-slate-400 block mb-1.5 uppercase">Converted Output</label>
          <div className="flex gap-2">
            <input 
              type="number"
              readOnly
              value={convertedValue}
              className={`flex-1 p-2.5 rounded-xl border text-xs font-mono outline-none ${
                theme === 'dark' ? 'bg-slate-800/20 border-slate-700 text-emerald-400' : 'bg-slate-100 border-slate-200 text-emerald-600'
              }`}
            />
            <select
              value={unitTo}
              onChange={(e) => setUnitTo(e.target.value)}
              className={`p-2 rounded-xl border text-xs outline-none ${
                theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-200'
              }`}
            >
              {category === 'length' && (
                <>
                  <option value="m">Meters (m)</option>
                  <option value="cm">Centimeters (cm)</option>
                  <option value="mm">Millimeters (mm)</option>
                  <option value="km">Kilometers (km)</option>
                  <option value="ft">Feet (ft)</option>
                  <option value="in">Inches (in)</option>
                </>
              )}
              {category === 'weight' && (
                <>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="g">Grams (g)</option>
                  <option value="lb">Pounds (lb)</option>
                  <option value="oz">Ounces (oz)</option>
                </>
              )}
              {category === 'temp' && (
                <>
                  <option value="c">Celsius (°C)</option>
                  <option value="f">Fahrenheit (°F)</option>
                  <option value="k">Kelvin (K)</option>
                </>
              )}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
