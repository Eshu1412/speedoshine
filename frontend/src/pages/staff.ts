import { icons } from '../components/icons.ts';
import type { Staff, Franchise, Booking, StaffAttendance, StaffShift, StaffLeaveRequest, StaffSalaryRecord } from '../api.ts';

export interface StaffPageState {
  staffList: Staff[];
  franchises: Franchise[];
  bookings?: Booking[];
  searchQuery: string;
  roleFilter: string;
  franchiseFilter: string;
  dutyFilter: string;
  isCreateModalOpen: boolean;
  editingStaff: Staff | null;
  activeSubTab?: 'directory' | 'attendance' | 'shifts' | 'leaves' | 'salaries' | 'allocation';
}

export function getDemoAttendance(staffList: Staff[]): StaffAttendance[] {
  return staffList.map((s, idx) => ({
    id: idx + 1,
    staff_id: s.id,
    staff_name: s.full_name,
    role: s.role,
    date: new Date().toISOString().split('T')[0],
    clock_in: ['08:00 AM', '08:15 AM', '08:05 AM', '07:55 AM', '08:10 AM', '—'][idx % 6],
    clock_out: idx % 2 === 0 ? '05:00 PM' : null,
    status: (idx === 5 ? 'On Leave' : s.is_on_duty ? 'On Duty' : 'Present') as any,
    total_hours: idx === 5 ? 0 : 8.5,
  }));
}

export function getDemoShifts(staffList: Staff[]): StaffShift[] {
  const shifts: Array<StaffShift['shift_name']> = [
    'Morning Shift (08:00 - 16:00)',
    'Evening Shift (12:00 - 20:00)',
    'General Shift (09:00 - 18:00)',
    'Morning Shift (08:00 - 16:00)',
    'Night Detailing (16:00 - 23:00)',
    'Morning Shift (08:00 - 16:00)',
  ];

  return staffList.map((s, idx) => ({
    id: idx + 1,
    staff_id: s.id,
    staff_name: s.full_name,
    role: s.role,
    franchise_id: s.franchise_id || 1,
    shift_name: shifts[idx % shifts.length],
    day_of_week: 'Mon - Sat (Rotational Sunday)',
  }));
}

export function getDemoLeaves(_staffList?: Staff[]): StaffLeaveRequest[] {
  return [
    {
      id: 1,
      staff_id: 3,
      staff_name: 'Suresh Babu',
      leave_type: 'Casual Leave',
      start_date: '2026-10-24',
      end_date: '2026-10-25',
      reason: 'Family function in Mysore',
      status: 'Pending',
    },
    {
      id: 2,
      staff_id: 6,
      staff_name: 'Santosh Yadav',
      leave_type: 'Sick Leave',
      start_date: '2026-10-21',
      end_date: '2026-10-22',
      reason: 'Seasonal viral flu and rest',
      status: 'Approved',
    },
    {
      id: 3,
      staff_id: 1,
      staff_name: 'Ravi Shankar',
      leave_type: 'Earned Leave',
      start_date: '2026-11-02',
      end_date: '2026-11-05',
      reason: 'Diwali festive holiday travel',
      status: 'Approved',
    },
  ];
}

export function getDemoSalaries(staffList: Staff[]): StaffSalaryRecord[] {
  return staffList.map((s, idx) => {
    const jobs = s.jobs_completed || [142, 188, 96, 210, 84, 75][idx % 6];
    const incentivePerJob = s.role === 'detailer' ? 150 : s.role === 'supervisor' ? 80 : 100;
    const totalIncentive = jobs * incentivePerJob;
    const base = s.salary || [18000, 18000, 22000, 26000, 22000, 15000][idx % 6];

    return {
      id: idx + 1,
      staff_id: s.id,
      staff_name: s.full_name,
      role: s.role,
      month: 'October 2026',
      base_salary: base,
      jobs_count: jobs,
      incentive_per_job: incentivePerJob,
      total_incentive: totalIncentive,
      total_payout: base + totalIncentive,
      status: idx === 1 ? 'Paid' : 'Processing',
    };
  });
}

