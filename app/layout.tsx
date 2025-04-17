import React from "react";
import "./global.scss";
import Toast from "./component/toast/Toast";

export interface LayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>PLUG : 나만의 플레이리스트 </title>
      </head>
      <body>
        {children}
        <Toast />
        <div id="toast-root" />
        <div id="modal-root" />
      </body>
    </html>
  );
}
