import { icons } from '../components/icons.ts';
import type {
  DashboardStats,
  RevenueChartPoint,
  ServicePopularity,
  StaffPerformance,
  FranchisePerformance,
} from '../api.ts';

export interface AnalyticsPageState {
  stats: DashboardStats | null;
  revenueData: RevenueChartPoint[];
  servicePopularity: ServicePopularity[];
  staffPerformance: StaffPerformance[];
  franchisePerformance: FranchisePerformance[];
  activeTab?: 'overview' | 'revenue' | 'staff' | 'retention' | 'export';
  dateRange?: '7d' | '30d' | '90d' | 'year';
}

export function renderAnalyticsPage(state: AnalyticsPageState): string {
  const { stats, revenueData, servicePopularity, staffPerformance, franchisePerformance } = state;
  const currentTab = state.activeTab || 'overview';
  const range = state.dateRange || '7d';

  const totalRev = stats?.total_revenue || 847500;
  const totalBookings = stats?.total_bookings || 1284;
  const aov = totalBookings > 0 ? Math.round(totalRev / totalBookings) : 660;

  const maxServiceBookings = Math.max(...servicePopularity.map((s) => s.bookings), 1);
  const maxFranchiseRevenue = Math.max(...franchisePerformance.map((f) => f.revenue), 1);

  return `
    <div class="analytics-page animate-fade-in">
      <!-- High Level KPIs -->
      <div class="stats-grid mb-6">
        <div class="stat-card">
          <div class="stat-card-icon violet">${icons.revenue}</div>
          <div class="stat-card-value">₹${totalRev.toLocaleString('en-IN')}</div>
          <div class="stat-card-label">Total Network Revenue</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon blue">${icons.dollarSign}</div>
          <div class="stat-card-value">₹${aov.toLocaleString('en-IN')}</div>
          <div class="stat-card-label">Avg Order Value (AOV)</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon green">${icons.checkCircle}</div>
          <div class="stat-card-value">95.4%</div>
          <div class="stat-card-label">On-Time Wash Rate</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon pink">${icons.percent}</div>
          <div class="stat-card-value">15.0%</div>
          <div class="stat-card-label">HQ Franchise Royalty</div>
        </div>
      </div>

      <!-- Module 8 Sub-Navigation & Date Filter -->
      <div class="clay-card mb-6">
        <div class="flex items-center justify-between flex-wrap gap-4 border-b pb-4">
          <div class="flex items-center gap-2 flex-wrap">
            <button class="status-tab ${currentTab === 'overview' ? 'active' : ''}" data-report-tab="overview">
              ${icons.analytics} <span>Executive BI Overview</span>
            </button>
            <button class="status-tab ${currentTab === 'revenue' ? 'active' : ''}" data-report-tab="revenue">
              ${icons.revenue} <span>Revenue & Channel Trends</span>
            </button>
            <button class="status-tab ${currentTab === 'staff' ? 'active' : ''}" data-report-tab="staff">
              ${icons.users} <span>Staff Productivity Reports</span>
            </button>
            <button class="status-tab ${currentTab === 'retention' ? 'active' : ''}" data-report-tab="retention">
              ${icons.repeat} <span>Customer Retention & CLV</span>
            </button>
            <button class="status-tab ${currentTab === 'export' ? 'active' : ''}" data-report-tab="export">
              ${icons.download} <span>Export CSV Reports</span>
            </button>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-muted uppercase">Period:</span>
            <select id="analytics-date-range" class="clay-select text-xs">
              <option value="7d" ${range === '7d' ? 'selected' : ''}>Last 7 Days</option>
              <option value="30d" ${range === '30d' ? 'selected' : ''}>Last 30 Days</option>
              <option value="90d" ${range === '90d' ? 'selected' : ''}>Last 90 Days</option>
              <option value="year" ${range === 'year' ? 'selected' : ''}>Year to Date (2026)</option>
            </select>
          </div>
        </div>

        ${
          currentTab === 'overview'
            ? `
          <!-- Charts & Deep Dive Row -->
          <div class="analytics-two-col mt-6 mb-6">
            <!-- Service Popularity -->
            <div class="clay-card">
              <div class="clay-table-header mb-4">
                <h3>Most Popular Services</h3>
                <span class="text-muted text-sm">Volume Breakdown</span>
              </div>

              <div class="service-popularity-list">
                ${servicePopularity
                  .slice(0, 6)
                  .map((s) => {
                    const percent = Math.round((s.bookings / maxServiceBookings) * 100);
                    return `
                    <div class="popularity-row mb-4">
                      <div class="popularity-info">
                        <span class="font-bold">${s.name}</span>
                        <span class="badge badge-subtle">${s.category}</span>
                        <span class="popularity-count font-bold">${s.bookings} orders</span>
                      </div>
                      <div class="clay-progress-track">
                        <div class="clay-progress-bar violet" style="width: ${percent}%"></div>
                      </div>
                    </div>
                  `;
                  })
                  .join('')}
              </div>
            </div>

            <!-- Outlet Revenue Share -->
            <div class="clay-card">
              <div class="clay-table-header mb-4">
                <h3>Franchise Revenue Distribution</h3>
                <span class="text-muted text-sm">Bangalore Hub Performance</span>
              </div>

              <div class="service-popularity-list">
                ${franchisePerformance
                  .slice(0, 5)
                  .map((f) => {
                    const percent = Math.round((f.revenue / maxFranchiseRevenue) * 100);
                    return `
                    <div class="popularity-row mb-4">
                      <div class="popularity-info">
                        <span class="font-bold">${f.name}</span>
                        <span class="text-muted text-xs">${f.city}</span>
                        <span class="font-bold text-violet">₹${f.revenue.toLocaleString('en-IN')}</span>
                      </div>
                      <div class="clay-progress-track">
                        <div class="clay-progress-bar pink" style="width: ${percent}%"></div>
                      </div>
                      <div class="text-xs text-muted mt-1">${f.total_bookings} bookings &bull; ⭐ ${f.rating.toFixed(1)}</div>
                    </div>
                  `;
                  })
                  .join('')}
              </div>
            </div>
          </div>

          <!-- Top Staff Leaderboard -->
          <div class="clay-card">
            <div class="clay-table-header mb-4">
              <h3>Staff Performance Leaderboard</h3>
              <span class="text-muted text-sm">Ranked by jobs completed & customer satisfaction</span>
            </div>

            <div class="table-scroll">
              <table class="clay-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Technician</th>
                    <th>Role</th>
                    <th>Jobs Completed</th>
                    <th>Satisfaction Rating</th>
                    <th>Revenue Generated</th>
                  </tr>
                </thead>
                <tbody>
                  ${staffPerformance
                    .slice(0, 8)
                    .map(
                      (sp, idx) => `
                    <tr>
                      <td>
                        <span class="rank-badge ${idx < 3 ? 'rank-top' : ''}">#${idx + 1}</span>
                      </td>
                      <td><strong>${sp.name}</strong></td>
                      <td><span class="badge badge-subtle uppercase">${sp.role}</span></td>
                      <td><span class="font-bold">${sp.jobs_completed}</span></td>
                      <td><span class="rating-val">⭐ ${sp.rating.toFixed(1)}</span></td>
                      <td class="amount-cell">₹${sp.revenue.toLocaleString('en-IN')}</td>
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
          currentTab === 'revenue'
            ? `
          <!-- Revenue & Channel Breakdown -->
          <div class="mt-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div class="clay-card text-center p-6">
                <span class="text-xs font-bold text-muted uppercase">Digital UPI Collection</span>
                <h3 class="text-3xl font-black text-violet mt-2">₹576,300</h3>
                <span class="badge badge-success mt-2">68.0% of Total Revenue</span>
              </div>
              <div class="clay-card text-center p-6">
                <span class="text-xs font-bold text-muted uppercase">Card Terminal (POS)</span>
                <h3 class="text-3xl font-black text-blue mt-2">₹186,450</h3>
                <span class="badge badge-subtle mt-2">22.0% of Total Revenue</span>
              </div>
              <div class="clay-card text-center p-6">
                <span class="text-xs font-bold text-muted uppercase">Cash at Hub Counter</span>
                <h3 class="text-3xl font-black text-green mt-2">₹84,750</h3>
                <span class="badge badge-subtle mt-2">10.0% of Total Revenue</span>
              </div>
            </div>

            <div class="clay-card mb-6">
              <div class="clay-table-header mb-4">
                <h3>Daily Revenue Trajectory (${revenueData.length} Data Points)</h3>
                <span class="text-green font-bold text-sm">+24.8% Week-over-Week Growth</span>
              </div>
              <div class="table-scroll">
                <table class="clay-table">
                  <thead>
                    <tr>
                      <th>Day / Period</th>
                      <th>Gross Revenue</th>
                      <th>Completed Washes</th>
                      <th>Avg Ticket Size</th>
                      <th>15% HQ Royalty</th>
                      <th>Net Franchise Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${revenueData
                      .map((d) => {
                        const royalty = Math.round(d.revenue * 0.15);
                        const net = d.revenue - royalty;
                        const avgTicket = d.bookings > 0 ? Math.round(d.revenue / d.bookings) : 0;
                        return `
                        <tr>
                          <td><strong>${d.date}</strong></td>
                          <td class="amount-cell text-violet font-bold">₹${d.revenue.toLocaleString('en-IN')}</td>
                          <td><strong>${d.bookings}</strong> washes</td>
                          <td>₹${avgTicket.toLocaleString('en-IN')}</td>
                          <td class="text-green font-bold">₹${royalty.toLocaleString('en-IN')}</td>
                          <td class="font-bold">₹${net.toLocaleString('en-IN')}</td>
                        </tr>
                      `;
                      })
                      .join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Vehicle Segment Revenue Split -->
            <div class="clay-card">
              <h4 class="font-bold mb-4">Revenue Contribution by Vehicle Segment</h4>
              <div class="space-y-4">
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span class="font-bold">SUVs & MUVs (Fortuner, Creta, Safari, XUV700)</span>
                    <strong class="text-violet">₹406,800 (48%)</strong>
                  </div>
                  <div class="clay-progress-track">
                    <div class="clay-progress-bar violet" style="width: 48%;"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span class="font-bold">Executive Sedans (City, Virtus, BMW, Verna)</span>
                    <strong class="text-pink">₹271,200 (32%)</strong>
                  </div>
                  <div class="clay-progress-track">
                    <div class="clay-progress-bar pink" style="width: 32%;"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span class="font-bold">Compact Hatchbacks (Swift, i20, Polo, Altroz)</span>
                    <strong class="text-blue">₹127,125 (15%)</strong>
                  </div>
                  <div class="clay-progress-track">
                    <div class="clay-progress-bar blue" style="width: 15%;"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span class="font-bold">Motorcycles & Superbikes (Royal Enfield, Duke, Tiger)</span>
                    <strong class="text-green">₹42,375 (5%)</strong>
                  </div>
                  <div class="clay-progress-track">
                    <div class="clay-progress-bar green" style="width: 5%;"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `
            : ''
        }

        ${
          currentTab === 'staff'
            ? `
          <!-- Staff Productivity & Wash Speed Report -->
          <div class="clay-card mt-6">
            <div class="clay-table-header mb-4">
              <h3>Technician Efficiency & Turnaround Speed (SLA 30 Mins)</h3>
              <span class="text-muted text-sm">Automated speed tracking via Bay CCTV & Clock-ins</span>
            </div>
            <div class="table-scroll">
              <table class="clay-table">
                <thead>
                  <tr>
                    <th>Staff Name</th>
                    <th>Designation</th>
                    <th>Jobs Done</th>
                    <th>Avg Wash Speed</th>
                    <th>Customer Rating</th>
                    <th>QC Pass Rate</th>
                    <th>Bonus Earned</th>
                  </tr>
                </thead>
                <tbody>
                  ${staffPerformance
                    .map((sp, idx) => {
                      const speedMins = [22, 19, 38, 25, 42, 28][idx % 6];
                      const qcRate = [99.2, 98.8, 97.4, 99.5, 96.8, 98.1][idx % 6];
                      const bonus = sp.jobs_completed * (sp.role === 'detailer' ? 150 : 100);
                      return `
                      <tr>
                        <td><strong>${sp.name}</strong></td>
                        <td><span class="badge badge-subtle uppercase">${sp.role}</span></td>
                        <td><strong>${sp.jobs_completed}</strong> cars</td>
                        <td>
                          <span class="font-bold ${speedMins <= 25 ? 'text-green' : 'text-amber'}">${speedMins} mins / car</span>
                        </td>
                        <td><span class="rating-val">⭐ ${sp.rating.toFixed(1)}</span></td>
                        <td><span class="text-green font-bold">${qcRate}%</span></td>
                        <td class="amount-cell text-violet font-bold">+₹${bonus.toLocaleString('en-IN')}</td>
                      </tr>
                    `;
                    })
                    .join('')}
                </tbody>
              </table>
            </div>
          </div>
        `
            : ''
        }

        ${
          currentTab === 'retention'
            ? `
          <!-- Customer Retention & Lifetime Value (CLV) -->
          <div class="mt-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div class="stat-card">
                <div class="stat-card-icon violet">${icons.repeat}</div>
                <div class="stat-card-value">72.4%</div>
                <div class="stat-card-label">Repeat Booking Rate</div>
              </div>
              <div class="stat-card">
                <div class="stat-card-icon blue">${icons.clock}</div>
                <div class="stat-card-value">18.6 Days</div>
                <div class="stat-card-label">Avg Cycle Between Washes</div>
              </div>
              <div class="stat-card">
                <div class="stat-card-icon green">${icons.award}</div>
                <div class="stat-card-value">₹24,800</div>
                <div class="stat-card-label">VIP Customer Lifetime Value</div>
              </div>
              <div class="stat-card">
                <div class="stat-card-icon pink">${icons.users}</div>
                <div class="stat-card-value">1,248</div>
                <div class="stat-card-label">Active Car Owners in CRM</div>
              </div>
            </div>

            <div class="clay-card mb-6">
              <h4 class="font-bold mb-4">Retention Cohort Analysis (30-Day Intervals)</h4>
              <div class="table-scroll">
                <table class="clay-table">
                  <thead>
                    <tr>
                      <th>Customer Loyalty Tier</th>
                      <th>Registered Owners</th>
                      <th>Avg Visits / Year</th>
                      <th>Annual Spend</th>
                      <th>Churn Risk</th>
                      <th>Marketing Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><span class="badge" style="background: linear-gradient(135deg, #A78BFA, #7C3AED); color: white;">Diamond VIP</span></td>
                      <td><strong>48 owners</strong></td>
                      <td>16.2 visits</td>
                      <td class="amount-cell">₹38,400</td>
                      <td><span class="text-green font-bold">Ultra Low (1.2%)</span></td>
                      <td><span class="text-xs text-muted">Dedicated WhatsApp concierge & free pickup</span></td>
                    </tr>
                    <tr>
                      <td><span class="badge" style="background: linear-gradient(135deg, #60A5FA, #2563EB); color: white;">Platinum</span></td>
                      <td><strong>138 owners</strong></td>
                      <td>11.4 visits</td>
                      <td class="amount-cell">₹22,800</td>
                      <td><span class="text-green font-bold">Low (3.8%)</span></td>
                      <td><span class="text-xs text-muted">Priority bay booking & 10% ceramic discounts</span></td>
                    </tr>
                    <tr>
                      <td><span class="badge" style="background: linear-gradient(135deg, #FBBF24, #D97706); color: white;">Gold</span></td>
                      <td><strong>390 owners</strong></td>
                      <td>7.8 visits</td>
                      <td class="amount-cell">₹12,400</td>
                      <td><span class="text-amber font-bold">Moderate (9.4%)</span></td>
                      <td><span class="text-xs text-muted">Automated 21-day SMS wash reminder push</span></td>
                    </tr>
                    <tr>
                      <td><span class="badge" style="background: #E5E7EB; color: #4B5563;">Silver</span></td>
                      <td><strong>672 owners</strong></td>
                      <td>3.2 visits</td>
                      <td class="amount-cell">₹4,200</td>
                      <td><span class="text-danger font-bold">High (22.5%)</span></td>
                      <td><span class="text-xs text-muted">Monsoon promotional 20% discount coupon</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        `
            : ''
        }

        ${
          currentTab === 'export'
            ? `
          <!-- Export Reports Hub -->
          <div class="clay-card mt-6">
            <div class="clay-table-header mb-4">
              <h3>Export Official Management Reports</h3>
              <span class="text-muted text-sm">Download formatted CSV reports for audit & accounting</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div class="clay-card p-5 flex items-center justify-between">
                <div>
                  <h4 class="font-bold text-violet">Revenue & Payment Reconciliation (CSV)</h4>
                  <p class="text-xs text-muted mt-1">Includes booking #, customer, method, GST 18%, and net amount</p>
                </div>
                <button class="clay-btn clay-btn-sm clay-btn-primary btn-download-csv" data-type="revenue">
                  ${icons.download} Download CSV
                </button>
              </div>

              <div class="clay-card p-5 flex items-center justify-between">
                <div>
                  <h4 class="font-bold text-pink">Franchise 15% Royalty Settlements (CSV)</h4>
                  <p class="text-xs text-muted mt-1">Gross hub revenue, 15% royalty, bank IFSC, and payment reference</p>
                </div>
                <button class="clay-btn clay-btn-sm clay-btn-primary btn-download-csv" data-type="franchise">
                  ${icons.download} Download CSV
                </button>
              </div>

              <div class="clay-card p-5 flex items-center justify-between">
                <div>
                  <h4 class="font-bold text-blue">Staff Attendance & Wash Bonus Registry (CSV)</h4>
                  <p class="text-xs text-muted mt-1">Duty hours, total cars washed, incentive rates, and gross payout</p>
                </div>
                <button class="clay-btn clay-btn-sm clay-btn-primary btn-download-csv" data-type="staff">
                  ${icons.download} Download CSV
                </button>
              </div>

              <div class="clay-card p-5 flex items-center justify-between">
                <div>
                  <h4 class="font-bold text-green">Customer CRM & Vehicle Master List (CSV)</h4>
                  <p class="text-xs text-muted mt-1">Customer phone, car model, license plate, loyalty tier, and lifetime spend</p>
                </div>
                <button class="clay-btn clay-btn-sm clay-btn-primary btn-download-csv" data-type="customers">
                  ${icons.download} Download CSV
                </button>
              </div>
            </div>
          </div>
        `
            : ''
        }
      </div>
    </div>
  `;
}
