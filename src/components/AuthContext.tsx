import { createContext, useState, useContext, ReactNode } from "react";

interface User {
  username: string;
  email: string;
  // Add other user properties as needed
}

interface AuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (
    isAdmin: boolean,
    tokens: { access: string; refresh: string },
    userData: User
  ) => void;
  logout: () => void;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const login = (
    isAdmin: boolean,
    tokens: { access: string; refresh: string },
    userData: User
  ) => {
    localStorage.setItem("accessToken", tokens.access);
    localStorage.setItem("refreshToken", tokens.refresh);
    setUser(userData);
    setIsLoggedIn(true);
    setIsAdmin(isAdmin);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
