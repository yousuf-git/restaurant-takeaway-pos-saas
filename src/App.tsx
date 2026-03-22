import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { RoleGuard } from "@/components/RoleGuard";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { PosLayout } from "@/components/layouts/PosLayout";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import RestaurantList from "./pages/admin/RestaurantList";
import UserList from "./pages/admin/UserList";
import ItemList from "./pages/admin/ItemList";
import TableList from "./pages/admin/TableList";
import WaiterList from "./pages/admin/WaiterList";
import PosOrders from "./pages/pos/PosOrders";
import PosMenu from "./pages/pos/PosMenu";
import PosSummary from "./pages/pos/PosSummary";
import PosOrderHistory from "./pages/pos/PosOrderHistory";
import PosItemStats from "./pages/pos/PosItemStats";
import PosTables from "./pages/pos/PosTables";
import PosWaiters from "./pages/pos/PosWaiters";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />

          {/* Admin routes */}
          <Route path="/admin/dashboard" element={
            <RoleGuard allowedRoles={['admin']}>
              <AdminLayout><AdminDashboard /></AdminLayout>
            </RoleGuard>
          } />
          <Route path="/admin/restaurants" element={
            <RoleGuard allowedRoles={['admin']}>
              <AdminLayout><RestaurantList /></AdminLayout>
            </RoleGuard>
          } />
          <Route path="/admin/users" element={
            <RoleGuard allowedRoles={['admin']}>
              <AdminLayout><UserList /></AdminLayout>
            </RoleGuard>
          } />
          <Route path="/admin/items" element={
            <RoleGuard allowedRoles={['admin']}>
              <AdminLayout><ItemList /></AdminLayout>
            </RoleGuard>
          } />
          <Route path="/admin/tables" element={
            <RoleGuard allowedRoles={['admin']}>
              <AdminLayout><TableList /></AdminLayout>
            </RoleGuard>
          } />
          <Route path="/admin/waiters" element={
            <RoleGuard allowedRoles={['admin']}>
              <AdminLayout><WaiterList /></AdminLayout>
            </RoleGuard>
          } />

          {/* POS routes */}
          <Route path="/pos/orders" element={
            <RoleGuard allowedRoles={['operator']}>
              <PosLayout><PosOrders /></PosLayout>
            </RoleGuard>
          } />
          <Route path="/pos/menu" element={
            <RoleGuard allowedRoles={['operator']}>
              <PosLayout><PosMenu /></PosLayout>
            </RoleGuard>
          } />
          <Route path="/pos/summary" element={
            <RoleGuard allowedRoles={['operator']}>
              <PosLayout><PosSummary /></PosLayout>
            </RoleGuard>
          } />
          <Route path="/pos/order-history" element={
            <RoleGuard allowedRoles={['operator']}>
              <PosLayout><PosOrderHistory /></PosLayout>
            </RoleGuard>
          } />
          <Route path="/pos/item-stats" element={
            <RoleGuard allowedRoles={['operator']}>
              <PosLayout><PosItemStats /></PosLayout>
            </RoleGuard>
          } />
          <Route path="/pos/tables" element={
            <RoleGuard allowedRoles={['operator']}>
              <PosLayout><PosTables /></PosLayout>
            </RoleGuard>
          } />
          <Route path="/pos/waiters" element={
            <RoleGuard allowedRoles={['operator']}>
              <PosLayout><PosWaiters /></PosLayout>
            </RoleGuard>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
