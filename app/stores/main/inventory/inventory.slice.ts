import type { IInventoryRequest, IInventoryResponse } from '~/types/main/inventory.types'
import * as InventoryAction from './inventory.action'
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { IPageInfoResponse, TPage, TRequestParams } from '~/types/global.types'

export const getAllInventories = createAsyncThunk('inventory/index', async (payload: TRequestParams) => {
  try {
    const response = await InventoryAction.index(payload)
    return response.data
  } catch (error: unknown) {
    throw new Error
  }
})

export const getOneInventory = createAsyncThunk('inventory/show', async (id: number) => {
  try {
    const response = await InventoryAction.show(id)
    return response.data
  } catch (error: unknown) {
    throw new Error
  }
})

export const createInventory = createAsyncThunk(
  'inventory/store',
  async (
    { payload, callback }: {
      payload: IInventoryRequest,
      callback: (code: number, message: string) => void
    }
  ) => {
    try {
      const response = await InventoryAction.store(payload);
      callback(response.meta.code, response.meta.message);
    } catch (error: any) {
      callback(error.meta.code, error.meta.message);
    }
  }
)

export const updateInventory = createAsyncThunk(
  'inventory/update',
  async (
    { id, payload, callback }: {
      id: number,
      payload: IInventoryRequest,
      callback: (code: number, message: string) => void
    }
  ) => {
    try {
      const response = await InventoryAction.update(id, payload);
      callback(response.meta.code, response.meta.message);
    } catch (error: any) {
      callback(error.meta.code, error.meta.message);
    }
  }
)

export const deleteInventory = createAsyncThunk(
  'inventory/destroy',
  async (
    { id, callback }: {
      id: number,
      callback: (code: number, message: string) => void
    }
  ) => {
    try {
      const response = await InventoryAction.destroy(id);
      callback(response.meta.code, response.meta.message);
    } catch (error: any) {
      callback(error.meta.code, error.meta.message);
    }
  }
)

export type TInventoryState = {
  isLoading: boolean
  isError: boolean
  listInventories: Array<IInventoryResponse>
  detailInventory: IInventoryResponse
  pagination: IPageInfoResponse
}

const initialState: TInventoryState = {
  isLoading: false,
  isError: false,
  listInventories: [],
  detailInventory: {} as IInventoryResponse,
  pagination: {} as IPageInfoResponse
}

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    updateState: (state, action: { payload: Partial<TInventoryState> }) => {
      Object.assign(state, action.payload)
    }
  },
  extraReducers(builder) {
    builder
      .addCase(getAllInventories
        .pending, (state) => {
          state.isLoading = true
          state.isError = false
        })
      .addCase(getAllInventories
        .fulfilled, (state, action) => {
          state.isLoading = false
          state.isError = false
          state.listInventories = action?.payload?.page_data
          state.pagination = action?.payload?.page_info
        })
      .addCase(getAllInventories
        .rejected, (state) => {
          state.isLoading = false
          state.isError = true
        })
      .addCase(getOneInventory
        .pending, (state) => {
          state.isLoading = true
          state.isError = false
        })
      .addCase(getOneInventory
        .fulfilled, (state, action) => {
          state.isLoading = false
          state.isError = false
          state.detailInventory = action?.payload
        })
      .addCase(getOneInventory
        .rejected, (state) => {
          state.isLoading = false
          state.isError = true
        })
      .addCase(createInventory
        .pending, (state) => {
          state.isLoading = true
          state.isError = false
        })
      .addCase(createInventory
        .fulfilled, (state) => {
          state.isLoading = false
          state.isError = false
        })
      .addCase(createInventory
        .rejected, (state) => {
          state.isLoading = false
          state.isError = true
        })
      .addCase(updateInventory
        .pending, (state) => {
          state.isLoading = true
          state.isError = false
        })
      .addCase(updateInventory
        .fulfilled, (state) => {
          state.isLoading = false
          state.isError = false
        })
      .addCase(updateInventory
        .rejected, (state) => {
          state.isLoading = false
          state.isError = true
        })
      .addCase(deleteInventory
        .pending, (state) => {
          state.isLoading = true
          state.isError = false
        })
      .addCase(deleteInventory
        .fulfilled, (state) => {
          state.isLoading = false
          state.isError = false
        })
      .addCase(deleteInventory
        .rejected, (state) => {
          state.isLoading = false
          state.isError = true
        })
  }
})

export const { updateState } = inventorySlice.actions
export default inventorySlice.reducer