'use client'

import { usePathname, useRouter, useSearchParams }from 'next/navigation'
import * as React from 'react'
import { useFetchCourses } from '@/hooks/useFetchCourses'
import { useFetchManagers } from '@/hooks/useFetchManagers'

import LinearProgress from '@mui/material/LinearProgress'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import TabPanel from '@/components/TabPanel'

import AdminCourses from '@/components/AdminCourses'
import AdminManagers from '@/components/AdminManagers'
import MenuBar from '@/components/MenuBar'

const TAB = {
  courses: 0,
  managers: 1,
}

type TabKeys = keyof typeof TAB
type TabValues = typeof TAB[TabKeys]

const a11yProps = (index: number) => ({
  id: `simple-tab-${index}`,
  'aria-controls': `simple-tabpanel-${index}`,
})

const AdminPanel = () => {
  const router = useRouter()
  const pathname = usePathname()
  const nextSearchParams = useSearchParams()

  const courseResponse = useFetchCourses()
  const courseData = courseResponse.data?.data
  const courseError = courseResponse.error
  const courseIsLoading = courseResponse.isLoading

  const managerResponse = useFetchManagers()
  const managerData = managerResponse.data?.data || []
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
      <MenuBar/>
      <Container component='main' maxWidth='lg'>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tab} onChange={handleChange} aria-label='basic tabs example'>
              <Tab label='Courses' {...a11yProps(TAB.courses)} />
              <Tab label='Managers' {...a11yProps(TAB.managers)} />
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
