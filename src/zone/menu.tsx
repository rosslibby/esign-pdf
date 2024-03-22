import { ChangeEvent, useContext, useState } from 'react'
import { ZONE_TYPE, Zone } from './types'
import styles from './zone.module.css'
import { zoneCtx } from '.'
import { documentCtx } from '../document'
import { Trash } from '../editor/icons'

const zoneTypes = [
  ZONE_TYPE.signature,
  ZONE_TYPE.initials,
  ZONE_TYPE.autoDate,
  ZONE_TYPE.text,
  ZONE_TYPE.number,
  ZONE_TYPE.variable,
]

export default function Menu({ id, variableKey, type, label }: Zone) {
  const { _: { setZone } } = useContext(zoneCtx)
  const { _: { setZones } } = useContext(documentCtx)

  const deleteZone = () => {
    setZone(undefined)
    setZones((zones: Zone[]) => zones.filter((zone: Zone) => zone.id !== id))
  }
  const changeType = (e: ChangeEvent<HTMLSelectElement>) => {
    setZone((prevState: Zone) => ({
      ...prevState,
      type: e.target.value as ZONE_TYPE,
    }))
    setZones((prevState: Zone[]) => prevState.map(
      (zone: Zone) => zone.id === id
        ? ({ ...zone, type: e.target.value as ZONE_TYPE })
        : zone,
    ))
  }
  const changeLabel = (e: ChangeEvent<HTMLInputElement>) => {
    setZone((prevState: Zone) => ({ ...prevState, label: e.target.value }))
    setZones((prevState: Zone[]) => prevState.map(
      (zone: Zone) => zone.id === id
        ? ({ ...zone, label: e.target.value })
        : zone,
    ))
  }
  const changeVariableKey = (e: ChangeEvent<HTMLInputElement>) => {
    setZone((prevState: Zone) => ({
      ...prevState,
      variableKey: e.target.value,
    }))
    setZones((prevState: Zone[]) => prevState.map(
      (zone: Zone) => zone.id === id
        ? ({ ...zone, variableKey: e.target.value })
        : zone,
    ))
  }

  return (
    <div className={styles.menu}>
      <select onChange={changeType} className={styles.field}>
        {zoneTypes.map((type) => (
          <option key={`select-type-${type}`} value={type}>
            {type}
          </option>
        ))}
      </select>
      {type === ZONE_TYPE.variable && (
        <input
          className={styles.field}
          placeholder="Query param (e.g. 'name')"
          type="text"
          value={variableKey}
          onChange={changeVariableKey}
        />
      )}
      <input
        className={styles.field}
        placeholder="Label"
        type="text"
        value={label}
        onChange={changeLabel}
      />
      <button className={styles.button} onClick={deleteZone}>
        <Trash />
        <span>Delete</span>
      </button>
    </div>
  )
}
