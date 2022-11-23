import { createContext, useContext, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export default function AuthContextProvider({ children }) {
  const [auth, setAuth] = useState({});
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("persist")) || false
  );
  const [gameplay, setGameplay] = useState(new Map([]));

  // --------- SET USER (decrypts access token) ---------

  const setUser = token => setAuth({ ...jwt_decode(token).credentials, token });

  // --------- CLEAR AUTH (for logout) ---------

  const clearAuth = () => setAuth({});

  // useEffect(() => {
  //   console.log(`%cUPDATE GAMEPLAY !!`, "color: aqua");
  //   console.log("gameplay:", gameplay);
  //   const prev = JSON.parse(localStorage.getItem(auth.username));
  //   console.log(prev);
  //   // prev && setGameplay(prev);
  // }, [gameplay]);

  useEffect(() => console.log(gameplay), [gameplay]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setUser,
        persist,
        setPersist,
        clearAuth,
        gameplay,
        setGameplay,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
