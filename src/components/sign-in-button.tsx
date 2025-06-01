"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "~/components/ui/button";
import { SiGithub } from "@icons-pack/react-simple-icons";

export function SignInButton() {
  return (
    <Button asChild>
      <Link href="/sign-in">Sign In</Link>
    </Button>
  );
}

export function GitHubSignInButton() {
  const { signIn } = useAuthActions();
  const pathname = usePathname();

  return (
    <Button onClick={() => signIn("github", { redirectTo: pathname })}>
      <SiGithub />
      <span>Sign In with GitHub</span>
    </Button>
  );
}

export function AnonymousSignInButton() {
  const { signIn } = useAuthActions();
  const pathname = usePathname();

  return (
    <Button
      variant="secondary"
      onClick={() => signIn("anonymous", { redirectTo: pathname })}
    >
      Continue as Guest
    </Button>
  );
}
