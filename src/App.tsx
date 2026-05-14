import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { logisticsService } from "@/features/logistics/services/logisticsService";
import LoginPage from "@/pages/logistics/LoginPage";
import DashboardPage from "@/pages/logistics/DashboardPage";
import PdfUploadPage from "@/pages/logistics/PdfUploadPage";
import ChecklistPage from "@/pages/logistics/ChecklistPage";
import CompletedChecklistPage from "@/pages/logistics/CompletedChecklistPage";

const queryClient = new QueryClient();

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const session = logisticsService.getSessionUser();
  if (!session) {
    return <Navigate replace to="/login" />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={(
              <RequireAuth>
                <DashboardPage />
              </RequireAuth>
            )}
          />
          <Route
            path="/upload"
            element={(
              <RequireAuth>
                <PdfUploadPage />
              </RequireAuth>
            )}
          />
          <Route path="/checklist/:token" element={<ChecklistPage />} />
          <Route
            path="/completed/:id"
            element={(
              <RequireAuth>
                <CompletedChecklistPage />
              </RequireAuth>
            )}
          />
          <Route path="/" element={<Navigate replace to="/dashboard" />} />
          <Route path="*" element={<Navigate replace to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
