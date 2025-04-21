import { LayoutProps } from "../layout";

export default function signLayout({ children }: LayoutProps) {
  return (
    <div className="sign_layout">
      <main>{children}</main>
    </div>
  );
}
