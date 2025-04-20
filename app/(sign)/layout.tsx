import Toast from "../components/toast/Toast";

import { LayoutProps } from "../layout";

export default function signLayout({ children }: LayoutProps) {
  return (
    <>
      <div id="toast-root" />
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 9999,
        }}
      >
        <Toast />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <main>{children}</main>
      </div>
    </>
  );
}
