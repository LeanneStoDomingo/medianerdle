"use client";

import Link from "next/link";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "~/app/theme-toggle";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";

export function Header() {
  return (
    <header className="container mx-auto flex items-center justify-between p-4">
      <Link href="/" className="text-2xl">
        MediaNerdle
      </Link>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <AuthLoading>
          <Skeleton className="h-8 w-8 rounded-full" />
        </AuthLoading>
        <Unauthenticated>
          <Button asChild>
            <SignInButton />
          </Button>
        </Unauthenticated>
        <Authenticated>
          <UserButton />
        </Authenticated>
      </div>
    </header>
  );
}
