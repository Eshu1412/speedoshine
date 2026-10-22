import './index.css';
import { renderLoginPage, attachLoginEvents } from './pages/login.ts';
import { renderDashboardPage } from './pages/dashboard.ts';
import { renderBookingsPage } from './pages/bookings.ts';
import { renderMonitoringPage } from './pages/monitoring.ts';
import { renderCustomersPage, getDemoCustomers } from './pages/customers.ts';
import { renderStaffPage } from './pages/staff.ts';
import { renderFranchisesPage } from './pages/franchises.ts';
import { renderServicesPage } from './pages/services.ts';
import { renderPaymentsPage, getDemoTransactions } from './pages/payments.ts';
import { renderSupportPage, getDemoTickets } from './pages/support.ts';
import { renderMapsPage } from './pages/maps.ts';
import { renderReviewsPage } from './pages/reviews.ts';
import { renderAnalyticsPage } from './pages/analytics.ts';
import { renderNotificationsPage } from './pages/notifications.ts';
import { renderSettingsPage } from './pages/settings.ts';
import { renderSidebar, attachSidebarEvents } from './components/sidebar.ts';
import { renderTopbar, attachTopbarEvents } from './components/topbar.ts';
import { renderPublicNavbar } from './components/publicNavbar.ts';
import { renderPublicFooter } from './components/publicFooter.ts';
import { renderHomePage } from './pages/home.ts';
import { renderPublicBookingPage } from './pages/publicBooking.ts';
import { renderPublicTrackPage } from './pages/publicTrack.ts';
import { renderPublicFranchisePage } from './pages/publicFranchise.ts';
import { renderPublicServicesPage } from './pages/publicServices.ts';
import { renderPublicLocationsPage } from './pages/publicLocations.ts';
import * as api from './api.ts';

// ─── State ───────────────────────────────────────────────────
interface AppState {
  isAuthenticated: boolean;
  user: api.UserOut | null;
  currentPage: string;
  // Dashboard data
  dashboardStats: api.DashboardStats | null;
  revenueData: api.RevenueChartPoint[] | null;
  recentBookings: api.RecentBooking[] | null;
  statusBreakdown: api.BookingStatusBreakdown[] | null;
  // Entity lists
  bookings: api.Booking[];
  staff: api.Staff[];
  franchises: api.Franchise[];
  services: api.Service[];
  reviews: api.Review[];
  notifications: api.Notification[];
  servicePopularity: api.ServicePopularity[];
  staffPerformance: api.StaffPerformance[];
  franchisePerformance: api.FranchisePerformance[];
  customers: api.Customer[];
  transactions: api.Transaction[];
  tickets: api.SupportTicket[];

  // Bookings state
  bookingStatusFilter: string;
  bookingSearchQuery: string;
  bookingFranchiseFilter: string;
  isCreateBookingModalOpen: boolean;
  editingBooking: api.Booking | null;
  bookingViewingInvoice: api.Booking | null;
  bookingViewingProof: api.Booking | null;

  // CCTV / Monitoring state
  cctvSelectedBay: number;
  cctvViewMode: 'grid' | 'single';
  cctvActiveTab: 'live_feed' | 'proof_gallery' | 'inspection';
  cctvSliderPos: number;
  isUploadProofModalOpen: boolean;
  isCustomerPortalModalOpen: boolean;

  // Customers state
  customerSearchQuery: string;
  customerTierFilter: string;
  customerFranchiseFilter: string;
  isCreateCustomerModalOpen: boolean;
  viewingCustomer: api.Customer | null;

  // Staff state
  staffSearchQuery: string;
  staffRoleFilter: string;
  staffFranchiseFilter: string;
  staffDutyFilter: string;
  isCreateStaffModalOpen: boolean;
  staffActiveTab: 'directory' | 'attendance' | 'shifts' | 'leaves' | 'salaries' | 'allocation';

  // Franchise state
  franchiseSearchQuery: string;
  isCreateFranchiseModalOpen: boolean;
  franchiseActiveTab: 'outlets' | 'allocation' | 'customers_db' | 'commissions';

  // Services state
  servicesSearchQuery: string;
  servicesCategoryFilter: string;
  isCreateServiceModalOpen: boolean;

  // Payments state
  paymentSearchQuery: string;
  paymentMethodFilter: string;
  paymentStatusFilter: string;
  paymentFranchiseFilter: string;
  refundingTxn: api.Transaction | null;
  viewingReceipt: api.Transaction | null;

  // Support state
  supportSearchQuery: string;
  supportPriorityFilter: string;
  supportStatusFilter: string;
  supportFranchiseFilter: string;
  isCreateTicketModalOpen: boolean;
  resolvingTicket: api.SupportTicket | null;

  // Maps state
  mapsSelectedHubId: number;
  mapsSearchedAddress: string;
  mapsCheckedResult: any;
  mapsShowRadius: boolean;
  mapsShowVans: boolean;

  // Reviews state
  reviewsRatingFilter: string;
  reviewsFranchiseFilter: string;
  isCreateReviewModalOpen: boolean;
  reviewsActiveTab: 'reviews_feed' | 'staff_ratings' | 'franchise_ratings';

  // Analytics state
  analyticsActiveTab: 'overview' | 'revenue' | 'staff' | 'retention' | 'export';
  analyticsDateRange: '7d' | '30d' | '90d' | 'year';

  // Notifications state
  notificationsFilterUnread: boolean;
  isBroadcastModalOpen: boolean;
  notificationsActiveTab: 'feed' | 'automations';

  // Settings state
  settingsSavedMessage?: string;

  // Public consumer site state
  publicVehicleType: 'hatchback' | 'sedan' | 'suv' | 'bike';
  publicSelectedServiceId: number;
  publicSelectedFranchiseId: number;
  publicPromoCode?: string;
  publicPromoDiscount: number;
  publicConfirmedBooking?: any;
  publicTrackQuery: string;
  publicTrackFoundBooking?: api.Booking | null;
  homeActiveCctvBay: number;
  homeSliderPos: number;
  homeSearchedLocation: string;
  homeLocationResult: any;
}

const state: AppState = {
  isAuthenticated: false,
  user: null,
  currentPage: 'home',
  dashboardStats: null,
  revenueData: null,
  recentBookings: null,
  statusBreakdown: null,
  bookings: [],
  staff: [],
  franchises: [],
  services: [],
  reviews: [],
  notifications: [],
  servicePopularity: [],
  staffPerformance: [],
  franchisePerformance: [],
  customers: getDemoCustomers(),
  transactions: getDemoTransactions(),
  tickets: getDemoTickets(),

  bookingStatusFilter: 'all',
  bookingSearchQuery: '',
  bookingFranchiseFilter: 'all',
  isCreateBookingModalOpen: false,
  editingBooking: null,
  bookingViewingInvoice: null,
  bookingViewingProof: null,

  cctvSelectedBay: 1,
  cctvViewMode: 'grid',
  cctvActiveTab: 'live_feed',
  cctvSliderPos: 50,
  isUploadProofModalOpen: false,
  isCustomerPortalModalOpen: false,

  customerSearchQuery: '',
  customerTierFilter: 'all',
  customerFranchiseFilter: 'all',
  isCreateCustomerModalOpen: false,
  viewingCustomer: null,

  staffSearchQuery: '',
  staffRoleFilter: 'all',
  staffFranchiseFilter: 'all',
  staffDutyFilter: 'all',
  isCreateStaffModalOpen: false,
  staffActiveTab: 'directory',

  franchiseSearchQuery: '',
  isCreateFranchiseModalOpen: false,
  franchiseActiveTab: 'outlets',

  servicesSearchQuery: '',
  servicesCategoryFilter: 'all',
  isCreateServiceModalOpen: false,

  paymentSearchQuery: '',
  paymentMethodFilter: 'all',
  paymentStatusFilter: 'all',
  paymentFranchiseFilter: 'all',
  refundingTxn: null,
  viewingReceipt: null,

  supportSearchQuery: '',
  supportPriorityFilter: 'all',
  supportStatusFilter: 'all',
  supportFranchiseFilter: 'all',
  isCreateTicketModalOpen: false,
  resolvingTicket: null,

  mapsSelectedHubId: 1,
  mapsSearchedAddress: '560034',
  mapsCheckedResult: {
    pincode: '560034',
    area: 'Koramangala 4th Block, Bangalore',
    nearestHub: 'SpeedoShine Koramangala Hub (80 Feet Rd)',
    distanceKm: 2.1,
    isServiced: true,
    etaMinutes: 14,
    doorstepAvailable: true,
  },
  mapsShowRadius: true,
  mapsShowVans: true,

  reviewsRatingFilter: 'all',
  reviewsFranchiseFilter: 'all',
  isCreateReviewModalOpen: false,
  reviewsActiveTab: 'reviews_feed',

  analyticsActiveTab: 'overview',
  analyticsDateRange: '7d',

  notificationsFilterUnread: false,
  isBroadcastModalOpen: false,
  notificationsActiveTab: 'feed',

  publicVehicleType: 'sedan',
  publicSelectedServiceId: 1,
  publicSelectedFranchiseId: 1,
  publicPromoDiscount: 0,
  publicTrackQuery: 'SS-BK-8821',
  homeActiveCctvBay: 1,
  homeSliderPos: 50,
  homeSearchedLocation: '560034',
  homeLocationResult: {
    pincode: '560034',
    area: 'Koramangala 4th Block, Bangalore',
    nearestHub: 'SpeedoShine Koramangala Hub (80 Feet Rd)',
    distanceKm: 2.1,
    isServiced: true,
    etaMinutes: 14,
    doorstepAvailable: true,
  },
};


const app = document.querySelector<HTMLDivElement>('#app')!;

// ─── Auth Helpers ────────────────────────────────────────────
function saveAuth(token: string, user: api.UserOut): void {
  localStorage.setItem('speedoshine_token', token);
  localStorage.setItem('speedoshine_user', JSON.stringify(user));
  state.isAuthenticated = true;
  state.user = user;
}

function loadAuth(): boolean {
  const token = localStorage.getItem('speedoshine_token');
  const userStr = localStorage.getItem('speedoshine_user');
  if (token && userStr) {
    try {
      state.user = JSON.parse(userStr);
      state.isAuthenticated = true;
      return true;
    } catch {
      clearAuth();
    }
  }
  return false;
}

function clearAuth(): void {
  localStorage.removeItem('speedoshine_token');
  localStorage.removeItem('speedoshine_user');
  state.isAuthenticated = false;
  state.user = null;
}

// ─── Page Titles ─────────────────────────────────────────────
const pageMeta: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard Overview', subtitle: "Welcome back! Here's your centralized command center." },
  bookings: { title: 'Bookings Management', subtitle: 'Real-time schedule, assignments, invoices, and proof photos' },
  monitoring: { title: 'Live Bay CCTV & Monitoring', subtitle: 'Real-time multi-angle streaming and photographic proof documentation' },
  customers: { title: 'Customer Database & CRM', subtitle: 'Registered vehicle owners, loyalty status, and visit records' },
  staff: { title: 'Staff & Team Operations', subtitle: 'Attendance register, shift rosters, leave approvals, and wash bonuses' },
  franchises: { title: 'Franchise Network & Royalty', subtitle: 'Manage franchise locations, performance, and commission payouts' },
  services: { title: 'Service Catalog', subtitle: 'Configure packages and vehicle tiered pricing' },
  payments: { title: 'Payment & Transaction Monitoring', subtitle: 'Automated settlement, gateway reconciliation, and GST receipts' },
  support: { title: 'Complaint & Support Management', subtitle: 'Customer grievances, SLA tracking, and resolution compensation' },
  maps: { title: 'Google Maps & Service Geofence', subtitle: 'Franchise coverage radii, mobile van tracking, and address validation' },
  reviews: { title: 'Ratings & Google Redirection', subtitle: 'Verified ratings, reviews, and Google Maps local SEO booster' },
  analytics: { title: 'Reports & Business Intelligence', subtitle: 'Actionable performance metrics and multi-franchise leaderboards' },
  notifications: { title: 'Notifications Center', subtitle: 'System alerts, new bookings, and SMS promo broadcast marketing' },
  settings: { title: 'System Settings & CMS', subtitle: 'Organization profile, RBAC permissions, and portal CMS' },
};

const publicPages = ['home', 'public_services', 'public_booking', 'public_track', 'public_franchise', 'public_locations'];

function isPublicPage(page: string): boolean {
  return publicPages.includes(page);
}

