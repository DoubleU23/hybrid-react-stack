import { httpRouter } from "convex/server";
import { httpAction } from './_generated/server'
import {api} from './_generated/api'
import type { DBResult, EmailAddress, UserObject } from './schema'

// define the webhook handler


// define the http router
const http = httpRouter()
const handleUserClerkWebhook = httpAction(async (ctx, request) => {
  const identity = await ctx.auth.getUserIdentity()
  const response = await request.json()

  const { type, data: {
      id, username,
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

  const primary_email_address =
    email_addresses?.filter((email: EmailAddress) => email.id === primary_email_address_id).email_address || ''
  console.log('primary_email_address :>> ', primary_email_address)

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
    email: primary_email_address || '',
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

// define the webhook route
http.route({
  path: '/clerk-users-webhook',
  method: 'POST',
  handler: handleUserClerkWebhook,
})

export default http