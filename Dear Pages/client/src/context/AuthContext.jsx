import React, { createContext, useState, useEffect } from 'react';
import client from '../api/client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('vaultToken');
      const savedUser = localStorage.getItem('familyUser');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser)); 
        } catch (error) {
          console.error("Auth State Corrupted");
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const { data } = await client.post('/auth/login', { email, password });
    handleAuthSuccess(data);
  };

  const signup = async (name, email, password) => {
    const { data } = await client.post('/auth/signup', { name, email, password });
    handleAuthSuccess(data);
  };

  const handleAuthSuccess = (data) => {
    localStorage.setItem('vaultToken', data.token);
    const userObj = data.user || data.data; 
    localStorage.setItem('familyUser', JSON.stringify(userObj));
    setUser(userObj);
  };

  const logout = () => {
    localStorage.removeItem('vaultToken');
    localStorage.removeItem('familyUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};