import { useState } from "react";

const SettingsModal = ({
    isOpen,
    onClose,
    userData,
    setUserData,
    onSave,
    applyTemplateUntilExam,
    exportData,
    importData,
}) => {
    const [activeTab, setActiveTab] = useState("about");
    const [selectedDayTab, setSelectedDayTab] = useState("1");

    if (!isOpen) return null;

    const days = [
        { id: "1", label: "PZT" },
        { id: "2", label: "SAL" },
        { id: "3", label: "ÇAR" },
        { id: "4", label: "PER" },
        { id: "5", label: "CUM" },
        { id: "6", label: "CMT" },
        { id: "0", label: "PAZ" },
    ];

    return (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-8 animate-in fade-in duration-300">
            <div className="bg-[#050810] border-2 border-white/10 rounded-[32px] w-full max-w-6xl h-[85vh] min-h-[600px] flex flex-col shadow-4xl animate-in zoom-in-95 duration-300 overflow-hidden relative">
                <header className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-900/40 backdrop-blur-xl shrink-0">
                    <div className="flex gap-8">
                        {["curriculum", "exams", "data", "about"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`text-base font-black transition-all tracking-widest ${activeTab === tab
                                    ? "text-duo-blue"
                                    : "text-slate-600 hover:text-slate-400"
                                    }`}
                            >
                                {tab === "curriculum"
                                    ? "MÜFREDAT"
                                    : tab === "exams"
                                        ? "SINAVLAR"
                                        : tab === "data"
                                            ? "VERİ YÖNETİMİ"
                                            : "HAKKINDA"}
                                {activeTab === tab && (
                                    <div className="h-0.5 bg-duo-blue mt-2 rounded-full animate-in slide-in-from-left duration-300"></div>
                                )}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl hover:bg-white/5 transition-all text-2xl font-black active:scale-75 flex items-center justify-center"
                    >
                        ✕
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-slate-950/20">
                    {activeTab === "curriculum" ? (
                        <div className="space-y-8 max-w-4xl mx-auto">
                            <div className="flex gap-2 justify-center bg-slate-900/40 p-2 rounded-2xl border border-white/5 w-fit mx-auto">
                                {days.map((d) => (
                                    <button
                                        key={d.id}
                                        onClick={() => setSelectedDayTab(d.id)}
                                        className={`w-12 h-12 rounded-xl font-black text-[10px] transition-all ${selectedDayTab === d.id
                                            ? "bg-duo-blue text-white shadow-lg shadow-blue-500/20"
                                            : "text-slate-600 hover:bg-white/5 hover:text-slate-300"
                                            }`}
                                    >
                                        {d.label}
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {(userData.templates[selectedDayTab] || []).map((t, i) => (
                                    <div
                                        key={i}
                                        className="flex gap-3 items-center bg-white/2 p-4 rounded-2xl border border-white/5 group hover:bg-white/4 transition-all"
                                    >
                                        <div className="w-1 h-5 bg-duo-blue/30 rounded-full"></div>
                                        <input
                                            value={t.title}
                                            list="subjects-list"
                                            onChange={(e) => {
                                                const newTasks = [...userData.templates[selectedDayTab]];
                                                newTasks[i] = { ...newTasks[i], title: e.target.value };
                                                const d = {
                                                    ...userData,
                                                    templates: {
                                                        ...userData.templates,
                                                        [selectedDayTab]: newTasks,
                                                    },
                                                };
                                                setUserData(d);
                                                onSave(d);
                                            }}
                                            className="flex-1 bg-transparent border-none outline-none font-black text-sm text-white tracking-tight uppercase"
                                            placeholder="Ders İsmi"
                                        />
                                        <button
                                            onClick={() => {
                                                const newTasks = userData.templates[selectedDayTab].filter(
                                                    (_, idx) => idx !== i
                                                );
                                                const d = {
                                                    ...userData,
                                                    templates: {
                                                        ...userData.templates,
                                                        [selectedDayTab]: newTasks,
                                                    },
                                                };
                                                setUserData(d);
                                                onSave(d);
                                            }}
                                            className="opacity-0 group-hover:opacity-100 p-2 text-red-500/40 hover:text-red-500 transition-all font-black text-xs"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}

                                <button
                                    onClick={() => {
                                        const newTasks = [
                                            ...(userData.templates[selectedDayTab] || []),
                                            { title: "Yeni Ders" },
                                        ];
                                        const d = {
                                            ...userData,
                                            templates: {
                                                ...userData.templates,
                                                [selectedDayTab]: newTasks,
                                            },
                                        };
                                        setUserData(d);
                                        onSave(d);
                                    }}
                                    className="w-full py-4 border-2 border-dashed border-white/5 rounded-2xl text-[9px] font-black text-slate-700 hover:text-duo-blue hover:border-duo-blue/30 transition-all tracking-widest uppercase"
                                >
                                    + DERS EKLE
                                </button>
                            </div>

                            {userData.exams.length > 0 && (
                                <div className="pt-8 mt-8 border-t border-white/5 flex flex-wrap gap-3 justify-center">
                                    {userData.exams.map((e, ei) => (
                                        <button
                                            key={ei}
                                            onClick={() => applyTemplateUntilExam(e.date)}
                                            className="px-6 py-3 bg-slate-900/40 border border-white/5 rounded-xl text-[9px] font-black text-slate-500 hover:border-duo-blue/30 hover:text-duo-blue transition-all uppercase tracking-widest"
                                        >
                                            {e.name} Tarihine Kadar Planla
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : activeTab === "exams" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
                            {userData.exams.map((e, i) => (
                                <div
                                    key={i}
                                    className="bg-white/2 border border-white/5 p-6 rounded-2xl flex gap-6 items-center group hover:bg-white/4 transition-all"
                                >
                                    <div className="bg-slate-900 w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                                        📅
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                                            SINAV ADI
                                        </label>
                                        <input
                                            value={e.name}
                                            onChange={(val) => {
                                                const newExams = [...userData.exams];
                                                newExams[i].name = val.target.value;
                                                const d = { ...userData, exams: newExams };
                                                setUserData(d);
                                                onSave(d);
                                            }}
                                            onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
                                            className="w-full bg-transparent border-none outline-none text-base font-black text-white"
                                            placeholder="Sınav İsmi"
                                        />
                                    </div>
                                    <div className="shrink-0">
                                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-1">
                                            TARİH
                                        </label>
                                        <input
                                            type="text"
                                            value={e.date}
                                            onChange={(val) => {
                                                const newExams = [...userData.exams];
                                                newExams[i].date = val.target.value;
                                                const d = { ...userData, exams: newExams };
                                                setUserData(d);
                                                onSave(d);
                                            }}
                                            placeholder="GG.AA.YYYY"
                                            onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
                                            className="bg-slate-900 border border-white/5 rounded-lg px-3 py-1.5 text-[10px] font-black outline-none focus:border-duo-blue transition-all w-24 text-center placeholder:text-slate-700"
                                        />
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (confirm("Silinsin mi?")) {
                                                const d = {
                                                    ...userData,
                                                    exams: userData.exams.filter((_, idx) => idx !== i),
                                                };
                                                setUserData(d);
                                                onSave(d);
                                            }
                                        }}
                                        className="text-red-500/30 hover:text-red-500 transition-all font-bold text-lg"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}

                            <button
                                onClick={() => {
                                    const d = {
                                        ...userData,
                                        exams: [
                                            ...userData.exams,
                                            {
                                                name: "Yeni Sınav",
                                                date: new Date().toLocaleDateString("tr-TR"),
                                            },
                                        ],
                                    };
                                    setUserData(d);
                                    onSave(d);
                                }}
                                className="w-full py-8 border-2 border-dashed border-white/5 rounded-2xl font-black text-slate-700 hover:text-duo-blue hover:border-duo-blue/30 tracking-[0.2em] uppercase text-[9px] transition-all"
                            >
                                + YENİ SINAV EKLE
                            </button>
                        </div>
                    ) : activeTab === "data" ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            <div className="bg-white/2 p-8 rounded-3xl border border-white/5 space-y-8 group transition-all text-center">
                                <div className="w-14 h-14 bg-duo-blue/10 rounded-xl flex items-center justify-center text-3xl mx-auto group-hover:scale-105 transition-all">
                                    💾
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-black text-lg tracking-tight">YEDEK AL</h3>
                                    <p className="text-[10px] text-slate-600 font-bold leading-relaxed uppercase">
                                        Planınızı bir dosya olarak indirin.
                                    </p>
                                </div>
                                <button
                                    onClick={exportData}
                                    className="w-full py-4 bg-duo-blue/10 hover:bg-duo-blue text-duo-blue hover:text-white border border-duo-blue/20 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all active:scale-95"
                                >
                                    DIŞA AKTAR
                                </button>
                            </div>

                            <div className="bg-white/2 p-8 rounded-3xl border border-white/5 space-y-8 group transition-all text-center">
                                <div className="w-14 h-14 bg-duo-green/10 rounded-xl flex items-center justify-center text-3xl mx-auto group-hover:scale-105 transition-all">
                                    📂
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-black text-lg tracking-tight">YEDEK YÜKLE</h3>
                                    <p className="text-[10px] text-slate-600 font-bold leading-relaxed uppercase">
                                        Eski bir yedeği sisteme aktarın.
                                    </p>
                                </div>
                                <button
                                    onClick={importData}
                                    className="w-full py-4 bg-duo-green/10 hover:bg-duo-green text-duo-green hover:text-white border border-duo-green/20 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all active:scale-95"
                                >
                                    İÇE AKTAR
                                </button>
                            </div>

                            <div className="bg-white/2 p-8 rounded-3xl border border-white/5 space-y-8 group transition-all text-center">
                                <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center text-3xl mx-auto group-hover:bg-red-500 group-hover:text-white transition-all group-hover:scale-105">
                                    ⚠️
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-black text-lg tracking-tight text-red-500/80">SIFIRLA</h3>
                                    <p className="text-[10px] text-slate-600 font-bold leading-relaxed uppercase">
                                        TÜM VERİLERİ KALICI OLARAK SİLER.
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        if (confirm("Tüm veriler silinecek! Onaylıyor musunuz?")) {
                                            const d = { schedule: {}, templates: {}, exams: [] };
                                            setUserData(d);
                                            onSave(d);
                                            window.location.reload();
                                        }
                                    }}
                                    className="w-full py-4 bg-red-500/5 text-red-500 border border-red-500/20 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95"
                                >
                                    TEMİZLE
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 gap-10 max-w-lg mx-auto">
                            {/* Logo */}
                            <div className="relative w-24 h-24 flex items-center justify-center">
                                <div className="absolute inset-0 bg-blue-500/20 rounded-3xl blur-2xl"></div>
                                <svg viewBox="0 0 24 24" className="w-20 h-20 relative z-10 drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="9" stroke="#3b82f6" strokeWidth="2.5" opacity="0.3" />
                                    <circle cx="12" cy="12" r="5" stroke="#3b82f6" strokeWidth="2.5" />
                                    <circle cx="12" cy="12" r="1.5" fill="white" />
                                    <path d="M12 2V5M12 19V22M2 12H5M19 12H22" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                                </svg>
                            </div>

                            {/* Başlık & versiyon */}
                            <div className="text-center space-y-2">
                                <h2 className="text-3xl font-black tracking-[0.3em] text-white uppercase">FOCUS</h2>
                                <p className="text-[10px] font-black text-slate-600 tracking-[0.5em] uppercase">Profesyonel Takip</p>
                                <span className="inline-block mt-3 px-4 py-1.5 bg-duo-blue/10 border border-duo-blue/20 rounded-full text-[10px] font-black text-duo-blue tracking-widest uppercase">
                                    v1.3.0
                                </span>
                            </div>

                            {/* Linkler */}
                            <div className="w-full flex gap-6">
                                {/* GitHub */}
                                <a
                                    href="https://github.com/herzane52/focus"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full flex items-center  p-5 transition-all group"
                                >
                                    <div className="w-12 h-12   flex items-center justify-center shrink-0 group-hover:scale-120 transition-transform">
                                        <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                                            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-black text-white">herzane52 / focus</div>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition-colors shrink-0">
                                        <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Zm6.75-3a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V3.81L10.03 8.78a.75.75 0 0 1-1.06-1.06l4.97-4.97h-2.24a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                                    </svg>
                                </a>

                                {/* Website */}
                                <a
                                    href="https://herzane.tr"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full flex items-center  p-5  transition-all group"
                                >
                                    <div className="w-12 h-12  flex items-center justify-center shrink-0 group-hover:scale-120 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-black text-white">www.herzane.tr</div>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition-colors shrink-0">
                                        <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Zm6.75-3a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V3.81L10.03 8.78a.75.75 0 0 1-1.06-1.06l4.97-4.97h-2.24a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            </div>

                            {/* Centered Blue Github Sponsors Button */}
                            <a
                                href="https://github.com/sponsors/herzane52"
                                target="_blank"
                                rel="noreferrer"
                                className="mt-2 flex items-center justify-center gap-3 px-8 py-4 bg-duo-blue/10 hover:bg-duo-blue/20 border border-duo-blue/30 rounded-2xl transition-all group active:scale-95"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-duo-blue group-hover:scale-125 transition-transform">
                                    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                                </svg>
                                <span className="font-black text-[11px] text-duo-blue tracking-[0.2em] uppercase">Bağış Yap</span>
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
