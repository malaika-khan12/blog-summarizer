'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const aboutRef = useRef<HTMLButtonElement>(null);

  // Colors
  const SKY_300 = '#7dd3fc';
  const SKY_200 = '#bae6fd';
  const SLATE_DARK = '#334155';

  // Close About popup when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (open && aboutRef.current && !aboutRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [open]);

  return (
    <nav
      style={{
        width: '100%',
        background: SKY_300,
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 5px rgba(0,0,0,0.06)',
        position: 'relative',
      }}
    >
      {/* Left side: Home + Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link
          href="/"
          style={{
            borderRadius: '9999px',
            padding: '0.4rem 1rem',
            background: '#ffffff',
            color: SKY_300,
            fontWeight: 600,
            textDecoration: 'none',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          }}
        >
          Home
        </Link>

        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: SLATE_DARK, margin: 0 }}>
          Blog&nbsp;Summarizer
        </h1>
      </div>

      {/* Right side: About + Login */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        {/* About Button */}
        <button
          ref={aboutRef}
          onClick={() => setOpen(v => !v)}
          style={{
            border: 'none',
            borderRadius: '9999px',
            padding: '0.45rem 1.2rem',
            background: SKY_200,
            color: SLATE_DARK,
            fontWeight: 600,
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          About
          {open && (
            <span
              style={{
                position: 'absolute',
                left: '50%',
                top: '100%',
                transform: 'translate(-50%, 0)',
                marginTop: '0.55rem',
                width: '16rem',
                background: '#ffffff',
                color: SLATE_DARK,
                padding: '0.8rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                zIndex: 10,
              }}
            >
              <strong style={{ display: 'block', marginBottom: '0.3rem' }}>
                What’s this?
              </strong>
              Blog Summarizer turns long articles into short, clear insights using AI.
            </span>
          )}
        </button>

        {/* Login Button */}
        <Link
          href="/login"
          style={{
            borderRadius: '9999px',
            padding: '0.45rem 1.2rem',
            background: '#ffffff',
            color: SKY_300,
            fontWeight: 600,
            textDecoration: 'none',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          }}
        >
          Login
        </Link>
      </div>
    </nav>
  );
}
