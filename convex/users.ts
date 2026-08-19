// TODO: add user.updated and doublecheck user fields needed + use UserObject interface

import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { userValidator } from './schema'
// import type {UserObject} from './users.d.ts'

export const getCurrentUser = query({
  args: {},
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      return null; // Return null instead of throwing to keep frontend handling easy
    }
    // 2. Fetch using your high-performance index
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerk_user_id", identity.subject))
      // .filter((q) => q.eq(q.field("clerk_user_id"), identity.subject))
      .unique(); // Instantly returns the single object or null
  },
})

export const getUserByClerkUserId = query({
  args: { clerk_user_id: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex("by_clerk_user_id", (q) => q.eq("clerk_user_id", args.clerk_user_id))
      .collect()
  },
})

export const addUser = mutation({
  args: { user: userValidator },
  handler: async (ctx, args) => {
    // 1. Alle User laden (sicher vor fehlenden Feldern)
    const allUsers = await ctx.db.query('users').collect()
    // 2. Mit nativem JavaScript prüfen, ob die clerk_user_id existiert
    // u.clerk_user_id? stellt sicher, dass u nicht abstürzt, falls das Feld bei alten Testdaten fehlt
    const userExists = allUsers.some(u => u.clerk_user_id === args.user.clerk_user_id)

    if (userExists) {
      return { success: false, error: 'User already exists' }
    } else {
      await ctx.db.insert('users', args.user)
    }
    return { success: true, msg: `User added - ${args.user.clerk_user_id}` }
  },
})

export const updateUserByClerkId = mutation({
  args: { user: userValidator },
  handler: async (ctx, args) => {
    // 1. Safely find the user by their Clerk identifier
    const allUsers = await ctx.db.query('users').collect()
    const userToUpdate = allUsers.find(u => u.clerk_user_id === args.user.clerk_user_id)

    if (!userToUpdate) {
      return { success: false, error: 'User profile not found' }
    }

    // 2. Apply partial patches to the document using its internal _id
    await ctx.db.patch(userToUpdate._id, args.user)

    return { success: true, msg: `User updated - ${args.user.clerk_user_id}` }
  },
})

export const removeUserByClerkUserId = mutation({
  args: { clerk_user_id: v.string() },
  handler: async (ctx, args) => {
    // 1. Tabelle scannen und nach dem Feld filtern
    const user = await ctx.db
      .query('users')
      .filter(q => q.eq(q.field('clerk_user_id'), args.clerk_user_id))
      .unique()

    if (user !== null) {
      await ctx.db.delete(user._id)
      return { success: true }
    }

    return { success: false, msg: 'Not found' }
  },
})
