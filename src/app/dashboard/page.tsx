import { redirect } from "next/navigation";

const DashboardHome= ()=> {
  // Automatically redirect to /dashboard/videos
  redirect("/dashboard/videos");

  return null; // This won't render since the redirect happens instantly
}

export default DashboardHome;