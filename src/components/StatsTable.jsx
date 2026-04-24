import React, { useState, useMemo } from 'react';

const StatsTable = ({ schedule }) => {
    const [period, setPeriod] = useState('all'); // all, week, month, year
    const [sortBy, setSortBy] = useState('recent'); // questions, recent

    const filteredData = useMemo(() => {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        let reportData = [];

        Object.entries(schedule).forEach(([dateStr, tasks]) => {
            const taskDate = new Date(dateStr);
            let include = false;

            if (period === 'all') include = true;
            else if (period === 'week') {
                const diff = (startOfToday - taskDate) / (1000 * 60 * 60 * 24);
                if (diff <= 7 && diff >= 0) include = true;
            } else if (period === 'month') {
                if (taskDate.getMonth() === now.getMonth() && taskDate.getFullYear() === now.getFullYear()) include = true;
            } else if (period === 'year') {
                if (taskDate.getFullYear() === now.getFullYear()) include = true;
            }

            if (include) {
                tasks.forEach(t => {
                    const q = parseInt(t.questions) || 0;
                    if (q > 0) {
                        reportData.push({
                            ...t,
                            date: dateStr
                        });
                    }
                });
            }
        });

        // Group by Lesson and Topic
        const grouped = {};
        reportData.forEach(t => {
            const lesson = (t.title || "Adsız Ders").toUpperCase();
            const topic = (t.topic || "Konu Belirtilmemiş").toUpperCase();
            const key = `${lesson}-${topic}`;

            if (!grouped[key]) {
                grouped[key] = { title: lesson, topic: topic, questions: 0, date: t.date };
            }
            grouped[key].questions += (parseInt(t.questions) || 0);
            if (new Date(t.date) > new Date(grouped[key].date)) {
                grouped[key].date = t.date;
            }
        });

        let result = Object.values(grouped);

        if (sortBy === 'questions') {
            result.sort((a, b) => b.questions - a.questions);
        } else {
            result.sort((a, b) => new Date(b.date) - new Date(a.date));
        }

        return result;
    }, [schedule, period, sortBy]);

    const [isPeriodOpen, setIsPeriodOpen] = useState(false);

    const periods = [
        { id: 'week', label: 'Haftalık' },
        { id: 'month', label: 'Aylık' },
        { id: 'year', label: 'Yıllık' },
        { id: 'all', label: 'Tümü' }
    ];

    const currentPeriodLabel = periods.find(p => p.id === period)?.label;

    return (
        <div className="flex flex-col h-full min-h-0">
            {/* Header / Filter */}
            <div className="flex justify-between items-center shrink-0 mb-6">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-duo-orange shadow-[0_0_10px_rgba(245,158,11,0.5)]"></span>
                    İSTATİSTİKLER
                </h4>

                <div className="relative">
                    <button
                        onClick={() => setIsPeriodOpen(!isPeriodOpen)}
                        className="flex items-center gap-2 bg-slate-900/40 hover:bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-white/5 transition-all outline-none group"
                    >
                        <span className="text-[9px] font-black text-duo-blue uppercase tracking-widest leading-none group-hover:text-white transition-colors">{currentPeriodLabel}</span>
                        <span className={`text-[8px] text-slate-600 transition-transform duration-300 ${isPeriodOpen ? 'rotate-180' : ''}`}>▼</span>
                    </button>

                    {isPeriodOpen && (
                        <div className="absolute top-full right-0 mt-2 w-32 bg-slate-900 border border-white/10 rounded-xl shadow-4xl z-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            {periods.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => {
                                        setPeriod(p.id);
                                        setIsPeriodOpen(false);
                                    }}
                                    className={`w-full px-4 py-3 text-left text-[9px] font-black uppercase tracking-wider transition-all hover:bg-white/5 ${period === p.id ? 'text-duo-blue bg-duo-blue/5' : 'text-slate-500'
                                        }`}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center px-1 shrink-0 mb-4">
                <div className="flex gap-4 text-[9px] font-black">
                    <button
                        onClick={() => setSortBy('recent')}
                        className={`uppercase tracking-tighter transition-colors ${sortBy === 'recent' ? 'text-duo-blue' : 'text-slate-600 hover:text-slate-400'}`}
                    >
                        EN SON ÇALIŞILAN
                    </button>
                    <button
                        onClick={() => setSortBy('questions')}
                        className={`uppercase tracking-tighter transition-colors ${sortBy === 'questions' ? 'text-duo-blue' : 'text-slate-600 hover:text-slate-400'}`}
                    >
                        SORU SAYISI
                    </button>
                </div>
                <span className="text-[8px] font-bold text-slate-700 uppercase tracking-widest">
                    {filteredData.length} KONU
                </span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 min-h-0 space-y-1">
                {filteredData.length > 0 ? (
                    filteredData.map((item, idx) => (
                        <div key={idx} className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/3 transition-all cursor-default animate-fade-up" style={{ animationDelay: `${idx * 50}ms` }}>
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="w-1 h-1 rounded-full bg-duo-orange/40 group-hover:bg-duo-orange transition-all"></div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[11px] font-black text-slate-300 uppercase tracking-tight group-hover:text-white transition-colors truncate">
                                        {item.topic || 'GENEL ÇALIŞMA'}
                                    </span>
                                    <span className="text-[8px] font-bold text-slate-600 uppercase tracking-tight truncate opacity-80">
                                        {item.title}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 ml-4">
                                <span className="text-sm font-black text-duo-blue tracking-tighter group-hover:scale-110 transition-transform">
                                    {item.questions}
                                </span>
                                <span className="text-[7px] font-black text-slate-700 uppercase tracking-widest">SORU</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-30 select-none py-10">
                        <span className="text-4xl mb-4">📊</span>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic leading-relaxed">
                            HENÜZ BİR VERİ<br />KAYDEDİLMEDİ.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatsTable;
