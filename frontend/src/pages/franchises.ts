import { icons } from '../components/icons.ts';
import type { Franchise, FranchiseCommission, Customer, Staff, Booking } from '../api.ts';

export interface FranchisePageState {
  franchises: Franchise[];
  customers?: Customer[];
  staff?: Staff[];
  bookings?: Booking[];
  searchQuery: string;
  isCreateModalOpen: boolean;
  editingFranchise: Franchise | null;
  activeTab?: 'outlets' | 'allocation' | 'customers_db' | 'commissions';
}

export function getDemoCommissions(franchises: Franchise[]): FranchiseCommission[] {
  return franchises.map((f, idx) => {
    const gross = f.total_revenue || [287500, 345000, 198000, 156000, 221000][idx % 5];
    const rate = f.commission_rate || 15;
    const royalty = (gross * rate) / 100;
    const net = gross - royalty;

    return {
      id: idx + 1,
      franchise_id: f.id,
      franchise_name: f.name,
      month: 'October 2026',
      gross_revenue: gross,
      commission_rate: rate,
      royalty_headquarters: royalty,
      franchise_net_payout: net,
      status: idx === 1 ? 'Settled' : 'Pending',
      paid_date: idx === 1 ? '2026-10-15' : undefined,
    };
  });
}

export function renderFranchisesPage(state: FranchisePageState): string {
  const { franchises, searchQuery } = state;
  const currentTab = state.activeTab || 'outlets';

  const filtered = franchises.filter((f) => {
    return (
      !searchQuery ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.owner_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.city && f.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
      f.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const totalRevenue = franchises.reduce((acc, f) => acc + (f.total_revenue || 0), 0);
  const avgRating =
    franchises.length > 0
      ? (franchises.reduce((acc, f) => acc + (f.rating || 0), 0) / franchises.length).toFixed(1)
      : '0.0';

  const commissions = getDemoCommissions(franchises);
  const totalRoyalty = commissions.reduce((sum, c) => sum + c.royalty_headquarters, 0);

  const cards = filtered
    .map(
      (f) => `
    <div class="clay-card franchise-card" data-franchise-id="${f.id}">
      <div class="franchise-card-header">
        <div class="franchise-icon-orb">
          ${icons.store}
        </div>
        <div class="franchise-header-title">
          <h4>${f.name}</h4>
          <span class="location-badge">${icons.mapPin} ${f.city || 'Bangalore'}, ${f.state || 'KA'}</span>
        </div>
        <span class="badge ${f.is_active ? 'badge-completed' : 'badge-cancelled'}">
          ${f.is_active ? 'Active Outlet' : 'Inactive'}
        </span>
      </div>

      <div class="franchise-stats-row">
        <div class="franchise-metric">
          <span class="metric-label">Revenue</span>
          <span class="metric-value font-bold text-violet">₹${(f.total_revenue || 0).toLocaleString('en-IN')}</span>
        </div>
        <div class="franchise-metric">
          <span class="metric-label">Bookings</span>
          <span class="metric-value font-bold">${f.total_bookings || 0}</span>
        </div>
        <div class="franchise-metric">
          <span class="metric-label">Rating</span>
          <span class="metric-value font-bold rating-val">⭐ ${f.rating.toFixed(1)}</span>
        </div>
        <div class="franchise-metric">
          <span class="metric-label">Royalty Split</span>
          <span class="metric-value font-bold text-pink">${f.commission_rate || 15}%</span>
        </div>
      </div>

      <div class="franchise-card-details">
        <div class="detail-line">
          <span class="label">Partner / Owner:</span>
          <span class="value font-bold">${f.owner_name}</span>
        </div>
        <div class="detail-line">
          <span class="label">Contact Email:</span>
          <span class="value">${f.email}</span>
        </div>
        <div class="detail-line">
          <span class="label">Address:</span>
          <span class="value text-truncate">${f.address || 'Central Bangalore Hub'}</span>
        </div>
        <div class="detail-line">
          <span class="label">Service Radius:</span>
          <span class="value font-bold text-violet">10.0 km Geofence (Doorstep Active)</span>
        </div>
      </div>

      <div class="franchise-card-actions">
        <button class="clay-btn clay-btn-sm clay-btn-secondary btn-view-hub-map" data-id="${f.id}">
          ${icons.map} View Coverage
        </button>
        <button class="clay-btn clay-btn-sm clay-btn-ghost btn-edit-franchise" data-id="${f.id}">
          ${icons.edit} Edit Terms
        </button>
      </div>
    </div>
  `
    )
    .join('');

  return `
    <div class="franchises-page animate-fade-in">
      <!-- Top Metrics -->
      <div class="stats-grid mb-6">
        <div class="stat-card">
          <div class="stat-card-icon pink">${icons.store}</div>
          <div class="stat-card-value">${franchises.length}</div>
          <div class="stat-card-label">Operating Hubs</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon violet">${icons.revenue}</div>
          <div class="stat-card-value">₹${totalRevenue.toLocaleString('en-IN')}</div>
          <div class="stat-card-label">Network Gross Volume</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon green">${icons.percent}</div>
          <div class="stat-card-value">₹${Math.round(totalRoyalty).toLocaleString('en-IN')}</div>
          <div class="stat-card-label">HQ Commission Accrued</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon amber">${icons.starFilled}</div>
          <div class="stat-card-value">${avgRating}</div>
          <div class="stat-card-label">Network Avg Score</div>
        </div>
      </div>

      <!-- Tab Switcher for Module 2 -->
      <div class="clay-card mb-6">
        <div class="flex items-center justify-between flex-wrap gap-4 border-b pb-4">
          <div class="flex items-center gap-2">
            <button class="status-tab ${currentTab === 'outlets' ? 'active' : ''}" data-franchise-tab="outlets">
              ${icons.store} <span>Franchise Outlets (${franchises.length})</span>
            </button>
            <button class="status-tab ${currentTab === 'allocation' ? 'active' : ''}" data-franchise-tab="allocation">
              ${icons.car} <span>Booking & Staff Allocation</span>
            </button>
            <button class="status-tab ${currentTab === 'customers_db' ? 'active' : ''}" data-franchise-tab="customers_db">
              ${icons.users} <span>Franchise Customer DB</span>
            </button>
            <button class="status-tab ${currentTab === 'commissions' ? 'active' : ''}" data-franchise-tab="commissions">
              ${icons.creditCard} <span>Royalty & Settlements</span>
            </button>
          </div>

          <div class="flex items-center gap-3">
            <button class="clay-btn clay-btn-primary" id="btn-open-create-franchise">
              ${icons.plus} Onboard Franchise
            </button>
          </div>
        </div>

        ${
          currentTab === 'outlets'
            ? `
          <!-- Toolbar -->
          <div class="bookings-toolbar mt-4">
            <div class="search-box">
              <span class="search-icon">${icons.search}</span>
              <input
                type="text"
                id="franchise-search-input"
                class="clay-input"
                placeholder="Search by franchise name, owner, city..."
                value="${searchQuery}"
              />
            </div>
          </div>

          <!-- Franchise Cards Grid -->
          <div class="franchises-grid mt-6">
            ${
              filtered.length > 0
                ? cards
                : `
              <div class="col-span-full text-center py-12 text-muted empty-state">
                ${icons.store}
                <h3>No franchise locations found</h3>
                <p>Try searching for a different outlet name.</p>
              </div>
            `
            }
          </div>
        `
            : ''
        }

        ${
          currentTab === 'commissions'
            ? `
          <!-- Royalty & Commission Management Table -->
          <div class="clay-table-wrapper mt-4">
            <div class="clay-table-header">
              <h3>Monthly Commission & Headquarters Royalty Management</h3>
              <span class="text-green font-bold text-sm">&#10003; 15% Platform Royalty Model</span>
            </div>
            <div class="table-scroll">
              <table class="clay-table">
                <thead>
                  <tr>
                    <th>Franchise Outlet</th>
                    <th>Billing Cycle</th>
                    <th>Gross Sales</th>
                    <th>Royalty Rate</th>
                    <th>HQ Share (15%)</th>
                    <th>Franchise Payout (85%)</th>
                    <th>Settlement Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${commissions
                    .map(
                      (comm) => `
                    <tr>
                      <td>
                        <strong>${comm.franchise_name}</strong>
                      </td>
                      <td>
                        <span class="font-mono text-sm">${comm.month}</span>
                      </td>
                      <td class="amount-cell">
                        ₹${comm.gross_revenue.toLocaleString('en-IN')}
                      </td>
                      <td>
                        <span class="badge badge-outline">${comm.commission_rate}%</span>
                      </td>
                      <td class="text-pink font-bold">
                        ₹${Math.round(comm.royalty_headquarters).toLocaleString('en-IN')}
                      </td>
                      <td class="text-green font-bold">
                        ₹${Math.round(comm.franchise_net_payout).toLocaleString('en-IN')}
                      </td>
                      <td>
                        <span class="badge ${comm.status === 'Settled' ? 'badge-completed' : 'badge-pending'}">
                          ${comm.status}
                        </span>
                      </td>
                      <td>
                        ${
                          comm.status === 'Pending'
                            ? `
                          <button class="clay-btn clay-btn-sm clay-btn-primary btn-settle-commission" data-id="${comm.id}">
                            ${icons.check} Process Payout
                          </button>
                        `
                            : `
                          <span class="text-xs text-muted font-mono">Paid: ${comm.paid_date}</span>
                        `
                        }
                      </td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
            </div>
          </div>
        `
            : ''
        }

        ${
          currentTab === 'allocation'
            ? `
          <!-- Booking Allocation & Staff Assignment Engine (Module 2) -->
          <div class="franchise-allocation-container mt-4 animate-fade-in">
            <!-- Hub Capacity & Workload Cards -->
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              ${franchises
                .map((f, idx) => {
                  const loads = [14, 18, 12, 9, 11];
                  const load = loads[idx % loads.length];
                  const staffCounts = [4, 5, 3, 3, 3];
                  const staffCnt = staffCounts[idx % staffCounts.length];
                  return `
                <div class="clay-card p-4">
                  <div class="flex items-center justify-between mb-2">
                    <strong class="text-sm font-bold">${f.name.split(' ')[0]}</strong>
                    <span class="duty-dot online"></span>
                  </div>
                  <div class="text-2xl font-black text-violet">${load} Cars</div>
                  <span class="text-xs text-muted block mt-1">${staffCnt} Staff &bull; 4 Bays Active</span>
                  <div class="mt-3 pt-2 border-t flex justify-between text-xs">
                    <span class="text-muted">Capacity:</span>
                    <strong class="${load > 15 ? 'text-pink' : 'text-green'}">${load > 15 ? 'High (85%)' : 'Optimal (60%)'}</strong>
                  </div>
                </div>
              `;
                })
                .join('')}
            </div>

            <!-- Allocation & Dispatch Management Table -->
            <div class="clay-table-wrapper">
              <div class="clay-table-header flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3>Franchise Booking Allocation & Staff Assignment Matrix</h3>
                  <span class="text-muted text-sm">Dynamic load balancing across Bangalore outlets & mobile units</span>
                </div>
                <div class="flex items-center gap-2">
                  <button class="clay-btn clay-btn-sm clay-btn-secondary" id="btn-rebalance-franchise-load">
                    ${icons.sparkle} Auto-Balance Outlets
                  </button>
                  <button class="clay-btn clay-btn-sm clay-btn-primary" id="btn-sync-hub-dispatch">
                    ${icons.send} Sync Fleet Schedules
                  </button>
                </div>
              </div>

              <div class="table-scroll">
                <table class="clay-table">
                  <thead>
                    <tr>
                      <th>Franchise Outlet</th>
                      <th>Location / Geofence</th>
                      <th>Operating Bays</th>
                      <th>Active Staff Team</th>
                      <th>Today's Scheduled Bookings</th>
                      <th>Mobile Vans Assigned</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${franchises
                      .map((f, idx) => {
                        const queueCounts = [14, 18, 12, 9, 11];
                        const qCount = queueCounts[idx % queueCounts.length];
                        const staffAssigned = [
                          'Ravi S., Suresh B., Santosh Y.',
                          'Mohammed I., Arun P., Rahul M.',
                          'Suresh B., Vikram K.',
                          'Arun P., Santosh Y.',
                          'Mohammed I., Ravi S.',
                        ][idx % 5];
                        return `
                      <tr data-hub-id="${f.id}">
                        <td>
                          <div class="customer-cell">
                            <strong class="customer-name">${f.name}</strong>
                            <span class="customer-sub font-mono">Hub ID: #0${f.id} &bull; ${f.owner_name}</span>
                          </div>
                        </td>
                        <td>
                          <span class="franchise-cell">${icons.mapPin} ${f.city || 'Bangalore'} (10 km radius)</span>
                        </td>
                        <td>
                          <strong class="text-violet">4 High-Pressure Bays</strong>
                          <span class="text-xs text-green block">&#10003; 1080p CCTV Live</span>
                        </td>
                        <td>
                          <div class="text-sm font-medium">
                            ${staffAssigned}
                          </div>
                          <span class="text-xs text-muted">Field detailers on duty</span>
                        </td>
                        <td>
                          <span class="badge ${qCount > 15 ? 'badge-pending' : 'badge-completed'} font-bold">
                            ${qCount} Bookings Active
                          </span>
                        </td>
                        <td>
                          <span class="badge badge-outline">
                            ${icons.car} Van 0${(idx % 3) + 1}
                          </span>
                        </td>
                        <td>
                          <div class="table-actions">
                            <button class="clay-btn clay-btn-sm clay-btn-ghost text-violet btn-reallocate-hub" data-id="${f.id}">
                              ${icons.shuffle} Rebalance
                            </button>
                          </div>
                        </td>
                      </tr>
                    `;
                      })
                      .join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        `
            : ''
        }

        ${
          currentTab === 'customers_db'
            ? `
          <!-- Franchise-wise Customer Database (Module 2 item 8) -->
          <div class="franchise-customers-container mt-4 animate-fade-in">
            <div class="clay-table-wrapper">
              <div class="clay-table-header flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3>Franchise-wise Customer Registry</h3>
                  <span class="text-muted text-sm">Customer directory categorized by primary booking outlet</span>
                </div>
                <div class="flex items-center gap-3">
                  <select id="hub-customer-db-filter" class="clay-select clay-select-sm">
                    <option value="all">All Outlets (1,248 Customers)</option>
                    ${franchises.map((f) => `<option value="${f.id}">${f.name}</option>`).join('')}
                  </select>
                </div>
              </div>

              <div class="table-scroll">
                <table class="clay-table">
                  <thead>
                    <tr>
                      <th>Customer Profile</th>
                      <th>Primary Vehicle</th>
                      <th>Franchise Outlet</th>
                      <th>Loyalty Tier</th>
                      <th>Total Outlet Spend</th>
                      <th>Visits</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${(
                      state.customers || [
                        {
                          id: 1,
                          full_name: 'Rahul Sharma',
                          phone: '+91 98765 12345',
                          email: 'rahul.s@gmail.com',
                          vehicle_number: 'KA-01-AB-1234',
                          vehicle_model: 'Hyundai Creta (Polar White)',
                          franchise_id: 1,
                          loyalty_tier: 'Diamond VIP',
                          total_spent: 18450,
                          total_bookings: 14,
                        },
                        {
                          id: 2,
                          full_name: 'Priya Patel',
                          phone: '+91 98765 23456',
                          email: 'priya.p@techcorp.in',
                          vehicle_number: 'KA-05-CD-5678',
                          vehicle_model: 'BMW 320Ld (Mineral Grey)',
                          franchise_id: 2,
                          loyalty_tier: 'Diamond VIP',
                          total_spent: 34999,
                          total_bookings: 8,
                        },
                        {
                          id: 3,
                          full_name: 'Amit Kumar',
                          phone: '+91 98765 34567',
                          email: 'amit.k@startup.io',
                          vehicle_number: 'KA-03-EF-9012',
                          vehicle_model: 'Volkswagen Polo GT (Flash Red)',
                          franchise_id: 3,
                          loyalty_tier: 'Platinum',
                          total_spent: 9800,
                          total_bookings: 11,
                        },
                        {
                          id: 4,
                          full_name: 'Sneha Reddy',
                          phone: '+91 98765 45678',
                          email: 'sneha.r@gmail.com',
                          vehicle_number: 'KA-01-GH-3456',
                          vehicle_model: 'Kia Seltos GTX (Gravity Grey)',
                          franchise_id: 3,
                          loyalty_tier: 'Gold',
                          total_spent: 7200,
                          total_bookings: 6,
                        },
                        {
                          id: 5,
                          full_name: 'Vikram Singh',
                          phone: '+91 98765 56789',
                          email: 'vikram.s@deloitte.com',
                          vehicle_number: 'KA-02-IJ-7890',
                          vehicle_model: 'Skoda Octavia vRS (Race Blue)',
                          franchise_id: 4,
                          loyalty_tier: 'Diamond VIP',
                          total_spent: 42500,
                          total_bookings: 19,
                        },
                      ]
                    )
                      .map((c) => {
                        const franch = franchises.find((f) => f.id === c.franchise_id);
                        return `
                      <tr data-cust-hub="${c.franchise_id}">
                        <td>
                          <div class="customer-cell">
                            <strong class="customer-name">${c.full_name}</strong>
                            <span class="customer-sub font-mono">${c.phone}</span>
                            <span class="customer-sub">${c.email}</span>
                          </div>
                        </td>
                        <td>
                          <div class="vehicle-cell">
                            <strong class="vehicle-number">${c.vehicle_number}</strong>
                            <span class="vehicle-info">${c.vehicle_model}</span>
                          </div>
                        </td>
                        <td>
                          <span class="franchise-cell font-bold text-violet">${franch ? franch.name : 'Central Hub'}</span>
                        </td>
                        <td>
                          <span class="badge ${c.loyalty_tier.includes('VIP') ? 'badge-vip' : 'badge-completed'}">${c.loyalty_tier}</span>
                        </td>
                        <td class="amount-cell">
                          <strong>₹${c.total_spent.toLocaleString('en-IN')}</strong>
                        </td>
                        <td>
                          <strong class="text-violet">${c.total_bookings}</strong> washes
                        </td>
                        <td>
                          <button class="clay-btn clay-btn-sm clay-btn-primary btn-book-hub-customer" data-name="${c.full_name}" data-phone="${c.phone}" data-plate="${c.vehicle_number}">
                            ${icons.plus} New Booking
                          </button>
                        </td>
                      </tr>
                    `;
                      })
                      .join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        `
            : ''
        }
      </div>

      <!-- Modal: Onboard Franchise -->
      ${
        state.isCreateModalOpen
          ? `
        <div class="clay-modal-overlay" id="create-franchise-modal">
          <div class="clay-modal-card animate-slide-up">
            <div class="modal-header">
              <div class="modal-title-wrap">
                <div class="modal-icon pink">${icons.store}</div>
                <div>
                  <h3>Register New Franchise Outlet</h3>
                  <p class="modal-subtitle">Set up partner credentials, geofence, and royalty terms</p>
                </div>
              </div>
              <button class="modal-close" id="btn-close-franchise-modal">&times;</button>
            </div>

            <form id="create-franchise-form" class="modal-form">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Franchise Outlet Name *</label>
                  <input type="text" name="name" class="clay-input" required placeholder="e.g. SpeedoShine Malleshwaram" />
                </div>
                <div class="form-group">
                  <label class="form-label">Owner / Partner Name *</label>
                  <input type="text" name="owner_name" class="clay-input" required placeholder="e.g. Rohan Gupta" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Business Email *</label>
                  <input type="email" name="email" class="clay-input" required placeholder="malleshwaram@speedoshine.com" />
                </div>
                <div class="form-group">
                  <label class="form-label">Contact Phone</label>
                  <input type="text" name="phone" class="clay-input" placeholder="+91 98765 11009" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">City *</label>
                  <input type="text" name="city" class="clay-input" required value="Bangalore" />
                </div>
                <div class="form-group">
                  <label class="form-label">State *</label>
                  <input type="text" name="state" class="clay-input" required value="Karnataka" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Street Address</label>
                  <input type="text" name="address" class="clay-input" placeholder="e.g. 15th Cross, Margosa Road" />
                </div>
                <div class="form-group">
                  <label class="form-label">Commission / Royalty Rate (%) *</label>
                  <input type="number" name="commission_rate" class="clay-input" required value="15" min="1" max="50" step="0.5" />
                </div>
              </div>

              <div class="modal-actions mt-4">
                <button type="button" class="clay-btn clay-btn-secondary" id="btn-cancel-franchise">
                  Cancel
                </button>
                <button type="submit" class="clay-btn clay-btn-primary">
                  Register Outlet
                </button>
              </div>
            </form>
          </div>
        </div>
      `
          : ''
      }
    </div>
  `;
}