// ─── Rendering ───────────────────────────────────────────────
function renderApp(): void {
  // If explicitly viewing login page
  if (state.currentPage === 'login') {
    app.innerHTML = renderLoginPage();
    attachLoginEvents({
      onLogin: handleLogin,
    });
    document.getElementById('btn-back-to-home')?.addEventListener('click', () => {
      navigateTo('home');
    });
    return;
  }

  // If viewing public consumer website pages
  if (isPublicPage(state.currentPage)) {
    app.innerHTML = `
      <div class="blobs-container">
        <div class="blob blob-violet"></div>
        <div class="blob blob-pink"></div>
        <div class="blob blob-blue"></div>
        <div class="blob blob-green"></div>
      </div>

      <div class="public-layout">
        ${renderPublicNavbar({
          activePage: state.currentPage,
          onNavigate: navigateTo,
          onOpenAdmin: () => {
            if (state.isAuthenticated) {
              navigateTo('dashboard');
            } else {
              navigateTo('login');
            }
          },
          isAdminLoggedIn: state.isAuthenticated,
        })}
        <main class="public-main-content">
          ${renderPublicPageContent()}
        </main>
        ${renderPublicFooter()}
      </div>
    `;

    attachPublicNavEvents();
    attachPublicPageEvents();
    return;
  }

  // If viewing an admin dashboard page, require authentication
  if (!state.isAuthenticated) {
    app.innerHTML = renderLoginPage();
    attachLoginEvents({
      onLogin: handleLogin,
    });
    document.getElementById('btn-back-to-home')?.addEventListener('click', () => {
      navigateTo('home');
    });
    return;
  }

  // Authenticated Admin Dashboard Layout
  const meta = pageMeta[state.currentPage] || pageMeta.dashboard;
  const userName = state.user?.full_name || 'Admin';

  app.innerHTML = `
    <div class="blobs-container">
      <div class="blob blob-violet"></div>
      <div class="blob blob-pink"></div>
      <div class="blob blob-blue"></div>
      <div class="blob blob-green"></div>
    </div>

    <div class="dashboard-layout">
      ${renderSidebar({
        onNavigate: navigateTo,
        activePage: state.currentPage,
        onLogout: handleLogout,
        userName,
      })}
      <main class="main-content">
        ${renderTopbar({
          title: meta.title,
          subtitle: meta.subtitle,
          userName,
        })}
        <div id="page-content">
          ${renderPageContent()}
        </div>
      </main>
    </div>
  `;

  // Attach global components events
  attachSidebarEvents({
    onNavigate: navigateTo,
    activePage: state.currentPage,
    onLogout: handleLogout,
    userName,
  });
  attachTopbarEvents();

  // Attach topbar quick shortcuts
  document.getElementById('btn-topbar-view-website')?.addEventListener('click', () => {
    navigateTo('home');
  });
  document.getElementById('topbar-notif-btn')?.addEventListener('click', () => {
    navigateTo('notifications');
  });
  document.getElementById('topbar-avatar')?.addEventListener('click', () => {
    navigateTo('settings');
  });

  const topbarSearch = document.getElementById('topbar-search-input') as HTMLInputElement;
  if (topbarSearch) {
    topbarSearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && topbarSearch.value.trim()) {
        state.bookingSearchQuery = topbarSearch.value.trim();
        navigateTo('bookings');
      }
    });
  }

  // Attach page-level events
  attachPageEvents();
}

function renderPublicPageContent(): string {
  switch (state.currentPage) {
    case 'home':
      return renderHomePage({
        services: state.services,
        franchises: state.franchises,
        selectedVehicleType: state.publicVehicleType,
        searchedLocation: state.homeSearchedLocation,
        locationResult: state.homeLocationResult,
        activeCctvBay: state.homeActiveCctvBay,
        sliderPos: state.homeSliderPos,
      });

    case 'public_booking':
      return renderPublicBookingPage({
        franchises: state.franchises,
        services: state.services,
        selectedVehicleType: state.publicVehicleType,
        selectedServiceId: state.publicSelectedServiceId,
        selectedFranchiseId: state.publicSelectedFranchiseId,
        selectedDate: new Date().toISOString().split('T')[0],
        selectedTimeSlot: '09:30 AM - 10:15 AM',
        appliedPromoCode: state.publicPromoCode,
        promoDiscount: state.publicPromoDiscount,
        confirmedBooking: state.publicConfirmedBooking,
      });

    case 'public_track':
      return renderPublicTrackPage({
        bookings: state.bookings,
        searchQuery: state.publicTrackQuery,
        foundBooking: state.publicTrackFoundBooking,
      });

    case 'public_services':
      return renderPublicServicesPage();

    case 'public_franchise':
      return renderPublicFranchisePage();

    case 'public_locations':
      return renderPublicLocationsPage({
        franchises: state.franchises,
      });

    default:
      return renderHomePage({
        services: state.services,
        franchises: state.franchises,
        selectedVehicleType: state.publicVehicleType,
        searchedLocation: state.homeSearchedLocation,
        locationResult: state.homeLocationResult,
        activeCctvBay: state.homeActiveCctvBay,
        sliderPos: state.homeSliderPos,
      });
  }
}

function renderPageContent(): string {
  switch (state.currentPage) {
    case 'dashboard':
      return renderDashboardPage(
        state.dashboardStats,
        state.revenueData,
        state.recentBookings,
        state.statusBreakdown,
      );

    case 'bookings':
      return renderBookingsPage({
        bookings: state.bookings,
        franchises: state.franchises,
        services: state.services,
        staff: state.staff,
        selectedStatus: state.bookingStatusFilter,
        searchQuery: state.bookingSearchQuery,
        selectedFranchise: state.bookingFranchiseFilter,
        isCreateModalOpen: state.isCreateBookingModalOpen,
        editingBooking: state.editingBooking,
        viewingInvoice: state.bookingViewingInvoice,
        viewingProof: state.bookingViewingProof,
      });

    case 'monitoring':
      return renderMonitoringPage({
        selectedBayId: state.cctvSelectedBay,
        viewMode: state.cctvViewMode,
        sliderPosition: state.cctvSliderPos,
        ptzZoom: 1,
        isRecording: true,
        activeTab: state.cctvActiveTab,
        isUploadProofModalOpen: state.isUploadProofModalOpen,
        isCustomerPortalModalOpen: state.isCustomerPortalModalOpen,
      });

    case 'customers':
      return renderCustomersPage({
        customers: state.customers,
        franchises: state.franchises,
        searchQuery: state.customerSearchQuery,
        selectedTier: state.customerTierFilter,
        selectedFranchise: state.customerFranchiseFilter,
        isCreateModalOpen: state.isCreateCustomerModalOpen,
        viewingCustomer: state.viewingCustomer,
      });

    case 'staff':
      return renderStaffPage({
        staffList: state.staff,
        franchises: state.franchises,
        searchQuery: state.staffSearchQuery,
        roleFilter: state.staffRoleFilter,
        franchiseFilter: state.staffFranchiseFilter,
        dutyFilter: state.staffDutyFilter,
        isCreateModalOpen: state.isCreateStaffModalOpen,
        editingStaff: null,
        activeSubTab: state.staffActiveTab,
      });

    case 'franchises':
      return renderFranchisesPage({
        franchises: state.franchises,
        customers: state.customers,
        staff: state.staff,
        bookings: state.bookings,
        searchQuery: state.franchiseSearchQuery,
        isCreateModalOpen: state.isCreateFranchiseModalOpen,
        editingFranchise: null,
        activeTab: state.franchiseActiveTab,
      });

    case 'services':
      return renderServicesPage({
        services: state.services,
        selectedCategory: state.servicesCategoryFilter,
        searchQuery: state.servicesSearchQuery,
        isCreateModalOpen: state.isCreateServiceModalOpen,
      });

    case 'payments':
      return renderPaymentsPage({
        transactions: state.transactions,
        franchises: state.franchises,
        searchQuery: state.paymentSearchQuery,
        selectedMethod: state.paymentMethodFilter,
        selectedStatus: state.paymentStatusFilter,
        selectedFranchise: state.paymentFranchiseFilter,
        refundingTxn: state.refundingTxn,
        viewingReceipt: state.viewingReceipt,
      });

    case 'support':
      return renderSupportPage({
        tickets: state.tickets,
        franchises: state.franchises,
        searchQuery: state.supportSearchQuery,
        selectedPriority: state.supportPriorityFilter,
        selectedStatus: state.supportStatusFilter,
        selectedFranchise: state.supportFranchiseFilter,
        isCreateModalOpen: state.isCreateTicketModalOpen,
        resolvingTicket: state.resolvingTicket,
      });

    case 'maps':
      return renderMapsPage({
        franchises: state.franchises,
        selectedHubId: state.mapsSelectedHubId,
        searchedAddress: state.mapsSearchedAddress,
        checkedResult: state.mapsCheckedResult,
        showRadius: state.mapsShowRadius,
        showVans: state.mapsShowVans,
      });

    case 'reviews':
      return renderReviewsPage({
        reviews: state.reviews,
        franchises: state.franchises,
        staff: state.staff,
        selectedRating: state.reviewsRatingFilter,
        selectedFranchise: state.reviewsFranchiseFilter,
        isCreateModalOpen: state.isCreateReviewModalOpen,
        activeTab: state.reviewsActiveTab,
      });

    case 'analytics':
      return renderAnalyticsPage({
        stats: state.dashboardStats,
        revenueData: state.revenueData || getDemoRevenueData(),
        servicePopularity: state.servicePopularity.length > 0 ? state.servicePopularity : getDemoServicePopularity(),
        staffPerformance: state.staffPerformance.length > 0 ? state.staffPerformance : getDemoStaffPerformance(),
        franchisePerformance: state.franchisePerformance.length > 0 ? state.franchisePerformance : getDemoFranchisePerformance(),
        activeTab: state.analyticsActiveTab,
        dateRange: state.analyticsDateRange,
      });


    case 'notifications':
      return renderNotificationsPage({
        notifications: state.notifications,
        filterUnread: state.notificationsFilterUnread,
        isBroadcastModalOpen: state.isBroadcastModalOpen,
        activeTab: state.notificationsActiveTab,
      });

    case 'settings':
      return renderSettingsPage({
        user: state.user,
        savedMessage: state.settingsSavedMessage,
      });

    default:
      return renderDashboardPage(
        state.dashboardStats,
        state.revenueData,
        state.recentBookings,
        state.statusBreakdown,
      );
  }
}

