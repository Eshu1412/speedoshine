import { icons } from '../components/icons.ts';

export interface LoginConfig {
  onLogin: (email: string, password: string) => Promise<void>;
}

export function renderLoginPage(): string {
  return `
    <div class="blobs-container">
      <div class="blob blob-violet"></div>
      <div class="blob blob-pink"></div>
      <div class="blob blob-blue"></div>
    </div>

    <div class="login-page">
      <div class="login-card">
        <div class="login-logo">
          <div class="login-logo-icon">
            ${icons.droplets}
          </div>
          <div class="login-logo-text">
            SpeedoShine
            <span>Admin Panel</span>
          </div>
        </div>

        <h1 class="login-title">Welcome back</h1>
        <p class="login-subtitle">Sign in to manage your car wash empire</p>

        <div id="login-error" class="login-error" style="display: none;"></div>

        <form id="login-form" class="login-form" autocomplete="on">
          <div class="form-group">
            <label class="form-label" for="login-email">Email Address</label>
            <input
              type="email"
              id="login-email"
              name="email"
              class="clay-input"
              placeholder="admin@speedoshine.com"
              autocomplete="email"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="login-password">Password</label>
            <div class="password-wrapper">
              <input
                type="password"
                id="login-password"
                name="password"
                class="clay-input"
                placeholder="Enter your password"
                autocomplete="current-password"
                required
              />
              <button type="button" class="password-toggle" id="password-toggle" aria-label="Toggle password visibility">
                ${icons.eye}
              </button>
            </div>
          </div>

          <button type="submit" class="clay-btn clay-btn-primary clay-btn-lg login-submit" id="login-submit">
            <span id="login-btn-text">Sign In</span>
            <div id="login-spinner" class="spinner" style="display: none;"></div>
          </button>
        </form>

        <div class="login-footer">
          <p>Demo credentials: <strong>admin@speedoshine.com</strong> / <strong>admin123</strong></p>
          <div class="mt-4 text-center">
            <button type="button" class="clay-btn clay-btn-ghost clay-btn-sm" id="btn-back-to-home" style="margin-top: 10px;">
              ← Back to Public Website
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function attachLoginEvents(config: LoginConfig): void {
  const form = document.getElementById('login-form') as HTMLFormElement;
  const emailInput = document.getElementById('login-email') as HTMLInputElement;
  const passwordInput = document.getElementById('login-password') as HTMLInputElement;
  const errorDiv = document.getElementById('login-error') as HTMLDivElement;
  const submitBtn = document.getElementById('login-submit') as HTMLButtonElement;
  const btnText = document.getElementById('login-btn-text') as HTMLSpanElement;
  const spinner = document.getElementById('login-spinner') as HTMLDivElement;
  const toggleBtn = document.getElementById('password-toggle') as HTMLButtonElement;

  // Password visibility toggle
  toggleBtn?.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    toggleBtn.innerHTML = isPassword ? icons.eyeOff : icons.eye;
  });

  // Form submission
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      errorDiv.textContent = 'Please fill in all fields';
      errorDiv.style.display = 'block';
      return;
    }

    // Show loading state
    submitBtn.disabled = true;
    btnText.textContent = 'Signing in...';
    spinner.style.display = 'inline-block';
    errorDiv.style.display = 'none';

    try {
      await config.onLogin(email, password);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
      submitBtn.disabled = false;
      btnText.textContent = 'Sign In';
      spinner.style.display = 'none';
    }
  });
}
