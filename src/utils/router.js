import { useState, useEffect, useCallback } from 'react';
import { allShows } from '../data/episodesData';

// Category slug mapping helpers
export const CATEGORY_SLUGS = {
  'on-now': 'On Now',
  'tv-shows': 'TV Shows',
  'popular-tv-shows': 'Popular TV Shows',
  'podcasts': 'Podcasts',
  'podcasts-talk-shows': 'Podcasts & Talk Shows',
  'comedy': 'Comedy',
  'upcoming-events': 'Upcoming Events',
  'upcoming-crack-up-comedy': 'Upcoming Crack Up Comedy',
};

export function slugifyCategory(cat = '') {
  return cat
    .toLowerCase()
    .replace(/&/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function parseCategorySlug(slug = '') {
  if (CATEGORY_SLUGS[slug]) return CATEGORY_SLUGS[slug];
  // Fallback: convert hyphens to title case
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Find a show by id, youtubeId, or title slug
export function findShowByIdOrSlug(idOrSlug) {
  if (!idOrSlug) return null;
  const target = String(idOrSlug).toLowerCase().trim();

  return (
    allShows.find(
      (s) =>
        (s.id && s.id.toLowerCase() === target) ||
        (s.youtubeId && s.youtubeId.toLowerCase() === target) ||
        (s.title &&
          s.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') === target)
    ) || null
  );
}

// Parse current URL path, hash, and search params
export function parseCurrentRoute() {
  if (typeof window === 'undefined') {
    return { path: '/', tab: 'Home', showId: null, category: null, watchId: null };
  }

  // Support both standard paths and hash fallback (e.g. #/shows)
  let rawPath = window.location.pathname || '/';
  if (window.location.hash && window.location.hash.startsWith('#/')) {
    rawPath = window.location.hash.slice(1);
  }

  // Remove trailing slashes (except root)
  const normalized = rawPath.length > 1 && rawPath.endsWith('/') ? rawPath.slice(0, -1) : rawPath;
  const searchParams = new URLSearchParams(window.location.search);
  const watchParam = searchParams.get('watch');

  // Match /show/:id or /shows/:id
  const showMatch = normalized.match(/^\/shows?\/([^/]+)/i);
  if (showMatch) {
    const showId = decodeURIComponent(showMatch[1]);
    return {
      path: normalized,
      tab: 'Shows',
      showId,
      category: null,
      watchId: watchParam,
    };
  }

  // Match /category/:cat
  const catMatch = normalized.match(/^\/category\/([^/]+)/i);
  if (catMatch) {
    const slug = decodeURIComponent(catMatch[1]);
    return {
      path: normalized,
      tab: 'Shows',
      showId: null,
      category: parseCategorySlug(slug),
      watchId: watchParam,
    };
  }

  // Match /watch/:id
  const watchMatch = normalized.match(/^\/watch\/([^/]+)/i);
  if (watchMatch) {
    const watchId = decodeURIComponent(watchMatch[1]);
    return {
      path: normalized,
      tab: 'Home',
      showId: null,
      category: null,
      watchId,
    };
  }

  // Tab routes
  const clean = normalized.toLowerCase();
  if (clean === '/live' || clean === '/live-tv') {
    return { path: '/live-tv', tab: 'Live TV', showId: null, category: null, watchId: watchParam };
  }
  if (clean === '/shows') {
    return { path: '/shows', tab: 'Shows', showId: null, category: null, watchId: watchParam };
  }
  if (clean === '/radio') {
    return { path: '/radio', tab: 'Radio', showId: null, category: null, watchId: watchParam };
  }
  if (clean === '/events') {
    return { path: '/events', tab: 'Events', showId: null, category: null, watchId: watchParam };
  }
  if (clean === '/contact') {
    return { path: '/contact', tab: 'Contact', showId: null, category: null, watchId: watchParam };
  }

  // Default Home
  return { path: '/', tab: 'Home', showId: null, category: null, watchId: watchParam };
}

// Navigate programmatically without page reloads
export function navigateTo(targetUrl, replace = false) {
  if (typeof window === 'undefined') return;

  const current = window.location.pathname + window.location.search + window.location.hash;
  if (current === targetUrl) return;

  if (replace) {
    window.history.replaceState(null, '', targetUrl);
  } else {
    window.history.pushState(null, '', targetUrl);
  }

  // Notify router subscribers
  window.dispatchEvent(new Event('popstate'));
}

// Custom hook for subscribing to route changes
export function useRouter() {
  const [route, setRoute] = useState(parseCurrentRoute);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(parseCurrentRoute());
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = useCallback((url, replace = false) => {
    navigateTo(url, replace);
  }, []);

  return { route, navigate };
}
