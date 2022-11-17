import axios from "axios";
import { useAuth } from "../components/contexts/AuthContextProvider";

export default function useLogout() {
  const { setAuth } = useAuth();

  const logout = async () => {
    setAuth({});
    try {
      const response = await axios("/logout", { withCredentials: true });
    } catch (err) {
      console.log(err);
    }
  };

  return logout;
}
