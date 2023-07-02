import useSWR from 'swr'
import { useSession } from 'next-auth/react'
import { IManager } from '@/app/ts/interfaces/IManager.interface'

const fetcher = (url: string, options: object) => {
  return fetch(url ,options).then((res) => {
    if (!res.ok) {
      return Promise.reject({
        status: res.status,
        message: `Response is not ok. ${res.statusText}`,
      })
    }
    return res.json()
  })
}

interface IManagerResponseData {
    data: IManager[]
}

export const useFetchManagers = () => {
    const { data: session } = useSession()
    const accessToken = session?.user.accessToken
    const fetchOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${accessToken}`,
        }
    }

    const managerResponse = useSWR<IManagerResponseData>(accessToken ? '/api/manager' : null, (url) => fetcher(url, fetchOptions))
    return managerResponse
}
