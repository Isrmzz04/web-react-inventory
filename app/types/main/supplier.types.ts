import type { FormInstance } from "antd"
import type { IPagination } from "../global.types"

export interface ISupplierResponse {
  id: number
  name: string
  address: string
  phone: string
  email: string
  created_at: string
  updated_at: string
}

export interface ISupplierRequest {
  name: string
  address: string
  phone: string
  email: string
} 

export interface IBrowseView extends IPagination {
  handleSearch: (value: string) => void
  handleCreate: () => void
  handleDetail: (id: number, isEdit: boolean) => void
  handleDelete: (id: number) => void
}

export interface IFormView {
  form: FormInstance<ISupplierRequest>
  handleBack: () => void
  onSubmit: () => void
}