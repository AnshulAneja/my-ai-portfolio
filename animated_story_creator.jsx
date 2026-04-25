import { useState, useEffect, useRef } from "react";

const STORY_THEMES = [
  { id: "adventure", label: "⚔️ Adventure", emoji: "🗡️", color: "#f59e0b" },
  { id: "motivational", label: "💪 Motivational", emoji: "🌟", color: "#10b981" },
  { id: "kids", label: "🧒 Kids", emoji: "🌈", color: "#6366f1" },
  { id: "emotional", label: "💙 Emotional", emoji: "💫", color: "#ec4899" },
  { id: "funny", label: "😄 Funny", emoji: "😂", color: "#f97316" },
];

const CHARACTERS = [
  { id: "girl", emoji: "👧", name: "Priya", color: "#f472b6" },
  { id: "boy", emoji: "👦", name: "Arjun", color: "#60a5fa" },
  { id: "old_woman", emoji: "👵", name: "Dadi", color: "#a78bfa" },
  { id: "superhero", emoji: "🦸‍♀️", name: "Hero", color: "#fbbf24" },
  { id: "animal", emoji: "🦁", name: "Simba", color: "#f59e0b" },
];

const BG_SCENES = {
  adventure: ["🏔️", "🌲", "🏰", "⚡", "🌊"],
  motivational: ["🌅", "🏆", "💡", "🌟", "🎯"],
  kids: ["🌈", "🎪", "🍭", "🦋", "🌸"],
  emotional: ["🌙", "🌧️", "🌅", "💐", "✨"],
  funny: ["🎭", "🎪", "🎨", "🎸", "🎉"],
};

function AnimatedPanel({ panel, index, isVisible }) {
  const [textIndex, setTextIndex] = useState(0);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    const t1 = setTimeout(() => setShowText(true), 300);
    return () => clearTimeout(t1);
  }, [isVisible]);

  useEffect(() => {
    if (!showText || !panel?.dialogue) return;
    if (textIndex < panel.dialogue.length) {
      const t = setTimeout(() => setTextIndex(i => i + 1), 30);
      return () => clearTimeout(t);
    }
  }, [showText, textIndex, panel]);

  if (!panel) return null;

  return (
    <div style={{
      background: `linear-gradient(135deg, ${panel.bgColor}22, ${panel.bgColor}44)`,
      border: `2px solid ${panel.bgColor}66`,
      borderRadius: 16,
      padding: 20,
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
      transition: "all 0.5s ease",
      minHeight: 200,
    }}>
      {/* Scene Background */}
      <div style={{ fontSize: "1.5rem", marginBottom: 8, opacity: 0.6 }}>
        {panel.bgEmojis?.join(" ")}
      </div>

      {/* Characters */}
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 12, fontSize: "3rem" }}>
        {panel.characters?.map((char, i) => (
          <div key={i} style={{
            animation: isVisible ? `bounce${i % 2 === 0 ? "L" : "R"} 1s ease infinite` : "none",
            display: "inline-block",
          }}>
            {char}
          </div>
        ))}
      </div>

      {/* Panel Number */}
      <div style={{
        fontSize: "0.7rem", fontWeight: 700, color: panel.bgColor,
        textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8
      }}>
        Scene {index + 1} — {panel.title}
      </div>

      {/* Dialogue Bubble */}
      <div style={{
        background: "rgba(255,255,255,0.9)",
        borderRadius: 12,
        padding: "12px 16px",
        color: "#1a1a1a",
        fontSize: "0.9rem",
        lineHeight: 1.6,
        fontWeight: 500,
        minHeight: 60,
        position: "relative",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }}>
        <span style={{ fontSize: "1.2rem", marginRight: 6 }}>{panel.speakerEmoji}</span>
        {showText ? panel.dialogue?.slice(0, textIndex) : ""}
        {showText && textIndex < (panel.dialogue?.length || 0) && (
          <span style={{ animation: "blink 0.7s infinite" }}>|</span>
        )}
      </div>

      {/* Emotion */}
      {panel.emotion && (
        <div style={{ marginTop: 8, fontSize: "0.8rem", color: panel.bgColor, fontStyle: "italic" }}>
          {panel.emotion}
        </div>
      )}
    </div>
  );
}

