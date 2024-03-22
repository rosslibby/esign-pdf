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
  documentId: string
  pageNumber: number
  encryption: string
  type: ZONE_TYPE
  index: number
  x: number
  y: number
  h: number
  w: number
  offsetX: number
  offsetY: number
}
