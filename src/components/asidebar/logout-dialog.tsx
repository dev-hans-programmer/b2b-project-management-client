import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCallback } from 'react';
import { useApiMutation } from '@/hooks/react-query-hooks';
import { logoutMutationFn } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/constant';
import { useNavigate } from 'react-router-dom';

const LogoutDialog = (props: {
   isOpen: boolean;
   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
   const { isOpen, setIsOpen } = props;
   const navigate = useNavigate();

   const queryClient = useQueryClient();

   const { mutate, isPending } = useApiMutation({
      mutationFn: logoutMutationFn,
      onSuccessHandler: () => {
         navigate('/');
         queryClient.resetQueries({ queryKey: [QueryKeys.AUTH_USER] });
      },
      onError: (err) => {
         toast({
            title: 'Error',
            description: err,
            variant: 'destructive',
         });
      },
   });

   // Handle logout action
   const handleLogout = useCallback(() => {
      if (isPending) return;
      mutate({});
   }, [isPending, mutate]);
   return (
      <>
         <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Are you sure you want to log out?</DialogTitle>
                  <DialogDescription>
                     This will end your current session and you will need to log
                     in again to access your account.
                  </DialogDescription>
               </DialogHeader>
               <DialogFooter>
                  <Button type='button' onClick={handleLogout}>
                     Sign out
                  </Button>
                  <Button type='button' onClick={() => setIsOpen(false)}>
                     Cancel
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </>
   );
};

export default LogoutDialog;
