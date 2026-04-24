import { useState, useEffect, useMemo } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

import TitleBar from "./components/TitleBar";
import Calendar from "./components/Calendar";
import DayOverlay from "./components/DayOverlay";
import SettingsModal from "./components/SettingsModal";
import Sidebar from "./components/Sidebar";
import LeftSidebar from "./components/LeftSidebar";
// StatsTable artık Sidebar içinde render ediliyor

function App() {
  const [userData, setUserData] = useState({ schedule: {}, templates: {}, exams: [] });
  const [selectedDay, setSelectedDay] = useState(new Date().toISOString().split("T")[0]);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Veri yükleme
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await invoke("get_user_data");
        console.log("Yüklenen veriler:", data);
        if (data && typeof data === "object") {
          setUserData({
            schedule: data.schedule || {},
            templates: data.templates || {},
            exams: data.exams || [],
          });
        }
      } catch (err) {
        console.error("Veri yükleme hatası:", err);
        alert("Veriler yüklenirken bir hata oluştu. Lütfen uygulamayı yeniden başlatın.");
      } finally {
        setLoading(false);
      }
    })();

    // Maximize durumunu dinle (Pencere boşluklarını ve kenarları dinamik yapmak için)
    let unlistenResize = null;
    (async () => {
      try {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        const appWindow = getCurrentWindow();
        const checkMax = async () => {
          const max = await appWindow.isMaximized();
          setIsMaximized(max);
        };
        await checkMax();
        unlistenResize = await appWindow.onResized(checkMax);
      } catch (err) {
        console.error("Window API error:", err);
      }
    })();
    return () => {
      if (unlistenResize) unlistenResize();
    };
  }, []);

  const save = (d) => {
    // Boş veri koruması: Eğer schedule ve exams ikisi birden boşsa kaydetme (hata olasılığına karşı)
    if (!d || (Object.keys(d.schedule || {}).length === 0 && (d.exams || []).length === 0)) {
      console.warn("Boş veri kaydedilmesi engellendi!");
      return Promise.resolve();
    }
    return invoke("save_user_data", { data: d }).catch(err => {
      console.error("Kaydetme hatası:", err);
      throw err;
    });
  };

  const onSelectDay = (day) => {
    setSelectedDay(day);
    setIsOverlayOpen(true);
  };

  const updateTask = (index, field, value) => {
    const newSchedule = { ...(userData.schedule || {}) };
    const dayTasks = [...(newSchedule[selectedDay] || [])];
    if (field === "DELETE") {
      dayTasks.splice(index, 1);
    } else {
      if (dayTasks[index]) {
        dayTasks[index] = { ...dayTasks[index], [field]: value };
      }
    }
    newSchedule[selectedDay] = dayTasks;
    const newData = { ...userData, schedule: newSchedule };
    setUserData(newData);
    save(newData);
  };

  const addTask = () => {
    const newSchedule = { ...(userData.schedule || {}) };
    const dayTasks = [...(newSchedule[selectedDay] || [])];
    dayTasks.push({ title: "Yeni Ders", topic: "", questions: 0, note: "", completed: false });
    newSchedule[selectedDay] = dayTasks;
    const newData = { ...userData, schedule: newSchedule };
    setUserData(newData);
    save(newData);
  };

  const applyTemplate = () => {
    const dayOfWeek = (new Date(selectedDay).getDay() + 6) % 7 + 1;
    const normalizedDay = dayOfWeek === 7 ? "0" : dayOfWeek.toString();
    const template = (userData.templates || {})[normalizedDay] || [];
    if (template.length > 0) {
      const newSchedule = { ...(userData.schedule || {}) };
      newSchedule[selectedDay] = template.map((t) => ({
        ...t,
        completed: false,
        topic: t.topic || "",
        questions: 0,
        note: "",
      }));
      const newData = { ...userData, schedule: newSchedule };
      setUserData(newData);
      save(newData);
    }
  };

  const parseDateStr = (dStr) => {
    if (!dStr) return new Date(NaN);
    const parts = dStr.split(/[\/\-\.]/);
    if (parts.length === 3) {
      if (parts[0].length === 4) return new Date(parts[0], parts[1] - 1, parts[2]);
      return new Date(parts[2], parts[1] - 1, parts[0]);
    }
    return new Date(dStr);
  };

  const applyTemplateUntilExam = (examDateStr) => {
    const examDate = parseDateStr(examDateStr);
    if (isNaN(examDate.getTime())) {
      alert("Lütfen geçerli bir tarih girin (örn: 25.04.2026)");
      return;
    }
    const todayStr = new Date().toISOString().split("T")[0];
    const newSchedule = { ...userData.schedule };

    // Uygulama bugünden başlayacak
    let current = new Date();

    while (current <= examDate) {
      const dateStr = current.toISOString().split("T")[0];

      // Geçmiş bir gün ise veya bugünden önceyse atla
      if (dateStr < todayStr) {
        current.setDate(current.getDate() + 1);
        continue;
      }

      const dayOfWeek = (current.getDay() + 6) % 7 + 1;
      const normalizedDay = dayOfWeek === 7 ? "0" : dayOfWeek.toString();
      const template = userData.templates[normalizedDay] || [];

      if (template.length > 0) {
        // Sadece gelecek günleri şablonla güncelle
        newSchedule[dateStr] = template.map((t) => ({
          ...t,
          completed: false,
          topic: t.topic || "",
          questions: 0,
          note: "",
        }));
      }

      current.setDate(current.getDate() + 1);
    }

    const newData = { ...userData, schedule: newSchedule };
    setUserData(newData);
    save(newData);
    alert("Bugünden sınava kadar olan plan oluşturuldu! (Geçmiş verileriniz korundu)");
  };

  const stats = useMemo(() => {
    const exams = userData.exams.map((e) => ({
      ...e,
      days: Math.ceil((parseDateStr(e.date) - new Date()) / (1000 * 60 * 60 * 24)),
    }));
    // Ortalama başarı
    const allEntries = Object.values(userData.schedule);
    let totalPossible = 0;
    let totalDone = 0;
    allEntries.forEach((tasks) => {
      totalPossible += tasks.length;
      totalDone += tasks.filter((t) => t.completed).length;
    });
    const avgRate = totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;

    // Streak hesabı
    let streakCount = 0;
    const todayStr = new Date().toISOString().split("T")[0];
    const hasToday = (userData.schedule[todayStr] || []).some((t) => t.completed);
    let checkDate = hasToday
      ? new Date()
      : new Date(new Date().setDate(new Date().getDate() - 1));

    while (true) {
      const dStr = checkDate.toISOString().split("T")[0];
      const tasks = userData.schedule[dStr] || [];
      if (tasks.some((t) => t.completed)) {
        streakCount++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Tüm zamanlardaki toplamlar
    const allTasks = allEntries.flat();
    const allTotalQuestions = allTasks.reduce((acc, t) => acc + (parseInt(t.questions) || 0), 0);
    const allTotalSubjects = new Set(allTasks.map(t => t.title)).size;
    const allTotalTopics = new Set(allTasks.map(t => t.topic).filter(t => t && t.trim() !== "")).size;

    const todayTasks = userData.schedule[new Date().toISOString().split("T")[0]] || [];
    const completedToday = todayTasks.filter((t) => t.completed).length;
    return { exams, avgRate, streakCount, allTotalQuestions, allTotalSubjects, allTotalTopics, totalToday: todayTasks.length, completedToday };
  }, [userData]);

  const allSubjects = useMemo(() => {
    const subjects = new Set();
    Object.values(userData.templates).forEach((dayTemplates) => {
      dayTemplates.forEach((t) => subjects.add(t.title));
    });
    Object.values(userData.schedule).forEach((dayTasks) => {
      dayTasks.forEach((t) => subjects.add(t.title));
    });
    return Array.from(subjects).sort();
  }, [userData]);

  const allTopics = useMemo(() => {
    const topics = new Set();
    Object.values(userData.templates).forEach((dayTemplates) => {
      dayTemplates.forEach((t) => { if (t.topic) topics.add(t.topic) });
    });
    Object.values(userData.schedule).forEach((dayTasks) => {
      dayTasks.forEach((t) => { if (t.topic) topics.add(t.topic) });
    });
    return Array.from(topics).sort();
  }, [userData]);

  const [isMaximized, setIsMaximized] = useState(false);

  if (loading) {
    return (
      <div className="h-screen bg-[#0d121f] flex flex-col items-center justify-center gap-6">
        <div className="relative w-16 h-16 flex items-center justify-center animate-pulse">
          <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl"></div>
          <svg viewBox="0 0 24 24" className="w-14 h-14 relative z-10 drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" stroke="#3b82f6" strokeWidth="2.5" opacity="0.3" />
            <circle cx="12" cy="12" r="5" stroke="#3b82f6" strokeWidth="2.5" />
            <circle cx="12" cy="12" r="1.5" fill="white" />
            <path d="M12 2V5M12 19V22M2 12H5M19 12H22" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          </svg>
        </div>
        <div className="text-xs font-black tracking-[0.8em] text-slate-700 uppercase">
          FOCUS YÜKLENİYOR...
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col overflow-hidden bg-dark-navy shadow-4xl select-none font-sans ${isMaximized ? 'w-screen h-screen rounded-none border-none' : 'absolute inset-2 rounded-2xl border border-white/10'}`}>
      <TitleBar onOpenSettings={() => setIsSettingsOpen(true)} />

      <main className="flex-1 flex flex-col items-center justify-center p-4 xl:p-8 overflow-hidden relative">
        <div className="w-full h-full max-w-[1600px] flex flex-col xl:flex-row gap-6 items-stretch justify-center animate-fade-up">
          {/* Sol Panel */}
          <aside className="xl:w-80 w-full flex flex-col items-stretch justify-center shrink-0">
            <LeftSidebar stats={stats} />
          </aside>

          {/* Ana Takvim Alanı */}
          <section className="flex-1 flex flex-col items-center justify-center min-w-0">
            <Calendar
              schedule={userData.schedule}
              selectedDay={selectedDay}
              onSelectDay={onSelectDay}
            />
          </section>

          {/* Sağ Panel */}
          <aside className="xl:w-96 w-full flex flex-col items-stretch justify-center shrink-0">
            <Sidebar stats={stats} userData={userData} />
          </aside>
        </div>
      </main>


      <DayOverlay
        isOpen={isOverlayOpen}
        onClose={() => setIsOverlayOpen(false)}
        date={selectedDay}
        tasks={userData.schedule[selectedDay] || []}
        onUpdateTask={updateTask}
        onAddTask={addTask}
        onOpenSettings={() => {
          setIsOverlayOpen(false);
          setIsSettingsOpen(true);
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userData={userData}
        setUserData={setUserData}
        onSave={save}
        applyTemplateUntilExam={applyTemplateUntilExam}
        exportData={async () => {
          try {
            const { save } = await import("@tauri-apps/plugin-dialog");
            const { writeTextFile } = await import("@tauri-apps/plugin-fs");

            const filePath = await save({
              filters: [{ name: 'JSON', extensions: ['json'] }],
              defaultPath: `focus_yedek_${new Date().toISOString().split('T')[0]}.json`
            });

            if (filePath) {
              const dataStr = JSON.stringify(userData, null, 2);
              await writeTextFile(filePath, dataStr);
              alert("Dosya başarıyla kaydedildi!");
            }
          } catch (err) {
            console.error("Dışa aktarma hatası:", err);
            alert("Hata: " + err);
          }
        }}
        importData={async () => {
          try {
            const { open } = await import("@tauri-apps/plugin-dialog");
            const { readTextFile } = await import("@tauri-apps/plugin-fs");

            const selected = await open({
              multiple: false,
              filters: [{ name: 'JSON', extensions: ['json'] }]
            });

            if (selected) {
              const content = await readTextFile(selected);
              const parsed = JSON.parse(content);
              if (parsed && typeof parsed === "object") {
                setUserData(parsed);
                await invoke("save_user_data", { data: parsed });
                alert("Veriler başarıyla içeri aktarıldı!");
                window.location.reload();
              }
            }
          } catch (err) {
            console.error("İçe aktarma hatası:", err);
            alert("Hata: " + err);
          }
        }}
      />

      <datalist id="subjects-list">
        {allSubjects.map((s, i) => (
          <option key={i} value={s} />
        ))}
      </datalist>
      <datalist id="topics-list">
        {allTopics.map((s, i) => (
          <option key={i} value={s} />
        ))}
      </datalist>
    </div>
  );
}

export default App;
