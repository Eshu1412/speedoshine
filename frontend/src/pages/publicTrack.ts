import { icons } from '../components/icons.ts';
import type { Booking } from '../api.ts';

export interface PublicTrackPageState {
  bookings: Booking[];
  searchQuery: string;
  foundBooking?: Booking | null;
}

export function renderPublicTrackPage(state: PublicTrackPageState): string {
  const { bookings, searchQuery, foundBooking } = state;

  const b = foundBooking || bookings.find((item) => item.booking_number === 'SS-BK-8821') || bookings[0];

  const stages = [
    { num: 1, title: 'Checked In', desc: 'Bay Entry & Inspection', done: true },
    { num: 2, title: 'Active Foam Wash', desc: '150-Bar High Pressure Rinse', done: b?.status !== 'pending' },
    { num: 3, title: 'Interior Steam Spa', desc: '140°C Sanitization & Vacuum', done: b?.status === 'in_progress' || b?.status === 'completed' },
    { num: 4, title: 'Ceramic Buff & Polish', desc: 'Tire Dressing & Glass Clean', done: b?.status === 'completed' },
    { num: 5, title: 'Handover Ready', desc: '24-Point QC Pass Certificate', done: b?.status === 'completed' },
  ];

  return `
    <div class="public-track-page animate-fade-in max-w-4xl mx-auto py-8">
      <!-- Page Header -->
      <div class="text-center mb-8">
        <span class="section-eyebrow">REAL-TIME SERVICE TRANSPARENCY</span>
        <h1 class="text-3xl sm:text-4xl font-black text-charcoal">Track Your Car Wash Live</h1>
        <p class="text-muted text-sm mt-2">Enter your Booking Number or Phone Number to view live CCTV feeds and photo documentation.</p>
      </div>

      <!-- Search Input Card -->
      <div class="clay-card p-6 mb-8 max-w-xl mx-auto">
        <form id="track-search-form" class="flex items-center gap-3">
          <input
            type="text"
            id="track-search-input"
            class="clay-input flex-1 uppercase font-mono font-bold"
            placeholder="e.g. SS-BK-8821 or 9876543210"
            value="${searchQuery || (b ? b.booking_number : 'SS-BK-8821')}"
            required
          />
          <button type="submit" class="clay-btn clay-btn-primary">
            ${icons.search} Track Live
          </button>
        </form>

        <div class="flex items-center justify-between text-xs text-muted mt-3">
          <span>Quick Samples:</span>
          <div class="flex items-center gap-2 font-mono">
            <button class="track-quick-sample hover:underline text-violet" data-sample="SS-BK-8821">SS-BK-8821</button>
            <span>&bull;</span>
            <button class="track-quick-sample hover:underline text-violet" data-sample="SS-BK-8822">SS-BK-8822</button>
            <span>&bull;</span>
            <button class="track-quick-sample hover:underline text-violet" data-sample="SS-BK-8823">SS-BK-8823</button>
          </div>
        </div>
      </div>

      ${
        b
          ? `
        <!-- Live Tracking Display -->
        <div class="space-y-6">
          <!-- Active Status Banner -->
          <div class="clay-card p-6">
            <div class="flex items-center justify-between flex-wrap gap-4 border-b pb-4 mb-4">
              <div>
                <span class="badge ${b.status === 'completed' ? 'badge-completed' : b.status === 'in_progress' ? 'badge-in-progress' : 'badge-pending'} uppercase text-xs mb-1">
                  ${b.status.replace('_', ' ')}
                </span>
                <h2 class="text-2xl font-black text-charcoal">${b.vehicle_model || 'Hyundai Creta'} (${b.vehicle_number})</h2>
                <p class="text-xs text-muted mt-1">Booking #${b.booking_number} &bull; Customer: ${b.customer_name}</p>
              </div>

              <div class="text-right">
                <span class="text-xs text-muted font-bold block uppercase">Assigned Detailing Hub</span>
                <strong class="text-sm font-bold text-violet">${b.franchise_name || 'SpeedoShine Koramangala Hub'}</strong>
                <span class="text-xs text-muted block mt-1">Lead Supervisor: Arun Prasad</span>
              </div>
            </div>

            <!-- Progress Stepper -->
            <div class="stepper-track-wrap py-4">
              <div class="grid grid-cols-5 gap-2 text-center">
                ${stages
                  .map(
                    (st) => `
                  <div class="step-col ${st.done ? 'step-done' : ''}">
                    <div class="step-indicator-circle ${st.done ? 'active' : ''}">
                      ${st.done ? icons.check : st.num}
                    </div>
                    <span class="step-name block text-xs font-bold mt-2">${st.title}</span>
                    <span class="step-sub text-muted block">${st.desc}</span>
                  </div>
                `
                  )
                  .join('')}
              </div>
            </div>
          </div>

          <!-- Live CCTV View & Proof Documentation -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- CCTV Bay Stream -->
            <div class="clay-card p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-bold text-charcoal flex items-center gap-2">
                  <span class="live-pulse"></span>
                  Live Bay 1 Stream (Koramangala)
                </h3>
                <span class="badge badge-in-progress font-mono text-xs">1080p @ 30 FPS</span>
              </div>

              <div class="tracking-video-sim clay-card overflow-hidden">
                <div class="cctv-overlay-hud">
                  <span class="font-mono text-xs text-white bg-black/50 px-2 py-1 rounded">CAM-01: FOAM BAY</span>
                  <span class="font-mono text-xs text-green bg-black/50 px-2 py-1 rounded">LIVE SECURE STREAM</span>
                </div>
                <div class="tracking-car-visual">
                  <div class="car-body wash-foam">
                    <span class="sim-plate">${b.vehicle_number}</span>
                  </div>
                </div>
                <div class="p-3 bg-black/70 text-white text-xs flex justify-between items-center">
                  <span>Assigned Bay: Bay 1 Exterior High-Pressure</span>
                  <span class="font-mono text-amber">Active: 11 mins elapsed</span>
                </div>
              </div>
            </div>

            <!-- 24-Point Quality Pass Certificate -->
            <div class="clay-card p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-bold text-charcoal flex items-center gap-2">
                  ${icons.award}
                  24-Point QC Pass Certificate
                </h3>
                <span class="badge badge-completed">100% Passed</span>
              </div>

              <div class="qc-checklist-grid space-y-2 text-xs">
                <div class="flex items-center justify-between p-2 rounded-lg bg-white/60">
                  <span>1. Front & Rear Wheel Rims Iron Decon</span>
                  <span class="text-green font-bold flex items-center gap-1">${icons.check} Verified</span>
                </div>
                <div class="flex items-center justify-between p-2 rounded-lg bg-white/60">
                  <span>2. Underbody Chassis High-Pressure Rinse</span>
                  <span class="text-green font-bold flex items-center gap-1">${icons.check} Verified</span>
                </div>
                <div class="flex items-center justify-between p-2 rounded-lg bg-white/60">
                  <span>3. Paint Swirl-Free Hand Mitt Wash</span>
                  <span class="text-green font-bold flex items-center gap-1">${icons.check} Verified</span>
                </div>
                <div class="flex items-center justify-between p-2 rounded-lg bg-white/60">
                  <span>4. Dashboard & AC Vents Steam Sanitation</span>
                  <span class="text-green font-bold flex items-center gap-1">${icons.check} Verified</span>
                </div>
                <div class="flex items-center justify-between p-2 rounded-lg bg-white/60">
                  <span>5. Glass Streak-Free Polish & Rain Repel</span>
                  <span class="text-green font-bold flex items-center gap-1">${icons.check} Verified</span>
                </div>
              </div>

              <div class="mt-4 pt-4 border-t flex items-center justify-between text-xs text-muted">
                <span>Inspector: <strong>Arun Prasad (Lead QC)</strong></span>
                <span class="text-green font-bold">Sign-off: PASS ✅</span>
              </div>
            </div>
          </div>

          <!-- 3-Stage Photo Proof Gallery -->
          <div class="clay-card p-6">
            <h3 class="font-bold text-charcoal mb-4">Photographic Service Documentation</h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="photo-proof-item clay-card p-3 text-center">
                <span class="badge badge-subtle mb-2">Stage 1: Before Wash</span>
                <div class="proof-photo-box before">
                  <div class="watermark-tag">KA-05 &bull; Dirt Grime</div>
                </div>
                <span class="text-xs text-muted mt-2 block">Road dust & mud build-up</span>
              </div>

              <div class="photo-proof-item clay-card p-3 text-center">
                <span class="badge badge-in-progress mb-2">Stage 2: During Steam</span>
                <div class="proof-photo-box during">
                  <div class="watermark-tag">140°C Saturated Steam</div>
                </div>
                <span class="text-xs text-muted mt-2 block">Thermal bacteria kill</span>
              </div>

              <div class="photo-proof-item clay-card p-3 text-center">
                <span class="badge badge-completed mb-2">Stage 3: After Mirror Finish</span>
                <div class="proof-photo-box after">
                  <div class="watermark-tag">Mirror 9H Reflection</div>
                </div>
                <span class="text-xs text-muted mt-2 block">Showroom gloss certified</span>
              </div>
            </div>
          </div>

          <!-- Bottom Customer Actions -->
          <div class="flex items-center justify-between flex-wrap gap-4 clay-card p-6">
            <div>
              <h4 class="font-bold text-charcoal">Need assistance with your vehicle?</h4>
              <p class="text-xs text-muted">Contact the bay supervisor directly or request a call back.</p>
            </div>
            <div class="flex items-center gap-3">
              <button class="clay-btn clay-btn-secondary clay-btn-sm" onclick="alert('Connecting to Supervisor: +91 98765 43210')">
                ${icons.phone} Call Bay Supervisor
              </button>
              <button class="clay-btn clay-btn-primary clay-btn-sm" id="btn-track-leave-review">
                ${icons.star} Leave 5-Star Review
              </button>
            </div>
          </div>
        </div>
      `
          : `
        <div class="clay-card p-12 text-center">
          <p class="text-muted">No booking found matching "${searchQuery}". Please check your booking reference code.</p>
        </div>
      `
      }
    </div>
  `;
}
