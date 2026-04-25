import { useState, useEffect } from "react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const DEFAULT_TASKS = [
  { id: 1, text: "20 min coding practice", category: "study", done: false, priority: "high" },
  { id: 2, text: "Beti ke saath time", category: "family", done: false, priority: "high" },
  { id: 3, text: "1 glass paani subah uthke", category: "health", done: false, priority: "medium" },
  { id: 4, text: "LinkedIn profile check", category: "career", done: false, priority: "medium" },
  { id: 5, text: "5 min meditation", category: "health", done: false, priority: "low" },
];

const CATEGORY_CONFIG = {
  study: { emoji: "📚", color: "#60a5fa", label: "Study" },
  family: { emoji: "💙", color: "#f472b6", label: "Family" },
  health: { emoji: "🌿", color: "#34d399", label: "Health" },
  career: { emoji: "🚀", color: "#a78bfa", label: "Career" },
  personal: { emoji: "⭐", color: "#fbbf24", label: "Personal" },
};

const MORNING_QUOTES = [
  "Har mushkil ke saath aasaani hai. — Quran 94:6 💙",
  "Tu itni baar uth chuki hai — aaj bhi uthegi. 🌸",
  "Beti dekh rahi hai — aaj ka din uske liye. 💙",
  "Sirf 20 minute. Bas shuru karo. 🚀",
  "Confidence karne se aata hai — sochne se nahi. ⭐",
];

