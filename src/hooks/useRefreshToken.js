import axios from "../apis/axios";
import { useAuth } from "../components/contexts/AuthContextProvider";

export default function useRefreshToken() {
  const { setUser } = useAuth();

  const refresh = async () => {
    const response = await axios.get("/refresh", {
      withCredentials: true,
    });

    const token = response.data.accessToken;
    console.log({ token });
    setUser(token);

    return token;
  };

  return refresh;
}