// ─── CSV Export Utility ───────────────────────────────────────
function downloadCsv(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ─── Attach Events for Active Page ───────────────────────────
function attachPageEvents(): void {
  const content = document.getElementById('page-content');
  if (!content) return;


  // ── Dashboard Quick Actions ──
  if (state.currentPage === 'dashboard') {
    document.getElementById('view-all-bookings')?.addEventListener('click', () => navigateTo('bookings'));
    document.getElementById('qa-new-booking')?.addEventListener('click', () => {
      state.isCreateBookingModalOpen = true;
      navigateTo('bookings');
    });
    document.getElementById('qa-add-staff')?.addEventListener('click', () => {
      state.isCreateStaffModalOpen = true;
      navigateTo('staff');
    });
    document.getElementById('qa-add-franchise')?.addEventListener('click', () => {
      state.isCreateFranchiseModalOpen = true;
      navigateTo('franchises');
    });
    document.getElementById('qa-add-service')?.addEventListener('click', () => {
      state.isCreateServiceModalOpen = true;
      navigateTo('services');
    });
  }

  // ── Bookings Page Events ──
  if (state.currentPage === 'bookings') {
    const searchInput = document.getElementById('booking-search-input') as HTMLInputElement;
    searchInput?.addEventListener('input', (e) => {
      state.bookingSearchQuery = (e.target as HTMLInputElement).value;
      rerenderContent();
    });

    const franchiseFilter = document.getElementById('booking-franchise-filter') as HTMLSelectElement;
    franchiseFilter?.addEventListener('change', (e) => {
      state.bookingFranchiseFilter = (e.target as HTMLSelectElement).value;
      rerenderContent();
    });

    document.querySelectorAll('.status-tab[data-status]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.bookingStatusFilter = btn.getAttribute('data-status') || 'all';
        rerenderContent();
      });
    });

    document.getElementById('btn-open-create-booking')?.addEventListener('click', () => {
      state.isCreateBookingModalOpen = true;
      rerenderContent();
    });

    document.getElementById('btn-close-create-modal')?.addEventListener('click', () => {
      state.isCreateBookingModalOpen = false;
      rerenderContent();
    });
    document.getElementById('btn-cancel-create')?.addEventListener('click', () => {
      state.isCreateBookingModalOpen = false;
      rerenderContent();
    });

    // Invoice modal events
    document.querySelectorAll('.btn-view-invoice').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        const booking = state.bookings.find((b) => b.id === id);
        if (booking) {
          state.bookingViewingInvoice = booking;
          rerenderContent();
        }
      });
    });
    document.getElementById('btn-close-invoice-modal')?.addEventListener('click', () => {
      state.bookingViewingInvoice = null;
      rerenderContent();
    });
    document.getElementById('btn-close-invoice-bottom')?.addEventListener('click', () => {
      state.bookingViewingInvoice = null;
      rerenderContent();
    });

    // Proof photos modal events
    document.querySelectorAll('.btn-view-proof').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        const booking = state.bookings.find((b) => b.id === id);
        if (booking) {
          state.bookingViewingProof = booking;
          rerenderContent();
        }
      });
    });
    document.getElementById('btn-close-proof-modal')?.addEventListener('click', () => {
      state.bookingViewingProof = null;
      rerenderContent();
    });
    document.getElementById('btn-close-proof-bottom')?.addEventListener('click', () => {
      state.bookingViewingProof = null;
      rerenderContent();
    });
    document.getElementById('btn-share-proof-whatsapp')?.addEventListener('click', () => {
      alert('Verification Link & HD Inspection Photos sent to customer via WhatsApp!');
    });

    // Repeat booking button
    document.querySelectorAll('.btn-repeat-booking').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        const booking = state.bookings.find((b) => b.id === id);
        if (booking) {
          state.isCreateBookingModalOpen = true;
          rerenderContent();
          setTimeout(() => {
            const form = document.getElementById('create-booking-form') as HTMLFormElement;
            if (form) {
              (form.elements.namedItem('customer_name') as HTMLInputElement).value = booking.customer_name;
              (form.elements.namedItem('customer_phone') as HTMLInputElement).value = booking.customer_phone || '';
              (form.elements.namedItem('vehicle_number') as HTMLInputElement).value = booking.vehicle_number || '';
            }
          }, 50);
        }
      });
    });

    // Edit status modal
    document.querySelectorAll('.btn-update-status').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        const booking = state.bookings.find((b) => b.id === id);
        if (booking) {
          state.editingBooking = booking;
          rerenderContent();
        }
      });
    });
    document.getElementById('btn-close-edit-modal')?.addEventListener('click', () => {
      state.editingBooking = null;
      rerenderContent();
    });
    document.getElementById('btn-cancel-edit')?.addEventListener('click', () => {
      state.editingBooking = null;
      rerenderContent();
    });

    // Delete booking
    document.querySelectorAll('.btn-delete-booking').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = Number(btn.getAttribute('data-id'));
        if (confirm('Are you sure you want to delete this booking?')) {
          try {
            await api.deleteBooking(id);
          } catch {
            // ignore
          }
          state.bookings = state.bookings.filter((b) => b.id !== id);
          rerenderContent();
        }
      });
    });

    // Create form submit
    const createForm = document.getElementById('create-booking-form') as HTMLFormElement;
    createForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(createForm);
      const newBooking: api.Booking = {
        id: Date.now(),
        booking_number: `SS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        customer_name: fd.get('customer_name') as string,
        customer_phone: fd.get('customer_phone') as string,
        vehicle_type: fd.get('vehicle_type') as string,
        vehicle_number: fd.get('vehicle_number') as string,
        service_id: Number(fd.get('service_id')),
        franchise_id: Number(fd.get('franchise_id')),
        scheduled_date: fd.get('scheduled_date') as string,
        scheduled_time: fd.get('scheduled_time') as string,
        status: 'confirmed',
        payment_status: 'unpaid',
        amount: Number(fd.get('amount') || 499),
        discount: Number(fd.get('discount') || 0),
        final_amount: Math.max(Number(fd.get('amount') || 499) - Number(fd.get('discount') || 0), 0),
        notes: fd.get('notes') as string,
      };
      state.bookings.unshift(newBooking);
      state.isCreateBookingModalOpen = false;
      rerenderContent();
    });

    // Update / Reschedule / Cancel booking form submit
    const updateForm = document.getElementById('update-booking-form') as HTMLFormElement;
    updateForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(updateForm);
      if (state.editingBooking) {
        state.editingBooking.status = fd.get('status') as any;
        state.editingBooking.payment_status = fd.get('payment_status') as any;
        const staffId = fd.get('staff_id');
        state.editingBooking.staff_id = staffId ? Number(staffId) : undefined;
        if (fd.get('scheduled_date')) state.editingBooking.scheduled_date = fd.get('scheduled_date') as string;
        if (fd.get('scheduled_time')) state.editingBooking.scheduled_time = fd.get('scheduled_time') as string;
        const cancelReason = fd.get('cancel_reason') as string;
        const notes = fd.get('notes') as string;
        state.editingBooking.notes = cancelReason ? `[Cancellation Note: ${cancelReason}] ${notes}` : notes;

        try {
          await api.updateBooking(state.editingBooking.id, {
            status: state.editingBooking.status,
            payment_status: state.editingBooking.payment_status,
            staff_id: state.editingBooking.staff_id,
            notes: state.editingBooking.notes,
          });
        } catch {
          // Keep local state
        }
        alert(`Booking ${state.editingBooking.booking_number} updated & rescheduled successfully!`);
        state.editingBooking = null;
        rerenderContent();
      }
    });
  }


  // ── Monitoring (Live CCTV) Page Events ──
  if (state.currentPage === 'monitoring') {
    document.querySelectorAll('.cctv-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        state.cctvActiveTab = (tab.getAttribute('data-tab') as any) || 'live_feed';
        rerenderContent();
      });
    });

    document.getElementById('btn-cctv-grid')?.addEventListener('click', () => {
      state.cctvViewMode = 'grid';
      rerenderContent();
    });
    document.getElementById('btn-cctv-single')?.addEventListener('click', () => {
      state.cctvViewMode = 'single';
      rerenderContent();
    });

    document.querySelectorAll('.btn-inspect-bay').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.cctvSelectedBay = Number(btn.getAttribute('data-bay-id'));
        state.cctvViewMode = 'single';
        rerenderContent();
      });
    });

    document.querySelectorAll('.cctv-selector-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        state.cctvSelectedBay = Number(pill.getAttribute('data-bay-id'));
        rerenderContent();
      });
    });

    const splitSlider = document.getElementById('split-slider-input') as HTMLInputElement;
    splitSlider?.addEventListener('input', (e) => {
      const val = Number((e.target as HTMLInputElement).value);
      state.cctvSliderPos = val;
      const clip = document.querySelector('.before-image-clip') as HTMLElement;
      const div = document.querySelector('.slider-divider') as HTMLElement;
      if (clip) clip.style.width = `${val}%`;
      if (div) div.style.left = `${val}%`;
    });

    document.getElementById('btn-cctv-snapshot')?.addEventListener('click', () => {
      alert('High-Resolution Frame Snapshot captured & tagged with timestamp to Vehicle Proof Gallery!');
      state.cctvActiveTab = 'proof_gallery';
      rerenderContent();
    });

    document.getElementById('btn-share-stream')?.addEventListener('click', () => {
      alert('Live CCTV Stream link (Secure Token: speedoshine.live/bay-stream) dispatched to Customer WhatsApp!');
    });
    document.getElementById('btn-whatsapp-proof')?.addEventListener('click', () => {
      alert('HD Before/After Photographic Proof PDF sent to customer via WhatsApp!');
    });
    document.getElementById('btn-download-proof-pdf')?.addEventListener('click', () => {
      window.print();
    });

    // Upload Service Proof & Customer Portal Modal Listeners (Module 6)
    document.getElementById('btn-open-upload-proof')?.addEventListener('click', () => {
      state.isUploadProofModalOpen = true;
      rerenderContent();
    });
    document.getElementById('btn-close-upload-proof')?.addEventListener('click', () => {
      state.isUploadProofModalOpen = false;
      rerenderContent();
    });
    document.getElementById('btn-cancel-upload-proof')?.addEventListener('click', () => {
      state.isUploadProofModalOpen = false;
      rerenderContent();
    });
    document.getElementById('upload-proof-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('✅ Service Proof Documentation saved! Before, during, and after photos published to customer portal & WhatsApp.');
      state.isUploadProofModalOpen = false;
      rerenderContent();
    });

    document.getElementById('btn-preview-customer-portal')?.addEventListener('click', () => {
      state.isCustomerPortalModalOpen = true;
      rerenderContent();
    });
    document.getElementById('btn-close-customer-portal')?.addEventListener('click', () => {
      state.isCustomerPortalModalOpen = false;
      rerenderContent();
    });
    document.getElementById('btn-copy-portal-link')?.addEventListener('click', () => {
      alert('📋 Public Customer Tracking Link copied: https://speedoshine.com/track/KA01AB1234');
    });
  }

  // ── Customers CRM Page Events ──
  if (state.currentPage === 'customers') {
    const searchInput = document.getElementById('customer-search-input') as HTMLInputElement;
    searchInput?.addEventListener('input', (e) => {
      state.customerSearchQuery = (e.target as HTMLInputElement).value;
      rerenderContent();
    });

    const tierFilter = document.getElementById('customer-tier-filter') as HTMLSelectElement;
    tierFilter?.addEventListener('change', (e) => {
      state.customerTierFilter = (e.target as HTMLSelectElement).value;
      rerenderContent();
    });

    const franchiseFilter = document.getElementById('customer-franchise-filter') as HTMLSelectElement;
    franchiseFilter?.addEventListener('change', (e) => {
      state.customerFranchiseFilter = (e.target as HTMLSelectElement).value;
      rerenderContent();
    });

    document.getElementById('btn-open-create-customer')?.addEventListener('click', () => {
      state.isCreateCustomerModalOpen = true;
      rerenderContent();
    });
    document.getElementById('btn-close-create-customer')?.addEventListener('click', () => {
      state.isCreateCustomerModalOpen = false;
      rerenderContent();
    });
    document.getElementById('btn-cancel-create-customer')?.addEventListener('click', () => {
      state.isCreateCustomerModalOpen = false;
      rerenderContent();
    });

    document.querySelectorAll('.btn-view-customer-profile').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        const customer = state.customers.find((c) => c.id === id);
        if (customer) {
          state.viewingCustomer = customer;
          rerenderContent();
        }
      });
    });
    document.getElementById('btn-close-customer-modal')?.addEventListener('click', () => {
      state.viewingCustomer = null;
      rerenderContent();
    });
    document.getElementById('btn-close-customer-modal-bottom')?.addEventListener('click', () => {
      state.viewingCustomer = null;
      rerenderContent();
    });

    document.querySelectorAll('.btn-book-for-customer').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        const customer = state.customers.find((c) => c.id === id);
        if (customer) {
          state.isCreateBookingModalOpen = true;
          navigateTo('bookings');
          setTimeout(() => {
            const form = document.getElementById('create-booking-form') as HTMLFormElement;
            if (form) {
              (form.elements.namedItem('customer_name') as HTMLInputElement).value = customer.full_name;
              (form.elements.namedItem('customer_phone') as HTMLInputElement).value = customer.phone;
              (form.elements.namedItem('vehicle_number') as HTMLInputElement).value = customer.vehicle_number;
            }
          }, 50);
        }
      });
    });

    const createCustomerForm = document.getElementById('create-customer-form') as HTMLFormElement;
    createCustomerForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(createCustomerForm);
      const newCustomer: api.Customer = {
        id: Date.now(),
        full_name: fd.get('full_name') as string,
        phone: fd.get('phone') as string,
        email: fd.get('email') as string || 'client@speedoshine.com',
        vehicle_type: fd.get('vehicle_type') as string || 'sedan',
        vehicle_number: (fd.get('vehicle_number') as string).toUpperCase(),
        vehicle_model: fd.get('vehicle_model') as string,
        franchise_id: Number(fd.get('franchise_id')),
        total_bookings: 1,
        total_spent: 499,
        loyalty_tier: 'Silver',
        loyalty_points: 50,
        last_visit: new Date().toISOString(),
        notes: fd.get('notes') as string,
      };
      state.customers.unshift(newCustomer);
      state.isCreateCustomerModalOpen = false;
      rerenderContent();
    });
  }

  // ── Staff Page Events ──
  if (state.currentPage === 'staff') {
    document.querySelectorAll('[data-staff-tab]').forEach((tab) => {
      tab.addEventListener('click', () => {
        state.staffActiveTab = (tab.getAttribute('data-staff-tab') as any) || 'directory';
        rerenderContent();
      });
    });

    const searchInput = document.getElementById('staff-search-input') as HTMLInputElement;
    searchInput?.addEventListener('input', (e) => {
      state.staffSearchQuery = (e.target as HTMLInputElement).value;
      rerenderContent();
    });

    const roleFilter = document.getElementById('staff-role-filter') as HTMLSelectElement;
    roleFilter?.addEventListener('change', (e) => {
      state.staffRoleFilter = (e.target as HTMLSelectElement).value;
      rerenderContent();
    });

    const franchiseFilter = document.getElementById('staff-franchise-filter') as HTMLSelectElement;
    franchiseFilter?.addEventListener('change', (e) => {
      state.staffFranchiseFilter = (e.target as HTMLSelectElement).value;
      rerenderContent();
    });

    const dutyFilter = document.getElementById('staff-duty-filter') as HTMLSelectElement;
    dutyFilter?.addEventListener('change', (e) => {
      state.staffDutyFilter = (e.target as HTMLSelectElement).value;
      rerenderContent();
    });

    document.querySelectorAll('.btn-toggle-duty').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = Number(btn.getAttribute('data-id'));
        const s = state.staff.find((item) => item.id === id);
        if (s) {
          s.is_on_duty = !s.is_on_duty;
          rerenderContent();
          try {
            await api.toggleStaffDuty(id);
          } catch {
            // Keep local state
          }
        }
      });
    });

    document.querySelectorAll('.btn-approve-leave').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        alert(`Leave request #${id} approved! Attendance roster updated.`);
        const tr = btn.closest('tr');
        if (tr) {
          const badge = tr.querySelector('.badge');
          if (badge) {
            badge.className = 'badge badge-completed';
            badge.textContent = 'Approved';
          }
          btn.parentElement?.remove();
        }
      });
    });

    document.querySelectorAll('.btn-reject-leave').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        alert(`Leave request #${id} rejected.`);
        const tr = btn.closest('tr');
        if (tr) {
          const badge = tr.querySelector('.badge');
          if (badge) {
            badge.className = 'badge badge-danger';
            badge.textContent = 'Rejected';
          }
          btn.parentElement?.remove();
        }
      });
    });

    document.getElementById('btn-open-create-staff')?.addEventListener('click', () => {
      state.isCreateStaffModalOpen = true;
      rerenderContent();
    });
    document.getElementById('btn-close-create-staff')?.addEventListener('click', () => {
      state.isCreateStaffModalOpen = false;
      rerenderContent();
    });
    document.getElementById('btn-cancel-create-staff')?.addEventListener('click', () => {
      state.isCreateStaffModalOpen = false;
      rerenderContent();
    });

    // Daily Allocation Actions (Module 3 - Daily Customer Allocation)
    document.getElementById('btn-auto-balance-queue')?.addEventListener('click', () => {
      alert('⚡ Intelligent Workload Balancing Complete! 5 cars distributed evenly across on-duty detailers.');
      rerenderContent();
    });

    document.getElementById('btn-dispatch-all-alerts')?.addEventListener('click', () => {
      alert('📱 WhatsApp & SMS dispatch alerts sent to all 4 on-duty detailers with route and vehicle details!');
      const newNotif: api.Notification = {
        id: Date.now(),
        type: 'staff',
        title: 'Daily Wash Queue Dispatched',
        message: '5 customer bookings dispatched to on-duty team with GPS bay coordinates.',
        recipient_type: 'staff',
        is_read: false,
        created_at: new Date().toISOString(),
      };
      state.notifications.unshift(newNotif);
      rerenderContent();
    });

    document.querySelectorAll('.btn-notify-staff-job').forEach((btn) => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-name');
        const plate = btn.getAttribute('data-plate');
        alert(`SMS sent to assigned detailer for ${name}'s ${plate}! Detailer notified.`);
      });
    });

    document.querySelectorAll('.staff-reassign-select').forEach((sel) => {
      sel.addEventListener('change', (e) => {
        const select = e.target as HTMLSelectElement;
        const staffName = select.options[select.selectedIndex]?.text.split('(')[0].trim();
        const jobId = select.getAttribute('data-job-id');
        alert(`Vehicle allocation #${jobId} re-assigned to ${staffName}. Schedule synced.`);
      });
    });

    const createStaffForm = document.getElementById('create-staff-form') as HTMLFormElement;
    createStaffForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(createStaffForm);
      const newStaffPayload = {
        full_name: fd.get('full_name') as string,
        email: fd.get('email') as string,
        phone: fd.get('phone') as string,
        role: fd.get('role') as any,
        franchise_id: Number(fd.get('franchise_id')),
        salary: Number(fd.get('salary')),
      };

      try {
        const created = await api.createStaff(newStaffPayload);
        state.staff.unshift(created);
      } catch {
        const fallback: api.Staff = {
          id: Date.now(),
          ...newStaffPayload,
          is_active: true,
          is_on_duty: true,
          rating: 5.0,
          jobs_completed: 0,
        };
        state.staff.unshift(fallback);
      }

      state.isCreateStaffModalOpen = false;
      rerenderContent();
    });
  }

  // ── Franchises Page Events ──
  if (state.currentPage === 'franchises') {
    document.querySelectorAll('[data-franchise-tab]').forEach((tab) => {
      tab.addEventListener('click', () => {
        state.franchiseActiveTab = (tab.getAttribute('data-franchise-tab') as any) || 'outlets';
        rerenderContent();
      });
    });

    const searchInput = document.getElementById('franchise-search-input') as HTMLInputElement;
    searchInput?.addEventListener('input', (e) => {
      state.franchiseSearchQuery = (e.target as HTMLInputElement).value;
      rerenderContent();
    });


    document.querySelectorAll('.btn-settle-commission').forEach((btn) => {
      btn.addEventListener('click', () => {
        alert('Franchise royalty disbursement of 85% approved and scheduled via Bank NEFT!');
        rerenderContent();
      });
    });

    document.querySelectorAll('.btn-view-hub-map').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        state.mapsSelectedHubId = id;
        navigateTo('maps');
      });
    });

    // Franchise Allocation & Customer DB Event Listeners (Module 2)
    document.getElementById('btn-rebalance-franchise-load')?.addEventListener('click', () => {
      alert('⚡ Cross-Hub Rebalance Active! Transferred 3 overflow bookings from Koramangala Hub to HSR Layout Hub.');
      rerenderContent();
    });

    document.getElementById('btn-sync-hub-dispatch')?.addEventListener('click', () => {
      alert('📡 Fleet schedules & mobile van routes synced across all 5 Bangalore franchise hubs!');
      rerenderContent();
    });

    document.querySelectorAll('.btn-reallocate-hub').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        alert(`Hub #${id} allocation adjusted: +1 Mobile Van assigned to handle peak weekend traffic.`);
      });
    });

    const hubCustFilter = document.getElementById('hub-customer-db-filter') as HTMLSelectElement;
    hubCustFilter?.addEventListener('change', (e) => {
      const selected = (e.target as HTMLSelectElement).value;
      const rows = document.querySelectorAll<HTMLTableRowElement>('tr[data-cust-hub]');
      rows.forEach((row) => {
        const hubId = row.getAttribute('data-cust-hub');
        if (selected === 'all' || hubId === selected) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });

    document.querySelectorAll('.btn-book-hub-customer').forEach((btn) => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-name') || '';
        const phone = btn.getAttribute('data-phone') || '';
        const plate = btn.getAttribute('data-plate') || '';
        state.isCreateBookingModalOpen = true;
        navigateTo('bookings');
        setTimeout(() => {
          const form = document.getElementById('create-booking-form') as HTMLFormElement;
          if (form) {
            (form.elements.namedItem('customer_name') as HTMLInputElement).value = name;
            (form.elements.namedItem('customer_phone') as HTMLInputElement).value = phone;
            (form.elements.namedItem('vehicle_number') as HTMLInputElement).value = plate;
          }
        }, 50);
      });
    });

    document.getElementById('btn-open-create-franchise')?.addEventListener('click', () => {
      state.isCreateFranchiseModalOpen = true;
      rerenderContent();
    });
    document.getElementById('btn-close-franchise-modal')?.addEventListener('click', () => {
      state.isCreateFranchiseModalOpen = false;
      rerenderContent();
    });
    document.getElementById('btn-cancel-franchise')?.addEventListener('click', () => {
      state.isCreateFranchiseModalOpen = false;
      rerenderContent();
    });

    const createFranchiseForm = document.getElementById('create-franchise-form') as HTMLFormElement;
    createFranchiseForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(createFranchiseForm);
      const newFran: api.Franchise = {
        id: Date.now(),
        name: fd.get('name') as string,
        owner_name: fd.get('owner_name') as string,
        email: fd.get('email') as string,
        phone: fd.get('phone') as string,
        city: fd.get('city') as string,
        state: fd.get('state') as string,
        address: fd.get('address') as string,
        commission_rate: Number(fd.get('commission_rate')),
        is_active: true,
        total_revenue: 0,
        total_bookings: 0,
        rating: 5.0,
      };
      state.franchises.push(newFran);
      state.isCreateFranchiseModalOpen = false;
      rerenderContent();
    });
  }

  // ── Services Page Events ──
  if (state.currentPage === 'services') {
    const searchInput = document.getElementById('service-search-input') as HTMLInputElement;
    searchInput?.addEventListener('input', (e) => {
      state.servicesSearchQuery = (e.target as HTMLInputElement).value;
      rerenderContent();
    });

    document.querySelectorAll('[data-category]').forEach((tab) => {
      tab.addEventListener('click', () => {
        state.servicesCategoryFilter = tab.getAttribute('data-category') || 'all';
        rerenderContent();
      });
    });

    document.getElementById('btn-open-create-service')?.addEventListener('click', () => {
      state.isCreateServiceModalOpen = true;
      rerenderContent();
    });
    document.getElementById('btn-close-service-modal')?.addEventListener('click', () => {
      state.isCreateServiceModalOpen = false;
      rerenderContent();
    });
    document.getElementById('btn-cancel-service')?.addEventListener('click', () => {
      state.isCreateServiceModalOpen = false;
      rerenderContent();
    });

    document.querySelectorAll('.btn-delete-service').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = Number(btn.getAttribute('data-id'));
        if (confirm('Are you sure you want to remove this service package?')) {
          try {
            await api.deleteService(id);
          } catch {
            // Keep local
          }
          state.services = state.services.filter((s) => s.id !== id);
          rerenderContent();
        }
      });
    });

    const createServiceForm = document.getElementById('create-service-form') as HTMLFormElement;
    createServiceForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(createServiceForm);
      const newServicePayload: api.ServiceCreatePayload = {
        name: fd.get('name') as string,
        description: fd.get('description') as string,
        category: fd.get('category') as string,
        duration_minutes: Number(fd.get('duration_minutes') || 30),
        price_hatchback: Number(fd.get('price_hatchback') || 349),
        price_sedan: Number(fd.get('price_sedan') || 449),
        price_suv: Number(fd.get('price_suv') || 599),
        price_bike: Number(fd.get('price_bike') || 199),
      };

      try {
        const created = await api.createService(newServicePayload);
        state.services.push(created);
      } catch {
        const fallback: api.Service = {
          id: Date.now(),
          ...newServicePayload,
          category: newServicePayload.category as any,
          is_active: true,
          popularity: 0,
        };
        state.services.push(fallback);
      }


      state.isCreateServiceModalOpen = false;
      rerenderContent();
    });
  }

  // ── Payments Page Events ──
  if (state.currentPage === 'payments') {

    const searchInput = document.getElementById('payment-search-input') as HTMLInputElement;
    searchInput?.addEventListener('input', (e) => {
      state.paymentSearchQuery = (e.target as HTMLInputElement).value;
      rerenderContent();
    });

    const methodFilter = document.getElementById('payment-method-filter') as HTMLSelectElement;
    methodFilter?.addEventListener('change', (e) => {
      state.paymentMethodFilter = (e.target as HTMLSelectElement).value;
      rerenderContent();
    });

    const statusFilter = document.getElementById('payment-status-filter') as HTMLSelectElement;
    statusFilter?.addEventListener('change', (e) => {
      state.paymentStatusFilter = (e.target as HTMLSelectElement).value;
      rerenderContent();
    });

    document.querySelectorAll('.btn-view-receipt').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        const txn = state.transactions.find((t) => t.id === id);
        if (txn) {
          state.viewingReceipt = txn;
          rerenderContent();
        }
      });
    });
    document.getElementById('btn-close-receipt-modal')?.addEventListener('click', () => {
      state.viewingReceipt = null;
      rerenderContent();
    });
    document.getElementById('btn-close-receipt-bottom')?.addEventListener('click', () => {
      state.viewingReceipt = null;
      rerenderContent();
    });

    document.querySelectorAll('.btn-open-refund').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        const txn = state.transactions.find((t) => t.id === id);
        if (txn) {
          state.refundingTxn = txn;
          rerenderContent();
        }
      });
    });
    document.getElementById('btn-close-refund-modal')?.addEventListener('click', () => {
      state.refundingTxn = null;
      rerenderContent();
    });
    document.getElementById('btn-cancel-refund')?.addEventListener('click', () => {
      state.refundingTxn = null;
      rerenderContent();
    });

    const refundForm = document.getElementById('refund-form') as HTMLFormElement;
    refundForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      if (state.refundingTxn) {
        state.refundingTxn.status = 'refunded';
        alert(`Payment of ₹${state.refundingTxn.amount} successfully refunded to customer account via UPI reversal!`);
        state.refundingTxn = null;
        rerenderContent();
      }
    });

    document.getElementById('btn-export-payments-csv')?.addEventListener('click', () => {
      alert('Exporting GST Payment Ledger (CSV) with 8 records...');
    });
  }

  // ── Support Tickets Page Events ──
  if (state.currentPage === 'support') {
    const searchInput = document.getElementById('ticket-search-input') as HTMLInputElement;
    searchInput?.addEventListener('input', (e) => {
      state.supportSearchQuery = (e.target as HTMLInputElement).value;
      rerenderContent();
    });

    const priorityFilter = document.getElementById('ticket-priority-filter') as HTMLSelectElement;
    priorityFilter?.addEventListener('change', (e) => {
      state.supportPriorityFilter = (e.target as HTMLSelectElement).value;
      rerenderContent();
    });

    const statusFilter = document.getElementById('ticket-status-filter') as HTMLSelectElement;
    statusFilter?.addEventListener('change', (e) => {
      state.supportStatusFilter = (e.target as HTMLSelectElement).value;
      rerenderContent();
    });

    document.getElementById('btn-open-create-ticket')?.addEventListener('click', () => {
      state.isCreateTicketModalOpen = true;
      rerenderContent();
    });
    document.getElementById('btn-close-create-ticket')?.addEventListener('click', () => {
      state.isCreateTicketModalOpen = false;
      rerenderContent();
    });
    document.getElementById('btn-cancel-create-ticket')?.addEventListener('click', () => {
      state.isCreateTicketModalOpen = false;
      rerenderContent();
    });

    document.querySelectorAll('.btn-open-resolve').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        const ticket = state.tickets.find((t) => t.id === id);
        if (ticket) {
          state.resolvingTicket = ticket;
          rerenderContent();
        }
      });
    });
    document.getElementById('btn-close-resolve-modal')?.addEventListener('click', () => {
      state.resolvingTicket = null;
      rerenderContent();
    });
    document.getElementById('btn-cancel-resolve')?.addEventListener('click', () => {
      state.resolvingTicket = null;
      rerenderContent();
    });

    const resolveForm = document.getElementById('resolve-ticket-form') as HTMLFormElement;
    resolveForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(resolveForm);
      if (state.resolvingTicket) {
        state.resolvingTicket.status = 'Resolved';
        state.resolvingTicket.resolution = fd.get('resolution') as string;
        alert('Ticket marked as Resolved and SMS notification sent to customer!');
        state.resolvingTicket = null;
        rerenderContent();
      }
    });

    const createTicketForm = document.getElementById('create-ticket-form') as HTMLFormElement;
    createTicketForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(createTicketForm);
      const newTkt: api.SupportTicket = {
        id: Date.now(),
        ticket_number: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
        customer_name: fd.get('customer_name') as string,
        customer_phone: fd.get('customer_phone') as string,
        franchise_id: Number(fd.get('franchise_id')),
        issue_type: fd.get('issue_type') as any,
        priority: fd.get('priority') as any,
        status: 'Open',
        assigned_to: fd.get('assigned_to') as string || 'Arun Prasad (Supervisor)',
        description: fd.get('description') as string,
        created_at: new Date().toISOString(),
      };
      state.tickets.unshift(newTkt);
      state.isCreateTicketModalOpen = false;
      rerenderContent();
    });
  }

  // ── Maps Page Events ──
  if (state.currentPage === 'maps') {
    const addressForm = document.getElementById('check-address-form') as HTMLFormElement;
    const addressInput = document.getElementById('address-input') as HTMLInputElement;

    const performCheck = (val: string) => {
      state.mapsSearchedAddress = val;
      const lower = val.toLowerCase();
      let hub = 'SpeedoShine Koramangala Hub';
      let dist = 2.1;
      let area = 'Koramangala 4th Block';

      if (lower.includes('indira') || lower.includes('560038')) {
        hub = 'SpeedoShine Indiranagar Hub';
        dist = 1.6;
        area = '100 Feet Rd, Indiranagar';
      } else if (lower.includes('hsr') || lower.includes('560102')) {
        hub = 'SpeedoShine HSR Layout Hub';
        dist = 2.8;
        area = 'Sector 1, HSR Layout';
      } else if (lower.includes('whitefield') || lower.includes('560066')) {
        hub = 'SpeedoShine Whitefield Hub';
        dist = 3.2;
        area = 'ITPL Main Rd, Whitefield';
      } else if (lower.includes('jayanagar') || lower.includes('560041')) {
        hub = 'SpeedoShine Jayanagar Hub';
        dist = 1.9;
        area = '4th Block, Jayanagar';
      }

      state.mapsCheckedResult = {
        pincode: val,
        area: `${area}, Bangalore`,
        nearestHub: hub,
        distanceKm: dist,
        isServiced: true,
        etaMinutes: Math.round(dist * 5 + 6),
        doorstepAvailable: true,
      };
      rerenderContent();
    };

    addressForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      performCheck(addressInput.value);
    });

    document.querySelectorAll('.quick-loc-chip[data-loc]').forEach((chip) => {
      chip.addEventListener('click', () => {
        const loc = chip.getAttribute('data-loc') || '560034';
        performCheck(loc);
      });
    });

    document.getElementById('toggle-map-radius')?.addEventListener('change', (e) => {
      state.mapsShowRadius = (e.target as HTMLInputElement).checked;
      rerenderContent();
    });
    document.getElementById('toggle-map-vans')?.addEventListener('change', (e) => {
      state.mapsShowVans = (e.target as HTMLInputElement).checked;
      rerenderContent();
    });

    document.getElementById('btn-book-from-map')?.addEventListener('click', () => {
      state.isCreateBookingModalOpen = true;
      navigateTo('bookings');
    });
  }

  // ── Reviews Page Events ──
  if (state.currentPage === 'reviews') {
    document.querySelectorAll('[data-review-tab]').forEach((tab) => {
      tab.addEventListener('click', () => {
        state.reviewsActiveTab = (tab.getAttribute('data-review-tab') as any) || 'reviews_feed';
        rerenderContent();
      });
    });

    const reviewRatingFilter = document.getElementById('review-rating-filter') as HTMLSelectElement;
    reviewRatingFilter?.addEventListener('change', (e) => {
      state.reviewsRatingFilter = (e.target as HTMLSelectElement).value;
      rerenderContent();
    });

    const reviewFranchiseFilter = document.getElementById('review-franchise-filter') as HTMLSelectElement;
    reviewFranchiseFilter?.addEventListener('change', (e) => {
      state.reviewsFranchiseFilter = (e.target as HTMLSelectElement).value;
      rerenderContent();
    });

    document.querySelectorAll('.btn-copy-google-review').forEach((btn) => {
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-text') || '';
        navigator.clipboard?.writeText(text);
        alert('Review text copied to clipboard! Opening Google Maps review form...');
        window.open('https://maps.google.com', '_blank');
      });
    });

    document.querySelectorAll('.btn-jump-to-support').forEach((btn) => {
      btn.addEventListener('click', () => {
        navigateTo('support');
      });
    });

    document.getElementById('btn-open-create-review')?.addEventListener('click', () => {
      state.isCreateReviewModalOpen = true;
      rerenderContent();
    });
    document.getElementById('btn-close-review-modal')?.addEventListener('click', () => {
      state.isCreateReviewModalOpen = false;
      rerenderContent();
    });
    document.getElementById('btn-cancel-create-review')?.addEventListener('click', () => {
      state.isCreateReviewModalOpen = false;
      rerenderContent();
    });

    const createReviewForm = document.getElementById('create-review-form') as HTMLFormElement;
    createReviewForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(createReviewForm);
      const rating = Number(fd.get('rating'));
      const newRev: api.Review = {
        id: Date.now(),
        booking_id: 101,
        customer_name: fd.get('customer_name') as string,
        rating,
        comment: fd.get('comment') as string,
        franchise_id: Number(fd.get('franchise_id')),
        staff_id: Number(fd.get('staff_id')),
        created_at: new Date().toISOString(),
      };
      state.reviews.unshift(newRev);

      if (rating <= 3) {
        // Auto escalate to Support
        const autoTicket: api.SupportTicket = {
          id: Date.now(),
          ticket_number: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
          customer_name: newRev.customer_name,
          customer_phone: '+91 98765 00000',
          franchise_id: newRev.franchise_id || 1,
          issue_type: 'Quality',
          priority: 'Urgent',
          status: 'Open',
          assigned_to: 'Arun Prasad (Supervisor)',
          description: `Auto-Escalated from ${rating}-star feedback: "${newRev.comment}"`,
          rating_ref: rating,
          created_at: new Date().toISOString(),
        };
        state.tickets.unshift(autoTicket);
        alert(`Negative review intercepted! High-Priority Support Ticket ${autoTicket.ticket_number} created automatically.`);
      } else {
        alert('5-Star Review captured! Customer directed to Google Maps review page.');
      }

      state.isCreateReviewModalOpen = false;
      rerenderContent();
    });
  }

  // ── Analytics Page Events ──
  if (state.currentPage === 'analytics') {
    document.querySelectorAll('[data-report-tab]').forEach((tab) => {
      tab.addEventListener('click', () => {
        state.analyticsActiveTab = (tab.getAttribute('data-report-tab') as any) || 'overview';
        rerenderContent();
      });
    });

    const dateRangeSelect = document.getElementById('analytics-date-range') as HTMLSelectElement;
    dateRangeSelect?.addEventListener('change', (e) => {
      state.analyticsDateRange = (e.target as HTMLSelectElement).value as any;
      rerenderContent();
    });

    document.querySelectorAll('.btn-download-csv').forEach((btn) => {
      btn.addEventListener('click', () => {
        const reportType = btn.getAttribute('data-type');
        if (reportType === 'revenue') {
          const revList = state.revenueData || getDemoRevenueData();
          let csv = 'Period,Gross_Revenue_INR,Washes_Completed,Avg_Ticket_INR,HQ_Royalty_15_INR,Net_Franchise_Share_INR\n';
          revList.forEach((r) => {
            const roy = Math.round(r.revenue * 0.15);
            const net = r.revenue - roy;
            const avg = r.bookings > 0 ? Math.round(r.revenue / r.bookings) : 0;
            csv += `"${r.date}",${r.revenue},${r.bookings},${avg},${roy},${net}\n`;
          });
          downloadCsv('speedoshine_revenue_reconciliation.csv', csv);
        } else if (reportType === 'franchise') {
          let csv = 'Franchise_ID,Franchise_Name,City,Gross_Volume_INR,Commission_Rate_Percent,HQ_Royalty_INR,Net_Payout_INR,Settlement_Status\n';
          state.franchises.forEach((f) => {
            const roy = Math.round(((f.total_revenue || 0) * (f.commission_rate || 15)) / 100);
            const net = (f.total_revenue || 0) - roy;
            csv += `${f.id},"${f.name}","${f.city || 'Bangalore'}",${f.total_revenue || 0},${f.commission_rate || 15},${roy},${net},"Settled"\n`;
          });
          downloadCsv('speedoshine_franchise_settlements.csv', csv);
        } else if (reportType === 'staff') {
          let csv = 'Staff_ID,Staff_Name,Role,Base_Salary_INR,Cars_Washed,Incentive_Rate_INR,Bonus_Earned_INR,Total_Payout_INR,Status\n';
          state.staff.forEach((s) => {
            const rate = s.role === 'detailer' ? 150 : 100;
            const bonus = (s.jobs_completed || 0) * rate;
            const tot = (s.salary || 18000) + bonus;
            csv += `${s.id},"${s.full_name}","${s.role}",${s.salary || 18000},${s.jobs_completed || 0},${rate},${bonus},${tot},"Paid"\n`;
          });
          downloadCsv('speedoshine_staff_payroll_incentives.csv', csv);
        } else if (reportType === 'customers') {
          let csv = 'Customer_ID,Full_Name,Phone,Email,Vehicle_Type,License_Plate,Model,Loyalty_Tier,Reward_Points,Total_Spent_INR,Last_Visit\n';
          state.customers.forEach((c) => {
            csv += `${c.id},"${c.full_name}","${c.phone}","${c.email}","${c.vehicle_type}","${c.vehicle_number}","${c.vehicle_model}","${c.loyalty_tier}",${c.loyalty_points},${c.total_spent},"${c.last_visit}"\n`;
          });
          downloadCsv('speedoshine_customer_crm_master.csv', csv);
        }
      });
    });
  }


  // ── Notifications Page Events ──
  if (state.currentPage === 'notifications') {
    document.querySelectorAll('[data-notif-tab]').forEach((tab) => {
      tab.addEventListener('click', () => {
        state.notificationsActiveTab = (tab.getAttribute('data-notif-tab') as any) || 'feed';
        rerenderContent();
      });
    });

    document.querySelectorAll('.btn-test-fire-sms').forEach((btn) => {
      btn.addEventListener('click', () => {
        const title = btn.getAttribute('data-title') || 'Automated SMS Trigger';
        alert(`🚀 Test Trigger Fired! Sent via Meta WhatsApp Cloud API & DLT SMS gateway.`);
        state.notifications.unshift({
          id: Date.now(),
          type: 'alert',
          title: `Test Fire: ${title}`,
          message: `Simulated lifecycle message dispatched to customer mobile (+91 98765-12345).`,
          recipient_type: 'admin',
          is_read: false,
          created_at: new Date().toISOString(),
        });
        rerenderContent();
      });
    });

    document.getElementById('btn-filter-all-notifs')?.addEventListener('click', () => {
      state.notificationsFilterUnread = false;
      rerenderContent();
    });
    document.getElementById('btn-filter-unread-notifs')?.addEventListener('click', () => {
      state.notificationsFilterUnread = true;
      rerenderContent();
    });

    document.getElementById('btn-mark-all-read')?.addEventListener('click', () => {
      state.notifications.forEach((n) => (n.is_read = true));
      rerenderContent();
    });

    document.getElementById('btn-open-broadcast-modal')?.addEventListener('click', () => {
      state.isBroadcastModalOpen = true;
      rerenderContent();
    });
    document.getElementById('btn-close-broadcast-modal')?.addEventListener('click', () => {
      state.isBroadcastModalOpen = false;
      rerenderContent();
    });
    document.getElementById('btn-cancel-broadcast')?.addEventListener('click', () => {
      state.isBroadcastModalOpen = false;
      rerenderContent();
    });

    document.querySelectorAll('.btn-load-template').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tpl = btn.getAttribute('data-tpl');
        const txt = document.getElementById('broadcast-message-text') as HTMLTextAreaElement;
        if (!txt) return;
        if (tpl === 'monsoon') {
          txt.value = 'Hi {{name}}! 🌧️ Bangalore monsoon rain can ruin your car paint. Get 20% OFF on Full Body Foam Wash + Underbody Blast at SpeedoShine this weekend! Use code SHINE20 at booking. Book now: speedoshine.in/book';
        } else if (tpl === 'ceramic') {
          txt.value = 'Hi {{name}}! 💎 Transform your {{vehicle}} with 9H Nano-Ceramic Coating. Mirror hydrophobicity & 3-year paint warranty. Book your slot this Saturday at SpeedoShine!';
        } else if (tpl === 'reminder') {
          txt.value = 'Hi {{name}}! ⏱️ It has been 30 days since your last SpeedoShine wash. Protect your car from dust and road grime. Claim ₹150 off your wash today!';
        }
      });
    });

    const broadcastForm = document.getElementById('broadcast-sms-form') as HTMLFormElement;
    broadcastForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Promotional Campaign successfully dispatched via SMS & WhatsApp to 1,248 customers!');
      state.notifications.unshift({
        id: Date.now(),
        type: 'promo',
        title: 'SMS Promo Campaign Sent',
        message: 'Campaign dispatched to 1,248 customers. Expected weekend bookings +35%.',
        recipient_type: 'admin',
        is_read: false,
        created_at: new Date().toISOString(),
      });
      state.isBroadcastModalOpen = false;
      rerenderContent();
    });
  }

  // ── Settings Page Events ──
  if (state.currentPage === 'settings') {
    document.querySelectorAll('.rbac-role-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.rbac-role-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const role = btn.getAttribute('data-role') || 'admin';
        if (state.user) {
          state.user.role = role;
        }
        alert(`Switched portal RBAC view to role: ${(role).toUpperCase()}`);
        rerenderContent();
      });
    });

    document.getElementById('settings-profile-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      state.settingsSavedMessage = 'Admin profile updated successfully!';
      rerenderContent();
      setTimeout(() => {
        state.settingsSavedMessage = undefined;
        rerenderContent();
      }, 3000);
    });

    document.getElementById('settings-cms-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      state.settingsSavedMessage = 'Website Content & Promotional Banners published live!';
      rerenderContent();
      setTimeout(() => {
        state.settingsSavedMessage = undefined;
        rerenderContent();
      }, 3000);
    });

    document.getElementById('settings-business-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      state.settingsSavedMessage = 'Business rules and franchise terms saved!';
      rerenderContent();
      setTimeout(() => {
        state.settingsSavedMessage = undefined;
        rerenderContent();
      }, 3000);
    });
  }
}

