import { UserProfile } from '@clerk/react'
import { useQuery, useMutation, useConvexAuth } from 'convex/react'
import { api } from "@convex/api";
import { redirect, useNavigate } from 'react-router';

export default function Profile(params) {
  const authState = useConvexAuth()
  console.log('authState :>> ', authState);
  if(authState.isAuthenticated){
    if(authState.isLoading) return <p>Loading your profile session...</p>

  const user = useQuery(api.users.getCurrentUser);
  console.log('user :>> ', user);
  }
  else {
    redirect('/')
  }
  return <UserProfile />
}
