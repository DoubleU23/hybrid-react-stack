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
