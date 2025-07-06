import apiRequest from "~/helpers/request";
import { rest } from "~/helpers/rest";
import type { TRequestParams } from "~/types/global.types";
import type { IInventoryRequest } from "~/types/main/inventory.types";

export function index(request: TRequestParams) {
  return apiRequest<any>({
    url: rest.main.inventory.index,
    method: 'GET',
    params: request
  })
}

export function show(id: number) {
  return apiRequest<any>({
    url: rest.main.inventory.show.replace(':ID', id.toString()),
    method: 'GET',
  })
}

export function store(payload: IInventoryRequest) {
  return apiRequest<any, IInventoryRequest>({
    url: rest.main.inventory.store,
    method: 'POST',
    data: payload
  })
}

export function update(id: number, payload: IInventoryRequest) {
  return apiRequest<any, IInventoryRequest>({
    url: rest.main.inventory.update.replace(':ID', id.toString()),
    method: 'PUT',
    data: payload
  })
}

export function destroy(id: number) {
  return apiRequest<any>({
    url: rest.main.inventory.destroy.replace(':ID', id.toString()),
    method: 'DELETE'
  })
}