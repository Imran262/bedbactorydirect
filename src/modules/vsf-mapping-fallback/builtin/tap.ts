import { Payload } from '../types/Payload'

export const tap = async (context, payload: Payload) => {
  console.log('mappingFallback payload:', payload)
  return undefined
}