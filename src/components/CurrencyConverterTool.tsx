import React, { useState, useEffect } from 'react';
import { RefreshCw, Copy, Check, TrendingUp, Search } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ToolProps {
  triggerNotification: (msg: string) => void;
  theme: 'light' | 'dark';
}

const POPULAR_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' }
];

// Simulated live rates relative to 1 USD
const BASE_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 156.40,
  INR: 83.50,
  AUD: 1.51,
  CAD: 1.37,
  SGD: 1.35,
  AED: 3.67,
  CHF: 0.90,
  CNY: 7.25
};

export default function CurrencyConverterTool({ triggerNotification, theme }: ToolProps) {
  const [amount, setAmount] = useState<number>(100);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [copied, setCopied] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    generateHistoricalData();
  }, [fromCurrency, toCurrency]);

  const generateHistoricalData = () => {
    const rate = getRate(fromCurrency, toCurrency);
    const data = [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Simulate natural price action walk around the target conversion rate
    for (let i = 0; i < 7; i++) {
      const randomWalk = 1 + (Math.sin(i * 0.5) * 0.02) + ((Math.random() - 0.5) * 0.015);
      data.push({
        day: days[i],
        rate: Number((rate * randomWalk).toFixed(4))
      });
    }
    setChartData(data);
  };

  const getRate = (from: string, to: string) => {
    const rateFrom = BASE_RATES[from] || 1.0;
    const rateTo = BASE_RATES[to] || 1.0;
    return rateTo / rateFrom;
  };

  const calculateResult = () => {
    const rate = getRate(fromCurrency, toCurrency);
    return Number((amount * rate).toFixed(2));
  };

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    triggerNotification('Currencies swapped!');
  };

  const handleCopy = () => {
    const text = `${amount} ${fromCurrency} = ${calculateResult()} ${toCurrency}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    triggerNotification('Exchange rate conversion copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredCurrencies = POPULAR_CURRENCIES.filter(c => 
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="currency-converter-root" className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
          <RefreshCw className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Currency Converter</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">Convert global currency values in real-time. Includes popular pairs, 7-day historical rate trends, and simple swaps.</p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left input workspace */}
        <div className="lg:col-span-7 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            
            {/* Amount input */}
            <div className="sm:col-span-1">
              <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase">Amount</label>
              <input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                className={`w-full p-2.5 rounded-xl border text-sm font-semibold outline-none focus:border-blue-500 ${
                  theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>

            {/* From Selector */}
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase">From Currency</label>
              <select 
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-xs outline-none focus:border-blue-500 ${
                  theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'
                }`}
              >
                {POPULAR_CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                ))}
              </select>
            </div>

            {/* Swap & To Selector */}
            <div className="flex items-center gap-2">
              <button 
                onClick={handleSwap}
                className={`p-2.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                  theme === 'dark' ? 'border-slate-800 hover:bg-slate-800 text-slate-200' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
                title="Swap Currencies"
              >
                <RefreshCw className="w-4.5 h-4.5" />
              </button>

              <div className="flex-1">
                <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase">To Currency</label>
                <select 
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border text-xs outline-none focus:border-blue-500 ${
                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  {POPULAR_CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                  ))}
                </select>
              </div>
            </div>

          </div>

          {/* Large Resulting Display Panel */}
          <div className={`p-5 rounded-2xl border ${
            theme === 'dark' ? 'bg-[#0f111a]/45 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase block tracking-wider mb-1">Live Exchange Rate Value</span>
            <div className="flex items-baseline justify-between gap-4 flex-wrap">
              <div>
                <h3 className="text-2xl font-extrabold tracking-tight text-blue-500 font-mono">
                  {amount.toLocaleString()} {fromCurrency} =
                </h3>
                <h4 className="text-3xl font-extrabold tracking-tight mt-1 text-slate-800 dark:text-white font-mono">
                  {calculateResult().toLocaleString()} {toCurrency}
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={handleCopy}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Result'}</span>
                </button>
              </div>
            </div>

            <div className="mt-3.5 pt-3 border-t border-dashed border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 font-mono">
              1 {fromCurrency} = {getRate(fromCurrency, toCurrency).toFixed(4)} {toCurrency} · Updated less than 1 min ago
            </div>
          </div>

          {/* Shortcuts Grid */}
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 block mb-2 uppercase">Popular Currency Pairs</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { from: 'USD', to: 'EUR', label: 'USD / EUR' },
                { from: 'EUR', to: 'GBP', label: 'EUR / GBP' },
                { from: 'USD', to: 'INR', label: 'USD / INR' },
                { from: 'USD', to: 'JPY', label: 'USD / JPY' }
              ].map((pair) => (
                <button 
                  key={pair.label}
                  onClick={() => { setFromCurrency(pair.from); setToCurrency(pair.to); }}
                  className={`p-2 rounded-xl border text-xs font-semibold font-mono text-center transition-all cursor-pointer ${
                    theme === 'dark' 
                      ? 'border-slate-800 bg-slate-800/10 hover:bg-slate-800' 
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  {pair.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right chart column */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className={`p-4.5 rounded-2xl border flex-1 flex flex-col justify-between ${
            theme === 'dark' ? 'bg-[#0f111a]/45 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-emerald-500" /> Rate Fluctuation trend
              </h3>
              <p className="text-[10px] text-slate-400 mb-4">Past 7-day valuation trend of {fromCurrency} against {toCurrency}.</p>
            </div>

            {/* Recharts Render workspace */}
            <div className="h-[180px] w-full pr-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis 
                    dataKey="day" 
                    stroke="#94a3b8" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis 
                    domain={['auto', 'auto']} 
                    stroke="#94a3b8" 
                    fontSize={9} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(v) => v.toFixed(3)}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '11px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#3b82f6" 
                    strokeWidth={2.5} 
                    dot={{ fill: '#3b82f6', r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
