import React, { useState, useEffect } from 'react';
import { Calculator, Heart, Info, ArrowRight } from 'lucide-react';

interface ToolProps {
  triggerNotification: (msg: string) => void;
  theme: 'light' | 'dark';
}

export default function BmiCalculatorTool({ triggerNotification, theme }: ToolProps) {
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');

  // Metric inputs
  const [weightKg, setWeightKg] = useState<number>(70);
  const [heightCm, setHeightCm] = useState<number>(175);

  // Imperial inputs
  const [weightLbs, setWeightLbs] = useState<number>(154);
  const [heightFt, setHeightFt] = useState<number>(5);
  const [heightIn, setHeightIn] = useState<number>(9);

  const [bmi, setBmi] = useState<number>(22.86);
  const [category, setCategory] = useState<string>('Normal Weight');
  const [colorClass, setColorClass] = useState<string>('text-emerald-500');
  const [gaugePercent, setGaugePercent] = useState<number>(45); // Indicator position on custom range slider
  const [idealWeightRange, setIdealWeightRange] = useState<string>('');
  const [tips, setTips] = useState<string[]>([]);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  useEffect(() => {
    calculateBmi();
  }, [unitSystem, weightKg, heightCm, weightLbs, heightFt, heightIn]);

  const calculateBmi = () => {
    let calculatedBmi = 0;
    let minIdealKg = 0;
    let maxIdealKg = 0;
    let currentHeightInMeters = 1.75;

    if (unitSystem === 'metric') {
      if (weightKg <= 0 || heightCm <= 0) return;
      currentHeightInMeters = heightCm / 100;
      calculatedBmi = weightKg / (currentHeightInMeters * currentHeightInMeters);

      // Ideal weight formula based on normal BMI range 18.5 to 24.9
      minIdealKg = 18.5 * (currentHeightInMeters * currentHeightInMeters);
      maxIdealKg = 24.9 * (currentHeightInMeters * currentHeightInMeters);
      setIdealWeightRange(`${minIdealKg.toFixed(1)} kg - ${maxIdealKg.toFixed(1)} kg`);
    } else {
      const totalInches = heightFt * 12 + heightIn;
      if (weightLbs <= 0 || totalInches <= 0) return;
      calculatedBmi = (weightLbs / (totalInches * totalInches)) * 703;

      currentHeightInMeters = (totalInches * 2.54) / 100;
      minIdealKg = 18.5 * (currentHeightInMeters * currentHeightInMeters);
      maxIdealKg = 24.9 * (currentHeightInMeters * currentHeightInMeters);

      const minIdealLbs = minIdealKg * 2.20462;
      const maxIdealLbs = maxIdealKg * 2.20462;
      setIdealWeightRange(`${minIdealLbs.toFixed(1)} lbs - ${maxIdealLbs.toFixed(1)} lbs`);
    }

    if (isNaN(calculatedBmi) || !isFinite(calculatedBmi)) return;

    calculatedBmi = Number(calculatedBmi.toFixed(2));
    setBmi(calculatedBmi);

    // Determine category & gauge position
    // Gauge ranges: BMI 15 to 35
    const minBmiBound = 15;
    const maxBmiBound = 35;
    const pct = Math.min(100, Math.max(0, ((calculatedBmi - minBmiBound) / (maxBmiBound - minBmiBound)) * 100));
    setGaugePercent(pct);

    if (calculatedBmi < 18.5) {
      setCategory('Underweight');
      setColorClass('text-blue-500');
      setTips([
        'Focus on nutrient-dense meals with balanced proteins and carbs.',
        'Consider muscle-building exercises to gain healthy weight.',
        'Increase meal frequency or add healthy snacks like nuts and avocados.'
      ]);
    } else if (calculatedBmi >= 18.5 && calculatedBmi <= 24.9) {
      setCategory('Normal Weight');
      setColorClass('text-emerald-500');
      setTips([
        'Excellent! Keep up your balanced diet and regular physical routine.',
        'Aim for at least 150 minutes of moderate cardiovascular workout weekly.',
        'Maintain consistent hydration and sleep habits.'
      ]);
    } else if (calculatedBmi >= 25 && calculatedBmi <= 29.9) {
      setCategory('Overweight');
      setColorClass('text-amber-500');
      setTips([
        'Emphasize fiber-rich vegetables, whole grains, and lean proteins.',
        'Integrate regular aerobic exercises with strength training.',
        'Monitor portion sizes and limit sugars and processed foods.'
      ]);
    } else {
      setCategory('Obese');
      setColorClass('text-rose-500');
      setTips([
        'Prioritize scheduling a consultation with a healthcare provider or nutritionist.',
        'Implement low-impact exercises (swimming, brisk walking) to protect joints.',
        'Gradually reduce calorie intake through structured wholesome meals.'
      ]);
    }
  };

  return (
    <div id="bmi-calculator-root" className="space-y-8">
      {/* Primary Workspace */}
      <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
            <Heart className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">BMI Calculator</h2>
        </div>
        <p className="text-xs text-slate-400 mb-6">Calculate Body Mass Index (BMI) to understand relative health categories. Offers instant metric/imperial toggles and ideal weights.</p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls */}
          <div className="lg:col-span-5 space-y-5">
            {/* Toggle system */}
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 block mb-2 uppercase">Measurement System</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setUnitSystem('metric')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer text-center ${
                    unitSystem === 'metric'
                      ? 'bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-500/10'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  Metric (kg / cm)
                </button>
                <button
                  onClick={() => setUnitSystem('imperial')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer text-center ${
                    unitSystem === 'imperial'
                      ? 'bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-500/10'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  Imperial (lbs / ft-in)
                </button>
              </div>
            </div>

            {/* Metric Input Group */}
            {unitSystem === 'metric' ? (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase">Weight (kg)</label>
                    <input
                      type="number"
                      value={weightKg}
                      onChange={(e) => setWeightKg(Math.max(1, Number(e.target.value)))}
                      className={`w-20 p-1.5 rounded-lg border text-right text-xs font-bold outline-none focus:border-violet-500 ${
                        theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'
                      }`}
                    />
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="200"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full accent-violet-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase">Height (cm)</label>
                    <input
                      type="number"
                      value={heightCm}
                      onChange={(e) => setHeightCm(Math.max(50, Number(e.target.value)))}
                      className={`w-20 p-1.5 rounded-lg border text-right text-xs font-bold outline-none focus:border-violet-500 ${
                        theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'
                      }`}
                    />
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="220"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-full accent-violet-600 cursor-pointer"
                  />
                </div>
              </div>
            ) : (
              /* Imperial Input Group */
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase">Weight (lbs)</label>
                    <input
                      type="number"
                      value={weightLbs}
                      onChange={(e) => setWeightLbs(Math.max(1, Number(e.target.value)))}
                      className={`w-20 p-1.5 rounded-lg border text-right text-xs font-bold outline-none focus:border-violet-500 ${
                        theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'
                      }`}
                    />
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="450"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(Number(e.target.value))}
                    className="w-full accent-violet-600 cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase">Height (Feet)</label>
                    <input
                      type="number"
                      min="3"
                      max="8"
                      value={heightFt}
                      onChange={(e) => setHeightFt(Math.max(3, Number(e.target.value)))}
                      className={`w-full p-2 rounded-xl border text-center text-xs font-bold outline-none focus:border-violet-500 ${
                        theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase">Height (Inches)</label>
                    <input
                      type="number"
                      min="0"
                      max="11"
                      value={heightIn}
                      onChange={(e) => setHeightIn(Math.min(11, Math.max(0, Number(e.target.value))))}
                      className={`w-full p-2 rounded-xl border text-center text-xs font-bold outline-none focus:border-violet-500 ${
                        theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Outputs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Big Results Card */}
            <div className="p-5 rounded-2xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/30 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="text-center sm:text-left">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-0.5">Your Body Mass Index</span>
                <span className="text-4xl font-extrabold text-violet-600 dark:text-violet-400">{bmi}</span>
                <div className="mt-2 flex items-center justify-center sm:justify-start gap-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase">Category:</span>
                  <span className={`text-xs font-bold ${colorClass}`}>{category}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 text-center">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-0.5">Healthy Weight Range</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">{idealWeightRange}</span>
                <span className="text-[9px] text-slate-400 block leading-tight mt-1">Based on healthy WHO heights standards</span>
              </div>
            </div>

            {/* Custom Visual health gauge */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase">
                <span>Underweight (&lt;18.5)</span>
                <span>Normal (18.5-24.9)</span>
                <span>Overweight (25-29.9)</span>
                <span>Obese (&gt;30)</span>
              </div>
              
              {/* Color spectrum slider background */}
              <div className="h-3.5 w-full rounded-full relative overflow-visible bg-gradient-to-r from-blue-400 via-emerald-400 via-amber-400 to-rose-400">
                {/* Pointer indicator pin */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 -mt-1 w-4 h-4 rounded-full bg-white border-2 border-slate-800 dark:border-slate-200 shadow-md transition-all duration-300"
                  style={{ left: `calc(${gaugePercent}% - 8px)` }}
                />
              </div>
            </div>

            {/* Wellness Tips list */}
            {tips.length > 0 && (
              <div className={`p-4 rounded-xl border flex gap-3 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <Info className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200 block mb-1">Tailored Wellness Guidelines</span>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                    {tips.map((tip, idx) => (
                      <li key={idx} className="leading-relaxed">{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Formula & Explanations */}
      <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-4">Formula & Explanation</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
          Body Mass Index (BMI) is a proxy indicator of body fatness. It is simple to compute and is the same for both adult men and women.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-xl font-mono text-[10px] leading-relaxed ${theme === 'dark' ? 'bg-slate-900 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
            <strong>Metric system BMI calculation:</strong><br />
            BMI = Weight (kg) / Height (m)²<br /><br />
            Example height: 175cm = 1.75m.<br />
            BMI = 70 / (1.75 * 1.75) = 70 / 3.06 = <strong>22.86</strong>
          </div>
          <div className={`p-4 rounded-xl font-mono text-[10px] leading-relaxed ${theme === 'dark' ? 'bg-slate-900 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
            <strong>Imperial system BMI calculation:</strong><br />
            BMI = (Weight (lbs) / Height (inches)²) * 703<br /><br />
            Example height: 5ft 9in = 69 inches.<br />
            BMI = (154 / (69 * 69)) * 703 = <strong>22.74</strong>
          </div>
        </div>

        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-4 mb-2">Example Calculations:</h4>
        <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
          <p>• <strong>Underweight:</strong> BMI score below 18.5. (e.g., height 1.80m, weight 55kg = BMI 16.98).</p>
          <p>• <strong>Normal Range:</strong> BMI score from 18.5 to 24.9. (e.g., height 1.75m, weight 70kg = BMI 22.86).</p>
          <p>• <strong>Overweight:</strong> BMI score from 25 to 29.9. (e.g., height 1.65m, weight 75kg = BMI 27.55).</p>
          <p>• <strong>Obese:</strong> BMI score of 30 or higher. (e.g., height 1.70m, weight 90kg = BMI 31.14).</p>
        </div>
      </div>

      {/* Related Calculators */}
      <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-4">Related Calculators</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => navigateTo('/calculators/age-calculator/')}
            className={`p-3 rounded-xl border text-left hover:scale-[1.02] transition-all cursor-pointer ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-0.5">Age Calculator</span>
            <span className="text-[10px] text-slate-400 block leading-tight">Find exact age, born weekday, and zodiacs</span>
          </button>
          <button
            onClick={() => navigateTo('/calculators/percentage-calculator/')}
            className={`p-3 rounded-xl border text-left hover:scale-[1.02] transition-all cursor-pointer ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-0.5">Percentage Calculator</span>
            <span className="text-[10px] text-slate-400 block leading-tight">Calculate percentage change and portions</span>
          </button>
          <button
            onClick={() => navigateTo('/calculators/scientific-calculator/')}
            className={`p-3 rounded-xl border text-left hover:scale-[1.02] transition-all cursor-pointer ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-0.5">Scientific Calculator</span>
            <span className="text-[10px] text-slate-400 block leading-tight">Solve equations with advanced trigonometry</span>
          </button>
        </div>
      </div>
    </div>
  );
}
