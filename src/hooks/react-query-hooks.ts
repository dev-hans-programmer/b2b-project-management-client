import {
   useMutation,
   useQuery,
   useQueryClient,
   InitialDataFunction,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

interface ErrorDataObject {
   message: string;
   errorCode: string;
   statusCode: number;
}

export interface CustomErrorResponse {
   status: string;
   data: ErrorDataObject;
}
type ApiQueryFunction<TData> = () => Promise<AxiosResponse<TData>>;
type ApiMutationFunction<TData, TPayload> = (
   payload: TPayload
) => Promise<AxiosResponse<TData>>;
const useApiQuery = <TData>({
   queryFn,
   queryKey,
   enabled,
   getInitialData,
   selectHandler,
   staleTime,
   gcTime,
   refetchOnWindowFocus,
   refetchOnReconnect,
   refetchOnMount,
   retry,
}: {
   queryKey: string[];
   queryFn: ApiQueryFunction<TData>;
   enabled?: boolean;
   getInitialData?: InitialDataFunction<TData>;
   selectHandler?: (data: TData) => TData;
   staleTime?: number;
   gcTime?: number;
   refetchOnWindowFocus?: boolean;
   refetchOnReconnect?: boolean;
   refetchOnMount?: boolean;
   retry?: number;
}) => {
   const fetchData = async (): Promise<TData> => {
      const response = await queryFn();
      return response.data;
   };

   let errorMessage: string | null = null;
   let fullErrorObject: ErrorDataObject | null = null;

   const { data, error, isLoading, isFetching, isError, isSuccess, refetch } =
      useQuery<TData, CustomErrorResponse>({
         queryKey,
         queryFn: fetchData,
         enabled,
         initialData: getInitialData,
         select: (data: TData) => {
            selectHandler?.(data);
            return data;
         },
         gcTime: gcTime,
         staleTime: staleTime,
         refetchOnWindowFocus: refetchOnWindowFocus,
         refetchOnReconnect: refetchOnReconnect,
         refetchOnMount: refetchOnMount,
         retry: retry,
      });

   if (isError) {
      errorMessage = error?.data.message || null;
      fullErrorObject = error?.data;
   }

   return {
      data,
      isLoading,
      isFetching,
      errorMessage,
      fullErrorObject,
      isSuccess,
      refetch,
   };
};

const useApiMutation = <TData, TPayload>({
   queryKey,
   mutationFn,
   onSuccessHandler,
   onError,
   invalidateCacheQuery,
}: {
   queryKey?: string[];
   mutationFn: ApiMutationFunction<TData, TPayload>;
   onSuccessHandler?: (data: TData, payload?: TPayload) => void | Promise<void>;
   onError?: (msg: string | null) => void;
   invalidateCacheQuery?: string[];
}) => {
   const queryClient = useQueryClient();

   const fetchData = async (payload: TPayload): Promise<TData> => {
      const response = await mutationFn(payload);
      return response.data;
   };

   let errorMessage: string | null = null;

   const { mutate, mutateAsync, isPending, isError, error, data, variables } =
      useMutation<TData, CustomErrorResponse, TPayload>({
         mutationFn: fetchData,
         mutationKey: queryKey,
         onSuccess: (props) => {
            void onSuccessHandler?.(props, variables);
            void queryClient.invalidateQueries({
               queryKey: invalidateCacheQuery,
            });
         },
         onError: (err) => {
            if (err) {
               onError?.(err?.data.message || null);
            }
         },
      });
   if (isError) {
      errorMessage = error.data.message || null;
   }

   return {
      data,
      mutate,
      mutateAsync,
      isPending,
      errorMessage,
   };
};

export { useApiQuery, useApiMutation };
