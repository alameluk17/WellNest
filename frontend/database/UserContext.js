import React, { createContext, useContext, useState, useEffect } from "react";
import { firebase_auth } from "../database/firebaseconfig"; // Import your Firebase authentication instance

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = firebase_auth.onAuthStateChanged(user => {
      if (user) {
        // User is signed in
        setUserEmail(user.email);
      } else {
        // User is signed out
        setUserEmail(null);
      }
    });

    // Clean up subscription
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ userEmail }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
