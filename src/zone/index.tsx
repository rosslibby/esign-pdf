import { ReactNode, createContext, useState } from 'react'
import { Zone, ZoneCtx } from './types'

export const zoneCtx = createContext<ZoneCtx>({
  placing: false,
  menu: false,
  bounds: [0, 0],
  _: {},
})

export default function ZoneProvider({ children }: {
  children: ReactNode
}) {
  const [zone, setZone] = useState<Zone | undefined>()
  const [placing, setPlacing] = useState<boolean>(false)
  const [menu, setMenu] = useState<boolean>(false)
  const [bounds, setBounds] = useState<[number, number]>([0, 0])

  return (
    <zoneCtx.Provider value={{
      placing,
      menu,
      bounds,
      zone,
      _: {
        setBounds,
        setMenu,
        setPlacing,
        setZone,
      },
    }}>
      {children}
    </zoneCtx.Provider>
  )
}
