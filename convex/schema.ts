import { defineSchema, defineTable } from 'convex/server'
import { type Infer, v } from 'convex/values'

export type UserRole = 'user' | 'admin'

export const emailAddressesValidator = v.array(
  v.object({
    id: v.string(),
    object: v.string(),
    email_address: v.string(),
    reserved: v.boolean(),
    matches_sso_connection: v.boolean(),
    created_at: v.number(),
    updated_at: v.number(),
  })
);

export const userValidator = v.object({
  _id: v.optional(v.string()),
  _creationTime: v.optional(v.number()),
  clerk_user_id: v.string(),
  created_at: v.optional(v.number()),
  updated_at: v.optional(v.number()),
  username: v.string(),
  first_name: v.string(),
  last_name: v.string(),
  // email_addresses: emailAddressesValidator,
  email: v.optional(v.string()),
  phone_number: v.optional(v.string()),
  locale: v.optional(v.string()),
  profile_image_url: v.optional(v.string()),
  private_metadata: v.any(),
  public_metadata: v.any(),
  last_active_at: v.optional(v.number()),
  last_sign_in_at: v.optional(v.number()),
  client_ip: v.optional(v.string()),
  locked: v.optional(v.boolean()),
  banned: v.optional(v.boolean()),
  role: v.union(v.literal("user"), v.literal("admin")),
})

export type UserObject = Infer<typeof userValidator>

export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),
  users: defineTable(userValidator)
    .index("by_clerk_user_id", ["clerk_user_id"]),
})
export interface DBResult {
  success: boolean
  msg?: string
}

export interface EmailAddress {
  email_address: string
  id: string
}
//   export interface UserObject {
//     clerk_user_id: string
//     // provider: string
//     // provider_user_id: string, // = provider_user_id
//     created_at: bigint,
//     updated_at: bigint,
//     username: string,
//     first_name: string,
//     last_name: string,
//     primary_email: string,
//     phone_number: string,
//     locale: string,
//     profile_image_url: string // = picture || image_url
//     private_metadata: string, // use JSON.stringify()
//     public_metadata: string, // use JSON.stringify()
//     last_active_at: bigint,
//     last_sign_in_at: bigint,
//     client_ip: string,
//     locked: boolean,
//     banned: boolean,
// }
