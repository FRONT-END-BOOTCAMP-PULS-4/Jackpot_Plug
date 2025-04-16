import { LayoutProps } from "../layout";
import RootAside from "../component/sidebar/RootAside";

export default function commonLayout({ children }: LayoutProps) {
  return (
    <div className="root_layout">
      <RootAside />
      <main>{children}</main>
    </div>
  );
}
