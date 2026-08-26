import { v } from "convex/values"
import { query } from "./_generated/server"
import type { Id } from "./_generated/dataModel"

export const getArticles = query({
  args: {},
  handler: async ctx => {
    // 2. Fetch using your high-performance index
    return await ctx.db.query('articles').collect()
  },
})

export const getArticleById = query({
    args: {articleId: v.id('articles')},
    handler: async (ctx, args) => {
        return await ctx.db
        .get('articles', args.articleId)
    }
})
