import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import LoginPage from "./pages/auth/login/LoginPage";
import HomePage from "./pages/home/HomePage";
import SideBar from "./components/common/SideBar";
import RightPanel from "./components/common/RightPanel";
import NotificationPage from "./pages/notifications/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { baseURL } from "./constant/url";
import LoadingSpinner from "./components/common/LoadingSpinner";
import { useAuth, useUser } from "@clerk/clerk-react";

const App = () => {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const { user: clerkUser } = useUser();

  const { data: authUser, isLoading: isQueryLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      if (!isSignedIn) return null;
      try {
        const token = await getToken();
        if (!token) return null;

        const res = await fetch(`${baseURL}api/auth/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        
        if (res.status === 401 || (data && data.error && data.error.includes("sync"))) {
          console.log("User profile not synced. Syncing user...");
          const syncRes = await fetch(`${baseURL}api/auth/sync`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              userName: clerkUser?.username || clerkUser?.emailAddresses?.[0]?.emailAddress?.split("@")[0],
              fullName: clerkUser?.fullName || clerkUser?.firstName || clerkUser?.username || "Clerk User",
              email: clerkUser?.emailAddresses?.[0]?.emailAddress,
              profileImg: clerkUser?.imageUrl
            })
          });
          if (syncRes.ok) {
            const syncedData = await syncRes.json();
            return syncedData;
          }
        }

        if (data.error) {
          return null;
        }
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (err) {
        console.error("Error in authUser query:", err);
        return null;
      }
    },
    enabled: isLoaded,
    retry: false
  });

  const isLoading = !isLoaded || isQueryLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex max-w-6xl mx-auto min-h-screen relative">
      {/* Background radial glow */}
      {authUser && (
        <div className='fixed inset-0 pointer-events-none z-[-1] overflow-hidden'>
          <div className='absolute top-0 right-[20%] w-[40vw] h-[40vw] rounded-full bg-primary/2 blur-[150px]' />
          <div className='absolute bottom-0 left-[20%] w-[40vw] h-[40vw] rounded-full bg-blue-600/2 blur-[150px]' />
        </div>
      )}

      {authUser && <SideBar />}


      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/notifications" element={authUser ? <NotificationPage /> : <Navigate to="/login" />} />
        <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
      {authUser && <RightPanel />}
      <Toaster 
        toastOptions={{
          style: {
            background: 'rgba(9, 10, 15, 0.9)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
          }
        }}
      />
    </div>
  );
}

export default App;