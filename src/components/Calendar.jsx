import { useState, useMemo } from "react";

const Calendar = ({ schedule, selectedDay, onSelectDay }) => {
    const [currentMonth, setCurrentMonth] = useState(
        new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    );

    const daysInMonth = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const date = new Date(year, month, 1);
        const days = [];
        const firstDayIndex = (date.getDay() + 6) % 7;
        const prevMonthLastDate = new Date(year, month, 0).getDate();
        
        const prevDate = new Date(year, month - 1, 1);
        const prevFirstDayIndex = (prevDate.getDay() + 6) % 7;
        
        for (let i = firstDayIndex; i > 0; i--) {
            const dayNum = prevMonthLastDate - i + 1;
            const slotIndexInPrevMonth = prevFirstDayIndex + dayNum - 1;
            const wasPushed = slotIndexInPrevMonth >= 35;
            
            let pYear = year;
            let pMonth = month - 1;
            if (pMonth < 0) {
                pMonth = 11;
                pYear = year - 1;
            }
            
            days.push({ 
                day: dayNum, 
                month: pMonth, 
                year: pYear, 
                inactive: !wasPushed,
                isPushed: wasPushed 
            });
        }
        
        const lastDate = new Date(year, month + 1, 0).getDate();
        for (let i = 1; i <= lastDate; i++) {
            days.push({ day: i, month, year, inactive: false, isPushed: false });
        }
        
        return days.slice(0, 35);
    }, [currentMonth]);

    const monthName = currentMonth.toLocaleDateString("tr-TR", {
        month: "long",
        year: "numeric",
    });

    return (
        <div className="w-full max-w-4xl bg-slate-900/40 backdrop-blur-xl rounded-2xl p-6 sm:p-10 border border-white/10 shadow-3xl relative animate-fade-up flex flex-col items-stretch">
            <div className="flex justify-between items-center mb-10 px-4">
                <h3 className="text-3xl font-black text-white capitalize tracking-tighter">
                    {monthName}
                </h3>
                <div className="flex gap-1.5 bg-slate-950/60 p-1.5 rounded-xl border border-white/10">
                    <button
                        onClick={() =>
                            setCurrentMonth(
                                new Date(currentMonth.setMonth(currentMonth.getMonth() - 1))
                            )
                        }
                        className="w-11 h-11 hover:bg-white/10 rounded-lg flex items-center justify-center font-black transition-all text-xl"
                    >
                        ‹
                    </button>
                    <button
                        onClick={() =>
                            setCurrentMonth(
                                new Date(currentMonth.setMonth(currentMonth.getMonth() + 1))
                            )
                        }
                        className="w-11 h-11 hover:bg-white/10 rounded-lg flex items-center justify-center font-black transition-all text-xl"
                    >
                        ›
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 sm:gap-3 flex-1 items-stretch">
                {["PZT", "SAL", "ÇAR", "PER", "CUM", "CMT", "PAZ"].map((h) => (
                    <div
                        key={h}
                        className="text-[10px] font-black text-slate-600 text-center tracking-[0.3em] mb-4 uppercase"
                    >
                        {h}
                    </div>
                ))}

                {daysInMonth.map((d, i) => {
                    const dateStr = `${d.year}-${String(d.month + 1).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;
                    const dayTasks = schedule[dateStr] || [];
                    const active = dateStr === selectedDay;
                    const today = new Date().toISOString().split("T")[0];
                    const isToday = dateStr === today; // Keep original isToday logic
                    const isFuture = dateStr > today;
                    const totalQ = dayTasks.reduce(
                        (acc, t) => acc + (parseInt(t.questions) || 0),
                        0
                    );
                    const completedCount = dayTasks.filter((t) => t.completed).length;

                    return (
                        <div
                            key={i}
                            onClick={() => !d.inactive && onSelectDay(dateStr)}
                            className={`
                relative h-20 sm:h-24 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 group
                ${d.inactive ? "opacity-5 pointer-events-none" : "hover:bg-white/10 hover:z-60"}
                ${isToday ? "bg-duo-blue text-white z-10" : ""}
                ${active ? "border-2 border-duo-blue z-20" : ""}
                ${!isToday && !isFuture && dayTasks.length > 0 ? (completedCount === dayTasks.length ? "bg-duo-green/10" : "bg-duo-orange/10") : ""}
                ${!isToday && isFuture && dayTasks.length > 0 ? "bg-white/2" : ""}
              `}
                        >
                            <span className={`text-xl font-black tracking-tighter ${isToday ? "text-white" : "text-slate-200"}`}>{d.day}</span>

                            {d.isPushed && (
                                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-duo-blue/60 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                            )}

                            {dayTasks.length > 0 && !isToday && (
                                <div
                                    className={`absolute bottom-4 w-2 h-2 rounded-full ${isFuture
                                        ? "bg-slate-700"
                                        : (completedCount === dayTasks.length ? "bg-duo-green" : "bg-duo-orange")
                                        }`}
                                ></div>
                            )}

                            {/* Hover Tooltip — Native App Style */}
                            {dayTasks.length > 0 && !d.inactive && (() => {
                                const verticalClass = i < 14 ? "top-full mt-6" : "bottom-full mb-6";
                                let horizontalClass = "left-1/2 -translate-x-1/2";
                                if (i % 7 < 2) horizontalClass = "left-0 translate-x-0";
                                else if (i % 7 > 4) horizontalClass = "right-0 translate-x-0 left-auto";

                                return (
                                    <div className={`absolute ${verticalClass} ${horizontalClass} w-64 p-5 bg-slate-900/95 backdrop-blur-2xl border border-white/15 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-100 shadow-4xl translate-y-2 group-hover:translate-y-0`}>
                                        <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">GÜNLÜK ÖZET</span>
                                            <span className="text-[10px] font-black text-duo-blue">{completedCount}/{dayTasks.length}</span>
                                        </div>
                                        <div className="space-y-3">
                                            {dayTasks.slice(0, 5).map((t, ti) => (
                                                <div key={ti} className="flex flex-col gap-0.5 border-l-2 border-duo-blue/30 pl-3">
                                                    <div
                                                        className={`text-[11px] font-black truncate leading-tight uppercase ${t.completed
                                                            ? "text-duo-green/60 line-through"
                                                            : "text-white"
                                                            }`}
                                                    >
                                                        {t.topic || "GENEL ÇALIŞMA"}
                                                    </div>
                                                    <div className="text-[9px] font-bold text-slate-500 truncate tracking-tighter uppercase">
                                                        {t.title}
                                                    </div>
                                                </div>
                                            ))}
                                            {dayTasks.length > 5 && (
                                                <div className="text-[9px] text-slate-600 font-bold italic pt-1 pl-3">
                                                    + {dayTasks.length - 5} ders daha
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-5 pt-4 border-t border-white/10 flex justify-between items-center">
                                            <span className="text-[10px] font-black text-duo-orange uppercase">TOPLAM SORU</span>
                                            <span className="text-lg font-black text-white tracking-tighter">
                                                {totalQ}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Calendar;
