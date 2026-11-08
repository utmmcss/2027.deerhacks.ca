import Head from 'next/head'

import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import FormControlLabel from '@mui/material/FormControlLabel'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Switch from '@mui/material/Switch'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'

import Starfield from '@/components/Celestial/Starfield'
import FullPageSpinner from '@/components/Shared/FullPageSpinner'
import Navbar from '@/components/Shared/Navbar'
import { useAuth } from '@/contexts/Auth'
import { useFeatureToggle } from '@/contexts/FeatureToggle'
import { useAdminSettingsUpdate } from '@/hooks/Admin/useAdminSettingsUpdate'
import { useLeaderboard } from '@/hooks/Leaderboard/useLeaderboard'
import { useSettings } from '@/hooks/Settings/useSettings'
import Error401Page from '@/pages/401'
import Error404Page from '@/pages/404'

const DEFAULT_AVATAR = 'https://cdn.discordapp.com/embed/avatars/0.png'

const paperSx = {
  width: '100%',
  p: '1.5rem',
  borderRadius: '1.5rem',
  backgroundColor: 'rgba(12, 14, 20, 0.35)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',
}

const Leaderboard = () => {
  const { toggles } = useFeatureToggle()
  const { user, loading, authenticated } = useAuth()
  const isAdmin = user?.status === 'admin'

  const { data, isLoading, isError } = useLeaderboard({ enabled: authenticated })
  const { data: settingsData, isLoading: settingsLoading } = useSettings({ enabled: isAdmin })
  const { mutate: updateSetting, isLoading: isToggling } = useAdminSettingsUpdate()

  const leaderboardVisible =
    settingsData?.settings.find((s) => s.key === 'leaderboard_visible')?.value === 'true'

  if (!toggles.dashboard) return <Error404Page />
  if (!loading && !authenticated) return <Error401Page />
  if (loading || !user) return <FullPageSpinner />

  const renderBoard = () => {
    if (isLoading) return <Skeleton variant="rounded" height={300} />
    if (isError) {
      return <Alert severity="error">Couldn&apos;t load the leaderboard. Retrying soon.</Alert>
    }
    if (!data?.visible && !data?.top) {
      return <Alert severity="info">The leaderboard isn&apos;t live yet. Check back soon!</Alert>
    }

    const me = data.me
    return (
      <Box component="div" display="flex" flexDirection="column" gap={2}>
        {!data.visible && (
          <Alert severity="warning">Hidden from hackers. Only staff can see this right now.</Alert>
        )}
        {me && (
          <Paper sx={paperSx}>
            <Typography variant="h6">You</Typography>
            <Typography color="text.secondary">
              {me.rank ? `#${me.rank}` : 'Not ranked yet'} · {me.points} pts · {me.connections}{' '}
              {me.connections === 1 ? 'connection' : 'connections'}
            </Typography>
          </Paper>
        )}
        <Paper sx={{ ...paperSx, p: 0, overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Hacker</TableCell>
                <TableCell align="right">Points</TableCell>
                <TableCell align="right">Connections</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(data.top ?? []).map((entry) => (
                <TableRow key={entry.rank}>
                  <TableCell>{entry.rank}</TableCell>
                  <TableCell>
                    <Box component="div" display="flex" alignItems="center" gap={1.5}>
                      <Avatar
                        src={entry.avatar_url || DEFAULT_AVATAR}
                        alt={entry.username}
                        sx={{ width: 32, height: 32 }}
                      />
                      {entry.username}
                    </Box>
                  </TableCell>
                  <TableCell align="right">{entry.points}</TableCell>
                  <TableCell align="right">{entry.connections}</TableCell>
                </TableRow>
              ))}
              {data.top?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography color="text.secondary">
                      No one has points yet. Scan workshop QR codes to get on the board!
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
        <Typography variant="body2" color="text.secondary">
          Ties are broken by how many people you&apos;ve met. Updates every few seconds.
        </Typography>
      </Box>
    )
  }

  return (
    <>
      <Head>
        <title>Leaderboard | DeerHacks</title>
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
          <Box component="div" sx={{ maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h4" sx={{ my: 3 }}>
              Leaderboard
            </Typography>
            {isAdmin && (
              <Box component="div" mb={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={leaderboardVisible}
                      disabled={settingsLoading || isToggling}
                      onChange={() =>
                        updateSetting({
                          key: 'leaderboard_visible',
                          data: { value: leaderboardVisible ? 'false' : 'true' },
                        })
                      }
                    />
                  }
                  label={leaderboardVisible ? 'Visible to hackers' : 'Hidden from hackers'}
                />
              </Box>
            )}
            {renderBoard()}
          </Box>
        </Container>
      </Box>
    </>
  )
}

export default Leaderboard
