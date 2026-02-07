import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { User } from "./types";
import { DEMO_USERS } from "./mockData";

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => string | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("helpdesk_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((username: string, password: string): string | null => {
    const found = DEMO_USERS.find(
      (u) => u.username === username && u.password === password
    );
    if (!found) return "Invalid credentials. Try student/student123 or admin/admin123";
    setUser(found);
    localStorage.setItem("helpdesk_user", JSON.stringify(found));
    return null;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("helpdesk_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
