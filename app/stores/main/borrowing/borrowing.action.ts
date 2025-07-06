import apiRequest from "~/helpers/request";
import { rest } from "~/helpers/rest";
import type { TRequestParams } from "~/types/global.types";
import type { IBorrowingRequest } from "~/types/main/borrowing.types";

export function index(request: TRequestParams) {
  return apiRequest<any>({
    url: rest.main.borrowing.index,
    method: 'GET',
    params: request
  })
}

export function show(id: number) {
  return apiRequest<any>({
    url: rest.main.borrowing.show.replace(':ID', id.toString()),
    method: 'GET',
  })
}

export function store(payload: IBorrowingRequest) {
  return apiRequest<any, IBorrowingRequest>({
    url: rest.main.borrowing.store,
    method: 'POST',
    data: payload
  })
}

export function update(id: number, payload: IBorrowingRequest) {
  return apiRequest<any, IBorrowingRequest>({
    url: rest.main.borrowing.update.replace(':ID', id.toString()),
    method: 'PUT',
    data: payload
  })
}

export function destroy(id: number) {
  return apiRequest<any>({
    url: rest.main.borrowing.destroy.replace(':ID', id.toString()),
    method: 'DELETE'
  })
}