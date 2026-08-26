import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import type { Id } from "./_generated/dataModel"
import { articleValidator } from "./schema"

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

export const createArticle = mutation({
    args: {article: articleValidator},
    handler: async (ctx, args) => {
        return await ctx.db
        .insert('articles', args.article)
    }
})
