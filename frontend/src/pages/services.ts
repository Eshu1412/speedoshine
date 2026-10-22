import { icons } from '../components/icons.ts';
import type { Service } from '../api.ts';

export interface ServicesPageState {
  services: Service[];
  selectedCategory: string;
  searchQuery: string;
  isCreateModalOpen: boolean;
}

export function renderServicesPage(state: ServicesPageState): string {
  const { services, selectedCategory, searchQuery } = state;

  const categories = [
    { key: 'all', label: 'All Services' },
    { key: 'wash', label: 'Exterior Wash' },
    { key: 'interior', label: 'Interior Detailing' },
    { key: 'detailing', label: 'Complete Detailing' },
    { key: 'coating', label: 'Ceramic & PPF' },
    { key: 'polish', label: 'Paint Correction' },
  ];

  const filtered = services.filter((s) => {
    const matchesCat =
      !selectedCategory || selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const categoryColor = (cat: string) => {
    switch (cat) {
      case 'wash':
        return 'blue';
      case 'interior':
        return 'green';
      case 'coating':
        return 'violet';
      case 'polish':
        return 'pink';
      default:
        return 'amber';
    }
  };

  const cards = filtered
    .map(
      (s) => `
    <div class="clay-card service-card" data-service-id="${s.id}">
      <div class="service-card-header">
        <div class="service-icon-orb ${categoryColor(s.category)}">
          ${icons.services}
        </div>
        <div class="service-header-title">
          <h4>${s.name}</h4>
          <span class="badge badge-${categoryColor(s.category)}">${s.category.toUpperCase()}</span>
        </div>
        <span class="duration-pill">${icons.clock} ${s.duration_minutes} min</span>
      </div>

      <p class="service-desc">${s.description || 'Professional car care service by certified technicians.'}</p>

      <div class="service-pricing-grid">
        <div class="pricing-tier">
          <span class="tier-label">Hatchback</span>
          <span class="tier-price">₹${s.price_hatchback.toLocaleString('en-IN')}</span>
        </div>
        <div class="pricing-tier highlight">
          <span class="tier-label">Sedan</span>
          <span class="tier-price">₹${s.price_sedan.toLocaleString('en-IN')}</span>
        </div>
        <div class="pricing-tier">
          <span class="tier-label">SUV / 4x4</span>
          <span class="tier-price">₹${s.price_suv.toLocaleString('en-IN')}</span>
        </div>
        <div class="pricing-tier">
          <span class="tier-label">Motorbike</span>
          <span class="tier-price">${s.price_bike > 0 ? `₹${s.price_bike.toLocaleString('en-IN')}` : 'N/A'}</span>
        </div>
      </div>

      <div class="service-card-footer">
        <span class="popularity-tag">
          ${icons.sparkle} ${s.popularity || 0} bookings completed
        </span>
        <button class="clay-btn clay-btn-sm clay-btn-ghost btn-delete-service text-danger" data-id="${s.id}">
          ${icons.trash}
        </button>
      </div>
    </div>
  `
    )
    .join('');

  return `
    <div class="services-page animate-fade-in">
      <!-- Toolbar & Category Tabs -->
      <div class="clay-card mb-6">
        <div class="bookings-toolbar">
          <div class="search-box">
            <span class="search-icon">${icons.search}</span>
            <input
              type="text"
              id="service-search-input"
              class="clay-input"
              placeholder="Search catalog by service name, description..."
              value="${searchQuery}"
            />
          </div>

          <div class="filter-controls">
            <button class="clay-btn clay-btn-primary" id="btn-open-create-service">
              ${icons.plus} Add Service
            </button>
          </div>
        </div>

        <div class="status-tabs-container mt-4">
          ${categories
            .map(
              (c) => `
            <button
              class="status-tab ${selectedCategory === c.key ? 'active' : ''}"
              data-category="${c.key}"
            >
              <span>${c.label}</span>
            </button>
          `
            )
            .join('')}
        </div>
      </div>

      <!-- Services Grid -->
      <div class="services-grid">
        ${
          filtered.length > 0
            ? cards
            : `
          <div class="col-span-full clay-card text-center py-12">
            <div class="empty-state">
              ${icons.services}
              <h3>No services found in this category</h3>
              <p>Add a service or switch category tabs to view existing offerings.</p>
            </div>
          </div>
        `
        }
      </div>

      <!-- Modal: Add Service -->
      ${
        state.isCreateModalOpen
          ? `
        <div class="clay-modal-overlay" id="create-service-modal">
          <div class="clay-modal-card animate-slide-up">
            <div class="modal-header">
              <div class="modal-title-wrap">
                <div class="modal-icon green">${icons.services}</div>
                <div>
                  <h3>Add Service to Catalog</h3>
                  <p class="modal-subtitle">Configure tiered pricing per vehicle segment</p>
                </div>
              </div>
              <button class="clay-btn clay-btn-sm clay-btn-ghost btn-close-modal" id="btn-close-service-modal">
                ${icons.x}
              </button>
            </div>

            <form id="create-service-form" class="modal-form">
              <div class="form-row">
                <div class="form-group">
                  <label>Service Name *</label>
                  <input type="text" name="name" class="clay-input" required placeholder="e.g. Underbody Anti-Rust Wash" />
                </div>
                <div class="form-group">
                  <label>Category *</label>
                  <select name="category" class="clay-select" required>
                    <option value="wash">Exterior Wash</option>
                    <option value="interior">Interior Detailing</option>
                    <option value="detailing">Complete Detailing</option>
                    <option value="coating">Ceramic & PPF</option>
                    <option value="polish">Paint Correction</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label>Estimated Duration (Minutes) *</label>
                <input type="number" name="duration_minutes" class="clay-input" required value="45" min="10" />
              </div>

              <div class="form-group">
                <label class="font-bold">Tiered Pricing by Vehicle Type (₹)</label>
                <div class="form-row mt-2">
                  <div class="form-group">
                    <label>Hatchback</label>
                    <input type="number" name="price_hatchback" class="clay-input" required value="349" min="0" />
                  </div>
                  <div class="form-group">
                    <label>Sedan</label>
                    <input type="number" name="price_sedan" class="clay-input" required value="449" min="0" />
                  </div>
                  <div class="form-group">
                    <label>SUV</label>
                    <input type="number" name="price_suv" class="clay-input" required value="599" min="0" />
                  </div>
                  <div class="form-group">
                    <label>Bike</label>
                    <input type="number" name="price_bike" class="clay-input" required value="199" min="0" />
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label>Service Description & Inclusions</label>
                <textarea name="description" class="clay-input" rows="3" placeholder="Explain what steps are performed in this service..."></textarea>
              </div>

              <div class="modal-actions mt-4">
                <button type="button" class="clay-btn clay-btn-ghost btn-close-modal" id="btn-cancel-service">
                  Cancel
                </button>
                <button type="submit" class="clay-btn clay-btn-primary">
                  Publish Service
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
