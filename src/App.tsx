import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import LoginPage from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Employees from "@/pages/Employees";
import Payroll from "@/pages/Payroll";
import LeaveManagement from "@/pages/LeaveManagement";
import Attendance from "@/pages/Attendance";
import Performance from "@/pages/Performance";
import KPIManagement from "@/pages/KPIManagement";
import Recruitment from "@/pages/Recruitment";
import Expenses from "@/pages/Expenses";
import StatutoryReports from "@/pages/StatutoryReports";
import Announcements from "@/pages/Announcements";
import FleetManagement from "@/pages/FleetManagement";
import DocumentHub from "@/pages/DocumentHub";
import BulkUpload from "@/pages/BulkUpload";
import SettingsPage from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function AuthenticatedApp() {
  const { user } = useAuth();

  if (!user) return <LoginPage />;

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/leave" element={<LeaveManagement />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/performance" element={<Performance />} />
        <Route path="/kpis" element={<KPIManagement />} />
        <Route path="/recruitment" element={<Recruitment />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/statutory" element={<StatutoryReports />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/fleet" element={<FleetManagement />} />
        <Route path="/documents" element={<DocumentHub />} />
        <Route path="/upload" element={<BulkUpload />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AuthenticatedApp />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
