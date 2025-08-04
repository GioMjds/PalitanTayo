import { AxiosRequestConfig } from "axios";

export type APIRequests = {
    url: string;
    config?: AxiosRequestConfig;
}

export type APIRequestsWithData<T = Record<string, unknown>> = APIRequests & {
    data: T;
}