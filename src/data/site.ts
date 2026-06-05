export interface HeroStat {
  n: string
  prefix?: string
  suffix?: string
  label: string
}

export interface PillarService {
  name: string
  meta: string
  slug: string
  tag?: string
}

export interface Pillar {
  num: string
  key: string
  title: string
  blurb: string
  services: PillarService[]
}

export interface ProofItem {
  n: string
  label: string
  code: string
}

export interface CaseMetric { n: string; l: string }

export interface HomepageCase {
  tag: string
  title: string
  body: string
  metrics: CaseMetric[]
}

export interface BlogPost {
  tag: string
  title: string
  excerpt: string
  date: string
  read: string
}

export interface AuditMetric {
  label: string
  status: 'good' | 'warn' | 'bad'
  text: string
}

export const AGENTIX = {
  clients: [
    "SkinLogic", "Pawloom", "Island Electrical", "Chai Monkey", "Footsy",
    "Hello2Kids", "Thinkware", "Retrofitter", "Allure", "Selective",
    "Shyloh Rhea", "Niktan", "V-Femme",
  ] as string[],

  heroStats: [
    { n: "3.2", suffix: "x", label: "Average revenue lift across engagements" },
    { n: "285", prefix: "+", suffix: "%", label: "Mean organic traffic growth" },
    { n: "200", suffix: "+", label: "Shopify stores shipped & scaled" },
    { n: "50", prefix: "$", suffix: "M+", label: "Added revenue driven for clients" },
  ] as HeroStat[],

  pillars: [
    {
      num: "01",
      key: "visibility",
      title: "Visibility",
      blurb: "Get found by the people ready to buy. Search, AI answers, paid, and reputation — engineered to compound.",
      services: [
        { name: "SEO Strategy & Implementation", meta: "Search", slug: "seo-strategy-implementation" },
        { name: "On-Page & Technical SEO", meta: "Search", slug: "on-page-technical-seo" },
        { name: "AI-Powered SEO Analytics", meta: "AI", tag: "AI", slug: "ai-powered-seo-analytics" },
        { name: "Local SEO & Google Business", meta: "Local", slug: "local-seo-google-business" },
        { name: "Ecommerce SEO", meta: "Stores", slug: "ecommerce-seo-online-stores" },
        { name: "Content & Link Building", meta: "Authority", slug: "content-marketing-link-building" },
      ],
    },
    {
      num: "02",
      key: "infrastructure",
      title: "Infrastructure",
      blurb: "The store itself — designed, engineered and tuned to convert. From first theme to headless at scale.",
      services: [
        { name: "Custom Store Development", meta: "Build", slug: "custom-shopify-store-development" },
        { name: "Theme Design & Customization", meta: "Build", slug: "theme-design-customization" },
        { name: "Shopify Plus Enterprise", meta: "Enterprise", tag: "PLUS", slug: "shopify-plus-enterprise" },
        { name: "Custom App Development", meta: "Engineering", slug: "custom-shopify-app-development" },
        { name: "Conversion Optimization", meta: "Growth", slug: "conversion-rate-optimization" },
        { name: "Platform Migration", meta: "Ops", slug: "platform-migration-to-shopify" },
      ],
    },
  ] as Pillar[],

  proof: [
    { n: "+250%", label: "Organic traffic growth", code: "/001" },
    { n: "+65%", label: "Conversion rate improvement", code: "/002" },
    { n: "+40%", label: "Faster page load times", code: "/003" },
    { n: "+95", label: "Mobile optimization score", code: "/004" },
    { n: "+180%", label: "SEO ranking improvement", code: "/005" },
    { n: "300+", label: "Projects shipped on time", code: "/006" },
  ] as ProofItem[],

  cases: [
    {
      tag: "Fashion / Apparel",
      title: "Selective — 180% revenue growth in 8 months",
      body: "A mid-size fashion retailer with a slow, dated store that wasn't converting mobile traffic. We rebuilt the customer experience, layered in technical SEO, and tuned product pages for conversion.",
      metrics: [
        { n: "+180%", l: "Revenue" },
        { n: "+220%", l: "Organic traffic" },
        { n: "+145%", l: "Mobile CVR" },
      ],
    },
    {
      tag: "Wholesale / B2B",
      title: "Retrofitters — B2B operations, streamlined on Shopify",
      body: "A wholesale distributor running on spreadsheets and phone orders. We built a custom B2B layer with tiered pricing, bulk ordering and automated inventory — without leaving Shopify.",
      metrics: [
        { n: "300%", l: "Faster order processing" },
        { n: "-85%", l: "Manual tasks" },
        { n: "+150%", l: "Wholesale revenue" },
      ],
    },
  ] as HomepageCase[],

  blog: [
    { tag: "Conversion", title: "Beauty brands dominating Shopify: the conversion tactics that work", excerpt: "The exact PDP, bundling and trust-signal moves the fastest-growing beauty stores use to convert cold traffic.", date: "May 2026", read: "6 min" },
    { tag: "SEO + AI", title: "Shopify SEO in the age of AI: ranking strategies that actually work", excerpt: "How AI answer engines change ecommerce SEO — and the structured-data playbook to get cited, not buried.", date: "Apr 2026", read: "8 min" },
    { tag: "Strategy", title: "Gen Z is killing traditional ecommerce — how Shopify stores must adapt", excerpt: "Social-first discovery, speed and authenticity: what younger buyers expect and how to rebuild for them.", date: "Apr 2026", read: "5 min" },
    { tag: "Performance", title: "Core Web Vitals for Shopify: the 7% rule every store ignores", excerpt: "A one-second delay cuts conversions by 7%. Here's the theme-level speed work that pays for itself.", date: "Mar 2026", read: "7 min" },
    { tag: "Migration", title: "Replatforming to Shopify Plus without losing your rankings", excerpt: "The redirect mapping, data-integrity and monitoring checklist we use to migrate stores with zero SEO loss.", date: "Mar 2026", read: "9 min" },
    { tag: "Retention", title: "Email flows that turn one-time buyers into repeat revenue", excerpt: "The lifecycle automations that quietly compound revenue while you sleep — and how to prioritise them.", date: "Feb 2026", read: "6 min" },
  ] as BlogPost[],

  auditMetrics: [
    { label: "Core Web Vitals (LCP)", status: "warn", text: "2.9s" },
    { label: "Mobile responsiveness", status: "bad", text: "Issues" },
    { label: "Meta titles & descriptions", status: "good", text: "Passing" },
    { label: "Structured data (schema)", status: "bad", text: "Missing" },
    { label: "Indexable pages", status: "good", text: "142 / 148" },
    { label: "Image alt coverage", status: "warn", text: "61%" },
    { label: "HTTPS & security", status: "good", text: "Secure" },
    { label: "Broken links / 404s", status: "warn", text: "7 found" },
  ] as AuditMetric[],

  scanSteps: [
    "Crawling site & rendering pages",
    "Measuring Core Web Vitals",
    "Checking on-page SEO signals",
    "Auditing mobile & accessibility",
    "Scoring against competitors",
  ] as string[],
}
