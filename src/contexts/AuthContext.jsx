import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { apiUrl } from '../lib/api';

const AuthContext = createContext(null);

/**
 * Access token lives ONLY in memory (never localStorage/sessionStorage) to
 * mitigate XSS token theft. The httpOnly refresh-token cookie is used to
 * silently renew it on page load and before it expires.
 */
export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);      // { id, name, identifier, role }
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);  // true while initial refresh attempt runs

  const refreshTimerRef = useRef(null);

  // ── Refresh access token using the httpOnly cookie ──────────────────────────
  const refresh = useCallback(async () => {
    try {
      const res = await fetch(apiUrl('/api/auth/refresh'), {
        method: 'POST',
        credentials: 'include',  // send the httpOnly rt cookie
      });

      if (!res.ok) {
        setAdmin(null);
        setAccessToken(null);
        return null;
      }

      const { accessToken: newToken } = await res.json();
      setAccessToken(newToken);

      // Decode payload to get expiry and admin info (no signature check needed here)
      const payload = JSON.parse(atob(newToken.split('.')[1]));
      setAdmin({ id: payload.sub, identifier: payload.identifier, role: payload.role });

      // Schedule next refresh 1 minute before token expiry
      const msUntilExpiry = payload.exp * 1000 - Date.now();
      const refreshIn = Math.max(msUntilExpiry - 60_000, 5000);
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = setTimeout(() => refresh(), refreshIn);

      return newToken;
    } catch {
      setAdmin(null);
      setAccessToken(null);
      return null;
    }
  }, []);

  // ── On mount: try to restore session via refresh cookie ─────────────────────
  useEffect(() => {
    refresh().finally(() => setLoading(false));
    return () => clearTimeout(refreshTimerRef.current);
  }, [refresh]);

  // ── Login ────────────────────────────────────────────────────────────────────
  const login = useCallback(async (identifier, password) => {
    const res = await fetch(apiUrl('/api/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ identifier, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    const { accessToken: token, admin: adminData } = data;
    setAccessToken(token);
    setAdmin(adminData);

    // Schedule refresh
    const payload = JSON.parse(atob(token.split('.')[1]));
    const msUntilExpiry = payload.exp * 1000 - Date.now();
    const refreshIn = Math.max(msUntilExpiry - 60_000, 5000);
    clearTimeout(refreshTimerRef.current);
    refreshTimerRef.current = setTimeout(() => refresh(), refreshIn);

    return adminData;
  }, [refresh]);

  // ── Logout ───────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    clearTimeout(refreshTimerRef.current);
    if (accessToken) {
      try {
        await fetch(apiUrl('/api/auth/logout'), {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}` },
          credentials: 'include',
        });
      } catch { /* ignore network errors on logout */ }
    }
    setAdmin(null);
    setAccessToken(null);
  }, [accessToken]);

  // ── Authenticated fetch helper ────────────────────────────────────────────────
  const authFetch = useCallback(async (url, options = {}) => {
    let token = accessToken;

    // If no token in memory, try to refresh once
    if (!token) {
      token = await refresh();
      if (!token) throw new Error('Not authenticated');
    }

    const res = await fetch(apiUrl(url), {
      ...options,
      credentials: 'include',
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        'Content-Type': options.headers?.['Content-Type'] ?? 'application/json',
      },
    });

    // If expired, refresh and retry once
    if (res.status === 401) {
      const body = await res.json().catch(() => ({}));
      if (body.code === 'TOKEN_EXPIRED') {
        token = await refresh();
        if (!token) throw new Error('Session expired. Please log in again.');
        return fetch(apiUrl(url), {
          ...options,
          credentials: 'include',
          headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
            'Content-Type': options.headers?.['Content-Type'] ?? 'application/json',
          },
        });
      }
    }

    return res;
  }, [accessToken, refresh]);

  return (
    <AuthContext.Provider value={{ admin, accessToken, loading, login, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