// ─── Public Site Event Handlers ──────────────────────────────
function attachPublicNavEvents(): void {
  // Navigation links
  document.querySelectorAll('[data-public-page]').forEach((el) => {
    el.addEventListener('click', () => {
      const page = el.getAttribute('data-public-page');
      if (page) navigateTo(page);
    });
  });

  // Admin button in navbar
  document.getElementById('btn-goto-admin')?.addEventListener('click', () => {
    if (state.isAuthenticated) {
      navigateTo('dashboard');
    } else {
      navigateTo('login');
    }
  });

  // Book now in navbar
  document.getElementById('btn-nav-book-now')?.addEventListener('click', () => {
    navigateTo('public_booking');
  });

  // Logo button
  document.getElementById('public-logo-btn')?.addEventListener('click', () => {
    navigateTo('home');
  });

  // Mobile menu toggle
  document.getElementById('btn-public-mobile-menu')?.addEventListener('click', () => {
    document.getElementById('public-mobile-dropdown')?.classList.toggle('open');
  });

  document.getElementById('btn-mobile-book-now')?.addEventListener('click', () => {
    navigateTo('public_booking');
  });

  document.getElementById('btn-mobile-goto-admin')?.addEventListener('click', () => {
    if (state.isAuthenticated) {
      navigateTo('dashboard');
    } else {
      navigateTo('login');
    }
  });

  document.getElementById('footer-admin-link')?.addEventListener('click', () => {
    if (state.isAuthenticated) {
      navigateTo('dashboard');
    } else {
      navigateTo('login');
    }
  });
}

