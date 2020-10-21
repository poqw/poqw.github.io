import { Router } from '@reach/router'
import { withPrefix } from 'gatsby-link'
import React from 'react'

import MainPage from '../app/pages/MainPage'
import { SidebarStoreProvider } from '../app/store/sidebarStore'
import NotFoundPage from './404'

const App: React.FC = () => (
  <SidebarStoreProvider>
    <Router>
      <MainPage path={withPrefix('/')} />
      <NotFoundPage default />
    </Router>
  </SidebarStoreProvider>
)

export default App
