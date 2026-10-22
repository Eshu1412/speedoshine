import { icons } from './icons.ts';

export interface TopbarConfig {
  title: string;
  subtitle: string;
  userName: string;
}

export function renderTopbar(config: TopbarConfig): string {
  const { title, subtitle, userName } = config;
  const initials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return `
    <header class="topbar">
      <div class="topbar-left">
        <div class="topbar-left-row">
          <button class="clay-btn clay-btn-ghost clay-btn-icon mobile-menu-btn" id="mobile-menu-toggle" aria-label="Toggle menu">
            ${icons.menu}
          </button>
          <div>
            <h1 id="topbar-title">${title}</h1>
            <p id="topbar-subtitle">${subtitle}</p>
          </div>
        </div>
      </div>
      <div class="topbar-right">
        <button class="clay-btn clay-btn-secondary clay-btn-sm" id="btn-topbar-view-website" title="View SpeedoShine Consumer Homepage">
          ${icons.globe}
          <span>View Website</span>
        </button>
        <div class="topbar-search">
          ${icons.search}
          <input type="text" class="clay-input" placeholder="Search bookings, staff..." id="topbar-search-input" />
        </div>
        <button class="notif-btn" id="topbar-notif-btn" aria-label="Notifications">
          ${icons.notifications}
          <span class="notif-dot"></span>
        </button>
        <div class="topbar-avatar" id="topbar-avatar" title="${userName}">
          ${initials}
        </div>
      </div>
    </header>
  `;
}

export function attachTopbarEvents(): void {
  // Mobile menu toggle
  document.getElementById('mobile-menu-toggle')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.toggle('open');
    document.getElementById('sidebar-overlay')?.classList.toggle('active');
  });
}
