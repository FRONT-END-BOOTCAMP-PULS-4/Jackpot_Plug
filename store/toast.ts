import { create } from "zustand";

export type ToastType = "default" | "error" | "success";

interface ToastState {
  message: string;
  visible: boolean;
  duration: number;
  type?: ToastType;
  show: (msg: string, duration?: number, toastType?: ToastType) => void;
  hide: () => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  message: "",
  visible: false,
  duration: 1500,
  toastType: "default",
  show: (msg, duration = get().duration, toastType = "default") => {
    set({ message: msg, visible: true, duration, type: toastType });
    setTimeout(() => set({ visible: false }), duration);
  },
  hide: () => set({ visible: false }),
}));
