import axios, { AxiosResponse } from 'axios';
import type { AxiosInstance } from 'axios';
import { APIRequests, APIRequestsWithData } from '@/types/AxiosInstance';
import { getCookie } from './cookies';

const api: AxiosInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const token = getCookie('access_token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error)
);

/**
 * GET - Performs a GET request.
 * @param url - API endpoint URL (can include params, e.g. `/message/[id]`)
 * @param config - Optional Axios config (can include query params)
 * @returns The response data of type T
 * 
 * To use:
 * ```tsx
 * import { GET } from '@/services/axios';
 * 
 * // Simple GET
 * const data = await GET({ url: '/endpoint' });
 * console.log(data);
 * 
 * // GET with params in URL
 * const messageData = await GET({ url: `/message/${id}` });
 * console.log(messageData);
 * 
 * // GET with query params
 * const listData = await GET({ url: '/messages', config: { params: { page: 1 } } });
 * console.log(listData);
 * ```
 */
export const GET = async <T>({ url, config }: APIRequests): Promise<AxiosResponse<T>> => {
    return await api.get<T>(url, config);
}

/**
 * POST - Performs a POST request.
 * @param url - API endpoint URL
 * @param data - Data to be sent in the request body
 * @param config - Optional Axios config
 * @returns AxiosResponse with the response data
 * 
 * To use:
 * ```tsx
 * import { POST } from '@/services/axios';
 * 
 * const response = await POST('/endpoint', { key: 'value' });
 * console.log(response.data);
 * ```
 */
export const POST = async <T>({ url, data, config }: APIRequestsWithData): Promise<AxiosResponse<T>> => {
    return await api.post<T>(url, data, config);
}

/**
 * PUT - Performs a PUT request.
 * @param url - API endpoint URL (can include params, e.g. `/message/[id]`)
 * @param data - Data to be sent in the request body
 * @param config - Optional Axios config
 * @returns AxiosResponse with the response data
 * 
 * To use:
 * ```tsx
 * import { PUT } from '@/services/axios';
 * 
 * // Simple PUT
 * const response = await PUT({ url: '/endpoint', data: { key: 'value' } });
 * console.log(response.data);
 * 
 * // PUT with params in URL
 * const messageResponse = await PUT({ url: `/message/${id}`, data: { text: 'Hello' } });
 * console.log(messageResponse.data);
 * 
 * // PUT with query params
 * const updateResponse = await PUT({ url: '/messages', data: { read: true }, config: { params: { page: 1 } } });
 * console.log(updateResponse.data);
 * ```
 */
export const PUT = async <T>({ url, data, config }: APIRequestsWithData): Promise<AxiosResponse<T>> => {
    return await api.put<T>(url, data, config);
}

/**
 * DELETE - Performs a DELETE request.
 * @param url - API endpoint URL (can include params, e.g. `/message/[id]`)
 * @param config - Optional Axios config (can include query params)
 * @returns AxiosResponse with the response data
 * 
 * To use:
 * ```tsx
 * import { DELETE } from '@/services/axios';
 * 
 * // Simple DELETE
 * const response = await DELETE({ url: '/endpoint' });
 * console.log(response.data);
 * 
 * // DELETE with params in URL
 * const messageResponse = await DELETE({ url: `/message/${id}` });
 * console.log(messageResponse.data);
 * 
 * // DELETE with query params
 * const deleteResponse = await DELETE({ url: '/messages', config: { params: { page: 1 } } });
 * console.log(deleteResponse.data);
 * ```
 */
export const DELETE = async <T>({ url, config }: APIRequests): Promise<AxiosResponse<T>> => {
    return await api.delete<T>(url, config);
}

/**
 * PATCH - Performs a PATCH request.
 * @param url - API endpoint URL (can include params, e.g. `/message/[id]`)
 * @param data - Data to be sent in the request body
 * @param config - Optional Axios config (can include query params)
 * @returns AxiosResponse with the response data
 * 
 * To use:
 * ```tsx
 * import { PATCH } from '@/services/axios';
 * 
 * // Simple PATCH
 * const response = await PATCH({ url: '/endpoint', data: { key: 'value' } });
 * console.log(response.data);
 * 
 * // PATCH with params in URL
 * const messageResponse = await PATCH({ url: `/message/${id}`, data: { text: 'Updated' } });
 * console.log(messageResponse.data);
 * 
 * // PATCH with query params
 * const patchResponse = await PATCH({ url: '/messages', data: { read: true }, config: { params: { page: 1 } } });
 * console.log(patchResponse.data);
 * ```
 */
export const PATCH = async <T>({ url, data, config }: APIRequestsWithData): Promise<AxiosResponse<T>> => {
    return await api.patch<T>(url, data, config);
}