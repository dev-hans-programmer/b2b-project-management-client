import { AxiosResponse } from 'axios';
import API from './axios-client';
import {
   AllWorkspaceResponseType,
   CurrentUserResponseType,
   LoginResponseType,
   loginType,
} from '@/types/api.type';

type PromiseAxios<T> = Promise<AxiosResponse<T>>;

export const loginMutationFn = async (
   payoad: loginType
): PromiseAxios<LoginResponseType> => API.post(`/auth/sign-in`, payoad);

export const registerMutationFn = async () => {};

export const logoutMutationFn = (): PromiseAxios<{ message: string }> =>
   API.post(`/auth/sign-out`);

export const getCurrentUserQueryFn =
   (): PromiseAxios<CurrentUserResponseType> => API.get(`/user/current`);

//********* WORKSPACE ****************
//************* */

export const createWorkspaceMutationFn = async () => {};

export const editWorkspaceMutationFn = async () => {};

export const getWorkspaceByIdQueryFn = async () => {};

export const getAllWorkspacesUserIsMemberQueryFn =
   (): PromiseAxios<AllWorkspaceResponseType> =>
      API.get(`/workspace/user/current`);

export const getWorkspaceAnalyticsQueryFn = async () => {};

export const changeWorkspaceMemberRoleMutationFn = async () => {};

export const deleteWorkspaceMutationFn = async () => {};

//*******MEMBER ****************

export const invitedUserJoinWorkspaceMutationFn = async () => {};

//********* */
//********* PROJECTS
export const createProjectMutationFn = async () => {};

export const editProjectMutationFn = async () => {};

export const getProjectsInWorkspaceQueryFn = async () => {};

export const getProjectByIdQueryFn = async () => {};

export const getProjectAnalyticsQueryFn = async () => {};

export const deleteProjectMutationFn = async () => {};

//*******TASKS ********************************
//************************* */

export const createTaskMutationFn = async () => {};

export const getAllTasksQueryFn = async () => {};

export const deleteTaskMutationFn = async () => {};
