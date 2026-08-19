import { query } from "../convex/_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const list = await ctx.db.query("tasks").collect();
    return {identity, list}
  },
});