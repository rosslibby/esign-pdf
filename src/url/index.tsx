import { useContext } from 'react'
import { documentCtx } from '../document'

export default function DocumentUrl() {
  const { zones, _: { setZones } } = useContext(documentCtx)

  return (
    <input value={window.location.href} disabled />
  )
}
