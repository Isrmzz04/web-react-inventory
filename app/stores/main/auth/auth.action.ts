import apiRequest from "~/helpers/request";
import { rest } from "~/helpers/rest";
import type { IAuthRequest, IAuthResponse } from "~/types/main/auth.types";

export function Login(payload: IAuthRequest) {
  return apiRequest<IAuthResponse, IAuthRequest>({
    url: rest.main.auth.login,
    method: 'POST',
    data: payload
  })
}