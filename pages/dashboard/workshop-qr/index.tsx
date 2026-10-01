import Head from 'next/head'
import { useRef, useState } from 'react'

import FullscreenIcon from '@mui/icons-material/Fullscreen'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'

import Starfield from '@/components/Celestial/Starfield'
import FullPageSpinner from '@/components/Shared/FullPageSpinner'
import Navbar from '@/components/Shared/Navbar'
import { useAuth } from '@/contexts/Auth'
import { useFeatureToggle } from '@/contexts/FeatureToggle'
import { useAdminEventList } from '@/hooks/Admin/useAdminEventList'
import { useAdminEventUpdate } from '@/hooks/Admin/useAdminEventUpdate'
import { useAdminEventRedemptions } from '@/hooks/Workshop/useAdminEventRedemptions'
import { useAdminQRToken } from '@/hooks/Workshop/useAdminQRToken'
import Error401Page from '@/pages/401'
import Error404Page from '@/pages/404'
import { QRCodeSVG } from 'qrcode.react'

const WorkshopQRPage = () => {
  const { toggles } = useFeatureToggle()
  const { user, loading, authenticated } = useAuth()
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)
  const qrContainerRef = useRef<HTMLDivElement>(null)

  const isAdminOrMod = user?.status === 'admin' || user?.status === 'moderator'

  const { data: eventListData } = useAdminEventList({ enabled: isAdminOrMod && authenticated })
  const { mutate: updateEvent } = useAdminEventUpdate()
  const { data: tokenData } = useAdminQRToken(selectedEventId)
  const { data: redemptionsData } = useAdminEventRedemptions(selectedEventId)

  const handleToggleActive = (eventId: number, currentActive: boolean) => {
    updateEvent({ id: eventId, data: { qr_active: !currentActive } })
  }

  const handleFullscreen = () => {
    qrContainerRef.current?.requestFullscreen?.()
  }

  // Only show events that have a points value configured
  const pointsEvents = eventListData?.data?.filter((e) => (e.attributes.points_value ?? 0) > 0) ?? []
  const selectedEvent = pointsEvents.find((e) => e.id === selectedEventId) ?? null

  if (!toggles.dashboard) return <Error404Page />
  if (!loading && !authenticated) return <Error401Page />
  if (!loading && authenticated && !isAdminOrMod) return <Error401Page />
  if (loading || !user) return <FullPageSpinner />

  return (
    <>
      <Head>
        <title>Workshop QR | DeerHacks Admin</title>
      </Head>
      <Box component="main" sx={{ position: 'relative', minHeight: '100vh' }}>
        <Starfield />
        <Container
          maxWidth="xl"
          sx={{
            minHeight: '100vh',
            flexDirection: 'column',
            py: '2rem',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Navbar />
          <Typography variant="h4" sx={{ my: 3 }}>
            Workshop QR Display
          </Typography>

          <Box component="div" sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
            {/* Left: Controls + live feed */}
            <Box component="div" sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Select Workshop</InputLabel>
                <Select
                  value={selectedEventId ?? ''}
                  label="Select Workshop"
                  onChange={(e) => setSelectedEventId(Number(e.target.value))}
                >
                  {pointsEvents.length === 0 && (
                    <MenuItem disabled value="">
                      No events with points configured
                    </MenuItem>
                  )}
                  {pointsEvents.map((event) => (
                    <MenuItem key={event.id} value={event.id}>
                      {event.attributes.title} ({event.attributes.points_value} pts)
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {selectedEvent && (
                <Paper sx={{ p: 2, borderRadius: '1rem' }}>
                  <Box component="div" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography fontWeight="bold">QR Active</Typography>
                    <Switch
                      checked={selectedEvent.attributes.qr_active ?? false}
                      onChange={() =>
                        handleToggleActive(selectedEvent.id, selectedEvent.attributes.qr_active ?? false)
                      }
                      color="success"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {selectedEvent.attributes.qr_active
                      ? 'Hackers can currently scan and claim points. Toggle off to stop claiming.'
                      : 'Toggle on to allow scanning. Toggle off at any time to invalidate the QR code.'}
                  </Typography>
                </Paper>
              )}

              <Divider />

              <Typography variant="h6">Last 5 Claimants</Typography>
              {!selectedEventId && (
                <Typography color="text.secondary" variant="body2">
                  Select a workshop above to see claimants.
                </Typography>
              )}
              {selectedEventId && redemptionsData?.redemptions?.length === 0 && (
                <Typography color="text.secondary" variant="body2">
                  No claimants yet.
                </Typography>
              )}
              {redemptionsData?.redemptions?.map((r, i) => (
                <Paper
                  key={i}
                  sx={{
                    p: 1.5,
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Typography fontWeight="bold">@{r.username}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(r.redeemed_at).toLocaleTimeString()}
                  </Typography>
                </Paper>
              ))}
            </Box>

            {/* Right: QR display */}
            <Box component="div" sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Paper
                ref={qrContainerRef}
                sx={{
                  p: 4,
                  borderRadius: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  background: 'white',
                  width: '100%',
                  // Keep white background in fullscreen too
                  '&:fullscreen': { background: 'white', justifyContent: 'center' },
                }}
              >
                {tokenData?.token ? (
                  <>
                    <QRCodeSVG
                      value={`${window.location.origin}/claim?event_id=${selectedEventId}&token=${tokenData.token}`}
                      size={280}
                    />
                    <Typography color="black" variant="h6" textAlign="center">
                      {selectedEvent?.attributes.title}
                    </Typography>
                    <Chip
                      label={`${selectedEvent?.attributes.points_value} pts`}
                      color="success"
                      sx={{ fontSize: '1rem', px: 2 }}
                    />
                  </>
                ) : (
                  <Typography color="black" textAlign="center" sx={{ py: 4 }}>
                    {selectedEventId
                      ? 'Toggle QR Active on the left to display the code.'
                      : 'Select an active workshop to display its QR code.'}
                  </Typography>
                )}
              </Paper>
              <Button
                variant="outlined"
                startIcon={<FullscreenIcon />}
                onClick={handleFullscreen}
                disabled={!tokenData?.token}
              >
                Fullscreen
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  )
}

export default WorkshopQRPage
