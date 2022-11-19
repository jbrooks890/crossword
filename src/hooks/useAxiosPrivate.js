import { axiosPrivate } from "../apis/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import { useAuth } from "../components/contexts/AuthContextProvider";

export default function useAxiosPrivate() {
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    //  ----------- REQUEST handler -----------

    const requestIntercept = axiosPrivate.interceptors.request.use(
      config => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      err => Promise.reject(err)
    );

    //  ----------- RESPONSE handler -----------

    // TODO: what are interceptors?
    const responseIntercept = axiosPrivate.interceptors.response.use(
      response => response,
      async err => {
        const prev = err?.config;
        if (err?.response?.status === 403 && !prev?.sent) {
          prev.sent = true; // prevents endless loop of 403's
          const newToken = await refresh();
          prev.headers["Authorization"] = `Bearer ${newToken}`;
          return axiosPrivate(prev);
        }
        return Promise.reject(err);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return axiosPrivate;
}
