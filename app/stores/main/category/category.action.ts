import apiRequest from "~/helpers/request";
import { rest } from "~/helpers/rest";
import type { TRequestParams } from "~/types/global.types";
import type { ICategoryRequest } from "~/types/main/category.types";

export function index(request: TRequestParams) {
  return apiRequest<any>({
    url: rest.main.category.index,
    method: 'GET',
    params: request
  })
}

export function show(id: number) {
  return apiRequest<any>({
    url: rest.main.category.show.replace(':ID', id.toString()),
    method: 'GET',
  })
}

export function store(payload: ICategoryRequest) {
  return apiRequest<any, ICategoryRequest>({
    url: rest.main.category.store,
    method: 'POST',
    data: payload
  })
}

export function update(id: number, payload: ICategoryRequest) {
  return apiRequest<any, ICategoryRequest>({
    url: rest.main.category.update.replace(':ID', id.toString()),
    method: 'PUT',
    data: payload
  })
}

export function destroy(id: number) {
  return apiRequest<any>({
    url: rest.main.category.destroy.replace(':ID', id.toString()),
    method: 'DELETE'
  })
}