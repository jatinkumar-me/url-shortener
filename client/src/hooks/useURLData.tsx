import { useContext, useEffect, useState } from "react";
import { URLData, URLDispatchContext, URLStateContext, URL_ACTION_KIND } from "../context/urlDataContext";
import { AuthContext } from "../context/authContext";

export default function useURLData() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { auth } = useContext(AuthContext)
  const { urls } = useContext(URLStateContext);
  const dispatchURLData = useContext(URLDispatchContext);

  async function fetchURLs(controller: AbortController) {
    try {
      setIsLoading(true);
      if (!auth.token) {
        throw new Error('auth token not present');
      }
      const response = await fetch(`${import.meta.env.VITE_API_URL}/url`, {
        signal: controller.signal,
        headers: {
          authorization: `Bearer ${auth.token}`
        }
      });
      const urls: URLData[] = await response.json();
      if (Array.isArray(urls)) {
        dispatchURLData({
          type: URL_ACTION_KIND.ADD_MANY,
          payload: urls 
        })
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    fetchURLs(controller);
    return () => controller.abort();
  }, []);

  return {isLoading, urls}
}
