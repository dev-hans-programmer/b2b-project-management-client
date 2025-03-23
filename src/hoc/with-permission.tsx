import { PermissionType } from '@/constant';
import { useAuthContext } from '@/context/auth-provider';
import useWorkspaceId from '@/hooks/use-workspace-id';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const withPermission = (
   WrappedComponent: React.ComponentType,
   requiredPermission: PermissionType
) => {
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const WithPermission = (props: any) => {
      const { isLoading, hasPermission, user } = useAuthContext();

      const navigate = useNavigate();
      const workspaceId = useWorkspaceId();

      useEffect(() => {
         console.log('before', {
            isLoading,
            user,
            has: hasPermission(requiredPermission),
         });
         if (!isLoading && (!user || !hasPermission(requiredPermission))) {
            console.log('after', {
               isLoading,
               user,
               has: hasPermission(requiredPermission),
            });
            navigate(`/workspace/${workspaceId}`);
         }
      }, [user, workspaceId, hasPermission, navigate, isLoading]);

      if (isLoading) return <div>Loading....</div>;

      // This is for fallback to show you do not have the page permission, and then it will redirect to workspace dashboard
      if (!user || !hasPermission(requiredPermission))
         return <div>You do not have the permission to view this</div>;

      return <WrappedComponent {...props} />;
   };

   return WithPermission;
};

export default withPermission;
