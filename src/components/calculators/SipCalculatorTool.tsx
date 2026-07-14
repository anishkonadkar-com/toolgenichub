import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, ArrowUpRight, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ToolProps {
  triggerNotification: (msg: string) => void;
  theme: 'light' | 'dark';
}

export default function SipCalculatorTool({ triggerNotification, theme }: ToolProps) {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(500);
  const [expectedReturns, setExpectedReturns] = useState<number>(12);
  const [years, setYears] = useState<number>(10);

  const [totalInvested, setTotalInvested] = useState<number>(0);
  const [estimatedReturns, setEstimatedReturns] = useState<number>(0);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [chartData, setChartData] = useState<any[]>([]);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  useEffect(() => {
    calculateSip();
  }, [monthlyInvestment, expectedReturns, years]);

  const calculateSip = () => {
    const P = monthlyInvestment;
    const i = expectedReturns / 12 / 100; // Monthly interest rate
    const n = years * 12; // Total months

    if (P <= 0 || expectedReturns <= 0 || years <= 0) {
      setTotalInvested(0);
      setEstimatedReturns(0);
      setTotalValue(0);
      setChartData([]);
      return;
    }

    // SIP Future Value formula: FV = P * [ ( (1 + i)^n - 1 ) / i ] * (1 + i)
    const futureVal = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const invested = P * n;
    const returns = futureVal - invested;

    setTotalInvested(Math.round(invested));
    setEstimatedReturns(Math.round(returns));
    setTotalValue(Math.round(futureVal));

    // Calculate year-by-year compounding data for the area chart and schedules
    const data = [];
    let cumulativeInvested = 0;
    
    for (let yr = 1; yr <= years; yr++) {
      const monthsElapsed = yr * 12;
      const yrFV = P * ((Math.pow(1 + i, monthsElapsed) - 1) / i) * (1 + i);
      cumulativeInvested = P * monthsElapsed;
      const yrReturns = yrFV - cumulativeInvested;

      data.push({
        year: `Year ${yr}`,
        Invested: Math.round(cumulativeInvested),
        Returns: Math.round(yrReturns),
        Total: Math.round(yrFV)
      });
    }

    setChartData(data);
  };

  return (
    <div id="sip-calculator-root" className="space-y-8">
      {/* Primary Workspace */}
      <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">SIP Calculator</h2>
        </div>
        <p className="text-xs text-slate-400 mb-6 font-medium">Model future wealth values for Systematic Investment Plans. See mutual fund growth with compound projections and annual summaries.</p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Monthly Investment ($)</label>
                <input
                  type="number"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(Math.max(0, Number(e.target.value)))}
                  className={`w-24 p-1.5 rounded-lg border text-right text-xs font-bold outline-none focus:border-violet-500 ${
                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>
              <input
                type="range"
                min="10"
                max="10000"
                step="10"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                className="w-full accent-violet-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                <span>$10</span>
                <span>$5K</span>
                <span>$10K</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Expected Return Rate (% p.a.)</label>
                <input
                  type="number"
                  step="0.1"
                  value={expectedReturns}
                  onChange={(e) => setExpectedReturns(Math.max(0.1, Number(e.target.value)))}
                  className={`w-20 p-1.5 rounded-lg border text-right text-xs font-bold outline-none focus:border-violet-500 ${
                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="0.5"
                value={expectedReturns}
                onChange={(e) => setExpectedReturns(Number(e.target.value))}
                className="w-full accent-violet-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                <span>1%</span>
                <span>15%</span>
                <span>30%</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Time Period (Years)</label>
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Math.max(1, Number(e.target.value)))}
                  className={`w-16 p-1.5 rounded-lg border text-right text-xs font-bold outline-none focus:border-violet-500 ${
                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>
              <input
                type="range"
                min="1"
                max="40"
                step="1"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full accent-violet-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                <span>1 Year</span>
                <span>20 Years</span>
                <span>40 Years</span>
              </div>
            </div>
          </div>

          {/* Graphical representation */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            
            {/* Value cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase block mb-0.5">Total Invested</span>
                <span className="text-sm font-extrabold text-slate-700 dark:text-slate-200">${totalInvested.toLocaleString()}</span>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/20 text-center">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase block mb-0.5">Wealth Gains</span>
                <span className="text-sm font-extrabold text-emerald-500">${estimatedReturns.toLocaleString()}</span>
              </div>
              <div className="p-4 rounded-xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/30 text-center">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase block mb-0.5">Future Value</span>
                <span className="text-sm font-extrabold text-violet-600 dark:text-violet-400">${totalValue.toLocaleString()}</span>
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-64 w-full">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-2 font-bold">Wealth Compounding over Time</span>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                  <YAxis stroke="#94a3b8" fontSize={9} fontWeight="bold" formatter={(val: number) => `$${val/1000}k`} />
                  <Tooltip formatter={(val: number) => `$${val.toLocaleString()}`} />
                  <Legend verticalAlign="top" height={36} iconSize={10} wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                  <Area type="monotone" name="Invested Capital" dataKey="Invested" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} strokeWidth={2} />
                  <Area type="monotone" name="Wealth Gained" dataKey="Returns" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.4} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Growth projection schedule */}
        {chartData.length > 0 && (
          <div className="mt-8 border-t border-slate-200/60 dark:border-slate-800/60 pt-6">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4">Yearly Wealth Growth Schedule</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 pb-2 text-slate-400 font-extrabold uppercase text-[9px]">
                    <th className="py-2.5">Timeline</th>
                    <th>Invested Capital</th>
                    <th>Wealth Returns</th>
                    <th className="text-right">Estimated Total Corpus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 font-medium">
                  {chartData.map((row, idx) => (
                    <tr key={idx} className="text-slate-600 dark:text-slate-300">
                      <td className="py-2.5 font-bold text-violet-600 dark:text-violet-400">{row.year}</td>
                      <td>${row.Invested.toLocaleString()}</td>
                      <td className="text-emerald-500">${row.Returns.toLocaleString()}</td>
                      <td className="text-right font-bold text-slate-700 dark:text-slate-200">${row.Total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Formula & Explanations */}
      <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-4">Formula & Explanation</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
          A Systematic Investment Plan (SIP) utilizes the mathematical concept of compounding. Since investments are made monthly, return interest compounds monthly too.
        </p>
        <div className={`p-4 rounded-xl font-mono text-[10px] leading-relaxed mb-4 ${theme === 'dark' ? 'bg-slate-900 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
          <strong>Future Value = P * [ ( (1 + i)^n - 1 ) / i ] * (1 + i)</strong><br /><br />
          Where:<br />
          • P = Monthly installment amount<br />
          • i = Monthly interest rate (Expected Return Rate / 12 / 100)<br />
          • n = Total number of monthly installments (Years * 12)
        </div>

        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Example Calculations:</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          • <strong>Example:</strong> Investing <strong>$500 per month</strong> at <strong>12%</strong> expected return for <strong>10 years (120 months)</strong>:<br />
          Monthly rate (i) = 12 / 12 / 100 = 0.01.<br />
          Future Value = 500 * [((1.01)^120 - 1) / 0.01] * (1.01) = <strong>$116,170</strong>.<br />
          Total Capital Invested = $500 * 120 = <strong>$60,000</strong>. Estimated Wealth gained = <strong>$56,170</strong>.
        </p>
      </div>

      {/* Related Calculators */}
      <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-4">Related Calculators</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => navigateTo('/calculators/loan-calculator/')}
            className={`p-3 rounded-xl border text-left hover:scale-[1.02] transition-all cursor-pointer ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-0.5">Loan Calculator</span>
            <span className="text-[10px] text-slate-400 block leading-tight">Explore extra loan prepayments and interest savings</span>
          </button>
          <button
            onClick={() => navigateTo('/calculators/emi-calculator/')}
            className={`p-3 rounded-xl border text-left hover:scale-[1.02] transition-all cursor-pointer ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-0.5">EMI Calculator</span>
            <span className="text-[10px] text-slate-400 block leading-tight">Monthly loan amortization schedules</span>
          </button>
          <button
            onClick={() => navigateTo('/calculators/income-tax-calculator/')}
            className={`p-3 rounded-xl border text-left hover:scale-[1.02] transition-all cursor-pointer ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-0.5">Income Tax Calculator</span>
            <span className="text-[10px] text-slate-400 block leading-tight">Estimate tax liabilities and take-home pay</span>
          </button>
        </div>
      </div>
    </div>
  );
}
