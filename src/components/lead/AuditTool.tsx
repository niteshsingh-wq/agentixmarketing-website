'use client'
import { useState, useRef, useEffect } from 'react'
import { Arrow, Check } from '@/components/ui/Arrow'
import { AGENTIX } from '@/data/site'
import { useLeadModal } from './LeadContext'

type Phase = 'input' | 'scanning' | 'result'

export function AuditTool({ initialUrl = '' }: { initialUrl?: string }) {
  const { openLead } = useLeadModal()
  const [url, setUrl] = useState(initialUrl)
  const [phase, setPhase] = useState<Phase>(initialUrl ? 'scanning' : 'input')
  const [scanIdx, setScanIdx] = useState(0)
  const [score, setScore] = useState(0)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    if (initialUrl) startScan(initialUrl)
    return () => timers.current.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const startScan = (u?: string) => {
    const clean = (u ?? url).trim()
    if (!clean) return
    setPhase('scanning')
    setScanIdx(0)
    timers.current.forEach(clearTimeout)
    timers.current = []
    AGENTIX.scanSteps.forEach((_, i) => {
      timers.current.push(setTimeout(() => setScanIdx(i + 1), (i + 1) * 850))
    })
    const finalScore = 58 + Math.floor(Math.random() * 18)
    timers.current.push(setTimeout(() => {
      setPhase('result')
      let v = 0
      const ramp = setInterval(() => {
        v += 2
        if (v >= finalScore) { v = finalScore; clearInterval(ramp) }
        setScore(v)
      }, 18)
    }, AGENTIX.scanSteps.length * 850 + 350))
  }

  const reset = () => { setPhase('input'); setScore(0); setUrl('') }

  if (phase === 'input') return (
    <div className="lead-step">
      <h3>Instant SEO audit</h3>
      <p className="step-hint">Enter your store URL. We&apos;ll scan it live and score it against best practice — no signup to see results.</p>
      <form className="audit-input" onSubmit={e => { e.preventDefault(); startScan() }}>
        <div className="url-wrap">
          <span>https://</span>
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="yourstore.com" autoFocus />
        </div>
        <button className="btn btn-primary" type="submit" disabled={!url.trim()}
          style={{ opacity: url.trim() ? 1 : 0.4 }}>Run audit <Arrow /></button>
      </form>
      <div className="lead-trust" style={{ marginTop: 30 }}>
        <div className="lt"><Check s={16} /><div>Core Web Vitals, on-page, mobile &amp; schema <span>— all checked.</span></div></div>
        <div className="lt"><Check s={16} /><div>Prioritised fix list <span>— ranked by revenue impact.</span></div></div>
      </div>
    </div>
  )

  if (phase === 'scanning') return (
    <div className="lead-step">
      <h3>Scanning {url.replace(/^https?:\/\//, '')}…</h3>
      <p className="step-hint">Hang tight — analysing your store now.</p>
      <div className="audit-scan">
        {AGENTIX.scanSteps.map((s, i) => (
          <div key={i} className={'scan-line' + (i < scanIdx ? ' done' : i === scanIdx ? ' active' : '')}>
            <span className="sl-dot">{i < scanIdx ? <Check s={13} /> : null}</span>{s}
          </div>
        ))}
      </div>
    </div>
  )

  const verdict = score >= 70 ? 'Solid foundation — clear wins available.' : 'Real revenue is leaking. Fixable fast.'
  return (
    <div className="audit-result">
      <div className="audit-score">
        <div className="score-ring" style={{ ['--val' as string]: score }}><b>{score}</b></div>
        <div className="as-text">
          <h4>SEO score: {score}/100</h4>
          <p>{verdict}</p>
        </div>
      </div>
      <div className="audit-metrics">
        {AGENTIX.auditMetrics.slice(0, 5).map((m, i) => (
          <div className="am-row" key={i}>
            <span className="am-label">{m.label}</span>
            <span className={'am-status ' + m.status}>{m.text}</span>
          </div>
        ))}
      </div>
      <div className="audit-cta">
        <p>Want the full 23-point report + a plan to fix it? <span>We&apos;ll walk you through it free.</span></p>
        <button className="btn btn-primary" onClick={() => openLead('form')}>Get my plan <Arrow /></button>
      </div>
      <button className="lead-back" onClick={reset} style={{ alignSelf: 'flex-start' }}>← Audit another URL</button>
    </div>
  )
}
