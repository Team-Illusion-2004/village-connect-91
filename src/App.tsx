
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
import { AppLayout } from "./components/app/AppLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VillageChat from "./pages/VillageChat";
import ReportIssue from "./pages/ReportIssue";
import IssueDetails from "./pages/IssueDetails";
import Meetings from "./pages/Meetings";
import MeetingDetails from "./pages/MeetingDetails";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import { KarmaProvider } from "./context/KarmaContext";
import { NotificationProvider } from "./context/NotificationContext";
import { IssueProvider } from "./context/IssueContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <KarmaProvider>
              <IssueProvider>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  
                  {/* Protected routes */}
                  <Route element={<AppLayout />}>
                    <Route path="/" element={<Index />} />
                    <Route path="/chat" element={<VillageChat />} />
                    <Route path="/report" element={<ReportIssue />} />
                    <Route path="/issues/:issueId" element={<IssueDetails />} />
                    <Route path="/meetings" element={<Meetings />} />
                    <Route path="/meetings/:meetingId" element={<MeetingDetails />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                  </Route>
                  
                  {/* Catch-all */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </IssueProvider>
            </KarmaProvider>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
