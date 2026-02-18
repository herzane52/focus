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
        const data = await invoke("get_user_data");
        if (data && typeof data === "object") {
          setUserData({
            schedule: data.schedule || {},
            templates: data.templates || {},
            exams: data.exams || [],
          });
        }
      } catch (err) {
        console.error("Veri yükleme hatası:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = (d) => invoke("save_user_data", { data: d }).catch(console.error);

  const onSelectDay = (day) => {
    setSelectedDay(day);
    setIsOverlayOpen(true);
  };

  const updateTask = (index, field, value) => {
    const newSchedule = { ...userData.schedule };
    const dayTasks = [...(newSchedule[selectedDay] || [])];
    if (field === "DELETE") {
      dayTasks.splice(index, 1);
    } else {
      dayTasks[index] = { ...dayTasks[index], [field]: value };
    }
    newSchedule[selectedDay] = dayTasks;
    const newData = { ...userData, schedule: newSchedule };
    setUserData(newData);
    save(newData);
  };

  const addTask = () => {
    const newSchedule = { ...userData.schedule };
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
    const template = userData.templates[normalizedDay] || [];
    if (template.length > 0) {
      const newSchedule = { ...userData.schedule };
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

  const applyTemplateUntilExam = (examDateStr) => {
    const examDate = new Date(examDateStr);
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
      days: Math.ceil((new Date(e.date) - new Date()) / (1000 * 60 * 60 * 24)),
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

  if (loading) {
    return (
      <div className="h-screen bg-[#0d121f] flex flex-col items-center justify-center gap-6 animate-pulse">
        <div className="text-6xl">🎯</div>
        <div className="text-xs font-black tracking-[0.8em] text-slate-700 uppercase">
          FOCUS YÜKLENİYOR...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#020617] rounded-[20px] border border-white/10 shadow-4xl select-none font-sans m-2">
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
