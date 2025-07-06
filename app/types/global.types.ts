export interface IPayloadRequest<T = any> {
  url: string
  method: 'GET' | 'PUT' | 'DELETE' | 'PATCH' | 'POST'
  headers?: Record<string, string>
  data?: T
  params?: Record<string, any>;
}

export interface IPayloadResponse<T = any> {
  meta: {
    success: boolean
    code: number
    message: string
  }
  data: T
}

export interface IErrorResponse {
  code: number;
  message: string;
}

export interface IPageInfoResponse {
  current_page: number
  total_pages: number
  total_records: number
  limit: number
}

export type TPage = {
  view: 'browse' | 'form'
  action: 'create' | 'detail' | 'edit' | null
}

export type TRequestParams = {
  search?: string
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
  filter?: Object
}

export interface IPagination {
  limit: number
  setLimit: (size: number) => void
  setPage: (page: number) => void
}

export interface IFunctionPermissionResponse {
  menu: string
  permissions: {
    index: boolean
    show: boolean
    store: boolean
    update: boolean
    delete: boolean
  }
}

export interface MenuItem {
  key: string;
  icon: string;
  label: string;
  children?: MenuItem[];
}

export type IconName = 
  | 'IconLayout2' 
  | 'IconFolderOpen' 
  | 'IconDirectionHorizontal'
  | 'IconShoppingBagSearch'