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
                <header className="p-8 border-b border-white/5 flex justify-center items-center bg-slate-900/40 backdrop-blur-xl shrink-0 relative">
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
                                    ? "PLAN"
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
                        className="absolute right-8 w-10 h-10 rounded-xl hover:bg-white/5 transition-all text-2xl font-black active:scale-75 flex items-center justify-center"
                    >
                        ✕
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-slate-950/20">
                    {activeTab === "curriculum" ? (
                        <div className="space-y-12 max-w-5xl mx-auto pb-10">
                            <div className="flex flex-col items-center gap-6">
                                <div className="flex gap-2 justify-center bg-slate-900/60 p-2 rounded-2xl border border-white/5 w-fit shadow-2xl">
                                    {days.map((d) => (
                                        <button
                                            key={d.id}
                                            onClick={() => setSelectedDayTab(d.id)}
                                            className={`w-14 h-14 rounded-xl font-black text-[11px] transition-all duration-300 ${selectedDayTab === d.id
                                                ? "bg-duo-blue text-white shadow-xl shadow-blue-500/30 scale-105"
                                                : "text-slate-600 hover:bg-white/5 hover:text-slate-300"
                                                }`}
                                        >
                                            {d.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {(userData.templates[selectedDayTab] || []).map((t, i) => (
                                    <div
                                        key={i}
                                        className="flex gap-4 items-center bg-white/2 p-5 rounded-2xl border border-white/5 group hover:bg-white/4 transition-all shadow-sm"
                                    >
                                        <div className="w-1.5 h-6 bg-duo-blue/40 rounded-full"></div>
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
                                    className="w-full h-full min-h-[64px] border-2 border-dashed border-white/5 rounded-2xl text-[10px] font-black text-slate-700 hover:text-duo-blue hover:border-duo-blue/30 transition-all tracking-widest uppercase bg-white/1 hover:bg-white/2"
                                >
                                    + YENİ DERS EKLE
                                </button>
                            </div>

                            {userData.exams.length > 0 && (
                                <div className="pt-10 mt-10 border-t border-white/5">
                                    <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em] mb-6 text-center">SINAVDAN ÖNCEKİ GÜNLERE GÖRE PLANLA</h3>
                                    <div className="flex flex-wrap gap-4 justify-center">
                                        {userData.exams.map((e, ei) => (
                                            <button
                                                key={ei}
                                                onClick={() => applyTemplateUntilExam(e.date)}
                                                className="px-8 py-4 bg-slate-900/40 border border-white/5 rounded-2xl text-[10px] font-black text-slate-500 hover:border-duo-blue/40 hover:text-duo-blue hover:bg-duo-blue/5 transition-all uppercase tracking-widest active:scale-95 shadow-lg"
                                            >
                                                {e.name} TARIHINE KADAR PLANLA
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : activeTab === "exams" ? (
                        <div className="space-y-10 max-w-5xl mx-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {userData.exams.map((e, i) => (
                                    <div
                                        key={i}
                                        className="bg-white/2 border border-white/5 p-6 rounded-[28px] flex gap-6 items-center group hover:bg-white/4 transition-all shadow-sm"
                                    >
                                        <div className="bg-slate-900 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform shadow-inner border border-white/5">
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
                                        <div className="shrink-0 text-center">
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
                                                className="bg-slate-900 border border-white/5 rounded-xl px-4 py-2 text-[10px] font-black outline-none focus:border-duo-blue transition-all w-28 text-center placeholder:text-slate-800"
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
                                            className="p-3 text-red-500/20 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all font-bold text-lg"
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
                                    className="w-full h-full min-h-[100px] border-2 border-dashed border-white/5 rounded-[28px] font-black text-slate-700 hover:text-duo-blue hover:border-duo-blue/30 tracking-[0.2em] uppercase text-[10px] transition-all flex items-center justify-center bg-white/1 hover:bg-white/2"
                                >
                                    + YENİ SINAV EKLE
                                </button>
                            </div>
                        </div>
                    ) : activeTab === "data" ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            <div className="bg-white/2 p-8 rounded-3xl border border-white/5 space-y-8 group text-center">
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

                            <div className="bg-white/2 p-8 rounded-3xl border border-white/5 space-y-8 group text-center">
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

                            <div className="bg-white/2 p-8 rounded-3xl border border-white/5 space-y-8 group text-center">
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
                        <div className="flex flex-col items-center justify-center py-10 gap-4 max-w-lg mx-auto text-center">
                            {/* Logo Section */}
                            <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                                <div className="absolute inset-0 bg-blue-500/20 rounded-[40px] blur-3xl group-hover:bg-blue-500/30 transition-all duration-500"></div>
                                <svg viewBox="0 0 24 24" className="w-28 h-28 relative z-10 drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="9" stroke="#3b82f6" strokeWidth="2.5" opacity="0.3" />
                                    <circle cx="12" cy="12" r="5" stroke="#3b82f6" strokeWidth="2.5" />
                                    <circle cx="12" cy="12" r="1.5" fill="white" />
                                    <path d="M12 2V5M12 19V22M2 12H5M19 12H22" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                                </svg>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <h2 className="text-4xl font-black tracking-[0.3em] text-white uppercase">FOCUS</h2>
                                    <p className="text-[10px] font-black text-slate-600 tracking-[0.5em] uppercase">Profesyonel Takip</p>
                                </div>
                                <div className="flex gap-3 justify-center">
                                    <span className="px-4 py-1.5 bg-duo-blue/10 border border-duo-blue/20 rounded-full text-[10px] font-black text-duo-blue tracking-widest uppercase">
                                        v1.3.5
                                    </span>
                                </div>
                            </div>

                            {/* Feedback Section */}
                            <div className="w-full space-y-4 pt-4 border-t border-white/5">
                                <p className="text-[12px] font-medium text-white leading-relaxed uppercase tracking-tight">
                                    Uygulama ile ilgili herhangi bir hata, sorun veya öneriniz olması durumunda
                                    aşağıdaki kanallar üzerinden bana ulaşarak geri bildirimde bulunabilirsiniz.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <a
                                    href="https://github.com/herzane52/focus"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex-1 flex items-center gap-4 bg-white/2 hover:bg-white/5 border border-white/5 p-5 rounded-3xl transition-all group"
                                >
                                    <div className="w-10 h-10 pr-5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                                            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 text-left pr-5">
                                        <div className="text-sm font-black text-white">GitHub</div>
                                    </div>
                                </a>

                                <a
                                    href="https://herzane.tr"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex-1 flex items-center gap-4 bg-white/2 hover:bg-white/5 border border-white/5 p-5 rounded-3xl transition-all group"
                                >
                                    <div className="w-10 h-10  flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 text-left">
                                        <div className="text-sm font-black text-white">www.herzane.tr</div>
                                    </div>
                                </a>
                            </div>

                            {/* Donation Section */}
                            <div className="w-full space-y-6">
                                <div className="space-y-3 bg-slate-900/40 p-8 rounded-[32px] border border-white/5 shadow-inner">

                                    <a
                                        href="https://github.com/sponsors/herzane52"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-center gap-4 bg-duo-blue hover:bg-blue-600 text-white p-6 rounded-[32px] transition-all shadow-2xl shadow-blue-500/20 active:scale-[0.98] group relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 group-hover:scale-125 transition-transform duration-500">
                                            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                                        </svg>
                                        <div className="flex flex-col items-start">
                                            <span className="text-xs font-black tracking-widest uppercase">Destek Ol</span>
                                        </div>
                                    </a>
                                    <p className="text-[13px] font-medium text-slate-400 leading-relaxed uppercase tracking-tight">
                                        Gelişim sürecine katkıda bulunmak, sunucu maliyetlerimi desteklemek veya
                                        sadece bir kahve ısmarlamak isterseniz bağış yapabilirsiniz.
                                        Desteğiniz, projelerimi daha ileriye taşımam için bir motivasyon kaynağı olacaktır. 💖
                                    </p>
                                </div>
                            </div>

                            {/* MIT License Footer */}
                            <div className="w-full pt-6 border-t border-white/5">
                                <div className="p-5">
                                    <p className="text-[12px] font-medium text-slate-500 leading-relaxed uppercase tracking-tighter">
                                        Copyright (c) 2026 herzane. <br />
                                        MIT LİSANSI İLE KORUNMAKTADIR.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
