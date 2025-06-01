import {
  internalMutation,
  mutation,
  query,
  type QueryCtx,
  type MutationCtx,
} from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import { v } from "convex/values";
import { asyncMap } from "convex-helpers";
import { getAuthUser } from "./auth";

async function joinGame(ctx: MutationCtx, user: Doc<"users">) {
  if (user.currentGame) return user.currentGame;

  const waitingGame = await ctx.db
    .query("games")
    .withIndex("by_status", (q) => q.eq("status", "waiting"))
    .first();

  if (!waitingGame) {
    const newGameId = await ctx.db.insert("games", {
      status: "waiting",
      playerOne: user._id,
      currentTurnPlayer: user._id,
    });
    await ctx.db.patch(user._id, { currentGame: newGameId });
    return newGameId;
  }

  await Promise.all([
    ctx.db.patch(waitingGame._id, {
      status: "playing",
      playerTwo: user._id,
    }),
    ctx.db.patch(user._id, { currentGame: waitingGame._id }),
  ]);

  return waitingGame._id;
}

async function checkIfInCurrentGame(ctx: QueryCtx | MutationCtx) {
  const user = await getAuthUser(ctx);
  if (!user) throw new Error("User not authenticated");
  if (!user.currentGame) throw new Error("Player not in game");

  const game = await ctx.db.get(user.currentGame);
  if (!game) throw new Error("Game not found");

  return { user, game };
}

// TODO: redirect user to login if not authenticated
export const join = mutation({
  args: {},
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    if (!user) return null;

    const gameId = await joinGame(ctx, user);
    return gameId;
  },
});

export const leave = mutation({
  args: {},
  handler: async (ctx, args) => {
    const { user, game } = await checkIfInCurrentGame(ctx);

    await ctx.db.patch(user._id, { currentGame: undefined });

    const otherPlayer =
      game.playerOne === user._id ? game.playerTwo : game.playerOne;

    if (otherPlayer) {
      await ctx.db.patch(otherPlayer, { currentGame: undefined });
    }

    if (game.status === "waiting") {
      await ctx.db.delete(game._id);
    } else {
      await ctx.db.patch(game._id, { status: "finished" });
    }
  },
});

// TODO: add functionality to see history of previous games
export const getBoard = query({
  args: {},
  handler: async (ctx, args) => {
    try {
      const { game } = await checkIfInCurrentGame(ctx);

      if (game.status === "waiting") return [];

      const gameTurns = await ctx.db
        .query("gameTurns")
        .withIndex("by_game_turnNumber", (q) => q.eq("game", game._id))
        .order("desc")
        .collect();

      return gameTurns.map((turn) => ({
        key: turn._id,
        turnNumber: turn.turnNumber,
        movie: turn.movie,
      }));
    } catch {
      return [];
    }
  },
});

export const submitAnswer = mutation({
  args: { movie: v.string() },
  handler: async (ctx, args) => {
    const { user, game } = await checkIfInCurrentGame(ctx);
    if (game.currentTurnPlayer !== user._id) {
      throw new Error("It's not your turn");
    }

    // TODO: validate movie

    const lastTurn = await ctx.db
      .query("gameTurns")
      .withIndex("by_game_turnNumber", (q) => q.eq("game", game._id))
      .order("desc")
      .first();

    await Promise.all([
      ctx.db.insert("gameTurns", {
        game: game._id,
        player: user._id,
        turnNumber: !lastTurn ? 0 : lastTurn.turnNumber + 1,
        movie: args.movie,
      }),
      ctx.db.patch(game._id, {
        currentTurnPlayer:
          game.playerOne === user._id ? game.playerTwo : game.playerOne,
      }),
    ]);
  },
});

export const seed = internalMutation({
  args: {},
  handler: async (ctx, args) => {
    const user = await ctx.db.query("users").first();
    if (!user) {
      throw new Error("No user found to seed the game");
    }

    const game = await ctx.db.insert("games", {
      status: "playing",
      currentTurnPlayer: user._id,
      playerOne: user._id,
    });
    await ctx.db.patch(user._id, { currentGame: game });

    const movies = [
      "The Matrix",
      "Inception",
      "The Godfather",
      "Pulp Fiction",
      "The Dark Knight",
      "Forrest Gump",
      "Fight Club",
      "The Shawshank Redemption",
      "The Lord of the Rings: The Return of the King",
      "Star Wars: Episode IV - A New Hope",
    ];

    let p = [];

    for (let i = 0; i < movies.length; i++) {
      const movie = movies[i];
      if (!movie) continue;
      p.push(
        ctx.db.insert("gameTurns", {
          game,
          player: user._id,
          turnNumber: i,
          movie,
        }),
      );
    }

    await Promise.all(p);
  },
});

export const clearAll = internalMutation({
  args: {},
  handler: async (ctx, args) => {
    await Promise.all([
      asyncMap(await ctx.db.query("gameTurns").collect(), (gameTurn) =>
        ctx.db.delete(gameTurn._id),
      ),
      asyncMap(await ctx.db.query("games").collect(), (game) =>
        ctx.db.delete(game._id),
      ),
    ]);
  },
});