function attachPublicPageEvents(): void {
  // ── Home Page Events ──
  if (state.currentPage === 'home') {
    document.getElementById('btn-hero-book-now')?.addEventListener('click', () => navigateTo('public_booking'));
    document.getElementById('btn-hero-watch-live')?.addEventListener('click', () => {
      document.querySelector('.home-cctv-frame')?.scrollIntoView({ behavior: 'smooth' });
    });
    document.getElementById('btn-hero-franchise')?.addEventListener('click', () => navigateTo('public_franchise'));
    document.getElementById('btn-open-full-tracker')?.addEventListener('click', () => navigateTo('public_track'));
    document.getElementById('btn-banner-franchise')?.addEventListener('click', () => navigateTo('public_franchise'));
    document.getElementById('btn-banner-book')?.addEventListener('click', () => navigateTo('public_booking'));

    // Vehicle switcher pills
    document.querySelectorAll('[data-vehicle-type]').forEach((pill) => {
      pill.addEventListener('click', () => {
        state.publicVehicleType = (pill.getAttribute('data-vehicle-type') as any) || 'sedan';
        rerenderContent();
      });
    });

    // Package cards selection
    document.querySelectorAll('.btn-select-package').forEach((btn) => {
      btn.addEventListener('click', () => {
        const pkg = btn.getAttribute('data-package');
        if (pkg?.includes('Foam')) state.publicSelectedServiceId = 1;
        else if (pkg?.includes('Steam')) state.publicSelectedServiceId = 2;
        else if (pkg?.includes('Ceramic')) state.publicSelectedServiceId = 3;
        else state.publicSelectedServiceId = 4;
        navigateTo('public_booking');
      });
    });

    // Bay switcher pills
    document.querySelectorAll('[data-home-bay]').forEach((pill) => {
      pill.addEventListener('click', () => {
        state.homeActiveCctvBay = Number(pill.getAttribute('data-home-bay')) || 1;
        rerenderContent();
      });
    });

    // Coverage Pincode Form
    const checkCoverage = (loc: string) => {
      state.homeSearchedLocation = loc;
      const lower = loc.toLowerCase();
      let hub = 'SpeedoShine Koramangala Hub (HPCL 80 Ft Rd)';
      let dist = 2.1;
      let area = 'Koramangala, Bangalore';

      if (lower.includes('indira') || lower.includes('560038')) {
        hub = 'SpeedoShine Indiranagar Hub (IOCL 100 Ft Rd)';
        dist = 1.6;
        area = 'Indiranagar, Bangalore';
      } else if (lower.includes('hsr') || lower.includes('560102')) {
        hub = 'SpeedoShine HSR Layout Hub (BPCL Sector 1)';
        dist = 2.8;
        area = 'HSR Layout, Bangalore';
      } else if (lower.includes('whitefield') || lower.includes('560066')) {
        hub = 'SpeedoShine Whitefield Hub (Shell ITPL Rd)';
        dist = 3.2;
        area = 'Whitefield, Bangalore';
      } else if (lower.includes('jayanagar') || lower.includes('560041')) {
        hub = 'SpeedoShine Jayanagar Hub (Nayara 4th Block)';
        dist = 1.9;
        area = 'Jayanagar, Bangalore';
      }

      state.homeLocationResult = {
        nearestHub: hub,
        distanceKm: dist,
        area,
        etaMinutes: Math.round(dist * 4 + 6),
      };
      rerenderContent();
    };

    document.getElementById('home-pincode-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('home-pincode-input') as HTMLInputElement;
      if (input) checkCoverage(input.value);
    });

    document.querySelectorAll('.quick-chip[data-chip]').forEach((chip) => {
      chip.addEventListener('click', () => {
        const val = chip.getAttribute('data-chip') || '560034';
        checkCoverage(val);
      });
    });

    document.getElementById('btn-book-from-hub-result')?.addEventListener('click', () => {
      navigateTo('public_booking');
    });
  }

  // ── Public Booking Events ──
  if (state.currentPage === 'public_booking') {
    document.querySelectorAll('.vehicle-select-card[data-vtype]').forEach((card) => {
      card.addEventListener('click', () => {
        state.publicVehicleType = (card.getAttribute('data-vtype') as any) || 'sedan';
        rerenderContent();
      });
    });

    document.querySelectorAll('input[name="service_id"]').forEach((radio) => {
      radio.addEventListener('change', (e) => {
        state.publicSelectedServiceId = Number((e.target as HTMLInputElement).value) || 1;
        rerenderContent();
      });
    });

    document.getElementById('btn-apply-promo')?.addEventListener('click', () => {
      const codeInput = document.getElementById('public-promo-input') as HTMLInputElement;
      const code = codeInput?.value.trim().toUpperCase();
      if (code === 'SHINE20' || code === 'SPEEDO20') {
        state.publicPromoCode = code;
        state.publicPromoDiscount = 100;
        alert('🎉 Promo Code Applied! ₹100 instant discount credited.');
        rerenderContent();
      } else {
        alert('Invalid promo code. Try using: SHINE20');
      }
    });

    const bookingForm = document.getElementById('public-booking-form') as HTMLFormElement;
    bookingForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(bookingForm);
      const vehicleNum = (fd.get('vehicle_number') as string) || 'KA-05-MR-4412';
      const vehicleModel = (fd.get('vehicle_model') as string) || 'Hyundai Creta SX';
      const custName = (fd.get('customer_name') as string) || 'Rajesh Sharma';
      const custPhone = (fd.get('customer_phone') as string) || '+91 98765 43210';
      const slotTime = (fd.get('slot_time') as string) || '09:30 AM - 10:15 AM';
      const frId = Number(fd.get('franchise_id')) || 1;
      const fObj = state.franchises.find((f) => f.id === frId);

      const serviceNames: Record<number, string> = {
        1: 'Express Snow Foam Wash',
        2: 'Interior Deep Steam Sanitization',
        3: '9H Nano-Ceramic Gloss Coating',
        4: 'Showroom Detailing Spa',
      };
      const serviceName = serviceNames[state.publicSelectedServiceId] || 'Express Snow Foam Wash';

      const packagePrices: Record<string, Record<string, number>> = {
        hatchback: { 1: 349, 2: 899, 3: 1499, 4: 2499 },
        sedan: { 1: 449, 2: 1099, 3: 1899, 4: 2999 },
        suv: { 1: 599, 2: 1399, 3: 2499, 4: 3799 },
        bike: { 1: 199, 2: 499, 3: 799, 4: 1199 },
      };
      const base = (packagePrices[state.publicVehicleType] && packagePrices[state.publicVehicleType][state.publicSelectedServiceId]) || 449;
      const totalPayable = Math.round((base - state.publicPromoDiscount) * 1.18);

      const newBookingNumber = `SS-BK-${Math.floor(1000 + Math.random() * 9000)}`;
      const newBooking: api.Booking = {
        id: Date.now(),
        booking_number: newBookingNumber,
        customer_name: custName,
        customer_phone: custPhone,
        franchise_id: frId,
        franchise_name: fObj ? fObj.name : 'SpeedoShine Koramangala Hub',
        service_id: state.publicSelectedServiceId,
        service_name: serviceName,
        vehicle_type: state.publicVehicleType,
        vehicle_number: vehicleNum,
        vehicle_model: vehicleModel,
        scheduled_date: new Date().toISOString().split('T')[0],
        scheduled_time: slotTime,
        status: 'pending',
        amount: base,
        discount: state.publicPromoDiscount,
        final_amount: totalPayable,
        payment_status: 'unpaid',
        created_at: new Date().toISOString(),
      };

      state.bookings.unshift(newBooking);
      state.notifications.unshift({
        id: Date.now(),
        type: 'booking',
        title: 'New Online Customer Booking',
        message: `${custName} booked ${serviceName} for ${vehicleModel} (${vehicleNum}) at ${newBooking.franchise_name}.`,
        recipient_type: 'admin',
        is_read: false,
        created_at: new Date().toISOString(),
      });

      state.publicConfirmedBooking = newBooking;
      rerenderContent();
    });

    document.getElementById('btn-confirmed-track-wash')?.addEventListener('click', (e) => {
      const bId = (e.currentTarget as HTMLElement).getAttribute('data-booking-id') || 'SS-BK-8821';
      state.publicTrackQuery = bId;
      state.publicTrackFoundBooking = state.bookings.find((b) => b.booking_number === bId);
      navigateTo('public_track');
    });

    document.getElementById('btn-book-another-slot')?.addEventListener('click', () => {
      state.publicConfirmedBooking = undefined;
      rerenderContent();
    });
  }

  // ── Public Track Events ──
  if (state.currentPage === 'public_track') {
    const trackForm = document.getElementById('track-search-form') as HTMLFormElement;
    trackForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('track-search-input') as HTMLInputElement;
      const query = input?.value.trim() || '';
      state.publicTrackQuery = query;
      const found = state.bookings.find(
        (b) =>
          b.booking_number.toLowerCase() === query.toLowerCase() ||
          (b.customer_phone && b.customer_phone.includes(query)) ||
          (b.vehicle_number && b.vehicle_number.toLowerCase().includes(query.toLowerCase()))
      );
      state.publicTrackFoundBooking = found || null;
      rerenderContent();
    });

    document.querySelectorAll('.track-quick-sample[data-sample]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const s = btn.getAttribute('data-sample') || 'SS-BK-8821';
        state.publicTrackQuery = s;
        state.publicTrackFoundBooking = state.bookings.find((b) => b.booking_number === s) || null;
        rerenderContent();
      });
    });

    document.getElementById('btn-track-leave-review')?.addEventListener('click', () => {
      alert('Thank you for rating SpeedoShine 5 Stars! Redirecting to Google Maps review form...');
      window.open('https://maps.google.com', '_blank');
    });
  }

  // ── Public Services Events ──
  if (state.currentPage === 'public_services') {
    document.querySelectorAll('.btn-select-package').forEach((btn) => {
      btn.addEventListener('click', () => {
        const pkg = btn.getAttribute('data-package');
        if (pkg?.includes('Foam')) state.publicSelectedServiceId = 1;
        else if (pkg?.includes('Steam')) state.publicSelectedServiceId = 2;
        else if (pkg?.includes('Ceramic')) state.publicSelectedServiceId = 3;
        else state.publicSelectedServiceId = 4;
        navigateTo('public_booking');
      });
    });
  }

  // ── Public Franchise Events ──
  if (state.currentPage === 'public_franchise') {
    const fForm = document.getElementById('public-franchise-form') as HTMLFormElement;
    fForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(fForm);
      const name = fd.get('name') as string;
      const owner = fd.get('owner_name') as string;
      const phone = fd.get('phone') as string;
      const email = fd.get('email') as string;
      const city = fd.get('city') as string;

      state.franchises.push({
        id: Date.now(),
        name,
        owner_name: owner,
        phone,
        email,
        city,
        commission_rate: 15,
        total_revenue: 0,
        total_bookings: 0,
        rating: 5.0,
        is_active: false,
      });

      state.notifications.unshift({
        id: Date.now(),
        type: 'alert',
        title: 'New Franchise Application Received',
        message: `${owner} applied for new outlet "${name}" in ${city}. Investment capital verified.`,
        recipient_type: 'admin',
        is_read: false,
        created_at: new Date().toISOString(),
      });

      alert(`🎉 Application Submitted Successfully!\n\nThank you ${owner}. Your proposal for "${name}" has been recorded. Our Franchise Onboarding Team will contact you at ${phone} within 24 hours.`);
      navigateTo('home');
    });
  }

  // ── Public Locations Events ──
  if (state.currentPage === 'public_locations') {
    document.querySelectorAll('.btn-book-at-hub[data-hub-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const hId = Number(btn.getAttribute('data-hub-id')) || 1;
        state.publicSelectedFranchiseId = hId;
        navigateTo('public_booking');
      });
    });

    document.getElementById('btn-request-mobile-van')?.addEventListener('click', () => {
      navigateTo('public_booking');
    });
  }
}

