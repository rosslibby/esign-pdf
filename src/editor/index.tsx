import { ReactNode } from 'react'
import Controls from './controls'
import styles from './editor.module.css'

export default function Editor({ children }: {
  children: ReactNode
}) {
  return (
    <div className={styles.wrapper}>
      {children}
    </div>
  )
}
