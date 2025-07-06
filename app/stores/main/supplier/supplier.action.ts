import apiRequest from "~/helpers/request";
import { rest } from "~/helpers/rest";
import type { TRequestParams } from "~/types/global.types";
import type { ISupplierRequest } from "~/types/main/supplier.types";

export function index(request: TRequestParams) {
  return apiRequest<any>({
    url: rest.main.supplier.index,
    method: 'GET',
    params: request
  })
}

export function show(id: number) {
  return apiRequest<any>({
    url: rest.main.supplier.show.replace(':ID', id.toString()),
    method: 'GET',
  })
}

export function store(payload: ISupplierRequest) {
  return apiRequest<any, ISupplierRequest>({
    url: rest.main.supplier.store,
    method: 'POST',
    data: payload
  })
}

export function update(id: number, payload: ISupplierRequest) {
  return apiRequest<any, ISupplierRequest>({
    url: rest.main.supplier.update.replace(':ID', id.toString()),
    method: 'PUT',
    data: payload
  })
}

export function destroy(id: number) {
  return apiRequest<any>({
    url: rest.main.supplier.destroy.replace(':ID', id.toString()),
    method: 'DELETE'
  })
}