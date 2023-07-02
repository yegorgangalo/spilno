'use client'
import * as React from 'react'
import { usePathname, useRouter }from 'next/navigation'
import { signIn, signOut, useSession } from 'next-auth/react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { ROLE } from '@/services/const'

const PAGE_NAME_MAP = {
  '/admin': 'admin panel',
  '/account': 'account information',
  '/manage/child-course': 'course assignment'
}

const menuItems = [
  { name: 'Admin panel', route: '/admin' },
  { name: 'manage child course', route: '/manage/child-course' }
]

const MenuBar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const onClickMenuItem = ({ route }: { route: string }) => (event: React.MouseEvent<HTMLElement>) => {
    router.push(route)
    handleCloseNavMenu()
  }

  const isLoggedIn = session?.user

  const availableMenuItems = menuItems.filter(item => {
    if (session?.user.role === ROLE.MANAGER && item.route.includes('admin')) {
      return false
    } else {
      return true
    }
  })

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={handleOpenNavMenu}
            >
              <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: 'block', md: 'none' },
            }}
          >
            {availableMenuItems.map(({ name, route }) => (
              <MenuItem key={route} onClick={onClickMenuItem({ route })}>
                <Typography textAlign="center">{name}</Typography>
              </MenuItem>
            ))}
          </Menu>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {PAGE_NAME_MAP[pathname.toLowerCase() as keyof typeof PAGE_NAME_MAP]?.toUpperCase()}
          </Typography>
          {isLoggedIn
            ? <Button onClick={() => signOut({ callbackUrl: '/signin'})} color="inherit">Logout</Button>
            : <Button onClick={() => signIn()} color="inherit">Login</Button>
          }
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default MenuBar
