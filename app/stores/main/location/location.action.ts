import apiRequest from "~/helpers/request";
import { rest } from "~/helpers/rest";
import type { TRequestParams } from "~/types/global.types";
import type { ILocationRequest } from "~/types/main/location.types";

export function index(request: TRequestParams) {
  return apiRequest<any>({
    url: rest.main.location.index,
    method: 'GET',
    params: request
  })
}

export function show(id: number) {
  return apiRequest<any>({
    url: rest.main.location.show.replace(':ID', id.toString()),
    method: 'GET',
  })
}

export function store(payload: ILocationRequest) {
  return apiRequest<any, ILocationRequest>({
    url: rest.main.location.store,
    method: 'POST',
    data: payload
  })
}

export function update(id: number, payload: ILocationRequest) {
  return apiRequest<any, ILocationRequest>({
    url: rest.main.location.update.replace(':ID', id.toString()),
    method: 'PUT',
    data: payload
  })
}

export function destroy(id: number) {
  return apiRequest<any>({
    url: rest.main.location.destroy.replace(':ID', id.toString()),
    method: 'DELETE'
  })
}