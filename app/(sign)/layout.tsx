import Toast from "../components/toast/Toast";

import { LayoutProps } from "../layout";

export default function signLayout({ children }: LayoutProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <div id="toast-root" />
      <Toast />
      <main>{children}</main>
    </div>
  );
}
