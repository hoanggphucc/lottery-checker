import AppHeader from "@/components/header/app.header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppHeader />
      <div className="px-2">{children}</div>
    </>
  );
}
