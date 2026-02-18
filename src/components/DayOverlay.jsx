const DayOverlay = ({ isOpen, onClose, date, tasks, onUpdateTask, onOpenSettings }) => {
    if (!isOpen) return null;

    const dateTxt = new Date(date).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        weekday: "long",
    });
    const totalQ = tasks.reduce((acc, t) => acc + (parseInt(t.questions) || 0), 0);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div
                className="absolute inset-0 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-500"
                onClick={onClose}
            ></div>
            <div className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[32px] shadow-4xl overflow-hidden animate-fade-up">
                {/* Header */}
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-900/50 backdrop-blur-xl sticky top-0 z-10">
                    <div className="flex flex-col">
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mb-1">
                            {new Date(date).toLocaleDateString("tr-TR", { weekday: "long" }).toUpperCase()}
                        </span>
                        <h2 className="text-3xl font-black text-white tracking-tighter">
                            {new Date(date).toLocaleDateString("tr-TR", { day: "numeric", month: "long" })}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 hover:bg-white/5 rounded-2xl flex items-center justify-center font-black transition-all text-xl"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-5">
                    {tasks.map((t, i) => (
                        <div key={i} className="group bg-white/[0.02] border border-white/5 rounded-[24px] p-6 hover:bg-white/[0.04] transition-all animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                            <div className="flex items-center gap-6">
                                {/* Status Check */}
                                <button
                                    onClick={() => onUpdateTask(i, "completed", !t.completed)}
                                    className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all shrink-0 ${t.completed
                                        ? "bg-duo-green border-duo-green text-slate-900 shadow-lg shadow-green-500/20"
                                        : "border-white/10 hover:border-duo-green/50 text-transparent"
                                        }`}
                                >
                                    <span className="text-xl font-black">✓</span>
                                </button>

                                {/* Title & Topic Area (Focus on Topic) */}
                                <div className="flex-1 min-w-0 space-y-1">
                                    <input
                                        className="w-full bg-transparent border-none outline-none text-xl font-black text-white tracking-tighter placeholder:text-slate-800 uppercase"
                                        placeholder="KONU / DETAY GİRİN"
                                        value={t.topic || ""}
                                        onChange={(e) => onUpdateTask(i, "topic", e.target.value.toUpperCase())}
                                        list="topics-list"
                                    />
                                    <input
                                        className="w-full bg-transparent border-none outline-none text-[10px] font-black text-slate-600 tracking-[0.2em] uppercase"
                                        placeholder="DERS KATEGORİSİ"
                                        value={t.title || ""}
                                        onChange={(e) => onUpdateTask(i, "title", e.target.value.toUpperCase())}
                                        list="subjects-list"
                                    />
                                </div>

                                {/* Question Input */}
                                <label className="w-32 bg-slate-950/60 rounded-xl px-4 flex items-center border border-white/5 cursor-text hover:border-white/10 transition-all shrink-0">
                                    <span className="text-[10px] font-black text-slate-600 pr-3 uppercase tracking-widest whitespace-nowrap">SORU</span>
                                    <input
                                        type="number"
                                        min="0"
                                        className="bg-transparent border-none text-sm font-black text-white focus:outline-none w-full py-3 text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        value={t.questions}
                                        onChange={(e) => {
                                            const val = Math.max(0, parseInt(e.target.value) || 0);
                                            onUpdateTask(i, "questions", val);
                                        }}
                                        onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
                                    />
                                </label>

                                {/* Delete Button */}
                                <button
                                    onClick={() => onUpdateTask(i, "DELETE")}
                                    className="p-3 text-red-500/30 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all font-black text-xs shrink-0"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))}

                    {tasks.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 bg-slate-950/30 rounded-[32px] border-2 border-dashed border-white/5 space-y-6">
                            <span className="text-5xl opacity-20">📅</span>
                            <div className="text-center space-y-2">
                                <h3 className="text-lg font-black text-slate-500 uppercase tracking-widest">Ders Programı Boş</h3>
                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tight leading-relaxed max-w-xs mx-auto">
                                    Bu gün için tanımlanmış bir ders bulunmuyor. Müfredatı düzenlemek ister misiniz?
                                </p>
                            </div>
                            <button
                                onClick={onOpenSettings}
                                className="px-8 py-4 bg-duo-blue hover:bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/20 transition-all active:scale-95"
                            >
                                MÜFREDATI DÜZENLE
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer Info Only */}
                {tasks.length > 0 && (
                    <div className="p-8 border-t border-white/5 bg-slate-900/50 backdrop-blur-xl flex justify-between items-center text-slate-500">
                        <span className="text-[11px] font-black uppercase tracking-[0.3em]">GÜNLÜK HEDEF</span>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl font-black text-white tracking-tighter">{totalQ}</span>
                            <span className="text-[10px] font-black uppercase">SORU</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DayOverlay;
