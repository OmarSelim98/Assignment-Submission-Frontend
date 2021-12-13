import { useLocation, Navigate } from "react-router-dom";
import { createContext, useContext, useState } from "react";
import axios from "axios";

let AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [isAuth, setAuth] = useState(false);

  let signin = async (newUser, callback) => {
    const res = await axios.post("http://localhost:8080/login", newUser);
    if (res.error) {
      console.log(res.error);
    } else {
      setUser(res.data.user);
      setAuth(true);
      callback();
    }
  };
  let value = { user, signin };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export function RequireAuth({ children }) {
  let auth = useAuth();
  let location = useLocation();

  if (!auth.user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} />;
  }
  console.log(auth);

  return children;
}
