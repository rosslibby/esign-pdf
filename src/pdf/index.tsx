import { useContext, useEffect, useRef, useState } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import styles from './pdf.module.css'
import { MyDocument } from './render';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { v4 as uuid } from 'uuid'
import { documentCtx } from '../document';
import { ZoneBounds } from '../zone/zone';
import { ZONE_TYPE, Zone } from '../zone/types';
import { zoneCtx } from '../zone';
import { useClientDocument } from './hooks';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

export const PdfViewer = ({ fileUrl }: {
  fileUrl: string
}) => {
  const { finalize } = useClientDocument()
  const { _: { setZone } } = useContext(zoneCtx)
  const {
    bounds,
    page,
    pages,
    zones,
    _: {
      setBounds,
      setPage,
      setPages,
      setZones,
    },
  } = useContext(documentCtx)
  const containerRef = useRef<HTMLDivElement>(null)
  const { placing, _: { setPlacing } } = useContext(zoneCtx)
  const pdfRef = useRef<HTMLDivElement>(null)
  const [finalSrc, setFinalSrc] = useState<string>('')
  const [finalizeCount, setFinalizeCount] = useState<number>(0)
  const [src, setSrc] = useState<string>('')
  const [placingZone, setPlacingZone] = useState<boolean>(false)
  const [drawingZone, setDrawingZone] = useState<boolean>(false)
  const [tempZone, setTempZone] = useState<Zone | undefined>()
  const [starting, setStarting] = useState<[number, number]>([0, 0])

  useEffect(() => {
    let container = containerRef.current || null
    let doc = pdfRef.current || null
    let current = doc?.firstElementChild || null
    const mouseDown = (e: MouseEvent) => {
      const bounds = current?.getBoundingClientRect()
      if (bounds) {
        const {left, top, width, height} = bounds
        if (e.clientX > left + width || e.clientX < left || e.clientY > top + height || e.clientY < top) {
          return
        }
        const newZone: Zone = {
          id: uuid(),
          active: true,
          documentId: '',
          pageNumber: page,
          encryption: '',
          type: ZONE_TYPE.signature,
          autoFill: false,
          label: '',
          index: zones.length,
          x: e.clientX - left,
          y: e.clientY - top,
          w: 0,
          h: 0,
          offsetX: 0,
          offsetY: 0,
        }
        setZones((prevState: Zone[]) => [
          ...prevState.map((zone: Zone) => ({
            ...zone,
            active: false,
          })),
          newZone,
        ])
        setStarting([e.clientX, e.clientY])
        setDrawingZone(true)
      }
    }
    function mouseMove(e: MouseEvent) {
      const [startW, startH] = starting
      setZones((prevState: Zone[]) =>
        prevState.map((zone: Zone, i: number) =>
          i === zones.length - 1
            ? ({
              ...zone,
              w: e.clientX - startW,
              h: e.clientY - startH,
            })
            : zone
        )
      )
    }
    function mouseUp(e: MouseEvent) {
      setDrawingZone(false)
      const final = document
        .querySelector(`[data-index="${zones.length - 1}"]`) as HTMLElement
      if (final) {
        const zonePayload = {
          offsetX: final.offsetLeft,
          offsetY: final.offsetTop,
          active: true,
        }

        setZones((prevState: Zone[]) => prevState.map(
          (zone: Zone, i: number) => {
            if (i === zones.length - 1) {
              setZone({ ...zone, ...zonePayload })

              return ({
                ...zone,
                ...zonePayload,
              })
            } else {
              return ({ ...zone, active: false })
            }
          }
        ))
        setPlacing(false)
      }
    }

    if (drawingZone) {
      container!.addEventListener('mousemove', mouseMove)
      container!.addEventListener('mouseup', mouseUp)
    } else {
      container!.removeEventListener('mousemove', mouseMove)
      container!.removeEventListener('mouseup', mouseUp)
    }

    if (current && placing) {
      if (!bounds) {
        const { left, top } = current.getBoundingClientRect()
        setBounds([left, top])
      }
      container!.addEventListener('mousedown', mouseDown)
    }

    return () => {
      if (container) {
        container.removeEventListener('mousedown', mouseDown)
        container.removeEventListener('mouseup', mouseUp)
        container.removeEventListener('mousemove', mouseMove)
      }

      container = null
      current = null
    }
  }, [setStarting, starting, setTempZone, tempZone, drawingZone, setDrawingZone, setBounds, setPlacing, setZones, pdfRef, placing, setZones])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setPages(numPages)
  }

  const togglePlaceZone = () =>
    setPlacingZone((prevState: boolean) => !prevState)

  const previousPage = () =>
    setPage((prevState: number) => Math.max(prevState - 1, 1))

  const nextPage = () =>
    setPage((prevState: number) => Math.min(prevState + 1, pages))

  const getImg = () => {
    const importPDFCanvas: HTMLCanvasElement = document
      .querySelector('#content canvas') as HTMLCanvasElement
    const pdfAsImageSrc = importPDFCanvas.toDataURL()
    setSrc(pdfAsImageSrc)
  }

  // if (finalSrc) return (
  //   <MyDocument imgSrc={finalSrc} />
  // )

  return (
    <div ref={containerRef}>
      <div ref={pdfRef} className={`${styles.container} ${placing && styles.crosshair}`} id="content">
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          className={`${styles.pdf} ${placing ? styles.pdfNoSelect : ''}`}
        >
          <Page pageNumber={page} onRenderSuccess={getImg} />
        </Document>
        {zones
          .filter((zone: Zone) => zone.pageNumber === page)
          .map((zone: Zone, i: number) => (
            <ZoneBounds {...zone} key={`zone-${i}`} />
          ))
        }
      </div>
    </div>
  )
}
