// src/context/AuthContext.jsx
import React, { useState, createContext, useContext, useMemo, useCallback } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || null);
  const [userToken, setUserToken] = useState(localStorage.getItem('userToken') || null);
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const isAuthReady = true;

  const adminLogin = useCallback((token) => {
    localStorage.setItem('adminToken', token);
    setAdminToken(token);
  }, []);

  const adminLogout = useCallback(() => {
    localStorage.removeItem('adminToken');
    setAdminToken(null);
  }, []);

  const userLogin = useCallback((token, userDetails) => {
    localStorage.setItem('userToken', token);
    localStorage.setItem('user', JSON.stringify(userDetails));
    setUserToken(token);
    setUser(userDetails);
  }, []);

  const userLogout = useCallback(() => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    setUserToken(null);
    setUser(null);
  }, []);

  const signOut = useCallback(() => {
    adminLogout();
    userLogout();
  }, [adminLogout, userLogout]);

  const value = useMemo(
    () => ({
      isAuthReady,
      adminToken,
      adminLogin,
      adminLogout,
      userToken,
      user,
      userLogin,
      userLogout,
      signOut
    }),
    [isAuthReady, adminToken, adminLogin, adminLogout, userToken, user, userLogin, userLogout, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
