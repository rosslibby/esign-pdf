import { Zone } from '../pdf/types'

export interface FirebaseCtx {
  loading: boolean
  _: {
    [key: string]: Function
  }
}

export type ZonesMap = {
  [key: string]: Zone
}
