'use client';

import { useState, FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      router.push('/'); // Redirect to home after login
    }
  }

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '5rem',
      }}
    >
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Login</h1>

      <form
        onSubmit={handleLogin}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          width: '300px',
        }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: '0.75rem',
            borderRadius: '0.5rem',
            border: '1px solid #ccc',
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: '0.75rem',
            borderRadius: '0.5rem',
            border: '1px solid #ccc',
          }}
        />

        <button
          type="submit"
          style={{
            padding: '0.75rem',
            borderRadius: '0.5rem',
            background: '#7dd3fc',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Log In
        </button>

        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      </form>
    </main>
  );
}
