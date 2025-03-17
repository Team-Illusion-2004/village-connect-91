
import { useAuth } from "@/context/AuthContext";
import { AppHeader } from "./AppHeader";
import { AppFooter } from "./AppFooter";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet, Navigate } from "react-router-dom";

export const AppLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // For demo purposes, always bypass authentication
  const demoAuth = true;

  if (!isAuthenticated && !demoAuth) {
    return <Navigate to="/login" />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <main className="flex-1 py-20 px-4 md:px-6 max-w-5xl mx-auto w-full">
            <Outlet />
          </main>
          <AppFooter />
        </div>
      </div>
    </SidebarProvider>
  );
};
