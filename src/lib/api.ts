import { AxiosResponse } from 'axios';
import API from './axios-client';
import {
   AllWorkspaceResponseType,
   AnalyticsResponseType,
   CreateWorkspaceResponseType,
   CreateWorkspaceType,
   CurrentUserResponseType,
   EditWorkspaceType,
   LoginResponseType,
   loginType,
   registerType,
   WorkspaceByIdResponseType,
} from '@/types/api.type';

type PromiseAxios<T> = Promise<AxiosResponse<T>>;

export const loginMutationFn = async (
   payoad: loginType
): PromiseAxios<LoginResponseType> => API.post(`/auth/sign-in`, payoad);

export const registerMutationFn = (
   payload: registerType
): PromiseAxios<{ message: string }> => API.post(`/auth`, payload);

export const logoutMutationFn = (): PromiseAxios<{ message: string }> =>
   API.post(`/auth/sign-out`);

export const getCurrentUserQueryFn =
   (): PromiseAxios<CurrentUserResponseType> => API.get(`/users/current`);

//********* WORKSPACE ****************
//************* */

export const createWorkspaceMutationFn = (
   payload: CreateWorkspaceType
): PromiseAxios<CreateWorkspaceResponseType> =>
   API.post(`/workspaces`, payload);

export const editWorkspaceMutationFn = (payload: EditWorkspaceType) =>
   API.put(`/workspaces/${payload.workspaceId}`, payload.data);

export const getWorkspaceByIdQueryFn = (
   workspaceId: string
): PromiseAxios<WorkspaceByIdResponseType> =>
   API.get(`/workspaces/${workspaceId}`);

export const getAllWorkspacesUserIsMemberQueryFn =
   (): PromiseAxios<AllWorkspaceResponseType> =>
      API.get(`/workspaces/user/current`);

export const getWorkspaceAnalyticsQueryFn = async (
   workspaceId: string
): PromiseAxios<AnalyticsResponseType> =>
   API.get(`/workspaces/${workspaceId}/analytics`);

export const changeWorkspaceMemberRoleMutationFn = async () => {};

export const deleteWorkspaceMutationFn = async (
   id: string
): PromiseAxios<{ currentWorkspace: string }> =>
   API.delete(`/workspaces/${id}`);

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
