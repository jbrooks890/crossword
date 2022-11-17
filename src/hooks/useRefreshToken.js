import axios from "axios";
import { useAuth } from "../components/contexts/AuthContextProvider";

export default function useRefreshToken() {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get("/refresh", {
      withCredentials: true,
    });
    const token = response?.data.accessToken;
    setAuth(prev => {
      console.log(JSON.stringify(prev));
      console.log({ token });
      return { ...prev, accessToken: token };
    });
    return token;
  };

  return refresh;
}
