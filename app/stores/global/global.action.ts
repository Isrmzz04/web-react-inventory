import apiRequest from "~/helpers/request";
import { rest } from "~/helpers/rest";
import type { IBorrowingRequest } from "~/types/main/borrowing.types";

export function borrowingRequest(payload: IBorrowingRequest) {
  return apiRequest<any, IBorrowingRequest>({
    url: rest.main.borrowingRequest,
    method: 'POST',
    data: payload
  })
}

export function inventoryByBarcode(id: number) {
  return apiRequest<any>({
    url: rest.main.inventoryByBarcode.replace(':ID', id.toString()),
    method: 'GET',
  })
}