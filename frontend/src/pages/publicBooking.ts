import { icons } from '../components/icons.ts';
import type { Franchise, Service } from '../api.ts';

export interface PublicBookingPageState {
  franchises: Franchise[];
  services: Service[];
  selectedVehicleType: 'hatchback' | 'sedan' | 'suv' | 'bike';
  selectedServiceId: number;
  selectedFranchiseId: number;
  selectedDate: string;
  selectedTimeSlot: string;
  appliedPromoCode?: string;
  promoDiscount: number;
  confirmedBooking?: any;
}

export function renderPublicBookingPage(state: PublicBookingPageState): string {
  const { franchises, selectedVehicleType, selectedServiceId, selectedFranchiseId, appliedPromoCode, promoDiscount, confirmedBooking } = state;
  const vType = selectedVehicleType || 'sedan';

  // Tiered prices by vehicle type
  const packagePrices: Record<string, Record<string, number>> = {
    hatchback: { 1: 349, 2: 899, 3: 1499, 4: 2499 },
    sedan: { 1: 449, 2: 1099, 3: 1899, 4: 2999 },
    suv: { 1: 599, 2: 1399, 3: 2499, 4: 3799 },
    bike: { 1: 199, 2: 499, 3: 799, 4: 1199 },
  };

  const activeServiceId = selectedServiceId || 1;
  const basePrice = (packagePrices[vType] && packagePrices[vType][activeServiceId]) || 449;
  const discount = promoDiscount || 0;
  const taxableAmount = Math.max(basePrice - discount, 0);
  const gst = Math.round(taxableAmount * 0.18);
  const totalAmount = taxableAmount + gst;

  const timeSlots = [
    '08:30 AM - 09:15 AM',
    '09:30 AM - 10:15 AM',
    '10:30 AM - 11:15 AM',
    '11:45 AM - 12:30 PM',
    '01:30 PM - 02:15 PM',
    '02:45 PM - 03:30 PM',
    '04:00 PM - 04:45 PM',
    '05:15 PM - 06:00 PM',
    '06:30 PM - 07:15 PM',
  ];

  return `
    <div class="public-booking-page animate-fade-in max-w-5xl mx-auto py-8">
      <!-- Page Header -->
      <div class="text-center mb-8">
        <span class="section-eyebrow">ONLINE SERVICE BOOKING & SCHEDULING</span>
        <h1 class="text-3xl sm:text-4xl font-black text-charcoal">Book Your 15-Minute Express Wash</h1>
        <p class="text-muted text-sm mt-2">Zero advance deposit required. Pay at the hub via UPI or Cash after service inspection.</p>
      </div>

      ${
        confirmedBooking
          ? `
        <!-- Booking Confirmation Card -->
        <div class="clay-card p-8 text-center animate-slide-up mb-8" style="background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(244,241,250,0.95));">
          <div class="booking-success-icon mb-4">
            ${icons.checkCircle}
          </div>
          <span class="badge badge-completed text-sm mb-2">SLOT RESERVED & CONFIRMED</span>
          <h2 class="text-2xl font-black text-charcoal mt-1">Booking #${confirmedBooking.booking_number}</h2>
          <p class="text-muted text-sm mt-1">A confirmation SMS & WhatsApp message with directions has been sent to <strong>${confirmedBooking.customer_phone}</strong>.</p>

          <div class="confirmation-summary-box clay-card p-6 my-6 max-w-lg mx-auto text-left">
            <div class="flex justify-between py-1 border-b">
              <span class="text-muted text-sm">Customer Name:</span>
              <strong class="text-sm">${confirmedBooking.customer_name}</strong>
            </div>
            <div class="flex justify-between py-1 border-b">
              <span class="text-muted text-sm">Vehicle:</span>
              <strong class="text-sm">${confirmedBooking.vehicle_model} (${confirmedBooking.vehicle_number})</strong>
            </div>
            <div class="flex justify-between py-1 border-b">
              <span class="text-muted text-sm">Service:</span>
              <strong class="text-sm text-violet">${confirmedBooking.service_name}</strong>
            </div>
            <div class="flex justify-between py-1 border-b">
              <span class="text-muted text-sm">Hub Location:</span>
              <strong class="text-sm">${confirmedBooking.franchise_name}</strong>
            </div>
            <div class="flex justify-between py-1 border-b">
              <span class="text-muted text-sm">Date & Time:</span>
              <strong class="text-sm font-mono text-charcoal">${confirmedBooking.slot_time}</strong>
            </div>
            <div class="flex justify-between py-1 pt-2">
              <span class="text-sm font-bold">Total Payable at Hub:</span>
              <strong class="text-base text-green">₹${confirmedBooking.total_amount} (incl. 18% GST)</strong>
            </div>
          </div>

          <div class="flex items-center justify-center gap-4 flex-wrap">
            <button class="clay-btn clay-btn-primary" id="btn-confirmed-track-wash" data-booking-id="${confirmedBooking.booking_number}">
              ${icons.video} Track Live Wash on CCTV
            </button>
            <button class="clay-btn clay-btn-secondary" id="btn-book-another-slot">
              ${icons.calendar} Book Another Slot
            </button>
          </div>
        </div>
      `
          : `
        <!-- Booking Wizard Form -->
        <form id="public-booking-form">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left 2 Cols: Wizard Steps -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Step 1: Vehicle Segment -->
              <div class="clay-card p-6">
                <div class="flex items-center gap-3 mb-4">
                  <div class="step-mini-orb">1</div>
                  <h3 class="text-lg font-black text-charcoal">Select Vehicle Category</h3>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div class="vehicle-select-card ${vType === 'hatchback' ? 'selected' : ''}" data-vtype="hatchback">
                    <span class="text-2xl">🚗</span>
                    <strong>Hatchback</strong>
                    <span class="text-xs text-muted">Swift, i20, Polo</span>
                  </div>
                  <div class="vehicle-select-card ${vType === 'sedan' ? 'selected' : ''}" data-vtype="sedan">
                    <span class="text-2xl">🚘</span>
                    <strong>Sedan</strong>
                    <span class="text-xs text-muted">City, Virtus, Verna</span>
                  </div>
                  <div class="vehicle-select-card ${vType === 'suv' ? 'selected' : ''}" data-vtype="suv">
                    <span class="text-2xl">🚙</span>
                    <strong>SUV / MUV</strong>
                    <span class="text-xs text-muted">Creta, Fortuner, XUV</span>
                  </div>
                  <div class="vehicle-select-card ${vType === 'bike' ? 'selected' : ''}" data-vtype="bike">
                    <span class="text-2xl">🏍️</span>
                    <strong>Motorcycle</strong>
                    <span class="text-xs text-muted">Royal Enfield, Duke</span>
                  </div>
                </div>

                <!-- Plate & Model -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label class="block text-xs font-bold uppercase text-muted mb-1">Registration Plate *</label>
                    <input type="text" name="vehicle_number" class="clay-input w-full font-mono font-bold" required placeholder="KA-01-AB-1234" value="KA-05-MR-4412" />
                  </div>
                  <div>
                    <label class="block text-xs font-bold uppercase text-muted mb-1">Vehicle Make & Model *</label>
                    <input type="text" name="vehicle_model" class="clay-input w-full" required placeholder="e.g. Hyundai Creta SX (White)" value="Hyundai Creta SX (Polar White)" />
                  </div>
                </div>
              </div>

              <!-- Step 2: Wash Service Package -->
              <div class="clay-card p-6">
                <div class="flex items-center gap-3 mb-4">
                  <div class="step-mini-orb">2</div>
                  <h3 class="text-lg font-black text-charcoal">Choose Wash & Detailing Service</h3>
                </div>

                <div class="space-y-3">
                  <label class="service-select-row clay-card ${activeServiceId === 1 ? 'selected' : ''}">
                    <input type="radio" name="service_id" value="1" ${activeServiceId === 1 ? 'checked' : ''} class="hidden" />
                    <div class="flex items-center justify-between w-full">
                      <div>
                        <strong class="text-base font-bold">Express Snow Foam Wash</strong>
                        <p class="text-xs text-muted">Exterior snow foam, 150-bar underbody blast, microfiber dry & tire shine.</p>
                        <span class="badge badge-subtle mt-1">15 Mins SLA</span>
                      </div>
                      <div class="text-right">
                        <span class="text-lg font-black text-violet">₹${packagePrices[vType][1]}</span>
                      </div>
                    </div>
                  </label>

                  <label class="service-select-row clay-card ${activeServiceId === 2 ? 'selected' : ''}">
                    <input type="radio" name="service_id" value="2" ${activeServiceId === 2 ? 'checked' : ''} class="hidden" />
                    <div class="flex items-center justify-between w-full">
                      <div>
                        <strong class="text-base font-bold">Interior Deep Steam Sanitization</strong>
                        <p class="text-xs text-muted">140°C thermal steam, deep vacuum, upholstery stain scrub, AC ozonation.</p>
                        <span class="badge badge-completed mt-1">35 Mins Spa</span>
                      </div>
                      <div class="text-right">
                        <span class="text-lg font-black text-violet">₹${packagePrices[vType][2]}</span>
                      </div>
                    </div>
                  </label>

                  <label class="service-select-row clay-card ${activeServiceId === 3 ? 'selected' : ''}">
                    <input type="radio" name="service_id" value="3" ${activeServiceId === 3 ? 'checked' : ''} class="hidden" />
                    <div class="flex items-center justify-between w-full">
                      <div>
                        <strong class="text-base font-bold">9H Nano-Ceramic Gloss Coating</strong>
                        <p class="text-xs text-muted">Mirror hydrophobicity, clay bar decon, 1-year UV paint protection shield.</p>
                        <span class="badge badge-pending mt-1">60 Mins Armor</span>
                      </div>
                      <div class="text-right">
                        <span class="text-lg font-black text-violet">₹${packagePrices[vType][3]}</span>
                      </div>
                    </div>
                  </label>

                  <label class="service-select-row clay-card ${activeServiceId === 4 ? 'selected' : ''}">
                    <input type="radio" name="service_id" value="4" ${activeServiceId === 4 ? 'checked' : ''} class="hidden" />
                    <div class="flex items-center justify-between w-full">
                      <div>
                        <strong class="text-base font-bold">Showroom Detailing Spa</strong>
                        <p class="text-xs text-muted">Full exterior foam + interior steam + 2-stage scratch polish + 24-pt QC certificate.</p>
                        <span class="badge badge-completed mt-1">90 Mins Total Restore</span>
                      </div>
                      <div class="text-right">
                        <span class="text-lg font-black text-violet">₹${packagePrices[vType][4]}</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Step 3: Fuel Station Hub & Time Slot -->
              <div class="clay-card p-6">
                <div class="flex items-center gap-3 mb-4">
                  <div class="step-mini-orb">3</div>
                  <h3 class="text-lg font-black text-charcoal">Location Hub & Preferred Time</h3>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label class="block text-xs font-bold uppercase text-muted mb-1">Select Fuel Station Hub *</label>
                    <select name="franchise_id" class="clay-select w-full" id="public-hub-select" required>
                      ${franchises
                        .map(
                          (f) => `
                        <option value="${f.id}" ${selectedFranchiseId === f.id ? 'selected' : ''}>
                          ${f.name} (${f.city || 'Bangalore'})
                        </option>
                      `
                        )
                        .join('')}
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-bold uppercase text-muted mb-1">Wash Date *</label>
                    <input type="date" name="booking_date" class="clay-input w-full" required value="${new Date().toISOString().split('T')[0]}" />
                  </div>
                </div>

                <label class="block text-xs font-bold uppercase text-muted mb-2">Select 15-Minute Slot *</label>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  ${timeSlots
                    .map(
                      (slot, idx) => `
                    <label class="slot-select-chip ${idx === 1 ? 'selected' : ''}">
                      <input type="radio" name="slot_time" value="${slot}" ${idx === 1 ? 'checked' : ''} class="hidden" />
                      <span>${slot}</span>
                    </label>
                  `
                    )
                    .join('')}
                </div>
              </div>

              <!-- Step 4: Customer Details -->
              <div class="clay-card p-6">
                <div class="flex items-center gap-3 mb-4">
                  <div class="step-mini-orb">4</div>
                  <h3 class="text-lg font-black text-charcoal">Your Contact Information</h3>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-xs font-bold uppercase text-muted mb-1">Full Name *</label>
                    <input type="text" name="customer_name" class="clay-input w-full" required placeholder="Rajesh Sharma" value="Rajesh Sharma" />
                  </div>
                  <div>
                    <label class="block text-xs font-bold uppercase text-muted mb-1">WhatsApp / Phone *</label>
                    <input type="tel" name="customer_phone" class="clay-input w-full" required placeholder="+91 98765 43210" value="+91 98765 43210" />
                  </div>
                  <div>
                    <label class="block text-xs font-bold uppercase text-muted mb-1">Email (For Tax Invoice)</label>
                    <input type="email" name="customer_email" class="clay-input w-full" placeholder="rajesh@example.com" value="rajesh.sharma@gmail.com" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Right 1 Col: Summary & Confirmation -->
            <div class="lg:col-span-1">
              <div class="clay-card p-6 sticky top-24">
                <h3 class="text-lg font-black text-charcoal mb-4">Booking Summary</h3>

                <div class="space-y-3 pb-4 border-b text-sm">
                  <div class="flex justify-between">
                    <span class="text-muted">Vehicle Category:</span>
                    <strong class="uppercase font-mono">${vType}</strong>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-muted">Base Package Price:</span>
                    <span>₹${basePrice}</span>
                  </div>
                  ${
                    discount > 0
                      ? `
                    <div class="flex justify-between text-green font-bold">
                      <span>Promo Discount (${appliedPromoCode}):</span>
                      <span>-₹${discount}</span>
                    </div>
                  `
                      : ''
                  }
                  <div class="flex justify-between">
                    <span class="text-muted">GST @ 18% (CGST + SGST):</span>
                    <span>₹${gst}</span>
                  </div>
                </div>

                <!-- Total -->
                <div class="flex justify-between items-center py-4 text-charcoal">
                  <span class="font-bold text-base">Total Amount:</span>
                  <span class="text-2xl font-black text-violet">₹${totalAmount}</span>
                </div>

                <!-- Promo Code Box -->
                <div class="promo-box my-3">
                  <div class="flex items-center gap-2">
                    <input type="text" id="public-promo-input" class="clay-input text-xs flex-1 uppercase font-mono font-bold" placeholder="Use code SHINE20" value="${appliedPromoCode || ''}" />
                    <button type="button" class="clay-btn clay-btn-secondary clay-btn-sm" id="btn-apply-promo">
                      Apply
                    </button>
                  </div>
                  <span class="text-xs text-muted mt-1 block">Enter code <strong>SHINE20</strong> for instant ₹100 discount!</span>
                </div>

                <div class="p-3 bg-[#EFEBF5] rounded-xl text-xs text-muted space-y-1 mb-4 shadow-clayPressed">
                  <div class="flex items-center gap-1 font-bold text-charcoal">
                    ${icons.shield} SpeedoShine Guarantee
                  </div>
                  <div>&bull; Zero pre-payment required.</div>
                  <div>&bull; Free cancellation up to 30 mins before.</div>
                  <div>&bull; Live CCTV tracking link sent via SMS.</div>
                </div>

                <button type="submit" class="clay-btn clay-btn-primary w-full py-4 text-base font-black shadow-clayButton">
                  ${icons.check} Confirm & Reserve Slot
                </button>
              </div>
            </div>
          </div>
        </form>
      `
      }
    </div>
  `;
}
