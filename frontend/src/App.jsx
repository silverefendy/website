import { Route, Routes } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import ToastContainer from './components/ui/ToastContainer';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import MyOrdersPage from './pages/customer/MyOrdersPage';
import ProfilePage from './pages/customer/ProfilePage';
import WishlistPage from './pages/customer/WishlistPage';
import SellerDashboardPage from './pages/seller/SellerDashboardPage';
import MyProductsPage from './pages/seller/MyProductsPage';
import ProductFormPage from './pages/seller/ProductFormPage';
import SellerOrdersPage from './pages/seller/SellerOrdersPage';
import StoreProfilePage from './pages/seller/StoreProfilePage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import CategoryManagementPage from './pages/admin/CategoryManagementPage';
import AllOrdersPage from './pages/admin/AllOrdersPage';
import SiteSettingsPage from './pages/admin/SiteSettingsPage';

const WithLayout = ({ children }) => <MainLayout>{children}</MainLayout>;
const WithSellerLayout = ({ children }) => <ProtectedRoute allowedRoles={[2]}><DashboardLayout>{children}</DashboardLayout></ProtectedRoute>;
const WithAdminLayout = ({ children }) => <ProtectedRoute allowedRoles={[1]}><AdminLayout>{children}</AdminLayout></ProtectedRoute>;

const App = () => (
  <>
    <ToastContainer />
    <Routes>
      <Route path="/" element={<WithLayout><HomePage /></WithLayout>} />
      <Route path="/products" element={<WithLayout><ProductListPage /></WithLayout>} />
      <Route path="/products/:slug" element={<WithLayout><ProductDetailPage /></WithLayout>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/cart" element={<ProtectedRoute allowedRoles={[3]}><WithLayout><CartPage /></WithLayout></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute allowedRoles={[3]}><WithLayout><MyOrdersPage /></WithLayout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute allowedRoles={[3]}><WithLayout><ProfilePage /></WithLayout></ProtectedRoute>} />
      <Route path="/wishlist" element={<ProtectedRoute allowedRoles={[3]}><WithLayout><WishlistPage /></WithLayout></ProtectedRoute>} />
      <Route path="/seller" element={<WithSellerLayout><SellerDashboardPage /></WithSellerLayout>} />
      <Route path="/seller/products" element={<WithSellerLayout><MyProductsPage /></WithSellerLayout>} />
      <Route path="/seller/products/add" element={<WithSellerLayout><ProductFormPage /></WithSellerLayout>} />
      <Route path="/seller/products/edit/:id" element={<WithSellerLayout><ProductFormPage /></WithSellerLayout>} />
      <Route path="/seller/orders" element={<WithSellerLayout><SellerOrdersPage /></WithSellerLayout>} />
      <Route path="/seller/store" element={<WithSellerLayout><StoreProfilePage /></WithSellerLayout>} />
      <Route path="/admin" element={<WithAdminLayout><AdminDashboardPage /></WithAdminLayout>} />
      <Route path="/admin/users" element={<WithAdminLayout><UserManagementPage /></WithAdminLayout>} />
      <Route path="/admin/categories" element={<WithAdminLayout><CategoryManagementPage /></WithAdminLayout>} />
      <Route path="/admin/orders" element={<WithAdminLayout><AllOrdersPage /></WithAdminLayout>} />
      <Route path="/admin/settings" element={<WithAdminLayout><SiteSettingsPage /></WithAdminLayout>} />
    </Routes>
  </>
);

export default App;
