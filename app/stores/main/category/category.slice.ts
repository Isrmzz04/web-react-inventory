import type { ICategoryRequest, ICategoryResponse } from '~/types/main/category.types'
import * as CategoryAction from './category.action'
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { IPageInfoResponse, TPage, TRequestParams } from '~/types/global.types'
import mockCategories from "~/mocks/categories.json"

export const getAllCategories = createAsyncThunk('category/index', async (payload: TRequestParams) => {
  try {
    const response = await CategoryAction.index(payload)
    return response.data
  } catch (error: unknown) {
    throw new Error
  }
})

export const getOneCategory = createAsyncThunk('category/show', async (id: number) => {
  try {
    const response = await CategoryAction.show(id)
    return response.data
  } catch (error: unknown) {
    throw new Error
  }
})

export const createCategory = createAsyncThunk(
  'category/store',
  async (
    { payload, callback }: {
      payload: ICategoryRequest,
      callback: (code: number, message: string) => void
    }
  ) => {
    try {
      const response = await CategoryAction.store(payload);
      callback(response.meta.code, response.meta.message);
    } catch (error: any) {
      callback(error.meta.code, error.meta.message);
    }
  }
)
export const updateCategory = createAsyncThunk(
  'category/update',
  async (
    { id, payload, callback }: {
      id: number,
      payload: ICategoryRequest,
      callback: (code: number, message: string) => void
    }
  ) => {
    try {
      const response = await CategoryAction.update(id, payload);
      callback(response.meta.code, response.meta.message);
    } catch (error: any) {
      callback(error.meta.code, error.meta.message);
    }
  }
)

export const deleteCategory = createAsyncThunk(
  'category/destroy',
  async (
    { id, callback }: {
      id: number,
      callback: (code: number, message: string) => void
    }
  ) => {
    try {
      const response = await CategoryAction.destroy(id);
      callback(response.meta.code, response.meta.message);
    } catch (error: any) {
      callback(error.meta.code, error.meta.message);
    }
  }
)

export type TCategoryState = {
  isLoading: boolean
  isError: boolean
  listCategories: Array<ICategoryResponse>
  detailCategory: ICategoryResponse
  pagination: IPageInfoResponse
}

const initialState: TCategoryState = {
  isLoading: false,
  isError: false,
  listCategories: mockCategories.data.page_data,
  detailCategory: {} as ICategoryResponse,
  // pagination: {} as IPageInfoResponse
  pagination: mockCategories.data.page_info as IPageInfoResponse
}

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    updateState: (state, action: { payload: Partial<TCategoryState> }) => {
      Object.assign(state, action.payload)
    }
  },
  extraReducers(builder) {
    builder
      .addCase(getAllCategories
        .pending, (state) => {
          state.isLoading = true
          state.isError = false
        })
      .addCase(getAllCategories
        .fulfilled, (state, action) => {
          state.isLoading = false
          state.isError = false
          state.listCategories = action?.payload?.page_data
          state.pagination = action?.payload?.page_info
        })
      .addCase(getAllCategories
        .rejected, (state) => {
          state.isLoading = false
          state.isError = true
        })
      .addCase(getOneCategory
        .pending, (state) => {
          state.isLoading = true
          state.isError = false
        })
      .addCase(getOneCategory
        .fulfilled, (state, action) => {
          state.isLoading = false
          state.isError = false
          state.detailCategory = action?.payload
        })
      .addCase(getOneCategory
        .rejected, (state) => {
          state.isLoading = false
          state.isError = true
        })
      .addCase(createCategory
        .pending, (state) => {
          state.isLoading = true
          state.isError = false
        })
      .addCase(createCategory
        .fulfilled, (state) => {
          state.isLoading = false
          state.isError = false
        })
      .addCase(createCategory
        .rejected, (state) => {
          state.isLoading = false
          state.isError = true
        })
      .addCase(updateCategory
        .pending, (state) => {
          state.isLoading = true
          state.isError = false
        })
      .addCase(updateCategory
        .fulfilled, (state) => {
          state.isLoading = false
          state.isError = false
        })
      .addCase(updateCategory
        .rejected, (state) => {
          state.isLoading = false
          state.isError = true
        })
      .addCase(deleteCategory
        .pending, (state) => {
          state.isLoading = true
          state.isError = false
        })
      .addCase(deleteCategory
        .fulfilled, (state) => {
          state.isLoading = false
          state.isError = false
        })
      .addCase(deleteCategory
        .rejected, (state) => {
          state.isLoading = false
          state.isError = true
        })
  }
})

export const { updateState } = categorySlice.actions
export default categorySlice.reducer