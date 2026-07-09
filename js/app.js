/**
     * WOMBAT EMPIRE v5.0 — IMPERIAL EDITION
     * Lore-driven Telegram Mini App
     * Complete Telegram SDK v8.0+ Integration (preserved from v4.0)
     * Tap-to-earn mechanics removed — replaced with imperial lore experience
     */

    'use strict';

    // ═══════════════════════════════════════════════════════════════════════
    // CONFIGURATION
    // ═══════════════════════════════════════════════════════════════════════

    const CONFIG = {
      LINKS: {
        buy: 'https://bags.fm/3fzFmWRedsjuybCgic1rkkZAdKhzeHVvxs7sGBgrBAGS',
        chart: 'https://gmgn.ai/sol/token/BxBuSTek_3fzFmWRedsjuybCgic1rkkZAdKhzeHVvxs7sGBgrBAGS',
        invite: 'https://t.me/wombit_io'
      },
      CONTRACT_ADDRESS: '3fzFmWRedsjuybCgic1rkkZAdKhzeHVvxs7sGBgrBAGS',
      CLOUD_KEY: 'wombit_empire_v5',
      LOCAL_KEY: 'wombit_empire_v5_local',
      LANG_KEY: 'wombit_empire_lang',
      PALETTE_KEY: 'wombit_empire_palette',
      // To add a new theme: (1) add a [data-palette="name"] CSS block with the same
      // variable names as the "empire" block, (2) add its id + emoji icon here.
      PALETTES: [
        { id: 'empire', icon: '⚜' },
        { id: 'sovereign', icon: '👁' }
        // { id: 'cosmic', icon: '✨' },
      ]
    };

    // ═══════════════════════════════════════════════════════════════════════
    // TELEGRAM SDK MANAGER (Complete v8.0+) — unchanged from prior version
    // ═══════════════════════════════════════════════════════════════════════

    class TelegramManager {
      constructor() {
        this.tg = window.Telegram?.WebApp;
        this.version = this.tg?.version || '6.0';
        this.platform = this.tg?.platform || 'unknown';
        this.isFullscreen = false;
        this.init();
      }

      init() {
        if (!this.tg) {
          console.log('📱 Running in browser mode');
          return;
        }

        try {
          // Core init
          this.tg.ready();
          this.tg.expand();

          // Fullscreen (v7.0+)
          this.initFullscreen();

          // Theme
          this.syncTheme();

          // All buttons
          this.setupButtons();

          // Viewport & protection
          this.setupViewport();

          // Haptic
          this.setupHaptic();

          // Sensors
          this.initSensors();

          // Biometric (v8.0+)
          this.initBiometric();

          // CloudStorage
          this.cloud = this.tg.CloudStorage;

          // User data
          this.user = this.tg.initDataUnsafe?.user;

          console.log(`✅ Telegram SDK v${this.version} on ${this.platform}`);

        } catch (err) {
          console.error('Telegram init error:', err);
        }
      }

      initFullscreen() {
        if (this.tg.requestFullscreen && this.isVersionAtLeast('7.0')) {
          this.tg.requestFullscreen();
          this.isFullscreen = true;
        }

        this.tg.onEvent('fullscreenChanged', ({ isFullscreen }) => {
          this.isFullscreen = isFullscreen;
        });
      }

      setupButtons() {
        // MainButton
        if (this.tg.MainButton) {
          this.tg.MainButton.setParams({
            text: '💰 $WOMBIT SATIN AL',
            color: '#d4af37',
            text_color: '#050510',
            is_active: true,
            is_visible: true
          });
          this.tg.MainButton.onClick(() => this.openLink(CONFIG.LINKS.buy));
          this.tg.MainButton.show();
        }

        // SecondaryButton (v7.7+)
        if (this.tg.SecondaryButton && this.isVersionAtLeast('7.7')) {
          this.tg.SecondaryButton.setParams({
            text: '📊 GRAFİK',
            color: '#00A86B',
            text_color: '#ffffff',
            position: 'left',
            is_visible: true
          });
          this.tg.SecondaryButton.onClick(() => this.openLink(CONFIG.LINKS.chart));
        }

        // SettingsButton
        if (this.tg.SettingsButton) {
          this.tg.SettingsButton.onClick(() => this.showSettings());
          this.tg.SettingsButton.show();
        }

        // BackButton
        if (this.tg.BackButton) {
          this.tg.BackButton.onClick(() => {
            this.haptic?.light();
            this.showConfirm('İmparatorluktan çıkılsın mı?', 'İlerlemeniz güvende!').then(ok => {
              if (ok) this.tg.close();
            });
          });
        }
      }

      setupViewport() {
        this.tg.onEvent('viewportChanged', ({ isStateStable }) => {
          if (isStateStable) {
            const height = this.tg.viewportHeight;
            const stable = this.tg.viewportStableHeight;

            if (height < stable * 0.8) {
              document.body.classList.add('keyboard-open');
            } else {
              document.body.classList.remove('keyboard-open');
            }
          }
        });

        // Prevent accidental close
        this.tg.enableClosingConfirmation?.();
        this.tg.disableVerticalSwipes?.();
      }

      setupHaptic() {
        if (!this.tg.HapticFeedback) return;

        this.haptic = {
          light: () => this.tg.HapticFeedback.impactOccurred('light'),
          medium: () => this.tg.HapticFeedback.impactOccurred('medium'),
          heavy: () => this.tg.HapticFeedback.impactOccurred('heavy'),
          success: () => this.tg.HapticFeedback.notificationOccurred('success'),
          error: () => this.tg.HapticFeedback.notificationOccurred('error'),
          warning: () => this.tg.HapticFeedback.notificationOccurred('warning')
        };
      }

      initSensors() {
        // Accelerometer for subtle 3D tilt ambiance
        if (this.tg.Accelerometer?.start) {
          this.tg.Accelerometer.start({ refresh_rate: 60 });
          this.tg.Accelerometer.change = () => {
            const x = this.tg.Accelerometer.x * 5;
            const y = this.tg.Accelerometer.y * 5;
            document.documentElement.style.setProperty('--tilt-x', `${x}deg`);
            document.documentElement.style.setProperty('--tilt-y', `${y}deg`);
          };
        }
      }

      initBiometric() {
        if (!this.tg.BiometricManager) return;

        this.tg.BiometricManager.init((success) => {
          if (success && this.tg.BiometricManager.isBiometricAvailable) {
            console.log('Biometric available:', this.tg.BiometricManager.biometricType);
          }
        });
      }

      syncTheme() {
        const theme = this.tg.colorScheme || 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        this.tg.setHeaderColor?.('#050510');
        this.tg.setBackgroundColor?.('#050510');

        this.tg.onEvent('themeChanged', () => {
          document.documentElement.setAttribute('data-theme', this.tg.colorScheme);
        });
      }

      showSettings() {
        this.showPopup({
          title: '⚙️ Ayarlar',
          message: 'Ses: Açık | Titreşim: Açık | Tema: Otomatik',
          buttons: [{ type: 'ok' }]
        });
      }

      // CloudStorage
      async cloudSave(key, data) {
        if (!this.cloud) return false;
        return new Promise(resolve => {
          this.cloud.setItem(key, JSON.stringify(data), (err, success) => {
            resolve(!err && success);
          });
        });
      }

      async cloudLoad(key) {
        if (!this.cloud) return null;
        return new Promise(resolve => {
          this.cloud.getItem(key, (err, value) => {
            if (err || !value) resolve(null);
            else try { resolve(JSON.parse(value)); } catch { resolve(null); }
          });
        });
      }

      // QR Scanner
      scanQR(text = 'QR Tara') {
        return new Promise(resolve => {
          this.tg?.showScanQrPopup?.({ text }, data => resolve(data));
        });
      }

      // Utilities
      openLink(url) {
        this.tg?.openLink ? this.tg.openLink(url) : window.open(url, '_blank');
      }

      showPopup(params) {
        return new Promise(resolve => {
          this.tg?.showPopup ? this.tg.showPopup(params, resolve) : resolve(null);
        });
      }

      showConfirm(title, message) {
        return new Promise(resolve => {
          this.tg?.showConfirm ? this.tg.showConfirm(message, resolve) : resolve(confirm(message));
        });
      }

      isVersionAtLeast(v) {
        return this.tg?.isVersionAtLeast?.(v) || false;
      }
    }

    const telegram = new TelegramManager();

    // ═══════════════════════════════════════════════════════════════════════
    // UI MANAGER (lore-driven, no tap-to-earn state)
    // ═══════════════════════════════════════════════════════════════════════

    class UIManager {
      constructor() {
        this.elements = this.cacheElements();
        this.firstVisit = true;
        this.init().catch(err => {
          console.error('UIManager init error:', err);
          // Even if cloud/storage steps fail, force the app to become visible
          this.elements.loading?.classList.add('hidden');
        });
      }

      cacheElements() {
        return {
          loading: document.getElementById('loadingScreen'),
          userName: document.getElementById('userName'),
          userAvatar: document.getElementById('userAvatar'),
          caBox: document.getElementById('caBox'),
          toast: document.getElementById('toast'),
          welcomeModal: document.getElementById('levelModal'),
          modalBtn: document.getElementById('modalBtn'),
          buyBtn: document.getElementById('buyBtn'),
          chartBtn: document.getElementById('chartBtn'),
          inviteBtn: document.getElementById('inviteBtn'),
          qrBtn: document.getElementById('qrBtn'),
          themeBtn: document.getElementById('themeBtn'),
          loreToggle: document.getElementById('loreToggle'),
          loreExtra: document.getElementById('loreExtra'),
          langBtnEn: document.getElementById('langBtnEn'),
          langBtnTr: document.getElementById('langBtnTr')
        };
      }

      async init() {
        // Restore saved language preference (defaults to English)
        let savedLang = 'en';
        try {
          savedLang = localStorage.getItem(CONFIG.LANG_KEY) || 'en';
        } catch (e) { /* ignore storage errors */ }
        this.setLanguage(savedLang);

        // Restore saved visual theme/palette (defaults to "empire")
        let savedPalette = CONFIG.PALETTES[0].id;
        try {
          const stored = localStorage.getItem(CONFIG.PALETTE_KEY);
          if (stored && CONFIG.PALETTES.some(p => p.id === stored)) savedPalette = stored;
        } catch (e) { /* ignore storage errors */ }
        this.setPalette(savedPalette, false);

        // Enable smooth transitions for *future* theme switches only
        // (avoids an unwanted fade on first paint)
        requestAnimationFrame(() => document.body.classList.add('theme-ready'));

        // Set user info from Telegram (overrides the placeholder name, no language span needed)
        if (telegram.user) {
          const name = telegram.user.first_name || telegram.user.username || 'Citizen';
          this.elements.userName.textContent = name;
          this.elements.userAvatar.textContent = name.charAt(0).toUpperCase();
        }

        await this.checkFirstVisit();
        this.bindEvents();

        // Hide loading
        setTimeout(() => {
          this.elements.loading.classList.add('hidden');
          if (this.firstVisit) {
            setTimeout(() => this.showWelcome(), 400);
          }
        }, 1800);
      }

      async checkFirstVisit() {
        try {
          const cloud = await telegram.cloudLoad(CONFIG.CLOUD_KEY);
          const local = localStorage.getItem(CONFIG.LOCAL_KEY);
          if (cloud || local) {
            this.firstVisit = false;
          } else {
            const record = { visited: true, firstVisitAt: Date.now() };
            await telegram.cloudSave(CONFIG.CLOUD_KEY, record);
            localStorage.setItem(CONFIG.LOCAL_KEY, JSON.stringify(record));
          }
        } catch (err) {
          console.warn('checkFirstVisit fallback:', err);
          // Default to treating as first visit if storage is unavailable
        }
      }

      bindEvents() {
        // Lore expand/collapse
        this.elements.loreToggle.addEventListener('click', () => {
          telegram.haptic?.light();
          const expanded = this.elements.loreExtra.classList.toggle('show');
          this.elements.loreToggle.classList.toggle('expanded', expanded);
          this.elements.loreToggle.setAttribute('aria-expanded', String(expanded));
          this.elements.loreToggle.innerHTML = expanded
            ? '<span class="lang-en">Hide the Story ⚜</span><span class="lang-tr">Hikâyeyi Gizle ⚜</span>'
            : '<span class="lang-en">The Full Story of the Empire ⚜</span><span class="lang-tr">İmparatorluğun Tüm Hikâyesi ⚜</span>';
          if (expanded) {
            this.elements.loreExtra.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        });

        // Language switch
        this.elements.langBtnEn.addEventListener('click', () => this.setLanguage('en'));
        this.elements.langBtnTr.addEventListener('click', () => this.setLanguage('tr'));

        // Theme/palette switch — cycles through CONFIG.PALETTES in order
        this.elements.themeBtn?.addEventListener('click', () => {
          telegram.haptic?.medium();
          const currentId = document.documentElement.getAttribute('data-palette') || CONFIG.PALETTES[0].id;
          const currentIndex = CONFIG.PALETTES.findIndex(p => p.id === currentId);
          const next = CONFIG.PALETTES[(currentIndex + 1) % CONFIG.PALETTES.length];
          this.setPalette(next.id, true);
        });

        // Mobile navigation — native <dialog> API with focus management
        const mobileNav = document.getElementById('mobileNav');
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        const navCloseBtn = document.getElementById('mobileNavClose');

        const openMobileNav = () => {
          telegram.haptic?.light();
          mobileNav.showModal();
          hamburgerBtn.setAttribute('aria-expanded', 'true');
          navCloseBtn.focus();
        };
        const closeMobileNav = () => {
          mobileNav.close();
          hamburgerBtn.setAttribute('aria-expanded', 'false');
          hamburgerBtn.focus();
        };

        hamburgerBtn?.addEventListener('click', openMobileNav);
        navCloseBtn?.addEventListener('click', closeMobileNav);
        mobileNav?.addEventListener('click', (e) => {
          if (e.target === mobileNav) closeMobileNav();
        });
        // Close the dialog whenever a nav link is tapped, then let the anchor scroll happen
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
          link.addEventListener('click', () => closeMobileNav());
        });

        // Blackpaper teaser toggle
        const bpTeaser = document.getElementById('blackpaperTeaser');
        const bpBody = document.getElementById('blackpaperBody');
        const toggleBlackpaper = () => {
          telegram.haptic?.light();
          const expanded = bpBody.classList.toggle('show');
          bpTeaser.setAttribute('aria-expanded', String(expanded));
        };
        bpTeaser?.addEventListener('click', toggleBlackpaper);
        bpTeaser?.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleBlackpaper(); }
        });

        // FAQ accordion
        document.querySelectorAll('.faq-question').forEach(btn => {
          btn.addEventListener('click', () => {
            telegram.haptic?.light();
            const answer = btn.nextElementSibling;
            const isOpen = btn.classList.contains('open');

            // Close all other FAQ items
            document.querySelectorAll('.faq-question.open').forEach(other => {
              if (other !== btn) {
                other.classList.remove('open');
                other.setAttribute('aria-expanded', 'false');
                other.nextElementSibling.style.maxHeight = null;
              }
            });

            btn.classList.toggle('open', !isOpen);
            btn.setAttribute('aria-expanded', String(!isOpen));
            answer.style.maxHeight = !isOpen ? answer.scrollHeight + 'px' : null;
          });
        });

        // Legal links — no dedicated pages yet, show a short notice instead of a dead link
        const legalNotice = (e) => {
          e.preventDefault();
          const isTr = document.documentElement.getAttribute('data-lang') === 'tr';
          if (telegram.tg?.showPopup) {
            telegram.showPopup({
              title: isTr ? 'Yakında' : 'Coming Soon',
              message: isTr
                ? 'Bu belge henüz yayınlanmadı. Sorularınız için Telegram topluluğumuza katılın.'
                : 'This document has not been published yet. Join our Telegram community for questions.',
              buttons: [{ type: 'ok' }]
            });
          } else {
            alert(isTr ? 'Yakında yayınlanacak.' : 'Coming soon.');
          }
        };
        document.getElementById('privacyLink')?.addEventListener('click', legalNotice);
        document.getElementById('termsLink')?.addEventListener('click', legalNotice);

        // Copy CA
        this.elements.caBox.addEventListener('click', () => this.copyCA());
        this.elements.caBox.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.copyCA();
          }
        });

        // Welcome modal close
        this.elements.modalBtn.addEventListener('click', () => {
          this.elements.welcomeModal.classList.remove('active');
          telegram.haptic?.medium();
        });

        // Action buttons
        this.elements.buyBtn.addEventListener('click', () => {
          telegram.haptic?.medium();
          telegram.openLink(CONFIG.LINKS.buy);
        });

        this.elements.chartBtn.addEventListener('click', () => {
          telegram.haptic?.medium();
          telegram.openLink(CONFIG.LINKS.chart);
        });

        this.elements.inviteBtn.addEventListener('click', () => {
          telegram.haptic?.success();
          this.shareApp();
        });

        this.elements.qrBtn.addEventListener('click', async () => {
          telegram.haptic?.light();
          const result = await telegram.scanQR('WOMBIT QR Tara');
          if (result) console.log('Scanned:', result);
        });

        // Prevent pinch-zoom / double-tap-zoom (kept from original for app feel)
        document.addEventListener('touchstart', e => {
          if (e.touches.length > 1) e.preventDefault();
        }, { passive: false });

        let lastTouch = 0;
        document.addEventListener('touchend', e => {
          const now = Date.now();
          if (now - lastTouch < 300) e.preventDefault();
          lastTouch = now;
        }, { passive: false });
      }

      async copyCA() {
        const ca = CONFIG.CONTRACT_ADDRESS;
        const icon = document.getElementById('caCopyIcon');
        const flashIcon = () => {
          if (!icon) return;
          icon.textContent = '✅';
          icon.classList.add('copied');
          setTimeout(() => {
            icon.textContent = '📋';
            icon.classList.remove('copied');
          }, 2200);
        };
        try {
          await navigator.clipboard.writeText(ca);
          this.showToast();
          flashIcon();
          telegram.haptic?.success();
        } catch {
          const ta = document.createElement('textarea');
          ta.value = ca;
          ta.style.cssText = 'position:fixed;top:-9999px;opacity:0;';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          this.showToast();
          flashIcon();
        }
      }

      showToast() {
        this.elements.toast.classList.add('show');
        setTimeout(() => this.elements.toast.classList.remove('show'), 2000);
      }

      shareApp() {
        const text = `⚜ Wombat Empire'a katıl! ⚜\n\nKöken hikâyesini, Ejderha Koruyucu'yu ve $WOMBIT'i keşfet.\n\n👉 https://t.me/wombit_io`;

        if (navigator.share) {
          navigator.share({ title: 'WOMBAT Empire', text });
        } else {
          telegram.openLink(`https://t.me/share/url?url=${encodeURIComponent('https://t.me/wombit_io')}&text=${encodeURIComponent(text)}`);
        }
      }

      showWelcome() {
        this.elements.welcomeModal.classList.add('active');
        telegram.haptic?.success();
      }

      setLanguage(lang) {
        document.documentElement.setAttribute('data-lang', lang);
        document.documentElement.setAttribute('lang', lang);
        this.elements.langBtnEn.classList.toggle('active', lang === 'en');
        this.elements.langBtnTr.classList.toggle('active', lang === 'tr');
        this.elements.langBtnEn.setAttribute('aria-pressed', String(lang === 'en'));
        this.elements.langBtnTr.setAttribute('aria-pressed', String(lang === 'tr'));

        document.title = lang === 'tr'
          ? 'WOMBAT Empire | Solana Üzerinde $WOMBIT'
          : 'WOMBAT Empire | $WOMBIT on Solana';
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', lang === 'tr'
            ? "WOMBAT Empire — Tek İmparatorluk, Tek Para. $WOMBIT, Solana üzerinde Wombat Empire'in tek dijital rezerv para birimidir."
            : 'WOMBAT Empire — One Empire, One Currency. $WOMBIT is the sole digital reserve currency of the Wombat Empire, built on Solana.');
        }

        try {
          localStorage.setItem(CONFIG.LANG_KEY, lang);
        } catch (e) { /* ignore storage errors */ }
      }

      setPalette(paletteId, announce) {
        const palette = CONFIG.PALETTES.find(p => p.id === paletteId) || CONFIG.PALETTES[0];
        document.documentElement.setAttribute('data-palette', palette.id);
        if (this.elements.themeBtn) {
          this.elements.themeBtn.textContent = palette.icon;
        }
        try {
          localStorage.setItem(CONFIG.PALETTE_KEY, palette.id);
        } catch (e) { /* ignore storage errors */ }

        // Only show a toast when the user explicitly switches (not on initial load)
        if (announce && this.elements.toast) {
          const isTr = document.documentElement.getAttribute('data-lang') === 'tr';
          this.elements.toast.querySelector('.lang-en')?.replaceChildren(
            document.createTextNode(`Theme: ${palette.id} ✅`)
          );
          // Reuse the toast element generically for this announcement
          const originalHTML = this.elements.toast.innerHTML;
          this.elements.toast.innerHTML = isTr ? `Tema değişti: ${palette.id} ✅` : `Theme switched: ${palette.id} ✅`;
          this.showToast();
          setTimeout(() => { this.elements.toast.innerHTML = originalHTML; }, 2200);
        }
      }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // AMBIENT BACKGROUND (lightweight particle drift — replaces heavy 3D scene)
    // ═══════════════════════════════════════════════════════════════════════

    // ═══════════════════════════════════════════════════════════════════════
    // SCROLL REVEAL (lightweight, dependency-free fade/slide-in on scroll)
    // ═══════════════════════════════════════════════════════════════════════

    // ═══════════════════════════════════════════════════════════════════════
    // PRICE TICKER — real SOL price via CoinGecko public API only.
    // We deliberately do NOT show a $WOMBIT price here: there is no verified
    // live price feed for it, and inventing one would mislead users. The
    // $WOMBIT row instead links out to GMGN where real market data lives.
    // ═══════════════════════════════════════════════════════════════════════

    class PriceTicker {
      constructor() {
        this.solEl = document.getElementById('tickSol');
        if (!this.solEl) return;
        this.fetchSolPrice();
        this.startPolling();

        // Pause polling when the app/tab is backgrounded (saves battery and
        // avoids pointless requests in a Telegram Mini App left open in the background),
        // resume and refresh immediately when it becomes visible again.
        document.addEventListener('visibilitychange', () => {
          if (document.hidden) {
            this.stopPolling();
          } else {
            this.fetchSolPrice();
            this.startPolling();
          }
        });
      }

      startPolling() {
        if (this.interval) return;
        this.interval = setInterval(() => this.fetchSolPrice(), 60000);
      }

      stopPolling() {
        clearInterval(this.interval);
        this.interval = null;
      }

      async fetchSolPrice() {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 5000);
          const res = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd',
            { signal: controller.signal }
          );
          clearTimeout(timeout);
          if (!res.ok) throw new Error('Price API error');
          const data = await res.json();
          const price = data?.solana?.usd;
          if (typeof price !== 'number') throw new Error('Unexpected response shape');

          this.solEl.textContent = '$' + price.toFixed(2);
          this.solEl.classList.remove('loading');
          this.solEl.removeAttribute('title');
        } catch (err) {
          // Offline, blocked, or API unavailable — fail gracefully, never show a fake number
          this.solEl.textContent = 'N/A';
          this.solEl.classList.remove('loading');
          this.solEl.setAttribute('title', 'Price feed unavailable right now — check your connection');
        }
      }
    }

    class ScrollReveal {
      constructor() {
        this.elements = document.querySelectorAll('.reveal');
        if (!this.elements.length) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
          // Show everything immediately if motion is disabled or API unsupported
          this.elements.forEach(el => el.classList.add('visible'));
          return;
        }

        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
              setTimeout(() => entry.target.classList.add('visible'), i * 60);
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        this.elements.forEach(el => observer.observe(el));
      }
    }

    class AmbientBackground {
      constructor() {
        this.container = document.getElementById('canvas-container');
        if (!this.container || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        this.spawnMotes();
      }

      spawnMotes() {
        const count = window.innerWidth < 500 ? 14 : 22;
        for (let i = 0; i < count; i++) {
          const mote = document.createElement('div');
          const isGold = Math.random() > 0.5;
          const size = 2 + Math.random() * 3;
          const duration = 8 + Math.random() * 10;
          const delay = Math.random() * 4;
          const driftX = (Math.random() - 0.5) * 60;
          const driftY = (Math.random() - 0.5) * 120;
          const baseOpacity = 0.3 + Math.random() * 0.4;
          const color = isGold ? 'rgba(212,175,55,0.5)' : 'rgba(0,168,107,0.4)';

          mote.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            background: ${color};
            box-shadow: 0 0 ${size * 2}px ${color};
            opacity: ${baseOpacity};
            --drift-x: ${driftX}px;
            --drift-y: ${driftY}px;
            --base-opacity: ${baseOpacity};
            animation: moteDrift ${duration}s ease-in-out ${delay}s infinite alternate;
          `;
          this.container.appendChild(mote);
        }
      }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // INIT
    // ═══════════════════════════════════════════════════════════════════════

    document.addEventListener('DOMContentLoaded', () => {
      try {
        new UIManager();
        new AmbientBackground();
        new ScrollReveal();
        new PriceTicker();
      } catch (err) {
        console.error('Init error:', err);
        document.getElementById('loadingScreen')?.classList.add('hidden');
        const fb = document.getElementById('errorFallback');
        if (fb) fb.style.display = 'flex';
      }
    });

    // ═══════════════════════════════════════════════════════════════════════
    // FAILSAFE — guarantees the loading screen never traps the user,
    // even if an external script (fonts/Telegram SDK) fails to load
    // or an unexpected error happens anywhere above.
    // ═══════════════════════════════════════════════════════════════════════
    setTimeout(() => {
      const loading = document.getElementById('loadingScreen');
      if (loading && !loading.classList.contains('hidden')) {
        console.warn('Failsafe: forcing loading screen closed');
        loading.classList.add('hidden');
      }
    }, 4000);

    window.addEventListener('error', (e) => {
      console.error('Global error:', e.message);
      const loading = document.getElementById('loadingScreen');
      if (loading && !loading.classList.contains('hidden')) {
        loading.classList.add('hidden');
      }
    });