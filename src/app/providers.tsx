"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { env } from "~/env";

import { usePostHog, PostHogProvider as PHProvider } from "posthog-js/react";
import posthog from "posthog-js";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: "/events",
      ui_host: "https://us.posthog.com",
      person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually
    });
  }, []);

  return (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView />
      {children}
    </PHProvider>
  );
}

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  // Track pageviews
  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url = url + "?" + searchParams.toString();
      }

      posthog.capture("$pageview", { $current_url: url });
    }
  }, [pathname, searchParams, posthog]);

  return null;
}

// Wrap PostHogPageView in Suspense to avoid the useSearchParams usage above
// from de-opting the whole app into client-side rendering
// See: https://nextjs.org/docs/messages/deopted-into-client-rendering
function SuspendedPostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  );
}

// import { ClerkProvider, useAuth } from "@clerk/nextjs";
// import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient, ConvexProvider } from "convex/react";

const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL);

export function ConvexClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <ClerkProvider>
    <ConvexProvider client={convex}>{children}</ConvexProvider>
    // </ClerkProvider>
  );
}

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
