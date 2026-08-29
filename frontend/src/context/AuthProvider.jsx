import { useCallback, useState } from "react";

import AuthContext from "./AuthContext";


const getStoredUser = () => {
  try {
    const storedUser =
      localStorage.getItem("pulsehireUser");

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser);

  } catch (error) {

    console.error(
      "Unable to restore PulseHire user:",
      error
    );

    localStorage.removeItem("pulsehireUser");

    return null;
  }
};


const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(getStoredUser);


  /* =====================================================
     LOGIN
  ===================================================== */

  const login = useCallback((userData) => {

    setUser(userData);

    localStorage.setItem(
      "pulsehireUser",
      JSON.stringify(userData)
    );

  }, []);


  /* =====================================================
     LOGOUT
  ===================================================== */

  const logout = useCallback(() => {

    setUser(null);

    localStorage.removeItem(
      "pulsehireUser"
    );

  }, []);


  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export default AuthProvider;