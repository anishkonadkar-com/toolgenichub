import React, { useState, useEffect } from 'react';
import { Sliders, Percent, ArrowRight } from 'lucide-react';

interface ToolProps {
  triggerNotification: (msg: string) => void;
  theme: 'light' | 'dark';
}

export default function PercentageCalculatorTool({ triggerNotification, theme }: ToolProps) {
  // Mode 1: What is X% of Y?
  const [x1, setX1] = useState<number>(15);
  const [y1, setY1] = useState<number>(250);
  const [res1, setRes1] = useState<number | null>(null);

  // Mode 2: X is what % of Y?
  const [x2, setX2] = useState<number>(50);
  const [y2, setY2] = useState<number>(200);
  const [res2, setRes2] = useState<number | null>(null);

  // Mode 3: Percentage increase/decrease from X to Y
  const [x3, setX3] = useState<number>(80);
  const [y3, setY3] = useState<number>(120);
  const [res3, setRes3] = useState<any>(null);

  // Mode 4: Add/Subtract X% to/from Y
  const [x4, setX4] = useState<number>(10);
  const [y4, setY4] = useState<number>(500);
  const [isAdd, setIsAdd] = useState<boolean>(true);
  const [res4, setRes4] = useState<number | null>(null);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  useEffect(() => {
    setRes1(Number(((x1 / 100) * y1).toFixed(4)));
  }, [x1, y1]);

  useEffect(() => {
    if (y2 === 0) {
      setRes2(0);
    } else {
      setRes2(Number(((x2 / y2) * 100).toFixed(4)));
    }
  }, [x2, y2]);

  useEffect(() => {
    if (x3 === 0) {
      setRes3({ value: 0, type: 'none' });
    } else {
      const diff = y3 - x3;
      const pct = (diff / x3) * 100;
      setRes3({
        value: Number(Math.abs(pct).toFixed(4)),
        type: pct >= 0 ? 'increase' : 'decrease'
      });
    }
  }, [x3, y3]);

  useEffect(() => {
    const factor = isAdd ? (1 + x4 / 100) : (1 - x4 / 100);
    setRes4(Number((y4 * factor).toFixed(4)));
  }, [x4, y4, isAdd]);

  return (
    <div id="percentage-calculator-root" className="space-y-8">
      {/* Primary Calculator Workspace */}
      <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
            <Percent className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Percentage Calculator</h2>
        </div>
        <p className="text-xs text-slate-400 mb-6">Multi-purpose percentage engine to solve portions, percentages, value changes, and added taxes instantly.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Sub-calculator 1 */}
          <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[10px] font-extrabold text-violet-500 uppercase tracking-widest block mb-3">1. Calculate Percentage Value</span>
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-semibold text-slate-400">What is</span>
                <input
                  type="number"
                  value={x1}
                  onChange={(e) => setX1(Number(e.target.value))}
                  className={`w-20 p-2 rounded-lg border text-center text-xs font-bold outline-none focus:border-violet-500 ${
                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-200'
                  }`}
                />
                <span className="text-xs font-semibold text-slate-400">% of</span>
                <input
                  type="number"
                  value={y1}
                  onChange={(e) => setY1(Number(e.target.value))}
                  className={`w-24 p-2 rounded-lg border text-center text-xs font-bold outline-none focus:border-violet-500 ${
                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-200'
                  }`}
                />
              </div>
              <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex justify-between items-center">
                <span className="text-xs text-slate-400 font-semibold">Result Value:</span>
                <span className="text-sm font-extrabold text-violet-600 dark:text-violet-400">{res1}</span>
              </div>
            </div>
          </div>

          {/* Sub-calculator 2 */}
          <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[10px] font-extrabold text-violet-500 uppercase tracking-widest block mb-3">2. Calculate Ratio Percentage</span>
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <input
                  type="number"
                  value={x2}
                  onChange={(e) => setX2(Number(e.target.value))}
                  className={`w-20 p-2 rounded-lg border text-center text-xs font-bold outline-none focus:border-violet-500 ${
                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-200'
                  }`}
                />
                <span className="text-xs font-semibold text-slate-400">is what % of</span>
                <input
                  type="number"
                  value={y2}
                  onChange={(e) => setY2(Number(e.target.value))}
                  className={`w-24 p-2 rounded-lg border text-center text-xs font-bold outline-none focus:border-violet-500 ${
                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-200'
                  }`}
                />
              </div>
              <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex justify-between items-center">
                <span className="text-xs text-slate-400 font-semibold">Percentage Output:</span>
                <span className="text-sm font-extrabold text-violet-600 dark:text-violet-400">{res2}%</span>
              </div>
            </div>
          </div>

          {/* Sub-calculator 3 */}
          <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[10px] font-extrabold text-violet-500 uppercase tracking-widest block mb-3">3. Percentage Increase/Decrease</span>
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-semibold text-slate-400">From</span>
                <input
                  type="number"
                  value={x3}
                  onChange={(e) => setX3(Number(e.target.value))}
                  className={`w-20 p-2 rounded-lg border text-center text-xs font-bold outline-none focus:border-violet-500 ${
                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-200'
                  }`}
                />
                <span className="text-xs font-semibold text-slate-400">to</span>
                <input
                  type="number"
                  value={y3}
                  onChange={(e) => setY3(Number(e.target.value))}
                  className={`w-24 p-2 rounded-lg border text-center text-xs font-bold outline-none focus:border-violet-500 ${
                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-200'
                  }`}
                />
              </div>
              <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex justify-between items-center">
                <span className="text-xs text-slate-400 font-semibold">Change Rate:</span>
                {res3 && (
                  <span className={`text-sm font-extrabold ${res3.type === 'increase' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {res3.type === 'increase' ? '↑' : '↓'} {res3.value}% ({res3.type})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Sub-calculator 4 */}
          <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[10px] font-extrabold text-violet-500 uppercase tracking-widest block mb-3">4. Add / Subtract Percentage</span>
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setIsAdd(true)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-lg ${isAdd ? 'bg-violet-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}
                >
                  Add
                </button>
                <button
                  onClick={() => setIsAdd(false)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-lg ${!isAdd ? 'bg-rose-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}
                >
                  Subtract
                </button>
                <input
                  type="number"
                  value={x4}
                  onChange={(e) => setX4(Number(e.target.value))}
                  className={`w-16 p-2 rounded-lg border text-center text-xs font-bold outline-none focus:border-violet-500 ${
                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-200'
                  }`}
                />
                <span className="text-xs font-semibold text-slate-400">% to/from</span>
                <input
                  type="number"
                  value={y4}
                  onChange={(e) => setY4(Number(e.target.value))}
                  className={`w-24 p-2 rounded-lg border text-center text-xs font-bold outline-none focus:border-violet-500 ${
                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-200'
                  }`}
                />
              </div>
              <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex justify-between items-center">
                <span className="text-xs text-slate-400 font-semibold">Compounded Value:</span>
                <span className="text-sm font-extrabold text-violet-600 dark:text-violet-400">{res4}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Formula & Explanations */}
      <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-4">Formula & Explanation</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
          Percentages are fractions written with a denominator of 100. The term percentage comes from Latin "per centum", meaning "by the hundred".
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-xl font-mono text-[10px] leading-relaxed ${theme === 'dark' ? 'bg-slate-900 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
            <strong>Value portion formula:</strong><br />
            Value = (X / 100) * Y<br /><br />
            <strong>Ratio percentage formula:</strong><br />
            Percentage = (X / Y) * 100
          </div>
          <div className={`p-4 rounded-xl font-mono text-[10px] leading-relaxed ${theme === 'dark' ? 'bg-slate-900 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
            <strong>Percentage Difference / Change:</strong><br />
            Rate = ((NewValue - OldValue) / OldValue) * 100<br /><br />
            <strong>Compounding portion addition:</strong><br />
            Total = BaseValue * (1 + (Pct / 100))
          </div>
        </div>

        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-4 mb-2">Example Calculations:</h4>
        <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
          <p>• <strong>Example 1:</strong> Find 15% of $250. Portions: (15 / 100) * 250 = 0.15 * 250 = <strong>$37.50</strong>.</p>
          <p>• <strong>Example 2:</strong> What percentage of 200 is 50? Ratios: (50 / 200) * 100 = 0.25 * 100 = <strong>25%</strong>.</p>
          <p>• <strong>Example 3:</strong> Price grew from $80 to $120. Change rate: ((120 - 80) / 80) * 100 = (40 / 80) * 100 = 0.5 * 100 = <strong>50% Increase</strong>.</p>
        </div>
      </div>

      {/* Related Calculators */}
      <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-4">Related Calculators</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => navigateTo('/calculators/discount-calculator/')}
            className={`p-3 rounded-xl border text-left hover:scale-[1.02] transition-all cursor-pointer ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-0.5">Discount Calculator</span>
            <span className="text-[10px] text-slate-400 block leading-tight">Combine multi-layered purchase savings</span>
          </button>
          <button
            onClick={() => navigateTo('/calculators/gst-calculator/')}
            className={`p-3 rounded-xl border text-left hover:scale-[1.02] transition-all cursor-pointer ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-0.5">GST Calculator</span>
            <span className="text-[10px] text-slate-400 block leading-tight">Determine inclusive/exclusive goods taxes</span>
          </button>
          <button
            onClick={() => navigateTo('/calculators/emi-calculator/')}
            className={`p-3 rounded-xl border text-left hover:scale-[1.02] transition-all cursor-pointer ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-0.5">EMI Calculator</span>
            <span className="text-[10px] text-slate-400 block leading-tight">Solve loan equated monthly installments</span>
          </button>
        </div>
      </div>
    </div>
  );
}
