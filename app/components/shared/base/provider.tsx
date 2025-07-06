import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/lib/integration/react"
import { persistor, store } from "~/stores/store"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}