import { useContext } from 'react'
import { documentCtx } from '../document'
import { zoneCtx } from '../zone'
import styles from './editor.module.css'
import { Zone } from '../zone/types'
import { LeftArrow, RightArrow, ZoneIcon } from './icons'

export default function Controls() {
  const { bounds, menu, placing, zone: selectedZone, _: {
    setPlacing,
    setZone,
  } } = useContext(zoneCtx)
  const { page, pages, zones, _: {
    setPage,
    setZones,
  } } = useContext(documentCtx)
  const togglePlaceZone = () => setPlacing(
    (prevState: boolean) => !prevState,
  )

  const handleZoneClick = (id: string) => {
    setZone(zones.find((zone: Zone) => zone.id === id))
    setZones((zones: Zone[]) => zones.map(
      (zone: Zone) => ({ ...zone, active: zone.id === id })
    ))
  }

  const previousPage = () =>
    setPage((prevState: number) => Math.max(prevState - 1, 1))

  const nextPage = () =>
    setPage((prevState: number) => Math.min(prevState + 1, pages))

  return (
    <div className={styles.controls}>
      <div className={styles.controlGroup}>
        <span className={styles.controlGroupLabel}>{`Page ${page}`}</span>
        <div className={styles.pageControls}>
          <button
            className={styles.pageButton}
            onClick={previousPage}
            disabled={page <= 1}
          >
            <LeftArrow />
          </button>
          <button
            className={styles.pageButton}
            onClick={nextPage}
            disabled={page >= pages}
          >
            <RightArrow />
          </button>
        </div>
      </div>
      <div className={styles.controlGroup}>
        <span className={styles.controlGroupLabel}>Zones for {`page ${page}`}</span>
        <button onClick={togglePlaceZone} className={styles.button}>
          <ZoneIcon />
          <span>Add zone</span>
        </button>
        {zones.length > 0 && (
          <ul className={styles.list}>
            {zones.map((zone: Zone) => (
              <li
                key={zone.id}
                className={`${styles.listItem} ${selectedZone?.id === zone.id && styles.selected}`}
                onClick={() => handleZoneClick(zone.id)}
              >
                <ZoneIcon />
                <span>{zone.type}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* <button onClick={finalize}>{finalizeCount === 0 ? 'Finalize zones' : 'Finalize PDF'}</button> */}
    </div>
  )
}