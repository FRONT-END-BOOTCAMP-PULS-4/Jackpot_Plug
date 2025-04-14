import RootAside from "../component/sidebar/RootAside";

export default function commonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="root_layout">
      <RootAside />
      <main>{children}</main>
    </div>
  );
}
