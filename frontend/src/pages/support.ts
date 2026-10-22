import { icons } from '../components/icons.ts';
import type { SupportTicket, Franchise } from '../api.ts';

export interface SupportPageState {
  tickets: SupportTicket[];
  franchises: Franchise[];
  searchQuery: string;
  selectedPriority: string;
  selectedStatus: string;
  selectedFranchise: string;
  isCreateModalOpen: boolean;
  resolvingTicket: SupportTicket | null;
}

export function getDemoTickets(): SupportTicket[] {
  return [
    {
      id: 1,
      ticket_number: 'TKT-1042',
      customer_name: 'Priya Patel',
      customer_phone: '+91 98765 23456',
      issue_type: 'Quality',
      priority: 'High',
      status: 'Open',
      franchise_id: 2,
      assigned_to: 'Arun Prasad (Supervisor)',
      description: 'Minor water mark residue on rear passenger glass after ceramic curing.',
      rating_ref: 3,
      created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
    {
      id: 2,
      ticket_number: 'TKT-1041',
      customer_name: 'Deepa Nair',
      customer_phone: '+91 98765 67890',
      issue_type: 'Delay',
      priority: 'Medium',
      status: 'In Progress',
      franchise_id: 5,
      assigned_to: 'Suresh Babu (Supervisor)',
      description: 'Bay 2 steam machine had power trip, slot delayed by 30 mins.',
      rating_ref: 2,
      created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    },
    {
      id: 3,
      ticket_number: 'TKT-1040',
      customer_name: 'Vikram Singh',
      customer_phone: '+91 98765 56789',
      issue_type: 'Vehicle Inspection',
      priority: 'Urgent',
      status: 'Open',
      franchise_id: 4,
      assigned_to: 'Santosh Yadav',
      description: 'Customer requested inspection photo proof confirmation for existing curb scratch before wash.',
      rating_ref: 4,
      created_at: new Date(Date.now() - 3600000 * 14).toISOString(),
    },
    {
      id: 4,
      ticket_number: 'TKT-1039',
      customer_name: 'Amit Kumar',
      customer_phone: '+91 98765 34567',
      issue_type: 'Billing',
      priority: 'Low',
      status: 'Resolved',
      franchise_id: 3,
      assigned_to: 'Ravi Shankar',
      description: 'Requested duplicate GST invoice with company trade name for tax write-off.',
      resolution: 'Updated billing details and resent official GST invoice PDF via email.',
      created_at: new Date(Date.now() - 3600000 * 28).toISOString(),
    },
    {
      id: 5,
      ticket_number: 'TKT-1038',
      customer_name: 'Manish Gupta',
      customer_phone: '+91 98765 78901',
      issue_type: 'Staff Behavior',
      priority: 'Medium',
      status: 'Resolved',
      franchise_id: 2,
      assigned_to: 'Arun Prasad',
      description: 'Wanted quick feedback on why air pressure gauge was not calibrated.',
      resolution: 'Re-calibrated bay air compressor nozzle and credited ₹200 wallet loyalty bonus.',
      created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    },
  ];
}

export function renderSupportPage(state: SupportPageState): string {
  const { tickets, franchises, searchQuery, selectedPriority, selectedStatus, selectedFranchise } = state;

  const filtered = tickets.filter((t) => {
    const matchesSearch =
      !searchQuery ||
      t.ticket_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customer_phone.includes(searchQuery) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority =
      !selectedPriority || selectedPriority === 'all' || t.priority === selectedPriority;
    const matchesStatus = !selectedStatus || selectedStatus === 'all' || t.status === selectedStatus;
    const matchesFranchise =
      !selectedFranchise ||
      selectedFranchise === 'all' ||
      t.franchise_id.toString() === selectedFranchise;

    return matchesSearch && matchesPriority && matchesStatus && matchesFranchise;
  });

  const openCount = tickets.filter((t) => t.status === 'Open').length;
  const inProgressCount = tickets.filter((t) => t.status === 'In Progress').length;
  const resolvedCount = tickets.filter((t) => t.status === 'Resolved').length;

  const getFranchiseName = (id: number) => {
    const f = franchises.find((item) => item.id === id);
    return f ? f.name : `Hub #${id}`;
  };

  const priorityBadge = (p: string) => {
    if (p === 'Urgent') return `<span class="badge badge-cancelled">Urgent</span>`;
    if (p === 'High') return `<span class="badge badge-pending">High</span>`;
    if (p === 'Medium') return `<span class="badge badge-in-progress">Medium</span>`;
    return `<span class="badge badge-confirmed">Low</span>`;
  };

  const statusBadge = (s: string) => {
    if (s === 'Open') return `<span class="badge badge-cancelled">Open</span>`;
    if (s === 'In Progress') return `<span class="badge badge-pending">In Progress</span>`;
    return `<span class="badge badge-completed">Resolved</span>`;
  };

  return `
    <div class="support-page animate-fade-in">
      <!-- Top Metrics Strip -->
      <div class="stats-grid mb-6">
        <div class="stat-card">
          <div class="stat-card-icon violet">${icons.lifeBuoy}</div>
          <div class="stat-card-value">${tickets.length}</div>
          <div class="stat-card-label">Total Support Tickets</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon amber">${icons.clock}</div>
          <div class="stat-card-value">${openCount} Open</div>
          <div class="stat-card-label">Immediate Attention Required</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon blue">${icons.refresh}</div>
          <div class="stat-card-value">${inProgressCount} Active</div>
          <div class="stat-card-label">Being Handled by Supervisors</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon green">${icons.checkCircle}</div>
          <div class="stat-card-value">${resolvedCount} Resolved</div>
          <div class="stat-card-label">Customer Satisfaction 96%</div>
        </div>
      </div>

      <!-- Funnel Banner (Module 9 Integration) -->
      <div class="clay-card mb-6" style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(124, 58, 237, 0.08)); border: 1.5px solid rgba(239, 68, 68, 0.2);">
        <div class="flex items-center justify-between p-2 flex-wrap gap-4">
          <div class="flex items-center gap-4">
            <div class="stat-card-icon amber">${icons.shield}</div>
            <div>
              <h4 class="text-lg font-bold">Negative Review Interception & Auto-Escalation</h4>
              <p class="text-sm text-muted">When a customer rates 1-3 stars, our system intercepts it before Google Maps and auto-creates a Priority Support Ticket for immediate resolution.</p>
            </div>
          </div>
          <button class="clay-btn clay-btn-sm clay-btn-primary" id="btn-open-create-ticket">
            ${icons.plus} Log Customer Complaint
          </button>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="clay-card mb-6">
        <div class="bookings-toolbar">
          <div class="search-box">
            <span class="search-icon">${icons.search}</span>
            <input
              type="text"
              id="ticket-search-input"
              class="clay-input"
              placeholder="Search by Ticket #, customer, description, phone..."
              value="${searchQuery}"
            />
          </div>

          <div class="filter-controls">
            <select id="ticket-priority-filter" class="clay-select">
              <option value="all">All Priorities</option>
              <option value="Urgent" ${selectedPriority === 'Urgent' ? 'selected' : ''}>Urgent</option>
              <option value="High" ${selectedPriority === 'High' ? 'selected' : ''}>High</option>
              <option value="Medium" ${selectedPriority === 'Medium' ? 'selected' : ''}>Medium</option>
              <option value="Low" ${selectedPriority === 'Low' ? 'selected' : ''}>Low</option>
            </select>

            <select id="ticket-status-filter" class="clay-select">
              <option value="all">All Statuses</option>
              <option value="Open" ${selectedStatus === 'Open' ? 'selected' : ''}>Open</option>
              <option value="In Progress" ${selectedStatus === 'In Progress' ? 'selected' : ''}>In Progress</option>
              <option value="Resolved" ${selectedStatus === 'Resolved' ? 'selected' : ''}>Resolved</option>
            </select>

            <select id="ticket-franchise-filter" class="clay-select">
              <option value="all">All Franchise Hubs</option>
              ${franchises
                .map(
                  (f) => `
                <option value="${f.id}" ${selectedFranchise === f.id.toString() ? 'selected' : ''}>${f.name}</option>
              `
                )
                .join('')}
            </select>
          </div>
        </div>
      </div>

      <!-- Tickets Table -->
      <div class="clay-table-wrapper">
        <div class="clay-table-header">
          <h3>Support & Grievance Tickets (${filtered.length})</h3>
          <span class="text-muted text-sm">2-Hour SLA Customer Recovery Guarantee</span>
        </div>
        <div class="table-scroll">
          <table class="clay-table">
            <thead>
              <tr>
                <th>Ticket #</th>
                <th>Customer</th>
                <th>Issue Category</th>
                <th>Franchise Hub</th>
                <th>Assigned Supervisor</th>
                <th>Description</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${
                filtered.length > 0
                  ? filtered
                      .map(
                        (t) => `
                <tr data-ticket-id="${t.id}">
                  <td>
                    <strong class="font-mono text-violet">${t.ticket_number}</strong>
                    ${t.rating_ref ? `<div class="text-xs text-amber font-bold">${t.rating_ref} &#9733; Low Rating</div>` : ''}
                  </td>
                  <td>
                    <div class="customer-cell">
                      <strong class="customer-name">${t.customer_name}</strong>
                      <span class="customer-sub">${t.customer_phone}</span>
                    </div>
                  </td>
                  <td>
                    <span class="badge badge-outline">${t.issue_type}</span>
                  </td>
                  <td>
                    <span class="franchise-cell">${icons.mapPin} ${getFranchiseName(t.franchise_id)}</span>
                  </td>
                  <td>
                    <strong>${t.assigned_to}</strong>
                  </td>
                  <td style="max-width: 280px;">
                    <p class="text-sm truncate-2">${t.description}</p>
                    ${t.resolution ? `<small class="text-green block mt-1">&#10003; ${t.resolution}</small>` : ''}
                  </td>
                  <td>
                    ${priorityBadge(t.priority)}
                  </td>
                  <td>
                    ${statusBadge(t.status)}
                  </td>
                  <td>
                    <div class="table-actions">
                      ${
                        t.status !== 'Resolved'
                          ? `
                        <button class="clay-btn clay-btn-sm clay-btn-primary btn-open-resolve" data-id="${t.id}" title="Resolve Ticket">
                          ${icons.check} Resolve
                        </button>
                      `
                          : `
                        <span class="text-sm text-green font-bold">Closed</span>
                      `
                      }
                    </div>
                  </td>
                </tr>
              `
                      )
                      .join('')
                  : `
                <tr>
                  <td colspan="9" class="text-center py-8 text-muted">
                    <div class="empty-state">
                      ${icons.lifeBuoy}
                      <h3>No support tickets found</h3>
                      <p>All customer queries are currently resolved!</p>
                    </div>
                  </td>
                </tr>
              `
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal: Resolve Ticket -->
      ${
        state.resolvingTicket
          ? `
        <div class="clay-modal-overlay" id="resolve-ticket-modal">
          <div class="clay-modal-card animate-slide-up">
            <div class="modal-header">
              <div class="modal-title-wrap">
                <div class="modal-icon green">${icons.checkCircle}</div>
                <div>
                  <h3>Resolve Customer Complaint</h3>
                  <p class="modal-subtitle">${state.resolvingTicket.ticket_number} &bull; ${state.resolvingTicket.customer_name}</p>
                </div>
              </div>
              <button class="modal-close" id="btn-close-resolve-modal">&times;</button>
            </div>

            <form id="resolve-ticket-form" class="modal-form">
              <input type="hidden" name="ticket_id" value="${state.resolvingTicket.id}" />

              <div class="receipt-content clay-card mb-4 text-sm">
                <strong>Complaint Details:</strong>
                <p class="mt-1 text-muted">${state.resolvingTicket.description}</p>
              </div>

              <div class="form-group">
                <label class="form-label">Resolution Actions Taken *</label>
                <textarea name="resolution" class="clay-textarea" rows="3" required placeholder="e.g. Called customer, re-polished glass at door-step, issued complimentary wash coupon..."></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">Goodwill Compensation (Optional)</label>
                <select name="compensation" class="clay-select">
                  <option value="none">No Compensation Required</option>
                  <option value="coupon_300">Issue ₹300 SpeedoShine Discount Voucher</option>
                  <option value="free_foam">Issue 100% Free Foam Wash Code (SS-CARE-FREE)</option>
                  <option value="loyalty_500">Credit 500 Extra Loyalty Points</option>
                </select>
              </div>

              <div class="modal-actions">
                <button type="button" class="clay-btn clay-btn-secondary" id="btn-cancel-resolve">Cancel</button>
                <button type="submit" class="clay-btn clay-btn-primary">
                  Mark as Resolved & Notify Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      `
          : ''
      }

      <!-- Modal: Create Support Ticket -->
      ${
        state.isCreateModalOpen
          ? `
        <div class="clay-modal-overlay" id="create-ticket-modal">
          <div class="clay-modal-card animate-slide-up">
            <div class="modal-header">
              <div class="modal-title-wrap">
                <div class="modal-icon amber">${icons.lifeBuoy}</div>
                <div>
                  <h3>Log Support Complaint</h3>
                  <p class="modal-subtitle">Record a customer issue or service grievance</p>
                </div>
              </div>
              <button class="modal-close" id="btn-close-create-ticket">&times;</button>
            </div>

            <form id="create-ticket-form" class="modal-form">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Customer Name *</label>
                  <input type="text" name="customer_name" class="clay-input" required placeholder="e.g. Rahul Sharma" />
                </div>
                <div class="form-group">
                  <label class="form-label">Customer Phone *</label>
                  <input type="tel" name="customer_phone" class="clay-input" required placeholder="+91 98765 00000" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Franchise Center *</label>
                  <select name="franchise_id" class="clay-select" required>
                    ${franchises.map((f) => `<option value="${f.id}">${f.name}</option>`).join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Issue Category *</label>
                  <select name="issue_type" class="clay-select" required>
                    <option value="Quality">Wash / Detailing Quality</option>
                    <option value="Delay">Turnaround Time Delay</option>
                    <option value="Staff Behavior">Staff Behavior / Courteousness</option>
                    <option value="Vehicle Inspection">Vehicle Pre/Post Inspection</option>
                    <option value="Billing">Billing / Payment Dispute</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Priority Level *</label>
                  <select name="priority" class="clay-select" required>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Assign To Supervisor</label>
                  <input type="text" name="assigned_to" class="clay-input" value="Arun Prasad (Supervisor)" />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Description of Grievance *</label>
                <textarea name="description" class="clay-textarea" rows="3" required placeholder="Describe what the customer reported in detail..."></textarea>
              </div>

              <div class="modal-actions">
                <button type="button" class="clay-btn clay-btn-secondary" id="btn-cancel-create-ticket">Cancel</button>
                <button type="submit" class="clay-btn clay-btn-primary">Create Ticket</button>
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
