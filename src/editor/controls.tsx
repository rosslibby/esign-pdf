import { useContext } from 'react'
import { documentCtx } from '../document'
import { zoneCtx } from '../zone'

export default function Controls() {
  const { bounds, menu, placing, zone, _: {
    setPlacing,
  } } = useContext(zoneCtx)
  const { page, pages, _: {
    setPage,
  } } = useContext(documentCtx)
  const togglePlaceZone = () => setPlacing(
    (prevState: boolean) => !prevState,
  )

  const previousPage = () =>
    setPage((prevState: number) => Math.max(prevState - 1, 1))

  const nextPage = () =>
    setPage((prevState: number) => Math.min(prevState + 1, pages))

  return (
    <div>
      <button
        onClick={previousPage}
        disabled={page <= 1}
      >&larr;</button>
      <button
        onClick={nextPage}
        disabled={page >= pages}
      >&rarr;</button>
      <button onClick={togglePlaceZone}>{placing ? 'Finished adding zones' : 'Add zones'}</button>
      {/* <button onClick={finalize}>{finalizeCount === 0 ? 'Finalize zones' : 'Finalize PDF'}</button> */}
    </div>
  )
}