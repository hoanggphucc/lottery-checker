"use client";

import Image from "next/image";
import LoginButton from "@/components/auth/LoginButton";
import { useSession } from "next-auth/react";
import LogoutButton from "@/components/auth/LogoutButton";

const AppHeader = () => {
  const { data: session } = useSession();

  return (
    <div className="flex justify-between items-center px-6 h-[56px]">
      <Image
        className="dark:invert"
        src="/next.svg"
        alt="Next.js logo"
        width={100}
        height={20}
        priority
      />
      {!session ? <LoginButton /> : <LogoutButton />}
    </div>
  );
};

export default AppHeader;
