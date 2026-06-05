export interface ServiceTab {
  id: string
  label: string
  items: [string, string, string][]
}

export interface ServiceGroup {
  group: string
  tabs: ServiceTab[]
}

export interface Testimonial {
  quote: string
  author: string
  role: string
  company: string
  rating: number
  result: string
}

export const AGENTIX_CONTENT = {
  intro: {
    eyebrow: "Who we are",
    heading: "We guide brands through every stage of their ecommerce journey.",
    body: "Agentix is a results-driven Shopify & SEO partner. We combine expert Shopify development with strategic search optimization — building high-converting stores, scaling organic traffic, handling seamless Shopify Plus migrations, and engineering search dominance. Every engagement is a custom digital strategy designed to fuel growth and secure long-term market leadership, not a templated checklist.",
    points: [
      "Build high-converting Shopify & Shopify Plus stores from the ground up.",
      "Scale qualified organic traffic with technical, on-page and AI-era SEO.",
      "Turn more of that traffic into revenue with data-driven CRO.",
    ],
    stat: { n: "10+", l: "years building & ranking ecommerce brands" },
  },

  servicesDetail: [
    {
      group: "Shopify & Ecommerce",
      tabs: [
        {
          id: "design-dev",
          label: "Design & Development",
          items: [
            ["Custom Shopify Store Development", "Shopify Agency", "We craft complete ecommerce experiences that drive real results — from visual design to UX and robust backend functionality. Certified developers build custom stores from the ground up around your goals. No cookie-cutter templates."],
            ["Ongoing Support & Store Growth", "Monthly Support", "Your store's personal health coach — always monitoring, optimizing and on call. Proactive monthly support covers performance, security, speed and strategic consultation, preventing problems before they cost you revenue."],
            ["Professional Store Design", "Shopify Web Design", "Your store's design is your brand's first impression. We pair artistic vision with conversion psychology to create experiences that look incredible and guide customers toward purchase."],
            ["Global Market Expansion", "International Agency", "Ready to go global? We handle multi-currency, localized payments, international shipping, tax compliance and cultural adaptation so your launch feels seamless to customers worldwide."],
          ] as [string, string, string][],
        },
        {
          id: "migration",
          label: "Migration & Enterprise",
          items: [
            ["Platform Migration & Replatforming", "Migration Agency", "Switching platforms doesn't have to be overwhelming. We've moved hundreds of stores with zero downtime — preserving SEO rankings, maintaining data integrity, and training your team along the way."],
            ["Shopify Plus Enterprise Solutions", "Shopify Plus Agency", "When you reach enterprise scale you need solutions that handle complexity without compromising performance. We implement sophisticated ecosystems for high-volume transactions and advanced business rules that scale infinitely."],
            ["B2B & Wholesale Solutions", "B2B Development", "Wholesale portals, tiered pricing, bulk ordering and approval workflows — sophisticated B2B systems that keep Shopify's user-friendly experience while handling complex relationships."],
          ] as [string, string, string][],
        },
        {
          id: "cro",
          label: "Conversion (CRO)",
          items: [
            ["Ecommerce Conversion Optimization", "CRO Agency", "Every visitor is potential revenue. We combine advanced analytics, behaviour tracking, A/B testing and conversion psychology to turn more traffic into paying customers — every change backed by data."],
            ["Performance Analytics & Insights", "Analytics Partner", "Data is everywhere, insights are rare. We transform complex data into clear, prioritized strategies that directly impact your bottom line — not overwhelming charts."],
            ["Comprehensive Store Audits", "Store Audit Services", "A forensic health check of technical performance, UX, conversion, SEO and security — with actionable solutions and an implementation roadmap prioritized by impact."],
          ] as [string, string, string][],
        },
        {
          id: "advanced",
          label: "Advanced Development",
          items: [
            ["Custom Shopify App Development", "App Developers", "Private apps and custom integrations that solve real business challenges and deliver measurable value with seamless workflow integration."],
            ["Shopify Theme Customization", "Theme Development", "Custom themes and modifications that align perfectly with your vision while maximizing performance. Every element serves a purpose."],
            ["Shopify Automation Setup", "Workflow Automation", "Intelligent systems that eliminate repetitive manual work and errors — from order processing to customer communication, running quietly in the background."],
            ["Speed & Checkout Optimization", "Performance", "A one-second delay cuts conversions by 7%. We optimize images, code, caching and checkout flows to make your store lightning-fast and frictionless."],
          ] as [string, string, string][],
        },
      ],
    },
    {
      group: "Search Engine Optimization",
      tabs: [
        {
          id: "technical",
          label: "Technical SEO",
          items: [
            ["Website SEO Audit & Analysis", "SEO Audit Agency", "A forensic analysis of your site's performance — identifying technical issues, content gaps and opportunities competitors miss, with a prioritized roadmap that drives measurable ranking gains."],
            ["Technical SEO Implementation", "Technical SEO", "We optimize site architecture, sitemaps, robots.txt, canonicals and server configuration. Clean code and correct technical foundations are the bedrock of ranking success."],
            ["Site Speed & Core Web Vitals", "Speed Optimization", "Page speed directly impacts rankings and conversions. We tackle Core Web Vitals, image compression, code minification and caching — every second saved is revenue earned."],
            ["Schema & Structured Data", "Structured Data SEO", "Product, review, FAQ and event schema that wins rich snippets, lifts click-through, and gets your store cited by AI answer engines."],
          ] as [string, string, string][],
        },
        {
          id: "on-page",
          label: "Content & On-Page",
          items: [
            ["Keyword Research & Strategy", "Keyword Research", "Competitor analysis, search volume and intent mapping to find high-value opportunities — then content strategies that capture traffic and convert."],
            ["On-Page SEO Optimization", "On-Page Services", "Title tags, meta descriptions, headers, internal linking and content structure — every page tuned to target the right keywords while delivering genuine value."],
            ["Content SEO Strategy", "Content Marketing", "Topic clusters and optimized content that ranks and engages — answering searcher questions completely and building topical authority."],
          ] as [string, string, string][],
        },
        {
          id: "link",
          label: "Link Building & DA",
          items: [
            ["Authority Link Building", "Off-Page SEO", "White-hat, editorially-earned backlinks from relevant, high-authority sites that move domain authority and rankings — never spam."],
            ["Digital PR & Guest Posting", "Guest Posting", "Strategic placements and digital PR that put your brand in front of new audiences while strengthening your link profile."],
            ["Local SEO & Reputation", "Local SEO / ORM", "Google Business optimization, local citations and reputation management that win the map pack and the trust that converts."],
          ] as [string, string, string][],
        },
        {
          id: "ai-seo",
          label: "AI SEO",
          items: [
            ["AEO / GEO Optimization", "AI Answers", "Optimize to be the answer AI assistants and generative search cite — structured content, entities and authority built for the post-search era."],
            ["AI Content Optimization", "AI SEO", "Machine-learning analysis that identifies optimization opportunities and predicts ranking potential, adapting content strategy to algorithm changes."],
            ["Predictive SEO Analytics", "AI Analytics", "Forecast search trends, algorithm shifts and competitor moves before they hit your rankings — turning data into a strategic advantage."],
          ] as [string, string, string][],
        },
      ],
    },
  ] as ServiceGroup[],

  capabilities: [
    ["Shopify", "Complete ecommerce experiences — from visual design to UX and robust backend. We build custom stores from the ground up around your goals, designed to grow with your business."],
    ["SEO", "Forensic analysis of every aspect of your site's performance. We identify technical issues, content gaps and opportunities competitors miss, with a roadmap that drives measurable rankings."],
    ["CRO", "Advanced analytics, behaviour tracking, A/B testing and conversion psychology — turning more of your existing traffic into paying customers. We don't guess; we prove."],
    ["Email & Retention", "Lifecycle flows, segmentation and campaigns that turn one-time buyers into repeat customers — automated revenue that compounds while you sleep."],
    ["Headless & Plus", "App-grade storefronts on Hydrogen and Shopify Plus for brands that have outgrown the limits of a theme — sub-second speed and limitless customization."],
  ] as [string, string][],

  excellence: {
    heading: "Delivering excellence in every digital solution.",
    body: "We don't just deliver services — we deliver results that matter. From custom Shopify development to comprehensive SEO strategies, our team blends cutting-edge technique with time-tested strategy to build solutions that exceed expectations.",
    columns: [
      ["Shopify Design & Development", ["Custom Shopify Store Development", "Theme Design & Customization", "Shopify Plus Enterprise Solutions", "Store Redesign & Optimization", "Platform Migration to Shopify", "B2B & Wholesale Solutions"]],
      ["Advanced Development & Automation", ["Custom Shopify App Development", "API & Third-Party Integrations", "Multi-Channel Integration", "Advanced Checkout Customization", "Performance & Speed Optimization"]],
      ["Digital Marketing", ["SEO Strategy & Implementation", "On-Page & Technical SEO", "Local SEO & Google Business", "AI-Powered SEO Analytics", "Ecommerce SEO for Online Stores", "Content Marketing & Link Building"]],
      ["Growth Services", ["Monthly Shopify Maintenance", "Monthly SEO Monitoring", "Conversion Rate Optimization", "Performance Analytics & Reporting", "Email Marketing & Retention", "Ongoing Strategic Consultation"]],
    ] as [string, string[]][],
  },

  clientShowcase: [
    ["Thinkware", "We enhanced the UX for advanced Shopify analytics, helping the team raise $5M and scale into new markets."],
    ["Selective", "A full storefront rebuild and SEO program that grew revenue 180% in eight months."],
    ["Retrofitters", "A custom B2B layer on Shopify with tiered pricing — 300% faster order processing."],
    ["Hello2Kids", "Conversion-focused redesign that lifted mobile checkout completion by 60%."],
    ["Allure", "Technical SEO and content strategy that more than doubled organic traffic."],
    ["SkinLogic", "Speed and Core Web Vitals overhaul — 40% faster loads, higher rankings."],
  ] as [string, string][],

  testimonials: [
    {
      quote: "They reviewed what we had, quickly identified a market we could capitalize on, and improved everything along the way. Proactive with updates, dependable, and detailed in every answer. We'll keep working with them.",
      author: "John M.",
      role: "Chief Product Officer",
      company: "DTC Beauty",
      rating: 5,
      result: "+180% revenue",
    },
    {
      quote: "From start to finish, extraordinary professionalism and attention to detail. They executed our campaign with precision and handled everything end to end. Communication was seamless throughout.",
      author: "Eman R.",
      role: "CPO & Co-founder",
      company: "Fashion Brand",
      rating: 5,
      result: "+220% traffic",
    },
    {
      quote: "Our store was fast, beautiful and converting within weeks. They understood our brand better than agencies we'd paid 3x as much. The migration was completely painless.",
      author: "Priya S.",
      role: "Founder",
      company: "Home & Living",
      rating: 5,
      result: "+145% mobile CVR",
    },
    {
      quote: "The SEO work paid for itself in the first quarter. We're now ranking for terms we never thought we could compete on, and the organic revenue keeps compounding.",
      author: "Daniel K.",
      role: "Head of Ecommerce",
      company: "Outdoor Gear",
      rating: 5,
      result: "3.2x ROAS",
    },
    {
      quote: "A true partner, not a vendor. They challenge our thinking, ship fast, and genuinely care about the numbers. Our checkout conversion has never been higher.",
      author: "Sofia L.",
      role: "Marketing Director",
      company: "Wellness",
      rating: 5,
      result: "+65% conversion",
    },
    {
      quote: "They rebuilt our B2B ordering on Shopify and automated processes that used to eat our whole week. Order processing is 300% faster and our team finally trusts the system.",
      author: "Marcus T.",
      role: "Operations Lead",
      company: "Wholesale",
      rating: 5,
      result: "300% faster ops",
    },
  ] as Testimonial[],
}
