import { createContext, useState, useEffect, useMemo } from "react";
import useAuthFetch from "../hooks/useAuthFetch";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const authFetch = useAuthFetch();
  const [user, setUser] = useState(null); // null = loading, {} = guest, {...} = logged in

  useEffect(() => {
    let isMounted = true;
    
    const checkSession = async () => {
      try {
        const res = await authFetch("https://somapoa.onrender.com/me");
        if (!isMounted) return;
        
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser({});
        }
      } catch (err) {
        if (isMounted) setUser({});
      }
    };

    checkSession();
    return () => { isMounted = false; };
  }, [authFetch]);

  // Memoize context value to optimize performance
  const contextValue = useMemo(() => ({
    user,
    setUser,
    isAuthenticated: !!user?.id, // Helper for checking auth status
    isLoading: user === null,    // Helper for checking loading state
  }), [user]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};