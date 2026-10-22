import { icons } from './icons.ts';

export function renderPublicFooter(): string {
  return `
    <footer class="public-footer mt-16">
      <div class="public-footer-inner clay-card p-10">
        <div class="footer-grid">
          <!-- Col 1: Brand & Tagline -->
          <div class="footer-brand-col">
            <div class="flex items-center gap-3 mb-4">
              <div class="logo-icon-wrap">
                ${icons.sparkle}
              </div>
              <span class="logo-brand text-2xl font-black">Speedo<span class="text-violet">Shine</span></span>
            </div>
            <p class="text-muted text-sm leading-relaxed mb-4">
              India's fastest express car wash network at fuel stations. German high-pressure foam, zero swirl mark microfiber care, and interior steam sanitation in under 15 minutes while you refuel.
            </p>
            <div class="flex items-center gap-2">
              <span class="badge badge-completed">
                ${icons.checkCircle} 100% Recycled & RO Water
              </span>
              <span class="badge badge-subtle">
                ${icons.shield} 18% GST Invoicing
              </span>
            </div>
          </div>

          <!-- Col 2: Services -->
          <div class="footer-links-col">
            <h4 class="font-bold text-sm uppercase tracking-wider text-charcoal mb-4">Express Wash Menu</h4>
            <ul class="footer-link-list">
              <li><a href="javascript:void(0)" class="footer-link" data-public-page="public_services">Exterior Snow Foam Wash</a></li>
              <li><a href="javascript:void(0)" class="footer-link" data-public-page="public_services">Interior Steam Sanitization</a></li>
              <li><a href="javascript:void(0)" class="footer-link" data-public-page="public_services">9H Nano-Ceramic Coating</a></li>
              <li><a href="javascript:void(0)" class="footer-link" data-public-page="public_services">Underbody Anti-Rust Blast</a></li>
              <li><a href="javascript:void(0)" class="footer-link" data-public-page="public_services">Headlight Restoration Spa</a></li>
            </ul>
          </div>

          <!-- Col 3: Fuel Station Hubs -->
          <div class="footer-links-col">
            <h4 class="font-bold text-sm uppercase tracking-wider text-charcoal mb-4">Bangalore Hubs</h4>
            <ul class="footer-link-list">
              <li><a href="javascript:void(0)" class="footer-link" data-public-page="public_locations">Koramangala 80 Ft Rd (HPCL)</a></li>
              <li><a href="javascript:void(0)" class="footer-link" data-public-page="public_locations">Indiranagar 100 Ft Rd (IOCL)</a></li>
              <li><a href="javascript:void(0)" class="footer-link" data-public-page="public_locations">HSR Layout Sector 1 (BPCL)</a></li>
              <li><a href="javascript:void(0)" class="footer-link" data-public-page="public_locations">Whitefield ITPL Rd (Shell)</a></li>
              <li><a href="javascript:void(0)" class="footer-link" data-public-page="public_locations">Jayanagar 4th Block (Nayara)</a></li>
            </ul>
          </div>

          <!-- Col 4: Franchise & Contact -->
          <div class="footer-contact-col">
            <h4 class="font-bold text-sm uppercase tracking-wider text-charcoal mb-4">Franchise & Support</h4>
            <p class="text-sm text-muted mb-2">
              <strong>HQ Helpline:</strong> +91 80 4910 8800
            </p>
            <p class="text-sm text-muted mb-2">
              <strong>WhatsApp Booking:</strong> +91 98765 43210
            </p>
            <p class="text-sm text-muted mb-4">
              <strong>Support Hours:</strong> Daily 7:00 AM – 10:00 PM
            </p>
            <button class="clay-btn clay-btn-secondary clay-btn-sm w-full" data-public-page="public_franchise">
              ${icons.briefcase} Apply For Franchise
            </button>
          </div>
        </div>

        <div class="footer-bottom mt-8 pt-6 border-t flex items-center justify-between flex-wrap gap-4 text-xs text-muted">
          <div>
            &copy; ${new Date().getFullYear()} SpeedoShine Express Car Care Pvt. Ltd. All rights reserved. GSTIN: 29AABCS1234F1Z8
          </div>
          <div class="flex items-center gap-4">
            <a href="javascript:void(0)" class="hover:underline" data-public-page="public_track">Track My Wash Live</a>
            <span>&bull;</span>
            <a href="javascript:void(0)" class="hover:underline" data-public-page="public_booking">Book Online</a>
            <span>&bull;</span>
            <a href="javascript:void(0)" class="hover:underline" id="footer-admin-link">Staff Login</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}
