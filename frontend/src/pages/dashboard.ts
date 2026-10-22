import { icons } from '../components/icons.ts';
import type {
  DashboardStats,
  RevenueChartPoint,
  RecentBooking,
  BookingStatusBreakdown,
} from '../api.ts';

// ─── Stat Cards ──────────────────────────────────────────────
function renderStatCards(stats: DashboardStats | null): string {
  const cards = [
    {
      icon: icons.revenue,
      color: 'violet',
      label: 'Total Revenue',
      value: stats ? `₹${stats.total_revenue.toLocaleString('en-IN')}` : '—',
      trend: '+12.5%',
      trendDir: 'up' as const,
    },
    {
      icon: icons.bookings,
      color: 'blue',
      label: 'Total Bookings',
      value: stats ? stats.total_bookings.toLocaleString() : '—',
      trend: '+8.2%',
      trendDir: 'up' as const,
    },
    {
      icon: icons.users,
      color: 'green',
      label: 'Active Staff',
      value: stats ? stats.active_staff.toString() : '—',
      trend: '+3',
      trendDir: 'up' as const,
    },
    {
      icon: icons.store,
      color: 'pink',
      label: 'Franchises',
      value: stats ? stats.total_franchises.toString() : '—',
      trend: 'Stable',
      trendDir: 'up' as const,
    },
    {
      icon: icons.clock,
      color: 'amber',
      label: 'Pending',
      value: stats ? stats.pending_bookings.toString() : '—',
      trend: 'Action needed',
      trendDir: 'down' as const,
    },
    {
      icon: icons.checkCircle,
      color: 'green',
      label: 'Done Today',
      value: stats ? stats.completed_today.toString() : '—',
      trend: 'Today',
      trendDir: 'up' as const,
    },
    {
      icon: icons.starFilled,
      color: 'amber',
      label: 'Avg Rating',
      value: stats ? stats.avg_rating.toFixed(1) : '—',
      trend: '⭐ Excellent',
      trendDir: 'up' as const,
    },
  ];

  return `
    <div class="stats-grid">
      ${cards
        .map(
          (c, i) => `
        <div class="stat-card animate-slide-up animation-delay-${(i + 1) * 100}" id="stat-${c.label.toLowerCase().replace(/\s+/g, '-')}">
          <div class="stat-card-icon ${c.color}">${c.icon}</div>
          <div class="stat-card-value">${c.value}</div>
          <div class="stat-card-label">${c.label}</div>
          <div class="stat-card-trend ${c.trendDir}">
            ${c.trendDir === 'up' ? icons.trendUp : icons.trendDown}
            ${c.trend}
          </div>
        </div>
      `
        )
        .join('')}
    </div>
  `;
}

// ─── Revenue Chart (Pure CSS bar chart) ──────────────────────
function renderRevenueChart(data: RevenueChartPoint[] | null): string {
  if (!data || data.length === 0) {
    return `
      <div class="chart-container animate-slide-up animation-delay-300">
        <div class="chart-header">
          <h3>Revenue Overview</h3>
          <div class="chart-period-selector">
            <button class="clay-btn clay-btn-sm clay-btn-ghost active-period" data-days="7">7D</button>
            <button class="clay-btn clay-btn-sm clay-btn-ghost" data-days="14">14D</button>
            <button class="clay-btn clay-btn-sm clay-btn-ghost" data-days="30">30D</button>
          </div>
        </div>
        <div class="chart-placeholder">
          <div class="chart-loading">Loading chart data...</div>
        </div>
      </div>
    `;
  }

  const maxRevenue = Math.max(...data.map(d => d.revenue), 1);
  const maxBookings = Math.max(...data.map(d => d.bookings), 1);

  const bars = data
    .map(
      (d) => `
      <div class="chart-bar-group">
        <div class="chart-bar-wrapper">
          <div class="chart-bar revenue-bar" style="height: ${(d.revenue / maxRevenue) * 100}%" title="₹${d.revenue.toLocaleString('en-IN')}">
            <span class="chart-bar-tooltip">₹${d.revenue.toLocaleString('en-IN')}</span>
          </div>
          <div class="chart-bar bookings-bar" style="height: ${(d.bookings / maxBookings) * 100}%" title="${d.bookings} bookings">
            <span class="chart-bar-tooltip">${d.bookings}</span>
          </div>
        </div>
        <span class="chart-bar-label">${d.date}</span>
      </div>
    `
    )
    .join('');

  return `
    <div class="chart-container animate-slide-up animation-delay-300">
      <div class="chart-header">
        <h3>Revenue Overview</h3>
        <div class="chart-legend">
          <span class="legend-item"><span class="legend-dot revenue-dot"></span> Revenue</span>
          <span class="legend-item"><span class="legend-dot bookings-dot"></span> Bookings</span>
        </div>
      </div>
      <div class="chart-bars-container">
        ${bars}
      </div>
    </div>
  `;
}

