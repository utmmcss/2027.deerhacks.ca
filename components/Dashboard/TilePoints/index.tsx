import NextLink from 'next/link'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'

import { useAuth } from '@/contexts/Auth'
import { useSettings } from '@/hooks/Settings/useSettings'
import { useUserPoints } from '@/hooks/Workshop/useUserPoints'

const TilePoints = () => {
  const { data, isLoading } = useUserPoints({ enabled: true })
  const { user } = useAuth()
  const { data: settingsData } = useSettings({ enabled: true })

  // Admins and moderators can preview the leaderboard while it's hidden
  const showLeaderboard =
    ['admin', 'moderator'].includes(user?.status ?? '') ||
    settingsData?.settings.find((s) => s.key === 'leaderboard_visible')?.value === 'true'

  return (
    <Paper
      sx={{
        width: '100%',
        p: '1.5rem',
        borderRadius: '1.5rem',
        backgroundColor: 'rgba(12, 14, 20, 0.35)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
      }}
    >
      <Typography variant="h6" mb={1}>
        Workshop Points
      </Typography>
      {isLoading ? (
        <>
          <Skeleton variant="text" width={120} height={60} />
          <Skeleton variant="text" width={180} />
        </>
      ) : (
        <>
          <Typography variant="h3" fontWeight="bold" color="primary.main">
            {data?.total_points ?? 0} pts
          </Typography>
          {data?.redemptions && data.redemptions.length > 0 && (
            <Box component="div" sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {data.redemptions.slice(0, 3).map((r, i) => (
                <Typography key={i} variant="body2" color="text.secondary">
                  +{r.points_awarded} — {r.event_title}
                </Typography>
              ))}
              {data.redemptions.length > 3 && (
                <Typography variant="body2" color="text.secondary">
                  +{data.redemptions.length - 3} more
                </Typography>
              )}
            </Box>
          )}
          {(!data?.redemptions || data.redemptions.length === 0) && (
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Scan workshop QR codes to earn points!
            </Typography>
          )}
        </>
      )}
      {showLeaderboard && (
        <Button
          component={NextLink}
          href="/dashboard/leaderboard"
          variant="outlined"
          size="small"
          sx={{ mt: 2 }}
        >
          View Leaderboard
        </Button>
      )}
    </Paper>
  )
}

export default TilePoints