export interface DailyAllocationItem {
  id: number;
  booking_number: string;
  customer_name: string;
  phone: string;
  vehicle_number: string;
  vehicle_model: string;
  service_name: string;
  slot_time: string;
  franchise_name: string;
  staff_id: number;
  staff_name: string;
  status: 'In Bay' | 'Dispatched' | 'Scheduled' | 'Completed';
  bay_name: string;
}

export function getDemoDailyAllocations(staffList: Staff[]): DailyAllocationItem[] {
  const onDutyStaff = staffList.filter((s) => s.is_on_duty);
  const getStaff = (idx: number) => onDutyStaff[idx % (onDutyStaff.length || 1)] || staffList[0];

  return [
    {
      id: 1,
      booking_number: 'SS-BK-8821',
      customer_name: 'Rahul Sharma',
      phone: '+91 98765 12345',
      vehicle_number: 'KA-01-AB-1234',
      vehicle_model: 'Hyundai Creta (Polar White)',
      service_name: 'Full Body Foam Wash',
      slot_time: '10:00 AM - 10:45 AM',
      franchise_name: 'Koramangala Hub',
      staff_id: getStaff(0)?.id || 1,
      staff_name: getStaff(0)?.full_name || 'Ravi Shankar',
      status: 'In Bay',
      bay_name: 'Bay 1 (Foam & Wash)',
    },
    {
      id: 2,
      booking_number: 'SS-BK-8822',
      customer_name: 'Priya Patel',
      phone: '+91 98765 23456',
      vehicle_number: 'KA-05-CD-5678',
      vehicle_model: 'BMW 320Ld (Mineral Grey)',
      service_name: 'Interior Deep Clean & Extraction',
      slot_time: '11:00 AM - 12:15 PM',
      franchise_name: 'Indiranagar Hub',
      staff_id: getStaff(1)?.id || 2,
      staff_name: getStaff(1)?.full_name || 'Mohammed Irfan',
      status: 'In Bay',
      bay_name: 'Bay 2 (Steam & Sanitize)',
    },
    {
      id: 3,
      booking_number: 'SS-BK-8823',
      customer_name: 'Vikram Singh',
      phone: '+91 98765 56789',
      vehicle_number: 'KA-02-IJ-7890',
      vehicle_model: 'Skoda Octavia vRS (Race Blue)',
      service_name: '9H Nano-Ceramic 3-Year Shield',
      slot_time: '01:30 PM - 04:00 PM',
      franchise_name: 'Whitefield Hub',
      staff_id: getStaff(2)?.id || 4,
      staff_name: getStaff(2)?.full_name || 'Arun Prasad',
      status: 'Scheduled',
      bay_name: 'Bay 3 (Cleanroom)',
    },
    {
      id: 4,
      booking_number: 'SS-BK-8824',
      customer_name: 'Sneha Reddy',
      phone: '+91 98765 45678',
      vehicle_number: 'KA-01-GH-3456',
      vehicle_model: 'Tata Safari Dark (Oberon Black)',
      service_name: 'Underbody Anti-Rust Blast',
      slot_time: '02:15 PM - 03:00 PM',
      franchise_name: 'HSR Layout Hub',
      staff_id: getStaff(3)?.id || 3,
      staff_name: getStaff(3)?.full_name || 'Suresh Babu',
      status: 'Scheduled',
      bay_name: 'Bay 4 (Final QC)',
    },
    {
      id: 5,
      booking_number: 'SS-BK-8825',
      customer_name: 'Amit Kumar',
      phone: '+91 98765 34567',
      vehicle_number: 'KA-03-EF-9012',
      vehicle_model: 'Volkswagen Polo GT (Flash Red)',
      service_name: 'Headlight Restoration & Polish',
      slot_time: '03:30 PM - 04:15 PM',
      franchise_name: 'Koramangala Hub',
      staff_id: getStaff(0)?.id || 1,
      staff_name: getStaff(0)?.full_name || 'Ravi Shankar',
      status: 'Scheduled',
      bay_name: 'Mobile Van 01',
    },
  ];
}

