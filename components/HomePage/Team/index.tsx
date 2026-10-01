import { Suspense, useState } from 'react'
import Marquee from 'react-fast-marquee'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import ModalOrganizer, { ModalOrganizerProps } from '@/components/HomePage/ModalOrganizer'

const Team = () => {
  const [open, setOpen] = useState(false)
  const [organizer, setOrganizer] = useState<ModalOrganizerProps>({
    name: '',
    description: '',
    avatar: '',
    emoji: '',
    website: '',
    linkedin: '',
    github: '',
  })

  const Organizer = (props: ModalOrganizerProps) => {
    const { name, avatar } = props

    return (
      <Tooltip title={name} placement="top" sx={{ m: { xs: 0, sm: '0.25rem', m: '0.5rem' } }}>
        <IconButton
          tabIndex={-1}
          onClick={() => {
            setOrganizer(props)
            setOpen(true)
          }}
        >
          <Avatar src={avatar} alt={name} sx={{ width: 65, height: 65, filter: 'saturate(0.9)' }} />
        </IconButton>
      </Tooltip>
    )
  }

  return (
    <>
      <Container
        data-aos="fade"
        data-aos-offset="100"
        data-aos-duration="1200"
        data-aos-once="false"
        sx={{
          gap: '1rem 2.5rem',
          textAlign: { xs: 'center', lg: 'left' },
          flexDirection: { xs: 'column', lg: 'row' },
          justifyContent: 'space-between',
          pt: '3rem !important',
          pb: '0 !important',
        }}
      >
        <Box component="div" minWidth="fit-content">
          <Typography
            variant="h2"
            gutterBottom
            data-aos="fade-up"
            data-aos-delay="100"
            data-aos-offset="100"
            data-aos-once="false"
          >
            The Organizing Team
          </Typography>
          <Typography
            data-aos="fade-up"
            data-aos-delay="200"
            data-aos-offset="100"
            data-aos-once="false"
          >
            & special thanks to all staff ❤️
          </Typography>
        </Box>
        <Marquee
          play={!open}
          autoFill
          direction="right"
          speed={60}
          pauseOnHover
          style={{
            padding: '0.5rem 0',
            maskImage:
              'linear-gradient(to right,transparent,black,black,black,black,black,black,transparent)',
            WebkitMaskImage:
              'linear-gradient(to right,transparent,black,black,black,black,black,black,transparent)',
          }}
        >
          <Organizer
            name="Emily Su"
            description=""
            avatar=""
            emoji=""
            website=""
            linkedin=""
            github=""
          />
          <Organizer name="Farah Baseet" description="" avatar="" emoji="" website="" linkedin="" />
          <Organizer
            name="Kaiden Rai"
            description=""
            avatar=""
            emoji=""
            website=""
            linkedin=""
            github=""
          />
          <Organizer
            name="Joshua Wuebbolt"
            description="Anyone wanna play Mario Party?"
            avatar="/team/joshua.jpeg"
            emoji="🥂"
            website="joshuawuebbolt.com"
            linkedin="https://www.linkedin.com/in/joshuawuebbolt/"
            github="https://github.com/JoshuaWuebbolt"
          />
          <Organizer name="Ryan Hui" description="" avatar="" emoji="" website="" linkedin="" />
          <Organizer name="Sana Shahzad" description="" avatar="" emoji="" website="" linkedin="" />
          <Organizer
            name="Elif Sude Yasar"
            description=""
            avatar=""
            emoji=""
            website=""
            linkedin=""
          />
          <Organizer name="Carol Wang" description="" avatar="" emoji="" website="" linkedin="" />
          <Organizer
            name="Diego Pachas"
            description=""
            avatar=""
            emoji=""
            github=""
            website=""
            linkedin=""
          />
          <Organizer
            name="Wareesha Imran"
            description=""
            avatar=""
            emoji=""
            github=""
            website=""
            linkedin=""
          />
          <Organizer
            name="Areesh Noman"
            description=""
            avatar=""
            emoji=""
            github=""
            website=""
            linkedin=""
          />
          <Organizer
            name="Gabriel You"
            description=""
            avatar=""
            emoji=""
            github=""
            website=""
            linkedin=""
          />
          <Organizer
            name="Mir Asim Ali"
            description=""
            avatar=""
            emoji=""
            github=""
            website=""
            linkedin=""
          />
          <Organizer
            name="Jason Yu"
            description=""
            avatar=""
            emoji=""
            github=""
            website=""
            linkedin=""
          />
          <Organizer
            name="Shanta Islam"
            description=""
            avatar=""
            emoji=""
            github=""
            website=""
            linkedin=""
          />
        </Marquee>
      </Container>
      <Suspense>
        <ModalOrganizer open={open} onClose={() => setOpen(false)} {...organizer} />
      </Suspense>
    </>
  )
}

export default Team
