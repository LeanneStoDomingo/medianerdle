import { convexAuth, getAuthUserId } from "@convex-dev/auth/server";
import GitHub from "@auth/core/providers/github";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import {
  query,
  internalMutation,
  type QueryCtx,
  type MutationCtx,
} from "./_generated/server";
import { asyncMap } from "convex-helpers";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    GitHub({
      profile: (profile, token) => {
        return {
          id: profile.id.toString(),
          name: profile.name,
          email: profile.email,
          avatar: profile.avatar_url,
        };
      },
    }),
    Anonymous({
      profile: (profile, ctx) => {
        const randomNumber = Math.floor(Math.random() * 10000)
          .toString()
          .padStart(4, "0");

        return {
          isAnonymous: true,
          name: `User${randomNumber}`,
        };
      },
    }),
  ],
});

export async function getAuthUser(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);

  if (!userId) return null;

  return await ctx.db.get(userId);
}

export const getMe = query({
  args: {},
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    if (!user) return null;

    const [firstName, secondName] = user.name.split(" ");

    let initials = "";

    const firstInitial = firstName?.charAt(0).toUpperCase();
    if (!!firstInitial) initials += firstInitial;

    const secondInitial = secondName?.charAt(0).toUpperCase();
    if (!!secondInitial) initials += secondInitial;

    return { name: user.name, avatar: user.avatar, initials };
  },
});

export const clearAll = internalMutation({
  args: {},
  handler: async (ctx, args) => {
    await Promise.all([
      asyncMap(await ctx.db.query("authAccounts").collect(), (account) =>
        ctx.db.delete(account._id),
      ),
      asyncMap(await ctx.db.query("authRateLimits").collect(), (rateLimit) =>
        ctx.db.delete(rateLimit._id),
      ),
      asyncMap(
        await ctx.db.query("authRefreshTokens").collect(),
        (refreshToken) => ctx.db.delete(refreshToken._id),
      ),
      asyncMap(await ctx.db.query("authSessions").collect(), (session) =>
        ctx.db.delete(session._id),
      ),
      asyncMap(
        await ctx.db.query("authVerificationCodes").collect(),
        (verificationCode) => ctx.db.delete(verificationCode._id),
      ),
      asyncMap(await ctx.db.query("authVerifiers").collect(), (verifier) =>
        ctx.db.delete(verifier._id),
      ),
      asyncMap(await ctx.db.query("users").collect(), (user) =>
        ctx.db.delete(user._id),
      ),
    ]);
  },
});
