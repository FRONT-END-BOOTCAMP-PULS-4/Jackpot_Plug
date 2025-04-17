import { LayoutProps } from "../layout";
import RootAside from "./components/sidebar/RootAside";

export default function commonLayout({ children }: LayoutProps) {
  return (
    <div className="root_layout">
      <RootAside />
      <main className="root_main">{children}</main>
    </div>
  );
}
