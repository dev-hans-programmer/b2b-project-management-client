import { QueryKeys } from '@/constant';
import { useApiQuery } from '../react-query-hooks';
import { getWorkspaceByIdQueryFn } from '@/lib/api';

const useGetWorkspaceQuery = (workspaceId: string) => {
   const query = useApiQuery({
      queryKey: [QueryKeys.WORKSPACE, workspaceId],
      queryFn: () => getWorkspaceByIdQueryFn(workspaceId),
      staleTime: 2,
      retry: 2,
      enabled: !!workspaceId,
   });
   return query;
};

export default useGetWorkspaceQuery;
