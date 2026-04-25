import { useState } from "react";

const VIDEO_TYPES = [
  { id: "story", label: "📖 Story Video", prompt: "You are an expert YouTube storytelling script writer. Create a complete, engaging YouTube video script based on the user's topic. Include:\n\nHOOK (first 15 seconds - must grab attention immediately)\nINTRO (30 seconds - introduce the story)\nMAIN STORY (3-4 minutes - detailed narrative with emotions)\nCLIMAX (exciting turning point)\nENDING (satisfying conclusion)\nOUTRO (call to action - like, subscribe, comment)\n\nMake it emotional, vivid, and conversational. Write as if speaking directly to the audience. Use simple Hindi-English mix." },
  { id: "motivational", label: "💪 Motivational", prompt: "You are an expert motivational YouTube script writer like Sandeep Maheshwari. Create a powerful motivational video script. Include:\n\nHOOK (shocking statement or question)\nPROBLEM (relate to audience's pain)\nSTORY (real life example)\nLESSON (key insight)\nACTION STEPS (3 practical tips)\nOUTRO (inspiring close + subscribe CTA)\n\nTone: energetic, passionate, straight from the heart. Hindi-English mix." },
  { id: "shorts", label: "⚡ YouTube Shorts", prompt: "You are a YouTube Shorts script expert. Create a 60-second viral YouTube Shorts script. Structure:\n\nSECOND 0-3: Hook (most important - stop the scroll!)\nSECOND 3-45: Quick story or tip (fast paced)\nSECOND 45-60: Twist or punchline + subscribe\n\nMake it punchy, fast, and impossible to stop watching. Every sentence must earn its place." },
  { id: "educational", label: "🎓 Educational", prompt: "You are an educational YouTube content creator. Create an engaging educational video script. Include:\n\nHOOK (surprising fact or question)\nWHY IT MATTERS (why should viewer care)\nMAIN CONTENT (3 key points, simply explained)\nEXAMPLES (real life examples for each point)\nSUMMARY (quick recap)\nOUTRO (CTA)\n\nTone: friendly teacher, simple language, Hindi-English mix." },
  { id: "thumbnail", label: "🖼️ Thumbnail Ideas", prompt: "You are a YouTube thumbnail and title expert. For the given topic, generate:\n\n5 VIRAL TITLES (clickbait but honest, emotional hooks)\n5 THUMBNAIL IDEAS (describe exactly what should be in the image - colors, text, expression, background)\n5 TAGS for YouTube SEO\n\nMake titles emotional and curiosity-driven. Think like Mr. Beast or Sandeep Maheshwari." },
];

const DURATIONS = ["1-2 min (Short)", "3-5 min (Medium)", "8-10 min (Long)"];
const LANGUAGES = ["Hindi", "English", "Hindi-English Mix"];

