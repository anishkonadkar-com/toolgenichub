import React, { useState, useEffect } from 'react';
import { Calculator, Scale, FileText, ArrowRight } from 'lucide-react';

interface ToolProps {
  triggerNotification: (msg: string) => void;
  theme: 'light' | 'dark';
}

export default function IncomeTaxCalculatorTool({ triggerNotification, theme }: ToolProps) {
  const [regime, setRegime] = useState<'us' | 'india' | 'flat'>('us');
  const [grossIncome, setGrossIncome] = useState<number>(85000);
  const [deductions, setDeductions] = useState<number>(15000);
  const [flatRate, setFlatRate] = useState<number>(20);

  const [taxableIncome, setTaxableIncome] = useState<number>(0);
  const [taxLiability, setTaxLiability] = useState<number>(0);
  const [effectiveTaxRate, setEffectiveTaxRate] = useState<number>(0);
  const [takeHome, setTakeHome] = useState<number>(0);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  useEffect(() => {
    calculateTax();
  }, [regime, grossIncome, deductions, flatRate]);

  const calculateTax = () => {
    const gross = grossIncome;
    const deduct = deductions;
    let taxable = Math.max(0, gross - deduct);
    let tax = 0;

    if (regime === 'us') {
      // US Federal Single Filer Brackets (Simplified)
      // 10% up to $11,600
      // 12% up to $47,150
      // 22% up to $100,525
      // 24% up to $191,950
      // 32% up to $243,725
      // 35% up to $609,350
      // 37% above $609,350
      const brackets = [
        { limit: 11600, rate: 0.10 },
        { limit: 47150, rate: 0.12 },
        { limit: 100525, rate: 0.22 },
        { limit: 191950, rate: 0.24 },
        { limit: 243725, rate: 0.32 },
        { limit: 609350, rate: 0.35 },
        { limit: Infinity, rate: 0.37 }
      ];

      let prevLimit = 0;
      for (const b of brackets) {
        if (taxable > prevLimit) {
          const taxableInBracket = Math.min(taxable - prevLimit, b.limit - prevLimit);
          tax += taxableInBracket * b.rate;
          prevLimit = b.limit;
        } else {
          break;
        }
      }
    } else if (regime === 'india') {
      // India New Tax Regime FY 2024-25 / 2025-26 slabs
      // Up to ₹3,000,000: Nil (exempt)
      // ₹3,000,001 - ₹7,000,000: 5%
      // ₹7,000,001 - ₹1,000,000: 10%
      // ₹1,000,001 - ₹1,200,000: 15%
      // ₹1,200,001 - ₹1,500,000: 20%
      // Above ₹1,500,000: 30%
      // Note: Tax rebate applies if income is up to ₹700,000 (simplified)
      const brackets = [
        { limit: 300000, rate: 0 },
        { limit: 700000, rate: 0.05 },
        { limit: 1000000, rate: 0.10 },
        { limit: 1200000, rate: 0.15 },
        { limit: 1500000, rate: 0.20 },
        { limit: Infinity, rate: 0.30 }
      ];

      if (taxable <= 700000) {
        tax = 0; // Tax rebate makes it zero
      } else {
        let prevLimit = 0;
        for (const b of brackets) {
          if (taxable > prevLimit) {
            const taxableInBracket = Math.min(taxable - prevLimit, b.limit - prevLimit);
            tax += taxableInBracket * b.rate;
            prevLimit = b.limit;
          } else {
            break;
          }
        }
        // Add 4% health & education cess on top of basic tax liability
        tax = tax * 1.04;
      }
    } else {
      // Flat Rate model
      tax = (taxable * flatRate) / 100;
    }

    const calculatedEffectiveRate = gross > 0 ? (tax / gross) * 100 : 0;
    const finalTakeHome = gross - tax;

    setTaxableIncome(Number(taxable.toFixed(2)));
    setTaxLiability(Number(tax.toFixed(2)));
    setEffectiveTaxRate(Number(calculatedEffectiveRate.toFixed(2)));
    setTakeHome(Number(finalTakeHome.toFixed(2)));
  };

  return (
    <div id="income-tax-calculator-root" className="space-y-8">
      {/* Primary Workspace */}
      <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
            <Scale className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Income Tax Calculator</h2>
        </div>
        <p className="text-xs text-slate-400 mb-6 font-medium">Model income tax burdens under various country regimes. Compare US Federal, Indian Slabs, or general Flat Tax assessments instantly.</p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls */}
          <div className="lg:col-span-5 space-y-5">
            {/* Regime selection */}
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 block mb-2 uppercase">Select Tax Regime</span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => { setRegime('us'); setDeductions(15000); }}
                  className={`py-1.5 px-2 text-[10.5px] font-extrabold rounded-lg border transition-all cursor-pointer text-center ${
                    regime === 'us'
                      ? 'bg-violet-600 border-violet-600 text-white shadow-md'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  US Federal
                </button>
                <button
                  onClick={() => { setRegime('india'); setDeductions(75000); }}
                  className={`py-1.5 px-2 text-[10.5px] font-extrabold rounded-lg border transition-all cursor-pointer text-center ${
                    regime === 'india'
                      ? 'bg-violet-600 border-violet-600 text-white shadow-md'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  India (New)
                </button>
                <button
                  onClick={() => { setRegime('flat'); setDeductions(0); }}
                  className={`py-1.5 px-2 text-[10.5px] font-extrabold rounded-lg border transition-all cursor-pointer text-center ${
                    regime === 'flat'
                      ? 'bg-violet-600 border-violet-600 text-white shadow-md'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  Flat Rate %
                </button>
              </div>
            </div>

            {/* Income Input */}
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase">Gross Annual Income</label>
              <input
                type="number"
                value={grossIncome}
                onChange={(e) => setGrossIncome(Math.max(0, Number(e.target.value)))}
                className={`w-full p-2.5 rounded-xl border text-sm font-bold outline-none focus:border-violet-500 ${
                  theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>

            {/* Deductions Input */}
            {regime !== 'flat' && (
              <div>
                <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase">
                  Deductions / Exemptions ({regime === 'us' ? 'Standard/Itemized' : 'Standard Ded.'})
                </label>
                <input
                  type="number"
                  value={deductions}
                  onChange={(e) => setDeductions(Math.max(0, Number(e.target.value)))}
                  className={`w-full p-2.5 rounded-xl border text-sm font-bold outline-none focus:border-violet-500 ${
                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>
            )}

            {/* Flat Rate slider */}
            {regime === 'flat' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase">Flat Tax Rate (%)</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{flatRate}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={flatRate}
                  onChange={(e) => setFlatRate(Number(e.target.value))}
                  className="w-full accent-violet-600 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Outputs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Results summaries */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/30 text-center">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase block mb-0.5">Annual Tax liability</span>
                <span className="text-lg font-extrabold text-violet-600 dark:text-violet-400">${taxLiability.toLocaleString()}</span>
                <span className="text-[9.5px] font-bold text-slate-400 block mt-0.5">({effectiveTaxRate}% Effective Rate)</span>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/20 text-center">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase block mb-0.5">Net Take-Home Pay</span>
                <span className="text-lg font-extrabold text-emerald-500">${takeHome.toLocaleString()}</span>
                <span className="text-[9.5px] font-bold text-slate-400 block mt-0.5">(${Math.round(takeHome/12).toLocaleString()} / month)</span>
              </div>
            </div>

            {/* Income split progress bar */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Visual Income Division Slices</span>
              
              <div className="h-4 w-full rounded-full flex overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
                {takeHome > 0 && (
                  <div 
                    className="bg-emerald-500 h-full flex items-center justify-center text-[8.5px] font-extrabold text-white"
                    style={{ width: `${(takeHome / grossIncome) * 100}%` }}
                  >
                    Take-Home ({Math.round((takeHome/grossIncome)*100)}%)
                  </div>
                )}
                {taxLiability > 0 && (
                  <div 
                    className="bg-violet-500 h-full flex items-center justify-center text-[8.5px] font-extrabold text-white"
                    style={{ width: `${(taxLiability / grossIncome) * 100}%` }}
                  >
                    Tax ({Math.round((taxLiability/grossIncome)*100)}%)
                  </div>
                )}
              </div>
            </div>

            {/* Extra details list */}
            <div className={`p-4 rounded-xl border flex gap-3 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <FileText className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />
              <div className="text-xs font-medium space-y-1 text-slate-500 dark:text-slate-400">
                <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200 block mb-1">Taxation Ledger Slabs</span>
                <p>• Gross income: <strong>${grossIncome.toLocaleString()}</strong></p>
                <p>• Deductions: <strong>-${deductions.toLocaleString()}</strong></p>
                <p>• Taxable Income: <strong>${taxableIncome.toLocaleString()}</strong></p>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Formula & Explanations */}
      <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-4">Formula & Explanation</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
          Marginal tax brackets apply only to the portion of income that falls within each specific tier. Therefore, your marginal bracket rate is different from your <strong>effective tax rate</strong>, which represents the real share of your total gross income paid as taxes.
        </p>
        <div className={`p-4 rounded-xl font-mono text-[10px] leading-relaxed mb-4 ${theme === 'dark' ? 'bg-slate-900 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
          Taxable Income = Gross Annual Income - Deductions / Exemptions<br />
          Effective Tax Rate = (Total Tax Liability / Gross Income) * 100<br />
          Take-Home Income = Gross Income - Total Tax Liability
        </div>

        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Example Calculations:</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          • <strong>Example US Bracket Filer:</strong> Gross income $85,000, US Standard deduction of $15,000. Taxable base = $70,000.<br />
          1. 10% on first $11,600 = $1,160.<br />
          2. 12% on range $11,600 to $47,150 = ($47,150 - $11,600) * 12% = $4,266.<br />
          3. 22% on remaining taxable range ($70,000 - $47,150) = $22,850 * 22% = $5,027.<br />
          Total federal tax due = $1,160 + $4,266 + $5,027 = <strong>$10,453</strong>. Effective rate = <strong>12.3%</strong>.
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
            <span className="text-[10px] text-slate-400 block leading-tight">Check parts and compounding rates</span>
          </button>
          <button
            onClick={() => navigateTo('/calculators/gst-calculator/')}
            className={`p-3 rounded-xl border text-left hover:scale-[1.02] transition-all cursor-pointer ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-0.5">GST Calculator</span>
            <span className="text-[10px] text-slate-400 block leading-tight">Add or subtract product-specific taxes</span>
          </button>
          <button
            onClick={() => navigateTo('/calculators/sip-calculator/')}
            className={`p-3 rounded-xl border text-left hover:scale-[1.02] transition-all cursor-pointer ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-0.5">SIP Calculator</span>
            <span className="text-[10px] text-slate-400 block leading-tight">Model investment returns on your take-home cash</span>
          </button>
        </div>
      </div>
    </div>
  );
}
