import { Routes, Route, Navigate } from "react-router";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import StoreNav from "@/components/StoreNav";
import StoreFooter from "@/components/StoreFooter";
import CartDrawer from "@/components/CartDrawer";
import Toast from "@/components/Toast";
import Home from "@/pages/Home";
import Catalogue from "@/pages/Catalogue";
import ProductDetail from "@/pages/ProductDetail";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";

function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StoreNav />
      <div className="min-h-screen">
        {children}
      </div>
      <StoreFooter />
      <CartDrawer />
      <Toast />
    </>
  );
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#3d2e22" }}>
        <div style={{ color: "#b8a18b" }}>Chargement...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/super-admin" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      {/* Storefront Routes */}
      <Route path="/" element={<StoreLayout><Home /></StoreLayout>} />
      <Route path="/catalogue" element={<StoreLayout><Catalogue /></StoreLayout>} />
      <Route path="/produit/:id" element={<StoreLayout><ProductDetail /></StoreLayout>} />
      <Route path="/blog" element={<StoreLayout><Blog /></StoreLayout>} />
      <Route path="/blog/:id" element={<StoreLayout><BlogDetail /></StoreLayout>} />

      {/* Admin Routes */}
      <Route path="/super-admin" element={<AdminLogin />} />
      <Route
        path="/super-admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
