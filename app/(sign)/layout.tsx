import Toast from "../components/toast/Toast";

import { LayoutProps } from "../layout";

export default function signLayout({ children }: LayoutProps) {
  return (
    <>
      <div
        id="toast-root"
        style={{
          position: "fixed",
          zIndex: 9999,
          pointerEvents: "none",
        }}
      />
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
