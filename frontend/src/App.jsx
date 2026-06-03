import { Route, Routes } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
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

const WithLayout = ({ children }) => <MainLayout>{children}</MainLayout>;

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
    </Routes>
  </>
);

export default App;
