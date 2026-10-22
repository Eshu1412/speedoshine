export function renderPublicServicesPage(): string {
  return `
    <div class="public-services-page animate-fade-in max-w-5xl mx-auto py-8">
      <!-- Page Header -->
      <div class="text-center mb-12">
        <span class="section-eyebrow">COMPLETE DETAILING & SPA MENU</span>
        <h1 class="text-3xl sm:text-5xl font-black text-charcoal">
          Precision Car Care at <span class="clay-text-gradient">Fuel Station Speed</span>
        </h1>
        <p class="text-muted max-w-2xl mx-auto text-base mt-4 leading-relaxed">
          From 15-minute express foam washes to 3-year nano-ceramic coatings. 100% demineralized RO water, pH-neutral biodegradable detergents, and thermal steam sanitization.
        </p>
      </div>

      <!-- Service Cards Detailed Breakdown -->
      <div class="space-y-8 mb-16">
        <!-- Service 1: Exterior Foam Wash -->
        <div class="clay-card p-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div class="md:col-span-2">
              <span class="badge badge-completed mb-2">MOST POPULAR &bull; 15 MINS</span>
              <h2 class="text-2xl font-black text-charcoal mb-2">Express Snow Foam & Underbody Blast</h2>
              <p class="text-muted text-sm leading-relaxed mb-4">
                Our signature express service designed for drivers on the go. High-pressure 150-bar pre-wash dislodges heavy dirt and wheel grime, followed by dense German snow foam that encapsulates dust without scratching clear coat.
              </p>
              <div class="grid grid-cols-2 gap-3 text-xs">
                <div class="flex items-center gap-2">
                  <span class="text-green font-bold">✓</span> 150-Bar Underbody Blast
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green font-bold">✓</span> 1200 GSM Scratch-Free Microfiber
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green font-bold">✓</span> Alloy Wheel & Caliper Degrease
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green font-bold">✓</span> Tire Deep Gloss Silicone Dressing
                </div>
              </div>
            </div>
            <div class="clay-card p-6 text-center">
              <span class="text-xs text-muted uppercase font-bold">Starts From</span>
              <div class="text-3xl font-black text-violet my-1">₹349</div>
              <span class="text-xs text-muted block mb-4">Hatchback (Sedan ₹449 &bull; SUV ₹599)</span>
              <button class="clay-btn clay-btn-primary w-full btn-select-package" data-package="Express Foam Wash" data-price="449">
                Book This Service
              </button>
            </div>
          </div>
        </div>

        <!-- Service 2: Interior Steam Sanitization -->
        <div class="clay-card p-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div class="md:col-span-2">
              <span class="badge badge-in-progress mb-2">HYGIENE ESSENTIAL &bull; 35 MINS</span>
              <h2 class="text-2xl font-black text-charcoal mb-2">Interior Deep Steam Sanitization & Spa</h2>
              <p class="text-muted text-sm leading-relaxed mb-4">
                Thermal saturation steam at 140°C eliminates 99.9% of bacteria, allergens, and mildew from deep inside fabric, leather, seat foam, and AC evaporator ducts. Leaves your cabin smelling fresh with zero artificial perfume cover-ups.
              </p>
              <div class="grid grid-cols-2 gap-3 text-xs">
                <div class="flex items-center gap-2">
                  <span class="text-green font-bold">✓</span> 140°C Dry Saturated Steam
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green font-bold">✓</span> High-Lift Extraction Vacuum
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green font-bold">✓</span> AC Duct Ozonation Odor Neutralizer
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green font-bold">✓</span> UV Vinyl & Leather Conditioning
                </div>
              </div>
            </div>
            <div class="clay-card p-6 text-center">
              <span class="text-xs text-muted uppercase font-bold">Starts From</span>
              <div class="text-3xl font-black text-violet my-1">₹899</div>
              <span class="text-xs text-muted block mb-4">Hatchback (Sedan ₹1,099 &bull; SUV ₹1,399)</span>
              <button class="clay-btn clay-btn-primary w-full btn-select-package" data-package="Interior Deep Steam Spa" data-price="1099">
                Book This Service
              </button>
            </div>
          </div>
        </div>

        <!-- Service 3: 9H Nano-Ceramic Shield -->
        <div class="clay-card p-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div class="md:col-span-2">
              <span class="badge badge-pending mb-2">PAINT PROTECTION &bull; 60 MINS</span>
              <h2 class="text-2xl font-black text-charcoal mb-2">9H Nano-Ceramic Quartz Coating</h2>
              <p class="text-muted text-sm leading-relaxed mb-4">
                Extreme hydrophobic water-beading and self-cleaning ceramic layer. Chemically bonds with clear coat to resist bird droppings, acid rain, harsh Bangalore sunlight, and minor micro-scratches. 1-year warranty included.
              </p>
              <div class="grid grid-cols-2 gap-3 text-xs">
                <div class="flex items-center gap-2">
                  <span class="text-green font-bold">✓</span> Clay Bar Decontamination
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green font-bold">✓</span> 9H Nano-Quartz Chemical Bond
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green font-bold">✓</span> Hydrophobic 110° Water Contact Angle
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green font-bold">✓</span> 1-Year Official Warranty Certificate
                </div>
              </div>
            </div>
            <div class="clay-card p-6 text-center">
              <span class="text-xs text-muted uppercase font-bold">Starts From</span>
              <div class="text-3xl font-black text-violet my-1">₹1,499</div>
              <span class="text-xs text-muted block mb-4">Hatchback (Sedan ₹1,899 &bull; SUV ₹2,499)</span>
              <button class="clay-btn clay-btn-primary w-full btn-select-package" data-package="9H Nano-Ceramic Shield" data-price="1899">
                Book This Service
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Comparison Matrix -->
      <div class="clay-card p-8 mb-16">
        <h2 class="text-2xl font-black text-charcoal mb-6 text-center">Package Comparison Table</h2>
        <div class="table-scroll">
          <table class="clay-table">
            <thead>
              <tr>
                <th>Service Feature</th>
                <th>Express Foam</th>
                <th>Interior Steam</th>
                <th>Ceramic Shield</th>
                <th>Showroom Spa</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Service Duration</strong></td>
                <td>15 Mins</td>
                <td>35 Mins</td>
                <td>60 Mins</td>
                <td>90 Mins</td>
              </tr>
              <tr>
                <td><strong>Underbody 150-Bar Rinse</strong></td>
                <td class="text-green font-bold">✓ Yes</td>
                <td class="text-muted">—</td>
                <td class="text-green font-bold">✓ Yes</td>
                <td class="text-green font-bold">✓ Yes</td>
              </tr>
              <tr>
                <td><strong>140°C Interior Steam Extraction</strong></td>
                <td class="text-muted">—</td>
                <td class="text-green font-bold">✓ Yes</td>
                <td class="text-muted">—</td>
                <td class="text-green font-bold">✓ Yes</td>
              </tr>
              <tr>
                <td><strong>9H Quartz Hydrophobic Layer</strong></td>
                <td class="text-muted">—</td>
                <td class="text-muted">—</td>
                <td class="text-green font-bold">✓ 1-Year</td>
                <td class="text-green font-bold">✓ 3-Year</td>
              </tr>
              <tr>
                <td><strong>2-Stage Scratch Swirl Buff</strong></td>
                <td class="text-muted">—</td>
                <td class="text-muted">—</td>
                <td class="text-muted">—</td>
                <td class="text-green font-bold">✓ Yes</td>
              </tr>
              <tr>
                <td><strong>Live Bay CCTV Mobile Stream</strong></td>
                <td class="text-green font-bold">✓ Yes</td>
                <td class="text-green font-bold">✓ Yes</td>
                <td class="text-green font-bold">✓ Yes</td>
                <td class="text-green font-bold">✓ Yes</td>
              </tr>
              <tr>
                <td><strong>24-Point Verified QC Certificate</strong></td>
                <td class="text-green font-bold">✓ Digital</td>
                <td class="text-green font-bold">✓ Digital</td>
                <td class="text-green font-bold">✓ Digital</td>
                <td class="text-green font-bold">✓ Digital & Print</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Detailing FAQs -->
      <div class="clay-card p-8">
        <h2 class="text-2xl font-black text-charcoal mb-6 text-center">Frequently Asked Questions</h2>
        <div class="space-y-4 max-w-3xl mx-auto">
          <div class="p-4 clay-card">
            <h4 class="font-bold text-sm text-charcoal mb-1">How can you wash a car properly in only 15 minutes?</h4>
            <p class="text-xs text-muted leading-relaxed">
              We operate synchronized multi-technician wash bays with high-volume German pressure nozzles, pre-calibrated snow foam cannons, and dedicated drying crews. Every second of the workflow is optimized so there is zero wasted motion.
            </p>
          </div>

          <div class="p-4 clay-card">
            <h4 class="font-bold text-sm text-charcoal mb-1">Does high-pressure water damage ceramic coating or PPF?</h4>
            <p class="text-xs text-muted leading-relaxed">
              No. Our water pressure is strictly governed at 150-bar with 40-degree wide fan nozzles held at a safe 30 cm distance. Furthermore, our foam detergents are 100% pH-neutral (pH 7.0), meaning they preserve ceramic hydrophobicity rather than stripping it.
            </p>
          </div>

          <div class="p-4 clay-card">
            <h4 class="font-bold text-sm text-charcoal mb-1">Do I need an advance appointment?</h4>
            <p class="text-xs text-muted leading-relaxed">
              Drive-ins are always welcomed at all 5 Bangalore fuel stations! However, booking your 15-minute slot online guarantees you enter the bay without waiting in any queue.
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}
