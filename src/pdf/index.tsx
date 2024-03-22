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
  const { placing } = useContext(zoneCtx)
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
        setZones((prevState: Zone[]) => [...prevState, newZone])
        setStarting([e.clientX, e.clientY])
        setDrawingZone(true)
      }
    }
    function mouseMove(e: MouseEvent) {
      const [startW, startH] = starting
      const currentZone = zones[zones.length - 1]
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
        setZones((prevState: Zone[]) => prevState.map(
          (zone: Zone, i: number) => i === zones.length - 1
            ? ({ ...zone, offsetX: final.offsetLeft, offsetY: final.offsetTop })
            : zone
        ))
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
  }, [setStarting, starting, setTempZone, tempZone, drawingZone, setDrawingZone, setBounds, pdfRef, placing, setZones])

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

  // const finalize = () => {
  //   const canv = document.getElementById('canvas') as HTMLCanvasElement
  //   const ogcanvas = document.querySelector('#content canvas') as HTMLCanvasElement
  //   const bounds = ogcanvas?.getBoundingClientRect()

  //   if (bounds) {
  //     const image = new Image(bounds.width, bounds.height)
  //     image.src = src
  //     canv.width = ogcanvas.width
  //     canv.height = ogcanvas.height
  //     canv.style.width = bounds.width + 'px'
  //     canv.style.height = bounds.height + 'px'

  //     const ctx = canv.getContext('2d')
  //     const multiplier = ogcanvas.width / bounds.width

  //     if (ctx) {
  //       //draw pdf
  //       ctx.drawImage(image, 0, 0, ogcanvas.width, ogcanvas.height)
      
  //       // draw signature zones
  //       for (const zone of zones) {
  //         console.log(zone)
  //         ctx.fillStyle = '#30ffe98a'
  //         ctx.strokeStyle = '#45e1ff'
  //         ctx.fillRect(zone.offsetX * multiplier, zone.offsetY * multiplier, zone.w * multiplier, zone.h * multiplier)
  //       }
  //     } else {
  //       console.warn('No context!')
  //     }
  //   }

  //   if (finalizeCount === 1) {
  //     const finalSrc = canv.toDataURL('image/jpeg', 1.0)
  //     setFinalSrc(finalSrc)
  //   }

  //   setFinalizeCount((prev: number) => prev + 1)
  // }

  // if (finalSrc) return (
  //   <MyDocument imgSrc={finalSrc} />
  // )

  return (
    <div ref={containerRef}>
      <div ref={pdfRef} className={styles.container} id="content">
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          className={`${styles.pdf} ${placing ? styles.pdfNoSelect : ''}`}
        >
          <Page pageNumber={page} onRenderSuccess={getImg} />
        </Document>
        {zones.map((zone: Zone, i: number) => (
          <ZoneBounds {...zone} key={`zone-${i}`} />
        ))}
      </div>
    </div>
  )
}
