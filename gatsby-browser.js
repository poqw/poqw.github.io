import React from 'react'

import { SidebarStoreProvider } from './src/app/store/sidebarStore'

// eslint-disable-next-line react/prop-types
export const wrapRootElement = ({ element }) => {
  return <SidebarStoreProvider>{element}</SidebarStoreProvider>
}
