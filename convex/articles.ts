import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { articleValidator } from "./schema"

  export const getArticleById = query({
    args: { articleId: v.id("articles") },
    handler: async (ctx, args) => {
      const article = await ctx.db.get(args.articleId);
      if (!article) return null;

      // Resolve the storageId string into a real URL link string
      let resolvedImageUrl = null;
      if (article.img_url) {
        resolvedImageUrl = await ctx.storage.getUrl(article.img_url);
      }

      return {
        ...article,
        img_url: resolvedImageUrl, // Overwrites storageId with the clean http://... URL string
      };
    },
  });

  // 2. Query to list all articles with resolved URLs for your DataGrid
  export const getArticles = query({
    args: {},
    handler: async (ctx) => {
      const articles = await ctx.db.query("articles").order('desc').collect();

      return await Promise.all(
        articles.map(async (article) => {
          let resolvedUrl = null;

          if (article.img_url) {
            // Check if it's a valid Convex storage ID structure (UUID pattern or clean system tag)
            // Old strings like "my image url" or normal http web paths will be skipped safely
            const isValidStorageId =
              article.img_url.includes("-") ||
              /^[a-zA-Z0-9]+$/.test(article.img_url);

            if (isValidStorageId) {
              try {
                resolvedUrl = await ctx.storage.getUrl(article.img_url);
              } catch (e) {
                console.error(`Could not resolve storage ID: ${article.img_url}`);
                // Fallback to the original text string if it was already a raw HTTP URL address
                resolvedUrl = article.img_url.startsWith("http") ? article.img_url : null;
              }
            } else if (article.img_url.startsWith("http")) {
              // If it's a direct web asset path from an external system, use it directly
              resolvedUrl = article.img_url;
            }
          }

          return {
            ...article,
            img_url: resolvedUrl,
          };
        })
      );
    },
  });

export const createArticle = mutation({
  args: { article: articleValidator },
  handler: async (ctx, args) => {
    // Inserts the new article record into the database table
    return await ctx.db.insert("articles", args.article);
  },
});


export const updateArticle = mutation({
  args: { _id: v.id('articles'), article: articleValidator },
  handler: async (ctx, args) => {
    return await ctx.db.patch("articles", args._id, args.article);
  },
});