import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, ArrowUpRight, TrendingDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ToolProps {
  triggerNotification: (msg: string) => void;
  theme: 'light' | 'dark';
}

export default function LoanCalculatorTool({ triggerNotification, theme }: ToolProps) {
  const [principal, setPrincipal] = useState<number>(200000);
  const [interestRate, setInterestRate] = useState<number>(7.5);
  const [tenureYears, setTenureYears] = useState<number>(15);
  const [extraMonthly, setExtraMonthly] = useState<number>(200);
  const [extraAnnual, setExtraAnnual] = useState<number>(0);

  const [baseEmi, setBaseEmi] = useState<number>(0);
  const [baseInterest, setBaseInterest] = useState<number>(0);
  const [prepayInterest, setPrepayInterest] = useState<number>(0);
  const [interestSaved, setInterestSaved] = useState<number>(0);
  const [monthsSaved, setMonthsSaved] = useState<number>(0);
  const [totalTenurePrepayMonths, setTotalTenurePrepayMonths] = useState<number>(0);
  const [chartData, setChartData] = useState<any[]>([]);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  useEffect(() => {
    calculateLoan();
  }, [principal, interestRate, tenureYears, extraMonthly, extraAnnual]);

  const calculateLoan = () => {
    const P = principal;
    const r = interestRate / 12 / 100;
    const totalMonths = tenureYears * 12;

    if (P <= 0 || interestRate <= 0 || tenureYears <= 0) {
      setBaseEmi(0);
      setBaseInterest(0);
      setPrepayInterest(0);
      setInterestSaved(0);
      setMonthsSaved(0);
      setChartData([]);
      return;
    }

    // Base EMI calculation
    const emiVal = (P * r * Math.pow(1 + r, totalMonths)) / (Math.pow(1 + r, totalMonths) - 1);
    const calculatedBaseEmi = isNaN(emiVal) || !isFinite(emiVal) ? 0 : emiVal;
    const calculatedBaseInterest = calculatedBaseEmi * totalMonths - P;

    setBaseEmi(Number(calculatedBaseEmi.toFixed(2)));
    setBaseInterest(Number(calculatedBaseInterest.toFixed(2)));

    // Simulation With Prepayments
    let balanceBase = P;
    let balancePrepay = P;
    let totalIntPrepay = 0;
    let prepayActiveMonths = 0;
    const yearlyLogs = [];

    let monthsCounter = 0;
    while (balancePrepay > 0 && monthsCounter < totalMonths) {
      monthsCounter++;

      // Interest for this month in prepay scenario
      const interestMonthPrepay = balancePrepay * r;
      totalIntPrepay += interestMonthPrepay;

      // Deduct regular EMI first (or remaining balance if it is smaller)
      const regularPaidToPrincipal = Math.min(balancePrepay, calculatedBaseEmi - interestMonthPrepay);
      balancePrepay -= regularPaidToPrincipal;

      // Add extra monthly prepayment
      if (balancePrepay > 0) {
        const actualExtra = Math.min(balancePrepay, extraMonthly);
        balancePrepay -= actualExtra;
      }

      // Add extra annual prepayment (once every 12 months)
      if (monthsCounter % 12 === 0 && balancePrepay > 0) {
        const actualAnnualExtra = Math.min(balancePrepay, extraAnnual);
        balancePrepay -= actualAnnualExtra;
      }

      prepayActiveMonths = monthsCounter;

      // Also compute standard base balance progress for yearly logs
      const baseInterestMonth = balanceBase * r;
      const basePaidToPrincipal = Math.min(balanceBase, calculatedBaseEmi - baseInterestMonth);
      balanceBase -= basePaidToPrincipal;

      // Save chart points yearly
      if (monthsCounter % 12 === 0 || balancePrepay <= 0) {
        const yrNum = Math.ceil(monthsCounter / 12);
        yearlyLogs.push({
          year: `Yr ${yrNum}`,
          StandardBalance: Math.round(balanceBase),
          PrepaidBalance: Math.round(balancePrepay)
        });
      }
    }

    setPrepayInterest(Number(totalIntPrepay.toFixed(2)));
    setInterestSaved(Number((calculatedBaseInterest - totalIntPrepay).toFixed(2)));
    setMonthsSaved(totalMonths - prepayActiveMonths);
    setTotalTenurePrepayMonths(prepayActiveMonths);

    // Make sure we have logs from Year 0
    const fullLogs = [
      { year: 'Start', StandardBalance: P, PrepaidBalance: P },
      ...yearlyLogs
    ];
    setChartData(fullLogs);
  };

  return (
    <div id="loan-calculator-root" className="space-y-8">
      {/* Primary Workspace */}
      <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-[#1e293b]' : 'bg-white border-[#e2e8f0]'}`}>
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
            <Calculator className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Loan Prepayment Calculator</h2>
        </div>
        <p className="text-xs text-slate-400 mb-6 font-medium">Evaluate the impact of extra monthly or annual lump-sum prepayments. Calculate total interest saved and timeline reductions instantly.</p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Loan Amount ($)</label>
                <input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(Math.max(0, Number(e.target.value)))}
                  className={`w-28 p-1.5 rounded-lg border text-right text-xs font-bold outline-none focus:border-violet-500 ${
                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>
              <input
                type="range"
                min="10000"
                max="2000000"
                step="10000"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full accent-violet-600 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase">Interest Rate (% p.a.)</label>
                <input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Math.max(0.1, Number(e.target.value)))}
                  className={`w-full p-2 rounded-lg border text-center text-xs font-bold outline-none focus:border-violet-500 ${
                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>
              <div>
                <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase">Tenure (Years)</label>
                <input
                  type="number"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Math.max(1, Number(e.target.value)))}
                  className={`w-full p-2 rounded-lg border text-center text-xs font-bold outline-none focus:border-violet-500 ${
                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-violet-50/20 dark:bg-violet-950/10 border border-violet-100/50 dark:border-violet-900/20 space-y-4">
              <span className="text-[10px] font-extrabold text-violet-500 uppercase tracking-widest block font-bold">Prepayments</span>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Extra Monthly Payment ($)</span>
                  <input
                    type="number"
                    value={extraMonthly}
                    onChange={(e) => setExtraMonthly(Math.max(0, Number(e.target.value)))}
                    className={`w-20 p-1 rounded-lg border text-right text-xs font-bold outline-none focus:border-violet-500 ${
                      theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-200'
                    }`}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="50"
                  value={extraMonthly}
                  onChange={(e) => setExtraMonthly(Number(e.target.value))}
                  className="w-full accent-violet-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">One-Time Annual Payment ($)</span>
                  <input
                    type="number"
                    value={extraAnnual}
                    onChange={(e) => setExtraAnnual(Math.max(0, Number(e.target.value)))}
                    className={`w-20 p-1 rounded-lg border text-right text-xs font-bold outline-none focus:border-violet-500 ${
                      theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-200'
                    }`}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="500"
                  value={extraAnnual}
                  onChange={(e) => setExtraAnnual(Number(e.target.value))}
                  className="w-full accent-violet-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Graphical representation */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            
            {/* Savings Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/30 text-center">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase block mb-0.5">Base Monthly EMI</span>
                <span className="text-sm font-extrabold text-violet-600 dark:text-violet-400">${baseEmi.toLocaleString()}</span>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/20 text-center">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase block mb-0.5">Total Interest Saved</span>
                <span className="text-sm font-extrabold text-emerald-500">${interestSaved.toLocaleString()}</span>
              </div>
              <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100/50 dark:border-blue-900/20 text-center">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase block mb-0.5">Months Saved</span>
                <span className="text-sm font-extrabold text-blue-500">
                  {monthsSaved} Months<br />
                  <span className="text-[9px] text-slate-400 font-semibold">({(monthsSaved/12).toFixed(1)} years)</span>
                </span>
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-64 w-full">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-2">Loan Balance Progress Comparison</span>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorStd" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPre" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                  <YAxis stroke="#94a3b8" fontSize={9} fontWeight="bold" formatter={(val: number) => `$${val/1000}k`} />
                  <Tooltip formatter={(val: number) => `$${val.toLocaleString()}`} />
                  <Legend verticalAlign="top" height={36} iconSize={10} wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                  <Area type="monotone" name="Standard Loan Balance" dataKey="StandardBalance" stroke="#6366f1" fillOpacity={1} fill="url(#colorStd)" strokeWidth={2} />
                  <Area type="monotone" name="With Prepayments" dataKey="PrepaidBalance" stroke="#10b981" fillOpacity={1} fill="url(#colorPre)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>

      {/* Formula & Explanations */}
      <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-4">Formula & Explanation</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
          Prepayments act directly on lowering the <strong>principal balance</strong>. Since interest is calculated monthly as: 
          <code className="mx-1 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px]">Interest = RemainingPrincipal * (AnnualRate / 12)</code>, 
          shaving down the principal directly reduces subsequent interest compounding and decreases the total timeline needed to repay.
        </p>
        <div className={`p-4 rounded-xl font-mono text-[10px] leading-relaxed mb-4 ${theme === 'dark' ? 'bg-slate-900 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
          Month 1 Interest = Principal * r (where r = rate / 12 / 100)<br />
          Month 1 Principal Repaid = EMI - Month 1 Interest + Prepayments<br />
          Outstanding Balance = Principal - Month 1 Principal Repaid
        </div>

        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Example Calculations:</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          • <strong>Standard Loan:</strong> $200,000 borrowed at 7.5% for 15 years. Total interest paid without prepayments = <strong>$134,705</strong>. Monthly EMI = <strong>$1,854.03</strong>.<br />
          • <strong>With Prepayments ($200/mo extra):</strong> Paying $2,054.03 monthly instead of $1,854.03. The tenure decreases from 15 years (180 months) to <strong>approx 12.8 years (154 months)</strong>, and total interest paid reduces to <strong>$111,701</strong>, saving <strong>$23,004 in interest</strong>!
        </p>
      </div>

      {/* Related Calculators */}
      <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-4">Related Calculators</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => navigateTo('/calculators/emi-calculator/')}
            className={`p-3 rounded-xl border text-left hover:scale-[1.02] transition-all cursor-pointer ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-0.5">EMI Calculator</span>
            <span className="text-[10px] text-slate-400 block leading-tight">Basic Monthly installment and amortization table</span>
          </button>
          <button
            onClick={() => navigateTo('/calculators/sip-calculator/')}
            className={`p-3 rounded-xl border text-left hover:scale-[1.02] transition-all cursor-pointer ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-0.5">SIP Calculator</span>
            <span className="text-[10px] text-slate-400 block leading-tight">Compare savings compound returns side by side</span>
          </button>
          <button
            onClick={() => navigateTo('/calculators/discount-calculator/')}
            className={`p-3 rounded-xl border text-left hover:scale-[1.02] transition-all cursor-pointer ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-0.5">Discount Calculator</span>
            <span className="text-[10px] text-slate-400 block leading-tight">Instantly solve shopping percentage values</span>
          </button>
        </div>
      </div>
    </div>
  );
}
