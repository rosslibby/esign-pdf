import { ReactNode, createContext, useState } from 'react'
import { DocumentCtx } from './types'
import { Zone } from '../zone/types'

export const documentCtx = createContext<DocumentCtx>({
  id: '',
  pages: 1,
  page: 1,
  name: 'Example PDF',
  source: './document.pdf',
  url: '',
  zones: [],
  _: {},
})

export default function DocumentProvider({ children }: {
  children: ReactNode
}) {
  const [id, setId] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [source, setSource] = useState<string>('')
  const [url, setUrl] = useState<string>('')
  const [zones, setZones] = useState<Zone[]>([])
  const [pages, setPages] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const [bounds, setBounds] = useState<[number, number] | undefined>()

  return (
    <documentCtx.Provider value={{
      id,
      bounds,
      name,
      page,
      pages,
      source,
      url,
      zones,
      _: {
        setBounds,
        setPage,
        setPages,
        setUrl,
        setZones,
      },
    }}>
      {children}
    </documentCtx.Provider>
  )
}