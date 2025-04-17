import { useToastStore } from "../store/toast";

export function useToast() {
  const show = useToastStore((s) => s.show);
  const hide = useToastStore((s) => s.hide);

  const showToast = (msg: string, duration?: number) => {
    show(msg, duration);
  };

  return { showToast, hideToast: hide };
}