export function renderStaffPage(state: StaffPageState): string {
  const { staffList, franchises, searchQuery, roleFilter, franchiseFilter, dutyFilter } = state;
  const currentTab = state.activeSubTab || 'directory';

  // Filtering
  const filtered = staffList.filter((s) => {
    const matchesSearch =
      !searchQuery ||
      s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.phone && s.phone.includes(searchQuery));
    const matchesRole = !roleFilter || roleFilter === 'all' || s.role === roleFilter;
    const matchesFranchise =
      !franchiseFilter ||
      franchiseFilter === 'all' ||
      (s.franchise_id && s.franchise_id.toString() === franchiseFilter);
    const matchesDuty =
      !dutyFilter ||
      dutyFilter === 'all' ||
      (dutyFilter === 'on_duty' && s.is_on_duty) ||
      (dutyFilter === 'off_duty' && !s.is_on_duty);

    return matchesSearch && matchesRole && matchesFranchise && matchesDuty;
  });

  const totalStaff = staffList.length;
  const onDutyCount = staffList.filter((s) => s.is_on_duty).length;
  const supervisorsCount = staffList.filter((s) => s.role === 'supervisor').length;
  const avgRating =
    staffList.length > 0
      ? (staffList.reduce((acc, s) => acc + (s.rating || 0), 0) / staffList.length).toFixed(1)
      : '0.0';

  const getFranchiseName = (id?: number) => {
    if (!id) return 'General Pool';
    const f = franchises.find((item) => item.id === id);
    return f ? f.name : `Franchise #${id}`;
  };

  const roleColors: Record<string, string> = {
    supervisor: 'violet',
    detailer: 'blue',
    washer: 'green',
  };

  const attendanceData = getDemoAttendance(staffList);
  const shiftsData = getDemoShifts(staffList);
  const leavesData = getDemoLeaves(staffList);
  const salariesData = getDemoSalaries(staffList);
  const allocationData = getDemoDailyAllocations(staffList);

  return `
    <div class="staff-page animate-fade-in">
      <!-- Top Metrics -->
      <div class="stats-grid mb-6">
        <div class="stat-card">
          <div class="stat-card-icon blue">${icons.users}</div>
          <div class="stat-card-value">${totalStaff}</div>
          <div class="stat-card-label">Total Staff</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon green">${icons.checkCircle}</div>
          <div class="stat-card-value">${onDutyCount} Active</div>
          <div class="stat-card-label">On Duty Now</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon violet">${icons.award}</div>
          <div class="stat-card-value">${supervisorsCount}</div>
          <div class="stat-card-label">Certified Supervisors</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon amber">${icons.starFilled}</div>
          <div class="stat-card-value">${avgRating} &#9733;</div>
          <div class="stat-card-label">Team Avg Rating</div>
        </div>
      </div>

      <!-- Navigation Tabs for Module 3 -->
      <div class="clay-card mb-6">
        <div class="staff-subnav-tabs flex items-center justify-between flex-wrap gap-4 border-b pb-4">
          <div class="flex items-center gap-2 flex-wrap">
            <button class="status-tab ${currentTab === 'directory' ? 'active' : ''}" data-staff-tab="directory">
              ${icons.users} <span>Team Directory</span>
            </button>
            <button class="status-tab ${currentTab === 'attendance' ? 'active' : ''}" data-staff-tab="attendance">
              ${icons.checkCircle} <span>Attendance & Clock-In</span>
            </button>
            <button class="status-tab ${currentTab === 'shifts' ? 'active' : ''}" data-staff-tab="shifts">
              ${icons.clock} <span>Shift Scheduling</span>
            </button>
            <button class="status-tab ${currentTab === 'leaves' ? 'active' : ''}" data-staff-tab="leaves">
              ${icons.calendar} <span>Leave Requests</span>
              <span class="tab-count">1 Pending</span>
            </button>
            <button class="status-tab ${currentTab === 'salaries' ? 'active' : ''}" data-staff-tab="salaries">
              ${icons.revenue} <span>Salary & Wash Incentives</span>
            </button>
            <button class="status-tab ${currentTab === 'allocation' ? 'active' : ''}" data-staff-tab="allocation">
              ${icons.car} <span>Daily Customer Allocation</span>
            </button>
          </div>

          ${
            currentTab === 'directory'
              ? `
            <button class="clay-btn clay-btn-primary" id="btn-open-create-staff">
              ${icons.plus} Register Staff
            </button>
          `
              : ''
          }
        </div>

        ${
          currentTab === 'directory'
            ? `
          <!-- Search & Filter Controls -->
          <div class="bookings-toolbar mt-4">
            <div class="search-box">
              <span class="search-icon">${icons.search}</span>
              <input
                type="text"
                id="staff-search-input"
                class="clay-input"
                placeholder="Search by name, role, email..."
                value="${searchQuery}"
              />
            </div>

            <div class="filter-controls">
              <select id="staff-role-filter" class="clay-select">
                <option value="all" ${roleFilter === 'all' ? 'selected' : ''}>All Roles</option>
                <option value="washer" ${roleFilter === 'washer' ? 'selected' : ''}>Washers</option>
                <option value="detailer" ${roleFilter === 'detailer' ? 'selected' : ''}>Detailers</option>
                <option value="supervisor" ${roleFilter === 'supervisor' ? 'selected' : ''}>Supervisors</option>
              </select>

              <select id="staff-franchise-filter" class="clay-select">
                <option value="all">All Outlets</option>
                ${franchises
                  .map(
                    (f) => `
                  <option value="${f.id}" ${franchiseFilter === f.id.toString() ? 'selected' : ''}>${f.name}</option>
                `
                  )
                  .join('')}
              </select>

              <select id="staff-duty-filter" class="clay-select">
                <option value="all" ${dutyFilter === 'all' ? 'selected' : ''}>All Status</option>
                <option value="on_duty" ${dutyFilter === 'on_duty' ? 'selected' : ''}>On Duty</option>
                <option value="off_duty" ${dutyFilter === 'off_duty' ? 'selected' : ''}>Off Duty</option>
              </select>
            </div>
          </div>

          <!-- Staff Cards Grid -->
          <div class="staff-grid mt-6">
            ${
              filtered.length > 0
                ? filtered
                    .map(
                      (s) => `
              <div class="staff-card clay-card-interactive" data-staff-id="${s.id}">
                <div class="staff-card-header">
                  <div class="staff-avatar ${roleColors[s.role] || 'violet'}">
                    ${s.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div class="staff-meta">
                    <h4>${s.full_name}</h4>
                    <span class="badge badge-${roleColors[s.role] || 'violet'} uppercase">${s.role}</span>
                  </div>
                  <div class="staff-duty-toggle">
                    <span class="duty-dot ${s.is_on_duty ? 'online' : 'offline'}"></span>
                    <small class="text-xs ${s.is_on_duty ? 'text-green' : 'text-muted'}">${s.is_on_duty ? 'On Duty' : 'Off Duty'}</small>
                  </div>
                </div>

                <div class="staff-details mt-4 text-sm">
                  <div class="flex items-center gap-2 text-muted mb-1">
                    ${icons.mapPin} <span>${getFranchiseName(s.franchise_id)}</span>
                  </div>
                  <div class="flex items-center gap-2 text-muted mb-1">
                    ${icons.phone} <span>${s.phone || '+91 98765 20000'}</span>
                  </div>
                </div>

                <div class="staff-stats-strip mt-4">
                  <div class="s-stat">
                    <strong>${s.jobs_completed || 0}</strong>
                    <span>Jobs Done</span>
                  </div>
                  <div class="s-stat">
                    <strong>${s.rating || 4.8} &#9733;</strong>
                    <span>Rating</span>
                  </div>
                  <div class="s-stat">
                    <strong>₹${((s.salary || 18000) / 1000).toFixed(0)}k</strong>
                    <span>Base Pay</span>
                  </div>
                </div>

                <div class="staff-card-footer mt-4 flex items-center justify-between border-t pt-3">
                  <button class="clay-btn clay-btn-sm clay-btn-secondary btn-toggle-duty" data-id="${s.id}">
                    ${s.is_on_duty ? 'Clock Out' : 'Clock In'}
                  </button>
                  <button class="clay-btn clay-btn-sm clay-btn-primary btn-edit-staff" data-id="${s.id}">
                    ${icons.edit} Edit Profile
                  </button>
                </div>
              </div>
            `
                    )
                    .join('')
                : `
              <div class="col-span-full text-center py-12 text-muted empty-state">
                ${icons.users}
                <h3>No staff members found</h3>
                <p>Try clearing your search query or filters.</p>
              </div>
            `
            }
          </div>
        `
            : ''
        }

        ${
          currentTab === 'attendance'
            ? `
          <!-- Attendance Log Table -->
          <div class="clay-table-wrapper mt-4">
            <div class="clay-table-header">
              <h3>Daily Attendance & Duty Register (${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })})</h3>
              <span class="text-green font-bold text-sm">&#10003; 94% Team Punctuality Today</span>
            </div>
            <div class="table-scroll">
              <table class="clay-table">
                <thead>
                  <tr>
                    <th>Staff Name</th>
                    <th>Designation</th>
                    <th>Clock In</th>
                    <th>Clock Out</th>
                    <th>Total Shift</th>
                    <th>Attendance Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${attendanceData
                    .map(
                      (att) => `
                    <tr>
                      <td>
                        <strong>${att.staff_name}</strong>
                      </td>
                      <td>
                        <span class="badge badge-${roleColors[att.role] || 'violet'} uppercase">${att.role}</span>
                      </td>
                      <td>
                        <span class="font-mono text-sm">${att.clock_in}</span>
                      </td>
                      <td>
                        <span class="font-mono text-sm">${att.clock_out || '<span class="text-green">In Progress</span>'}</span>
                      </td>
                      <td>
                        <strong>${att.total_hours} hrs</strong>
                      </td>
                      <td>
                        <span class="badge ${att.status === 'On Duty' ? 'badge-completed' : att.status === 'On Leave' ? 'badge-cancelled' : 'badge-in-progress'}">
                          ${att.status}
                        </span>
                      </td>
                      <td>
                        <button class="clay-btn clay-btn-sm clay-btn-secondary btn-toggle-duty" data-id="${att.staff_id}">
                          ${att.status === 'On Duty' ? 'Clock Out' : 'Clock In'}
                        </button>
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
          currentTab === 'shifts'
            ? `
          <!-- Shift Scheduling Roster -->
          <div class="clay-table-wrapper mt-4">
            <div class="clay-table-header">
              <h3>Weekly Shift Scheduling Roster</h3>
              <span class="text-muted text-sm">Franchise-wise slot coverage management</span>
            </div>
            <div class="table-scroll">
              <table class="clay-table">
                <thead>
                  <tr>
                    <th>Staff Member</th>
                    <th>Role</th>
                    <th>Franchise Hub</th>
                    <th>Assigned Shift & Timings</th>
                    <th>Working Days</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${shiftsData
                    .map(
                      (shift) => `
                    <tr>
                      <td>
                        <strong>${shift.staff_name}</strong>
                      </td>
                      <td>
                        <span class="badge badge-${roleColors[shift.role] || 'violet'} uppercase">${shift.role}</span>
                      </td>
                      <td>
                        <span class="franchise-cell">${icons.mapPin} ${getFranchiseName(shift.franchise_id)}</span>
                      </td>
                      <td>
                        <span class="badge badge-outline font-bold">${shift.shift_name}</span>
                      </td>
                      <td>
                        <span class="text-sm text-muted">${shift.day_of_week}</span>
                      </td>
                      <td>
                        <button class="clay-btn clay-btn-sm clay-btn-ghost text-violet btn-change-shift" data-id="${shift.id}">
                          ${icons.edit} Change Shift
                        </button>
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
          currentTab === 'leaves'
            ? `
          <!-- Leave Requests Table -->
          <div class="clay-table-wrapper mt-4">
            <div class="clay-table-header">
              <h3>Staff Leave Management</h3>
              <span class="text-muted text-sm">Review vacation, sick leave, and casual requests</span>
            </div>
            <div class="table-scroll">
              <table class="clay-table">
                <thead>
                  <tr>
                    <th>Staff Member</th>
                    <th>Leave Category</th>
                    <th>Dates</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${leavesData
                    .map(
                      (lv) => `
                    <tr>
                      <td>
                        <strong>${lv.staff_name}</strong>
                      </td>
                      <td>
                        <span class="badge badge-outline">${lv.leave_type}</span>
                      </td>
                      <td>
                        <span class="text-sm font-mono">${lv.start_date} &rarr; ${lv.end_date}</span>
                      </td>
                      <td style="max-width: 250px;">
                        <span class="text-sm text-muted">${lv.reason}</span>
                      </td>
                      <td>
                        <span class="badge ${lv.status === 'Approved' ? 'badge-completed' : lv.status === 'Rejected' ? 'badge-cancelled' : 'badge-pending'}">
                          ${lv.status}
                        </span>
                      </td>
                      <td>
                        ${
                          lv.status === 'Pending'
                            ? `
                          <div class="table-actions">
                            <button class="clay-btn clay-btn-sm clay-btn-primary btn-approve-leave" data-id="${lv.id}">
                              Approve
                            </button>
                            <button class="clay-btn clay-btn-sm clay-btn-ghost text-danger btn-reject-leave" data-id="${lv.id}">
                              Reject
                            </button>
                          </div>
                        `
                            : `
                          <span class="text-xs text-muted">Processed</span>
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
          currentTab === 'salaries'
            ? `
          <!-- Salary & Wash Incentive Tracking -->
          <div class="clay-table-wrapper mt-4">
            <div class="clay-table-header">
              <h3>Staff Salary & Wash Commission Payouts (October 2026)</h3>
              <span class="text-green font-bold text-sm">Performance Incentive Rate: ₹100 - ₹150 / car completed</span>
            </div>
            <div class="table-scroll">
              <table class="clay-table">
                <thead>
                  <tr>
                    <th>Staff Member</th>
                    <th>Role</th>
                    <th>Base Salary</th>
                    <th>Jobs Done</th>
                    <th>Incentive Rate</th>
                    <th>Bonus Earned</th>
                    <th>Total Payout</th>
                    <th>Disbursement</th>
                  </tr>
                </thead>
                <tbody>
                  ${salariesData
                    .map(
                      (sal) => `
                    <tr>
                      <td>
                        <strong>${sal.staff_name}</strong>
                      </td>
                      <td>
                        <span class="badge badge-${roleColors[sal.role] || 'violet'} uppercase">${sal.role}</span>
                      </td>
                      <td>
                        ₹${sal.base_salary.toLocaleString('en-IN')}
                      </td>
                      <td>
                        <strong class="text-violet">${sal.jobs_count}</strong> cars
                      </td>
                      <td>
                        ₹${sal.incentive_per_job} / job
                      </td>
                      <td class="text-green font-bold">
                        +₹${sal.total_incentive.toLocaleString('en-IN')}
                      </td>
                      <td class="amount-cell">
                        <strong>₹${sal.total_payout.toLocaleString('en-IN')}</strong>
                      </td>
                      <td>
                        <span class="badge ${sal.status === 'Paid' ? 'badge-completed' : 'badge-pending'}">
                          ${sal.status}
                        </span>
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
          <!-- Daily Customer Allocation & Job Dispatch -->
          <div class="allocation-container mt-4 animate-fade-in">
            <!-- Workload Overview Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              ${staffList
                .filter((s) => s.is_on_duty)
                .slice(0, 4)
                .map((st) => {
                  const assignedCount = allocationData.filter((a) => a.staff_id === st.id).length;
                  return `
                  <div class="clay-card p-4 flex items-center justify-between">
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="duty-dot online"></span>
                        <strong class="text-sm">${st.full_name}</strong>
                      </div>
                      <span class="text-xs text-muted uppercase font-mono">${st.role}</span>
                    </div>
                    <div class="text-right">
                      <span class="badge ${assignedCount > 2 ? 'badge-pending' : 'badge-completed'}">${assignedCount} Cars Queue</span>
                    </div>
                  </div>
                `;
                })
                .join('')}
            </div>

            <!-- Allocation Table Header -->
            <div class="clay-table-wrapper">
              <div class="clay-table-header flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3>Daily Customer Allocation & Workload Dispatch</h3>
                  <span class="text-muted text-sm">Assign booked vehicles to on-duty washers, detailers, and mobile vans</span>
                </div>
                <div class="flex items-center gap-2">
                  <button class="clay-btn clay-btn-sm clay-btn-secondary" id="btn-auto-balance-queue">
                    ${icons.sparkle} Auto-Balance Workload
                  </button>
                  <button class="clay-btn clay-btn-sm clay-btn-primary" id="btn-dispatch-all-alerts">
                    ${icons.send} Dispatch All Assignment SMS
                  </button>
                </div>
              </div>

              <div class="table-scroll">
                <table class="clay-table">
                  <thead>
                    <tr>
                      <th>Booking & Customer</th>
                      <th>Vehicle</th>
                      <th>Service Package</th>
                      <th>Scheduled Slot</th>
                      <th>Assigned Hub / Bay</th>
                      <th>Assigned Detailer</th>
                      <th>Dispatch Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${allocationData
                      .map(
                        (job) => `
                      <tr data-allocation-id="${job.id}">
                        <td>
                          <div class="customer-cell">
                            <strong class="customer-name">${job.customer_name}</strong>
                            <span class="customer-sub font-mono">${job.booking_number}</span>
                            <span class="customer-sub">${job.phone}</span>
                          </div>
                        </td>
                        <td>
                          <div class="vehicle-cell">
                            <strong class="vehicle-number">${job.vehicle_number}</strong>
                            <span class="vehicle-info">${job.vehicle_model}</span>
                          </div>
                        </td>
                        <td>
                          <span class="badge badge-outline font-bold">${job.service_name}</span>
                        </td>
                        <td>
                          <span class="font-mono text-sm">${job.slot_time}</span>
                        </td>
                        <td>
                          <div class="franchise-cell">
                            <strong>${job.franchise_name}</strong>
                            <span class="text-xs text-muted">${job.bay_name}</span>
                          </div>
                        </td>
                        <td>
                          <select class="clay-select clay-select-sm staff-reassign-select" data-job-id="${job.id}" style="min-width: 160px; padding: 6px 10px;">
                            ${staffList
                              .filter((s) => s.is_on_duty)
                              .map(
                                (s) => `
                              <option value="${s.id}" ${s.id === job.staff_id ? 'selected' : ''}>
                                ${s.full_name} (${s.role})
                              </option>
                            `
                              )
                              .join('')}
                          </select>
                        </td>
                        <td>
                          <span class="badge ${job.status === 'In Bay' ? 'badge-in-progress' : job.status === 'Dispatched' ? 'badge-confirmed' : 'badge-pending'}">
                            ${job.status}
                          </span>
                        </td>
                        <td>
                          <button class="clay-btn clay-btn-sm clay-btn-ghost text-violet btn-notify-staff-job" data-id="${job.id}" data-name="${job.customer_name}" data-plate="${job.vehicle_number}" title="Send SMS alert to detailer">
                            ${icons.send} Send Alert
                          </button>
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
        `
            : ''
        }
      </div>

      <!-- Modal: Register Staff -->
      ${
        state.isCreateModalOpen
          ? `
        <div class="clay-modal-overlay" id="create-staff-modal">
          <div class="clay-modal-card animate-slide-up">
            <div class="modal-header">
              <div class="modal-title-wrap">
                <div class="modal-icon violet">${icons.staff}</div>
                <div>
                  <h3>Register New Staff Member</h3>
                  <p class="modal-subtitle">Add washer, detailer, or hub supervisor</p>
                </div>
              </div>
              <button class="modal-close" id="btn-close-create-staff">&times;</button>
            </div>

            <form id="create-staff-form" class="modal-form">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Full Name *</label>
                  <input type="text" name="full_name" class="clay-input" required placeholder="e.g. Ramesh Kumar" />
                </div>
                <div class="form-group">
                  <label class="form-label">Phone Number *</label>
                  <input type="tel" name="phone" class="clay-input" required placeholder="+91 98765 00000" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Work Email Address *</label>
                  <input type="email" name="email" class="clay-input" required placeholder="name@speedoshine.com" />
                </div>
                <div class="form-group">
                  <label class="form-label">Role / Designation *</label>
                  <select name="role" class="clay-select" required>
                    <option value="washer">Washer (Exterior / Underbody)</option>
                    <option value="detailer">Detailer (Ceramic / Paint / Steam)</option>
                    <option value="supervisor">Supervisor (QC & Customer Delivery)</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Assigned Franchise Center *</label>
                  <select name="franchise_id" class="clay-select" required>
                    ${franchises.map((f) => `<option value="${f.id}">${f.name}</option>`).join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Monthly Base Salary (₹) *</label>
                  <input type="number" name="salary" class="clay-input" value="18000" required />
                </div>
              </div>

              <div class="modal-actions">
                <button type="button" class="clay-btn clay-btn-secondary" id="btn-cancel-create-staff">Cancel</button>
                <button type="submit" class="clay-btn clay-btn-primary">Register Staff Member</button>
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
