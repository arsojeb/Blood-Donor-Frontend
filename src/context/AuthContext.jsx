import { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebas.config";
import API from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

     //LOAD USER ON REFRESH-
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // get backend JWT
        const res = await API.post("/jwt", {
          email: firebaseUser.email,
        });

        localStorage.setItem("token", res.data.token);

        // load backend user
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser({ email: firebaseUser.email });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


     //LOGIN (Firebase)
  const login = async (email, password) => {
    // Firebase login
    const result = await signInWithEmailAndPassword(auth, email, password);

    // Backend login (JWT + user info)
    const { data } = await API.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setUser(data.user);
    return result;
  };

 
     //REGISTER (Firebase + DB)
  const register = async (form) => {
    const { email, password } = form;

    // Firebase register
    await createUserWithEmailAndPassword(auth, email, password);

    //Backend register
    await API.post("/auth/register", form);
  };

     //LOGOUT
  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
