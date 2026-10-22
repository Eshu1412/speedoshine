// API client for SpeedoShine backend

const API_BASE = 'http://localhost:8000/api';

function getToken(): string | null {
  return localStorage.getItem('speedoshine_token');
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `HTTP ${res.status}`);
  }

  return res.json();
}

// Auth
export interface LoginPayload {
  email: string;
  password: string;
}

export interface UserOut {
  id: number;
  email: string;
  full_name: string;
  phone: string | null;
  role: string;
  is_active: boolean;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: UserOut;
}

export function login(data: LoginPayload): Promise<TokenResponse> {
  return request<TokenResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getMe(): Promise<UserOut> {
  return request<UserOut>('/auth/me');
}

// Analytics / Dashboard
export interface DashboardStats {
  total_bookings: number;
  total_revenue: number;
  active_staff: number;
  total_franchises: number;
  pending_bookings: number;
  completed_today: number;
  avg_rating: number;
}

export function getDashboardStats(): Promise<DashboardStats> {
  return request<DashboardStats>('/analytics/dashboard');
}

export interface RevenueChartPoint {
  date: string;
  revenue: number;
  bookings: number;
}

export function getRevenueChart(days = 7): Promise<RevenueChartPoint[]> {
  return request<RevenueChartPoint[]>(`/analytics/revenue-chart?days=${days}`);
}

export interface ServicePopularity {
  name: string;
  bookings: number;
  category: string;
}

export function getServicePopularity(): Promise<ServicePopularity[]> {
  return request<ServicePopularity[]>('/analytics/service-popularity');
}

export interface BookingStatusBreakdown {
  status: string;
  count: number;
}

export function getBookingStatusBreakdown(): Promise<BookingStatusBreakdown[]> {
  return request<BookingStatusBreakdown[]>('/analytics/booking-status');
}

export interface RecentBooking {
  id: number;
  booking_number: string;
  customer_name: string;
  vehicle_type: string;
  vehicle_number: string;
  service_name: string;
  franchise_name: string;
  staff_name: string;
  status: string;
  payment_status: string;
  final_amount: number;
  scheduled_date: string;
  scheduled_time: string;
}

export function getRecentBookings(limit = 10): Promise<RecentBooking[]> {
  return request<RecentBooking[]>(`/analytics/recent-bookings?limit=${limit}`);
}

export interface StaffPerformance {
  id: number;
  name: string;
  role: string;
  jobs_completed: number;
  rating: number;
  revenue: number;
}

export function getStaffPerformance(): Promise<StaffPerformance[]> {
  return request<StaffPerformance[]>('/analytics/staff-performance');
}

export interface FranchisePerformance {
  id: number;
  name: string;
  city: string;
  total_bookings: number;
  revenue: number;
  rating: number;
}

export function getFranchisePerformance(): Promise<FranchisePerformance[]> {
  return request<FranchisePerformance[]>('/analytics/franchise-performance');
}

// ─── Bookings ────────────────────────────────────────────────
export interface Booking {
  id: number;
  booking_number: string;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  vehicle_type: string;
  vehicle_number?: string;
  vehicle_model?: string;
  service_id: number;
  service_name?: string;
  franchise_id: number;
  franchise_name?: string;
  staff_id?: number;
  scheduled_date?: string;
  scheduled_time: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  payment_status: 'paid' | 'unpaid' | 'refunded';
  payment_method?: string;
  amount: number;
  discount: number;
  final_amount: number;
  address?: string;
  notes?: string;
  created_at?: string;
}

export interface BookingCreatePayload {
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  vehicle_type: string;
  vehicle_number?: string;
  vehicle_model?: string;
  service_id: number;
  franchise_id: number;
  staff_id?: number;
  scheduled_date: string;
  scheduled_time: string;
  amount: number;
  discount: number;
  address?: string;
  notes?: string;
}

export function getBookings(params: { status?: string; franchise_id?: number; limit?: number; skip?: number } = {}): Promise<Booking[]> {
  const query = new URLSearchParams();
  if (params.status) query.set('status', params.status);
  if (params.franchise_id) query.set('franchise_id', params.franchise_id.toString());
  if (params.limit) query.set('limit', params.limit.toString());
  if (params.skip) query.set('skip', params.skip.toString());
  const qs = query.toString();
  return request<Booking[]>(`/bookings/${qs ? `?${qs}` : ''}`);
}

export function createBooking(data: BookingCreatePayload): Promise<Booking> {
  return request<Booking>('/bookings/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateBooking(id: number, data: Partial<Booking>): Promise<Booking> {
  return request<Booking>(`/bookings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteBooking(id: number): Promise<{ detail: string }> {
  return request<{ detail: string }>(`/bookings/${id}`, {
    method: 'DELETE',
  });
}

// ─── Staff ───────────────────────────────────────────────────
export interface Staff {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  role: 'washer' | 'detailer' | 'supervisor';
  franchise_id?: number;
  is_active: boolean;
  is_on_duty: boolean;
  rating: number;
  jobs_completed: number;
  salary: number;
  joined_date?: string;
  created_at?: string;
}

export interface StaffCreatePayload {
  full_name: string;
  email: string;
  phone?: string;
  role: string;
  franchise_id?: number;
  salary: number;
}

export function getStaff(franchiseId?: number): Promise<Staff[]> {
  const qs = franchiseId ? `?franchise_id=${franchiseId}` : '';
  return request<Staff[]>(`/staff/${qs}`);
}

export function createStaff(data: StaffCreatePayload): Promise<Staff> {
  return request<Staff>('/staff/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateStaff(id: number, data: Partial<Staff>): Promise<Staff> {
  return request<Staff>(`/staff/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteStaff(id: number): Promise<{ detail: string }> {
  return request<{ detail: string }>(`/staff/${id}`, {
    method: 'DELETE',
  });
}

// ─── Franchises ──────────────────────────────────────────────
export interface Franchise {
  id: number;
  name: string;
  owner_name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  commission_rate: number;
  is_active: boolean;
  total_revenue: number;
  total_bookings: number;
  rating: number;
  created_at?: string;
}

export interface FranchiseCreatePayload {
  name: string;
  owner_name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  commission_rate: number;
}

export function getFranchises(): Promise<Franchise[]> {
  return request<Franchise[]>('/franchises/');
}

export function createFranchise(data: FranchiseCreatePayload): Promise<Franchise> {
  return request<Franchise>('/franchises/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateFranchise(id: number, data: Partial<Franchise>): Promise<Franchise> {
  return request<Franchise>(`/franchises/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteFranchise(id: number): Promise<{ detail: string }> {
  return request<{ detail: string }>(`/franchises/${id}`, {
    method: 'DELETE',
  });
}

// ─── Services ────────────────────────────────────────────────
export interface Service {
  id: number;
  name: string;
  description?: string;
  category: 'wash' | 'interior' | 'coating' | 'polish' | 'detailing';
  duration_minutes: number;
  price_sedan: number;
  price_suv: number;
  price_hatchback: number;
  price_bike: number;
  is_active: boolean;
  popularity: number;
  created_at?: string;
}

export interface ServiceCreatePayload {
  name: string;
  description?: string;
  category: string;
  duration_minutes: number;
  price_sedan: number;
  price_suv: number;
  price_hatchback: number;
  price_bike: number;
}

export function getServices(category?: string): Promise<Service[]> {
  const qs = category ? `?category=${category}` : '';
  return request<Service[]>(`/services/${qs}`);
}

export function createService(data: ServiceCreatePayload): Promise<Service> {
  return request<Service>('/services/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateService(id: number, data: Partial<Service>): Promise<Service> {
  return request<Service>(`/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteService(id: number): Promise<{ detail: string }> {
  return request<{ detail: string }>(`/services/${id}`, {
    method: 'DELETE',
  });
}

// ─── Reviews ─────────────────────────────────────────────────
export interface Review {
  id: number;
  booking_id: number;
  customer_name: string;
  rating: number;
  comment?: string;
  staff_id?: number;
  franchise_id?: number;
  created_at?: string;
}

export interface ReviewCreatePayload {
  booking_id: number;
  customer_name: string;
  rating: number;
  comment?: string;
  staff_id?: number;
  franchise_id?: number;
}

export function getReviews(params: { franchise_id?: number; staff_id?: number } = {}): Promise<Review[]> {
  const query = new URLSearchParams();
  if (params.franchise_id) query.set('franchise_id', params.franchise_id.toString());
  if (params.staff_id) query.set('staff_id', params.staff_id.toString());
  const qs = query.toString();
  return request<Review[]>(`/reviews/${qs ? `?${qs}` : ''}`);
}

export function createReview(data: ReviewCreatePayload): Promise<Review> {
  return request<Review>('/reviews/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ─── Notifications ───────────────────────────────────────────
export interface Notification {
  id: number;
  type: 'booking' | 'payment' | 'staff' | 'promo' | 'alert';
  title: string;
  message?: string;
  recipient_type: string;
  is_read: boolean;
  created_at?: string;
}

export function getNotifications(unreadOnly = false): Promise<Notification[]> {
  return request<Notification[]>(`/notifications/?unread_only=${unreadOnly}`);
}

export function markNotificationRead(id: number): Promise<Notification> {
  return request<Notification>(`/notifications/${id}/read`, {
    method: 'PUT',
  });
}

export function markAllNotificationsRead(): Promise<{ detail: string }> {
  return request<{ detail: string }>('/notifications/read-all', {
    method: 'PUT',
  });
}

// ─── Customer CRM (Module 1 & 2) ─────────────────────────────
export interface Customer {
  id: number;
  full_name: string;
  phone: string;
  email: string;
  vehicle_type: string;
  vehicle_number: string;
  vehicle_model: string;
  franchise_id: number;
  total_bookings: number;
  total_spent: number;
  loyalty_tier: 'Silver' | 'Gold' | 'Platinum' | 'Diamond VIP';
  loyalty_points: number;
  last_visit: string;
  notes?: string;
}

// ─── Payments & Transactions (Module 1 & 8) ───────────────────
export interface Transaction {
  id: number;
  txn_number: string;
  booking_number: string;
  customer_name: string;
  customer_phone: string;
  franchise_id: number;
  amount: number;
  tax: number;
  discount: number;
  commission: number;
  net_amount: number;
  payment_method: 'UPI' | 'Card' | 'Cash' | 'NetBanking';
  status: 'success' | 'refunded' | 'pending';
  created_at: string;
}

// ─── Complaints & Support (Module 1 & 9) ──────────────────────
export interface SupportTicket {
  id: number;
  ticket_number: string;
  customer_name: string;
  customer_phone: string;
  issue_type: 'Quality' | 'Delay' | 'Staff Behavior' | 'Vehicle Inspection' | 'Billing';
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved';
  franchise_id: number;
  assigned_to: string;
  description: string;
  resolution?: string;
  rating_ref?: number;
  created_at: string;
}

// ─── CCTV & Service Bay Monitoring (Module 6) ────────────────
export interface CctvBay {
  id: number;
  bay_name: string;
  bay_code: string;
  service_type: string;
  current_car: string;
  vehicle_plate: string;
  detailer_name: string;
  status: 'active' | 'standby' | 'cleaning' | 'maintenance';
  fps: number;
  resolution: string;
  stream_url?: string;
  progress_percent: number;
  stage: string;
  before_img: string;
  during_img: string;
  after_img: string;
}

// ─── Staff HR & Operations (Module 3) ─────────────────────────
export interface StaffAttendance {
  id: number;
  staff_id: number;
  staff_name: string;
  role: string;
  date: string;
  clock_in: string;
  clock_out: string | null;
  status: 'Present' | 'On Duty' | 'Absent' | 'On Leave';
  total_hours: number;
}

export interface StaffShift {
  id: number;
  staff_id: number;
  staff_name: string;
  role: string;
  franchise_id: number;
  shift_name: 'Morning Shift (08:00 - 16:00)' | 'Evening Shift (12:00 - 20:00)' | 'General Shift (09:00 - 18:00)' | 'Night Detailing (16:00 - 23:00)';
  day_of_week: string;
}

export interface StaffLeaveRequest {
  id: number;
  staff_id: number;
  staff_name: string;
  leave_type: 'Sick Leave' | 'Casual Leave' | 'Earned Leave';
  start_date: string;
  end_date: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface StaffSalaryRecord {
  id: number;
  staff_id: number;
  staff_name: string;
  role: string;
  month: string;
  base_salary: number;
  jobs_count: number;
  incentive_per_job: number;
  total_incentive: number;
  total_payout: number;
  status: 'Paid' | 'Processing';
}

// ─── Franchise Commission (Module 2) ─────────────────────────
export interface FranchiseCommission {
  id: number;
  franchise_id: number;
  franchise_name: string;
  month: string;
  gross_revenue: number;
  commission_rate: number;
  royalty_headquarters: number;
  franchise_net_payout: number;
  status: 'Settled' | 'Pending';
  paid_date?: string;
}

// ─── CRM, Transactions & Support API Methods ──────────────────
export function getCustomers(params: { tier?: string; franchise_id?: number; search?: string } = {}): Promise<Customer[]> {
  const query = new URLSearchParams();
  if (params.tier) query.set('tier', params.tier);
  if (params.franchise_id) query.set('franchise_id', params.franchise_id.toString());
  if (params.search) query.set('search', params.search);
  const qs = query.toString();
  return request<Customer[]>(`/customers/${qs ? `?${qs}` : ''}`);
}

export function createCustomer(data: Partial<Customer>): Promise<Customer> {
  return request<Customer>('/customers/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateCustomer(id: number, data: Partial<Customer>): Promise<Customer> {
  return request<Customer>(`/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteCustomer(id: number): Promise<{ detail: string }> {
  return request<{ detail: string }>(`/customers/${id}`, {
    method: 'DELETE',
  });
}

export function getTransactions(params: { method?: string; status?: string; franchise_id?: number } = {}): Promise<Transaction[]> {
  const query = new URLSearchParams();
  if (params.method) query.set('method', params.method);
  if (params.status) query.set('status', params.status);
  if (params.franchise_id) query.set('franchise_id', params.franchise_id.toString());
  const qs = query.toString();
  return request<Transaction[]>(`/payments/${qs ? `?${qs}` : ''}`);
}

export function createTransaction(data: Partial<Transaction>): Promise<Transaction> {
  return request<Transaction>('/payments/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function refundTransaction(id: number): Promise<Transaction> {
  return request<Transaction>(`/payments/${id}/refund`, {
    method: 'PUT',
  });
}

export function getTickets(params: { priority?: string; status?: string; franchise_id?: number } = {}): Promise<SupportTicket[]> {
  const query = new URLSearchParams();
  if (params.priority) query.set('priority', params.priority);
  if (params.status) query.set('status', params.status);
  if (params.franchise_id) query.set('franchise_id', params.franchise_id.toString());
  const qs = query.toString();
  return request<SupportTicket[]>(`/tickets/${qs ? `?${qs}` : ''}`);
}

export function createTicket(data: Partial<SupportTicket>): Promise<SupportTicket> {
  return request<SupportTicket>('/tickets/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateTicket(id: number, data: Partial<SupportTicket>): Promise<SupportTicket> {
  return request<SupportTicket>(`/tickets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function toggleStaffDuty(id: number): Promise<Staff> {
  return request<Staff>(`/staff/${id}/toggle-duty`, {
    method: 'POST',
  });
}



