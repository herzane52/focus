const LeftSidebar = ({ stats }) => {
    return (
        <aside className="h-full w-full flex flex-col gap-4 animate-fade-up py-4">

            {/* Streak ve Başarı Kartları — Üst tarafta fokus alanı */}
            <div className="flex flex-col gap-4 shrink-0">
                {/* Streak Kartı */}
                <div className="streak-card rounded-2xl p-6 shadow-xl flex items-center gap-5 relative overflow-hidden group border border-white/10 text-white">
                    <div className="text-4xl drop-shadow-2xl z-10 transition-transform group-hover:scale-110 duration-500">🔥</div>
                    <div className="z-10">
                        <div className="text-4xl font-black leading-none tracking-tighter">
                            {stats.streakCount}
                        </div>
                        <div className="text-[9px] font-black uppercase tracking-[0.4em] opacity-80 mt-1">
                            DİSİPLİN (GÜN)
                        </div>
                    </div>
                </div>

                {/* Başarı Oranı Kartı */}
                <div className="success-card rounded-2xl p-6 shadow-xl flex items-center gap-5 relative overflow-hidden group border border-white/10 text-white">
                    <div className="text-4xl drop-shadow-2xl z-10 transition-transform group-hover:scale-110 duration-500">🎯</div>
                    <div className="z-10">
                        <div className="text-4xl font-black leading-none tracking-tighter">
                            %{stats.avgRate}
                        </div>
                        <div className="text-[9px] font-black uppercase tracking-[0.4em] opacity-80 mt-1">
                            BAŞARI ORANI
                        </div>
                    </div>
                </div>
            </div>

            {/* Ajanda — Esnek alan, içeriğe göre uzayacak veya kısalacak */}
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 flex flex-col flex-1 min-h-0 overflow-hidden">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] flex items-center gap-2 mb-6 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-duo-purple shadow-[0_0_10px_rgba(139,92,246,0.5)]"></span>
                    SINAVLAR
                </h4>
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-1">
                    {stats.exams.length > 0 ? (
                        stats.exams.map((e, i) => (
                            <div
                                key={i}
                                className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.03] transition-all cursor-default"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-1 h-1 rounded-full bg-duo-purple/40 group-hover:bg-duo-purple transition-all"></div>
                                    <span className="text-[11px] font-black text-slate-300 uppercase tracking-tight group-hover:text-white transition-colors">
                                        {e.name}
                                    </span>
                                </div>
                                <span className={`text-[10px] font-black tracking-tighter ${e.days > 0 ? "text-slate-500" : "text-red-400"}`}>
                                    {e.days > 0 ? `${e.days} GÜN KALDI` : "BUGÜN"}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-30 select-none">
                            <span className="text-4xl mb-4">📅</span>
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic leading-relaxed">
                                Henüz planlanmış<br />bir sınav yok.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default LeftSidebar;
