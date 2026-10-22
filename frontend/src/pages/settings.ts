import { icons } from '../components/icons.ts';
import type { UserOut } from '../api.ts';

export interface SettingsPageState {
  user: UserOut | null;
  savedMessage?: string;
}

export function renderSettingsPage(state: SettingsPageState): string {
  const user = state.user;

  return `
    <div class="settings-page animate-fade-in">
      ${
        state.savedMessage
          ? `
        <div class="clay-card mb-6 banner-success">
          <div class="flex items-center gap-3">
            <span class="icon-wrap-sm green">${icons.checkCircle}</span>
            <span>${state.savedMessage}</span>
          </div>
        </div>
      `
          : ''
      }

      <div class="settings-grid">
        <!-- Profile Card -->
        <div class="clay-card mb-6">
          <div class="card-title-row mb-4">
            <div class="card-icon-title">
              <div class="modal-icon violet">${icons.user}</div>
              <div>
                <h3>Admin Profile</h3>
                <p class="text-muted text-sm">Personal details and system credentials</p>
              </div>
            </div>
          </div>

          <form id="settings-profile-form">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input type="text" name="full_name" class="clay-input" value="${user?.full_name || 'Rajesh Kumar'}" required />
              </div>
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" name="email" class="clay-input" value="${user?.email || 'admin@speedoshine.com'}" required />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Phone Number</label>
                <input type="text" name="phone" class="clay-input" value="${user?.phone || '+91 98765 43210'}" />
              </div>
              <div class="form-group">
                <label class="form-label">Current Role</label>
                <input type="text" class="clay-input bg-muted" value="${(user?.role || 'admin').toUpperCase()}" disabled />
              </div>
            </div>

            <div class="mt-4">
              <button type="submit" class="clay-btn clay-btn-primary">
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>

        <!-- Role-Based Access Control (RBAC - Module 1 item 10) -->
        <div class="clay-card mb-6">
          <div class="card-title-row mb-4">
            <div class="card-icon-title">
              <div class="modal-icon blue">${icons.shield}</div>
              <div>
                <h3>Role-Based Access Control (RBAC)</h3>
                <p class="text-muted text-sm">Configure permissions for Super Admins, Franchisees, and Field Detailers</p>
              </div>
            </div>
          </div>

          <div class="rbac-role-selector mb-4">
            <label class="form-label">Simulate Portal View as Role:</label>
            <div class="flex gap-3 flex-wrap">
              <button type="button" class="clay-btn clay-btn-sm clay-btn-primary rbac-role-btn active" data-role="admin">
                Super Admin (HQ)
              </button>
              <button type="button" class="clay-btn clay-btn-sm clay-btn-secondary rbac-role-btn" data-role="franchise">
                Franchise Hub Partner
              </button>
              <button type="button" class="clay-btn clay-btn-sm clay-btn-secondary rbac-role-btn" data-role="detailer">
                Field Detailer / Staff
              </button>
            </div>
          </div>

          <div class="clay-table-wrapper">
            <table class="clay-table text-sm">
              <thead>
                <tr>
                  <th>Permission Module</th>
                  <th class="text-center">Super Admin</th>
                  <th class="text-center">Franchise Partner</th>
                  <th class="text-center">Staff Detailer</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Central Financials & HQ Commissions</td>
                  <td class="text-center text-green font-bold">&#10003; Full Access</td>
                  <td class="text-center text-muted">Own Hub Only</td>
                  <td class="text-center text-muted">&times; No Access</td>
                </tr>
                <tr>
                  <td>Franchise Hub Onboarding</td>
                  <td class="text-center text-green font-bold">&#10003; Full Access</td>
                  <td class="text-center text-muted">&times; No Access</td>
                  <td class="text-center text-muted">&times; No Access</td>
                </tr>
                <tr>
                  <td>Live CCTV Streams & Snapshots</td>
                  <td class="text-center text-green font-bold">&#10003; All 5 Hubs</td>
                  <td class="text-center text-green font-bold">&#10003; Hub Bays Only</td>
                  <td class="text-center text-green font-bold">&#10003; Assigned Bay</td>
                </tr>
                <tr>
                  <td>Proof Photo Capture & Upload</td>
                  <td class="text-center text-green font-bold">&#10003; View & Edit</td>
                  <td class="text-center text-green font-bold">&#10003; Approve Proof</td>
                  <td class="text-center text-green font-bold">&#10003; Upload Photos</td>
                </tr>
                <tr>
                  <td>Customer CRM & Loyalty Points</td>
                  <td class="text-center text-green font-bold">&#10003; Global Base</td>
                  <td class="text-center text-green font-bold">&#10003; Hub Customers</td>
                  <td class="text-center text-muted">&times; Read Only</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Website Content Management (CMS - Module 1 item 12) -->
        <div class="clay-card mb-6">
          <div class="card-title-row mb-4">
            <div class="card-icon-title">
              <div class="modal-icon pink">${icons.globe}</div>
              <div>
                <h3>Website & Customer Portal CMS</h3>
                <p class="text-muted text-sm">Live announcements, hero promotions, and service spotlights</p>
              </div>
            </div>
          </div>

          <form id="settings-cms-form">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Top Announcement Banner Message</label>
                <input type="text" class="clay-input" value="🌧️ Bangalore Monsoon Special: 20% Off Ceramic Coating + Free Wiper Replacements!" />
              </div>
              <div class="form-group">
                <label class="form-label">Banner Status</label>
                <select class="clay-select">
                  <option value="active">Active & Visible to Public</option>
                  <option value="inactive">Draft / Hidden</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Weekend Promotional Code</label>
                <input type="text" class="clay-input uppercase font-mono" value="SHINE20" />
              </div>
              <div class="form-group">
                <label class="form-label">Discount Value (%)</label>
                <input type="number" class="clay-input" value="20" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Hero Featured Services on Customer Booking Portal</label>
              <div class="flex gap-4 flex-wrap mt-2">
                <label class="toggle-pill"><input type="checkbox" checked /> <span>Quick Foam Wash</span></label>
                <label class="toggle-pill"><input type="checkbox" checked /> <span>Full Body Wash</span></label>
                <label class="toggle-pill"><input type="checkbox" checked /> <span>Interior Deep Clean</span></label>
                <label class="toggle-pill"><input type="checkbox" checked /> <span>9H Ceramic Shield</span></label>
              </div>
            </div>

            <div class="mt-4">
              <button type="submit" class="clay-btn clay-btn-primary">
                Publish Website Content Updates
              </button>
            </div>
          </form>
        </div>

        <!-- Business Configuration -->
        <div class="clay-card mb-6">
          <div class="card-title-row mb-4">
            <div class="card-icon-title">
              <div class="modal-icon green">${icons.store}</div>
              <div>
                <h3>Business & Brand Parameters</h3>
                <p class="text-muted text-sm">Franchise rules, taxes, and service defaults</p>
              </div>
            </div>
          </div>

          <form id="settings-business-form">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Brand Legal Trade Name</label>
                <input type="text" class="clay-input" value="SpeedoShine Auto Detailing Pvt Ltd" required />
              </div>
              <div class="form-group">
                <label class="form-label">Support Toll-Free Hotline</label>
                <input type="text" class="clay-input" value="1800-SPEEDO-SHINE (773-336)" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">HQ Franchise Royalty Rate (%)</label>
                <input type="number" class="clay-input" value="15" min="1" max="50" />
              </div>
              <div class="form-group">
                <label class="form-label">GST Tax Rate (%)</label>
                <input type="number" class="clay-input" value="18" min="0" max="28" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Currency Symbol</label>
                <input type="text" class="clay-input" value="₹ (INR - Indian Rupee)" disabled />
              </div>
              <div class="form-group">
                <label class="form-label">Staff Dispatch Engine</label>
                <select class="clay-select">
                  <option value="auto">Auto-Assign by Proximity & Duty Status</option>
                  <option value="manual">Manual Assignment Only</option>
                </select>
              </div>
            </div>

            <div class="mt-4">
              <button type="submit" class="clay-btn clay-btn-primary">
                Update Business Settings
              </button>
            </div>
          </form>
        </div>

        <!-- Design System Card -->
        <div class="clay-card mb-6">
          <div class="card-title-row mb-4">
            <div class="card-icon-title">
              <div class="modal-icon pink">${icons.palette}</div>
              <div>
                <h3>Design & Appearance</h3>
                <p class="text-muted text-sm">High-Fidelity Claymorphism System Status</p>
              </div>
            </div>
          </div>

          <div class="design-system-summary">
            <div class="design-pill-grid">
              <div class="design-pill">
                <span class="pill-dot violet"></span>
                <span>Canvas: #F4F1FA</span>
              </div>
              <div class="design-pill">
                <span class="pill-dot pink"></span>
                <span>Display: Nunito 800/900</span>
              </div>
              <div class="design-pill">
                <span class="pill-dot blue"></span>
                <span>Shadow: 4-Layer Complex Occlusion</span>
              </div>
              <div class="design-pill">
                <span class="pill-dot green"></span>
                <span>Tactility: 0.92 Click Squish</span>
              </div>
            </div>
            <p class="text-muted text-sm mt-4">
              Compliant with SpeedoShine's tactile 3D digital clay aesthetics, zero-gravity floating ambient blobs, and candy store palette.
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}
