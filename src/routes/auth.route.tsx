import { DashboardSkeleton } from '@/components/skeleton-loaders/dashboard-skeleton';
import useAuth from '@/hooks/api/use-auth';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthRoute } from './common/routePaths';

const AuthRoute = () => {
   const { isLoading, data } = useAuth();
   const user = data?.user || null;

   const _isAuthRoute = isAuthRoute(location.pathname);

   if (isLoading && !_isAuthRoute) {
      return <DashboardSkeleton />;
   }

   if (!user) return <Outlet />;
   return <Navigate to={`/workspace/${user.currentWorkspace._id}`} replace />;
};

export default AuthRoute;
