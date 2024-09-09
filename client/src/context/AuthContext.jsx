import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const localData = sessionStorage.getItem('auth');
    return localData ? JSON.parse(localData) : { isAuthenticated: false, role: null, adminId: null, employeeId: null };
  });

  useEffect(() => {
    sessionStorage.setItem('auth', JSON.stringify(auth));
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};