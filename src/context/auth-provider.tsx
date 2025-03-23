import { createContext, useContext, useEffect } from 'react';
import useWorkspaceId from '@/hooks/use-workspace-id';
import useAuth from '@/hooks/api/use-auth';
import { UserType, WorkspaceType } from '@/types/api.type';
import useGetWorkspaceQuery from '@/hooks/api/use-get-workspace';
import { useNavigate } from 'react-router-dom';
import usePermissions from '@/hooks/use-permissions';
import { PermissionType } from '@/constant';

// Define the context shape
type AuthContextType = {
   workspaceId: string;
   user?: UserType;
   isLoading: boolean;
   isFetching: boolean;
   error: string | null;
   refetchAuth: () => void;
   refetchWorkspace: () => void;
   workspace?: WorkspaceType;
   hasPermission: (permission: PermissionType) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
   children,
}) => {
   const navigate = useNavigate();
   const workspaceId = useWorkspaceId();
   const {
      data,
      errorMessage,
      isLoading,
      isFetching,
      refetch: refetchAuth,
   } = useAuth();

   const {
      data: workspaceData,
      isLoading: isWorkspaceLoading,
      errorMessage: workspaceErrorMessage,
      refetch: refetchWorkspace,
      fullErrorObject,
   } = useGetWorkspaceQuery(workspaceId);

   const permissions = usePermissions(data?.user, workspaceData?.workspace);

   const hasPermission = (permission: PermissionType) => {
      console.log(
         'permissions',
         permissions,
         isWorkspaceLoading,
         isLoading,
         data?.user,
         workspaceData?.workspace
      );
      return permissions.includes(permission);
   };

   useEffect(() => {
      if (fullErrorObject?.errorCode === 'ACCESS_UNAUTHORIZED') {
         navigate('/');
      }
      // else if (fullErrorObject?.errorCode === 'RESOURCE_NOT_FOUND') {
      //    navigate('/404');
      // }
   }, [fullErrorObject?.errorCode, navigate]);

   return (
      <AuthContext.Provider
         value={{
            workspaceId,
            user: data?.user,
            error: errorMessage || workspaceErrorMessage,
            workspace: workspaceData?.workspace,
            hasPermission,

            isLoading: isLoading || isWorkspaceLoading,
            isFetching,
            refetchAuth,
            refetchWorkspace,
         }}
      >
         {children}
      </AuthContext.Provider>
   );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
   const context = useContext(AuthContext);
   if (!context) {
      throw new Error(
         'useCurrentUserContext must be used within a AuthProvider'
      );
   }
   return context;
};
