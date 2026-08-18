import { v } from 'convex/values'
import { api } from './_generated/api';
import { httpAction, mutation, query } from './_generated/server'

import type {DBResult} from './shema'
// import type {UserObject} from './users.d.ts'

export const addUser = mutation({
  args: { 'userJSON': v.string(), user_id: v.string()},
  handler: async (ctx, args) => {

   const userObject = JSON.parse(args.userJSON)
   console.log('addUser-args.user_id :>> ', args.user_id);
    // 1. Alle User laden (sicher vor fehlenden Feldern)
    const allUsers = await ctx.db.query("users").collect();
    // 2. Mit nativem JavaScript prüfen, ob die user_id existiert
    // u.user_id? stellt sicher, dass u nicht abstürzt, falls das Feld bei alten Testdaten fehlt
    const userExists = allUsers.some((u) => u.user_id === args.user_id);

    if (userExists) {
      return {success: false, error: 'User already exists'}
    } else {
      await ctx.db.insert('users', userObject);
    }
    return { success: true, msg: `User added - ${args.user_id}` };

  },
});

export const removeUserByUserId = mutation({
  args: { user_id: v.string() },
  handler: async (ctx, args) => {

    // 1. Tabelle scannen und nach dem Feld filtern
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("user_id"), args.user_id))
      .unique();

    if (user !== null) {
      await ctx.db.delete(user._id);
      return { success: true };
    }

    return { success: false, msg: "Not found" };
  },
});
// id: v.string(),
// created_at: v.int64(),
// updated_at: v.int64(),
// username: v.string(),
// first_name: v.string(),
// last_name: v.string(),
// email: v.string(),
// phone_number: v.string(),
// locale: v.string(),
// profile_image_url: v.string(), // = picture
// private_metadata: v.string(), // use JSON.stringify()
// public_metadata: v.string(), // use JSON.stringify()
// last_sign_in_at: v.int64(),
// last_active_at
// client_ip: v.string(),
// locked: v.boolean(),
// banned: v.boolean(),

const handleUserClerkWebhook = httpAction(async (ctx, request) => {
  const identity = await ctx.auth.getUserIdentity()
  const response = await request.json()

  console.log('response :>> ', JSON.stringify(response))

  const {
    type,
    data: {
      id,
      username,
      created_at,
      updated_at,
      email_addresses,
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
  console.log(
    'data :>> ',
    id,
    username,
    last_active_at,
    last_sign_in_at,
    first_name,
    last_name,
    locale,
    locked,
    banned,
    private_metadata,
    public_metadata,
  )

  console.log('id :>> ', id)

  let dbResult:DBResult = { success: true };
  if (type === 'user.created') {
const userObject = {
    user_id: id,
    created_at,
    updated_at,
    username,
    email: email_addresses[0].email_address,
    first_name,
    last_name,
    phone_number: phone_numbers?.phone_number || '',
    locale: locale || 'de-DE',
    profile_image_url: image_url,
    private_metadata,
    public_metadata,
    last_active_at,
    last_sign_in_at,
    client_ip,
    locked,
    banned,}

    const userJSON = JSON.stringify(userObject)
    dbResult = await ctx.runMutation(api.users.addUser, { userJSON, user_id: id });
  } else if (type === 'user.deleted') {
    dbResult = await ctx.runMutation(api.users.removeUserByUserId, { user_id: id });
  }

  if ( !dbResult?.success) console.log('dbResult.error :>> ', dbResult?.msg);


  console.log(`result :>> ${id}`, dbResult);

  return new Response(null, {
    status: 200,
  })
})

export default handleUserClerkWebhook
