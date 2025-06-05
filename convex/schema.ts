import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const appTables = {
  games: defineTable({
    status: v.union(
      v.literal("waiting"),
      v.literal("playing"),
      v.literal("finished"),
    ),
    playerOne: v.id("users"),
    playerTwo: v.optional(v.id("users")),
    currentTurnPlayer: v.id("users"),
  }).index("by_status", ["status"]),
  gameTurns: defineTable({
    game: v.id("games"),
    player: v.id("users"),
    turnNumber: v.number(),
    movie: v.string(),
  }).index("by_game_turnNumber", ["game", "turnNumber"]),
};

const customAuthTables = {
  ...authTables,
  users: defineTable({
    name: v.string(),
    avatar: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    currentGame: v.optional(v.id("games")),
  }).index("email", ["email"]),
};

const schema = defineSchema({
  ...appTables,
  ...customAuthTables,
});

export default schema;
