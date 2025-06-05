import { NextResponse } from "next/server";
import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
import { getSignInUrl } from "./lib/utils";

const isSignInPage = createRouteMatcher(["/sign-in"]);
const isProtectedRoute = createRouteMatcher(["/battle"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  const isAuthenticated = await convexAuth.isAuthenticated();

  if (isSignInPage(request) && isAuthenticated) {
    // TODO: redirect to dashboard or profile page where
    // player can click a button/choose when to battle
    return nextjsMiddlewareRedirect(request, "/battle");
  }

  if (isProtectedRoute(request) && !isAuthenticated) {
    const { pathname, redirect } = getSignInUrl(request.nextUrl.pathname);

    const url = request.nextUrl.clone();
    url.pathname = pathname;

    if (redirect) url.searchParams.set("redirect", redirect);

    return NextResponse.redirect(url);
  }
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
