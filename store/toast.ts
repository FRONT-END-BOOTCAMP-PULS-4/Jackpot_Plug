import { create } from "zustand";

interface ToastState {
  message: string;
  visible: boolean;
  duration: number;
  show: (msg: string, duration?: number) => void;
  hide: () => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  message: "",
  visible: false,
  duration: 1500,
  show: (msg, duration = get().duration) => {
    set({ message: msg, visible: true, duration });
    setTimeout(() => set({ visible: false }), duration);
  },
  hide: () => set({ visible: false }),
}));
