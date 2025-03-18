import { DashboardSkeleton } from '@/components/skeleton-loaders/dashboard-skeleton';
import useAuth from '@/hooks/api/use-auth';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
   const { isLoading, data } = useAuth();
   const user = data?.user || null;

   const returnUrl = encodeURIComponent(location.pathname);

   if (isLoading) {
      return <DashboardSkeleton />;
   }

   return user ? (
      <Outlet />
   ) : (
      <Navigate to={`/?returnUrl=${returnUrl}`} replace />
   );
};

export default ProtectedRoute;
