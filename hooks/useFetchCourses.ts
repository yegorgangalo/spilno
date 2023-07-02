import useSWR from 'swr'
import { useSession } from 'next-auth/react'
import { ICourse } from '@/app/ts/interfaces/ICourse.interface'

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

interface ICourseResponseData {
  data: ICourse[]
}

export const useFetchCourses = () => {
  const { data: session } = useSession()
  const accessToken = session?.user.accessToken
  const fetchOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${accessToken}`,
    }
  }

  const courseResponse = useSWR<ICourseResponseData>(accessToken ? '/api/course' : null, (url) => fetcher(url, fetchOptions))
  return courseResponse
}
