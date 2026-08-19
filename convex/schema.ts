import { defineSchema, defineTable } from 'convex/server'
import { type Infer, v } from 'convex/values'

export const userValidator = v.object({
  clerk_user_id: v.string(),
  created_at: v.number(),
  updated_at: v.number(),
  username: v.string(),
  first_name: v.string(),
  last_name: v.string(),
  email: v.string(),
  phone_number: v.string(),
  locale: v.string(),
  profile_image_url: v.string(),
  private_metadata: v.any(),
  public_metadata: v.any(),
  last_active_at: v.number(),
  last_sign_in_at: v.number(),
  client_ip: v.string(),
  locked: v.boolean(),
  banned: v.boolean(),
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
