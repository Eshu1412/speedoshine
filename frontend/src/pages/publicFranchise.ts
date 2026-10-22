import { icons } from '../components/icons.ts';

export function renderPublicFranchisePage(): string {
  return `
    <div class="public-franchise-page animate-fade-in max-w-5xl mx-auto py-8">
      <!-- Hero -->
      <div class="text-center mb-12">
        <span class="section-eyebrow">FRANCHISE ONBOARDING & PARTNER OPPORTUNITY</span>
        <h1 class="text-3xl sm:text-5xl font-black text-charcoal">
          Own a High-Margin <span class="clay-text-gradient">Express Car Wash</span> at a Fuel Station
        </h1>
        <p class="text-muted max-w-2xl mx-auto text-base mt-4 leading-relaxed">
          Unlock captive traffic from 1,500+ daily refuelling vehicles. Turnkey automated bays, German chemicals, cloud CCTV management, and a transparent 15% royalty model.
        </p>
      </div>

      <!-- Financial Metrics Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        <div class="clay-card p-6 text-center">
          <span class="text-xs font-bold text-muted uppercase">Gross Profit Margin</span>
          <h3 class="text-3xl font-black text-violet mt-1">65%</h3>
          <span class="text-xs text-green font-bold">Industry Leading</span>
        </div>
        <div class="clay-card p-6 text-center">
          <span class="text-xs font-bold text-muted uppercase">Estimated Payback</span>
          <h3 class="text-3xl font-black text-pink mt-1">10–14 Mo</h3>
          <span class="text-xs text-muted">Rapid Breakeven</span>
        </div>
        <div class="clay-card p-6 text-center">
          <span class="text-xs font-bold text-muted uppercase">HQ Royalty Share</span>
          <h3 class="text-3xl font-black text-blue mt-1">15%</h3>
          <span class="text-xs text-muted">Fixed Transparent</span>
        </div>
        <div class="clay-card p-6 text-center">
          <span class="text-xs font-bold text-muted uppercase">Avg Monthly Revenue</span>
          <h3 class="text-3xl font-black text-green mt-1">₹6.5 Lakhs</h3>
          <span class="text-xs text-muted">Per 2-Bay Station</span>
        </div>
      </div>

      <!-- Why Petrol Pumps? (Bento Grid) -->
      <div class="clay-card p-8 mb-12">
        <h2 class="text-2xl font-black text-charcoal mb-6 text-center">Why The Fuel Station Model Wins</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="clay-card p-5">
            <div class="bento-icon-wrap violet mb-3">
              ${icons.mapPin}
            </div>
            <h4 class="font-bold text-base mb-1">Zero Real Estate Guesswork</h4>
            <p class="text-xs text-muted leading-relaxed">
              Prime petrol pumps already have 1,500–3,000 captive car owners driving in daily to refuel. No high street rental risk or customer acquisition friction.
            </p>
          </div>

          <div class="clay-card p-5">
            <div class="bento-icon-wrap green mb-3">
              ${icons.zap}
            </div>
            <h4 class="font-bold text-base mb-1">Turnkey Equipment & Supply</h4>
            <p class="text-xs text-muted leading-relaxed">
              HQ supplies German 150-bar pressure pumps, 140°C steam extractors, chemical bulk supply, and unified staff uniforms. Plug-and-play installation.
            </p>
          </div>

          <div class="clay-card p-5">
            <div class="bento-icon-wrap blue mb-3">
              ${icons.globe}
            </div>
            <h4 class="font-bold text-base mb-1">Central Cloud ERP & CCTV</h4>
            <p class="text-xs text-muted leading-relaxed">
              Operate your franchise from your smartphone. Automated staff clock-in, live multi-bay CCTV monitoring, digital GST billing, and real-time revenue splits.
            </p>
          </div>
        </div>
      </div>

      <!-- Application Form -->
      <div class="clay-card p-10 max-w-2xl mx-auto">
        <div class="text-center mb-6">
          <h3 class="text-2xl font-black text-charcoal">Apply For Franchise Onboarding</h3>
          <p class="text-xs text-muted mt-1">Fill out the preliminary questionnaire. Our franchise expansion director will contact you within 24 hours.</p>
        </div>

        <form id="public-franchise-form" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase text-muted mb-1">Full Legal Name *</label>
              <input type="text" name="owner_name" class="clay-input w-full" required placeholder="e.g. Senthil Kumar" value="Senthil Kumar" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase text-muted mb-1">Proposed Franchise / Outlet Name *</label>
              <input type="text" name="name" class="clay-input w-full" required placeholder="e.g. SpeedoShine Electronic City Hub" value="SpeedoShine Electronic City Hub" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase text-muted mb-1">Contact Phone / WhatsApp *</label>
              <input type="tel" name="phone" class="clay-input w-full" required placeholder="+91 98450 12345" value="+91 98450 12345" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase text-muted mb-1">Business Email *</label>
              <input type="email" name="email" class="clay-input w-full" required placeholder="senthil@speedoshine.com" value="senthil.k@gmail.com" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase text-muted mb-1">City / Target Location *</label>
              <input type="text" name="city" class="clay-input w-full" required placeholder="Bangalore (Electronic City Phase 1)" value="Bangalore" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase text-muted mb-1">Fuel Station Brand Partner</label>
              <select name="fuel_brand" class="clay-select w-full">
                <option value="HPCL">Hindustan Petroleum (HPCL)</option>
                <option value="BPCL">Bharat Petroleum (BPCL)</option>
                <option value="IOCL">Indian Oil (IOCL)</option>
                <option value="Shell">Shell India</option>
                <option value="Nayara">Nayara Energy</option>
                <option value="Other">Independent / Standalone Land</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase text-muted mb-1">Investment Budget Capital *</label>
              <select name="investment_budget" class="clay-select w-full">
                <option value="15-20">₹15 – 20 Lakhs (Standard 2-Bay)</option>
                <option value="20-30">₹20 – 30 Lakhs (Premium 3-Bay + Steam)</option>
                <option value="30+">₹30+ Lakhs (Mega Hub + Ceramic Studio)</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase text-muted mb-1">Available Bay Space (Sq Ft)</label>
              <input type="text" name="space_sqft" class="clay-input w-full" placeholder="e.g. 1,200 sq ft" value="1,200 sq ft" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase text-muted mb-1">Additional Notes / Prior Detailing Experience</label>
            <textarea name="notes" class="clay-input w-full" rows="3" placeholder="Tell us about your background or the petrol pump site..."></textarea>
          </div>

          <div class="pt-4">
            <button type="submit" class="clay-btn clay-btn-primary w-full py-4 text-base font-bold shadow-clayButton">
              ${icons.briefcase} Submit Franchise Application
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}
