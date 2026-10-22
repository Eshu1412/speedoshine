import { icons } from '../components/icons.ts';
import type { Customer, Franchise } from '../api.ts';

export interface CustomersPageState {
  customers: Customer[];
  franchises: Franchise[];
  searchQuery: string;
  selectedTier: string;
  selectedFranchise: string;
  isCreateModalOpen: boolean;
  viewingCustomer: Customer | null;
}

export function getDemoCustomers(): Customer[] {
  return [
    {
      id: 1,
      full_name: 'Rahul Sharma',
      phone: '+91 98765 12345',
      email: 'rahul.sharma@gmail.com',
      vehicle_type: 'sedan',
      vehicle_number: 'KA-01-AB-1234',
      vehicle_model: 'Honda City ZX (White)',
      franchise_id: 1,
      total_bookings: 14,
      total_spent: 18450,
      loyalty_tier: 'Diamond VIP',
      loyalty_points: 1840,
      last_visit: '2026-10-18T10:30:00Z',
      notes: 'Prefers unscented interior conditioner. Very punctual.',
    },
    {
      id: 2,
      full_name: 'Priya Patel',
      phone: '+91 98765 23456',
      email: 'priya.patel@techcorp.in',
      vehicle_type: 'suv',
      vehicle_number: 'KA-05-CD-5678',
      vehicle_model: 'BMW X3 xDrive (Phytonic Blue)',
      franchise_id: 2,
      total_bookings: 8,
      total_spent: 34999,
      loyalty_tier: 'Diamond VIP',
      loyalty_points: 3490,
      last_visit: '2026-10-14T11:00:00Z',
      notes: 'Opted for 9H Ceramic Coating. 6-month checkup due soon.',
    },
    {
      id: 3,
      full_name: 'Amit Kumar',
      phone: '+91 98765 34567',
      email: 'amit.k@startup.io',
      vehicle_type: 'hatchback',
      vehicle_number: 'KA-03-EF-9012',
      vehicle_model: 'Volkswagen Polo GT (Flash Red)',
      franchise_id: 3,
      total_bookings: 11,
      total_spent: 9800,
      loyalty_tier: 'Platinum',
      loyalty_points: 980,
      last_visit: '2026-10-16T14:15:00Z',
      notes: 'Loves foam wash with alloy wheel degreasing.',
    },
    {
      id: 4,
      full_name: 'Sneha Reddy',
      phone: '+91 98765 45678',
      email: 'sneha.reddy@gmail.com',
      vehicle_type: 'suv',
      vehicle_number: 'KA-01-GH-3456',
      vehicle_model: 'Kia Seltos GTX (Gravity Grey)',
      franchise_id: 3,
      total_bookings: 6,
      total_spent: 7200,
      loyalty_tier: 'Gold',
      loyalty_points: 720,
      last_visit: '2026-10-09T09:45:00Z',
      notes: 'Usually books Saturday morning slots.',
    },
    {
      id: 5,
      full_name: 'Vikram Singh',
      phone: '+91 98765 56789',
      email: 'vikram.singh@deloitte.com',
      vehicle_type: 'sedan',
      vehicle_number: 'KA-02-IJ-7890',
      vehicle_model: 'Skoda Octavia vRS (Race Blue)',
      franchise_id: 4,
      total_bookings: 19,
      total_spent: 42500,
      loyalty_tier: 'Diamond VIP',
      loyalty_points: 4250,
      last_visit: '2026-10-20T16:00:00Z',
      notes: 'Car enthusiast. Requests dual-bucket hand wash only.',
    },
    {
      id: 6,
      full_name: 'Deepa Nair',
      phone: '+91 98765 67890',
      email: 'deepa.nair@wipro.com',
      vehicle_type: 'hatchback',
      vehicle_number: 'KA-04-KL-2345',
      vehicle_model: 'Tata Tiago EV (Teal Blue)',
      franchise_id: 5,
      total_bookings: 5,
      total_spent: 3100,
      loyalty_tier: 'Silver',
      loyalty_points: 310,
      last_visit: '2026-10-12T15:30:00Z',
    },
    {
      id: 7,
      full_name: 'Manish Gupta',
      phone: '+91 98765 78901',
      email: 'manish.g@gmail.com',
      vehicle_type: 'sedan',
      vehicle_number: 'KA-05-MN-6789',
      vehicle_model: 'Hyundai Verna Turbo (Abyss Black)',
      franchise_id: 2,
      total_bookings: 7,
      total_spent: 8900,
      loyalty_tier: 'Gold',
      loyalty_points: 890,
      last_visit: '2026-10-17T12:00:00Z',
    },
    {
      id: 8,
      full_name: 'Ananya Roy',
      phone: '+91 98765 89012',
      email: 'ananya.roy@amazon.com',
      vehicle_type: 'bike',
      vehicle_number: 'KA-01-PQ-9012',
      vehicle_model: 'Royal Enfield Hunter 350 (Dapper Ash)',
      franchise_id: 1,
      total_bookings: 9,
      total_spent: 3200,
      loyalty_tier: 'Silver',
      loyalty_points: 320,
      last_visit: '2026-10-19T17:15:00Z',
    },
  ];
}

