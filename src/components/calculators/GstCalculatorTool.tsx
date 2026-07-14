import React, { useState, useEffect } from 'react';
import { Calculator, Percent, Copy, Check } from 'lucide-react';

interface ToolProps {
  triggerNotification: (msg: string) => void;
  theme: 'light' | 'dark';
}

export default function GstCalculatorTool({ triggerNotification, theme }: ToolProps) {
  const [amount, setAmount] = useState<number>(1000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [isExclusive, setIsExclusive] = useState<boolean>(true); // Exclusive = Add GST, Inclusive = Remove GST

  const [netAmount, setNetAmount] = useState<number>(0);
  const [gstAmount, setGstAmount] = useState<number>(0);
  const [cgst, setCgst] = useState<number>(0);
  const [sgst, setSgst] = useState<number>(0);
  const [grossAmount, setGrossAmount] = useState<number>(0);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  useEffect(() => {
    calculateGst();
  }, [amount, gstRate, isExclusive]);

  const calculateGst = () => {
    if (amount <= 0 || gstRate < 0) {
      setNetAmount(0);
      setGstAmount(0);
      setCgst(0);
      setSgst(0);
      setGrossAmount(0);
      return;
    }

    let calculatedNet = 0;
    let calculatedGst = 0;
    let calculatedGross = 0;

    if (isExclusive) {
      // Add GST: Tax is added to the amount
      calculatedNet = amount;
      calculatedGst = (amount * gstRate) / 100;
      calculatedGross = amount + calculatedGst;
    } else {
      // Remove GST: Tax is extracted from the amount
      calculatedNet = amount / (1 + gstRate / 100);
      calculatedGst = amount - calculatedNet;
      calculatedGross = amount;
    }

    const splitTax = calculatedGst / 2;

    setNetAmount(Number(calculatedNet.toFixed(2)));
    setGstAmount(Number(calculatedGst.toFixed(2)));
    setCgst(Number(splitTax.toFixed(2)));
    setSgst(Number(splitTax.toFixed(2)));
    setGrossAmount(Number(calculatedGross.toFixed(2)));
  };

  const handleCopyResult = () => {
    const text = isExclusive
      ? `Base: $${netAmount} + GST (${gstRate}%): $${gstAmount} = Total: $${grossAmount}`
      : `Total Inclusive: $${grossAmount} - extracted GST (${gstRate}%): $${gstAmount} = Net Base: $${netAmount}`;
    navigator.clipboard.writeText(text);
    triggerNotification('GST breakdown copied to clipboard!');
  };

  const slabs = [5, 12, 18, 28];

  return (
    <div id="gst-calculator-root" className="space-y-8">
      {/* Primary Workspace */}
      <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
            <Percent className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">GST Calculator</h2>
        </div>
        <p className="text-xs text-slate-400 mb-6">Calculate Central GST, State GST, Net, and Gross amounts. Use standard presets or input custom percentages instantly.</p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Inputs */}
          <div className="lg:col-span-5 space-y-5">
            {/* Toggle mode */}
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 block mb-2 uppercase">GST Calculation Type</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setIsExclusive(true)}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer text-center ${
                    isExclusive
                      ? 'bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-500/10'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  GST Exclusive (Add)
                </button>
                <button
                  onClick={() => setIsExclusive(false)}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer text-center ${
                    !isExclusive
                      ? 'bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-500/10'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  GST Inclusive (Remove)
                </button>
              </div>
            </div>

            {/* Base Amount */}
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 block mb-1.5 uppercase">Amount ($)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                className={`w-full p-3 rounded-xl border text-sm font-semibold outline-none focus:border-violet-500 ${
                  theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>

            {/* Presets and Custom GST Rates */}
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 block mb-2 uppercase">GST Rate Presets (%)</span>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {slabs.map((slab) => (
                  <button
                    key={slab}
                    onClick={() => setGstRate(slab)}
                    className={`py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      gstRate === slab
                        ? 'bg-slate-800 border-slate-800 text-white dark:bg-slate-200 dark:border-slate-200 dark:text-slate-900'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    {slab}%
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">Custom GST Rate:</span>
                <div className="relative flex-1">
                  <input
                    type="number"
                    value={gstRate}
                    onChange={(e) => setGstRate(Math.max(0, Number(e.target.value)))}
                    className={`w-full p-2.5 rounded-xl border text-right pr-8 text-xs font-bold outline-none focus:border-violet-500 ${
                      theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-extrabold text-slate-400">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Outputs */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Gross vs Net Visual Header */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-0.5">Net Amount</span>
                  <span className="text-lg font-extrabold text-slate-700 dark:text-slate-200">${netAmount.toLocaleString()}</span>
                </div>
                <div className="p-4 rounded-xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/30 text-center">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-0.5">Total Gross</span>
                  <span className="text-lg font-extrabold text-violet-600 dark:text-violet-400">${grossAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* GST Split card */}
              <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex justify-between items-center pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Total Tax (GST Amount)</span>
                  <span className="text-sm font-extrabold text-violet-600 dark:text-violet-400">${gstAmount.toLocaleString()}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div>
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase block mb-0.5">CGST (Central Tax 50%)</span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">${cgst.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase block mb-0.5">SGST (State Tax 50%)</span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">${sgst.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleCopyResult}
                  className="w-full py-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
                >
                  <Copy className="w-4 h-4" /> Copy GST Breakdown
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Formula & Explanations */}
      <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-4">Formula & Explanation</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
          GST (Goods and Services Tax) can be added (Exclusive) or extracted (Inclusive). CGST and SGST represent the split between central and state authorities in a dual GST system.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-xl font-mono text-[10px] leading-relaxed ${theme === 'dark' ? 'bg-slate-900 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
            <strong>GST Exclusive (Add GST):</strong><br />
            GST Amount = (BaseAmount * Rate) / 100<br />
            Gross Amount = BaseAmount + GST Amount<br />
            CGST = SGST = GST Amount / 2
          </div>
          <div className={`p-4 rounded-xl font-mono text-[10px] leading-relaxed ${theme === 'dark' ? 'bg-slate-900 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
            <strong>GST Inclusive (Remove GST):</strong><br />
            Net Base Amount = BaseAmount / (1 + Rate / 100)<br />
            GST Amount = BaseAmount - Net Base Amount<br />
            CGST = SGST = GST Amount / 2
          </div>
        </div>

        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-4 mb-2">Example Calculations:</h4>
        <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
          <p>• <strong>Example 1 (Add GST):</strong> Base amount of $1,000 at 18% GST. Tax = (1000 * 18) / 100 = <strong>$180</strong>. Total gross = <strong>$1,180</strong>. Central (CGST) = <strong>$90</strong>, State (SGST) = <strong>$90</strong>.</p>
          <p>• <strong>Example 2 (Remove GST):</strong> Retail inclusive invoice of $1,180 at 18% GST. Base = 1180 / (1 + 0.18) = <strong>$1,000</strong>. Tax extracted = 1180 - 1000 = <strong>$180</strong>.</p>
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
            <span className="text-[10px] text-slate-400 block leading-tight">Check percentage growth and parts</span>
          </button>
          <button
            onClick={() => navigateTo('/calculators/discount-calculator/')}
            className={`p-3 rounded-xl border text-left hover:scale-[1.02] transition-all cursor-pointer ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-0.5">Discount Calculator</span>
            <span className="text-[10px] text-slate-400 block leading-tight">Check sales margins and bargain savings</span>
          </button>
          <button
            onClick={() => navigateTo('/calculators/income-tax-calculator/')}
            className={`p-3 rounded-xl border text-left hover:scale-[1.02] transition-all cursor-pointer ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-0.5">Income Tax Calculator</span>
            <span className="text-[10px] text-slate-400 block leading-tight">Estimate marginal brackets and tax slabs</span>
          </button>
        </div>
      </div>
    </div>
  );
}
