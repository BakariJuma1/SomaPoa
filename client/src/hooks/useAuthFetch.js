import { useCallback } from "react";

const useAuthFetch = () => {
  // Refresh token function
  const refreshToken = async () => {
    try {
      const res = await fetch("http://localhost:5555/refresh", {
        method: "POST",
        credentials: "include",
      });
      return res.ok;
    } catch (err) {
      console.error("Token refresh failed:", err);
      return false;
    }
  };

  // Authenticated fetch with automatic refresh
  const authFetch = useCallback(async (url, options = {}) => {
    let res = await fetch(url, {
      ...options,
      credentials: "include",
    });

    if (res.status === 401) {
      const refreshed = await refreshToken();
      if (refreshed) {
        res = await fetch(url, {
          ...options,
          credentials: "include",
        });
      }
    }

    return res;
  }, []);

  return authFetch;
};

export default useAuthFetch;
