import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Award, Star, ArrowRight, ArrowLeftRight } from 'lucide-react';

interface ToolProps {
  triggerNotification: (msg: string) => void;
  theme: 'light' | 'dark';
}

export default function AgeCalculatorTool({ triggerNotification, theme }: ToolProps) {
  const [dob, setDob] = useState<string>('1995-06-15');
  const [targetDate, setTargetDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [ageResult, setAgeResult] = useState<any>(null);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  useEffect(() => {
    calculateAge();
  }, [dob, targetDate]);

  const calculateAge = () => {
    if (!dob || !targetDate) return;

    const birth = new Date(dob);
    const target = new Date(targetDate);

    if (isNaN(birth.getTime()) || isNaN(target.getTime())) return;

    if (target < birth) {
      setAgeResult({ error: 'Target date must be after Date of Birth' });
      return;
    }

    // Exact years, months, days calculation
    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
      months--;
    }

    if (months < 0) {
      months += 12;
      years--;
    }

    // Totals
    const diffMs = target.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = (target.getFullYear() - birth.getFullYear()) * 12 + target.getMonth() - birth.getMonth();
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;

    // Next Birthday Countdown
    const nextBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < target) {
      nextBirthday.setFullYear(target.getFullYear() + 1);
    }
    const birthdayDiffMs = nextBirthday.getTime() - target.getTime();
    const birthdayDaysLeft = Math.ceil(birthdayDiffMs / (1000 * 60 * 60 * 24)) % 365;
    let birthdayMonthsLeft = nextBirthday.getMonth() - target.getMonth();
    let birthdayDaysRemaining = nextBirthday.getDate() - target.getDate();

    if (birthdayDaysRemaining < 0) {
      const prevMonth = new Date(nextBirthday.getFullYear(), nextBirthday.getMonth(), 0);
      birthdayDaysRemaining += prevMonth.getDate();
      birthdayMonthsLeft--;
    }
    if (birthdayMonthsLeft < 0) {
      birthdayMonthsLeft += 12;
    }

    // Born weekday
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const bornDay = weekdays[birth.getDay()];

    // Zodiac and fun facts
    const westernZodiac = getWesternZodiac(birth.getMonth() + 1, birth.getDate());
    const chineseZodiac = getChineseZodiac(birth.getFullYear());

    setAgeResult({
      years,
      months,
      days,
      totalMonths,
      totalWeeks,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
      bornDay,
      westernZodiac,
      chineseZodiac,
      nextBirthdayDays: birthdayDaysLeft,
      nextBirthdayMonths: birthdayMonthsLeft,
      nextBirthdayDaysRemaining: birthdayDaysRemaining,
      error: null
    });
  };

  const getWesternZodiac = (month: number, day: number): string => {
    const signs = [
      { name: 'Capricorn', start: [12, 22], end: [1, 19] },
      { name: 'Aquarius', start: [1, 20], end: [2, 18] },
      { name: 'Pisces', start: [2, 19], end: [3, 20] },
      { name: 'Aries', start: [3, 21], end: [4, 19] },
      { name: 'Taurus', start: [4, 20], end: [5, 20] },
      { name: 'Gemini', start: [5, 21], end: [6, 20] },
      { name: 'Cancer', start: [6, 21], end: [7, 22] },
      { name: 'Leo', start: [7, 23], end: [8, 22] },
      { name: 'Virgo', start: [8, 23], end: [9, 22] },
      { name: 'Libra', start: [9, 23], end: [10, 22] },
      { name: 'Scorpio', start: [10, 23], end: [11, 21] },
      { name: 'Sagittarius', start: [11, 22], end: [12, 21] }
    ];

    for (const sign of signs) {
      const [sm, sd] = sign.start;
      const [em, ed] = sign.end;
      if ((month === sm && day >= sd) || (month === em && day <= ed)) {
        return sign.name;
      }
    }
    return 'Capricorn';
  };

  const getChineseZodiac = (year: number): string => {
    const animals = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
    return animals[(year - 4) % 12];
  };

  const handleCopyResult = () => {
    if (!ageResult || ageResult.error) return;
    const text = `I am exactly ${ageResult.years} Years, ${ageResult.months} Months, and ${ageResult.days} Days old! (Born on a ${ageResult.bornDay}).`;
    navigator.clipboard.writeText(text);
    triggerNotification('Age summary copied to clipboard!');
  };

  return (
    <div id="age-calculator-root" className="space-y-8">
      {/* Main Workspace Card */}
      <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
            <Calendar className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Age Calculator</h2>
        </div>
        <p className="text-xs text-slate-400 mb-6">Determine your exact age down to years, months, days, and seconds. View birthday countdowns, born day, and astrological insights.</p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className={`w-full p-3 rounded-xl border text-sm font-semibold outline-none focus:border-violet-500 ${
                  theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase">Age at Date (Target Date)</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className={`w-full p-3 rounded-xl border text-sm font-semibold outline-none focus:border-violet-500 ${
                  theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
            </div>

            <div className="pt-2">
              <button
                onClick={calculateAge}
                className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-violet-500/10"
              >
                Recalculate Age
              </button>
            </div>
          </div>

          {/* Outputs */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            {ageResult ? (
              ageResult.error ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40">
                  <span className="text-red-500 text-xs font-bold">{ageResult.error}</span>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Primary Output */}
                  <div className="p-5 rounded-2xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/30 text-center">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Your Exact Age</span>
                    <div className="flex justify-center items-baseline gap-2 flex-wrap">
                      <span className="text-3xl font-extrabold text-violet-600 dark:text-violet-400">{ageResult.years}</span>
                      <span className="text-xs text-slate-400 mr-2">years</span>
                      <span className="text-3xl font-extrabold text-violet-600 dark:text-violet-400">{ageResult.months}</span>
                      <span className="text-xs text-slate-400 mr-2">months</span>
                      <span className="text-3xl font-extrabold text-violet-600 dark:text-violet-400">{ageResult.days}</span>
                      <span className="text-xs text-slate-400">days</span>
                    </div>
                    <button
                      onClick={handleCopyResult}
                      className="mt-3 text-[10px] font-bold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 flex items-center gap-1 mx-auto cursor-pointer"
                    >
                      Copy Age Summary
                    </button>
                  </div>

                  {/* Upcoming Birthday */}
                  <div className={`p-4 rounded-xl border flex items-center justify-between ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Next Birthday Countdown:</span>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-500">
                      {ageResult.nextBirthdayMonths > 0 ? `${ageResult.nextBirthdayMonths} Months, ` : ''}{ageResult.nextBirthdayDaysRemaining} Days
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`p-3.5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase block mb-0.5">Day of Birth</span>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{ageResult.bornDay}</span>
                    </div>
                    <div className={`p-3.5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase block mb-0.5">Zodiac Sign</span>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{ageResult.westernZodiac} ({ageResult.chineseZodiac})</span>
                    </div>
                  </div>

                  {/* Life Metrics */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Detailed Life Metrics</span>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className={`p-2 rounded-lg border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-100/50 border-slate-200'}`}>
                        <span className="text-[9px] font-bold text-slate-400 block">Total Months</span>
                        <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200">{ageResult.totalMonths.toLocaleString()}</span>
                      </div>
                      <div className={`p-2 rounded-lg border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-100/50 border-slate-200'}`}>
                        <span className="text-[9px] font-bold text-slate-400 block">Total Weeks</span>
                        <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200">{ageResult.totalWeeks.toLocaleString()}</span>
                      </div>
                      <div className={`p-2 rounded-lg border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-100/50 border-slate-200'}`}>
                        <span className="text-[9px] font-bold text-slate-400 block">Total Days</span>
                        <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200">{ageResult.totalDays.toLocaleString()}</span>
                      </div>
                      <div className={`p-2 rounded-lg border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-100/50 border-slate-200'}`}>
                        <span className="text-[9px] font-bold text-slate-400 block">Total Hours</span>
                        <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200">{ageResult.totalHours.toLocaleString()}</span>
                      </div>
                      <div className={`p-2 rounded-lg border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-100/50 border-slate-200'}`}>
                        <span className="text-[9px] font-bold text-slate-400 block">Total Minutes</span>
                        <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200">{ageResult.totalMinutes.toLocaleString()}</span>
                      </div>
                      <div className={`p-2 rounded-lg border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-100/50 border-slate-200'}`}>
                        <span className="text-[9px] font-bold text-slate-400 block">Total Seconds</span>
                        <span className="text-[10px] font-extrabold text-slate-700 dark:text-slate-200">{ageResult.totalSeconds.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border rounded-xl border-dashed">
                <Calendar className="w-10 h-10 text-slate-300 mb-2" />
                <span className="text-xs font-semibold text-slate-400">Fill in Date of Birth to calculate</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Formula & Explanations */}
      <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-4">Formula & Explanation</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
          To calculate exact age, we count the full years completed between your Date of Birth and the target date. 
          Then, we determine the remaining full calendar months, and finally, the remaining days. 
          This method accounts for <strong>leap years</strong> (years divisible by 4, except century years not divisible by 400) 
          and the variable number of days in each calendar month (e.g., February has 28 or 29 days, while August has 31).
        </p>
        <div className={`p-4 rounded-xl font-mono text-[11px] leading-relaxed mb-4 ${theme === 'dark' ? 'bg-slate-900 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
          Years = TargetYear - BirthYear (adjusted if target month/day is earlier than birthday)<br />
          Months = TargetMonth - BirthMonth (borrowing from Years if negative)<br />
          Days = TargetDay - BirthDay (borrowing days from the previous month of Target if negative)
        </div>

        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Example Calculations:</h4>
        <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
          <p>• <strong>Example 1 (Standard):</strong> Born June 15, 1995. Current date: October 20, 2024. Complete years = 29. Complete months after June 15 = 4 (July, August, September, October 15). Days from October 15 to October 20 = 5 days. Age: <strong>29 Years, 4 Months, 5 Days</strong>.</p>
          <p>• <strong>Example 2 (Borrowing Days):</strong> Born September 28, 1998. Current date: May 12, 2024. Complete years = 25. Months between Sept and May borrowing a year = 7. Days from April 28 to May 12 = 14 days (borrowed 30 days from April). Age: <strong>25 Years, 7 Months, 14 Days</strong>.</p>
        </div>
      </div>

      {/* Related Calculators Widget (Internal Links) */}
      <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151924] border-slate-800' : 'bg-white border-slate-200'}`}>
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-4">Related Calculators</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => navigateTo('/calculators/bmi-calculator/')}
            className={`p-3 rounded-xl border text-left hover:scale-[1.02] transition-all cursor-pointer ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-0.5">BMI Calculator</span>
            <span className="text-[10px] text-slate-400 block leading-tight">Check body mass index and health metrics</span>
          </button>
          <button
            onClick={() => navigateTo('/calculators/percentage-calculator/')}
            className={`p-3 rounded-xl border text-left hover:scale-[1.02] transition-all cursor-pointer ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-0.5">Percentage Calculator</span>
            <span className="text-[10px] text-slate-400 block leading-tight">Calculate percentage change and ratios</span>
          </button>
          <button
            onClick={() => navigateTo('/calculators/discount-calculator/')}
            className={`p-3 rounded-xl border text-left hover:scale-[1.02] transition-all cursor-pointer ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-0.5">Discount Calculator</span>
            <span className="text-[10px] text-slate-400 block leading-tight">Find shopping sales savings instantly</span>
          </button>
        </div>
      </div>
    </div>
  );
}
