import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '../ui/textarea';
import { useAuthContext } from '@/context/auth-provider';
import { useApiMutation } from '@/hooks/react-query-hooks';
import { editWorkspaceMutationFn } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export default function EditWorkspaceForm() {
   const { workspace } = useAuthContext();

   const formSchema = z.object({
      name: z.string().trim().min(1, {
         message: 'Workspace name is required',
      }),
      description: z.string().trim(),
   });

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         name: workspace?.name || '',
         description: workspace?.description || '',
      },
   });

   const { name, description } = workspace || {};
   useEffect(() => {
      if (name || description)
         form.reset({
            name: name || '',
            description: description || '',
         });
   }, [name, description, form]);

   const { isPending, mutate } = useApiMutation({
      mutationFn: editWorkspaceMutationFn,
      onSuccessHandler() {
         toast({
            title: 'Success',
            description: 'Workspace is updated successfully',
            variant: 'success',
         });
      },
      onError: (err) => {
         toast({
            title: 'Error',
            description: err,
            variant: 'destructive',
         });
      },
   });

   const onSubmit = (values: z.infer<typeof formSchema>) => {
      if (isPending || !workspace?._id) return;
      mutate({ workspaceId: workspace._id, data: values });
   };

   return (
      <div className='w-full h-auto max-w-full'>
         <div className='h-full'>
            <div className='mb-5 border-b'>
               <h1
                  className='text-[17px] tracking-[-0.16px] dark:text-[#fcfdffef] font-semibold mb-1.5
           text-center sm:text-left'
               >
                  Edit Workspace
               </h1>
            </div>
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className='mb-4'>
                     <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel className='dark:text-[#f1f7feb5] text-sm'>
                                 Workspace name
                              </FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="Taco's Co."
                                    className='!h-[48px] disabled:opacity-90 disabled:pointer-events-none'
                                    disabled={false}
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>
                  <div className='mb-4'>
                     <FormField
                        control={form.control}
                        name='description'
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel className='dark:text-[#f1f7feb5] text-sm'>
                                 Workspace description
                                 <span className='text-xs font-extralight ml-2'>
                                    Optional
                                 </span>
                              </FormLabel>
                              <FormControl>
                                 <Textarea
                                    rows={6}
                                    disabled={false}
                                    className='disabled:opacity-90 disabled:pointer-events-none'
                                    placeholder='Our team organizes marketing projects and tasks here.'
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>
                  {/* {canEditWorkspace && ( */}
                  <Button
                     className='flex place-self-end  h-[40px] text-white font-semibold'
                     disabled={false}
                     type='submit'
                  >
                     {/* {false && <Loader className="animate-spin" />} */}
                     Update Workspace
                  </Button>
               </form>
            </Form>
         </div>
      </div>
   );
}
