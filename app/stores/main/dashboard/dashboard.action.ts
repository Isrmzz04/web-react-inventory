import apiRequest from "~/helpers/request";
import { rest } from "~/helpers/rest";

export function index() {
  return apiRequest<any>({
    url: rest.main.dashboard,
    method: 'GET',
  })
}