import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { AxiosInstance } from 'axios';

type APIRequests = {
    url: string;
    config?: AxiosRequestConfig;
}

type APIRequestsWithData<T = Record<string, unknown>> = APIRequests & {
    data: T;
}

const api: AxiosInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
    withCredentials: true,
});

/**
 * GET - Performs a GET request.
 * @param url - API endpoint URL
 * @param config - Optional Axios config
 * @returns AxiosResponse with the response data
 * 
 * To use:
 * ```typescript
 * import { GET } from '@/services/axios';
 * 
 * const response = await GET('/endpoint');
 * console.log(response.data);
 * ```
 */
export const GET = async <T>({ url, config }: APIRequests): Promise<AxiosResponse<T>> => {
    return api.get<T>(url, config);
}

/**
 * POST - Performs a POST request.
 * @param url - API endpoint URL
 * @param data - Data to be sent in the request body
 * @param config - Optional Axios config
 * @returns AxiosResponse with the response data
 * 
 * To use:
 * ```typescript
 * import { POST } from '@/services/axios';
 * 
 * const response = await POST('/endpoint', { key: 'value' });
 * console.log(response.data);
 * ```
 */
export const POST = async <T>({ url, data, config }: APIRequestsWithData): Promise<AxiosResponse<T>> => {
    return api.post<T>(url, data, config);
}

/** * PUT - Performs a PUT request.
 * @param url - API endpoint URL
 * @param data - Data to be sent in the request body
 * @param config - Optional Axios config
 * @returns AxiosResponse with the response data
 * 
 * To use:
 * ```typescript
 * import { PUT } from '@/services/axios';
 * 
 * const response = await PUT('/endpoint', { key: 'value' });
 * console.log(response.data);
 * ```
 */
export const PUT = async <T>({ url, data, config }: APIRequestsWithData): Promise<AxiosResponse<T>> => {
    return api.put<T>(url, data, config);
}

/**
 * DELETE - Performs a DELETE request.
 * @param url - API endpoint URL
 * @param config - Optional Axios config
 * @returns AxiosResponse with the response data
 * 
 * To use:
 * ```typescript
 * import { DELETE } from '@/services/axios';
 * 
 * const response = await DELETE('/endpoint');
 * console.log(response.data);
 * ```
 */
export const DELETE = async <T>({ url, config }: APIRequests): Promise<AxiosResponse<T>> => {
    return api.delete<T>(url, config);
}

/** * PATCH - Performs a PATCH request.
 * @param url - API endpoint URL
 * @param data - Data to be sent in the request body
 * @param config - Optional Axios config
 * @returns AxiosResponse with the response data
 * 
 * To use:
 * ```typescript
 * import { PATCH } from '@/services/axios';
 * 
 * const response = await PATCH('/endpoint', { key: 'value' });
 * console.log(response.data);
 * ```
 */
export const PATCH = async <T>({ url, data, config }: APIRequestsWithData): Promise<AxiosResponse<T>> => {
    return api.patch<T>(url, data, config);
}