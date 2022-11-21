// import axios from "axios";
import axios from "../apis/axios";
import { useAuth } from "../components/contexts/AuthContextProvider";

export default function useLogout() {
  const { clearAuth: clear } = useAuth();

  const logout = async () => {
    clear();
    try {
      const response = await axios("/logout", { withCredentials: true });
    } catch (err) {
      console.log(err);
    }
  };

  return logout;
}
