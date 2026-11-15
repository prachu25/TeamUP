
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

import {
  api,
  clearSession,
  encodeBasic,
  readSession,
  writeSession
} from '../services/api.js';

import { LOGIN_USER_ID_FIELD } from '../config/contracts.js';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readSession());

  // Save session in localStorage and update React state
  const persist = useCallback((data) => {
    writeSession(data);
    setSession(data);
  }, []);

  // Login
  const login = useCallback(async ({ email, password }) => {
    const data = await api.login({ email, password });

    const fromResponse =
      LOGIN_USER_ID_FIELD &&
        data &&
        typeof data === 'object'
        ? data[LOGIN_USER_ID_FIELD]
        : null;

    persist({
      email,
      token: encodeBasic(email, password),
      userId: fromResponse ?? null,
      loginResponse: data ?? null
    });
  }, [persist]);

  // Logout
  const logout = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  // Save user ID
  const setUserId = useCallback((userId) => {
    const currentSession = readSession();

    if (!currentSession) return;

    persist({
      ...currentSession,
      userId:
        userId !== null && userId !== undefined && String(userId).trim()
          ? String(userId).trim()
          : null
    });
  }, [persist]);

  // Handle unauthorized API responses
  useEffect(() => {
    const onUnauthorized = () => {
      clearSession();
      setSession(null);
    };

    window.addEventListener('teamup:unauthorized', onUnauthorized);

    return () => {
      window.removeEventListener('teamup:unauthorized', onUnauthorized);
    };
  }, []);

  // Context values
  const value = useMemo(
    () => ({
      session,
      isAuthenticated: !!session?.token,
      userId: session?.userId ?? null,
      login,
      logout,
      setUserId
    }),
    [session, login, logout, setUserId]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
