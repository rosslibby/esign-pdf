import { useContext } from 'react'
import { documentCtx } from '../document'
import { zoneCtx } from '../zone'
import styles from './editor.module.css'
import { Zone } from '../zone/types'
import { LeftArrow, RightArrow, ZoneIcon } from './icons'
import Menu from '../zone/menu'

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

  const handleZoneClick = (selectedZone: Zone) => {
    setZone(selectedZone)
    setZones((zones: Zone[]) => zones.map(
      (zone: Zone) => ({ ...zone, active: zone.id === selectedZone.id })
    ))

    if (page !== selectedZone.pageNumber) {
      setPage(selectedZone.pageNumber)
    }
  }

  const previousPage = () => {
    setPage((prevState: number) => Math.max(prevState - 1, 1))
    setZone(undefined)
    setZones((zones: Zone[]) => zones.map(
      (zone) => ({ ...zone, active: false }),
    ))
  }

  const nextPage = () => {
    setPage((prevState: number) => Math.min(prevState + 1, pages))
    setZone(undefined)
    setZones((zones: Zone[]) => zones.map(
      (zone) => ({ ...zone, active: false }),
    ))
  }
  
  const pageZones = zones.filter(zone => zone.pageNumber === page)

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
        <button onClick={togglePlaceZone} className={styles.button}>
          <ZoneIcon />
          <span>Add zone</span>
        </button>
        {pageZones.length > 0 && (
          <>
            <span className={styles.controlGroupLabel}>Zones for {`page ${page}`}</span>
            <ul className={styles.list}>
              {pageZones
                .filter(zone => zone.pageNumber === page)
                .map((zone: Zone) => (
                  <li
                    key={zone.id}
                    className={`${styles.listItem} ${selectedZone?.id === zone.id && styles.selected}`}
                    onClick={() => handleZoneClick(zone)}
                  >
                    <ZoneIcon />
                    <div className={styles.expanded}>
                      <span>{zone.type}</span>
                      {selectedZone?.id === zone.id && (
                        <Menu {...zone} />
                      )}
                    </div>
                  </li>
                ))}
            </ul>
          </>
        )}
        {zones.length > 0 && (
          <>
            <span className={styles.controlGroupLabel}>All zones</span>
            <ul className={styles.list}>
              {zones
                .map((zone: Zone) => (
                  <li
                    key={zone.id}
                    className={`${styles.listItem} ${selectedZone?.id === zone.id && styles.selected}`}
                    onClick={() => handleZoneClick(zone)}
                  >
                    <ZoneIcon />
                    <div className={styles.expanded}>
                      <span>{zone.type}</span>
                      {selectedZone?.id === zone.id && (
                        <Menu {...zone} />
                      )}
                    </div>
                  </li>
                ))}
            </ul>
          </>
        )}
      </div>
      {/* <button onClick={finalize}>{finalizeCount === 0 ? 'Finalize zones' : 'Finalize PDF'}</button> */}
    </div>
  )
}