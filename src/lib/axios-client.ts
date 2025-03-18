import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const options = {
   baseURL,
   withCredentials: true,
   timeout: 10000,
};

const API = axios.create(options);

API.interceptors.response.use(
   (response) => {
      return response.data;
   },
   async (error) => {
      const { statusText, status, data } = error.response;
      if (statusText === 'Unauthorized' && status === 401) {
         //  window.location.href = '/';
      }
      return Promise.reject({
         ...data,
      });
   }
);

export default API;
