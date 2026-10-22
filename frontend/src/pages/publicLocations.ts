import { icons } from '../components/icons.ts';
import type { Franchise } from '../api.ts';

export interface PublicLocationsPageState {
  franchises: Franchise[];
}

export function renderPublicLocationsPage(state: PublicLocationsPageState): string {
  const { franchises } = state;

  return `
    <div class="public-locations-page animate-fade-in max-w-5xl mx-auto py-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <span class="section-eyebrow">BANGALORE FUEL STATION HUBS</span>
        <h1 class="text-3xl sm:text-5xl font-black text-charcoal">
          5 Prime Locations Across <span class="clay-text-gradient">Bangalore</span>
        </h1>
        <p class="text-muted max-w-2xl mx-auto text-base mt-4 leading-relaxed">
          Open daily from 7:00 AM to 10:00 PM at premium fuel stations. All locations equipped with high-pressure automated bays, 4K CCTV streaming, and comfortable driver waiting areas.
        </p>
      </div>

      <!-- Hub Directory Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        ${franchises
          .map(
            (f) => `
          <div class="clay-card p-6 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-3">
                <span class="badge badge-completed">OPEN NOW &bull; 7 AM – 10 PM</span>
                <span class="font-bold text-violet text-sm">⭐ 4.9 (350+ Reviews)</span>
              </div>
              <h3 class="text-xl font-black text-charcoal mb-1">${f.name}</h3>
              <p class="text-xs text-muted leading-relaxed mb-4">
                ${icons.mapPin} ${f.address || 'Hindustan Petroleum Fuel Station, 80 Feet Road'}, ${f.city || 'Bangalore'}
              </p>

              <div class="space-y-2 text-xs border-t pt-3 mb-4">
                <div class="flex justify-between">
                  <span class="text-muted">Lead Supervisor:</span>
                  <strong>${f.owner_name}</strong>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted">Wash Bays Available:</span>
                  <strong>4 High-Pressure Bays + 2 Steam Bays</strong>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted">Direct Phone:</span>
                  <a href="tel:${f.phone || '+91 80 4910 8800'}" class="text-violet font-bold">${f.phone || '+91 80 4910 8800'}</a>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-3 pt-2">
              <button class="clay-btn clay-btn-primary clay-btn-sm flex-1 btn-book-at-hub" data-hub-id="${f.id}" data-hub-name="${f.name}">
                ${icons.calendar} Book Slot Here
              </button>
              <button class="clay-btn clay-btn-ghost clay-btn-sm" onclick="window.open('https://maps.google.com/?q=${encodeURIComponent(f.name + ' Bangalore')}', '_blank')">
                ${icons.map} Directions
              </button>
            </div>
          </div>
        `
          )
          .join('')}
      </div>

      <!-- Doorstep Mobile Detailing Van Banner -->
      <div class="clay-card p-8 flex items-center justify-between flex-wrap gap-6 bg-white/70">
        <div>
          <span class="badge badge-in-progress mb-2">${icons.truck} DOORSTEP MOBILE SERVICE</span>
          <h3 class="text-xl font-black text-charcoal">Can't Make It To A Fuel Station?</h3>
          <p class="text-xs text-muted mt-1 max-w-lg">
            Our fully-equipped mobile detailing vans carry 500L RO water, silent Honda generators, and steam extractors directly to your apartment or office parking lot.
          </p>
        </div>
        <button class="clay-btn clay-btn-secondary" id="btn-request-mobile-van">
          ${icons.phone} Call For Doorstep Van (+91 98765 43210)
        </button>
      </div>
    </div>
  `;
}
