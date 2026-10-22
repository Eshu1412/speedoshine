import { icons } from '../components/icons.ts';
import type { Booking, Franchise, Service, Staff } from '../api.ts';

export interface BookingsPageState {
  bookings: Booking[];
  franchises: Franchise[];
  services: Service[];
  staff: Staff[];
  selectedStatus: string;
  searchQuery: string;
  selectedFranchise: string;
  isCreateModalOpen: boolean;
  editingBooking: Booking | null;
  viewingInvoice: Booking | null;
  viewingProof: Booking | null;
}

export function renderBookingsPage(state: BookingsPageState): string {
  const { bookings, franchises, services, selectedStatus, searchQuery, selectedFranchise } = state;

  // Filter bookings
  const filtered = bookings.filter((b) => {
    const matchesStatus =
      selectedStatus === 'all' || b.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchesFranchise =
      !selectedFranchise ||
      selectedFranchise === 'all' ||
      b.franchise_id.toString() === selectedFranchise;
    const matchesSearch =
      !searchQuery ||
      b.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.booking_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.vehicle_number && b.vehicle_number.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.customer_phone && b.customer_phone.includes(searchQuery));
    return matchesStatus && matchesFranchise && matchesSearch;
  });

  // Calculate metrics
  const totalCount = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const inProgressCount = bookings.filter((b) => b.status === 'in_progress').length;
  const completedCount = bookings.filter((b) => b.status === 'completed').length;
  const totalRevenue = bookings
    .filter((b) => b.payment_status === 'paid')
    .reduce((sum, b) => sum + (b.final_amount || 0), 0);

  const statusBadge = (status: string) => {
    const cls = status.replace('_', '-');
    const label = status.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    return `<span class="badge badge-${cls}">${label}</span>`;
  };

  const paymentBadge = (status: string) => {
    const label = status.replace(/\b\w/g, (c) => c.toUpperCase());
    return `<span class="badge badge-${status}">${label}</span>`;
  };

  const getFranchiseName = (id: number) => {
    const f = franchises.find((item) => item.id === id);
    return f ? f.name : `Franchise #${id}`;
  };

  const getServiceName = (id: number) => {
    const s = services.find((item) => item.id === id);
    return s ? s.name : `Service #${id}`;
  };

  const rows = filtered
    .map(
      (b) => `
    <tr data-booking-id="${b.id}">
      <td>
        <strong class="booking-number">${b.booking_number}</strong>
      </td>
      <td>
        <div class="customer-cell">
          <span class="customer-name">${b.customer_name}</span>
          ${b.customer_phone ? `<span class="customer-sub">${icons.phone} ${b.customer_phone}</span>` : ''}
        </div>
      </td>
      <td>
        <div class="vehicle-cell">
          <span class="vehicle-info">${(b.vehicle_type || 'car').toUpperCase()}</span>
          <span class="vehicle-number">${b.vehicle_number || '—'}</span>
        </div>
      </td>
      <td>
        <span class="service-pill">${getServiceName(b.service_id)}</span>
      </td>
      <td>
        <span class="franchise-cell">${icons.mapPin} ${getFranchiseName(b.franchise_id)}</span>
      </td>
      <td>
        <span class="date-time-cell">
          ${icons.calendar} ${b.scheduled_date ? new Date(b.scheduled_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Today'}
          <small>${b.scheduled_time || '10:00 AM'}</small>
        </span>
      </td>
      <td>${statusBadge(b.status)}</td>
      <td>${paymentBadge(b.payment_status)}</td>
      <td class="amount-cell">₹${(b.final_amount || b.amount || 0).toLocaleString('en-IN')}</td>
      <td>
        <div class="table-actions">
          <button class="clay-btn clay-btn-sm clay-btn-secondary btn-view-invoice" data-id="${b.id}" title="Generate Official Tax Invoice">
            ${icons.fileText} Invoice
          </button>
          <button class="clay-btn clay-btn-sm clay-btn-secondary btn-view-proof" data-id="${b.id}" title="View Before & After Proof Photos">
            ${icons.camera} Proof
          </button>
          ${
            b.status === 'completed'
              ? `
            <button class="clay-btn clay-btn-sm clay-btn-ghost text-violet btn-repeat-booking" data-id="${b.id}" title="Repeat this Booking">
              ${icons.repeat}
            </button>
          `
              : ''
          }
          <button class="clay-btn clay-btn-sm clay-btn-ghost btn-update-status" data-id="${b.id}" title="Update Status">
            ${icons.edit}
          </button>
          <button class="clay-btn clay-btn-sm clay-btn-ghost btn-delete-booking text-danger" data-id="${b.id}" title="Delete Booking">
            ${icons.trash}
          </button>
        </div>
      </td>
    </tr>
  `
    )
    .join('');

  const statuses = [
    { key: 'all', label: 'All Bookings', count: totalCount },
    { key: 'pending', label: 'Pending', count: pendingCount },
    { key: 'in_progress', label: 'In Progress', count: inProgressCount },
    { key: 'completed', label: 'Completed', count: completedCount },
    { key: 'cancelled', label: 'Cancelled', count: bookings.filter((b) => b.status === 'cancelled').length },
  ];

  return `
    <div class="bookings-page animate-fade-in">
      <!-- Mini stats strip -->
      <div class="stats-grid mb-6">
        <div class="stat-card">
          <div class="stat-card-icon violet">${icons.bookings}</div>
          <div class="stat-card-value">${totalCount}</div>
          <div class="stat-card-label">Total Bookings</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon amber">${icons.clock}</div>
          <div class="stat-card-value">${pendingCount}</div>
          <div class="stat-card-label">Pending Action</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon blue">${icons.droplets}</div>
          <div class="stat-card-value">${inProgressCount}</div>
          <div class="stat-card-label">Active Washes</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon green">${icons.checkCircle}</div>
          <div class="stat-card-value">${completedCount}</div>
          <div class="stat-card-label">Completed</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon violet">${icons.revenue}</div>
          <div class="stat-card-value">₹${totalRevenue.toLocaleString('en-IN')}</div>
          <div class="stat-card-label">Realized Revenue</div>
        </div>
      </div>

      <!-- Controls & Filters -->
      <div class="clay-card mb-6">
        <div class="bookings-toolbar">
          <div class="search-box">
            <span class="search-icon">${icons.search}</span>
            <input
              type="text"
              id="booking-search-input"
              class="clay-input"
              placeholder="Search by customer, booking #, vehicle plate..."
              value="${searchQuery}"
            />
          </div>

          <div class="filter-controls">
            <select id="booking-franchise-filter" class="clay-select">
              <option value="all">All Franchises</option>
              ${franchises
                .map(
                  (f) => `
                <option value="${f.id}" ${selectedFranchise === f.id.toString() ? 'selected' : ''}>${f.name}</option>
              `
                )
                .join('')}
            </select>

            <button class="clay-btn clay-btn-primary" id="btn-open-create-booking">
              ${icons.plus} New Booking
            </button>
          </div>
        </div>

        <!-- Status Filter Tabs -->
        <div class="status-tabs-container mt-4">
          ${statuses
            .map(
              (s) => `
            <button
              class="status-tab ${selectedStatus === s.key ? 'active' : ''}"
              data-status="${s.key}"
            >
              <span>${s.label}</span>
              <span class="tab-count">${s.count}</span>
            </button>
          `
            )
            .join('')}
        </div>
      </div>

      <!-- Bookings Table -->
      <div class="clay-table-wrapper">
        <div class="clay-table-header">
          <h3>Bookings List (${filtered.length})</h3>
          <span class="text-muted text-sm">Real-time status updates</span>
        </div>
        <div class="table-scroll">
          <table class="clay-table">
            <thead>
              <tr>
                <th>Booking #</th>
                <th>Customer</th>
                <th>Vehicle</th>
                <th>Service</th>
                <th>Franchise</th>
                <th>Scheduled</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${
                filtered.length > 0
                  ? rows
                  : `
                <tr>
                  <td colspan="10" class="text-center py-8 text-muted">
                    <div class="empty-state">
                      ${icons.bookings}
                      <h3>No bookings found</h3>
                      <p>Try adjusting your search or filters, or add a new booking.</p>
                    </div>
                  </td>
                </tr>
              `
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal: New Booking -->
      ${
        state.isCreateModalOpen
          ? `
        <div class="clay-modal-overlay" id="create-booking-modal">
          <div class="clay-modal-card animate-slide-up">
            <div class="modal-header">
              <div class="modal-title-wrap">
                <div class="modal-icon violet">${icons.bookings}</div>
                <div>
                  <h3>Create New Booking</h3>
                  <p class="modal-subtitle">Schedule a wash service for a customer</p>
                </div>
              </div>
              <button class="clay-btn clay-btn-sm clay-btn-ghost btn-close-modal" id="btn-close-create-modal">
                ${icons.x}
              </button>
            </div>

            <form id="create-booking-form" class="modal-form">
              <div class="form-row">
                <div class="form-group">
                  <label>Customer Name *</label>
                  <input type="text" name="customer_name" class="clay-input" required placeholder="e.g. Ramesh Patel" />
                </div>
                <div class="form-group">
                  <label>Customer Phone *</label>
                  <input type="text" name="customer_phone" class="clay-input" required placeholder="e.g. +91 98765 43210" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Vehicle Type *</label>
                  <select name="vehicle_type" class="clay-select" id="form-vehicle-type" required>
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV / MUV</option>
                    <option value="hatchback">Hatchback</option>
                    <option value="bike">Motorcycle / Bike</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Vehicle Plate Number</label>
                  <input type="text" name="vehicle_number" class="clay-input" placeholder="e.g. KA-01-AB-1234" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Select Service *</label>
                  <select name="service_id" class="clay-select" id="form-service-select" required>
                    ${services
                      .map(
                        (s) => `
                      <option value="${s.id}" data-sedan="${s.price_sedan}" data-suv="${s.price_suv}" data-hatch="${s.price_hatchback}" data-bike="${s.price_bike}">
                        ${s.name} (from ₹${s.price_sedan})
                      </option>
                    `
                      )
                      .join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label>Select Franchise *</label>
                  <select name="franchise_id" class="clay-select" required>
                    ${franchises
                      .map(
                        (f) => `
                      <option value="${f.id}">${f.name} (${f.city || 'Bangalore'})</option>
                    `
                      )
                      .join('')}
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Date *</label>
                  <input type="date" name="scheduled_date" class="clay-input" required value="${new Date().toISOString().split('T')[0]}" />
                </div>
                <div class="form-group">
                  <label>Time Slot *</label>
                  <select name="scheduled_time" class="clay-select" required>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:30 PM">03:30 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Base Price (₹) *</label>
                  <input type="number" name="amount" id="form-amount" class="clay-input" value="499" required min="0" />
                </div>
                <div class="form-group">
                  <label>Discount (₹)</label>
                  <input type="number" name="discount" id="form-discount" class="clay-input" value="0" min="0" />
                </div>
              </div>

              <div class="form-group">
                <label>Special Instructions / Address</label>
                <textarea name="notes" class="clay-input" rows="2" placeholder="e.g. Customer requests extra attention to alloy wheels."></textarea>
              </div>

              <div class="modal-actions mt-4">
                <button type="button" class="clay-btn clay-btn-ghost btn-close-modal" id="btn-cancel-create">
                  Cancel
                </button>
                <button type="submit" class="clay-btn clay-btn-primary">
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      `
          : ''
      }

      <!-- Modal: Update Status -->
      ${
        state.editingBooking
          ? `
        <div class="clay-modal-overlay" id="edit-booking-modal">
          <div class="clay-modal-card animate-slide-up">
            <div class="modal-header">
              <div class="modal-title-wrap">
                <div class="modal-icon blue">${icons.edit}</div>
                <div>
                  <h3>Update Booking Status</h3>
                  <p class="modal-subtitle">${state.editingBooking.booking_number} — ${state.editingBooking.customer_name}</p>
                </div>
              </div>
              <button class="clay-btn clay-btn-sm clay-btn-ghost btn-close-modal" id="btn-close-edit-modal">
                ${icons.x}
              </button>
            </div>

            <form id="update-booking-form" class="modal-form">
              <input type="hidden" name="booking_id" value="${state.editingBooking.id}" />

              <div class="form-group mb-4">
                <label>Booking Status *</label>
                <select name="status" class="clay-select" required>
                  <option value="pending" ${state.editingBooking.status === 'pending' ? 'selected' : ''}>Pending</option>
                  <option value="confirmed" ${state.editingBooking.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                  <option value="in_progress" ${state.editingBooking.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                  <option value="completed" ${state.editingBooking.status === 'completed' ? 'selected' : ''}>Completed</option>
                  <option value="cancelled" ${state.editingBooking.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
              </div>

              <div class="form-group mb-4">
                <label>Payment Status *</label>
                <select name="payment_status" class="clay-select" required>
                  <option value="paid" ${state.editingBooking.payment_status === 'paid' ? 'selected' : ''}>Paid</option>
                  <option value="unpaid" ${state.editingBooking.payment_status === 'unpaid' ? 'selected' : ''}>Unpaid</option>
                  <option value="refunded" ${state.editingBooking.payment_status === 'refunded' ? 'selected' : ''}>Refunded</option>
                </select>
              </div>

              <div class="form-group mb-4">
                <label>Assign Staff Member</label>
                <select name="staff_id" class="clay-select">
                  <option value="">Unassigned</option>
                  ${state.staff
                    .map(
                      (st) => `
                    <option value="${st.id}" ${state.editingBooking?.staff_id === st.id ? 'selected' : ''}>
                      ${st.full_name} (${st.role} - ${st.is_on_duty ? 'On Duty' : 'Off Duty'})
                    </option>
                  `
                    )
                    .join('')}
                </select>
              </div>

              <div class="form-row mb-4">
                <div class="form-group">
                  <label>Reschedule Date</label>
                  <input
                    type="date"
                    name="scheduled_date"
                    class="clay-input"
                    value="${state.editingBooking.scheduled_date ? new Date(state.editingBooking.scheduled_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}"
                  />
                </div>
                <div class="form-group">
                  <label>Reschedule Time Slot</label>
                  <select name="scheduled_time" class="clay-select">
                    ${['09:00 AM', '10:30 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:30 PM', '04:00 PM', '05:00 PM', '06:00 PM']
                      .map((t) => `<option value="${t}" ${state.editingBooking?.scheduled_time === t ? 'selected' : ''}>${t}</option>`)
                      .join('')}
                  </select>
                </div>
              </div>

              <div class="form-group mb-4">
                <label>Cancellation Reason (if cancelling)</label>
                <input
                  type="text"
                  name="cancel_reason"
                  class="clay-input"
                  placeholder="e.g. Customer requested rescheduling / Rain delay / Vehicle unavailable"
                />
              </div>

              <div class="form-group mb-4">
                <label>Internal Notes / Service Log</label>
                <textarea name="notes" class="clay-input" rows="2">${state.editingBooking.notes || ''}</textarea>
              </div>

              <div class="modal-actions">

                <button type="button" class="clay-btn clay-btn-ghost btn-close-modal" id="btn-cancel-edit">
                  Cancel
                </button>
                <button type="submit" class="clay-btn clay-btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      `
          : ''
      }
      <!-- Modal: Tax Invoice (Module 4) -->
      ${
        state.viewingInvoice
          ? `
        <div class="clay-modal-overlay" id="booking-invoice-modal">
          <div class="clay-modal-card animate-slide-up" style="max-width: 650px;">
            <div class="modal-header">
              <div class="modal-title-wrap">
                <div class="modal-icon violet">${icons.fileText}</div>
                <div>
                  <h3>Tax Invoice (GST)</h3>
                  <p class="modal-subtitle">Invoice Ref: INV-${state.viewingInvoice.booking_number}</p>
                </div>
              </div>
              <button class="modal-close" id="btn-close-invoice-modal">&times;</button>
            </div>

            <div class="invoice-container clay-card mt-4 p-6" id="printable-tax-invoice">
              <div class="invoice-brand-row flex justify-between items-center pb-4 border-b">
                <div>
                  <h2 class="text-2xl font-black text-violet">SpeedoShine Auto Detailing</h2>
                  <p class="text-xs text-muted">A Division of SpeedoShine Franchises India Pvt Ltd</p>
                  <p class="text-xs text-muted">GSTIN: 29AABCU9603R1ZX &bull; SAC Code: 998714</p>
                </div>
                <div class="text-right">
                  <div class="invoice-badge uppercase font-bold text-sm text-green">TAX INVOICE</div>
                  <strong class="block text-sm">#INV-${state.viewingInvoice.booking_number}</strong>
                  <span class="text-xs text-muted">Date: ${new Date().toLocaleDateString('en-IN')}</span>
                </div>
              </div>

              <div class="invoice-grid grid grid-cols-2 gap-4 py-4 border-b text-sm">
                <div>
                  <span class="text-xs uppercase text-muted font-bold block">Billed To (Customer):</span>
                  <strong class="block text-base">${state.viewingInvoice.customer_name}</strong>
                  <span class="text-muted block">${state.viewingInvoice.customer_phone || '+91 98765 00000'}</span>
                  <span class="text-muted block">Vehicle: <strong>${(state.viewingInvoice.vehicle_type || 'car').toUpperCase()} &bull; ${state.viewingInvoice.vehicle_number || 'KA-01-AB-1234'}</strong></span>
                </div>
                <div class="text-right">
                  <span class="text-xs uppercase text-muted font-bold block">Service Center:</span>
                  <strong class="block text-base">${getFranchiseName(state.viewingInvoice.franchise_id)}</strong>
                  <span class="text-muted block">Payment: <strong class="uppercase text-green">${state.viewingInvoice.payment_status} (${state.viewingInvoice.payment_method || 'UPI'})</strong></span>
                  <span class="text-muted block">Slot: ${state.viewingInvoice.scheduled_time || '10:00 AM'}</span>
                </div>
              </div>

              <div class="invoice-items-table py-4 border-b">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="text-left text-muted border-b pb-2">
                      <th class="py-2">Description</th>
                      <th class="text-center py-2">Qty</th>
                      <th class="text-right py-2">Rate (₹)</th>
                      <th class="text-right py-2">Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-b">
                      <td class="py-2">
                        <strong>${getServiceName(state.viewingInvoice.service_id)}</strong>
                        <div class="text-xs text-muted">Professional vehicle foam wash, interior vacuum, glass polish</div>
                      </td>
                      <td class="text-center py-2">1</td>
                      <td class="text-right py-2">₹${(state.viewingInvoice.amount / 1.18).toFixed(2)}</td>
                      <td class="text-right py-2">₹${(state.viewingInvoice.amount / 1.18).toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="invoice-totals py-4 text-sm">
                <div class="flex justify-between py-1">
                  <span class="text-muted">Taxable Amount:</span>
                  <span>₹${(state.viewingInvoice.amount / 1.18).toFixed(2)}</span>
                </div>
                <div class="flex justify-between py-1">
                  <span class="text-muted">Central GST (CGST 9%):</span>
                  <span>₹${((state.viewingInvoice.amount - state.viewingInvoice.amount / 1.18) / 2).toFixed(2)}</span>
                </div>
                <div class="flex justify-between py-1">
                  <span class="text-muted">State GST (SGST 9%):</span>
                  <span>₹${((state.viewingInvoice.amount - state.viewingInvoice.amount / 1.18) / 2).toFixed(2)}</span>
                </div>
                ${
                  state.viewingInvoice.discount
                    ? `
                  <div class="flex justify-between py-1 text-green font-bold">
                    <span>Loyalty / Promotional Discount:</span>
                    <span>-₹${state.viewingInvoice.discount.toFixed(2)}</span>
                  </div>
                `
                    : ''
                }
                <div class="flex justify-between py-3 border-t mt-2 text-lg font-bold">
                  <span>Grand Total (INR):</span>
                  <span class="text-violet">₹${(state.viewingInvoice.final_amount || state.viewingInvoice.amount).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div class="invoice-footer text-center pt-2 text-xs text-muted border-t">
                Thank you for choosing SpeedoShine! For support reach care@speedoshine.com &bull; Authorized Computer Signature
              </div>
            </div>

            <div class="modal-actions mt-6">
              <button class="clay-btn clay-btn-secondary" id="btn-close-invoice-bottom">Close</button>
              <button class="clay-btn clay-btn-primary" onclick="window.print()">
                ${icons.printer} Print / Save as PDF
              </button>
            </div>
          </div>
        </div>
      `
          : ''
      }

      <!-- Modal: Proof Photos & Inspection (Module 6) -->
      ${
        state.viewingProof
          ? `
        <div class="clay-modal-overlay" id="booking-proof-modal">
          <div class="clay-modal-card animate-slide-up" style="max-width: 700px;">
            <div class="modal-header">
              <div class="modal-title-wrap">
                <div class="modal-icon blue">${icons.camera}</div>
                <div>
                  <h3>Service Proof & Quality Documentation</h3>
                  <p class="modal-subtitle">${state.viewingProof.booking_number} &bull; ${state.viewingProof.customer_name} &bull; ${state.viewingProof.vehicle_number}</p>
                </div>
              </div>
              <button class="modal-close" id="btn-close-proof-modal">&times;</button>
            </div>

            <div class="proof-modal-body mt-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="proof-stage-card clay-card">
                  <span class="stage-tag">Before Service Check-in</span>
                  <img src="https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=600&q=80" alt="Before" class="rounded-xl w-full h-44 object-cover" />
                  <p class="text-xs text-muted mt-2">&#9679; Road dust & rain stains noted on bonnet</p>
                </div>
                <div class="proof-stage-card clay-card">
                  <span class="stage-tag" style="background: rgba(16, 185, 129, 0.15); color: #10B981;">After Service Mirror Finish</span>
                  <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80" alt="After" class="rounded-xl w-full h-44 object-cover" />
                  <p class="text-xs text-green mt-2">&#10003; 100% Gloss restoration & hydrophobic seal</p>
                </div>
              </div>

              <div class="inspection-summary clay-card mt-4 p-4">
                <h4 class="font-bold text-sm mb-2">Quality Inspection Checks Passed:</h4>
                <div class="grid grid-cols-2 gap-2 text-xs">
                  <div>&#10003; Alloy wheel brake dust removed</div>
                  <div>&#10003; Glass water repellency tested</div>
                  <div>&#10003; Deep interior floor vacuumed</div>
                  <div>&#10003; AC duct steam sanitized</div>
                  <div>&#10003; Tire shine silicone dressed</div>
                  <div>&#10003; Paint thickness gauge 118µm</div>
                </div>
              </div>
            </div>

            <div class="modal-actions mt-6">
              <button class="clay-btn clay-btn-secondary" id="btn-close-proof-bottom">Close</button>
              <button class="clay-btn clay-btn-primary" id="btn-share-proof-whatsapp" data-id="${state.viewingProof.id}">
                ${icons.send} Send Proof to Customer WhatsApp
              </button>
            </div>
          </div>
        </div>
      `
          : ''
      }
    </div>
  `;
}
