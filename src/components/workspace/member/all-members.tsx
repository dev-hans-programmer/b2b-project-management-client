import { ChevronDown, Loader } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
} from '@/components/ui/command';
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from '@/components/ui/popover';
import { getAvatarColor, getAvatarFallbackText } from '@/lib/helper';
import { useApiMutation, useApiQuery } from '@/hooks/react-query-hooks';
import {
   changeWorkspaceMemberRoleMutationFn,
   getMembersInWorkspaceQueryFn,
} from '@/lib/api';
import useWorkspaceId from '@/hooks/use-workspace-id';
import { Permissions, QueryKeys } from '@/constant';
import { useAuthContext } from '@/context/auth-provider';
import { UserType } from '@/types/api.type';
import { toast } from '@/hooks/use-toast';

const AllMembers = () => {
   const workspaceId = useWorkspaceId();
   const { user = {} as UserType, hasPermission } = useAuthContext();

   const canChangeMemberRole = hasPermission(Permissions.CHANGE_MEMBER_ROLE);

   const { data, isLoading } = useApiQuery({
      queryFn: () => getMembersInWorkspaceQueryFn(workspaceId),
      enabled: !!workspaceId,
      queryKey: [QueryKeys.MEMBERS_IN_WORKSPACE, workspaceId],
   });

   const { mutate, isPending } = useApiMutation({
      mutationFn: changeWorkspaceMemberRoleMutationFn,
      onSuccessHandler: () => {
         toast({
            title: 'Success',
            description: 'Role changed successfully',
            variant: 'success',
         });
      },
      onError: (err) =>
         toast({
            title: 'Error',
            description: err,
            variant: 'destructive',
         }),
   });

   const { members = [], roles = [] } = data || {};

   const handleSelect = (roleId: string, memberId: string) => {
      if (isPending) return;
      mutate({
         workspaceId,
         data: { roleId, memberId },
      });
   };

   return (
      <div className='grid gap-6 pt-2'>
         {isPending ? (
            <Loader className='w-8 h-8 animate-spin place-self-center flex' />
         ) : null}
         {members.map(
            ({
               _id,
               role,
               userId: { _id: userId, name, email, profilePicture },
            }) => (
               <div
                  key={_id}
                  className='flex items-center justify-between space-x-4'
               >
                  <div className='flex items-center space-x-4'>
                     <Avatar className='h-8 w-8'>
                        <AvatarImage
                           src={profilePicture || '/avatars/01.png'}
                           alt='Image'
                        />
                        <AvatarFallback
                           className={`${getAvatarColor(name[0])}`}
                        >
                           {getAvatarFallbackText(name)}
                        </AvatarFallback>
                     </Avatar>
                     <div>
                        <p className='text-sm font-medium leading-none'>
                           {name}
                        </p>
                        <p className='text-sm text-muted-foreground'>{email}</p>
                     </div>
                  </div>
                  <div className='flex items-center gap-3'>
                     <Popover>
                        <PopoverTrigger asChild>
                           <Button
                              variant='outline'
                              size='sm'
                              disabled={
                                 isLoading ||
                                 !canChangeMemberRole ||
                                 userId === user._id
                              }
                              className='ml-auto min-w-24 capitalize disabled:opacity-95 disabled:pointer-events-none'
                           >
                              {role.name.toLowerCase()}{' '}
                              {canChangeMemberRole && user._id !== userId && (
                                 <ChevronDown className='text-muted-foreground' />
                              )}
                           </Button>
                        </PopoverTrigger>
                        {canChangeMemberRole && (
                           <PopoverContent className='p-0' align='end'>
                              <Command>
                                 <CommandInput placeholder='Select new role...' />
                                 <CommandList>
                                    {isLoading ? (
                                       <Loader className='w-8 h-8 animate-spin place-self-center flex my-4' />
                                    ) : (
                                       <>
                                          <CommandEmpty>
                                             No roles found.
                                          </CommandEmpty>
                                          <CommandGroup>
                                             {roles.map(
                                                (role) =>
                                                   role.name !== 'OWNER' && (
                                                      <CommandItem
                                                         className='disabled:pointer-events-none gap-1 mb-1  flex flex-col items-start px-4 py-2 cursor-pointer'
                                                         onSelect={() => {
                                                            handleSelect(
                                                               role._id,
                                                               userId
                                                            );
                                                         }}
                                                      >
                                                         <p className='capitalize'>
                                                            {role.name.toLowerCase()}
                                                         </p>
                                                         <p className='text-sm text-muted-foreground'>
                                                            {role.name ===
                                                               'ADMIN' &&
                                                               `Can view, create, edit tasks, project and manage settings .`}

                                                            {role.name ===
                                                               'MEMBER' &&
                                                               `Can view,edit only task created by.`}
                                                         </p>
                                                      </CommandItem>
                                                   )
                                             )}
                                          </CommandGroup>
                                       </>
                                    )}
                                 </CommandList>
                              </Command>
                           </PopoverContent>
                        )}
                     </Popover>
                  </div>
               </div>
            )
         )}
      </div>
   );
};

export default AllMembers;
