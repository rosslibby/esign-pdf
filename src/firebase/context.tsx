import { ReactNode, createContext, useState } from 'react'
import { FirebaseCtx } from './types'

export const firebaseCtx = createContext<FirebaseCtx>({
  loading: false,
  _: {},
})

export default function FirebaseProvider({ children }: {
  children: ReactNode
}) {
  const [loading, setLoading] = useState<boolean>(false)
  const toggleLoading = () => setLoading((state) => !state)

  return (
    <firebaseCtx.Provider value={{
      loading,
      _: {
        toggleLoading,
      },
    }}>
      {children}
    </firebaseCtx.Provider>
  )
}
