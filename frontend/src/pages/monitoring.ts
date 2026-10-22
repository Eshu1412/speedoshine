import { icons } from '../components/icons.ts';
import type { CctvBay } from '../api.ts';

export interface MonitoringPageState {
  selectedBayId: number;
  viewMode: 'grid' | 'single';
  sliderPosition: number; // 0 to 100
  ptzZoom: number;
  isRecording: boolean;
  activeTab: 'live_feed' | 'proof_gallery' | 'inspection';
  isUploadProofModalOpen?: boolean;
  isCustomerPortalModalOpen?: boolean;
}

export function getDemoBays(): CctvBay[] {
  return [
    {
      id: 1,
      bay_name: 'Bay 1 — Foam & Pressure Wash',
      bay_code: 'BAY-01-FOAM',
      service_type: 'Full Body Foam Wash',
      current_car: 'Hyundai Creta 2024 (Polar White)',
      vehicle_plate: 'KA-01-AB-1234',
      detailer_name: 'Ravi Shankar (Washer)',
      status: 'active',
      fps: 30,
      resolution: '1080p HD',
      progress_percent: 65,
      stage: 'Triple-Foam Pre-Rinse & Wheel Degrease',
      before_img: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80',
      during_img: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=800&q=80',
      after_img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      bay_name: 'Bay 2 — Interior Steam & Sanitize',
      bay_code: 'BAY-02-STEAM',
      service_type: 'Interior Deep Clean & Extraction',
      current_car: 'BMW 320Ld (Mineral Grey)',
      vehicle_plate: 'KA-05-CD-5678',
      detailer_name: 'Mohammed Irfan (Detailer)',
      status: 'active',
      fps: 29,
      resolution: '1080p HD',
      progress_percent: 40,
      stage: 'Hot Steam AC Vent Sanitization',
      before_img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      during_img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
      after_img: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 3,
      bay_name: 'Bay 3 — Ceramic Cleanroom & Curing',
      bay_code: 'BAY-03-NANO',
      service_type: '9H Nano-Ceramic 3-Year Shield',
      current_car: 'Porsche Macan (Gentian Blue)',
      vehicle_plate: 'KA-03-EF-9012',
      detailer_name: 'Arun Prasad (Lead Detailer)',
      status: 'active',
      fps: 30,
      resolution: '4K Ultra-HD',
      progress_percent: 85,
      stage: 'Infrared Curing Lamp Pass #2',
      before_img: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
      during_img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
      after_img: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 4,
      bay_name: 'Bay 4 — Final QC & Delivery Bay',
      bay_code: 'BAY-04-QC',
      service_type: 'Paint Correction & Final Inspection',
      current_car: 'Tata Safari Dark Edition (Oberon Black)',
      vehicle_plate: 'KA-01-GH-3456',
      detailer_name: 'Suresh Babu (Supervisor)',
      status: 'active',
      fps: 30,
      resolution: '1080p HD',
      progress_percent: 95,
      stage: 'Optical Inspection Light Tunnel Check',
      before_img: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80',
      during_img: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=800&q=80',
      after_img: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80',
    },
  ];
}

