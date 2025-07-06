import type { FormInstance } from "antd"
import type { IPagination } from "../global.types"

export interface ICategoryResponse {
  id: number
  name: string
  description: string
  created_at: string
  updated_at: string
}

export interface ICategoryRequest {
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
  form: FormInstance<ICategoryRequest>
  handleBack: () => void
  onSubmit: () => void
}