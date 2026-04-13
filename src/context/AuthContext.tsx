import React, { createContext, useContext, useState } from 'react';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export type User = {
  id: string;
  name: string;
  username: string;
  mobileNumber?: string;
  role: 'user' | 'admin';
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password?: string) => Promise<boolean>;
  register: (username: string, password: string, mobileNumber: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  register: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('heman_user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const login = async (username: string, password?: string): Promise<boolean> => {
    if (username === 'srivenkateshwara@owner' && password === 'charan@shop') {
      const adminUser: User = { id: 'admin', name: 'Admin', username, role: 'admin' };
      setUser(adminUser);
      localStorage.setItem('heman_user', JSON.stringify(adminUser));
      return true;
    } else if (username && password) {
      try {
        const q = query(collection(db, 'users'), where('username', '==', username), where('password', '==', password));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data();
          const normalUser: User = { 
            id: querySnapshot.docs[0].id, 
            name: username.split('@')[0] || username, 
            username, 
            mobileNumber: docData.mobileNumber,
            role: 'user' 
          };
          setUser(normalUser);
          localStorage.setItem('heman_user', JSON.stringify(normalUser));
          return true;
        }
      } catch (err) {
        console.error("Login Error: ", err);
      }
    }
    return false;
  };

  const register = async (username: string, password: string, mobileNumber: string): Promise<boolean> => {
    try {
      // Check if user already exists
      const q = query(collection(db, 'users'), where('username', '==', username));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // User already exists
        return false;
      }
      
      // Create new user in DB
      const userId = Date.now().toString();
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        username,
        password,
        mobileNumber,
        role: 'user', // default role
        createdAt: new Date().toISOString()
      });
      
      const normalUser: User = { 
        id: userId, 
        name: username.split('@')[0] || username, 
        username, 
        mobileNumber,
        role: 'user' 
      };
      
      setUser(normalUser);
      localStorage.setItem('heman_user', JSON.stringify(normalUser));
      return true;
      
    } catch (err) {
      console.error("Registration Error: ", err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('heman_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
