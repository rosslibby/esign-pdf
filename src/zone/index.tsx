import { ReactNode, createContext, useState } from 'react'
import { ZoneCtx } from './types'

export const zoneCtx = createContext<ZoneCtx>({
  placing: false,
  menu: false,
  bounds: [0, 0],
  _: {},
})

export default function ZoneProvider({ children }: {
  children: ReactNode
}) {
  const [placing, setPlacing] = useState<boolean>(false)
  const [menu, setMenu] = useState<boolean>(false)
  const [bounds, setBounds] = useState<[number, number]>([0, 0])

  return (
    <zoneCtx.Provider value={{
      placing,
      menu,
      bounds,
      _: {
        setBounds,
        setMenu,
        setPlacing,
      },
    }}>
      {children}
    </zoneCtx.Provider>
  )
}
