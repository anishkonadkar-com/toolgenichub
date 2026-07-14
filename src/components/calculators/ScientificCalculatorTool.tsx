import React, { useState, useEffect } from 'react';
import { Calculator, HelpCircle, History, Delete, Trash2 } from 'lucide-react';

interface ToolProps {
  triggerNotification: (msg: string) => void;
  theme: 'light' | 'dark';
}

export default function ScientificCalculatorTool({ triggerNotification, theme }: ToolProps) {
  const [display, setDisplay] = useState<string>('');
  const [equation, setEquation] = useState<string>('');
  const [angleMode, setAngleMode] = useState<'deg' | 'rad'>('deg');
  const [memory, setMemory] = useState<number>(0);
  const [history, setHistory] = useState<any[]>([]);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'SELECT' || activeElement.tagName === 'TEXTAREA')) {
        return;
      }

      const key = e.key;
      if (/[0-9]/.test(key)) {
        handleBtnClick(key);
      } else if (['+', '-', '*', '/'].includes(key)) {
        handleBtnClick(key);
      } else if (key === '.') {
        handleBtnClick('.');
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleSolve();
      } else if (key === 'Backspace') {
        handleBackspace();
      } else if (key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [equation, display, angleMode]);

  const handleBtnClick = (val: string) => {
    // Append values to running equation string
    if (display === 'Error') {
      setDisplay(val);
      setEquation(val);
      return;
    }

    setDisplay(prev => prev + val);
    setEquation(prev => prev + val);
  };

  const handleClear = () => {
    setDisplay('');
    setEquation('');
  };

  const handleBackspace = () => {
    if (display === 'Error') {
      handleClear();
      return;
    }
    setDisplay(prev => prev.slice(0, -1));
    setEquation(prev => prev.slice(0, -1));
  };

  const handleMathFunction = (func: string) => {
    // Map standard mathematical function prefixes
    if (display === 'Error') return;

    if (func === 'pi') {
      setDisplay(prev => prev + 'π');
      setEquation(prev => prev + Math.PI.toString());
    } else if (func === 'e') {
      setDisplay(prev => prev + 'e');
      setEquation(prev => prev + Math.E.toString());
    } else {
      setDisplay(prev => prev + func + '(');
      setEquation(prev => prev + 'MATH_FUNC:' + func + '(');
    }
  };

  const handleSolve = () => {
    if (!equation) return;

    try {
      let expr = equation;

      // Safe evaluation model: Solve parenthesized MATH_FUNC patterns
      // MATH_FUNC:sin(x) or MATH_FUNC:cos(x)
      const funcRegex = /MATH_FUNC:(\w+)\(([^()]+)\)/g;

      let matchCount = 0;
      while (funcRegex.test(expr) && matchCount < 10) {
        matchCount++;
        expr = expr.replace(/MATH_FUNC:(\w+)\(([^()]+)\)/g, (match, func, arg) => {
          let num = parseFloat(arg);
          if (isNaN(num)) return 'NaN';

          if (func === 'sin') {
            if (angleMode === 'deg') num = (num * Math.PI) / 180;
            return Math.sin(num).toString();
          }
          if (func === 'cos') {
            if (angleMode === 'deg') num = (num * Math.PI) / 180;
            return Math.cos(num).toString();
          }
          if (func === 'tan') {
            if (angleMode === 'deg') num = (num * Math.PI) / 180;
            return Math.tan(num).toString();
          }
          if (func === 'log') {
            return Math.log10(num).toString();
          }
          if (func === 'ln') {
            return Math.log(num).toString();
          }
          if (func === 'sqrt') {
            return Math.sqrt(num).toString();
          }
          return arg;
        });
      }

      // Convert algebraic x^y caret signs to JS powers
      expr = expr.replace(/\^/g, '**');

      // Solve factorial patterns (e.g. 5! => computed)
      expr = expr.replace(/(\d+)!/g, (match, num) => {
        const n = parseInt(num);
        return factorial(n).toString();
      });

      // Strict sanitization check before evaluating: Allow only basic numbers, decimals, brackets, operators
      const sanitized = expr.replace(/[0-9.+\-*/() ]|MATH_FUNC|\*\*/g, '');
      if (sanitized.length > 0) {
        throw new Error('Unsafe character detected');
      }

      // Evaluate the sanitized expression safely
      const result = new Function(`return (${expr})`)();
      
      if (isNaN(result) || !isFinite(result)) {
        throw new Error('Math error');
      }

      const formattedResult = Number(result.toFixed(6));

      // Append to history stream
      setHistory(prev => [{
        eq: display,
        res: formattedResult
      }, ...prev].slice(0, 10));

      setDisplay(formattedResult.toString());
      setEquation(formattedResult.toString());
    } catch (err) {
      setDisplay('Error');
      setEquation('');
    }
  };

  const factorial = (n: number): number => {
    if (n < 0) return NaN;
    if (n <= 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  };

  // Memory functions
  const handleMemory = (action: string) => {
    const currentVal = parseFloat(display) || 0;
    if (action === 'MC') {
      setMemory(0);
      triggerNotification('Memory Cleared');
    } else if (action === 'MR') {
      setDisplay(prev => prev + memory.toString());
      setEquation(prev => prev + memory.toString());
      triggerNotification('Memory Recalled');
    } else if (action === 'M+') {
      setMemory(prev => prev + currentVal);
      triggerNotification(`Added ${currentVal} to Memory`);
    } else if (action === 'M-') {
      setMemory(prev => prev - currentVal);
      triggerNotification(`Subtracted ${currentVal} from Memory`);
    }
  };

  return (
    <div id="scientific-calculator-root" className="space-y-8">
      {/* Primary Workspace */}
      <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
            <Calculator className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Scientific Calculator</h2>
        </div>
        <p className="text-xs text-slate-400 mb-6 font-medium">Solve advanced scientific mathematical equations. Supports trigonometry, degree/radian toggling, factorials, and running history logs.</p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Keypad Frame */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Display screen */}
            <div className={`p-5 rounded-2xl border flex flex-col justify-between items-end text-right min-h-24 ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="text-[10px] font-mono text-slate-400 font-bold tracking-wide">
                Angle: {angleMode.toUpperCase()} | Memory: {memory}
              </div>
              <div className="text-xl font-extrabold font-mono text-slate-800 dark:text-slate-100 break-all select-all">
                {display || '0'}
              </div>
            </div>

            {/* Scientific Function Grid */}
            <div className="grid grid-cols-5 gap-1.5">
              {/* Memory panel */}
              <button onClick={() => handleMemory('MC')} className="py-2 text-[10px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:opacity-85 cursor-pointer">MC</button>
              <button onClick={() => handleMemory('MR')} className="py-2 text-[10px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:opacity-85 cursor-pointer">MR</button>
              <button onClick={() => handleMemory('M+')} className="py-2 text-[10px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:opacity-85 cursor-pointer">M+</button>
              <button onClick={() => handleMemory('M-')} className="py-2 text-[10px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:opacity-85 cursor-pointer">M-</button>
              <button onClick={() => setAngleMode(p => p === 'deg' ? 'rad' : 'deg')} className="py-2 text-[10px] font-extrabold rounded-lg bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 hover:opacity-85 cursor-pointer">
                {angleMode.toUpperCase()}
              </button>

              {/* Row 1 Scientific */}
              <button onClick={() => handleMathFunction('sin')} className="py-2.5 text-[11px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:opacity-85 cursor-pointer">sin</button>
              <button onClick={() => handleMathFunction('cos')} className="py-2.5 text-[11px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:opacity-85 cursor-pointer">cos</button>
              <button onClick={() => handleMathFunction('tan')} className="py-2.5 text-[11px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:opacity-85 cursor-pointer">tan</button>
              <button onClick={() => handleBtnClick('^')} className="py-2.5 text-[11px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:opacity-85 cursor-pointer">x^y</button>
              <button onClick={() => handleMathFunction('sqrt')} className="py-2.5 text-[11px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:opacity-85 cursor-pointer">√</button>

              {/* Row 2 Scientific */}
              <button onClick={() => handleMathFunction('log')} className="py-2.5 text-[11px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:opacity-85 cursor-pointer">log</button>
              <button onClick={() => handleMathFunction('ln')} className="py-2.5 text-[11px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:opacity-85 cursor-pointer">ln</button>
              <button onClick={() => handleBtnClick('!')} className="py-2.5 text-[11px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:opacity-85 cursor-pointer">n!</button>
              <button onClick={() => handleBtnClick('(')} className="py-2.5 text-[11px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:opacity-85 cursor-pointer">(</button>
              <button onClick={() => handleBtnClick(')')} className="py-2.5 text-[11px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:opacity-85 cursor-pointer">)</button>

              {/* Row 3 Digits / Operators */}
              <button onClick={() => handleMathFunction('pi')} className="py-2.5 text-[11px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:opacity-85 cursor-pointer">π</button>
              <button onClick={() => handleBtnClick('7')} className="py-3 text-sm font-extrabold rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:opacity-85 cursor-pointer">7</button>
              <button onClick={() => handleBtnClick('8')} className="py-3 text-sm font-extrabold rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:opacity-85 cursor-pointer">8</button>
              <button onClick={() => handleBtnClick('9')} className="py-3 text-sm font-extrabold rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:opacity-85 cursor-pointer">9</button>
              <button onClick={() => handleBackspace()} className="py-3 text-xs font-bold rounded-lg bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 hover:opacity-85 cursor-pointer flex items-center justify-center">
                <Delete className="w-3.5 h-3.5" />
              </button>

              {/* Row 4 Digits / Operators */}
              <button onClick={() => handleMathFunction('e')} className="py-2.5 text-[11px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:opacity-85 cursor-pointer">e</button>
              <button onClick={() => handleBtnClick('4')} className="py-3 text-sm font-extrabold rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:opacity-85 cursor-pointer">4</button>
              <button onClick={() => handleBtnClick('5')} className="py-3 text-sm font-extrabold rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:opacity-85 cursor-pointer">5</button>
              <button onClick={() => handleBtnClick('6')} className="py-3 text-sm font-extrabold rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:opacity-85 cursor-pointer">6</button>
              <button onClick={() => handleBtnClick('/')} className="py-3 text-sm font-bold rounded-lg bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 hover:opacity-85 cursor-pointer">/</button>

              {/* Row 5 Digits / Operators */}
              <button onClick={() => handleClear()} className="py-3 text-xs font-bold rounded-lg bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:opacity-85 cursor-pointer">C</button>
              <button onClick={() => handleBtnClick('1')} className="py-3 text-sm font-extrabold rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:opacity-85 cursor-pointer">1</button>
              <button onClick={() => handleBtnClick('2')} className="py-3 text-sm font-extrabold rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:opacity-85 cursor-pointer">2</button>
              <button onClick={() => handleBtnClick('3')} className="py-3 text-sm font-extrabold rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:opacity-85 cursor-pointer">3</button>
              <button onClick={() => handleBtnClick('*')} className="py-3 text-sm font-bold rounded-lg bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 hover:opacity-85 cursor-pointer">*</button>

              {/* Row 6 Digits / Operators */}
              <button onClick={() => handleBtnClick('0')} className="py-3 text-sm font-extrabold rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:opacity-85 cursor-pointer">0</button>
              <button onClick={() => handleBtnClick('.')} className="py-3 text-sm font-extrabold rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:opacity-85 cursor-pointer">.</button>
              <button onClick={() => handleBtnClick('-')} className="py-3 text-sm font-bold rounded-lg bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 hover:opacity-85 cursor-pointer">-</button>
              <button onClick={() => handleBtnClick('+')} className="py-3 text-sm font-bold rounded-lg bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 hover:opacity-85 cursor-pointer">+</button>
              <button onClick={() => handleSolve()} className="py-3 text-sm font-bold rounded-lg bg-violet-600 text-white hover:bg-violet-700 cursor-pointer">=</button>
            </div>
          </div>

          {/* Running History side-panel */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div className={`p-4 rounded-2xl border flex-1 flex flex-col ${theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-1.5 pb-2.5 border-b border-slate-200 dark:border-slate-800 mb-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                <History className="w-3.5 h-3.5 text-violet-500" /> Calculation History
              </div>

              {history.length > 0 ? (
                <div className="flex-1 overflow-y-auto space-y-2.5 max-h-56 pr-1 font-mono text-[10.5px]">
                  {history.map((h, idx) => (
                    <div key={idx} className="pb-2 border-b border-dashed border-slate-200/60 dark:border-slate-800/60 last:border-0 last:pb-0">
                      <div className="text-slate-400 text-right leading-relaxed">{h.eq} =</div>
                      <button 
                        onClick={() => { setDisplay(h.res.toString()); setEquation(h.res.toString()); }}
                        className="text-right w-full font-bold text-violet-600 dark:text-violet-400 cursor-pointer block hover:underline"
                      >
                        {h.res}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <History className="w-6 h-6 mb-1 text-slate-300" />
                  <span className="text-[10px] font-bold">No calculations yet</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Formula & Explanations */}
      <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-4">Formula & Explanation</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
          This calculator processes arithmetic sequences alongside trigonometric ratios (Sine, Cosine, Tangent) and algebraic logarithmic progressions.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-xl font-mono text-[10px] leading-relaxed ${theme === 'dark' ? 'bg-slate-900 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
            <strong>Angle systems:</strong><br />
            • Degrees: 360° completes a circle.<br />
            • Radians: 2π completes a circle.<br />
            Convert degrees to radians: Rad = Deg * (π / 180)
          </div>
          <div className={`p-4 rounded-xl font-mono text-[10px] leading-relaxed ${theme === 'dark' ? 'bg-slate-900 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
            <strong>Logarithms:</strong><br />
            • Natural Log (ln): base e (Euler\'s constant ≈ 2.718)<br />
            • Common Log (log): base 10.<br />
            • Factorial (n!): product of all integers up to n.
          </div>
        </div>
      </div>

      {/* Related Calculators */}
      <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-4">Related Calculators</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => navigateTo('/calculators/percentage-calculator/')}
            className={`p-3 rounded-xl border text-left hover:scale-[1.02] transition-all cursor-pointer ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-0.5">Percentage Calculator</span>
            <span className="text-[10px] text-slate-400 block leading-tight">Quickly solve ratios and value variations</span>
          </button>
          <button
            onClick={() => navigateTo('/calculators/bmi-calculator/')}
            className={`p-3 rounded-xl border text-left hover:scale-[1.02] transition-all cursor-pointer ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-0.5">BMI Calculator</span>
            <span className="text-[10px] text-slate-400 block leading-tight">Solve height-weight health classifications</span>
          </button>
          <button
            onClick={() => navigateTo('/calculators/discount-calculator/')}
            className={`p-3 rounded-xl border text-left hover:scale-[1.02] transition-all cursor-pointer ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-0.5">Discount Calculator</span>
            <span className="text-[10px] text-slate-400 block leading-tight">Determine retail pricing bargains</span>
          </button>
        </div>
      </div>
    </div>
  );
}
