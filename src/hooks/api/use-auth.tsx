import { getCurrentUserQueryFn } from '@/lib/api';
import { useApiQuery } from '../react-query-hooks';
import { QueryKeys } from '@/constant';

const useAuth = () => {
   const query = useApiQuery({
      queryKey: [QueryKeys.AUTH_USER],
      queryFn: getCurrentUserQueryFn,
      staleTime: 0,
      retry: 2,
   });

   return query;
};

export default useAuth;
