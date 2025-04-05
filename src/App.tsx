
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Auth Pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";

// App Layout
import MainLayout from "@/components/layout/MainLayout";

// App Pages
import Dashboard from "@/pages/Dashboard";
import Patients from "@/pages/Patients";
import PatientDetail from "@/pages/PatientDetail";
import Appointments from "@/pages/Appointments";
import Pharmacy from "@/pages/Pharmacy";
import Inventory from "@/pages/Inventory";
import Billing from "@/pages/Billing";
import Reports from "@/pages/Reports";
import Documents from "@/pages/Documents";
import Settings from "@/pages/Settings";
import NotFound from "./pages/NotFound";
import UserProfile from "./pages/UserProfile";
import ComingSoon from "./components/shared/ComingSoon";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Dashboard />} />
                
                {/* Patient Routes */}
                <Route path="/patients" element={<Patients />} />
                <Route path="/patients/:id" element={<PatientDetail />} />
                <Route path="/patients/add" element={<ComingSoon pageName="Add Patient" />} />
                
                {/* Appointment Routes */}
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/appointments/calendar" element={<ComingSoon pageName="Appointment Calendar" />} />
                
                {/* Pharmacy Routes */}
                <Route path="/pharmacy" element={<Pharmacy />} />
                <Route path="/pharmacy/stock" element={<ComingSoon pageName="Pharmacy Stock" />} />
                <Route path="/pharmacy/orders" element={<ComingSoon pageName="Pharmacy Orders" />} />
                
                {/* Inventory Routes */}
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/inventory/suppliers" element={<ComingSoon pageName="Inventory Suppliers" />} />
                
                {/* Billing Routes */}
                <Route path="/billing" element={<Billing />} />
                <Route path="/billing/invoices" element={<ComingSoon pageName="Billing Invoices" />} />
                <Route path="/billing/payments" element={<ComingSoon pageName="Billing Payments" />} />
                
                {/* Report Routes */}
                <Route path="/reports" element={<Navigate to="/reports/daily" replace />} />
                <Route path="/reports/daily" element={<ComingSoon pageName="Daily Reports" />} />
                <Route path="/reports/monthly" element={<ComingSoon pageName="Monthly Reports" />} />
                <Route path="/reports/custom" element={<ComingSoon pageName="Custom Reports" />} />
                
                {/* Document Routes */}
                <Route path="/documents" element={<Documents />} />
                <Route path="/documents/upload" element={<ComingSoon pageName="Document Upload" />} />
                
                {/* Settings Routes */}
                <Route path="/settings" element={<Settings />} />
                <Route path="/settings/general" element={<ComingSoon pageName="General Settings" />} />
                <Route path="/settings/roles" element={<ComingSoon pageName="Role Management" />} />
                <Route path="/settings/permissions" element={<ComingSoon pageName="Permission Management" />} />
                
                <Route path="/profile" element={<UserProfile />} />
              </Route>
            </Route>

            {/* Fallback routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      <Toaster />
      <SonnerToaster />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
