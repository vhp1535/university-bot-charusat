import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { User } from "./types";
import { DEMO_USERS } from "./mockData";

const USERS_KEY = "helpdesk_users";

function getStoredUsers(): User[] {
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [...DEMO_USERS];
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => string | null;
  signup: (username: string, password: string, name: string) => string | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("helpdesk_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((username: string, password: string): string | null => {
    const users = getStoredUsers();
    const found = users.find(
      (u) => u.username === username && u.password === password
    );
    if (!found) return "Invalid credentials";
    setUser(found);
    localStorage.setItem("helpdesk_user", JSON.stringify(found));
    return null;
  }, []);

  const signup = useCallback((username: string, password: string, name: string): string | null => {
    if (username.length < 3) return "Username must be at least 3 characters";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (!name.trim()) return "Name is required";
    const users = getStoredUsers();
    if (users.find((u) => u.username === username)) return "Username already taken";
    const newUser: User = { username, password, role: "student", name: name.trim() };
    users.push(newUser);
    saveUsers(users);
    setUser(newUser);
    localStorage.setItem("helpdesk_user", JSON.stringify(newUser));
    return null;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("helpdesk_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
