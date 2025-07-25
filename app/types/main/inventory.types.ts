import type { FormInstance } from "antd"
import type { IPagination } from "../global.types"
import type { ICategoryResponse } from "./category.types";
import type { ILocationResponse } from "./location.types";
import type { ISupplierResponse } from "./supplier.types";

export interface IInventoryResponse {
  id: number;
  name: string;
  category_id: string;
  location_id: string;
  supplier_id: string;
  quantity: string;
  unit: string;
  condition: string;
  category: ICategoryResponse;
  location: ILocationResponse;
  supplier: ISupplierResponse;
  created_at: string;
  updated_at: string;
}

export interface IInventoryBorrowingResponse {
  id: number;
  name: string;
  quantity: string;
  unit: string;
  created_at: string;
  updated_at: string;
  category_name: string;
  borrowings: Array<{
    id: number;
    kode_peminjaman: string;
    nama: string;
    email: string;
    divisi: string;
    nomor_identitas: string;
    qty: string;
    tgl_peminjaman: string;
    tgl_pengembalian: string | null;
    approved: string | null;
    created_at: string;
    updated_at: string;
  }>;
}


export interface IInventoryRequest {
  name: string;
  category_id: string;
  location_id: string;
  supplier_id: string;
  quantity: string;
  unit: string;
  condition: string;
} 

export interface IBrowseView extends IPagination {
  handleSearch: (value: string) => void
  handleCreate: () => void
  handleDetail: (id: number, isEdit: boolean) => void
  handleDelete: (id: number) => void
}

export interface IFormView {
  form: FormInstance<IInventoryRequest>
  handleBack: () => void
  onSubmit: () => void
}