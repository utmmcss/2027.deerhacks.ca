import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

import { useAuth } from '@/contexts/Auth'
import { useWorkshopClaim } from '@/hooks/Workshop/useWorkshopClaim'

type ClaimState = 'loading' | 'success' | 'already_claimed' | 'expired' | 'inactive' | 'error'

type SuccessResult = {
  points_awarded: number
  total_points: number
  event_title: string
}

const ClaimPage = () => {
  const router = useRouter()
  const { user, loading, authenticated } = useAuth()
  const { mutate: claim } = useWorkshopClaim()
  const [state, setState] = useState<ClaimState>('loading')
  const [result, setResult] = useState<SuccessResult | null>(null)
  const hasClaimed = useRef(false)

  const { event_id, token } = router.query
  const eventId = Number(event_id)

  // Redirect to login if not authenticated, preserving the claim URL for redirect back
  useEffect(() => {
    if (loading) return
    if (!authenticated) {
      const redirectUrl = encodeURIComponent(router.asPath)
      router.replace(`/login?redirect=${redirectUrl}`)
    }
  }, [loading, authenticated, router])

  // Attempt claim once authenticated and query params are available
  useEffect(() => {
    if (!router.isReady || !authenticated || !event_id || !token || typeof token !== 'string' || isNaN(eventId)) return
    if (hasClaimed.current) return
    hasClaimed.current = true

    claim(
      { event_id: eventId, token },
      {
        onSuccess: (data) => {
          if (data.already_claimed) {
            setState('already_claimed')
            return
          }
          setResult(data)
          setState('success')
        },
        onError: (err: any) => {
          const status = err?.apiError?.status
          // 409 is how older backends report a repeat scan
          if (status === 409) setState('already_claimed')
          else if (status === 410) setState('expired')
          else if (status === 403) setState('inactive')
          else setState('error')
        },
      }
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, authenticated, event_id, token])

  const renderContent = () => {
    switch (state) {
      case 'loading':
        return (
          <Box component="div" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CircularProgress />
            <Typography color="text.secondary">Claiming your points...</Typography>
          </Box>
        )

      case 'success':
        return (
          <Box component="div" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, textAlign: 'center' }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 72, color: 'success.main' }} />
            <Typography variant="h5" fontWeight="bold">
              Points Claimed!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {result?.event_title}
            </Typography>
            <Typography variant="h3" color="success.main" fontWeight="bold">
              +{result?.points_awarded} pts
            </Typography>
            <Typography color="text.secondary">
              Your total: <strong>{result?.total_points} pts</strong>
            </Typography>
            <Button
              variant="contained"
              onClick={() => router.push('/dashboard')}
              sx={{ mt: 2 }}
            >
              Back to Dashboard
            </Button>
          </Box>
        )

      case 'already_claimed':
        return (
          <Box component="div" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, textAlign: 'center' }}>
            <ErrorOutlineIcon sx={{ fontSize: 72, color: 'warning.main' }} />
            <Typography variant="h5" fontWeight="bold">
              Already Claimed
            </Typography>
            <Typography color="text.secondary">
              You have already claimed points for this workshop.
            </Typography>
            <Button variant="outlined" onClick={() => router.push('/dashboard')} sx={{ mt: 2 }}>
              Back to Dashboard
            </Button>
          </Box>
        )

      case 'expired':
        return (
          <Box component="div" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, textAlign: 'center' }}>
            <ErrorOutlineIcon sx={{ fontSize: 72, color: 'error.main' }} />
            <Typography variant="h5" fontWeight="bold">
              Invalid QR Code
            </Typography>
            <Typography color="text.secondary">
              Please scan the code shown on screen.
            </Typography>
          </Box>
        )

      case 'inactive':
        return (
          <Box component="div" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, textAlign: 'center' }}>
            <ErrorOutlineIcon sx={{ fontSize: 72, color: 'error.main' }} />
            <Typography variant="h5" fontWeight="bold">
              Not Active
            </Typography>
            <Typography color="text.secondary">
              This workshop is not currently active for point claiming.
            </Typography>
          </Box>
        )

      default:
        return (
          <Box component="div" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, textAlign: 'center' }}>
            <ErrorOutlineIcon sx={{ fontSize: 72, color: 'error.main' }} />
            <Typography variant="h5" fontWeight="bold">
              Something went wrong
            </Typography>
            <Typography color="text.secondary">
              Please try scanning the QR code again.
            </Typography>
          </Box>
        )
    }
  }

  return (
    <>
      <Head>
        <title>Claim Points | DeerHacks</title>
      </Head>
      <Container
        maxWidth={false}
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(#202124, #202124)',
        }}
      >
        <Box
          component="div"
          sx={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '1.5rem',
            p: '2.5rem',
            maxWidth: 400,
            width: '100%',
          }}
        >
          {renderContent()}
        </Box>
      </Container>
    </>
  )
}

export default ClaimPage
