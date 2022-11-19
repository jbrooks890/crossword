import axios from "../apis/axios";
import { useAuth } from "../components/contexts/AuthContextProvider";

export default function useRefreshToken() {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get("/refresh", {
      withCredentials: true,
    });
    const token = response?.data.accessToken;
    console.log({ token });

    setAuth(prev => {
      console.log(JSON.stringify(prev));
      return { ...prev, accessToken: token };
    });

    return token;
  };

  return refresh;
}
