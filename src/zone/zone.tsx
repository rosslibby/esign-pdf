import styles from './zone.module.css'
import { Zone } from './types'
import { useContext } from 'react'
import { zoneCtx } from '.'
import { documentCtx } from '../document'

export const ZoneBounds = (props: Zone) => {
  const { active, id, x, y, w, h, index } = props
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

  return (
    <div
      className={classnames}
      data-index={index}
      onClick={handleClick}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${w}px`,
        height: `${h}px`,
      }}
    />
  )
}