export function renderMonitoringPage(state: MonitoringPageState): string {
  const bays = getDemoBays();
  const currentBay = bays.find((b) => b.id === state.selectedBayId) || bays[0];

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour12: false });

  return `
    <div class="monitoring-page animate-fade-in">
      <!-- Top Metrics Strip -->
      <div class="stats-grid mb-6">
        <div class="stat-card">
          <div class="stat-card-icon green">${icons.video}</div>
          <div class="stat-card-value">4 / 4</div>
          <div class="stat-card-label">Bays Live & Streaming</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon violet">${icons.car}</div>
          <div class="stat-card-value">4 Active</div>
          <div class="stat-card-label">Vehicles In Process</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon blue">${icons.checkCircle}</div>
          <div class="stat-card-value">100%</div>
          <div class="stat-card-label">Proof Documentation Rate</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon amber">${icons.shield}</div>
          <div class="stat-card-value">Zero Scratches</div>
          <div class="stat-card-label">QC Compliance Score</div>
        </div>
      </div>

      <!-- Main Bay Control & Views -->
      <div class="clay-card mb-6">
        <div class="cctv-header-bar">
          <div class="cctv-nav-tabs">
            <button class="cctv-tab ${state.activeTab === 'live_feed' ? 'active' : ''}" data-tab="live_feed">
              ${icons.video} <span>Live CCTV Streams</span>
              <span class="live-pill">LIVE</span>
            </button>
            <button class="cctv-tab ${state.activeTab === 'proof_gallery' ? 'active' : ''}" data-tab="proof_gallery">
              ${icons.image} <span>Before / During / After Proof</span>
            </button>
            <button class="cctv-tab ${state.activeTab === 'inspection' ? 'active' : ''}" data-tab="inspection">
              ${icons.fileCheck} <span>24-Point QC Checklist</span>
            </button>
          </div>

          <div class="cctv-view-switch flex items-center gap-2">
            <button class="clay-btn clay-btn-sm ${state.viewMode === 'grid' ? 'clay-btn-primary' : 'clay-btn-secondary'}" id="btn-cctv-grid">
              ${icons.dashboard} Quad Grid
            </button>
            <button class="clay-btn clay-btn-sm ${state.viewMode === 'single' ? 'clay-btn-primary' : 'clay-btn-secondary'}" id="btn-cctv-single">
              ${icons.maximize} Single Bay
            </button>
            <button class="clay-btn clay-btn-sm clay-btn-secondary" id="btn-open-upload-proof">
              ${icons.upload} Upload Proof
            </button>
            <button class="clay-btn clay-btn-sm clay-btn-primary" id="btn-preview-customer-portal">
              ${icons.externalLink} Customer Portal
            </button>
          </div>
        </div>

        ${
          state.activeTab === 'live_feed'
            ? `
          ${
            state.viewMode === 'grid'
              ? `
            <!-- Quad Camera Grid -->
            <div class="cctv-grid-layout mt-6">
              ${bays
                .map(
                  (bay) => `
                <div class="cctv-feed-card clay-card-interactive" data-bay-id="${bay.id}">
                  <div class="cctv-video-wrapper">
                    <img src="${bay.during_img}" alt="${bay.bay_name}" class="cctv-video-frame" />
                    
                    <!-- HUD Overlay -->
                    <div class="cctv-hud-top">
                      <div class="cctv-rec-badge">
                        <span class="pulse-dot"></span> REC
                      </div>
                      <div class="cctv-hud-cam">${bay.bay_code} &bull; ${bay.fps} FPS</div>
                      <div class="cctv-hud-time">${timeStr}</div>
                    </div>

                    <!-- Water Spray Effect Overlay -->
                    <div class="cctv-spray-overlay"></div>

                    <div class="cctv-hud-bottom">
                      <div class="cctv-vehicle-tag">
                        <strong>${bay.vehicle_plate}</strong>
                        <span>${bay.current_car}</span>
                      </div>
                      <div class="cctv-progress-badge">${bay.progress_percent}%</div>
                    </div>
                  </div>

                  <div class="cctv-feed-footer">
                    <div>
                      <h4 class="cctv-feed-title">${bay.bay_name}</h4>
                      <p class="cctv-feed-sub">${bay.service_type} &bull; ${bay.detailer_name}</p>
                    </div>
                    <button class="clay-btn clay-btn-sm clay-btn-primary btn-inspect-bay" data-bay-id="${bay.id}">
                      ${icons.maximize} Focus
                    </button>
                  </div>
                </div>
              `
                )
                .join('')}
            </div>
          `
              : `
            <!-- Single Bay Focused View with PTZ Controls -->
            <div class="cctv-single-layout mt-6">
              <div class="cctv-focus-viewport clay-card">
                <div class="cctv-video-wrapper large">
                  <img src="${currentBay.during_img}" alt="${currentBay.bay_name}" class="cctv-video-frame large" id="main-cctv-stream" />
                  
                  <div class="cctv-hud-top">
                    <div class="cctv-rec-badge">
                      <span class="pulse-dot"></span> LIVE BROADCAST
                    </div>
                    <div class="cctv-hud-cam">${currentBay.bay_code} &bull; ${currentBay.resolution} @ ${currentBay.fps} FPS</div>
                    <div class="cctv-hud-time" id="cctv-clock">${timeStr}</div>
                  </div>

                  <div class="cctv-spray-overlay"></div>

                  <div class="cctv-hud-bottom">
                    <div class="cctv-vehicle-tag">
                      <span class="cctv-stage-pill">${currentBay.stage}</span>
                      <strong class="text-xl">${currentBay.vehicle_plate} &mdash; ${currentBay.current_car}</strong>
                      <span class="text-sm">Assigned Lead: ${currentBay.detailer_name}</span>
                    </div>
                    <div class="cctv-progress-pill">
                      <span>Progress</span>
                      <strong>${currentBay.progress_percent}%</strong>
                    </div>
                  </div>
                </div>

                <!-- PTZ & Action Bar -->
                <div class="cctv-controls-strip">
                  <div class="cctv-bay-pills">
                    ${bays
                      .map(
                        (b) => `
                      <button class="cctv-selector-pill ${b.id === currentBay.id ? 'active' : ''}" data-bay-id="${b.id}">
                        ${b.bay_name.split('—')[0]}
                      </button>
                    `
                      )
                      .join('')}
                  </div>

                  <div class="ptz-tools">
                    <button class="clay-btn clay-btn-sm clay-btn-secondary" id="btn-ptz-left" title="Pan Left">&larr;</button>
                    <button class="clay-btn clay-btn-sm clay-btn-secondary" id="btn-ptz-up" title="Tilt Up">&uarr;</button>
                    <button class="clay-btn clay-btn-sm clay-btn-secondary" id="btn-ptz-down" title="Tilt Down">&darr;</button>
                    <button class="clay-btn clay-btn-sm clay-btn-secondary" id="btn-ptz-right" title="Pan Right">&rarr;</button>
                    
                    <button class="clay-btn clay-btn-sm clay-btn-secondary" id="btn-ptz-zoom-in" title="Zoom In">+ Zoom</button>
                    <button class="clay-btn clay-btn-sm clay-btn-secondary" id="btn-ptz-zoom-out" title="Zoom Out">- Zoom</button>

                    <button class="clay-btn clay-btn-sm clay-btn-primary" id="btn-cctv-snapshot">
                      ${icons.camera} Capture Proof Photo
                    </button>
                    <button class="clay-btn clay-btn-sm clay-btn-ghost" id="btn-share-stream">
                      ${icons.share} Send Customer Live Link
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `
          }
        `
            : ''
        }

        ${
          state.activeTab === 'proof_gallery'
            ? `
          <!-- Proof of Service Gallery & Interactive Slider -->
          <div class="proof-gallery-container mt-6">
            <div class="proof-header-card clay-card mb-6">
              <div class="proof-header-info">
                <span class="badge badge-success">Verified Service Proof</span>
                <h3 class="text-2xl mt-1">${currentBay.current_car} (${currentBay.vehicle_plate})</h3>
                <p class="text-muted">${currentBay.service_type} &bull; Timestamped photographic proof for customer transparency</p>
              </div>

              <div class="proof-actions">
                <button class="clay-btn clay-btn-primary" id="btn-download-proof-pdf">
                  ${icons.download} Download Proof Certificate
                </button>
                <button class="clay-btn clay-btn-secondary" id="btn-whatsapp-proof">
                  ${icons.send} Send to Customer WhatsApp
                </button>
              </div>
            </div>

            <!-- Before vs After Interactive Split View -->
            <div class="before-after-wrapper clay-card mb-6">
              <div class="before-after-labels">
                <span class="label-before">BEFORE WASH (Check-in)</span>
                <span class="label-after">AFTER FINISH (9H Ceramic Hydrophobic)</span>
              </div>

              <div class="before-after-stage" id="split-comparison-stage">
                <img src="${currentBay.after_img}" alt="After finish" class="after-image" />
                <div class="before-image-clip" style="width: ${state.sliderPosition || 50}%;">
                  <img src="${currentBay.before_img}" alt="Before wash" class="before-image" />
                </div>
                <div class="slider-divider" style="left: ${state.sliderPosition || 50}%;">
                  <div class="slider-handle">
                    &#x2194;
                  </div>
                </div>
              </div>
              <input type="range" min="0" max="100" value="${state.sliderPosition || 50}" class="clay-range mt-4" id="split-slider-input" />
              <p class="text-center text-sm text-muted mt-2">Drag slider or move mouse over image to compare vehicle surface restoration</p>
            </div>

            <!-- Photo Stages Triad -->
            <div class="stages-triad-grid">
              <div class="stage-photo-card clay-card">
                <div class="stage-tag">Stage 1: Pre-Wash Condition</div>
                <img src="${currentBay.before_img}" alt="Pre-Wash" class="stage-img" />
                <div class="stage-details">
                  <h4>Heavy Grime & Road Tar</h4>
                  <p class="text-sm text-muted">Brake dust on alloy wheels, swirl marks on hood, rain mineral spots.</p>
                  <span class="timestamp">${now.toLocaleDateString()} 10:15 AM</span>
                </div>
              </div>

              <div class="stage-photo-card clay-card">
                <div class="stage-tag">Stage 2: Active Treatment</div>
                <img src="${currentBay.during_img}" alt="Active Treatment" class="stage-img" />
                <div class="stage-details">
                  <h4>Snow Foam & Decontamination</h4>
                  <p class="text-sm text-muted">pH-neutral thick foam bath, iron fallout remover, clay bar pass.</p>
                  <span class="timestamp">${now.toLocaleDateString()} 10:45 AM</span>
                </div>
              </div>

              <div class="stage-photo-card clay-card">
                <div class="stage-tag">Stage 3: Mirror Finish</div>
                <img src="${currentBay.after_img}" alt="Mirror Finish" class="stage-img" />
                <div class="stage-details">
                  <h4>Hydrophobic Glaze & Shine</h4>
                  <p class="text-sm text-muted">Tire dressing, glass rain repellant, high-gloss paint reflectivity.</p>
                  <span class="timestamp">${now.toLocaleDateString()} 11:30 AM</span>
                </div>
              </div>
            </div>
          </div>
        `
            : ''
        }

        ${
          state.activeTab === 'inspection'
            ? `
          <!-- 24-Point Quality Inspection Report -->
          <div class="inspection-container mt-6">
            <div class="inspection-hero clay-card mb-6">
              <div class="inspection-score-badge">
                <div class="score-circle">24/24</div>
                <div>
                  <h3 class="text-xl">SpeedoShine Certified Inspection Pass</h3>
                  <p class="text-muted">Inspected by Quality Supervisor Suresh Babu &bull; Zero Defect Guarantee</p>
                </div>
              </div>
              <div class="inspection-stamp">
                VERIFIED QUALITY
              </div>
            </div>

            <div class="inspection-checklist-grid">
              <div class="inspection-category clay-card">
                <h4 class="category-title text-violet">${icons.droplets} Exterior Wash & Decontamination</h4>
                <ul class="checklist-items">
                  <li><span class="check-icon">&#10003;</span> Front grill bug splatter removed</li>
                  <li><span class="check-icon">&#10003;</span> Wheel arches & underbody blast cleaned</li>
                  <li><span class="check-icon">&#10003;</span> Alloy wheels degreased & brake dust removed</li>
                  <li><span class="check-icon">&#10003;</span> Fuel lid cavity water dried</li>
                  <li><span class="check-icon">&#10003;</span> Door jambs wiped clean</li>
                  <li><span class="check-icon">&#10003;</span> Microfiber scratchless towel dried</li>
                </ul>
              </div>

              <div class="inspection-category clay-card">
                <h4 class="category-title text-blue">${icons.sparkle} Interior Detailing & Sanitization</h4>
                <ul class="checklist-items">
                  <li><span class="check-icon">&#10003;</span> Deep vacuuming under seats & trunk</li>
                  <li><span class="check-icon">&#10003;</span> Dashboard & console UV anti-static conditioned</li>
                  <li><span class="check-icon">&#10003;</span> AC vents steam sanitized (Odor-free)</li>
                  <li><span class="check-icon">&#10003;</span> Leather seats conditioned / Fabric spot treated</li>
                  <li><span class="check-icon">&#10003;</span> Cup holders & door pockets cleared</li>
                  <li><span class="check-icon">&#10003;</span> Foot mats power scrubbed & washed</li>
                </ul>
              </div>

              <div class="inspection-category clay-card">
                <h4 class="category-title text-pink">${icons.shield} Glass & Visibility</h4>
                <ul class="checklist-items">
                  <li><span class="check-icon">&#10003;</span> Windshield inside & outside streak-free</li>
                  <li><span class="check-icon">&#10003;</span> Rear windshield defogger safe cleaning</li>
                  <li><span class="check-icon">&#10003;</span> Side mirrors polished & water repellant applied</li>
                  <li><span class="check-icon">&#10003;</span> Sunroof glass crystal clean</li>
                  <li><span class="check-icon">&#10003;</span> Wiper blades silicone wiped</li>
                  <li><span class="check-icon">&#10003;</span> Headlight & taillight lenses polished</li>
                </ul>
              </div>

              <div class="inspection-category clay-card">
                <h4 class="category-title text-green">${icons.checkCircle} Final Touch & Protection</h4>
                <ul class="checklist-items">
                  <li><span class="check-icon">&#10003;</span> High-gloss satin tire dressing applied</li>
                  <li><span class="check-icon">&#10003;</span> Paint surface hydrophobicity tested</li>
                  <li><span class="check-icon">&#10003;</span> Exhaust tips stainless polished</li>
                  <li><span class="check-icon">&#10003;</span> Premium car fragrance card hung</li>
                  <li><span class="check-icon">&#10003;</span> Customer belongings intact & checked</li>
                  <li><span class="check-icon">&#10003;</span> Final walkaround supervisor approval</li>
                </ul>
              </div>
            </div>
          </div>
        `
            : ''
        }
      </div>

      <!-- Modal: Upload Service Proof Images (Module 6) -->
      ${
        state.isUploadProofModalOpen
          ? `
        <div class="clay-modal-overlay" id="upload-proof-modal">
          <div class="clay-modal-card animate-slide-up" style="max-width: 800px;">
            <div class="modal-header">
              <div class="modal-title-wrap">
                <div class="modal-icon violet">${icons.camera}</div>
                <div>
                  <h3>Upload Service Proof Documentation</h3>
                  <p class="modal-subtitle">${currentBay.current_car} (${currentBay.vehicle_plate}) &bull; ${currentBay.bay_name}</p>
                </div>
              </div>
              <button class="modal-close" id="btn-close-upload-proof">&times;</button>
            </div>

            <form id="upload-proof-form" class="modal-form">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <!-- Before Photo Upload -->
                <div class="clay-card p-4 text-center">
                  <span class="badge badge-pending mb-2 block">Stage 1: Before-Wash</span>
                  <div class="proof-upload-preview mb-3" style="height: 120px; border-radius: 16px; overflow: hidden; background: #eee;">
                    <img src="${currentBay.before_img}" alt="Before" style="width: 100%; height: 100%; object-fit: cover;" />
                  </div>
                  <label class="clay-btn clay-btn-sm clay-btn-secondary w-full cursor-pointer">
                    ${icons.upload} Choose Photo
                    <input type="file" accept="image/*" class="hidden" />
                  </label>
                  <small class="text-xs text-muted block mt-1">Wheels & paint condition</small>
                </div>

                <!-- During Photo Upload -->
                <div class="clay-card p-4 text-center">
                  <span class="badge badge-in-progress mb-2 block">Stage 2: During-Service</span>
                  <div class="proof-upload-preview mb-3" style="height: 120px; border-radius: 16px; overflow: hidden; background: #eee;">
                    <img src="${currentBay.during_img}" alt="During" style="width: 100%; height: 100%; object-fit: cover;" />
                  </div>
                  <label class="clay-btn clay-btn-sm clay-btn-secondary w-full cursor-pointer">
                    ${icons.camera} Snap / Choose
                    <input type="file" accept="image/*" class="hidden" />
                  </label>
                  <small class="text-xs text-muted block mt-1">Snow foam & steam pass</small>
                </div>

                <!-- After Photo Upload -->
                <div class="clay-card p-4 text-center">
                  <span class="badge badge-completed mb-2 block">Stage 3: After-Finish</span>
                  <div class="proof-upload-preview mb-3" style="height: 120px; border-radius: 16px; overflow: hidden; background: #eee;">
                    <img src="${currentBay.after_img}" alt="After" style="width: 100%; height: 100%; object-fit: cover;" />
                  </div>
                  <label class="clay-btn clay-btn-sm clay-btn-secondary w-full cursor-pointer">
                    ${icons.upload} Choose Photo
                    <input type="file" accept="image/*" class="hidden" />
                  </label>
                  <small class="text-xs text-muted block mt-1">Hydrophobic gloss result</small>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Inspecting Supervisor *</label>
                  <input type="text" class="clay-input" value="Suresh Babu (Certified QC)" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Quality Score</label>
                  <input type="text" class="clay-input font-bold text-green" value="24 / 24 Checks Passed (100%)" readonly />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Technician Inspection Notes</label>
                <textarea class="clay-textarea" rows="2" placeholder="e.g. Swirl marks on rear quarter panel buffed out; tire dressing and windshield rain coat applied."></textarea>
              </div>

              <div class="modal-actions mt-4 flex justify-between items-center">
                <label class="toggle-pill">
                  <input type="checkbox" checked />
                  <span>Notify Customer on WhatsApp Instantly</span>
                </label>
                <div class="flex gap-2">
                  <button type="button" class="clay-btn clay-btn-secondary" id="btn-cancel-upload-proof">Cancel</button>
                  <button type="submit" class="clay-btn clay-btn-primary">
                    ${icons.check} Save & Publish Proof
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      `
          : ''
      }

      <!-- Modal: Customer Access to Service Images & Live Tracking Portal (Module 6 item 5) -->
      ${
        state.isCustomerPortalModalOpen
          ? `
        <div class="clay-modal-overlay" id="customer-portal-modal">
          <div class="clay-modal-card animate-slide-up" style="max-width: 580px; border: 2.5px solid rgba(124, 58, 237, 0.3);">
            <div class="modal-header">
              <div class="modal-title-wrap">
                <div class="modal-icon green">${icons.globe}</div>
                <div>
                  <h3>Customer Live Service Tracking Portal</h3>
                  <p class="modal-subtitle">Real-time mobile web view for <strong>${currentBay.current_car}</strong></p>
                </div>
              </div>
              <button class="modal-close" id="btn-close-customer-portal">&times;</button>
            </div>

            <div class="customer-portal-body space-y-4">
              <!-- Live Video Banner -->
              <div class="clay-card p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="badge badge-completed flex items-center gap-1">
                    <span class="pulse-dot"></span> LIVE FROM BAY CCTV
                  </span>
                  <span class="text-xs text-muted font-mono">${currentBay.bay_code} &bull; ${timeStr}</span>
                </div>
                <div style="border-radius: 18px; overflow: hidden; position: relative; height: 180px;">
                  <img src="${currentBay.during_img}" alt="Live stream" style="width: 100%; height: 100%; object-fit: cover;" />
                  <div style="position: absolute; bottom: 8px; left: 12px; background: rgba(0,0,0,0.6); padding: 4px 10px; border-radius: 10px; color: white; font-size: 11px;">
                    Stage: ${currentBay.stage} (${currentBay.progress_percent}%)
                  </div>
                </div>
              </div>

              <!-- Photographic Inspection Proof Triad -->
              <div class="clay-card p-4">
                <h4 class="font-bold text-sm mb-3">Timestamped Photographic Service Proof</h4>
                <div class="grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <img src="${currentBay.before_img}" alt="Before" style="height: 75px; width: 100%; object-fit: cover; border-radius: 12px;" />
                    <span class="block mt-1 text-muted">1. Pre-Check</span>
                  </div>
                  <div>
                    <img src="${currentBay.during_img}" alt="During" style="height: 75px; width: 100%; object-fit: cover; border-radius: 12px;" />
                    <span class="block mt-1 text-violet font-bold">2. Wash Bath</span>
                  </div>
                  <div>
                    <img src="${currentBay.after_img}" alt="After" style="height: 75px; width: 100%; object-fit: cover; border-radius: 12px;" />
                    <span class="block mt-1 text-green font-bold">3. Finished Gloss</span>
                  </div>
                </div>
              </div>

              <!-- 24-Point Quality Pass Banner -->
              <div class="clay-card p-4 flex items-center justify-between" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(124, 58, 237, 0.08));">
                <div class="flex items-center gap-3">
                  <div class="modal-icon green" style="width: 44px; height: 44px;">${icons.checkCircle}</div>
                  <div>
                    <strong class="text-sm block">SpeedoShine 24/24 Quality Pass</strong>
                    <span class="text-xs text-muted">Verified by Lead QC: ${currentBay.detailer_name}</span>
                  </div>
                </div>
                <span class="badge badge-completed font-bold">PASS 100%</span>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-3 pt-2">
                <button type="button" class="clay-btn clay-btn-secondary flex-1" id="btn-copy-portal-link">
                  ${icons.copy} Copy Public Link
                </button>
                <a href="https://maps.google.com" target="_blank" class="clay-btn clay-btn-primary flex-1 text-center">
                  ${icons.starFilled} Rate on Google
                </a>
              </div>
            </div>
          </div>
        </div>
      `
          : ''
      }
    </div>
  `;
}
