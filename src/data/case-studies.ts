export interface CaseStudyMetric { n: string; l: string }
export interface CaseStudyApproach { 0: string; 1: string }
export interface CaseStudyQuote { text: string; author: string; role: string }

export interface CaseStudy {
  slug: string
  industry: string
  client: string
  result: string
  desc: string
  tags: string[]
  cats: string[]
  lead: string
  challenge: string
  approach: [string, string][]
  metrics: CaseStudyMetric[]
  quote: CaseStudyQuote
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "skinlogic",
    industry: "Fashion / Apparel",
    client: "SkinLogic",
    result: "+312% organic revenue in 8 months",
    desc: "Custom Shopify Plus build with full SEO architecture. Went from page 4 to position 1 for primary category terms within 6 months of launch.",
    tags: ["Shopify Plus", "SEO"],
    cats: ["Shopify Development", "SEO & Marketing"],
    lead: "A skincare brand with a beautiful product range trapped behind a slow, poorly-structured store that search engines couldn't read — and buyers couldn't navigate.",
    challenge: "SkinLogic was sitting on page 4 for the category terms that mattered most. The store was built on a rigid theme with no SEO architecture, duplicate-content collection pages, and a checkout that leaked mobile sales. Organic was a rounding error in their revenue mix.",
    approach: [
      ["Custom Shopify Plus rebuild", "We rebuilt the store on Shopify Plus with a clean, component-driven theme — fast, flexible and built to scale with the catalogue."],
      ["SEO architecture from day one", "Collection structure, internal linking, schema and crawl paths were designed into the build — not bolted on after launch."],
      ["Content & authority", "We mapped high-intent category and ingredient terms, then built the content and links to own them."],
      ["Conversion tuning", "PDP layout, trust signals and a streamlined mobile checkout to convert the new traffic we were earning."],
    ],
    metrics: [
      { n: "+312%", l: "Organic revenue in 8 months" },
      { n: "#1", l: "For primary category terms" },
      { n: "Page 4 → 1", l: "In 6 months of launch" },
      { n: "+148%", l: "Mobile conversion rate" },
    ],
    quote: { text: "Agentix rebuilt our store and our search presence simultaneously. The organic revenue growth was measurable within 90 days.", author: "Marcus T.", role: "COO, SkinLogic" },
  },
  {
    slug: "pawloom",
    industry: "Home & Living",
    client: "Pawloom",
    result: "+189% conversion rate improvement",
    desc: "Complete store redesign with CRO-led UX overhaul. Identified 7 checkout friction points; eliminated 5 in the first sprint.",
    tags: ["Store Redesign", "CRO"],
    cats: ["Shopify Development", "Ecommerce Growth"],
    lead: "A home & living brand with strong traffic and weak conversion — a store that looked fine but quietly lost buyers at every step toward checkout.",
    challenge: "Pawloom had healthy top-of-funnel traffic but a conversion rate well below benchmark. A heuristic and session-recording audit surfaced 7 distinct friction points between product page and completed order — most of them on mobile.",
    approach: [
      ["CRO-led audit", "Session replays, funnel analytics and a full heuristic review to find exactly where and why buyers dropped off."],
      ["Store redesign", "A rebuilt UX around how customers actually shop — clearer hierarchy, faster PDPs and a frictionless cart."],
      ["Checkout overhaul", "We eliminated 5 of the 7 friction points in the first sprint, starting with the highest-revenue-impact issues."],
      ["Continuous testing", "An ongoing test programme to compound the wins month over month."],
    ],
    metrics: [
      { n: "+189%", l: "Conversion rate improvement" },
      { n: "7 → 2", l: "Checkout friction points" },
      { n: "1 sprint", l: "To eliminate top 5 issues" },
      { n: "+96%", l: "Mobile add-to-cart rate" },
    ],
    quote: { text: "They found money we didn't know we were losing. The redesign paid for itself before the next quarter closed.", author: "Lena P.", role: "Founder, Pawloom" },
  },
  {
    slug: "retrofitters",
    industry: "B2B Distribution",
    client: "Retrofitters",
    result: "300% faster B2B order processing",
    desc: "Custom Shopify B2B wholesale solution replacing a 15-year-old legacy ordering system. Net terms, bulk ordering, ERP sync.",
    tags: ["Shopify B2B", "Custom Dev"],
    cats: ["Shopify Development"],
    lead: "A wholesale distributor running on a 15-year-old ordering system, spreadsheets and phone calls — drowning in manual work as the business grew.",
    challenge: "Retrofitters processed every wholesale order by hand. Net terms, tiered pricing and bulk ordering lived in spreadsheets, and nothing talked to their ERP. The legacy system was a growth ceiling and a daily time sink.",
    approach: [
      ["Custom Shopify B2B build", "We replaced the legacy system with a custom Shopify B2B storefront — without forcing them off the platform they trusted."],
      ["Net terms & tiered pricing", "Account-based pricing, credit terms and customer-specific catalogues, all native to the store."],
      ["Bulk ordering", "Fast reorder, CSV upload and quantity-break ordering built for how wholesale buyers actually work."],
      ["ERP sync", "Two-way integration so inventory, orders and accounts stay accurate without manual re-keying."],
    ],
    metrics: [
      { n: "300%", l: "Faster order processing" },
      { n: "-85%", l: "Manual data entry" },
      { n: "15 hrs", l: "Saved per week" },
      { n: "Month 2", l: "Payback period" },
    ],
    quote: { text: "The B2B ordering system they built saved us 15 hours a week in manual processing. It paid for itself in month two.", author: "Dan R.", role: "Director, Retrofitters" },
  },
  {
    slug: "chai-monkey",
    industry: "Food & Drink",
    client: "Chai Monkey",
    result: "+420% organic traffic in 12 months",
    desc: "Technical SEO overhaul, content strategy and local SEO for a DTC tea brand entering the US market.",
    tags: ["SEO", "Content Marketing"],
    cats: ["SEO & Marketing"],
    lead: "A DTC tea brand with a loyal home market and zero visibility in the US — entering the most competitive search landscape of their category from scratch.",
    challenge: "Chai Monkey was effectively invisible to US buyers. Their store had thin technical foundations, no content engine and no local presence in the market they were trying to win. Paid alone couldn't carry US expansion profitably.",
    approach: [
      ["Technical SEO overhaul", "We fixed crawlability, speed and structured data so US search could properly understand and surface the store."],
      ["Content strategy", "A content engine built around high-intent US search terms — education, comparison and category pages that earn rankings."],
      ["Local SEO", "Google Business and local signals to establish presence and trust in the new market."],
      ["Authority building", "Relevant, high-quality link placements to compound rankings through year one."],
    ],
    metrics: [
      { n: "+420%", l: "Organic traffic in 12 months" },
      { n: "Top 3", l: "For priority US terms" },
      { n: "100%", l: "Profitable US channel" },
      { n: "12 mo", l: "From zero presence" },
    ],
    quote: { text: "We went from invisible to ranking top 3 for our most important terms. The team genuinely understands ecommerce SEO.", author: "Sarah K.", role: "Founder, Chai Monkey" },
  },
  {
    slug: "thinkware",
    industry: "Electronics",
    client: "Thinkware",
    result: "WooCommerce to Shopify in 6 weeks, zero ranking loss",
    desc: "Full platform migration preserving 100% of organic rankings across 3,200 product pages, 12,000+ redirects mapped.",
    tags: ["Migration", "Technical SEO"],
    cats: ["Shopify Development", "SEO & Marketing"],
    lead: "An electronics retailer outgrowing WooCommerce — with 3,200 product pages of hard-won organic rankings that absolutely could not be lost in the move.",
    challenge: "Thinkware needed off WooCommerce, but a botched migration could have wiped out years of SEO equity overnight. With 3,200 product pages and a complex URL structure, the risk was a ranking collapse at the worst possible time.",
    approach: [
      ["Migration mapping", "We mapped 12,000+ redirects 1:1, preserving URL equity across every product, collection and content page."],
      ["Parallel build", "A full Shopify build staged in parallel so the cutover was fast, tested and reversible."],
      ["Technical SEO parity", "Schema, metadata, internal linking and crawl paths matched or improved on the old site before launch."],
      ["Post-launch monitoring", "Rank and crawl monitoring through the transition to catch and fix any drift immediately."],
    ],
    metrics: [
      { n: "0%", l: "Organic ranking loss" },
      { n: "6 weeks", l: "WooCommerce → Shopify" },
      { n: "3,200", l: "Product pages migrated" },
      { n: "12,000+", l: "Redirects mapped 1:1" },
    ],
    quote: { text: "We expected a ranking dip and braced for it. It never came. Six weeks, clean cutover, and we held every position.", author: "James O.", role: "Ecommerce Lead, Thinkware" },
  },
  {
    slug: "v-femme",
    industry: "Apparel",
    client: "V-Femme",
    result: "+95 PageSpeed score, +67% mobile CVR",
    desc: "Performance optimization turning a 28-score Shopify store into a 95-scorer. Mobile conversion rate followed immediately.",
    tags: ["Speed Optimization", "CRO"],
    cats: ["Shopify Development", "Ecommerce Growth"],
    lead: "An apparel store with a 28 PageSpeed score bleeding mobile sales — every extra second of load time quietly costing conversions.",
    challenge: "V-Femme's Shopify store scored 28 on mobile PageSpeed. A heavy theme, unoptimised media and a stack of conversion-killing apps meant slow loads — and on mobile, slow loads mean lost sales.",
    approach: [
      ["Performance audit", "We profiled the theme, scripts and media to find exactly what was dragging load times down."],
      ["Theme-level optimisation", "Lazy loading, image and font optimisation, critical-CSS and a leaner app stack — speed work done at the source."],
      ["Core Web Vitals", "Tuned LCP, CLS and INP to pass Core Web Vitals across the board."],
      ["Conversion follow-through", "With the store fast, mobile conversion rate climbed immediately — no other changes needed."],
    ],
    metrics: [
      { n: "28 → 95", l: "Mobile PageSpeed score" },
      { n: "+67%", l: "Mobile conversion rate" },
      { n: "Pass", l: "Core Web Vitals" },
      { n: "-71%", l: "Largest Contentful Paint" },
    ],
    quote: { text: "Same traffic, same products — just a store that finally loads. Mobile sales jumped the week we shipped it.", author: "Priya N.", role: "Head of Ecommerce, V-Femme" },
  },
]

export function getCaseStudy(slug: string): CaseStudy | null {
  return CASE_STUDIES.find(cs => cs.slug === slug) ?? null
}

export function getAllCaseStudySlugs(): string[] {
  return CASE_STUDIES.map(cs => cs.slug)
}
