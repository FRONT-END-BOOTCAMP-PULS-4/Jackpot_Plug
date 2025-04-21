import { ToastType, useToastStore } from "../store/toast";

export function useToast() {
  const show = useToastStore((s) => s.show);
  const hide = useToastStore((s) => s.hide);

  const showToast = (msg: string, duration?: number, toastType?: ToastType) => {
    show(msg, duration, toastType);
  };

  return { showToast, hideToast: hide };
}
