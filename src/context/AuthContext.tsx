import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "@/lib/toast";

type User = {
  id: string;
  username: string;
  email: string;
  role: "admin" | "user";
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const MOCK_USERS = [
  {
    id: "1",
    username: "admin",
    email: "admin@skillhub.com",
    password: "admin123",
    role: "admin" as const,
  },
  {
    id: "2",
    username: "user",
    email: "user@skillhub.com",
    password: "user123",
    role: "user" as const,
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("skillhub_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("skillhub_user", JSON.stringify(userWithoutPassword));
      toast.success(`Welcome back, ${userWithoutPassword.username}!`);
    } else {
      toast.error("Invalid email or password");
      throw new Error("Invalid email or password");
    }
    
    setIsLoading(false);
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const exists = MOCK_USERS.some((u) => u.email === email);
    
    if (exists) {
      toast.error("User with this email already exists");
      throw new Error("User already exists");
    }
    
    // In a real app, we would create a new user in the database
    const newUser = {
      id: String(MOCK_USERS.length + 1),
      username,
      email,
      role: "user" as const,
    };
    
    setUser(newUser);
    localStorage.setItem("skillhub_user", JSON.stringify(newUser));
    toast.success("Registration successful!");
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("skillhub_user");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        register,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
