import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSignInUrl(pathname: string) {
  if (pathname === "/sign-in" || pathname === "/")
    return {
      pathname: "/sign-in",
      redirect: "",
      fullPath: "/sign-in",
    };

  return {
    pathname: "/sign-in",
    redirect: pathname,
    fullPath: `/sign-in?redirect=${pathname}`,
  };
}
