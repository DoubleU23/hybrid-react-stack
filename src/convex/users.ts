// TODO: add user.updated and doublecheck user fields needed + use UserObject interface
import { v } from 'convex/values'
import { api } from './_generated/api'
import { httpAction, mutation, query } from './_generated/server'

import type { DBResult, EmailAddress, UserObject } from './shema'
import {userValidator } from './shema'
// import type {UserObject} from './users.d.ts'

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
    const allUsers = await ctx.db.query("users").collect();
    const userToUpdate = allUsers.find((u) => u.clerk_user_id === args.user.clerk_user_id);

    if (!userToUpdate) {
      return { success: false, error: "User profile not found" };
    }

    // 2. Apply partial patches to the document using its internal _id
    await ctx.db.patch(userToUpdate._id, args.user);

    return { success: true, msg: `User updated - ${args.user.clerk_user_id}` };
  },
});

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

const handleUserClerkWebhook = httpAction(async (ctx, request) => {
  const identity = await ctx.auth.getUserIdentity()
  const response = await request.json()

  const {
    type,
    data: {
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
  console.log('identity :>> ', JSON.stringify(identity))
  console.log('client_ip :>> ', client_ip)
  console.log('id :>> ', id)

  const primary_email_address = email_addresses?.filter((email: EmailAddress) => email.id === primary_email_address_id).email_address || ''
  console.log('primary_email_address :>> ', primary_email_address);

  let dbResult: DBResult = { success: true }
    const userObject: UserObject = {
      clerk_user_id: id,
      created_at: created_at || Date.now(),
      updated_at: updated_at || Date.now(),
      username,
      email: primary_email_address || '',
      first_name,
      last_name,
      phone_number: phone_numbers?.phone_number || '',
      locale: locale || 'de-DE',
      profile_image_url: image_url,
      private_metadata,
      public_metadata,
      last_active_at: last_active_at || Date.now(),
      last_sign_in_at: last_sign_in_at || created_at || Date.now(),
      client_ip,
      locked,
      banned,
    }

  if (type === 'user.created') {
    dbResult = await ctx.runMutation(api.users.addUser, { user: userObject })
  }
  else if (type === 'user.updated') {
    dbResult = await ctx.runMutation(api.users.updateUserByClerkId, { user: userObject });
  }
  else if (type === 'user.deleted') {
    dbResult = await ctx.runMutation(api.users.removeUserByClerkUserId, { clerk_user_id: id })
  }

  if (!dbResult.success)
    console.log('dbResult.error :>> ', dbResult?.msg)

  console.log(`result :>> ${id}`, dbResult)

  return new Response(null, {
    status: 200,
  })
})

export default handleUserClerkWebhook
