import { icons } from './icons.ts';

export interface SidebarConfig {
  onNavigate: (page: string) => void;
  activePage: string;
  onLogout: () => void;
  userName: string;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: icons.dashboard, section: 'main' },
  { id: 'bookings', label: 'Bookings', icon: icons.bookings, section: 'main', badge: '' },
  { id: 'monitoring', label: 'Live Bay CCTV', icon: icons.video, section: 'main', badge: 'LIVE' },
  { id: 'customers', label: 'Customers', icon: icons.users, section: 'main' },
  { id: 'staff', label: 'Staff & Team', icon: icons.staff, section: 'main' },
  { id: 'franchises', label: 'Franchises', icon: icons.franchise, section: 'main' },
  { id: 'services', label: 'Services', icon: icons.services, section: 'main' },
  { id: 'payments', label: 'Payments', icon: icons.creditCard, section: 'main' },
  { id: 'support', label: 'Support & Tickets', icon: icons.lifeBuoy, section: 'main' },
  { id: 'maps', label: 'Coverage Map', icon: icons.map, section: 'main' },
  { id: 'reviews', label: 'Reviews & Google', icon: icons.reviews, section: 'insights' },
  { id: 'analytics', label: 'Analytics', icon: icons.analytics, section: 'insights' },
  { id: 'notifications', label: 'Notifications', icon: icons.notifications, section: 'insights' },
  { id: 'settings', label: 'Settings & CMS', icon: icons.settings, section: 'system' },
  { id: 'home', label: 'Public Website', icon: icons.globe, section: 'system' },
];

export function renderSidebar(config: SidebarConfig): string {
  const { activePage, userName } = config;
  const initials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const mainLinks = navItems
    .filter(n => n.section === 'main')
    .map(n => `
      <button class="sidebar-link ${activePage === n.id ? 'active' : ''}" data-page="${n.id}" id="nav-${n.id}">
        ${n.icon}
        <span class="sidebar-link-text">${n.label}</span>
        ${n.badge !== undefined && n.badge !== '' ? `<span class="sidebar-badge">${n.badge}</span>` : ''}
      </button>
    `)
    .join('');

  const insightLinks = navItems
    .filter(n => n.section === 'insights')
    .map(n => `
      <button class="sidebar-link ${activePage === n.id ? 'active' : ''}" data-page="${n.id}" id="nav-${n.id}">
        ${n.icon}
        <span class="sidebar-link-text">${n.label}</span>
      </button>
    `)
    .join('');

  const systemLinks = navItems
    .filter(n => n.section === 'system')
    .map(n => `
      <button class="sidebar-link ${activePage === n.id ? 'active' : ''}" data-page="${n.id}" id="nav-${n.id}">
        ${n.icon}
        <span class="sidebar-link-text">${n.label}</span>
      </button>
    `)
    .join('');

  return `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-logo">
        <div class="sidebar-logo-icon">
          ${icons.droplets}
        </div>
        <div class="sidebar-logo-text">
          SpeedoShine
          <span>Admin Panel</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <div class="sidebar-section-title">Menu</div>
        ${mainLinks}

        <div class="sidebar-section-title">Insights</div>
        ${insightLinks}

        <div class="sidebar-section-title">System</div>
        ${systemLinks}
      </nav>

      <div class="sidebar-footer">
        <div class="sidebar-user">
          <div class="sidebar-user-avatar">${initials}</div>
          <div class="sidebar-user-info">
            <div class="sidebar-user-name">${userName}</div>
            <div class="sidebar-user-role">Administrator</div>
          </div>
        </div>
        <button class="sidebar-link" id="sidebar-logout">
          ${icons.logout}
          <span class="sidebar-link-text">Logout</span>
        </button>
      </div>
    </aside>
    <div class="sidebar-overlay" id="sidebar-overlay"></div>
  `;
}

export function attachSidebarEvents(config: SidebarConfig): void {
  // Navigation links
  document.querySelectorAll<HTMLButtonElement>('.sidebar-link[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = btn.dataset.page;
      if (page) {
        config.onNavigate(page);
        // Close mobile sidebar
        document.getElementById('sidebar')?.classList.remove('open');
        document.getElementById('sidebar-overlay')?.classList.remove('active');
      }
    });
  });

  // Logout
  document.getElementById('sidebar-logout')?.addEventListener('click', () => {
    config.onLogout();
  });

  // Mobile overlay close
  document.getElementById('sidebar-overlay')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('sidebar-overlay')?.classList.remove('active');
  });
}
