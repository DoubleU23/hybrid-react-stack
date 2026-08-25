// TODO: add user.updated and doublecheck user fields needed + use UserObject interface

import { v } from 'convex/values'
import { mutation, query, httpAction } from './_generated/server'
import { userValidator } from './schema'
import { api } from './_generated/api'
import type { EmailAddress, UserObject, DBResult } from './schema'

export const getUsers = query({
    args: {},
  handler: async ctx => {
    // 2. Fetch using your high-performance index
    return await ctx.db
      .query("users")
      .collect()
  }})

  export const getUsersPaginated = query({
    args: {
    // Validate pagination requirements strictly using built-in Convex types
    paginationOpts: v.object({
      numItems: v.number(),
      cursor: v.union(v.string(), v.null()),
    }),
  },
  handler: async (ctx, args) => {
    // 2. Fetch using your high-performance index
    return await ctx.db
      .query("users")
     .order("desc")
      .paginate(args.paginationOpts);
  }})

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
    const userToUpdate = await ctx.db
     .query('users')
     .withIndex("by_clerk_user_id", (q) => q.eq("clerk_user_id", args.user.clerk_user_id))
     .unique()

    if (!userToUpdate) {
      return { success: false, error: 'User profile not found' }
    }
    const { _id, _creationTime, ...fieldsToPatch } = args.user;
    await ctx.db.patch('users', userToUpdate._id, fieldsToPatch)

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

export const handleUserClerkWebhook = httpAction(async (ctx, request) => {
  const identity = await ctx.auth.getUserIdentity()
  const response = await request.json()

  const { type, data: {
      id,
      username,
      created_at,
      updated_at,
      email_addresses,
      primary_email_address_id,
      phone_numbers,
      image_url,
      last_active_at,
      last_sign_in_at,
      first_name,
      last_name,
      locale,
      locked,
      banned,
      private_metadata,
      public_metadata,
    },
    event_attributes: {
      http_request: { client_ip },
    },
  } = response

  let primary_email_address
    email_addresses.forEach((email: EmailAddress) => {
      if (email.id === primary_email_address_id) primary_email_address = email.email_address
    })

  const role = public_metadata.role || 'user';
  if (!public_metadata.role)
      public_metadata.role = role

  let dbResult: DBResult = { success: true }
  const userObject: UserObject = {
    clerk_user_id: id,
    created_at: created_at || Date.now(),
    updated_at: updated_at || Date.now(),
    role,
    username,
    email: primary_email_address,
    first_name,
    last_name,
    phone_number: phone_numbers?.phone_number || '',
    locale: locale || 'de-DE',
    profile_image_url: image_url,
    private_metadata: JSON.stringify(private_metadata),
    public_metadata,
    last_active_at: last_active_at || Date.now(),
    last_sign_in_at: last_sign_in_at || created_at || Date.now(),
    client_ip,
    locked,
    banned,
  }

  if (type === 'user.created') {
    dbResult = await ctx.runMutation(api.users.addUser, { user: userObject })
  } else if (type === 'user.updated') {
    dbResult = await ctx.runMutation(api.users.updateUserByClerkId, { user: userObject })
  } else if (type === 'user.deleted') {
    dbResult = await ctx.runMutation(api.users.removeUserByClerkUserId, { clerk_user_id: id })
  }

  if (!dbResult.success) console.log('dbResult.error :>> ', dbResult?.msg)

  console.log(`result :>> ${id}`, dbResult)

  return new Response(null, {
    status: 200,
  })
})
