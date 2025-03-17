
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

// Create a default user for demo purposes
const DEMO_USER: User = {
  id: "user_demo",
  name: "Demo User",
  phone: "9876543210",
  village: MOCK_VILLAGES[0],
  role: "resident",
  avatar: undefined
};

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with the demo user for easy testing
  const [user, setUser] = useState<User | null>(DEMO_USER);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
        // Fall back to demo user
        setUser(DEMO_USER);
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
      await new Promise(resolve => setTimeout(resolve, 500));
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
      // Simulate API call - shortened for demo
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Always succeed for demo
      const village = villages.find(v => v.id === villageId) || villages[0];

      // Create mock user
      const newUser: User = {
        id: `user_${Date.now()}`,
        name: "Demo User",
        phone,
        village,
        role: "resident",
      };

      setUser(newUser);
      toast.success("Login successful");
    } catch (error) {
      toast.error("Login failed. Please try again.");
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
      // Simulate API call - shortened for demo
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const village = villages.find(v => v.id === villageId) || villages[0];

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
      toast.error("Signup failed. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // For demo, don't actually log out
    toast.success("This is a demo - you would be logged out in a real app");
    // If we wanted to actually log out:
    // setUser(null);
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
