import { useContext } from 'react'
import { documentCtx } from '../../document'

export const useClientDocument = () => {
  const { zones } = useContext(documentCtx)

  const finalize = (signedPDF: HTMLCanvasElement) => {
    // Generate a new <canvas> to render the finalized PDF
    const canvas: HTMLCanvasElement = document.createElement('canvas')

    // Get the contstraints of the signed PDF
    const bounds = signedPDF.getBoundingClientRect()

    // Create an image that combines the PDF with the input data
    const image = new Image(bounds.width, bounds.height)
    image.src = signedPDF.toDataURL()
    canvas.height = signedPDF.height
    canvas.width = signedPDF.width
    canvas.style.height = bounds.height + 'px'
    canvas.style.width = bounds.width + 'px'

    // Set up <canvas> 2D context
    const ctx = canvas.getContext('2d')
    // Show true image resolution, not viewport-scaled resolution
    const multiplier = signedPDF.width / bounds.width

    if (ctx) {
      // Add image to new <canvas>
      ctx.drawImage(image, 0, 0, signedPDF.width, signedPDF.height)

      // Overlay user inputs in <canvas>
      for (const zone of zones) {
        ctx.fillStyle = '#30ffe98a'
        ctx.strokeStyle = '#45e1ff'
        ctx.fillRect(
          zone.offsetX * multiplier,
          zone.offsetY * multiplier,
          zone.w * multiplier,
          zone.h * multiplier,
        )
      }
    }

    const finalSrc = canvas.toDataURL('image/jpeg', 1.0)

    return finalSrc
  }

  return {
    finalize,
  }
}
