import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../services/auth.api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [status, setStatus] = useState("loading");

  /* =====================================================
     RESTORE SESSION
     ===================================================== */

  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      try {
        const response = await getCurrentUser();

        const data = response.data;

        if (cancelled) {
          return;
        }

        if (data?.success && data?.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }

        setStatus("ready");
      } catch (error) {
        if (cancelled) {
          return;
        }

        if (error?.response?.status !== 401) {
          console.error("Restore auth session error:", error);
        }

        setUser(null);
        setStatus("ready");
      }
    };

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =====================================================
     LOGIN
     ===================================================== */

  const login = useCallback(async (credentials) => {
    const response = await loginUser(credentials);

    const data = response.data;

    if (!data?.success) {
      const error = new Error(data?.message || "Unable to log in.");

      error.response = response;

      throw error;
    }

    setUser(data.user);

    setStatus("ready");

    return data;
  }, []);

  /* =====================================================
     REGISTER
     ===================================================== */

  const register = useCallback(async (payload) => {
    const response = await registerUser(payload);

    const data = response.data;

    if (!data?.success) {
      const error = new Error(
        data?.message || "Unable to create your account.",
      );

      error.response = response;

      throw error;
    }

    return data;
  }, []);

  /* =====================================================
     LOGOUT
     ===================================================== */

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout request error:", error);
    } finally {
      setUser(null);
      setStatus("ready");
    }
  }, []);

  /* =====================================================
     MANUAL SESSION REFRESH
     ===================================================== */

  const refreshUser = useCallback(async () => {
    try {
      const response = await getCurrentUser();

      const data = response.data;

      if (data?.success && data?.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }

      setStatus("ready");

      return data;
    } catch (error) {
      if (error?.response?.status !== 401) {
        console.error("Refresh auth session error:", error);
      }

      setUser(null);
      setStatus("ready");

      throw error;
    }
  }, []);

  /* =====================================================
     CONTEXT VALUE
     ===================================================== */

  const value = useMemo(
    () => ({
      user,

      isAuthenticated: Boolean(user),

      isLoading: status === "loading",

      status,

      login,

      register,

      logout,

      refreshUser,
    }),
    [user, status, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
