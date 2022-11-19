import { useEffect, useState } from "react";

export default function useAxios() {
  const [response, setResponse] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [controller, setController] = useState();

  const fetch = async config => {
    const { instance, method, url } = config;
    const ctrl = new AbortController();

    setController(ctrl);
    try {
      setLoading(true);
      const res = await instance[method.toLowerCase()](url, {
        ...config,
        signal: ctrl.signal,
      });
      console.log(res); // TODO: remove after test
      setResponse(res.data);
    } catch (err) {
      console.log(err.message); // TODO: remove after test
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => controller && controller.abort(); //optional chaining?
  }, [controller]);

  return [response, error, loading, fetch];
}
