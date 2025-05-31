"use client";

import { usePathname } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "~/components/ui/button";

export function SignInButton() {
  const { signIn } = useAuthActions();
  const pathname = usePathname();

  return (
    <Button onClick={() => signIn("github", { redirectTo: pathname })}>
      Sign In
    </Button>
  );
}
