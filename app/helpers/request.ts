import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { message, Modal } from "antd";
import { baseUrl, rest } from "./rest";
import { getToken, removeToken, setToken } from "./token";
import type { IPayloadResponse, IPayloadRequest } from "~/types/global.types";
import type { IAuthResponse } from "~/types/main/auth.types";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: baseUrl,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    const isAuthEndpoint = response.config.url?.includes(rest.main.auth.login);
    if (isAuthEndpoint) {
      const authResponse = response.data as IPayloadResponse<IAuthResponse>;
      if (authResponse.data?.access_token) {
        setToken(authResponse.data.access_token);
      }
    }
    return response;
  },
  (error) => {
    if (!error.response) {
      Modal.error({ title: 'Network Error', content: 'No server response.' });
      return Promise.reject(error);
    }

    switch (error.response.status) {
      case 401:
        Modal.warning({
          title: 'Unauthorized',
          content: error.response?.data?.meta?.message,
          onOk: () => {
            removeToken();
            window.location.href = `${window.location.origin}/auth/login`;
          },
        });
        break;
      case 403:
        Modal.error({ title: 'Forbidden', content: 'You lack permission.' });
        break;
      case 500:
        Modal.error({ title: 'Server Error', content: 'Internal server error.' });
        break;
      default:
        message.error(error.response?.data?.meta?.message || 'Unknown error');
    }
    return Promise.reject(error);
  }
);

export default async function apiRequest<
  ResponseType = unknown,
  RequestType = Record<string, unknown>
>(config: IPayloadRequest<RequestType>): Promise<IPayloadResponse<ResponseType>> {
  try {
    const response = await axiosInstance.request<IPayloadResponse<ResponseType>>(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw {
        meta: {
          success: false,
          code: error.response?.status || 500,
          message: error.response?.data?.meta?.message || error.message,
        },
        data: null,
      };
    }
    throw error;
  }
}