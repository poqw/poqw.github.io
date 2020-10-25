import React, { useCallback } from 'react'

import { Desktop, Mobile, Tablet } from '../../../hoc/responsive'
import { useSidebarDispatch } from '../../../store/sidebarStore'
import { TilHeaderContentProps } from './TilHeaderContentProps'
import TilHeaderDesktop from './TilHeaderDesktop'
import TilHeaderMobile from './TilHeaderMobile'
import TilHeaderTablet from './TilHeaderTablet'

interface Props {
  logo: React.ReactNode
}

const TilHeader: React.FC<Props> = ({ logo }) => {
  const sidebarDispatch = useSidebarDispatch()
  const onMenuButtonClick = useCallback(() => {
    sidebarDispatch({ type: 'DRAWER_TOGGLED' })
  }, [sidebarDispatch])

  const props: TilHeaderContentProps = {
    logo,
    onMenuButtonClick
  }

  return (
    <>
      <Mobile>
        <TilHeaderMobile {...props} />
      </Mobile>
      <Tablet>
        <TilHeaderTablet {...props} />
      </Tablet>
      <Desktop>
        <TilHeaderDesktop {...props} />
      </Desktop>
    </>
  )
}

export default TilHeader
