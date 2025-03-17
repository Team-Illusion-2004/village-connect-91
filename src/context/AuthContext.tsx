
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

// Types
type Village = {
  id: string;
  name: string;
};

type User = {
  id: string;
  name: string;
  phone: string;
  village: Village;
  role: "resident" | "volunteer" | "panchayat";
  avatar?: string;
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  villages: Village[];
  login: (phone: string, otp: string, villageId: string) => Promise<void>;
  signup: (name: string, phone: string, villageId: string, role: User["role"]) => Promise<void>;
  logout: () => void;
  requestOtp: (phone: string) => Promise<void>;
}

// Mock data for demo
const MOCK_VILLAGES: Village[] = [
  { id: "v1", name: "Rampura" },
  { id: "v2", name: "Chittorgarh" },
  { id: "v3", name: "Bhilwara" },
  { id: "v4", name: "Pratapgarh" },
  { id: "v5", name: "Udaipur" },
];

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [villages] = useState<Village[]>(MOCK_VILLAGES);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("village_connect_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse saved user:", error);
        localStorage.removeItem("village_connect_user");
      }
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("village_connect_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("village_connect_user");
    }
  }, [user]);

  const requestOtp = async (phone: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("OTP sent to your phone");
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (phone: string, otp: string, villageId: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, we would verify the OTP with a backend service
      // For demo purposes, we'll just check if OTP is "1234"
      if (otp !== "1234") {
        throw new Error("Invalid OTP");
      }

      const village = villages.find(v => v.id === villageId);
      if (!village) {
        throw new Error("Village not found");
      }

      // Create mock user
      const newUser: User = {
        id: `user_${Date.now()}`,
        name: "Demo User", // In a real app, we would get this from the backend
        phone,
        village,
        role: "resident",
      };

      setUser(newUser);
      toast.success("Login successful");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Login failed. Please try again.");
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    name: string, 
    phone: string, 
    villageId: string, 
    role: User["role"]
  ): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const village = villages.find(v => v.id === villageId);
      if (!village) {
        throw new Error("Village not found");
      }

      // Create mock user
      const newUser: User = {
        id: `user_${Date.now()}`,
        name,
        phone,
        village,
        role,
      };

      setUser(newUser);
      toast.success("Signup successful");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Signup failed. Please try again.");
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        villages,
        login,
        signup,
        logout,
        requestOtp,
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
