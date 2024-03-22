import { doc, setDoc } from 'firebase/firestore'
import { useCallback, useContext } from 'react'
import { firebaseCtx } from '../context'
import { Zone } from '../../pdf/types'
import { db } from '..'
import { documentCtx } from '../../document'
import { ZonesMap } from '../types'

export const useDb = () => {
  const { id: documentId } = useContext(documentCtx)
  const { _: { toggleLoading } } = useContext(firebaseCtx)
  const addZone = useCallback(
    async (zones: Zone[]): Promise<boolean> => new Promise((res) => {
      toggleLoading()
      const zonesMap: ZonesMap = zones.reduce((acc, zone: Zone) => {
        return { ...acc, [zone.id]: zone }
      }, {})
      const documentRef = doc(db, 'documents', documentId)
      setDoc(documentRef, { zones: zonesMap }, { merge: true })
        .then((snapshot) => {
          console.log('Zones added successfully')
          toggleLoading()
          res(true)
        })
        .catch((err) => {
          console.error('There was a problem adding the zones:', err)
          toggleLoading()
          res(false)
        })
    }
  ), [toggleLoading])

  return {
    addZone,
  }
}
