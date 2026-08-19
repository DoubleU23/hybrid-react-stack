import { api } from "@convex/api";
import { useConvexAuth, useQuery } from "convex/react";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

export default function Admin() {
  const navigate = useNavigate();
  const authState = useConvexAuth();

  // 1. Call the query at the top level
  const user = useQuery(api.users.getCurrentUser, authState.isAuthenticated ? undefined : "skip");
console.log('user :>> ', user);

  // 2. Safely trigger redirect when loading finishes and auth is missing
  useEffect(() => {
    if (!authState.isLoading && !authState.isAuthenticated) {
      navigate('/');
    }
  }, [authState, navigate]);

  // 3. Check for general authentication loading states
  if (authState.isLoading || (authState.isAuthenticated && user === undefined)) {
    return <p>Loading user session...</p>;
  }

  if (!authState.isAuthenticated) {
    return null;
  }

  // 4. Role access verification (Fixed: Variable name changed from 'currentUser' to 'user')
  if (user === null || user.role !== "admin") {
    return <p className="text-red-500 p-6 font-bold">Access Denied: Admins only.</p>;
  }

  return <Outlet />;
}