export default function AnimatedStoryTool() {
  const [theme, setTheme] = useState(STORY_THEMES[0]);
  const [character, setCharacter] = useState(CHARACTERS[0]);
  const [idea, setIdea] = useState("");
  const [panels, setPanels] = useState([]);
  const [storyTitle, setStoryTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [visiblePanels, setVisiblePanels] = useState([]);
  const [currentPanel, setCurrentPanel] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  async function generateStory() {
    if (!idea.trim()) return;
    setLoading(true);
    setPanels([]);
    setVisiblePanels([]);
    setCurrentPanel(0);

    const systemPrompt = `You are an animated cartoon story creator. Create a 6-panel cartoon story in Hindi-English mix.

Return ONLY valid JSON in this exact format (no other text):
{
  "title": "Story title here",
  "panels": [
    {
      "title": "Scene name (2-3 words)",
      "dialogue": "What the character says or narration (1-2 sentences, Hindi-English mix, emotional and vivid)",
      "emotion": "😊 Happy / 😢 Sad / 😤 Determined etc",
      "action": "What character is doing"
    }
  ]
}

Make it emotional, fun, and perfect for a ${theme.id} YouTube channel. Exactly 6 panels. Each dialogue should be 1-2 sentences max.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          system: systemPrompt,
          messages: [{ role: "user", content: `Create a ${theme.id} cartoon story about: ${idea}. Main character: ${character.name} (${character.emoji})` }],
        }),
      });

      const data = await response.json();
      const text = data.content?.map(c => c.text || "").join("") || "{}";

      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);

      const bgEmojis = BG_SCENES[theme.id] || BG_SCENES.adventure;
      const themeColors = ["#f59e0b", "#10b981", "#6366f1", "#ec4899", "#f97316", "#60a5fa"];

      const enrichedPanels = parsed.panels.map((p, i) => ({
        ...p,
        characters: i === 0 ? [character.emoji] :
          i === parsed.panels.length - 1 ? [character.emoji, "🌟"] :
          [character.emoji],
        bgEmojis: [bgEmojis[i % bgEmojis.length]],
        bgColor: themeColors[i % themeColors.length],
        speakerEmoji: character.emoji,
      }));

      setStoryTitle(parsed.title || idea);
      setPanels(enrichedPanels);

    } catch (err) {
      setPanels([{
        title: "Error",
        dialogue: "Kuch galat hua. Dobara try karo! 🙏",
        emotion: "😅 Oops",
        characters: ["😅"],
        bgEmojis: ["❌"],
        bgColor: "#ef4444",
        speakerEmoji: "🤖",
      }]);
    }

    setLoading(false);
  }

  // Auto reveal panels one by one
  useEffect(() => {
    if (panels.length === 0) return;
    setVisiblePanels([]);
    let i = 0;
    const interval = setInterval(() => {
      setVisiblePanels(prev => [...prev, i]);
      i++;
      if (i >= panels.length) clearInterval(interval);
    }, 800);
    return () => clearInterval(interval);
  }, [panels]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 50%, #0a0a1a 100%)",
      padding: "32px 16px",
      fontFamily: "'Segoe UI', Arial, sans-serif",
      color: "#e2e8f0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: "3rem", marginBottom: 8 }}>🎨</div>
        <h1 style={{
          fontSize: "2.2rem", fontWeight: 900, margin: 0,
          background: "linear-gradient(90deg, #f472b6, #a78bfa, #60a5fa, #34d399)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>Animated Story Creator</h1>
        <p style={{ color: "#94a3b8", marginTop: 8, fontSize: "0.9rem" }}>
          Apna idea do — cartoon story ban jaayegi! ✨
        </p>
        <span style={{
          display: "inline-block", marginTop: 8,
          background: "rgba(167,139,250,0.15)", border: "1px solid #a78bfa44",
          color: "#a78bfa", fontSize: "0.75rem", padding: "3px 14px",
          borderRadius: 999, fontWeight: 600,
        }}>🎬 YouTube Channel Tool</span>
      </div>

      {/* Controls */}
      <div style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20, padding: 24,
        width: "100%", maxWidth: 750,
        marginBottom: 24,
      }}>

        {/* Theme */}
        <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 10 }}>
          Story Theme
        </label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {STORY_THEMES.map(t => (
            <button key={t.id} onClick={() => setTheme(t)} style={{
              padding: "7px 14px", borderRadius: 10,
              border: `1px solid ${theme.id === t.id ? t.color : "rgba(255,255,255,0.12)"}`,
              background: theme.id === t.id ? `${t.color}22` : "rgba(255,255,255,0.04)",
              color: theme.id === t.id ? t.color : "#94a3b8",
              fontSize: "0.82rem", cursor: "pointer", fontWeight: 600,
            }}>{t.label}</button>
          ))}
        </div>

        {/* Character */}
        <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 10 }}>
          Main Character
        </label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {CHARACTERS.map(c => (
            <button key={c.id} onClick={() => setCharacter(c)} style={{
              padding: "7px 14px", borderRadius: 10,
              border: `1px solid ${character.id === c.id ? c.color : "rgba(255,255,255,0.12)"}`,
              background: character.id === c.id ? `${c.color}22` : "rgba(255,255,255,0.04)",
              color: character.id === c.id ? c.color : "#94a3b8",
              fontSize: "0.82rem", cursor: "pointer", fontWeight: 600,
            }}>{c.emoji} {c.name}</button>
          ))}
        </div>

        {/* Idea */}
        <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>
          Story Idea
        </label>
        <textarea value={idea} onChange={e => setIdea(e.target.value)}
          placeholder="Jaise: Ek ladki jo baar baar fail hoti hai par ek din champion ban jaati hai... 💙"
          rows={3} style={{
            width: "100%", padding: 14,
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12, color: "#e2e8f0",
            fontSize: "0.95rem", resize: "vertical",
            outline: "none", fontFamily: "inherit",
            boxSizing: "border-box", lineHeight: 1.6,
          }} />

        <button onClick={generateStory} disabled={loading || !idea.trim()} style={{
          width: "100%", marginTop: 14, padding: 15,
          border: "none", borderRadius: 12,
          background: loading || !idea.trim()
            ? "rgba(100,100,100,0.3)"
            : "linear-gradient(135deg, #f472b6, #a78bfa, #60a5fa)",
          color: "white", fontSize: "1rem", fontWeight: 800,
          cursor: loading || !idea.trim() ? "not-allowed" : "pointer",
        }}>
          {loading ? "🎨 Story ban rahi hai..." : "✨ Animated Story Banao!"}
        </button>

        {loading && (
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 10, color: "#94a3b8", fontStyle: "italic", justifyContent: "center" }}>
            {[0, 0.2, 0.4].map((delay, i) => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#a78bfa", animation: "bounce 1.2s infinite", animationDelay: `${delay}s` }} />
            ))}
            <span>AI cartoon scenes bana raha hai...</span>
          </div>
        )}
      </div>

      {/* Story Output */}
      {panels.length > 0 && (
        <div style={{ width: "100%", maxWidth: 750 }}>
          {/* Title */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <h2 style={{
              fontSize: "1.6rem", fontWeight: 900,
              background: "linear-gradient(90deg, #f472b6, #a78bfa)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              margin: 0,
            }}>📖 {storyTitle}</h2>
            <p style={{ color: "#64748b", fontSize: "0.8rem", marginTop: 4 }}>
              {character.emoji} {character.name} ki kahani — {theme.label}
            </p>
          </div>

          {/* Panels Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            {panels.map((panel, i) => (
              <AnimatedPanel
                key={i}
                panel={panel}
                index={i}
                isVisible={visiblePanels.includes(i)}
              />
            ))}
          </div>

          {/* Footer */}
          <div style={{
            marginTop: 24, padding: "14px 18px",
            background: "rgba(167,139,250,0.08)",
            border: "1px solid rgba(167,139,250,0.2)",
            borderRadius: 12, fontSize: "0.82rem",
            color: "#c4b5fd", lineHeight: 1.6, textAlign: "center",
          }}>
            <strong style={{ color: "#a78bfa" }}>🎬 Channel tip:</strong> Yeh 6 panels ko screenshot karo → YouTube Shorts mein use karo → Caption mein story likho! 💙
          </div>
        </div>
      )}

      <div style={{ marginTop: 24, fontSize: "0.75rem", color: "#374151", textAlign: "center" }}>
        Banaya tumne · Powered by Claude API · Your Storytelling Tool 💙
      </div>

      <style>{`
        @keyframes bounce { 0%,80%,100%{transform:translateY(0);opacity:.4} 40%{transform:translateY(-6px);opacity:1} }
        @keyframes bounceL { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes bounceR { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  );
}