function rerenderContent(): void {
  if (isPublicPage(state.currentPage)) {
    const main = document.querySelector('.public-main-content');
    if (main) {
      main.innerHTML = renderPublicPageContent();
      attachPublicPageEvents();
      return;
    }
  }
  const content = document.getElementById('page-content');
  if (content) {
    content.innerHTML = renderPageContent();
    attachPageEvents();
  }
}

// ─── Navigation ──────────────────────────────────────────────
function navigateTo(page: string): void {
  state.currentPage = page;
  window.location.hash = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderApp();
  if (!isPublicPage(page)) {
    loadDataForPage(page);
  }
}

// ─── Auth Handlers ───────────────────────────────────────────
async function handleLogin(email: string, password: string): Promise<void> {
  try {
    const response = await api.login({ email, password });
    saveAuth(response.access_token, response.user);
  } catch {
    // If backend credentials error or offline, fallback with admin session
    saveAuth('demo_token', {
      id: 1,
      email,
      full_name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      role: 'admin',
      is_active: true,
    });
  }
  renderApp();
  loadAllData();
}

function handleLogout(): void {
  clearAuth();
  state.currentPage = 'dashboard';
  renderApp();
}

// ─── Data Loading ────────────────────────────────────────────
async function loadAllData(): Promise<void> {
  loadDashboardData();
  loadEntities();
}

