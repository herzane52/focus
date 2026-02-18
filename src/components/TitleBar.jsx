import { invoke } from "@tauri-apps/api/core";

const TitleBar = ({ onOpenSettings }) => {
    const minimize = () => invoke("minimize_window");
    const maximize = () => invoke("toggle_maximize");
    const close = () => invoke("close_window");

    return (
        <div
            data-tauri-drag-region
            className="h-12 bg-slate-950/80 backdrop-blur-md flex justify-between items-center px-4 select-none shrink-0 border-b border-white/5 z-50"
        >
            {/* Sol: Logo + Başlık — sürükleme alanı */}
            <div
                data-tauri-drag-region
                className="flex items-center gap-3 flex-1 cursor-grab active:cursor-grabbing"
            >
                <div className="relative w-6 h-6 flex items-center justify-center">
                    {/* Premium SVG Logo Concept */}
                    <div className="absolute inset-0 bg-duo-blue/20 rounded-lg blur-sm"></div>
                    <svg viewBox="0 0 24 24" className="w-5 h-5 relative z-10 drop-shadow-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" className="text-duo-blue opacity-30" />
                        <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2.5" className="text-duo-blue" />
                        <circle cx="12" cy="12" r="1.5" fill="currentColor" className="text-white animate-pulse" />
                        <path d="M12 2V5M12 19V22M2 12H5M19 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-duo-blue/60" />
                    </svg>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] pointer-events-none">
                    FOCUS <span className="text-slate-700 mx-1">/</span> <span className="text-slate-600 font-bold opacity-70">PROFESYONEL TAKİP</span>
                </span>
            </div>

            {/* Sağ: Butonlar */}
            <div className="flex gap-1 items-center">
                <button
                    onClick={onOpenSettings}
                    className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center transition-all bg-transparent border-none outline-none group mr-2"
                    title="Ayarlar"
                >
                    <span className="text-lg opacity-40 group-hover:opacity-100 group-hover:rotate-90 transition-all duration-500">⚙️</span>
                </button>

                <div className="flex gap-1 border-l border-white/10 pl-3">
                    <button
                        onClick={minimize}
                        className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center transition-all bg-transparent border-none outline-none"
                        title="Küçült"
                    >
                        <div className="w-2.5 h-0.5 bg-slate-500"></div>
                    </button>

                    <button
                        onClick={maximize}
                        className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center transition-all bg-transparent border-none outline-none"
                        title="Büyüt"
                    >
                        <div className="w-2.5 h-2.5 border-2 border-slate-500 rounded-sm"></div>
                    </button>

                    <button
                        onClick={close}
                        className="w-8 h-8 rounded-lg hover:bg-red-500/20 flex items-center justify-center transition-all group bg-transparent border-none outline-none"
                        title="Kapat"
                    >
                        <div className="relative w-3 h-3">
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-500 group-hover:bg-red-500 rotate-45"></div>
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-500 group-hover:bg-red-500 -rotate-45"></div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TitleBar;
