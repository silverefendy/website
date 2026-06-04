import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import useToastStore from '../stores/toastStore';
import LoadingSpinner from './ui/LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, user, fetchMe } = useAuthStore();
  const isHydratingSession = isAuthenticated && !user;
  const isWrongRole = isAuthenticated && allowedRoles.length > 0 && !allowedRoles.includes(user?.role_id);

  useEffect(() => {
    if (isAuthenticated && !user && !isLoading) {
      fetchMe().catch(() => {});
    }
  }, [fetchMe, isAuthenticated, isLoading, user]);

  useEffect(() => {
    if (isWrongRole) {
      useToastStore.getState().showToast('You do not have permission to access that page.', 'error');
    }
  }, [isWrongRole]);

  if (isHydratingSession) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isWrongRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
