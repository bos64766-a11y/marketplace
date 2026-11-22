/**
 * Yandex Metrika Analytics Service for snab.uz
 * Counter ID: 114479664
 */

export type YmGoal =
  | 'add_to_cart'
  | 'order_start'
  | 'order_success'
  | 'contact_form_sent';

declare global {
  interface Window {
    ym?: (id: number | string, method: string, ...args: any[]) => void;
    [key: string]: any;
  }
}

const env = (import.meta as any).env || {};
const YM_ID = env.VITE_YM_ID || '114479664';
const YM_FORCE = env.VITE_YM_FORCE === 'true';
const IS_DEV = Boolean(env.DEV);

let isInitialized = false;

function isAdminRoute(pathname?: string): boolean {
  if (typeof window === 'undefined') return false;
  const path = pathname || window.location.pathname || '';
  return path === '/admin' || path.startsWith('/admin/');
}

function shouldTrack(pathname?: string): boolean {
  if (typeof window === 'undefined') return false;
  if (isAdminRoute(pathname)) return false;
  if (IS_DEV && !YM_FORCE) return false;
  return true;
}

/**
 * Initializes Yandex Metrika script and counter.
 * Idempotent: safe to call multiple times.
 */
export function initAnalytics(): void {
  if (typeof window === 'undefined') return;
  if (isInitialized) return;

  if (isAdminRoute()) {
    return;
  }

  if (IS_DEV && !YM_FORCE) {
    // eslint-disable-next-line no-console
    console.info(
      `[Analytics] Yandex Metrika (${YM_ID}) is disabled in dev mode. Set VITE_YM_FORCE=true in .env to test locally.`
    );
    return;
  }

  try {
    // Standard Yandex Metrika async snippet
    (function (m: any, e: any, t: any, r: any, i: any, k?: any, a?: any) {
      m[i] =
        m[i] ||
        function () {
          (m[i].a = m[i].a || []).push(arguments);
        };
      m[i].l = 1 * (new Date() as any);
      for (let j = 0; j < e.scripts.length; j++) {
        if (e.scripts[j].src === r) {
          return;
        }
      }
      k = e.createElement(t);
      a = e.getElementsByTagName(t)[0];
      k.async = 1;
      k.src = r;
      a.parentNode.insertBefore(k, a);
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

    if (typeof window.ym === 'function') {
      window.ym(YM_ID, 'init', {
        ssr: true,
        webvisor: true,
        clickmap: true,
        ecommerce: 'dataLayer',
        accurateTrackBounce: true,
        trackLinks: true,
      });
    }

    isInitialized = true;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[Analytics] Failed to initialize Yandex Metrika:', err);
  }
}

/**
 * Tracks a SPA page view (virtual hit).
 */
export function trackPageView(url: string, referer?: string, title?: string): void {
  if (!shouldTrack(url)) return;

  try {
    if (typeof window.ym === 'function') {
      window.ym(YM_ID, 'hit', url, {
        referer: referer || undefined,
        title: title || document.title,
      });
    }
  } catch (err) {
    // Silently ignore tracking errors (e.g. adblocker active)
  }
}

/**
 * Triggers a conversion goal in Yandex Metrika.
 */
export function trackGoal(name: YmGoal, params?: Record<string, any>): void {
  if (!shouldTrack()) return;

  try {
    if (typeof window.ym === 'function') {
      if (params) {
        window.ym(YM_ID, 'reachGoal', name, params);
      } else {
        window.ym(YM_ID, 'reachGoal', name);
      }
    }
  } catch (err) {
    // Silently ignore goal errors
  }
}

export const analytics = {
  trackPageView,
  goal: trackGoal,
  init: initAnalytics,
  id: YM_ID,
  isEnabled: () => shouldTrack(),
};
