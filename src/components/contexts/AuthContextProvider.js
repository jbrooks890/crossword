import { createContext, useContext, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export default function AuthContextProvider({ children }) {
  const [auth, setAuth] = useState({});
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("persist")) || false
  );

  // --------- SET USER (decrypts access token) ---------

  const setUser = token => {
    const { credentials } = jwt_decode(token);
    const { username, roles } = credentials;
    setAuth({ username, roles, token });
  };

  // --------- CLEAR AUTH (for logout) ---------

  const clearAuth = () => setAuth({});

  return (
    <AuthContext.Provider
      value={{ auth, setUser, persist, setPersist, clearAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}
