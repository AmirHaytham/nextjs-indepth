"use client";

import { createContext, use, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import axiosInstance, { registerAuthHandlers } from "./api-client";
import type { User } from "./types";

type AuthValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Slide 016: the interceptor calls these when the backend says 401 or 403.
  useEffect(() => {
    registerAuthHandlers({
      unauthenticated: () => {
        setUser(null);
        router.replace("/login?expired=1");
      },
      forbidden: () => router.push("/unauthorized"),
    });
  }, [router]);

  // Slides 012 and 014: ask the backend who we are when the app loads and on
  // every navigation, so an expired cookie is noticed quickly.
  useEffect(() => {
    axiosInstance
      .get<User>("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [pathname]);

  async function login(email: string, password: string) {
    const res = await axiosInstance.post<{ user: User }>("/auth/login", { email, password });
    setUser(res.data.user);
    router.push("/dashboard");
    router.refresh(); // server components should now see the new cookie
  }

  async function logout() {
    await axiosInstance.post("/auth/logout");
    setUser(null);
    router.push("/login");
    router.refresh();
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = use(AuthContext);
  if (!value) throw new Error("useAuth must be used inside <AuthProvider>");
  return value;
}
