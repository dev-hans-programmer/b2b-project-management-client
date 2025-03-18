import { createContext, useContext, useEffect } from 'react';
import useWorkspaceId from '@/hooks/use-workspace-id';
import useAuth from '@/hooks/api/use-auth';
import { UserType } from '@/types/api.type';

// Define the context shape
type AuthContextType = {
   workspaceId: string;
   user?: UserType;
   isLoading: boolean;
   isFetching: boolean;
   error: string | null;
   refetchAuth: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
   children,
}) => {
   //const navigate = useNavigate();
   const {
      data,
      errorMessage,
      isLoading,
      isFetching,
      refetch: refetchAuth,
   } = useAuth();
   const workspaceId = useWorkspaceId();

   useEffect(() => {});

   return (
      <AuthContext.Provider
         value={{
            workspaceId,
            user: data?.user,
            error: errorMessage,

            isLoading,
            isFetching,
            refetchAuth,
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
