import { create } from "zustand";

type AppStore = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isSidebarOpen: boolean) => void;
  topupDialogOpen: boolean;
  setTopupDialogOpen: (topupDialogOpen: boolean) => void;
};

export const useAppStore = create<AppStore>((set) => ({
  isSidebarOpen: false,
  setIsSidebarOpen: (isSidebarOpen: boolean) => set({ isSidebarOpen }),
  topupDialogOpen: false,
  setTopupDialogOpen: (topupDialogOpen: boolean) => set({ topupDialogOpen }),
}));
