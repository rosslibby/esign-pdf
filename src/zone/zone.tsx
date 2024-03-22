import styles from './zone.module.css'
import { Zone } from './types'

export const ZoneBounds = ({ active, x, y, w, h, index }: Zone) => (
  <div
    className={`${styles.zone} ${active && styles.active}`}
    data-index={index}
    style={{
      left: `${x}px`,
      top: `${y}px`,
      width: `${w}px`,
      height: `${h}px`,
    }}
  />
)
