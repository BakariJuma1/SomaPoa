import { createContext, useState, useEffect } from "react";
import useAuthFetch from "../hooks/useAuthFetch";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const authFetch = useAuthFetch();
  const [user, setUser] = useState(null); // null = loading, {} = guest, {...} = logged in

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await authFetch("http://localhost:5555/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data); // { id, role }
        } else {
          setUser({});
        }
      } catch {
        setUser({});
      }
    };

    checkSession();
  }, [authFetch]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
