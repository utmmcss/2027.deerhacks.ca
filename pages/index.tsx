import Head from 'next/head'

import UnderConstruction from '@/components/Celestial/UnderConstruction'

const Index = () => {
  return (
    <>
      <Head>
        <title>DeerHacks 2027 | Coming Soon</title>
        <meta
          name="description"
          content="DeerHacks 2027 is under construction. Follow us for dates, applications, and sneak peeks."
        />
      </Head>
      <UnderConstruction />
    </>
  )
}

export default Index
