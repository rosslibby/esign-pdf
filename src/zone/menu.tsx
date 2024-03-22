import { ChangeEvent, useState } from 'react'
import { ZONE_TYPE, Zone } from './types'
import styles from './zone.module.css'

const zoneTypes = [
  ZONE_TYPE.signature,
  ZONE_TYPE.initials,
  ZONE_TYPE.autoDate,
  ZONE_TYPE.text,
  ZONE_TYPE.number,
  ZONE_TYPE.variable,
]

export default function Menu({ id, type, label }: Zone) {
  const [zoneType, setZoneType] = useState<ZONE_TYPE>(type)
  const [zoneLabel, setZoneLabel] = useState<string>(label)

  const changeType = (e: ChangeEvent<HTMLSelectElement>) => {
    setZoneType((prevState: ZONE_TYPE) => e.target.value as ZONE_TYPE)
  }
  const changeLabel = (e: ChangeEvent<HTMLInputElement>) => {
    setZoneLabel(e.target.value)
  }

  return (
    <div className={styles.menu}>
      <select onChange={changeType}>
        {zoneTypes.map((type) => (
          <option key={`select-type-${type}`} value={type}>
            {type}
          </option>
        ))}
      </select>
      <input type="text" value={label} onChange={changeLabel} />
      <button>Save zone</button>
      <button>Cancel (remove zone)</button>
    </div>
  )
}
