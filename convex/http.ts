import { httpRouter } from "convex/server";
import { httpAction } from './_generated/server'

import { handleUserClerkWebhook } from "./users";
import { apiGetUsers, apiGetUserByClerkId, apiGetUsersPaginated, apiTest ,apiPushUserUpdate } from "./api";
// define the webhook handler


export const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3000", // Allows your exact local app
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// define the http router
const http = httpRouter()


// define the webhook route
http.route({
  path: '/clerk-users-webhook',
  method: 'POST',
  handler: handleUserClerkWebhook,
})


http.route({
  path: "/api/test",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, { status: 204, headers: corsHeaders });
  }),
});

http.route({
  path: "/api/test",
  method: "GET",
  handler: apiTest,
});

http.route({
  path: "/api/getUsers",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, { status: 204, headers: corsHeaders });
  }),
});
http.route({
  path: "/api/getUsers",
  method: "GET",
  handler: apiGetUsers,
});


http.route({
  path: "/api/getUsersPaginated",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, { status: 204, headers: corsHeaders });
  }),
});
http.route({
  path: "/api/getUsersPaginated",
  method: "GET",
  handler: apiGetUsersPaginated,
});

http.route({
  path: "/api/getUserByClerkId",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, { status: 204, headers: corsHeaders });
  }),
});
http.route({
  path: "/api/getUserByClerkId",
  method: "POST",
  handler: apiGetUserByClerkId
})

http.route({
  path: "/api/pushUserUpdate",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, { status: 204, headers: corsHeaders });
  }),
});
http.route({
  path: "/api/pushUserUpdate",
  method: "POST",
  handler: apiPushUserUpdate
})

export default http