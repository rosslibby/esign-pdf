import styles from './zone.module.css'
import { Zone } from './types'
import { useContext } from 'react'
import { zoneCtx } from '.'
import { documentCtx } from '../document'

export const ZoneBounds = (props: Zone) => {
  const { active, id, label, x, y, w, h, index } = props
  const { placing, _: { setZone } } = useContext(zoneCtx)
  const { _: { setZones } } = useContext(documentCtx)
  const classnames = [
    styles.zone,
    ...(active ? [styles.active] : []),
    ...(placing ? [styles.drawing] : []),
  ].join(' ')
  const handleClick = () => {
    setZone(props)
    setZones((prevState: Zone[]) => prevState.map(
      (zone: Zone) => ({ ...zone, active: zone.id === id }),
    ))
  }

  const left = (w < 0 ? (x + w) : x) + 'px'
  const top = (h < 0 ? (y + h) : y) + 'px'
  const height = Math.abs(h) + 'px'
  const width = Math.abs(w) + 'px'

  return (
    <div
      className={classnames}
      data-index={index}
      onClick={handleClick}
      style={{
        height,
        left,
        top,
        width,
      }}
    >
      {label.length > 0 && (
        <div className={styles.label}>{label}</div>
      )}
    </div>
  )
}