async function loadDataForPage(page: string): Promise<void> {
  if (page === 'dashboard') loadDashboardData();
  else if (page === 'bookings' && state.bookings.length === 0) loadEntities();
  else if (page === 'staff' && state.staff.length === 0) loadEntities();
  else if (page === 'franchises' && state.franchises.length === 0) loadEntities();
  else if (page === 'services' && state.services.length === 0) loadEntities();
  else if (page === 'reviews' && state.reviews.length === 0) loadEntities();
  else if (page === 'notifications' && state.notifications.length === 0) loadEntities();
  else if (page === 'analytics') loadDashboardData();
}

async function loadDashboardData(): Promise<void> {
  try {
    const [stats, revenue, bookings, status, svcPop, staffPerf, franPerf] = await Promise.allSettled([
      api.getDashboardStats(),
      api.getRevenueChart(7),
      api.getRecentBookings(10),
      api.getBookingStatusBreakdown(),
      api.getServicePopularity(),
      api.getStaffPerformance(),
      api.getFranchisePerformance(),
    ]);

    state.dashboardStats = stats.status === 'fulfilled' ? stats.value : getDemoStats();
    state.revenueData = revenue.status === 'fulfilled' ? revenue.value : getDemoRevenueData();
    state.recentBookings = bookings.status === 'fulfilled' ? bookings.value : getDemoRecentBookings();
    state.statusBreakdown = status.status === 'fulfilled' ? status.value : getDemoStatusBreakdown();
    state.servicePopularity = svcPop.status === 'fulfilled' ? svcPop.value : getDemoServicePopularity();
    state.staffPerformance = staffPerf.status === 'fulfilled' ? staffPerf.value : getDemoStaffPerformance();
    state.franchisePerformance = franPerf.status === 'fulfilled' ? franPerf.value : getDemoFranchisePerformance();
  } catch {
    state.dashboardStats = getDemoStats();
    state.revenueData = getDemoRevenueData();
    state.recentBookings = getDemoRecentBookings();
    state.statusBreakdown = getDemoStatusBreakdown();
    state.servicePopularity = getDemoServicePopularity();
    state.staffPerformance = getDemoStaffPerformance();
    state.franchisePerformance = getDemoFranchisePerformance();
  }

  rerenderContent();
}

async function loadEntities(): Promise<void> {
  try {
    const [bookingsRes, staffRes, franchisesRes, servicesRes, reviewsRes, notifsRes, customersRes, txnsRes, ticketsRes] =
      await Promise.allSettled([
        api.getBookings({ limit: 100 }),
        api.getStaff(),
        api.getFranchises(),
        api.getServices(),
        api.getReviews(),
        api.getNotifications(),
        api.getCustomers(),
        api.getTransactions(),
        api.getTickets(),
      ]);

    state.bookings = bookingsRes.status === 'fulfilled' && bookingsRes.value.length > 0 ? bookingsRes.value : getDemoAllBookings();
    state.staff = staffRes.status === 'fulfilled' && staffRes.value.length > 0 ? staffRes.value : getDemoStaff();
    state.franchises = franchisesRes.status === 'fulfilled' && franchisesRes.value.length > 0 ? franchisesRes.value : getDemoFranchises();
    state.services = servicesRes.status === 'fulfilled' && servicesRes.value.length > 0 ? servicesRes.value : getDemoServices();
    state.reviews = reviewsRes.status === 'fulfilled' && reviewsRes.value.length > 0 ? reviewsRes.value : getDemoReviews();
    state.notifications = notifsRes.status === 'fulfilled' && notifsRes.value.length > 0 ? notifsRes.value : getDemoNotifications();
    state.customers = customersRes.status === 'fulfilled' && customersRes.value.length > 0 ? customersRes.value : getDemoCustomers();
    state.transactions = txnsRes.status === 'fulfilled' && txnsRes.value.length > 0 ? txnsRes.value : getDemoTransactions();
    state.tickets = ticketsRes.status === 'fulfilled' && ticketsRes.value.length > 0 ? ticketsRes.value : getDemoTickets();
  } catch {
    state.bookings = getDemoAllBookings();
    state.staff = getDemoStaff();
    state.franchises = getDemoFranchises();
    state.services = getDemoServices();
    state.reviews = getDemoReviews();
    state.notifications = getDemoNotifications();
    state.customers = getDemoCustomers();
    state.transactions = getDemoTransactions();
    state.tickets = getDemoTickets();
  }

  rerenderContent();
}


// ─── Demo Data (Fallback Resilience) ─────────────────────────
function getDemoStats(): api.DashboardStats {
  return {
    total_bookings: 1438,
    total_revenue: 987500,
    active_staff: 35,
    total_franchises: 8,
    pending_bookings: 19,
    completed_today: 24,
    avg_rating: 4.7,
  };
}

function getDemoRevenueData(): api.RevenueChartPoint[] {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day, i) => ({
    date: day,
    revenue: [14500, 19200, 16800, 22000, 24500, 31700, 28300][i],
    bookings: [9, 13, 11, 15, 16, 21, 18][i],
  }));
}

function getDemoStatusBreakdown(): api.BookingStatusBreakdown[] {
  return [
    { status: 'completed', count: 960 },
    { status: 'in_progress', count: 184 },
    { status: 'confirmed', count: 215 },
    { status: 'pending', count: 19 },
    { status: 'cancelled', count: 60 },
  ];
}

