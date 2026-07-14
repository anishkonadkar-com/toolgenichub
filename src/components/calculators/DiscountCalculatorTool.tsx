import React, { useState, useEffect } from 'react';
import { Tag, Calculator, Percent, ShieldCheck } from 'lucide-react';

interface ToolProps {
  triggerNotification: (msg: string) => void;
  theme: 'light' | 'dark';
}

export default function DiscountCalculatorTool({ triggerNotification, theme }: ToolProps) {
  const [originalPrice, setOriginalPrice] = useState<number>(120);
  const [discountPercent, setDiscountPercent] = useState<number>(25);
  const [extraDiscountPercent, setExtraDiscountPercent] = useState<number>(10); // Stackable
  const [taxPercent, setTaxPercent] = useState<number>(8.25);

  const [savingAmount, setSavingAmount] = useState<number>(0);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [taxAmount, setTaxAmount] = useState<number>(0);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  useEffect(() => {
    calculateDiscount();
  }, [originalPrice, discountPercent, extraDiscountPercent, taxPercent]);

  const calculateDiscount = () => {
    if (originalPrice <= 0) {
      setSavingAmount(0);
      setFinalPrice(0);
      setTaxAmount(0);
      return;
    }

    // Step 1: First discount
    const d1 = (originalPrice * discountPercent) / 100;
    let intermediatePrice = originalPrice - d1;

    // Step 2: Stackable second discount
    const d2 = (intermediatePrice * extraDiscountPercent) / 100;
    let preTaxPrice = intermediatePrice - d2;

    // Step 3: Add Sales Tax
    const calculatedTax = (preTaxPrice * taxPercent) / 100;
    const finalVal = preTaxPrice + calculatedTax;

    const totalSaved = originalPrice - preTaxPrice;

    setSavingAmount(Number(totalSaved.toFixed(2)));
    setTaxAmount(Number(calculatedTax.toFixed(2)));
    setFinalPrice(Number(finalVal.toFixed(2)));
  };

  return (
    <div id="discount-calculator-root" className="space-y-8">
      {/* Primary Workspace */}
      <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
            <Tag className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Discount Calculator</h2>
        </div>
        <p className="text-xs text-slate-400 mb-6 font-medium">Instantly calculate sales bargains, stackable double discounts, and final retail values including custom sales taxes.</p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Original Price ($)</label>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(Math.max(0, Number(e.target.value)))}
                  className={`w-24 p-1.5 rounded-lg border text-right text-xs font-bold outline-none focus:border-violet-500 ${
                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>
              <input
                type="range"
                min="5"
                max="5000"
                step="5"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                className="w-full accent-violet-600 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase">Discount (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Math.min(100, Math.max(0, Number(e.target.value))))}
                  className={`w-full p-2 rounded-xl border text-center text-xs font-bold outline-none focus:border-violet-500 ${
                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>
              <div>
                <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase">Stackable Discount (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={extraDiscountPercent}
                  onChange={(e) => setExtraDiscountPercent(Math.min(100, Math.max(0, Number(e.target.value))))}
                  className={`w-full p-2 rounded-xl border text-center text-xs font-bold outline-none focus:border-violet-500 ${
                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Sales Tax (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(Math.max(0, Number(e.target.value)))}
                  className={`w-20 p-1.5 rounded-lg border text-right text-xs font-bold outline-none focus:border-violet-500 ${
                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="0.25"
                value={taxPercent}
                onChange={(e) => setTaxPercent(Number(e.target.value))}
                className="w-full accent-violet-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Outputs */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/20 text-center">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase block mb-0.5">Total Savings</span>
                  <span className="text-xl font-extrabold text-emerald-500">${savingAmount.toLocaleString()}</span>
                  <span className="text-[10px] text-emerald-500/80 font-bold block">
                    ({originalPrice > 0 ? ((savingAmount / originalPrice) * 100).toFixed(1) : 0}% Off)
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/30 text-center">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase block mb-0.5">Final Sale Price</span>
                  <span className="text-xl font-extrabold text-violet-600 dark:text-violet-400">${finalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Detailed pricing breakdown */}
              <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-[9px] font-extrabold text-slate-400 uppercase block mb-3 tracking-wider">Pricing Progression Ledger</span>
                
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                    <span>Regular Original Price:</span>
                    <span className="font-semibold">${originalPrice.toLocaleString()}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex justify-between items-center text-rose-500">
                      <span>Primary Discount ({discountPercent}%):</span>
                      <span className="font-semibold">-${((originalPrice * discountPercent)/100).toLocaleString()}</span>
                    </div>
                  )}
                  {extraDiscountPercent > 0 && (
                    <div className="flex justify-between items-center text-rose-500 pb-2 border-b border-dashed border-slate-200/60 dark:border-slate-800/60">
                      <span>Stackable Discount ({extraDiscountPercent}%):</span>
                      <span className="font-semibold">
                        -${(((originalPrice - (originalPrice * discountPercent)/100) * extraDiscountPercent)/100).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {taxPercent > 0 && (
                    <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 pt-1">
                      <span>Applied Sales Tax ({taxPercent}%):</span>
                      <span className="font-semibold">+${taxAmount.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Formula & Explanations */}
      <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-4">Formula & Explanation</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
          Stackable discount percentages do not simply add up (e.g., 25% + 10% is not a flat 35% off). Instead, the second discount is applied sequentially to the already discounted price.
        </p>
        <div className={`p-4 rounded-xl font-mono text-[10px] leading-relaxed mb-4 ${theme === 'dark' ? 'bg-slate-900 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
          Step 1: IntermediatePrice = OriginalPrice * (1 - Discount1 / 100)<br />
          Step 2: PreTaxPrice = IntermediatePrice * (1 - Discount2 / 100)<br />
          Step 3: FinalPrice = PreTaxPrice * (1 + SalesTax / 100)<br />
          Total Savings = OriginalPrice - PreTaxPrice
        </div>

        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Example Calculations:</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          • <strong>Example:</strong> $120 original price with 25% discount, an extra 10% stackable discount, and 8.25% sales tax:<br />
          1. Intermediate Price: $120 - 25% = <strong>$90</strong>.<br />
          2. Pre-Tax Price: $90 - 10% = <strong>$81</strong>.<br />
          3. Final Price: $81 + 8.25% tax = <strong>$87.68</strong>. Total Savings = <strong>$39</strong>.
        </p>
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
            <span className="text-[10px] text-slate-400 block leading-tight">Compare fractional portions and ratios</span>
          </button>
          <button
            onClick={() => navigateTo('/calculators/gst-calculator/')}
            className={`p-3 rounded-xl border text-left hover:scale-[1.02] transition-all cursor-pointer ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-0.5">GST Calculator</span>
            <span className="text-[10px] text-slate-400 block leading-tight">Extract or append goods and services taxes</span>
          </button>
          <button
            onClick={() => navigateTo('/calculators/loan-calculator/')}
            className={`p-3 rounded-xl border text-left hover:scale-[1.02] transition-all cursor-pointer ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-0.5">Loan Calculator</span>
            <span className="text-[10px] text-slate-400 block leading-tight">Calculate extra loan prepayments</span>
          </button>
        </div>
      </div>
    </div>
  );
}
