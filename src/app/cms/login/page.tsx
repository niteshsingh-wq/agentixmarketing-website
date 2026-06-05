'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { login, isAuthenticated } from '@/components/cms/api'

const STATS = [
  { n: '42', label: 'Active leads in pipeline' },
  { n: '6', label: 'Unread contact submissions' },
  { n: '8', label: 'Blog posts in progress' },
]

export default function CMSLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (isAuthenticated()) router.replace('/cms')
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const data = await login(email, password)
      if (data.token) router.replace('/cms')
      else setError(data.message || 'Invalid email or password')
    } catch {
      setError('Connection error — is the server running?')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      background: '#050506',
      fontFamily: 'var(--f-sans, "Neue Haas", "Helvetica Neue", Arial, sans-serif)',
    }}>

      {/* ── Left panel — brand + stats ── */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'clamp(36px, 5vw, 64px)',
        background: '#0a0a0b',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: '-15%', left: '-10%',
          width: '70%', paddingBottom: '70%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56,182,255,0.14), transparent 65%)',
          filter: 'blur(24px)',
          pointerEvents: 'none',
        }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
          <img src="/agentix-logo.png" alt="Agentix Marketing" style={{ width: 38, height: 38, objectFit: 'contain', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, letterSpacing: '-0.025em', color: '#f4f5f7' }}>Agentix Marketing</div>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(244,245,247,0.4)', marginTop: 1 }}>CMS</div>
          </div>
        </div>

        {/* Main copy */}
        <div style={{ position: 'relative', maxWidth: 420 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: 11.5, fontWeight: 500, letterSpacing: '0.16em',
            textTransform: 'uppercase', color: '#38b6ff',
            marginBottom: 22,
          }}>
            <span style={{ width: 20, height: 1, background: '#38b6ff', display: 'inline-block' }}></span>
            Admin Dashboard
          </div>
          <h1 style={{
            fontSize: 'clamp(32px, 4vw, 50px)',
            fontWeight: 700,
            letterSpacing: '-0.035em',
            lineHeight: 0.97,
            color: '#f4f5f7',
            marginBottom: 22,
          }}>
            Agentix Marketing,<br />
            <span style={{ color: '#38b6ff' }}>fully</span> in view.
          </h1>
          <p style={{
            fontSize: 15.5,
            lineHeight: 1.6,
            color: 'rgba(244,245,247,0.54)',
            maxWidth: '38ch',
          }}>
            Manage leads, publish content and track performance — all from one fast, focused workspace.
          </p>

          {/* Stat strip */}
          <div style={{
            display: 'flex', gap: 0,
            marginTop: 36,
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 14,
            overflow: 'hidden',
            background: '#131417',
          }}>
            {STATS.map((s, i) => (
              <div key={i} style={{
                flex: 1,
                padding: '18px 20px',
                borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              }}>
                <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.035em', color: '#f4f5f7', lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: 12, color: 'rgba(244,245,247,0.45)', marginTop: 6, lineHeight: 1.35 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ fontSize: 12.5, color: 'rgba(244,245,247,0.28)', position: 'relative' }}>
          © 2026 Agentix Marketing · All data confidential
        </div>
      </div>

      {/* ── Right panel — login form ── */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 'clamp(36px, 5vw, 64px)',
        background: '#050506',
      }}>
        <div style={{ width: '100%', maxWidth: 380, opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(12px)', transition: 'opacity 0.5s ease, transform 0.5s ease' }}>

          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <h2 style={{
              fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em',
              color: '#f4f5f7', marginBottom: 10,
            }}>
              Sign in
            </h2>
            <p style={{ fontSize: 14.5, color: 'rgba(244,245,247,0.5)', lineHeight: 1.5 }}>
              Enter your credentials to access the Agentix Marketing CMS.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: 'block', fontSize: 12.5, fontWeight: 500,
                color: 'rgba(244,245,247,0.6)', marginBottom: 8, letterSpacing: '0.01em',
              }}>Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@agentixmarketing.com"
                required
                autoFocus
                style={{
                  width: '100%',
                  background: '#0f1013',
                  border: `1px solid ${error ? 'rgba(255,107,107,0.4)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: 12,
                  padding: '13px 16px',
                  color: '#f4f5f7',
                  fontSize: 15,
                  fontFamily: 'inherit',
                  outline: 'none',
                  transition: 'border-color 0.18s, box-shadow 0.18s',
                }}
                onFocus={e => { e.target.style.borderColor = '#38b6ff'; e.target.style.boxShadow = '0 0 0 3px rgba(56,182,255,0.12)' }}
                onBlur={e => { e.target.style.borderColor = error ? 'rgba(255,107,107,0.4)' : 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontSize: 12.5, fontWeight: 500, color: 'rgba(244,245,247,0.6)', letterSpacing: '0.01em' }}>Password</label>
                <a href="/admin/login" style={{ fontSize: 12, color: 'rgba(56,182,255,0.65)', textDecoration: 'none', transition: 'color 0.16s' }}
                  onMouseOver={e => (e.currentTarget.style.color = '#38b6ff')}
                  onMouseOut={e => (e.currentTarget.style.color = 'rgba(56,182,255,0.65)')}>
                  Use Payload login
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    background: '#0f1013',
                    border: `1px solid ${error ? 'rgba(255,107,107,0.4)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: 12,
                    padding: '13px 46px 13px 16px',
                    color: '#f4f5f7',
                    fontSize: 15,
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'border-color 0.18s, box-shadow 0.18s',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#38b6ff'; e.target.style.boxShadow = '0 0 0 3px rgba(56,182,255,0.12)' }}
                  onBlur={e => { e.target.style.borderColor = error ? 'rgba(255,107,107,0.4)' : 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(244,245,247,0.35)', padding: 4, lineHeight: 0,
                    transition: 'color 0.16s',
                  }}
                  onMouseOver={e => (e.currentTarget.style.color = 'rgba(244,245,247,0.7)')}
                  onMouseOut={e => (e.currentTarget.style.color = 'rgba(244,245,247,0.35)')}
                  tabIndex={-1}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    {showPwd
                      ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
                      : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                    }
                  </svg>
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                fontSize: 13.5, color: '#ff8080',
                background: 'rgba(255,107,107,0.07)',
                padding: '12px 16px', borderRadius: 12,
                border: '1px solid rgba(255,107,107,0.18)',
                marginBottom: 20,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !email || !password}
              style={{
                width: '100%',
                background: loading ? 'rgba(56,182,255,0.6)' : '#38b6ff',
                color: '#04263c',
                border: 'none',
                borderRadius: 12,
                padding: '14px 20px',
                fontSize: 15,
                fontWeight: 600,
                fontFamily: 'inherit',
                cursor: loading || !email || !password ? 'not-allowed' : 'pointer',
                letterSpacing: '-0.01em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                opacity: !email || !password ? 0.5 : 1,
                transition: 'background 0.18s, opacity 0.18s, transform 0.18s',
              }}
              onMouseOver={e => { if (!loading && email && password) e.currentTarget.style.background = '#5cc4ff' }}
              onMouseOut={e => { e.currentTarget.style.background = loading ? 'rgba(56,182,255,0.6)' : '#38b6ff' }}
              onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.99)' }}
              onMouseUp={e => { e.currentTarget.style.transform = 'none' }}
            >
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div style={{
            marginTop: 32, paddingTop: 24,
            borderTop: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', alignItems: 'center', gap: 10,
            fontSize: 12.5, color: 'rgba(244,245,247,0.3)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>
            </svg>
            Secure access — credentials are never stored in plaintext
          </div>
        </div>
      </div>

      {/* Spinner keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          [data-login-grid] { grid-template-columns: 1fr !important; }
          [data-login-left] { display: none !important; }
        }
      `}</style>
    </div>
  )
}
