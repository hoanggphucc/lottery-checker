import AppHeader from "@/components/header/AppHeader";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppHeader />
      <div className="px-2 py-4 flex justify-center">
        <div className="w-full max-w-[500px]">{children}</div>
      </div>
    </>
  );
}
