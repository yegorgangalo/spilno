'use client'

import { SWRConfig } from 'swr'
import * as React from 'react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import ManageCourses from '@/components/ManageCourses'
import TabPanel from '@/components/TabPanel'

const a11yProps = (index: number) => ({
  id: `simple-tab-${index}`,
  'aria-controls': `simple-tabpanel-${index}`,
})

const AdminPanel = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
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
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Courses" {...a11yProps(0)} />
            <Tab label="Managers" {...a11yProps(1)} />
            {/* <Tab label="Parents" {...a11yProps(2)} />
            <Tab label="Children" {...a11yProps(3)} /> */}
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <ManageCourses/>
        </TabPanel>
        <TabPanel value={value} index={1}>
          Managers
        </TabPanel>
      </Box>
    </Container>
  )
}

interface AdminPanelPageProps {

}

const AdminPanelPage = (props: AdminPanelPageProps) => {
  //wrap in SWR Cache provider
  return (
    <SWRConfig value={{ provider: () => new Map() }}>
      <AdminPanel {...props} />
    </SWRConfig>
  )
}

export default  AdminPanelPage
