import { useCallback, useEffect, useState } from "react";

import AuthContext from "./AuthContext";
import api from "../services/api";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const checkAuthentication = async () => {
      try {
        const response = await api.get("/user/me");

        if (!cancelled && response.data?.success) {
          setUser(response.data.user);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    checkAuthentication();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback((userData) => {
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
  try {
    await api.post("/user/logout");
  } catch (error) {
    console.error("PulseHire logout error:", error);
  } finally {
    setUser(null);
  }
}, []);
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
