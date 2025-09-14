import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from './../services/api';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: { name: string; email: string; password: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  refreshToken: () => Promise<string | undefined>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));

  // Set axios default authorization header
  useEffect(() => {
    if (token) {
      authAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete authAPI.defaults.headers.common['Authorization'];
    }
  }, [token]);

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await authAPI.get('/auth/me');
        //console.log("response" , response.data)
        if (response.data.status === 'success') {

          setUser(response.data.user);
        } else {
          logout();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [token]);

  const login: AuthContextType['login'] = async (email, password) => {
    try {
      setLoading(true);
      const response = await authAPI.post('/auth/login', { email, password });
      // console.log("response" , response)
      if (response.data.status === 'success') {
        const { existingUser, token } = response.data;
        // const {_id , name , email} = user
        setUser(existingUser);
        setToken(token);
        localStorage.setItem('auth_token', token);
        toast.success('Login successful!');
        return { success: true };
      } else {
        toast.error(response.data.message || 'Login failed');
        return { success: false, message: response.data.message };
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register: AuthContextType['register'] = async (userData) => {
    try {
      setLoading(true);
      const response = await authAPI.post('/auth/register', userData);
      //console.log("Response" , response)
      if (response.data.status === 'success') {
        const { user, token } = response.data.data;
        setUser(user);
        setToken(token);
        localStorage.setItem('auth_token', token);
        toast.success('Registration successful!');
        return { success: true };
      } else {
        toast.error(response.data.message || 'Registration failed');
        return { success: false, message: response.data.message };
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    delete authAPI.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  };

  const refreshToken: AuthContextType['refreshToken'] = async () => {
    try {
      const response = await authAPI.post('/auth/refresh');
      if (response.data.status === 'success') {
        const newToken = response.data.data.token;
        setToken(newToken);
        localStorage.setItem('auth_token', newToken);
        return newToken;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    refreshToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
