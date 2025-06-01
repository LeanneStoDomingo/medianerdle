"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "~/components/ui/button";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { getSignInUrl } from "~/lib/utils";

export function SignInButton() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const redirect = decodeURIComponent(searchParams.get("redirect") ?? "");

  return (
    <Button asChild>
      <Link href={getSignInUrl(redirect || pathname).fullPath}>Sign In</Link>
    </Button>
  );
}

export function GitHubSignInButton() {
  const { signIn } = useAuthActions();
  const searchParams = useSearchParams();

  return (
    <Button
      onClick={() =>
        signIn("github", {
          redirectTo: decodeURIComponent(searchParams.get("redirect") ?? "/"),
        })
      }
    >
      <SiGithub />
      <span>Sign In with GitHub</span>
    </Button>
  );
}

export function AnonymousSignInButton() {
  const { signIn } = useAuthActions();
  const searchParams = useSearchParams();

  return (
    <Button
      variant="secondary"
      onClick={() =>
        signIn("anonymous", {
          redirectTo: decodeURIComponent(searchParams.get("redirect") ?? "/"),
        })
      }
    >
      Continue as Guest
    </Button>
  );
}
