'use client'
import { useState } from 'react'
import { linkify } from '@/lib/linkify'

export function Faq({ items, skip }: { items: [string, string][]; skip?: string }) {
  const [open, setOpen] = useState<number>(0)
  return (
    <div className="faq">
      {items.map(([q, a], i) => (
        <div className={'faq-item' + (open === i ? ' open' : '')} key={i}>
          <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
            {q}<span className="fq-ic"></span>
          </button>
          <div className="faq-a"><p>{linkify(a, skip)}</p></div>
        </div>
      ))}
    </div>
  )
}
