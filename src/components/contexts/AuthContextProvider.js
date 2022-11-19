import { createContext, useContext, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export default function AuthContextProvider({ children }) {
  const [auth, setAuth] = useState({});
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("persist")) || false
  );

  const setUser = token => {
    const { credentials } = jwt_decode(token);
    const { username, roles } = credentials;
    setAuth({ username, roles, token });
  };

  return (
    <AuthContext.Provider value={{ auth, setUser, persist, setPersist }}>
      {children}
    </AuthContext.Provider>
  );
}
