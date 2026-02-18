import StatsTable from "./StatsTable";

const Sidebar = ({ stats, userData }) => {
    return (
        <aside className="w-full flex flex-col h-full animate-fade-up py-4">
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 flex flex-col flex-1 min-h-0 overflow-hidden">
                <StatsTable schedule={userData.schedule} />
            </div>
        </aside>
    );
};

export default Sidebar;