export default function YouTubeScriptGenerator() {
  const [type, setType] = useState(VIDEO_TYPES[0]);
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState(DURATIONS[1]);
  const [language, setLanguage] = useState(LANGUAGES[2]);
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generateScript() {
    if (!topic.trim()) return;
    setLoading(true);
    setScript("");

    const fullPrompt = `${type.prompt}\n\nVideo Duration: ${duration}\nLanguage: ${language}\n\nTopic: ${topic}`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          system: fullPrompt,
          messages: [{ role: "user", content: `Create a complete YouTube script for: ${topic}` }],
        }),
      });

      const data = await response.json();
      const result = data.content?.map((c) => c.text || "").join("") || "Script nahi aaya. Dobara try karo.";
      setScript(result);
    } catch (err) {
      setScript("Error aaya. Dobara try karo.");
    }

    setLoading(false);
  }

  function copyScript() {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0f0f 0%, #1a0000 50%, #0f0f0f 100%)",
      padding: "32px 16px",
      fontFamily: "'Segoe UI', Arial, sans-serif",
      color: "#e2e8f0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: "3rem", marginBottom: 8 }}>🎬</div>
        <h1 style={{
          fontSize: "2.2rem", fontWeight: 900, margin: 0,
          background: "linear-gradient(90deg, #ff0000, #ff6b6b, #ffd700)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>YouTube Script Generator</h1>
        <p style={{ color: "#94a3b8", marginTop: 8, fontSize: "0.95rem" }}>
          Topic do — complete video script taiyaar! ✨
        </p>
        <span style={{
          display: "inline-block", marginTop: 10,
          background: "rgba(255,0,0,0.15)", border: "1px solid #ff000044",
          color: "#ff6b6b", fontSize: "0.75rem", padding: "3px 14px",
          borderRadius: 999, fontWeight: 600,
        }}>🎯 Portfolio Project #3</span>
      </div>

      {/* Card */}
      <div style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20, padding: 28,
        width: "100%", maxWidth: 750,
        backdropFilter: "blur(10px)",
      }}>

        {/* Video Type */}
        <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 10 }}>
          Video Type
        </label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {VIDEO_TYPES.map((t) => (
            <button key={t.id} onClick={() => { setType(t); setScript(""); }}
              style={{
                padding: "8px 14px", borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.12)",
                background: type.id === t.id
                  ? "linear-gradient(135deg, #ff0000, #cc0000)"
                  : "rgba(255,255,255,0.05)",
                color: type.id === t.id ? "white" : "#94a3b8",
                fontSize: "0.82rem", cursor: "pointer", fontWeight: 600,
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Duration + Language */}
        <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>
              Duration
            </label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {DURATIONS.map((d) => (
                <button key={d} onClick={() => setDuration(d)}
                  style={{
                    padding: "6px 12px", borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: duration === d ? "rgba(255,0,0,0.2)" : "rgba(255,255,255,0.05)",
                    color: duration === d ? "#ff6b6b" : "#94a3b8",
                    fontSize: "0.78rem", cursor: "pointer", fontWeight: 500,
                  }}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>
              Language
            </label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {LANGUAGES.map((l) => (
                <button key={l} onClick={() => setLanguage(l)}
                  style={{
                    padding: "6px 12px", borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: language === l ? "rgba(255,215,0,0.15)" : "rgba(255,255,255,0.05)",
                    color: language === l ? "#ffd700" : "#94a3b8",
                    fontSize: "0.78rem", cursor: "pointer", fontWeight: 500,
                  }}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Topic Input */}
        <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>
          Video Topic
        </label>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Jaise: Ek maa ki kahani jo haar ke baad bhi nahi hari... ya: 5 cheezein jo successful log roz karte hain..."
          rows={4}
          style={{
            width: "100%", padding: 14,
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12, color: "#e2e8f0",
            fontSize: "0.95rem", resize: "vertical",
            outline: "none", fontFamily: "inherit",
            boxSizing: "border-box", lineHeight: 1.6,
          }}
        />

        {/* Generate Button */}
        <button
          onClick={generateScript}
          disabled={loading || !topic.trim()}
          style={{
            width: "100%", marginTop: 16, padding: 16,
            border: "none", borderRadius: 12,
            background: loading || !topic.trim()
              ? "rgba(100,100,100,0.3)"
              : "linear-gradient(135deg, #ff0000, #cc0000)",
            color: "white", fontSize: "1rem", fontWeight: 800,
            cursor: loading || !topic.trim() ? "not-allowed" : "pointer",
            letterSpacing: "0.02em",
          }}>
          {loading ? "🎬 Script likh raha hoon..." : "🎬 Script Generate Karo!"}
        </button>

        {/* Loading */}
        {loading && (
          <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 10, color: "#94a3b8", fontStyle: "italic", justifyContent: "center" }}>
            {[0, 0.2, 0.4].map((delay, i) => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: "50%", background: "#ff0000",
                animation: "bounce 1.2s infinite", animationDelay: `${delay}s`,
              }} />
            ))}
            <span>AI tumhara script taiyaar kar raha hai...</span>
          </div>
        )}

        {/* Script Output */}
        {script && (
          <div style={{
            marginTop: 24, padding: 24,
            background: "rgba(255,0,0,0.05)",
            border: "1px solid rgba(255,0,0,0.2)",
            borderRadius: 16,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#ff6b6b" }}>
                🎬 Tumhara Script Ready!
              </span>
              <button onClick={copyScript} style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#94a3b8", fontSize: "0.75rem",
                padding: "4px 12px", borderRadius: 8, cursor: "pointer",
              }}>
                {copied ? "Copy ho gaya! ✓" : "Copy karo"}
              </button>
            </div>
            <div style={{
              fontSize: "0.95rem", lineHeight: 2,
              color: "#e2e8f0", whiteSpace: "pre-wrap",
            }}>
              {script}
            </div>
          </div>
        )}

        {/* Tip */}
        <div style={{
          marginTop: 20, padding: "12px 16px",
          background: "rgba(255,215,0,0.06)",
          border: "1px solid rgba(255,215,0,0.15)",
          borderRadius: 10, fontSize: "0.82rem",
          color: "#fbbf24", lineHeight: 1.6,
        }}>
          <strong style={{ color: "#ffd700" }}>💡 Channel tip:</strong> Pehle <strong>Shorts</strong> banao — jaldi growth hoti hai. Phir long videos. Aur <strong>Thumbnail Ideas</strong> tab use karo jab topic decide ho jaye! 🚀
        </div>
      </div>

      <div style={{ marginTop: 20, fontSize: "0.75rem", color: "#475569", textAlign: "center" }}>
        Banaya tumne · Powered by Claude API · Portfolio Project #3
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
