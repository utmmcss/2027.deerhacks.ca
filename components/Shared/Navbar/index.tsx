import Image from 'next/image'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

import MenuIcon from '@mui/icons-material/Menu'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

import { useFeatureToggle } from '@/contexts/FeatureToggle'

const navLinks = [
  { label: 'About', href: '/#about' },
  { label: 'Sponsors', href: '/#sponsors' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Schedule', href: '/schedule' },
  { label: 'Code of Conduct', href: '/code' },
  { label: 'Privacy Policy', href: '/privacy' },
]

const Navbar = () => {
  const { toggles } = useFeatureToggle()
  const router = useRouter()
  const isCompact = router.pathname === '/' || router.pathname.startsWith('/dashboard')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)
  const handleCloseMenu = () => setAnchorEl(null)

  return (
    <AppBar
      position="relative"
      elevation={0}
      sx={
        isCompact
          ? {
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '1rem',
              backgroundColor: 'rgba(20, 20, 24, 0.5)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
            }
          : undefined
      }
    >
      <Box
        component="div"
        sx={{
          width: '100%',
          maxWidth: 1200,
          mx: 'auto',
          px: { xs: 2, md: 4 },
        }}
      >
        <Box
          component="div"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          py={isCompact ? 0.5 : 0}
        >
          <Button
            href="/"
            component={NextLink}
            color={isCompact ? 'inherit' : undefined}
            size={isCompact ? 'small' : undefined}
            sx={
              isCompact
                ? { p: 0.5, pr: 1, minWidth: 'auto', fontWeight: 600, textTransform: 'none' }
                : { p: '0 1rem 0 0' }
            }
          >
            <Image
              src="/icons/neon.png"
              alt="DeerHacks Logo"
              width={isCompact ? 52 : 80}
              height={isCompact ? 52 : 80}
              priority
            />
            DeerHacks
          </Button>

          {/* Full nav — visible on md and up */}
          <Box
            component="div"
            display={{ xs: 'none', md: 'flex' }}
            alignItems="center"
            justifyContent="flex-end"
            gap={1}
          >
            {navLinks.map((link) => (
              <Button key={link.label} href={link.href} component={NextLink} color="inherit" size="small">
                {link.label}
              </Button>
            ))}
            <Button
              href="/login"
              component={NextLink}
              variant="outlined"
              color="inherit"
              size="small"
              disabled={!toggles.dashboard}
              sx={{ ml: 1 }}
            >
              Apply Now
            </Button>
          </Box>

          {/* Hamburger — visible below md */}
          <Box component="div" display={{ xs: 'flex', md: 'none' }} alignItems="center">
            <IconButton
              color="inherit"
              onClick={handleOpenMenu}
              aria-label="open navigation menu"
              size="small"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              slotProps={{
                paper: {
                  sx: {
                    mt: 1,
                    backgroundColor: 'rgba(20, 20, 24, 0.95)',
                    backdropFilter: 'blur(14px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.75rem',
                    minWidth: 180,
                  },
                },
              }}
            >
              {navLinks.map((link) => (
                <MenuItem
                  key={link.label}
                  component={NextLink}
                  href={link.href}
                  onClick={handleCloseMenu}
                  sx={{ color: 'inherit', fontSize: '0.875rem' }}
                >
                  {link.label}
                </MenuItem>
              ))}
              <MenuItem
                component={NextLink}
                href="/login"
                onClick={handleCloseMenu}
                disabled={!toggles.dashboard}
                sx={{ color: 'inherit', fontSize: '0.875rem', fontWeight: 600 }}
              >
                Apply Now
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Box>
    </AppBar>
  )
}

export default Navbar
