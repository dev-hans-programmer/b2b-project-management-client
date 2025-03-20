import { useApiQuery } from '@/hooks/react-query-hooks';
import AnalyticsCard from './common/analytics-card';
import { getWorkspaceAnalyticsQueryFn } from '@/lib/api';
import useWorkspaceId from '@/hooks/use-workspace-id';
import { QueryKeys } from '@/constant';

const taskMapping = {
   totalTasks: 'Total Tasks',
   completedTasks: 'Completed Tasks',
   overdueTasks: 'Overdue Tasks',
};

const WorkspaceAnalytics = () => {
   const workspaceId = useWorkspaceId();
   const { data, isLoading } = useApiQuery({
      queryFn: () => getWorkspaceAnalyticsQueryFn(workspaceId),
      queryKey: [QueryKeys.WORKSPACE_ANALYTICS, workspaceId],
      enabled: !!workspaceId,
   });

   const { analytics } = data || {};

   const workspaceList = analytics
      ? (Object.keys(analytics) as Array<keyof typeof analytics>).map(
           (key) => ({
              id: key,
              title: taskMapping[key],
              value: analytics[key],
           })
        )
      : [];

   return (
      <div className='grid gap-4 md:gap-5 lg:grid-cols-2 xl:grid-cols-3'>
         {workspaceList.map((v) => (
            <AnalyticsCard
               key={v.id}
               isLoading={isLoading}
               title={v.title}
               value={v.value}
            />
         ))}
      </div>
   );
};

export default WorkspaceAnalytics;
