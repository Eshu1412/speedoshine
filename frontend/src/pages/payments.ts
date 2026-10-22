import { icons } from '../components/icons.ts';
import type { Transaction, Franchise } from '../api.ts';

export interface PaymentsPageState {
  transactions: Transaction[];
  franchises: Franchise[];
  searchQuery: string;
  selectedMethod: string;
  selectedStatus: string;
  selectedFranchise: string;
  refundingTxn: Transaction | null;
  viewingReceipt: Transaction | null;
}

export function getDemoTransactions(): Transaction[] {
  return [
    {
      id: 1,
      txn_number: 'TXN-98421',
      booking_number: 'SS-A70200',
      customer_name: 'Rahul Sharma',
      customer_phone: '+91 98765 12345',
      franchise_id: 1,
      amount: 499,
      tax: 76.12,
      discount: 0,
      commission: 74.85,
      net_amount: 348.03,
      payment_method: 'UPI',
      status: 'success',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 2,
      txn_number: 'TXN-98422',
      booking_number: 'SS-B70237',
      customer_name: 'Priya Patel',
      customer_phone: '+91 98765 23456',
      franchise_id: 2,
      amount: 8499,
      tax: 1296.45,
      discount: 500,
      commission: 1274.85,
      net_amount: 5927.70,
      payment_method: 'Card',
      status: 'success',
      created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      id: 3,
      txn_number: 'TXN-98423',
      booking_number: 'SS-C70274',
      customer_name: 'Amit Kumar',
      customer_phone: '+91 98765 34567',
      franchise_id: 3,
      amount: 1499,
      tax: 228.66,
      discount: 0,
      commission: 224.85,
      net_amount: 1045.49,
      payment_method: 'UPI',
      status: 'success',
      created_at: new Date(Date.now() - 3600000 * 7).toISOString(),
    },
    {
      id: 4,
      txn_number: 'TXN-98424',
      booking_number: 'SS-D70311',
      customer_name: 'Sneha Reddy',
      customer_phone: '+91 98765 45678',
      franchise_id: 3,
      amount: 3999,
      tax: 610.01,
      discount: 0,
      commission: 599.85,
      net_amount: 2789.14,
      payment_method: 'UPI',
      status: 'success',
      created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
    {
      id: 5,
      txn_number: 'TXN-98425',
      booking_number: 'SS-E70348',
      customer_name: 'Vikram Singh',
      customer_phone: '+91 98765 56789',
      franchise_id: 4,
      amount: 299,
      tax: 45.61,
      discount: 0,
      commission: 44.85,
      net_amount: 208.54,
      payment_method: 'Cash',
      status: 'success',
      created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    },
    {
      id: 6,
      txn_number: 'TXN-98426',
      booking_number: 'SS-F70385',
      customer_name: 'Deepa Nair',
      customer_phone: '+91 98765 67890',
      franchise_id: 5,
      amount: 1499,
      tax: 228.66,
      discount: 0,
      commission: 224.85,
      net_amount: 1045.49,
      payment_method: 'UPI',
      status: 'refunded',
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      id: 7,
      txn_number: 'TXN-98427',
      booking_number: 'SS-G70422',
      customer_name: 'Manish Gupta',
      customer_phone: '+91 98765 78901',
      franchise_id: 2,
      amount: 499,
      tax: 76.12,
      discount: 0,
      commission: 74.85,
      net_amount: 348.03,
      payment_method: 'UPI',
      status: 'success',
      created_at: new Date(Date.now() - 3600000 * 30).toISOString(),
    },
    {
      id: 8,
      txn_number: 'TXN-98428',
      booking_number: 'SS-H70459',
      customer_name: 'Ananya Roy',
      customer_phone: '+91 98765 89012',
      franchise_id: 1,
      amount: 249,
      tax: 37.98,
      discount: 0,
      commission: 37.35,
      net_amount: 173.67,
      payment_method: 'NetBanking',
      status: 'success',
      created_at: new Date(Date.now() - 3600000 * 36).toISOString(),
    },
  ];
}

export function renderPaymentsPage(state: PaymentsPageState): string {
  const { transactions, franchises, searchQuery, selectedMethod, selectedStatus, selectedFranchise } = state;

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      !searchQuery ||
      t.txn_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.booking_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customer_phone.includes(searchQuery);

    const matchesMethod = !selectedMethod || selectedMethod === 'all' || t.payment_method === selectedMethod;
    const matchesStatus = !selectedStatus || selectedStatus === 'all' || t.status === selectedStatus;
    const matchesFranchise =
      !selectedFranchise ||
      selectedFranchise === 'all' ||
      t.franchise_id.toString() === selectedFranchise;

    return matchesSearch && matchesMethod && matchesStatus && matchesFranchise;
  });

  const totalCollected = transactions
    .filter((t) => t.status === 'success')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRefunded = transactions
    .filter((t) => t.status === 'refunded')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalCommission = transactions
    .filter((t) => t.status === 'success')
    .reduce((sum, t) => sum + t.commission, 0);

  const getFranchiseName = (id: number) => {
    const f = franchises.find((item) => item.id === id);
    return f ? f.name : `Hub #${id}`;
  };

  const statusBadge = (s: string) => {
    if (s === 'success') return `<span class="badge badge-completed">Paid (Success)</span>`;
    if (s === 'refunded') return `<span class="badge badge-cancelled">Refunded</span>`;
    return `<span class="badge badge-pending">Pending</span>`;
  };

  const methodBadge = (m: string) => {
    return `<span class="badge badge-method">${m}</span>`;
  };

  return `
    <div class="payments-page animate-fade-in">
      <!-- Top Metrics Strip -->
      <div class="stats-grid mb-6">
        <div class="stat-card">
          <div class="stat-card-icon green">${icons.revenue}</div>
          <div class="stat-card-value">₹${totalCollected.toLocaleString('en-IN')}</div>
          <div class="stat-card-label">Total Realized Inflow</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon violet">${icons.creditCard}</div>
          <div class="stat-card-value">84% Digital</div>
          <div class="stat-card-label">UPI & Card Transactions</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon blue">${icons.percent}</div>
          <div class="stat-card-value">₹${Math.round(totalCommission).toLocaleString('en-IN')}</div>
          <div class="stat-card-label">HQ Platform Commission</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon amber">${icons.refresh}</div>
          <div class="stat-card-value">₹${totalRefunded.toLocaleString('en-IN')}</div>
          <div class="stat-card-label">Total Disputed / Refunded</div>
        </div>
      </div>

      <!-- Filters & Actions -->
      <div class="clay-card mb-6">
        <div class="bookings-toolbar">
          <div class="search-box">
            <span class="search-icon">${icons.search}</span>
            <input
              type="text"
              id="payment-search-input"
              class="clay-input"
              placeholder="Search by Txn ID, Booking #, Customer, Phone..."
              value="${searchQuery}"
            />
          </div>

          <div class="filter-controls">
            <select id="payment-method-filter" class="clay-select">
              <option value="all">All Methods</option>
              <option value="UPI" ${selectedMethod === 'UPI' ? 'selected' : ''}>UPI (GPay / PhonePe)</option>
              <option value="Card" ${selectedMethod === 'Card' ? 'selected' : ''}>Credit / Debit Card</option>
              <option value="Cash" ${selectedMethod === 'Cash' ? 'selected' : ''}>Cash at Counter</option>
              <option value="NetBanking" ${selectedMethod === 'NetBanking' ? 'selected' : ''}>NetBanking</option>
            </select>

            <select id="payment-status-filter" class="clay-select">
              <option value="all">All Statuses</option>
              <option value="success" ${selectedStatus === 'success' ? 'selected' : ''}>Success</option>
              <option value="refunded" ${selectedStatus === 'refunded' ? 'selected' : ''}>Refunded</option>
              <option value="pending" ${selectedStatus === 'pending' ? 'selected' : ''}>Pending</option>
            </select>

            <select id="payment-franchise-filter" class="clay-select">
              <option value="all">All Franchise Hubs</option>
              ${franchises
                .map(
                  (f) => `
                <option value="${f.id}" ${selectedFranchise === f.id.toString() ? 'selected' : ''}>${f.name}</option>
              `
                )
                .join('')}
            </select>

            <button class="clay-btn clay-btn-secondary" id="btn-export-payments-csv">
              ${icons.download} Export CSV
            </button>
          </div>
        </div>
      </div>

      <!-- Transactions Table -->
      <div class="clay-table-wrapper">
        <div class="clay-table-header">
          <h3>Transaction & Payment Monitoring (${filtered.length})</h3>
          <span class="text-muted text-sm">Automated Settlement & Gateway Reconciliation</span>
        </div>
        <div class="table-scroll">
          <table class="clay-table">
            <thead>
              <tr>
                <th>Txn ID</th>
                <th>Booking Ref</th>
                <th>Customer</th>
                <th>Franchise Hub</th>
                <th>Method</th>
                <th>Gross Total</th>
                <th>GST (18%)</th>
                <th>HQ Commission (15%)</th>
                <th>Franchise Net</th>
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
                <tr data-txn-id="${t.id}">
                  <td>
                    <strong class="font-mono text-violet">${t.txn_number}</strong>
                    <div class="text-xs text-muted">${new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                  <td>
                    <span class="booking-number">${t.booking_number}</span>
                  </td>
                  <td>
                    <div class="customer-cell">
                      <strong class="customer-name">${t.customer_name}</strong>
                      <span class="customer-sub">${t.customer_phone}</span>
                    </div>
                  </td>
                  <td>
                    <span class="franchise-cell">${icons.mapPin} ${getFranchiseName(t.franchise_id)}</span>
                  </td>
                  <td>
                    ${methodBadge(t.payment_method)}
                  </td>
                  <td class="amount-cell">
                    <strong>₹${t.amount.toLocaleString('en-IN')}</strong>
                  </td>
                  <td class="text-sm text-muted">
                    ₹${t.tax.toFixed(2)}
                  </td>
                  <td class="text-sm text-violet">
                    ₹${t.commission.toFixed(2)}
                  </td>
                  <td class="text-sm font-bold text-green">
                    ₹${t.net_amount.toFixed(2)}
                  </td>
                  <td>
                    ${statusBadge(t.status)}
                  </td>
                  <td>
                    <div class="table-actions">
                      <button class="clay-btn clay-btn-sm clay-btn-secondary btn-view-receipt" data-id="${t.id}" title="View Receipt">
                        ${icons.fileText} Receipt
                      </button>
                      ${
                        t.status === 'success'
                          ? `
                        <button class="clay-btn clay-btn-sm clay-btn-ghost text-danger btn-open-refund" data-id="${t.id}" title="Process Refund">
                          ${icons.refresh}
                        </button>
                      `
                          : ''
                      }
                    </div>
                  </td>
                </tr>
              `
                      )
                      .join('')
                  : `
                <tr>
                  <td colspan="11" class="text-center py-8 text-muted">
                    <div class="empty-state">
                      ${icons.creditCard}
                      <h3>No payment records found</h3>
                      <p>Adjust your search filters or check again later.</p>
                    </div>
                  </td>
                </tr>
              `
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal: GST Payment Receipt -->
      ${
        state.viewingReceipt
          ? `
        <div class="clay-modal-overlay" id="receipt-modal">
          <div class="clay-modal-card animate-slide-up" style="max-width: 550px;">
            <div class="modal-header">
              <div class="modal-title-wrap">
                <div class="modal-icon green">${icons.fileText}</div>
                <div>
                  <h3>Payment Receipt</h3>
                  <p class="modal-subtitle">${state.viewingReceipt.txn_number} &bull; ${state.viewingReceipt.booking_number}</p>
                </div>
              </div>
              <button class="modal-close" id="btn-close-receipt-modal">&times;</button>
            </div>

            <div class="receipt-content clay-card mt-4">
              <div class="receipt-header text-center pb-4 border-b">
                <h3 class="text-xl font-black text-violet">SpeedoShine Auto Detailing</h3>
                <p class="text-sm text-muted">GSTIN: 29AABCU9603R1ZX &bull; Authorized Payment Slip</p>
              </div>

              <div class="receipt-meta py-4 border-b grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-muted">Customer Name:</span>
                  <strong class="block">${state.viewingReceipt.customer_name}</strong>
                </div>
                <div>
                  <span class="text-muted">Payment Mode:</span>
                  <strong class="block">${state.viewingReceipt.payment_method}</strong>
                </div>
                <div>
                  <span class="text-muted">Franchise Center:</span>
                  <strong class="block">${getFranchiseName(state.viewingReceipt.franchise_id)}</strong>
                </div>
                <div>
                  <span class="text-muted">Date & Time:</span>
                  <strong class="block">${new Date(state.viewingReceipt.created_at).toLocaleString()}</strong>
                </div>
              </div>

              <div class="receipt-breakdown py-4 border-b text-sm">
                <div class="flex justify-between py-1">
                  <span>Gross Service Charge:</span>
                  <span>₹${(state.viewingReceipt.amount - state.viewingReceipt.tax).toFixed(2)}</span>
                </div>
                <div class="flex justify-between py-1">
                  <span>CGST (9%):</span>
                  <span>₹${(state.viewingReceipt.tax / 2).toFixed(2)}</span>
                </div>
                <div class="flex justify-between py-1">
                  <span>SGST (9%):</span>
                  <span>₹${(state.viewingReceipt.tax / 2).toFixed(2)}</span>
                </div>
                <div class="flex justify-between py-2 font-bold text-lg border-t mt-2">
                  <span>Total Amount Paid:</span>
                  <span class="text-green">₹${state.viewingReceipt.amount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div class="text-center text-xs text-muted pt-3">
                Computer-generated receipt &bull; Secured with 256-bit SSL Gateway
              </div>
            </div>

            <div class="modal-actions mt-6">
              <button class="clay-btn clay-btn-secondary" id="btn-close-receipt-bottom">Close</button>
              <button class="clay-btn clay-btn-primary" onclick="window.print()">
                ${icons.printer} Print Slip
              </button>
            </div>
          </div>
        </div>
      `
          : ''
      }

      <!-- Modal: Process Refund -->
      ${
        state.refundingTxn
          ? `
        <div class="clay-modal-overlay" id="refund-modal">
          <div class="clay-modal-card animate-slide-up">
            <div class="modal-header">
              <div class="modal-title-wrap">
                <div class="modal-icon amber">${icons.refresh}</div>
                <div>
                  <h3>Process Refund</h3>
                  <p class="modal-subtitle">Initiate payment reversal for ${state.refundingTxn.txn_number}</p>
                </div>
              </div>
              <button class="modal-close" id="btn-close-refund-modal">&times;</button>
            </div>

            <form id="refund-form" class="modal-form">
              <input type="hidden" name="txn_id" value="${state.refundingTxn.id}" />

              <div class="receipt-content clay-card mb-4 text-sm">
                <div class="flex justify-between">
                  <span>Customer:</span>
                  <strong>${state.refundingTxn.customer_name}</strong>
                </div>
                <div class="flex justify-between mt-1">
                  <span>Original Amount:</span>
                  <strong>₹${state.refundingTxn.amount.toLocaleString('en-IN')}</strong>
                </div>
                <div class="flex justify-between mt-1">
                  <span>Method:</span>
                  <strong>${state.refundingTxn.payment_method}</strong>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Refund Amount (₹) *</label>
                <input type="number" name="refund_amount" class="clay-input" value="${state.refundingTxn.amount}" max="${state.refundingTxn.amount}" required />
              </div>

              <div class="form-group">
                <label class="form-label">Reason for Refund *</label>
                <select name="refund_reason" class="clay-select" required>
                  <option value="Quality Concern">Customer reported wash quality / water stains</option>
                  <option value="Schedule Delay">Unacceptable bay turnaround delay (> 45 min)</option>
                  <option value="Customer Cancellation">Customer cancelled prior to foam stage</option>
                  <option value="Duplicate Payment">Duplicate UPI transaction detected</option>
                  <option value="Other">Other Operational Goodwill Refund</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Internal Supervisor Notes</label>
                <textarea name="notes" class="clay-textarea" rows="2" placeholder="Explain approved settlement or coupon substitute..."></textarea>
              </div>

              <div class="modal-actions">
                <button type="button" class="clay-btn clay-btn-secondary" id="btn-cancel-refund">Cancel</button>
                <button type="submit" class="clay-btn clay-btn-primary" style="background: linear-gradient(135deg, #EF4444, #DC2626);">
                  Confirm Refund Reversal
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
