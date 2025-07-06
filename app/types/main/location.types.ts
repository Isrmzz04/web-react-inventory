import type { FormInstance } from "antd"
import type { IPagination } from "../global.types"

export interface ILocationResponse {
  id: number
  name: string
  description: string
  created_at: string
  updated_at: string
}

export interface ILocationRequest {
  name: string
  description: string
} 

export interface IBrowseView extends IPagination {
  handleSearch: (value: string) => void
  handleCreate: () => void
  handleDetail: (id: number, isEdit: boolean) => void
  handleDelete: (id: number) => void
}

export interface IFormView {
  form: FormInstance<ILocationRequest>
  handleBack: () => void
  onSubmit: () => void
}