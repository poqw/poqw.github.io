import React from 'react'

import { Desktop, Mobile, Tablet } from '../../../hoc/responsive'
import { useSiteMetadata } from '../../../hooks/useSiteMetadata'
import { HeaderContentProps } from './HeaderContentProps'
import HeaderDesktop from './HeaderDesktop'
import HeaderMobile from './HeaderMobile'
import HeaderTablet from './HeaderTablet'

interface Props {
  sidebarWidth: number
}

const Header: React.FC<Props> = ({ sidebarWidth }) => {
  const { title } = useSiteMetadata()

  const props: HeaderContentProps = {
    title,
    titleLinkPath: '/',
    sidebarWidth
  }

  return (
    <>
      <Mobile>
        <HeaderMobile {...props} />
      </Mobile>
      <Tablet>
        <HeaderTablet {...props} />
      </Tablet>
      <Desktop>
        <HeaderDesktop {...props} />
      </Desktop>
    </>
  )
}

export default Header
