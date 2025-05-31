"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import {
  Authenticated,
  Unauthenticated,
  AuthLoading,
  useQuery,
} from "convex/react";
import { api } from "../../convex/_generated/api";
import { ThemeToggle } from "~/app/theme-toggle";
import { Skeleton } from "~/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { LogOutIcon } from "lucide-react";
import { SignInButton } from "~/components/sign-in-button";

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
          <SignInButton />
        </Unauthenticated>
        <Authenticated>
          <UserButton />
        </Authenticated>
      </div>
    </header>
  );
}

function UserButton() {
  const router = useRouter();
  const { signOut } = useAuthActions();

  const user = useQuery(api.auth.getMe);

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Hello {user.name}!</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await signOut();
            router.push("/");
          }}
        >
          <LogOutIcon />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
