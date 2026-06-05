import { AGENTIX } from '@/data/site'

export function Marquee() {
  const track = (
    <div className="marquee-track">
      {AGENTIX.clients.map((c, i) => <span className="marquee-logo" key={i}>{c}</span>)}
    </div>
  )
  return (
    <div className="marquee">
      {track}
      {track}
    </div>
  )
}