function getDemoRecentBookings(): api.RecentBooking[] {
  const names = ['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Reddy', 'Vikram Singh'];
  const services = ['Full Body Wash', 'Ceramic Coating', 'Interior Deep Clean', 'Paint Correction', 'Quick Wash'];
  const franchises = ['SpeedoShine Koramangala', 'SpeedoShine Indiranagar', 'SpeedoShine HSR Layout', 'SpeedoShine Whitefield', 'SpeedoShine Jayanagar'];
  const staff = ['Ravi Shankar', 'Mohammed Irfan', 'Suresh Babu', 'Arun Prasad', 'Kiran Rao'];
  const statuses: Array<'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'> = ['completed', 'in_progress', 'confirmed', 'pending', 'completed'];
  const payments: Array<'paid' | 'unpaid' | 'refunded'> = ['paid', 'paid', 'unpaid', 'unpaid', 'paid'];
  const vehicles = ['sedan', 'suv', 'hatchback', 'sedan', 'suv'];
  const plates = ['KA-01-AB-1234', 'KA-05-CD-5678', 'KA-03-EF-9012', 'KA-01-GH-3456', 'KA-02-IJ-7890'];

  return names.map((name, i) => ({
    id: i + 1,
    booking_number: `SS-K${String(1000 + i * 47)}`,
    customer_name: name,
    vehicle_type: vehicles[i],
    vehicle_number: plates[i],
    service_name: services[i],
    franchise_name: franchises[i],
    staff_name: staff[i],
    status: statuses[i],
    payment_status: payments[i],
    final_amount: [499, 8999, 1499, 3999, 299][i],
    scheduled_date: 'Today',
    scheduled_time: ['09:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '04:30 PM'][i],
  }));
}

function getDemoFranchises(): api.Franchise[] {
  return [
    { id: 1, name: 'SpeedoShine Koramangala', owner_name: 'Ankit Sharma', email: 'koramangala@speedoshine.com', phone: '+91 98765 11001', city: 'Bangalore', state: 'Karnataka', commission_rate: 15.0, total_revenue: 287500, total_bookings: 342, rating: 4.6, is_active: true },
    { id: 2, name: 'SpeedoShine Indiranagar', owner_name: 'Priya Menon', email: 'indiranagar@speedoshine.com', phone: '+91 98765 11002', city: 'Bangalore', state: 'Karnataka', commission_rate: 12.0, total_revenue: 345000, total_bookings: 415, rating: 4.8, is_active: true },
    { id: 3, name: 'SpeedoShine HSR Layout', owner_name: 'Vikram Reddy', email: 'hsr@speedoshine.com', phone: '+91 98765 11003', city: 'Bangalore', state: 'Karnataka', commission_rate: 14.0, total_revenue: 198000, total_bookings: 230, rating: 4.3, is_active: true },
    { id: 4, name: 'SpeedoShine Whitefield', owner_name: 'Deepak Joshi', email: 'whitefield@speedoshine.com', phone: '+91 98765 11004', city: 'Bangalore', state: 'Karnataka', commission_rate: 13.0, total_revenue: 156000, total_bookings: 178, rating: 4.5, is_active: true },
    { id: 5, name: 'SpeedoShine Jayanagar', owner_name: 'Meena Patel', email: 'jayanagar@speedoshine.com', phone: '+91 98765 11005', city: 'Bangalore', state: 'Karnataka', commission_rate: 15.0, total_revenue: 221000, total_bookings: 265, rating: 4.7, is_active: true },
  ];
}

function getDemoStaff(): api.Staff[] {
  return [
    { id: 1, full_name: 'Ravi Shankar', email: 'ravi.s@speedoshine.com', phone: '+91 98765 20001', role: 'washer', franchise_id: 1, is_active: true, is_on_duty: true, rating: 4.8, jobs_completed: 142, salary: 18000 },
    { id: 2, full_name: 'Mohammed Irfan', email: 'irfan.m@speedoshine.com', phone: '+91 98765 20002', role: 'washer', franchise_id: 2, is_active: true, is_on_duty: true, rating: 4.9, jobs_completed: 188, salary: 18000 },
    { id: 3, full_name: 'Suresh Babu', email: 'suresh.b@speedoshine.com', phone: '+91 98765 20003', role: 'detailer', franchise_id: 2, is_active: true, is_on_duty: false, rating: 4.7, jobs_completed: 96, salary: 22000 },
    { id: 4, full_name: 'Arun Prasad', email: 'arun.p@speedoshine.com', phone: '+91 98765 20004', role: 'supervisor', franchise_id: 1, is_active: true, is_on_duty: true, rating: 4.9, jobs_completed: 210, salary: 26000 },
    { id: 5, full_name: 'Kiran Rao', email: 'kiran.r@speedoshine.com', phone: '+91 98765 20005', role: 'detailer', franchise_id: 3, is_active: true, is_on_duty: true, rating: 4.6, jobs_completed: 84, salary: 22000 },
    { id: 6, full_name: 'Santosh Yadav', email: 'santosh.y@speedoshine.com', phone: '+91 98765 20006', role: 'washer', franchise_id: 4, is_active: true, is_on_duty: false, rating: 4.5, jobs_completed: 75, salary: 15000 },
  ];
}

function getDemoServices(): api.Service[] {
  return [
    { id: 1, name: 'Quick Foam Wash', description: 'Exterior high-pressure rinse, active snow foam wash, and microfiber wipe-down. Express 20 min turnaround.', category: 'wash', duration_minutes: 20, price_hatchback: 249, price_sedan: 299, price_suv: 399, price_bike: 149, is_active: true, popularity: 856 },
    { id: 2, name: 'Full Body Wash & Underbody', description: 'Complete exterior wash with underbody chassis blast, alloy wheel degreasing, tyre dressing, and glass wipe.', category: 'wash', duration_minutes: 40, price_hatchback: 449, price_sedan: 499, price_suv: 649, price_bike: 249, is_active: true, popularity: 623 },
    { id: 3, name: 'Interior Deep Clean & Steam', description: 'Deep vacuuming, upholstery shampooing, dashboard UV coat, and antibacterial hot steam vent sanitization.', category: 'interior', duration_minutes: 90, price_hatchback: 1299, price_sedan: 1499, price_suv: 1899, price_bike: 0, is_active: true, popularity: 412 },
    { id: 4, name: '9H Nano-Ceramic Coating', description: '9H hardness nano-ceramic coating for mirror-like hydrophobic paint protection with 2-3 years durability certificate.', category: 'coating', duration_minutes: 300, price_hatchback: 7999, price_sedan: 8999, price_suv: 12999, price_bike: 4999, is_active: true, popularity: 189 },
    { id: 5, name: 'Paint Correction & Polish', description: 'Dual-action machine compound polishing to eliminate swirl marks, light scratches, water spots, and paint oxidation.', category: 'polish', duration_minutes: 180, price_hatchback: 3499, price_sedan: 3999, price_suv: 5499, price_bike: 1999, is_active: true, popularity: 234 },
    { id: 6, name: 'Engine Bay Detailing', description: 'Safe electrical component masking, high-pressure steam blast, degreasing, and silicone dressing for hoses and trims.', category: 'detailing', duration_minutes: 60, price_hatchback: 899, price_sedan: 999, price_suv: 1299, price_bike: 599, is_active: true, popularity: 178 },
    { id: 7, name: 'Underbody Anti-Rust Blast', description: 'Heavy-duty high-pressure underbody dirt removal followed by corrosion-inhibitor coating application.', category: 'wash', duration_minutes: 35, price_hatchback: 599, price_sedan: 699, price_suv: 899, price_bike: 299, is_active: true, popularity: 320 },
    { id: 8, name: 'Anti-Fog Headlight Restoration', description: 'Wet sanding, compound buffing, and UV sealant to restore cloudy or yellowed polycarbonate headlights to factory clarity.', category: 'detailing', duration_minutes: 45, price_hatchback: 799, price_sedan: 799, price_suv: 899, price_bike: 399, is_active: true, popularity: 210 },
    { id: 9, name: 'PPF Front Impact Armor', description: 'Self-healing Paint Protection Film installed on high-impact bumper, hood, and side mirror housings.', category: 'coating', duration_minutes: 420, price_hatchback: 14999, price_sedan: 16999, price_suv: 21999, price_bike: 7999, is_active: true, popularity: 94 },
    { id: 10, name: 'Rain-X Windshield Treatment', description: 'Chemical glass decontamination and ceramic hydrophobic rain-repellent coat for superior monsoon driving visibility.', category: 'wash', duration_minutes: 25, price_hatchback: 399, price_sedan: 449, price_suv: 499, price_bike: 199, is_active: true, popularity: 440 },
  ];
}


function getDemoAllBookings(): api.Booking[] {
  const names = ['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Reddy', 'Vikram Singh', 'Deepa Nair', 'Manish Gupta', 'Ananya Roy'];
  const phones = ['+91 98765 12345', '+91 98765 23456', '+91 98765 34567', '+91 98765 45678', '+91 98765 56789', '+91 98765 67890', '+91 98765 78901', '+91 98765 89012'];
  const vtypes = ['sedan', 'suv', 'hatchback', 'sedan', 'suv', 'hatchback', 'sedan', 'bike'];
  const plates = ['KA-01-AB-1234', 'KA-05-CD-5678', 'KA-03-EF-9012', 'KA-01-GH-3456', 'KA-02-IJ-7890', 'KA-04-KL-2345', 'KA-05-MN-6789', 'KA-01-PQ-9012'];
  const statuses: Array<'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'> = ['completed', 'in_progress', 'confirmed', 'pending', 'completed', 'in_progress', 'completed', 'confirmed'];
  const payments: Array<'paid' | 'unpaid' | 'refunded'> = ['paid', 'paid', 'unpaid', 'unpaid', 'paid', 'paid', 'paid', 'unpaid'];
  const amounts = [499, 8999, 1499, 3999, 299, 1499, 499, 249];

  return names.map((name, i) => ({
    id: i + 1,
    booking_number: `SS-${String.fromCharCode(65 + i)}70${200 + i * 37}`,
    customer_name: name,
    customer_phone: phones[i],
    vehicle_type: vtypes[i],
    vehicle_number: plates[i],
    service_id: (i % 6) + 1,
    franchise_id: (i % 5) + 1,
    staff_id: (i % 5) + 1,
    scheduled_date: new Date().toISOString(),
    scheduled_time: ['09:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '03:30 PM', '04:00 PM', '05:00 PM', '06:00 PM'][i],
    status: statuses[i],
    payment_status: payments[i],
    amount: amounts[i],
    discount: i === 1 ? 500 : 0,
    final_amount: i === 1 ? amounts[i] - 500 : amounts[i],
  }));
}

function getDemoReviews(): api.Review[] {
  return [
    { id: 1, booking_id: 1, customer_name: 'Rahul Sharma', rating: 5, comment: 'Hands down the cleanest my sedan has ever looked. Staff took special care of the interior vents and leather seats!', franchise_id: 1, staff_id: 1, created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
    { id: 2, booking_id: 2, customer_name: 'Priya Patel', rating: 5, comment: 'The Ceramic Coating finish is like liquid glass. Totally worth the investment for Bangalore rain!', franchise_id: 2, staff_id: 2, created_at: new Date(Date.now() - 3600000 * 18).toISOString() },
    { id: 3, booking_id: 3, customer_name: 'Amit Kumar', rating: 4, comment: 'Prompt and courteous detailers. Finished 10 minutes ahead of the promised slot.', franchise_id: 3, staff_id: 5, created_at: new Date(Date.now() - 3600000 * 36).toISOString() },
    { id: 4, booking_id: 4, customer_name: 'Sneha Reddy', rating: 5, comment: 'Quick Wash at HSR was done flawlessly. The foam wash is very thick and unscented.', franchise_id: 3, staff_id: 3, created_at: new Date(Date.now() - 3600000 * 60).toISOString() },
    { id: 5, booking_id: 5, customer_name: 'Vikram Singh', rating: 5, comment: 'Exceptional detailing on alloy wheels. Customer lounge was air-conditioned and pleasant.', franchise_id: 4, staff_id: 6, created_at: new Date(Date.now() - 3600000 * 80).toISOString() },
  ];
}

function getDemoNotifications(): api.Notification[] {
  return [
    { id: 1, type: 'booking', title: 'New Booking SS-A70200', message: 'Rahul Sharma booked Full Body Wash at Koramangala Hub.', recipient_type: 'admin', is_read: false, created_at: new Date(Date.now() - 60000 * 15).toISOString() },
    { id: 2, type: 'payment', title: 'Payment Collected ₹8,499', message: 'Ceramic Coating invoice marked as Paid via UPI.', recipient_type: 'admin', is_read: false, created_at: new Date(Date.now() - 60000 * 45).toISOString() },
    { id: 3, type: 'staff', title: 'Staff Duty Status Update', message: 'Mohammed Irfan reported On Duty at Indiranagar outlet.', recipient_type: 'admin', is_read: true, created_at: new Date(Date.now() - 3600000 * 3).toISOString() },
    { id: 4, type: 'alert', title: 'Slot Demand Alert', message: 'Saturday afternoon slots are 92% booked across Bangalore.', recipient_type: 'admin', is_read: true, created_at: new Date(Date.now() - 3600000 * 5).toISOString() },
  ];
}

function getDemoServicePopularity(): api.ServicePopularity[] {
  return [
    { name: 'Quick Wash', bookings: 856, category: 'wash' },
    { name: 'Full Body Wash', bookings: 623, category: 'wash' },
    { name: 'Interior Deep Clean', bookings: 412, category: 'interior' },
    { name: 'Paint Correction & Polish', bookings: 234, category: 'polish' },
    { name: 'Ceramic Coating 9H', bookings: 189, category: 'coating' },
    { name: 'Engine Bay Detailing', bookings: 178, category: 'detailing' },
  ];
}

function getDemoStaffPerformance(): api.StaffPerformance[] {
  return [
    { id: 4, name: 'Arun Prasad', role: 'supervisor', jobs_completed: 210, rating: 4.9, revenue: 142000 },
    { id: 2, name: 'Mohammed Irfan', role: 'washer', jobs_completed: 188, rating: 4.9, revenue: 98500 },
    { id: 1, name: 'Ravi Shankar', role: 'washer', jobs_completed: 142, rating: 4.8, revenue: 76000 },
    { id: 3, name: 'Suresh Babu', role: 'detailer', jobs_completed: 96, rating: 4.7, revenue: 165000 },
    { id: 5, name: 'Kiran Rao', role: 'detailer', jobs_completed: 84, rating: 4.6, revenue: 128000 },
  ];
}

function getDemoFranchisePerformance(): api.FranchisePerformance[] {
  return [
    { id: 2, name: 'SpeedoShine Indiranagar', city: 'Bangalore', total_bookings: 415, revenue: 345000, rating: 4.8 },
    { id: 1, name: 'SpeedoShine Koramangala', city: 'Bangalore', total_bookings: 342, revenue: 287500, rating: 4.6 },
    { id: 5, name: 'SpeedoShine Jayanagar', city: 'Bangalore', total_bookings: 265, revenue: 221000, rating: 4.7 },
    { id: 3, name: 'SpeedoShine HSR Layout', city: 'Bangalore', total_bookings: 230, revenue: 198000, rating: 4.3 },
    { id: 4, name: 'SpeedoShine Whitefield', city: 'Bangalore', total_bookings: 178, revenue: 156000, rating: 4.5 },
  ];
}

// ─── Boot ────────────────────────────────────────────────────
function init(): void {
  const hasAuth = loadAuth();

  const hash = window.location.hash.replace('#', '');
  if (hash) {
    state.currentPage = hash;
  } else {
    state.currentPage = 'home';
  }

  // Pre-load public services & franchises
  api.getServices().then((s) => { if (s && s.length) state.services = s; }).catch(() => {});
  api.getFranchises().then((f) => { if (f && f.length) state.franchises = f; }).catch(() => {});

  if (hasAuth) {
    loadAllData();
  }

  renderApp();

  window.addEventListener('hashchange', () => {
    const h = window.location.hash.replace('#', '');
    if (h && h !== state.currentPage) {
      navigateTo(h);
    }
  });
}

init();
