import { icons } from './icons.ts';

export interface PublicNavbarConfig {
  activePage: string;
  onNavigate: (page: string) => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn?: boolean;
}

export function renderPublicNavbar(config: PublicNavbarConfig): string {
  const { activePage, isAdminLoggedIn } = config;

  const links = [
    { id: 'home', label: 'Home' },
    { id: 'public_services', label: 'Services & Pricing' },
    { id: 'public_booking', label: 'Book Online' },
    { id: 'public_track', label: 'Track Wash' },
    { id: 'public_franchise', label: 'Franchise Partner' },
    { id: 'public_locations', label: 'Hub Locations' },
  ];

  const navLinks = links
    .map(
      (l) => `
    <button class="public-nav-link ${activePage === l.id ? 'active' : ''}" data-public-page="${l.id}">
      ${l.label}
    </button>
  `
    )
    .join('');

  return `
    <header class="public-navbar-wrapper">
      <div class="public-navbar clay-card">
        <!-- Logo -->
        <div class="public-nav-logo" id="public-logo-btn" style="cursor: pointer;">
          <div class="logo-icon-wrap">
            ${icons.sparkle}
          </div>
          <div class="logo-text-wrap">
            <span class="logo-brand">Speedo<span class="text-violet">Shine</span></span>
            <span class="logo-badge">EXPRESS 15-MIN</span>
          </div>
        </div>

        <!-- Desktop Navigation Links -->
        <nav class="public-nav-links">
          ${navLinks}
        </nav>

        <!-- Right CTAs -->
        <div class="public-nav-actions">
          <button class="clay-btn clay-btn-ghost clay-btn-sm" id="btn-goto-admin" title="Access Staff & HQ Admin Command Center">
            ${icons.dashboard}
            <span>${isAdminLoggedIn ? 'Admin Portal' : 'Admin Login'}</span>
          </button>
          
          <button class="clay-btn clay-btn-primary clay-btn-sm" id="btn-nav-book-now">
            ${icons.calendar}
            <span>Book Wash</span>
          </button>
        </div>

        <!-- Mobile Menu Toggle Button -->
        <button class="clay-btn clay-btn-ghost clay-btn-icon public-mobile-toggle" id="btn-public-mobile-menu">
          ${icons.menu}
        </button>
      </div>

      <!-- Mobile Dropdown Menu -->
      <div class="public-mobile-menu" id="public-mobile-dropdown">
        <div class="public-mobile-menu-links">
          ${links
            .map(
              (l) => `
            <button class="public-mobile-link ${activePage === l.id ? 'active' : ''}" data-public-page="${l.id}">
              ${l.label}
            </button>
          `
            )
            .join('')}
          <div class="public-mobile-menu-actions">
            <button class="clay-btn clay-btn-primary w-full" id="btn-mobile-book-now">
              ${icons.calendar} Book Express Wash
            </button>
            <button class="clay-btn clay-btn-secondary w-full" id="btn-mobile-goto-admin">
              ${icons.dashboard} ${isAdminLoggedIn ? 'Open Admin Portal' : 'Admin Login'}
            </button>
          </div>
        </div>
      </div>
    </header>
  `;
}
