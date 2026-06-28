/* =====================================================================
   case-studies.js — single source of truth for case-study content.
   Each entry is rendered inline into the overlay sheet (no sub-pages).
   `body` is the inner HTML of .cs-main; the TOC is generated from its
   <h2 id="..."> headings automatically by overlay.js.
   ===================================================================== */
window.CASE_STUDIES = {

  /* ---------------- Leadership 2 — Building a Surface for Growth ---------------- */
  'leadcraft': {
    title: 'Building a Surface for Growth',
    body: [
      '<h1>Building a Surface for Growth</h1>',
      '<p class="cs-deck">How a self-serve mandate became the foundation for experimentation, lifecycle thinking, and a new audience for Campaign Manager — and how a usability problem everyone had deprioritized became the business case for a new top-level surface.</p>',
      '<h2 id="overview">Overview</h2>',
      '<p>LinkedIn Marketing Solutions was an enterprise product moving toward self-serve. Three things were true at the same time, and none of them were connected: there was a company-wide mandate to fix product quality, a company-wide bet on self-serve to bring in more customers, and proof — from campaign boosting on the consumer side — that self-serve actually worked. My job was to build the connective tissue between them: a single surface, grounded in how marketers actually work over time, that turned a backlog of usability complaints into a funded growth strategy.</p>',
      '<ul class="bullets">',
      '<li><strong>Role:</strong> Design lead — owned the data narrative, the lifecycle framing, the cross-functional buy-in, and the design of the surface.</li>',
      '<li><strong>Teams:</strong> Across LinkedIn Marketing Solutions — Campaign Manager, Audiences, Measurement, and Relevance &amp; Optimization.</li>',
      '<li><strong>Timeline:</strong> ~6 months of socialization and narrative work, from an all-hands quality talk to VP-level support and Q2 build.</li>',
      '<li><strong>Outcome:</strong> A new Marketing Overview surface that reduced time-to-value churn and drove measurable lifts in campaign creation, Audiences engagement, and conversion tracking.</li>',
      '</ul>',

      '<h2 id="background">Background</h2>',
      '<h3>Compounding debt</h3>',
      '<p>The product carried debt on three fronts at once, and each one made the others harder to solve. As a <strong>product problem</strong>, the numbers were stark: 80% of new customers churned within the first week, NPS was the lowest in the product\'s history, and the top-50 user complaints all traced back to self-serve gaps. As a <strong>business problem</strong>, the surfaces a customer touched — boosting, notifications, recommendations, billing, measurement — all existed, but none of them connected; a campaign lifecycle runs about 90 days, yet the UX treated every touchpoint as a one-off, and ROI never showed up on the timeline the product was designed around. And as an <strong>organizational problem</strong>, pods owned their individual surfaces but not a way of thinking in systems — and some leaders didn\'t believe self-serve was the right customer at all.</p>',
      '<h3>The pushback</h3>',
      '<p>The objection was direct, and it came from senior enough people to redirect funding: <em>"Self-serve isn\'t our ideal customer."</em> That belief had shaped the product for years, and moving it turned out to be as much of the work as any design decision. It existed for a reason — the business was built on a high-touch enterprise model: rep-assisted, agency-managed, API and custom-built, bundled. Every one of those motions assumes a human or a contract sitting between the customer and the product. Self-serve breaks that assumption, which is exactly why it felt foreign to the org.</p>',
      '<h3>Quality at the all-hands</h3>',
      '<p>I presented part of this in a product-quality talk at the LMS all-hands, and I let customers make the argument for me. The top-50 issues had been pushed to the backlog behind new revenue-driving projects — even though they were the exact issues customers kept raising, in their own words:</p>',
      '<ul class="bullets">',
      '<li><em>"OVER complicated!!!! VEEEEEERY complex process. Please, have an easier way to do everything… You MUST do an easier UI."</em></li>',
      '<li><em>"I find the overall process of setting up ads on LinkedIn to be awkward, challenging, and not user-friendly. Please, check out the Google, Microsoft, and Facebook interfaces… much easier setup."</em></li>',
      '<li><em>"This is the most UN user friendly interface. I have had to redo this 3 times. This was HAAARD!!!! and FRUSTRATING."</em></li>',
      '</ul>',

      '<h2 id="approach">Approach</h2>',
      '<p>The work followed a repeatable arc — discover, understand the data, identify the gaps, develop a systems-level narrative, earn buy-in, and build — with two craft artifacts doing most of the persuading: an illustration of the marketing lifecycle, and a narrative that gave every surface a place in one story.</p>',
      '<h3>Understanding the data</h3>',
      '<p>The numbers showed how much opportunity was being left on the table. They weren\'t new — they\'d been sitting in the quality data — but put together, they broke the prevailing narrative that churn was about seasonality and ROI uncertainty rather than usability.</p>',
      '<div class="cs-metrics">',
      '<div class="cs-metric"><div class="num">80%</div><div class="lbl">of new customers churned within the first week</div></div>',
      '<div class="cs-metric"><div class="num">90 days</div><div class="lbl">for the average customer to see ROI from campaigns</div></div>',
      '<div class="cs-metric"><div class="num">30/100</div><div class="lbl">customer satisfaction — a historic low</div></div>',
      '</div>',
      '<h3>Illustrating the marketing lifecycle</h3>',
      '<p>The reframe that broke the one-off-touchpoint thinking was simple: a campaign lives on a 90-day continuum, so the product should too. I mapped the journey from day one to day 90 as a single loop — install the insight tag, build an audience, create and launch a campaign, measure performance, act on optimizations and recommendations, segment the audience, review quarterly — with Campaign Manager at the hub and retention as the outer ring. Once people could see the loop, "fix this one screen" became "design the continuum." It was the artifact that changed the conversation.</p>',
      '<h3>Developing a systems-level narrative</h3>',
      '<p>To give every product surface a story, I built a narrative scaffold that connected each initiative to the things teams already cared about — the job to be done, the surface, the customer, the owning pod, the KPI, the supporting data and research — sitting on top of the foundational enablers underneath. It turned scattered, one-off efforts into a single narrative, and made every claim in that narrative tie down to data, research, and a team that owned it. That\'s what makes a vision fundable instead of aspirational.</p>',
      '<h3>The buy-in journey</h3>',
      '<p>Funding a foundational bet took roughly six months of deliberate socialization, and the design was a fraction of the work. It started with the quality presentation at the all-hands and partnering with the PMs who owned growth numbers, moved through a co-authored strategy document with cross-functional partners, then into identifying the pain points where self-serve customers drove the biggest upside. By mid-year all four product areas had agreed on an "ideal state" narrative, which unlocked Senior Director support and research funding. From there it was room by room — socializing with product owners across LMS, earning VP-level support, and finally landing in Q2 planning as a funded build and pilot.</p>',

      '<h2 id="solution">Solution</h2>',
      '<p>The destination was <strong>Marketing Overview</strong> — a new top-level surface that ordered the four product areas into the marketer\'s journey, with Audiences, Campaign Manager, and Relevance &amp; Optimization as primary moments and Measurement as a secondary one. A few behavioral insights shaped the design: self-serve customers often lead with content, so surfacing it earlier helps them succeed; dropping a user into a bare campaign table never surfaces the next best action; and customers connected with the insight tag build measurably better campaigns. Those insights turned an empty table into a guided, lifecycle-aware home:</p>',
      '<ul class="bullets">',
      '<li>A clear <strong>Create</strong> entry point to drive more campaign creation.</li>',
      '<li><strong>Onboarding</strong> that helps customers launch their first campaign and adopt the insight tag.</li>',
      '<li>A <strong>campaign summary</strong> that reads overall performance at a glance.</li>',
      '<li><strong>Campaign performance</strong> that highlights draft, in-flight, and completed campaigns.</li>',
      '<li>An <strong>organic &amp; paid content</strong> module that helps cold-start customers by porting content from Pages they can sponsor.</li>',
      '<li><strong>Best practices and incentives</strong> — credits and discounts that ease first-campaign launches.</li>',
      '</ul>',
      '<h3>Trade-offs</h3>',
      '<p>A foundation ships by deciding what not to build yet. We extended the work to notifications and recommendations as growth surfaces, unified copy across the platform — and tabled AI-generated asset creation. Saying no had to be a system, not a one-time call, so that the foundation didn\'t get re-fragmented the moment teams wanted to build on top of it. Working with the PM who owned the experimentation pipeline, we defined what counted as an experiment, limited where experiments could run, and created office hours for proposals.</p>',

      '<h2 id="outcomes">Outcomes</h2>',
      '<div class="cs-metrics">',
      '<div class="cs-metric"><div class="num">14-day</div><div class="lbl">reduction in time-to-value churn</div></div>',
      '<div class="cs-metric"><div class="num">32%</div><div class="lbl">increase in campaigns created</div></div>',
      '<div class="cs-metric"><div class="num">175%</div><div class="lbl">increase in engagement with the Audiences product</div></div>',
      '<div class="cs-metric"><div class="num">24%</div><div class="lbl">increase in conversion-tracking engagement</div></div>',
      '</div>',

      '<h2 id="reflection">Reflection</h2>',
      '<p><strong>Product definitions calcify.</strong> The "ideal customer" wasn\'t wrong so much as incomplete — and the incomplete version was quietly costing us a growth segment. The hardest part of the work was updating a belief, not a screen.</p>',
      '<p><strong>Cross-team vision is a design-leadership artifact.</strong> Pods don\'t need alignment lectures; they need tools that make their own work easier to socialize. The lifecycle illustration and the systems narrative did more to move the org than any deck of arguments could have.</p>',
      '<p><strong>Foundations are unglamorous but necessary.</strong> A strong platform needs that baseline before anything else can stand on it — and the discipline to protect it once it exists.</p>',
    ].join('')
  },

  /* ---------------- Leadership 3 — Pods Over Silos ---------------- */
  'pods': {
    title: 'Pods Over Silos: Restructuring to Build Faster',
    body: [
      '<h1>Pods Over Silos: Restructuring to Build Faster</h1>',
      '<p class="cs-deck">Redesigning a design organization to build faster and collaborate through the AI shift — when a Q3 deadline for the company\'s flagship AI product met a team running on empty and a system of work that was already broken.</p>',
      '<h2 id="overview">Overview</h2>',
      '<p>LinkedIn Marketing Solutions was organized into product areas — Campaign Manager Growth, Ad Formats &amp; Placements, Audiences, Relevance &amp; Optimization, and Measurement — but the design team worked across them as a shared services pool, taking requests from every direction. When a company-wide mandate landed to build a flagship AI-assisted product for a Q3 debut, that model buckled. This is the story of restructuring the team into <strong>pods</strong> — cross-functional, theme-driven units with shared goals and a federated priority structure — so it could move faster without burning out.</p>',
      '<ul class="bullets">',
      '<li><strong>Role:</strong> Design leader — designed the operating model, the priority framework, the role definitions, and the rituals; ran the pilot.</li>',
      '<li><strong>Org:</strong> The LinkedIn Marketing Solutions design team, working across five product areas.</li>',
      '<li><strong>Catalyst:</strong> A Q3 mandate to ship the company\'s flagship AI-assisted product.</li>',
      '<li><strong>Outcome:</strong> A 47% reduction in active projects, shipping velocity restored, team morale at an all-time high — and three AI-era products shipped across FY2024.</li>',
      '</ul>',

      '<h2 id="background">Background</h2>',
      '<h3>The old way of working</h3>',
      '<p>Design ran as a request queue. A small team of designers fielded <strong>99+ quarterly requests</strong> across every product area, spread thin against a roughly <strong>4:1 PM-to-designer ratio</strong>. Designers moved between projects constantly, which meant they rarely stayed in context long enough to do their best work — and the system gave them no way to see how any single request laddered up to strategy.</p>',
      '<h3>A team running on empty</h3>',
      '<p>The cost showed up in the morale data. The team\'s engagement score had fallen to <strong>66 — an all-time low</strong>. When we dug into why, the same themes surfaced again and again: people were looking for more growth opportunity, they weren\'t clear on how their work impacted strategy, and they were uncertain about what was expected of them in their roles. It wasn\'t a motivation problem. It was a system problem.</p>',
      '<h3>Pace was about to compound it</h3>',
      '<p>Then the Q3 deadline for the company\'s flagship AI product arrived. A high-stakes, fast-moving mandate met a team that was already stretched thin on a way of working that was already broken — and speed was going to make the cracks worse, not better. Restructuring wasn\'t optional; it was the only way to take on the work without breaking the team.</p>',

      '<h2 id="approach">Approach</h2>',
      '<p>Rather than just reshuffle the org chart, I rebuilt how the team decided what to work on, who did what, and how they stayed in sync.</p>',
      '<h3>Define priorities</h3>',
      '<p>The first move was a shared priority language that everyone — design, product, and leadership — could read the same way. Every effort was sorted into three tiers: <strong>P0</strong> for company-level priorities, <strong>P1</strong> for organization-level priorities, and <strong>P2</strong> for team-level priorities. That single framework made it possible to say no, or not yet, without re-litigating each request.</p>',
      '<h3>Discuss projects and build trust</h3>',
      '<p>I sat down with each product area to understand their goals, talk through their projects against the 4:1 reality, and identify where teams could collaborate instead of duplicating effort. As much as anything, this step was about building trust — the restructure only works if partners believe design is solving for shared outcomes, not protecting its own queue.</p>',
      '<h3>Identify themes</h3>',
      '<p>To give the work structure, I connected each initiative to the things people already cared about — the job to be done, the surface, the customer, the owning pod, the KPI, and the supporting data, research, and narrative — all sitting on a base of foundational enablers. Themes, not tickets, became the unit of work, which is what let pods flex their focus without losing the thread.</p>',
      '<h3>Define roles</h3>',
      '<p>Ambiguity about expectations was a top morale driver, so I made the roles explicit:</p>',
      '<ul class="bullets">',
      '<li><strong>Principal Designer</strong> — aligns with design leadership on larger-scale projects to help establish the broad narrative.</li>',
      '<li><strong>Sr. Manager + Manager</strong> — drive alignment and planning with product managers.</li>',
      '<li><strong>Staff Designer</strong> — exemplify high quality and craft on large-to-medium projects.</li>',
      '<li><strong>Sr. Designer</strong> — collaborate with staff designers to ensure quality and consistency across the work.</li>',
      '<li><strong>IC + Associate</strong> — work with Sr. Designers to drive smaller projects.</li>',
      '</ul>',
      '<h3>Define rituals</h3>',
      '<p>Finally, a cadence to keep pods aligned without drowning them in meetings — split between design-focused and cross-functional rituals. On the design side: 1:1s, design crits, standups, and design reviews. On the cross-functional side: standups, a weekly product review, product jams, and strategy reviews. Then I ran the whole model as a <strong>pilot with one team</strong> before rolling it across LMS.</p>',

      '<h2 id="solution">Solution</h2>',
      '<p>The result was the <strong>pod model</strong> — small, cross-functional units organized around themes rather than a request queue. Each pod could flex its focus area based on the themes it owned, work toward shared product goals with its product partners, and make decisions inside a federated priority structure instead of escalating everything. A shared language across pods — the priority tiers, the theme framework, the role definitions — meant teams could coordinate without a central bottleneck, which is what made decision-making faster.</p>',
      '<ul class="bullets">',
      '<li><strong>Flexibility on focus area</strong> based on the themes a pod owned.</li>',
      '<li><strong>Shared product goals</strong> between design and product partners.</li>',
      '<li><strong>A federated priority structure</strong> — pods owned their own calls within the shared framework.</li>',
      '<li><strong>Shared language</strong> across pods for priorities, themes, and roles.</li>',
      '<li><strong>Faster decision-making</strong> with fewer escalations.</li>',
      '</ul>',

      '<h2 id="outcomes">Outcomes</h2>',
      '<div class="cs-metrics">',
      '<div class="cs-metric"><div class="num">47%</div><div class="lbl">reduction in active projects</div></div>',
      '<div class="cs-metric"><div class="num">100%</div><div class="lbl">shipping velocity restored</div></div>',
      '<div class="cs-metric"><div class="num">88</div><div class="lbl">team morale score — an all-time high (up from 66)</div></div>',
      '</div>',
      '<p>The restructure didn\'t just protect the team; it let them ship the AI-era roadmap on cadence — three flagship products in three consecutive quarters:</p>',
      '<ul class="bullets">',
      '<li><strong>AI-assisted campaign creation</strong> — Q1 FY2024.</li>',
      '<li><strong>Campaign Manager onboarding</strong> — Q2 FY2024.</li>',
      '<li><strong>Measurement insights</strong> — Q3 FY2024.</li>',
      '</ul>',

      '<h2 id="reflection">Reflection</h2>',
      '<p><strong>Morale is a systems signal, not a motivation problem.</strong> The team\'s low score wasn\'t about effort — it was about unclear priorities, invisible impact, and ambiguous roles. Fixing the system of work fixed the morale, and the score nearly inverted from an all-time low to an all-time high.</p>',
      '<p><strong>Speed comes from structure, not heroics.</strong> Facing a Q3 AI deadline, the instinct is to push harder. The leverage was the opposite — fewer, clearer projects and a federated priority structure let the team move faster precisely because it stopped trying to do everything at once.</p>',
      '<p><strong>A shared language is the real deliverable.</strong> Priority tiers, themes, and explicit roles gave pods a way to make their own decisions and socialize their own work. The org didn\'t need more alignment meetings; it needed a common vocabulary.</p>',
    ].join('')
  },

  /* ---------------- Leadership 4 — B2B Events ---------------- */
  'events': {
    title: 'B2B Events: Reviving a Venture Bet Through Storytelling',
    body: [
      '<h1>B2B Events: Reviving a Venture Bet Through Storytelling</h1>',
      '<p class="cs-deck">How a low-trust events bet got reframed as a B2B marketplace sitting at the intersection of consumer, marketing, and sales — and how a single story unlocked executive funding and a pilot that attributed $100M+ in customer upside.</p>',
      '<div class="cs-carousel" data-carousel tabindex="0" aria-roledescription="carousel" aria-label="Project images">' +
  '<button class="cs-car-btn prev" type="button" aria-label="Previous image">‹</button>' +
  '<div class="cs-carousel-viewport"><div class="cs-carousel-track">' +
    '<div class="cs-slide"><img src="assets/case_studies/events/events_hero.webp" alt="B2B Events — LinkedIn Live Events experience" loading="lazy"></div>' +
  '</div></div>' +
  '<button class="cs-car-btn next" type="button" aria-label="Next image">›</button>' +
'</div>',

      '<h2 id="overview">Overview</h2>',
      '<p>When LinkedIn\'s CPO moved to Marketing Solutions in 2023, the events business was underperforming and organizational confidence in it was low. There was no clear revenue story, and the consumer team had shipped a placeholder experience that mostly routed users out to third-party platforms. I led the narrative and design direction for a vision that reframed events as a <strong>B2B marketplace</strong> sitting where no other team could — at the intersection of consumer, marketing, and sales. The work wasn\'t to defend events; it was to make the future concrete enough that leaders would commit dollars to it.</p>',
      '<ul class="bullets">',
      '<li><strong>Role:</strong> Design lead — owned the strategic narrative, the lifecycle framing, the investment pillars, and the design concepts that made the future state tangible.</li>',
      '<li><strong>Partners:</strong> A Senior Product Manager (business framing and pilot scoping) and a Senior Product Designer (concept and craft).</li>',
      '<li><strong>Audience:</strong> Executive leadership across LinkedIn Marketing Solutions.</li>',
      '<li><strong>Outcome:</strong> Marketing-side investment funded; a flagship-event pilot attributed <strong>$100M+</strong> of upside to a single customer; a multi-quarter roadmap kicked off with a Beta in Feb ’24.</li>',
      '</ul>',

      '<h2 id="background">Background</h2>',
      '<h3>A space LinkedIn had let drift</h3>',
      '<p>The original events experience, built around 2021, was fast to ship but thin: an event object on LinkedIn that routed users out to third-party streaming platforms. It worked as a listing, but it was missing the one thing LinkedIn could uniquely provide — B2B context. Because events lived on flagship consumer surfaces, the consumer team owned them, and that framing left the experience without a contextual approach for the marketers who actually pay LinkedIn.</p>',
      '<h3>A new question, and low trust</h3>',
      '<p>In 2023 the CPO joined LMS and asked a different question: <em>what if events were inclusive to marketers, with a marketplace at the core?</em> LMS was the only org positioned to answer it, because the business sits across consumer, marketing, and sales at once. But trust in the events strategy was low — no clear revenue outcome, and the work to date hadn\'t earned the org\'s confidence. The task was a narrative one before it was a design one.</p>',
      '<h3>A pilot for ads gave us hope</h3>',
      '<p>Two signals gave us something real to build around. Event-formatted ads were already outperforming, and an anchor customer was willing to put serious money behind their flagship event:</p>',
      '<div class="cs-metrics">',
      '<div class="cs-metric"><div class="num">20×</div><div class="lbl">views vs. organic-only</div></div>',
      '<div class="cs-metric"><div class="num">3×</div><div class="lbl">registrations vs. organic-only</div></div>',
      '<div class="cs-metric"><div class="num">2×</div><div class="lbl">ROI compared to competing platforms</div></div>',
      '</div>',
      '<p>On top of that, an advertiser made a <strong>$100M+ commitment</strong>, signaling a willingness to invest more in the product. That turned the vision from a pitch deck into something we could ship and measure — and it anchored the whole strategy in a real commercial opportunity.</p>',

      '<h2 id="approach">Approach</h2>',
      '<p>I framed the work around a north-star statement — <em>LinkedIn Live Events deeply enhance the experience and promotion of large tentpole events for enterprise businesses seeking to build lasting connections with their attendees</em> — and built the case to be persuasive in an executive room. The narrative had to incorporate research, speak to the business case, and be both systems-aware and initiative-aware so partners could see their existing work inside it rather than threatened by it.</p>',
      '<h3>The events lifecycle</h3>',
      '<p>The organizing idea was an event lifecycle — <strong>Plan, Attract, Engage, Live Event, Amplify, Convert</strong> — with <strong>Analyze + Optimize</strong> as the continuous loop at the center. The lifecycle gave executives a shared mental model for where LinkedIn could show up, and it made obvious that the existing product only touched two or three stages — while the ROI unlocks (attribution, boosting, lead gen) lived in the stages we hadn\'t invested in.</p>',
      '<h3>Marketplace thinking and an ecosystems approach</h3>',
      '<p>Events couldn\'t be one surface; they had to be an ecosystem spanning the things LinkedIn already had. The vision connected three existing pillars so they worked as one marketplace:</p>',
      '<ul class="bullets">',
      '<li><strong>Flagship</strong> — event objectives, the feed, measurement, ads, event boosting, event creation, interests, and third-party integrations.</li>',
      '<li><strong>Campaign Manager</strong> — leads, Pages, attribution, analytics, retargeting, lead gen forms, products, and permissions.</li>',
      '<li><strong>Sales Navigator</strong> — messaging and attribution that carried event engagement into the sales motion.</li>',
      '</ul>',
      '<h3>Jobs to be done, and two personas</h3>',
      '<p>To keep the story grounded in people, I defined the jobs to be done around two personas: the <strong>Marketer</strong> — the organizer planning and hosting an event on LinkedIn — and the <strong>Attendee</strong> — the member discovering and attending an event via LinkedIn. Mapping the lifecycle against both journeys (planning, marketing, and post-event results for the marketer; awareness, interest, attendance for the attendee) is what focused the story on the moments that mattered to each side of the marketplace.</p>',

      '<h2 id="solution">Solution</h2>',
      '<p>To make the future state tangible, we designed three connected experiences across the lifecycle — one for each side of the marketplace, plus the layer that proves it worked.</p>',
      '<h3>Event ad experience</h3>',
      '<p>A single ad format that adapts across the lifecycle — <strong>pre-event</strong> (“Live in 6d,” register), <strong>during</strong> (a LIVE state with real-time engagement), and <strong>post-event</strong> (“previously live,” view on demand). It meets a member in the feed wherever the event is in its arc, instead of treating promotion as a one-time push.</p>',
      '<h3>Attendee event experience</h3>',
      '<p>An on-platform experience built around how businesses build lasting connections with attendees: in-context check-in, schedules and a campus map, a community board, and networking that connects coworkers and surfaces warm introductions — using the LinkedIn graph to make the event feel native rather than routed through a third party.</p>',
      '<h3>Marketing &amp; sales experience</h3>',
      '<p>The layer that earns trust with the people holding the budget: a dedicated event overview within Pages, and a marketing funnel that connects impressions, attendees, viewers, and demos with a paid-vs-organic breakdown so marketers can see attribution end to end. Because paid promotion performed well, the design also integrated partners to capture attendees on other platforms for a full picture, and let teams retarget engaged viewers with event content. This was the pillar most directly tied to winning budget away from other platforms.</p>',

      '<h2 id="outcomes">Outcomes</h2>',
      '<div class="cs-metrics">',
      '<div class="cs-metric"><div class="num">$100M+</div><div class="lbl">upside attributed to the pilot customer</div></div>',
      '<div class="cs-metric"><div class="num">Funded</div><div class="lbl">marketing-side investment secured</div></div>',
      '<div class="cs-metric"><div class="num">Beta</div><div class="lbl">roadmap kicked off in Feb ’24</div></div>',
      '</div>',
      '<p>The pilot validated that the attribution story was real and measurable, and gave the executive team a concrete precedent: if the flagship customer could see nine figures of value, a broader rollout had a defensible case. Events moved from “low confidence, no revenue” to a funded program with a clear pillar structure, and the work expanded into a multi-quarter roadmap across two tracks — elevating event organizers and marketers (full-funnel analytics, lead sync, CRM two-way sync, optimization by objective) and elevating the attendee experience (networking 2.0, day-of experiences, recap and saved content).</p>',
      '<p>An honest note on scope: I led the work that got the strategy <em>started and funded</em>. The broader build was in flight when I left LinkedIn, so the credit I claim is the funding decision and the narrative that unlocked it — not shipping the full roadmap.</p>',

      '<h2 id="reflection">Reflection</h2>',
      '<p><strong>Vision-building under low trust is a narrative problem, not a design problem.</strong> The market data, the customer interest, and the lifecycle framing weren\'t new — they lived in different rooms. What unlocked funding was assembling them into one story that made the bet feel inevitable: the budgets are already being spent, the format already outperforms competitors, the customer is already willing, and LinkedIn is the only company sitting across consumer, marketing, and sales at this scale.</p>',
      '<p><strong>Make partners see themselves in the story.</strong> Framing the vision as an ecosystem of pillars teams already owned — Flagship, Campaign Manager, Sales Navigator — meant the strategy read as additive, not as a land grab. That\'s what turned potential blockers into advocates.</p>',
      '<p><strong>Pairing is what makes a vision read as strategy.</strong> A Senior PM owned the business framing while I owned the narrative and design direction, so the work never landed as a design exercise or a spreadsheet alone. That pairing is the thing I\'d bring into any zero-to-one work at this altitude.</p>',
    ].join('')
  },

  /* ---------------- Leadership 5 — Base CRM ---------------- */
  'base': {
    title: 'Base CRM: Building the Design Organization',
    body: [
      '<h1>Base CRM: Building the Design Organization</h1>',
      '<p class="cs-deck">I joined Base CRM in Chicago as one of four designers. Ten months later the company raised a Series B and moved to Palo Alto — and I was the only one to make the move. That\'s where I went from learning the craft to building the design organization: the recruiting pipeline, the interview, the principles, the first design system, and a workflow that bridged 6,000 miles to engineering in Kraków.</p>',
      '<div class="cs-carousel" data-carousel tabindex="0" aria-roledescription="carousel" aria-label="Project images">' +
  '<button class="cs-car-btn prev" type="button" aria-label="Previous image">‹</button>' +
  '<div class="cs-carousel-viewport"><div class="cs-carousel-track">' +
    '<div class="cs-slide" style="background:#fff"><img src="assets/case_studies/base_crm/base_crm_with_design_system.jpg" alt="The Base CRM desktop app — leads pipeline built on the design system" loading="lazy"></div>' +
    '<div class="cs-slide" style="background:#fff"><img src="assets/case_studies/base_crm/iOS-Mobile.png" alt="The Base CRM iOS app — deals list, contact detail, and overview" loading="lazy"></div>' +
    '<div class="cs-slide" style="background:#fff"><img src="assets/case_studies/base_crm/design-sytem.webp" alt="Base design system components" loading="lazy"></div>' +
  '</div></div>' +
  '<button class="cs-car-btn next" type="button" aria-label="Next image">›</button>' +
'</div>',

      '<h2 id="overview">Overview</h2>',
      '<p>This isn\'t a single-project case study — it\'s the story of growing into the person who builds a design organization. I joined Base CRM in Chicago as one of four designers, and within ten months the company raised a Series B and moved to Palo Alto. I was the only designer to make the move, and my role shifted from learning the craft to building the function: a recruiting pipeline, a CEO-backed interview, shared principles, the company\'s first design system, and a distributed workflow connecting a Palo Alto design team to engineering in Kraków, Poland. Through all of it I stayed responsible for the craft — a CRM that had to work as a true multi-platform product across web, iOS, and Android. Fortunately, design and craft were in the company\'s DNA from the start. Base was later acquired by Zendesk and became Zendesk Sell.</p>',
      '<ul class="bullets">',
      '<li><strong>Role:</strong> Manager, UX Design — from one of four ICs in Chicago to building the team, the process, and the culture.</li>',
      '<li><strong>Timeline:</strong> 2014–2017 — Series B and the move to Palo Alto within the first ten months.</li>',
      '<li><strong>Team:</strong> One of 4 designers in Chicago → the only one to move → rebuilt and grew the function to 5.</li>',
      '<li><strong>Platforms:</strong> Web, iOS, and Android — one product, three surfaces.</li>',
      '<li><strong>Scope:</strong> Product, organization, and culture — end to end.</li>',
      '</ul>',

      '<h2 id="background">Background</h2>',
      '<h3>From a team of four in Chicago to the only one who moved</h3>',
      '<p>I joined Base CRM in 2014 in Chicago, on a design team of four. Base was a sales-CRM startup with engineering in Kraków, Poland — a 9-hour time difference, 6,000 miles away — and, fortunately, a company where design and craft were part of the DNA from the start. I came in to learn the product and sharpen my craft alongside the team.</p>',
      '<p>Within ten months, the company raised a Series B and moved to Palo Alto. I was the only designer to make that move — and almost overnight my role changed from learning to acting. I went from one of four ICs to the person responsible for building the design organization and function: the hiring, the process, the principles, the system, and the distributed workflow back to Kraków. The foundation of a design-led culture was already there; my job was to scale it through the company\'s next chapter — in a new market, with a distributed team, while still owning end-to-end product design.</p>',

      '<h2 id="approach">Approach</h2>',
      '<h3>Building the talent brand</h3>',
      '<p>The first challenge was hiring. A Chicago company that had just moved to Silicon Valley, asking designers to get excited about enterprise sales software — nobody knew who we were. I built a talent brand from zero: Dribbble to show craft in the enterprise space, Medium to share our thinking, Twitter to engage the community, and in-person campus visits for a direct pipeline. The pitch that resonated was high craft at the center of everything, plus a genuinely hard cross-platform mobile challenge.</p>',
      '<h3>The interview, designed with the CEO</h3>',
      '<p>I worked with the CEO and leadership to create a structured interview rooted in our principles, screening for four core traits: craft, adaptability, drive, and ownership. It ran in three stages — a tech screen and initial call, a design challenge with full context provided, and a CEO interview that deliberately signaled design was central, not a service function. Early on I hired generalists; as the team grew, I brought in more specialized roles, scaling from 1 to 5.</p>',
      '<h3>Working across a distributed team</h3>',
      '<p>Our product team was split between Kraków and the Bay Area — a 9-hour, 6,000-mile gap that wasn\'t going to change, so the discipline had to. The broken workflow (Photoshop → Dropbox → wait for sync) was the first fix: I led the evaluation and enterprise purchase of InVision, one of our largest product-side investments, which gave us interactive prototyping, async comments, inspectable specs, and a shared workspace. Around that I set a few working habits that made the distance manageable:</p>',
      '<ul class="bullets">',
      '<li><strong>Trade email for video.</strong> Email is great for summarizing the day, but if something needs explaining it\'s far easier to talk it through than to wait nine hours for a reply — and seeing expressions gives you cues you\'d otherwise miss.</li>',
      '<li><strong>Organize early.</strong> We had designs and questions ready the evening before a call, using the daily summary email as the agenda so everyone came prepared to go deep.</li>',
      '<li><strong>Define where each tool fits.</strong> Without clear boundaries you end up with remote islands of duplicate, confusing information — so each tool had a job.</li>',
      '<li><strong>Share research broadly.</strong> Giving cross-functional partners who rarely met our users a window into research led to better ideas and decisions than any of us would have reached alone.</li>',
      '</ul>',
      '<h3>Designing the onboarding experience</h3>',
      '<p>First impressions set the tone for an organization, and the most common complaint about onboarding is that it\'s either nonexistent or overwhelming — most teams work across many tools, and new hires don\'t know where to start. So I treated onboarding as a designed experience, not an afterthought. Ours ran about two weeks before designers got immersed in project work: a small set of focused tasks each day, with links to the right documentation and meetings in context, closing with a survey so we could keep improving it. It was low effort to run and paid off in how quickly — and how welcomed — new designers ramped. A designer on the team, Rachel Mitrano, even designed a custom, playful email template that made the whole thing feel like us.</p>',
      '<div class="cs-figure" style="aspect-ratio:auto;background:#fff"><img src="assets/case_studies/base_crm/onboarding.webp" alt="Day 1 of the Base Design Academy onboarding email — &lsquo;Welcome to Base!&rsquo;" style="height:auto;object-fit:contain" loading="lazy"></div>',

      '<h2 id="platforms">Designing across platforms</h2>',
      '<h3>Continuity from desktop to mobile, for on-the-go closers</h3>',
      '<p>Sales reps are rarely at a desk. They\'re on calls, walking into meetings, and logging deals between site visits — which meant the product had to hold up as a true multi-platform experience, not a desktop tool with a mobile companion bolted on. We pushed the same affordances and component architecture across products while adhering to Apple\'s Human Interface Guidelines, Google\'s Material Design, and best practices on the web. That continuity meant a rep could start a workflow on a Pixel in a parking lot and finish it on a MacBook back at the office without having to relearn the tool.</p>',
      '<div class="cs-figure" style="aspect-ratio:auto;background:#fff"><img src="assets/case_studies/base_crm/iOS-Mobile.png" alt="The Base CRM iOS app — deals list, contact detail, and deals overview screens" style="height:auto;object-fit:contain" loading="lazy"></div>',
      '<h3>Affordance through interaction</h3>',
      '<p>Building a CRM that was fully functional on mobile was already a challenge, given how much information reps were used to entering on desktop. So simple and intuitive became the experience pillars. We didn\'t add interactions for their own sake; each one had to carry real affordance and tie back to the sales user journey. In the demo below, a rep navigates across won, lost, and unqualified deals — the motion itself communicates state and direction. During exploration I built the prototype in Sketch and prototyped the interaction in Principle.</p>',
      '<div class="cs-figure" style="aspect-ratio:auto;background:#fff;padding:12px"><video autoplay loop muted playsinline aria-label="Mobile demo — navigating across won, lost, and unqualified deals" style="height:auto;max-height:600px;width:auto;max-width:100%;margin:0 auto"><source src="assets/case_studies/base_crm/affordance.webm" type="video/webm"></video></div>',

      '<h2 id="design-system">The first design system</h2>',
      '<p>There was no shared language for how the product should look or behave. Engineers in Kraków rebuilt components from scratch every time; designers redrew the same patterns in every mockup. As Base grew, the real constraint wasn\'t talent or tooling — it was that shared language. Designers were shipping good work, but developers and other stakeholders had no common vocabulary to push back on, build with, or extend.</p>',
      '<div class="cs-figure" style="aspect-ratio:auto;background:#fff"><img src="assets/case_studies/base_crm/base_crm_with_design_system.jpg" alt="The Base CRM desktop app — leads pipeline built on the design system" style="height:auto;object-fit:contain" loading="lazy"></div>',
      '<p>I led the initiative to build Base\'s first design system: a UI kit of 60+ components powering desktop, paired with the six principles — Unified, Honest, Purposeful, Useful, Clear, Simple. That gave the whole company a single way to think about the product. Whether a designer was proposing a new deal card or a developer was implementing form validation, everyone referenced the same six lenses. The system gave desktop consistency with mobile, the CRM consistency with Apollo, and the organization a shared definition of what great design at Base meant — and it was a force multiplier: designers solved new problems instead of reconstructing old ones, engineers got specs that didn\'t require a meeting to interpret, and new designers onboarded into the product\'s language in days instead of weeks.</p>',
      '<div class="cs-figure" style="aspect-ratio:auto;background:#fff"><img src="assets/case_studies/base_crm/design-sytem.webp" alt="Base design system components — text inputs, dropdowns, search, date picker, and sort/filter controls" style="height:auto;object-fit:contain" loading="lazy"></div>',
      '<p>Each principle carried a concrete meaning the team could hold work against:</p>',
      '<ul class="bullets">',
      '<li><strong>Unified</strong> — promote cohesiveness and familiarity through common patterns, so new features and products like Apollo feel like part of the same whole.</li>',
      '<li><strong>Honest</strong> — give clear feedback after an action; every action has a consequence, and showing it builds trust and reliability.</li>',
      '<li><strong>Purposeful</strong> — help users complete their goals as efficiently as possible, guided by feedback, data, and key metrics.</li>',
      '<li><strong>Useful</strong> — platform and context matter; make experiences adaptive and scalable. (A rep adding a lead in the field, for instance, gets GPS to make it effortless.)</li>',
      '<li><strong>Clear</strong> — concise content frames the experience, and visual affordances communicate what\'s possible.</li>',
      '<li><strong>Simple</strong> — keep the interface clean, understated, and focused on the essentials of what the user is trying to do.</li>',
      '</ul>',
      '<div class="cs-figure" style="aspect-ratio:auto;background:#fff"><img src="assets/case_studies/base_crm/gps.webp" alt="&ldquo;Useful&rdquo; in practice — GPS-assisted lead capture: a Select location map with a Create a Lead pin" style="height:auto;object-fit:contain" loading="lazy"></div>',

      '<h2 id="culture">Building a culture of innovation</h2>',
      '<p>Innovation isn\'t a lightning strike — it\'s a process. An organization has to execute well on the fundamentals and stay disciplined enough to build trust in them. That belief shaped how I ran the team, and it came down to five things.</p>',
      '<p><strong>Understand.</strong> Nothing innovative happens if you don\'t understand your customers and their industry. I leaned on lightweight practices anyone could run tomorrow — contextual inquiries, actually using our own product, and getting into the trenches on support tickets, where dead-ends and unclear copy reveal themselves fast. Empathy was the foundation; without it, projects drag and risk delivering no value.</p>',
      '<p><strong>Encourage new ideas and constructive feedback.</strong> I built an environment where everyone could contribute — design sprints to align partners quickly, retrospectives to close a quarter on what worked and what to improve, and the design principles as a shared language that let teams constructively say &ldquo;no&rdquo; more often than &ldquo;yes.&rdquo;</p>',
      '<p><strong>Implement faster.</strong> The design system centralized visual bugs and unlocked quicker MVPs we could validate with real data, and usability testing caught problems while they were still cheap to fix — far cheaper to iterate on a design than on a product that\'s already built.</p>',
      '<p><strong>Optimize through experimentation.</strong> Optimization was more than growth hacking; it was a sustainable rhythm of diverging and converging on ideas unique to our product. We tracked critical paths to find drop-off and churn, and A/B tested to challenge assumptions and try new concepts.</p>',
      '<p><strong>Protect time.</strong> Most importantly, none of it happens without time set aside for it. I budgeted design and research for future-facing concepts that weren\'t engineering-funded, which took the pressure off time-boxed deliverables — and, again, revisions in design cost far less than revisions in code.</p>',
      '<div class="cs-figure" style="aspect-ratio:auto;background:#fff"><img src="assets/case_studies/base_crm/innovation_diagram.webp" alt="Innovation pyramid — Budget Time, Understand, Conceptualize, Implement, Optimize from base to top" style="height:auto;object-fit:contain" loading="lazy"></div>',

      '<h2 id="solution">Product &amp; business impact</h2>',
      '<p>With the team and system in place, design started driving product and business outcomes directly. I built automated onboarding (a two-week email sequence with a survey at the end), developed a <strong>Data → Insights → Recommendations</strong> framework for the CRM experience, and partnered with the CEO and CPO on design-led enterprise proposals that drove multiple <strong>$1M+ ARR</strong> deals. I also budgeted innovation time for forward-looking concepts and ran cross-functional retros to keep the operating model improving.</p>',

      '<h2 id="outcomes">Outcomes</h2>',
      '<div class="cs-metrics">',
      '<div class="cs-metric"><div class="num">#1</div><div class="lbl">CRM in the iOS App Store</div></div>',
      '<div class="cs-metric"><div class="num">1 → 5</div><div class="lbl">design team growth</div></div>',
      '<div class="cs-metric"><div class="num">$1M+</div><div class="lbl">ARR deals driven by design-led proposals</div></div>',
      '<div class="cs-metric"><div class="num">60+</div><div class="lbl">components in the first design system</div></div>',
      '</div>',
      '<p>Beyond the numbers: a talent brand built from zero, six design principles embedded in the culture, a distributed workflow transformed through InVision, and high customer satisfaction across desktop and mobile. The design org I left behind was no longer one person — it was a functioning team with principles, process, a pipeline, and a track record of driving revenue. Base was acquired by Zendesk in 2018, becoming Zendesk Sell.</p>',

      '<h2 id="reflection">Reflection</h2>',
      '<p><strong>Design skills aren\'t just for making products — they\'re for designing organizations.</strong> Base already valued craft, but the move turned every challenge into an organization-design problem, and the same instincts that shape a product shaped the team, the hiring, and the way we worked. A handful of lessons stuck with me:</p>',
      '<p><strong>Seek generalists.</strong> UX designers are crucial early — working with PMs and users to understand goals, find opportunities, and sometimes run research — while UI and visual designers excel later, on visual and motion craft. A generalist spans both and isn\'t afraid to own the whole process, from prototype to high-fidelity spec. As the org grows, you can add specialists, and their depth becomes a growth path for everyone else.</p>',
      '<p><strong>Principles turn &ldquo;me&rdquo; into &ldquo;we.&rdquo;</strong> The six principles created buy-in and accountability between teammates and made feedback constructive — conversations shifted from &ldquo;I think that…&rdquo; to &ldquo;does this fall in line with the principles we established?&rdquo; Principles aren\'t perfect, so the team has to feel free to iterate on them too.</p>',
      '<p><strong>Get feedback early and often.</strong> An organization inevitably changes, and you have to adjust to stay fluid. Design critiques, 1:1s, and retrospectives with cross-functional partners surface what isn\'t resonating before it\'s too late to fix.</p>',
      '<p><strong>Select your tools wisely.</strong> In a perfect world designers use whatever they like, but engineers, PMs, and partners collaborate across the whole lifecycle — so tools with little adoption just waste time and money. Constraints around how the team works (like our move to InVision) were worth the trade.</p>',
      '<p><strong>Gain perspective before building a process.</strong> I drew the picture by talking with my team and the departments we worked with about onboarding, design reviews, and kick-offs first. Once you have a view, keep operations simple and commit — and making strategy inclusive builds the trust that makes a process actually stick.</p>',
      '<p><strong>Learn how to say no.</strong> No organization has infinite resources. If you\'re blocking work without being in the conversation with your engineering and product partners, the process is broken — and poor planning stresses everyone, which shows up in the product.</p>',
      '<p><strong>Appoint a culture champion.</strong> The people who have their peers\' respect and go beyond their daily tasks are force multipliers — they organize team-building, carry the product vision, and mentor newer designers as you scale.</p>',
      '<p><strong>And document as you build.</strong> The one thing I\'d do differently: too much institutional knowledge depended on me being in the room. That\'s the lesson I carried to LinkedIn — build the documentation alongside the system, not after.</p>',
    ].join('')
  },

  /* ---------------- Project 1 — Dual Creator Cam ---------------- */
  'video-recorder': {
    title: 'Dual Creator Cam — One Tap, Two Finished Videos',
    body: [
      '<h1>Dual Creator Cam</h1>',
      '<p class="cs-deck">A 0→1 iOS app that turns one tap into two finished videos — a vertical file for Reels and TikTok, a horizontal file for YouTube — auto-saved to Photos, no reshoot, no cropping in post. Designed and built solo with Claude Code, Xcode, and Figma over a year of travel.</p>',
      '<div class="cs-figure"><img src="assets/case_studies/dualcreatorcam/dualhero.webp" alt="Dual Creator Cam — one tap, two finished videos" loading="lazy"></div>',

      '<h2 id="overview">Overview</h2>',
      '<p>The best camera is the one already in your pocket — the opportunity was making it do more. Dual Creator Cam captures one high-resolution source and writes two files in parallel, so a creator walks away from a single take with both the vertical and horizontal cut their platforms need. I owned the whole thing: product definition, the Figma spec, the agent-led Swift build, and QA.</p>',
      '<ul class="bullets">',
      '<li><strong>Role:</strong> Sole designer + builder — product, design spec, build, and testing.</li>',
      '<li><strong>Tools:</strong> Claude Code ↔ Xcode · Figma (via MCP) · GitHub · Swift / AVFoundation · Mixpanel · TestFlight.</li>',
      '<li><strong>Timeline:</strong> Designed and built over a year of travel; shipped to the App Store, followed by a 2.0 personalization update.</li>',
      '<li><strong>Outcome:</strong> A shipping iOS app — single-source dual-crop capture, Lock Screen / Control Center entry, and a customizable record button.</li>',
      '</ul>',

      '<h2 id="problem">The Problem</h2>',
      '<p>When traveling, it\'s hard to capture a moment at a moment\'s notice. A camera on a tripod, a DJI Osmo Pocket, an Insta360 — they\'re slow, costly, and carry real risk through airport security, storage, and the elements. That friction is increasingly out of step with where the market is going: social creators have almost entirely ditched traditional cameras for their phones.</p>',
      '<div class="cs-metrics">',
      '<div class="cs-metric"><div class="num">207M+</div><div class="lbl">people identify as content creators worldwide</div></div>',
      '<div class="cs-metric"><div class="num">$250B</div><div class="lbl">creator economy in 2025, on a path to $1T+ by 2030–33</div></div>',
      '<div class="cs-metric"><div class="num">10–20%</div><div class="lbl">audience overlap between platforms — why creators cross-post</div></div>',
      '</div>',
      '<p>Capturing once and publishing everywhere isn\'t laziness — with so little overlap between platforms, it\'s how creators maximize reach without re-shooting. The challenge with extra hardware is managing memory, transfer, and storage; a single device consolidates the whole workflow.</p>',

      '<h2 id="customer">Customer</h2>',
      '<p>My wife and I set out to travel for more than a year and felt this complexity first-hand — she wanted footage for YouTube and to post to TikTok at the same time, without treating every moment as a photo shoot. Along the way we met two distinct groups: casual users making family videos for Facebook and friends, and semi-pro creators posting to YouTube and TikTok. The app had to serve both.</p>',
      '<p>Before building, I ran a fast gut-check that became the app\'s first real screen — a single multi-select question, <em>"What will you use Dual Creator Cam for?"</em>, spanning short-form clips, long-form YouTube, vlogs and travel, interviews and podcasts, tutorials, and personal memories. The answer is stored on-device to personalize defaults (for example, leaning vertical-first for short-form creators) and sent anonymously so I can see the mix of use cases across installs. That one question let me anchor language, defaults, and feature priorities around the creator mindset instead of guessing.</p>',

      '<h2 id="approach">Approach &amp; Principles</h2>',
      '<p>Existing apps solved the orientation problem but were barebones — none had a creative use case in mind. I saw an opening not just to shoot in two orientations, but to give creators better ways to manage their footage. Three principles guided the work:</p>',
      '<ul class="bullets">',
      '<li><strong>Keep it simple.</strong> One core feature; everything else exists to support it.</li>',
      '<li><strong>Maintain baseline parity.</strong> Match the stock iOS camera, then leverage the hardware of supported devices.</li>',
      '<li><strong>Stay relevant.</strong> Language, customization, and settings tuned to creators — that\'s what sets it apart from the dozens of recorders in the store.</li>',
      '</ul>',
      '<p>The orientation signal is strong, and it cuts both ways:</p>',
      '<div class="cs-metrics">',
      '<div class="cs-metric"><div class="num">~81%</div><div class="lbl">watch short-form video vertically on their phones</div></div>',
      '<div class="cs-metric"><div class="num">4×</div><div class="lbl">higher engagement for vertical clips on Instagram &amp; TikTok</div></div>',
      '<div class="cs-metric"><div class="num">76% vs 54%</div><div class="lbl">completion rate, vertical vs. horizontal</div></div>',
      '</div>',
      '<p>But interviews, B-roll, and YouTube still live horizontal. A creator genuinely needs both — exactly the gap a dual-orientation recorder fills. I benchmarked against the DJI Osmo Pocket 3 and Insta360 ecosystem, the tactile, crafted bar I wanted to meet. Studying them surfaced a few rules: haptics are a passive signal of recording and navigation; there needs to be more than one indicator while recording; and hardware dictates resolution and frame rate.</p>',

      '<h2 id="architecture">The Architecture Pivot</h2>',
      '<p>The biggest decision happened under the hood. My first instinct was Apple\'s <code>AVCaptureMultiCamSession</code> — run two physical lenses at once, one feeding the vertical file, one the horizontal. It demoed well but had two problems I couldn\'t design around: on iPhone 12-class hardware, multi-cam shares a bandwidth budget that caps each stream at ~1080p/30, so the "shoot in 4K" promise was off the table; and because it can only attach individual physical lenses, it couldn\'t use Apple\'s virtual triple-camera, so the 0.5×, 3×, and 8× zoom presets had to be faked with digital zoom.</p>',
      '<p>So I pivoted to a <strong>single-camera, dual-crop architecture</strong>: capture one high-resolution source from the virtual triple/dual-wide device, then crop the same frame into a 9:16 file and a 16:9 file in parallel using two <code>AVAssetWriter</code> instances. That one change unlocked 4K/60, gave users the automatic lens-switching they expect from the stock Camera app, and made the codebase meaningfully smaller. What I gave up was recording a different lens per orientation simultaneously — a real tradeoff, but the right one. It mapped cleanly to the user\'s mental model: two finished files from one tap — one for my Reel, one for my YouTube short.</p>',

      '<h2 id="craft">Craft &amp; Personalization</h2>',
      '<h3>Flows</h3>',
      '<p>There are deliberately <strong>no accounts</strong> — analytics run on an anonymous per-install ID with no personal data attached. What the app does need is system permission across camera, microphone, and photo library, so I designed the consent flow to request these clearly and in context rather than dumping every prompt at once.</p>',
      '<p>A <strong>four-step onboarding</strong> orients people on dual recording, settings, where their media lives, and personalizing the record button — enough to communicate value, short enough to get out of the way.</p>',
      '<div class="cs-carousel cs-carousel--portrait" data-carousel tabindex="0" aria-roledescription="carousel" aria-label="Onboarding steps">' +
  '<button class="cs-car-btn prev" type="button" aria-label="Previous step">‹</button>' +
  '<div class="cs-carousel-viewport"><div class="cs-carousel-track">' +
    '<div class="cs-slide"><img src="assets/case_studies/dualcreatorcam/onboard3.jpg" alt="Onboarding — record portrait and landscape simultaneously, with a Dual/Single toggle" style="object-fit:contain;background:#000" loading="lazy"></div>' +
    '<div class="cs-slide"><img src="assets/case_studies/dualcreatorcam/onboard4.jpg" alt="Onboarding — your settings your way: resolution, frame rate, and composition grid" style="object-fit:contain;background:#000" loading="lazy"></div>' +
    '<div class="cs-slide"><img src="assets/case_studies/dualcreatorcam/onboard5.jpg" alt="Onboarding — manage your recordings from the in-app library" style="object-fit:contain;background:#000" loading="lazy"></div>' +
    '<div class="cs-slide"><img src="assets/case_studies/dualcreatorcam/onboard6.jpg" alt="Onboarding — express yourself: customize the record button color and texture" style="object-fit:contain;background:#000" loading="lazy"></div>' +
  '</div></div>' +
  '<button class="cs-car-btn next" type="button" aria-label="Next step">›</button>' +
'</div>',
      '<h3>Personalization (the 2.0 centerpiece)</h3>',
      '<p>Traveling through Asia, I saw how big personalization is in creator culture — custom cases, themed accessories, character straps. Given how many apps look alike, and that women make up slightly over half of all creators (up to 76% on TikTok and 79% on Instagram), I made the one control you stare at the whole shoot yours: four record-button finishes — Chrome, Matte, a faceted gem (with its own Metal shader), and a soccer ball — plus color themes. 2.0 also added the ability to start a Dual or Single recording straight from the <strong>Lock Screen and Control Center</strong> without opening the app, and a redesigned capture HUD with a live timer and an at-a-glance format readout.</p>',
      '<div class="cs-figure" style="aspect-ratio:auto;background:transparent;border:0;max-width:400px;margin:8px auto 24px;padding:0"><video autoplay loop muted playsinline aria-label="Rotating the phone and customizing the record button finish" style="height:auto;width:100%;display:block"><source src="assets/case_studies/dualcreatorcam/rotatingcustomization.webm" type="video/webm"></video></div>',
      '<h3>The hard problems</h3>',
      '<ul class="bullets">',
      '<li><strong>Cropping.</strong> The product hinges on cropping one source frame into two correct aspect ratios, every frame, in real time. I pulled that geometry into a single pure function (aspect-fill: given a source extent and a target size, return the scale and crop rect) so it could be unit-tested in isolation instead of debugged live through the camera pipeline.</li>',
      '<li><strong>Stabilization.</strong> Cinematic stabilization is what makes handheld travel footage watchable, but it doesn\'t behave identically across every capture configuration — so I built an automatic fallback rather than assume it was always available. Much of this could only be verified on real hardware, which is why the TestFlight phase mattered.</li>',
      '</ul>',

      '<h2 id="outcomes">Tracking, Testing &amp; Outcomes</h2>',
      '<p>To see how the app was actually used, I instrumented key moments in <strong>Mixpanel</strong> through a single analytics wrapper, mapped to the real journey: <code>app_launched</code>, <code>onboarding_started</code>, <code>permission_requested</code>, <code>survey_submitted</code>, <code>onboarding_completed</code>, then <code>recording_started</code>, <code>recording_stopped</code>, and <code>recording_saved</code>. I treated <code>recording_saved</code> as the value moment — a finished recording landing in the user\'s Photos library is when the app delivers on its promise. Consistent with the no-accounts decision, all of it rides on an anonymous per-install ID with no PII.</p>',
      '<p>I ran <strong>TestFlight</strong> with a small group of testers for a couple of weeks — enough to surface the issues that only show up on real devices and real shooting conditions — before submitting to the App Store.</p>',
      '<div class="cs-metrics">',
      '<div class="cs-metric"><div class="num">1 tap</div><div class="lbl">two finished files, auto-saved to Photos</div></div>',
      '<div class="cs-metric"><div class="num">4K/60</div><div class="lbl">unlocked by the single-source dual-crop pivot</div></div>',
      '<div class="cs-metric"><div class="num">Shipped</div><div class="lbl">App Store launch + a 2.0 personalization update</div></div>',
      '</div>',

      '<h2 id="reflection">Reflection</h2>',
      '<p><strong>Figma isn\'t dead.</strong> Even with agents doing the build, design still has to set the standard — the agents were far more useful with a clear target to build against. Design didn\'t get replaced; it became the thing that kept the output honest.</p>',
      '<p><strong>Ruthless prioritization is what ships things.</strong> Front dials, sectioned videos, and 60 FPS were all things I wanted, but cutting them is what let the core flow ship. The same instinct drove the architecture pivot — abandoning the impressive-but-flawed multi-cam approach for single-source dual-crop was a step backward on paper and the single best decision in the project.</p>',
      '<p><strong>It\'s easy to build anything — the hard part is not losing the purpose.</strong> When the tools let you make almost anything, the discipline is protecting the story you\'re telling, otherwise the app drifts into being just another barebones recorder.</p>',
      '<p><strong>I use my agents like a development team.</strong> I delegate, review, and redirect the same way I would with engineers, switching between models depending on the task. Treating them as a team rather than a single tool is what made the workflow scale.</p>',
    ].join('')
  },

  /* ---------------- Project 2 — Holiday (real, shipped) ---------------- */
  'holiday': {
    title: 'How Holiday Got Built — A Process Case Study',
    body: `
<h1>How Holiday Got Built</h1>
<p class="cs-deck">A process case study on Holiday — a trip-planning platform for travel agents and the clients they build itineraries for. Not a feature tour, but the document-driven method, the adversarial AI audit loop, and the scope decisions behind it. Built solo in a couple of months; first commit January 22, 2026.</p>

<div class="cs-carousel" data-carousel tabindex="0" aria-roledescription="carousel" aria-label="Project images">
  <button class="cs-car-btn prev" type="button" aria-label="Previous image">‹</button>
  <div class="cs-carousel-viewport"><div class="cs-carousel-track">
    <div class="cs-slide"><img src="assets/case_studies/holiday/holiday_hero.webp" alt="Holiday — a traveler's daily itinerary view" loading="lazy"></div>
    <div class="cs-slide"><img src="assets/case_studies/holiday/screen2.webp" alt="Holiday — app screen" loading="lazy"></div>
    <div class="cs-slide"><img src="assets/case_studies/holiday/screen3.webp" alt="Holiday — app screen" loading="lazy"></div>
    <div class="cs-slide"><img src="assets/case_studies/holiday/screen4.webp" alt="Holiday — app screen" loading="lazy"></div>
    <div class="cs-slide"><img src="assets/case_studies/holiday/screen5.webp" alt="Holiday — app screen" loading="lazy"></div>
  </div></div>
  <button class="cs-car-btn next" type="button" aria-label="Next image">›</button>
</div>

<h2 id="overview">Overview</h2>
<p>Holiday has two sides that share one source of truth. The desktop workspace is where a travel agent assembles a trip — days, places, files, tasks, and a live map. The client view, on web and mobile, is what the traveler carries: each day opens with an agenda, local weather, an AI-generated preview, and the transport ahead. The build ran on a repeatable method — write to decide, build against the document, audit the result with an AI collaborator, correct the audit, consolidate, cut, and repeat. From first sketch to a client using it live on a trip across Korea and Japan took a couple of months, working solo.</p>
<ul class="bullets">
<li><strong>Role:</strong> Sole product, design, build, audit, and QA.</li>
<li><strong>Tools:</strong> Figma · Claude Code · GitHub · Vercel · Supabase · Resend.</li>
<li><strong>Timeline:</strong> ~2 months, concept to a real client trip across Korea and Japan.</li>
<li><strong>Method:</strong> Write to decide → build → audit → correct → consolidate → cut → repeat.</li>
</ul>

<figure class="cs-diagram">
<svg viewBox="0 0 880 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Stack diagram: Figma feeds specs to Claude Code, which commits to GitHub, which deploys to Vercel; Vercel connects to Supabase for database and auth and to Resend for transactional email.">
  <defs>
    <marker id="hldyArrow" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#5b3df5"/></marker>
    <style>
      .nd{fill:#ffffff;stroke:#e7e5ea;stroke-width:1.5;}
      .nm{fill:#17151b;font:600 15px Inter,system-ui,sans-serif;}
      .sb{fill:#5c5866;font:400 11px 'IBM Plex Mono',monospace;}
      .eb{fill:#5b3df5;font:600 11px 'IBM Plex Mono',monospace;letter-spacing:.14em;}
      .al{fill:#5b3df5;font:500 11px 'IBM Plex Mono',monospace;}
      .ln{stroke:#5b3df5;stroke-width:1.8;fill:none;}
    </style>
  </defs>

  <text class="eb" x="14" y="30">BUILD &amp; SHIP</text>
  <text class="eb" x="556" y="232">RUNTIME</text>

  <!-- Row 1 nodes -->
  <g><rect class="nd" x="14" y="44" width="140" height="72" rx="12"/><circle cx="84" cy="64" r="4" fill="#f24e1e"/><text class="nm" x="84" y="90" text-anchor="middle">Figma</text><text class="sb" x="84" y="107" text-anchor="middle">design + specs</text></g>
  <g><rect class="nd" x="226" y="44" width="140" height="72" rx="12"/><circle cx="296" cy="64" r="4" fill="#d97757"/><text class="nm" x="296" y="90" text-anchor="middle">Claude Code</text><text class="sb" x="296" y="107" text-anchor="middle">agent build</text></g>
  <g><rect class="nd" x="438" y="44" width="140" height="72" rx="12"/><circle cx="508" cy="64" r="4" fill="#24292f"/><text class="nm" x="508" y="90" text-anchor="middle">GitHub</text><text class="sb" x="508" y="107" text-anchor="middle">version control</text></g>
  <g><rect class="nd" x="650" y="44" width="140" height="72" rx="12"/><circle cx="720" cy="64" r="4" fill="#111111"/><text class="nm" x="720" y="90" text-anchor="middle">Vercel</text><text class="sb" x="720" y="107" text-anchor="middle">hosting + deploy</text></g>

  <!-- Row 1 arrows -->
  <line class="ln" x1="156" y1="80" x2="222" y2="80" marker-end="url(#hldyArrow)"/><text class="al" x="189" y="74" text-anchor="middle">specs</text>
  <line class="ln" x1="368" y1="80" x2="434" y2="80" marker-end="url(#hldyArrow)"/><text class="al" x="401" y="74" text-anchor="middle">commits</text>
  <line class="ln" x1="580" y1="80" x2="646" y2="80" marker-end="url(#hldyArrow)"/><text class="al" x="613" y="74" text-anchor="middle">deploy</text>

  <!-- Row 2 nodes -->
  <g><rect class="nd" x="556" y="244" width="140" height="72" rx="12"/><circle cx="626" cy="264" r="4" fill="#3ecf8e"/><text class="nm" x="626" y="290" text-anchor="middle">Supabase</text><text class="sb" x="626" y="307" text-anchor="middle">database + auth</text></g>
  <g><rect class="nd" x="716" y="244" width="140" height="72" rx="12"/><circle cx="786" cy="264" r="4" fill="#111111"/><text class="nm" x="786" y="290" text-anchor="middle">Resend</text><text class="sb" x="786" y="307" text-anchor="middle">email</text></g>

  <!-- Branch arrows from Vercel -->
  <path class="ln" d="M704,116 C690,170 660,196 636,240" marker-end="url(#hldyArrow)"/><text class="al" x="606" y="186" text-anchor="end">Postgres + auth</text>
  <path class="ln" d="M738,116 C752,170 770,196 782,240" marker-end="url(#hldyArrow)"/><text class="al" x="800" y="186" text-anchor="start">email</text>
</svg>
<figcaption>The toolchain: design specs flow from Figma into the Claude Code agent build, which commits to GitHub and deploys via Vercel; the running app talks to Supabase for data and auth and to Resend for transactional email.</figcaption>
</figure>

<h2 id="background">Background</h2>
<h3>The origin</h3>
<p>The problem was specific and close. My wife was planning a trip for a client across Google Docs, Canva, spreadsheets, and Wanderlog. Information was lost between tools and duplicated across them; the same hotel lived in three places. The work was sound — the tooling was the constraint. Delivery was the second half of the problem: a finished itinerary ships as a PDF and goes static the moment it leaves the agent, so the traveler copies addresses into Maps and digs through email for a confirmation number exactly when they least want to. The craft of the itinerary doesn't survive the format.</p>
<p>The initial scope was deliberately narrow: make the itinerary itself the product — interactive on a phone rather than a document describing a trip. One shareable screen, one user, the agent at my kitchen table. The bar was not a merely usable product but one she would <em>choose</em> to use — and that bar later justified removing anything that compromised it.</p>
<h3>The market</h3>
<p>The existing tools sort into three modes, roughly in the order a self-planner moves through them. <strong>Search</strong> is the earliest — discovering places, the most basic being Google Maps (pin a spot, return to it later) and, increasingly, general AI assistants that pull places and information from the web on demand. <strong>Collection</strong> is a distinct mode, not just more search: once you've found things, you save and organize them. Wanderlog is the clearest example — categorize places, attach information, organize by location, share. <strong>Itinerary building</strong> goes further, turning a collection into an actual day-by-day plan; Docent Pro moves closest, built around creating and publishing itineraries. What they share is that they serve travelers who plan for themselves.</p>
<p>Holiday is built for the opposite segment: travelers who hire a travel agent, and the agents who serve them. The axis that matters isn't novelty or spend, it's <strong>delegation</strong> — the advisor client deliberately hands the work to an expert, paying for curation, access, and trust. An AI model can assemble an itinerary from public information; it cannot secure a preferred rate or a guaranteed upgrade. So Holiday doesn't compete in search or collection. It consolidates the agent's fragmented building tools and then owns the part no one else does — the hand-off and the live trip — placing AI on top of the agent's curated work rather than in opposition to it.</p>
<ul class="bullets">
<li><strong>~16%</strong> of U.S. travelers used an agent in 2025.</li>
<li><strong>~22%</strong> say they're likely to within two years.</li>
<li><strong>84%</strong> of luxury travelers value a trusted advisor over internet research.</li>
</ul>
<p>The market gap isn't "help me plan" — it's "make what my agent planned excellent to carry and use."</p>

<figure class="cs-diagram">
<svg viewBox="0 0 960 304" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The trip-planning process in five stages — Search, Collection, Itinerary, Delivery, On-trip. Existing tools cover the first three modes; Holiday spans Itinerary, Delivery, and On-trip.">
  <defs>
    <marker id="hldyArrow2" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#5b3df5"/></marker>
    <style>
      .peb{fill:#5b3df5;font:600 11px 'IBM Plex Mono',monospace;letter-spacing:.12em;}
      .pnm{fill:#17151b;font:600 14px Inter,system-ui,sans-serif;}
      .psb{fill:#5c5866;font:400 10.5px 'IBM Plex Mono',monospace;}
      .ptl{fill:#8c8896;font:400 10px 'IBM Plex Mono',monospace;}
      .pln{stroke:#5b3df5;stroke-width:1.7;fill:none;}
      .pbr{stroke:#5b3df5;stroke-width:1.2;fill:none;}
      .ptik{stroke:#5b3df5;stroke-opacity:.45;stroke-width:1.4;stroke-dasharray:3 3;fill:none;}
      .pbx{fill:#ffffff;stroke:#5b3df5;stroke-width:1.5;}
      .pbg{fill:#ffffff;stroke:#cfcdd6;stroke-width:1.5;}
      .pbn{fill:#5b3df5;font:600 13px Inter,system-ui,sans-serif;}
      .pcap{fill:#5c5866;font:400 11.5px Inter,system-ui,sans-serif;}
    </style>
  </defs>

  <text class="peb" x="14" y="18">THE TRIP-PLANNING PROCESS</text>

  <!-- bracket over the three market modes -->
  <path class="pbr" d="M14,50 L14,46 L508,46 L508,50"/>
  <text class="peb" x="261" y="40" text-anchor="middle" style="font-size:9.5px">THE MARKET'S THREE MODES</text>

  <!-- stage boxes -->
  <g><rect class="pbx" x="14" y="58" width="150" height="80" rx="12"/><text class="pnm" x="89" y="86" text-anchor="middle">Search</text><text class="psb" x="89" y="105" text-anchor="middle">find places</text><text class="ptl" x="89" y="124" text-anchor="middle">Google Maps · AI chat</text></g>
  <g><rect class="pbx" x="186" y="58" width="150" height="80" rx="12"/><text class="pnm" x="261" y="86" text-anchor="middle">Collection</text><text class="psb" x="261" y="105" text-anchor="middle">save &amp; organize</text><text class="ptl" x="261" y="124" text-anchor="middle">Wanderlog · Maps lists</text></g>
  <g><rect class="pbx" x="358" y="58" width="150" height="80" rx="12"/><text class="pnm" x="433" y="86" text-anchor="middle">Itinerary</text><text class="psb" x="433" y="105" text-anchor="middle">build the trip</text><text class="ptl" x="433" y="123" text-anchor="middle">Docs · Canva · Sheets</text><text class="ptl" x="433" y="135" text-anchor="middle">· Docent Pro</text></g>
  <g><rect class="pbg" x="530" y="58" width="150" height="80" rx="12"/><text class="pnm" x="605" y="86" text-anchor="middle">Delivery</text><text class="psb" x="605" y="105" text-anchor="middle">hand off</text><text class="ptl" x="605" y="124" text-anchor="middle">PDF / shared doc</text></g>
  <g><rect class="pbg" x="702" y="58" width="150" height="80" rx="12"/><text class="pnm" x="777" y="86" text-anchor="middle">On-trip</text><text class="psb" x="777" y="105" text-anchor="middle">use it live</text><text class="ptl" x="777" y="124" text-anchor="middle">Maps + inbox scramble</text></g>

  <!-- flow arrows -->
  <line class="pln" x1="167" y1="98" x2="183" y2="98" marker-end="url(#hldyArrow2)"/>
  <line class="pln" x1="339" y1="98" x2="355" y2="98" marker-end="url(#hldyArrow2)"/>
  <line class="pln" x1="511" y1="98" x2="527" y2="98" marker-end="url(#hldyArrow2)"/>
  <line class="pln" x1="683" y1="98" x2="699" y2="98" marker-end="url(#hldyArrow2)"/>

  <!-- span ticks down to the Holiday band -->
  <line class="ptik" x1="433" y1="138" x2="433" y2="200"/>
  <line class="ptik" x1="605" y1="138" x2="605" y2="200"/>
  <line class="ptik" x1="777" y1="138" x2="777" y2="200"/>

  <!-- Holiday band -->
  <rect x="358" y="200" width="494" height="46" rx="12" fill="#efeafe" stroke="#5b3df5" stroke-width="1.5"/>
  <text class="pbn" x="605" y="228" text-anchor="middle">HOLIDAY · one place to build, deliver &amp; travel — in sync</text>

  <!-- caption -->
  <text class="pcap" x="433" y="276" text-anchor="middle">Today's tools cluster in search, collection, and itinerary-building — then the plan goes static at hand-off.</text>
  <text class="pcap" x="433" y="293" text-anchor="middle">Holiday consolidates the build and owns what no one else does: delivery and the live, on-trip experience.</text>
</svg>
<figcaption>Where Holiday fits in the trip-planning process: existing tools cover the three self-serve modes, while Holiday unifies itinerary-building and owns delivery and the live trip — the stages that break today.</figcaption>
</figure>

<h2 id="approach">Approach</h2>
<h3>Documents as the medium</h3>
<p>The repository carries roughly twenty planning documents: the original pitch, five successive feature audits, targeted remediation and publishing plans, a consolidated execution roadmap, single-feature specs, the mobile plan written before any Swift, and a <code>CLAUDE.md</code> architecture reference kept current for the AI collaborator. These were the working medium, not after-the-fact records. When a direction was unclear, I wrote — usually in dialogue with Claude — until the decision resolved. Each document became a specification, the specification became commits, and a later document evaluated those commits. The chain compounded: the pitch drove the build, the build produced the audits, the audits produced the execution plan, the plan drove the cleanup.</p>
<h3>The feedback loop</h3>
<p>The product was audited five times, and each audit graded the ones before it. Every later pass opened with a "Corrections From Previous Audits" section — earlier passes were confident and occasionally wrong; later passes didn't only surface new issues, they falsified earlier conclusions.</p>
<ul class="bullets">
<li><em>"Drag-and-drop not keyboard accessible" (v1)</em> → <strong>Wrong. Fixed in v2</strong> — KeyboardSensor already configured.</li>
<li><em>"~40% images lack alt text" (v1)</em> → <strong>Overstated.</strong> Only 4–5 specific images needed work.</li>
<li><em>"No startup env validation" (v3)</em> → <strong>Partially wrong.</strong> Zod was installed, just not wired up.</li>
</ul>
<p>This is where the AI collaborator produced the most leverage — not in generating features, but in the adversarial cycle: audit the work, audit the audit with a fresh pass, then reconcile the contradictions. Five passes produced 35 open findings across five documents, which were then consolidated into a single execution plan ordered by priority: security first, then foundations, data integrity, performance, and finally accessibility and SEO.</p>

<h3>Prioritizing the feature set</h3>
<p>Every feature was judged against one question: does it serve the single thing the product is for — an agent's curation that survives in the traveler's hands? That filter sorted the work into tiers, and the two anchor screens each user comes for set the bar: the agent's overview of their book of work, and the traveler's itinerary. Everything else had to earn its place supporting those two.</p>
<ul class="bullets">
<li><strong>The core loop — built first, never compromised.</strong> The itinerary builder on the agent's side (days, locations, a live map, auto-fetched photos, timing, notes) and the day-by-day itinerary on the traveler's side. This is the product's reason to exist: build once, reflect everywhere, one source of truth instead of four disconnected tools. Nothing shipped that compromised it.</li>
<li><strong>Trust when the agent is unreachable — the second priority, after the cut.</strong> Passwordless OTP login with no account to create, real-time chat, AI daily briefings, and files attached to the specific event they belong to. These won priority because the product's measure of success is supporting the traveler at midnight in an unfamiliar city, when no one is awake to help — so the late-night "which restaurant was Thursday?" resolves without the agent.</li>
<li><strong>The agent's business layer — important but downstream.</strong> Sharing and access modes, client and collaborator roles, Stripe Connect monetization, a public creator profile, and affiliate-capable link previews. This lets an agent run their practice on the platform, but it only matters once the core loop is trustworthy, so it was built on top of a working foundation rather than alongside it.</li>
<li><strong>Cut or deferred — good features that blurred the purpose.</strong> A Collections/Places research library, an Activity feed, a Stories carousel, access logging, and per-trip theming. Each was defensible in isolation; together they added steps agents didn't want — the Places library was the clearest case, a research detour when agents just wanted to build a trip and share it. Removing them, roughly ten thousand lines, sharpened the product more than any addition would have.</li>
</ul>
<p>The priority order wasn't arbitrary: it follows the product's success measure. Because success is the traveler staying supported when the agent can't be present, the features that carry the agent's curation outrank everything that merely adds capability.</p>

<h2 id="solution">Solution</h2>
<h3>Two sides, one source of truth</h3>
<p>The <strong>desktop view is the agent's workspace</strong> — days, places, photos, timing, notes, tasks, and a live map in one environment. The <strong>client view</strong> is what travelers carry: organized around how a traveler moves through a day, with an agenda, local weather, an AI-generated daily preview, and the transport ahead. The itinerary is built once and reflected on the traveler's phone — one source of truth rather than four disconnected tools.</p>
<h3>The experience changes with the trip's timeline</h3>
<p>The same itinerary behaves differently before, during, and after the trip. <strong>Before</strong>, it's something the client reviews — the whole arc, the days ahead, building confidence and anticipation. <strong>During</strong>, today becomes the anchor: the current day surfaces first, and key events are surfaced dynamically by relevance and proximity in time — tonight's reservation matters more than tomorrow's train. <strong>After</strong>, past days collapse to the bottom rather than disappearing, so a traveler can still pull up a confirmation or a receipt. One itinerary reads as a plan beforehand, a live guide during, and a record afterward.</p>
<h3>Engineering the integrations</h3>
<p>Several features depended on outside APIs, and each imposed constraints on how data was structured, stored, and timed.</p>
<p><strong>The daily briefing demanded structure the itinerary deliberately lacked.</strong> The preview composes from weather (Open-Meteo) and an Anthropic model, but the model couldn't be handed the itinerary as-is. The builder is intentionally open-ended so an agent can capture any kind of trip — and that flexibility made it hard to derive a clean, ordered day, because the pieces don't behave like uniform "stops." A hotel spans a range of days rather than sitting at a single point in time. Transportation isn't a place you browse; it carries a hard departure the traveler has to catch, so it has to be ordered by time and surfaced with urgency. A flight has an origin and a destination, so it can change where the traveler is for the rest of that day or the next, moving the day's context across a boundary. The briefing had to reconcile all of it into one ordered, bounded input — the day's agenda in sequence, in correct local time, with only the relevant locations — before the model ever saw it; the output was then stored rather than regenerated on every view, keeping it fast and cost-predictable. The structure of the input determined the quality of the output as much as the model did.</p>
<ul class="bullets">
<li><strong>Image storage.</strong> The first version fetched Google Places photos on demand; references expire, so images timed out and left broken thumbnails in older trips. The fix: fetch each photo once when a location is added, store it, serve the stored copy.</li>
<li><strong>Navigation data.</strong> Google directions APIs supply per-stop commute times so the agent sees travel time while building the day; a client-side Haversine estimate covers basic distance cheaply.</li>
<li><strong>Rich link previews.</strong> Task links render as clean preview cards — and can carry affiliate URLs, turning a task list into a place where the agent both organizes and monetizes the trip.</li>
</ul>

<h2 id="outcomes">Outcomes</h2>
<ul class="bullets">
<li><strong>5</strong> audits, each grading the last.</li>
<li><strong>~10,000</strong> lines removed in a single pass, plus 6 tables dropped.</li>
<li><strong>3</strong> standalone plans plus the audits, consolidated into 1 execution roadmap.</li>
<li><strong>~20</strong> planning documents recording the build.</li>
</ul>
<h3>Measuring success</h3>
<p>Success for a product like this is inverse: how little the agent has to be available for the client. An agent invests days in a trip, then the client travels to another time zone where the agent can't be continuously reachable. Holiday's role is to carry the agent's curation when the agent is unreachable — to answer the late-night "which restaurant was Thursday?" without requiring anyone to be awake. Done reliably, the agent can serve more clients because each requires less live support, and the traveler stays inside the designed experience rather than reverting to scattered tools on arrival.</p>
<h3>Validated on a real 21-day trip</h3>
<p>The sharpest proof was a client who ran a full 21-day vacation on the app. For the first 14 days we traveled alongside them — on-the-ground testing that turned the trip into rapid iteration, where a problem that surfaced in the morning was often fixed against the exact conditions that produced it by that evening. By the final stretch the client was using it entirely on their own across Tokyo, with no one beside them — which is the product working as intended: the agent's curation standing in for the agent when the agent isn't there.</p>

<h2 id="challenges">Challenges</h2>
<h3>Scope was the hardest problem</h3>
<p>Scope didn't drift gradually; it shifted at a few decision points, and managing it was the central difficulty. The rename from "Wanderlust" to <strong>Holiday</strong> on February 4 was a scope decision, not a cosmetic one — the same change removed a per-trip theming feature that worked but was premature. February and March were the densest build period, and not all of it held up: a Collections/Places library, an Activity feed, a Stories carousel, access logging. Each was defensible in isolation; together they blurred the product's definition.</p>
<p>Around March 22 I applied a stricter test — not whether a feature was good, but whether it served the product's single purpose. Several well-built features failed it. Collections, Places, the Activity feed, Stories, and access logging were removed — roughly ten thousand lines across dozens of files and six database tables — in one focused pass. The week that followed was the most productive of the project, because every decision had one filter: does this improve the traveler's experience? It produced passwordless login, real-time chat, the AI daily previews, and reviews. The mobile app got the same discipline before any code: a client-only viewer, not a full port.</p>
<h3>Real-world edge cases (Korea and Japan)</h3>
<p>The decisive validation was that real client trip across Korea and Japan — the same 21-day vacation — which surfaced what testing could not.</p>
<ul class="bullets">
<li><strong>Copy the name, not only the address.</strong> Abroad, a romanized address can fail, so the venue name is often the more reliable search input. The copy action had to provide both.</li>
<li><strong>Two countries, multiple scripts.</strong> The itinerary spanned Hangul, Katakana, and Latin text simultaneously — exercising rendering, copy/paste, and search across character sets.</li>
<li><strong>Map-data ownership.</strong> In Korea, NAVER holds the dominant navigation data, so per-stop commute times built on another provider silently disappeared — an unacceptable outcome that points to regional providers, not graceful degradation.</li>
<li><strong>Files belong to events, not a folder.</strong> A ticket's QR code can be appended to a scheduled train so the boarding code appears on that leg exactly when the traveler is at the platform. Validated directly: boarding a shinkansen with the QR pulled from the itinerary.</li>
</ul>

<h2 id="reflection">Reflection</h2>
<p><strong>Write the documents before the code, and allow them to be wrong.</strong> The most useful documents were the audits that later proved partly wrong — an error on paper costs far less than the same error in production. <strong>The AI collaborator's value is strongest in auditing, not only building.</strong> Five mutually correcting passes produced a grounded list of what actually mattered; a single pass would have produced confidence without accuracy. <strong>Removing scope is the higher-skill decision.</strong> The product improved most the day ten thousand lines were deleted.</p>
<p><strong>Parity came before novelty, because the agent's habits set the bar.</strong> Travel agents had real resistance to a prompt-everything interface; search and add were the familiar moves from tools like Wanderlog. So the priority order wasn't to introduce a new paradigm — it was to reach parity by completing the jobs-to-be-done across the whole suite of tools she used today, so her entire process could live in Holiday. Earn the daily workflow first; the augmentation is only adopted once the tool has actually replaced what it's competing with.</p>
<p><strong>Scoping down meant auditing for dead concepts — and watching the collaborator's context.</strong> Part of keeping the build fast was removing old concepts that were quietly slowing progress, and the audits existed partly to find them. A subtler version showed up in the AI workflow itself: when the context window stretched too far, the collaborator began to regress, reintroducing problems it had already solved. It bit a few times while building interaction patterns like drag-and-drop. Keeping context tight and current — short specs and an up-to-date <code>CLAUDE.md</code> — was as much about preventing regressions as about clarity.</p>
<p><strong>The hardest shift was breaking away from the software-UI wrapper.</strong> For most of the build, value lived in screens and interactions. The daily preview was where that broke down — composing a perspective on a day isn't rendering a record, and it pushed the work toward augmentation rather than UI. But that move was only possible because the data layer underneath was organized and bounded. You can't build a trustworthy layer that reads context and responds unless the thing it reads — the agent's curation — is structured first. The interface stopped being the product and became one layer over the data.</p>
<p><strong>The next version is native, not just responsive.</strong> Holiday is built almost entirely as a React web app — the right call for moving fast and keeping one codebase across both sides. But the traveler's context — abroad, on the move, often without reliable data — argues for supporting iOS and Android apps next. Native unlocks two things the web can't do well. <strong>Push notifications</strong> for the time-critical moments: an imminent reservation, a departure to catch, a change in the weather, a message from the agent — delivered when they matter rather than when the app happens to be open. And <strong>offline mode</strong>, so the itinerary, confirmations, and boarding passes are stored on the device and stay available with no signal and no SIM. Both map directly to the product's job: support the traveler when the agent — and the network — can't be reached.</p>
<p>That points to a layered model: <strong>data</strong> (the agent's authoritative, bounded itinerary), <strong>software</strong> (the workspace and client view, largely built), and <strong>augmentation</strong> (the layer that reads context and responds — surfacing what's relevant now, deferring what isn't, providing depth on demand). The daily preview was the first instance. Augmentation is trustworthy only because the data beneath it is the agent's real work rather than inference; the system surfaces and extends the agent's judgment rather than replacing it. Protecting that judgment is also the competitive point — it's how the agent won the client and how they keep them, an experience the client couldn't get from anyone else. The goal is for a trip to be as good to experience as it was to plan.</p>
`
  }
};
