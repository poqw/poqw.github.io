import React, { useCallback } from 'react'

import { Desktop, Mobile, Tablet } from '../../../hoc/responsive'
import { useSidebarDispatch } from '../../../store/sidebarStore'
import { TilHeaderContentProps } from './TilHeaderContentProps'
import TilHeaderDesktop from './TilHeaderDesktop'
import TilHeaderMobile from './TilHeaderMobile'
import TilHeaderTablet from './TilHeaderTablet'

const TilHeader: React.FC = () => {
  const sidebarDispatch = useSidebarDispatch()
  const onMenuButtonClick = useCallback(() => {
    sidebarDispatch({ type: 'DRAWER_TOGGLED' })
  }, [sidebarDispatch])

  const props: TilHeaderContentProps = {
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
