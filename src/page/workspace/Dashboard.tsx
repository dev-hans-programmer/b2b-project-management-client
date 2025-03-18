import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import useCreateProjectDialog from '@/hooks/use-create-project-dialog';
import WorkspaceAnalytics from '@/components/workspace/workspace-analytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RecentProjects from '@/components/workspace/project/recent-projects';
import RecentTasks from '@/components/workspace/task/recent-tasks';
import RecentMembers from '@/components/workspace/member/recent-members';
import { useAuthContext } from '@/context/auth-provider';
import { DashboardSkeleton } from '@/components/skeleton-loaders/dashboard-skeleton';
const WorkspaceDashboard = () => {
   const { onOpen } = useCreateProjectDialog();

   const { workspace, isLoading } = useAuthContext();

   if (isLoading) return <DashboardSkeleton />;

   if (!workspace) return <h2>Workspace does not exist</h2>;

   return (
      <main className='flex flex-1 flex-col py-4 md:pt-3'>
         <div className='flex items-center justify-between space-y-2 mb-6'>
            <div>
               <h2 className='text-2xl font-bold tracking-tight'>
                  Workspace Overview {workspace.name}
               </h2>
               <p className='text-muted-foreground'>
                  Here&apos;s an overview for this workspace!
               </p>
            </div>
            <Button onClick={onOpen}>
               <Plus />
               New Project
            </Button>
         </div>
         <WorkspaceAnalytics />
         <div className='mt-4'>
            <Tabs
               defaultValue='projects'
               className='w-full border rounded-lg p-2'
            >
               <TabsList className='w-full justify-start border-0 bg-gray-50 px-1 h-12'>
                  <TabsTrigger className='py-2' value='projects'>
                     Recent Projects
                  </TabsTrigger>
                  <TabsTrigger className='py-2' value='tasks'>
                     Recent Tasks
                  </TabsTrigger>
                  <TabsTrigger className='py-2' value='members'>
                     Recent Members
                  </TabsTrigger>
               </TabsList>
               <TabsContent value='projects'>
                  <RecentProjects />
               </TabsContent>
               <TabsContent value='tasks'>
                  <RecentTasks />
               </TabsContent>
               <TabsContent value='members'>
                  <RecentMembers />
               </TabsContent>
            </Tabs>
         </div>
      </main>
   );
};

export default WorkspaceDashboard;
