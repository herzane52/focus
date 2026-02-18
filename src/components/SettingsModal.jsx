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
    const [activeTab, setActiveTab] = useState("curriculum");
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
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-8 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="bg-[#050810] border-2 border-white/10 rounded-[32px] w-full max-w-6xl max-h-[90vh] flex flex-col shadow-4xl animate-in zoom-in-95 duration-300 overflow-hidden relative">
                <header className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-900/40 backdrop-blur-xl shrink-0">
                    <div className="flex gap-8">
                        {["curriculum", "exams", "data"].map((tab) => (
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
                                        : "VERİ YÖNETİMİ"}
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
                                        className="flex gap-3 items-center bg-white/[0.02] p-4 rounded-2xl border border-white/5 group hover:bg-white/[0.04] transition-all"
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
                                    className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl flex gap-6 items-center group hover:bg-white/[0.04] transition-all"
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
                                            type="date"
                                            value={e.date}
                                            onChange={(val) => {
                                                const newExams = [...userData.exams];
                                                newExams[i].date = val.target.value;
                                                const d = { ...userData, exams: newExams };
                                                setUserData(d);
                                                onSave(d);
                                            }}
                                            onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
                                            className="bg-slate-900 border border-white/5 rounded-lg px-3 py-1.5 text-[10px] font-black outline-none focus:border-duo-blue transition-all"
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
                                                date: new Date().toISOString().split("T")[0],
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
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5 space-y-8 group transition-all text-center">
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

                            <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5 space-y-8 group transition-all text-center">
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

                            <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5 space-y-8 group transition-all text-center">
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
