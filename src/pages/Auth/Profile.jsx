import { UserProfile } from '@clerk/react'
import { useQuery, useMutation, useConvexAuth } from 'convex/react'
import { api } from "@convex/api";
import { redirect, useNavigate } from 'react-router';
import { useEffect } from 'react';

export default function Profile(params) {
    const navigate = useNavigate();
  const authState = useConvexAuth();
const user = useQuery(api.users.getCurrentUser, authState.isAuthenticated ? undefined : "skip");

  useEffect(() => {
    if (!authState.isLoading && !authState.isAuthenticated) {
      navigate('/');
    }
  }, [authState, navigate]);

  // 3. Handle loading states sequentially
  if (authState.isLoading || user === undefined) {
    return <p>Loading your profile session...</p>;
  }

  if (!authState.isAuthenticated) {
    return null; // Prevent s flashing content before redirect kicks in
  }

  return <UserProfile />
}
