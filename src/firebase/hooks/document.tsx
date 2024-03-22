import { useCallback, useContext } from 'react'
import { storage } from '..'
import { ref, uploadBytes } from 'firebase/storage'
import { firebaseCtx } from '../context'

export const useDocument = () => {
  const { _: { toggleLoading } } = useContext(firebaseCtx)
  const upload = useCallback(async (file: File): Promise<boolean> => new Promise((res) => {
    toggleLoading()
    const pdfRef = ref(storage, `documents/${file.name}`)

    uploadBytes(pdfRef, file).then(
      (snapshot) => {
        console.log('Uploaded successfully')
        toggleLoading()
        res(true)
      }
    ).catch((err) => {
      console.error('There was a problem uploading the file:', err)
      toggleLoading()
      res(false)
    })
  }), [toggleLoading])

  return {
    upload,
  }
}
