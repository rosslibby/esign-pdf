import { useEffect, useRef, useState } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import styles from './pdf.module.css'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { MyDocument } from './render';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

type Zone = {
  index: number
  x: number
  y: number
  h: number
  w: number
  offsetX: number
  offsetY: number
}

const ZoneBounds = ({ x, y, w, h, index }: Zone) => {

  return (
    <div className={styles.zone} data-index={index} style={{
      left: `${x}px`,
      top: `${y}px`,
      width: `${w}px`,
      height: `${h}px`,
    }} />
  )
}

export const PdfViewer = ({ fileUrl }: {
  fileUrl: string
}) => {
  const pdfRef = useRef<HTMLDivElement>(null)
  const [finalSrc, setFinalSrc] = useState<string>('')
  const [finalizeCount, setFinalizeCount] = useState<number>(0)
  const [src, setSrc] = useState<string>('')
  const [size, setSize] = useState<[number, number]>([0, 0])
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [numPages, setNumPages] = useState<number>(1)
  const [bounds, setBounds] = useState<[number, number] | undefined>()
  const [zones, setZones] = useState<Zone[]>([])
  const [placingZone, setPlacingZone] = useState<boolean>(false)
  const [drawingZone, setDrawingZone] = useState<boolean>(false)
  const [tempZone, setTempZone] = useState<Zone | undefined>()
  const [starting, setStarting] = useState<[number, number]>([0, 0])

  useEffect(() => {
    let doc = pdfRef.current || null
    let current = doc?.firstElementChild || null
    const mouseDown = (e: MouseEvent) => {
      const bounds = current?.getBoundingClientRect()
      if (bounds) {
        setSize([bounds.width, bounds.height])
        const {left, top, width, height} = bounds
        if (e.clientX > left + width || e.clientX < left || e.clientY > top + height || e.clientY < top) {
          return
        }
        const newZone: Zone = {
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
      doc!.addEventListener('mousemove', mouseMove)
      doc!.addEventListener('mouseup', mouseUp)
    } else {
      doc!.removeEventListener('mousemove', mouseMove)
      doc!.removeEventListener('mouseup', mouseUp)
    }

    if (current && placingZone) {
      if (!bounds) {
        const { left, top } = current.getBoundingClientRect()
        setBounds([left, top])
      }
      doc!.addEventListener('mousedown', mouseDown)
    }

    return () => {
      if (doc) {
        doc.removeEventListener('mousedown', mouseDown)
        doc.removeEventListener('mouseup', mouseUp)
        doc.removeEventListener('mousemove', mouseMove)
      }
      doc = null
      current = null
    }
  }, [setSize, setStarting, starting, setTempZone, tempZone, drawingZone, setDrawingZone, setBounds, pdfRef, placingZone, setZones])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages)
  }

  const togglePlaceZone = () =>
    setPlacingZone((prevState: boolean) => !prevState)

  const previousPage = () =>
    setPageNumber((prevState: number) => Math.max(prevState - 1, 1))

  const nextPage = () =>
    setPageNumber((prevState: number) => Math.min(prevState + 1, numPages))

  const getImg = () => {
    const importPDFCanvas: HTMLCanvasElement = document
      .querySelector('#content canvas') as HTMLCanvasElement
    const pdfAsImageSrc = importPDFCanvas.toDataURL()
    setSrc(pdfAsImageSrc)
  }

  const finalize = () => {
    const canv = document.getElementById('canvas') as HTMLCanvasElement
    const ogcanvas = document.querySelector('#content canvas') as HTMLCanvasElement
    const bounds = ogcanvas?.getBoundingClientRect()

    if (bounds) {
      const image = new Image(bounds.width, bounds.height)
      image.src = src
      canv.width = ogcanvas.width
      canv.height = ogcanvas.height
      canv.style.width = bounds.width + 'px'
      canv.style.height = bounds.height + 'px'

      const ctx = canv.getContext('2d')
      const multiplier = ogcanvas.width / bounds.width

      if (ctx) {
        //draw pdf
        ctx.drawImage(image, 0, 0, ogcanvas.width, ogcanvas.height)
      
        // draw signature zones
        for (const zone of zones) {
          console.log(zone)
          ctx.fillStyle = '#30ffe98a'
          ctx.strokeStyle = '#45e1ff'
          ctx.fillRect(zone.offsetX * multiplier, zone.offsetY * multiplier, zone.w * multiplier, zone.h * multiplier)
        }
      } else {
        console.warn('No context!')
      }
    }

    if (finalizeCount === 1) {
      const finalSrc = canv.toDataURL('image/jpeg', 1.0)
      setFinalSrc(finalSrc)
    }

    setFinalizeCount((prev: number) => prev + 1)
  }

  if (finalSrc) return (
    <MyDocument imgSrc={finalSrc} />
  )

  return (
    <div ref={pdfRef} className={styles.container} id="content">
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        className={`${styles.pdf} ${placingZone ? styles.pdfNoSelect : ''}`}
      >
        <Page pageNumber={pageNumber} onRenderSuccess={getImg} />
      </Document>
      <div>
        <button
          onClick={previousPage}
          disabled={pageNumber <= 1}
        >&larr;</button>
        <button
          onClick={nextPage}
          disabled={pageNumber >= numPages}
        >&rarr;</button>
        <button onClick={togglePlaceZone}>{placingZone ? 'Finished adding zones' : 'Add zones'}</button>
        <button onClick={finalize}>{finalizeCount === 0 ? 'Finalize zones' : 'Finalize PDF'}</button>
      </div>
      {zones.map((zone: Zone, i: number) => (
        <ZoneBounds {...zone} key={`zone-${i}`} />
      ))}
    </div>
  )
}
