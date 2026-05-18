import { create } from "zustand";
import { User } from "@/lib/types";

interface AuthStore {
  user: User | null;
  token: string | null;
  selectedPlanId: number | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setSelectedPlanId: (planId: number | null) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  checkSubscription: () => Promise<boolean>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  selectedPlanId: null,

  setUser: (user) => set({ user }),

  setToken: (token) => {
    set({ token });
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  },

  setSelectedPlanId: (planId) => set({ selectedPlanId: planId }),

  logout: () => {
    set({ user: null, token: null, selectedPlanId: null });
    localStorage.removeItem("token");
  },

  isAuthenticated: () => {
    return get().user !== null && get().token !== null;
  },

  checkSubscription: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;

      const response = await fetch("http://localhost:8082/api/payments/subscriptions/active", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) return false;

      const data = await response.json();
      return data.hasActiveSubscription || false;
    } catch (error) {
      console.error("Error checking subscription:", error);
      return false;
    }
  },
}));