export default function LifeOrganizer() {
  const [activeTab, setActiveTab] = useState("morning");
  const [tasks, setTasks] = useState(DEFAULT_TASKS);
  const [newTask, setNewTask] = useState("");
  const [newCategory, setNewCategory] = useState("study");
  const [aiMessage, setAiMessage] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [streak, setStreak] = useState(3);
  const [mood, setMood] = useState(null);
  const [eveningNote, setEveningNote] = useState("");
  const [quote] = useState(MORNING_QUOTES[Math.floor(Math.random() * MORNING_QUOTES.length)]);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Subah Bakhair" : hour < 17 ? "Salaam" : "Shaam Mubarak";
  const dateStr = `${DAYS[now.getDay()]}, ${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
  const completedCount = tasks.filter(t => t.done).length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  async function askAI(prompt) {
    setAiLoading(true);
    setAiMessage("");
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 400,
          system: `You are a warm, motivating life coach for a single mother named who is learning AI/coding and building her career. She has a daughter she loves deeply. She sometimes struggles with confidence and laziness but is determined. 

Speak in Hindi-English mix. Be warm, personal, and encouraging. Keep responses short (3-5 sentences max). Address her directly. Reference her goals: getting an AI job, being a good mom, building a YouTube storytelling channel. Always end with a small actionable tip or motivational line.`,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      const result = data.content?.map(c => c.text || "").join("") || "Kuch hua. Dobara try karo.";
      setAiMessage(result);
    } catch {
      setAiMessage("Connection error. Par yaad rakho — tu kar sakti hai! 💙");
    }
    setAiLoading(false);
  }

  function getMorningBriefing() {
    const pending = tasks.filter(t => !t.done).map(t => t.text).join(", ");
    askAI(`Good morning! Aaj ${dateStr} hai. Mera mood ${mood || "theek"} hai. Aaj ke pending tasks: ${pending}. Mujhe ek motivating morning briefing do aur batao kahan se shuru karun.`);
  }

  function getEveningSummary() {
    const done = tasks.filter(t => t.done).map(t => t.text).join(", ");
    const notDone = tasks.filter(t => !t.done).map(t => t.text).join(", ");
    askAI(`Sham ho gayi. Aaj maine kiya: ${done || "kuch nahi"}. Nahi kar payi: ${notDone || "sab kar liya!"}. Note: ${eveningNote || "kuch nahi"}. Mujhe aaj ka honest review do aur kal ke liye ek tip do.`);
  }

  function toggleTask(id) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }

  function addTask() {
    if (!newTask.trim()) return;
    setTasks(prev => [...prev, {
      id: Date.now(), text: newTask, category: newCategory, done: false, priority: "medium"
    }]);
    setNewTask("");
  }

  function deleteTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id));
  }

  const tabStyle = (tab) => ({
    padding: "10px 18px", borderRadius: 10, border: "none",
    background: activeTab === tab
      ? "linear-gradient(135deg, #6366f1, #a78bfa)"
      : "rgba(255,255,255,0.06)",
    color: activeTab === tab ? "white" : "#94a3b8",
    fontSize: "0.85rem", cursor: "pointer", fontWeight: 600,
    transition: "all 0.2s",
  });

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29, #1a1a4e, #0f0c29)",
      padding: "24px 16px",
      fontFamily: "'Segoe UI', Arial, sans-serif",
      color: "#e2e8f0",
      display: "flex", flexDirection: "column", alignItems: "center",
    }}>

      {/* Header */}
      <div style={{ width: "100%", maxWidth: 720, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{
              fontSize: "1.6rem", fontWeight: 900, margin: 0,
              background: "linear-gradient(90deg, #a78bfa, #60a5fa)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>✨ Meri Zindagi</h1>
            <p style={{ color: "#64748b", fontSize: "0.82rem", margin: "4px 0 0" }}>{dateStr}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#fbbf24" }}>🔥 {streak} din streak</div>
            <div style={{ fontSize: "0.78rem", color: "#64748b" }}>Mat todna!</div>
          </div>
        </div>

        {/* Quote */}
        <div style={{
          marginTop: 14, padding: "12px 16px",
          background: "rgba(167,139,250,0.08)",
          border: "1px solid rgba(167,139,250,0.2)",
          borderRadius: 12, fontSize: "0.85rem",
          color: "#c4b5fd", fontStyle: "italic",
        }}>
          💙 {quote}
        </div>

        {/* Progress */}
        <div style={{ marginTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Aaj ka progress</span>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#a78bfa" }}>{completedCount}/{totalCount} tasks</span>
          </div>
          <div style={{ height: 8, background: "rgba(255,255,255,0.1)", borderRadius: 999 }}>
            <div style={{
              height: "100%", borderRadius: 999,
              background: "linear-gradient(90deg, #6366f1, #a78bfa)",
              width: `${progress}%`, transition: "width 0.5s ease",
            }} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", justifyContent: "center" }}>
        {[
          { id: "morning", label: "🌅 Subah" },
          { id: "tasks", label: "✅ Tasks" },
          { id: "coach", label: "🤖 AI Coach" },
          { id: "evening", label: "🌙 Sham" },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={tabStyle(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ width: "100%", maxWidth: 720 }}>

        {/* MORNING TAB */}
        {activeTab === "morning" && (
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 24 }}>
            <h2 style={{ margin: "0 0 16px", fontSize: "1.2rem", color: "#fbbf24" }}>🌅 {greeting}! Aaj kaisa feel ho raha hai?</h2>

            {/* Mood */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
              {[["😊", "Achha"], ["😐", "Theek"], ["😔", "Thoda down"], ["💪", "Energetic"], ["😴", "Sleepy"]].map(([emoji, label]) => (
                <button key={label} onClick={() => setMood(label)} style={{
                  padding: "8px 14px", borderRadius: 10,
                  border: `1px solid ${mood === label ? "#a78bfa" : "rgba(255,255,255,0.12)"}`,
                  background: mood === label ? "rgba(167,139,250,0.2)" : "rgba(255,255,255,0.04)",
                  color: mood === label ? "#a78bfa" : "#94a3b8",
                  fontSize: "0.85rem", cursor: "pointer",
                }}>
                  {emoji} {label}
                </button>
              ))}
            </div>

            <button onClick={getMorningBriefing} disabled={aiLoading} style={{
              width: "100%", padding: 14, border: "none", borderRadius: 12,
              background: aiLoading ? "rgba(100,100,100,0.3)" : "linear-gradient(135deg, #f59e0b, #f97316)",
              color: "white", fontSize: "0.95rem", fontWeight: 700, cursor: aiLoading ? "not-allowed" : "pointer",
            }}>
              {aiLoading ? "⏳ AI soch raha hai..." : "🌅 Subah ki briefing lo!"}
            </button>

            {aiMessage && (
              <div style={{ marginTop: 16, padding: 18, background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 12, fontSize: "0.9rem", lineHeight: 1.8, color: "#fde68a" }}>
                🤖 {aiMessage}
              </div>
            )}

            {/* Today's priorities */}
            <div style={{ marginTop: 20 }}>
              <h3 style={{ fontSize: "0.9rem", color: "#94a3b8", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Aaj ke Top Tasks</h3>
              {tasks.filter(t => t.priority === "high").map(task => (
                <div key={task.id} onClick={() => toggleTask(task.id)} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 14px", borderRadius: 10, marginBottom: 8,
                  background: task.done ? "rgba(52,211,153,0.1)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${task.done ? "#34d39933" : "rgba(255,255,255,0.08)"}`,
                  cursor: "pointer",
                }}>
                  <span style={{ fontSize: "1.2rem" }}>{task.done ? "✅" : "⭕"}</span>
                  <span style={{ fontSize: "0.9rem", color: task.done ? "#34d399" : "#e2e8f0", textDecoration: task.done ? "line-through" : "none", flex: 1 }}>{task.text}</span>
                  <span style={{ fontSize: "1rem" }}>{CATEGORY_CONFIG[task.category]?.emoji}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TASKS TAB */}
        {activeTab === "tasks" && (
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 24 }}>
            <h2 style={{ margin: "0 0 16px", fontSize: "1.2rem", color: "#60a5fa" }}>✅ Aaj ke Saare Tasks</h2>

            {/* Add Task */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              <input value={newTask} onChange={e => setNewTask(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addTask()}
                placeholder="Naya task likho..."
                style={{
                  flex: 1, minWidth: 200, padding: "10px 14px",
                  background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10, color: "#e2e8f0", fontSize: "0.9rem", outline: "none",
                }} />
              <select value={newCategory} onChange={e => setNewCategory(e.target.value)} style={{
                padding: "10px 12px", background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
                color: "#e2e8f0", fontSize: "0.85rem", outline: "none",
              }}>
                {Object.entries(CATEGORY_CONFIG).map(([key, val]) => (
                  <option key={key} value={key}>{val.emoji} {val.label}</option>
                ))}
              </select>
              <button onClick={addTask} style={{
                padding: "10px 18px", border: "none", borderRadius: 10,
                background: "linear-gradient(135deg, #6366f1, #a78bfa)",
                color: "white", fontWeight: 700, cursor: "pointer",
              }}>+ Add</button>
            </div>

            {/* Category filters */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              {Object.entries(CATEGORY_CONFIG).map(([key, val]) => (
                <span key={key} style={{
                  padding: "4px 10px", borderRadius: 999,
                  background: `${val.color}22`, border: `1px solid ${val.color}44`,
                  color: val.color, fontSize: "0.75rem", fontWeight: 600,
                }}>
                  {val.emoji} {tasks.filter(t => t.category === key).length}
                </span>
              ))}
            </div>

            {/* All Tasks */}
            {tasks.map(task => {
              const cat = CATEGORY_CONFIG[task.category] || CATEGORY_CONFIG.personal;
              return (
                <div key={task.id} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 14px", borderRadius: 12, marginBottom: 8,
                  background: task.done ? "rgba(52,211,153,0.08)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${task.done ? "#34d39933" : `${cat.color}33`}`,
                  transition: "all 0.2s",
                }}>
                  <span onClick={() => toggleTask(task.id)} style={{ fontSize: "1.3rem", cursor: "pointer" }}>
                    {task.done ? "✅" : "⭕"}
                  </span>
                  <span style={{ fontSize: "1rem" }}>{cat.emoji}</span>
                  <span style={{
                    flex: 1, fontSize: "0.9rem",
                    color: task.done ? "#64748b" : "#e2e8f0",
                    textDecoration: task.done ? "line-through" : "none",
                  }}>{task.text}</span>
                  <button onClick={() => deleteTask(task.id)} style={{
                    background: "transparent", border: "none", color: "#475569",
                    cursor: "pointer", fontSize: "1rem", padding: 4,
                  }}>🗑️</button>
                </div>
              );
            })}

            {tasks.filter(t => t.done).length === tasks.length && tasks.length > 0 && (
              <div style={{ textAlign: "center", padding: 20, fontSize: "1.5rem" }}>
                🎉 Sab tasks complete! Aaj ka din kamaal raha! 💙
              </div>
            )}
          </div>
        )}

        {/* AI COACH TAB */}
        {activeTab === "coach" && (
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 24 }}>
            <h2 style={{ margin: "0 0 8px", fontSize: "1.2rem", color: "#a78bfa" }}>🤖 Tumhara AI Coach</h2>
            <p style={{ color: "#64748b", fontSize: "0.82rem", marginBottom: 20 }}>Kuch bhi poochho — career, motivation, koi bhi mushkil</p>

            {/* Quick prompts */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
              {[
                "Aaj motivation nahi aa rahi",
                "Coding mein stuck hoon",
                "Beti ke saath time manage kaise karun",
                "Interview ki taiyari kaise karun",
                "Laziness se kaise ladun",
              ].map(prompt => (
                <button key={prompt} onClick={() => { setUserInput(prompt); }} style={{
                  padding: "6px 12px", borderRadius: 8,
                  border: "1px solid rgba(167,139,250,0.3)",
                  background: "rgba(167,139,250,0.08)",
                  color: "#c4b5fd", fontSize: "0.78rem", cursor: "pointer",
                }}>{prompt}</button>
              ))}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <input value={userInput} onChange={e => setUserInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && userInput.trim() && (askAI(userInput), setUserInput(""))}
                placeholder="Apni baat likho..."
                style={{
                  flex: 1, padding: "12px 16px",
                  background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12, color: "#e2e8f0", fontSize: "0.9rem", outline: "none",
                }} />
              <button onClick={() => { if (userInput.trim()) { askAI(userInput); setUserInput(""); } }}
                disabled={aiLoading || !userInput.trim()} style={{
                  padding: "12px 18px", border: "none", borderRadius: 12,
                  background: aiLoading || !userInput.trim() ? "rgba(100,100,100,0.3)" : "linear-gradient(135deg, #6366f1, #a78bfa)",
                  color: "white", fontWeight: 700, cursor: aiLoading || !userInput.trim() ? "not-allowed" : "pointer",
                }}>Send</button>
            </div>

            {aiLoading && (
              <div style={{ marginTop: 16, display: "flex", gap: 8, alignItems: "center", color: "#94a3b8", fontStyle: "italic" }}>
                {[0, 0.2, 0.4].map((d, i) => (
                  <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#a78bfa", animation: "bounce 1.2s infinite", animationDelay: `${d}s` }} />
                ))}
                <span>Coach soch raha hai...</span>
              </div>
            )}

            {aiMessage && (
              <div style={{ marginTop: 16, padding: 18, background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: 12, fontSize: "0.9rem", lineHeight: 1.8, color: "#e2e8f0" }}>
                <span style={{ color: "#a78bfa", fontWeight: 700 }}>🤖 Coach: </span>{aiMessage}
              </div>
            )}
          </div>
        )}

        {/* EVENING TAB */}
        {activeTab === "evening" && (
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 24 }}>
            <h2 style={{ margin: "0 0 16px", fontSize: "1.2rem", color: "#818cf8" }}>🌙 Sham ka Review</h2>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
              {[
                { label: "Tasks Done", value: `${completedCount}/${totalCount}`, color: "#34d399" },
                { label: "Progress", value: `${progress}%`, color: "#60a5fa" },
                { label: "Streak", value: `${streak} din 🔥`, color: "#fbbf24" },
              ].map(stat => (
                <div key={stat.label} style={{
                  padding: 14, borderRadius: 12, textAlign: "center",
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${stat.color}33`,
                }}>
                  <div style={{ fontSize: "1.3rem", fontWeight: 800, color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: 4 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Evening note */}
            <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: 8 }}>
              Aaj kuch aur hua? Likho yahan...
            </label>
            <textarea value={eveningNote} onChange={e => setEveningNote(e.target.value)}
              placeholder="Aaj kya achha hua... kya mushkil lagi... kal kya karna hai..."
              rows={3} style={{
                width: "100%", padding: 14,
                background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12, color: "#e2e8f0", fontSize: "0.9rem",
                resize: "vertical", outline: "none", fontFamily: "inherit",
                boxSizing: "border-box", lineHeight: 1.6,
              }} />

            <button onClick={getEveningSummary} disabled={aiLoading} style={{
              width: "100%", marginTop: 14, padding: 14, border: "none", borderRadius: 12,
              background: aiLoading ? "rgba(100,100,100,0.3)" : "linear-gradient(135deg, #4f46e5, #7c3aed)",
              color: "white", fontSize: "0.95rem", fontWeight: 700, cursor: aiLoading ? "not-allowed" : "pointer",
            }}>
              {aiLoading ? "⏳ AI review kar raha hai..." : "🌙 Aaj ka Review Lo"}
            </button>

            {aiMessage && (
              <div style={{ marginTop: 16, padding: 18, background: "rgba(79,70,229,0.08)", border: "1px solid rgba(79,70,229,0.3)", borderRadius: 12, fontSize: "0.9rem", lineHeight: 1.8, color: "#e2e8f0" }}>
                <span style={{ color: "#818cf8", fontWeight: 700 }}>🌙 Coach: </span>{aiMessage}
              </div>
            )}

            {/* Reset for tomorrow */}
            <button onClick={() => { setTasks(DEFAULT_TASKS); setMood(null); setEveningNote(""); setStreak(s => s + 1); setActiveTab("morning"); }} style={{
              width: "100%", marginTop: 12, padding: 12, border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12, background: "transparent",
              color: "#64748b", fontSize: "0.85rem", cursor: "pointer",
            }}>
              🌅 Kal ke liye ready karo →
            </button>
          </div>
        )}
      </div>

      <div style={{ marginTop: 24, fontSize: "0.72rem", color: "#374151", textAlign: "center" }}>
        Banaya tumne · Sirf tumhare liye · Beti ke liye 💙
      </div>

      <style>{`
        @keyframes bounce { 0%,80%,100%{transform:translateY(0);opacity:.4} 40%{transform:translateY(-6px);opacity:1} }
      `}</style>
    </div>
  );
}
