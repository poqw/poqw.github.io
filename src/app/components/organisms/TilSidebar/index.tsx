import React, { useCallback } from 'react'

import { Desktop, Mobile, Tablet } from '../../../hoc/responsive'
import { useTilRootDirectory } from '../../../hooks/useTilRootDirectory'
import { useSidebarDispatch, useSidebarState } from '../../../store/sidebarStore'
import { TilSidebarContentProps } from './TilSidebarContentProps'
import TilSidebarDesktop from './TilSidebarDesktop'
import TilSidebarMobile from './TilSidebarMobile'
import TilSidebarTablet from './TilSidebarTablet'

const TilSidebar: React.FC = () => {
  const directory = useTilRootDirectory()
  const { isDrawerOpened } = useSidebarState()
  const sidebarDispatch = useSidebarDispatch()

  const toggleDrawer = useCallback(() => {
    sidebarDispatch({ type: 'DRAWER_TOGGLED' })
  }, [sidebarDispatch])

  const props: TilSidebarContentProps = {
    isDrawerOpened,
    toggleDrawer,
    directory
  }

  return (
    <>
      <Mobile>
        <TilSidebarMobile {...props} />
      </Mobile>
      <Tablet>
        <TilSidebarTablet {...props} />
      </Tablet>
      <Desktop>
        <TilSidebarDesktop {...props} />
      </Desktop>
    </>
  )
}

export default TilSidebar
