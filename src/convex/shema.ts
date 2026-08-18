import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export interface DBResult {
    success: boolean
    msg?: string
  }

export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),
  users: defineTable({
    user_id: v.string(),
    provider: v.string(),
    provider_user_id: v.string(), // = provider_user_id
    created_at: v.int64(),
    updated_at: v.int64(),
    username: v.string(),
    first_name: v.string(),
    last_name: v.string(),
    email: v.string(),
    phone_number: v.string(),
    locale: v.string(),
    profile_image_url: v.string(), // = picture || image_url
    private_metadata: v.string(), // use JSON.stringify()
    public_metadata: v.string(), // use JSON.stringify()
    last_active_at: v.int64(),
    last_sign_in_at: v.int64(),
    client_ip: v.string(),
    locked: v.boolean(),
    banned: v.boolean(),
  })
});