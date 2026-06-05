import type { Service } from '@/data/services'
import { SERVICE_CATEGORIES } from '@/data/services'

export interface ServiceExtras {
  intro: {
    heading: string
    sub: string
    points: string[]
    cardQ: [string, string, string]
  }
  expert: {
    heading: string
    desc: string
    insights: [string, string][]
    result: { n: string; l: string }
  }
  successStats: [string, string, string][]
}

export function getServiceExtras(s: Service): ServiceExtras {
  const isViz = s.category === 'Digital Marketing'
  const nl = s.title.toLowerCase()

  const intro = {
    heading: isViz
      ? 'Get found by the buyers already searching for what you sell.'
      : 'A store engineered to convert — not just to look good.',
    sub: isViz
      ? `If you're an ambitious ecommerce brand, ${s.title} should be doing real commercial work — not chasing vanity metrics. Here's what we help you achieve:`
      : `If you're an ambitious ecommerce brand, ${nl} should compound revenue at every visit. Here's what we help you achieve:`,
    points: isViz
      ? ['Rank for the high-intent terms that actually drive sales.', 'Grow qualified organic traffic month over month.', 'Turn rankings into revenue, not just impressions.']
      : ['Lift conversion rate across mobile and desktop.', 'Cut friction from browse to checkout.', 'Build on a fast, scalable foundation that grows with you.'],
    cardQ: isViz
      ? ['We combine ', 'keyword research, technical optimization, content and authority', ' into one commercially-driven strategy — informed by years of building ecommerce stores.'] as [string, string, string]
      : ['We combine ', 'conversion-first design, clean development and performance', ' into stores that are a pleasure to use and built to scale.'] as [string, string, string],
  }

  const expert = {
    heading: isViz ? 'Ecommerce & SEO experts, not generalists.' : 'Ecommerce builders who obsess over conversion.',
    desc: isViz
      ? `We're an accredited partner that works exclusively with ecommerce brands. Our ${nl} approach is informed by our foundations in building Shopify stores — we combine keyword research, technical optimization, on-page content, authority building and relentless data analysis to deliver commercially-driven results. We study your competitors, find the gaps they're missing, and use best-in-class tooling to formulate a powerful, defensible strategy.`
      : `We're a partner that lives and breathes ecommerce. Our ${nl} work is grounded in conversion psychology and clean engineering — we design around how your customers actually shop, build on a scalable foundation, and tune relentlessly so the experience never costs you a sale.`,
    insights: isViz
      ? [
          ['Strategy before tactics.', 'We map the commercial opportunity first — which terms, which pages, which buyers — so every hour of work ladders up to revenue, not a checklist.'],
          ['Built on technical foundations.', 'Crawlability, speed and structured data done right, so search engines and AI assistants can actually understand and surface your store.'],
          ['Compounding, defensible growth.', 'Authority, content and internal linking that build a moat — results that hold through algorithm changes and competitor pushes.'],
        ] as [string, string][]
      : [
          ['Designed around the buyer.', 'Every flow starts from how your customers actually shop and decide — not from a template or a trend.'],
          ['Engineered to last.', 'Clean, scalable code and performance budgets so the store stays fast and maintainable as you grow.'],
          ['Measured, then improved.', 'We instrument everything and iterate — conversion is a process, not a one-time launch.'],
        ] as [string, string][],
    result: isViz
      ? { n: '+285%', l: 'average organic traffic growth' }
      : { n: '+65%', l: 'average conversion rate lift' },
  }

  const successStats: [string, string, string][] = isViz
    ? [['+180%', 'Ranking improvement', '/001'], ['+285%', 'Organic traffic', '/002'], ['3.2x', 'Revenue impact', '/003'], ['+65%', 'Conversion lift', '/004'], ['200+', 'Stores helped', '/005'], ['$50M+', 'Revenue driven', '/006']]
    : [['+145%', 'Mobile conversion', '/001'], ['+40%', 'Faster page loads', '/002'], ['200+', 'Stores shipped', '/003'], ['+95', 'Core Web Vitals', '/004'], ['4–6 wk', 'Typical build', '/005'], ['$50M+', 'Revenue driven', '/006']]

  return { intro, expert, successStats }
}

export function getRelatedServices(slug: string, category: string) {
  const cat = SERVICE_CATEGORIES[category]
  if (!cat) return []
  return cat.services
    .filter(([s]) => s !== slug)
    .slice(0, 3)
    .map(([s, n]) => ({ slug: s, name: n, category }))
}