export function renderCustomersPage(state: CustomersPageState): string {
  const { customers, franchises, searchQuery, selectedTier, selectedFranchise } = state;

  const filtered = customers.filter((c) => {
    const matchesSearch =
      !searchQuery ||
      c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.vehicle_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.vehicle_model.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTier = !selectedTier || selectedTier === 'all' || c.loyalty_tier === selectedTier;
    const matchesFranchise =
      !selectedFranchise ||
      selectedFranchise === 'all' ||
      c.franchise_id.toString() === selectedFranchise;

    return matchesSearch && matchesTier && matchesFranchise;
  });

  const totalSpentAll = customers.reduce((sum, c) => sum + c.total_spent, 0);
  const avgCLV = Math.round(totalSpentAll / (customers.length || 1));
  const diamondCount = customers.filter((c) => c.loyalty_tier === 'Diamond VIP').length;

  const tierBadge = (tier: string) => {
    let cls = 'badge-pending';
    if (tier === 'Diamond VIP') cls = 'badge-vip';
    else if (tier === 'Platinum') cls = 'badge-platinum';
    else if (tier === 'Gold') cls = 'badge-gold';
    else cls = 'badge-silver';
    return `<span class="badge ${cls}">${tier}</span>`;
  };

  const getFranchiseName = (id: number) => {
    const f = franchises.find((item) => item.id === id);
    return f ? f.name : `Hub #${id}`;
  };

  return `
    <div class="customers-page animate-fade-in">
      <!-- KPI Cards -->
      <div class="stats-grid mb-6">
        <div class="stat-card">
          <div class="stat-card-icon violet">${icons.users}</div>
          <div class="stat-card-value">${customers.length}</div>
          <div class="stat-card-label">Registered Customers</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon amber">${icons.award}</div>
          <div class="stat-card-value">${diamondCount} VIPs</div>
          <div class="stat-card-label">Diamond VIP Tier</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon green">${icons.revenue}</div>
          <div class="stat-card-value">₹${totalSpentAll.toLocaleString('en-IN')}</div>
          <div class="stat-card-label">Total Spend Revenue</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon blue">${icons.sparkle}</div>
          <div class="stat-card-value">₹${avgCLV.toLocaleString('en-IN')}</div>
          <div class="stat-card-label">Average Customer LTV</div>
        </div>
      </div>

      <!-- Filter & Search Bar -->
      <div class="clay-card mb-6">
        <div class="bookings-toolbar">
          <div class="search-box">
            <span class="search-icon">${icons.search}</span>
            <input
              type="text"
              id="customer-search-input"
              class="clay-input"
              placeholder="Search by customer name, phone, plate number, vehicle model..."
              value="${searchQuery}"
            />
          </div>

          <div class="filter-controls">
            <select id="customer-tier-filter" class="clay-select">
              <option value="all">All Loyalty Tiers</option>
              <option value="Diamond VIP" ${selectedTier === 'Diamond VIP' ? 'selected' : ''}>Diamond VIP</option>
              <option value="Platinum" ${selectedTier === 'Platinum' ? 'selected' : ''}>Platinum</option>
              <option value="Gold" ${selectedTier === 'Gold' ? 'selected' : ''}>Gold</option>
              <option value="Silver" ${selectedTier === 'Silver' ? 'selected' : ''}>Silver</option>
            </select>

            <select id="customer-franchise-filter" class="clay-select">
              <option value="all">All Franchise Hubs</option>
              ${franchises
                .map(
                  (f) => `
                <option value="${f.id}" ${selectedFranchise === f.id.toString() ? 'selected' : ''}>${f.name}</option>
              `
                )
                .join('')}
            </select>

            <button class="clay-btn clay-btn-primary" id="btn-open-create-customer">
              ${icons.plus} Register Customer
            </button>
          </div>
        </div>
      </div>

      <!-- Customers Table -->
      <div class="clay-table-wrapper">
        <div class="clay-table-header">
          <h3>Customer Directory (${filtered.length})</h3>
          <span class="text-muted text-sm">Franchise-wise Vehicle & Service Registry</span>
        </div>
        <div class="table-scroll">
          <table class="clay-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Primary Vehicle</th>
                <th>Preferred Hub</th>
                <th>Washes</th>
                <th>Lifetime Spend</th>
                <th>Tier & Points</th>
                <th>Last Visit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${
                filtered.length > 0
                  ? filtered
                      .map(
                        (c) => `
                <tr data-customer-id="${c.id}">
                  <td>
                    <div class="customer-cell">
                      <strong class="customer-name">${c.full_name}</strong>
                      <span class="customer-sub">${icons.phone} ${c.phone}</span>
                      <span class="customer-sub">${icons.mail} ${c.email}</span>
                    </div>
                  </td>
                  <td>
                    <div class="vehicle-cell">
                      <strong class="vehicle-number">${c.vehicle_number}</strong>
                      <span class="vehicle-info">${c.vehicle_model}</span>
                    </div>
                  </td>
                  <td>
                    <span class="franchise-cell">${icons.mapPin} ${getFranchiseName(c.franchise_id)}</span>
                  </td>
                  <td>
                    <strong class="text-violet">${c.total_bookings}</strong> washes
                  </td>
                  <td class="amount-cell">
                    ₹${c.total_spent.toLocaleString('en-IN')}
                  </td>
                  <td>
                    <div class="tier-cell">
                      ${tierBadge(c.loyalty_tier)}
                      <small class="text-muted">${c.loyalty_points} Pts</small>
                    </div>
                  </td>
                  <td>
                    <span class="date-time-cell">
                      ${new Date(c.last_visit).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>
                  <td>
                    <div class="table-actions">
                      <button class="clay-btn clay-btn-sm clay-btn-primary btn-book-for-customer" data-id="${c.id}" title="Book New Wash">
                        ${icons.plus} Book
                      </button>
                      <button class="clay-btn clay-btn-sm clay-btn-secondary btn-view-customer-profile" data-id="${c.id}" title="View History & Notes">
                        ${icons.fileText} History
                      </button>
                    </div>
                  </td>
                </tr>
              `
                      )
                      .join('')
                  : `
                <tr>
                  <td colspan="8" class="text-center py-8 text-muted">
                    <div class="empty-state">
                      ${icons.users}
                      <h3>No customers matched your search</h3>
                      <p>Try searching with another name or phone number.</p>
                    </div>
                  </td>
                </tr>
              `
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal: Customer Profile / History -->
      ${
        state.viewingCustomer
          ? `
        <div class="clay-modal-overlay" id="customer-profile-modal">
          <div class="clay-modal-card animate-slide-up" style="max-width: 650px;">
            <div class="modal-header">
              <div class="modal-title-wrap">
                <div class="modal-icon violet">${icons.users}</div>
                <div>
                  <h3>${state.viewingCustomer.full_name}</h3>
                  <p class="modal-subtitle">${state.viewingCustomer.phone} &bull; ${state.viewingCustomer.email}</p>
                </div>
              </div>
              <button class="modal-close" id="btn-close-customer-modal">&times;</button>
            </div>

            <div class="customer-modal-body">
              <div class="customer-stat-pills">
                <div class="c-pill">
                  <span class="label">Tier</span>
                  <strong>${state.viewingCustomer.loyalty_tier}</strong>
                </div>
                <div class="c-pill">
                  <span class="label">Loyalty Balance</span>
                  <strong>${state.viewingCustomer.loyalty_points} Points</strong>
                </div>
                <div class="c-pill">
                  <span class="label">Total Washes</span>
                  <strong>${state.viewingCustomer.total_bookings}</strong>
                </div>
                <div class="c-pill">
                  <span class="label">Lifetime Spent</span>
                  <strong>₹${state.viewingCustomer.total_spent.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              <div class="modal-section-title mt-4">Registered Vehicle</div>
              <div class="registered-vehicle-card clay-card">
                <div class="vehicle-icon-wrap">${icons.car}</div>
                <div>
                  <h4 class="text-lg">${state.viewingCustomer.vehicle_model}</h4>
                  <p class="text-muted font-bold">${state.viewingCustomer.vehicle_number} &bull; ${(state.viewingCustomer.vehicle_type).toUpperCase()}</p>
                </div>
              </div>

              ${
                state.viewingCustomer.notes
                  ? `
                <div class="modal-section-title mt-4">Special Customer Preferences</div>
                <div class="customer-notes-box clay-card">
                  ${state.viewingCustomer.notes}
                </div>
              `
                  : ''
              }

              <div class="modal-section-title mt-4">Past Service Timeline</div>
              <div class="service-timeline">
                <div class="timeline-item">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <div class="timeline-header">
                      <strong>Full Body Foam Wash + Rain Shield</strong>
                      <span class="amount">₹899 &bull; Paid</span>
                    </div>
                    <p class="text-sm text-muted">Completed at ${getFranchiseName(state.viewingCustomer.franchise_id)} &bull; Rated 5.0 &#9733;</p>
                  </div>
                </div>
                <div class="timeline-item">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <div class="timeline-header">
                      <strong>Interior Deep Clean & AC Steam Sanitization</strong>
                      <span class="amount">₹1,899 &bull; Paid</span>
                    </div>
                    <p class="text-sm text-muted">Completed with zero odor check pass.</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-actions mt-6">
              <button class="clay-btn clay-btn-secondary" id="btn-close-customer-modal-bottom">Close</button>
              <button class="clay-btn clay-btn-primary" id="btn-quick-book-customer" data-id="${state.viewingCustomer.id}">
                ${icons.plus} Create Wash Booking
              </button>
            </div>
          </div>
        </div>
      `
          : ''
      }

      <!-- Modal: Register New Customer -->
      ${
        state.isCreateModalOpen
          ? `
        <div class="clay-modal-overlay" id="create-customer-modal">
          <div class="clay-modal-card animate-slide-up">
            <div class="modal-header">
              <div class="modal-title-wrap">
                <div class="modal-icon violet">${icons.users}</div>
                <div>
                  <h3>Register Customer</h3>
                  <p class="modal-subtitle">Add a new customer profile and vehicle to the CRM</p>
                </div>
              </div>
              <button class="modal-close" id="btn-close-create-customer">&times;</button>
            </div>

            <form id="create-customer-form" class="modal-form">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Full Name *</label>
                  <input type="text" name="full_name" class="clay-input" required placeholder="e.g. Ramesh Patel" />
                </div>
                <div class="form-group">
                  <label class="form-label">Phone Number *</label>
                  <input type="tel" name="phone" class="clay-input" required placeholder="+91 98765 00000" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Email Address</label>
                  <input type="email" name="email" class="clay-input" placeholder="customer@example.com" />
                </div>
                <div class="form-group">
                  <label class="form-label">Home Franchise Hub *</label>
                  <select name="franchise_id" class="clay-select" required>
                    ${franchises.map((f) => `<option value="${f.id}">${f.name}</option>`).join('')}
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Vehicle Plate Number *</label>
                  <input type="text" name="vehicle_number" class="clay-input uppercase" required placeholder="KA-01-XX-0000" />
                </div>
                <div class="form-group">
                  <label class="form-label">Vehicle Make & Model *</label>
                  <input type="text" name="vehicle_model" class="clay-input" required placeholder="e.g. Honda City (White)" />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Vehicle Category</label>
                <div class="vehicle-picker-grid">
                  <label class="vehicle-radio">
                    <input type="radio" name="vehicle_type" value="sedan" checked />
                    <span class="vehicle-chip">Sedan</span>
                  </label>
                  <label class="vehicle-radio">
                    <input type="radio" name="vehicle_type" value="suv" />
                    <span class="vehicle-chip">SUV</span>
                  </label>
                  <label class="vehicle-radio">
                    <input type="radio" name="vehicle_type" value="hatchback" />
                    <span class="vehicle-chip">Hatchback</span>
                  </label>
                  <label class="vehicle-radio">
                    <input type="radio" name="vehicle_type" value="bike" />
                    <span class="vehicle-chip">Motorbike</span>
                  </label>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Special Notes / Preferences</label>
                <textarea name="notes" class="clay-textarea" rows="2" placeholder="e.g. Requests leather seat wax only, sensitive tint..."></textarea>
              </div>

              <div class="modal-actions">
                <button type="button" class="clay-btn clay-btn-secondary" id="btn-cancel-create-customer">Cancel</button>
                <button type="submit" class="clay-btn clay-btn-primary">Register Customer</button>
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
