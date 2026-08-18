import { httpRouter } from "convex/server";
import handleUserClerkWebhook from "./users";

// define the webhook handler


// define the http router
const http = httpRouter()

// define the webhook route
http.route({
  path: '/clerk-users-webhook',
  method: 'POST',
  handler: handleUserClerkWebhook,
})

export default http