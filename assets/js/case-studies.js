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

  /* ---------------- Project 1 — Dual Creator Cam ---------------- */
  'video-recorder': {
    title: 'Dual Creator Cam — One Tap, Two Finished Videos',
    body: [
      '<h1>Dual Creator Cam</h1>',
      '<p class="cs-deck">A 0→1 iOS app that turns one tap into two finished videos — a vertical file for Reels and TikTok, a horizontal file for YouTube — auto-saved to Photos, no reshoot, no cropping in post. Designed and built solo with Claude Code, Xcode, and Figma over a year of travel.</p>',
      '<div class="cs-carousel" data-carousel tabindex="0" aria-roledescription="carousel" aria-label="Project images">' +
  '<button class="cs-car-btn prev" type="button" aria-label="Previous image">‹</button>' +
  '<div class="cs-carousel-viewport"><div class="cs-carousel-track">' +
    '<div class="cs-slide"><span class="cs-slide-tag">Recording HUD</span></div>' +
    '<div class="cs-slide"><span class="cs-slide-tag">Use-case survey</span></div>' +
    '<div class="cs-slide"><span class="cs-slide-tag">9:16 vs 16:9</span></div>' +
    '<div class="cs-slide"><span class="cs-slide-tag">Record-button finishes</span></div>' +
    '<div class="cs-slide"><span class="cs-slide-tag">Figma scaffold</span></div>' +
    '<div class="cs-slide"><span class="cs-slide-tag">Media library</span></div>' +
  '</div></div>' +
  '<button class="cs-car-btn next" type="button" aria-label="Next image">›</button>' +
'</div>',

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
      '<div class="cs-figure"><span>Photo — consent flow</span></div>',
      '<p>There are deliberately <strong>no accounts</strong> — analytics run on an anonymous per-install ID with no personal data attached. What the app does need is system permission across camera, microphone, and photo library, so I designed the consent flow to request these clearly and in context rather than dumping every prompt at once.</p>',
      '<p>A <strong>three-step onboarding</strong> orients people on recording, orientation switching, and where their media lives — enough to communicate value, short enough to get out of the way.</p>',
      '<div class="cs-carousel cs-carousel--portrait" data-carousel tabindex="0" aria-roledescription="carousel" aria-label="Onboarding steps">' +
  '<button class="cs-car-btn prev" type="button" aria-label="Previous step">‹</button>' +
  '<div class="cs-carousel-viewport"><div class="cs-carousel-track">' +
    '<div class="cs-slide"><span class="cs-slide-tag">Step 1 — Recording</span></div>' +
    '<div class="cs-slide"><span class="cs-slide-tag">Step 2 — Orientation switching</span></div>' +
    '<div class="cs-slide"><span class="cs-slide-tag">Step 3 — Media library</span></div>' +
  '</div></div>' +
  '<button class="cs-car-btn next" type="button" aria-label="Next step">›</button>' +
'</div>',
      '<h3>Personalization (the 2.0 centerpiece)</h3>',
      '<div class="cs-grid">' +
        '<div class="cs-figure"><span>Photo — Chrome finish</span></div>' +
        '<div class="cs-figure"><span>Photo — Matte finish</span></div>' +
        '<div class="cs-figure"><span>Photo — Gem finish</span></div>' +
        '<div class="cs-figure"><span>Photo — Soccer ball finish</span></div>' +
      '</div>',
      '<p>Traveling through Asia, I saw how big personalization is in creator culture — custom cases, themed accessories, character straps. Given how many apps look alike, and that women make up slightly over half of all creators (up to 76% on TikTok and 79% on Instagram), I made the one control you stare at the whole shoot yours: four record-button finishes — Chrome, Matte, a faceted gem (with its own Metal shader), and a soccer ball — plus color themes. 2.0 also added the ability to start a Dual or Single recording straight from the <strong>Lock Screen and Control Center</strong> without opening the app, and a redesigned capture HUD with a live timer and an at-a-glance format readout.</p>',
      '<h3>The hard problems</h3>',
      '<div class="cs-figure"><span>Photo — dual-crop in the camera pipeline</span></div>',
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
      '<p class="cs-note">Note: carousel slides are screenshot placeholders — drop in real captures (recording HUD, use-case survey, 9:16 vs 16:9 framing, record-button finishes, Figma scaffold, media library). Market and engagement figures are sourced in the full case-study writeup.</p>'
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
