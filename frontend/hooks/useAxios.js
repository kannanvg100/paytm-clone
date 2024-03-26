import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from '@/contexts/session';
import toast from 'react-hot-toast';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    
});

const useAxios = () => {
    const { session, updateSession } = useSession();

    axiosInstance.interceptors.request.use(
        async (config) => {
            if (session?.accessToken) {
                config.headers.authorization = `Bearer ${session.accessToken}`;
            }
            return config;
        },
        async (error) => {
            return Promise.reject(error);
        }
    );

    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            console.log(error)
            if (error.response && error.response.status === 401 && error.response.data.error === 'token_expired') {
                let toastId;
                try {
                    const res = await axios.get('http://localhost:5000/api/refresh-token', { withCredentials: true });
                    updateSession({ ...session, accessToken: res.data.accessToken });
                    error.config.headers.Authorization = `Bearer ${res.data.accessToken}`;
                    return axios.request(error.config);
                } catch (refreshError) {
                    console.error('Failed to refresh access token:', refreshError);
                    toast.error('Failed to refresh access token', { id: toastId });
                    updateSession(null);
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        }
    );

    return axiosInstance;
};

export default useAxios;