import type { FormInstance } from "antd";
import type { IPagination } from "../global.types";

export interface IBorrowingResponse {
  id: number;
  kode_peminjaman: string;
  nama: string;
  email: string;
  divisi: string;
  nomor_identitas: string;
  inventory_id: string;
  qty: string;
  tgl_peminjaman: any
  tgl_pengembalian: any
  approved: string | null
  created_at: string;
  updated_at: string;
  inventory: {
    id: number;
    name: string;
    category_id: string;
    location_id: string;
    supplier_id: string;
    quantity: string;
    unit: string;
    condition: string;
    created_at: string;
    updated_at: string;
  };
}

export interface IBorrowingRequest {
  kode_peminjaman?: string;
  nama: string;
  email: string;
  divisi: string;
  nomor_identitas: string;
  inventory_id: number;
  qty: number;
  tgl_peminjaman: any
  tgl_pengembalian?: any;
  approved?: any
}

export interface IBrowseView extends IPagination {
  handleSearch: (value: string) => void
  handleCreate: () => void
  handleDetail: (id: number, isEdit: boolean) => void
  handleDelete: (id: number) => void
}

export interface IFormView {
  form: FormInstance<IBorrowingRequest>
  handleBack: () => void
  onSubmit: () => void
}