"use client";

import { SessionProvider, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { toast } from "sonner";
import { ROUTES } from "./routes";

export default function NextAuthWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <SessionWrapper>{children}</SessionWrapper>
    </SessionProvider>
  );
}

function SessionWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      toast.error("Failed to refresh token");
      signOut({
        callbackUrl: ROUTES.LOGIN,
      });
    }
  }, [session]);

  return <>{children}</>;
}
