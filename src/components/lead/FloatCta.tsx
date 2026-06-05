'use client'
import { useState, useEffect } from 'react'
import { Arrow } from '@/components/ui/Arrow'
import { useLeadModal } from './LeadContext'

export function FloatCta() {
  const { openLead } = useLeadModal()
  const [show, setShow] = useState(false)
  const [closed, setClosed] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 900)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (closed) return null
  return (
    <div className={'floatcta' + (show ? ' show' : '')}>
      <span className="fc-text">Ready to grow? <span>Book a free strategy session.</span></span>
      <button className="btn btn-primary" onClick={() => openLead('form')}>Book a call <Arrow s={15} /></button>
      <button className="fc-close" onClick={() => setClosed(true)} aria-label="Dismiss">✕</button>
    </div>
  )
}
