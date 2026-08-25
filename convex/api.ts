import { api } from './_generated/api'
import { httpAction } from './_generated/server'
import { corsHeaders } from './http'

export const apiTest = httpAction(async () => {
  return new Response(JSON.stringify({ message: 'Success!' }), {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  })
})

export const apiGetUsersHandler = httpAction(async ctx => {
  const users = await ctx.runQuery(api.users.getUsers)

  return new Response(JSON.stringify({ items: users }), {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  })
})

export const apiGetUserByClerkIdHandler = httpAction(async (ctx, request) => {
  const body = await request.json()
  const userId = body.id
  console.log('userId :>> ', userId)
  try {
    const response = await ctx.runQuery(api.users.getUserByClerkUserId, { clerk_user_id: userId })
    const user = response[0]

    return new Response(JSON.stringify({ ...user }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

export const apiGetUsersPaginatedHandler = httpAction(async (ctx, request) => {
  const url = new URL(request.url)

  // Gather tracking parameters from your frontend query string
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10)
  const currentCursor = url.searchParams.get('cursor') || null

  // Execute standard Convex cursor-based pagination
  const result = await ctx.runQuery(api.users.getUsersPaginated, {
    paginationOpts: {
      numItems: pageSize,
      cursor: currentCursor,
    },
  })

  return new Response(
    JSON.stringify({
      rows: result.page,
      nextCursor: result.continueCursor,
      isDone: result.isDone,
    }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    },
  )
})
export const apiPushUserUpdateHandler = httpAction(async (ctx, request) => {
  const { user } = await request.json()
  console.log('user :>> ', user)
  const updatedUser = await ctx.runMutation(api.users.updateUserByClerkId, { user })

  return new Response(
    JSON.stringify({
      ...updatedUser,
    }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    },
  )
})
