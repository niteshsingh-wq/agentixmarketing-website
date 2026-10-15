import Link from 'next/link'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { getPayload } from 'payload'
import config from '@payload-config'
import { CASE_STUDIES } from '@/data/case-studies'
import { handlePayloadReadError, staticFallbackEnabled } from '@/lib/content'

async function fetchShowcaseCases() {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'case-studies',
      limit: 6,
      select: { slug: true, client: true, industry: true, result: true, desc: true },
    })
    if (docs.length > 0 || !staticFallbackEnabled()) return docs.map((d: any) => ({
      slug: d.slug,
      name: d.client,
      industry: d.industry || '',
      result: d.result || '',
      blurb: d.desc || '',
    }))
  } catch (e) {
    handlePayloadReadError('homepage case studies', e)
  }
  return CASE_STUDIES.slice(0, 6).map(cs => ({
    slug: cs.slug,
    name: cs.client,
    industry: cs.industry,
    result: cs.result,
    blurb: cs.desc,
  }))
}

export async function ClientShowcase() {
  const cases = await fetchShowcaseCases()
  return (
    <section className="section theme-light">
      <div className="wrap">
        <RevealWrapper style={{ maxWidth: 720 } as React.CSSProperties}>
          <span className="eyebrow">Clients we&apos;re proud of</span>
          <h2 className="h2" style={{ marginTop: 18 }}>Partnerships that value quality, innovation and results.</h2>
        </RevealWrapper>

        <div className="showcase-grid">
          {cases.map((cs, i) => (
            <RevealWrapper key={i}>
              <Link href={`/case-studies/${cs.slug}`} className="showcase-card">
                <div className="showcase-logo">{cs.name}</div>
                {cs.result && <div className="showcase-result">{cs.result}</div>}
                <p>{cs.blurb}</p>
              </Link>
            </RevealWrapper>
          ))}
        </div>
      </div>
    </section>
  )
}
