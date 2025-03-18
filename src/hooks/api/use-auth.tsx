import { getCurrentUserQueryFn } from '@/lib/api';
import { useApiQuery } from '../react-query-hooks';

const useAuth = () => {
   const query = useApiQuery({
      queryKey: ['authUser'],
      queryFn: getCurrentUserQueryFn,
      staleTime: 0,
      retry: 2,
   });

   return query;
};

export default useAuth;
