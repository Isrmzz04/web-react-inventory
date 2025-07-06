import type { ISupplierRequest, ISupplierResponse } from '~/types/main/supplier.types'
import * as SupplierAction from './supplier.action'
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { IPageInfoResponse, TPage, TRequestParams } from '~/types/global.types'
import mockSuppliers from "~/mocks/suppliers.json"

export const getAllSuppliers = createAsyncThunk('supplier/index', async (payload: TRequestParams) => {
  try {
    const response = await SupplierAction.index(payload)
    return response.data
  } catch (error: unknown) {
    throw new Error
  }
})

export const getOneSupplier = createAsyncThunk('supplier/show', async (id: number) => {
  try {
    const response = await SupplierAction.show(id)
    return response.data
  } catch (error: unknown) {
    throw new Error
  }
})

export const createSupplier = createAsyncThunk(
  'supplier/store',
  async (
    { payload, callback }: {
      payload: ISupplierRequest,
      callback: (code: number, message: string) => void
    }
  ) => {
    try {
      const response = await SupplierAction.store(payload);
      callback(response.meta.code, response.meta.message);
    } catch (error: any) {
      callback(error.meta.code, error.meta.message);
    }
  }
)

export const updateSupplier = createAsyncThunk(
  'supplier/update',
  async (
    { id, payload, callback }: {
      id: number,
      payload: ISupplierRequest,
      callback: (code: number, message: string) => void
    }
  ) => {
    try {
      const response = await SupplierAction.update(id, payload);
      callback(response.meta.code, response.meta.message);
    } catch (error: any) {
      callback(error.meta.code, error.meta.message);
    }
  }
)

export const deleteSupplier = createAsyncThunk(
  'supplier/destroy',
  async (
    { id, callback }: {
      id: number,
      callback: (code: number, message: string) => void
    }
  ) => {
    try {
      const response = await SupplierAction.destroy(id);
      callback(response.meta.code, response.meta.message);
    } catch (error: any) {
      callback(error.meta.code, error.meta.message);
    }
  }
)

export type TSupplierState = {
  isLoading: boolean
  isError: boolean
  listSuppliers: Array<ISupplierResponse>
  detailSupplier: ISupplierResponse
  pagination: IPageInfoResponse
}

const initialState: TSupplierState = {
  isLoading: false,
  isError: false,
  listSuppliers: mockSuppliers.data.page_data,
  detailSupplier: {} as ISupplierResponse,
  pagination: mockSuppliers.data.page_info as IPageInfoResponse
}

const supplierSlice = createSlice({
  name: 'supplier',
  initialState,
  reducers: {
    updateState: (state, action: { payload: Partial<TSupplierState> }) => {
      Object.assign(state, action.payload)
    }
  },
  extraReducers(builder) {
    builder
      .addCase(getAllSuppliers
        .pending, (state) => {
          state.isLoading = true
          state.isError = false
        })
      .addCase(getAllSuppliers
        .fulfilled, (state, action) => {
          state.isLoading = false
          state.isError = false
          state.listSuppliers = action?.payload?.page_data
          state.pagination = action?.payload?.page_info
        })
      .addCase(getAllSuppliers
        .rejected, (state) => {
          state.isLoading = false
          state.isError = true
        })
      .addCase(getOneSupplier
        .pending, (state) => {
          state.isLoading = true
          state.isError = false
        })
      .addCase(getOneSupplier
        .fulfilled, (state, action) => {
          state.isLoading = false
          state.isError = false
          state.detailSupplier = action?.payload
        })
      .addCase(getOneSupplier
        .rejected, (state) => {
          state.isLoading = false
          state.isError = true
        })
      .addCase(createSupplier
        .pending, (state) => {
          state.isLoading = true
          state.isError = false
        })
      .addCase(createSupplier
        .fulfilled, (state) => {
          state.isLoading = false
          state.isError = false
        })
      .addCase(createSupplier
        .rejected, (state) => {
          state.isLoading = false
          state.isError = true
        })
      .addCase(updateSupplier
        .pending, (state) => {
          state.isLoading = true
          state.isError = false
        })
      .addCase(updateSupplier
        .fulfilled, (state) => {
          state.isLoading = false
          state.isError = false
        })
      .addCase(updateSupplier
        .rejected, (state) => {
          state.isLoading = false
          state.isError = true
        })
      .addCase(deleteSupplier
        .pending, (state) => {
          state.isLoading = true
          state.isError = false
        })
      .addCase(deleteSupplier
        .fulfilled, (state) => {
          state.isLoading = false
          state.isError = false
        })
      .addCase(deleteSupplier
        .rejected, (state) => {
          state.isLoading = false
          state.isError = true
        })
  }
})

export const { updateState } = supplierSlice.actions
export default supplierSlice.reducer