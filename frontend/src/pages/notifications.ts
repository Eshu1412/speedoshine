import { icons } from '../components/icons.ts';
import type { Notification } from '../api.ts';

export interface NotificationsPageState {
  notifications: Notification[];
  filterUnread: boolean;
  isBroadcastModalOpen?: boolean;
  activeTab?: 'feed' | 'automations';
}

export function renderNotificationsPage(state: NotificationsPageState): string {
  const { notifications, filterUnread, isBroadcastModalOpen } = state;

  const filtered = filterUnread ? notifications.filter((n) => !n.is_read) : notifications;
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const typeConfig: Record<string, { icon: string; color: string }> = {
    booking: { icon: icons.bookings, color: 'violet' },
    payment: { icon: icons.revenue, color: 'green' },
    staff: { icon: icons.users, color: 'blue' },
    alert: { icon: icons.clock, color: 'amber' },
    promo: { icon: icons.sparkle, color: 'pink' },
  };

  const items = filtered
    .map((n) => {
      const conf = typeConfig[n.type] || { icon: icons.bell, color: 'violet' };
      const timeStr = n.created_at
        ? new Date(n.created_at).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            month: 'short',
            day: 'numeric',
          })
        : 'Just now';

      return `
      <div class="clay-card notification-item ${n.is_read ? 'is-read' : 'is-unread'}" data-notification-id="${n.id}">
        <div class="notification-icon-wrap ${conf.color}">
          ${conf.icon}
        </div>
        <div class="notification-content">
          <div class="notification-title-row">
            <h4>${n.title}</h4>
            <span class="notification-time">${timeStr}</span>
          </div>
          <p class="notification-desc">${n.message || ''}</p>
        </div>
        <div class="notification-actions">
          ${
            !n.is_read
              ? `
            <button class="clay-btn clay-btn-sm clay-btn-ghost btn-mark-read" data-id="${n.id}" title="Mark as read">
              ${icons.check}
            </button>
          `
              : ''
          }
        </div>
      </div>
    `;
    })
    .join('');

  const currentTab = state.activeTab || 'feed';

  return `
    <div class="notifications-page animate-fade-in">
      <!-- Tab & Toolbar Card -->
      <div class="clay-card mb-6">
        <div class="flex items-center justify-between flex-wrap gap-4 border-b pb-4">
          <div class="flex items-center gap-2">
            <button class="status-tab ${currentTab === 'feed' ? 'active' : ''}" data-notif-tab="feed">
              ${icons.bell} <span>Notification Feed (${notifications.length})</span>
            </button>
            <button class="status-tab ${currentTab === 'automations' ? 'active' : ''}" data-notif-tab="automations">
              ${icons.sparkle} <span>Automated SMS Triggers (8 Workflows)</span>
            </button>
          </div>

          <div class="flex items-center gap-3">
            <button class="clay-btn clay-btn-secondary" id="btn-open-broadcast-modal">
              ${icons.send} Send Promo SMS Broadcast
            </button>
            ${
              unreadCount > 0 && currentTab === 'feed'
                ? `
              <button class="clay-btn clay-btn-primary" id="btn-mark-all-read">
                ${icons.check} Mark All Read
              </button>
            `
                : ''
            }
          </div>
        </div>

        ${
          currentTab === 'feed'
            ? `
          <div class="flex items-center gap-3 mt-4">
            <button class="status-tab ${!filterUnread ? 'active' : ''}" id="btn-filter-all-notifs">
              <span>All Alerts (${notifications.length})</span>
            </button>
            <button class="status-tab ${filterUnread ? 'active' : ''}" id="btn-filter-unread-notifs">
              <span>Unread Only</span>
              ${unreadCount > 0 ? `<span class="tab-count">${unreadCount}</span>` : ''}
            </button>
          </div>
        `
            : ''
        }
      </div>

      ${
        currentTab === 'feed'
          ? `
        <!-- Notifications List -->
        <div class="notifications-list">
          ${
            filtered.length > 0
              ? items
              : `
            <div class="text-center py-12 text-muted empty-state clay-card">
              ${icons.bell}
              <h3>No notifications to display</h3>
              <p>You're all caught up with customer alerts and bookings.</p>
            </div>
          `
          }
        </div>
      `
          : ''
      }

      ${
        currentTab === 'automations'
          ? `
        <!-- Automated Lifecycle SMS & WhatsApp Triggers (Module 7) -->
        <div class="sms-automations-container animate-fade-in">
          <div class="clay-card mb-6 p-6" style="background: linear-gradient(135deg, rgba(124, 58, 237, 0.08), rgba(219, 39, 119, 0.06)); border: 1.5px solid rgba(124, 58, 237, 0.2);">
            <div class="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 class="text-xl font-black">Lifecycle SMS & WhatsApp Automation Engine</h3>
                <p class="text-sm text-muted">
                  SpeedoShine keeps customers and field staff informed at all 8 stages of service delivery.
                </p>
              </div>
              <span class="badge badge-completed font-bold">&#10003; DLT Approved &bull; Meta WhatsApp Business Cloud API</span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${[
              {
                id: 'booking_confirm',
                title: '1. Booking Confirmation Notification',
                trigger: 'Trigger: Immediately when customer confirms online booking slot',
                channel: 'SMS + WhatsApp',
                icon: icons.bookings,
                color: 'violet',
                template: 'Hi {{customer_name}}! 🎉 Your SpeedoShine booking #{{booking_id}} for {{vehicle_number}} ({{service_name}}) is confirmed for {{date}} at {{time}}. Location: {{franchise_name}}. Track: {{track_link}}',
              },
              {
                id: 'payment_confirm',
                title: '2. Payment Confirmation & Tax Invoice',
                trigger: 'Trigger: On successful UPI, Card, or Cash ledger transaction',
                channel: 'WhatsApp PDF + SMS',
                icon: icons.creditCard,
                color: 'green',
                template: 'Payment Received: ₹{{amount}} received for Booking #{{booking_id}}. Download your GST Tax Invoice here: {{invoice_link}}. Thank you for choosing SpeedoShine!',
              },
              {
                id: 'staff_assign',
                title: '3. Staff Assignment Alert',
                trigger: 'Trigger: When hub supervisor allocates detailer to vehicle',
                channel: 'SMS to Customer + Alert to Staff',
                icon: icons.users,
                color: 'blue',
                template: 'Detailer Assigned: {{staff_name}} (+91 98765-XXXXX) has been assigned to your {{vehicle_number}}. Van/Bay: {{bay_name}}. ETA: {{eta_mins}} mins.',
              },
              {
                id: 'service_start',
                title: '4. Service Start Notification',
                trigger: 'Trigger: When vehicle checks into Bay CCTV inspection stage',
                channel: 'WhatsApp Video Link + SMS',
                icon: icons.video,
                color: 'violet',
                template: '🚗 Wash Underway! Your {{vehicle_number}} has entered {{bay_name}} for {{service_name}}. Watch the live CCTV wash feed here: {{live_cam_link}}',
              },
              {
                id: 'service_complete',
                title: '5. Service Completion Alert',
                trigger: 'Trigger: When 24/24 Quality Checklist is signed off by supervisor',
                channel: 'SMS + WhatsApp HD Proof',
                icon: icons.checkCircle,
                color: 'green',
                template: '✨ Car Ready! Your {{vehicle_number}} has passed the 24-point QC inspection. Ceramic gloss finish verified! View Before/After photos: {{proof_link}}',
              },
              {
                id: 'promo_broadcast',
                title: '6. Promotional Campaign Broadcast',
                trigger: 'Trigger: Scheduled weekend marketing / monsoon blast',
                channel: 'WhatsApp Rich Template + SMS',
                icon: icons.sparkle,
                color: 'pink',
                template: '🌧️ Monsoon Paint Shield Offer: Get 20% OFF on Full Body Foam Wash + Underbody Blast with code SHINE20 at SpeedoShine this weekend! Book: speedoshine.com/book',
              },
              {
                id: 'wash_reminder',
                title: '7. 30-Day Retention Wash Reminder',
                trigger: 'Trigger: Automated 30 days after last service visit',
                channel: 'SMS + WhatsApp',
                icon: icons.clock,
                color: 'amber',
                template: 'Hi {{customer_name}}, it has been 30 days since your last wash for {{vehicle_number}}! Road grime can damage your clear coat. Re-book in 1 click: {{repeat_link}}',
              },
              {
                id: 'admin_alert',
                title: '8. Admin & Franchise SLA Alert',
                trigger: 'Trigger: Internal alert on bay delay > 20m or 1-3★ review',
                channel: 'Admin Push + SMS to Owner',
                icon: icons.shield,
                color: 'pink',
                template: '⚠️ SLA ESCALATION: Bay #{{bay_id}} turnaround at {{franchise_name}} exceeded 45 mins for {{vehicle_number}}. Supervisor intervention required.',
              },
            ]
              .map(
                (trig) => `
              <div class="clay-card p-6 flex flex-col justify-between" data-trigger-id="${trig.id}">
                <div>
                  <div class="flex items-start justify-between gap-3 mb-3">
                    <div class="flex items-center gap-3">
                      <div class="notification-icon-wrap ${trig.color}" style="width: 44px; height: 44px;">
                        ${trig.icon}
                      </div>
                      <div>
                        <h4 class="font-bold text-base">${trig.title}</h4>
                        <span class="text-xs text-muted block">${trig.trigger}</span>
                      </div>
                    </div>
                    <label class="toggle-pill">
                      <input type="checkbox" checked />
                      <span>Active</span>
                    </label>
                  </div>

                  <div class="text-xs mb-2 flex items-center justify-between text-muted">
                    <span>Channels: <strong>${trig.channel}</strong></span>
                    <span class="font-mono text-green font-bold">&#10003; Template Active</span>
                  </div>

                  <div class="bg-white/50 p-3 rounded-2xl text-xs font-mono text-muted leading-relaxed border border-white/60 mb-4">
                    ${trig.template}
                  </div>
                </div>

                <div class="pt-3 border-t flex items-center justify-between">
                  <span class="text-xs text-muted">Variables: {{name}}, {{vehicle}}, {{link}}</span>
                  <button class="clay-btn clay-btn-sm clay-btn-primary btn-test-fire-sms" data-title="${trig.title}" data-template="${trig.template}">
                    ${icons.send} Test Fire Trigger
                  </button>
                </div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      `
          : ''
      }

      <!-- Modal: Broadcast Promotional SMS / WhatsApp (Module 7) -->
      ${
        isBroadcastModalOpen
          ? `
        <div class="clay-modal-overlay" id="broadcast-sms-modal">
          <div class="clay-modal-card animate-slide-up" style="max-width: 650px;">
            <div class="modal-header">
              <div class="modal-title-wrap">
                <div class="modal-icon pink">${icons.send}</div>
                <div>
                  <h3>Broadcast SMS / WhatsApp Promotion</h3>
                  <p class="modal-subtitle">Engage customers across Bangalore with automated marketing</p>
                </div>
              </div>
              <button class="modal-close" id="btn-close-broadcast-modal">&times;</button>
            </div>

            <form id="broadcast-sms-form" class="modal-form">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Target Audience *</label>
                  <select name="audience" class="clay-select" required>
                    <option value="all">All Registered Customers (1,248 Recipients)</option>
                    <option value="inactive">Inactive Customers (> 30 Days Without Wash)</option>
                    <option value="vip">Diamond & Platinum VIP Members Only (186 Recipients)</option>
                    <option value="koramangala">Koramangala Hub Customers Only</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Delivery Channel *</label>
                  <select name="channel" class="clay-select" required>
                    <option value="sms_whatsapp">SMS + WhatsApp Dual Push</option>
                    <option value="whatsapp">WhatsApp Business API Only</option>
                    <option value="sms">Transactional SMS (DLT Approved)</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Campaign Template Preset</label>
                <div class="flex flex-wrap gap-2 mb-3">
                  <button type="button" class="quick-loc-chip btn-load-template" data-tpl="monsoon">Monsoon 20% Off</button>
                  <button type="button" class="quick-loc-chip btn-load-template" data-tpl="ceramic">Ceramic Shield Weekend</button>
                  <button type="button" class="quick-loc-chip btn-load-template" data-tpl="reminder">30-Day Wash Reminder</button>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">SMS / WhatsApp Message Body *</label>
                <textarea
                  name="message"
                  id="broadcast-message-text"
                  class="clay-textarea"
                  rows="4"
                  required
                >Hi {{name}}! 🌧️ Bangalore monsoon rain can ruin your car paint. Get 20% OFF on Full Body Foam Wash + Underbody Blast at SpeedoShine this weekend! Use code SHINE20 at booking. Book now: speedoshine.in/book</textarea>
                <span class="text-xs text-muted mt-1 block">Dynamic tags: {{name}}, {{vehicle}}, {{pincode}}</span>
              </div>

              <div class="modal-actions mt-4">
                <button type="button" class="clay-btn clay-btn-secondary" id="btn-cancel-broadcast">Cancel</button>
                <button type="submit" class="clay-btn clay-btn-primary">
                  ${icons.send} Dispatch Broadcast Campaign
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
