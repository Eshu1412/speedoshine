import { icons } from '../components/icons.ts';
import type { Franchise } from '../api.ts';

export interface MapsPageState {
  franchises: Franchise[];
  selectedHubId: number;
  searchedAddress: string;
  checkedResult: {
    pincode: string;
    area: string;
    nearestHub: string;
    distanceKm: number;
    isServiced: boolean;
    etaMinutes: number;
    doorstepAvailable: boolean;
  } | null;
  showRadius: boolean;
  showVans: boolean;
}

export function renderMapsPage(state: MapsPageState): string {
  const { searchedAddress, checkedResult, showRadius = true, showVans = true } = state;


  const hubCoordinates = [
    { id: 1, name: 'Koramangala Hub', x: 420, y: 350, r: 85, color: '#7C3AED', address: '80 Feet Rd, 4th Block' },
    { id: 2, name: 'Indiranagar Hub', x: 490, y: 230, r: 80, color: '#DB2777', address: '100 Feet Rd, Indiranagar' },
    { id: 3, name: 'HSR Layout Hub', x: 470, y: 440, r: 75, color: '#0EA5E9', address: '27th Main, Sector 1' },
    { id: 4, name: 'Whitefield Hub', x: 670, y: 260, r: 90, color: '#10B981', address: 'ITPL Main Rd, Whitefield' },
    { id: 5, name: 'Jayanagar Hub', x: 330, y: 380, r: 75, color: '#F59E0B', address: '4th Block, Jayanagar' },
  ];

  const mobileVans = [
    { id: 'VAN-01', x: 440, y: 310, name: 'Van 1 — Koramangala Area', target: 'Rahul Sharma (Sedan Wash)' },
    { id: 'VAN-02', x: 520, y: 240, name: 'Van 2 — Indiranagar Express', target: 'Priya Patel (Ceramic Check)' },
    { id: 'VAN-03', x: 630, y: 280, name: 'Van 3 — Whitefield Tech Park', target: 'Vikram Singh (Foam Wash)' },
  ];

  return `
    <div class="maps-page animate-fade-in">
      <!-- Top Metrics Strip -->
      <div class="stats-grid mb-6">
        <div class="stat-card">
          <div class="stat-card-icon violet">${icons.map}</div>
          <div class="stat-card-value">5 Franchise Hubs</div>
          <div class="stat-card-label">Strategic Bangalore Centers</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon green">${icons.shield}</div>
          <div class="stat-card-value">100% City Geofence</div>
          <div class="stat-card-label">Doorstep Coverage Active</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon blue">${icons.car}</div>
          <div class="stat-card-value">3 Mobile Vans</div>
          <div class="stat-card-label">Live GPS Doorstep Units</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon amber">${icons.clock}</div>
          <div class="stat-card-value">18 Mins</div>
          <div class="stat-card-label">Average Van ETA to Customer</div>
        </div>
      </div>

      <!-- Main Map & Geofence Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <!-- Interactive Visual SVG Map (2 cols) -->
        <div class="lg:col-span-2 clay-card p-6">
          <div class="map-toolbar flex items-center justify-between pb-4 border-b flex-wrap gap-4">
            <div>
              <h3 class="text-xl font-black">Bangalore Metro Geofence & Hub Map</h3>
              <p class="text-sm text-muted">Real-time GPS tracking & 10 km service radius boundary</p>
            </div>

            <div class="map-controls flex items-center gap-3">
              <label class="toggle-pill">
                <input type="checkbox" id="toggle-map-radius" ${showRadius ? 'checked' : ''} />
                <span>Coverage Radii</span>
              </label>
              <label class="toggle-pill">
                <input type="checkbox" id="toggle-map-vans" ${showVans ? 'checked' : ''} />
                <span>Mobile Vans</span>
              </label>
            </div>
          </div>

          <!-- SVG Visual Map Canvas -->
          <div class="svg-map-wrapper mt-4">
            <svg viewBox="0 0 800 550" class="bangalore-map-svg">
              <defs>
                <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#7C3AED" stop-opacity="0.25"/>
                  <stop offset="100%" stop-color="#7C3AED" stop-opacity="0"/>
                </radialGradient>
                <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(124, 58, 237, 0.06)" stroke-width="1"/>
                </pattern>
              </defs>

              <!-- Map Background Grid -->
              <rect width="800" height="550" fill="#F4F1FA" rx="24"/>
              <rect width="800" height="550" fill="url(#gridPattern)" rx="24"/>

              <!-- Major Arterial Bangalore Roads (SVG Paths) -->
              <!-- Outer Ring Road -->
              <path d="M 280 440 C 360 460, 480 470, 560 410 C 640 350, 710 280, 700 200 C 690 120, 560 90, 430 110 C 300 130, 240 240, 280 440 Z" fill="none" stroke="rgba(124, 58, 237, 0.15)" stroke-width="12" stroke-linejoin="round" />
              <!-- Hosur Road / Silk Board Corridor -->
              <path d="M 420 350 L 470 440 L 520 530" fill="none" stroke="rgba(219, 39, 119, 0.2)" stroke-width="6" stroke-dasharray="6,4" />
              <!-- Old Airport Road / Whitefield Corridor -->
              <path d="M 490 230 L 580 240 L 670 260" fill="none" stroke="rgba(16, 185, 129, 0.2)" stroke-width="6" stroke-dasharray="6,4" />

              <!-- Geofenced 10km Radius Bubbles -->
              ${
                showRadius
                  ? hubCoordinates
                      .map(
                        (h) => `
                <circle cx="${h.x}" cy="${h.y}" r="${h.r}" fill="${h.color}" fill-opacity="0.12" stroke="${h.color}" stroke-width="2" stroke-dasharray="4,4" class="geofence-circle" />
              `
                      )
                      .join('')
                  : ''
              }

              <!-- Franchise Hub Markers -->
              ${hubCoordinates
                .map(
                  (h) => `
                <g class="hub-marker-group" data-hub-id="${h.id}" transform="translate(${h.x}, ${h.y})" style="cursor: pointer;">
                  <circle r="22" fill="${h.color}" fill-opacity="0.25" class="hub-pulse" />
                  <circle r="14" fill="${h.color}" stroke="#FFFFFF" stroke-width="3" />
                  <text y="-20" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="12" fill="#332F3A">${h.name}</text>
                  <text y="30" text-anchor="middle" font-family="DM Sans" font-size="10" fill="#635F69">${h.address}</text>
                </g>
              `
                )
                .join('')}

              <!-- Live Mobile Van GPS Markers -->
              ${
                showVans
                  ? mobileVans
                      .map(
                        (van) => `
                <g class="van-marker-group" transform="translate(${van.x}, ${van.y})">
                  <circle r="16" fill="#10B981" fill-opacity="0.3" class="van-pulse" />
                  <circle r="9" fill="#10B981" stroke="#FFFFFF" stroke-width="2" />
                  <text y="-14" text-anchor="middle" font-family="DM Sans" font-weight="700" font-size="10" fill="#10B981">${van.id}</text>
                </g>
              `
                      )
                      .join('')
                  : ''
              }
            </svg>
          </div>

          <div class="map-legend flex items-center justify-center gap-6 mt-4 flex-wrap text-xs text-muted">
            <span class="flex items-center gap-2"><span class="legend-dot violet"></span> SpeedoShine Hub (Center)</span>
            <span class="flex items-center gap-2"><span class="legend-dot green"></span> Mobile Doorstep Van (Live GPS)</span>
            <span class="flex items-center gap-2"><span class="legend-circle"></span> 10km Guaranteed Doorstep Geofence</span>
          </div>
        </div>

        <!-- Address & Pincode Serviceability Finder (1 col) -->
        <div class="clay-card p-6 flex flex-col justify-between">
          <div>
            <h3 class="text-xl font-black mb-1">Customer Address Checker</h3>
            <p class="text-sm text-muted mb-4">Validate customer doorstep serviceability & nearest franchise</p>

            <form id="check-address-form" class="address-checker-form">
              <div class="form-group mb-3">
                <label class="form-label">Bangalore Pincode / Area Name</label>
                <div class="search-box">
                  <span class="search-icon">${icons.mapPin}</span>
                  <input
                    type="text"
                    id="address-input"
                    class="clay-input"
                    placeholder="e.g. 560034, Koramangala, Indiranagar..."
                    value="${searchedAddress || '560034'}"
                    required
                  />
                </div>
              </div>

              <button type="submit" class="clay-btn clay-btn-primary w-full" id="btn-check-serviceability">
                ${icons.search} Check Coverage & Distance
              </button>
            </form>

            <!-- Quick Area Shortcuts -->
            <div class="quick-areas mt-4">
              <span class="text-xs text-muted block mb-2">Test Popular Bangalore Locations:</span>
              <div class="flex flex-wrap gap-2">
                <button class="quick-loc-chip" data-loc="560034">560034 (Koramangala)</button>
                <button class="quick-loc-chip" data-loc="560038">560038 (Indiranagar)</button>
                <button class="quick-loc-chip" data-loc="560102">560102 (HSR Layout)</button>
                <button class="quick-loc-chip" data-loc="560066">560066 (Whitefield)</button>
                <button class="quick-loc-chip" data-loc="560041">560041 (Jayanagar)</button>
              </div>
            </div>

            <!-- Serviceability Result Card -->
            ${
              checkedResult
                ? `
              <div class="serviceability-result-card clay-card mt-6 animate-slide-up">
                <div class="flex items-center justify-between">
                  <span class="badge ${checkedResult.isServiced ? 'badge-completed' : 'badge-cancelled'}">
                    ${checkedResult.isServiced ? '&#10003; 100% Fully Serviced' : 'Out of Geofence'}
                  </span>
                  <strong class="text-sm text-muted">${checkedResult.pincode}</strong>
                </div>

                <div class="result-body mt-3">
                  <h4 class="text-lg font-bold">${checkedResult.area}</h4>
                  <div class="flex justify-between py-1 text-sm">
                    <span class="text-muted">Nearest Hub:</span>
                    <strong>${checkedResult.nearestHub}</strong>
                  </div>
                  <div class="flex justify-between py-1 text-sm">
                    <span class="text-muted">Distance from Hub:</span>
                    <strong class="text-violet">${checkedResult.distanceKm} km</strong>
                  </div>
                  <div class="flex justify-between py-1 text-sm">
                    <span class="text-muted">Doorstep Mobile Van:</span>
                    <strong class="text-green">&#10003; Available (${checkedResult.etaMinutes} min ETA)</strong>
                  </div>
                </div>

                <div class="result-actions mt-4">
                  <button class="clay-btn clay-btn-sm clay-btn-primary w-full" id="btn-book-from-map">
                    ${icons.plus} Schedule Doorstep Wash
                  </button>
                </div>
              </div>
            `
                : `
              <div class="serviceability-placeholder text-center p-6 text-muted mt-6 border-dashed">
                ${icons.mapPin}
                <p class="mt-2 text-sm">Enter a Bangalore pincode above to calculate exact franchise allocation and mobile van ETA.</p>
              </div>
            `
            }
          </div>

          <!-- Franchise Hub Directory Links -->
          <div class="pt-4 border-t mt-4 text-xs text-muted text-center">
            Managed by SpeedoShine Central Geofence Dispatcher
          </div>
        </div>
      </div>

      <!-- Hub Details Strip -->
      <div class="clay-table-wrapper">
        <div class="clay-table-header">
          <h3>Franchise Hubs & Geofence Allocation</h3>
          <span class="text-muted text-sm">Real-time capacity and service radius limits</span>
        </div>
        <div class="table-scroll">
          <table class="clay-table">
            <thead>
              <tr>
                <th>Franchise Hub</th>
                <th>Address & Coordinates</th>
                <th>Doorstep Radius</th>
                <th>Washing Bays</th>
                <th>Mobile Vans</th>
                <th>Active Queue</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${hubCoordinates
                .map(
                  (h, idx) => `
                <tr>
                  <td>
                    <div class="customer-cell">
                      <strong class="customer-name">${h.name}</strong>
                      <span class="customer-sub">Hub Code: SS-HUB-0${h.id}</span>
                    </div>
                  </td>
                  <td>
                    <span class="franchise-cell">${icons.mapPin} ${h.address}</span>
                  </td>
                  <td>
                    <strong class="text-violet">12.0 km</strong> radius
                  </td>
                  <td>
                    <strong>4 Active Bays</strong> (1080p CCTV)
                  </td>
                  <td>
                    <span class="badge badge-completed">2 Vans En Route</span>
                  </td>
                  <td>
                    <span class="text-sm font-bold">${[14, 18, 12, 9, 11][idx]} Cars Scheduled</span>
                  </td>
                  <td>
                    <span class="badge badge-completed">Operational</span>
                  </td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