// ─── Booking Status Donut ────────────────────────────────────
function renderStatusDonut(data: BookingStatusBreakdown[] | null): string {
  const statusColors: Record<string, string> = {
    pending: '#F59E0B',
    confirmed: '#0EA5E9',
    in_progress: '#7C3AED',
    completed: '#10B981',
    cancelled: '#EF4444',
  };

  const statusLabels: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };

  if (!data || data.length === 0) {
    return `
      <div class="chart-container animate-slide-up animation-delay-400">
        <div class="chart-header"><h3>Booking Status</h3></div>
        <div class="chart-placeholder"><div class="chart-loading">Loading...</div></div>
      </div>
    `;
  }

  const total = data.reduce((sum, d) => sum + d.count, 0) || 1;
  let cumulativePercent = 0;
  const segments = data
    .filter(d => d.count > 0)
    .map(d => {
      const percent = (d.count / total) * 100;
      const start = cumulativePercent;
      cumulativePercent += percent;
      return { ...d, percent, start, color: statusColors[d.status] || '#999' };
    });

  // Build conic-gradient
  const gradient = segments
    .map(s => `${s.color} ${s.start}% ${s.start + s.percent}%`)
    .join(', ');

  const legendItems = data
    .map(
      d => `
      <div class="donut-legend-item">
        <span class="donut-legend-dot" style="background: ${statusColors[d.status] || '#999'}"></span>
        <span class="donut-legend-label">${statusLabels[d.status] || d.status}</span>
        <span class="donut-legend-value">${d.count}</span>
      </div>
    `
    )
    .join('');

  return `
    <div class="chart-container animate-slide-up animation-delay-400">
      <div class="chart-header"><h3>Booking Status</h3></div>
      <div class="donut-wrapper">
        <div class="donut-chart" style="background: conic-gradient(${gradient})">
          <div class="donut-hole">
            <span class="donut-total">${total}</span>
            <span class="donut-total-label">Total</span>
          </div>
        </div>
        <div class="donut-legend">
          ${legendItems}
        </div>
      </div>
    </div>
  `;
}

// ─── Recent Bookings Table ───────────────────────────────────
function renderRecentBookings(bookings: RecentBooking[] | null): string {
  if (!bookings || bookings.length === 0) {
    return `
      <div class="clay-table-wrapper animate-slide-up animation-delay-500">
        <div class="clay-table-header">
          <h3>Recent Bookings</h3>
        </div>
        <div class="empty-state">
          ${icons.bookings}
          <h3>No bookings yet</h3>
          <p>Bookings will appear here once they're created.</p>
        </div>
      </div>
    `;
  }

  const statusBadge = (status: string) => {
    const cls = status.replace('_', '-');
    const label = status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
    return `<span class="badge badge-${cls}">${label}</span>`;
  };

  const paymentBadge = (status: string) => {
    const label = status.replace(/\b\w/g, c => c.toUpperCase());
    return `<span class="badge badge-${status}">${label}</span>`;
  };

  const rows = bookings
    .map(
      b => `
      <tr>
        <td><strong class="booking-number">${b.booking_number}</strong></td>
        <td>${b.customer_name}</td>
        <td>
          <span class="vehicle-info">${b.vehicle_type.toUpperCase()}</span>
          <span class="vehicle-number">${b.vehicle_number || '—'}</span>
        </td>
        <td>${b.service_name}</td>
        <td>${b.franchise_name}</td>
        <td>${b.staff_name}</td>
        <td>${statusBadge(b.status)}</td>
        <td>${paymentBadge(b.payment_status)}</td>
        <td class="amount-cell">₹${b.final_amount.toLocaleString('en-IN')}</td>
        <td>${b.scheduled_date}</td>
      </tr>
    `
    )
    .join('');

  return `
    <div class="clay-table-wrapper animate-slide-up animation-delay-500">
      <div class="clay-table-header">
        <h3>Recent Bookings</h3>
        <button class="clay-btn clay-btn-sm clay-btn-ghost" id="view-all-bookings">
          View All ${icons.chevronRight}
        </button>
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
              <th>Staff</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ─── Quick Actions ───────────────────────────────────────────
function renderQuickActions(): string {
  return `
    <div class="quick-actions animate-slide-up animation-delay-200">
      <h3 class="section-title">Quick Actions</h3>
      <div class="quick-actions-grid">
        <button class="quick-action-card" id="qa-new-booking">
          <div class="quick-action-icon violet">${icons.bookings}</div>
          <span>New Booking</span>
        </button>
        <button class="quick-action-card" id="qa-add-staff">
          <div class="quick-action-icon blue">${icons.staff}</div>
          <span>Add Staff</span>
        </button>
        <button class="quick-action-card" id="qa-add-franchise">
          <div class="quick-action-icon pink">${icons.franchise}</div>
          <span>Add Franchise</span>
        </button>
        <button class="quick-action-card" id="qa-add-service">
          <div class="quick-action-icon green">${icons.services}</div>
          <span>Add Service</span>
        </button>
      </div>
    </div>
  `;
}

// ─── Main Dashboard Render ───────────────────────────────────
export function renderDashboardPage(
  stats: DashboardStats | null,
  revenueData: RevenueChartPoint[] | null,
  recentBookings: RecentBooking[] | null,
  statusBreakdown: BookingStatusBreakdown[] | null,
): string {
  return `
    <div class="dashboard-content">
      ${renderStatCards(stats)}
      ${renderQuickActions()}
      <div class="charts-row">
        ${renderRevenueChart(revenueData)}
        ${renderStatusDonut(statusBreakdown)}
      </div>
      ${renderRecentBookings(recentBookings)}
    </div>
  `;
}
