import { Zone } from '../zone/types'

export interface DocumentCtx {
  id: string
  name: string
  pages: number
  page: number
  bounds?: [number, number]
  source: string
  url: string
  zones: Zone[]
  _: {
    [key: string]: Function
  }
}
