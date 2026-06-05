'use client'
import Image from 'next/image'

/**
 * AdminIcon — renders inside StepNav (.step-nav__home = 18×18px)
 * Must fit exactly within 18×18px, no flex children (step-nav * { display: block })
 */
export function AdminIcon() {
  return (
    <Image
      src="/agentix-logo.png"
      alt="Agentix Marketing"
      width={18}
      height={18}
      style={{ display: 'block', objectFit: 'contain' }}
      priority
    />
  )
}

/**
 * AdminLogo — renders in Payload login page (.login__brand, centered, unconstrained)
 */
export function AdminLogo() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16,
      padding: '8px 0',
    }}>
      <Image
        src="/agentix-logo.png"
        alt="Agentix Marketing"
        width={64}
        height={64}
        style={{ objectFit: 'contain' }}
        priority
      />
      <div style={{
        fontSize: 20,
        fontWeight: 700,
        letterSpacing: '-0.03em',
        color: 'var(--theme-elevation-900, #f4f5f7)',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        textAlign: 'center',
      }}>
        Agentix Marketing
      </div>
    </div>
  )
}
