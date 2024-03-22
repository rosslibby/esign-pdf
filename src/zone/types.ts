export enum ZONE_TYPE {
  signature = 'signature',
  initials = 'initials',
  autoDate = 'autodate',
  text = 'text',
  number = 'number',
  variable = 'variable',
}

export type Zone = {
  id: string
  active: boolean
  documentId: string
  pageNumber: number
  encryption: string
  type: ZONE_TYPE
  variableKey?: string
  autoFill: boolean
  label: string
  index: number
  x: number
  y: number
  h: number
  w: number
  offsetX: number
  offsetY: number
}

export interface ZoneCtx {
  placing: boolean
  menu: boolean
  zone?: Zone
  bounds: [number, number]
  _: {
    [key: string]: Function
  }
}
