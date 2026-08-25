import { httpRouter } from 'convex/server'
import { httpAction } from './_generated/server'
import { apiGetUserByClerkIdHandler, apiGetUsersHandler, apiGetUsersPaginatedHandler, apiPushUserUpdateHandler } from './api'
import { handleUserClerkWebhook } from './users'
// define the webhook handler

export const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:3000', // Allows your exact local app
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// define the http router
const http = httpRouter()

// define the webhook route
http.route({
  path: '/clerk-users-webhook',
  method: 'POST',
  handler: handleUserClerkWebhook,
})

// http.route({
//   path: '/api/test',
//   method: 'OPTIONS',
//   handler: httpAction(async () => {
//     return new Response(null, { status: 204, headers: corsHeaders })
//   }),
// })

// http.route({
//   path: '/api/test',
//   method: 'GET',
//   handler: apiTest,
// })

http.route({
  path: '/api/getUsers',
  method: 'OPTIONS',
  handler: httpAction(async () => {
    return new Response(null, { status: 204, headers: corsHeaders })
  }),
})
http.route({
  path: '/api/getUsers',
  method: 'GET',
  handler: apiGetUsersHandler,
})

http.route({
  path: '/api/getUsersPaginated',
  method: 'OPTIONS',
  handler: httpAction(async () => {
    return new Response(null, { status: 204, headers: corsHeaders })
  }),
})
http.route({
  path: '/api/getUsersPaginated',
  method: 'GET',
  handler: apiGetUsersPaginatedHandler,
})

http.route({
  path: '/api/getUserByClerkId',
  method: 'OPTIONS',
  handler: httpAction(async () => {
    return new Response(null, { status: 204, headers: corsHeaders })
  }),
})
http.route({
  path: '/api/getUserByClerkId',
  method: 'POST',
  handler: apiGetUserByClerkIdHandler,
})

http.route({
  path: '/api/pushUserUpdate',
  method: 'OPTIONS',
  handler: httpAction(async () => {
    return new Response(null, { status: 204, headers: corsHeaders })
  }),
})
http.route({
  path: '/api/pushUserUpdate',
  method: 'POST',
  handler: apiPushUserUpdateHandler,
})

export default http
