import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, Calendar, RefreshCw } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ToolProps {
  triggerNotification: (msg: string) => void;
  theme: 'light' | 'dark';
}

export default function EmiCalculatorTool({ triggerNotification, theme }: ToolProps) {
  const [principal, setPrincipal] = useState<number>(100000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenure, setTenure] = useState<number>(5);
  const [tenureType, setTenureType] = useState<'years' | 'months'>('years');

  const [emi, setEmi] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [amortizationTable, setAmortizationTable] = useState<any[]>([]);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  useEffect(() => {
    calculateEmi();
  }, [principal, interestRate, tenure, tenureType]);

  const calculateEmi = () => {
    const P = principal;
    const annualR = interestRate;
    const totalMonths = tenureType === 'years' ? tenure * 12 : tenure;

    if (P <= 0 || annualR <= 0 || totalMonths <= 0) {
      setEmi(0);
      setTotalInterest(0);
      setTotalPayment(0);
      setAmortizationTable([]);
      return;
    }

    const r = annualR / 12 / 100; // Monthly interest rate

    // EMI formula: [P x r x (1+r)^n] / [(1+r)^n - 1]
    const emiVal = (P * r * Math.pow(1 + r, totalMonths)) / (Math.pow(1 + r, totalMonths) - 1);
    const calculatedEmi = isNaN(emiVal) || !isFinite(emiVal) ? 0 : emiVal;

    const totalPayable = calculatedEmi * totalMonths;
    const totalInt = totalPayable - P;

    setEmi(Number(calculatedEmi.toFixed(2)));
    setTotalPayment(Number(totalPayable.toFixed(2)));
    setTotalInterest(Number(totalInt.toFixed(2)));

    // Amortization Schedule (Annual Summary)
    let remainingBalance = P;
    const schedule = [];
    let accumulatedInterest = 0;
    let accumulatedPrincipal = 0;

    for (let month = 1; month <= totalMonths; month++) {
      const interestForMonth = remainingBalance * r;
      const principalForMonth = calculatedEmi - interestForMonth;
      remainingBalance -= principalForMonth;

      accumulatedInterest += interestForMonth;
      accumulatedPrincipal += principalForMonth;

      // Group by year or if it is the last month
      if (month % 12 === 0 || month === totalMonths) {
        const yearNum = Math.ceil(month / 12);
        schedule.push({
          year: `Year ${yearNum}`,
          principalPaid: Number(accumulatedPrincipal.toFixed(2)),
          interestPaid: Number(accumulatedInterest.toFixed(2)),
          totalPaid: Number((accumulatedPrincipal + accumulatedInterest).toFixed(2)),
          balance: Number(Math.max(0, remainingBalance).toFixed(2))
        });
        accumulatedInterest = 0;
        accumulatedPrincipal = 0;
      }
    }
    setAmortizationTable(schedule);
  };

  const pieData = [
    { name: 'Principal Loan Amount', value: principal },
    { name: 'Total Interest Payable', value: totalInterest }
  ];

  const COLORS = ['#6366f1', '#f43f5e'];

  return (
    <div id="emi-calculator-root" className="space-y-8">
      {/* Primary Workspace */}
      <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
            <Calculator className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">EMI Calculator</h2>
        </div>
        <p className="text-xs text-slate-400 mb-6">Plan and analyze housing, automotive, or personal loan monthly payments. See amortization progressions and visual payment distributions.</p>

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
                min="5000"
                max="1000000"
                step="5000"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full accent-violet-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                <span>$5K</span>
                <span>$500K</span>
                <span>$1M</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Interest Rate (% p.a.)</label>
                <input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Math.max(0.1, Number(e.target.value)))}
                  className={`w-20 p-1.5 rounded-lg border text-right text-xs font-bold outline-none focus:border-violet-500 ${
                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>
              <input
                type="range"
                min="1"
                max="25"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-violet-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                <span>1%</span>
                <span>12.5%</span>
                <span>25%</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase font-bold">Loan Tenure</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={tenure}
                    onChange={(e) => setTenure(Math.max(1, Number(e.target.value)))}
                    className={`w-16 p-1.5 rounded-lg border text-right text-xs font-bold outline-none focus:border-violet-500 ${
                      theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                  <select
                    value={tenureType}
                    onChange={(e) => setTenureType(e.target.value as 'years' | 'months')}
                    className={`p-1.5 rounded-lg border text-[10px] font-extrabold outline-none ${
                      theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value="years">Years</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max={tenureType === 'years' ? '30' : '360'}
                step="1"
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full accent-violet-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                <span>1 {tenureType}</span>
                <span>{tenureType === 'years' ? '15 Years' : '180 Months'}</span>
                <span>{tenureType === 'years' ? '30 Years' : '360 Months'}</span>
              </div>
            </div>
          </div>

          {/* Graphical Representation & Key Values */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            {/* Visual values */}
            <div className="sm:col-span-5 space-y-4">
              <div className="p-4 rounded-xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/30">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-0.5">Monthly EMI</span>
                <span className="text-xl font-extrabold text-violet-600 dark:text-violet-400">${emi.toLocaleString()}</span>
              </div>
              <div className="p-4 rounded-xl bg-rose-50/30 dark:bg-rose-950/10 border border-rose-100/50 dark:border-rose-900/20">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-0.5">Total Interest</span>
                <span className="text-base font-extrabold text-rose-500">${totalInterest.toLocaleString()}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-0.5">Total Payments</span>
                <span className="text-base font-bold text-slate-700 dark:text-slate-200">${totalPayment.toLocaleString()}</span>
              </div>
            </div>

            {/* Recharts Pie Chart */}
            <div className="sm:col-span-7 h-48 w-full flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                  <Legend verticalAlign="bottom" height={36} iconSize={10} wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Amortization Schedule Table */}
        {amortizationTable.length > 0 && (
          <div className="mt-8 border-t border-slate-200/60 dark:border-slate-800/60 pt-6">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4">Annual Amortization Schedule</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 pb-2 text-slate-400 font-extrabold uppercase text-[9px]">
                    <th className="py-2.5">Timeline</th>
                    <th>Principal Paid</th>
                    <th>Interest Paid</th>
                    <th>Total Payments</th>
                    <th className="text-right">Outstanding Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 font-medium">
                  {amortizationTable.map((row, idx) => (
                    <tr key={idx} className="text-slate-600 dark:text-slate-300">
                      <td className="py-2.5 font-bold text-violet-600 dark:text-violet-400">{row.year}</td>
                      <td>${row.principalPaid.toLocaleString()}</td>
                      <td className="text-rose-500">${row.interestPaid.toLocaleString()}</td>
                      <td>${row.totalPaid.toLocaleString()}</td>
                      <td className="text-right font-semibold">${row.balance.toLocaleString()}</td>
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
          The Equated Monthly Installment (EMI) is calculated using a reducing-balance loan schedule, meaning the interest is computed based on the outstanding principal balance remaining at each month.
        </p>
        <div className={`p-4 rounded-xl font-mono text-[10px] leading-relaxed mb-4 ${theme === 'dark' ? 'bg-slate-900 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
          <strong>EMI = [P x r x (1+r)^n] / [(1+r)^n - 1]</strong><br /><br />
          Where:<br />
          • P = Principal loan amount borrowed<br />
          • r = Monthly interest rate (Annual Rate / 12 / 100)<br />
          • n = Loan tenure in months (Years * 12)
        </div>

        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Example Calculations:</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          • <strong>Example:</strong> Borrowing <strong>$100,000</strong> at <strong>8.5%</strong> annual interest for <strong>5 years (60 months)</strong>:<br />
          Monthly rate (r) = 8.5 / 12 / 100 = 0.007083.<br />
          EMI = [100000 * 0.007083 * (1.007083)^60] / [(1.007083)^60 - 1] = <strong>$2,051.65 / month</strong>.<br />
          Total payment over 5 years = $2,051.65 * 60 = <strong>$123,099.05</strong>. Total Interest Paid = <strong>$23,099.05</strong>.
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
            <span className="text-[10px] text-slate-400 block leading-tight">Explore extra loan prepayments and savings</span>
          </button>
          <button
            onClick={() => navigateTo('/calculators/sip-calculator/')}
            className={`p-3 rounded-xl border text-left hover:scale-[1.02] transition-all cursor-pointer ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-0.5">SIP Calculator</span>
            <span className="text-[10px] text-slate-400 block leading-tight">Check compounding mutual fund investments</span>
          </button>
          <button
            onClick={() => navigateTo('/calculators/gst-calculator/')}
            className={`p-3 rounded-xl border text-left hover:scale-[1.02] transition-all cursor-pointer ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-0.5">GST Calculator</span>
            <span className="text-[10px] text-slate-400 block leading-tight">Add or subtract GST taxes with dual divisions</span>
          </button>
        </div>
      </div>
    </div>
  );
}
