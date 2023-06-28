import { useCallback } from 'react'
import { useSWRConfig } from 'swr'

//this hook allows to use SWR cache by setting request parameters as key
export const useSWRCache = () => {
  const { cache, mutate } = useSWRConfig()

  const getCacheByKey = useCallback(
    ({ route }: { route: string }) => {
      const requestKey = [...cache.keys()].find((key) => key.includes(route) && !key.includes('swr')) || ''
      return cache.get(requestKey)
    },
    [cache],
  )

  const setCacheByKey = useCallback(
    ({ route, data }: { route: string, data: object }) => {
      mutate(route, data)
    },
    [mutate],
  )

  return { getCacheByKey, setCacheByKey }
}
