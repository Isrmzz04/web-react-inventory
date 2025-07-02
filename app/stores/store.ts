import createWebStorage from "redux-persist/lib/storage/createWebStorage"
import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from "redux-persist"
import encryptTransform from "~/helpers/encrypt"
import type { IGlobalState } from "./global/global.slice"
import globalSlice from "./global/global.slice"
import authSlice, { type IAuthState } from "./main/auth/auth.slice"

const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null)
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value)
    },
    removeItem(_key: string) {
      return Promise.resolve()
    }
  }
}

const storage = typeof window !== 'undefined'
  ? createWebStorage('local')
  : createNoopStorage()

interface RootState {
  global: IGlobalState;
  auth: IAuthState
}

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth'],
  transforms: [encryptTransform],
};

const rootReducer = combineReducers({
  global: globalSlice,
  auth: authSlice
})

const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer as any);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;