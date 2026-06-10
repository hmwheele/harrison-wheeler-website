/* =====================================================================
   case-studies.js — single source of truth for case-study content.
   Each entry is rendered inline into the overlay sheet (no sub-pages).
   `body` is the inner HTML of .cs-main; the TOC is generated from its
   <h2 id="..."> headings automatically by overlay.js.
   ===================================================================== */
window.CASE_STUDIES = {

  /* ---------------- Leadership 1 (fully written) ---------------- */
  'quality': {
    title: 'Making the Case for Quality as a Business Strategy',
    body: [
      '<h1>Making the Case for Quality as a Business Strategy</h1>',
      '<p class="cs-deck">How a self-serve mandate became the foundation for experimentation, lifecycle thinking, and a new audience for Campaign Manager — and how quality stopped being a "nice to have" and became the business case.</p>',
      '<div class="cs-carousel" data-carousel tabindex="0" aria-roledescription="carousel" aria-label="Project images">' +
  '<button class="cs-car-btn prev" type="button" aria-label="Previous image">‹</button>' +
  '<div class="cs-carousel-viewport"><div class="cs-carousel-track">' +
    '<div class="cs-slide"><span class="cs-slide-tag">01</span></div>' +
    '<div class="cs-slide"><span class="cs-slide-tag">02</span></div>' +
    '<div class="cs-slide"><span class="cs-slide-tag">03</span></div>' +
  '</div></div>' +
  '<button class="cs-car-btn next" type="button" aria-label="Next image">›</button>' +
'</div>',

      '<h2 id="overview">Overview</h2>',
      '<p>We were an enterprise product moving toward self-serve: working under a company-wide quality mandate, with customer-side hosting already showing what self-serve could do. The quality push and the self-serve bet existed on their own — and this work was about building the connective tissue between them.</p>',

      '<h2 id="background">Background</h2>',
      '<h3>Compounding debt</h3>',
      '<p>The product carried debt on three fronts at once. The surfaces a customer touched — onboarding, notifications, recommendations, billing — existed, but each connected to a different system. A campaign\'s flow path was about 30 days, yet the UX treated every touchpoint as a one-off. ROI on a campaign doesn\'t show up right away, and the product wasn\'t designed so that the flow continues.</p>',
      '<h3>Pushback</h3>',
      '<p>The objection was direct, and it came from leadership: "Self-serve isn\'t our ideal customer." The belief that shaped the product was deeply held, and changing it was as much of the work as the design itself.</p>',
      '<h3>Quality at the all-hands</h3>',
      '<p>I presented part of this at our company-wide all-hands. A list of the top 50 issues went to the center of the backlog — even though those were the exact issues customers kept raising. The customer-side bets made the case that it had to be addressed.</p>',

      '<h2 id="approach">Approach</h2>',
      '<p>The work spanned the product surfaces inside LinkedIn Marketing Solutions: Campaign Manager, Audiences, Measurement, and Reporting &amp; Optimization. We started by understanding the data, identifying gaps, illustrating the marketing lifecycle, developing a systems-level narrative, and earning buy-in.</p>',
      '<h3>Understanding the data</h3>',
      '<p>The numbers showed how much opportunity was being left on the table. Onboarding took customers over 30 days, about 20% of new customers churned within the first week, and satisfaction sat at a historic low.</p>',
      '<table class="cs-table">',
      '<caption>Baseline vs. post-launch (placeholder figures)</caption>',
      '<thead><tr><th>Metric</th><th>Before</th><th>After</th><th>Change</th></tr></thead>',
      '<tbody>',
      '<tr><td>Time to first campaign</td><td>30+ days</td><td>16 days</td><td>−14 days</td></tr>',
      '<tr><td>First-week churn</td><td>20%</td><td>11%</td><td>−9 pts</td></tr>',
      '<tr><td>Completed onboarding</td><td>—</td><td>—</td><td>+32%</td></tr>',
      '<tr><td>Audiences engagement</td><td>—</td><td>—</td><td>+70%</td></tr>',
      '</tbody>',
      '</table>',
      '<h3>Illustrating the marketing lifecycle</h3>',
      '<p>I mapped the customer journey from day one to day 30 as one continuous lifecycle instead of a set of disconnected screens — install the insight tag, create a campaign, build an audience, launch, review, optimize. Putting it on a single timeline made the gaps between surfaces obvious.</p>',
      '<h3>Develop a systems-level narrative</h3>',
      '<p>To give every product surface a story, I connected each initiative to the things people already cared about: the job to be done, the customer, the KPI, the surface, and where it mattered. It turned scattered, one-off efforts into a single narrative that made the gaps clear.</p>',

      '<h2 id="solution">Solution</h2>',
      '<p>A few insights shaped the design:</p>',
      '<ul class="bullets">',
      '<li>Surface help and content earlier, when self-serve customers are most likely to get stuck.</li>',
      '<li>A clear <strong>Create</strong> entry point to drive new campaign creation.</li>',
      '<li>Onboarding that helps customers launch faster and adopt the right tag.</li>',
      '<li>A campaign overview that reads overall performance at a glance.</li>',
      '<li>Best practices and incentives — credits and discounts to ease first-campaign launches.</li>',
      '</ul>',
      '<h3>Trade-offs</h3>',
      '<p>Not everything made the cut. We cut a notifications-as-growth surface, an AI-generated asset creator, and a unified copy system. Experimentation needed guardrails so it didn\'t sprawl, so — working with the PM who owned the pipeline — we defined what counted as an experiment and where experiments could run.</p>',

      '<h2 id="outcomes">Outcomes</h2>',
      '<div class="cs-metrics">',
      '<div class="cs-metric"><div class="num">14-day</div><div class="lbl">reduction in time-to-value churn</div></div>',
      '<div class="cs-metric"><div class="num">32%</div><div class="lbl">increase in completed onboarding</div></div>',
      '<div class="cs-metric"><div class="num">70%</div><div class="lbl">increase in Audiences engagement</div></div>',
      '<div class="cs-metric"><div class="num">5×</div><div class="lbl">increase in successful self-serve onboarding</div></div>',
      '</div>',

      '<h2 id="reflection">Reflection</h2>',
      '<p>Product definitions calcify. The "ideal customer" wasn\'t wrong so much as incomplete — and the incomplete version was costing us a growth segment. Cross-team vision is a design-leadership artifact: teams don\'t need alignment lectures, they need tools that make their own work easier to socialize. Foundations are unglamorous but necessary — a strong platform needs that baseline before anything else can stand on it.</p>',
      '<p class="cs-note">Note: figures and narrative above are placeholder content drawn from the Figma example. Replace with the final approved copy and visuals.</p>'
    ].join('')
  },

  /* ---------------- Leadership 2 (placeholder) ---------------- */
  'leadcraft': {
    title: 'Building LeadCraft: A Platform for Design Leaders',
    body: [
      '<h1>Building LeadCraft: A Platform for Design Leaders</h1>',
      '<p class="cs-deck">From a single community workshop to a product used by design leaders navigating an era where everything — including how we work with AI — is changing.</p>',
      '<div class="cs-carousel" data-carousel tabindex="0" aria-roledescription="carousel" aria-label="Project images">' +
  '<button class="cs-car-btn prev" type="button" aria-label="Previous image">‹</button>' +
  '<div class="cs-carousel-viewport"><div class="cs-carousel-track">' +
    '<div class="cs-slide"><span class="cs-slide-tag">01</span></div>' +
    '<div class="cs-slide"><span class="cs-slide-tag">02</span></div>' +
    '<div class="cs-slide"><span class="cs-slide-tag">03</span></div>' +
  '</div></div>' +
  '<button class="cs-car-btn next" type="button" aria-label="Next image">›</button>' +
'</div>',
      '<h2 id="overview">Overview</h2><p>Placeholder. A short framing of what LeadCraft is, who it\'s for, and the moment that made it necessary.</p>',
      '<h2 id="background">Background</h2><p>Placeholder. The problem design leaders were facing and the gap in existing tools and communities.</p>',
      '<h2 id="approach">Approach</h2><h3>Starting with the community</h3><p>Placeholder. How the first workshop validated demand and shaped the concept.</p><h3>From workshop to product</h3><p>Placeholder. Decisions about scope, format, and what to build first.</p>',
      '<h2 id="solution">Solution</h2><ul class="bullets"><li>Placeholder feature one.</li><li>Placeholder feature two.</li><li>Placeholder feature three.</li></ul>',
      '<h2 id="outcomes">Outcomes</h2><div class="cs-metrics"><div class="cs-metric"><div class="num">1,000+</div><div class="lbl">design leaders reached</div></div><div class="cs-metric"><div class="num">—</div><div class="lbl">placeholder metric</div></div><div class="cs-metric"><div class="num">—</div><div class="lbl">placeholder metric</div></div></div>',
      '<h2 id="reflection">Reflection</h2><p>Placeholder. What you learned building a product for your own community.</p>',
      '<p class="cs-note">Note: placeholder scaffold — replace with final copy and visuals.</p>'
    ].join('')
  },

  /* ---------------- Project 1 (placeholder) ---------------- */
  'video-recorder': {
    title: 'Record Vertical and Horizontal Video Simultaneously',
    body: [
      '<h1>Record Vertical and Horizontal Video Simultaneously</h1>',
      '<p class="cs-deck">A 0→1 side project that simplifies video production for creators — capture one moment, get both vertical and horizontal framing, ready for every platform.</p>',
      '<div class="cs-carousel" data-carousel tabindex="0" aria-roledescription="carousel" aria-label="Project images">' +
  '<button class="cs-car-btn prev" type="button" aria-label="Previous image">‹</button>' +
  '<div class="cs-carousel-viewport"><div class="cs-carousel-track">' +
    '<div class="cs-slide"><span class="cs-slide-tag">01</span></div>' +
    '<div class="cs-slide"><span class="cs-slide-tag">02</span></div>' +
    '<div class="cs-slide"><span class="cs-slide-tag">03</span></div>' +
  '</div></div>' +
  '<button class="cs-car-btn next" type="button" aria-label="Next image">›</button>' +
'</div>',
      '<h2 id="overview">Overview</h2><p>Placeholder. The one-line pitch and why this problem is worth solving for content creators.</p>',
      '<h2 id="background">Background</h2><p>Placeholder. The pain today — reshooting or awkwardly cropping the same content for different aspect ratios.</p>',
      '<h2 id="approach">Approach</h2><h3>Defining the constraint</h3><p>Placeholder. The core technical/UX constraint and how you framed it.</p><h3>Prototyping the capture flow</h3><p>Placeholder. How you tested the dual-framing idea.</p>',
      '<h2 id="solution">Solution</h2><ul class="bullets"><li>Placeholder capability one.</li><li>Placeholder capability two.</li><li>Placeholder capability three.</li></ul>',
      '<h2 id="outcomes">Outcomes</h2><div class="cs-metrics"><div class="cs-metric"><div class="num">2×</div><div class="lbl">faster multi-format publishing</div></div><div class="cs-metric"><div class="num">—</div><div class="lbl">placeholder metric</div></div><div class="cs-metric"><div class="num">—</div><div class="lbl">placeholder metric</div></div></div>',
      '<h2 id="reflection">Reflection</h2><p>Placeholder. What building this taught you and where it could go next.</p>',
      '<p class="cs-note">Note: placeholder scaffold — replace with final copy and visuals.</p>'
    ].join('')
  },

  /* ---------------- Project 2 (placeholder) ---------------- */
  'travel-advisors': {
    title: 'Helping Travel Advisors Build a Better, More Personalized Experience',
    body: [
      '<h1>Helping Travel Advisors Build a Better and More Personalized Experience</h1>',
      '<p class="cs-deck">A concept project reimagining the travel-advisor toolkit — an end-to-end shift from logistics-first booking to experience-centric, personalized custom tours.</p>',
      '<div class="cs-carousel" data-carousel tabindex="0" aria-roledescription="carousel" aria-label="Project images">' +
  '<button class="cs-car-btn prev" type="button" aria-label="Previous image">‹</button>' +
  '<div class="cs-carousel-viewport"><div class="cs-carousel-track">' +
    '<div class="cs-slide"><span class="cs-slide-tag">01</span></div>' +
    '<div class="cs-slide"><span class="cs-slide-tag">02</span></div>' +
    '<div class="cs-slide"><span class="cs-slide-tag">03</span></div>' +
  '</div></div>' +
  '<button class="cs-car-btn next" type="button" aria-label="Next image">›</button>' +
'</div>',
      '<h2 id="overview">Overview</h2><p>Placeholder. The premise of the concept and the experience it\'s trying to unlock.</p>',
      '<h2 id="background">Background</h2><p>Placeholder. Why today\'s advisor tools optimize for logistics over experience, and what gets lost.</p>',
      '<h2 id="approach">Approach</h2><h3>Mapping the advisor\'s day</h3><p>Placeholder. The workflow you studied and the moments that matter.</p><h3>Designing for personalization</h3><p>Placeholder. How you built personalization into the flow.</p>',
      '<h2 id="solution">Solution</h2><ul class="bullets"><li>Placeholder capability one.</li><li>Placeholder capability two.</li><li>Placeholder capability three.</li></ul>',
      '<h2 id="outcomes">Outcomes</h2><div class="cs-metrics"><div class="cs-metric"><div class="num">—</div><div class="lbl">placeholder metric</div></div><div class="cs-metric"><div class="num">—</div><div class="lbl">placeholder metric</div></div><div class="cs-metric"><div class="num">—</div><div class="lbl">placeholder metric</div></div></div>',
      '<h2 id="reflection">Reflection</h2><p>Placeholder. What the concept revealed about designing for expert users and personalization at scale.</p>',
      '<p class="cs-note">Note: placeholder scaffold — replace with final copy and visuals.</p>'
    ].join('')
  }
};
