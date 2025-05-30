import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const appTables = {};

const schema = defineSchema({
  ...authTables,
  users: defineTable({
    name: v.string(),
    avatar: v.string(),
    email: v.string(),
    emailVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
  }).index("email", ["email"]),
  ...appTables,
});

export default schema;
