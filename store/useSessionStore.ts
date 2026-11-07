import { User } from "@/app/generated/prisma/client";
import { toast } from "@/components/ui/toast";
import { create } from "zustand";

type SessionStore = {
  user: User | null;
  setUser: (user: User | null) => void;
  state: "loading" | "authenticated" | "unauthenticated";
  setState: (state: "loading" | "authenticated" | "unauthenticated") => void;
  fetchUser: () => Promise<void>;
  authDialogState: boolean;
  setAuthDialogState: (state: boolean) => void;
  authDialogType: "login" | "register";
  setAuthDialogType: (type: "login" | "register") => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};
export const useSessionStore = create<SessionStore>((set, get) => ({
  user: null,
  state: "loading",
  authDialogType: "login",
  setAuthDialogType: (type) => set({ authDialogType: type }),
  setUser: (user) => set({ user }),
  setState: (state) => set({ state }),
  authDialogState: false,
  setAuthDialogState: (state) => set({ authDialogState: state }),
  async fetchUser() {
    try {
      const response = await fetch("/api/auth/me");
      const data = await response.json();
      if (response.ok) {
        set({ user: data });
        set({ state: "authenticated" });
        set({ authDialogState: false });
      } else {
        set({ user: null });
        set({ state: "unauthenticated" });
      }
    } catch {
      set({ user: null });
      set({ state: "unauthenticated" });
    }
  },
  login: async (email, password) => {
    try {
      set({ state: "loading" });
      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const data = await response.json();
        toast.danger({ title: data.message });
      }
      get().fetchUser();
    } catch {}
  },
  register: async (email, password) => {
    try {
      set({ state: "loading" });
      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      get().fetchUser();
      if (!response.ok) {
        const data = await response.json();
        toast.danger({ title: data.message });
      }
    } catch {}
  },
  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "GET" });
    } catch {}
    get().fetchUser();
  },
}));
