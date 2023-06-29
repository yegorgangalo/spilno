'use client'

import { usePathname, useRouter, useSearchParams }from 'next/navigation'
import useSWR from 'swr'
import LinearProgress from '@mui/material/LinearProgress'

import * as React from 'react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import TabPanel from '@/components/TabPanel'

import AdminCourses from '@/components/AdminCourses'
import AdminManagers from '@/components/AdminManagers'

const TAB = {
  courses: 0,
  managers: 1,
}

type TabKeys = keyof typeof TAB;
type TabValues = typeof TAB[TabKeys]

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

interface Course {
  id: number,
  title: string,
  content: string,
  lowerAgeLimit: number,
  upperAgeLimit: number,
}

interface IManager {
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string
  isActive: boolean
}

interface ICourseResponseData {
  data: Course[]
}

interface IManagerResponseData {
  data: IManager[]
}

const a11yProps = (index: number) => ({
  id: `simple-tab-${index}`,
  'aria-controls': `simple-tabpanel-${index}`,
})

const AdminPanel = () => {
  const router = useRouter()
  const pathname = usePathname()
  const nextSearchParams = useSearchParams()

  const courseResponse= useSWR<ICourseResponseData>('/api/course', fetcher)
  const courseData = courseResponse.data?.data
  const courseError = courseResponse.error
  const courseIsLoading = courseResponse.isLoading

  const managerResponse = useSWR<IManagerResponseData>('/api/manager', fetcher)
  const managerData = managerResponse.data?.data
  const managerError = managerResponse.error
  const managerIsLoading = managerResponse.isLoading

  const searchParams = new URLSearchParams(Array.from(nextSearchParams.entries()))

  const tabParam = searchParams.get('tab') as TabKeys

  const [tab, setTab] = React.useState<TabValues>(TAB[tabParam] || TAB.courses)

  const handleChange = (event: React.SyntheticEvent, newValue: TabValues) => {
    setTab(newValue)
    const [tabName] = Object.entries(TAB).find(([tabName, value]) => value === newValue) as [TabKeys, TabValues]
    searchParams.set('tab', tabName)
    const search = searchParams.toString()
    const query = search ? `?${search}` : ''
    router.push(`${pathname}${query}`)
  }

  const isLoadingApi = (tab === TAB.courses && courseIsLoading ) || (tab === TAB.managers && managerIsLoading)

  return (
    <>
      {isLoadingApi ? <LinearProgress /> : null}
      <Container component="main" maxWidth="lg">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">Admin panel</Typography>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tab} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Courses" {...a11yProps(TAB.courses)} />
              <Tab label="Managers" {...a11yProps(TAB.managers)} />
            </Tabs>
          </Box>
          <TabPanel value={tab} index={0}>
            {courseData ? <AdminCourses courses={courseData} /> : null}
          </TabPanel>
          <TabPanel value={tab} index={1}>
            {managerData ? <AdminManagers managers={managerData} /> : null}
          </TabPanel>
        </Box>
      </Container>
    </>
  )
}

export default  AdminPanel
