'use client';

import { useState, useRef, useEffect, CSSProperties } from 'react';
import { supabase } from './lib/supabase';

export default function Page() {
  /* ───────────────────── State ───────────────────── */
  const [mode, setMode] = useState<'url' | 'text'>('url');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [origCount, setOrigCount] = useState(0);
  const [sumCount, setSumCount] = useState(0);
  const summaryRef = useRef<HTMLDivElement | null>(null);

  /* ───────────── Rotating facts (sidebar) ─────────── */
  const facts = [
    '💡 Summaries boost retention by 30%.',
    '⏱️ Average reader saves 6 min per article.',
    '🌎 This app supports 40+ languages.',
    '📊 AI cuts word‑count ~85% on avg.',
    '🔒 Summaries are stored securely in Supabase.',
  ];
  const [factIdx, setFactIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setFactIdx((i) => (i + 1) % facts.length),
      5_000,
    );
    return () => clearInterval(id);
  }, [facts.length]); // ✅ include dependency

  /* ──────────────────── Constants ─────────────────── */
  const BLUE = '#7dd3fc';
  const LIGHT_BLUE = '#e0f2fe';
  const DARK_SKY = '#0c4a6e';
  const DARK_TEXT = '#1e293b';
  const GRAY_BTN = '#1f2937';
  const GRAY_HOVER = '#374151';

  const canRun = inputValue.trim() && !loading;

  const inputBase: CSSProperties = {
    background: '#fff',
    border: `2px solid ${BLUE}`,
    borderRadius: '0.5rem',
    color: DARK_TEXT,
    fontSize: '1rem',
    padding: '0.75rem 1rem',
    outline: 'none',
    transition: 'all 0.25s',
  };

  /* ─────────────────── Handlers ───────────────────── */
  async function summarize() {
    setLoading(true);
    setSummary('');
    setOrigCount(inputValue.trim().split(/\s+/).length);

    try {
      const res = await fetch(
        'https://malaika-khan.app.n8n.cloud/webhook/f1bce2eb-deb8-44bc-984a-8ef963b57645/chat',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatInput: inputValue.trim(),
            action: 'sendMessage',
          }),
        },
      );

      const data = await res.json();
      const text =
        data?.summary ??
        data?.message ??
        (typeof data === 'string' ? data : JSON.stringify(data));

      setSummary(text);
      setSumCount(text.split(/\s+/).length);

      await supabase
        .from('summaries')
        .insert([{ content: inputValue, summary: text }]);
    } catch (err) {
      console.error(err);
      setSummary('❌ Error — please try again.');
    } finally {
      setLoading(false);
      setTimeout(
        () => summaryRef.current?.scrollIntoView({ behavior: 'smooth' }),
        80,
      );
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(summary);
    alert('📋 Copied!');
  }

  /* ───────────────────── JSX ──────────────────────── */
  return (
    <main
      style={{
        minHeight: '100vh',
        background: LIGHT_BLUE,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '5rem',
        gap: '1.5rem',
        position: 'relative',
        paddingBottom: '5rem',
      }}
    >
      {/* Top progress bar */}
      {loading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: 4,
            width: '100%',
            background: BLUE,
            animation: 'progress 1.5s linear forwards',
          }}
        />
      )}

      <h1 style={{ fontSize: '3rem', fontWeight: 800, color: DARK_SKY, margin: 0 }}>
        📝 Blog&nbsp;Summarizer
      </h1>
      <p style={{ color: DARK_TEXT, margin: 0 }}>
        Paste a URL or blog text to generate a summary.
      </p>

      {/* Toggle buttons */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        {(['url', 'text'] as const).map((v) => (
          <button
            key={v}
            onClick={() => {
              setMode(v);
              setInputValue('');
              setSummary('');
              setOrigCount(0);
              setSumCount(0);
            }}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: 9999,
              border: 0,
              fontWeight: 600,
              color: '#fff',
              background: GRAY_BTN,
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = GRAY_HOVER)}
            onMouseLeave={(e) => (e.currentTarget.style.background = GRAY_BTN)}
          >
            {v.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Input */}
      {mode === 'url' ? (
        <input
          placeholder="Enter blog URL…"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{ ...inputBase, width: 'min(90vw,500px)', height: '3rem' }}
        />
      ) : (
        <textarea
          placeholder="Paste blog text…"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{
            ...inputBase,
            width: 'min(90vw,650px)',
            height: '10rem',
            resize: 'vertical',
          }}
        />
      )}

      {/* Summarize button */}
      <button
        disabled={!canRun}
        onClick={summarize}
        style={{
          marginTop: '1rem',
          padding: '0.75rem 2rem',
          borderRadius: '0.5rem',
          border: 0,
          fontWeight: 700,
          fontSize: '1rem',
          background: BLUE,
          color: DARK_SKY,
          opacity: canRun ? 1 : 0.6,
          cursor: canRun ? 'pointer' : 'not-allowed',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        }}
      >
        {loading ? 'Summarizing…' : '✨ Summarize'}
      </button>

      {/* Summary output */}
      {!loading && summary && (
        <div
          ref={summaryRef}
          style={{
            position: 'relative',
            marginTop: '1.5rem',
            background: '#fff',
            border: `1px solid ${BLUE}`,
            borderRadius: '0.5rem',
            padding: '1rem 1.25rem',
            maxWidth: 'min(90vw,650px)',
            color: DARK_TEXT,
            lineHeight: 1.5,
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ fontSize: '0.85rem', marginBottom: '0.6rem', color: DARK_TEXT }}>
            📊 <strong>{origCount}</strong> → <strong>{sumCount}</strong> words
          </div>
          {summary}
          <button
            onClick={copy}
            aria-label="Copy summary"
            style={{
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
              padding: '0.25rem 0.6rem',
              fontSize: '0.75rem',
              border: 0,
              borderRadius: '0.25rem',
              background: GRAY_BTN,
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            📋
          </button>
        </div>
      )}

      {/* Sidebar facts */}
      <aside
        style={{
          position: 'fixed',
          right: 0,
          top: '35%',
          transform: 'translateY(-50%)',
          width: '230px',
          background: BLUE,
          border: `1px solid ${DARK_SKY}`,
          borderRadius: '0.5rem 0 0 0.5rem',
          padding: '0.8rem 1rem',
          fontSize: '0.9rem',
          color: DARK_TEXT,
          boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
        }}
      >
        {facts[factIdx]}
      </aside>

      {/* Footer */}
      <footer
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          background: BLUE,
          color: DARK_SKY,
          textAlign: 'center',
          padding: '0.75rem 1rem',
          fontSize: '0.95rem',
          fontWeight: 600,
          boxShadow: '0 -1px 4px rgba(0,0,0,0.05)',
        }}
      >
        🚀 Powered by AI • Designed by Malaika Khan
      </footer>

      {/* Inline styles */}
      <style>{`
        input::placeholder, textarea::placeholder { color: ${DARK_TEXT}99; }
        @keyframes progress { from {transform:translateX(-100%);} to {transform:translateX(0);} }
        aside { display:none; }
        @media (min-width:640px){ aside { display:block; } }
      `}</style>
    </main>
  );
}
