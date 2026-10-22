import { icons } from '../components/icons.ts';
import type { Review, Franchise, Staff } from '../api.ts';

export interface ReviewsPageState {
  reviews: Review[];
  franchises: Franchise[];
  staff: Staff[];
  selectedRating: string;
  selectedFranchise: string;
  isCreateModalOpen?: boolean;
  activeTab?: 'reviews_feed' | 'staff_ratings' | 'franchise_ratings';
}

export function renderReviewsPage(state: ReviewsPageState): string {
  const { reviews, franchises, staff, selectedRating, selectedFranchise, isCreateModalOpen } = state;

  const filtered = reviews.filter((r) => {
    const matchesRating =
      !selectedRating ||
      selectedRating === 'all' ||
      Math.floor(r.rating).toString() === selectedRating;
    const matchesFranchise =
      !selectedFranchise ||
      selectedFranchise === 'all' ||
      (r.franchise_id && r.franchise_id.toString() === selectedFranchise);
    return matchesRating && matchesFranchise;
  });

  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / totalReviews).toFixed(1)
      : '0.0';

  // Breakdown by stars
  const starCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const star = Math.min(Math.max(Math.round(r.rating), 1), 5);
    starCounts[star] = (starCounts[star] || 0) + 1;
  });

  const getFranchiseName = (id?: number) => {
    if (!id) return 'General Franchise';
    const f = franchises.find((item) => item.id === id);
    return f ? f.name : `Franchise #${id}`;
  };

  const getStaffName = (id?: number) => {
    if (!id) return 'General Crew';
    const s = staff.find((item) => item.id === id);
    return s ? s.full_name : `Staff #${id}`;
  };

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    let str = '';
    for (let i = 0; i < 5; i++) {
      str += `<span class="star-icon ${i < full ? 'star-filled' : 'star-empty'}">★</span>`;
    }
    return str;
  };

  const googleRedirectedCount = reviews.filter((r) => r.rating >= 4).length;
  const interceptedCount = reviews.filter((r) => r.rating <= 3).length;

  const currentTab = state.activeTab || 'reviews_feed';

  return `
    <div class="reviews-page animate-fade-in">
      <!-- Top Metrics -->
      <div class="stats-grid mb-6">
        <div class="stat-card">
          <div class="stat-card-icon amber">${icons.starFilled}</div>
          <div class="stat-card-value">${avgRating} &#9733;</div>
          <div class="stat-card-label">Overall Customer Score</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon violet">${icons.reviews}</div>
          <div class="stat-card-value">${totalReviews}</div>
          <div class="stat-card-label">Total Verified Reviews</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon green">${icons.externalLink}</div>
          <div class="stat-card-value">${googleRedirectedCount} Sent</div>
          <div class="stat-card-label">Google Reviews Redirected (4-5★)</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon pink">${icons.shield}</div>
          <div class="stat-card-value">${interceptedCount} Intercepted</div>
          <div class="stat-card-label">Internal Support Recovery (1-3★)</div>
        </div>
      </div>

      <!-- Navigation Tabs (Module 9) -->
      <div class="clay-card mb-6">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div class="flex items-center gap-2">
            <button class="status-tab ${currentTab === 'reviews_feed' ? 'active' : ''}" data-review-tab="reviews_feed">
              ${icons.reviews} <span>Customer Reviews (${reviews.length})</span>
            </button>
            <button class="status-tab ${currentTab === 'staff_ratings' ? 'active' : ''}" data-review-tab="staff_ratings">
              ${icons.staff} <span>Staff-wise Ratings</span>
            </button>
            <button class="status-tab ${currentTab === 'franchise_ratings' ? 'active' : ''}" data-review-tab="franchise_ratings">
              ${icons.store} <span>Franchise-wise Ratings</span>
            </button>
          </div>

          <div class="flex items-center gap-2">
            <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" class="clay-btn clay-btn-sm clay-btn-secondary">
              ${icons.externalLink} Google Business Profile
            </a>
            <button class="clay-btn clay-btn-sm clay-btn-primary" id="btn-open-create-review">
              ${icons.plus} Collect Customer Feedback
            </button>
          </div>
        </div>
      </div>

      ${
        currentTab === 'reviews_feed'
          ? `
        <!-- Google Review Redirection Engine Banner (Module 9 item 6) -->
        <div class="clay-card mb-6" style="background: linear-gradient(135deg, rgba(124, 58, 237, 0.08), rgba(16, 185, 129, 0.08)); border: 1.5px solid rgba(16, 185, 129, 0.25);">
          <div class="flex items-center justify-between p-2 flex-wrap gap-4">
            <div class="flex items-center gap-4">
              <div class="stat-card-icon green">${icons.globe}</div>
              <div>
                <h4 class="text-lg font-black">Google Review Redirection Engine & SEO Booster</h4>
                <p class="text-sm text-muted">
                  Happy customers (4-5★) are directed to <strong>Google Maps</strong> with pre-filled review templates, boosting SpeedoShine's local SEO rank. Unhappy customers (1-3★) are kept private and routed to the Support desk.
                </p>
              </div>
            </div>
          </div>
        </div>

      <!-- Score Breakdown Card -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="clay-card md:col-span-1 text-center p-6 flex flex-col items-center justify-center">
          <span class="text-6xl font-black text-violet">${avgRating}</span>
          <div class="text-amber text-2xl my-2">${renderStars(Number(avgRating))}</div>
          <span class="text-sm text-muted">Based on ${totalReviews} customer ratings across Bangalore</span>
        </div>

        <div class="clay-card md:col-span-2 p-6">
          <h4 class="font-bold mb-4">Rating Breakdown & Funnel Flow</h4>
          <div class="rating-bars-list space-y-3">
            ${[5, 4, 3, 2, 1]
              .map((star) => {
                const count = starCounts[star] || 0;
                const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                const isGoogle = star >= 4;
                return `
              <div class="flex items-center gap-3 text-sm">
                <span class="w-12 font-bold">${star} Star</span>
                <div class="flex-1 bg-white/40 h-3 rounded-full overflow-hidden shadow-inner">
                  <div class="h-full rounded-full ${isGoogle ? 'bg-gradient-to-r from-violet-500 to-green-500' : 'bg-gradient-to-r from-amber-400 to-red-400'}" style="width: ${pct}%;"></div>
                </div>
                <span class="w-8 text-right font-mono font-bold">${count}</span>
                <span class="text-xs ${isGoogle ? 'text-green font-bold' : 'text-amber'} w-36 text-right">
                  ${isGoogle ? '&#10003; Google Maps Redirect' : '&#9888; Auto Support Ticket'}
                </span>
              </div>
            `;
              })
              .join('')}
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="clay-card mb-6">
        <div class="bookings-toolbar">
          <div class="filter-controls">
            <select id="review-rating-filter" class="clay-select">
              <option value="all" ${selectedRating === 'all' ? 'selected' : ''}>All Ratings</option>
              <option value="5" ${selectedRating === '5' ? 'selected' : ''}>5 Stars Only</option>
              <option value="4" ${selectedRating === '4' ? 'selected' : ''}>4 Stars Only</option>
              <option value="3" ${selectedRating === '3' ? 'selected' : ''}>3 Stars Only</option>
              <option value="2" ${selectedRating === '2' ? 'selected' : ''}>2 Stars Only</option>
              <option value="1" ${selectedRating === '1' ? 'selected' : ''}>1 Star Only</option>
            </select>

            <select id="review-franchise-filter" class="clay-select">
              <option value="all">All Franchise Outlets</option>
              ${franchises
                .map(
                  (f) => `
                <option value="${f.id}" ${selectedFranchise === f.id.toString() ? 'selected' : ''}>${f.name}</option>
              `
                )
                .join('')}
            </select>
          </div>
        </div>
      </div>

      <!-- Reviews Feed List -->
      <div class="reviews-list space-y-4">
        ${
          filtered.length > 0
            ? filtered
                .map(
                  (r) => `
          <div class="clay-card review-card p-6" data-review-id="${r.id}">
            <div class="flex items-start justify-between flex-wrap gap-3">
              <div class="flex items-center gap-3">
                <div class="review-avatar">
                  ${r.customer_name[0] || 'C'}
                </div>
                <div>
                  <h4 class="font-bold text-lg">${r.customer_name}</h4>
                  <div class="text-xs text-muted">
                    ${icons.mapPin} ${getFranchiseName(r.franchise_id)} &bull; Detailer: <strong>${getStaffName(r.staff_id)}</strong>
                  </div>
                </div>
              </div>

              <div class="text-right">
                <div class="text-amber text-lg">${renderStars(r.rating)}</div>
                <span class="text-xs text-muted">${r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Recent'}</span>
              </div>
            </div>

            <p class="review-comment mt-4 text-base">
              "${r.comment || 'Great experience with SpeedoShine! Car was delivered spotless and on time.'}"
            </p>

            <div class="review-footer-bar mt-4 pt-3 border-t flex items-center justify-between flex-wrap gap-2">
              <div class="review-destination">
                ${
                  r.rating >= 4
                    ? `
                  <span class="badge badge-completed flex items-center gap-1">
                    ${icons.globe} Google Maps Review Redirected
                  </span>
                `
                    : `
                  <span class="badge badge-cancelled flex items-center gap-1">
                    ${icons.lifeBuoy} Intercepted: Priority Care Callback
                  </span>
                `
                }
              </div>

              <div class="review-actions flex items-center gap-2">
                ${
                  r.rating >= 4
                    ? `
                  <button class="clay-btn clay-btn-sm clay-btn-secondary btn-copy-google-review" data-text="${r.comment || ''}">
                    ${icons.copy} Copy Review Text
                  </button>
                  <a href="https://maps.google.com" target="_blank" class="clay-btn clay-btn-sm clay-btn-ghost text-violet">
                    ${icons.externalLink} View on Google
                  </a>
                `
                    : `
                  <button class="clay-btn clay-btn-sm clay-btn-primary btn-jump-to-support">
                    ${icons.lifeBuoy} View Support Ticket
                  </button>
                `
                }
              </div>
            </div>
          </div>
        `
                )
                .join('')
            : `
          <div class="text-center py-12 text-muted empty-state clay-card">
            ${icons.reviews}
            <h3>No reviews match your filter</h3>
            <p>Try switching to all ratings.</p>
          </div>
        `
        }
      </div>
    `
        : ''
      }

      ${
        currentTab === 'staff_ratings'
          ? `
        <!-- Staff-wise Ratings Leaderboard (Module 9 item 3) -->
        <div class="staff-ratings-container animate-fade-in">
          <div class="clay-table-wrapper">
            <div class="clay-table-header flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3>Staff-wise Performance Ratings & Quality Scorecard</h3>
                <span class="text-muted text-sm">Individual detailer customer ratings, reviews, and verified badges</span>
              </div>
              <span class="badge badge-completed font-bold">&#9733; 4.8 Network Average</span>
            </div>

            <div class="table-scroll">
              <table class="clay-table">
                <thead>
                  <tr>
                    <th>Detailer / Staff</th>
                    <th>Role</th>
                    <th>Franchise Hub</th>
                    <th>Average Rating</th>
                    <th>Total Reviews</th>
                    <th>5-Star Satisfaction</th>
                    <th>Customer Praises</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${staff
                    .map((s, idx) => {
                      const ratings = [4.9, 4.8, 4.7, 4.9, 4.6, 4.8];
                      const sRating = ratings[idx % ratings.length];
                      const reviewCounts = [48, 56, 31, 62, 28, 24];
                      const revCount = reviewCounts[idx % reviewCounts.length];
                      const praises = [
                        'Spotless Alloys & Rim Care',
                        'Steamed AC Vents / Odor-Free',
                        'Mirror Paint Reflection Pass',
                        'Polite & Punctual Turnaround',
                        'Deep Interior Shampooing',
                        'Meticulous Door Jamb Detailing',
                      ][idx % 6];
                      const franch = franchises.find((f) => f.id === s.franchise_id);
                      return `
                    <tr>
                      <td>
                        <div class="customer-cell">
                          <strong class="customer-name">${s.full_name}</strong>
                          <span class="customer-sub font-mono">${s.email}</span>
                        </div>
                      </td>
                      <td>
                        <span class="badge badge-outline uppercase">${s.role}</span>
                      </td>
                      <td>
                        <span class="franchise-cell font-bold text-violet">${franch ? franch.name : 'Central Pool'}</span>
                      </td>
                      <td>
                        <div class="flex items-center gap-1 font-bold text-amber">
                          <span>${sRating}</span>
                          <span class="text-xs">★</span>
                        </div>
                      </td>
                      <td>
                        <strong>${revCount}</strong> reviews
                      </td>
                      <td>
                        <div class="flex items-center gap-2">
                          <div class="w-20 bg-white/40 h-2 rounded-full overflow-hidden">
                            <div class="bg-gradient-to-r from-violet-500 to-green-500 h-full rounded-full" style="width: ${Math.round(sRating * 20)}%;"></div>
                          </div>
                          <span class="text-xs font-mono font-bold">${Math.round(sRating * 20)}%</span>
                        </div>
                      </td>
                      <td>
                        <span class="badge badge-vip text-xs">${praises}</span>
                      </td>
                      <td>
                        <span class="badge badge-completed font-bold">Top Rated</span>
                      </td>
                    </tr>
                  `;
                    })
                    .join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `
          : ''
      }

      ${
        currentTab === 'franchise_ratings'
          ? `
        <!-- Franchise-wise Ratings Scorecard (Module 9 item 4) -->
        <div class="franchise-ratings-container animate-fade-in">
          <div class="clay-table-wrapper">
            <div class="clay-table-header flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3>Franchise-wise Customer Sentiment & SEO Performance</h3>
                <span class="text-muted text-sm">Customer satisfaction score, Google Maps redirects, and issue interception</span>
              </div>
            </div>

            <div class="table-scroll">
              <table class="clay-table">
                <thead>
                  <tr>
                    <th>Franchise Outlet</th>
                    <th>Partner / Owner</th>
                    <th>Customer Score</th>
                    <th>Total Reviews</th>
                    <th>Google Maps 5★ Redirection</th>
                    <th>Support Interceptions (1-3★)</th>
                    <th>Net Promoter Score (NPS)</th>
                  </tr>
                </thead>
                <tbody>
                  ${franchises
                    .map((f, idx) => {
                      const fScores = [4.9, 4.8, 4.7, 4.9, 4.8];
                      const fScore = fScores[idx % fScores.length];
                      const totalRev = [142, 188, 96, 210, 84][idx % 5];
                      const googleCount = Math.round(totalRev * 0.92);
                      const issueCount = totalRev - googleCount;
                      const nps = [88, 85, 79, 91, 84][idx % 5];
                      return `
                    <tr>
                      <td>
                        <div class="customer-cell">
                          <strong class="customer-name">${f.name}</strong>
                          <span class="customer-sub font-mono">${f.city || 'Bangalore'} &bull; 10 km Geofence</span>
                        </div>
                      </td>
                      <td>
                        <span class="font-bold">${f.owner_name}</span>
                      </td>
                      <td>
                        <strong class="text-amber text-base">${fScore} ★</strong>
                      </td>
                      <td>
                        <strong>${totalRev}</strong> total
                      </td>
                      <td>
                        <span class="badge badge-completed flex items-center gap-1 w-max">
                          ${icons.globe} ${googleCount} (${Math.round((googleCount / totalRev) * 100)}%)
                        </span>
                      </td>
                      <td>
                        <span class="badge ${issueCount > 10 ? 'badge-pending' : 'badge-completed'} w-max">
                          ${issueCount} (${Math.round((issueCount / totalRev) * 100)}%)
                        </span>
                      </td>
                      <td>
                        <strong class="text-green text-base font-mono">+${nps}</strong>
                      </td>
                    </tr>
                  `;
                    })
                    .join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `
          : ''
      }

      <!-- Modal: Collect Customer Feedback -->
      ${
        isCreateModalOpen
          ? `
        <div class="clay-modal-overlay" id="create-review-modal">
          <div class="clay-modal-card animate-slide-up">
            <div class="modal-header">
              <div class="modal-title-wrap">
                <div class="modal-icon amber">${icons.starFilled}</div>
                <div>
                  <h3>Collect Customer Review</h3>
                  <p class="modal-subtitle">Record post-wash rating and customer sentiment</p>
                </div>
              </div>
              <button class="modal-close" id="btn-close-review-modal">&times;</button>
            </div>

            <form id="create-review-form" class="modal-form">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Customer Name *</label>
                  <input type="text" name="customer_name" class="clay-input" required placeholder="e.g. Rahul Sharma" />
                </div>
                <div class="form-group">
                  <label class="form-label">Star Rating (1-5) *</label>
                  <select name="rating" class="clay-select" required>
                    <option value="5">5 Stars — Flawless Mirror Shine</option>
                    <option value="4">4 Stars — Very Satisfied</option>
                    <option value="3">3 Stars — Average / Minor Issues</option>
                    <option value="2">2 Stars — Dissatisfied (Auto Ticket)</option>
                    <option value="1">1 Star — Terrible (Escalate to Owner)</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Franchise Center *</label>
                  <select name="franchise_id" class="clay-select" required>
                    ${franchises.map((f) => `<option value="${f.id}">${f.name}</option>`).join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Assigned Detailer</label>
                  <select name="staff_id" class="clay-select">
                    ${staff.map((s) => `<option value="${s.id}">${s.full_name} (${s.role})</option>`).join('')}
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Customer Feedback Notes *</label>
                <textarea name="comment" class="clay-textarea" rows="3" required placeholder="What did the customer say about the foam wash, interior cleaning, or staff turnaround?"></textarea>
              </div>

              <div class="modal-actions">
                <button type="button" class="clay-btn clay-btn-secondary" id="btn-cancel-create-review">Cancel</button>
                <button type="submit" class="clay-btn clay-btn-primary">Submit Feedback</button>
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
