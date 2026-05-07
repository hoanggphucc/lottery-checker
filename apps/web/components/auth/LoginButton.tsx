"use client";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import Link from "next/link";

const LoginButton = () => {
  return (
    <Button>
      <Link href={ROUTES.LOGIN}>Login</Link>
    </Button>
  );
};

export default LoginButton;
