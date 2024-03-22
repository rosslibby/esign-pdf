import { AES } from 'crypto-js'
import { Zone } from '../pdf/types'
import { useContext, useEffect, useState } from 'react'
import { documentCtx } from '../document'
const SECRET = 'kaseyswokowski'

export const useZoneParams = () => {
  const { zones } = useContext(documentCtx)
  const [encryptedZones, setEncryptedZones] = useState<string[]>()

  useEffect(() => {
    
  }, [encryptedZones, setEncryptedZones, zones])

  const encrypt = (zone: Zone): string => {
    return AES.encrypt(
      JSON.stringify(zone),
      SECRET,
    ).toString()
  }

  const decrypt = (data: string) => {
    return JSON.parse(
      AES.decrypt(data, SECRET).toString(),
    )
  }

  return {
    decrypt,
    encrypt,
  }
}
