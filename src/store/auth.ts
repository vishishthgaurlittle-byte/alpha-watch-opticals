"use client";
import { create } from "zustand";
import type { User } from "@/lib/types";
import {
  registerUser,
  loginEmail,
  loginGoogle,
  loginOtp,
  setSession,
  currentUserFromDB,
  updateProfile,
  setUserBlocked,
  setUserRole
} from "@/lib/db";

interface AuthState {
  user: User | null;
  hydrated: boolean;
  register: (d: { name: string; email: string; phone: string; password: string }) => Promise<string | null>;
  login: (email: string, password: string) => Promise<string | null>;
  googleLogin: (p: { email: string; name: string; picture?: string }) => string | null;
  otpLogin: (phone: string, name: string) => string | null;
  logout: () => void;
  hydrate: () => void;
  refresh: () => void;
  saveProfile: (patch: Partial<User>) => void;
  adminSetBlocked: (id: string, blocked: boolean) => void;
  adminSetRole: (id: string, role: "customer" | "admin") => void;
  setUser: (u: User | null) => void;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  hydrated: false,

  hydrate: () => {
    const u = currentUserFromDB();
    set({ user: u, hydrated: true });
  },

  refresh: () => {
    set({ user: currentUserFromDB() });
  },

  register: async (d) => {
    const res = registerUser(d);
    if (res.error) return res.error;
    setSession(res.user!.id);
    set({ user: res.user! });
    return null;
  },

  login: async (email, password) => {
    const res = loginEmail(email, password);
    if (res.error) return res.error;
    setSession(res.user!.id);
    set({ user: res.user! });
    return null;
  },

  googleLogin: (p) => {
    const { user } = loginGoogle(p);
    setSession(user.id);
    set({ user });
    return null;
  },

  otpLogin: (phone, name) => {
    const { user } = loginOtp(phone, name);
    setSession(user.id);
    set({ user });
    return null;
  },

  logout: () => {
    setSession(null);
    set({ user: null });
  },

  saveProfile: (patch) => {
    if (!get().user) return;
    updateProfile(get().user!.id, patch);
    get().refresh();
  },

  adminSetBlocked: (id, blocked) => {
    setUserBlocked(id, blocked);
    get().refresh();
  },

  adminSetRole: (id, role) => {
    setUserRole(id, role);
    get().refresh();
  },

  setUser: (u) => set({ user: u })
}));
