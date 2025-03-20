import { Loader } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { BASE_ROUTE } from '@/routes/common/routePaths';
import useAuth from '@/hooks/api/use-auth';
import { useApiMutation } from '@/hooks/react-query-hooks';
import { invitedUserJoinWorkspaceMutationFn } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

const InviteUser = () => {
   const navigate = useNavigate();
   const { isLoading, data } = useAuth();
   const user = data?.user;
   const param = useParams();

   const inviteCode = param.inviteCode as string;

   const returnUrl = encodeURIComponent(
      `${BASE_ROUTE.INVITE_URL.replace(':inviteCode', inviteCode)}`
   );

   const { mutate, isPending } = useApiMutation({
      mutationFn: invitedUserJoinWorkspaceMutationFn,
      onSuccessHandler(data) {
         navigate(`/workspace/${data.workspaceId}`);
      },
      onError(err) {
         toast({
            title: 'Error',
            description: err,
            variant: 'destructive',
         });
      },
   });

   const handleSubmit = (e: { preventDefault: () => void }) => {
      e.preventDefault();
      if (isPending) return;
      mutate(inviteCode);
      //navigate(`/workspace/${data.workspaceId}`);
   };

   return (
      <div className='flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10'>
         <div className='flex w-full max-w-md flex-col gap-6'>
            <Link
               to='/'
               className='flex items-center gap-2 self-center font-medium'
            >
               <Logo />
               Team Sync.
            </Link>
            <div className='flex flex-col gap-6'>
               <Card>
                  <CardHeader className='text-center'>
                     <CardTitle className='text-xl'>
                        Hey there! You're invited to join a TeamSync Workspace!
                     </CardTitle>
                     {!user && (
                        <CardDescription>
                           Looks like you need to be logged into your TeamSync
                           account to join this Workspace.
                        </CardDescription>
                     )}
                  </CardHeader>
                  <CardContent>
                     {isLoading ? (
                        <Loader className='!w-11 !h-11 animate-spin place-self-center flex' />
                     ) : (
                        <div>
                           {user ? (
                              <div className='flex items-center justify-center my-3'>
                                 <form onSubmit={handleSubmit}>
                                    <Button
                                       type='submit'
                                       disabled={isPending}
                                       className='!bg-green-500 !text-white text-[23px] !h-auto'
                                    >
                                       {isPending && (
                                          <Loader className='!w-6 !h-6 animate-spin' />
                                       )}
                                       Join the Workspace
                                    </Button>
                                 </form>
                              </div>
                           ) : (
                              <div className='flex flex-col md:flex-row items-center gap-2'>
                                 <Link
                                    className='flex-1 text-base'
                                    to={`/sign-up?returnUrl=${returnUrl}`}
                                 >
                                    <Button className='w-full'>Signup</Button>
                                 </Link>
                                 <Link
                                    className='flex-1 text-base'
                                    to={`/?returnUrl=${returnUrl}`}
                                 >
                                    <Button
                                       variant='secondary'
                                       className='w-full border'
                                    >
                                       Login
                                    </Button>
                                 </Link>
                              </div>
                           )}
                        </div>
                     )}
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   );
};

export default InviteUser;
