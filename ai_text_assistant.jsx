import { useState } from "react";

const MODES = [
  { id: "summarize", label: "📝 Summarize", placeholder: "Paste any long article or paragraph...", system: "You are an expert summarizer. Read the user's text and provide a clear, concise summary in 3-5 sentences. Focus on the main ideas only." },
  { id: "improve", label: "✨ Improve Writing", placeholder: "Paste text you want to make better...", system: "You are a professional editor. Rewrite the user's text to be clearer, more professional, and more engaging. Keep the same meaning but improve flow and word choice. Show the improved version only." },
  { id: "explain", label: "🧠 Explain Simply", placeholder: "Paste something complex or technical...", system: "You are a teacher who makes complex ideas simple. Explain the user's text as if explaining to a curious 12-year-old. Use simple words and a friendly tone." },
  { id: "bullets", label: "• Key Points", placeholder: "Paste any content to extract key takeaways...", system: "You are an expert at extracting key information. Read the user's text and list the 5 most important points as a numbered list. Each point should be one clear sentence." },
  { id: "email", label: "📧 Make an Email", placeholder: "Describe what you want to say...", system: "You are a professional business writer. Transform the user's text into a polished professional email. Include Subject line, greeting, body, and sign-off. Keep it concise and action-oriented." },
];

export default function AITextAssistant() {
  const [mode, setMode] = useState(MODES[0]);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  async function runAI() {
    if (!input.trim()) return;
    setLoading(true);
    setOutput("");
    setError("");

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: mode.system,
          messages: [{ role: "user", content: input }],
        }),
      });

      const data = await response.json();
      const result = data.content?.map((c) => c.text || "").join("") || "No response.";
      setOutput(result);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  }

  function copyOutput() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
      padding: "32px 16px",
      fontFamily: "'Segoe UI', Arial, sans-serif",
      color: "#e2e8f0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h1 style={{
          fontSize: "2rem", fontWeight: 800, margin: 0,
          background: "linear-gradient(90deg, #60a5fa, #a78bfa)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>🤖 AI Text Assistant</h1>
        <p style={{ color: "#94a3b8", marginTop: 6, fontSize: "0.9rem" }}>
          Portfolio Project #1 — Powered by Claude API
        </p>
        <span style={{
          display: "inline-block", marginTop: 8,
          background: "rgba(96,165,250,0.15)", border: "1px solid #60a5fa44",
          color: "#60a5fa", fontSize: "0.75rem", padding: "2px 12px",
          borderRadius: 999, fontWeight: 600,
        }}>✨ Prompt Engineer in Training</span>
      </div>

      {/* Card */}
      <div style={{
        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 16, padding: 28, width: "100%", maxWidth: 720,
        backdropFilter: "blur(10px)",
      }}>
        {/* Mode Tabs */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {MODES.map((m) => (
            <button key={m.id} onClick={() => { setMode(m); setOutput(""); setError(""); }}
              style={{
                padding: "8px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)",
                background: mode.id === m.id
                  ? "linear-gradient(135deg, #3b82f6, #8b5cf6)"
                  : "transparent",
                color: mode.id === m.id ? "white" : "#94a3b8",
                fontSize: "0.82rem", cursor: "pointer", fontWeight: 500,
                transition: "all 0.2s",
              }}>
              {m.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>
          Your Text
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode.placeholder}
          rows={6}
          style={{
            width: "100%", padding: 14,
            background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 10, color: "#e2e8f0", fontSize: "0.95rem",
            resize: "vertical", outline: "none", fontFamily: "inherit",
            boxSizing: "border-box",
          }}
        />

        {/* Button */}
        <button
          onClick={runAI}
          disabled={loading || !input.trim()}
          style={{
            width: "100%", marginTop: 14, padding: 14,
            border: "none", borderRadius: 10,
            background: loading || !input.trim()
              ? "rgba(100,100,100,0.3)"
              : "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            color: "white", fontSize: "1rem", fontWeight: 700,
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            transition: "opacity 0.2s",
          }}>
          {loading ? "✨ Thinking..." : "✨ Run AI"}
        </button>

        {/* Error */}
        {error && (
          <div style={{ marginTop: 16, padding: 14, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, color: "#fca5a5", fontSize: "0.9rem" }}>
            ⚠️ {error}
          </div>
        )}

        {/* Loading dots */}
        {loading && (
          <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 8, color: "#94a3b8", fontStyle: "italic" }}>
            {[0, 0.2, 0.4].map((delay, i) => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: "50%", background: "#60a5fa",
                animation: "bounce 1.2s infinite", animationDelay: `${delay}s`,
              }} />
            ))}
            <span>Claude is working...</span>
          </div>
        )}

        {/* Output */}
        {output && (
          <div style={{ marginTop: 20, padding: 18, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#60a5fa" }}>
                AI Output
              </span>
              <button onClick={copyOutput} style={{
                background: "transparent", border: "1px solid rgba(255,255,255,0.15)",
                color: "#94a3b8", fontSize: "0.75rem", padding: "3px 10px",
                borderRadius: 6, cursor: "pointer",
              }}>
                {copied ? "Copied! ✓" : "Copy"}
              </button>
            </div>
            <div style={{ fontSize: "0.95rem", lineHeight: 1.75, color: "#e2e8f0", whiteSpace: "pre-wrap" }}>
              {output}
            </div>
          </div>
        )}

        {/* Learn tip */}
        <div style={{
          marginTop: 20, padding: "12px 16px",
          background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.2)",
          borderRadius: 10, fontSize: "0.82rem", color: "#93c5fd", lineHeight: 1.6,
        }}>
          <strong style={{ color: "#60a5fa" }}>💡 What's happening:</strong> Jab tum "Run AI" click karti ho — ek <strong>system prompt</strong> + tumhara text Claude API ko bheja jaata hai. System prompt Claude ko batata hai kaise behave karna hai. Yahi prompt engineering hai!
        </div>
      </div>

      <div style={{ marginTop: 20, fontSize: "0.75rem", color: "#475569", textAlign: "center" }}>
        Built by you · Powered by Anthropic Claude · Portfolio Project #1
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
