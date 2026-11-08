import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

import { APIError } from '@/api/types'
import { useConnect } from '@/hooks/Networking/useConnect'
import { useConnectProfile } from '@/hooks/Networking/useConnectProfile'
import { ConnectResp } from '@/types/Networking'
import { getApiErrorMessage } from '@/utils/apiErrors'

const DEFAULT_AVATAR = 'https://cdn.discordapp.com/embed/avatars/0.png'

// What a phone camera opens from someone's QR. Public: the visitor may not be logged in.
const ConnectPage = () => {
  const router = useRouter()
  const id = typeof router.query.id === 'string' ? router.query.id : ''

  const { data: profile, error, isLoading } = useConnectProfile(id)
  const { mutate: connect, isLoading: isConnecting } = useConnect()
  const [result, setResult] = useState<ConnectResp | null>(null)
  const [connectError, setConnectError] = useState('')

  // The QR code expires; switch to the permanent id so reloading or tapping later still works
  const networkingId = profile?.networking_id
  useEffect(() => {
    if (!networkingId || networkingId === id) return
    router.replace(`/connect/${networkingId}`, undefined, { shallow: true })
  }, [networkingId, id, router])

  const handleConnect = () => {
    if (!networkingId) return
    setConnectError('')
    connect(
      { id: networkingId },
      {
        onSuccess: (data) => setResult(data),
        onError: (err) => {
          const status = (err as APIError)?.apiError?.status
          if (status === 401) {
            router.push(`/login?redirect=${encodeURIComponent(`/connect/${networkingId}`)}`)
          } else if (status === 400) {
            setConnectError("This is your own QR. Show it to someone you've met!")
          } else if (status === 403) {
            setConnectError('Only hackers at the event can connect.')
          } else {
            setConnectError(getApiErrorMessage(err, 'Something went wrong, please try again.'))
          }
        },
      },
    )
  }

  const renderContent = () => {
    if (!router.isReady || isLoading) {
      return <CircularProgress />
    }

    if (!profile) {
      const status = (error as APIError)?.apiError?.status
      return (
        <>
          <ErrorOutlineIcon sx={{ fontSize: 72, color: 'error.main' }} />
          <Typography variant="h5" fontWeight="bold">
            {status === 410 ? 'QR Code Too Old' : 'Not Found'}
          </Typography>
          <Typography color="text.secondary">
            {status === 410
              ? 'Ask them to show their QR again.'
              : status === 404
                ? "This page doesn't exist or is hidden."
                : 'Something went wrong, please try again.'}
          </Typography>
        </>
      )
    }

    return (
      <>
        <Avatar
          src={profile.avatar_url || DEFAULT_AVATAR}
          alt={profile.name}
          sx={{ width: 96, height: 96 }}
        />
        <Typography variant="h5" fontWeight="bold">
          {profile.name}
        </Typography>
        {profile.linkedin_url && (
          <Button
            variant="outlined"
            startIcon={<LinkedInIcon />}
            href={profile.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </Button>
        )}
        {result ? (
          <Box component="div" display="flex" flexDirection="column" alignItems="center" gap={1}>
            <CheckCircleOutlineIcon sx={{ fontSize: 48, color: 'success.main' }} />
            <Typography fontWeight="bold">
              {result.already_connected ? 'Already connected' : 'Connected!'}
            </Typography>
            <Typography color="text.secondary">
              You&apos;ve met {result.connections} {result.connections === 1 ? 'person' : 'people'}.
            </Typography>
          </Box>
        ) : (
          <Button
            variant="contained"
            size="large"
            onClick={handleConnect}
            disabled={isConnecting}
            sx={{ mt: 1 }}
          >
            I met you
          </Button>
        )}
        {connectError && (
          <Alert severity="warning" sx={{ width: '100%' }}>
            {connectError}
          </Alert>
        )}
        <Button variant="text" onClick={() => router.push('/dashboard')}>
          Go to Dashboard
        </Button>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{profile ? `${profile.name} | DeerHacks` : 'Connect | DeerHacks'}</title>
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
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            textAlign: 'center',
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

export default ConnectPage
