import React, { useState, useEffect } from 'react';
import { Lock, Copy, RefreshCw, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';

interface ToolProps {
  triggerNotification: (msg: string) => void;
  theme: 'light' | 'dark';
}

export default function PasswordGeneratorTool({ triggerNotification, theme }: ToolProps) {
  const [password, setPassword] = useState<string>('');
  const [length, setLength] = useState<number>(16);
  const [includeUpper, setIncludeUpper] = useState<boolean>(true);
  const [includeLower, setIncludeLower] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [excludeSimilar, setExcludeSimilar] = useState<boolean>(false);
  const [pronounceable, setPronounceable] = useState<boolean>(false);

  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 8) score++;
    if (pass.length > 12) score++;
    if (pass.length > 16) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 3) return { label: 'Weak', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' };
    if (score <= 5) return { label: 'Moderate', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' };
    return { label: 'Strong / High Entropy', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' };
  };

  const generate = () => {
    if (pronounceable) {
      // Generate readable pronounceable password using alternating consonant-vowel combinations
      const cons = 'bcdfghjklmnpqrstvwxyz';
      const vow = 'aeiou';
      let result = '';
      for (let i = 0; i < length; i++) {
        if (i % 2 === 0) {
          result += cons.charAt(Math.floor(Math.random() * cons.length));
        } else {
          result += vow.charAt(Math.floor(Math.random() * vow.length));
        }
      }
      // Capitalize first letter
      result = result.charAt(0).toUpperCase() + result.slice(1);
      // Append a random number and symbol at the end to make it secure
      if (includeNumbers) result += Math.floor(Math.random() * 9);
      if (includeSymbols) result += '!';
      setPassword(result.slice(0, length));
      return;
    }

    let chars = '';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    if (includeUpper) chars += upper;
    if (includeLower) chars += lower;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;

    if (excludeSimilar) {
      // Remove o/0, l/1, i/I, etc.
      chars = chars.replace(/[oOl0iI1]/g, '');
    }

    if (!chars) {
      setPassword('');
      return;
    }

    let result = '';
    // Use modern Cryptographically secure window.crypto random values
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += chars.charAt(array[i] % chars.length);
    }
    setPassword(result);
  };

  useEffect(() => {
    generate();
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols, excludeSimilar, pronounceable]);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    triggerNotification('Password copied to clipboard!');
  };

  const strength = calculateStrength(password);

  return (
    <div id="pwd-gen-tool-root" className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-900/50 dark:text-slate-400">
          <Lock className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Secure Password Generator</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">Generate highly customizable cryptographically secure random passwords to guard database and mail accounts.</p>

      <div className="space-y-5">
        {/* Output view row */}
        <div className={`p-4 rounded-xl border flex items-center justify-between ${
          theme === 'dark' ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'
        }`}>
          <span className="text-sm font-mono font-bold break-all select-all select-none text-blue-600 dark:text-blue-400">
            {password || 'Please select criteria'}
          </span>
          <div className="flex gap-2 shrink-0 ml-4">
            <button 
              onClick={generate}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
              title="Regenerate"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button 
              onClick={handleCopy}
              disabled={!password}
              className="px-3.5 py-1.5 bg-blue-600 text-white hover:bg-blue-700 font-semibold text-xs rounded-lg transition-all"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Strength Meter */}
        {password && (
          <div className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${strength.color}`}>
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Entropy Level: {strength.label}</span>
          </div>
        )}

        {/* Form Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* Slider length */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">Password Length: {length}</span>
              </div>
              <input 
                type="range" 
                min="8" 
                max="128" 
                value={length} 
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Pronounceable check */}
            <label className="flex items-center gap-2.5 text-xs text-slate-500 font-semibold cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={pronounceable} 
                onChange={(e) => setPronounceable(e.target.checked)}
                className="rounded text-blue-600 border-slate-300 focus:ring-blue-500" 
              />
              <span>Pronounceable / Readable combinations (Easy to remember)</span>
            </label>

            {/* Exclude similar characters check */}
            <label className="flex items-center gap-2.5 text-xs text-slate-500 font-semibold cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={excludeSimilar} 
                onChange={(e) => setExcludeSimilar(e.target.checked)}
                disabled={pronounceable}
                className="rounded text-blue-600 border-slate-300 focus:ring-blue-500" 
              />
              <span>Avoid Similar characters (e.g. O, 0, l, I, 1)</span>
            </label>
          </div>

          {/* Toggle buttons list */}
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wide">Included Characters</span>
            <div className="grid grid-cols-2 gap-3">
              {[
                { checked: includeUpper, setChecked: setIncludeUpper, label: 'Uppercase (A-Z)' },
                { checked: includeLower, setChecked: setIncludeLower, label: 'Lowercase (a-z)' },
                { checked: includeNumbers, setChecked: setIncludeNumbers, label: 'Numbers (0-9)' },
                { checked: includeSymbols, setChecked: setIncludeSymbols, label: 'Symbols (!@#$)' }
              ].map((opt) => (
                <label key={opt.label} className="flex items-center gap-2 text-xs text-slate-500 font-semibold cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={opt.checked} 
                    onChange={(e) => opt.setChecked(e.target.checked)}
                    disabled={pronounceable}
                    className="rounded text-blue-600 border-slate-300 focus:ring-blue-500" 
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
