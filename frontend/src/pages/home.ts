import { icons } from '../components/icons.ts';
import type { Service, Franchise } from '../api.ts';

export interface HomePageState {
  services: Service[];
  franchises: Franchise[];
  selectedVehicleType: 'hatchback' | 'sedan' | 'suv' | 'bike';
  searchedLocation: string;
  locationResult: any;
  activeCctvBay: number;
  sliderPos: number;
}

export function renderHomePage(state: HomePageState): string {
  const { franchises, selectedVehicleType, locationResult, activeCctvBay } = state;
  const vType = selectedVehicleType || 'sedan';

  const bayTitles: Record<number, { title: string; desc: string; fps: string; badge: string }> = {
    1: { title: 'Bay 1: Exterior Snow Foam & Underbody Blast', desc: '150-Bar High Pressure Foam Rinse', fps: '1080p @ 30 FPS', badge: 'Active Wash' },
    2: { title: 'Bay 2: Interior Steam Sanitization & Vacuum', desc: '140°C Saturated Steam Bacteria Eradication', fps: '1080p @ 30 FPS', badge: 'Steam Spa' },
    3: { title: 'Bay 3: Ceramic Coating & Dual-Action Buffing', desc: '9H Nano-Quartz Cleanroom Polish', fps: '4K @ 60 FPS', badge: 'Coating' },
    4: { title: 'Bay 4: 24-Point Final Inspection & Handover', desc: 'Multi-point digital quality pass signoff', fps: '1080p @ 30 FPS', badge: 'QC Pass' },
  };

  const currentBayInfo = bayTitles[activeCctvBay] || bayTitles[1];

  return `
    <div class="public-home-page animate-fade-in">
      <!-- ── 1. Hero Section ── -->
      <section class="hero-section">
        <div class="hero-badge-pill clay-card">
          <span class="duty-dot online"></span>
          <span class="hero-badge-text">INDIA'S 1ST EXPRESS FUEL STATION CAR WASH NETWORK</span>
        </div>

        <h1 class="hero-headline">
          15-Minute <span class="clay-text-gradient">Showroom Shine</span><br />
          While You Refuel.
        </h1>

        <p class="hero-subtext">
          World-class German snow foam, 150-bar underbody rinse, and interior steam sanitation at premium fuel stations across Bangalore. Watch live CCTV streaming of your wash from your phone.
        </p>

        <!-- CTA Buttons -->
        <div class="hero-cta-group">
          <button class="clay-btn clay-btn-primary clay-btn-lg" id="btn-hero-book-now">
            ${icons.calendar} Book Express Wash (₹349)
          </button>
          <button class="clay-btn clay-btn-secondary clay-btn-lg" id="btn-hero-watch-live">
            ${icons.video} Watch Live CCTV Demo
          </button>
          <button class="clay-btn clay-btn-ghost clay-btn-lg" id="btn-hero-franchise">
            ${icons.briefcase} Franchise Inquiry
          </button>
        </div>

        <!-- Floating Stat Orbs -->
        <div class="stat-orbs-container mt-12">
          <div class="stat-orb clay-card animate-breathe">
            <div class="stat-orb-value">1,438+</div>
            <div class="stat-orb-label">Cars Shined</div>
          </div>

          <div class="stat-orb clay-card animate-breathe" style="animation-delay: 1.5s;">
            <div class="stat-orb-value">15 Mins</div>
            <div class="stat-orb-label">Guaranteed SLA</div>
          </div>

          <div class="stat-orb clay-card animate-breathe" style="animation-delay: 3s;">
            <div class="stat-orb-value">4.9 ★</div>
            <div class="stat-orb-label">Google Rating</div>
          </div>

          <div class="stat-orb clay-card animate-breathe" style="animation-delay: 4.5s;">
            <div class="stat-orb-value">5 Hubs</div>
            <div class="stat-orb-label">Bangalore Petrol Stns</div>
          </div>
        </div>
      </section>

      <!-- ── 2. The SpeedoShine Advantage (Bento Grid) ── -->
      <section class="home-section mt-20">
        <div class="text-center mb-12">
          <span class="section-eyebrow">THE DIGITAL CLAY STANDARD</span>
          <h2 class="section-title">Why Car Owners Choose SpeedoShine</h2>
          <p class="section-subtitle">Engineered specifically for busy drivers who refuse to compromise on detailing quality.</p>
        </div>

        <div class="bento-grid">
          <!-- Hero Bento Card -->
          <div class="bento-card bento-hero clay-card">
            <div class="bento-icon-wrap violet">
              ${icons.zap}
            </div>
            <h3 class="bento-title">Express 15-Minute Turnaround at Fuel Stations</h3>
            <p class="bento-desc">
              No need to drive out of your way or leave your car for 4 hours at a traditional detailing garage. Refuel, grab an espresso, and drive away in a gleaming, mirror-finish vehicle.
            </p>
            <div class="bento-footer-stat">
              <span class="font-bold text-violet text-lg">⚡ 4x Faster</span>
              <span class="text-muted text-sm">&bull; Than conventional manual washing</span>
            </div>
          </div>

          <!-- Bento Card 2 -->
          <div class="bento-card clay-card">
            <div class="bento-icon-wrap green">
              ${icons.shield}
            </div>
            <h3 class="bento-title">Zero Swirl Marks Guarantee</h3>
            <p class="bento-desc">
              We exclusively use pH-neutral biodegradable snow foam, ultra-soft 1200 GSM microfiber mitts, and 100% demineralized RO water. Safe on ceramic coats and PPF.
            </p>
            <span class="badge badge-completed mt-3">${icons.checkCircle} Certified Paint Safe</span>
          </div>

          <!-- Bento Card 3 -->
          <div class="bento-card clay-card">
            <div class="bento-icon-wrap blue">
              ${icons.video}
            </div>
            <h3 class="bento-title">Live 4-Bay CCTV Mobile Tracking</h3>
            <p class="bento-desc">
              Complete radical transparency. Watch your car being washed live from the driver waiting lounge or your phone with crystal-clear 1080p feeds.
            </p>
            <span class="badge badge-in-progress mt-3">${icons.video} Live Camera Feeds</span>
          </div>

          <!-- Bento Card 4 -->
          <div class="bento-card clay-card">
            <div class="bento-icon-wrap pink">
              ${icons.fileCheck}
            </div>
            <h3 class="bento-title">24-Point Digital QC Pass</h3>
            <p class="bento-desc">
              Every single wash undergoes a rigorous 24-point quality inspection covering wheel rims, glass, exhaust tips, and door jambs before final customer sign-off.
            </p>
            <span class="badge badge-completed mt-3">${icons.award} 99.4% QC Accuracy</span>
          </div>
        </div>
      </section>

      <!-- ── 3. Interactive Pricing & Service Menu ── -->
      <section class="home-section mt-24">
        <div class="text-center mb-10">
          <span class="section-eyebrow">TRANSPARENT TIERED PRICING</span>
          <h2 class="section-title">Select Your Vehicle & Service Package</h2>
          <p class="section-subtitle">No hidden charges. 18% GST tax invoice included with every booking.</p>

          <!-- Vehicle Segment Selector Pills -->
          <div class="vehicle-switcher-pills mt-6">
            <button class="vehicle-pill ${vType === 'hatchback' ? 'active' : ''}" data-vehicle-type="hatchback">
              <span>🚗 Hatchback</span>
            </button>
            <button class="vehicle-pill ${vType === 'sedan' ? 'active' : ''}" data-vehicle-type="sedan">
              <span>🚘 Executive Sedan</span>
            </button>
            <button class="vehicle-pill ${vType === 'suv' ? 'active' : ''}" data-vehicle-type="suv">
              <span>🚙 Compact / Full SUV</span>
            </button>
            <button class="vehicle-pill ${vType === 'bike' ? 'active' : ''}" data-vehicle-type="bike">
              <span>🏍️ Superbike / Bike</span>
            </button>
          </div>
        </div>

        <!-- 4 Pricing Cards -->
        <div class="pricing-cards-grid">
          <!-- Card 1: Express Foam Wash -->
          <div class="pricing-card clay-card">
            <div class="pricing-card-header">
              <span class="badge badge-subtle">MOST POPULAR</span>
              <h3 class="pricing-title">Express Snow Foam Wash</h3>
              <p class="pricing-desc">Full exterior snow foam, 150-bar rinse, tire dressing & glass polish.</p>
              <div class="pricing-amount-wrap">
                <span class="currency">₹</span>
                <span class="price-val">${vType === 'bike' ? '199' : vType === 'hatchback' ? '349' : vType === 'sedan' ? '449' : '599'}</span>
                <span class="period">/ 15 Mins</span>
              </div>
            </div>
            <ul class="pricing-feature-list">
              <li>${icons.check} High-Pressure Underbody Blast</li>
              <li>${icons.check} pH-Neutral German Snow Foam</li>
              <li>${icons.check} Microfiber Hand Wash & Dry</li>
              <li>${icons.check} Alloy Wheel & Tire Gloss Dressing</li>
              <li>${icons.check} Crystal Clear Windshield Wipe</li>
            </ul>
            <button class="clay-btn clay-btn-primary w-full mt-6 btn-select-package" data-package="Express Foam Wash" data-price="${vType === 'bike' ? '199' : vType === 'hatchback' ? '349' : vType === 'sedan' ? '449' : '599'}">
              Book Express Wash
            </button>
          </div>

          <!-- Card 2: Deep Interior Steam Spa -->
          <div class="pricing-card clay-card highlight-card">
            <div class="pricing-card-header">
              <span class="badge badge-completed">HYGIENE ESSENTIAL</span>
              <h3 class="pricing-title">Interior Deep Steam Spa</h3>
              <p class="pricing-desc">140°C thermal sanitization, upholstery extraction & AC disinfection.</p>
              <div class="pricing-amount-wrap">
                <span class="currency">₹</span>
                <span class="price-val">${vType === 'bike' ? '499' : vType === 'hatchback' ? '899' : vType === 'sedan' ? '1,099' : '1,399'}</span>
                <span class="period">/ 35 Mins</span>
              </div>
            </div>
            <ul class="pricing-feature-list">
              <li>${icons.check} Full Cabin High-Powered Vacuum</li>
              <li>${icons.check} 140°C Steam Anti-Bacterial Treatment</li>
              <li>${icons.check} Dashboard & Trim UV Conditioning</li>
              <li>${icons.check} Leather / Fabric Seat Stain Scrub</li>
              <li>${icons.check} AC Duct Ozonation Odor Kill</li>
            </ul>
            <button class="clay-btn clay-btn-primary w-full mt-6 btn-select-package" data-package="Interior Deep Steam Spa" data-price="${vType === 'bike' ? '499' : vType === 'hatchback' ? '899' : vType === 'sedan' ? '1,099' : '1,399'}">
              Book Interior Spa
            </button>
          </div>

          <!-- Card 3: 9H Nano-Ceramic Gloss -->
          <div class="pricing-card clay-card">
            <div class="pricing-card-header">
              <span class="badge badge-pending">EXTREME GLOSS</span>
              <h3 class="pricing-title">9H Nano-Ceramic Shield</h3>
              <p class="pricing-desc">Hydrophobic quartz layer, mirror depth & 1-year UV paint protection.</p>
              <div class="pricing-amount-wrap">
                <span class="currency">₹</span>
                <span class="price-val">${vType === 'bike' ? '799' : vType === 'hatchback' ? '1,499' : vType === 'sedan' ? '1,899' : '2,499'}</span>
                <span class="period">/ 60 Mins</span>
              </div>
            </div>
            <ul class="pricing-feature-list">
              <li>${icons.check} Exterior Foam Wash + Iron Decon</li>
              <li>${icons.check} Clay Bar Surface Smoothening</li>
              <li>${icons.check} 9H Nano-Quartz Ceramic Wipe</li>
              <li>${icons.check} Hydrophobic Mirror Water Beading</li>
              <li>${icons.check} 1-Year Paint Protection Warranty</li>
            </ul>
            <button class="clay-btn clay-btn-secondary w-full mt-6 btn-select-package" data-package="9H Nano-Ceramic Shield" data-price="${vType === 'bike' ? '799' : vType === 'hatchback' ? '1,499' : vType === 'sedan' ? '1,899' : '2,499'}">
              Book Ceramic Shield
            </button>
          </div>

          <!-- Card 4: Full Detailing Spa -->
          <div class="pricing-card clay-card">
            <div class="pricing-card-header">
              <span class="badge badge-subtle">COMPLETE MAKEOVER</span>
              <h3 class="pricing-title">Showroom Detailing Spa</h3>
              <p class="pricing-desc">The ultimate bumper-to-bumper deep restoration & 2-stage paint correction.</p>
              <div class="pricing-amount-wrap">
                <span class="currency">₹</span>
                <span class="price-val">${vType === 'bike' ? '1,199' : vType === 'hatchback' ? '2,499' : vType === 'sedan' ? '2,999' : '3,799'}</span>
                <span class="period">/ 90 Mins</span>
              </div>
            </div>
            <ul class="pricing-feature-list">
              <li>${icons.check} Everything in Exterior + Interior Spa</li>
              <li>${icons.check} 2-Stage Swirl Scratch Removal</li>
              <li>${icons.check} Engine Bay Steam Dressing</li>
              <li>${icons.check} Headlight Clarity Restoration</li>
              <li>${icons.check} 24-Point Comprehensive Certificate</li>
            </ul>
            <button class="clay-btn clay-btn-secondary w-full mt-6 btn-select-package" data-package="Showroom Detailing Spa" data-price="${vType === 'bike' ? '1,199' : vType === 'hatchback' ? '2,499' : vType === 'sedan' ? '2,999' : '3,799'}">
              Book Full Detailing
            </button>
          </div>
        </div>
      </section>

      <!-- ── 4. Live 4-Bay CCTV Interactive Preview ── -->
      <section class="home-section mt-24">
        <div class="clay-card p-8">
          <div class="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <span class="section-eyebrow">RADICAL TRANSPARENCY</span>
              <h2 class="text-2xl font-black text-charcoal">Watch Your Wash Live on 4K CCTV</h2>
              <p class="text-sm text-muted">Select an active bay below to preview the live streaming view customers receive on their phone.</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="live-pulse"></span>
              <span class="font-bold text-danger text-sm font-mono">LIVE 4-BAY STREAMING</span>
            </div>
          </div>

          <!-- Bay Switcher Tabs -->
          <div class="cctv-bay-pills mb-6">
            <button class="bay-pill ${activeCctvBay === 1 ? 'active' : ''}" data-home-bay="1">
              Bay 1: Foam Wash
            </button>
            <button class="bay-pill ${activeCctvBay === 2 ? 'active' : ''}" data-home-bay="2">
              Bay 2: Interior Steam
            </button>
            <button class="bay-pill ${activeCctvBay === 3 ? 'active' : ''}" data-home-bay="3">
              Bay 3: Ceramic Polish
            </button>
            <button class="bay-pill ${activeCctvBay === 4 ? 'active' : ''}" data-home-bay="4">
              Bay 4: Final Handover
            </button>
          </div>

          <!-- Video Simulation Frame -->
          <div class="home-cctv-frame">
            <div class="cctv-video-sim">
              <!-- Overlay HUD -->
              <div class="cctv-overlay-hud">
                <div class="cctv-cam-badge">
                  <span class="rec-dot"></span>
                  <span class="font-bold">CAM-0${activeCctvBay} &bull; ${currentBayInfo.title}</span>
                </div>
                <div class="cctv-cam-stats font-mono">
                  <span>${currentBayInfo.fps}</span> &bull; <span>SPEEDOSHINE KORAMANGALA HUB</span>
                </div>
              </div>

              <!-- Animated Car Graphic / Visual in Wash -->
              <div class="cctv-sim-content">
                <div class="cctv-sim-car">
                  <div class="car-body ${activeCctvBay === 1 ? 'wash-foam' : activeCctvBay === 2 ? 'steam-mist' : activeCctvBay === 3 ? 'polish-shine' : 'handover-clean'}">
                    <span class="sim-plate">KA-05-MR-4412 &bull; BMW 330Li M Sport</span>
                  </div>
                  <div class="wash-nozzles-spray">
                    <div class="spray-stream s1"></div>
                    <div class="spray-stream s2"></div>
                    <div class="spray-stream s3"></div>
                  </div>
                </div>
              </div>

              <div class="cctv-bottom-bar">
                <span class="badge badge-completed">${currentBayInfo.badge}</span>
                <span class="text-xs text-white/80 font-mono">Assigned Detailer: Arun Kumar &bull; Est. Ready in 7 mins</span>
                <button class="clay-btn clay-btn-ghost clay-btn-sm text-white" id="btn-open-full-tracker">
                  ${icons.maximize} Open Customer Tracking Portal
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── 5. How It Works (3 Steps) ── -->
      <section class="home-section mt-24">
        <div class="text-center mb-12">
          <span class="section-eyebrow">SIMPLE & SEAMLESS</span>
          <h2 class="section-title">How SpeedoShine Works in 3 Steps</h2>
          <p class="section-subtitle">Zero waiting in lounge lines. Detailing integrated seamlessly into your refuelling routine.</p>
        </div>

        <div class="steps-grid">
          <div class="step-card clay-card">
            <div class="step-number-orb">1</div>
            <h3 class="step-title">Drive In While Refuelling</h3>
            <p class="step-desc">
              Pull into any SpeedoShine automated bay at HPCL, BPCL, IOCL, or Shell petrol pumps. Or reserve your 15-minute slot online with zero advance payment.
            </p>
          </div>

          <div class="step-card clay-card">
            <div class="step-number-orb">2</div>
            <h3 class="step-title">Relax & Watch on Live CCTV</h3>
            <p class="step-desc">
              Grab a snack or coffee. Our certified detailers execute high-pressure foam, steam extraction, and drying while you watch the live stream from your smartphone.
            </p>
          </div>

          <div class="step-card clay-card">
            <div class="step-number-orb">3</div>
            <h3 class="step-title">Drive Away with Mirror Shine</h3>
            <p class="step-desc">
              Inspect your verified 24-point QC pass report. Receive your official GST invoice and photo proof directly on WhatsApp. Showroom shine ready in 15 mins!
            </p>
          </div>
        </div>
      </section>

      <!-- ── 6. Bangalore Hub Finder & Geofence Validator ── -->
      <section class="home-section mt-24">
        <div class="clay-card p-10">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span class="section-eyebrow">5 BANGALORE FUEL STATION HUBS</span>
              <h2 class="text-3xl font-black text-charcoal mb-4">Find Your Nearest SpeedoShine Location</h2>
              <p class="text-muted leading-relaxed mb-6">
                Enter your area or 6-digit Bangalore pincode to verify 10 km geofence coverage and check if our mobile doorstep detailing vans can visit your home.
              </p>

              <form id="home-pincode-form" class="flex items-center gap-3 mb-4">
                <input
                  type="text"
                  id="home-pincode-input"
                  class="clay-input flex-1"
                  placeholder="Enter Area (e.g. Koramangala) or 560034"
                  value="${state.searchedLocation || '560034'}"
                  required
                />
                <button type="submit" class="clay-btn clay-btn-primary">
                  ${icons.search} Check Coverage
                </button>
              </form>

              <!-- Quick Pincode Chips -->
              <div class="flex items-center gap-2 flex-wrap text-xs">
                <span class="text-muted font-bold">Popular:</span>
                <button class="quick-chip" data-chip="560034">Koramangala (560034)</button>
                <button class="quick-chip" data-chip="560038">Indiranagar (560038)</button>
                <button class="quick-chip" data-chip="560102">HSR Layout (560102)</button>
                <button class="quick-chip" data-chip="560066">Whitefield (560066)</button>
              </div>

              <!-- Result Badge -->
              ${
                locationResult
                  ? `
                <div class="mt-6 p-4 clay-card bg-white/80 animate-slide-up">
                  <div class="flex items-center justify-between">
                    <div>
                      <span class="badge badge-completed">${icons.checkCircle} Service Available</span>
                      <h4 class="font-bold text-base mt-2">${locationResult.nearestHub}</h4>
                      <p class="text-xs text-muted">${locationResult.distanceKm} km away &bull; Approx. ${locationResult.etaMinutes} mins drive</p>
                    </div>
                    <button class="clay-btn clay-btn-sm clay-btn-primary" id="btn-book-from-hub-result">
                      Book At This Hub
                    </button>
                  </div>
                </div>
              `
                  : ''
              }
            </div>

            <!-- Hub Directory Cards -->
            <div class="space-y-3">
              ${franchises
                .slice(0, 4)
                .map(
                  (f) => `
                <div class="clay-card p-4 flex items-center justify-between hover:translate-x-1 transition-transform">
                  <div>
                    <strong class="text-sm font-bold">${f.name}</strong>
                    <div class="text-xs text-muted mt-1">${icons.mapPin} ${f.address || 'Fuel Station Bay, Bangalore'}</div>
                  </div>
                  <div class="text-right">
                    <span class="badge badge-completed">Open Now</span>
                    <div class="text-xs font-bold text-violet mt-1">⭐ 4.9 (240+ reviews)</div>
                  </div>
                </div>
              `
                )
                .join('')}
            </div>
          </div>
        </div>
      </section>

      <!-- ── 7. Verified Customer Reviews & Google SEO Redirection ── -->
      <section class="home-section mt-24">
        <div class="text-center mb-12">
          <span class="section-eyebrow">CUSTOMER PRAISE</span>
          <h2 class="section-title">Loved by Bangalore's Most Particular Car Owners</h2>
          <p class="section-subtitle">Real feedback from daily drivers, luxury SUV owners, and car enthusiasts.</p>
        </div>

        <div class="reviews-grid">
          <div class="review-card clay-card">
            <div class="flex items-center gap-1 text-amber mb-3">
              ★★★★★
            </div>
            <p class="review-quote">
              "Refuelled at HPCL Koramangala and tried SpeedoShine on a whim. In 14 minutes, my Fortuner went from muddy monsoon grime to mirror glossy. The underbody wash alone is worth every rupee!"
            </p>
            <div class="review-author mt-4">
              <strong>Vikram Malhotra</strong>
              <span class="text-xs text-muted">Toyota Fortuner 4x4 &bull; Koramangala Hub</span>
            </div>
          </div>

          <div class="review-card clay-card">
            <div class="flex items-center gap-1 text-amber mb-3">
              ★★★★★
            </div>
            <p class="review-quote">
              "Watching the steam sanitization live on my phone via CCTV was so cool! Zero water smell in the cabin, spotless AC vents, and no swirl marks on black paint. Highly recommended."
            </p>
            <div class="review-author mt-4">
              <strong>Ananya Swaminathan</strong>
              <span class="text-xs text-muted">BMW 3 Series &bull; Indiranagar Hub</span>
            </div>
          </div>

          <div class="review-card clay-card">
            <div class="flex items-center gap-1 text-amber mb-3">
              ★★★★★
            </div>
            <p class="review-quote">
              "Super fast, ultra courteous crew, and proper GST tax invoice sent directly to WhatsApp with Before/After photos. This is the future of express car washes in India."
            </p>
            <div class="review-author mt-4">
              <strong>Karthik Reddy</strong>
              <span class="text-xs text-muted">Tata Safari &bull; HSR Layout Hub</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ── 8. Franchise CTA Banner ── -->
      <section class="home-section mt-24">
        <div class="franchise-cta-banner clay-card p-12 text-center">
          <span class="badge badge-completed mb-4">${icons.briefcase} FRANCHISE NETWORK EXPANSION</span>
          <h2 class="text-3xl md:text-4xl font-black text-charcoal mb-4">
            Own a High-Margin SpeedoShine Express Wash at a Petrol Pump
          </h2>
          <p class="text-muted max-w-2xl mx-auto mb-8 leading-relaxed">
            Partner with India's fastest growing automated car care brand. Captive fuel station traffic, 15% royalty model, equipment provided, and 10–14 month estimated payback.
          </p>
          <div class="flex items-center justify-center gap-4 flex-wrap">
            <button class="clay-btn clay-btn-primary clay-btn-lg" id="btn-banner-franchise">
              ${icons.briefcase} Apply For Franchise Opportunity
            </button>
            <button class="clay-btn clay-btn-ghost clay-btn-lg" id="btn-banner-book">
              ${icons.calendar} Book a Wash Instead
            </button>
          </div>
        </div>
      </section>
    </div>
  `;
}
