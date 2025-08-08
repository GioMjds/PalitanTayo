import { AxiosRequestConfig } from "axios";

export type APIRequests = {
    url: string;
    config?: AxiosRequestConfig<any>;
}

export type APIRequestsWithData<T = Record<string, unknown> | FormData> = APIRequests & {
    data?: T;
}